# S8 milestone: verification rejected a harmful patch, then approved a supported one

Provisional: 3 trials per condition. Model claude-sonnet-5-5, provider default sampling; no temperature.

The user confirmed the complete Claude Code milestone on October 17, 2026. Its run files and actual confirm response have also been independently read from Blaxel and preserved locally.

| Attempt | Run | Sources | Verdict | Passes | Returned result tokens | Static tokens |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951 | src/tools.ts only | Regressed | 9/12 → 6/12 | 115,194 → 59,007 | 651 → 1,153 |
| 2 | axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d | tools, validation, handlers | Improved | 9/12 → 12/12 | 115,194 → 13,917 | 651 → 903 |

Attempt 1 guessed from missing context: its status description claimed unrestricted values, and its comment description treated omission and false as economical equivalents. All candidate status trials used `in progress` instead of `in_progress`; all payload trials still omitted false. Verification reported Regressed. See [the full attempt-1 evidence](s8-attempt-1.md); no failed trial has been removed.

Attempt 2 used patch pat_941fcf7a with F1–F3 and all three source files. All 24 trials are retained, including the three baseline payload failures. Its recorded confirmation is match=true, all four gates true, diffs=[], at `trackr-demo-001@dc4205aed24c6cfdf166b152b615c9da7dc4261a`. Candidate and live tools hashes are both `sha256:da29c9c30895f7cca004b82e9b3feeb34af414212b6b536b66a978e6ae992eef`.

## Seven S8 acceptance checks

| Check | Evidence | Result |
| --- | --- | --- |
| Claude Code invokes deployed AX Lint | User's completed Claude Code S8 report; retained run and confirm response | Pass, human confirmed |
| audit_server returns real Trackr findings | Preserved baseline tools and derived findings; F1–F3 in actual patch | Pass, human confirmed and saved context corroborates |
| propose_patch returns a validated non-destructive patch | Actual context.patch, description-only wire_ops and deterministic source_edits | Pass |
| verify_patch executes both conditions | Actual result.json: 24 trials, 12 baseline and 12 candidate | Pass |
| get_verification_result returns trials and verdict | Independent hosted read and exported result: Improved, 9/12 → 12/12 | Pass |
| Coding agent applies approved patch | User report and actual Trackr commit dc4205a, a description-only src/tools.ts commit | Pass |
| confirm_patch validates identity, revision and metadata | Exported confirm.json: all four gates true, equal hashes, empty diffs | Pass |

The user measured Railway redeploy at **43.6 seconds after push**. This is the user's observed S8 timing; it has not been substituted with a fresh deployment measurement. Before the successful launch, two verify_patch calls failed because Blaxel had 10 sandboxes; the old error surfaced as [object Object]. Part A now returns capacity_exhausted clearly.

## Recorded fallback and evidence

The milestone's context.json, progress.json and result.json were already exported before this follow-up. Its actual confirm.json is now saved alongside them at `scripts/results/blaxel-export-2026-10-17T22-29-32.875Z/axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d/`.

preview_run now uses those exact S8 trial results, patch and recorded confirm gates. Only partial playback timing is illustrative. It reports 13,917 result tokens and 903 static tokens for this milestone; the earlier frozen gate results remain unchanged in their original reports. Recorded gates describe the historical dc4205a deployment, not the server after the baseline reset.

## Baseline reset

The explicitly authorized reset ran `scripts/reset-trackr-baseline.ts --execute`, created and pushed a new revert commit (no force-push), and waited for Railway. Actual output is preserved in `scripts/results/s8-reset-output.txt`:

```text
PASS baseline tools hash: sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5
serverInfo.version: trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96
```

AX Lint typecheck, all 108 tests and the viewer's data/renderer checks passed. The fixture check confirms every original trial field, including observed latency, is preserved.

Trackr `pnpm test` passed: **4 test files, 19 tests** (including wire.test.ts and fidelity.test.ts); `pnpm typecheck` also passed after reset. No behavior or fixture was changed to obtain this result.
