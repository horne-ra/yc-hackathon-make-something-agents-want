import{describe,it,expect,vi,beforeEach}from'vitest';
const mock=vi.hoisted(()=>({list:vi.fn(),create:vi.fn(),ttl:vi.fn(),metadata:vi.fn(),delete:vi.fn()}));
vi.mock('@blaxel/core',()=>({SandboxInstance:{list:mock.list,createIfNotExists:mock.create,updateTtl:mock.ttl,updateMetadata:mock.metadata,delete:mock.delete}}));
import{reserveSharedRun}from'./shared-pool.js';
const page=(items:unknown[])=>({async *[Symbol.asyncIterator](){yield* items;}});
const sandbox=(name:string,shared=true,status='reserved')=>({metadata:{name,createdAt:new Date().toISOString(),labels:shared?{axlint_role:'shared-runner',axlint_pool:'1'}:{}},status:'DEPLOYED',spec:{runtime:{memory:1024}},fs:{read:vi.fn().mockResolvedValue('{"status":"complete"}')},process:{wait:vi.fn(),get:vi.fn().mockResolvedValue({status:'completed'}),exec:vi.fn().mockResolvedValue({exitCode:0,stdout:JSON.stringify({status,active:1,removed:[]})})}});
beforeEach(()=>{vi.resetAllMocks();mock.ttl.mockImplementation(async(name:string)=>sandbox(name));});
describe('shared sandbox selection',()=>{
 it('recreates a missing pool and clears its sandbox TTL',async()=>{
  mock.list.mockResolvedValue(page([]));mock.create.mockResolvedValue(sandbox('axlint-runner-1'));
  const result=await reserveSharedRun();expect(result.location.sandbox).toBe('axlint-runner-1');expect(mock.create).toHaveBeenCalledWith(expect.objectContaining({name:'axlint-runner-1',memory:1024}));expect(mock.ttl).toHaveBeenCalledWith('axlint-runner-1',null);
 });
 it('reuses an available pool without creating another',async()=>{
  mock.list.mockResolvedValue(page([sandbox('axlint-runner-1')]));const result=await reserveSharedRun();expect(result.limit).toBe(4);expect(mock.create).not.toHaveBeenCalled();
 });
 it('considers a second pool only after the first is atomically full',async()=>{
  const first=sandbox('axlint-runner-1',true,'full');mock.list.mockImplementation(async()=>page([first]));mock.create.mockResolvedValue(sandbox('axlint-runner-2'));mock.ttl.mockResolvedValue(sandbox('axlint-runner-2'));
  const result=await reserveSharedRun();expect(result.location.sandbox).toBe('axlint-runner-2');expect(first.process.exec).toHaveBeenCalledTimes(1);expect(mock.create).toHaveBeenCalledTimes(1);
 });
 it('at capacity adopts an idle completed legacy VM without deleting it or its files',async()=>{
  const old=Array.from({length:10},(_,i)=>sandbox(`axlint-run-${i}`,false));mock.list.mockImplementation(async()=>page(old));mock.metadata.mockImplementation(async(name:string)=>sandbox(name));
  const result=await reserveSharedRun();expect(result.location.sandbox).toMatch(/^axlint-run-/);expect(mock.create).not.toHaveBeenCalled();expect(mock.delete).not.toHaveBeenCalled();expect(mock.metadata).toHaveBeenCalledTimes(1);
 });
 it('does not adopt legacy running jobs at capacity',async()=>{
  const old=Array.from({length:10},(_,i)=>{const s=sandbox(`axlint-run-${i}`,false);s.process.get.mockResolvedValue({status:'running'});return s;});mock.list.mockImplementation(async()=>page(old));
  await expect(reserveSharedRun()).rejects.toMatchObject({code:'capacity_exhausted'});expect(mock.metadata).not.toHaveBeenCalled();expect(mock.delete).not.toHaveBeenCalled();
 });
 it('waits for an asynchronous allocator before trusting its reservation',async()=>{
  const s=sandbox('axlint-runner-1');s.process.exec.mockResolvedValue({status:'running',pid:'123'} as never);s.process.wait.mockResolvedValue({exitCode:0,stdout:'{"status":"reserved","active":1,"removed":[]}'});
  mock.list.mockResolvedValue(page([s]));await reserveSharedRun();expect(s.process.wait).toHaveBeenCalledWith('123',{maxWait:15000,interval:25});
 });

 it('does not create a third pool when both configured pools are full',async()=>{
  const first=sandbox('axlint-runner-1',true,'full'),second=sandbox('axlint-runner-2',true,'full');second.metadata.labels.axlint_pool='2';mock.list.mockResolvedValue(page([first,second]));
  await expect(reserveSharedRun()).rejects.toMatchObject({code:'runner_concurrency_exhausted'});expect(mock.create).not.toHaveBeenCalled();
 });
 it('recreates the missing primary slot when only the secondary survives full',async()=>{
  const second=sandbox('axlint-runner-2',true,'full');second.metadata.labels.axlint_pool='2';mock.list.mockResolvedValue(page([second]));mock.create.mockResolvedValue(sandbox('axlint-runner-1'));
  const result=await reserveSharedRun();expect(result.location.sandbox).toBe('axlint-runner-1');expect(mock.create).toHaveBeenCalledWith(expect.objectContaining({name:'axlint-runner-1'}));
 });

});
