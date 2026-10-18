import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { auditServer, type Metadata } from './audit.js';
import { proposePatch, modelSubmission, type ProposalAttempt } from './propose.js';
import { auditTools, hashTools, parameterSummaries, type WireOp, type Tool } from '../core/index.js';
import { listIssuesTool, searchIssuesTool, getIssueTool } from '../../test/fixtures/trackr-tools.js';
const definitions = [listIssuesTool, searchIssuesTool, getIssueTool];
const tools = definitions.map(t => ({ name: t.name, description: t.description, inputSchema: z.toJSONSchema(z.object(t.params)) })) as Tool[];
const metadata: Metadata = { server_version: 'trackr-demo-001@baseline', tools };
const audit = { audit_id: 'aud_test', server_url: 'https://trackr.test/mcp', server_version: metadata.server_version, tools_hash: hashTools(tools), static_tool_tokens: 651, tools: tools.map(t => ({ name: t.name, description_chars: t.description!.length, params: parameterSummaries(t) })), findings: auditTools(tools) };
const source = `import { z } from 'zod';\nexport const listIssuesTool = {\n name: "list_issues",\n description: "List issues.",\n params: {\n  status: z.string().optional(),\n  include_comments: z.boolean().optional(),\n },\n};\nexport const searchIssuesTool = {\n name: "search_issues",\n description: "Search issues.",\n params: {\n query: z.string(),\n },\n};\n`;
const ops: WireOp[] = [{ op: 'set_tool_description', tool: 'list_issues', value: 'Filter structured issues; search_issues handles keywords.', finding_ids: ['F1'] }, { op: 'set_param_description', tool: 'list_issues', param: 'status', value: 'One of: open, in_progress, blocked, closed.', finding_ids: ['F2'] }, { op: 'set_param_description', tool: 'list_issues', param: 'include_comments', value: 'Defaults true; set false for a quick list.', finding_ids: ['F3'] }];
const input = { audit, source_files: [{ path: 'src/tools.ts', content: source }, { path: 'src/validation.ts', content: 'export const STATUS_VALUES = ["open", "in_progress", "blocked", "closed"] as const;' }, { path: 'src/handlers.ts', content: 'export function listIssues(args: {include_comments?: boolean}) { return args.include_comments ?? true; }' }], finding_ids: ['F1', 'F2', 'F3'] };
const deps = { readMetadata: async () => metadata, countStaticTokens: async () => 800 };
describe('S7 audit/proposal validation', () => {
 it('audit exposes metadata only and returns deterministic first findings', async () => { const result = await auditServer({ server_url: audit.server_url }, deps); expect(result.findings[0]).toMatchObject({id:'F3',kind:'size_control_undocumented',severity:'high'}); expect(result.server_version).toBe(metadata.server_version); expect(result.findings.find(f => f.id === 'F2')?.param).toBe('status'); expect(result.findings.find(f => f.id === 'F3')?.param).toBe('include_comments'); });
 it('rejects nonexistent parameter twice and retains both rejected attempts', async () => { const attempts: ProposalAttempt[] = []; await expect(proposePatch(input, { ...deps, propose: async () => ({ wire_ops: ops.map(op => op.op === 'set_param_description' && op.param === 'status' ? { ...op, param: 'does_not_exist' } : op) }), onAttempt: a => { attempts.push(a); } })).rejects.toThrow('unknown_parameter'); expect(attempts.map(a => a.status)).toEqual(['rejected', 'rejected']); });
 it('retries validation once with exact error then derives edits from valid ops', async () => { const errors: (string | undefined)[] = []; let calls = 0; const result = await proposePatch(input, { ...deps, propose: async (_prompt, error) => { errors.push(error); return ++calls === 1 ? { wire_ops: [{ ...ops[0], op: 'set_default' }] } : { wire_ops: ops }; } }); expect(errors[1]).toBeTruthy(); expect(result.wire_ops).toEqual(ops); expect(result.source_edits).toHaveLength(3); expect(result.warnings).toEqual([expect.objectContaining({code:'missing_default',tool:'list_issues',param:'status'})]); expect(result.candidate_tools_hash).toBe(hashTools(result.candidate_tools)); });
 it('rejects stale audits before any model call', async () => { let called = false; await expect(proposePatch(input, { ...deps, readMetadata: async () => ({ ...metadata, server_version: 'changed@revision' }), propose: async () => { called = true; return {}; } })).rejects.toThrow('stale_audit'); expect(called).toBe(false); });
 it('full style requests examples without broadening allowed ops', async () => { let prompt = ''; await proposePatch({ ...input, style: 'full' }, { ...deps, propose: async p => { prompt = p; return { wire_ops: ops }; } }); expect(prompt).toContain('output and examples'); });
 it('warns on descriptions exceeding 1000 chars and missing defaults', async () => { const modified = ops.map(op => op.op === 'set_param_description' && op.param === 'status' ? { ...op, value: 'Filter by status. ' + 'x'.repeat(1001) } : op); const result = await proposePatch(input, { ...deps, propose: async () => ({ wire_ops: modified }) }); expect(result.warnings!.map(w => w.code)).toEqual(['description_too_long', 'missing_default']); });
 it.each(['missing', 'multiple', 'wrong'] as const)('retries %s model tool submission once as a validation failure', async kind => {
   const valid = { type: 'tool_use' as const, id: 'tool_test', caller: { type: 'direct' as const }, name: 'submit_wire_ops', input: { wire_ops: ops } };
   const bad = kind === 'missing' ? [] : kind === 'wrong' ? [{ ...valid, name: 'wrong_tool' }] : [valid, { ...valid, id: 'other' }];
   let calls = 0; const errors: (string | undefined)[] = []; const attempts: ProposalAttempt[] = [];
   await proposePatch(input, { ...deps, propose: async (_prompt, error) => { errors.push(error); return modelSubmission(++calls === 1 ? bad : [valid]); }, onAttempt: a => { attempts.push(a); } });
   expect(calls).toBe(2); expect(errors[1]).toContain('invalid_model_response'); expect(attempts.map(a => a.status)).toEqual(['rejected', 'accepted']);
 });
 it('does not retry provider errors as semantic validation', async () => { let calls = 0; await expect(proposePatch(input, { ...deps, propose: async () => { calls++; throw new Error('provider unavailable'); } })).rejects.toThrow('provider unavailable'); expect(calls).toBe(1); });
 it('does not regenerate a valid proposal when token counting fails', async () => { let calls = 0; await expect(proposePatch(input, { ...deps, propose: async () => { calls++; return { wire_ops: ops }; }, countStaticTokens: async () => { throw new Error('count unavailable'); } })).rejects.toThrow('count unavailable'); expect(calls).toBe(1); });

 it('retries source-absence hedges once, keeping both attempts visible', async()=>{
  const attempts:ProposalAttempt[]=[];let calls=0;
  const result=await proposePatch(input,{...deps,propose:async(prompt,error)=>{
   expect(prompt).toContain('If a fact is absent from the provided files, omit it entirely');
   expect(prompt).toContain('highest-severity');
   if(calls++)expect(error).toContain('unsupported_source_claim');
   return{wire_ops:calls===1?ops.map((op,index)=>index===0?{...op,value:'Output format is not documented in source.'}:op):ops};
  },onAttempt:attempt=>{attempts.push(attempt);}});
  expect(result.wire_ops).toEqual(ops);expect(attempts.map(a=>a.status)).toEqual(['rejected','accepted']);
 });
 it('warns for omitted parameter facts in a tools-only proposal without inventing them',async()=>{
  const safe=ops.map(op=>op.op==='set_param_description'?{...op,value:op.param==='status'?'Filter issues by status.':'Control comments in the response.'}:op);
  const result=await proposePatch({...input,source_files:input.source_files.slice(0,1)},{...deps,propose:async()=>({wire_ops:safe})});
  expect(result.warnings).toEqual(expect.arrayContaining([expect.objectContaining({code:'missing_allowed_values',param:'status'}),expect.objectContaining({code:'missing_default',param:'include_comments'})]));
  expect(result.wire_ops.every(op=>!op.value.includes('not defined'))).toBe(true);
 });

});
