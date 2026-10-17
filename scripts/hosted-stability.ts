import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { AuditSchema, PatchSpecSchema, VerifyPatchInputSchema, VerifyPatchOutputSchema, GetVerificationResultOutputSchema, TasksSchema, hashTools, ToolsSchema, type Trial } from '../src/core/index.js';

process.loadEnvFile('.env');
const endpoint='https://fast-pulse-rlqvb.run.mcp-use.com/mcp';
const target=process.env.TRACKR_URL!;
assert.equal(target,'https://trackr-production-e1a6.up.railway.app/mcp');
assert.equal(process.env.AXLINT_MODEL,'claude-sonnet-5-5');
const baselineVersion='trackr-demo-001@f9b6c2beae2ec8c5774a7b902349618052582f2f';
const baselineHash='sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5';
const directory=resolve('scripts/results',`hosted-stability-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(directory,{recursive:true});
const redact=(text:string)=>Object.entries(process.env).reduce((value,[key,secret])=>secret&&/KEY|TOKEN|SECRET/.test(key)?value.replaceAll(secret,'[redacted]'):value,text);
const save=async(name:string,data:unknown)=>writeFile(`${directory}/${name}.json`,redact(JSON.stringify(data,null,2))+'\n');
const client=new Client({name:'axlint-hosted-stability',version:'1.0.0'});
async function baselineCheck(label:string){
 const connection=new Client({name:'axlint-stability-baseline',version:'1.0.0'});
 try{
  await connection.connect(new StreamableHTTPClientTransport(new URL(target)));
  const tools=ToolsSchema.parse((await connection.listTools()).tools);
  assert.equal(connection.getServerVersion()?.version,baselineVersion);
  assert.equal(hashTools(tools),baselineHash);
  await save(label,{server_version:connection.getServerVersion(),tools_hash:hashTools(tools),tools});
 }finally{await connection.close();}
}
async function call(name:string,args:Record<string,unknown>,label:string){
 const started=performance.now();
 const response=await client.callTool({name,arguments:args},undefined,{timeout:120000});
 const elapsed_ms=performance.now()-started;
 await save(label,{tool:name,arguments:args,elapsed_ms,response});
 if(response.isError)throw new Error(`${label} failed: ${JSON.stringify(response.content)}`);
 return {response,data:response.structuredContent,elapsed_ms};
}
function consistency(trials:Trial[]){
 const stable=(value:unknown):unknown=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,stable(v)])):value;
 return (['baseline','candidate'] as const).map(condition=>{
  const rows=trials.filter(t=>t.condition===condition);
  return {condition,call_disagreement:new Set(rows.map(t=>JSON.stringify(stable({tool:t.chosen_tool,args:t.args})))).size>1,outcome_disagreement:new Set(rows.map(t=>JSON.stringify({passed:t.passed,failure:t.failure}))).size>1,result_token_disagreement:new Set(rows.map(t=>t.result_tokens)).size>1};
 });
}
const completed:unknown[]=[];
try{
 await baselineCheck('baseline-before');
 await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${process.env.AXLINT_API_TOKEN}`}}}));
 const tools=(await client.listTools()).tools;
 assert.equal(client.getServerVersion()?.version,'0.3.0');
 assert.deepEqual(tools.map(t=>t.name).sort(),['audit_server','propose_patch','verify_patch','get_verification_result','confirm_patch','ping','preview_run'].sort());
 assert.ok(tools.find(t=>t.name==='get_verification_result')?._meta);
 await save('hosted-tools',{server_version:client.getServerVersion(),tools});
 const ping=await call('ping',{},'hosted-ping');
 assert.equal((ping.data as {message:string}).message,'pong: all platform checks passed');
 const noAuth=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','accept':'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'no-auth-stability',version:'1.0.0'}}})});
 assert.equal(noAuth.status,401);assert.equal(noAuth.headers.get('www-authenticate'),null);await noAuth.body?.cancel();
 await save('hosted-auth',{unauthenticated_status:401,www_authenticate:null});
 console.log('PASS hosted main: version0.3.0; all seven tools; authenticated ping; missing bearer401 without OAuth header');
 const previous=JSON.parse(await readFile('runner/evidence/corrected-input.json','utf8'));
 const tasks=TasksSchema.parse(previous.tasks);
 const source_files=['src/tools.ts','src/validation.ts','src/handlers.ts'].map(path=>({path,content:execFileSync('git',['show',`f9b6c2beae2ec8c5774a7b902349618052582f2f:${path}`],{cwd:'/Users/ransomhorne/Documents/trackr',encoding:'utf8'})}));
 for(let index=1;index<=3;index++){
  await baselineCheck(`run-${index}-baseline`);
  const audit=AuditSchema.parse((await call('audit_server',{server_url:target},`run-${index}-audit`)).data);
  assert.deepEqual(audit.findings.slice(0,3).map(f=>f.kind),['sibling_overlap','unconstrained_string','payload_control_undocumented']);
  const finding_ids=audit.findings.slice(0,3).map(f=>f.id);
  const patch=PatchSpecSchema.parse((await call('propose_patch',{audit,source_files,finding_ids,style:'compact'},`run-${index}-proposal`)).data);
  const input=VerifyPatchInputSchema.parse({server_url:target,patch,tasks,trials:3,model:'default'});
  const launch=await call('verify_patch',input,`run-${index}-launch`);
  const queued=VerifyPatchOutputSchema.parse(launch.data);
  console.log(`RUN ${index}: ${patch.wire_ops.length} proposed ops; queued ${queued.run_id}; launch ${launch.elapsed_ms.toFixed(1)}ms`);
  const deadline=Date.now()+12*60000;
  let poll=0,lastProgress=-1;
  for(;;){
   if(Date.now()>deadline)throw new Error(`RUN ${index} timed out; retained run ${queued.run_id}`);
   const frame=await call('get_verification_result',{run_id:queued.run_id},`run-${index}-poll-${++poll}`);
   const state=GetVerificationResultOutputSchema.parse(frame.data);
   if(state.progress?.done!==lastProgress){lastProgress=state.progress?.done??-1;console.log(`RUN ${index}: ${state.status} ${state.progress?.done??0}/${state.progress?.total??24}`);}
   if(state.status==='failed'||state.status==='run_expired')throw new Error(`RUN ${index} ${state.status}: ${JSON.stringify(state)}`);
   if(state.status==='complete'){
    const result=state.result;
    assert.equal(result.config.model,'claude-sonnet-5-5');assert.equal(result.config.temperature,undefined);
    assert.equal(result.config.server_version,baselineVersion);assert.equal(result.config.baseline_tools_hash,baselineHash);
    assert.equal(result.tasks.reduce((n,t)=>n+t.trials.length,0),24);
    const viewer=frame.response._meta?.axlintViewer as {fixture:boolean;auditAvailable:boolean;patchAvailable:boolean;confirmationAvailable:boolean;progress:{done:number;total:number};tasks:Array<{prompt:string}>}|undefined;
    assert.ok(viewer,'Real run viewer metadata is present');assert.equal(viewer.fixture,false);assert.equal(viewer.auditAvailable,true);assert.equal(viewer.patchAvailable,true);assert.equal(viewer.confirmationAvailable,false);assert.deepEqual(viewer.progress,{done:24,total:24});
    assert.ok(viewer.tasks.every(t=>!t.prompt.startsWith('Prompt was not saved')));
    const record={index,run_id:queued.run_id,wire_ops:patch.wire_ops,launch_ms:launch.elapsed_ms,verdict:result.verdict,totals:result.totals,static_tool_tokens:result.static_tool_tokens,task_summary:result.tasks.map(t=>({id:t.id,baseline:t.baseline,candidate:t.candidate,consistency:consistency(t.trials)})),real_context_widget:true};
    completed.push(record);await save(`run-${index}-summary`,record);await save('summary',{endpoint,model:'claude-sonnet-5-5',completed});
    console.log(`RUN ${index} COMPLETE: ${result.verdict}; passes ${result.totals.baseline.passed}/${result.totals.baseline.of} → ${result.totals.candidate.passed}/${result.totals.candidate.of}; result tokens ${result.totals.baseline.result_tokens} → ${result.totals.candidate.result_tokens}; static ${result.static_tool_tokens.baseline} → ${result.static_tool_tokens.candidate}; fresh real context widget PASS`);
    break;
   }
   await new Promise(resolve=>setTimeout(resolve,3000));
  }
 }
 await baselineCheck('baseline-after');
 await save('complete',{status:'complete',completed,trackr_remains_baseline:true,source_applied:false});
 console.log(`PASS three sequential hosted propose/verify runs; Trackr remains baseline. Evidence: ${directory}`);
}catch(error){const message=redact(error instanceof Error?error.message:String(error));await save('blocked',{status:'blocked',error:message,completed});console.error(message);console.error(`Evidence retained: ${directory}`);process.exitCode=1;}
finally{await client.close().catch(()=>{});}
