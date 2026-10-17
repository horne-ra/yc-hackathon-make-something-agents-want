# Official filesystem reference-server benchmark

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

**Verdict: Improved.** The preregistered overview task rose 0/3 → 3/3 and the test-search task rose 1/3 → 3/3. The package.json control held 3/3. There are no infrastructure failures or insufficient-data tasks. Tokens did not determine the verdict.

## Frozen protocol and source fidelity

- Preregistered and pushed **before any model call** at `8e9cb64` ([preregistration](../scripts/filesystem-preregistration.md)); the preceding commit `f7b5c2f` was amended only to correct fixture-count arithmetic before execution. No task, scorer, candidate, fixture or baseline change after results.
- Official `modelcontextprotocol/servers` pin `bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`, `src/filesystem`; unchanged baseline source and all **14 tools visible** to the model.
- Anthropic `claude-sonnet-5-5` from `AXLINT_MODEL`, provider default sampling, **temperature never sent**. Spec system prompt verbatim, automatic tool choice, max 300 output tokens, first call only, one turn. Task text verbatim plus condition-identical project-root context. Seeded shuffle 173201; concurrency 4.
- Deterministic seed 20261017; **6,011 files**, 240 fake dependency packages, 24 fake JavaScript modules plus package.json per package. No fixture code executed or network used. The fake `.git` contains three inert files; no real repository or user data.
- Dispatch allowlist enforces the eight authorized read tools. All 24 selected calls were allowlisted. No write or deprecated `read_file` call executed.
- Every trial used a fresh official process and fresh temp fixture copy, restricted to its own directory. Validation found **24 unique PIDs / 24 unique roots**, all removed afterward. Child environments contain no provider secrets.
- Candidate modifies exactly three descriptions: directory_tree, directory_tree.excludePatterns, search_files.excludePatterns. A compiled hand-edited copy produced **exactly equal candidate tools/list**, including all other metadata. [Source patch](../scripts/filesystem-evidence/source.patch), [baseline](../scripts/filesystem-evidence/baseline-tools.json), [candidate](../scripts/filesystem-evidence/candidate-tools.json).

## Per-task summary

| Task | Baseline passes | Candidate passes | Baseline result tokens | Candidate result tokens |
| --- | --- | --- | ---: | ---: |
| fs-overview | 0/3 | 3/3 | 2,105,349 | 2,847 |
| fs-tests | 1/3 | 3/3 | 1,305 | 1,317 |
| fs-control | 3/3 | 3/3 | 747 | 747 |
| fs-boundary | unscored | unscored | 315 | 315 |

Across the nine scored calls per condition: **4/9 → 9/9 passes**, returned result tokens **2,107,401 → 4,911 (−99.77%)**. Including the six unscored boundary calls, result-token totals are **2,107,716 → 5,226**.

**Static tool-definition tokens: 3,143 → 3,315 (+172; +5.47%)**, counted separately. Static cost rises; this is visible alongside the result savings.

Each unfiltered overview response counted **701,783** tokens; each candidate excluded-tree response counted **949**. Result counts use the complete serialized MCP response (`content` plus `structuredContent`), so repeated content in those protocol fields is included. These are potential returned context tokens; the single-turn model did **not** consume the results. All counts use the Anthropic countTokens endpoint, with no approximation.

The baseline honestly passed fs-tests trial 2, using `node_modules/**` exclusion. Its other two searches traversed node_modules and failed the preregistered scope rule even though the fake dependencies contain no matching test filenames; those responses remain small. This benchmark scores avoiding dependency traversal, not just returned matching filenames.

## Every trial

`<PROJECT>` below replaces only that trial’s absolute allowed root for readability. Exact original arguments, temporary paths, PID, model text, usage, attempts and outcomes are preserved in [result.json](../scripts/results/filesystem-2026-10-17T21-31-17.655Z/result.json). All 24 complete raw responses are adjacent `*-response.json` files. No trial was deleted, retried as a replacement or hidden.

| Task | Condition | Trial | Tool | Arguments | Outcome | Result tokens |
| --- | --- | ---: | --- | --- | --- | ---: |
| fs-overview | baseline | 1 | directory_tree | `{"path":"<PROJECT>"}` | fail: bad_args | 701,783 |
| fs-overview | baseline | 2 | directory_tree | `{"path":"<PROJECT>"}` | fail: bad_args | 701,783 |
| fs-overview | baseline | 3 | directory_tree | `{"path":"<PROJECT>"}` | fail: bad_args | 701,783 |
| fs-overview | candidate | 1 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist"]}` | pass | 949 |
| fs-overview | candidate | 2 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist"]}` | pass | 949 |
| fs-overview | candidate | 3 | directory_tree | `{"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist"]}` | pass | 949 |
| fs-tests | baseline | 1 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*"}` | fail: bad_args | 435 |
| fs-tests | baseline | 2 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]}` | pass | 447 |
| fs-tests | baseline | 3 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*"}` | fail: bad_args | 423 |
| fs-tests | candidate | 1 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 441 |
| fs-tests | candidate | 2 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 441 |
| fs-tests | candidate | 3 | search_files | `{"path":"<PROJECT>","pattern":"**/*test*","excludePatterns":["node_modules",".git"]}` | pass | 435 |
| fs-control | baseline | 1 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 |
| fs-control | baseline | 2 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 |
| fs-control | baseline | 3 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 |
| fs-control | candidate | 1 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 |
| fs-control | candidate | 2 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 |
| fs-control | candidate | 3 | read_text_file | `{"path":"<PROJECT>/package.json"}` | pass | 249 |
| fs-boundary | baseline | 1 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 |
| fs-boundary | baseline | 2 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 |
| fs-boundary | baseline | 3 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 |
| fs-boundary | candidate | 1 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 |
| fs-boundary | candidate | 2 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 |
| fs-boundary | candidate | 3 | list_directory | `{"path":"<PROJECT>/src"}` | unscored | 105 |

## Consistency flags

Temporary root prefixes are normalized for comparing tool arguments; provider token counts always use the original complete responses.

| Task | Condition | Call disagreement | Outcome disagreement | Token disagreement | Overall flag |
| --- | --- | --- | --- | --- | --- |
| fs-boundary | baseline | no | no | no | no |
| fs-boundary | candidate | no | no | no | no |
| fs-control | baseline | no | no | no | no |
| fs-control | candidate | no | no | no | no |
| fs-overview | baseline | no | no | no | no |
| fs-overview | candidate | no | no | no | no |
| fs-tests | baseline | YES | YES | YES | YES |
| fs-tests | candidate | no | no | YES | YES |

**fs-tests baseline disagrees**: no exclusions / exclusions / no exclusions, outcomes fail/pass/fail, tokens 435/447/423. **fs-tests candidate token counts disagree** (441/441/435), while normalized calls and all pass outcomes agree. Fresh random absolute temporary-path strings are included in search results and tokenize differently. No other condition group disagrees.

## Acceptance evidence

Commands run:

```text
pnpm exec tsx scripts/hand-run-filesystem.ts --check
PASS tools/list: 14 tools visible
PASS dispatch allowlist: write_file and deprecated read_file blocked, 0 handler calls
PASS deterministic fixture: 6011 files; full tree 1853916 chars; excluded tree 1916 chars
PASS frozen scorer: root listing, excluded tree/search, test listing, package control, forbidden deprecated read
PASS source fidelity: compiled description edits exactly reproduce candidate tools/list, all 14 tools and non-description metadata identical
PASS process/temp cleanup: all check connections closed and fixture copies removed

pnpm exec tsx scripts/hand-run-filesystem.ts
status: complete; 24 trials; 0 infra; 0 approximate counts; verdict: Improved

pnpm exec tsx scripts/filesystem-validate-results.ts
PASS all 24 trials: four tasks × three trials × two conditions, no replacements
PASS all 24 calls used allowlisted read tools; no MCP errors, infra failures or approximate token counts
PASS frozen scoring recomputed from original calls; 24 complete raw responses retained
PASS isolation: 24 unique PIDs, 24 unique allowed roots, every root now deleted
PASS no provider retries: 24 attempts for 24 trials; default sampling metadata
PASS all 14 baseline tools; candidate exact description-only patch; static counts exact
PASS verdict Improved: overview +3, tests +2, control unchanged; no insufficient data

pnpm typecheck
tsc --noEmit (exit 0)
```

The first typecheck found an old worktree installation missing already-declared React packages. `pnpm install --frozen-lockfile` reused the existing lockfile (10 cached packages, no manifest/lock changes); the subsequent full typecheck passed. No new dependency requested.

No acceptance checks skipped. Yahoo Finance was not started. No production tools were registered and nothing was merged into main.
