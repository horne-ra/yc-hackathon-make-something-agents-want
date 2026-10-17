/** On-VM allocator. Filesystem locking coordinates independent AX Lint processes. */
import {mkdir,open,readFile,readdir,writeFile,rename,rm,stat} from 'node:fs/promises';
import {join} from 'node:path';
export const DIRECTORY_RETENTION_MS=135*60*1000;
export type Lease={run_id:string;status:'queued'|'running'|'complete'|'failed';created_at:string;completed_at?:string;pid?:number};
const alive=(pid:number)=>{try{process.kill(pid,0);return true;}catch{return false;}};
export function canPrune(lease:Lease,now:number):boolean {
 const completed=Date.parse(lease.completed_at??'');
 return (lease.status==='complete'||lease.status==='failed')&&Number.isFinite(completed)&&now-completed>DIRECTORY_RETENTION_MS&&(!lease.pid||!alive(lease.pid));
}
export async function atomicJson(path:string,value:unknown){await writeFile(path+'.tmp',JSON.stringify(value));await rename(path+'.tmp',path);}
export async function allocate(root:string,runId:string,limit:number,now=Date.now()):Promise<{status:'reserved'|'full';active:number;removed:string[]}> {
 if(!/^axlint-v2\.[A-Za-z0-9_-]+\.[a-f0-9-]+$/.test(runId)||!Number.isInteger(limit)||limit<1)throw Error('Invalid allocation request');
 await mkdir(root,{recursive:true});const lockPath=join(root,'.allocation.lock');let lock;
 const deadline=Date.now()+10000;
 while(!lock){
  try{lock=await open(lockPath,'wx');await lock.writeFile(String(process.pid));}
  catch(error){
   if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;
   // Recover only a provably dead owner. An empty lock gets a short creation grace.
   const owner=Number(await readFile(lockPath,'utf8').catch(()=>''));const age=Date.now()-(await stat(lockPath).catch(()=>({mtimeMs:Date.now()}))).mtimeMs;
   if((owner>0&&!alive(owner))||(!owner&&age>5000)){await rm(lockPath,{force:true});continue;}
   if(Date.now()>deadline)throw Error('runner_allocation_busy: another allocator holds the lock');
   await new Promise(resolve=>setTimeout(resolve,20));
  }
 }
 try{
  let active=0;const removed:string[]=[];
  for(const entry of await readdir(root,{withFileTypes:true})){
   if(!entry.isDirectory()||!entry.name.startsWith('axlint-v2.'))continue;
   const directory=join(root,entry.name);let lease:Lease;
   try{lease=JSON.parse(await readFile(join(directory,'lease.json'),'utf8'));}catch{continue;}
   if(lease.status==='running'&&lease.pid&&!alive(lease.pid)){
    let terminal='failed';try{terminal=JSON.parse(await readFile(join(directory,'result.json'),'utf8')).status;}catch{await atomicJson(join(directory,'result.json'),{status:'failed',error:{code:'runner_process_exited',message:'The verification process exited before writing its final result; partial progress is retained'}});}
    lease.status=terminal==='complete'?'complete':'failed';lease.completed_at=new Date(now).toISOString();await atomicJson(join(directory,'lease.json'),lease);
   }
   if(canPrune(lease,now)){await rm(directory,{recursive:true});removed.push(entry.name);continue;}
   if(lease.status==='queued'||lease.status==='running')active++;
  }
  if(active>=limit)return{status:'full',active,removed};
  const directory=join(root,runId);await mkdir(directory);await atomicJson(join(directory,'lease.json'),{run_id:runId,status:'queued',created_at:new Date(now).toISOString()});
  return{status:'reserved',active:active+1,removed};
 }finally{await lock.close();await rm(lockPath,{force:true});}
}
