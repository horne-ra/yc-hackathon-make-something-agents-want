# S3 benchmark status

The memory infrastructure and hand-applied source-fidelity check pass. Behavioral evidence is blocked by the configured model rejecting the frozen temperature requirement. Do not choose the memory server as primary from this run: all 24 trials are infrastructure errors, so there is no routing evidence. Trackr remains the provisional target pending a valid comparison and the lead's S3 gate decision.

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

The model sees all nine memory tools. The allowlist is checked inside `executeAllowed`, immediately before dispatch; a disallowed tool is scored `wrong_tool` and never dispatched. Every trial starts a fresh official memory server process on its own temporary seed copy and removes both on completion. The seed is a deterministic fictional graph with 145 entities and 142 relations. Only metadata shown to the model changes between conditions. Trials use the frozen system prompt verbatim, temperature 0, automatic tool choice, maximum 300 output tokens, a fixed seeded shuffle and concurrency 4. Provider 429/5xx failures are retried twice, and every attempt is retained.

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

The lane needs an explicit lead/user decision before changing the pinned model or the frozen temperature requirement. The trackr model run is also held until that decision, because it would hit the same known provider incompatibility.
