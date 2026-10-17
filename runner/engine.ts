import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { VerifyPatchInputSchema, VerificationResultSchema, TrialSchema, ToolsSchema, type Trial, type Tool, type Task, type Json } from '../src/core/contracts.js';
import { canonicalize, hashTools, hashJson, applyWireOps } from '../src/core/tools.js';
import { auditTools } from '../src/core/audit.js';
import { scoreTrial, explain, type ToolCall } from '../src/core/scoring.js';
import { summarizeCondition, representativeTrial, evaluateVerdict, provisionalLabel } from '../src/core/verdict.js';
export const SYSTEM = 'You are an assistant with access to an issue tracker. Use the available tools to help the user.';
export type ProgressFile = { status: 'queued'|'running'; updated_at: string; progress: {done:number;total:number}; trials: Array<{task_id:string;trial:Trial}> };
export type ResultFile = {status:'complete'; result:ReturnType<typeof VerificationResultSchema.parse>} | {status:'failed';error:{code:string;message:string}};
export interface RunFiles { progress(value:ProgressFile):Promise<void>; result(value:ResultFile):Promise<void> }
export function cleanError(error:unknown):string {
  let message = error instanceof Error ? error.message : String(error);
  for (const [key, value] of Object.entries(process.env)) if (value && /KEY|TOKEN|SECRET/.test(key)) message=message.replaceAll(value,'<redacted>');
  return message.slice(0,2000);
}
export function shuffle<T>(items:T[]):T[] {
  let state=173201;
  for(let i=items.length-1;i>0;i--){state=(Math.imul(1664525,state)+1013904223)>>>0;const j=Math.floor(state/2**32*(i+1));[items[i],items[j]]=[items[j]!,items[i]!];}
  return items;
}
export const providerTools=(tools:Tool[]):Anthropic.Tool[]=>tools.map(t=>({name:t.name,description:t.description??'',input_schema:t.inputSchema as Anthropic.Tool.InputSchema}));
export async function runVerification(raw:unknown,runId:string,files:RunFiles):Promise<void>{
  const records:Array<{task_id:string;trial:Trial}>=[];let total=0;let writes=Promise.resolve();
  const save=()=>{const snapshot:ProgressFile={status:'running',updated_at:new Date().toISOString(),progress:{done:records.length,total},trials:structuredClone(records)};writes=writes.then(()=>files.progress(snapshot));return writes;};
  const metadata=new Client({name:'axlint-verifier',version:'1.0.0'});
  try{
    const input=VerifyPatchInputSchema.parse(raw);total=input.tasks.tasks.length*input.trials*2;await save();
    const model=input.model==='default'?process.env.AXLINT_MODEL:input.model;
    if(!model)throw new Error('missing_model: Set AXLINT_MODEL to the pinned model ID');
    const provider=new Anthropic({apiKey:process.env.ANTHROPIC_API_KEY,maxRetries:0,timeout:60_000});
    await metadata.connect(new StreamableHTTPClientTransport(new URL(input.server_url)));
    const baseline=canonicalize(ToolsSchema.parse((await metadata.listTools()).tools));
    const serverVersion=metadata.getServerVersion()?.version;
    if(!serverVersion)throw new Error('missing_server_version: Target does not report serverInfo.version');
    if(hashTools(baseline)!==input.patch.base_tools_hash)throw new Error('stale_patch: Live tools/list differs from patch.base_tools_hash');
    const candidate=canonicalize(input.patch.candidate_tools);
    if(hashTools(candidate)!==input.patch.candidate_tools_hash)throw new Error('candidate_hash_mismatch: Stored candidate hash does not match');
    if(hashTools(applyWireOps(baseline,input.patch.wire_ops))!==input.patch.candidate_tools_hash)throw new Error('candidate_ops_mismatch: Candidate differs from validated description operations');
    const findings=auditTools(baseline);
    const countBase={model,system:SYSTEM,messages:[{role:'user' as const,content:'Count.'}]};
    const without=(await provider.messages.countTokens(countBase)).input_tokens;
    const staticCounts=await Promise.all([baseline,candidate].map(async tools=>(await provider.messages.countTokens({...countBase,tools:providerTools(tools)})).input_tokens-without));
    const jobs=shuffle(input.tasks.tasks.flatMap(task=>Array.from({length:input.trials},(_,n)=>n+1).flatMap(index=>(['baseline','candidate'] as const).map(condition=>({task,index,condition})))));
    let next=0;
    async function execute(task:Task,index:number,condition:'baseline'|'candidate'){
      const start=performance.now();let call:ToolCall|null=null;let infra:string|undefined;let inputTokens=0;let outputTokens=0;let resultTokens=0;let approximate=false;let modelText:string|null=null;
      const client=new Client({name:'axlint-trial',version:'1.0.0'});
      try{
        await client.connect(new StreamableHTTPClientTransport(new URL(input.server_url)));
        if(client.getServerVersion()?.version!==serverVersion||hashTools(ToolsSchema.parse((await client.listTools()).tools))!==input.patch.base_tools_hash)throw new Error('Target identity or metadata changed during verification');
        let response:Anthropic.Message|undefined;
        for(let attempt=0;attempt<3;attempt++)try{
          response=await provider.messages.create({model:model!,system:SYSTEM,max_tokens:300,tool_choice:{type:'auto'},tools:providerTools(condition==='baseline'?baseline:candidate),messages:[{role:'user',content:task.prompt}]});break;
        }catch(error){const status=(error as {status?:number}).status;if(attempt===2||(status!==429&&!(status&&status>=500)))throw error;await new Promise(r=>setTimeout(r,1000*2**attempt));}
        if(!response)throw new Error('Provider returned no response');
        inputTokens=response.usage.input_tokens;outputTokens=response.usage.output_tokens;
        const first=response.content.findIndex(block=>block.type==='tool_use');
        const text=response.content.slice(0,first===-1?undefined:first).filter(block=>block.type==='text').map(block=>block.type==='text'?block.text:'').join('\n');modelText=text||null;
        const block=response.content.find(block=>block.type==='tool_use');
        if(block?.type==='tool_use'){
          call={name:block.name,arguments:block.input as Record<string,Json>};
          const result=await client.callTool({name:call.name,arguments:call.arguments},undefined,{timeout:30_000});
          const text=JSON.stringify(result);
          try{resultTokens=(await provider.messages.countTokens({model:model!,messages:[{role:'user',content:text}]})).input_tokens;}catch{resultTokens=Math.ceil(text.length/4);approximate=true;}
        }
      }catch(error){infra=cleanError(error);}finally{await client.close().catch(()=>{});}
      const score=scoreTrial(task,call,infra);
      const trial=TrialSchema.parse({condition,index,...score,chosen_tool:call?.name??null,args:call?.arguments??{},explanation:explain(task,call,findings,infra),model_text:modelText,input_tokens:inputTokens,output_tokens:outputTokens,result_tokens:resultTokens,latency_ms:performance.now()-start,...(approximate?{result_tokens_approximate:true}:{})});
      records.push({task_id:task.id,trial});await save();
    }
    await Promise.all(Array.from({length:Math.min(4,jobs.length)},async()=>{while(next<jobs.length){const job=jobs[next++]!;await execute(job.task,job.index,job.condition);}}));
    const tasks=input.tasks.tasks.map(task=>{const trials=records.filter(row=>row.task_id===task.id).map(row=>row.trial).sort((a,b)=>a.condition.localeCompare(b.condition)||a.index-b.index);const before=trials.filter(t=>t.condition==='baseline'),after=trials.filter(t=>t.condition==='candidate');return{id:task.id,control:task.control,baseline:summarizeCondition(before),candidate:summarizeCondition(after),representative:{baseline_trial:representativeTrial(before),candidate_trial:representativeTrial(after)},trials};});
    const totals=(condition:'baseline'|'candidate')=>{const trials=records.map(r=>r.trial).filter(t=>t.condition===condition);return{passed:trials.filter(t=>t.passed).length,of:trials.filter(t=>t.failure!=='infra').length,result_tokens:trials.reduce((n,t)=>n+t.result_tokens,0)};};
    const result=VerificationResultSchema.parse({run_id:runId,provisional:true,label:provisionalLabel(input.trials),config:{model,trials:input.trials,server_version:serverVersion,tasks_hash:hashJson(input.tasks as unknown as Json),baseline_tools_hash:hashTools(baseline),candidate_tools_hash:hashTools(candidate)},candidate_tools:candidate,static_tool_tokens:{baseline:staticCounts[0],candidate:staticCounts[1]},tasks,totals:{baseline:totals('baseline'),candidate:totals('candidate')},...evaluateVerdict(tasks)});
    await writes;await files.result({status:'complete',result});
  }catch(error){await writes;const message=cleanError(error);await files.result({status:'failed',error:{code:/^([a-z_]+):/.exec(message)?.[1]??'runner_error',message}});}finally{await metadata.close().catch(()=>{});}
}
