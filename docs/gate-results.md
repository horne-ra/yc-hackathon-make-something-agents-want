# S3 real server gate results

**Checkpoint 1 decision:** the user chose trackr as the primary demo target; Memory becomes a read-only example. The recommendation below records the pre-checkpoint assessment. Trial evidence is unchanged.

Recommendation pending the user's gate decision: keep trackr as the primary demo target. The official memory server already passes all nine scored trials in each condition. The new live Railway trackr comparison improves the payload task from 0/3 to 3/3 and keeps every other task at 3/3, including the control. Under the specification's ordered verdict rules, the live trackr result is **Improved**. The routing and status baseline-failure hypotheses were not observed; do not claim those failures in the demo.

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

## Configuration and provenance

Both comparisons use pinned `claude-sonnet-5-5`, provider-default sampling with **no temperature field**, the specification's neutral system prompt verbatim, automatic tool choice, a maximum of 300 output tokens, one model turn, three trials per task and condition, and a fixed seeded shuffle with concurrency limited to four. The user explicitly authorized omitting temperature after Sonnet 5.5 rejected the original temperature-0 request. No model, task prompt, scorer or baseline metadata was changed to make a baseline fail.

The live endpoint is [trackr on Railway](https://trackr-production-e1a6.up.railway.app/mcp). Live identity is `trackr@trackr-demo-001@8fb094dd2acdfdd2a24fa5dd660efb6ed20d1524`; the MCP `serverInfo.version` value is exactly `trackr-demo-001@8fb094dd2acdfdd2a24fa5dd660efb6ed20d1524`. Every live trial reported that same version. Baseline and candidate calls execute against the same running deployment; the four compact metadata operations from SPEC.md are applied by hand to the tools shown to the model.

The memory benchmark is [the official MCP Memory reference server](https://github.com/modelcontextprotocol/servers/tree/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory) at full commit `bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`. All nine tools are visible. Only read_graph, search_nodes and open_nodes may execute; the allowlist is enforced at dispatch. Every trial has its own server process and temporary seed copy. The fictional graph contains 145 entities and 142 relations.

Result tokens count the complete serialized MCP response, including content and structuredContent when supplied, via Anthropic's countTokens endpoint. No successful trial needed approximate counts. They measure potential returned context; the single-turn model never consumes the result. Static tool-definition tokens are reported separately.

## Memory comparison

| Task | Baseline passes | Candidate passes | Baseline result tokens | Candidate result tokens |
| --- | --- | --- | --- | --- |
| memory-broad | 3/3 | 3/3 | 715578 | 715578 |
| memory-search | 3/3 | 3/3 | 24984 | 24984 |
| memory-control | 3/3 | 3/3 | 24090 | 24090 |
| memory-boundary | unscored | unscored | 24984 | 24984 |

All scored tasks pass 3/3 in both conditions. The unscored boundary task chooses search_nodes with query Priya Nair in every trial. Source metadata fidelity passes, but there is no observed behavioral gain. Under the S3 gate table, the recommendation is to keep trackr primary, pending the user's decision.

| Task | Condition | Trial | Tool | Arguments | Pass or fail | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| memory-broad | candidate | 3 | read_graph | `{}` | pass | 238526 |
| memory-broad | candidate | 2 | read_graph | `{}` | pass | 238526 |
| memory-boundary | candidate | 3 | search_nodes | `{"query":"Priya Nair"}` | unscored | 8328 |
| memory-control | baseline | 2 | open_nodes | `{"names":["Priya Nair","Dev Patel"]}` | pass | 8030 |
| memory-search | candidate | 2 | search_nodes | `{"query":"checkout migration"}` | pass | 8328 |
| memory-broad | baseline | 2 | read_graph | `{}` | pass | 238526 |
| memory-broad | candidate | 1 | read_graph | `{}` | pass | 238526 |
| memory-boundary | baseline | 2 | search_nodes | `{"query":"Priya Nair"}` | unscored | 8328 |
| memory-control | candidate | 3 | open_nodes | `{"names":["Priya Nair","Dev Patel"]}` | pass | 8030 |
| memory-control | candidate | 1 | open_nodes | `{"names":["Priya Nair","Dev Patel"]}` | pass | 8030 |
| memory-boundary | baseline | 1 | search_nodes | `{"query":"Priya Nair"}` | unscored | 8328 |
| memory-control | baseline | 1 | open_nodes | `{"names":["Priya Nair","Dev Patel"]}` | pass | 8030 |
| memory-search | candidate | 3 | search_nodes | `{"query":"checkout migration"}` | pass | 8328 |
| memory-control | candidate | 2 | open_nodes | `{"names":["Priya Nair","Dev Patel"]}` | pass | 8030 |
| memory-search | candidate | 1 | search_nodes | `{"query":"checkout migration"}` | pass | 8328 |
| memory-search | baseline | 3 | search_nodes | `{"query":"checkout migration"}` | pass | 8328 |
| memory-broad | baseline | 3 | read_graph | `{}` | pass | 238526 |
| memory-boundary | baseline | 3 | search_nodes | `{"query":"Priya Nair"}` | unscored | 8328 |
| memory-broad | baseline | 1 | read_graph | `{}` | pass | 238526 |
| memory-control | baseline | 3 | open_nodes | `{"names":["Priya Nair","Dev Patel"]}` | pass | 8030 |
| memory-boundary | candidate | 1 | search_nodes | `{"query":"Priya Nair"}` | unscored | 8328 |
| memory-boundary | candidate | 2 | search_nodes | `{"query":"Priya Nair"}` | unscored | 8328 |
| memory-search | baseline | 1 | search_nodes | `{"query":"checkout migration"}` | pass | 8328 |
| memory-search | baseline | 2 | search_nodes | `{"query":"checkout migration"}` | pass | 8328 |

### Memory consistency flags

A disagreement flag compares the chosen tool, parsed arguments with object keys canonicalized, pass/fail status and returned-result token count across the three trials within each task and condition. Model prose and response latency do not affect this routing comparison. **No memory task has a disagreement in either condition.**

| Task | Condition | Trials | Disagreement flag | Calls | Outcomes | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| memory-boundary | baseline | 1, 2, 3 | no | same | same | same |
| memory-boundary | candidate | 1, 2, 3 | no | same | same | same |
| memory-broad | baseline | 1, 2, 3 | no | same | same | same |
| memory-broad | candidate | 1, 2, 3 | no | same | same | same |
| memory-control | baseline | 1, 2, 3 | no | same | same | same |
| memory-control | candidate | 1, 2, 3 | no | same | same | same |
| memory-search | baseline | 1, 2, 3 | no | same | same | same |
| memory-search | candidate | 1, 2, 3 | no | same | same | same |

## Live Railway trackr comparison

| Task | Baseline passes | Candidate passes | Baseline result tokens | Candidate result tokens |
| --- | --- | --- | --- | --- |
| t1-route | 3/3 | 3/3 | 19710 | 1032 |
| t2-status | 3/3 | 3/3 | 56310 | 2967 |
| t3-payload | 0/3 | 3/3 | 31224 | 1323 |
| t4-control | 3/3 | 3/3 | 7950 | 7950 |

Total passed trials rise from 9/12 to 12/12. The payload task fails all baseline trials because include_comments is omitted and passes all candidate trials because include_comments is false. Its returned payload falls from 10408 to 441 tokens per trial, a 95.8% reduction. Across all four tasks, returned-result tokens fall from 115194 to 13272, an 88.5% reduction. Static tool-definition tokens rise from 651 to 837.

The routing and status tasks already pass baseline 3/3; their baseline-failure hypotheses are rejected for this model and retained in the evidence. Their candidate payload reductions are visible, but they do not create additional task-pass improvements. No regression or insufficient-data task is present; one non-control task improves by three passes and the control holds, giving **Improved**.

| Task | Condition | Trial | Tool | Arguments | Pass or fail | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| t1-route | candidate | 2 | search_issues | `{"query":"checkout page","include_comments":false}` | pass | 344 |
| t3-payload | baseline | 2 | list_issues | `{"assignee":"maria","status":"open"}` | fail: bad_args | 10408 |
| t4-control | candidate | 3 | get_issue | `{"id":"TRK-117"}` | pass | 2650 |
| t1-route | candidate | 3 | search_issues | `{"query":"checkout page","include_comments":false}` | pass | 344 |
| t2-status | candidate | 2 | list_issues | `{"status":"in_progress","include_comments":false}` | pass | 989 |
| t4-control | baseline | 2 | get_issue | `{"id":"TRK-117"}` | pass | 2650 |
| t1-route | baseline | 2 | search_issues | `{"query":"checkout page"}` | pass | 6570 |
| t1-route | candidate | 1 | search_issues | `{"query":"checkout page","include_comments":false}` | pass | 344 |
| t4-control | baseline | 1 | get_issue | `{"id":"TRK-117"}` | pass | 2650 |
| t3-payload | candidate | 3 | list_issues | `{"assignee":"maria","status":"open","include_comments":false}` | pass | 441 |
| t3-payload | candidate | 1 | list_issues | `{"assignee":"maria","status":"open","include_comments":false}` | pass | 441 |
| t3-payload | baseline | 1 | list_issues | `{"assignee":"maria","status":"open"}` | fail: bad_args | 10408 |
| t2-status | candidate | 3 | list_issues | `{"status":"in_progress","include_comments":false}` | pass | 989 |
| t2-status | baseline | 3 | list_issues | `{"status":"in_progress"}` | pass | 18770 |
| t3-payload | candidate | 2 | list_issues | `{"assignee":"maria","status":"open","include_comments":false}` | pass | 441 |
| t2-status | candidate | 1 | list_issues | `{"status":"in_progress","include_comments":false}` | pass | 989 |
| t1-route | baseline | 3 | search_issues | `{"query":"checkout page"}` | pass | 6570 |
| t4-control | baseline | 3 | get_issue | `{"id":"TRK-117"}` | pass | 2650 |
| t3-payload | baseline | 3 | list_issues | `{"assignee":"maria","status":"open"}` | fail: bad_args | 10408 |
| t1-route | baseline | 1 | search_issues | `{"query":"checkout page"}` | pass | 6570 |
| t4-control | candidate | 2 | get_issue | `{"id":"TRK-117"}` | pass | 2650 |
| t4-control | candidate | 1 | get_issue | `{"id":"TRK-117"}` | pass | 2650 |
| t2-status | baseline | 1 | list_issues | `{"status":"in_progress"}` | pass | 18770 |
| t2-status | baseline | 2 | list_issues | `{"status":"in_progress"}` | pass | 18770 |

### Live trackr consistency flags

**No live trackr task has a disagreement in either condition.** Every task has three identical tool/argument selections, outcomes and result-token counts within each condition. Differences between baseline and candidate are the intended comparison and are not within-condition disagreement.

| Task | Condition | Trials | Disagreement flag | Calls | Outcomes | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| t1-route | baseline | 1, 2, 3 | no | same | same | same |
| t1-route | candidate | 1, 2, 3 | no | same | same | same |
| t2-status | baseline | 1, 2, 3 | no | same | same | same |
| t2-status | candidate | 1, 2, 3 | no | same | same | same |
| t3-payload | baseline | 1, 2, 3 | no | same | same | same |
| t3-payload | candidate | 1, 2, 3 | no | same | same | same |
| t4-control | baseline | 1, 2, 3 | no | same | same | same |
| t4-control | candidate | 1, 2, 3 | no | same | same | same |

## Acceptance checks and actual output

Memory build and source-fidelity checks exited 0:

```text
PASS tools/list: 9 tools visible
PASS execution allowlist: delete_entities blocked; handler calls = 0
PASS seed size: read_graph 766273 characters; search_nodes 17713 characters
PASS source fidelity: hand-applied src/memory/index.ts descriptions exactly reproduce candidate tools/list; all remaining metadata identical
PASS memory evidence: 24 trials; 18 scored passes; six unscored; 24 unique server processes; all per-trial graph files removed; all calls succeeded first attempt; nine tools shown in both conditions
```

Live Railway infrastructure check exited 0:

```text
PASS trackr tools/list: three tools; baseline descriptions exact; control unchanged; TRK-117 read succeeds; identity {"name":"trackr","version":"trackr-demo-001@8fb094dd2acdfdd2a24fa5dd660efb6ed20d1524"}
```

The live benchmark command `pnpm exec tsx scripts/hand-run.ts` exited 0 and printed every one of its 24 trials. The memory comparison also printed every one of its 24 trials. Both full tables appear above. All 16 task/condition consistency checks report AGREE. The report generator asserts three trials in every condition, no infrastructure errors, unchanged pinned model/sampling, the exact Railway endpoint and a single live revision throughout.

The disagreement detector also passed an in-memory check: changing one candidate argument flags only that task and condition; the recorded evidence remains unchanged.

The shared harness and both entrypoints pass `pnpm typecheck`. No package or lockfile changes and no new dependencies are required.

## Retained evidence and scope

The earlier 24 rejected temperature-0 trials remain untouched in [the initial error report](../scripts/results/memory-2026-10-17T19-30-31.562Z/table.md). All returned provider errors and request IDs remain in its JSON files; no failed trials are hidden. The initial memory infrastructure size assertion and the reason for correcting it are recorded in [benchmark notes](../scripts/benchmark-notes.md).

The successful memory data is [the complete result](../scripts/results/memory-2026-10-17T19-34-10.561Z/result.json) with [its original table](../scripts/results/memory-2026-10-17T19-34-10.561Z/table.md). The new live Railway data is [the complete result](../scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json) with [its original table](../scripts/results/trackr-2026-10-17T20-10-18.320Z/table.md). The earlier local-trackr comparison is preserved in [its own table](../scripts/results/trackr-2026-10-17T19-35-11.886Z/table.md); it is separate evidence and is not substituted for this live run.

The trackr source-fidelity check belongs to the lead's trackr lane and is not rerun by this lane. Memory is not rerun after the explicit live-Railway request because its complete successful result is retained as requested. No Phase 2 implementation, branch merge or push to main occurs in this lane.
