import { SandboxInstance } from '@blaxel/core';
import { RunStartError } from './errors.js';
export const RETENTION_MS=2*60*60*1000;
export const RUN_TTL='2h15m';
export const WORKSPACE_CAPACITY=10;
function configuredCapacity(){const value=Number(process.env.AXLINT_SANDBOX_CAPACITY??WORKSPACE_CAPACITY);if(!Number.isInteger(value)||value<1)throw new RunStartError('invalid_capacity_configuration','AXLINT_SANDBOX_CAPACITY must be a positive integer matching the Blaxel workspace quota.');return value;}
// At most 14 minutes from creation to termination leaves >2h in a 2h15m VM.
export const RUN_DEADLINE_MS=14*60*1000;
export type RetainedSandbox={name:string;createdAt?:string;status?:string};
export type Completion={processStatus?:string;completedAt?:string;resultStatus?:string;progressStatus?:string};
export function eligibleForCleanup(sandbox:RetainedSandbox,completion:Completion,now:number):boolean {
 if(!/^axlint-run-[a-z0-9-]+$/.test(sandbox.name))return false;
 const created=Date.parse(sandbox.createdAt??''),completed=Date.parse(completion.completedAt??'');
 return Number.isFinite(created)&&Number.isFinite(completed)&&created<=completed&&now-created>RETENTION_MS&&now-completed>RETENTION_MS&&completion.processStatus==='completed'&&completion.resultStatus==='complete'&&completion.progressStatus!=='queued'&&completion.progressStatus!=='running';
}
export interface RetentionDependencies {
 list():Promise<RetainedSandbox[]>;
 completion(name:string):Promise<Completion>;
 remove(name:string):Promise<unknown>;
 now?:()=>number;
 capacity?:number;
}
export async function ensureRunCapacity(deps:RetentionDependencies=productionRetention):Promise<void>{
 const sandboxes=(await deps.list()).filter(s=>!['TERMINATED','FAILED'].includes(s.status??''));
 const capacity=deps.capacity??configuredCapacity();
 if(sandboxes.length<capacity)return;
 const now=(deps.now??Date.now)();
 const candidates:Array<{sandbox:RetainedSandbox;completion:Completion}>=[];
 for(const sandbox of sandboxes){
  if(!sandbox.name.startsWith('axlint-run-')||now-Date.parse(sandbox.createdAt??'')<=RETENTION_MS)continue;
  try{const completion=await deps.completion(sandbox.name);if(eligibleForCleanup(sandbox,completion,now))candidates.push({sandbox,completion});}catch{/* Unknown state is protected. */}
 }
 candidates.sort((a,b)=>Date.parse(a.completion.completedAt!)-Date.parse(b.completion.completedAt!));
 let occupied=sandboxes.length;
 for(const {sandbox} of candidates){
  // Recheck immediately before deletion. Unknown or changed state remains protected.
  const completion=await deps.completion(sandbox.name).catch(()=>null);
  if(!completion||!eligibleForCleanup(sandbox,completion,(deps.now??Date.now)()))continue;
  await deps.remove(sandbox.name);
  if(--occupied<capacity)return;
 }
 throw new RunStartError('capacity_exhausted',`Blaxel sandbox capacity is exhausted (${occupied}/${capacity}). No completed AX Lint run older than two hours can be safely removed. Wait for expiry, or increase the workspace quota and set AXLINT_SANDBOX_CAPACITY to match; queued, running, recent runs and the proof sandbox are protected.`);
}
export const productionRetention:RetentionDependencies={
 async list(){const rows:RetainedSandbox[]=[];for await(const s of await SandboxInstance.list({limit:100}))rows.push({name:s.metadata.name!,createdAt:s.metadata.createdAt,status:s.status});return rows;},
 async completion(name){
  const s=await SandboxInstance.get(name);
  const [p,result,progress]=await Promise.all([s.process.get('axlint-verification'),s.fs.read('/app/axlint-run/result.json'),s.fs.read('/app/axlint-run/progress.json')]);
  // Historical runners leave progress.status=running even when result.json is final.
  // A successful process and atomic final result override that stale progress marker.
  const final=JSON.parse(result),state=JSON.parse(progress);
  return{processStatus:p.status,completedAt:p.completedAt,resultStatus:final.status,progressStatus:p.status==='completed'&&final.status==='complete'?'complete':state.status};
 },
 remove:name=>SandboxInstance.delete(name),
};
