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

## Auth acceptance and gateway behavior

Manufact now deploys this existing server from production branch `lane/viewer`; `lane/platform` remains accepted and unmerged. Auth deployment `0721fac2-1c3a-41b4-9532-147670d57948` reached running. A real hosted token-bearing MCP client called ping successfully. Both widget assets returned public HTTP 200 and were scanned for every configured API-key/token value, with no matches. Hosted `/health` is intercepted by Manufact's gateway and returns `{"status":"healthy","timestamp":"..."}`; the application route itself returns only status. Neither returns environment details.

Valid unauthenticated MCP POST, GET with a valid Accept header, and DELETE with valid transport headers return 401. Raw GET/DELETE missing required transport headers receive gateway 400 before application middleware, and the gateway answers OPTIONS preflight with 204. Local direct application tests prove all HTTP methods return 401 without credentials. Literal normalization of every malformed request to 401 is not proven on this gateway; that policy exception is awaiting the user's decision. No undocumented routing changes were made.

## Fixture contract and wire acceptance

`viewer/create-fixture.ts` adapted the recorded public-trackr S3 gate result into audit, patch, result, progress and confirm files. All five contracts validate against the actual external `axlint-core` checkout without importing unmerged core into the product. Trial choices, arguments, scores and token counts remain the recorded 24 trials: baseline 9/12, candidate 12/12. Unrecorded latency is zero only in the fixture contract and never displayed. Confirmation gates are visibly illustrative; the preview never applies a patch or claims a real confirmation.

The actual authenticated production MCP endpoint returned both complete and running `preview_run` snapshots with the expected 24 trials and verdict. An invalid phase was rejected. Typecheck and production build passed. Pending, ready and error UI states, interaction and actual rendered layout are checked separately below.
