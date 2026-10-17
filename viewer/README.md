# AX Lint viewer and bearer authentication

Lane C completed with user-confirmed Claude app widget rendering and a successful Claude Code ping. Lane G starts from that accepted app on `lane/viewer`. No merge to main is needed for this work.

## Bearer credential

`AXLINT_API_TOKEN` is a random 32-byte base64url credential stored in `/Users/ransomhorne/Documents/axlint-platform/.env` (gitignored). Never copy it into chat, source files, URLs or committed client configuration. The application middleware requires `Authorization: Bearer <token>` on every `/mcp` request, including calls using an existing session. Missing, wrong or malformed credentials return 401 with a clear JSON error and no `WWW-Authenticate` header at the application; missing server configuration also fails closed with 401. Manufact's gateway handles some malformed transport requests and preflights before this middleware; see [the exact hosted behavior below](#auth-acceptance-and-gateway-behavior). The application's public `/health` route returns only `{ "status": "healthy" }`; the hosted gateway adds its own timestamp. Widget JavaScript/CSS stay public and contain no secret or run data.

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

## Fixed-token auth and Claude OAuth detection

A later Claude app report prompted a fresh hosted inspection. The prior application challenge was only `Bearer realm="axlint"`, but the hosted response appended `resource_metadata` pointing at `/.well-known/oauth-protected-resource/mcp`. Normal discovery GETs returned 404, so the response advertised a nonexistent OAuth flow. The metadata addition was not present in the application source.

Version 0.2.1 removes the application challenge header entirely while retaining 401 and a clear instruction to send the Authorization bearer header. OAuth/OpenID well-known discovery paths explicitly return 404. The actual production-listener acceptance check verifies missing/wrong/malformed credentials still fail, valid credentials connect, session reuse cannot bypass authentication, widget assets stay public, and no OAuth header or discovery document is served. Typecheck and build passed. Hosted response verification follows deployment; human Claude app behavior remains unconfirmed until a fresh connector test.

Hosted version 0.2.1 was verified at approximately 1:40 PM Pacific. `/mcp` without a token returns 401 with the clear JSON error and **no WWW-Authenticate header**, so the gateway no longer appends an OAuth metadata URL. All five standard OAuth/OpenID discovery routes above return 404 without challenge headers. The original token still connects, ping passes all platform checks, `preview_run` returns its native MCP App metadata, and both widgets' JavaScript/CSS remain public HTTP 200. The fix is deployed from source commit `25c4b2e`. No token rotation, dependency change or main merge was required. A fresh human Claude app connector test is still pending; this wire check does not claim that Claude's cached connector state changed.

## Human Claude app connection confirmation

On October 17, 2026, the user confirmed the Claude app connects successfully with **No sign-in** and the fixed `Authorization: Bearer <token>` request header. This confirms the authenticated connector connection. This reply did not separately confirm calling ping or rendering the widget after authentication; the earlier Lane C widget rendering confirmation remains recorded separately.

## Human authenticated widget and Claude Code acceptance

On October 17, 2026, the user explicitly confirmed all remaining client checks: the Claude app renders the ping widget with the bearer token; `preview_run` renders the verification viewer; and Claude Code shows axlint connected when opened from the trackr folder. This supersedes the earlier pending human checks. The user authorized further fixture-driven viewer polish on `lane/viewer` without touching `src/core/`, with a 2:15 PM report ahead of the 2:30 PM checkpoint.

## Fixture viewer polish

The viewer now selects an exact numbered baseline/candidate pair when a trial cell is clicked; task-name selection restores the representative pair. Playback hides payload totals until those calls appear, keeps verdict/confirmation pending, and supports Pause/Resume. A paused partial fixture is explicitly labeled. The patch highlights removed words as well as additions. Confirmation renders each gate's actual boolean instead of forcing a pass, and missing representatives show an unavailable message. Trial/tool counts derive from data; the target deployment is visible in the footer. The layout stacks summary values at narrow widths and keeps the trial grid in its own keyboard-focusable scroll region.

`pnpm exec tsx viewer/check-fixture-states.ts` passed on recorded complete/running fixtures: complete has 24 cells and 3 baseline failures; running hides future payload/verdict/confirmation. In-memory QA edge cases passed for all three verdicts, a failed confirmation, and missing representatives. Pending/error rendering checks passed. These QA mutations never replace the hosted recorded data or change benchmark results.

Real Inspector interaction checks passed at complete/768px and running/390px: minimum computed font 16px; no document horizontal overflow; exact trial selection; both diff sides visible; future payload hidden; Pause/Resume; Show all restores 24 trials. Typecheck and production build passed. Initial typecheck caught a nullable representative guard; it was fixed. The first expanded QA command caught a selector quoting mistake; it was corrected. A direct renderer import through the browser-only MCP entry was unsupported, so the presentation component was separated from the host bridge. No dependency, package/lockfile, core-library or recorded-result changes were needed.
