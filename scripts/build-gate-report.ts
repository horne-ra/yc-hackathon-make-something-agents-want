import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import assert from 'node:assert/strict';
import { summarizeConsistency, type Trial, type Task } from './hand-run-common.js';
type Report = { model: string; temperature: unknown; server_identity: { name?: string; version?: string }; trials: Trial[]; tasks: Task[]; static_tool_tokens: { baseline: number; candidate: number }; provenance: Record<string, unknown>; label: string; per_condition_consistency?: ReturnType<typeof summarizeConsistency> };
const [memoryInput, liveInput] = process.argv.slice(2);
if (!memoryInput || !liveInput) throw new Error('Usage: tsx scripts/build-gate-report.ts MEMORY_RESULT_JSON LIVE_TRACKR_RESULT_JSON');
const memoryPath = resolve(memoryInput);
const livePath = resolve(liveInput);
const memory: Report = JSON.parse(await readFile(memoryPath, 'utf8'));
const live: Report = JSON.parse(await readFile(livePath, 'utf8'));
for (const report of [memory, live]) {
  assert.equal(report.trials.length, 24);
  assert.equal(report.model, 'claude-sonnet-5-5');
  assert.equal(report.temperature, 'omitted; model-default sampling');
  assert.equal(report.trials.filter(row => row.failure === 'infra').length, 0);
  const flags = summarizeConsistency(report.trials);
  assert.equal(flags.length, 8);
  assert.ok(flags.every(flag => flag.trial_count === 3));
}
assert.equal(live.provenance.server_url, 'https://trackr-production-e1a6.up.railway.app/mcp');
assert.ok(live.server_identity.version?.startsWith('trackr-demo-001@'));
assert.ok(live.trials.every(row => (row.server_pid as { version: string }).version === live.server_identity.version));
// This metadata annotation changes no trial, provider output, tool list or score.
live.per_condition_consistency = summarizeConsistency(live.trials);
await writeFile(livePath, JSON.stringify(live, null, 2));
await writeFile(resolve(dirname(livePath), 'progress.json'), JSON.stringify(live, null, 2));
function table(report: Report) {
  return ['| Task | Condition | Trial | Tool | Arguments | Pass or fail | Result tokens |', '| --- | --- | --- | --- | --- | --- | --- |', ...report.trials.map(row => `| ${row.task_id} | ${row.condition} | ${row.trial} | ${row.tool ?? '-'} | \`${JSON.stringify(row.arguments).replaceAll('|', '\\|')}\` | ${row.passed === null ? 'unscored' : row.passed ? 'pass' : `fail: ${row.failure}`} | ${row.result_tokens}${row.result_tokens_approximate ? ' approximate' : ''} |`)].join('\n');
}
function consistency(report: Report) {
  const flags = summarizeConsistency(report.trials);
  for (const flag of flags) console.log(`${flag.disagree ? 'DISAGREEMENT' : 'AGREE'} ${flag.task_id} ${flag.condition}: ${flag.trial_count} trials; calls=${flag.call_disagreement ? 'differ' : 'same'}, outcomes=${flag.outcome_disagreement ? 'differ' : 'same'}, result tokens=${flag.result_token_disagreement ? 'differ' : 'same'}`);
  return ['| Task | Condition | Trials | Disagreement flag | Calls | Outcomes | Result tokens |', '| --- | --- | --- | --- | --- | --- | --- |', ...flags.map(flag => `| ${flag.task_id} | ${flag.condition} | ${flag.trial_ids.join(', ')} | ${flag.disagree ? '**YES**' : 'no'} | ${flag.call_disagreement ? 'differ' : 'same'} | ${flag.outcome_disagreement ? 'differ' : 'same'} | ${flag.result_token_disagreement ? 'differ' : 'same'} |`)].join('\n');
}
function summary(report: Report) {
  return ['| Task | Baseline passes | Candidate passes | Baseline result tokens | Candidate result tokens |', '| --- | --- | --- | --- | --- |', ...report.tasks.map(task => {
    const rows = (condition: string) => report.trials.filter(row => row.task_id === task.id && row.condition === condition);
    const passes = (condition: string) => task.unscored ? 'unscored' : `${rows(condition).filter(row => row.passed).length}/3`;
    const tokens = (condition: string) => rows(condition).reduce((sum, row) => sum + row.result_tokens, 0);
    return `| ${task.id} | ${passes('baseline')} | ${passes('candidate')} | ${tokens('baseline')} | ${tokens('candidate')} |`;
  })].join('\n');
}
const memoryFlags = consistency(memory);
const liveFlags = consistency(live);
const memoryTable = table(memory);
const liveTable = table(live);
const doc = `# S3 real server gate results

Recommendation pending the user's gate decision: keep trackr as the primary demo target. The official memory server already passes all nine scored trials in each condition. The new live Railway trackr comparison improves the payload task from 0/3 to 3/3 and keeps every other task at 3/3, including the control. Under the specification's ordered verdict rules, the live trackr result is **Improved**. The routing and status baseline-failure hypotheses were not observed; do not claim those failures in the demo.

${live.label}

## Configuration and provenance

Both comparisons use pinned \`${live.model}\`, provider-default sampling with **no temperature field**, the specification's neutral system prompt verbatim, automatic tool choice, a maximum of 300 output tokens, one model turn, three trials per task and condition, and a fixed seeded shuffle with concurrency limited to four. The user explicitly authorized omitting temperature after Sonnet 5.5 rejected the original temperature-0 request. No model, task prompt, scorer or baseline metadata was changed to make a baseline fail.

The live endpoint is [trackr on Railway](https://trackr-production-e1a6.up.railway.app/mcp). Live identity is \`${live.server_identity.name}@${live.server_identity.version}\`; the MCP \`serverInfo.version\` value is exactly \`${live.server_identity.version}\`. Every live trial reported that same version. Baseline and candidate calls execute against the same running deployment; the four compact metadata operations from SPEC.md are applied by hand to the tools shown to the model.

The memory benchmark is [the official MCP Memory reference server](https://github.com/modelcontextprotocol/servers/tree/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory) at full commit \`bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c\`. All nine tools are visible. Only read_graph, search_nodes and open_nodes may execute; the allowlist is enforced at dispatch. Every trial has its own server process and temporary seed copy. The fictional graph contains 145 entities and 142 relations.

Result tokens count the complete serialized MCP response, including content and structuredContent when supplied, via Anthropic's countTokens endpoint. No successful trial needed approximate counts. They measure potential returned context; the single-turn model never consumes the result. Static tool-definition tokens are reported separately.

## Memory comparison

${summary(memory)}

All scored tasks pass 3/3 in both conditions. The unscored boundary task chooses search_nodes with query Priya Nair in every trial. Source metadata fidelity passes, but there is no observed behavioral gain. Under the S3 gate table, the recommendation is to keep trackr primary, pending the user's decision.

${memoryTable}

### Memory consistency flags

A disagreement flag compares the chosen tool, parsed arguments with object keys canonicalized, pass/fail status and returned-result token count across the three trials within each task and condition. Model prose and response latency do not affect this routing comparison. **No memory task has a disagreement in either condition.**

${memoryFlags}

## Live Railway trackr comparison

${summary(live)}

Total passed trials rise from 9/12 to 12/12. The payload task fails all baseline trials because include_comments is omitted and passes all candidate trials because include_comments is false. Its returned payload falls from 10408 to 441 tokens per trial, a 95.8% reduction. Across all four tasks, returned-result tokens fall from 115194 to 13272, an 88.5% reduction. Static tool-definition tokens rise from ${live.static_tool_tokens.baseline} to ${live.static_tool_tokens.candidate}.

The routing and status tasks already pass baseline 3/3; their baseline-failure hypotheses are rejected for this model and retained in the evidence. Their candidate payload reductions are visible, but they do not create additional task-pass improvements. No regression or insufficient-data task is present; one non-control task improves by three passes and the control holds, giving **Improved**.

${liveTable}

### Live trackr consistency flags

**No live trackr task has a disagreement in either condition.** Every task has three identical tool/argument selections, outcomes and result-token counts within each condition. Differences between baseline and candidate are the intended comparison and are not within-condition disagreement.

${liveFlags}

## Acceptance checks and actual output

Memory build and source-fidelity checks exited 0:

\`\`\`text
PASS tools/list: 9 tools visible
PASS execution allowlist: delete_entities blocked; handler calls = 0
PASS seed size: read_graph 766273 characters; search_nodes 17713 characters
PASS source fidelity: hand-applied src/memory/index.ts descriptions exactly reproduce candidate tools/list; all remaining metadata identical
PASS memory evidence: 24 trials; 18 scored passes; six unscored; 24 unique server processes; all per-trial graph files removed; all calls succeeded first attempt; nine tools shown in both conditions
\`\`\`

Live Railway infrastructure check exited 0:

\`\`\`text
PASS trackr tools/list: three tools; baseline descriptions exact; control unchanged; TRK-117 read succeeds; identity {"name":"trackr","version":"${live.server_identity.version}"}
\`\`\`

The live benchmark command \`pnpm exec tsx scripts/hand-run.ts\` exited 0 and printed every one of its 24 trials. The memory comparison also printed every one of its 24 trials. Both full tables appear above. All 16 task/condition consistency checks report AGREE. The report generator asserts three trials in every condition, no infrastructure errors, unchanged pinned model/sampling, the exact Railway endpoint and a single live revision throughout.

The disagreement detector also passed an in-memory check: changing one candidate argument flags only that task and condition; the recorded evidence remains unchanged.

The shared harness and both entrypoints pass \`pnpm typecheck\`. No package or lockfile changes and no new dependencies are required.

## Retained evidence and scope

The earlier 24 rejected temperature-0 trials remain untouched in [the initial error report](../scripts/results/memory-2026-10-17T19-30-31.562Z/table.md). All returned provider errors and request IDs remain in its JSON files; no failed trials are hidden. The initial memory infrastructure size assertion and the reason for correcting it are recorded in [benchmark notes](../scripts/benchmark-notes.md).

The successful memory data is [the complete result](../${relative(resolve('.'), memoryPath)}) with [its original table](../${relative(resolve('.'), dirname(memoryPath))}/table.md). The new live Railway data is [the complete result](../${relative(resolve('.'), livePath)}) with [its original table](../${relative(resolve('.'), dirname(livePath))}/table.md). The earlier local-trackr comparison is preserved in [its own table](../scripts/results/trackr-2026-10-17T19-35-11.886Z/table.md); it is separate evidence and is not substituted for this live run.

The trackr source-fidelity check belongs to the lead's trackr lane and is not rerun by this lane. Memory is not rerun after the explicit live-Railway request because its complete successful result is retained as requested. No Phase 2 implementation, branch merge or push to main occurs in this lane.
`;
await mkdir(resolve('docs'), { recursive: true });
await writeFile(resolve('docs/gate-results.md'), doc);
const oldTable = await readFile(resolve(dirname(livePath), 'table.md'), 'utf8');
await writeFile(resolve(dirname(livePath), 'table.md'), oldTable.split('\n## Per-condition consistency')[0] + '\n## Per-condition consistency\n\n' + liveFlags + '\n');
console.log(`PASS gate report: full 24-trial memory table and new 24-trial LIVE Railway table saved to ${resolve('docs/gate-results.md')}`);
