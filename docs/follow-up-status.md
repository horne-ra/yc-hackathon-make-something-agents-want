# Ordered S8 follow-up

## A — capacity safety net

Completed and pushed before this follow-up: 25 available context/progress/result files from all ten current verification sandboxes are saved, with missing legacy context files recorded explicitly. Named provider errors, capacity_exhausted, completion-based two-hour cleanup safeguards, 2h15m new-run TTL and their tests are deployed. See [capacity report](s8-capacity.md).

No completed run is yet eligible for deletion. At 22:46 UTC on October 17 the workspace has 10 DEPLOYED sandboxes, **0 free slots**. No sandbox was deleted. The final production application commit 9290c3c was confirmed active, and the hosted capacity error was checked successfully. Repeated implementation/export steps are skipped because they are already pushed. Part B now records and resets the completed S8 milestone.

## B — S8 record and baseline reset

Milestone files and the real confirmation response are exported. preview_run now replays that exact run, including 24 trials, 13,917 result tokens, 903 static tokens and four recorded confirmation gates. Trackr was reset by new revert commit ad88596baf761ec9b44abd019d3e8a90f84ceb96, verified live at the frozen baseline tools hash. Trackr: 4 files / 19 tests plus typecheck passed. AX Lint: 108 tests, typecheck, build and viewer data/renderer checks passed. See [S8 milestone](s8-milestone.md).

## C — shared recycled runner

Implemented, pushed and deployed within the one-hour time box. Full suite: 12 files / 130 tests PASS; typecheck and production build PASS. Two real pairs completed in the same reused VM, with distinct directories and 24 schema-valid trials each; every result and startup failure is preserved. Killing/restarting AX Lint mid-run preserved results. Missing IDs return run_expired; legacy IDs remain readable. Final warm launch 928.4 ms versus prior hosted range 894.4–997.1 ms (different caller transport; not a speed claim). Hosted new-ID protocol and native widget rendering passed. Claude app retest requested, pending. Workspace remains 10 VMs / 0 free VM slots, with one shared pool supporting the default four simultaneous processes. See platform-notes.md and scripts/results/shared-runner-2026-10-17T22-57-44.693Z/.
