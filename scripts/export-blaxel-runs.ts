import { SandboxInstance } from '@blaxel/core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
process.loadEnvFile('.env');
const directory=resolve('scripts/results',`blaxel-export-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(directory,{recursive:true});
const records=[];
for await (const sandbox of await SandboxInstance.list({limit:100})) {
 const name=sandbox.metadata.name!;
 if(!name.startsWith('axlint-run-'))continue;
 const record:{name:string;status:unknown;created_at:unknown;files:string[];missing:string[];process:unknown}={name,status:sandbox.status,created_at:sandbox.metadata.createdAt,files:[],missing:[],process:null};
 await mkdir(resolve(directory,name),{recursive:true});
 for(const file of ['context.json','progress.json','result.json']){
  try{
   const raw=await sandbox.fs.read(`/app/axlint-run/${file}`);
   const data=JSON.parse(raw);
   // These run documents contain source and trial evidence, never environment values.
   let saved=JSON.stringify(data,null,2)+'\n';
   for(const [key,value] of Object.entries(process.env))if(value&&/KEY|TOKEN|SECRET/.test(key))saved=saved.replaceAll(value,'<redacted>');
   await writeFile(resolve(directory,name,file),saved,{flag:'wx'});
   record.files.push(file);
  }catch(error){
   const text=error instanceof Error?error.message:JSON.stringify(error);
   record.missing.push(`${file}: ${text?.slice(0,180)}`);
  }
 }
 try{const p=await sandbox.process.get('axlint-verification');record.process={status:p.status,startedAt:p.startedAt,completedAt:p.completedAt,exitCode:p.exitCode};}catch{record.process={status:'unavailable'};}
 records.push(record);
 console.log(JSON.stringify(record));
}
await writeFile(resolve(directory,'manifest.json'),JSON.stringify({exported_at:new Date().toISOString(),records},null,2)+'\n');
console.log(`Evidence directory: ${directory}`);
process.exit(0);
