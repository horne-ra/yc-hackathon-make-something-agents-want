import {SandboxInstance} from '@blaxel/core';
import {randomUUID} from 'node:crypto';
import {poolPayloadBase64} from '../../runner/pool-payload.js';
import {ensureRunCapacity} from './retention.js';
import {RunStartError,runStartError} from './errors.js';
import {sharedRunId,resolveRunId} from './run-location.js';
export const POOL_ROLE='shared-runner';
export function concurrentLimit(){const n=Number(process.env.AXLINT_MAX_CONCURRENT_RUNS??4);if(!Number.isInteger(n)||n<1||n>16)throw new RunStartError('invalid_concurrency_limit','AXLINT_MAX_CONCURRENT_RUNS must be an integer from 1 to 16');return n;}
async function list(){const rows:SandboxInstance[]=[];for await(const s of await SandboxInstance.list({limit:100}))if(!['TERMINATED','FAILED','DELETING','TERMINATING'].includes(s.status??''))rows.push(s);return rows;}
async function newPool(rows:SandboxInstance[],index:number,limit:number):Promise<SandboxInstance>{
 const labels={project:'axlint',axlint_role:POOL_ROLE,axlint_pool:String(index)};
 try{
  await ensureRunCapacity();
  const s=await SandboxInstance.createIfNotExists({name:`axlint-runner-${index}`,image:'blaxel/base-image:latest',memory:Math.max(1024,limit*256),region:process.env.BL_REGION||'us-pdx-1',labels});
  return await SandboxInstance.updateTtl(s.metadata.name!,null);
 }catch(error){
  if(runStartError(error).code!=='capacity_exhausted')throw error;
  // At quota, reuse an idle legacy VM. Preserve its old directory and old-ID reads.
  // No sandbox is deleted or resized, and no queued/running legacy job is adopted.
  const candidates=rows.filter(s=>/^axlint-run-[a-z0-9-]+$/.test(s.metadata.name??'')&&s.metadata.labels?.axlint_role!==POOL_ROLE&&(s.spec.runtime?.memory??0)>=Math.max(1024,limit*256)).sort((a,b)=>Date.parse(b.metadata.createdAt??'')-Date.parse(a.metadata.createdAt??''));
  for(const candidate of candidates){
   try{
    const p=await candidate.process.get('axlint-verification');if(p.status!=='completed')continue;
    const result=JSON.parse(await candidate.fs.read('/app/axlint-run/result.json'));if(!['complete','failed'].includes(result.status))continue;
   }catch{continue;}
   const s=await SandboxInstance.updateMetadata(candidate.metadata.name!,{labels:{...candidate.metadata.labels,...labels}});
   return await SandboxInstance.updateTtl(s.metadata.name!,null);
  }
  throw error;
 }
}
export async function reserveSharedRun(){
 const limit=concurrentLimit();let rows=await list();
 const pools=rows.filter(s=>s.metadata.labels?.axlint_role===POOL_ROLE).sort((a,b)=>Number(a.metadata.labels?.axlint_pool??0)-Number(b.metadata.labels?.axlint_pool??0));
 const id=randomUUID();
 for(let index=0;index<2;index++){
  const used=new Set(rows.filter(row=>row.metadata.labels?.axlint_role===POOL_ROLE).map(row=>Number(row.metadata.labels?.axlint_pool)));
  const slot=used.has(1)?2:1;
  let sandbox=pools[index]??await newPool(rows,slot,limit);
  if(sandbox.spec.runtime?.ttl)sandbox=await SandboxInstance.updateTtl(sandbox.metadata.name!,null);
  rows=rows.filter(row=>row.metadata.name!==sandbox.metadata.name).concat(sandbox);
  const run_id=sharedRunId(sandbox.metadata.name!,id),location=resolveRunId(run_id)!;
  const request=Buffer.from(JSON.stringify({run_id,limit})).toString('base64url');
  const script=`process.argv[2]="${request}";await import("data:text/javascript;base64,${poolPayloadBase64}");`;
  const started=await sandbox.process.exec({name:`allocate-${id}`,command:`node --input-type=module -e '${script}'`,waitForCompletion:false,timeout:20});
  // The server's synchronous exec waits in coarse intervals. Poll the tiny allocator directly.
  const result=started.status==='running'?await sandbox.process.wait(started.pid,{maxWait:15000,interval:25}):started;
  if(result.exitCode!==0)throw new RunStartError('runner_allocation_failed','The shared runner could not reserve an isolated run directory. Retry; existing runs were preserved.');
  const reservation=JSON.parse(result.stdout!.trim().split('\n').at(-1)!);
  if(reservation.status==='reserved')return{sandbox,run_id,location,active:reservation.active,limit,removed:reservation.removed};
  if(reservation.status!=='full')throw Error('Invalid shared runner allocation response');
  // A second pool is considered only after an atomic reservation proves this one full.
 }
 throw new RunStartError('runner_concurrency_exhausted','All configured runner slots are busy; retry after a running verification completes.');
}
