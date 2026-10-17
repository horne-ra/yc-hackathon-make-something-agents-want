# Verification runner (Lane E)

The runner is a direct Anthropic single-turn harness. It shows baseline/candidate metadata while executing every chosen call against the identical live MCP endpoint. The task order is shuffled using fixed seed 173201, with four workers. No temperature parameter is sent. Every trial, including infra and wrong-tool/bad-argument results, is retained. Only 429/5xx provider calls retry (twice, exponential backoff). Source edits are never applied by the runner.

`main.ts <input.json> <run_id> [output_directory]` reads `VerifyPatchInputSchema`, atomically writes progress after every finished trial, then writes the exact candidate plus server version and a schema-validated result. `engine.ts` uses the pure core scoring, explanation, canonicalization, hashing, audit and verdict functions. Real provider counts define static and result tokens; result counting alone falls back to `ceil(characters/4)` with `result_tokens_approximate: true`.

`node runner/build-payload.mjs` builds the committed self-contained `payload.ts` using esbuild from the existing locked tsx development dependency. Run it after changing runner/core dependencies. The deployment imports the generated string, so there is no build tool or filesystem dependency in production. The Blaxel process executes the plain Node22-compatible bundle; no cold npm installation is required. The bundle contains no environment values or secrets.

`src/blaxel/runs.ts` exports `startRun(input)` and `readRun(run_id)`. Each run gets a new retained sandbox; the sandbox name is its run_id. Only the Anthropic key and pinned model are passed as process environment; keys are never written to run files. The process has a 30-minute hard limit. Creation TTL is four hours, leaving at least 3.5 hours after an allowed run's completion, exceeding the two-hour spec requirement. Files survive standby, and expire with sandbox TTL or explicit deletion. AX Lint has no run registry, and a fresh process can recover a run solely by ID.

Production registration for Checkpoint 2 (do not register before merge):

```ts
import { verifyPatchDefinition, verifyPatchHandler } from './tools/verify-patch.js';
import { getVerificationResultDefinition, getVerificationResultHandler } from './tools/get-verification-result.js';
server.tool(verifyPatchDefinition, verifyPatchHandler);
server.tool(getVerificationResultDefinition, getVerificationResultHandler);
```

The viewer hookup is intentionally deferred to the lead's Checkpoint 2 integration. `readRun(run_id): Promise<z.infer<typeof GetVerificationResultOutputSchema>>` is the reader to inject into Lane F's confirm factory.

`pnpm exec tsx runner/acceptance.ts prepare [PatchSpec.json]` checks the live base hash and records its actual version, without changing metadata. `local`, `stale-local`, `mcp-start`, `mcp-stale`, and `mcp-read <run_id> [output.json]` run the private acceptance harness. It mounts only these two tools in a temporary local MCP server and shuts down after every invocation. It never registers tools in production or edits Trackr.
