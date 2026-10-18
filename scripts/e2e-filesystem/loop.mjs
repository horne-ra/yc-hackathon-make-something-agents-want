import { createHash } from 'node:crypto';

export const hash = value => createHash('sha256').update(value).digest('hex');
export function classifyError(error) {
  const detail = `${error?.message ?? ''} ${JSON.stringify(error?.error ?? {})}`;
  return error?.status === 413 || /context.{0,40}(limit|long|length|size)|prompt.{0,20}too long|input.{0,30}(too long|token limit)|request.{0,20}(too large|size)|exceed.{0,60}(token|context)|maximum.{0,20}(context|token)/i.test(detail)
    ? 'context_limit_error' : 'other error';
}

export async function runLoop({ registration, model, tools, root, create, dispatch, save = async () => {}, cleanError = error => ({ message: String(error.message ?? error), status: error.status ?? null, body: error.error ?? null }) }) {
  const messages = [{ role: 'user', content: [{ type: 'text', text: registration.task }, { type: 'text', text: `Project directory: ${root}` }] }];
  const result = { outcome: 'turn_limit', completed: false, turns: 0, successful_responses: 0, input_tokens: 0, output_tokens: 0, total_tokens: 0, final_answer: '', turns_detail: [], messages };
  for (let index = 1; index <= registration.max_turns; index++) {
    const params = { model, max_tokens: registration.max_tokens, system: registration.system, tools, messages };
    const turn = { turn: index, started_at: new Date().toISOString(), request_sha256: hash(JSON.stringify(params)), request_characters: JSON.stringify(params).length, usage: null, input_tokens: null, output_tokens: null, calls: [] };
    result.turns = index;
    result.turns_detail.push(turn);
    let response;
    try {
      response = await create(params);
    } catch (error) {
      turn.error = cleanError(error);
      turn.finished_at = new Date().toISOString();
      result.outcome = classifyError(error);
      await save(result);
      return result;
    }
    turn.response = response;
    turn.usage = response.usage;
    turn.input_tokens = response.usage.input_tokens;
    turn.output_tokens = response.usage.output_tokens;
    result.successful_responses++;
    result.input_tokens += turn.input_tokens;
    result.output_tokens += turn.output_tokens;
    result.total_tokens = result.input_tokens + result.output_tokens;
    messages.push({ role: 'assistant', content: response.content });
    const calls = response.content.filter(block => block.type === 'tool_use');
    if (!calls.length) {
      const answer = response.content.filter(block => block.type === 'text').map(block => block.text).join('\n');
      if (response.stop_reason === 'end_turn' && answer.trim()) {
        result.outcome = 'answered'; result.completed = true; result.final_answer = answer;
      } else {
        result.outcome = 'other error';
        turn.error = { message: `No final answer: stop_reason=${response.stop_reason}`, partial_text: answer };
      }
      turn.finished_at = new Date().toISOString();
      await save(result);
      return result;
    }
    const toolResults = [];
    for (const call of calls) {
      const record = { id: call.id, name: call.name, arguments: call.input, started_at: new Date().toISOString(), dispatched: registration.read_tools.includes(call.name) };
      turn.calls.push(record);
      try {
        const raw = record.dispatched
          ? await dispatch(call.name, call.input)
          : { isError: true, content: [{ type: 'text', text: `Blocked at dispatch: ${call.name} is not an allowed read-only tool.` }] };
        record.result = raw;
        const serialized = JSON.stringify(raw);
        record.result_characters = serialized.length;
        record.result_sha256 = hash(serialized);
        toolResults.push({ type: 'tool_result', tool_use_id: call.id, content: serialized, ...(raw.isError ? { is_error: true } : {}) });
      } catch (error) {
        record.error = cleanError(error);
        record.finished_at = new Date().toISOString();
        result.outcome = 'other error';
        turn.finished_at = new Date().toISOString();
        await save(result);
        return result;
      }
      record.finished_at = new Date().toISOString();
    }
    messages.push({ role: 'user', content: toolResults });
    turn.finished_at = new Date().toISOString();
    await save(result);
  }
  return result;
}
