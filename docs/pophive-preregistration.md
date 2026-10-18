# PopHIVE pre-registration

Manufact catalog score: **88/A** (imported checklist score, not a per-tool documentation score). Public endpoint: <https://mcp.pophive.org/mcp>. All seven tools remain visible; dispatch permits only frozen tools annotated `readOnlyHint: true` without `destructiveHint: true`.

This registration is committed before any provider call. One setup **experiment comprises two target tool calls**: `get_current_status(disease="flu", geography="TX")` with its chart default, then the same call with `include_chart=false`. Each is executed once, without retries. No other setup tool call is allowed. This confirms anonymous execution and measures the image cost before the final patch and registration are frozen and committed. Setup evidence is separate from the 24 trials.

The static hypothesis is that six tools default to attaching PNG charts, while their descriptions do not explain the input-token cost. The benchmark tests whether a description-only clarification changes first-call selection and chart suppression. It does not test clinical claims, population estimates, or final-answer quality.

| Task | Exact user prompt | Pass predicate |
|---|---|---|
| P1 | Quick yes or no: is flu rising in Texas right now? | One `get_current_status`; disease `flu`, geography Texas/TX, explicit `include_chart=false`. |
| P2 | Which 3 states have the highest RSV right now? Just list them. | One `get_map`; disease `RSV`, explicit `include_chart=false`. Record `top_n` but do not score it. |
| P3 | What's the kindergarten MMR vaccination rate in Idaho? | One `get_coverage`; explicit vaccine `mmr`, geography Idaho/ID, explicit `include_chart=false`. |
| Control | What diseases and topics does PopHIVE track? | One `get_data` with the `disease` argument absent. |

Fairness rationale: the first three requests ask for yes/no, a short list, or a single number. A chart is not needed for those requested answer forms. The natural prompts name neither tools nor parameters. Explicit chart suppression is a user-approved scoring preference, not evidence that a chart is intrinsically bad. If the baseline already suppresses charts, report that honestly. Disease/vaccine values are matched case-insensitively; geography accepts the stated full names or abbreviations. Other schema-valid arguments are recorded but unscored. Arguments are validated without inserting defaults. An omitted/default-true chart flag fails P1–P3. Multiple calls fail and none are dispatched.

Candidate: change only the six existing `include_chart` parameter descriptions to say that the flag attaches a PNG image, adds about **N image-input tokens**, defaults true, and should be false when the user needs only a short answer or the numbers. N is the setup chart's measured incremental image-token count rounded to the nearest 10. State that actual costs vary by chart dimensions/content; one flu/Texas chart cannot establish the cost of every chart. Preserve names, defaults, constraints, annotations, other descriptions, and runtime behavior. `get_data` is unchanged.

Token accounting preserves the complete MCP envelope, including `content`, `structuredContent`, and metadata. Recursively substitute image-block data with numbered image references in its JSON representation, and attach those bytes to countTokens as native image content parts. Report envelope-only **text tokens**, incremental **image tokens** (mixed minus text-only), and **total mixed tokens** separately. The text count includes message-envelope overhead. Base64 image data is never counted as text. No approximate fallback is allowed. Also report the with-chart versus no-chart text difference, since image attachment may affect non-image metadata.

Design: 4 tasks × 3 repetitions × baseline/candidate = 24 first-call trials; configured `AXLINT_MODEL` unchanged; provider-default sampling with temperature omitted, `max_tokens=300`, automatic tool choice, neutral system prompt: “You are a helpful assistant. Use the available tools to answer the user.” All seven provider tool definitions are visible. Saved initialize instructions are evidence and are not separately injected into generation. No extra context/hints, no result feedback, no final-answer turn. Seeded shuffle 173201; concurrency 1. A serialized per-host reservation queue spaces **all** PopHIVE HTTP requests, including simultaneous startup GET/SSE and tools/list, by at least 1.05 seconds. No provider or target retries and no replacement trials.

The dispatch gate rechecks frozen tool identity and read-only/destructive hints immediately before each call. Unknown/write/destructive tools are `wrong_tool` and never execute. Schema-invalid calls do not execute. A single allowed, schema-valid call executes even if its arguments fail the task predicate, so actual context cost is retained. Successful empty results can pass selection but are labeled empty; transport/MCP errors remain separate from routing and do not disappear from denominators or evidence.

Retain every trial, model response, proposed call/arguments, dispatch decision, error/empty outcome, full redacted MCP response, native image payload, image dimensions/hashes, token count/error, and request timestamp. Scan for configured secrets and bearer/API-key shapes before public storage/provider transfer; never emit values. No target credentials are sent. Keep all Manufact material private and outside these artifacts.

Consistency flags, per task and condition: selected-tool/argument disagreement, pass/failure disagreement, text/image/total-token disagreement, and image-count disagreement. No trial is hidden or rerun because it disagrees.

Ordered verdict uses the unchanged `src/core/verdict.ts`: **Regressed** first for any control loss or task loss of at least two passes; otherwise **Inconclusive** for incomplete/insufficient data; otherwise **Improved** only if all task deltas are nonnegative and a non-control task gains at least two passes; otherwise **Inconclusive**. Result-token differences alone cannot make Improved. These N=3 observations are provisional.

The machine registration, exact schedule, setup evidence, frozen patch/metadata/harness hashes, every trial, and final report are saved under `scripts/pophive/`. Final report: `docs/pophive-results.md`. Any metadata/model/hash drift invalidates the freeze and stops execution rather than silently changing it.

## Frozen setup measurement and patch

Setup registration commit: `34d2a65aff0b6df1e35ab6ef50123a7bd376600e`. Both anonymous calls succeeded. The with-chart response has 1 PNG image(s), 4246 text/envelope tokens and 543 incremental image tokens (4789 total). The no-chart response has 3208 text/envelope tokens and zero image tokens. The non-image text difference is 1038 tokens; the full response difference is 1581. These are one setup example, not a chart-cost distribution.

Each of the six parameter descriptions is frozen as:

> Attach a PNG chart image. It adds about 540 image-input tokens in one measured flu/Texas status-chart example; actual cost varies by chart dimensions and content. Defaults to true. Set false when the user only needs a short answer or the numbers.

All task prompts, predicates, model settings, and stop rules above are unchanged. The complete candidate and source hashes are in `scripts/pophive/frozen/hashes.json`; this final freeze must be committed before generation.
