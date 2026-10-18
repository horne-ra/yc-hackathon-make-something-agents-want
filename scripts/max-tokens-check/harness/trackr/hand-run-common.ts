import Anthropic from '@anthropic-ai/sdk';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const SYSTEM = 'You are an assistant with access to an issue tracker. Use the available tools to help the user.';
export const LABEL = 'Provisional: 3 trials per condition. A demonstration, not a statistical claim.';
export type Condition = 'baseline' | 'candidate';
export type Task = { id: string; prompt: string; control?: boolean; unscored?: boolean; expect: { tool: string; args?: Record<string, { equals?: unknown; contains?: string; oneOf?: unknown[]; absent?: boolean; any?: boolean }> }; checkArgs?: (args: Record<string, unknown>) => boolean };
export type Connection = { tools: Tool[]; call: (name: string, args: Record<string, unknown>) => Promise<unknown>; close: () => Promise<void>; identity?: unknown };
export type Trial = { task_id: string; prompt: string; condition: Condition; trial: number; tool: string | null; arguments: Record<string, unknown> | null; passed: boolean | null; failure: string | null; result_tokens: number; result_tokens_approximate: boolean; input_tokens: number; output_tokens: number; model_text: string; executed: boolean; attempts: unknown[]; error?: string; server_pid?: unknown; result_is_error?: boolean; stop_reason?: Anthropic.Message['stop_reason']; pre_tool_text_present?: boolean | null; pre_tool_text_characters?: number | null; pre_tool_text_words?: number | null; model_response_file?: string };

export function loadEnvironment() {
  try { process.loadEnvFile(resolve('.env')); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  for (const name of ['ANTHROPIC_API_KEY', 'AXLINT_MODEL']) if (!process.env[name]) throw new Error(`Missing ${name} in .env; ask the lead to populate it.`);
  return { model: process.env.AXLINT_MODEL!, provider: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0, timeout: 60_000 }) };
}
export function cleanError(error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  const key = process.env.ANTHROPIC_API_KEY;
  return key ? detail.split(key).join('[redacted]') : detail;
}
export function providerTools(tools: Tool[]): Anthropic.Tool[] {
  return tools.map(t => ({ name: t.name, description: t.description ?? '', input_schema: t.inputSchema as Anthropic.Tool.InputSchema }));
}
export async function tokenCount(provider: Anthropic, model: string, value: unknown) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  try { return { tokens: (await provider.messages.countTokens({ model, messages: [{ role: 'user', content: text }] })).input_tokens, approximate: false }; }
  catch (error) { return { tokens: Math.ceil(text.length / 4), approximate: true, error: cleanError(error) }; }
}
function score(task: Task, name: string, args: Record<string, unknown>) {
  if (task.unscored) return { passed: null, failure: null };
  if (name !== task.expect.tool) return { passed: false, failure: 'wrong_tool' };
  const pass = Object.entries(task.expect.args ?? {}).every(([key, matcher]) => {
    const value = args[key];
    if ('equals' in matcher) return value === matcher.equals;
    if ('contains' in matcher) return typeof value === 'string' && value.toLowerCase().includes(matcher.contains!.toLowerCase());
    if ('oneOf' in matcher) return matcher.oneOf!.includes(value);
    if ('absent' in matcher) return !Object.hasOwn(args, key);
    if ('any' in matcher) return Object.hasOwn(args, key);
    return false;
  }) && (!task.checkArgs || task.checkArgs(args));
  return { passed: pass, failure: pass ? null : 'bad_args' };
}
export async function executeAllowed(connection: Connection, allowlist: ReadonlySet<string>, name: string, args: Record<string, unknown>) {
  // Enforcement lives at the execution boundary, never only in the prompt or scorer.
  if (!allowlist.has(name)) return { executed: false, blocked: true, result: undefined };
  return { executed: true, blocked: false, result: await connection.call(name, args) };
}
function shuffled<T>(items: T[]) {
  let state = 173201;
  const random = () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 2 ** 32; };
  for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
  return items;
}
export function summarizeConsistency(trials: Trial[]) {
  const stable = (value: unknown): unknown => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, entry]) => [key, stable(entry)])) : value;
  return [...new Set(trials.map(trial => trial.task_id))].sort().flatMap(task_id => (['baseline', 'candidate'] as const).map(condition => {
    const rows = trials.filter(trial => trial.task_id === task_id && trial.condition === condition).sort((a, b) => a.trial - b.trial);
    const call_disagreement = new Set(rows.map(row => JSON.stringify(stable({ tool: row.tool, arguments: row.arguments })))).size > 1;
    const outcome_disagreement = new Set(rows.map(row => JSON.stringify({ passed: row.passed, failure: row.failure }))).size > 1;
    const result_token_disagreement = new Set(rows.map(row => row.result_tokens)).size > 1;
    return { task_id, condition, trial_count: rows.length, trial_ids: rows.map(row => row.trial), disagree: call_disagreement || outcome_disagreement || result_token_disagreement, call_disagreement, outcome_disagreement, result_token_disagreement };
  }));
}
export async function runBenchmark(options: { name: string; tasks: Task[]; connect: () => Promise<Connection>; patch: (tools: Tool[]) => Tool[]; allowlist: ReadonlySet<string>; provenance: unknown }) {
  const { provider, model } = loadEnvironment();
  // Use provider-default sampling for every model, as required by the benchmark protocol.
  const sampling = {};
  const output = resolve('scripts/results', `${options.name}-${new Date().toISOString().replaceAll(':', '-')}`);
  await mkdir(output, { recursive: true });
  const report: Record<string, unknown> = { status: 'preflight', label: LABEL, model, system: SYSTEM, temperature: 'omitted; model-default sampling', sampling_departure: 'User explicitly requires provider-default sampling with no temperature field for the cross-model check.', max_tokens: 4096, tool_choice: 'auto', shuffle_seed: 173201, concurrency: 4, provenance: options.provenance, tasks: options.tasks.map(({ checkArgs, ...task }) => task), trials: [] };
  const trials = report.trials as Trial[];
  let saveQueue = Promise.resolve();
  function save() { const data = JSON.stringify(report, null, 2); saveQueue = saveQueue.then(async () => { await writeFile(`${output}/progress.json.tmp`, data); await rename(`${output}/progress.json.tmp`, `${output}/progress.json`); }); return saveQueue; }
  await save();
  try {
    // The configured ID is checked unchanged; unavailable models must never be substituted.
    report.model_details = await provider.models.retrieve(model);
  } catch (error) {
    report.status = 'blocked'; report.preflight_error = cleanError(error); await save();
    await writeFile(`${output}/result.json`, JSON.stringify(report, null, 2));
    console.error(`MODEL PREFLIGHT BLOCKED ${cleanError(error)}\nReport: ${output}/result.json`);
    process.exitCode = 1; return;
  }
  const metadataConnection = await options.connect();
  let baseline: Tool[];
  try { baseline = metadataConnection.tools; report.server_identity = metadataConnection.identity; }
  finally { await metadataConnection.close(); }
  const candidate = options.patch(structuredClone(baseline));
  // Prove only tool-description and existing parameter-description values differ.
  const stripDescriptions = (value: unknown): unknown => Array.isArray(value) ? value.map(stripDescriptions) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'description').map(([key, val]) => [key, stripDescriptions(val)])) : value;
  if (JSON.stringify(stripDescriptions(baseline)) !== JSON.stringify(stripDescriptions(candidate))) throw new Error('Candidate changed non-description metadata');
  report.baseline_tools = baseline; report.candidate_tools = candidate;
  const without = await provider.messages.countTokens({ model, system: SYSTEM, messages: [{ role: 'user', content: 'Count.' }] });
  const counts = await Promise.all([baseline, candidate].map(async tools => (await provider.messages.countTokens({ model, system: SYSTEM, tools: providerTools(tools), messages: [{ role: 'user', content: 'Count.' }] })).input_tokens - without.input_tokens));
  report.static_tool_tokens = { baseline: counts[0], candidate: counts[1], approximate: false };
  report.status = 'running'; await save();
  const jobs = shuffled(options.tasks.flatMap(task => [1, 2, 3].flatMap(trial => (['baseline', 'candidate'] as const).map(condition => ({ task, trial, condition })))));
  let nextJob = 0;
  console.log(`MODEL ${model} | ${LABEL}\nTASK\tCONDITION\tTRIAL\tTOOL\tARGUMENTS\tPASS\tRESULT TOKENS`);
  async function worker() {
    while (nextJob < jobs.length) {
      const { task, trial, condition } = jobs[nextJob++];
      const record: Trial = { task_id: task.id, prompt: task.prompt, condition, trial, tool: null, arguments: null, passed: false, failure: null, result_tokens: 0, result_tokens_approximate: false, input_tokens: 0, output_tokens: 0, model_text: '', executed: false, attempts: [] };
      let connection: Connection | undefined;
      try {
        connection = await options.connect(); record.server_pid = connection.identity;
        if (JSON.stringify(connection.tools) !== JSON.stringify(baseline)) throw new Error('Live tools/list changed during benchmark');
        let response: Anthropic.Message | undefined;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            response = await provider.messages.create({ model, system: SYSTEM, ...sampling, max_tokens: 4096, tool_choice: { type: 'auto' }, tools: providerTools(condition === 'baseline' ? baseline : candidate), messages: [{ role: 'user', content: task.prompt }] });
            record.attempts.push({ attempt: attempt + 1, status: 'ok' }); break;
          } catch (error) {
            const status = (error as { status?: number }).status;
            record.attempts.push({ attempt: attempt + 1, status, error: cleanError(error) });
            if (attempt >= 2 || (status !== 429 && !(status && status >= 500))) throw error;
            await new Promise(r => setTimeout(r, 1000 * 2 ** attempt));
          }
        }
        if (!response) throw new Error('Provider returned no response');
        record.input_tokens = response.usage.input_tokens; record.output_tokens = response.usage.output_tokens;
        const firstToolIndex = response.content.findIndex(block => block.type === 'tool_use');
        record.model_text = response.content.slice(0, firstToolIndex === -1 ? undefined : firstToolIndex).filter(block => block.type === 'text').map(block => block.type === 'text' ? block.text : '').join('\n');
        // Observation only: no request, scoring, or dispatch changes.
        record.stop_reason = response.stop_reason;
        record.pre_tool_text_present = firstToolIndex < 0 ? null : record.model_text.length > 0;
        record.pre_tool_text_characters = firstToolIndex < 0 ? null : [...record.model_text].length;
        record.pre_tool_text_words = firstToolIndex < 0 ? null : record.model_text.trim() ? record.model_text.trim().split(/\s+/u).length : 0;
        record.model_response_file = `${task.id}-${condition}-${trial}-model.json`;
        await writeFile(`${output}/${record.model_response_file}`, JSON.stringify(response, null, 2));
        const call = response.content.find(block => block.type === 'tool_use');
        if (!call || call.type !== 'tool_use') { record.failure = 'no_tool_call'; }
        else {
          record.tool = call.name; record.arguments = call.input as Record<string, unknown>;
          Object.assign(record, score(task, call.name, record.arguments));
          const execution = await executeAllowed(connection, options.allowlist, call.name, record.arguments);
          record.executed = execution.executed;
          if (execution.blocked) { record.passed = false; record.failure = 'wrong_tool'; }
          else {
            record.result_is_error = Boolean((execution.result as { isError?: boolean }).isError);
            await writeFile(`${output}/${task.id}-${condition}-${trial}-response.json`, JSON.stringify(execution.result, null, 2));
            const tokenResult = await tokenCount(provider, model, execution.result);
            record.result_tokens = tokenResult.tokens; record.result_tokens_approximate = tokenResult.approximate;
            if (tokenResult.error) record.attempts.push({ stage: 'count_result_tokens', error: tokenResult.error, fallback: 'ceil(characters / 4)' });
          }
        }
      } catch (error) { record.passed = false; record.failure = 'infra'; record.error = cleanError(error); }
      finally {
        if (connection) try { await connection.close(); } catch (error) { record.attempts.push({ stage: 'cleanup', error: cleanError(error) }); record.failure = 'infra'; record.passed = false; }
      }
      trials.push(record);
      console.log([task.id, condition, trial, record.tool ?? '-', JSON.stringify(record.arguments), record.failure === 'infra' ? `INFRA: ${record.error}` : task.unscored && record.failure !== 'wrong_tool' ? 'UNSCORED' : record.passed ? 'PASS' : `FAIL:${record.failure}`, `${record.result_tokens}${record.result_tokens_approximate ? ' approximate' : ''}`].join('\t'));
      await save();
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  report.status = 'complete';
  const summary = options.tasks.map(task => ({ task_id: task.id, control: Boolean(task.control), unscored: Boolean(task.unscored), ...Object.fromEntries((['baseline', 'candidate'] as const).map(condition => {
    const rows = trials.filter(t => t.task_id === task.id && t.condition === condition);
    return [condition, { passed: task.unscored ? null : rows.filter(t => t.passed).length, of: rows.filter(t => t.failure !== 'infra').length, infra_errors: rows.filter(t => t.failure === 'infra').length, insufficient_data: rows.filter(t => t.failure === 'infra').length > 1, result_tokens: rows.reduce((sum, t) => sum + t.result_tokens, 0) }];
  })) }));
  report.summary = summary;
  report.per_condition_consistency = summarizeConsistency(trials);
  await save();
  await writeFile(`${output}/result.json`, JSON.stringify(report, null, 2));
  const table = ['# ' + options.name, '', LABEL, '', `Model: ${model}`, '', '| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |', '| --- | --- | --- | --- | --- | --- | --- |', ...trials.map(row => `| ${row.task_id} | ${row.condition} | ${row.trial} | ${row.tool ?? '-'} | ${JSON.stringify(row.arguments).replaceAll('|', '\\|')} | ${row.failure === 'infra' ? 'infra' : row.passed === null ? 'unscored' : row.passed ? 'pass' : `fail: ${row.failure}`} | ${row.result_tokens}${row.result_tokens_approximate ? ' approximate' : ''} |`), '', '## Summary', '', '```json', JSON.stringify(summary, null, 2), '```', ''].join('\n');
  await writeFile(`${output}/table.md`, table);
  console.log(JSON.stringify(summary, null, 2));
  console.log("PER-CONDITION CONSISTENCY", JSON.stringify(report.per_condition_consistency, null, 2));
  console.log(`Full results: ${output}/result.json\nReadable table: ${output}/table.md`);
  if (trials.some(row => row.failure === 'infra')) process.exitCode = 1;
}
