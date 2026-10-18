# AX Lint self-audit

The same deterministic audit implementation was run against AX Lint's own actual
MCP tool metadata. The before snapshot is the deployed 0.3.0 server; the local
after snapshot is the production build of 0.4.0. A live public audit_server call
against the redeployment is a separate final acceptance check.

| Check | Before (deployed 0.3.0) | After (local production 0.4.0) |
| --- | ---: | ---: |
| Findings | 25 | 0 |
| opaque_parameter | 11 | 0 |
| unconstrained_string | 7 | 0 |
| missing_usage_guidelines | 7 | 0 |
| Tools with output schemas | 7/7 | 7/7 |
| Titles + all four explicit annotations | incomplete | 7/7 |

[Before audit](evidence/wrapup/self-audit-before.json) includes provider-counted
static tool tokens. [Local after metadata](evidence/wrapup/self-audit-local.json)
records every actual tool, title, schema and annotation; it makes no token-count
claim. New parameter descriptions explain accepted values and defaults; usage
text explains when to call each tool. Server metadata includes a description,
GitHub website, instructions and a public SVG icon. The five core tools plus
ping and preview remain available; both prompts are publicly discoverable.

Annotations distinguish actual effects: propose_patch makes a billed generation
request and is not idempotent; verify_patch allocates work and is neither read-only
nor idempotent; confirm_patch persists auxiliary confirmation data. Polling, audit,
preview and ping are read-only; openWorldHint reflects their external access.

Reproduce after deploy: `node --env-file=.env --import tsx scripts/wrapup-self-audit.ts`.
Request the official readiness score at <https://manufact.com/mcp-catalog> after
public discovery, hosted self-audit and actual client tests pass. **A+ is a target,
not a claimed official grade.** The deterministic audit is not Manufact's scorer.
