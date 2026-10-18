# AX Lint

AX Lint audits MCP tool interfaces, proposes description changes, and verifies whether they improve an agent's first call before a patch is applied.

https://docs.google.com/presentation/d/1GZbLq-aJ_Q-Gl6Y32XNc8Vhg-IBEqluUkMN1yQ05vWw/edit?usp=sharing

## Why MCP, and why an MCP App?

The coding agent calls AX Lint mid-workflow in the repository it is already
editing: audit → propose → verify → review → apply only if Improved → confirm.
MCP makes the same server available in multiple coding clients. The MCP App
renders the verdict, diff, trials and confirmation gates inside the chat where
the human reviews the patch. A Regressed verdict is a useful result: S8 attempt 1
caught a harmful patch before it was applied.

## Try it in 2 minutes

Connect without a token to `https://fast-pulse-rlqvb.run.mcp-use.com/mcp`, using
Streamable HTTP / No sign-in. Call:

```json
{"name":"audit_server","arguments":{"server_url":"https://trackr-production-e1a6.up.railway.app/mcp"}}
```

Discovery, audit and ping require no bearer token and make no generation calls.
For the full loop, use the judges token supplied privately with the submission
as `Authorization: Bearer <token>`. Judges have five verify launch attempts per
UTC day; polling is unlimited. The token's location and client setup are in
[multi-client.md](docs/multi-client.md). Never place credentials in a URL.

## Results

**Provisional: 3 trials per condition.** These selected small experiments are
not statistical reliability claims. Static metadata cost and returned-result
context are separate; the one-turn model does not consume tool results.

| Benchmark / run | Verdict | Baseline → candidate passes | Returned-result tokens / observation | Static tool tokens | Committed evidence |
| --- | --- | --- | --- | --- | --- |
| Trackr, frozen compact · Sonnet 5.5 | Improved | 9/12 → 12/12 | 115,194 → 13,272 (−88.5%) | 651 → 837 | [Gate results](docs/gate-results.md) |
| Trackr, hosted stability 1 | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 907 | [Stability](docs/stability-results.md) |
| Trackr, hosted stability 2 | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 911 | [Stability](docs/stability-results.md) |
| Trackr, hosted stability 3 | Improved | 9/12 → 12/12 | 115,194 → 13,702 | 651 → 947 | [Stability](docs/stability-results.md) |
| Trackr, S8 attempt 1 · tools.ts only | **Regressed** | 9/12 → 6/12 | 115,194 → 59,007; errors are not savings | 651 → 1,153 | [Caught before apply](docs/s8-attempt-1.md) |
| Trackr, S8 milestone · complete source | Improved | 9/12 → 12/12 | 115,194 → 13,917 | 651 → 903 | [All four confirm gates passed](docs/s8-milestone.md) |
| Trackr, proposer follow-up · top three/full source | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 941 | [Every trial](docs/s8-proposer-fixes.md) |
| Trackr, proposer follow-up · all findings/tools only | **Regressed** | 9/12 → 6/12 | 115,194 → 59,010; rejected calls are not savings | 651 → 968 | [Every trial and nine warnings](docs/s8-proposer-fixes.md) |
| Official filesystem server · Sonnet 5.5 | Improved | 4/9 → 9/9 | Separate real-repo size check below | 3,143 → 3,315 | [Filesystem](docs/filesystem-results.md) |
| Trackr · Haiku 5.5 | Improved | 6/12 → 12/12 | See full cross-model trial table | 651 → 837 | [Cross-model](docs/cross-model-results.md) |
| Official Memory · Sonnet 5.5 | Inconclusive | 9/9 → 9/9 | 764,652 → 764,652 | 1,961 → 2,121 | [Gate results](docs/gate-results.md) |
| Official Memory · Haiku 5.5 | Inconclusive | 9/9 → 9/9 | 764,652 → 764,652 | 1,961 → 2,121 | [Cross-model](docs/cross-model-results.md) |
| PopHIVE · Manufact 88/A | Inconclusive | 9/12 → 9/12 | 52,443 → 52,443 (including images) | See frozen report | [PopHIVE](docs/pophive-results.md) |
| Yahoo Finance · SAIL motivating server | Inconclusive | 8/12 → 9/12 | Q1-2025 calls fetched about 115K tokens of daily data | See frozen report | [Yahoo Finance](docs/yfinance-results.md) |
| Hosted judges smoke · Sonnet 5.5 | Improved | 9/12 → 12/12 | 115,194 → 13,917 | 651 → 955 | [New smoke, separate candidate](docs/judges-smoke.md) |
| Manufact Cloud | reviewed privately; results shared with the Manufact team first. | — | — | — | Private evidence stays local |

Commander.js real-repo size check: **1,037,509 → 19,443** full-response tokens,
separate from the filesystem behavioral benchmark. Haiku with the patch reached
12/12 versus Sonnet's original 9/12; most of the per-success estimated price gap
comes from Haiku's lower prices, and the estimate covers one model turn only.
[Full results and caveats](docs/results-summary.md) ·
[static leaderboard census](docs/leaderboard-scan.md).

## Five core tools and two prompts

| Tool | Use |
| --- | --- |
| audit_server | Inspect live metadata, static cost and deterministic findings; public |
| propose_patch | Generate validated description operations and source edits from complete source |
| verify_patch | Start baseline/candidate trials; returns a retained run ID |
| get_verification_result | Poll all trials and the provisional verdict; show the MCP App |
| confirm_patch | After an Improved apply/redeploy, check identity, revision and exact metadata |

`ping` checks hosting; `preview_run` replays the recorded S8 milestone with its
actual four confirmation gates. Replay is labeled historical, not a fresh run.

- `improve-agent-experience`: target URL + source paths → audit → propose with
  every file defining allowed values/defaults → verify → apply only if Improved → confirm.
- `verify-only`: verify a saved PatchSpec with frozen tasks; report every verdict without applying.

Include declarations, validation constants/enums and handlers. For Trackr this
means src/tools.ts, src/validation.ts and src/handlers.ts. Review missing-source
warnings. Frozen results are never rescored; scoring v2 is an explicit opt-in
for future first-turn parallel calls, while v1 remains the default.

## Connect and reproduce

[Copy-paste setup](docs/multi-client.md) covers Claude Code, Codex config.toml,
Cursor mcp.json, the Claude app connector and mcp-use Inspector. ChatGPT's
protected loop is not supported yet in connector UIs without header support.
The table distinguishes prior evidence from pending client recordings.

Node >=22.22.2 and pnpm 10.33.0:

```sh
pnpm install --frozen-lockfile
cp .env.example .env
# Fill credentials and AXLINT_MODEL in .env locally; never print or commit them.
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

## How it works

Manufact Cloud hosts the mcp-use server and MCP App assets. The server audits
live tools/list, then validates metadata-only operations and derives source edits
in code. Blaxel's shared runner reserves isolated run directories, executes
baseline/candidate trials with AXLINT_MODEL and provider-default sampling (no
temperature), and retains every trial. Trackr is the controlled demo deployment
on Railway. The coding client applies an approved patch; Railway redeploys it;
confirm_patch checks all four gates against the exact verified candidate.

Named client tokens protect billed generation, verification, polling,
confirmation and preview. Judges' quota claims persist on the shared Blaxel
runner across Manufact restarts; existing result polling does not consume quota.
No content from private/ is published. [Self-audit and readiness](docs/self-audit.md).

## Roadmap

- Choose which models to test deliberately and compare the same frozen tasks.
- Check write tools through staging + reset hooks or shadow mode.
- Evaluate default-change patches as a separate scope from descriptions.
- Run verification in CI on every pull request.

[Specification and method](docs/SPEC.md) · [Results and evidence](docs/results-summary.md) ·
[Demo script](docs/demo.md) · [Submission checklist](docs/submission.md) ·
[Plain-text agent guide](llms.txt).
