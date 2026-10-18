import {configuredToken} from '../viewer/auth.js';
import assert from 'node:assert/strict';
import {spawn,type ChildProcess} from 'node:child_process';
import {once} from 'node:events';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {SandboxInstance} from '@blaxel/core';
import {GetVerificationResultOutputSchema,VerifyPatchOutputSchema,VerifyPatchInputSchema,hashTools} from '../src/core/index.js';
import {readMetadata} from '../src/tools/audit.js';
import {resolveRunId,sharedRunId} from '../src/blaxel/run-location.js';
process.loadEnvFile('.env');
const baselineHash='sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5';
const directory=resolve('scripts/results',`shared-runner-${new Date().toISOString().replaceAll(':','-')}`);await mkdir(directory,{recursive:true});
const save=async(name:string,data:unknown)=>writeFile(`${directory}/${name}.json`,JSON.stringify(data,null,2)+'\n');
let child:ChildProcess|undefined;let client:Client|undefined;
async function boot(){
 child=spawn(process.execPath,['--import','tsx','scripts/shared-local-server.ts'],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});
 const launched=child;let text='',errors='';launched.stderr!.on('data',chunk=>{errors+=chunk.toString();});const url=await new Promise<string>((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Local AX Lint startup timed out')),30000);launched.stdout!.on('data',chunk=>{text+=chunk.toString();const match=/AXLINT_READY (\S+)/.exec(text);if(match){clearTimeout(timer);resolve(match[1]!);}});launched.once('exit',code=>{clearTimeout(timer);let message=errors.slice(-4000);for(const[key,secret]of Object.entries(process.env))if(secret&&/KEY|TOKEN|SECRET/.test(key))message=message.replaceAll(secret,'<redacted>');reject(Error(`Local server exited ${code}: ${message}`));});});
 client=new Client({name:'shared-runner-restart-check',version:'1.0.0'});await client.connect(new StreamableHTTPClientTransport(new URL(url),{requestInit:{headers:{Authorization:`Bearer ${configuredToken()}`}}}));
 return{pid:launched.pid,url};
}
const launches:Array<{run_id:string;elapsed_ms:number;sandbox:string;directory:string}>=[];
try{
 const metadata=await readMetadata(process.env.TRACKR_URL!);assert.equal(hashTools(metadata.tools),baselineHash);
 const input=JSON.parse(await readFile('runner/evidence/corrected-input.json','utf8'));
 input.patch=JSON.parse(await readFile('viewer/fixtures/patch.json','utf8'));input.patch.base_server_version=metadata.server_version;
 VerifyPatchInputSchema.parse(input);
 const firstServer=await boot();await save('server-before',firstServer);
 for(let n=1;n<=2;n++){
  const start=performance.now();const response=await client!.callTool({name:'verify_patch',arguments:input},undefined,{timeout:120000});
  await save(`run-${n}-launch-wire`,response);assert(!response.isError,JSON.stringify(response.content));
  const queued=VerifyPatchOutputSchema.parse(response.structuredContent);const location=resolveRunId(queued.run_id)!;
  launches.push({...queued,elapsed_ms:performance.now()-start,sandbox:location.sandbox,directory:location.directory});
  console.log(`LAUNCH ${n}: ${queued.run_id}; ${launches.at(-1)!.elapsed_ms.toFixed(1)}ms`);
 }
 assert.equal(launches[0]!.sandbox,launches[1]!.sandbox);assert.notEqual(launches[0]!.directory,launches[1]!.directory);
 const sandbox=await SandboxInstance.get(launches[0]!.sandbox);
 const processes=await Promise.all(launches.map(run=>sandbox.process.get(resolveRunId(run.run_id)!.processName)));
 await save('running-before-restart',processes.map(p=>({status:p.status,pid:p.pid,startedAt:p.startedAt})));
 assert(processes.some(p=>p.status==='running'),'Restart must occur while a verification is active');
 child!.kill('SIGKILL');await once(child!,'exit');await client!.close().catch(()=>{});
 const secondServer=await boot();assert.notEqual(firstServer.pid,secondServer.pid);await save('server-after',secondServer);
 console.log('PASS AX Lint process killed mid-run and restarted with a new PID; Blaxel jobs continue independently');
 const results=[];
 for(let n=0;n<launches.length;n++){
  const run=launches[n]!;const deadline=Date.now()+15*60000;let poll=0;
  for(;;){
   const response=await client!.callTool({name:'get_verification_result',arguments:{run_id:run.run_id}});const state=GetVerificationResultOutputSchema.parse(response.structuredContent);await save(`run-${n+1}-poll-${++poll}`,response);
   if(state.status==='complete'){
    assert.equal(state.result.tasks.flatMap(t=>t.trials).length,24);assert.equal(state.result.config.baseline_tools_hash,baselineHash);assert.equal(state.result.config.model,process.env.AXLINT_MODEL);assert(!Object.hasOwn(state.result.config,'temperature'));
    const viewer=response._meta?.axlintViewer as {runId:string;fixture:boolean}|undefined;assert.equal(viewer?.runId,run.run_id);assert.equal(viewer?.fixture,false);
    for(const file of ['input','context','progress','result','lease'])await save(`run-${n+1}-${file}`,JSON.parse(await sandbox.fs.read(`${run.directory}/${file}.json`)));
    results.push({run_id:run.run_id,verdict:state.result.verdict,totals:state.result.totals,trials:24,widget_data:true});console.log(`RUN ${n+1} COMPLETE: ${state.result.verdict}; ${state.result.totals.baseline.passed}/12 → ${state.result.totals.candidate.passed}/12; 24 schema-valid trials`);break;
   }
   if(state.status==='failed'||state.status==='run_expired')throw Error(JSON.stringify(state));
   if(Date.now()>deadline)throw Error('Polling timeout; run remains retained');await new Promise(resolve=>setTimeout(resolve,1000));
  }
 }
 const madeUp=sharedRunId(launches[0]!.sandbox,'99999999-9999-4999-a999-999999999999');
 const missing=await client!.callTool({name:'get_verification_result',arguments:{run_id:madeUp}});assert.equal((missing.structuredContent as {status:string}).status,'run_expired');await save('missing-run',missing);
 const confirmation=await client!.callTool({name:'confirm_patch',arguments:{server_url:process.env.TRACKR_URL!,run_id:launches[0]!.run_id,expected_revision:'not-applied'}});await save('unapplied-confirmation',confirmation);assert.equal((confirmation.structuredContent as {error:string}).error,'revision_mismatch');
 const after=await readMetadata(process.env.TRACKR_URL!);assert.equal(hashTools(after.tools),baselineHash);assert.equal(after.server_version,metadata.server_version);
 const rows=[];for await(const s of await SandboxInstance.list({limit:100}))rows.push({name:s.metadata.name,shared:s.metadata.labels?.axlint_role==='shared-runner'});
 const summary={launches,results,restarted_mid_run:true,missing_run:'run_expired',unapplied_confirm:'revision_mismatch',workspace_sandboxes:rows.length,free_slots:Math.max(0,10-rows.length),pools:rows.filter(r=>r.shared),trackr:{version:after.server_version,tools_hash:hashTools(after.tools)},warm_launch_ms:launches[1]!.elapsed_ms,prior_hosted_launch_ms:[997.1,894.4,958.0]};
 await save('summary',summary);console.log(JSON.stringify(summary));console.log(`Evidence: ${directory}`);
}catch(error){let message=error instanceof Error?error.message:String(error);for(const[key,secret]of Object.entries(process.env))if(secret&&/KEY|TOKEN|SECRET/.test(key))message=message.replaceAll(secret,'<redacted>');await save('failed',{error:message,launches});console.error(message);console.error(`Evidence: ${directory}`);process.exitCode=1;}
finally{await client?.close().catch(()=>{});if(child&&child.exitCode===null)child.kill('SIGKILL');}
process.exit(process.exitCode??0);
