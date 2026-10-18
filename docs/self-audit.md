# AX Lint self-audit

The same deterministic audit implementation was run against AX Lint's own actual
MCP tool metadata. The before snapshot is the deployed 0.3.0 server; the after snapshot is the deployed 0.4.0 server. Anonymous audit_server against
that endpoint passed at 8:52 PM PT on October 17. The independent local
production metadata check is also retained.

| Check | Before (deployed 0.3.0) | After (deployed 0.4.0) |
| --- | ---: | ---: |
| Findings | 25 | 0 |
| Provider-counted static tool tokens | 4,612 | 5,080 |
| opaque_parameter | 11 | 0 |
| unconstrained_string | 7 | 0 |
| missing_usage_guidelines | 7 | 0 |
| Tools with output schemas | 7/7 | 7/7 |
| Titles + all four explicit annotations | incomplete | 7/7 |

[Before audit](evidence/wrapup/self-audit-before.json) and
[hosted after audit](evidence/wrapup/self-audit-after.json) include actual
provider-counted static tool tokens. The [local metadata check](evidence/wrapup/self-audit-local.json)
records all seven tools, titles, schemas and annotations. Documentation adds 468
static tokens; the improvement claimed here is metadata coverage, not a token reduction. New parameter descriptions explain accepted values and defaults; usage
text explains when to call each tool. Server metadata includes a description,
GitHub website, instructions and a public SVG icon. The five core tools plus
ping and preview remain available; both prompts are publicly discoverable.

Annotations distinguish actual effects: propose_patch makes a billed generation
request and is not idempotent; verify_patch allocates work and is neither read-only
nor idempotent; confirm_patch persists auxiliary confirmation data. Polling, audit,
preview and ping are read-only; openWorldHint reflects their external access.

Reproduce after deploy: `node --env-file=.env --import tsx scripts/wrapup-self-audit.ts`.
Public discovery, hosted self-audit, protected-call auth and widget assets now
pass. **Request the official readiness score now** at <https://manufact.com/mcp-catalog>.
Complete the human client recordings separately before submission. **A+ is a target,
not a claimed official grade.** The deterministic audit is not Manufact's scorer.
