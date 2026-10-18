import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {providerTools,countStaticTokens} from '../../src/tools/audit.js';
import {ToolsSchema} from '../../src/core/index.js';
import {ROOT,REPO,BASELINE,CANDIDATE,ALLOW,SYSTEM,json,environment,save,hash,stable,provider,connect,redact,cleanError,countCompleteResponse,score,inspectResponse,trialSpacing,trialFinished,withinDeadline,verifyVendor} from './common.js';
const env=await environment(),manifest=await json(`${ROOT}/frozen/hashes.json`),r=await json(`${ROOT}/frozen/registration.json`);
assert.equal(r.status,'FROZEN_APPROVED');assert.equal(r.model_id,process.env.AXLINT_MODEL);withinDeadline();await verifyVendor();
for(const f of manifest.files){assert.equal(hash(await readFile(`${REPO}/${f.path}`)),f.sha256,'Frozen file changed: '+f.path);if(!f.path.startsWith('vendor/')){execFileSync('git',['-C',REPO,'ls-files','--error-unmatch',f.path]);execFileSync('git',['-C',REPO,'diff','--quiet','HEAD','--',f.path]);}}
execFileSync('git',['-C',REPO,'ls-files','--error-unmatch','scripts/yfinance/frozen/hashes.json']);execFileSync('git',['-C',REPO,'diff','--quiet','HEAD','--','scripts/yfinance/frozen/hashes.json']);
const commit=execFileSync('git',['-C',REPO,'rev-parse','HEAD']).toString().trim();execFileSync('git',['-C',REPO,'merge-base','--is-ancestor',r.setup_registration_commit,commit]);
const baseline=ToolsSchema.parse(await json(`${ROOT}/frozen/baseline-tools.json`)),candidate=ToolsSchema.parse(await json(`${ROOT}/frozen/candidate-tools.json`));
const out=`${ROOT}/run`;await mkdir(out,{recursive:false});
const report:any={status:'preflight',started_at:new Date().toISOString(),deadline:r.deadline,frozen_commit:commit,setup_registration_commit:r.setup_registration_commit,manifest_sha256:hash(await readFile(`${ROOT}/frozen/hashes.json`)),source_pin:r.source.commit,model:r.model_id,system:SYSTEM,date_context:r.date_context,sampling:'provider default; temperature omitted',max_tokens:300,tool_choice:'auto',concurrency:1,trials:[],response_redactions:0};
await save(`${out}/result.json`,report);
try{
 const p=provider();await save(`${out}/model-details.json`,redact(await p.models.retrieve(r.model_id),env).data);
 report.static_tool_tokens={baseline:await countStaticTokens(baseline),candidate:await countStaticTokens(candidate),approximate:false};report.status='running';await save(`${out}/result.json`,report);
 for(let i=0;i<r.schedule.length;i++){
  await trialSpacing();const job=r.schedule[i],task=r.tasks.find((t:any)=>t.id===job.task_id),dir=job.condition==='baseline'?BASELINE:CANDIDATE,expected=job.condition==='baseline'?baseline:candidate;
  const row:any={index:i+1,...job,prompt:task.prompt,date_context:r.date_context,started_at:new Date().toISOString(),model_attempts:0,proposed_calls:[],selected_tool:null,arguments:null,dispatch:'not_attempted',executed:false,routing_pass:false,passed:false,failure:null,execution_status:'not_executed',result_token_status:'not_applicable',result_tokens:null,response_redactions:0};let c:any;
  try{
   c=await connect(dir,`${out}/trial-${i+1}-process`,env,'trial');row.process_pid=c.pid;assert.equal(stable(c.tools),stable(expected),'Live tools/list drift');
   withinDeadline();row.model_attempts=1;
   const message=await p.messages.create({model:r.model_id,system:SYSTEM,max_tokens:300,tool_choice:{type:'auto'},tools:providerTools(expected),messages:[{role:'user',content:[{type:'text',text:task.prompt},{type:'text',text:r.date_context}]}]});
   const clean=redact(message,env);await save(`${out}/trial-${i+1}-model.json`,clean);row.model_redactions=clean.redactions;row.usage=message.usage;row.model_stop_reason=message.stop_reason;
   const calls=message.content.filter((b:any)=>b.type==='tool_use');row.proposed_calls=redact(calls,env).data;
   if(calls.length===0)row.failure='no_tool_call';
   else if(calls.length!==1){row.failure='multiple_tool_calls';row.dispatch='blocked_multiple_calls';}
   else{
    const call=calls[0]as any;row.selected_tool=call.name;row.arguments=redact(call.input,env).data;Object.assign(row,score(task,call.name,call.input));
    const tool=expected.find(t=>t.name===call.name);
    if(!tool||!ALLOW.includes(call.name)||(tool.annotations as any)?.destructiveHint===true){row.dispatch='blocked';row.routing_pass=false;row.failure='wrong_tool';}
    else{
     row.dispatch='allowed';row.executed=true;let response:any;
     try{response=await c.call(call.name,call.input);}catch(e){row.execution_status='transport_error';row.execution_error=cleanError(e,env);row.failure=row.failure??'infra';}
     if(response!==undefined){
      const cleaned=redact(response,env);assert.equal(redact(cleaned.data,env).redactions,0,'Redaction verification failed');row.response_redactions=cleaned.redactions;
      row.response_file=`trial-${i+1}-response.json`;row.response_sha256=hash(JSON.stringify(cleaned.data));await save(`${out}/${row.response_file}`,cleaned);
      row.observed=inspectResponse(cleaned.data);row.execution_status=row.observed.mcp_is_error?'mcp_error':row.observed.server_text_error?'server_text_error':'success';
      row.passed=row.routing_pass&&row.execution_status==='success';if(row.execution_status!=='success')row.failure=row.failure??'infra';
      try{row.result_tokens=await countCompleteResponse(p,r.model_id,cleaned.data);row.result_token_status='provider_countTokens';}catch(e){row.result_token_status='countTokens_failed';row.result_token_error=cleanError(e,env);}
     }
    }
   }
  }catch(e){row.failure=row.failure??'infra';row.error=cleanError(e,env);row.passed=false;}
  finally{if(c)await c.close();row.finished_at=new Date().toISOString();trialFinished();}
  report.trials.push(row);report.response_redactions+=row.response_redactions;await save(`${out}/trial-${i+1}.json`,row);await save(`${out}/result.json`,report);
  console.log(JSON.stringify({completed:i+1,total:24,status:'trial_retained'}));
 }
 report.status='complete';report.finished_at=new Date().toISOString();await save(`${out}/result.json`,report);
}catch(e){report.status='blocked_or_timeboxed';report.error=cleanError(e,env);report.finished_at=new Date().toISOString();await save(`${out}/result.json`,report);process.exitCode=1;}
console.log(JSON.stringify({status:report.status,trials:report.trials.length,evidence:'scripts/yfinance/run/result.json'}));
