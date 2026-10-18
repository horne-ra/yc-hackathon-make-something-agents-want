import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, symlink, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { evaluateVerdict } from '../../src/core/verdict.ts';
import { checkSources } from './control.mjs';
const workspace = process.cwd(), directory = resolve(process.argv[2]);
const load = async path => JSON.parse(await readFile(path, 'utf8'));
const execution = await load(join(directory, 'execution.json'));
assert.equal(execution.status, 'complete'); assert.equal(execution.temporary_deleted, true);
assert.deepEqual(await checkSources(), execution.sources);
const source = 'scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json';
const references = { filesystem: await load('scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/result.json'), trackr: await load(source) };
const reports = { filesystem: await load(join(directory, 'filesystem/result.json')), trackr: await load(join(directory, 'trackr/result.json')) };
const audit = await load(join(directory, 'earlier-300-audit.json'));
let retainedTrackr;
try { retainedTrackr = await load(join(directory, 'trackr-tool-receipts.json')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const temporary = await mkdtemp(join(tmpdir(), 'axlint-max-tokens-verify-'));
let fsScorer;
try {
  await mkdir(join(temporary, 'vendor'));
  await symlink(process.env.AXLINT_FILESYSTEM_SOURCE ?? '/Users/ransomhorne/Documents/yc-hackathon-make-something-agents-want/vendor/mcp-servers', join(temporary, 'vendor/mcp-servers'));
  process.chdir(temporary);
  fsScorer = await import(pathToFileURL(join(workspace, 'scripts/filesystem-prompt-check/harness/hand-run-filesystem.ts')).href);
} finally { process.chdir(workspace); await rm(temporary, { recursive: true, force: true }); }
const title = value => value[0].toUpperCase() + value.slice(1);
const verdict = report => {
  const tasks = report.summary.filter(task => !task.unscored).map(task => ({ id: task.task_id, control: task.control, baseline: task.baseline, candidate: task.candidate }));
  return { ...evaluateVerdict(tasks), scored_baseline: tasks.reduce((sum, task) => sum + task.baseline.passed, 0), scored_candidate: tasks.reduce((sum, task) => sum + task.candidate.passed, 0), baseline_of: tasks.reduce((sum, task) => sum + task.baseline.of, 0), candidate_of: tasks.reduce((sum, task) => sum + task.candidate.of, 0) };
};
const trackrScore = (task, row) => {
  if (row.tool !== task.expect.tool) return { passed: false, failure: 'wrong_tool' };
  const pass = Object.entries(task.expect.args ?? {}).every(([key, matcher]) => {
    const value = row.arguments[key];
    if ('equals' in matcher) return value === matcher.equals;
    if ('contains' in matcher) return typeof value === 'string' && value.toLowerCase().includes(matcher.contains.toLowerCase());
    if ('oneOf' in matcher) return matcher.oneOf.includes(value);
    if ('absent' in matcher) return !Object.hasOwn(row.arguments, key);
    if ('any' in matcher) return Object.hasOwn(row.arguments, key);
    return false;
  });
  return { passed: pass, failure: pass ? null : 'bad_args' };
};
const proof = { source_transform_verified: true, benchmarks: {} };
for (const [name, report] of Object.entries(reports)) {
  const old = references[name];
  assert.equal(report.status, 'complete'); assert.equal(report.trials.length, 24); assert.equal(report.max_tokens, 4096);
  for (const key of ['model', 'system', 'tool_choice', 'shuffle_seed', 'concurrency', 'tasks', 'provenance', 'baseline_tools', 'candidate_tools', 'static_tool_tokens']) assert.deepEqual(report[key], old[key], `${name}: unchanged ${key}`);
  const roots = new Set(), pids = new Set(); let rawModels = 0, rawTools = 0;
  for (const task of report.tasks) for (const condition of ['baseline', 'candidate']) {
    const rows = report.trials.filter(row => row.task_id === task.id && row.condition === condition);
    assert.deepEqual(rows.map(row => row.trial).sort(), [1, 2, 3]);
    for (const row of rows) {
      if (name === 'filesystem' && row.server_pid) { roots.add(row.server_pid.root); pids.add(row.server_pid.pid); await assert.rejects(access(row.server_pid.root), { code: 'ENOENT' }); }
      if (row.model_response_file) {
        const response = await load(join(directory, name, row.model_response_file)); rawModels++;
        assert.equal(response.stop_reason, row.stop_reason);
        assert.equal(response.usage.input_tokens, row.input_tokens); assert.equal(response.usage.output_tokens, row.output_tokens);
        const first = response.content.findIndex(block => block.type === 'tool_use');
        const text = response.content.slice(0, first === -1 ? undefined : first).filter(block => block.type === 'text').map(block => block.text).join('\n');
        assert.equal(text, row.model_text);
        assert.equal(row.pre_tool_text_present, first < 0 ? null : text.length > 0);
        assert.equal(row.pre_tool_text_characters, first < 0 ? null : [...text].length);
        assert.equal(row.pre_tool_text_words, first < 0 ? null : text.trim() ? text.trim().split(/\s+/u).length : 0);
        if (first >= 0) { assert.equal(row.tool, response.content[first].name); assert.deepEqual(row.arguments, response.content[first].input); }
      } else assert.equal(row.failure, 'infra');
      if (row.executed) {
        const file = `${row.task_id}-${row.condition}-${row.trial}-response.json`;
        if (name === 'trackr' && retainedTrackr) {
          const receipt = retainedTrackr.receipts.find(item => item.file === file); assert.ok(receipt);
          assert.equal(receipt.is_error, row.result_is_error); assert.equal(receipt.result_tokens, row.result_tokens);
          try {
            const bytes = await readFile(join(retainedTrackr.local_archive_directory, file));
            assert.equal(createHash('sha256').update(bytes).digest('hex'), receipt.sha256); assert.equal(bytes.length, receipt.bytes);
            assert.equal(Boolean(JSON.parse(bytes).isError), row.result_is_error);
          } catch (error) { if (error.code !== 'ENOENT') throw error; }
        } else { const raw = await load(join(directory, name, file)); assert.equal(Boolean(raw.isError), row.result_is_error); }
        rawTools++;
      }
      if (row.failure === 'infra') continue;
      if (row.tool == null) { assert.equal(row.failure, 'no_tool_call'); continue; }
      const score = name === 'filesystem' ? fsScorer.scoreCall(task, row.tool, row.arguments, row.server_pid.root) : trackrScore(task, row);
      if (name === 'filesystem' && !fsScorer.READ_ALLOWLIST.has(row.tool)) { score.passed = task.unscored ? null : false; score.failure = 'wrong_tool'; }
      if (name === 'filesystem' && row.result_is_error && !task.unscored) { score.passed = false; score.failure = 'bad_args'; }
      assert.equal(row.passed, score.passed); assert.equal(row.failure, score.failure);
    }
    const summary = report.summary.find(t => t.task_id === task.id)[condition];
    assert.equal(summary.passed, task.unscored ? null : rows.filter(row => row.passed).length);
    assert.equal(summary.of, rows.filter(row => row.failure !== 'infra').length);
    assert.equal(summary.infra_errors, rows.filter(row => row.failure === 'infra').length);
  }
  if (name === 'filesystem') { assert.equal(roots.size, 24); assert.equal(pids.size, 24); assert.equal(title(verdict(report).verdict), report.verdict); }
  proof.benchmarks[name] = { trials: 24, raw_model_responses: rawModels, raw_tool_responses: rawTools, tool_payload_publication: name === 'trackr' && retainedTrackr ? 'local complete bytes; public receipts only' : 'complete bytes published', stop_reason_and_pre_tool_text_metrics_recomputed: true, scores_recomputed: true, old_verdict: title(verdict(old).verdict), new_verdict: title(verdict(report).verdict), max_tokens_stops: report.trials.filter(row => row.stop_reason === 'max_tokens').length, text_before_tool_trials: report.trials.filter(row => row.pre_tool_text_present).length, infra: report.trials.filter(row => row.failure === 'infra').length };
}
for (const file of ['trackr-before.json', 'trackr-before-trials.json', 'trackr-after.json']) { const check = await load(join(directory, file)); assert.equal(check.baseline_matches_original, true); assert.deepEqual(check.tools, references.trackr.baseline_tools); for (const row of reports.trackr.trials) assert.deepEqual(row.server_pid, check.identity); }
await writeFile(join(directory, 'verification.json'), JSON.stringify(proof, null, 2) + '\n');

const link = `../${relative(workspace, directory)}`, n = value => Number(value).toLocaleString('en-US');
const passes = group => group.passed == null ? 'unscored' : `${group.passed}/${group.of}`;
const lines = ['# Single-turn max_tokens check', '', 'Provisional: 3 trials per condition. A demonstration, not a statistical claim.', '',
  `**4096-token verdicts: filesystem — ${proof.benchmarks.filesystem.new_verdict}; live Railway Trackr — ${proof.benchmarks.trackr.new_verdict}.** The corresponding 300-token verdicts were ${proof.benchmarks.filesystem.old_verdict} and ${proof.benchmarks.trackr.old_verdict}.`, '',
  'Purpose: test whether the single-turn harness\'s max_tokens=300 caused baseline failures that don\'t occur at a realistic limit.', '',
  '## Verdicts beside the 300-token runs', '', '| Benchmark | max_tokens | Scored passes baseline → candidate | Ordered verdict |', '|---|---:|---:|---|'];
for (const name of ['filesystem', 'trackr']) for (const [budget, data] of [[300, references[name]], [4096, reports[name]]]) { const v = verdict(data); lines.push(`| ${name}${name === 'filesystem' ? ' (corrected prompt)' : ' (live Railway)'} | ${budget} | ${v.scored_baseline}/${v.baseline_of} → ${v.scored_candidate}/${v.candidate_of} | ${title(v.verdict)} |`); }
lines.push('', '## Controlled protocol', '',
  `[Pre-registration](../scripts/max-tokens-check/preregistration.md) and executable snapshots were committed/pushed at \`${execution.preregistration_commit}\` before any model call. [Execution manifest](${link}/execution.json) records source-transform hashes, timing, exits and cleanup. Only max_tokens changed from 300 to 4096 in model requests. The instrumentation saves complete responses and computes metrics after receiving them; reversing it and the numeric replacement restores the original harness bytes. No task, fixture, tool definition, candidate, system prompt, sampling, retry rule, dispatch or scoring change was made.`, '',
  'Both experiments retain one-turn/first-call scoring, automatic tool choice, model claude-sonnet-5-5, provider-default sampling with no temperature, seeded shuffle 173201, concurrency four and three trials per task/condition. A cutoff stop is observed rather than automatically failed: the original first-call score is preserved. No tool result is fed back and there is no final-answer turn. Full provider responses retain any additional proposed calls and thinking blocks even though only the first call is scored.', '',
  `Filesystem uses exactly \`${reports.filesystem.system}\`, the pinned bbb701e server, identical synthetic seed/6,011 files, all 14 tools, original eight-tool allowlist and frozen three-description candidate. Source fidelity and the original --check acceptance passed before calls. [Preflight](${link}/filesystem-preflight.log). The 300-token comparison is the [corrected-prompt run](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/result.json), not the older mismatched-prompt run.`, '',
  `Trackr uses exactly \`${reports.trackr.system}\`, the original four SPEC tasks and compact patch from scripts/hand-run.ts. Full live metadata matched the earlier Railway baseline, including the unchanged control, before generation, immediately before Trackr trials and afterward. All three checks and all 24 live identities matched \`${reports.trackr.server_identity.version}\`; the older comparison served \`${references.trackr.server_identity.version}\`. The deployment revision changed, while all tools/list fields matched exactly. No live source or deployment changes were made for this check. [Before](${link}/trackr-before.json), [immediately before](${link}/trackr-before-trials.json), [after](${link}/trackr-after.json), [300-token reference](../${source}).`, '',
  'The ordered SPEC verdict is Regressed first for a sufficient-data control loss or task loss of at least two; otherwise Inconclusive for insufficient data (>1 infrastructure failure in any scored task/condition); otherwise Improved only if no scored task falls and a non-control gains at least two; otherwise Inconclusive. Filesystem boundary is unscored. Tokens, text length and stop reasons do not alter the scorer. Trackr\'s original summary omits verdict, so the shared src/core/verdict.ts supplies it here.', '',
  '## Task-level comparison', '', '| Benchmark / task | 300 baseline | 300 candidate | 4096 baseline | 4096 candidate |', '|---|---:|---:|---:|---:|');
for (const [name, report] of Object.entries(reports)) for (const task of report.summary) { const old = references[name].summary.find(t => t.task_id === task.task_id); lines.push(`| ${name} / ${task.task_id}${task.unscored ? ' (unscored)' : task.control ? ' (control)' : ''} | ${passes(old.baseline)} | ${passes(old.candidate)} | ${passes(task.baseline)} | ${passes(task.candidate)} |`); }
lines.push('', '## Every 4096-token trial', '',
  '“Text before tool” counts text content blocks before the first tool_use, joined with newlines as retained in model_text. Characters are Unicode code points; words are whitespace-separated. Thinking/reasoning blocks are not text for this metric and remain in the full response. If no call exists, the metric is not applicable. `<PROJECT>` replaces the temporary filesystem root for display only; original paths/arguments are preserved in JSON.', '');
for (const [name, report] of Object.entries(reports)) {
  lines.push(`### ${name}`, '', '| Task | Condition | Trial | stop_reason | Text before tool? | Characters / words | First tool | Arguments | Outcome | API input / output | Full model response |', '|---|---|---:|---|---|---:|---|---|---|---:|---|');
  for (const task of report.tasks) for (const condition of ['baseline', 'candidate']) for (const row of report.trials.filter(r => r.task_id === task.id && r.condition === condition).sort((a, b) => a.trial - b.trial)) {
    const args = JSON.stringify(row.arguments).split(row.server_pid?.root ?? '__never__').join('<PROJECT>').replaceAll('|', '\\|');
    const outcome = row.failure === 'infra' ? 'infra' : row.passed == null ? 'unscored' : row.passed ? 'pass' : `fail: ${row.failure}`;
    const textMetric = row.pre_tool_text_present == null ? 'N/A' : row.pre_tool_text_present ? 'yes' : 'no';
    lines.push(`| ${row.task_id} | ${row.condition} | ${row.trial} | ${row.stop_reason ?? 'unavailable'} | ${textMetric} | ${row.pre_tool_text_characters ?? 'N/A'} / ${row.pre_tool_text_words ?? 'N/A'} | ${row.tool ?? 'none'} | \`${args}\` | ${outcome} | ${n(row.input_tokens)} / ${n(row.output_tokens)} | ${row.model_response_file ? `[full](${link}/${name}/${row.model_response_file})` : 'none'} |`);
  }
  const detail = proof.benchmarks[name];
  lines.push('', `4096-token stop_reason=max_tokens: **${detail.max_tokens_stops}/24**. Trials with text before the first tool call: **${detail.text_before_tool_trials}/24**. Infrastructure errors: **${detail.infra}**.`, '');
}
lines.push('## All earlier 300-token runs: retained stop-reason audit', '',
  `**The exact historical total cannot be recovered.** Among ${n(audit.totals.trials)} retained earlier trial records, only ${n(audit.totals.responses_with_known_stop_reason)} save an explicit stop_reason; **${audit.totals.confirmed_max_tokens} are confirmed max_tokens stops**. ${n(audit.totals.missing_stop_reason)} records lack that field, including ${n(audit.totals.trials - audit.totals.response_usage_recorded)} records with no saved successful-response usage. An output count of exactly 300 is shown separately and is not relabeled as a known stop reason. The original filesystem and Trackr hand-run reports did not retain complete model responses, so their exact stop reasons are unavailable.`, '',
  `Audit snapshot: \`${audit.snapshot}\`. [Full audit and duplicate-source map](${link}/earlier-300-audit.json). It covers direct saved benchmark result.json files plus unique real hosted axlint-run/axlint-v2 verification run IDs in tracked scripts/docs JSON, recursively including JSON in tool-result text. Exports, repeated polls/progress/final records are deduplicated by run_id. Fixtures, simulations, tests and proposal generations are excluded; 4096-token end-to-end runs are excluded. Failed launches with no retained trial result contribute no stop reason.`, '',
  '| Earlier run | Trials | Explicit stop reasons | Confirmed max_tokens | Missing stop reason | output_tokens=300 |', '|---|---:|---:|---:|---:|---:|');
for (const row of audit.runs) lines.push(`| [${row.run_id ?? row.source.replace('scripts/', '')}](../${row.source}) | ${row.trials} | ${row.responses_with_known_stop_reason} | ${row.confirmed_max_tokens} | ${row.missing_stop_reason} | ${row.output_tokens_equal_300} |`);
lines.push('', `The ${audit.totals.output_tokens_equal_300} at-cap output records comprise six trials in the original filesystem run, six in the corrected-prompt filesystem run, and two Yahoo Finance trials. Only the two Yahoo Finance records retain explicit max_tokens stop reasons. PopHIVE retains 24 explicit tool_use stops. Earlier direct Trackr runs recorded no output_tokens=300 trials, while their actual stop reasons remain unknown.`, '',
  '## Usage, failures and consistency', '', '| Benchmark | Condition | API input tokens | API output tokens | Potential result tokens | Static tool tokens |', '|---|---|---:|---:|---:|---:|');
for (const [name, report] of Object.entries(reports)) for (const condition of ['baseline', 'candidate']) { const rows = report.trials.filter(row => row.condition === condition); const sum = key => rows.reduce((total, row) => total + row[key], 0); lines.push(`| ${name} | ${condition} | ${n(sum('input_tokens'))} | ${n(sum('output_tokens'))} | ${n(sum('result_tokens'))} | ${n(report.static_tool_tokens[condition])} |`); }
lines.push('', 'Result tokens count the complete MCP envelope (content and structuredContent), distinct from actual model usage: these results were never fed back. Any original Trackr approximate fallback remains labeled in raw results; no approximations were introduced for this experiment.', '', '| Benchmark / task | Condition | Call disagreement | Outcome disagreement | Result-token disagreement |', '|---|---|---|---|---|');
for (const [name, report] of Object.entries(reports)) for (const group of report.per_condition_consistency) lines.push(`| ${name} / ${group.task_id} | ${group.condition} | ${group.call_disagreement ? 'YES' : 'no'} | ${group.outcome_disagreement ? 'YES' : 'no'} | ${group.result_token_disagreement ? 'YES' : 'no'} |`);
for (const [name, report] of Object.entries(reports)) { const failures = report.trials.filter(row => row.failure); lines.push('', `${name} failures: ${failures.length ? failures.map(row => `${row.task_id}/${row.condition}/${row.trial}: ${row.failure}${row.error ? ` (${row.error})` : ''}`).join('; ') : 'none'}.`); }
lines.push('', '## Interpretation and validation', '',
  'Compare task counts and recorded stop reasons rather than assuming every earlier failure was truncation. A complete wrong first call can fail without reaching the output cap; a response can reach a cap after already making a valid first call. The 4096 reruns test observed behavior under a larger output budget; n=3, default sampling, a later run time and Trackr\'s changed deployment revision limit causal certainty. These remain tool-selection/argument benchmarks, not end-to-end answer-quality tests.', '',
  `[Verification](${link}/verification.json) recomputes every new pre-tool metric and stop reason from full model responses, checks chosen calls/usage and original scorers, compares all non-budget protocol fields and metadata with the 300-token references, and applies the shared ordered verdict. All 48 trial records are retained, including unfavorable outcomes. Filesystem\'s 24 unique roots/processes and the temporary execution workspace were cleaned up. [Filesystem raw data](${link}/filesystem/result.json), [Trackr raw data](${link}/trackr/result.json). Original results remain unchanged.`, '');
if (retainedTrackr) lines.push('## Publication boundary', '', 'Automatic approval review rejected exporting potentially private live Trackr issue payloads. Complete original bytes remain locally in a restricted-permission archive; the repository publishes SHA-256/byte-count receipts, requested diagnostics and model responses containing only tool inputs already present in the earlier reference. No payload was truncated or changed for execution/counting, and this publication boundary changes no request, score or verdict. See trackr-tool-receipts.json for retention and integrity details.', '');
await writeFile('docs/max-tokens-check.md', lines.join('\n'));
console.log(JSON.stringify(proof, null, 2));
