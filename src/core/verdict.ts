import type { ConditionSummary, TaskResult, Trial } from './contracts.js';
export const provisionalLabel = (trials: number): string => `Provisional: ${trials} trials per condition. A demonstration, not a statistical claim.`;
export function summarizeCondition(trials: readonly Trial[]): ConditionSummary {
  const valid = trials.filter(t => t.failure !== 'infra');
  const infra_errors = trials.length - valid.length;
  return { passed: valid.filter(t => t.passed).length, of: valid.length, infra_errors, insufficient_data: infra_errors > 1 };
}
export function representativeTrial(trials: readonly Trial[]): number | null {
  const valid = trials.filter(t => t.failure !== 'infra').sort((a, b) => a.index - b.index);
  if (!valid.length) return null;
  const passes = valid.filter(t => t.passed).length;
  if (passes === valid.length / 2) return null;
  const majority = passes > valid.length / 2;
  return valid.find(t => t.passed === majority)?.index ?? null;
}
export function evaluateVerdict(tasks: readonly Pick<TaskResult, 'id' | 'control' | 'baseline' | 'candidate'>[]): { verdict: 'regressed' | 'inconclusive' | 'improved'; verdict_reasons: string[] } {
  const insufficient = (s: ConditionSummary) => s.infra_errors > 1 || s.insufficient_data === true;
  const complete = tasks.filter(t => !insufficient(t.baseline) && !insufficient(t.candidate));
  const delta = (t: typeof complete[number]) => t.candidate.passed - t.baseline.passed;
  const reasons = tasks.map(t => {
    if (insufficient(t.baseline) || insufficient(t.candidate)) return `${t.id} has insufficient_data`;
    const before = `${t.baseline.passed}/${t.baseline.of}`, after = `${t.candidate.passed}/${t.candidate.of}`;
    return delta(t) === 0 ? `${t.id} unchanged at ${after}` : `${t.id} ${delta(t) > 0 ? 'rose' : 'fell'} ${before} to ${after}`;
  });
  if (complete.some(t => (t.control && delta(t) < 0) || delta(t) <= -2)) return { verdict: 'regressed', verdict_reasons: reasons };
  if (complete.length !== tasks.length) return { verdict: 'inconclusive', verdict_reasons: reasons };
  if (tasks.length > 0 && complete.every(t => delta(t) >= 0) && complete.some(t => !t.control && delta(t) >= 2)) return { verdict: 'improved', verdict_reasons: reasons };
  return { verdict: 'inconclusive', verdict_reasons: reasons };
}
