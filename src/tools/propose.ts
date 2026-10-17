import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { ProposePatchInputSchema, PatchSpecSchema, WireOpsSchema, applyWireOps, generateSourceEdits, hashTools, validateDescriptionWarnings, type Tool, type WireOp, type PatchSpec } from '../core/index.js';
import { countStaticTokens, readMetadata, type AuditDependencies } from './audit.js';

const ProposalSchema = z.strictObject({ wire_ops: WireOpsSchema.min(1) });
// Provider strict schemas accept anyOf; these variants are disjoint by op.
const providerSchema = JSON.parse(JSON.stringify(z.toJSONSchema(ProposalSchema)).replaceAll('\"oneOf\":', '\"anyOf\":')) as Anthropic.Tool.InputSchema;
export type ProposalAttempt = { attempt: number; status: 'accepted' | 'rejected'; error?: string; wire_ops?: unknown };
export type ProposeDependencies = AuditDependencies & { propose?: (prompt: string, validationError?: string) => Promise<unknown>; onAttempt?: (attempt: ProposalAttempt) => void | Promise<void> };
function validateOps(raw: unknown, tools: Tool[], findingIds: string[], knownIds: Set<string>): WireOp[] {
  const { wire_ops } = ProposalSchema.parse(raw);
  const seen = new Set<string>();
  for (const op of wire_ops) {
    const key = `${op.tool}:${op.op === 'set_param_description' ? op.param : '$tool'}`;
    if (seen.has(key)) throw new Error(`duplicate_operation: ${key}`); seen.add(key);
    if (!op.finding_ids.length || op.finding_ids.some(id => !knownIds.has(id) || !findingIds.includes(id))) throw new Error('unknown_finding: each operation must reference selected audit findings');
  }
  for (const id of findingIds) if (!wire_ops.some(op => op.finding_ids.includes(id))) throw new Error(`unaddressed_finding: ${id}`);
  applyWireOps(tools, wire_ops); // Reject unknown tools/parameters and all non-description operations.
  return wire_ops;
}
export class ProposalValidationError extends Error {}
export function modelSubmission(content: Anthropic.ContentBlock[]): unknown {
  const submitted = content.filter(block => block.type === 'tool_use');
  if (submitted.length !== 1 || submitted[0]!.name !== 'submit_wire_ops') throw new ProposalValidationError('invalid_model_response: expected exactly one submit_wire_ops call');
  return submitted[0]!.input;
}
async function proposeWithModel(prompt: string, error?: string): Promise<unknown> {
  const model = process.env.AXLINT_MODEL;
  if (!model) throw new Error('missing_model: set AXLINT_MODEL');
  const client = new Anthropic({ maxRetries: 0, timeout: 90_000 });
  const response = await client.messages.create({ model, max_tokens: 4096, tools: [{ name: 'submit_wire_ops', strict: true, description: 'Submit only descriptive metadata operations addressing the selected findings.', input_schema: providerSchema }], messages: [{ role: 'user', content: prompt + (error ? `\nThe preceding attempt failed validation: ${error}\nReturn one corrected proposal.` : '') }] });
  return modelSubmission(response.content);
}
export async function proposePatch(raw: unknown, deps: ProposeDependencies = {}) {
  const input = ProposePatchInputSchema.parse(raw);
  const known = new Set(input.audit.findings.map(f => f.id));
  if (!input.finding_ids.length || input.finding_ids.some(id => !known.has(id))) throw new Error('unknown_finding: select existing audit finding IDs');
  const metadata = await (deps.readMetadata ?? readMetadata)(input.audit.server_url);
  if (metadata.server_version !== input.audit.server_version || hashTools(metadata.tools) !== input.audit.tools_hash) throw new Error('stale_audit: live identity or tools/list changed; audit again');
  const prompt = `You propose MCP metadata improvements. Return wire_ops only through submit_wire_ops. Allowed operations are set_tool_description and set_param_description on existing tools/parameters. Never change names, types, required, defaults, enum, handlers or behavior. Address every selected finding and cite its finding_ids. Style ${input.style}: ${input.style === 'compact' ? 'purpose, when to use and limitations; no examples' : 'purpose, usage guidelines, limitations, parameter meanings and constraints, output and examples'}. Use only facts supported by the supplied source. Preserve control tools unless selected findings require a change. State status allowed values as \"One of: ...\" only if a constant in source verifies them. State payload defaults and economical choices when source proves them.\n${JSON.stringify({ findings: input.audit.findings.filter(f => input.finding_ids.includes(f.id)), tools: metadata.tools, source_files: input.source_files })}`;
  let lastError: unknown;
  let draft: Omit<PatchSpec, 'static_tool_tokens'> | undefined;
  for (let attempt = 1; attempt <= 2; attempt++) {
    let proposal: unknown;
    try {
      proposal = await (deps.propose ?? proposeWithModel)(prompt, lastError instanceof Error ? lastError.message : undefined);
      const wire_ops = validateOps(proposal, metadata.tools, input.finding_ids, known);
      const candidate_tools = applyWireOps(metadata.tools, wire_ops);
      const generated = generateSourceEdits(input.source_files, wire_ops);
      const warnings = validateDescriptionWarnings(input.source_files, wire_ops);
      draft = { patch_id: `pat_${randomUUID()}`, base_server_version: metadata.server_version, base_tools_hash: hashTools(metadata.tools), candidate_tools, candidate_tools_hash: hashTools(candidate_tools), wire_ops, ...generated, ...(warnings.length ? { warnings } : {}) };
      await deps.onAttempt?.({ attempt, status: 'accepted', wire_ops });
      break;
    } catch (error) {
      lastError = error;
      await deps.onAttempt?.({ attempt, status: 'rejected', ...(proposal === undefined ? {} : { wire_ops: proposal }), error: error instanceof Error ? error.message : String(error) });
      // Retry validation failures once; provider/network failures are not validation failures.
      if (proposal === undefined && !(error instanceof ProposalValidationError)) throw error;
    }
  }
  if (!draft) throw new Error(`proposal_validation_failed: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
  return PatchSpecSchema.parse({ ...draft, static_tool_tokens: { before: input.audit.static_tool_tokens, after: await (deps.countStaticTokens ?? countStaticTokens)(draft.candidate_tools) } });
}
export const proposePatchTool = { name: 'propose_patch', description: 'Propose validated description-only metadata operations and deterministic Trackr source edits without writing files. Requires a fresh live audit and provided source.', inputSchema: ProposePatchInputSchema, outputSchema: PatchSpecSchema, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true } };
