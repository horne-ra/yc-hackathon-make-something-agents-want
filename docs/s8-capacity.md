# S8 capacity repair (A)

Recorded October 17, 2026. Trackr and Railway were not accessed.

## Evidence exported before any cleanup

Export: `scripts/results/blaxel-export-2026-10-17T22-18-48.408Z`. All nine existing verification sandboxes were visited; 22 available run files were saved. No sandbox was deleted.

| Sandbox | Saved files | Absent files | Completed (UTC) |
| --- | --- | --- | --- |
| `axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951` | context.json, progress.json, result.json | none | Sat, 17 Oct 2026 22:03:39 GMT |
| `axlint-run-d0119595-a705-4229-89ee-29b93d71d6db` | context.json, progress.json, result.json | none | Sat, 17 Oct 2026 21:54:07 GMT |
| `axlint-run-49279710-1dfa-4e6f-ad80-77992da8d99e` | context.json, progress.json, result.json | none | Sat, 17 Oct 2026 21:53:44 GMT |
| `axlint-run-5ce8aaba-bb3a-4410-9d49-03bd849f5f69` | context.json, progress.json, result.json | none | Sat, 17 Oct 2026 21:53:11 GMT |
| `axlint-run-f8cd9acc-efd8-4ae2-a138-54a040d03831` | progress.json, result.json | context.json | Sat, 17 Oct 2026 21:15:44 GMT |
| `axlint-run-f94f13bf-e7fb-41a7-a893-6b1206c60c4a` | progress.json, result.json | context.json | Sat, 17 Oct 2026 21:15:01 GMT |
| `axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395` | progress.json, result.json | context.json | Sat, 17 Oct 2026 21:14:23 GMT |
| `axlint-run-78daa3da-4a36-41d2-a2e6-2d9d1df41247` | progress.json, result.json | context.json | Sat, 17 Oct 2026 21:13:22 GMT |
| `axlint-run-a1d95084-fb39-4bda-a970-97a230f0cd50` | progress.json, result.json | context.json | Sat, 17 Oct 2026 21:11:53 GMT |

The five absent context files returned filesystem 404, rather than being discarded by the exporter. The manifest records each response. Exported `result.json` includes failed, Inconclusive and Regressed runs as observed.

## Policy and checks

- Only completed `axlint-run-*` sandboxes can be removed, and only when both creation and successful process completion are strictly older than two hours. A final atomic `result.json` and successful process are required; missing evidence fails closed. Historical running progress markers are superseded only by that successful terminal process and final result.
- Cleanup runs only at capacity, orders by completion time oldest first, rechecks eligibility before deletion and stops when one slot is free. Queued/running runs, recent runs, unknown/failed runs, other projects and the `axlint-spike-*` proof are protected.
- New runs use `ttl: 2h15m`. The process deadline is at most fourteen minutes after the creation request starts (including preparation), leaving over two hours after completion. Existing run TTLs are not shortened.
- New run memory: 256 MB. Offline replay of the actual verification engine completed all 24 archived turns with a peak RSS of 98,676,736 bytes (94.1 MiB); replay used frozen metadata/tasks and blocked all outbound network access. Replay response sizes include 10,408-word payloads. This is a resource measurement, not new model/benchmark evidence. The 256 MB budget accounts for Blaxel tmpfs reservation; a real 256 MB VM acceptance probe was blocked by quota, so the smallest working VM size is **not yet confirmed**. See `scripts/results/blaxel-memory-measurement.json`.
- `QUOTA_EXCEEDED` now returns an MCP tool error with code `capacity_exhausted` and a plain explanation. Other provider errors are also named; thrown objects never become `[object Object]`, and diagnostic secrets are redacted.
- `pnpm typecheck`: passed. `pnpm test`: 7 files passed, 86 tests passed. `pnpm build`: built server + ping, preview-run and verification-result views.

## Capacity remains externally blocked

At 22:22 UTC, all ten slots were still DEPLOYED. Every verification sandbox was younger than two hours. **Free slots: 0. No eligible deletion; no sandbox deleted.** The earliest successful complete result becomes eligible after 23:13:22 UTC (4:13:22 PM Pacific). Failed result files are protected even when old. The proof sandbox remains protected regardless of age.

To unblock sooner: increase the Blaxel workspace `axlint` sandbox quota, then set the optional Manufact environment variable `AXLINT_SANDBOX_CAPACITY` to the new positive integer limit (default 10). No secret values are needed. A new VM measurement and hosted start check remain blocked until a slot is available.

## Manufact redeployment confirmed

Deployment `8dd23aa6-0bc7-4342-a37f-b1fb5562aef1` is `running`, pipeline phase `complete`, from main commit `fc8ea3dcb07eff1bb9e266f207fe2e57d48b74a1`. No Trackr or Railway requests were made.

## Subsequent S8 evidence preserved

The proof sandbox disappeared through its original TTL (no delete request was issued). A new S8 run, `axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d`, used the available slot at 22:23:24 UTC, before the repair was live. Its three files are preserved under `scripts/results/blaxel-export-2026-10-17T22-29-32.875Z/`. It completed with Improved, 9/12 → 12/12, 115,194 → 13,917 returned tokens, on the old 1024 MB / 4h settings. This is observed user S8 evidence, not either of the requested C follow-up checks. Total files exported: **25**, across **10 verification sandboxes**. A subsequent count remained **10 occupied / 0 free**; no sandbox was deleted.

## Final launch checks

The remote bootstrap now enforces the same absolute fourteen-minute deadline even if the process request is delayed. `pnpm typecheck`, `pnpm build`, and the full suite pass: **9 files, 108 tests**. The launch tests exercise 256 MB / 2h15m configuration, preparation time subtraction, rejecting an exhausted deadline before launch, and executing an already-expired bootstrap to confirm it stops before reading run files. No new sandbox was needed for these checks.
