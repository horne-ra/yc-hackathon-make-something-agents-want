import{describe,it,expect,vi,beforeEach,afterEach}from'vitest';import{readFileSync}from'node:fs';
const mock=vi.hoisted(()=>({reserve:vi.fn(),write:vi.fn(),read:vi.fn(),exec:vi.fn(),get:vi.fn()}));
vi.mock('./shared-pool.js',()=>({reserveSharedRun:mock.reserve}));
import{startRun}from'./runs.js';import{sharedRunId,resolveRunId}from'./run-location.js';
const input=JSON.parse(readFileSync('runner/evidence/corrected-input.json','utf8'));
const run_id=sharedRunId('axlint-runner-1');
beforeEach(()=>{vi.resetAllMocks();vi.stubEnv('AXLINT_RUNNER_MODE','shared');for(const key of['BL_API_KEY','BL_WORKSPACE','ANTHROPIC_API_KEY','AXLINT_MODEL'])vi.stubEnv(key,'test-only');mock.reserve.mockResolvedValue({run_id,location:resolveRunId(run_id),sandbox:{fs:{writeTree:mock.write,read:mock.read},process:{exec:mock.exec,get:mock.get}}});mock.read.mockResolvedValue(JSON.stringify({run_id,status:'queued',created_at:new Date().toISOString()}));});
afterEach(()=>vi.unstubAllEnvs());
describe('shared launch failures preserve capacity and evidence',()=>{
 it('marks an upload failure terminal instead of leaking a permanent queued slot',async()=>{mock.write.mockRejectedValueOnce({message:'upload offline'});await expect(startRun(input)).rejects.toMatchObject({code:'sandbox_request_failed'});expect(mock.exec).not.toHaveBeenCalled();const files=mock.write.mock.calls[1]![0] as Array<{path:string;content:string}>;expect(JSON.parse(files.find(f=>f.path==='lease.json')!.content)).toMatchObject({status:'failed',completed_at:expect.any(String)});expect(JSON.parse(files.find(f=>f.path==='result.json')!.content)).toMatchObject({status:'failed',error:{code:'sandbox_request_failed'}});});
 it('recovers a queued response when a process really started despite a lost HTTP acknowledgement',async()=>{mock.exec.mockRejectedValueOnce({message:'response lost'});mock.get.mockResolvedValueOnce({status:'running'});expect(await startRun(input)).toMatchObject({run_id,status:'queued'});expect(mock.write).toHaveBeenCalledTimes(1);});
 it('keeps uncertain launches protected when the process cannot be inspected',async()=>{mock.exec.mockRejectedValueOnce({message:'response lost'});mock.get.mockRejectedValueOnce({message:'sandbox unreachable'});await expect(startRun(input)).rejects.toMatchObject({message:expect.stringContaining(run_id)});expect(mock.write).toHaveBeenCalledTimes(1);});
});
