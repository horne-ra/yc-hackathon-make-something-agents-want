# S3 benchmark status

The memory infrastructure and hand-applied source-fidelity check pass. The completed Sonnet 5.5 comparison shows no behavioral gain: baseline and candidate each pass all nine scored trials, and all six boundary trials use targeted search. Under the frozen S3 gate table, trackr stays primary. The earlier 24 rejected temperature-0 trials are preserved separately. The finalized trackr comparison passes the spec verdict rules as Improved: baseline 9/12 versus candidate 12/12, entirely from the payload task, with the control unchanged.

## Reproduce

Run from the AX Lint worktree root. Existing root dependencies are sufficient; no manifest changes are required. Secrets stay in the gitignored `.env`. The scripts load `ANTHROPIC_API_KEY` and the exact `AXLINT_MODEL`; they never substitute another model.

```sh
git clone https://github.com/modelcontextprotocol/servers.git vendor/mcp-servers
git -C vendor/mcp-servers checkout --detach bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c
cd vendor/mcp-servers
npm ci --workspace @modelcontextprotocol/server-memory --include-workspace-root --ignore-scripts --no-audit --no-fund
npm run build --workspace @modelcontextprotocol/server-memory
cd ../..
pnpm exec tsx scripts/hand-run-memory.ts --check
pnpm exec tsx scripts/hand-run-memory.ts
```

Set `TRACKR_URL` to the baseline streamable HTTP MCP endpoint in `.env`, then:

```sh
pnpm exec tsx scripts/hand-run.ts --check
pnpm exec tsx scripts/hand-run.ts
```

`--check` exercises infrastructure without making model calls. Every benchmark produces an independent timestamped directory under `scripts/results/`, with full trials in `progress.json` and `result.json` plus a readable `table.md`. Earlier runs are retained. The result token basis is the complete MCP response serialized as JSON, including both `content` and `structuredContent` when present. Counts use the provider endpoint; endpoint failure falls back to ceil(characters / 4), explicitly labeled approximate in each affected trial.

The model sees all nine memory tools. The allowlist is checked inside `executeAllowed`, immediately before dispatch; a disallowed tool is scored `wrong_tool` and never dispatched. Every trial starts a fresh official memory server process on its own temporary seed copy and removes both on completion. The seed is a deterministic fictional graph with 145 entities and 142 relations. Only metadata shown to the model changes between conditions. Trials use the frozen system prompt verbatim, automatic tool choice, maximum 300 output tokens, a fixed seeded shuffle and concurrency 4. The user explicitly authorized keeping pinned claude-sonnet-5-5 and omitting the temperature field after Anthropic rejected it. The successful comparison uses model-default sampling, a declared departure from the original temperature-0 requirement. Other configured models still receive temperature 0. Provider 429/5xx failures are retried twice, and every attempt is retained.

The memory search scorer accepts `search_nodes` with a query containing `checkout` or `migration` case-insensitively. Both keywords are present in relevant seeded observations. The exact retrieval scorer requires `open_nodes` with both exact person names. The boundary task is unscored. These rules are fixed before the first model run.

## Checks and actual output

Pinned vendor commit:

```text
bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c
```

`npm ci` completed with `added 326 packages in 1s`. npm printed engine warnings for root Changesets packages because the host is Node v25.6.1 and those packages request Node 22, 24 or 26+. The memory build succeeded:

```text
> @modelcontextprotocol/server-memory@1.0.0 build
> tsc && shx chmod +x dist/*.js
```

`pnpm typecheck` exited 0:

```text
> axlint@0.0.0 typecheck /Users/ransomhorne/Documents/axlint-gate
> tsc --noEmit
```

`pnpm exec tsx scripts/hand-run-memory.ts --check` exited 0:

```text
PASS tools/list: 9 tools visible
PASS execution allowlist: delete_entities blocked; handler calls = 0
PASS seed size: read_graph 766273 characters; search_nodes 17713 characters
PASS source fidelity: hand-applied src/memory/index.ts descriptions exactly reproduce candidate tools/list; all remaining metadata identical
```

An earlier infrastructure check failed on an overly strict assertion that the narrow response must be under 10,000 characters. Inspection showed the official server includes every relation incident to a matched person; search returns 17,713 characters. The assertion now requires the broad response to be more than 10 times larger. The observed ratio is over 43. No benchmark tasks, prompts, seed, tool descriptions, model or scoring rules were changed for this correction.

## Failed behavioral run

Run directory: `results/memory-2026-10-17T19-30-31.562Z/`.

The provider's model lookup accepted the exact configured `claude-sonnet-5-5`. All 24 model requests then returned the same HTTP 400 error:

```text
"type":"invalid_request_error","message":"`temperature` is deprecated for this model."
```

All tasks in both conditions therefore have `of: 0`, `infra_errors: 3` and `insufficient_data: true`. Result tokens are zero because no model selected an executable tool. This is inconclusive infrastructure failure, not a baseline or candidate behavioral failure. The full trial table and individual request IDs are retained in that run directory.

The user subsequently authorized keeping Sonnet 5.5 and omitting temperature. The initial failed run and all 24 request errors remain unchanged.


## Completed memory comparison

Run directory: `results/memory-2026-10-17T19-34-10.561Z/`. Command exited 0. Every trial and provider token count is in its readable table and full result.

| Task | Baseline | Candidate | Result tokens per trial |
| --- | --- | --- | --- |
| Broad retrieval | 3/3 | 3/3 | 238526 |
| Search | 3/3 | 3/3 | 8328 |
| Exact retrieval control | 3/3 | 3/3 | 8030 |
| Boundary | unscored; 3 searches | unscored; 3 searches | 8328 |

All boundary calls were `search_nodes` with `query: "Priya Nair"`. There were no write-tool selections, missing tool calls, bad arguments or infrastructure errors. Every provider call succeeded on its first attempt. All token counts used the provider endpoint; none are approximate.

Post-run assertions exited 0:

```text
PASS memory evidence: 24 trials; 18 scored passes; six unscored; 24 unique server processes; all per-trial graph files removed; all calls succeeded first attempt; nine tools shown in both conditions
Sampling: omitted; model-default sampling
```

Gate recommendation: baseline already passes every scored task, so trackr remains primary; do not expand memory source patching. The narrow hand-apply source-fidelity check passed, but the real-server comparison supplies no improvement evidence. These N=3 results are provisional.

## Trackr infrastructure check

Against `http://127.0.0.1:3000/mcp`, the free check exited 0:

```text
PASS trackr tools/list: three tools; baseline descriptions exact; control unchanged; TRK-117 read succeeds; identity {"name":"trackr","version":"trackr-local@d105edff5047d57b1eb900a426323ba2e573c815"}
```

The lead corrected the initial fixture summary from 520 tokens to 441 tokens and restarted trackr before behavioral trials. No tool metadata or task prompts changed. The final free check exited 0:

```text
PASS trackr tools/list: three tools; baseline descriptions exact; control unchanged; TRK-117 read succeeds; identity {"name":"trackr","version":"trackr-local@f15129e396513d72b024c5b9e66e4e7515467f18"}
```


## Completed trackr comparison

Run directory: `results/trackr-2026-10-17T19-35-11.886Z/`. Command exited 0; all 24 trials used finalized revision `f15129e396513d72b024c5b9e66e4e7515467f18`. The exact four frozen prompts and all four compact patch operations were unchanged.

| Task | Baseline passes | Candidate passes | Baseline tokens per trial | Candidate tokens per trial |
| --- | --- | --- | --- | --- |
| t1-route | 3/3 | 3/3 | 6570 | 344 |
| t2-status | 3/3 | 3/3 | 18770 | 989 |
| t3-payload | 0/3 | 3/3 | 10408 | 441 |
| t4-control | 3/3 | 3/3 | 2650 | 2650 |

The payload task fails baseline scoring because all three calls omit `include_comments`; every candidate call sets it to false. This is the observed behavioral improvement. Result tokens for that task fall by about 95.8%. Across all tasks, potential result context falls from 115194 to 13272 tokens, about 88.5%. These are returned-result token counts; the single-turn model does not consume the result.

Verdict under the specification's ordered rules: **Improved**. There are no regressions or insufficient-data tasks, the control holds at 3/3, and one non-control task improves by three passes. These N=3 results are provisional and use the user-approved model-default sampling departure.

The t1 routing and t2 status baseline-failure hypotheses were not observed: Sonnet 5.5 correctly selected search and inferred `in_progress` in all baseline trials. The ordinary user prompts do not name the parameter keys; no prompt leak requiring correction was found. The baseline descriptions already use the frozen short, technically true forms. We preserve them and drop t1/t2 failure claims from the demo, while retaining their complete rows as evidence that they already passed. No prompt, model, task, baseline metadata or scorer was changed to manufacture failures. The compact candidate also reduces their returned payloads, but this does not create additional task-pass improvements.

Post-run assertions exited 0:

```text
PASS trackr evidence: 24 trials; baseline 9/12; candidate 12/12; no infra or approximate counts; all trials use finalized trackr revision
Aggregate result tokens: 115194 to 13272
```

All three run directories are retained: the initial 24 rejected trials, the successful 24-trial memory comparison and the successful 24-trial trackr comparison. There are no hidden trials. The two full readable comparison tables are stored in their corresponding run directories; the shared harness and both command-line entrypoints typecheck. S3's primary-target decision remains with the lead; the evidence recommends keeping trackr primary and showing the verified payload improvement honestly.
