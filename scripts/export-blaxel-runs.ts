import { SandboxInstance } from '@blaxel/core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {resolveRunId} from '../src/blaxel/run-location.js';
import {errorMessage} from '../src/blaxel/errors.js';
process.loadEnvFile('.env');
const directory=resolve('scripts/results',`blaxel-export-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(directory,{recursive:true});
const records=[];
const only=process.argv[2];
if(only&&!resolveRunId(only))throw new Error('Optional argument must be a valid old- or new-format run ID');
for await (const sandbox of await SandboxInstance.list({limit:100})) {
 const name=sandbox.metadata.name!;
 const locations: string[]=[];
 if(only){if(resolveRunId(only)!.sandbox===name)locations.push(only);}
 else{
  if(/^axlint-run-[a-z0-9-]{1,64}$/.test(name))locations.push(name);
  if(sandbox.metadata.labels?.axlint_role==='shared-runner')try{for(const entry of (await sandbox.fs.ls('/runs')).subdirectories){const id=entry.name;if(resolveRunId(id)?.sandbox===name)locations.push(id);}}catch{}
 }
 for(const runId of locations){
 const location=resolveRunId(runId)!;
 const record:{name:string;status:unknown;created_at:unknown;files:string[];missing:string[];process:unknown}={name:runId,status:sandbox.status,created_at:sandbox.metadata.createdAt,files:[],missing:[],process:null};
 await mkdir(resolve(directory,runId),{recursive:true});
 for(const file of ['context.json','progress.json','result.json']){
  try{
   const raw=await sandbox.fs.read(`${location.directory}/${file}`);
   const data=JSON.parse(raw);
   // These run documents contain source and trial evidence, never environment values.
   let saved=JSON.stringify(data,null,2)+'\n';
   for(const [key,value] of Object.entries(process.env))if(value&&/KEY|TOKEN|SECRET/.test(key))saved=saved.replaceAll(value,'<redacted>');
   await writeFile(resolve(directory,runId,file),saved,{flag:'wx'});
   record.files.push(file);
  }catch(error){
   const text=errorMessage(error);
   record.missing.push(`${file}: ${text?.slice(0,180)}`);
  }
 }
 try{const p=await sandbox.process.get(location.processName);record.process={status:p.status,startedAt:p.startedAt,completedAt:p.completedAt,exitCode:p.exitCode};}catch{record.process={status:'unavailable'};}
 records.push(record);
 console.log(JSON.stringify(record));
 }
}
await writeFile(resolve(directory,'manifest.json'),JSON.stringify({exported_at:new Date().toISOString(),records},null,2)+'\n');
console.log(`Evidence directory: ${directory}`);
process.exit(0);
