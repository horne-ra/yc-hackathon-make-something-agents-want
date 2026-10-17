/** Explicit October 17 authorization only; never used by production retention. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {SandboxInstance} from '@blaxel/core';
import {errorMessage} from '../src/blaxel/errors.js';
import {resolveRunId} from '../src/blaxel/run-location.js';
process.loadEnvFile('.env');
const execute=process.argv[2]==='--execute-once';
const milestone='axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d';
// Fixed historical names: this command cannot opt future runs out of retention.
const authorized=new Set([
 'axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951',
 'axlint-run-d0119595-a705-4229-89ee-29b93d71d6db',
 'axlint-run-49279710-1dfa-4e6f-ad80-77992da8d99e',
 'axlint-run-5ce8aaba-bb3a-4410-9d49-03bd849f5f69',
 'axlint-run-f8cd9acc-efd8-4ae2-a138-54a040d03831',
 'axlint-run-f94f13bf-e7fb-41a7-a893-6b1206c60c4a',
 'axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395',
 'axlint-run-78daa3da-4a36-41d2-a2e6-2d9d1df41247',
 'axlint-run-a1d95084-fb39-4bda-a970-97a230f0cd50',
]);
const output=resolve('scripts/results',`one-time-cleanup-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(output,{recursive:true});
const sha=(text:string|Buffer)=>createHash('sha256').update(text).digest('hex');
const secrets=Object.entries(process.env).filter(([k,v])=>/KEY|TOKEN|SECRET/.test(k)&&v&&v.length>8).map(([,v])=>v!);
const rows:unknown[]=[];
const save=()=>writeFile(`${output}/manifest.json`,JSON.stringify({mode:execute?'execute-once':'export-and-plan',started_at:started,rows},null,2)+'\n');
const started=new Date().toISOString();
async function exported(sandbox:SandboxInstance,runId:string){
 const directory=resolve(output,runId);await mkdir(directory,{recursive:true});
 const location=resolveRunId(runId)!;
 const files:Record<string,string>={};const missing:string[]=[];
 for(const name of ['context.json','progress.json','result.json']){
  let raw:string;
  try{raw=await sandbox.fs.read(`${location.directory}/${name}`);}catch(error){
   const status=(error as any)?.status??(error as any)?.status_code;
   if(name==='context.json'&&(status===404||/status 404|ENOENT|not found/i.test(errorMessage(error)))){missing.push(name);continue;}
   throw error;
  }
  assert(!secrets.some(secret=>raw.includes(secret)),'Evidence contains a configured secret; preserve VM and stop');
  await writeFile(`${directory}/${name}`,raw,{flag:'wx'});
  const local=await readFile(`${directory}/${name}`);assert.equal(sha(local),sha(raw));files[name]=sha(raw);
 }
 assert(files['result.json']&&files['progress.json'],'A final result and progress export are required');
 const result=JSON.parse(await readFile(`${directory}/result.json`,'utf8'));
 assert(['complete','failed'].includes(result.status),'Never export a nonterminal run for deletion');
 return{files,missing,result_status:result.status};
}
try{
 // Preserve the successful S8 evidence before examining any deletion candidate.
 const kept=await SandboxInstance.get(milestone);const milestoneExport=await exported(kept,milestone);
 rows.push({name:milestone,action:'kept-milestone-and-shared-pool',...milestoneExport});await save();
 const inventory:SandboxInstance[]=[];for await(const s of await SandboxInstance.list({limit:100}))inventory.push(s);
 const completed:Array<{run_id:string;sandbox:string;completed_at:string}>=[];
 for(const s of inventory){
  const name=s.metadata.name!;if(!name.startsWith('axlint-run-'))continue;
  const ids=[name];if(s.metadata.labels?.axlint_role==='shared-runner')for(const d of (await s.fs.ls('/runs')).subdirectories)if(resolveRunId(d.name)?.sandbox===name)ids.push(d.name);
  for(const id of ids)try{const location=resolveRunId(id)!;const p=await s.process.get(location.processName);if(p.status!=='completed'||!p.completedAt)continue;const result=JSON.parse(await s.fs.read(`${location.directory}/result.json`));if(result.status==='complete')completed.push({run_id:id,sandbox:name,completed_at:p.completedAt});}catch{/* Unknown runs are never deletion candidates. */}
 }
 completed.sort((a,b)=>Date.parse(b.completed_at)-Date.parse(a.completed_at));assert(completed.length>0);
 const newest=completed[0]!;rows.push({action:'keep-newest-completed',...newest});await save();
 const deleted:string[]=[];
 for(const listed of inventory){
  const name=listed.metadata.name!;if(!authorized.has(name))continue;
  try{
   if(name===newest.sandbox||listed.metadata.labels?.axlint_role==='shared-runner'){rows.push({name,action:'kept-newest-or-shared'});continue;}
   let sandbox=await SandboxInstance.get(name);
   const before=await sandbox.process.list();assert(before.length>0&&before.every(p=>['completed','failed','killed','stopped','terminated'].includes(p.status??'')),'A live, queued or unknown process prevents deletion');
   const backup=await exported(sandbox,name);
   // Immediately recheck every exported byte and all process states before deleting.
   sandbox=await SandboxInstance.get(name);assert.notEqual(sandbox.metadata.labels?.axlint_role,'shared-runner');
   const processes=await sandbox.process.list();assert(processes.length>0&&processes.every(p=>['completed','failed','killed','stopped','terminated'].includes(p.status??'')),'Process state changed; preserve sandbox');
   for(const[file,hash]of Object.entries(backup.files)){
    const local=await readFile(`${output}/${name}/${file}`);const remote=await sandbox.fs.read(`/app/axlint-run/${file}`);
    assert.equal(sha(local),hash);assert.equal(sha(remote),hash,'Remote evidence changed; preserve sandbox');
   }
   const record={name,action:execute?'verified-before-delete':'would-delete',...backup,processes:processes.map(p=>({name:p.name,status:p.status,completed_at:p.completedAt,exit_code:p.exitCode}))};
   rows.push(record);await save();
   if(execute){const final=await SandboxInstance.get(name);assert.notEqual(final.metadata.labels?.axlint_role,'shared-runner');const live=await final.process.list();assert(live.length>0&&live.every(p=>['completed','failed','killed','stopped','terminated'].includes(p.status??'')),'Final process check protects queued/running work');await final.delete();deleted.push(name);rows.push({name,action:'delete-request-accepted',at:new Date().toISOString()});await save();}
   console.log(`${execute?'DELETED':'WOULD DELETE'} ${name}: exact SHA-256 matches for ${Object.keys(backup.files).join(', ')}`);
  }catch(error){rows.push({name,action:'preserved-error',error:errorMessage(error)});await save();console.log(`PRESERVED ${name}: ${errorMessage(error)}`);}
 }
 const remaining=[];for await(const s of await SandboxInstance.list({limit:100}))remaining.push({name:s.metadata.name,status:s.status});
 const active=remaining.filter(s=>!['TERMINATED','TERMINATING','DELETING','FAILED'].includes(s.status??''));
 const summary={checked_at:new Date().toISOString(),deleted,newest_kept:newest,remaining,occupied:active.length,free_slots:Math.max(0,10-active.length),future_retention_unchanged:true};
 rows.push({action:'summary',...summary});await save();
 console.log(JSON.stringify(summary));console.log(`Evidence: ${output}`);
}catch(error){rows.push({action:'fatal-preserve-rest',error:errorMessage(error)});await save();throw error;}
process.exit(0);
