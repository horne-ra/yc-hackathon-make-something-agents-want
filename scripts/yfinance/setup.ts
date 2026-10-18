import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {ROOT,REPO,BASELINE,environment,json,save,connect,provider,redact,cleanError,inspectResponse,countCompleteResponse,stable,trialSpacing,trialFinished} from './common.js';
const env=await environment(),r=await json(`${ROOT}/preregistration.json`);
assert.equal(r.status,'SETUP_AUTHORIZED_TRIALS_REQUIRE_FROZEN_COMMIT');
assert.equal(execFileSync('git',['-C',REPO,'status','--porcelain','--','scripts/yfinance','docs/yfinance-preregistration.md']).toString(),'','Registration/setup source must be committed first');
await mkdir(`${ROOT}/setup`,{recursive:false});
const commit=execFileSync('git',['-C',REPO,'rev-parse','HEAD']).toString().trim();const tools=(await json(`${ROOT}/baseline-metadata.json`)).tools;
const plans=[{id:'unknown-arguments',...r.setup.probe},...r.setup.cost_calls.map((x:any,i:number)=>({id:i===0?'daily-5y':'monthly-5y',...x}))];
const report:any={status:'running',registration_commit:commit,started_at:new Date().toISOString(),calls:[],target_calls_planned:3};await save(`${ROOT}/setup/result.json`,report);
try{
 for(const plan of plans){await trialSpacing();let c:any;const row:any={id:plan.id,tool:plan.tool,arguments:plan.arguments,started_at:new Date().toISOString()};
  try{c=await connect(BASELINE,`${ROOT}/setup/${plan.id}`,env,'setup',{name:plan.tool,arguments:plan.arguments});assert.equal(stable(c.tools),stable(tools),'Metadata drift');row.process_pid=c.pid;
   const clean=redact(await c.call(plan.tool,plan.arguments),env);row.response_file=`${plan.id}/response.json`;row.redactions=clean.redactions;row.observed=inspectResponse(clean.data);await save(`${ROOT}/setup/${row.response_file}`,clean);
  }catch(e){row.error=cleanError(e,env);}finally{if(c)await c.close();row.finished_at=new Date().toISOString();trialFinished();}
  report.calls.push(row);await save(`${ROOT}/setup/result.json`,report);
 }
 const probe=report.calls[0];assert(probe.response_file,'Unknown-argument setup produced no response');
 report.unknown_argument_behavior=probe.observed.mcp_is_error||probe.observed.server_text_error?'error':'accepted_without_error';
 if(report.unknown_argument_behavior==='accepted_without_error')report.unknown_argument_interpretation='The function signature has no start/end; the pinned MCP/Pydantic argument model accepts the payload and drops extras. Compare observed dates with requested Q1 dates; the supplied 1mo period remains in effect. This is silent ignore, not working date-range support.';
 const p=provider();
 for(const row of report.calls){if(row.response_file){const response=await json(`${ROOT}/setup/${row.response_file}`);try{row.token_count=await countCompleteResponse(p,r.model_id,response.data);}catch(e){row.token_count_error=cleanError(e,env);}}await save(`${ROOT}/setup/result.json`,report);}
 const costs=report.calls.slice(1);assert(costs.every((x:any)=>x.response_file&&x.token_count&&x.observed.rows>0&&!x.observed.mcp_is_error&&!x.observed.server_text_error),'Cannot claim row/token comparison from empty or error data');
 report.status='complete';report.finished_at=new Date().toISOString();await save(`${ROOT}/setup/result.json`,report);
 console.log(JSON.stringify({status:'setup_complete',unknown_arguments:report.unknown_argument_behavior,cost_examples:costs.map((x:any)=>({interval:x.arguments.interval,rows:x.observed.rows,tokens:x.token_count.tokens}))}));
}catch(e){report.status='blocked';report.error=cleanError(e,env);await save(`${ROOT}/setup/result.json`,report);console.log(JSON.stringify({status:'setup_blocked',details:'scripts/yfinance/setup/result.json'}));process.exitCode=1;}
