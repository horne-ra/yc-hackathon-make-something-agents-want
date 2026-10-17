import {randomUUID} from 'node:crypto';
export type RunLocation={sandbox:string;directory:string;processName:string;shared:boolean};
const old=/^axlint-run-[a-z0-9-]{1,64}$/;
const poolName=/^(?:axlint-run-[a-z0-9-]{1,64}|axlint-runner-[1-9][0-9]*)$/;
export function sharedRunId(sandbox:string,id=randomUUID()):string {
 if(!poolName.test(sandbox))throw Error('Invalid runner sandbox');
 return `axlint-v2.${Buffer.from(sandbox).toString('base64url')}.${id}`;
}
export function resolveRunId(id:string):RunLocation|undefined {
 if(old.test(id))return{sandbox:id,directory:'/app/axlint-run',processName:'axlint-verification',shared:false};
 const match=/^axlint-v2\.([A-Za-z0-9_-]+)\.([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/.exec(id);
 if(!match)return;
 const sandbox=Buffer.from(match[1]!,'base64url').toString();
 if(!poolName.test(sandbox)||Buffer.from(sandbox).toString('base64url')!==match[1])return;
 return{sandbox,directory:`/runs/${id}`,processName:`verify-${match[2]}`,shared:true};
}
