# Filesystem system-prompt check

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

**Verdict: Improved.** With the filesystem-specific prompt, overview scored 1/3 baseline → 3/3 candidate, test search 2/3 → 3/3, and the package.json control 3/3 → 3/3. The original overview baseline was 0/3; all new trials, including failures and the unscored boundary, are reported below.

Purpose: test whether the original baseline failures depended on the mismatched system prompt.

## Protocol and pre-registration

[Pre-registration](../scripts/filesystem-prompt-check/preregistration.md) and executable snapshots were committed and pushed before any model call at `15dfb93e57dced0920cf8747f384a47da9d8ffe7`. The [execution manifest](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/execution.json) records timestamps, original/execution source hashes, provenance, checks and cleanup.

**Only the active system prompt changed:** `You are an assistant with access to filesystem tools. Use the available tools to help the user.` It replaces `You are an assistant with access to an issue tracker. Use the available tools to help the user.` Copies of the original harness from `f14254e9ba17389b2ac23bda61e76e7309c90cf5` are otherwise byte-identical; reversing that single string replacement restores the original filesystem runner exactly. The unused shared helper's historical SYSTEM constant is preserved but is not the prompt used by runFilesystemBenchmark.

Model `claude-sonnet-5-5`, from AXLINT_MODEL; provider-default sampling, no temperature. max_tokens 300, automatic tool choice, one turn and first call only, no tool result fed back. Same task texts, deterministic seed 20261017 and 6,011-file synthetic fixture, original scorer, candidate's three description edits, shuffle seed 173201, concurrency four, three trials per task/condition. The original 429/5xx retry policy is preserved; 24 provider attempts were recorded for 24 trials.

All 14 official tools remained model-visible; the original eight-tool dispatch allowlist remained enforced, including blocking deprecated read_file. Each trial used a fresh process and temporary fixture copy with only that directory allowed. Original --check acceptance passed before model calls, including fixture bounds, dispatch checks, scorer checks and a compiled candidate matching the exact frozen metadata. The server pin remains bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c. No baseline, fixture, task, candidate, scorer or sampling edits were made after observations.

[Preflight log](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/preflight.log), [compiled metadata/source evidence](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/preflight-evidence/), [runner log](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/runner.log), [full result](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/result.json), and [verification](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/verification.json). The historical result's nested provenance.preregistration_commit remains 8e9cb64 because the original runner was preserved; this check's registration commit is the one above and in execution.json. The original results and docs/filesystem-results.md remain unchanged.

## Task summary and comparison

| Task | Original baseline | Original candidate | Prompt-check baseline | Prompt-check candidate | Baseline result tokens | Candidate result tokens |
|---|---:|---:|---:|---:|---:|---:|
| fs-overview | 0/3 | 3/3 | 1/3 | 3/3 | 1,404,515 | 2,847 |
| fs-tests | 1/3 | 3/3 | 2/3 | 3/3 | 1,323 | 1,819 |
| fs-control (control) | 3/3 | 3/3 | 3/3 | 3/3 | 747 | 747 |
| fs-boundary (unscored) | unscored | unscored | unscored | unscored | 315 | 315 |

Scored calls: 6/9 baseline → 9/9 candidate. Infrastructure failures: 0; no trials replaced.

**Verdict rule (unchanged):** Regressed first if a sufficient-data control falls or any sufficient-data task falls by at least two; otherwise Inconclusive if a scored task is insufficient (more than one infrastructure failure in either condition); otherwise Improved only if no scored task falls and a non-control gains at least two; otherwise Inconclusive. Boundary is excluded; tokens do not determine the verdict.

## Every trial

`<PROJECT>` replaces only that trial’s absolute root for readability. Exact arguments, PID/root, model text, input/output usage and attempts are retained in result.json; every executed complete MCP response is linked. This table reports the first-call scorer, not end-to-end completion.

| Task | Condition | Trial | Tool | Arguments | Outcome | Result tokens | API input | API output | Raw result |
|---|---|---:|---|---|---|---:|---:|---:|---|
| fs-overview | baseline | 1 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git"]}` | pass | 949 | 3,257 | 143 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-overview-baseline-1-response.json) |
| fs-overview | baseline | 2 | directory_tree | `{"path":"<PROJECT>"}` | fail: bad_args | 701,783 | 3,256 | 106 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-overview-baseline-2-response.json) |
| fs-overview | baseline | 3 | directory_tree | `{"path":"<PROJECT>"}` | fail: bad_args | 701,783 | 3,256 | 106 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-overview-baseline-3-response.json) |
| fs-overview | candidate | 1 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]}` | pass | 949 | 3,428 | 161 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-overview-candidate-1-response.json) |
| fs-overview | candidate | 2 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]}` | pass | 949 | 3,427 | 160 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-overview-candidate-2-response.json) |
| fs-overview | candidate | 3 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]}` | pass | 949 | 3,428 | 161 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-overview-candidate-3-response.json) |
| fs-tests | baseline | 1 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*"}` | fail: bad_args | 441 | 3,252 | 300 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-tests-baseline-1-response.json) |
| fs-tests | baseline | 2 | search_files | `{"path":"<PROJECT>","pattern":"**/*{test,tests,spec,__tests__}*","excludePatterns":["node_modules",".git"]}` | pass | 441 | 3,252 | 300 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-tests-baseline-2-response.json) |
| fs-tests | baseline | 3 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 441 | 3,252 | 300 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-tests-baseline-3-response.json) |
| fs-tests | candidate | 1 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 435 | 3,423 | 300 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-tests-candidate-1-response.json) |
| fs-tests | candidate | 2 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist"]}` | pass | 949 | 3,424 | 300 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-tests-candidate-2-response.json) |
| fs-tests | candidate | 3 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 435 | 3,423 | 300 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-tests-candidate-3-response.json) |
| fs-control | baseline | 1 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 | 3,252 | 110 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-control-baseline-1-response.json) |
| fs-control | baseline | 2 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 | 3,252 | 110 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-control-baseline-2-response.json) |
| fs-control | baseline | 3 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 | 3,251 | 109 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-control-baseline-3-response.json) |
| fs-control | candidate | 1 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 | 3,424 | 110 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-control-candidate-1-response.json) |
| fs-control | candidate | 2 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 | 3,423 | 109 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-control-candidate-2-response.json) |
| fs-control | candidate | 3 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 | 3,423 | 109 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-control-candidate-3-response.json) |
| fs-boundary | baseline | 1 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 | 3,250 | 107 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-boundary-baseline-1-response.json) |
| fs-boundary | baseline | 2 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 | 3,250 | 107 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-boundary-baseline-2-response.json) |
| fs-boundary | baseline | 3 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 | 3,250 | 107 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-boundary-baseline-3-response.json) |
| fs-boundary | candidate | 1 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 | 3,420 | 105 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-boundary-candidate-1-response.json) |
| fs-boundary | candidate | 2 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 | 3,422 | 107 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-boundary-candidate-2-response.json) |
| fs-boundary | candidate | 3 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 | 3,422 | 107 | [full](../scripts/filesystem-prompt-check/run-2026-10-18T04-26-03.056Z/results/fs-boundary-candidate-3-response.json) |

## Tokens and consistency

Static tool-definition tokens: baseline **3,143**, candidate **3,315**, exact provider countTokens differences with versus without tools. These are reported separately from result tokens and usage.

| Condition | Actual API input tokens | Actual API output tokens | Potential result tokens (all 12 trials) |
|---|---:|---:|---:|
| baseline | 39,030 | 1,905 | 1,406,900 |
| candidate | 41,087 | 2,029 | 5,728 |

Complete MCP responses include content and structuredContent, so duplicated protocol fields are included. Result tokens are exact countTokens measurements of the full JSON.stringify response, not actual consumed model context: the original one-turn benchmark never feeds results back. Search-result absolute temporary paths can vary in tokenization. Raw API usage for each recorded first response is distinct from these potential result counts.

| Task | Condition | Call disagreement | Outcome disagreement | Result-token disagreement | Any flag |
|---|---|---|---|---|---|
| fs-boundary | baseline | no | no | no | no |
| fs-boundary | candidate | no | no | no | no |
| fs-control | baseline | no | no | no | no |
| fs-control | candidate | no | no | no | no |
| fs-overview | baseline | YES | YES | YES | YES |
| fs-overview | candidate | no | no | no | no |
| fs-tests | baseline | YES | YES | no | YES |
| fs-tests | candidate | YES | no | YES | YES |

## Failures and interpretation

- fs-overview, baseline trial 2: bad_args.
- fs-overview, baseline trial 3: bad_args.
- fs-tests, baseline trial 1: bad_args.

Baseline failures persisted with the filesystem-specific prompt. The mismatched issue-tracker prompt was therefore not necessary for those observed failures; the table shows the exact task-specific changes rather than assuming the rerun is identical.

This is a later rerun with provider-default sampling and n=3, rather than a concurrent randomized comparison of both system prompts. It cannot isolate prompt causality from sampling or changes behind the same model ID. The pre-registered verdict compares baseline metadata with candidate metadata under the corrected prompt; it is not a statistical test of the system-prompt effect. See the separate [end-to-end experiment](e2e-filesystem.md) for actual agent completion on Commander.js; that experiment uses a different fixture, output budget and multi-turn protocol.

Validation recomputed all scores, summaries, the ordered verdict and all eight consistency groups from retained data. 24 unique roots and 24 unique PIDs were recorded; every recorded trial root and the execution workspace were deleted. Source snapshots and protocol fields were verified against the historical run, with the single system-string delta only.
