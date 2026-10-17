# Ordered S8 follow-up

## A — capacity safety net

Completed and pushed before this follow-up: 25 available context/progress/result files from all ten current verification sandboxes are saved, with missing legacy context files recorded explicitly. Named provider errors, capacity_exhausted, completion-based two-hour cleanup safeguards, 2h15m new-run TTL and their tests are deployed. See [capacity report](s8-capacity.md).

No completed run is yet eligible for deletion. At 22:46 UTC on October 17 the workspace has 10 DEPLOYED sandboxes, **0 free slots**. No sandbox was deleted. The final production application commit 9290c3c was confirmed active, and the hosted capacity error was checked successfully. Repeated implementation/export steps are skipped because they are already pushed. Part B now records and resets the completed S8 milestone.

## B — S8 record and baseline reset

Milestone files and the real confirmation response are exported. preview_run now replays that exact run, including 24 trials, 13,917 result tokens, 903 static tokens and four recorded confirmation gates. Trackr was reset by new revert commit ad88596baf761ec9b44abd019d3e8a90f84ceb96, verified live at the frozen baseline tools hash. Trackr: 4 files / 19 tests plus typecheck passed. AX Lint: 108 tests, typecheck, build and viewer data/renderer checks passed. See [S8 milestone](s8-milestone.md).

## C — shared recycled runner

Implemented, pushed and deployed within the one-hour time box. Full suite: 12 files / 130 tests PASS; typecheck and production build PASS. Two real pairs completed in the same reused VM, with distinct directories and 24 schema-valid trials each; every result and startup failure is preserved. Killing/restarting AX Lint mid-run preserved results. Missing IDs return run_expired; legacy IDs remain readable. Final warm launch 928.4 ms versus prior hosted range 894.4–997.1 ms (different caller transport; not a speed claim). Hosted new-ID protocol and native widget rendering passed. Claude app retest requested, pending. Workspace remains 10 VMs / 0 free VM slots, with one shared pool supporting the default four simultaneous processes. See platform-notes.md and scripts/results/shared-runner-2026-10-17T22-57-44.693Z/.

## D — proposer repair and both real sequential verifications

The previously pushed/deployed metadata, source-claim validation and missing-fact warnings were retained; their tests and hosted metadata check pass. Both newly requested real verifications completed sequentially on unchanged baseline Trackr: **top three/all three source files Improved 9/12 → 12/12, 115,194 → 13,272 result tokens, static 651 → 941; all findings/tools only Regressed 9/12 → 6/12, 115,194 → 59,010 tokens, static 651 → 968**. The latter returned nine warnings, guessed In Progress in every status trial and omitted include_comments=false in every payload trial. All 48 trials, including failures, and both complete context/progress/result sets are saved. See s8-proposer-fixes.md for before/after descriptions and full trial table.

Final independent production reads verified both verdicts and new-format confirmation persistence. Typecheck and all 130 tests pass. No new dependency. C and D finished within their time boxes. Claude app confirmation for the new-format run is pending; native hosted widget rendering passed. A real shared-VM destruction test was intentionally skipped to preserve recent runs; recreation/loss is unit-tested. The earlier physical 256 MB per-run VM probe was quota-blocked; 94.1 MiB offline peak RSS was measured, and real shared runs used the existing 1024 MB VM. No claim that 256 MB is empirically proven on a fresh VM.

Final count at 23:09:06 UTC: **10 occupied, 0 free VM slots, 1 shared pool** (four concurrent processes default). No sandbox was deleted. Trackr remains `trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96`, tools hash `sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5`. Neither verification applied a patch, so no additional reset was needed.
