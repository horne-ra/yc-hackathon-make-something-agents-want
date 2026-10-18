import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
const directory = resolve(process.argv[2]);
const summary = JSON.parse(await readFile(join(directory, 'summary.json'), 'utf8'));
const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
const rows = await Promise.all(summary.trials.map(row => readFile(join(directory, `${row.id}.json`), 'utf8').then(JSON.parse)));
const evidenceLink = `../${relative(process.cwd(), directory)}`;
const n = value => Number(value).toLocaleString('en-US');
const b = summary.groups.baseline, c = summary.groups.candidate;
const lines = [
  '# End-to-end filesystem experiment', '',
  `Baseline completed ${b.completed}/3 trials using ${n(b.input_tokens)} reported input tokens; the frozen candidate completed ${c.completed}/3 using ${n(c.input_tokens)}. These are six observed completion outcomes, not an answer-quality evaluation or a statistical claim.`, '',
  '## Protocol', '',
  `Exact task: **${manifest.registration.task}** Model: \`${summary.model}\`, from AXLINT_MODEL, default sampling with no temperature/top_p/top_k; max_tokens 4096 per response, up to eight attempted API turns. All 14 tools were model-visible; all ten read-only tools could execute, while the four write tools were blocked at dispatch.`, '',
  `The [pre-registration](${evidenceLink}/../preregistration.md) was committed as \`${summary.preregistration_commit}\` before model calls; the frozen harness and no-model preparation were committed as \`${summary.harness_commit}\`. Order: ${manifest.registration.trial_order.join(', ')}. Model run: ${summary.started_at}–${summary.finished_at}; the full 60-minute session was bounded by ${manifest.registration.session_started_at}–${manifest.registration.hard_deadline}.`, '',
  `Official filesystem server: \`${manifest.server_source_commit}\`; Commander.js: \`${manifest.project_commit}\` (v13.1.0), matching the earlier real-repository size check. npm ci exited 0, left the pinned lock unchanged (SHA-256 \`${manifest.package_lock_sha256}\`), and installed the template once. Every trial copied its entire installed tree, including node_modules and .git (${n(manifest.fixture_inventory.files)} regular files, ${n(manifest.fixture_inventory.directories)} directories, ${n(manifest.fixture_inventory.symlinks)} symlinks); byte-content inventories matched, roots and process IDs were unique, and all temporary copies/processes and the template were cleaned up.`, '',
  'The candidate uses exactly the frozen three description edits; the implementation and every other metadata field are identical. Tools/list matched the original 14-tool baseline before trials. Each returned MCP response was serialized in full with JSON.stringify, including both content and structuredContent, and fed back without truncation, summarization, deduplication, or context shrinking. Every API rejection ended its trial with no retries.', '',
  '## Per-trial results', '',
  '| Trial | Completed | Outcome | Turns attempted / responses | Input tokens | Output tokens | Total tokens | First-turn tools | Full evidence |',
  '|---|---|---|---:|---:|---:|---:|---|---|',
];
for (const trial of rows) {
  await writeFile(join(directory, `${trial.id}-answer.txt`), trial.final_answer);
  const first = trial.turns_detail[0]?.calls.map(call => `\`${call.name}\``).join(', ') || 'none';
  lines.push(`| ${trial.id} | ${trial.completed ? 'yes' : 'no'} | ${trial.outcome} | ${trial.turns} / ${trial.successful_responses} | ${n(trial.input_tokens)} | ${n(trial.output_tokens)} | ${n(trial.total_tokens)} | ${first} | [raw](${evidenceLink}/${trial.id}.json), [answer](${evidenceLink}/${trial.id}-answer.txt) |`);
}
lines.push('', 'A turn is an attempted API request. Input/output totals sum only actual usage fields returned by successful API responses; a rejected request has null usage, so its oversized input is **not** counted as zero tokens or estimated into these totals. Repeated conversation history is counted again each time the provider reports it as input. All raw usage objects, including cache fields, are retained; total tokens = reported input_tokens + output_tokens.', '', '| Condition | Completed | Input tokens | Output tokens | Total tokens |', '|---|---:|---:|---:|---:|');
for (const [condition, group] of Object.entries(summary.groups)) lines.push(`| ${condition} | ${group.completed}/3 | ${n(group.input_tokens)} | ${n(group.output_tokens)} | ${n(group.total_tokens)} |`);
lines.push('', '## Turn-by-turn observations', '');
for (const trial of rows) {
  lines.push(`### ${trial.id}`, '', '| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |', '|---:|---:|---:|---|---|');
  for (const turn of trial.turns_detail) {
    const detail = turn.calls.map(call => `\`${call.name}\` ${call.result_characters == null ? 'host error' : n(call.result_characters)}${call.result?.isError ? ' (tool error)' : ''}`).join('; ') || 'none';
    lines.push(`| ${turn.turn} | ${turn.input_tokens == null ? 'unavailable' : n(turn.input_tokens)} | ${turn.output_tokens == null ? 'unavailable' : n(turn.output_tokens)} | ${turn.response?.stop_reason ?? turn.error?.status ?? 'error'} | ${detail} |`);
    if (turn.error) lines.push('', '```text', turn.error.message, '```', '');
  }
  if (trial.error) lines.push('', '```text', trial.error.message, '```');
  const treeTurn = trial.turns_detail.find(t => t.calls.some(call => call.name === 'directory_tree' && !call.arguments.excludePatterns?.length));
  const recovered = treeTurn && trial.turns_detail.some(t => t.turn > treeTurn.turn && t.calls.some(call => ['list_directory', 'list_directory_with_sizes'].includes(call.name)));
  lines.push('', `Final outcome: **${trial.outcome}**. ${treeTurn ? `An unfiltered tree was requested on turn ${treeTurn.turn}. ${recovered ? 'The agent subsequently called a directory-listing tool on its own.' : 'No subsequent directory-listing recovery was observed.'}` : 'No unfiltered directory_tree call was observed.'} ${trial.completed ? 'The final answer is retained verbatim in the linked answer file.' : 'No completed final answer was produced; the answer file is empty.'}`, '');
}
lines.push('## Evidence and limits', '', `[Manifest](${evidenceLink}/manifest.json), [summary](${evidenceLink}/summary.json), [npm ci log](${evidenceLink}/npm-ci.log), and per-trial JSON above retain source/fixture hashes, process IDs, every call and arguments, complete responses, full conversations, per-turn actual API usage, errors, final answers, timestamps, and cleanup. Request hashes can be reconstructed from the retained conversation and frozen metadata with \`node scripts/e2e-filesystem/verify.mjs ${relative(process.cwd(), directory)}\`.`, '', 'Completed means a nonempty final text answer with end_turn and no pending tool call, without a terminal error. Read-tool errors may be recovered from. This scores completion only; usefulness and correctness of the overview were not graded. With three trials per condition, results describe this pinned fixture, model and run, with no general performance or significance claim.', '');
await writeFile('docs/e2e-filesystem.md', lines.join('\n'));
console.log('Wrote docs/e2e-filesystem.md and verbatim answer files.');
