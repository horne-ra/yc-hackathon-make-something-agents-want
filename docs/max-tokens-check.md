# Single-turn max_tokens check

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

**4096-token verdicts: filesystem — Inconclusive; live Railway Trackr — Improved.** The corresponding 300-token verdicts were Improved and Improved.

Purpose: test whether the single-turn harness's max_tokens=300 caused baseline failures that don't occur at a realistic limit.

## Verdicts beside the 300-token runs

| Benchmark | max_tokens | Scored passes baseline → candidate | Ordered verdict |
|---|---:|---:|---|
| filesystem (corrected prompt) | 300 | 6/9 → 9/9 | Improved |
| filesystem (corrected prompt) | 4096 | 8/9 → 9/9 | Inconclusive |
| trackr (live Railway) | 300 | 9/12 → 12/12 | Improved |
| trackr (live Railway) | 4096 | 9/12 → 12/12 | Improved |

All 48 new responses ended with `stop_reason=tool_use`; none contained text before the first call (0 characters / 0 words). Filesystem's observed baseline failures fell from three to one, leaving a one-pass candidate advantage below the two-pass Improved threshold. Trackr's three baseline payload failures persisted unchanged at the larger limit.

## Controlled protocol

[Pre-registration](../scripts/max-tokens-check/preregistration.md) and executable snapshots were committed/pushed at `d129f69b43882e94d467119a1fb2d09460335e5b` before any model call. [Execution manifest](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/execution.json) records source-transform hashes, timing, exits and cleanup. Only max_tokens changed from 300 to 4096 in model requests. The instrumentation saves complete responses and computes metrics after receiving them; reversing it and the numeric replacement restores the original harness bytes. No task, fixture, tool definition, candidate, system prompt, sampling, retry rule, dispatch or scoring change was made.

Both experiments retain one-turn/first-call scoring, automatic tool choice, model claude-sonnet-5-5, provider-default sampling with no temperature, seeded shuffle 173201, concurrency four and three trials per task/condition. A cutoff stop is observed rather than automatically failed: the original first-call score is preserved. No tool result is fed back and there is no final-answer turn. Full provider responses retain any additional proposed calls and thinking blocks even though only the first call is scored.

Filesystem uses exactly `You are an assistant with access to filesystem tools. Use the available tools to help the user.`, the pinned bbb701e server, identical synthetic seed/6,011 files, all 14 tools, original eight-tool allowlist and frozen three-description candidate. Source fidelity and the original --check acceptance passed before calls. [Preflight](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem-preflight.log). The 300-token comparison is the [corrected-prompt run](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/result.json), not the older mismatched-prompt run.

Trackr uses exactly `You are an assistant with access to an issue tracker. Use the available tools to help the user.`, the original four SPEC tasks and compact patch from scripts/hand-run.ts. Full live metadata matched the earlier Railway baseline, including the unchanged control, before generation, immediately before Trackr trials and afterward. All three checks and all 24 live identities matched `trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96`; the older comparison served `trackr-demo-001@8fb094dd2acdfdd2a24fa5dd660efb6ed20d1524`. The deployment revision changed, while all tools/list fields matched exactly. No live source or deployment changes were made for this check. [Before](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr-before.json), [immediately before](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr-before-trials.json), [after](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr-after.json), [300-token reference](../scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json).

The ordered SPEC verdict is Regressed first for a sufficient-data control loss or task loss of at least two; otherwise Inconclusive for insufficient data (>1 infrastructure failure in any scored task/condition); otherwise Improved only if no scored task falls and a non-control gains at least two; otherwise Inconclusive. Filesystem boundary is unscored. Tokens, text length and stop reasons do not alter the scorer. Trackr's original summary omits verdict, so the shared src/core/verdict.ts supplies it here.

## Task-level comparison

| Benchmark / task | 300 baseline | 300 candidate | 4096 baseline | 4096 candidate |
|---|---:|---:|---:|---:|
| filesystem / fs-overview | 1/3 | 3/3 | 2/3 | 3/3 |
| filesystem / fs-tests | 2/3 | 3/3 | 3/3 | 3/3 |
| filesystem / fs-control (control) | 3/3 | 3/3 | 3/3 | 3/3 |
| filesystem / fs-boundary (unscored) | unscored | unscored | unscored | unscored |
| trackr / t1-route | 3/3 | 3/3 | 3/3 | 3/3 |
| trackr / t2-status | 3/3 | 3/3 | 3/3 | 3/3 |
| trackr / t3-payload | 0/3 | 3/3 | 0/3 | 3/3 |
| trackr / t4-control (control) | 3/3 | 3/3 | 3/3 | 3/3 |

## Every 4096-token trial

“Text before tool” counts text content blocks before the first tool_use, joined with newlines as retained in model_text. Characters are Unicode code points; words are whitespace-separated. Thinking/reasoning blocks are not text for this metric and remain in the full response. If no call exists, the metric is not applicable. `<PROJECT>` replaces the temporary filesystem root for display only; original paths/arguments are preserved in JSON.

### filesystem

| Task | Condition | Trial | stop_reason | Text before tool? | Characters / words | First tool | Arguments | Outcome | API input / output | Full model response |
|---|---|---:|---|---|---:|---|---|---|---:|---|
| fs-overview | baseline | 1 | tool_use | no | 0 / 0 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git"]}` | pass | 3,257 / 143 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-overview-baseline-1-model.json) |
| fs-overview | baseline | 2 | tool_use | no | 0 / 0 | directory_tree | `{"path":"<PROJECT>"}` | fail: bad_args | 3,254 / 104 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-overview-baseline-2-model.json) |
| fs-overview | baseline | 3 | tool_use | no | 0 / 0 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git"]}` | pass | 3,257 / 143 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-overview-baseline-3-model.json) |
| fs-overview | candidate | 1 | tool_use | no | 0 / 0 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]}` | pass | 3,428 / 161 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-overview-candidate-1-model.json) |
| fs-overview | candidate | 2 | tool_use | no | 0 / 0 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]}` | pass | 3,429 / 162 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-overview-candidate-2-model.json) |
| fs-overview | candidate | 3 | tool_use | no | 0 / 0 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]}` | pass | 3,428 / 161 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-overview-candidate-3-model.json) |
| fs-tests | baseline | 1 | tool_use | no | 0 / 0 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]}` | pass | 3,253 / 482 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-tests-baseline-1-model.json) |
| fs-tests | baseline | 2 | tool_use | no | 0 / 0 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]}` | pass | 3,251 / 476 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-tests-baseline-2-model.json) |
| fs-tests | baseline | 3 | tool_use | no | 0 / 0 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]}` | pass | 3,252 / 479 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-tests-baseline-3-model.json) |
| fs-tests | candidate | 1 | tool_use | no | 0 / 0 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 3,424 / 471 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-tests-candidate-1-model.json) |
| fs-tests | candidate | 2 | tool_use | no | 0 / 0 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 3,424 / 471 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-tests-candidate-2-model.json) |
| fs-tests | candidate | 3 | tool_use | no | 0 / 0 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 3,426 / 477 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-tests-candidate-3-model.json) |
| fs-control | baseline | 1 | tool_use | no | 0 / 0 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 3,252 / 110 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-control-baseline-1-model.json) |
| fs-control | baseline | 2 | tool_use | no | 0 / 0 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 3,252 / 110 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-control-baseline-2-model.json) |
| fs-control | baseline | 3 | tool_use | no | 0 / 0 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 3,252 / 110 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-control-baseline-3-model.json) |
| fs-control | candidate | 1 | tool_use | no | 0 / 0 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 3,425 / 111 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-control-candidate-1-model.json) |
| fs-control | candidate | 2 | tool_use | no | 0 / 0 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 3,423 / 109 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-control-candidate-2-model.json) |
| fs-control | candidate | 3 | tool_use | no | 0 / 0 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 3,424 / 110 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-control-candidate-3-model.json) |
| fs-boundary | baseline | 1 | tool_use | no | 0 / 0 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 3,250 / 107 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-boundary-baseline-1-model.json) |
| fs-boundary | baseline | 2 | tool_use | no | 0 / 0 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 3,250 / 107 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-boundary-baseline-2-model.json) |
| fs-boundary | baseline | 3 | tool_use | no | 0 / 0 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 3,250 / 107 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-boundary-baseline-3-model.json) |
| fs-boundary | candidate | 1 | tool_use | no | 0 / 0 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 3,422 / 107 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-boundary-candidate-1-model.json) |
| fs-boundary | candidate | 2 | tool_use | no | 0 / 0 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 3,422 / 107 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-boundary-candidate-2-model.json) |
| fs-boundary | candidate | 3 | tool_use | no | 0 / 0 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 3,422 / 107 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/fs-boundary-candidate-3-model.json) |

4096-token stop_reason=max_tokens: **0/24**. Trials with text before the first tool call: **0/24**. Infrastructure errors: **0**.

### trackr

| Task | Condition | Trial | stop_reason | Text before tool? | Characters / words | First tool | Arguments | Outcome | API input / output | Full model response |
|---|---|---:|---|---|---:|---|---|---|---:|---|
| t1-route | baseline | 1 | tool_use | no | 0 / 0 | search_issues | `{"query":"checkout page"}` | pass | 698 / 51 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t1-route-baseline-1-model.json) |
| t1-route | baseline | 2 | tool_use | no | 0 / 0 | search_issues | `{"query":"checkout page"}` | pass | 698 / 51 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t1-route-baseline-2-model.json) |
| t1-route | baseline | 3 | tool_use | no | 0 / 0 | search_issues | `{"query":"checkout page"}` | pass | 698 / 51 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t1-route-baseline-3-model.json) |
| t1-route | candidate | 1 | tool_use | no | 0 / 0 | search_issues | `{"query":"checkout page","include_comments":false}` | pass | 884 / 75 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t1-route-candidate-1-model.json) |
| t1-route | candidate | 2 | tool_use | no | 0 / 0 | search_issues | `{"query":"checkout page","include_comments":false}` | pass | 884 / 75 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t1-route-candidate-2-model.json) |
| t1-route | candidate | 3 | tool_use | no | 0 / 0 | search_issues | `{"query":"checkout page","include_comments":false}` | pass | 884 / 75 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t1-route-candidate-3-model.json) |
| t2-status | baseline | 1 | tool_use | no | 0 / 0 | list_issues | `{"status":"in_progress"}` | pass | 701 / 51 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t2-status-baseline-1-model.json) |
| t2-status | baseline | 2 | tool_use | no | 0 / 0 | list_issues | `{"status":"in_progress"}` | pass | 701 / 51 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t2-status-baseline-2-model.json) |
| t2-status | baseline | 3 | tool_use | no | 0 / 0 | list_issues | `{"status":"in_progress"}` | pass | 701 / 51 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t2-status-baseline-3-model.json) |
| t2-status | candidate | 1 | tool_use | no | 0 / 0 | list_issues | `{"status":"in_progress","include_comments":false}` | pass | 887 / 75 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t2-status-candidate-1-model.json) |
| t2-status | candidate | 2 | tool_use | no | 0 / 0 | list_issues | `{"status":"in_progress","include_comments":false}` | pass | 887 / 75 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t2-status-candidate-2-model.json) |
| t2-status | candidate | 3 | tool_use | no | 0 / 0 | list_issues | `{"status":"in_progress","include_comments":false}` | pass | 887 / 75 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t2-status-candidate-3-model.json) |
| t3-payload | baseline | 1 | tool_use | no | 0 / 0 | list_issues | `{"assignee":"maria","status":"open"}` | fail: bad_args | 702 / 72 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t3-payload-baseline-1-model.json) |
| t3-payload | baseline | 2 | tool_use | no | 0 / 0 | list_issues | `{"assignee":"maria","status":"open"}` | fail: bad_args | 702 / 72 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t3-payload-baseline-2-model.json) |
| t3-payload | baseline | 3 | tool_use | no | 0 / 0 | list_issues | `{"assignee":"maria","status":"open"}` | fail: bad_args | 702 / 72 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t3-payload-baseline-3-model.json) |
| t3-payload | candidate | 1 | tool_use | no | 0 / 0 | list_issues | `{"assignee":"maria","status":"open","include_comments":false}` | pass | 888 / 96 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t3-payload-candidate-1-model.json) |
| t3-payload | candidate | 2 | tool_use | no | 0 / 0 | list_issues | `{"assignee":"maria","status":"open","include_comments":false}` | pass | 888 / 96 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t3-payload-candidate-2-model.json) |
| t3-payload | candidate | 3 | tool_use | no | 0 / 0 | list_issues | `{"assignee":"maria","status":"open","include_comments":false}` | pass | 888 / 96 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t3-payload-candidate-3-model.json) |
| t4-control | baseline | 1 | tool_use | no | 0 / 0 | get_issue | `{"id":"TRK-117"}` | pass | 699 / 52 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t4-control-baseline-1-model.json) |
| t4-control | baseline | 2 | tool_use | no | 0 / 0 | get_issue | `{"id":"TRK-117"}` | pass | 699 / 52 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t4-control-baseline-2-model.json) |
| t4-control | baseline | 3 | tool_use | no | 0 / 0 | get_issue | `{"id":"TRK-117"}` | pass | 699 / 52 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t4-control-baseline-3-model.json) |
| t4-control | candidate | 1 | tool_use | no | 0 / 0 | get_issue | `{"id":"TRK-117"}` | pass | 885 / 52 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t4-control-candidate-1-model.json) |
| t4-control | candidate | 2 | tool_use | no | 0 / 0 | get_issue | `{"id":"TRK-117"}` | pass | 885 / 52 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t4-control-candidate-2-model.json) |
| t4-control | candidate | 3 | tool_use | no | 0 / 0 | get_issue | `{"id":"TRK-117"}` | pass | 885 / 52 | [full](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/t4-control-candidate-3-model.json) |

4096-token stop_reason=max_tokens: **0/24**. Trials with text before the first tool call: **0/24**. Infrastructure errors: **0**.

## All earlier 300-token runs: retained stop-reason audit

**The exact historical total cannot be recovered.** Among 576 retained earlier trial records, only 48 save an explicit stop_reason; **2 are confirmed max_tokens stops**. 528 records lack that field, including 24 records with no saved successful-response usage. An output count of exactly 300 is shown separately and is not relabeled as a known stop reason. The original filesystem and Trackr hand-run reports did not retain complete model responses, so their exact stop reasons are unavailable.

Audit snapshot: `8b3df64`. [Full audit and duplicate-source map](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/earlier-300-audit.json). It covers direct saved benchmark result.json files plus unique real hosted axlint-run/axlint-v2 verification run IDs in tracked scripts/docs JSON, recursively including JSON in tool-result text. Exports, repeated polls/progress/final records are deduplicated by run_id. Fixtures, simulations, tests and proposal generations are excluded; 4096-token end-to-end runs are excluded. Failed launches with no retained trial result contribute no stop reason.

| Earlier run | Trials | Explicit stop reasons | Confirmed max_tokens | Missing stop reason | output_tokens=300 |
|---|---:|---:|---:|---:|---:|
| [filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/result.json](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/result.json) | 24 | 0 | 0 | 24 | 6 |
| [pophive/run/result.json](../scripts/pophive/run/result.json) | 24 | 24 | 0 | 0 | 0 |
| [results/filesystem-2026-10-17T21-31-17.655Z/result.json](../scripts/results/filesystem-2026-10-17T21-31-17.655Z/result.json) | 24 | 0 | 0 | 24 | 6 |
| [results/memory-2026-10-17T19-30-31.562Z/result.json](../scripts/results/memory-2026-10-17T19-30-31.562Z/result.json) | 24 | 0 | 0 | 24 | 0 |
| [results/memory-2026-10-17T19-34-10.561Z/result.json](../scripts/results/memory-2026-10-17T19-34-10.561Z/result.json) | 24 | 0 | 0 | 24 | 0 |
| [results/memory-2026-10-17T21-41-09.662Z/result.json](../scripts/results/memory-2026-10-17T21-41-09.662Z/result.json) | 24 | 0 | 0 | 24 | 0 |
| [results/trackr-2026-10-17T19-35-11.886Z/result.json](../scripts/results/trackr-2026-10-17T19-35-11.886Z/result.json) | 24 | 0 | 0 | 24 | 0 |
| [results/trackr-2026-10-17T20-10-18.320Z/result.json](../scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json) | 24 | 0 | 0 | 24 | 0 |
| [results/trackr-2026-10-17T21-41-08.977Z/result.json](../scripts/results/trackr-2026-10-17T21-41-08.977Z/result.json) | 24 | 0 | 0 | 24 | 0 |
| [yfinance/run/result.json](../scripts/yfinance/run/result.json) | 24 | 24 | 2 | 0 | 2 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.373d9bcb-163e-4fba-8e75-3ce1fef2a443](../docs/evidence/wrapup/judges-complete.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-49279710-1dfa-4e6f-ad80-77992da8d99e](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-49279710-1dfa-4e6f-ad80-77992da8d99e/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-5ce8aaba-bb3a-4410-9d49-03bd849f5f69](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-5ce8aaba-bb3a-4410-9d49-03bd849f5f69/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-78daa3da-4a36-41d2-a2e6-2d9d1df41247](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-78daa3da-4a36-41d2-a2e6-2d9d1df41247/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-d0119595-a705-4229-89ee-29b93d71d6db](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-d0119595-a705-4229-89ee-29b93d71d6db/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395](../scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d](../scripts/results/blaxel-export-2026-10-17T22-29-32.875Z/axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.5a0d2eeb-d908-4c74-b624-9dd733bca393](../scripts/results/blaxel-export-2026-10-17T23-08-30.579Z/axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.5a0d2eeb-d908-4c74-b624-9dd733bca393/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.84c04a5a-2994-4018-b2c0-8b28098b36e9](../scripts/results/blaxel-export-2026-10-17T23-08-31.709Z/axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.84c04a5a-2994-4018-b2c0-8b28098b36e9/result.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.54fc8c9a-f8ca-4fc3-bca9-ce07f849bd5c](../scripts/results/shared-runner-2026-10-17T22-56-18.113Z/run-1-poll-10.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.2c5526f2-4470-49d7-95ca-92fd3f10432b](../scripts/results/shared-runner-2026-10-17T22-56-18.113Z/run-2-poll-1.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.70aa4566-97a6-4bf5-bad9-c5de1a2d68ed](../scripts/results/shared-runner-2026-10-17T22-57-44.693Z/run-1-poll-12.json) | 24 | 0 | 0 | 24 | 0 |
| [axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.542700b5-5900-4a3f-a584-b6d1344a35e0](../scripts/results/shared-runner-2026-10-17T22-57-44.693Z/run-2-poll-1.json) | 24 | 0 | 0 | 24 | 0 |

The 14 at-cap output records comprise six trials in the original filesystem run, six in the corrected-prompt filesystem run, and two Yahoo Finance trials. Only the two Yahoo Finance records retain explicit max_tokens stop reasons. PopHIVE retains 24 explicit tool_use stops. Earlier direct Trackr runs recorded no output_tokens=300 trials, while their actual stop reasons remain unknown.

## Usage, failures and consistency

| Benchmark | Condition | API input tokens | API output tokens | Potential result tokens | Static tool tokens |
|---|---|---:|---:|---:|---:|
| filesystem | baseline | 39,030 | 2,478 | 706,066 | 3,143 |
| filesystem | candidate | 41,097 | 2,554 | 5,244 | 3,315 |
| trackr | baseline | 8,400 | 678 | 115,194 | 651 |
| trackr | candidate | 10,632 | 894 | 13,272 | 837 |

Result tokens count the complete MCP envelope (content and structuredContent), distinct from actual model usage: these results were never fed back. Any original Trackr approximate fallback remains labeled in raw results; no approximations were introduced for this experiment.

| Benchmark / task | Condition | Call disagreement | Outcome disagreement | Result-token disagreement |
|---|---|---|---|---|
| filesystem / fs-boundary | baseline | no | no | no |
| filesystem / fs-boundary | candidate | no | no | no |
| filesystem / fs-control | baseline | no | no | no |
| filesystem / fs-control | candidate | no | no | no |
| filesystem / fs-overview | baseline | YES | YES | YES |
| filesystem / fs-overview | candidate | no | no | no |
| filesystem / fs-tests | baseline | no | no | YES |
| filesystem / fs-tests | candidate | no | no | YES |
| trackr / t1-route | baseline | no | no | no |
| trackr / t1-route | candidate | no | no | no |
| trackr / t2-status | baseline | no | no | no |
| trackr / t2-status | candidate | no | no | no |
| trackr / t3-payload | baseline | no | no | no |
| trackr / t3-payload | candidate | no | no | no |
| trackr / t4-control | baseline | no | no | no |
| trackr / t4-control | candidate | no | no | no |

filesystem failures: fs-overview/baseline/2: bad_args.

trackr failures: t3-payload/baseline/2: bad_args; t3-payload/baseline/1: bad_args; t3-payload/baseline/3: bad_args.

## Interpretation and validation

The remaining filesystem failure was overview baseline trial 2: it made a complete unfiltered `directory_tree` call, used 104 output tokens, and stopped with `tool_use`. Each Trackr payload baseline failure made a complete `list_issues` call omitting `include_comments=false`, used 72 output tokens, and stopped with `tool_use`. Those new failures are not output-limit cutoffs or pre-tool narration exhausting the budget.

All six filesystem test-search responses used 471–482 output tokens and proposed three calls: first `search_files` with `pattern="**/*test*"`, then `search_files` with `pattern="**/*spec*"`, then `directory_tree`, all at `<PROJECT>`. Baseline searches excluded `["node_modules/**", ".git/**"]` and the baseline tree excluded `["node_modules", ".git"]`; candidate searches and trees all excluded `["node_modules", ".git"]`. These full proposed calls and their exact absolute arguments are retained in each linked model response. Only the first call executed and contributed to scoring, exactly as in the original harness. Thus these responses exceeded the former budget by emitting additional calls, not text before the first call; this does not recover the missing stop reasons of their earlier counterparts.

Compare task counts and recorded stop reasons rather than assuming every earlier failure was truncation. A complete wrong first call can fail without reaching the output cap; a response can reach a cap after already making a valid first call. The 4096 reruns test observed behavior under a larger output budget; n=3, default sampling, a later run time and Trackr's changed deployment revision limit causal certainty. These remain tool-selection/argument benchmarks, not end-to-end answer-quality tests.

[Verification](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/verification.json) recomputes every new pre-tool metric and stop reason from full model responses, checks chosen calls/usage and original scorers, compares all non-budget protocol fields and metadata with the 300-token references, and applies the shared ordered verdict. All 48 trial records are retained, including unfavorable outcomes. Filesystem's 24 unique roots/processes and the temporary execution workspace were cleaned up. [Filesystem raw data](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/filesystem/result.json), [Trackr raw data](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr/result.json). Original results remain unchanged.

## Publication boundary

Automatic approval review rejected exporting complete live Trackr tool responses because they may contain private issue data. All 24 complete original payloads were kept in a local archive with restricted permissions; none were truncated or changed for execution or token counting. The repository includes [SHA-256/byte-count receipts](../scripts/max-tokens-check/run-2026-10-18T04-50-03.181Z/trackr-tool-receipts.json), usage, stop reasons, scores and complete model responses instead of live issue bodies/comments. Every public Trackr model response contains only the single tool input, which was checked against the already-published 300-token reference; there was no response text and no returned issue content in those model responses. Local verification rechecked the archived bytes against the receipts. This affects publication only, not either experiment or verdict.
