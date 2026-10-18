import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
const snapshot = '8b3df64';
const paths = execFileSync('git', ['ls-tree', '-r', '--name-only', snapshot, 'scripts', 'docs'], { encoding: 'utf8' }).trim().split('\n').filter(path => path.endsWith('.json'));
const direct = [], hosted = new Map();
const reason = trial => trial.stop_reason ?? trial.model_stop_reason ?? trial.response?.stop_reason ?? null;
const summarize = trials => ({ trials: trials.length, responses_with_known_stop_reason: trials.filter(t => reason(t) != null).length, confirmed_max_tokens: trials.filter(t => reason(t) === 'max_tokens').length, missing_stop_reason: trials.filter(t => reason(t) == null).length, output_tokens_equal_300: trials.filter(t => (t.output_tokens ?? t.usage?.output_tokens) === 300).length, response_usage_recorded: trials.filter(t => (t.output_tokens ?? t.usage?.output_tokens ?? 0) > 0 || reason(t) != null).length });
function findHosted(value, source) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.run_id === 'string' && /^(?:axlint-run-[0-9a-f-]{36}|axlint-v2\.[A-Za-z0-9_-]+\.[0-9a-f-]{36})$/u.test(value.run_id) && value.config && Array.isArray(value.tasks) && value.tasks.every(task => Array.isArray(task.trials))) {
    const existing = hosted.get(value.run_id);
    if (existing) existing.sources.add(source);
    else hosted.set(value.run_id, { value, sources: new Set([source]) });
    return;
  }
  if (Array.isArray(value)) for (const entry of value) findHosted(entry, source);
  else for (const entry of Object.values(value)) {
    if (entry && typeof entry === 'object') findHosted(entry, source);
    else if (typeof entry === 'string' && entry.trimStart().startsWith('{')) try { findHosted(JSON.parse(entry), source); } catch {}
  }
}
for (const path of paths) {
  let value; try { value = JSON.parse(await readFile(path, 'utf8')); } catch { continue; }
  if (value.max_tokens === 300 && Array.isArray(value.trials) && path.endsWith('/result.json')) direct.push({ kind: 'direct', source: path, model: value.model, status: value.status, max_tokens_evidence: 'result.max_tokens=300', ...summarize(value.trials), missing_reason_output_cap_trials: value.trials.filter(t => reason(t) == null && (t.output_tokens ?? t.usage?.output_tokens) === 300).map(t => ({ task_id: t.task_id, condition: t.condition, trial: t.trial, passed: t.passed, failure: t.failure })) });
  findHosted(value, path);
}
const hostedRows = [...hosted.entries()].map(([id, { value, sources }]) => ({ kind: 'hosted', run_id: id, source: [...sources].sort()[0], duplicate_sources: [...sources].sort(), model: value.config.model, status: 'complete', max_tokens_evidence: 'runner/engine.ts request uses max_tokens:300; hosted VerificationResult schema does not retain stop_reason', ...summarize(value.tasks.flatMap(task => task.trials)) }));
const rows = [...direct, ...hostedRows];
const totals = Object.fromEntries(['trials', 'responses_with_known_stop_reason', 'confirmed_max_tokens', 'missing_stop_reason', 'output_tokens_equal_300', 'response_usage_recorded'].map(key => [key, rows.reduce((sum, row) => sum + row[key], 0)]));
const report = { snapshot, generated_at: new Date().toISOString(), scope: 'Saved direct 300-token benchmark result.json files and unique real axlint-run/axlint-v2 UUID hosted VerificationResults found recursively in tracked scripts/docs JSON at the pre-run snapshot; progress/result/export duplicates deduplicated by run_id. Fixtures, simulations, proposals and tests excluded.', exact_historical_max_tokens_total_recoverable: totals.missing_stop_reason === 0, warning: 'Missing stop_reason is unknown, not zero. output_tokens=300 is separately reported and is not treated as proof of stop_reason=max_tokens. Old direct reports with infra failures may have no successful model response at all.', totals, runs: rows };
const output = process.argv[2]; if (output) await writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
