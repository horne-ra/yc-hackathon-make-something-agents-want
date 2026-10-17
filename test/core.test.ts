import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import * as core from '../src/core/index.js';
import { compactOps, tasks, tools } from './fixtures/spec.js';
const source = readFileSync(new URL('./fixtures/trackr-tools.ts', import.meta.url), 'utf8');
const files = [{ path: 'src/tools.ts', content: source }, { path: 'src/validation.ts', content: 'export const STATUS_VALUES = ["open", "in_progress", "blocked", "closed"] as const;' }];
const findings = core.auditTools(tools);
const call = { name: 'list_issues', arguments: { limit: 50 } };
const expectedExplanation = 'Expected search_issues(query contains "checkout"); got list_issues(limit=50). Related finding F1: both tools read issues and neither says when to use it instead of the other.';
const sha = core.hashTools(tools);
const candidate = core.applyWireOps(tools, compactOps);
const generated = core.generateSourceEdits(files, compactOps);
const audit = { audit_id: 'aud_7f3c', server_url: 'https://trackr.example/mcp', server_version: 'trackr-demo-001@abc1234', tools_hash: sha, static_tool_tokens: 412, tools: tools.map(t => ({ name: t.name, description_chars: t.description!.length, params: core.parameterSummaries(t) })), findings };
const patch = { patch_id: 'pat_19ab', base_server_version: audit.server_version, base_tools_hash: sha, candidate_tools: candidate, candidate_tools_hash: core.hashTools(candidate), wire_ops: compactOps, ...generated, static_tool_tokens: { before: 412, after: 560 } };
const trial: core.Trial = { condition: 'baseline', index: 1, ...core.scoreTrial(tasks[0]!, call), chosen_tool: 'list_issues', args: { limit: 50 }, explanation: core.explain(tasks[0]!, call, findings), model_text: null, input_tokens: 640, output_tokens: 48, result_tokens: 31200, latency_ms: 2100 };
const result = { run_id: 'sandbox', provisional: true, label: core.provisionalLabel(3), config: { model: 'pinned-model-20261017', temperature: 0, trials: 3, server_version: audit.server_version, tasks_hash: core.hashJson({ tasks }), baseline_tools_hash: sha, candidate_tools_hash: core.hashTools(candidate) }, candidate_tools: candidate, static_tool_tokens: { baseline: 412, candidate: 560 }, tasks: [{ id: 't1-route', control: false, baseline: { passed: 0, of: 3, infra_errors: 0 }, candidate: { passed: 3, of: 3, infra_errors: 0 }, representative: { baseline_trial: 1, candidate_trial: 1 }, trials: [trial] }], totals: { baseline: { passed: 3, of: 12, result_tokens: 88400 }, candidate: { passed: 12, of: 12, result_tokens: 7300 } }, verdict: 'improved', verdict_reasons: ['t1-route rose 0/3 to 3/3'] };

describe('contract schemas and spec examples', () => {
  it('validates every fenced JSON example after replacing only illustrative placeholders', () => {
    const spec = readFileSync(new URL('../docs/SPEC.md', import.meta.url), 'utf8');
    const examples = [...spec.matchAll(/```json\n([\s\S]*?)\n```/g)].map(m => JSON.parse(m[1]!));
    expect(examples.length).toBe(7);
    const materialize = (v: unknown, key = ''): unknown => {
      if (Array.isArray(v)) return key === 'candidate_tools' ? candidate : v.map(x => materialize(x));
      if (v && typeof v === 'object') {
        if ('...' in v) return key === 'audit' ? audit : key === 'patch' ? patch : key === 'tasks' ? { tasks } : v;
        return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, materialize(val, k)]));
      }
      return typeof v === 'string' && v.startsWith('sha256:') ? sha : v;
    };
    const schemas = [core.TasksSchema, core.AuditSchema, core.ProposePatchInputSchema, core.PatchSpecSchema, core.VerifyPatchInputSchema, core.VerificationResultSchema, core.ConfirmPatchOutputSchema];
    examples.forEach((v, i) => expect(() => schemas[i]!.parse(materialize(v))).not.toThrow());
  });
  it('validates the inline tool inputs and queued/running outputs', () => {
    expect(core.AuditInputSchema.parse({ server_url: audit.server_url })).toBeTruthy();
    expect(core.GetVerificationResultInputSchema.parse({ run_id: 'sandbox' })).toBeTruthy();
    expect(core.ConfirmPatchInputSchema.parse({ server_url: audit.server_url, run_id: 'sandbox', expected_revision: 'def5678' })).toBeTruthy();
    expect(core.VerifyPatchOutputSchema.parse({ run_id: 'sandbox', status: 'queued', total_trials: 24 })).toBeTruthy();
    for (const status of core.RunStatusSchema.options) {
      const output = status === 'complete' ? { status, progress: { done: 24, total: 24 }, result } : status === 'failed' ? { status, error: { code: 'stale_patch', message: 'server changed' } } : { status, progress: { done: 11, total: 24 } };
      expect(() => core.GetVerificationResultOutputSchema.parse(output)).not.toThrow();
    }
  });
  it('accepts the provider-authorized omission of temperature without fabricating a value', () => {
    const config = { ...result.config };
    delete (config as { temperature?: number }).temperature;
    const parsed = core.VerificationResultSchema.parse({ ...result, config });
    expect(Object.hasOwn(parsed.config, 'temperature')).toBe(false);
  });
  it('rejects missing complete result, failed-without-error, invalid progress and invalid trials', () => {
    expect(core.GetVerificationResultOutputSchema.safeParse({ status: 'complete', progress: { done: 24, total: 24 } }).success).toBe(false);
    expect(core.GetVerificationResultOutputSchema.safeParse({ status: 'failed' }).success).toBe(false);
    expect(core.ProgressSchema.safeParse({ done: 25, total: 24 }).success).toBe(false);
    for (const n of [0, 2, 10, 3.5]) expect(core.TrialsSchema.safeParse(n).success).toBe(false);
    for (const n of [1, 3, 5, 7, 9]) expect(core.TrialsSchema.safeParse(n).success).toBe(true);
  });
  it('rejects forbidden wire operations and extra mutation fields', () => {
    for (const op of ['set_enum', 'set_default', 'rename_tool', 'remove_param']) expect(core.WireOpSchema.safeParse({ ...compactOps[0], op }).success).toBe(false);
    expect(core.WireOpSchema.safeParse({ ...compactOps[0], required: true }).success).toBe(false);
    expect(core.MatcherSchema.safeParse({ equals: 1, contains: '1' }).success).toBe(false);
  });
});

describe('scoring and deterministic explanation', () => {
  it('reproduces t1 baseline trial exactly including explanation', () => {
    expect(core.scoreTrial(tasks[0]!, call)).toEqual({ passed: false, failure: 'wrong_tool', checks: [{ what: 'tool', expected: 'search_issues', actual: 'list_issues', passed: false }] });
    expect(core.explain(tasks[0]!, call, findings)).toBe(expectedExplanation);
    expect(core.TrialSchema.parse(trial)).toEqual(trial);
  });
  it.each([
    [{ equals: false }, false, true, true], [{ equals: false }, undefined, false, false], [{ equals: 0 }, false, true, false],
    [{ contains: 'Maria' }, 'maria lopez', true, true], [{ contains: '1' }, 123, true, false],
    [{ oneOf: ['open', 'blocked'] }, 'blocked', true, true], [{ oneOf: [false] }, 0, true, false],
    [{ absent: true }, undefined, false, true], [{ absent: true }, null, true, false],
    [{ any: true }, null, true, true], [{ any: true }, undefined, false, false],
  ] as const)('matches %j against %j', (matcher, value, present, passed) => expect(core.matchArgument(matcher as core.Matcher, value, present)).toBe(passed));
  it('checks right-tool args, preserves false, ignores extra args, and handles no call/infra', () => {
    expect(core.scoreTrial(tasks[2]!, { name: 'list_issues', arguments: { status: 'open', assignee: 'MARIA', include_comments: false, limit: 10 } }).passed).toBe(true);
    const scored = core.scoreTrial(tasks[2]!, { name: 'list_issues', arguments: { status: 'open', assignee: 'maria' } });
    expect(scored.failure).toBe('bad_args');
    expect(scored.checks.at(-1)).toEqual({ what: 'args.include_comments', expected: { equals: false }, passed: false });
    expect(core.scoreTrial(tasks[0]!, null).failure).toBe('no_tool_call');
    expect(core.scoreTrial(tasks[0]!, call, 'timeout').failure).toBe('infra');
    expect(core.explain(tasks[0]!, call, findings, 'timeout')).toBe('Infrastructure error: timeout.');
    expect(core.explain(tasks[0]!, { name: 'search_issues', arguments: { query: 'checkout' } }, findings)).toContain('Passed.');
  });
});

describe('metadata canonicalization, hashes and wire ops', () => {
  it('sorts tools and every object key, preserves nested arrays and unknown fields', () => {
    const reordered = [...tools].reverse().map(t => ({ inputSchema: Object.fromEntries(Object.entries(t.inputSchema).reverse()), description: t.description!, name: t.name }));
    expect(core.hashTools(reordered)).toBe(sha);
    const extra = { ...tools[0]!, annotations: { readOnlyHint: true }, _meta: { ordered: ['b', 'a'] } };
    expect(core.canonicalize([extra])[0]).toEqual(extra);
    const reorderedArray = structuredClone(extra); reorderedArray._meta.ordered.reverse();
    expect(core.hashTools([extra])).not.toBe(core.hashTools([reorderedArray]));
    expect(core.canonicalize(tools).map(t => t.name)).toEqual(['get_issue', 'list_issues', 'search_issues']);
  });
  it('changes description fields only and does not mutate baseline', () => {
    const before = JSON.stringify(tools);
    expect(core.diffTools(tools, candidate).map(d => d.path)).toEqual([
      'tools.list_issues.description', 'tools.list_issues.inputSchema.properties.include_comments.description', 'tools.list_issues.inputSchema.properties.status.description', 'tools.search_issues.description',
    ]);
    expect(JSON.stringify(tools)).toBe(before);
    expect(core.hashTools(candidate)).not.toBe(sha);
    expect(() => core.applyWireOps(tools, [{ ...compactOps[0]!, tool: 'nonexistent' }])).toThrow('unknown_tool');
    expect(() => core.applyWireOps(tools, [{ ...compactOps[2]!, op: 'set_param_description', param: 'nonexistent' }])).toThrow('unknown_parameter');
    expect(() => core.applyWireOps(tools, [{ ...compactOps[0]!, op: 'set_enum' } as unknown as core.WireOp])).toThrow();
  });
  it('reports additionalProperties, required, additions, removals and array positions', () => {
    const changed = structuredClone(tools);
    changed[0]!.inputSchema.additionalProperties = true;
    changed[0]!.inputSchema.required = ['status'];
    changed[1]!.inputSchema.required = ['query', 'include_comments'];
    const paths = core.diffTools(tools, changed).map(d => d.path);
    expect(paths).toEqual(['tools.list_issues.inputSchema.additionalProperties', 'tools.list_issues.inputSchema.required', 'tools.search_issues.inputSchema.required[1]']);
    expect(core.diffTools(tools, tools.slice(1))[0]!.path).toBe('tools.list_issues');
    expect(core.diffTools([], [tools[0]!])[0]!.live).toEqual(core.canonicalize([tools[0]!])[0]);
  });
});

describe('trackr source edit generator', () => {
  it('generates sequential unique replacements, source hashes and a standard unified diff', () => {
    expect(generated.source_edits).toHaveLength(4);
    expect(generated.base_source_hashes['src/tools.ts']).toBe(core.hashText(source));
    expect(generated.base_source_hashes['src/validation.ts']).toBe(core.hashText(files[1]!.content));
    expect(generated.unified_diff).toContain('--- a/src/tools.ts');
    expect(generated.unified_diff).toContain('+++ b/src/tools.ts');
    expect(generated.unified_diff).toContain('@@');
    let applied = source;
    for (const edit of generated.source_edits) { expect(applied.split(edit.find)).toHaveLength(2); applied = applied.replace(edit.find, () => edit.replace); }
    expect(applied).toContain('status: z.string().optional().describe(');
    // This local schema check covers Zod emission only; S3's real server fidelity is separate.
    const evaluate = (text: string) => new Function('z', text.replace(/^import .*;\n/m, '').replace(/export const /g, 'const ') + '; return [listIssues, searchIssues, getIssue];')(z) as { name: string; description: string; params: z.ZodRawShape }[];
    const emitted = evaluate(applied).map(t => ({ name: t.name, description: t.description, inputSchema: z.toJSONSchema(z.object(t.params)) })) as core.Tool[];
    for (const op of compactOps) {
      const tool = emitted.find(t => t.name === op.tool)!;
      if (op.op === 'set_tool_description') expect(tool.description).toBe(op.value);
      else expect((tool.inputSchema.properties as Record<string, Record<string, unknown>>)[op.param]!.description).toBe(op.value);
    }
  });
  it('JSON-escapes quotes, backslashes, newlines, braces and dollar syntax', () => {
    const value = 'Use "quoted" \\ paths\n{literal} $& $1';
    for (const op of [compactOps[0]!, compactOps[2]!]) {
      const out = core.generateSourceEdits(files, [{ ...op, value }]);
      expect(out.source_edits[0]!.replace).toContain(JSON.stringify(value));
      expect(out.source_edits[0]!.replace.split('\n')).toHaveLength(1);
    }
  });
  it('replaces existing describe exactly once and leaves handler/validation sources unchanged', () => {
    const first = generated.source_edits.reduce((s, e) => s.replace(e.find, () => e.replace), source);
    const out = core.generateSourceEdits([{ path: 'src/tools.ts', content: first }, files[1]!], [{ ...compactOps[2]!, value: 'Replacement' }]);
    expect(out.source_edits[0]!.replace).toContain('.optional().describe("Replacement"),');
    expect(out.source_edits[0]!.replace.match(/describe/g)).toHaveLength(1);
    expect(out.source_edits.every(e => e.file === 'src/tools.ts')).toBe(true);
    expect(core.generateSourceEdits(files, []).unified_diff).toBe('');
  });
  it.each([
    ['missing name', source.replace('name: "list_issues"', 'name: "other"')],
    ['duplicate tool', source + source],
    ['single quote description', source.replace('description: "List issues.",', "description: 'List issues.',")],
    ['multiline description', source.replace('description: "List issues.",', 'description: `List\nissues.`,')],
    ['duplicate description', source.replace('description: "List issues.",', 'description: "List issues.",\n  description: "Other",')],
  ])('fails safely for %s', (_label, content) => expect(() => core.generateSourceEdits([{ path: 'src/tools.ts', content }], [compactOps[0]!])).toThrow('unsupported_layout'));
  it('fails safely for absent/ambiguous param, alternate describe and duplicate paths', () => {
    const run = (content: string) => core.generateSourceEdits([{ path: 'src/tools.ts', content }], [compactOps[2]!]);
    expect(() => run(source.replace('status: z.string().optional(),', 'status: z.string()\n.optional(),'))).toThrow('unsupported_layout');
    expect(() => run(source.replace('status: z.string().optional(),', 'status: z.string().describe(`unsupported`),'))).toThrow('unsupported_layout');
    expect(() => run(source.replace('status: z.string().optional(),', 'status: z.string(),\n    status: z.string(),'))).toThrow('unsupported_layout');
    expect(() => core.generateSourceEdits([files[0]!, files[0]!], compactOps)).toThrow('unsupported_layout');
    expect(() => run(source.replace('status: z.string().optional(),', 'status: z.string(), another: z.string(),'))).toThrow('unsupported_layout');
  });
  it('warns instead of rejecting excessive descriptions and unmatched declared values', () => {
    expect(core.validateDescriptionWarnings(files, compactOps)).toEqual([]);
    expect(core.validateDescriptionWarnings([files[0]!], compactOps).map(w => w.code)).toEqual(['unverified_allowed_values']);
    expect(core.validateDescriptionWarnings(files, [{ ...compactOps[2]!, value: 'One of: active, done.' }]).map(w => w.code)).toEqual(['unverified_allowed_values']);
    expect(core.validateDescriptionWarnings(files, [{ ...compactOps[0]!, value: 'x'.repeat(1001) }]).map(w => w.code)).toEqual(['description_too_long']);
  });
});

const summary = (passed: number, infra_errors = 0): core.ConditionSummary => ({ passed, of: 3 - infra_errors, infra_errors });
const taskResult = (id: string, baseline: number, candidate: number, control = false, errors = 0) => ({ id, control, baseline: summary(baseline), candidate: summary(candidate, errors) });
describe('verdict and trial aggregation', () => {
  it('makes missing control inconclusive despite large gains', () => expect(core.evaluateVerdict([taskResult('gain', 0, 3), taskResult('control', 3, 1, true, 2)]).verdict).toBe('inconclusive'));
  it('makes any one-task drop of one inconclusive', () => expect(core.evaluateVerdict([taskResult('gain', 0, 3), taskResult('drop', 3, 2)]).verdict).toBe('inconclusive'));
  it('makes observed control regression win over gains and missing evidence', () => expect(core.evaluateVerdict([taskResult('gain', 0, 3), taskResult('control', 3, 2, true), taskResult('missing', 0, 0, false, 2)]).verdict).toBe('regressed'));
  it('makes non-control drop of two regressed, and unchanged/single gain inconclusive', () => {
    expect(core.evaluateVerdict([taskResult('drop', 3, 1)]).verdict).toBe('regressed');
    expect(core.evaluateVerdict([taskResult('same', 3, 3)]).verdict).toBe('inconclusive');
    expect(core.evaluateVerdict([taskResult('small', 1, 2)]).verdict).toBe('inconclusive');
    expect(core.evaluateVerdict([]).verdict).toBe('inconclusive');
  });
  it('reports sufficient gains, unchanged control and reasons without token influence', () => {
    expect(core.evaluateVerdict([taskResult('t1-route', 0, 3), taskResult('t4-control', 3, 3, true)])).toEqual({ verdict: 'improved', verdict_reasons: ['t1-route rose 0/3 to 3/3', 't4-control unchanged at 3/3'] });
  });
  it('excludes infra from passes/of, retains its count and picks earliest majority representative', () => {
    const trials: core.Trial[] = [{ ...trial, index: 3, passed: true, failure: null }, { ...trial, index: 1, passed: true, failure: null }, { ...trial, index: 2, failure: 'infra' }];
    expect(core.summarizeCondition(trials)).toEqual({ passed: 2, of: 2, infra_errors: 1, insufficient_data: false });
    expect(core.representativeTrial(trials)).toBe(1);
    expect(core.summarizeCondition([{ ...trial, failure: 'infra' }, { ...trial, index: 2, failure: 'infra' }]).insufficient_data).toBe(true);
    expect(core.representativeTrial([{ ...trial, failure: 'infra' }])).toBeNull();
    expect(core.representativeTrial([trial, { ...trial, index: 2, passed: true, failure: null }])).toBeNull();
  });
});

describe('deterministic audit', () => {
  it('returns F1-F3 and excludes required-id lookups from overlap', () => {
    expect(findings.slice(0, 3).map(f => [f.id, f.kind, f.param])).toEqual([['F1', 'sibling_overlap', undefined], ['F2', 'unconstrained_string', 'status'], ['F3', 'payload_control_undocumented', 'include_comments']]);
    expect(findings.filter(f => f.kind === 'sibling_overlap')).toHaveLength(1);
    expect(findings[0]!.tools).toEqual(['list_issues', 'search_issues']);
    expect(core.auditTools(candidate).filter(f => f.kind === 'sibling_overlap')).toEqual([]);
    expect(core.auditTools(candidate).some(f => f.id === 'F1')).toBe(false);
  });
  it('covers every finding kind including long descriptions and missing output schema', () => {
    const all = core.auditTools([...tools, { name: 'opaque', inputSchema: { type: 'object', properties: {} } }, { name: 'long', description: 'x'.repeat(1001), inputSchema: { type: 'object', properties: {} } }]);
    expect(new Set(all.map(f => f.kind))).toEqual(new Set(core.FindingKindSchema.options));
    expect(all.find(f => f.kind === 'description_too_long')!.severity).toBe('warning');
  });
  it('uses the exact four overlap conditions and fixed read verbs', () => {
    const a = tools[0]!, b = tools[1]!;
    expect(core.auditTools([a, { ...b, description: 'Use list_issues for filters.' }]).some(f => f.kind === 'sibling_overlap')).toBe(false);
    expect(core.auditTools([{ ...a, description: 'x'.repeat(60) }, { ...b, description: 'x'.repeat(60) }]).some(f => f.kind === 'sibling_overlap')).toBe(false);
    expect(core.auditTools([a, { ...b, name: 'delete_issues' }]).some(f => f.kind === 'sibling_overlap')).toBe(false);
    const lookup = { ...tools[2]!, name: 'get_issues' };
    expect(core.auditTools([a, lookup]).some(f => f.kind === 'sibling_overlap')).toBe(false);
    expect(core.auditTools([a, { ...lookup, inputSchema: { properties: { id: { type: 'string' } } } }]).some(f => f.kind === 'sibling_overlap')).toBe(true);
  });
});
