import { z } from 'zod';
import { ConfirmPatchInputSchema, ConfirmPatchOutputSchema, GetVerificationResultOutputSchema, hashTools, diffTools, type Tool } from '../core/index.js';
import { readMetadata, type Metadata } from './audit.js';
export type ReadRun = (runId: string) => Promise<z.infer<typeof GetVerificationResultOutputSchema>>;
export type ConfirmDependencies = { readRun: ReadRun; readMetadata?: (url: string) => Promise<Metadata> };
const identity = (version: string) => { const at = version.lastIndexOf('@'); return at > 0 && at < version.length - 1 ? { deployment: version.slice(0, at), revision: version.slice(at + 1) } : null; };
export async function confirmPatch(raw: unknown, deps: ConfirmDependencies) {
  const input = ConfirmPatchInputSchema.parse(raw);
  const run = GetVerificationResultOutputSchema.parse(await deps.readRun(input.run_id));
  const gates = { run_approved: false, same_deployment: false, revision_updated: false, metadata_match: false };
  const approved = run.status === 'complete' && run.result.verdict === 'improved';
  if (!approved) return ConfirmPatchOutputSchema.parse({ match: false, gates, live_server_version: '', live_tools_hash: hashTools([]), verified_tools_hash: run.status === 'complete' ? run.result.config.candidate_tools_hash : hashTools([]), diffs: [], error: 'run_not_approved' });
  const live = await (deps.readMetadata ?? readMetadata)(input.server_url);
  const candidate: Tool[] = run.status === 'complete' ? run.result.candidate_tools : [];
  const output = { match: false, gates, live_server_version: live.server_version, live_tools_hash: hashTools(live.tools), verified_tools_hash: run.status === 'complete' ? run.result.config.candidate_tools_hash : hashTools(candidate), diffs: [] as ReturnType<typeof diffTools> };
  gates.run_approved = true;
  const baseId = identity(run.result.config.server_version), liveId = identity(live.server_version);
  if (!baseId || !liveId || baseId.deployment !== liveId.deployment) return ConfirmPatchOutputSchema.parse({ ...output, error: 'wrong_deployment' });
  gates.same_deployment = true;
  if (liveId.revision !== input.expected_revision || liveId.revision === baseId.revision) return ConfirmPatchOutputSchema.parse({ ...output, error: 'revision_mismatch' });
  gates.revision_updated = true;
  output.diffs = diffTools(candidate, live.tools);
  gates.metadata_match = output.diffs.length === 0;
  output.match = gates.metadata_match;
  return ConfirmPatchOutputSchema.parse(output);
}
export const confirmPatchTool = { name: 'confirm_patch', description: 'Confirm an Improved stored verification run against the same deployment on the expected new revision and exact full candidate tools/list.', inputSchema: ConfirmPatchInputSchema, outputSchema: ConfirmPatchOutputSchema, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true } };
export function createConfirmPatchTool(readRun: ReadRun) { return { definition: confirmPatchTool, handler: (input: unknown) => confirmPatch(input, { readRun }) }; }
