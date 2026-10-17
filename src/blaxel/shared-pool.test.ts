import {describe,it,expect,vi,beforeEach} from 'vitest';
import {mkdtemp,readFile,writeFile,mkdir,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';import{join}from'node:path';
import {resolveRunId,sharedRunId} from './run-location.js';
import {allocate,canPrune,DIRECTORY_RETENTION_MS,type Lease} from '../../runner/pool-state.js';
const id='11111111-1111-4111-a111-111111111111';
const run=sharedRunId('axlint-runner-1',id);
describe('durable run locations',()=>{
 it('round-trips new IDs to sandbox, unique directory and process; retains legacy format',()=>{
  expect(resolveRunId(run)).toEqual({sandbox:'axlint-runner-1',directory:`/runs/${run}`,processName:`verify-${id}`,shared:true});
  const old=`axlint-run-${id}`;expect(resolveRunId(old)).toMatchObject({sandbox:old,directory:'/app/axlint-run',shared:false});
  expect(resolveRunId(sharedRunId(old,id))?.sandbox).toBe(old);
 });
 it.each(['made-up','../../etc/passwd','axlint-v2.Li4vZXRj.11111111-1111-4111-a111-111111111111','axlint-spike-123'])('rejects invalid or unsafe ID %s',value=>expect(resolveRunId(value)).toBeUndefined());
});
describe('shared-run terminal retention and concurrency',()=>{
 const now=Date.now();const old:Lease={run_id:run,status:'complete',created_at:new Date(now-DIRECTORY_RETENTION_MS-5000).toISOString(),completed_at:new Date(now-DIRECTORY_RETENTION_MS-1000).toISOString()};
 it('prunes old complete and failed, keeps active, young and live processes',()=>{
  expect(canPrune(old,now)).toBe(true);expect(canPrune({...old,status:'failed'},now)).toBe(true);
  for(const status of ['queued','running'] as const)expect(canPrune({...old,status},now)).toBe(false);
  expect(canPrune({...old,completed_at:new Date(now-1000).toISOString()},now)).toBe(false);
  expect(canPrune({...old,completed_at:new Date(now-DIRECTORY_RETENTION_MS).toISOString()},now)).toBe(false);
  expect(canPrune({...old,pid:process.pid},now)).toBe(false);
 });
 it('atomically enforces the limit across concurrent independent allocations',async()=>{
  const root=await mkdtemp(join(tmpdir(),'axlint-pool-'));
  try{const outcomes=await Promise.all([allocate(root,run,1),allocate(root,sharedRunId('axlint-runner-1'),1)]);expect(outcomes.map(o=>o.status).sort()).toEqual(['full','reserved']);}finally{await rm(root,{recursive:true,force:true});}
 });
 it('deletes only old terminal directories; keeps queued and young directories',async()=>{
  const root=await mkdtemp(join(tmpdir(),'axlint-retention-'));
  try{
   for(const [name,lease] of [['axlint-v2.old.complete',old],['axlint-v2.old.failed',{...old,status:'failed'}],['axlint-v2.old.running',{...old,status:'running'}],['axlint-v2.young.complete',{...old,completed_at:new Date(now).toISOString()}]] as const){await mkdir(join(root,name));await writeFile(join(root,name,'lease.json'),JSON.stringify(lease));}
   const state=await allocate(root,run,4,now);expect(state.removed.sort()).toEqual(['axlint-v2.old.complete','axlint-v2.old.failed']);
   await access(join(root,'axlint-v2.old.running'));await access(join(root,'axlint-v2.young.complete'));await expect(access(join(root,'axlint-v2.old.complete'))).rejects.toThrow();
  }finally{await rm(root,{recursive:true,force:true});}
 });
 it('recovers a dead running process as failed without deleting its evidence',async()=>{
  const root=await mkdtemp(join(tmpdir(),'axlint-dead-'));const oldId=sharedRunId('axlint-runner-1');
  try{await mkdir(join(root,oldId));await writeFile(join(root,oldId,'lease.json'),JSON.stringify({...old,run_id:oldId,status:'running',pid:2147483647}));await allocate(root,run,1,now);const recovered=JSON.parse(await readFile(join(root,oldId,'lease.json'),'utf8'));expect(recovered.status).toBe('failed');expect(recovered.completed_at).toBe(new Date(now).toISOString());expect(JSON.parse(await readFile(join(root,oldId,'result.json'),'utf8')).error.code).toBe('runner_process_exited');}finally{await rm(root,{recursive:true,force:true});}
 });
});
