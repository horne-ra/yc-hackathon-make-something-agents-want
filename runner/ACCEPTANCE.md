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

## Actual corrected proposal, 24 Blaxel trials, and restart

Lane F's first proposal had a finding-order defect: it missed the status finding. That run had already started when F caught the error. All 24 trials remain in `evidence/superseded-poll.json`, with its exact input/launch preserved. It returned **Inconclusive**, baseline 9/12 → candidate 11/12 and result tokens 115,194 → 17,148. One candidate t2-status call omitted status. It was never applied or relabeled Improved.

F generated a separate corrected proposal, with deterministic audit IDs in the raw wire order (canonicalization is used separately for hashing/model metadata). The corrected proposal has five description-only ops, untouched get_issue control, and static tool tokens 651 → 955. This is a different candidate from the frozen compact local run (651 → 837); their metrics are never combined.

```text
pnpm exec tsx runner/acceptance.ts prepare /private/tmp/axlint-phase2-proposed-patch-v2.json
preflight: pass; same live 91b0484 server/version/base hash
pnpm exec tsx runner/acceptance.ts mcp-start
run_id: axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395
status: queued; total_trials: 24
elapsed_ms: 1259.0631250000001; under_one_second: false
```

The launching AX Lint process exited. A new independently started MCP server/client recovered the still-running sandbox, then another process read all 24 trials and validated the complete core contract:

```text
mcp-read latest restarted-running-poll.json
{"status":"running","progress":{"done":0,"total":24}}
mcp-read latest corrected-complete-poll.json
{"status":"complete","progress":{"done":24,"total":24},"totals":{"baseline":{"passed":9,"of":12,"result_tokens":115194},"candidate":{"passed":12,"of":12,"result_tokens":13917}},"verdict":"improved","server_version":"trackr-demo-001@91b048476d764329df779e5662f9ca4952361397"}
```

The completed exact `VerificationResult` is `.result` in `evidence/corrected-complete-poll.json`; input, config, exact candidate, all failure trials, hashes, actual latencies/usage, and representative IDs are retained. No trial is infra and no count is approximate. Root received the completed result before applying anything. The first F proposal and the local frozen proposal remain separately identifiable.

## Launch timing failure and measured fix

The 1,259.063 ms corrected-proposal launch **failed** the under-one-second requirement. That evidence is retained unchanged in `evidence/corrected-launch.json`; this failure is not averaged away. The launcher was then changed to upload gzip/base64 data and create a new UUID sandbox directly, eliminating an unnecessary existence lookup. No dependency was added.

Only intentionally stale patches were launched for performance checks after the baseline window closed; no new provider trial ran during or after the approved Trackr redeployment.

```text
gzip-only launch: 721.497459 ms (<1 second); retained stale_patch recovered
final gzip + direct-create launch: 701.65725 ms (<1 second)
final run_id: axlint-run-f8cd9acc-efd8-4ae2-a138-54a040d03831
final new-process poll:
{"status":"failed","error":{"code":"stale_patch","message":"stale_patch: Live tools/list differs from patch.base_tools_hash"}}
```

The final launcher passed the actual measured requirement. It remains a network measurement rather than a guaranteed SLA. Every launch timing is committed (initial690.246, superseded702.442, corrected1259.063, gzip-only721.497, final701.657).

```text
mcp-read axlint-run-not-a-real-run nonexistent-poll.json
{"status":"run_expired","error":{"code":"run_not_found","message":"Sandbox no longer exists; re-run verify_patch"}}
```

S6 acceptance: **all three checks pass**: actual MCP start/poll complete24 with valid schema; stale→failed/stale_patch; nonexistent→run_expired plus process restart while running loses nothing. Under-one-second launch passes after the recorded fix. No S6 check was skipped. Hosted production registration/deployment belongs to Checkpoint 2 / S8, not this lane. Two-hour retention is guaranteed by the configured lifetime budget (4-hour TTL,30-minute maximum runner); a two-hour elapsed read was not waited for in S6. No new dependencies, no secret-bearing files, no production registration, and no core edits.

