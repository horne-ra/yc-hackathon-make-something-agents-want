import { SandboxInstance } from '@blaxel/core';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { VerifyPatchInputSchema, VerifyPatchOutputSchema, GetVerificationResultOutputSchema, VerificationResultSchema } from '../core/contracts.js';
import { runnerPayloadBase64 } from '../../runner/payload.js';
import { cleanError, type ProgressFile, type ResultFile } from '../../runner/engine.js';
import { ensureRunCapacity, RUN_TTL, RUN_DEADLINE_MS } from './retention.js';
import { runStartError } from './errors.js';
export const RUN_DIRECTORY='/app/axlint-run';
export const RUN_PROCESS='axlint-verification';
export type GetVerificationResultOutput=z.infer<typeof GetVerificationResultOutputSchema>;
import {resolveRunId} from './run-location.js';
import {reserveSharedRun} from './shared-pool.js';
export async function startPerRun(raw:unknown):Promise<z.infer<typeof VerifyPatchOutputSchema>>{
  const input=VerifyPatchInputSchema.parse(raw);
  for(const key of ['BL_API_KEY','BL_WORKSPACE','ANTHROPIC_API_KEY','AXLINT_MODEL'])if(!process.env[key])throw new Error(`Missing ${key} configuration`);
  try {
  await ensureRunCapacity();
  const creationStarted=Date.now();
  const name=`axlint-run-${randomUUID()}`;
  // Bound the whole launch/run interval, preserving >2h after completion.
  // IDs are unique UUIDs, so create directly avoids an unnecessary lookup.
  const sandbox=await SandboxInstance.create({name,image:'blaxel/base-image:latest',memory:256,ttl:RUN_TTL,region:process.env.BL_REGION||'us-pdx-1',labels:{project:'axlint',purpose:'verification'}});
  await sandbox.fs.writeTree([{path:'runner.b64',content:runnerPayloadBase64},{path:'input.json',content:JSON.stringify(input)},{path:'progress.json',content:JSON.stringify({status:'queued',updated_at:new Date().toISOString(),progress:{done:0,total:input.tasks.tasks.length*input.trials*2},trials:[]})}],RUN_DIRECTORY);
  const bootstrap=`import {readFileSync,writeFileSync} from "node:fs"; import {gunzipSync} from "node:zlib"; const deadline=${creationStarted+RUN_DEADLINE_MS};if(Date.now()>=deadline)throw new Error("run_deadline_exceeded: sandbox preparation exceeded the retention-safe deadline");setTimeout(()=>process.exit(124),deadline-Date.now()).unref();const path="${RUN_DIRECTORY}";writeFileSync(path+"/runner.mjs",gunzipSync(Buffer.from(readFileSync(path+"/runner.b64","utf8"),"base64")));process.argv=[process.argv[0],path+"/runner.mjs",path+"/input.json","${name}",path];await import("file://"+path+"/runner.mjs");`;
  const timeout=Math.floor((creationStarted+RUN_DEADLINE_MS-Date.now())/1000);
  if(timeout<1)throw new Error('Sandbox preparation exceeded the run deadline');
  await sandbox.process.exec({name:RUN_PROCESS,command:`node --input-type=module -e '${bootstrap}'`,waitForCompletion:false,keepAlive:true,timeout,env:{ANTHROPIC_API_KEY:process.env.ANTHROPIC_API_KEY!,AXLINT_MODEL:process.env.AXLINT_MODEL!}});
  return VerifyPatchOutputSchema.parse({run_id:name,status:'queued',total_trials:input.tasks.tasks.length*input.trials*2});
  }catch(error){throw runStartError(error);}
}
export async function startRun(raw:unknown):Promise<z.infer<typeof VerifyPatchOutputSchema>>{
 if(process.env.AXLINT_RUNNER_MODE==='per-run')return startPerRun(raw);
 const input=VerifyPatchInputSchema.parse(raw);
 for(const key of ['BL_API_KEY','BL_WORKSPACE','ANTHROPIC_API_KEY','AXLINT_MODEL'])if(!process.env[key])throw new Error(`Missing ${key} configuration`);
 let reservation:Awaited<ReturnType<typeof reserveSharedRun>>|undefined;let executionRequested=false;
 try{
  reservation=await reserveSharedRun();
  const {sandbox,run_id,location}=reservation;
  const directory=location.directory;
  await sandbox.fs.writeTree([{path:'runner.b64',content:runnerPayloadBase64},{path:'input.json',content:JSON.stringify(input)},{path:'progress.json',content:JSON.stringify({status:'queued',updated_at:new Date().toISOString(),progress:{done:0,total:input.tasks.tasks.length*input.trials*2},trials:[]})}],directory);
  const bootstrap=`import {readFileSync,writeFileSync,renameSync} from "node:fs";import{gunzipSync}from"node:zlib";const path="${directory}";const save=(name,value)=>{writeFileSync(path+"/"+name+".tmp",JSON.stringify(value));renameSync(path+"/"+name+".tmp",path+"/"+name)};const lease=JSON.parse(readFileSync(path+"/lease.json","utf8"));lease.status="running";lease.pid=process.pid;save("lease.json",lease);const finish=(status)=>{lease.status=status;lease.completed_at=new Date().toISOString();save("lease.json",lease)};const timer=setTimeout(()=>{save("result.json",{status:"failed",error:{code:"runner_timeout",message:"Verification exceeded the fourteen-minute execution deadline"}});finish("failed");process.exit(124)},840000);timer.unref();try{writeFileSync(path+"/runner.mjs",gunzipSync(Buffer.from(readFileSync(path+"/runner.b64","utf8"),"base64")));process.argv=[process.argv[0],path+"/runner.mjs",path+"/input.json","${run_id}",path];await import("file://"+path+"/runner.mjs");finish(JSON.parse(readFileSync(path+"/result.json","utf8")).status)}catch{save("result.json",{status:"failed",error:{code:"shared_runner_error",message:"The isolated verification process failed; its progress files remain available"}});finish("failed");process.exitCode=1}finally{clearTimeout(timer)}`;
  executionRequested=true;
  await sandbox.process.exec({name:location.processName,command:`node --input-type=module -e '${bootstrap}'`,waitForCompletion:false,keepAlive:true,timeout:900,env:{ANTHROPIC_API_KEY:process.env.ANTHROPIC_API_KEY!,AXLINT_MODEL:process.env.AXLINT_MODEL!}});
  return VerifyPatchOutputSchema.parse({run_id,status:'queued',total_trials:input.tasks.tasks.length*input.trials*2});
 }catch(error){
  const named=runStartError(error);
  if(reservation){
   const {sandbox,run_id,location}=reservation;let safeToFail=!executionRequested;
   if(executionRequested)try{
    const p=await sandbox.process.get(location.processName);
    if(p.status==='running'||p.status==='completed')return VerifyPatchOutputSchema.parse({run_id,status:'queued',total_trials:input.tasks.tasks.length*input.trials*2});
    safeToFail=true;
   }catch(probe){safeToFail=statusCode(probe)===404||/not found|status 404/i.test(cleanError(probe));}
   if(safeToFail)try{
    const lease=JSON.parse(await sandbox.fs.read(`${location.directory}/lease.json`));
    lease.status='failed';lease.completed_at=new Date().toISOString();
    await sandbox.fs.writeTree([{path:'lease.json',content:JSON.stringify(lease)},{path:'result.json',content:JSON.stringify({status:'failed',error:{code:named.code,message:named.message}})}],location.directory);
   }catch{/* Unreachable evidence remains protected; preserve the original diagnostic. */}
   named.message+=` Retained run ID: ${run_id}.`;
  }
  throw named;
 }
}
function statusCode(error:unknown):number|undefined{const value=error as {status?:number;statusCode?:number;status_code?:number;code?:number};return value?.status??value?.statusCode??value?.status_code??value?.code;}
export async function readRun(runId:string):Promise<GetVerificationResultOutput>{
  const location=resolveRunId(runId);
  if(!location)return{status:'run_expired',error:{code:'run_not_found',message:'Run ID is invalid or no longer exists; start a new verification run'}};
  let sandbox:SandboxInstance;
  try{sandbox=await SandboxInstance.get(location.sandbox);}catch(error){return !location.shared&&statusCode(error)===404?{status:'run_expired',error:{code:'run_not_found',message:'Sandbox no longer exists; re-run verify_patch'}}:{status:'run_unavailable',error:{code:'sandbox_unreachable',message:cleanError(error)}};}
  if(['TERMINATED','TERMINATING','DELETING','FAILED'].includes(sandbox.status??''))return location.shared?{status:'run_unavailable',error:{code:'sandbox_lost',message:'The shared sandbox is unavailable; runs in a lost sandbox are gone. New verification runs recreate a runner.'}}:{status:'run_expired',error:{code:'sandbox_expired',message:'Sandbox has expired; re-run verify_patch'}};
  try{
    const listing=await sandbox.fs.ls(location.directory);const names=new Set(listing.files?.map(file=>file.name));
    if(names.has('result.json')){
      const file=JSON.parse(await sandbox.fs.read(`${location.directory}/result.json`)) as ResultFile;
      if(file.status==='failed')return GetVerificationResultOutputSchema.parse({status:'failed',error:file.error});
      const result=VerificationResultSchema.parse(file.result);const total=result.tasks.reduce((n,t)=>n+t.trials.length,0);
      return{status:'complete',progress:{done:total,total},result};
    }
    if(!names.has('progress.json'))return{status:'queued'};
    const file=JSON.parse(await sandbox.fs.read(`${location.directory}/progress.json`)) as ProgressFile;
    const age=Date.now()-Date.parse(file.updated_at);
    if(!Number.isFinite(age))return{status:'run_unavailable',error:{code:'invalid_run_file',message:'Run timestamp is invalid'}};
    if(age>60_000)return GetVerificationResultOutputSchema.parse({status:'stalled',progress:file.progress,error:{code:'runner_stalled',message:'Progress has not been updated for more than 60 seconds'}});
    return GetVerificationResultOutputSchema.parse({status:file.status,progress:file.progress});
  }catch(error){if(location.shared&&(statusCode(error)===404||/no such file|ENOENT|status 404/.test(cleanError(error))))return{status:'run_expired',error:{code:'run_not_found',message:'The run directory is missing or expired'}};return{status:'run_unavailable',error:{code:'run_files_unreachable',message:cleanError(error)}};}
}
