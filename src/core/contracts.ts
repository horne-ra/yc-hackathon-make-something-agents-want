import { z } from 'zod';

export const JsonSchema: z.ZodType<Json> = z.lazy(() => z.union([z.string(), z.number().finite(), z.boolean(), z.null(), z.array(JsonSchema), z.record(z.string(), JsonSchema)]));
export type Json = null | string | number | boolean | Json[] | { [key: string]: Json };
export const JsonObjectSchema = z.record(z.string(), JsonSchema);
export const ToolSchema = z.object({ name: z.string().min(1), description: z.string().optional(), inputSchema: JsonObjectSchema }).catchall(JsonSchema);
export type Tool = z.infer<typeof ToolSchema>;
export const ToolsSchema = z.array(ToolSchema).refine(t => new Set(t.map(x => x.name)).size === t.length, 'Tool names must be unique');
export const HashSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
export const MatcherSchema = z.union([
  z.strictObject({ equals: JsonSchema }), z.strictObject({ contains: z.string() }),
  z.strictObject({ oneOf: z.array(JsonSchema) }), z.strictObject({ absent: z.literal(true) }), z.strictObject({ any: z.literal(true) }),
]);
export type Matcher = z.infer<typeof MatcherSchema>;
export const ExpectSchema = z.strictObject({ tool: z.string().min(1), args: z.record(z.string(), MatcherSchema) });
export const TaskSchema = z.strictObject({ id: z.string().min(1), prompt: z.string(), control: z.boolean(), expect: ExpectSchema });
export type Task = z.infer<typeof TaskSchema>;
export const TasksSchema = z.strictObject({ tasks: z.array(TaskSchema).min(1) }).refine(v => new Set(v.tasks.map(t => t.id)).size === v.tasks.length, 'Task IDs must be unique');
const opBase = { tool: z.string().min(1), value: z.string(), finding_ids: z.array(z.string()) };
export const WireOpSchema = z.discriminatedUnion('op', [
  z.strictObject({ op: z.literal('set_tool_description'), ...opBase }),
  z.strictObject({ op: z.literal('set_param_description'), ...opBase, param: z.string().min(1) }),
]);
export type WireOp = z.infer<typeof WireOpSchema>;
export const WireOpsSchema = z.array(WireOpSchema);
export const FindingKindSchema = z.enum(['unclear_purpose', 'missing_usage_guidelines', 'opaque_parameter', 'unconstrained_string', 'sibling_overlap', 'payload_control_undocumented', 'description_too_long', 'missing_output_schema']);
export const FindingSchema = z.strictObject({ id: z.string(), kind: FindingKindSchema, severity: z.enum(['high', 'medium', 'warning']), tool: z.string().optional(), tools: z.array(z.string()).optional(), param: z.string().optional(), message: z.string(), evidence: JsonObjectSchema.optional() });
export type Finding = z.infer<typeof FindingSchema>;
export const ParamSummarySchema = z.strictObject({ name: z.string(), type: z.string(), required: z.boolean(), has_description: z.boolean(), has_enum: z.boolean() });
export const AuditSchema = z.strictObject({ audit_id: z.string(), server_url: z.url(), server_version: z.string(), tools_hash: HashSchema, static_tool_tokens: z.number().int().nonnegative(), tools: z.array(z.strictObject({ name: z.string(), description_chars: z.number().int().nonnegative(), params: z.array(ParamSummarySchema) })), findings: z.array(FindingSchema) });
export const SourceFileSchema = z.strictObject({ path: z.string(), content: z.string() });
export type SourceFile = z.infer<typeof SourceFileSchema>;
export const SourceEditSchema = z.strictObject({ file: z.string(), find: z.string().min(1), replace: z.string() });
export type SourceEdit = z.infer<typeof SourceEditSchema>;
export const WarningSchema = z.strictObject({ code: z.enum(['unverified_allowed_values', 'description_too_long']), tool: z.string(), param: z.string().optional(), message: z.string() });
export type Warning = z.infer<typeof WarningSchema>;
export const PatchSpecSchema = z.strictObject({ patch_id: z.string(), base_server_version: z.string(), base_source_hashes: z.record(z.string(), HashSchema), base_tools_hash: HashSchema, candidate_tools: ToolsSchema, candidate_tools_hash: HashSchema, wire_ops: WireOpsSchema, source_edits: z.array(SourceEditSchema), unified_diff: z.string(), static_tool_tokens: z.strictObject({ before: z.number().int().nonnegative(), after: z.number().int().nonnegative() }), warnings: z.array(WarningSchema).optional() });
export type PatchSpec = z.infer<typeof PatchSpecSchema>;
export const AuditInputSchema = z.strictObject({ server_url: z.url() });
export const ProposePatchInputSchema = z.strictObject({ audit: AuditSchema, source_files: z.array(SourceFileSchema).min(1), finding_ids: z.array(z.string()), style: z.enum(['compact', 'full']).default('compact') });
export const TrialsSchema = z.number().int().min(1).max(9).refine(n => n % 2 === 1, 'Trials must be odd');
export const VerifyPatchInputSchema = z.strictObject({ server_url: z.url(), patch: PatchSpecSchema, tasks: TasksSchema, trials: TrialsSchema, model: z.string().min(1).default('default') });
export const VerifyPatchOutputSchema = z.strictObject({ run_id: z.string(), status: z.literal('queued'), total_trials: z.number().int().positive() });
export const GetVerificationResultInputSchema = z.strictObject({ run_id: z.string() });
export const RunStatusSchema = z.enum(['queued', 'running', 'complete', 'failed', 'stalled', 'run_unavailable', 'run_expired']);
export const FailureSchema = z.enum(['wrong_tool', 'bad_args', 'no_tool_call', 'infra']).nullable();
export type Failure = z.infer<typeof FailureSchema>;
export const CheckSchema = z.strictObject({ what: z.string(), expected: JsonSchema, actual: JsonSchema.optional(), passed: z.boolean() });
export type Check = z.infer<typeof CheckSchema>;
export const TrialSchema = z.strictObject({ condition: z.enum(['baseline', 'candidate']), index: z.number().int().positive(), passed: z.boolean(), failure: FailureSchema, chosen_tool: z.string().nullable(), args: JsonObjectSchema, checks: z.array(CheckSchema), explanation: z.string(), model_text: z.string().nullable(), input_tokens: z.number().int().nonnegative(), output_tokens: z.number().int().nonnegative(), result_tokens: z.number().int().nonnegative(), latency_ms: z.number().nonnegative(), result_tokens_approximate: z.boolean().optional() }).refine(v => v.passed === (v.failure === null), 'Passed trials must have null failure');
export type Trial = z.infer<typeof TrialSchema>;
export const ConditionSummarySchema = z.strictObject({ passed: z.number().int().nonnegative(), of: z.number().int().nonnegative(), infra_errors: z.number().int().nonnegative(), insufficient_data: z.boolean().optional() }).refine(v => v.passed <= v.of, 'Pass count exceeds trials');
export type ConditionSummary = z.infer<typeof ConditionSummarySchema>;
export const TaskResultSchema = z.strictObject({ id: z.string(), control: z.boolean(), baseline: ConditionSummarySchema, candidate: ConditionSummarySchema, representative: z.strictObject({ baseline_trial: z.number().int().positive().nullable(), candidate_trial: z.number().int().positive().nullable() }), trials: z.array(TrialSchema) });
export type TaskResult = z.infer<typeof TaskResultSchema>;
export const VerdictSchema = z.enum(['regressed', 'inconclusive', 'improved']);
export const TotalSchema = z.strictObject({ passed: z.number().int().nonnegative(), of: z.number().int().nonnegative(), result_tokens: z.number().int().nonnegative() });
export const VerificationResultSchema = z.strictObject({ run_id: z.string(), provisional: z.literal(true), label: z.string(), config: z.strictObject({ model: z.string(), temperature: z.literal(0).optional(), trials: TrialsSchema, server_version: z.string(), tasks_hash: HashSchema, baseline_tools_hash: HashSchema, candidate_tools_hash: HashSchema }), candidate_tools: ToolsSchema, static_tool_tokens: z.strictObject({ baseline: z.number().int().nonnegative(), candidate: z.number().int().nonnegative() }), tasks: z.array(TaskResultSchema), totals: z.strictObject({ baseline: TotalSchema, candidate: TotalSchema }), verdict: VerdictSchema, verdict_reasons: z.array(z.string()) });
export const ProgressSchema = z.strictObject({ done: z.number().int().nonnegative(), total: z.number().int().nonnegative() }).refine(v => v.done <= v.total, 'Progress exceeds total');
export const RunErrorSchema = z.strictObject({ code: z.string(), message: z.string() });
export const GetVerificationResultOutputSchema = z.union([
  z.strictObject({ status: z.literal('complete'), progress: ProgressSchema, result: VerificationResultSchema }),
  z.strictObject({ status: z.literal('failed'), progress: ProgressSchema.optional(), error: RunErrorSchema }),
  z.strictObject({ status: z.enum(['queued', 'running', 'stalled', 'run_unavailable', 'run_expired']), progress: ProgressSchema.optional(), error: RunErrorSchema.optional() }),
]);
export const ConfirmPatchInputSchema = z.strictObject({ server_url: z.url(), run_id: z.string(), expected_revision: z.string().min(1) });
export const ToolDiffSchema = z.strictObject({ path: z.string(), verified: JsonSchema.optional(), live: JsonSchema.optional() });
export type ToolDiff = z.infer<typeof ToolDiffSchema>;
export const ConfirmPatchOutputSchema = z.strictObject({ match: z.boolean(), gates: z.strictObject({ run_approved: z.boolean(), same_deployment: z.boolean(), revision_updated: z.boolean(), metadata_match: z.boolean() }), live_server_version: z.string(), live_tools_hash: HashSchema, verified_tools_hash: HashSchema, diffs: z.array(ToolDiffSchema), error: z.enum(['run_not_approved', 'wrong_deployment', 'revision_mismatch']).optional() });
