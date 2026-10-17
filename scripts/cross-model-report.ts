import assert from 'node:assert/strict';
import { readFile, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { evaluateVerdict, hashTools, ToolsSchema, type ConditionSummary } from '../src/core/index.js';
import { summarizeConsistency, type Trial } from './hand-run-common.js';

type Summary = { task_id: string; control: boolean; unscored: boolean; baseline: ConditionSummary & { result_tokens: number }; candidate: ConditionSummary & { result_tokens: number } };
type Report = { status: string; model: string; temperature: string; system: string; max_tokens: number; tool_choice: string; shuffle_seed: number; concurrency: number; tasks: unknown[]; provenance: { patch: unknown }; baseline_tools: Tool[]; candidate_tools: Tool[]; static_tool_tokens: { baseline: number; candidate: number; approximate: boolean }; trials: Trial[]; summary: Summary[]; server_identity?: unknown };
const paths = {
  memory: { sonnet: 'scripts/results/memory-2026-10-17T19-34-10.561Z/result.json', haiku: 'scripts/results/memory-2026-10-17T21-41-09.662Z/result.json' },
  trackr: { sonnet: 'scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json', haiku: 'scripts/results/trackr-2026-10-17T21-41-08.977Z/result.json' },
};
const number = (value: number) => value.toLocaleString('en-US');
const arrow = (a: number, b: number) => `${number(a)} → ${number(b)}`;
const totals = (report: Report, condition: 'baseline' | 'candidate', scoredOnly: boolean) => report.summary.filter(s => !scoredOnly || !s.unscored).reduce((sum, s) => sum + s[condition].result_tokens, 0);
const passes = (report: Report, condition: 'baseline' | 'candidate') => {
  const rows = report.summary.filter(s => !s.unscored);
  return `${rows.reduce((sum, s) => sum + s[condition].passed, 0)}/${rows.reduce((sum, s) => sum + s[condition].of, 0)}`;
};
function verdict(report: Report) {
  return evaluateVerdict(report.summary.filter(s => !s.unscored).map(s => ({ id: s.task_id, control: s.control, baseline: s.baseline, candidate: s.candidate })));
}
const title = (value: string) => value[0].toUpperCase() + value.slice(1);
const flag = (item: ReturnType<typeof summarizeConsistency>[number]) => !item.disagree ? 'agree' : [item.call_disagreement && 'calls', item.outcome_disagreement && 'outcomes', item.result_token_disagreement && 'tokens'].filter(Boolean).join(', ');
const output: string[] = [
  '# Cross-model benchmark: Sonnet 5.5 versus Haiku 5.5', '',
  '**The patch mattered more for Haiku on Trackr:** scored passes rose 6/12 → 12/12 (+6), versus Sonnet’s 9/12 → 12/12 (+3). **On Memory it mattered the same:** both models passed 9/9 in both conditions, with no observed patch benefit.', '',
  'Provisional: 3 trials per condition. A demonstration, not a statistical claim.', '',
  '## Model and protocol', '',
  'Before any benchmark model call, authenticated GET /v1/models listed **claude-haiku-5-5**, displayed as Claude Haiku 5.5, created 2026-10-07T18:00:00Z. GET /v1/models/claude-haiku-5-5 confirmed that exact ID; no dated Haiku 5.5 snapshot appeared. Evidence checked at 2026-10-17T21:40:38.888Z is retained in [preflight.json](../scripts/cross-model-evidence/preflight.json), pushed before trials in cf005dd.', '',
  'Runs use a process-only AXLINT_MODEL=claude-haiku-5-5 override. The shared .env and production Sonnet setting are unchanged. Same harness entrypoints, tasks, prompts, scorers, candidate patches, seeds, max_tokens=300, automatic tool choice, single turn, three trials per task and condition, and four-worker limit. Provider-default sampling; temperature is never sent. The only shared-harness edit removes a legacy non-Sonnet temperature:0 fallback and records default sampling for every model. Neither entrypoint, tasks, scoring, fixture nor patch changed.', '',
  'Sonnet values are the retained successful runs cited in [docs/gate-results.md](gate-results.md), not reruns. Byte-for-byte equality checks cover tasks, neutral system prompt, baseline/candidate tools and patch provenance between models. Memory uses pinned official server bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c, all nine tools visible, the same fictional seed, dispatch-enforced read allowlist, and one fresh process/graph per trial.', '',
  'Trackr ran against https://trackr-production-e1a6.up.railway.app/mcp. Before both model runs, the live baseline descriptions and complete tools hash matched the frozen baseline: sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5. Haiku serverInfo.version and every trial identity report trackr-demo-001@f9b6c2beae2ec8c5774a7b902349618052582f2f. This is the new revert SHA; source metadata matches the earlier Sonnet deployment. Both metadata conditions execute against that identical baseline deployment; patches affect only model-visible descriptions. No source edits were applied.', '',
  'Result tokens use countTokens on the complete serialized MCP response, including content and structuredContent where present. They measure potential returned context; the one-turn model does not consume tool results. Static tool-definition tokens are separate. There are no approximate counts, provider retries or infrastructure failures in either new run. All 48 trials, including failures and unscored boundary calls, are retained.', '',
];
const checks: string[] = [];
for (const [server, files] of Object.entries(paths)) {
  const sonnet = JSON.parse(await readFile(files.sonnet, 'utf8')) as Report;
  const haiku = JSON.parse(await readFile(files.haiku, 'utf8')) as Report;
  assert.equal(sonnet.model, 'claude-sonnet-5-5');
  assert.equal(haiku.model, 'claude-haiku-5-5');
  for (const field of ['tasks', 'system', 'max_tokens', 'tool_choice', 'shuffle_seed', 'concurrency', 'baseline_tools', 'candidate_tools'] as const) assert.deepEqual(haiku[field], sonnet[field], `${server}: unchanged ${field}`);
  assert.deepEqual(haiku.provenance.patch, sonnet.provenance.patch);
  for (const [model, report] of Object.entries({ sonnet, haiku })) {
    assert.equal(report.status, 'complete'); assert.equal(report.temperature, 'omitted; model-default sampling');
    assert.equal(report.trials.length, 24); assert.equal(report.static_tool_tokens.approximate, false);
    const rows = report.trials;
    assert.ok(rows.every(t => t.failure !== 'infra' && !t.result_tokens_approximate));
    const consistency = summarizeConsistency(rows);
    assert.equal(consistency.length, 8);
    for (const item of consistency) { assert.equal(item.trial_count, 3); assert.deepEqual(item.trial_ids, [1, 2, 3]); }
    for (const s of report.summary) for (const c of ['baseline', 'candidate'] as const) {
      const group = rows.filter(t => t.task_id === s.task_id && t.condition === c);
      assert.equal(group.reduce((sum, t) => sum + t.result_tokens, 0), s[c].result_tokens);
      if (!s.unscored) assert.equal(group.filter(t => t.passed).length, s[c].passed);
    }
    checks.push(`PASS ${server}/${model}: 24 trials; all eight groups contain trials 1,2,3; exact token counts and summaries; no infra`);
  }
  assert.ok(haiku.trials.every(t => t.attempts.length === 1 && (t.attempts[0] as { status: string }).status === 'ok'));
  if (server === 'memory') {
    const identities = haiku.trials.map(t => t.server_pid as { pid: number; memory_file: string; commit: string });
    assert.equal(new Set(identities.map(i => i.pid)).size, 24);
    assert.equal(new Set(identities.map(i => i.memory_file)).size, 24);
    for (const i of identities) { assert.equal(i.commit, 'bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c'); await assert.rejects(access(i.memory_file)); }
    assert.ok(haiku.trials.every(t => t.executed && ['read_graph', 'search_nodes', 'open_nodes'].includes(t.tool!)));
    checks.push('PASS memory/haiku: 24 unique server PIDs/graph copies; every graph removed; only allowlisted reads executed');
  } else {
    assert.equal(hashTools(ToolsSchema.parse(haiku.baseline_tools)), 'sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5');
    for (const t of haiku.trials) assert.deepEqual(t.server_pid, { name: 'trackr', version: 'trackr-demo-001@f9b6c2beae2ec8c5774a7b902349618052582f2f' });
    checks.push('PASS trackr/haiku: exact frozen baseline hash; all 24 trials use the deployed revert SHA');
  }
  checks.push(`PASS ${server}: tasks/prompts/scoring entrypoints and baseline/candidate metadata unchanged across models; candidate patch provenance identical`);
  const passText = (s: Summary, c: 'baseline' | 'candidate') => s.unscored ? 'unscored' : `${s[c].passed}/${s[c].of}`;
  output.push(`## ${title(server)}`, '',
    '| Task | Sonnet passes B → C | Haiku passes B → C | Sonnet result tokens B → C | Haiku result tokens B → C |',
    '| --- | --- | --- | ---: | ---: |',
    ...sonnet.summary.map((s, i) => { const h = haiku.summary[i]; assert.equal(s.task_id, h.task_id); return `| ${s.task_id}${s.control ? ' (control)' : s.unscored ? ' (unscored)' : ''} | ${passText(s, 'baseline')} → ${passText(s, 'candidate')} | ${passText(h, 'baseline')} → ${passText(h, 'candidate')} | ${arrow(s.baseline.result_tokens, s.candidate.result_tokens)} | ${arrow(h.baseline.result_tokens, h.candidate.result_tokens)} |`; }), '',
    '| Model | Scored passes B → C | Scored result tokens B → C | Static tool tokens B → C | Ordered verdict |', '| --- | --- | ---: | ---: | --- |',
    ...[sonnet, haiku].map(r => `| ${r.model} | ${passes(r, 'baseline')} → ${passes(r, 'candidate')} | ${arrow(totals(r, 'baseline', true), totals(r, 'candidate', true))} | ${arrow(r.static_tool_tokens.baseline, r.static_tool_tokens.candidate)} | **${title(verdict(r).verdict)}** |`), '',
    ...[sonnet, haiku].map(r => `${r.model}: ${verdict(r).verdict_reasons.join('; ')}. Unscored tasks are excluded from the verdict.`), '',
    '| Task | Sonnet baseline | Sonnet candidate | Haiku baseline | Haiku candidate |', '| --- | --- | --- | --- | --- |',
    ...sonnet.summary.map(s => { const flags = [sonnet, haiku].flatMap(r => ['baseline', 'candidate'].map(c => flag(summarizeConsistency(r.trials).find(f => f.task_id === s.task_id && f.condition === c)!))); return `| ${s.task_id} | ${flags.join(' | ')} |`; }), '',
    `Evidence: [Sonnet result](../${files.sonnet}), [Haiku result](../${files.haiku}), [Haiku full trial table](../${files.haiku.replace('result.json', 'table.md')}), [captured harness output](../scripts/cross-model-evidence/haiku-${server}.log).`, '');
  if (server === 'memory') output.push('Both verdicts are **Inconclusive** under the ordered rules: no regression or insufficient data, but no scored task gains two passes. Scored result totals are identical in both conditions and both models. Including unscored boundary calls, Sonnet totals are 789,636 → 789,636; Haiku totals are 764,871 → 764,871. On the boundary Haiku consistently searched the combined string "Priya Nair checkout migration", returning an empty match (73 tokens), versus Sonnet’s "Priya Nair" (8,328 tokens). That unscored difference is not evidence of better task success or a patch benefit.', '');
  else output.push('Haiku has two within-condition flags, with **no pass/fail disagreement**: t1-route candidate omits include_comments in trials 2 and 3 (6,570 tokens each) but sets false in trial 1 (344); t2-status baseline omits status in trials 1 and 3 (80,949 tokens each) and sends invalid "in progress" in trial 2 (41-token tool validation error). All three status baseline calls fail the unchanged scorer; every failure remains in the evidence. Other Haiku groups agree; every Sonnet group agrees.', '',
    'Trackr’s patch gains six passes for Haiku, compared with three for Sonnet: Haiku additionally needs the documented in_progress spelling. Both models already pass routing and exact-issue lookup 3/3. Potential returned result tokens fall 88.4% for Haiku (220,823 → 25,724), versus 88.5% for Sonnet (115,194 → 13,272); accuracy gains are larger for Haiku while its routing payload reduction is less consistent. Static cost rises 651 → 837 for both. Tokens do not determine either Improved verdict.', '');
}
// The model comparison must not alter the benchmark entrypoints or scoring implementation.
assert.equal(execFileSync('git', ['diff', 'origin/main', '--', 'scripts/hand-run.ts', 'scripts/hand-run-memory.ts'], { encoding: 'utf8' }), '');
checks.push('PASS unchanged harness entrypoints: git diff origin/main -- scripts/hand-run.ts scripts/hand-run-memory.ts is empty');
output.push('## Checks run', '', '```text',
  'pnpm typecheck: exit 0',
  'hand-run-memory.ts --check: nine tools; dispatch blocks delete_entities; deterministic seed size; compiled source fidelity exact',
  'hand-run.ts --check: exact baseline descriptions; control unchanged; TRK-117 succeeds; deployed revert SHA',
  'hand-run-memory.ts: exit 0; 24 Haiku trials retained',
  'hand-run.ts: exit 0; 24 Haiku trials retained',
  ...checks, '```', '',
  'Only scripts/ and docs/ are changed on lane/models. No new dependency, package/lockfile edit, source apply, Manufact change or main merge. Existing ignored vendor/build dependencies were reused. The prior production stability work remains paused for the user’s deployment-branch confirmation.', '');
await writeFile('docs/cross-model-results.md', output.join('\n'));
await writeFile('scripts/cross-model-evidence/validation.log', checks.join('\n') + '\n');
console.log(checks.join('\n'));
console.log('Wrote docs/cross-model-results.md');
