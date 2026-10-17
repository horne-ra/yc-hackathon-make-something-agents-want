# Lane F / S7 acceptance evidence

Worktree: axlint-tools; branch: lane/tools. Phase 2 does not register tools in src/server.ts. No dependencies or root configuration changes.

## Passing deterministic milestone (October 17, 2026, 2:11 PM Pacific)

```text
pnpm typecheck: exit 0
pnpm exec vitest run src/tools/propose.test.ts src/tools/confirm.test.ts
Test Files  2 passed (2)
Tests       12 passed (12)
```

Checks: metadata-only audit; deterministic F1–F3; unknown parameter rejected on both validation attempts; one validation retry receives the error; source edits and candidate derived from wire ops; stale audit blocks model; full style includes examples without broadening allowed operations; long descriptions and unverified values warn; confirm gates reject Inconclusive/running, wrong deployment and unchanged revision, detect a non-description metadata difference by exact path, and pass only exact candidate on a new revision.

Earlier harness run: 5 passed, 1 failed. The unknown-parameter test accidentally renamed two parameters to the same nonexistent name, so duplicate_operation rejected first. Corrected the test to rename only status, preserving unknown-parameter acceptance coverage. No production code was loosened to pass the check.

Live proposal is pending approval-review resolution: automatic approval review rejected a command that would send three Trackr source files to Anthropic, despite the authorized model-backed propose story. No model request was sent by the rejected command. Root is resolving source/destination scope. Real audit, proposal fidelity and real redeployed confirm are not claimed complete.

## Registration at Checkpoint 2

```ts
import { auditServer, auditServerTool } from './tools/audit.js';
import { proposePatch, proposePatchTool } from './tools/propose.js';
import { createConfirmPatchTool } from './tools/confirm.js';
import { readRun } from './blaxel/runs.js';
const jsonResult = (data: object) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data) }],
  structuredContent: data,
});
server.tool(auditServerTool, async input => jsonResult(await auditServer(input)));
server.tool(proposePatchTool, async input => jsonResult(await proposePatch(input)));
const confirm = createConfirmPatchTool(readRun);
server.tool(confirm.definition, async input => jsonResult(await confirm.handler(input)));
```

`readRun` is injected and matches core GetVerificationResultOutputSchema. No imports of another worktree or unmerged implementation. All tools are read-only with respect to target and repository. `proposePatch` returns source edits and never writes them. The acceptance harness may write sanitized JSON evidence and the temporary shared candidate file.

## Live audit/proposal/fidelity milestone (2:14 PM Pacific)

Root verified `horne-ra/trackr` is public (`isPrivate:false`), correcting the approval review's premise. The same direct request was accepted on retry with that evidence. Three already-public Trackr source files were sent to the explicitly configured Anthropic provider; no .env or credentials were included.

Preserved failures, not hidden:

1. `propose.failed-forced-tool.json`: provider HTTP400, forced tool_choice `tool`/`any` unsupported by this model. Switched to default auto selection.
2. `propose.failed-oneof-schema.json`: provider HTTP400, strict schema `oneOf` unsupported. Used `anyOf` for the disjoint operation variants; local strict Zod validation remains authoritative. Provider schema support: https://platform.claude.com/docs/en/build-with-claude/structured-outputs.
3. `propose.superseded-audit-order.json` and `propose.superseded-audit-attempts.json`: first generated patch mechanically passed fidelity, but audit metadata had been sorted before finding assignment, making F2 point to get_issue.id. This missed the specified status finding and touched the control parameter. Rejected for S7; original patch is preserved at `/private/tmp/axlint-phase2-proposed-patch.json`. E had already started one 24-trial sandbox run on it; the run stays recorded and is not approved for apply.

Fix: preserve real tools/list order for deterministic audit; canonicalize only for hashes and comparisons. Live assertions now require F2=list_issues.status and F3=list_issues.include_comments. The corrected proposal's control is untouched.

Corrected live evidence: `propose.live-evidence.json`, `propose.attempts.json`. Shared corrected PatchSpec `/private/tmp/axlint-phase2-proposed-patch-v2.json` (the original candidate is not overwritten).

```text
PASS live audit: F1–F3
server_version=trackr-demo-001@91b048476d764329df779e5662f9ca4952361397
base_tools_hash=sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5
PROPOSAL attempt 1: accepted
PASS compact proposal: 5 description ops, 5 deterministic edits, 0 warnings, static 651 → 955
PASS exact wire description: list_issues
PASS exact wire description: search_issues
PASS exact wire description: list_issues.status
PASS exact wire description: list_issues.include_comments
PASS exact wire description: search_issues.include_comments
PASS source fidelity: real mcp-use tools/list equals baseline plus wire_ops; all non-description metadata unchanged
PASS cleanup: temporary trackr source and server processes removed
pnpm typecheck: exit 0
Test Files 3 passed (3)
Tests 57 passed (57)
```

An added provider-response retry test initially failed TypeScript because its mock omitted the current SDK's required `caller` field; corrected mock to `caller:{type:'direct'}`. Actual retry checks now pass for missing, multiple and wrong tool submissions. Provider/network errors and token-count failures do not trigger new proposals. There is no temperature field in any production request.

The remaining S7 acceptance is the real before/after confirm using E's stored approved run and root's serialized apply/redeploy. No Trackr source/deployment mutation has been performed by this lane.

## Real negative confirm gates (2:16 PM Pacific)

Using E's actual independent Blaxel `readRun` adapter (passed explicitly to the acceptance harness, not imported by production):

```text
PASS real Inconclusive stored run rejected at gate 1: run_not_approved; no target metadata read
PASS real Improved stored run rejected at gate 3 before redeploy: revision_mismatch
live=trackr-demo-001@91b048476d764329df779e5662f9ca4952361397
```

Actual Inconclusive run `axlint-run-78daa3da-4a36-41d2-a2e6-2d9d1df41247` used the superseded proposal (9/12 → 11/12, retained). Final Improved run `axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395` used corrected v2 (9/12 → 12/12; result tokens 115,194 → 13,917; static 651 → 955). These Phase 2 numbers differ from the original frozen compact-patch Phase 1 numbers; neither is rewritten. Full negative outputs in `confirm.before-evidence.json`. Root informed the unchanged baseline acceptance window is complete and it may now serialize the exact v2 apply/redeploy.
