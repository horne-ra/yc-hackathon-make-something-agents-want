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
