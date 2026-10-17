import {describe,it,expect,vi} from 'vitest';
const {start}=vi.hoisted(()=>({start:vi.fn()}));
vi.mock('../blaxel/runs.js',()=>({startRun:start}));
import {verifyPatchHandler} from './verify-patch.js';
import {readFileSync} from 'node:fs';
const input=JSON.parse(readFileSync('runner/evidence/corrected-input.json','utf8'));
describe('verify_patch public failures',()=>{
 it('returns an MCP error with capacity_exhausted instead of object coercion',async()=>{start.mockRejectedValueOnce({error:{code:'QUOTA_EXCEEDED',message:'10 slots'}});const response=await verifyPatchHandler(input);expect(response.isError).toBe(true);expect(JSON.parse(response.content[0]!.text)).toMatchObject({error:{code:'capacity_exhausted',message:expect.stringContaining('capacity is exhausted')}});expect(response.content[0]!.text).not.toContain('[object Object]');});
 it('returns a named plain error for an unstructured provider failure',async()=>{start.mockRejectedValueOnce({body:{message:'provider offline'}});const response=await verifyPatchHandler(input);expect(response.isError).toBe(true);expect(JSON.parse(response.content[0]!.text)).toMatchObject({error:{code:'sandbox_request_failed',message:expect.stringContaining('provider offline')}});});
});
