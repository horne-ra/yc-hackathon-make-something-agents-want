import type { Check, Failure, Finding, Json, Matcher, Task } from './contracts.js';
export type ToolCall = { name: string; arguments: Record<string, Json> };
export function matchArgument(matcher: Matcher, value: Json | undefined, present: boolean): boolean {
  if ('absent' in matcher) return !present;
  if ('any' in matcher) return present;
  if (!present) return false;
  if ('equals' in matcher) return value === matcher.equals;
  if ('contains' in matcher) return typeof value === 'string' && value.toLowerCase().includes(matcher.contains.toLowerCase());
  return matcher.oneOf.some(v => value === v);
}
export function scoreTrial(task: Pick<Task, 'expect'>, call: ToolCall | null, infraError?: string): { passed: boolean; failure: Failure; checks: Check[] } {
  if (infraError !== undefined) return { passed: false, failure: 'infra', checks: [{ what: 'infra', expected: 'successful model call and tool execution', actual: infraError, passed: false }] };
  if (!call) return { passed: false, failure: 'no_tool_call', checks: [{ what: 'tool', expected: task.expect.tool, actual: null, passed: false }] };
  const checks: Check[] = [{ what: 'tool', expected: task.expect.tool, actual: call.name, passed: call.name === task.expect.tool }];
  if (call.name !== task.expect.tool) return { passed: false, failure: 'wrong_tool', checks };
  for (const [key, matcher] of Object.entries(task.expect.args)) {
    const present = Object.hasOwn(call.arguments, key);
    checks.push({ what: `args.${key}`, expected: matcher, ...(present ? { actual: call.arguments[key] } : {}), passed: matchArgument(matcher, call.arguments[key], present) });
  }
  const passed = checks.every(c => c.passed);
  return { passed, failure: passed ? null : 'bad_args', checks };
}
function expectedText(task: Pick<Task, 'expect'>): string {
  const args = Object.entries(task.expect.args).map(([key, m]) => {
    if ('equals' in m) return `${key}=${JSON.stringify(m.equals)}`;
    if ('contains' in m) return `${key} contains ${JSON.stringify(m.contains)}`;
    if ('oneOf' in m) return `${key} oneOf ${JSON.stringify(m.oneOf)}`;
    return `${key} ${'absent' in m ? 'absent' : 'present'}`;
  });
  return `${task.expect.tool}(${args.join(', ')})`;
}
export function explain(task: Pick<Task, 'expect'>, call: ToolCall | null, findings: readonly Finding[] = [], infraError?: string): string {
  const score = scoreTrial(task, call, infraError);
  if (infraError !== undefined) return `Infrastructure error: ${infraError}.`;
  const actual = call ? `${call.name}(${Object.keys(call.arguments).sort().map(k => `${k}=${JSON.stringify(call.arguments[k])}`).join(', ')})` : 'no tool call';
  let text = score.passed ? `Expected ${expectedText(task)}; got ${actual}. Passed.` : `Expected ${expectedText(task)}; got ${actual}.`;
  if (score.passed) return text;
  const failedParams = score.checks.filter(c => !c.passed && c.what.startsWith('args.')).map(c => c.what.slice(5));
  const finding = findings.find(f => score.failure === 'wrong_tool'
    ? (f.tools?.includes(task.expect.tool) && !!call && f.tools.includes(call.name))
    : f.tool === task.expect.tool && (f.param === undefined || failedParams.includes(f.param)));
  if (finding) {
    const relation = finding.kind === 'sibling_overlap'
      ? `both tools read ${String(finding.evidence?.shared_noun ?? 'the same resource')} and neither says when to use it instead of the other`
      : finding.message.replace(/[.]$/, '');
    text += ` Related finding ${finding.id}: ${relation}.`;
  }
  return text;
}
