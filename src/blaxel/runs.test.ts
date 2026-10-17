import { describe,it,expect,vi,beforeEach } from 'vitest';
const mock=vi.hoisted(()=>({get:vi.fn()}));
vi.mock('@blaxel/core',()=>({SandboxInstance:{get:mock.get}}));
import { sharedRunId } from './run-location.js';
import { readRun } from './runs.js';
const id='axlint-run-11111111-1111-4111-a111-111111111111';
const sandbox=(files:Record<string,unknown>)=>({status:'DEPLOYED',fs:{ls:async()=>({files:Object.keys(files).map(name=>({name}))}),read:async(path:string)=>JSON.stringify(files[path.split('/').at(-1)!])}});
beforeEach(()=>vi.resetAllMocks());
describe('stateless run polling',()=>{
 it('maps nonexistent run to expired and transient control-plane errors to unavailable',async()=>{expect((await readRun('made-up-id')).status).toBe('run_expired');mock.get.mockRejectedValueOnce({status:404});expect((await readRun(id)).status).toBe('run_expired');mock.get.mockRejectedValueOnce(new Error('offline'));expect((await readRun(id)).status).toBe('run_unavailable');});
 it('maps queued, fresh running and older-than-60-second progress',async()=>{mock.get.mockResolvedValueOnce(sandbox({}));expect((await readRun(id)).status).toBe('queued');mock.get.mockResolvedValueOnce(sandbox({'progress.json':{status:'running',updated_at:new Date().toISOString(),progress:{done:2,total:24}}}));expect((await readRun(id)).status).toBe('running');mock.get.mockResolvedValueOnce(sandbox({'progress.json':{status:'running',updated_at:new Date(Date.now()-61000).toISOString(),progress:{done:2,total:24}}}));expect((await readRun(id)).status).toBe('stalled');});
 it('preserves named runner errors instead of hiding failed runs',async()=>{mock.get.mockResolvedValueOnce(sandbox({'result.json':{status:'failed',error:{code:'stale_patch',message:'Target changed'}}}));expect(await readRun(id)).toEqual({status:'failed',error:{code:'stale_patch',message:'Target changed'}});});
 it('treats terminated sandboxes as expired and malformed files as unavailable',async()=>{mock.get.mockResolvedValueOnce({...sandbox({}),status:'TERMINATED'});expect((await readRun(id)).status).toBe('run_expired');mock.get.mockResolvedValueOnce(sandbox({'result.json':{status:'complete',result:{}}}));expect((await readRun(id)).status).toBe('run_unavailable');});
 it('resolves new IDs, returns expired for missing directory and unavailable for unreachable pool',async()=>{
  const run=sharedRunId('axlint-runner-1');mock.get.mockResolvedValueOnce({status:'DEPLOYED',fs:{ls:async()=>{throw{status_code:404};}}});expect((await readRun(run)).status).toBe('run_expired');expect(mock.get).toHaveBeenCalledWith('axlint-runner-1');
  mock.get.mockRejectedValueOnce({status_code:404,message:'Pool lost'});expect((await readRun(run)).status).toBe('run_unavailable');
 });

});
