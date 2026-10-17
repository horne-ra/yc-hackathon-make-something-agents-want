import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const mock=vi.hoisted(()=>({create:vi.fn(),list:vi.fn(),write:vi.fn(),exec:vi.fn()}));
vi.mock('@blaxel/core',()=>({SandboxInstance:{create:mock.create,list:mock.list}}));
import {startRun} from './runs.js';
import {RUN_DEADLINE_MS} from './retention.js';
const input=JSON.parse(readFileSync('runner/evidence/corrected-input.json','utf8'));
beforeEach(()=>{
 vi.resetAllMocks();vi.stubEnv('AXLINT_RUNNER_MODE','per-run');vi.useFakeTimers({now:0});
 for(const key of ['BL_API_KEY','BL_WORKSPACE','ANTHROPIC_API_KEY','AXLINT_MODEL'])vi.stubEnv(key,'test-only-value');
 mock.list.mockResolvedValue({async *[Symbol.asyncIterator](){}});
 mock.create.mockResolvedValue({fs:{writeTree:mock.write},process:{exec:mock.exec}});
});
afterEach(()=>{vi.useRealTimers();vi.unstubAllEnvs();});
describe('resource-limited run launch',()=>{
 it('launches a 256 MB / 2h15m VM with a bounded detached runner',async()=>{
  expect(await startRun(input)).toMatchObject({status:'queued',total_trials:24});
  expect(mock.create).toHaveBeenCalledWith(expect.objectContaining({memory:256,ttl:'2h15m'}));
  expect(mock.exec).toHaveBeenCalledWith(expect.objectContaining({timeout:840,keepAlive:true,waitForCompletion:false}));
 });
 it('subtracts preparation from the execution deadline',async()=>{
  mock.write.mockImplementationOnce(async()=>{vi.advanceTimersByTime(3*60000);});
  await startRun(input);expect(mock.exec.mock.calls[0]![0].timeout).toBe(660);
 });
 it('does not launch if preparation exhausts the retention-safe deadline',async()=>{
  mock.write.mockImplementationOnce(async()=>{vi.advanceTimersByTime(RUN_DEADLINE_MS+1);});
  await expect(startRun(input)).rejects.toMatchObject({code:'sandbox_request_failed',message:expect.stringContaining('preparation exceeded')});expect(mock.exec).not.toHaveBeenCalled();
 });
 it('rejects a bootstrap delivered after its absolute deadline before reading run files',async()=>{
  await startRun(input);const command=mock.exec.mock.calls[0]![0].command as string;
  const prefix="node --input-type=module -e '";expect(command.startsWith(prefix)).toBe(true);
  const result=spawnSync(process.execPath,['--input-type=module','-e',command.slice(prefix.length,-1)],{encoding:'utf8',timeout:2000});
  expect(result.status).toBe(1);expect(result.stderr).toContain('run_deadline_exceeded');expect(result.stderr).not.toContain('ENOENT');
 });
});
