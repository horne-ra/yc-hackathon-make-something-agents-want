import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {providerTools,countStaticTokens} from '../../src/tools/audit.js';
import {ToolsSchema} from '../../src/core/index.js';
import {ROOT,SYSTEM,json,environment,save,hash,stable,provider,connect,redact,cleanError,countResponse,score,dispatchAllowed,validArguments} from './common.js';
const env=await environment(),repo=ROOT+'/../..',frozen=ROOT+'/frozen';
const manifest=await json(`${frozen}/hashes.json`);
for(const file of manifest.files){assert.equal(hash(await readFile(`${repo}/${file.path}`)),file.sha256,'Frozen artifact changed: '+file.path);execFileSync('git',['-C',repo,'ls-files','--error-unmatch',file.path]);execFileSync('git',['-C',repo,'diff','--quiet','HEAD','--',file.path]);}
execFileSync('git',['-C',repo,'ls-files','--error-unmatch','scripts/pophive/frozen/hashes.json']);execFileSync('git',['-C',repo,'diff','--quiet','HEAD','--','scripts/pophive/frozen/hashes.json']);
const frozenCommit=execFileSync('git',['-C',repo,'rev-parse','HEAD']).toString().trim();
execFileSync('git',['-C',repo,'merge-base','--is-ancestor',manifest.setup_registration_commit,frozenCommit]);
const r=await json(`${frozen}/registration.json`);assert.equal(r.status,'FROZEN_APPROVED');assert.equal(r.model_id,process.env.AXLINT_MODEL);
const baseline=ToolsSchema.parse(await json(`${frozen}/baseline-tools.json`)),candidate=ToolsSchema.parse(await json(`${frozen}/candidate-tools.json`));
assert.equal(baseline.length,7);assert.equal(r.trial_count,24);assert.equal(r.concurrency,1);
const out=`${ROOT}/run`;await mkdir(out,{recursive:false});
const report:any={status:'preflight',started_at:new Date().toISOString(),frozen_commit:frozenCommit,setup_registration_commit:manifest.setup_registration_commit,frozen_manifest_sha256:hash(await readFile(`${frozen}/hashes.json`)),model:r.model_id,system:SYSTEM,sampling:'provider default; temperature omitted',max_tokens:300,concurrency:1,tool_choice:'auto',trials:[],response_redactions:0};
await save(`${out}/result.json`,report);let c:any;
try{
 const p=provider();await save(`${out}/model-details.json`,redact(await p.models.retrieve(r.model_id),env).data);
 c=await connect(baseline,r.dispatch_allowlist,`${out}/requests.json`,env);
 const live=await c.list();assert.equal(stable(live.tools),stable(baseline),'Metadata drift invalidates freeze');
 report.static_tool_tokens={baseline:await countStaticTokens(baseline),candidate:await countStaticTokens(candidate),approximate:false};
 report.status='running';await save(`${out}/result.json`,report);
 for(let index=0;index<r.schedule.length;index++){
  const job=r.schedule[index],task=r.tasks.find((t:any)=>t.id===job.task_id);
  const row:any={index:index+1,...job,prompt:task.prompt,started_at:new Date().toISOString(),proposed_calls:[],selected_tool:null,arguments:null,routing_pass:false,passed:false,failure:null,dispatch:'not_attempted',executed:false,execution_status:'not_executed',model_attempts:1,result_tokens:null,result_token_status:'not_applicable',response_redactions:0};
  try{
   const message=await p.messages.create({model:r.model_id,system:SYSTEM,max_tokens:300,tool_choice:{type:'auto'},tools:providerTools(job.condition==='baseline'?baseline:candidate),messages:[{role:'user',content:task.prompt}]});
   const cleaned=redact(message,env);await save(`${out}/trial-${index+1}-model.json`,cleaned);
   row.model_redactions=cleaned.redactions;row.usage=message.usage;row.model_stop_reason=message.stop_reason;
   const calls=message.content.filter((b:any)=>b.type==='tool_use');row.proposed_calls=redact(calls,env).data;
   if(calls.length===0)row.failure='no_tool_call';
   else if(calls.length!==1){row.failure='multiple_tool_calls';row.dispatch='blocked_multiple_calls';}
   else{
    const call=calls[0]as any,tool=baseline.find(t=>t.name===call.name);row.selected_tool=call.name;row.arguments=redact(call.input,env).data;
    Object.assign(row,score(task,call.name,call.input));
    if(!dispatchAllowed(baseline,r.dispatch_allowlist,call.name)){row.routing_pass=false;row.failure='wrong_tool';row.dispatch='blocked';}
    else if(!validArguments(tool,call.input)){row.routing_pass=false;row.failure='bad_args';row.dispatch='blocked_invalid_arguments';}
    else{
     row.dispatch='allowed';row.executed=true;let response:any;
     try{response=await c.call(call.name,call.input);}catch(e){row.execution_status='transport_error';row.execution_error=cleanError(e,env);row.failure=row.failure??'infra';}
     if(response!==undefined){
      const clean=redact(response,env);assert.equal(redact(clean.data,env).redactions,0,'Secret scan not clear after redaction');
      row.response_redactions=clean.redactions;row.response_file=`trial-${index+1}-response.json`;await save(`${out}/${row.response_file}`,clean);
      row.response_sha256=hash(JSON.stringify(clean.data));row.result_is_error=!!response.isError;row.execution_status=response.isError?'mcp_error':'success';
      row.empty_content=Array.isArray(response.content)&&response.content.length===0;row.passed=row.routing_pass&&!response.isError;
      if(response.isError)row.failure=row.failure??'infra';
      try{row.result_tokens=await countResponse(p,r.model_id,clean.data);row.result_token_status='provider_countTokens';}
      catch(e){row.result_token_status='countTokens_failed';row.result_token_error=cleanError(e,env);}
     }
    }
   }
  }catch(e){row.failure=row.failure??'infra';row.error=cleanError(e,env);row.passed=false;}
  row.finished_at=new Date().toISOString();report.trials.push(row);report.response_redactions+=row.response_redactions;
  await save(`${out}/trial-${index+1}.json`,row);await save(`${out}/result.json`,report);
  console.log(JSON.stringify({completed:index+1,total:24,status:'trial_retained'}));
 }
 report.status='complete';report.finished_at=new Date().toISOString();await save(`${out}/result.json`,report);
}catch(e){report.status='blocked';report.error=cleanError(e,env);await save(`${out}/result.json`,report);process.exitCode=1;}
finally{if(c)await c.close().catch(()=>{});}
console.log(JSON.stringify({status:report.status,trials_retained:report.trials.length,evidence:'scripts/pophive/run/result.json'}));
