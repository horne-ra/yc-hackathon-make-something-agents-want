# S8 attempt 1: harmful proposal caught by verification

Provisional: 3 trials per condition.

Run: `axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951`. Model: `claude-sonnet-5-5`; provider default sampling, no temperature. Original evidence is preserved in [`result.json`](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951/result.json), [`context.json`](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951/context.json) and [`progress.json`](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951/progress.json).

Only `src/tools.ts` was supplied to the proposer, as recorded in `patch.base_source_hashes`; validation constants and handler defaults were absent. No historical trial, prompt, task, baseline metadata or score was changed.

## Observed result

| Task | Baseline | Candidate |
| --- | --- | --- |
| t1-route | 3/3 | 3/3 |
| t2-status | 3/3 | 0/3 |
| t3-payload | 0/3 | 0/3 |
| t4-control | 3/3 | 3/3 |

**Verdict: Regressed.** Total first-call passes fell **9/12 → 6/12**. Returned result tokens fell **115,194 → 59,007**, but that reduction does not override the pass regression under the ordered verdict rules. Static tool tokens increased **651 → 1,153**. There were no infrastructure errors.

All three t2-status candidate trials called `list_issues({status: "in progress"})`; the unchanged scorer requires `"in_progress"`. All three t3-payload candidate trials omitted `include_comments: false` and failed, just as the baseline did. Both routing and control remained 3/3.

## Problematic proposed metadata

> Filter issues by status. Free-form string; allowed values are not defined in source. Optional; no filter if omitted.

> Whether to include comments with each issue. Optional; source defines no default. Leaving it unset or false is the more economical choice for smaller responses, since comments likely increase payload size.

The candidate turned missing caller context into assertions about the implementation. The saved validation file from the earlier full-source run defines `STATUS_VALUES = ["open", "in_progress", "blocked", "closed"]`, and the saved handler uses `args.include_comments ?? true`. Omitting that argument and setting it false have different behavior. These source files were read from committed AX Lint evidence during this repair; the Trackr checkout and Railway deployment were not accessed.

This run demonstrates why verification must gate application: it returned Regressed for a plausible-looking description patch. It does not prove that every smaller-context proposal will regress, or that every full-context proposal will improve.

## C follow-up checks

The new checks are prepared as two sequential cases: (1) top three findings plus all three committed source files; (2) all findings plus only src/tools.ts. Their verification verdicts remain **not run** while S8 is active and Blaxel has no free slot. No verdict is inferred from a proposal or an offline memory replay.
