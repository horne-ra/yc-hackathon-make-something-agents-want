// Validate frozen scoring against retained calls, then render every trial.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, symlink, rm, access, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const workspace = process.cwd();
const directory = resolve(process.argv[2]);
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const report = await read(join(directory, 'results/result.json'));
const execution = await read(join(directory, 'execution.json'));
const original = await read('scripts/results/filesystem-2026-10-17T21-31-17.655Z/result.json');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(report.status, 'complete');
assert.equal(report.trials.length, 24);
assert.equal(report.system, 'You are an assistant with access to filesystem tools. Use the available tools to help the user.');
for (const key of ['model', 'sampling', 'max_tokens', 'tool_choice', 'shuffle_seed', 'concurrency', 'tasks', 'provenance', 'baseline_tools', 'candidate_tools']) assert.deepEqual(report[key], original[key], `Historical setting unchanged: ${key}`);
assert.equal(execution.temporary_workspace_deleted, true);
for (const [name, proof] of Object.entries(execution.sources)) {
  const snapshot = await readFile(`scripts/filesystem-prompt-check/harness/${name}`);
  assert.equal(hash(snapshot), proof.execution_sha256);
  const historical = execFileSync('git', ['show', `${execution.original_harness_commit}:scripts/${name}`]);
  assert.equal(hash(historical), proof.original_sha256);
  const expected = name === 'filesystem-runner.ts' ? historical.toString().replace(original.system, report.system) : historical.toString();
  assert.equal(snapshot.toString(), expected);
}

// Import the exact frozen scorer without altering its original cwd-based vendor resolution.
const temporary = await mkdtemp(join(tmpdir(), 'axlint-filesystem-prompt-verify-'));
let frozen, consistency;
try {
  await mkdir(join(temporary, 'vendor'));
  await symlink(process.env.AXLINT_FILESYSTEM_SOURCE ?? '/Users/ransomhorne/Documents/yc-hackathon-make-something-agents-want/vendor/mcp-servers', join(temporary, 'vendor/mcp-servers'));
  process.chdir(temporary);
  frozen = await import(pathToFileURL(join(workspace, 'scripts/filesystem-prompt-check/harness/hand-run-filesystem.ts')).href);
  ({ summarizeConsistency: consistency } = await import(pathToFileURL(join(workspace, 'scripts/filesystem-prompt-check/harness/filesystem-runner.ts')).href));
} finally { process.chdir(workspace); await rm(temporary, { recursive: true, force: true }); }

const roots = new Set(), pids = new Set();
let rawResponses = 0, attempts = 0;
for (const task of frozen.tasks) for (const condition of ['baseline', 'candidate']) {
  const rows = report.trials.filter(row => row.task_id === task.id && row.condition === condition);
  assert.deepEqual(rows.map(row => row.trial).sort(), [1, 2, 3]);
  for (const row of rows) {
    if (row.server_pid) {
      roots.add(row.server_pid.root); pids.add(row.server_pid.pid);
      await assert.rejects(access(row.server_pid.root), { code: 'ENOENT' });
    }
    attempts += row.attempts.filter(attempt => 'attempt' in attempt).length;
    if (row.failure === 'infra') continue;
    if (row.tool == null) { assert.equal(row.failure, 'no_tool_call'); continue; }
    const score = frozen.scoreCall(task, row.tool, row.arguments, row.server_pid.root);
    if (!frozen.READ_ALLOWLIST.has(row.tool)) { score.passed = task.unscored ? null : false; score.failure = 'wrong_tool'; assert.equal(row.executed, false); }
    else {
      assert.equal(row.executed, true);
      const raw = await read(join(directory, 'results', `${task.id}-${condition}-${row.trial}-response.json`));
      rawResponses++;
      assert.equal(row.result_is_error, Boolean(raw.isError));
      if (raw.isError && !task.unscored) { score.passed = false; score.failure = 'bad_args'; }
      assert.equal(row.result_tokens_approximate, false);
      assert.ok(Number.isInteger(row.result_tokens) && row.result_tokens > 0);
    }
    assert.equal(row.passed, score.passed); assert.equal(row.failure, score.failure);
  }
}
const summary = frozen.tasks.map(task => ({ task_id: task.id, control: Boolean(task.control), unscored: Boolean(task.unscored), ...Object.fromEntries(['baseline', 'candidate'].map(condition => {
  const rows = report.trials.filter(row => row.task_id === task.id && row.condition === condition);
  return [condition, { passed: task.unscored ? null : rows.filter(row => row.passed).length, of: rows.filter(row => row.failure !== 'infra').length, infra_errors: rows.filter(row => row.failure === 'infra').length, insufficient_data: rows.filter(row => row.failure === 'infra').length > 1, result_tokens: rows.reduce((sum, row) => sum + row.result_tokens, 0) }];
})) }));
assert.deepEqual(summary, report.summary);
assert.deepEqual(consistency(report.trials), report.per_condition_consistency);
const scored = summary.filter(task => !task.unscored), sufficient = scored.filter(task => !task.baseline.insufficient_data && !task.candidate.insufficient_data);
const verdict = sufficient.some(task => (task.control && task.candidate.passed < task.baseline.passed) || task.candidate.passed - task.baseline.passed <= -2) ? 'Regressed' : scored.some(task => task.baseline.insufficient_data || task.candidate.insufficient_data) ? 'Inconclusive' : scored.every(task => task.candidate.passed >= task.baseline.passed) && scored.some(task => !task.control && task.candidate.passed - task.baseline.passed >= 2) ? 'Improved' : 'Inconclusive';
assert.equal(verdict, report.verdict);
assert.equal(roots.size, report.trials.filter(row => row.server_pid).length);
assert.equal(pids.size, roots.size);
assert.equal((await readdir(join(directory, 'results'))).filter(name => name.endsWith('-response.json')).length, rawResponses);
const verification = { verified: true, historical_protocol_fields_equal: true, source_delta: 'SYSTEM string only', frozen_scorer_recomputed: true, verdict, trials: report.trials.length, provider_attempts: attempts, full_raw_responses: rawResponses, distinct_roots: roots.size, distinct_pids: pids.size, all_recorded_roots_deleted: true, temporary_workspace_deleted: true, consistency_groups: report.per_condition_consistency.length };
await writeFile(join(directory, 'verification.json'), JSON.stringify(verification, null, 2) + '\n');

const link = `../${relative(workspace, directory)}`;
const n = value => Number(value).toLocaleString('en-US');
const passes = group => group.passed === null ? 'unscored' : `${group.passed}/${group.of}`;
const normalized = row => JSON.stringify(row.arguments).split(row.server_pid?.root ?? '__never__').join('<PROJECT>').replaceAll('|', '\\|');
const usage = condition => report.trials.filter(row => row.condition === condition).reduce((total, row) => ({ input: total.input + row.input_tokens, output: total.output + row.output_tokens, results: total.results + row.result_tokens }), { input: 0, output: 0, results: 0 });
const oldOverview = original.summary.find(task => task.task_id === 'fs-overview');
const overview = summary.find(task => task.task_id === 'fs-overview');
const tests = summary.find(task => task.task_id === 'fs-tests');
const control = summary.find(task => task.task_id === 'fs-control');
const lines = ['# Filesystem system-prompt check', '', report.label, '',
  `**Verdict: ${verdict}.** With the filesystem-specific prompt, overview scored ${passes(overview.baseline)} baseline → ${passes(overview.candidate)} candidate, test search ${passes(tests.baseline)} → ${passes(tests.candidate)}, and the package.json control ${passes(control.baseline)} → ${passes(control.candidate)}. The original overview baseline was ${passes(oldOverview.baseline)}; all new trials, including failures and the unscored boundary, are reported below.`, '',
  'Purpose: test whether the original baseline failures depended on the mismatched system prompt.', '',
  '## Protocol and pre-registration', '',
  `[Pre-registration](../scripts/filesystem-prompt-check/preregistration.md) and executable snapshots were committed and pushed before any model call at \`${execution.preregistration_commit}\`. The [execution manifest](${link}/execution.json) records timestamps, original/execution source hashes, provenance, checks and cleanup.`, '',
  `**Only the active system prompt changed:** \`${report.system}\` It replaces \`${original.system}\` Copies of the original harness from \`${execution.original_harness_commit}\` are otherwise byte-identical; reversing that single string replacement restores the original filesystem runner exactly. The unused shared helper's historical SYSTEM constant is preserved but is not the prompt used by runFilesystemBenchmark.`, '',
  `Model \`${report.model}\`, from AXLINT_MODEL; provider-default sampling, no temperature. max_tokens 300, automatic tool choice, one turn and first call only, no tool result fed back. Same task texts, deterministic seed 20261017 and 6,011-file synthetic fixture, original scorer, candidate's three description edits, shuffle seed 173201, concurrency four, three trials per task/condition. The original 429/5xx retry policy is preserved; ${attempts} provider attempts were recorded for 24 trials.`, '',
  'All 14 official tools remained model-visible; the original eight-tool dispatch allowlist remained enforced, including blocking deprecated read_file. Each trial used a fresh process and temporary fixture copy with only that directory allowed. Original --check acceptance passed before model calls, including fixture bounds, dispatch checks, scorer checks and a compiled candidate matching the exact frozen metadata. The server pin remains bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c. No baseline, fixture, task, candidate, scorer or sampling edits were made after observations.', '',
  `[Preflight log](${link}/preflight.log), [compiled metadata/source evidence](${link}/preflight-evidence/), [runner log](${link}/runner.log), [full result](${link}/results/result.json), and [verification](${link}/verification.json). The historical result's nested provenance.preregistration_commit remains 8e9cb64 because the original runner was preserved; this check's registration commit is the one above and in execution.json. The original results and docs/filesystem-results.md remain unchanged.`, '',
  '## Task summary and comparison', '', '| Task | Original baseline | Original candidate | Prompt-check baseline | Prompt-check candidate | Baseline result tokens | Candidate result tokens |', '|---|---:|---:|---:|---:|---:|---:|'];
for (const task of summary) {
  const old = original.summary.find(row => row.task_id === task.task_id);
  lines.push(`| ${task.task_id}${task.control ? ' (control)' : task.unscored ? ' (unscored)' : ''} | ${passes(old.baseline)} | ${passes(old.candidate)} | ${passes(task.baseline)} | ${passes(task.candidate)} | ${n(task.baseline.result_tokens)} | ${n(task.candidate.result_tokens)} |`);
}
lines.push('', `Scored calls: ${scored.reduce((sum, task) => sum + task.baseline.passed, 0)}/${scored.reduce((sum, task) => sum + task.baseline.of, 0)} baseline → ${scored.reduce((sum, task) => sum + task.candidate.passed, 0)}/${scored.reduce((sum, task) => sum + task.candidate.of, 0)} candidate. Infrastructure failures: ${report.trials.filter(row => row.failure === 'infra').length}; no trials replaced.`, '',
  '**Verdict rule (unchanged):** Regressed first if a sufficient-data control falls or any sufficient-data task falls by at least two; otherwise Inconclusive if a scored task is insufficient (more than one infrastructure failure in either condition); otherwise Improved only if no scored task falls and a non-control gains at least two; otherwise Inconclusive. Boundary is excluded; tokens do not determine the verdict.', '',
  '## Every trial', '', '`<PROJECT>` replaces only that trial’s absolute root for readability. Exact arguments, PID/root, model text, input/output usage and attempts are retained in result.json; every executed complete MCP response is linked. This table reports the first-call scorer, not end-to-end completion.', '',
  '| Task | Condition | Trial | Tool | Arguments | Outcome | Result tokens | API input | API output | Raw result |', '|---|---|---:|---|---|---|---:|---:|---:|---|');
for (const task of frozen.tasks) for (const condition of ['baseline', 'candidate']) for (const row of report.trials.filter(row => row.task_id === task.id && row.condition === condition).sort((a, b) => a.trial - b.trial)) {
  const outcome = row.failure === 'infra' ? 'infra' : row.failure === 'wrong_tool' && task.unscored ? 'unscored; forbidden tool' : row.passed === null ? 'unscored' : row.passed ? 'pass' : `fail: ${row.failure}`;
  const raw = row.executed ? `[full](${link}/results/${row.task_id}-${row.condition}-${row.trial}-response.json)` : 'not executed';
  lines.push(`| ${row.task_id} | ${row.condition} | ${row.trial} | ${row.tool ?? 'none'} | \`${normalized(row)}\` | ${outcome} | ${n(row.result_tokens)}${row.result_tokens_approximate ? ' approximate' : ''} | ${n(row.input_tokens)} | ${n(row.output_tokens)} | ${raw} |`);
}
lines.push('', '## Tokens and consistency', '', `Static tool-definition tokens: baseline **${n(report.static_tool_tokens.baseline)}**, candidate **${n(report.static_tool_tokens.candidate)}**, exact provider countTokens differences with versus without tools. These are reported separately from result tokens and usage.`, '', '| Condition | Actual API input tokens | Actual API output tokens | Potential result tokens (all 12 trials) |', '|---|---:|---:|---:|');
for (const condition of ['baseline', 'candidate']) { const totals = usage(condition); lines.push(`| ${condition} | ${n(totals.input)} | ${n(totals.output)} | ${n(totals.results)} |`); }
lines.push('', 'Complete MCP responses include content and structuredContent, so duplicated protocol fields are included. Result tokens are exact countTokens measurements of the full JSON.stringify response, not actual consumed model context: the original one-turn benchmark never feeds results back. Search-result absolute temporary paths can vary in tokenization. Raw API usage for each recorded first response is distinct from these potential result counts.', '', '| Task | Condition | Call disagreement | Outcome disagreement | Result-token disagreement | Any flag |', '|---|---|---|---|---|---|');
for (const group of report.per_condition_consistency) lines.push(`| ${group.task_id} | ${group.condition} | ${group.call_disagreement ? 'YES' : 'no'} | ${group.outcome_disagreement ? 'YES' : 'no'} | ${group.result_token_disagreement ? 'YES' : 'no'} | ${group.disagree ? 'YES' : 'no'} |`);
const failures = report.trials.filter(row => row.failure);
lines.push('', '## Failures and interpretation', '', ...failures.map(row => `- ${row.task_id}, ${row.condition} trial ${row.trial}: ${row.failure}${row.error ? ` — ${row.error}` : ''}.`));
if (!failures.length) lines.push('No scored failures or infrastructure errors occurred.');
const persists = scored.some(task => task.baseline.passed < task.baseline.of);
lines.push('', persists ? 'Baseline failures persisted with the filesystem-specific prompt. The mismatched issue-tracker prompt was therefore not necessary for those observed failures; the table shows the exact task-specific changes rather than assuming the rerun is identical.' : 'The original scored baseline failures did not recur with the filesystem-specific prompt in these three trials per task. This is consistent with prompt sensitivity, while the table records whether the candidate still provided a scored advantage.', '',
  'This is a later rerun with provider-default sampling and n=3, rather than a concurrent randomized comparison of both system prompts. It cannot isolate prompt causality from sampling or changes behind the same model ID. The pre-registered verdict compares baseline metadata with candidate metadata under the corrected prompt; it is not a statistical test of the system-prompt effect. See the separate [end-to-end experiment](e2e-filesystem.md) for actual agent completion on Commander.js; that experiment uses a different fixture, output budget and multi-turn protocol.', '',
  `Validation recomputed all scores, summaries, the ordered verdict and all eight consistency groups from retained data. ${roots.size} unique roots and ${pids.size} unique PIDs were recorded; every recorded trial root and the execution workspace were deleted. Source snapshots and protocol fields were verified against the historical run, with the single system-string delta only.`, '');
await writeFile('docs/filesystem-prompt-check.md', lines.join('\n'));
console.log(JSON.stringify(verification, null, 2));
console.log('Wrote docs/filesystem-prompt-check.md.');
