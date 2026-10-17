# AX Lint viewer and bearer authentication

Lane C completed with user-confirmed Claude app widget rendering and a successful Claude Code ping. Lane G starts from that accepted app on `lane/viewer`. No merge to main is needed for this work.

## Bearer credential

`AXLINT_API_TOKEN` is a random 32-byte base64url credential stored in `/Users/ransomhorne/Documents/axlint-platform/.env` (gitignored). Never copy it into chat, source files, URLs or committed client configuration. The application middleware requires `Authorization: Bearer <token>` on every `/mcp` request, including calls using an existing session. Missing, wrong or malformed credentials return 401 with a Bearer challenge at the application; missing server configuration also fails closed with 401. Manufact's gateway handles some malformed transport requests and preflights before this middleware; see [the exact hosted behavior below](#auth-acceptance-and-gateway-behavior). The application's public `/health` route returns only `{ "status": "healthy" }`; the hosted gateway adds its own timestamp. Widget JavaScript/CSS stay public and contain no secret or run data.

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

## Rendered UI and interaction acceptance

The actual Inspector rendered all six sections in `/private/tmp/axlint-viewer-preview.png` (1100 px) and `/private/tmp/axlint-viewer-interaction.png` (768 px). Both were visually inspected. The View prominently labels recorded fixture playback and illustrative confirmation; it never displays synthetic latency. Verdict, representative calls, payload metrics and progress derive from the validated data.

`pnpm exec tsx viewer/check-viewer-ui.ts` used an isolated temporary Chrome profile and the real screenshot CLI's CDP hook. Actual DOM checks passed: 24 trial cells, 3 baseline failures, computed text at least 16 px, no horizontal overflow at inline width, task selection changes the representative story, replay resets and advances trials without a reload, and Show all restores all 24. The temporary browser/profile is removed afterward. This proves Inspector behavior, not a new human Claude app observation.

The screenshot helper emitted npm's `Unknown env config "verify-deps-before-run"` warning; capture and checks completed successfully. Initial fixture-adapter typecheck found a JSON-union cast mismatch, corrected by narrowing the validated JSON boundary; typecheck then passed. A development-only log-inspection one-liner had an extra brace and was corrected. These were not hidden as successful first attempts.

## Hosted viewer acceptance

At 1:27 PM Pacific on October 17, 2026, the lead rechecked the live Manufact endpoint after the interrupted session. A valid unauthenticated MCP POST returned 401. A token-bearing official SDK client listed both `ping` and `preview_run`; ping returned `pong: all platform checks passed`, and the complete preview returned native MCP App metadata for `ui://views/preview-run.html` plus an explicit resource link. An invalid preview phase was rejected.

Both ping and preview HTML resources loaded through authenticated MCP; their two JavaScript/CSS assets each returned public HTTP 200 with no configured credential values. Public health returned only status and the gateway timestamp. The real hosted Inspector screenshot `/private/tmp/axlint-viewer-hosted.png` was captured and visually inspected: all six sections, recorded-trial labels, 9/12 to 12/12 passes, payload comparison and illustrative confirmation rendered correctly. Screenshot capture emitted the already documented npm config warning and exited successfully.

Human confirmation of the Claude app widget after adding the bearer header remains pending. Earlier Lane C confirmation predates authentication. The gateway response policy decision also remains pending; this hosted check does not claim that malformed transport requests or OPTIONS reach application middleware. No merge to main occurred.
