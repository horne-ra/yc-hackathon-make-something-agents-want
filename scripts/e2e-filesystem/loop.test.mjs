import test from 'node:test';
import assert from 'node:assert/strict';
import { runLoop, classifyError } from './loop.mjs';
const registration = { task: 'task', system: 'system', max_tokens: 4096, max_turns: 8, read_tools: ['directory_tree', 'list_directory'] };
const tool = (id, name = 'directory_tree') => ({ type: 'tool_use', id, name, input: { path: '/root' } });
const response = (content, stop_reason = 'tool_use') => ({ content, stop_reason, usage: { input_tokens: 17, output_tokens: 5, cache_read_input_tokens: 0 } });
const setup = extra => ({ registration, model: 'test', tools: [], root: '/root', ...extra });
test('full huge result and every call are fed back; baseline can recover and answer', async () => {
  const huge = { content: [{ type: 'text', text: 'x'.repeat(1_100_000) }], structuredContent: { entries: ['unaltered'] } };
  const history = []; let count = 0;
  const result = await runLoop(setup({ dispatch: async name => { history.push(name); return huge; }, create: async params => {
    assert.equal('temperature' in params, false);
    if (++count === 1) return response([tool('one'), tool('two', 'list_directory')]);
    const fed = params.messages.at(-1).content;
    assert.equal(fed.length, 2); assert.equal(fed[0].content, JSON.stringify(huge)); assert.equal(fed[1].content, JSON.stringify(huge));
    return response([{ type: 'text', text: 'Final overview.' }], 'end_turn');
  } }));
  assert.deepEqual(history, ['directory_tree', 'list_directory']);
  assert.equal(result.completed, true); assert.equal(result.turns, 2); assert.equal(result.input_tokens, 34); assert.equal(result.total_tokens, 44);
});
test('oversize rejection ends trial once, with unavailable usage null', async () => {
  let attempts = 0;
  const result = await runLoop(setup({ dispatch: async () => ({ content: [] }), create: async () => {
    if (++attempts === 1) return response([tool('one')]);
    throw Object.assign(new Error('prompt is too long: 1038000 tokens > 1000000 maximum'), { status: 400 });
  } }));
  assert.equal(attempts, 2); assert.equal(result.outcome, 'context_limit_error'); assert.equal(result.turns_detail[1].usage, null); assert.equal(result.input_tokens, 17);
});
test('all writes blocked before dispatch; read errors can be recovered from', async () => {
  let attempts = 0; let executed = 0;
  const result = await runLoop(setup({ dispatch: async () => { executed++; return { isError: true, content: [{ type: 'text', text: 'bad path' }] }; }, create: async params => {
    if (++attempts === 1) return response([tool('w1', 'write_file'), tool('w2', 'edit_file'), tool('w3', 'create_directory'), tool('w4', 'move_file'), tool('u', 'unknown'), tool('r', 'list_directory')]);
    assert.equal(params.messages.at(-1).content.length, 6); assert.ok(params.messages.at(-1).content.every(x => x.is_error));
    return response([{ type: 'text', text: 'Recovered.' }], 'end_turn');
  } }));
  assert.equal(executed, 1); assert.equal(result.completed, true);
});
test('turn eight calls execute; no ninth request and no false completion', async () => {
  let executed = 0; let attempts = 0;
  const result = await runLoop(setup({ dispatch: async () => { executed++; return { content: [] }; }, create: async () => response([tool(`id${++attempts}`)]) }));
  assert.equal(attempts, 8); assert.equal(executed, 8); assert.equal(result.outcome, 'turn_limit'); assert.equal(result.completed, false);
});
test('cut off text is not a completed answer and unrelated errors stay other error', async () => {
  const result = await runLoop(setup({ dispatch: async () => {}, create: async () => response([{ type: 'text', text: 'Partial.' }], 'max_tokens') }));
  assert.equal(result.outcome, 'other error'); assert.equal(result.completed, false);
  assert.equal(classifyError({ status: 429, message: 'rate limit' }), 'other error');
  assert.equal(classifyError({ status: 413, message: 'too big' }), 'context_limit_error');
});
