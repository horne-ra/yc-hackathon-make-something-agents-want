# S6 acceptance evidence

Checkpoint 1 base: main 19d59b7. All output is from actual checks on October 17, 2026 (Pacific). No new repository dependency was added, and no package/lockfile/core/server registration was modified.

## Deterministic and local integration checks

```text
pnpm test
Test Files  2 passed (2)
Tests       44 passed (44)
pnpm typecheck: exit 0
```

Four polling tests cover invalid/nonexistent IDs, transient control-plane failure, queued, running, older-than-60-second stalled, retained named runner failure, terminated/expired, and malformed files. Complete is covered by actual 24-trial integration, rather than a mocked success.

```text
pnpm exec tsx runner/acceptance.ts prepare
preflight: pass
server_version: trackr-demo-001@91b048476d764329df779e5662f9ca4952361397
base_tools_hash: sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5
pnpm exec tsx runner/acceptance.ts stale-local
PROGRESS 0/24
{"status":"failed","error":{"code":"stale_patch","message":"stale_patch: Live tools/list differs from patch.base_tools_hash"}}
```

The first local 24 uses the frozen compact PatchSpec, with current audited server version and the identical verified base hash/source; F's model proposal was not yet available. Prompts and tasks are the spec's four verbatim tasks, three trials per condition, provider-default sampling. Exact input and complete output are committed under `runner/evidence/`.

```text
pnpm exec tsx runner/acceptance.ts local
PROGRESS 0/24
PROGRESS 1/24 ... PROGRESS 24/24 (every increment observed)
{"status":"complete","totals":{"baseline":{"passed":9,"of":12,"result_tokens":115194},"candidate":{"passed":12,"of":12,"result_tokens":13272}},"verdict":"improved","trial_count":24}
```

All result fields validate against `VerificationResultSchema`. Baseline failures remain present. Config has no temperature. Static tools: baseline 651, candidate 837.

## Actual MCP client / Blaxel lifecycle

```text
pnpm exec tsx runner/acceptance.ts mcp-stale
{"elapsed_ms":690.246375,"under_one_second":true,"run_id":"axlint-run-a1d95084-fb39-4bda-a970-97a230f0cd50","status":"queued","total_trials":24}
```

The private server/client process then exited. A new independent process recovered the retained failure by sandbox ID:

```text
pnpm exec tsx runner/acceptance.ts mcp-read axlint-run-a1d95084-fb39-4bda-a970-97a230f0cd50 stale-poll.json
{"status":"failed","error":{"code":"stale_patch","message":"stale_patch: Live tools/list differs from patch.base_tools_hash"}}
```

This measures the entire MCP tool call (create sandbox, upload self-contained bundle and input, start detached process, return), not just the final SDK exec. It met the under-one-second requirement on this measurement; it is not a platform latency guarantee.

Actual sandbox 24-trial run and mid-run process restart: pending, not claimed complete yet.
