import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {ROOT,environment,json,save,connect,stable,redact,provider,countResponse,cleanError} from './common.js';
const env=await environment(),r=await json(`${ROOT}/preregistration.json`);
assert.equal(r.status,'SETUP_AUTHORIZED_TRIALS_REQUIRE_FROZEN_COMMIT');
const repo=ROOT+'/../..';
const changes=execFileSync('git',['-C',repo,'status','--porcelain','--','scripts/pophive','docs/pophive-preregistration.md']).toString();assert.equal(changes,'','Setup registration and source must be committed before calls');
const registrationCommit=execFileSync('git',['-C',repo,'rev-parse','HEAD']).toString().trim();
await mkdir(`${ROOT}/setup`,{recursive:false});
const metadata=await json(`${ROOT}/baseline-metadata.json`);
const report:any={status:'running',registration_commit:registrationCommit,started_at:new Date().toISOString(),experiment:'One paired setup experiment, two calls, no retries.',model:r.model_id,calls:[]};
await save(`${ROOT}/setup/result.json`,report);let c:any;
try{
 c=await connect(metadata.tools,['get_current_status'],`${ROOT}/setup/requests.json`,env,true);
 const live=await c.list();assert.equal(stable(live.tools),stable(metadata.tools),'Metadata drift before setup');
 for(let i=0;i<r.setup.calls.length;i++){
  const plan=r.setup.calls[i],record:any={...plan,started_at:new Date().toISOString()};
  try{const response=redact(await c.call(plan.tool,plan.arguments),env);record.response_file=`response-${i+1}.json`;record.redactions=response.redactions;record.is_error=!!response.data.isError;await save(`${ROOT}/setup/${record.response_file}`,response);}
  catch(e){record.error=cleanError(e,env);}
  report.calls.push(record);await save(`${ROOT}/setup/result.json`,report);
 }
 assert.equal(report.calls.length,2);assert(report.calls.every((x:any)=>x.response_file&&!x.is_error),'Anonymous setup execution failed; do not add calls');
 const p=provider();
 for(const record of report.calls){const response=await json(`${ROOT}/setup/${record.response_file}`);try{record.tokens=await countResponse(p,r.model_id,response.data);}catch(e){record.count_error=cleanError(e,env);}await save(`${ROOT}/setup/result.json`,report);}
 const withChart=report.calls[0].tokens,withoutChart=report.calls[1].tokens;
 assert(withChart&&withoutChart,'Setup token counts unavailable');assert(withChart.images.length>0,'With-chart setup returned no image; hypothesis not confirmed');assert.equal(withoutChart.images.length,0,'Without-chart setup unexpectedly returned an image');
 report.measured_image_tokens=withChart.image_tokens;report.patch_about_n_tokens=Math.round(withChart.image_tokens/10)*10;
 report.non_image_text_difference=withChart.text_tokens-withoutChart.text_tokens;report.total_difference=withChart.total_tokens-withoutChart.total_tokens;
 report.status='complete';report.finished_at=new Date().toISOString();await save(`${ROOT}/setup/result.json`,report);
 console.log(JSON.stringify({status:'setup_complete',calls:2,image_tokens:report.measured_image_tokens,rounded_patch_tokens:report.patch_about_n_tokens,text_tokens:report.calls.map((x:any)=>x.tokens.text_tokens)}));
}catch(e){report.status='blocked';report.error=cleanError(e,env);await save(`${ROOT}/setup/result.json`,report);console.log(JSON.stringify({status:'setup_blocked',evidence:'scripts/pophive/setup/result.json'}));process.exitCode=1;}
finally{if(c)await c.close().catch(()=>{});}
