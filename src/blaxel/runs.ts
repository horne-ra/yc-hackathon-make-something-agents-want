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
const runIdSchema=z.string().regex(/^axlint-run-[a-z0-9-]{1,64}$/);
export async function startRun(raw:unknown):Promise<z.infer<typeof VerifyPatchOutputSchema>>{
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
  const bootstrap=`import {readFileSync,writeFileSync} from "node:fs"; import {gunzipSync} from "node:zlib"; const path="${RUN_DIRECTORY}";writeFileSync(path+"/runner.mjs",gunzipSync(Buffer.from(readFileSync(path+"/runner.b64","utf8"),"base64")));process.argv=[process.argv[0],path+"/runner.mjs",path+"/input.json","${name}",path];await import("file://"+path+"/runner.mjs");`;
  const timeout=Math.floor((creationStarted+RUN_DEADLINE_MS-Date.now())/1000);
  if(timeout<1)throw new Error('Sandbox preparation exceeded the run deadline');
  await sandbox.process.exec({name:RUN_PROCESS,command:`node --input-type=module -e '${bootstrap}'`,waitForCompletion:false,keepAlive:true,timeout,env:{ANTHROPIC_API_KEY:process.env.ANTHROPIC_API_KEY!,AXLINT_MODEL:process.env.AXLINT_MODEL!}});
  return VerifyPatchOutputSchema.parse({run_id:name,status:'queued',total_trials:input.tasks.tasks.length*input.trials*2});
  }catch(error){throw runStartError(error);}
}
function statusCode(error:unknown):number|undefined{const value=error as {status?:number;statusCode?:number;code?:number};return value?.status??value?.statusCode??value?.code;}
export async function readRun(runId:string):Promise<GetVerificationResultOutput>{
  if(!runIdSchema.safeParse(runId).success)return{status:'run_expired',error:{code:'run_not_found',message:'Run ID is invalid or no longer exists; start a new verification run'}};
  let sandbox:SandboxInstance;
  try{sandbox=await SandboxInstance.get(runId);}catch(error){return statusCode(error)===404?{status:'run_expired',error:{code:'run_not_found',message:'Sandbox no longer exists; re-run verify_patch'}}:{status:'run_unavailable',error:{code:'sandbox_unreachable',message:cleanError(error)}};}
  if(['TERMINATED','TERMINATING','DELETING','FAILED'].includes(sandbox.status??''))return{status:'run_expired',error:{code:'sandbox_expired',message:'Sandbox has expired; re-run verify_patch'}};
  try{
    const listing=await sandbox.fs.ls(RUN_DIRECTORY);const names=new Set(listing.files?.map(file=>file.name));
    if(names.has('result.json')){
      const file=JSON.parse(await sandbox.fs.read(`${RUN_DIRECTORY}/result.json`)) as ResultFile;
      if(file.status==='failed')return GetVerificationResultOutputSchema.parse({status:'failed',error:file.error});
      const result=VerificationResultSchema.parse(file.result);const total=result.tasks.reduce((n,t)=>n+t.trials.length,0);
      return{status:'complete',progress:{done:total,total},result};
    }
    if(!names.has('progress.json'))return{status:'queued'};
    const file=JSON.parse(await sandbox.fs.read(`${RUN_DIRECTORY}/progress.json`)) as ProgressFile;
    const age=Date.now()-Date.parse(file.updated_at);
    if(!Number.isFinite(age))return{status:'run_unavailable',error:{code:'invalid_run_file',message:'Run timestamp is invalid'}};
    if(age>60_000)return GetVerificationResultOutputSchema.parse({status:'stalled',progress:file.progress,error:{code:'runner_stalled',message:'Progress has not been updated for more than 60 seconds'}});
    return GetVerificationResultOutputSchema.parse({status:file.status,progress:file.progress});
  }catch(error){return{status:'run_unavailable',error:{code:'run_files_unreachable',message:cleanError(error)}};}
}
