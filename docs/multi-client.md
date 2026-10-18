# One AX Lint server, multiple clients

Endpoint: `https://fast-pulse-rlqvb.run.mcp-use.com/mcp` (Streamable HTTP).
Anonymous initialize, tools/list, resources/list/read, prompts/list/get, audit_server,
ping and widget assets work immediately. Generation, verification, polling,
confirmation and preview require a named bearer token; missing/invalid access
returns 401 with instructions. No URL tokens or OAuth sign-in fallback.

## Tokens and operator setup

The maintainer's local, gitignored `.env` contains `AXLINT_API_TOKENS`, a JSON
object with `codex`, `cursor`, `claude`, and `judges` entries. Each entry has
`token`; `judges.daily_verify_limit` is 5. Copy the individual token value using
a local editor, never terminal output or chat. Copy the entire JSON value into
the same Manufact environment key as a write-only secret. Delete the retired
`AXLINT_API_TOKEN` there and locally. Restart/redeploy after environment changes.
`AXLINT_QUOTA_SANDBOX` names the existing persistent shared runner. Daily quota
claims live there, atomically across replicas and redeploys; do not delete that
sandbox or its `/app/axlint-quotas` directory. UTC days reset at 00:00 UTC (5 PM
PDT on October 17). Invalid schemas do not consume quota; accepted launch
attempts count even when infrastructure fails. Quota storage failures fail closed.
Only verify_patch is limited; polling does not spend a verify allowance.

Client credentials remain in `.env` or the client's process environment. Examples
below use environment references; never commit actual bearer headers. Load only
the required token into a client environment, not model or platform credentials.

## Claude Code

Public first call:

```sh
claude mcp add --transport http axlint https://fast-pulse-rlqvb.run.mcp-use.com/mcp
```

For the full loop, set `AXLINT_CLAUDE_TOKEN` from `.env`'s `claude.token` in a
private shell, remove an old registration if present, then run:

```sh
claude mcp remove axlint
claude mcp add-json axlint '{"type":"http","url":"https://fast-pulse-rlqvb.run.mcp-use.com/mcp","headers":{"Authorization":"Bearer ${AXLINT_CLAUDE_TOKEN}"}}'
```

The literal reference expands in the client environment. Restart Claude Code,
check `/mcp`, and ask it to audit the Trackr endpoint below. The terminal shows
tools and text; the Claude app supplies the verdict widget.
[Claude Code MCP documentation](https://code.claude.com/docs/en/mcp).

## Codex

Set `AXLINT_CODEX_TOKEN` from `codex.token` in the environment that launches Codex.
Add to `~/.codex/config.toml` and restart/reconnect:

```toml
[mcp_servers.axlint]
url = "https://fast-pulse-rlqvb.run.mcp-use.com/mcp"
bearer_token_env_var = "AXLINT_CODEX_TOKEN"
```

Omit the bearer setting for anonymous audit-only use. A GUI launched from the
Dock may not inherit shell exports; launch from the configured environment.
[Official OpenAI MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

## Cursor

Set `AXLINT_CURSOR_TOKEN` from `cursor.token` in Cursor's launching environment.
Merge into `~/.cursor/mcp.json` (or a project's `.cursor/mcp.json`):

```json
{"mcpServers":{"axlint":{"url":"https://fast-pulse-rlqvb.run.mcp-use.com/mcp","headers":{"Authorization":"Bearer ${env:AXLINT_CURSOR_TOKEN}"}}}}
```

Remove `headers` for anonymous use. Restart/reconnect; approve the tool call.
[Cursor MCP configuration and interpolation](https://cursor.com/docs/mcp).

## Claude app connector

In the existing custom connector, use the endpoint above, **No sign-in**, and
an `Authorization` header whose value is `Bearer ` followed by `.env`'s
`claude.token`. Replace the old credential, reconnect, and enable it in a chat.
Run audit_server first, then preview_run for the recorded S8 verdict widget.
The prior widget was human-confirmed; the rotated credential still needs a human
retest. If your connector UI lacks custom headers, public audit still works but
the protected loop requires a header-capable client; never put a token in the URL.

## ChatGPT

Protected loop: **not supported yet** in any connector UI without an arbitrary
Authorization header field. Do not use a URL-token fallback. Public metadata and
audit can be tested in a no-auth connector; record the exact client capability
before claiming support. No authenticated ChatGPT connector test is claimed.

## mcp-use Inspector

```sh
npx @mcp-use/inspector
```

Choose Streamable HTTP, paste the endpoint, and connect without headers for
public discovery. Add `Authorization: Bearer <token>` in the Inspector's header
field using the locally copied `claude.token` (or judges token for judging).
Call preview_run, then open its MCP App view. Do not save credentials in a share
URL. The server build ships widget JS/CSS as public assets.

## Reproduce the first call

```text
Call axlint.audit_server with server_url:
https://trackr-production-e1a6.up.railway.app/mcp
```

Then use `improve-agent-experience` with the target URL and the complete source
paths, or `verify-only` with existing patch/tasks paths. Verify never applies a
patch; only Improved authorizes the coding agent's apply step.

| Client | Expected presentation | Evidence (human to fill in) |
| --- | --- | --- |
| Claude Code | Full loop, text/tools | Prior ping confirmed; rotated-token full-loop recording pending |
| Codex | Full loop, tools; widget depends on host | Pending client recording |
| Cursor | Full loop, tools; widget depends on host | Pending client recording |
| Claude app | Tools + verdict widget; apply happens in coding client | Prior shared-run widget human-confirmed; rotated-token retest pending |
| ChatGPT | Public tools where no-auth MCP is supported; protected loop requires headers | Not supported yet without header field |
| mcp-use Inspector | Tools + widget | Prior hosted widget verified; current retest pending |

See [demo script](demo.md), [self-audit](self-audit.md), and [submission](submission.md).
