# AX Lint viewer and bearer authentication

Lane C completed with user-confirmed Claude app widget rendering and a successful Claude Code ping. Lane G starts from that accepted app on `lane/viewer`. No merge to main is needed for this work.

## Bearer credential

`AXLINT_API_TOKEN` is a random 32-byte base64url credential stored in `/Users/ransomhorne/Documents/axlint-platform/.env` (gitignored). Never copy it into chat, source files, URLs or committed client configuration. The server requires `Authorization: Bearer <token>` on every `/mcp` request, including calls using an existing session. Missing, wrong or malformed credentials return 401 with a Bearer challenge. Missing server configuration also fails closed with 401. `/health` is public and returns only `{ "status": "healthy" }`; widget JavaScript/CSS stay public and contain no secret or run data.

Manufact: set `AXLINT_API_TOKEN` to the exact `.env` value as a write-only production secret, alongside the existing platform credentials. This lane configures it through the authenticated API without printing it.

Claude app: remove/re-add the existing AX Lint custom connector if editing is unavailable. Use the existing MCP URL, choose **No sign in** (this is a fixed credential, not OAuth), then **Request headers**: name `Authorization`, value `Bearer ` followed by the token copied directly from `.env`. Enable the connector in a new conversation. [Official custom connector instructions](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) document fixed request headers and re-adding connectors to edit them.

Claude Code: from this checkout run the following command. It reads the secret from `.env`, re-adds only the `trackr` repository's local `axlint` connection with the header, and redacts any credential from CLI output:

```sh
pnpm exec tsx viewer/configure-claude-code.ts /Users/ransomhorne/Documents/trackr
```

The equivalent native CLI shape is `claude mcp add --transport http --scope local axlint https://fast-pulse-rlqvb.run.mcp-use.com/mcp --header "Authorization: Bearer <token>"`. Do not put a literal token into shell history. Restart Claude Code and check `/mcp`. Ask each client to call `ping`; confirm the Claude app still displays its widget. The terminal displays text only.

## Checks

`pnpm exec tsx viewer/check-auth.ts` starts real production listeners with an ephemeral credential and checks missing/wrong/malformed credentials, valid MCP connection, existing-session bypass rejection, public health/assets and fail-closed missing configuration. Test output contains no credential.

Hosted acceptance and fixture viewer work are recorded below as they complete.
