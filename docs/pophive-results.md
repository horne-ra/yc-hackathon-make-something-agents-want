# PopHIVE results

**Inconclusive — Manufact 88/A.** Imported catalog checklist score, not a per-tool documentation score. User-selected public endpoint: [PopHIVE](https://mcp.pophive.org/mcp). [Catalog evidence](../scripts/leaderboard/catalog/pophive.json). **Provisional: 3 trials per task and condition; a demonstration, not a statistical claim.**

Baseline: **9/12** complete first-call passes; candidate: **9/12**. Routing/argument passes: 9/12 → 9/12.

The baseline already set `include_chart=false` in every P1 and P2 trial. Both conditions omitted that flag in every P3 trial, returning a PNG and failing the frozen predicate. The control passed throughout. The patch changed neither selections nor returned-context totals: **52,443 tokens per condition**, including **1,629 image tokens**. No improvement was observed.

Ordered verdict uses the unchanged [core rules](../src/core/verdict.ts): regression first, insufficient data second, then nonnegative task deltas and a non-control gain of at least two passes for Improved. P1 unchanged at 3/3; P2 unchanged at 3/3; P3 unchanged at 0/3; P4-control unchanged at 3/3. Token savings alone do not make Improved.

## Registration and fairness

Initial setup registration was committed as [34d2a65](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/34d2a65aff0b6df1e35ab6ef50123a7bd376600e) before any provider or target tool call. The final measured patch and registration were committed as [f880e25](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/f880e250a7bc80e8d4597840fc3b7237a37e17ec) before generation. [Pre-registration](pophive-preregistration.md) · [Frozen hashes](../scripts/pophive/frozen/hashes.json).

The prompts ask for yes/no, a short list, or a single number, so a chart is unnecessary for the requested answer form. They contain no tool or parameter names. Explicit chart suppression is the user-approved predicate; this does not establish that charts or PopHIVE data are wrong. The benchmark scores first-call selection/arguments, not medical interpretation or final-answer quality. P2 top_n is recorded but unscored. Other schema-valid arguments are recorded but unscored.

| Task | Exact natural prompt | Baseline | Candidate |
|---|---|---:|---:|
| P1 | Quick yes or no: is flu rising in Texas right now? | 3/3 | 3/3 |
| P2 | Which 3 states have the highest RSV right now? Just list them. | 3/3 | 3/3 |
| P3 | What's the kindergarten MMR vaccination rate in Idaho? | 0/3 | 0/3 |
| Control | What diseases and topics does PopHIVE track? | 3/3 | 3/3 |

## Paired setup — images counted as images

One registered setup experiment comprised exactly two anonymous calls: flu/TX current status with its chart default, then the same arguments with include_chart=false. Both succeeded; neither was retried. No other setup tool call was made. [Full setup results](../scripts/pophive/setup/result.json).

| Response | Non-image text/envelope tokens | Incremental image tokens | Total input tokens | PNGs |
|---|---:|---:|---:|---:|
| with_chart_default | 4,246 | 543 | 4,789 | 1 |
| without_chart | 3,208 | 0 | 3,208 | 0 |

The PNG contributes **543 image-input tokens**. The non-image text/envelope difference is **1,038**; the complete mixed-response difference is **1,581 tokens**. The six include_chart descriptions say “about 540 image-input tokens” and explicitly limit that estimate to this one status-chart example; actual chart costs vary with dimensions/content. [Exact six-description patch](../scripts/pophive/frozen/candidate-patch.json). All defaults, schema constraints, other descriptions, names, annotations, and runtime behavior are unchanged.

Full-response accounting recursively replaces each image block’s base64 data with a numbered image reference in the complete MCP JSON envelope, retaining other content, structuredContent, and metadata. The image bytes are attached to countTokens as native image content parts. Text tokens are the envelope-only input count, including message overhead; image tokens are the mixed count minus that text-only count. Base64 image data is never tokenized as text. These are potential returned-context counts; tool responses are not fed back to the generation model. No approximate counts are used.

## All 24 trials, in execution order

Complete pass requires the approved routing/argument predicate and a successful tool response. Wrong tool, omitted/true chart flag for P1–P3, absent/multiple calls, bad arguments, transport/MCP errors, and blocked calls remain in the evidence. Empty successful data does not establish answer correctness. Every proposed call is retained even when dispatch is blocked.

| Order | Task | Condition | Replicate | Tool / proposed tools | Arguments | Dispatch | Verdict | Text tokens | Image tokens | Total | Evidence |
|---:|---|---|---:|---|---|---|---|---:|---:|---:|---|
| 1 | P1 | candidate | 2 | get_current_status | {"disease":"flu","geography":"Texas","include_chart":false} | allowed | pass | 3,208 | 0 | 3,208 | [trial](../scripts/pophive/run/trial-1.json) |
| 2 | P1 | candidate | 3 | get_current_status | {"disease":"flu","geography":"Texas","include_chart":false} | allowed | pass | 3,208 | 0 | 3,208 | [trial](../scripts/pophive/run/trial-2.json) |
| 3 | Control | candidate | 3 | get_data | {} | allowed | pass | 7,972 | 0 | 7,972 | [trial](../scripts/pophive/run/trial-3.json) |
| 4 | P3 | baseline | 2 | get_coverage | {"vaccine":"mmr","geography":"Idaho"} | allowed | fail: bad_args | 2,131 | 543 | 2,674 | [trial](../scripts/pophive/run/trial-4.json) |
| 5 | P2 | candidate | 2 | get_map | {"disease":"rsv","geo_level":"state","top_n":3,"include_chart":false} | allowed | pass | 3,627 | 0 | 3,627 | [trial](../scripts/pophive/run/trial-5.json) |
| 6 | P1 | baseline | 2 | get_current_status | {"disease":"flu","geography":"Texas","include_chart":false} | allowed | pass | 3,208 | 0 | 3,208 | [trial](../scripts/pophive/run/trial-6.json) |
| 7 | Control | baseline | 2 | get_data | {} | allowed | pass | 7,972 | 0 | 7,972 | [trial](../scripts/pophive/run/trial-7.json) |
| 8 | P1 | candidate | 1 | get_current_status | {"disease":"flu","geography":"Texas","include_chart":false} | allowed | pass | 3,208 | 0 | 3,208 | [trial](../scripts/pophive/run/trial-8.json) |
| 9 | P3 | candidate | 3 | get_coverage | {"vaccine":"mmr","geography":"Idaho"} | allowed | fail: bad_args | 2,131 | 543 | 2,674 | [trial](../scripts/pophive/run/trial-9.json) |
| 10 | Control | baseline | 1 | get_data | {} | allowed | pass | 7,972 | 0 | 7,972 | [trial](../scripts/pophive/run/trial-10.json) |
| 11 | P3 | candidate | 1 | get_coverage | {"vaccine":"mmr","geography":"Idaho"} | allowed | fail: bad_args | 2,131 | 543 | 2,674 | [trial](../scripts/pophive/run/trial-11.json) |
| 12 | P3 | baseline | 1 | get_coverage | {"vaccine":"mmr","geography":"Idaho"} | allowed | fail: bad_args | 2,131 | 543 | 2,674 | [trial](../scripts/pophive/run/trial-12.json) |
| 13 | P2 | candidate | 3 | get_map | {"disease":"rsv","geo_level":"state","top_n":3,"include_chart":false} | allowed | pass | 3,627 | 0 | 3,627 | [trial](../scripts/pophive/run/trial-13.json) |
| 14 | P3 | candidate | 2 | get_coverage | {"vaccine":"mmr","geography":"Idaho"} | allowed | fail: bad_args | 2,131 | 543 | 2,674 | [trial](../scripts/pophive/run/trial-14.json) |
| 15 | P2 | baseline | 3 | get_map | {"disease":"rsv","geo_level":"state","top_n":3,"include_chart":false} | allowed | pass | 3,627 | 0 | 3,627 | [trial](../scripts/pophive/run/trial-15.json) |
| 16 | P2 | candidate | 1 | get_map | {"disease":"rsv","geo_level":"state","top_n":3,"include_chart":false} | allowed | pass | 3,627 | 0 | 3,627 | [trial](../scripts/pophive/run/trial-16.json) |
| 17 | P1 | baseline | 3 | get_current_status | {"disease":"flu","geography":"Texas","include_chart":false} | allowed | pass | 3,208 | 0 | 3,208 | [trial](../scripts/pophive/run/trial-17.json) |
| 18 | Control | baseline | 3 | get_data | {} | allowed | pass | 7,972 | 0 | 7,972 | [trial](../scripts/pophive/run/trial-18.json) |
| 19 | P3 | baseline | 3 | get_coverage | {"vaccine":"mmr","geography":"Idaho"} | allowed | fail: bad_args | 2,131 | 543 | 2,674 | [trial](../scripts/pophive/run/trial-19.json) |
| 20 | P1 | baseline | 1 | get_current_status | {"disease":"flu","geography":"Texas","include_chart":false} | allowed | pass | 3,208 | 0 | 3,208 | [trial](../scripts/pophive/run/trial-20.json) |
| 21 | Control | candidate | 1 | get_data | {} | allowed | pass | 7,972 | 0 | 7,972 | [trial](../scripts/pophive/run/trial-21.json) |
| 22 | Control | candidate | 2 | get_data | {} | allowed | pass | 7,972 | 0 | 7,972 | [trial](../scripts/pophive/run/trial-22.json) |
| 23 | P2 | baseline | 1 | get_map | {"disease":"rsv","geo_level":"state","top_n":3,"include_chart":false} | allowed | pass | 3,627 | 0 | 3,627 | [trial](../scripts/pophive/run/trial-23.json) |
| 24 | P2 | baseline | 2 | get_map | {"disease":"rsv","geo_level":"state","top_n":3,"include_chart":false} | allowed | pass | 3,627 | 0 | 3,627 | [trial](../scripts/pophive/run/trial-24.json) |

## Consistency and context cost

| Task | Condition | Tool/arguments disagree | Verdicts disagree | Token tuple disagrees | Image count disagrees |
|---|---|---|---|---|---|
| P1 | baseline | false | false | false | false |
| P1 | candidate | false | false | false | false |
| P2 | baseline | false | false | false | false |
| P2 | candidate | false | false | false | false |
| P3 | baseline | false | false | false | false |
| P3 | candidate | false | false | false | false |
| Control | baseline | false | false | false | false |
| Control | candidate | false | false | false | false |

| Condition | Counted responses | Text/envelope tokens | Image tokens | Total mixed tokens |
|---|---:|---:|---:|---:|
| baseline | 12 | 50,814 | 1,629 | 52,443 |
| candidate | 12 | 50,814 | 1,629 | 52,443 |

Static tool-definition tokens, reported separately: baseline 7356; candidate 7798. 24/24 returned trial responses have provider counts; 0 counts unavailable. 0 response redactions. No secret values are reported.

Response changes across tasks or time and different chart dimensions limit interpretation of aggregate token differences. These counts are not end-to-end agent cost, invoiced dollars, response latency improvements, or proof of general reliability. No final answer is generated or scored. All errors and disagreements remain visible.

## Dispatch, spacing and retention

All seven frozen tools were visible in both conditions. The same allowlist was enforced at dispatch, with readOnlyHint true and destructiveHint true excluded. There was at most one target call per trial, concurrency 1, provider-default sampling with no temperature, no retries or replacement trials, and the same configured model (claude-sonnet-5-5). Frozen metadata was rechecked before setup and trials.

Request spacing passed across preparation, setup, and execution; observed minimums: preparation-requests.json 1.051s; setup/requests.json 1.049s; run/requests.json 1.051s. Startup GET/SSE requests use the same serialized reservation queue. All frozen hashes match. Setup and trial outputs are public aggregate data; no target credentials were used. Manufact outputs remain private.

[Complete run](../scripts/pophive/run/result.json) · [Machine summary and verification](../scripts/pophive/summary.json) · [Request log](../scripts/pophive/run/requests.json) · [Full responses and model outputs](../scripts/pophive/run/).
