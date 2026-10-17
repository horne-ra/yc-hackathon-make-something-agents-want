import {describe,it,expect,vi} from 'vitest';
import {eligibleForCleanup,ensureRunCapacity,RETENTION_MS,RUN_TTL,RUN_DEADLINE_MS,type RetainedSandbox,type Completion} from './retention.js';
import {errorMessage,runStartError} from './errors.js';
const now=Date.parse('2026-10-17T22:00:00Z');
const sandbox:RetainedSandbox={name:'axlint-run-old',createdAt:new Date(now-RETENTION_MS-60000).toISOString(),status:'DEPLOYED'};
const completed:Completion={processStatus:'completed',resultStatus:'complete',progressStatus:'complete',completedAt:new Date(now-RETENTION_MS-30000).toISOString()};
describe('two-hour completed-run retention',()=>{
 it('removes only old completed verification runs',()=>expect(eligibleForCleanup(sandbox,completed,now)).toBe(true));
 it.each(['queued','running'])('protects %s runs',status=>expect(eligibleForCleanup(sandbox,{...completed,processStatus:status,progressStatus:status},now)).toBe(false));
 it.each(['axlint-spike-1792264922765','another-project'])('protects %s',name=>expect(eligibleForCleanup({...sandbox,name},completed,now)).toBe(false));
 it('protects recently created, recently completed and exactly two-hour-old runs',()=>{
  expect(eligibleForCleanup({...sandbox,createdAt:new Date(now-60000).toISOString()},completed,now)).toBe(false);
  for(const age of [60000,RETENTION_MS])expect(eligibleForCleanup(sandbox,{...completed,completedAt:new Date(now-age).toISOString()},now)).toBe(false);
 });
 it('protects missing, invalid and failed completion evidence',()=>{
  for(const patch of [{completedAt:undefined},{completedAt:'invalid'},{resultStatus:'failed'},{processStatus:'failed'},{progressStatus:'running'}])expect(eligibleForCleanup(sandbox,{...completed,...patch},now)).toBe(false);
 });
 it('does no cleanup when capacity remains',async()=>{const completion=vi.fn(),remove=vi.fn();await ensureRunCapacity({list:async()=>[sandbox],completion,remove,now:()=>now,capacity:2});expect(completion).not.toHaveBeenCalled();expect(remove).not.toHaveBeenCalled();});
 it('deletes oldest completed first and stops as soon as capacity is available',async()=>{
  const remove=vi.fn(),older={...sandbox,name:'axlint-run-older',createdAt:new Date(now-RETENTION_MS-120000).toISOString()};
  await ensureRunCapacity({list:async()=>[sandbox,older],completion:async name=>({...completed,completedAt:new Date(now-RETENTION_MS-(name===older.name?90000:30000)).toISOString()}),remove,now:()=>now,capacity:2});
  expect(remove.mock.calls).toEqual([[older.name]]);
 });
 it('fails clearly without deleting protected runs at capacity',async()=>{
  const remove=vi.fn();await expect(ensureRunCapacity({list:async()=>[{...sandbox,createdAt:new Date(now-60000).toISOString()}],completion:async()=>completed,remove,now:()=>now,capacity:1})).rejects.toMatchObject({code:'capacity_exhausted'});expect(remove).not.toHaveBeenCalled();
 });
 it('rechecks completion and protects a run whose state changed',async()=>{
  const remove=vi.fn(),completion=vi.fn().mockResolvedValueOnce(completed).mockResolvedValueOnce({...completed,processStatus:'running'});
  await expect(ensureRunCapacity({list:async()=>[sandbox],completion,remove,now:()=>now,capacity:1})).rejects.toMatchObject({code:'capacity_exhausted'});expect(remove).not.toHaveBeenCalled();
 });
 it('fails closed when completion cannot be read, excludes terminated from capacity',async()=>{
  const remove=vi.fn();await expect(ensureRunCapacity({list:async()=>[sandbox],completion:async()=>{throw Error('unreachable');},remove,now:()=>now,capacity:1})).rejects.toMatchObject({code:'capacity_exhausted'});expect(remove).not.toHaveBeenCalled();
  await ensureRunCapacity({list:async()=>[{...sandbox,status:'TERMINATED'}],completion:vi.fn(),remove,capacity:1});
 });
 it('leaves more than two hours after the hard deadline within the 2h15m TTL',()=>{expect(RUN_TTL).toBe('2h15m');expect(135*60000-RUN_DEADLINE_MS).toBeGreaterThan(RETENTION_MS);});
});
describe('provider errors',()=>{
 it.each([{code:'QUOTA_EXCEEDED',message:'all slots deployed'},{error:{code:'QUOTA_EXCEEDED',message:'maximum 10'}},{body:{error:{code:'QUOTA_EXCEEDED'}}}])('names nested quota failures',error=>expect(runStartError(error)).toMatchObject({code:'capacity_exhausted',message:expect.stringContaining('capacity is exhausted')}));
 it('never emits object coercion, including cyclic diagnostics',()=>{const value:{error?:unknown}={};value.error=value;for(const error of [value,{},null,new Error('[object Object]'),{error:{message:'Request failed: [object Object]'}},{error:{message:'offline'}}])expect(errorMessage(error)).not.toContain('[object Object]');expect(errorMessage({error:{message:'offline'}})).toContain('offline');});
 it('redacts environment secrets from diagnostics',()=>{process.env.AXLINT_TEST_TOKEN='test-only-private-value';try{expect(errorMessage({message:'Failed test-only-private-value'})).toBe('Failed <redacted>');}finally{delete process.env.AXLINT_TEST_TOKEN;}});
});
