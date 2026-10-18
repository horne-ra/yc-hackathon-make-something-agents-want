import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { hash } from './loop.mjs';
const directory = resolve(process.argv[2]);
const load = async name => JSON.parse(await readFile(join(directory, name), 'utf8'));
const manifest = await load('manifest.json');
const summary = await load('summary.json');
const registration = manifest.registration;
assert.deepEqual(summary.trials.map(t => t.id), registration.trial_order);
assert.equal(summary.temporary_deleted, true);
const roots = [], pids = [];
let requests = 0, responses = 0, calls = 0;
for (const row of summary.trials) {
  const trial = await load(`${row.id}.json`);
  assert.equal(trial.copy_deleted, true);
  assert.equal(trial.turns, trial.turns_detail.length);
  if (trial.root) { roots.push(trial.root); pids.push(trial.server_pid); assert.deepEqual(trial.fixture_inventory, manifest.fixture_inventory); }
  const metadata = JSON.parse(await readFile(`scripts/filesystem-evidence/${trial.condition === 'baseline' ? 'baseline' : 'candidate'}-tools.json`, 'utf8'));
  const tools = metadata.map(t => ({ name: t.name, description: t.description, input_schema: t.inputSchema }));
  const messages = [{ role: 'user', content: [{ type: 'text', text: registration.task }, { type: 'text', text: `Project directory: ${trial.root}` }] }];
  let input = 0, output = 0;
  for (const turn of trial.turns_detail) {
    requests++;
    const params = { model: summary.model, max_tokens: registration.max_tokens, system: registration.system, tools, messages };
    assert.equal(hash(JSON.stringify(params)), turn.request_sha256, `${trial.id} turn ${turn.turn} exact reconstructed request`);
    assert.equal(JSON.stringify(params).length, turn.request_characters);
    if (!turn.response) { assert.equal(turn.usage, null); assert.equal(turn.input_tokens, null); continue; }
    responses++;
    assert.deepEqual(turn.usage, turn.response.usage);
    assert.equal(turn.input_tokens, turn.usage.input_tokens);
    assert.equal(turn.output_tokens, turn.usage.output_tokens);
    input += turn.input_tokens; output += turn.output_tokens;
    messages.push({ role: 'assistant', content: turn.response.content });
    const uses = turn.response.content.filter(x => x.type === 'tool_use');
    assert.equal(uses.length, turn.calls.length);
    if (uses.length) {
      const results = [];
      for (let index = 0; index < uses.length; index++) {
        calls++;
        const call = turn.calls[index], use = uses[index];
        assert.equal(call.id, use.id); assert.equal(call.name, use.name); assert.deepEqual(call.arguments, use.input);
        assert.equal(call.dispatched, registration.read_tools.includes(call.name));
        if (call.error) continue;
        const serialized = JSON.stringify(call.result);
        assert.equal(serialized.length, call.result_characters);
        assert.equal(hash(serialized), call.result_sha256);
        results.push({ type: 'tool_result', tool_use_id: use.id, content: serialized, ...(call.result.isError ? { is_error: true } : {}) });
      }
      if (results.length === uses.length) messages.push({ role: 'user', content: results });
    }
  }
  if (trial.messages) assert.deepEqual(trial.messages, messages, 'Full results and assistant messages retained exactly');
  assert.equal(trial.input_tokens, input); assert.equal(trial.output_tokens, output); assert.equal(trial.total_tokens, input + output);
  assert.equal(trial.successful_responses, trial.turns_detail.filter(t => t.response).length);
  if (trial.completed) {
    assert.equal(trial.outcome, 'answered');
    const last = trial.turns_detail.at(-1).response;
    assert.equal(last.stop_reason, 'end_turn'); assert.ok(!last.content.some(x => x.type === 'tool_use'));
    assert.equal(trial.final_answer, last.content.filter(x => x.type === 'text').map(x => x.text).join('\n')); assert.ok(trial.final_answer.trim());
  } else assert.equal(trial.final_answer, '');
  for (const key of ['outcome', 'completed', 'turns', 'successful_responses', 'input_tokens', 'output_tokens', 'total_tokens']) assert.equal(row[key], trial[key]);
}
assert.equal(new Set(roots).size, roots.length); assert.equal(new Set(pids).size, pids.length);
for (const condition of ['baseline', 'candidate']) {
  const trials = summary.trials.filter(t => t.condition === condition), group = summary.groups[condition];
  assert.equal(trials.length, 3); assert.equal(group.completed, trials.filter(t => t.completed).length);
  for (const key of ['input_tokens', 'output_tokens', 'total_tokens']) assert.equal(group[key], trials.reduce((sum, t) => sum + t[key], 0));
}
console.log(JSON.stringify({ verified: true, trials: summary.trials.length, requests, successful_responses: responses, calls, distinct_roots: roots.length, distinct_pids: pids.length, exact_request_reconstruction: true, full_result_feedback: true, cleanup: true }, null, 2));
