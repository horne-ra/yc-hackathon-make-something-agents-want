# Platform proof notes

## Current result

Blaxel detached execution and the hosted Manufact platform checks pass. The deployed ping MCP App also renders correctly in the real mcp-use Inspector. The user confirmed Claude Code mounting and the deployed ping call succeeded. The user confirmed the MCP App renders in the Claude app, which shows "Widget from AxLint ping". The Claude Code terminal shows text only. Lane C is complete. No Phase 2 work or lane merge has occurred.

- Live MCP URL: `https://fast-pulse-rlqvb.run.mcp-use.com/mcp`.
- Manufact dashboard: `https://manufact.com/cloud/org-41c8b7a1-w8fak/servers/1df33784-bc1a-4b0a-a539-22c8ed18ab05/overview`.
- Lane C acceptance deployment snapshot: `2b8f9bfb-ab47-4aa1-863f-e89dff795802`, status `running`, source commit `75ad22b748beb1461d34b51ef0ee90691f9200d8` on `lane/platform`, server version `0.1.1`.

## Blaxel detached run and retention

Implemented `scripts/blaxel-spike.ts` with `start`, `read <run_id>` and explicit `delete <run_id>`. The sandbox name is the run ID; there is no local run registry. `start` uploads a Node runner and starts it with `waitForCompletion:false`, `keepAlive:true`, `timeout:180`. The runner atomically updates `progress.json` every five seconds for 120 seconds, then writes `result.json`.

Observed October 17, 2026:

```json
{"run_id":"axlint-spike-1792264922765","status":"running","process":"axlint-retention-spike","launch_ms":111,"setup_ms":844,"ttl":"3h"}
```

The launcher exited code 0 immediately after launch. A separate local process reconnected by ID and read running progress (`ticks:2`, `elapsedMs:10013`, no result yet). Another independent process later read both final files:

```json
{"process_status":"completed","exit_code":0,"progress":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"},"result":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"}}
```

The completion timer and last interval share the 120-second boundary, so 23 interval ticks are expected; actual elapsed execution exceeded 120 seconds. `keepAlive:true` is necessary for detached wall-clock execution because ordinary standby freezes processes.

Retention uses a **3-hour max-age TTL from creation**, leaving about 2 hours 58 minutes after this 2-minute job. A later actual control-plane read confirmed `runtime.ttl:"3h"`, `createdAt:"2026-10-17T19:22:02.921422827Z"`, status `DEPLOYED`, and `expiresIn:9738` seconds (more than 2 hours 42 minutes remaining). For a longer runner, set TTL to maximum job duration plus at least 2 hours and a margin. Do not delete on completion. Standby preserves files; TTL or explicit deletion erases them. No volume is needed for this retention window. Actual two-hour elapsed persistence was not waited out; successful independent reads prove process independence, and the accepted lifecycle policy supplies retention.

References: installed `@blaxel/core` 0.3.30 declarations for TTL and `ProcessRequest.keepAlive`, plus [Blaxel sandbox best practices](https://docs.blaxel.ai/Sandboxes/best-practices).

## Manufact implementation and deployment

Read [mcp-use v2 welcome](https://docs.mcp-use.com/v2/typescript/getting-started/welcome), installed the requested `mcp-apps-builder` skill non-interactively, and read its server, Views and verification references. Framework version is mcp-use 2.10.0; CLI version is @mcp-use/cli 4.4.0. Scaffolded exactly with `npx -y create-mcp-use-app@latest axlint-ping-app --template mcp-apps` in `/private/tmp` before bringing only approved server and widget files into the product worktree. The lead supplied root React/build/JSX configuration; widget ownership was explicitly extended to `views/ping/view.tsx` and generated `mcp-env.d.ts`.

`src/server.ts` exposes only `ping` plus an HTTP health route. Ping reads configured secrets but returns only booleans, makes a fixed outbound request to `https://example.com`, and reconnects to `AXLINT_SPIKE_RUN_ID` to read the proof sandbox's progress. No arbitrary target URLs or secret values are returned. Required hosting environment: `ANTHROPIC_API_KEY`, `BL_API_KEY`, `BL_WORKSPACE`, `AXLINT_SPIKE_RUN_ID`.

The existing `.env` Manufact API key passed real `whoami` and organization checks. Device-code attempts were canceled after that authentication succeeded. Existing GitHub App installation for `horne-ra` was active; the repository access API returned `hasAccess:true` for `horne-ra/yc-hackathon-make-something-agents-want`. No extra login or GitHub authorization was needed.

Deployment uses that existing repository's `lane/platform` production branch. Main was not merged or replaced. Build command is `pnpm build`; start command is `pnpm exec mcp-use start --host 0.0.0.0`. API keys were corrected to exact `.env` values and stored as write-only production secrets; metadata listing returns no values. Temporary deploy environment copies were deleted, and the original gitignored `.env` remains.

Auto-deploy watches `src/**`, `views/**`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json` and `mcp-env.d.ts`, so preserving documentation does not interrupt the active deployment. Include any new build inputs in this filter if the application expands later.

## Verification evidence

`pnpm install --frozen-lockfile`, `pnpm typecheck` (including the View), and `pnpm build` passed. Representative final build output: `[mcp-use] built src/server.ts + views (ping) → .mcp-use/build/index.js (458ms)`. The actual cloud Node 22 build also passed; deployment status is `running` with the active ID above.

An official MCP SDK client connected to the actual local production build, verified only `ping` in `tools/list`, called it successfully, and read the MCP App resource. Local listeners were stopped after QA.

The same official MCP SDK connected to the live cloud URL. At `2026-10-17T19:41:17.559Z`, hosted `ping` returned:

```json
{"isError":false,"structuredContent":{"message":"pong: all platform checks passed","checkedAt":"2026-10-17T19:41:17.559Z","https":{"ok":true,"status":"HTTP 200"},"secrets":{"anthropic":true,"blaxel":true,"workspace":true},"sandbox":{"ok":true,"status":"DEPLOYED","runId":"axlint-spike-1792264922765","progress":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"}}}}
```

`tools/list` includes the View metadata `ui://views/ping.html`; `resources/read` returns `text/html;profile=mcp-app`. Actual local and hosted Inspector screenshots were captured and visually inspected after fixing contrast. Hosted screenshot `/private/tmp/axlint-ping-hosted.png` shows all four checks passing with readable text. This validates Inspector rendering and hosted assets/CSP, not Claude rendering. Widget implementation and Inspector proof took under the 30-minute spike limit.

## Errors and warnings encountered

1. First SDK create emitted: `SandboxInstance.create: 'region' is not set. In a future version, 'region' will be a required parameter.` Creation succeeded. Subsequent code sets `BL_REGION` or `us-pdx-1` explicitly.
2. Initial declaration lookup used `dist/esm/types/...` and failed with `No such file or directory`; installed SDK declarations live at `dist/cjs/types/...`.
3. Public web open of the guessed `/Sandboxes/Lifecycle` documentation path failed as inaccessible. Used installed authoritative SDK types and packaged skill instead.
4. A process inventory command failed with `operation not permitted: ps`; no dependency on process inventory remains.
5. Initial direct CLI path `mcp-use/dist/cli.js` failed `MODULE_NOT_FOUND`; installed entry is `mcp-use/dist/bin.js`. Corrected call passed authentication.
6. Adding explicit region initially exposed local variable shadowing: `Block-scoped variable 'process' used before its declaration` and missing `.env` on the process response. Renamed the local response to `job`; `pnpm typecheck` passes.
7. Device-code login attempts produced no output while authorization was pending. Canceled both redundant attempts after API-key authentication passed. No user login action is needed and no credentials were printed.
8. A deliberate read of nonexistent run `axlint-does-not-exist-s4` returned API `{code:404,error:"Sandbox not found"}`. The first generic formatter produced `[object Object]`; corrected both spike and ping error formatting to preserve only the safe code/error fields. Confirmed CLI output `{"status":"failed","error":"404: Sandbox not found"}` and exit 1.
9. Starting the view-bound server before adding its View produced `Tool "ping" is bound to view "ping" which is not in the primed views registry`. Added the approved `views/ping/view.tsx`; the CLI generated `mcp-env.d.ts` from the real server ref.
10. Initial production build before root dependency setup failed `Rolldown failed to resolve import "react/jsx-runtime"`. Cherry-picked the lead's root config commit and installed its direct React dependencies; View typecheck and build then passed.
11. The Inspector screenshot command first returned `client_install_required: @mcp-use/client is required for this command`. Re-ran through an ephemeral `npx -p mcp-use@2.10.0 -p @mcp-use/client@latest` installation, leaving root dependencies unchanged.
12. First real Inspector capture succeeded but visual inspection found inherited black text on a black background. Added explicit dark background and light text, rebuilt, and visually verified both local and hosted screenshots.
13. First deployment validation returned `usage_error: --env-file must be relative.` Moved the minimal environment file into gitignored `.env.platform-deploy` with mode 0600 and retried. No secret values appeared in output or commits.
14. Deployment metadata inspection without selecting an active CLI organization returned `organization_required`; passing `--org` to `deployments get` itself then returned `Unknown option '--org'` (that subcommand does not accept it). Selected the already authorized organization with `mcp-use org use`; subsequent deployment reads work.
15. Pending hosted MCP initialization returned HTTP 404 `{"error":"Not found"}` while builds were provisioning. Gateway `/health` returned 200, but it is the shared gateway and is not proof of the app's readiness. The local mcp-use production server also lacked `/health`, whereas Manufact deployment metadata configures `healthCheckPath:/health`; added a real application health route using the installed `server.get` API before final readiness verification.
16. First hosted `ping` successfully read secret-presence booleans and made outbound HTTPS (`HTTP 200`) but sandbox access failed `401: Unauthorized`. This was an integration mistake, not an invalid user credential: the mcp-use CLI's `--env-file` parser copies everything after `=` literally, including JSON quote characters. Replaced quoted values with exact `.env` values through the CLI's structured API implementation, stored both API keys as write-only secrets, and redeployed unchanged source. Future deploy env files use raw `KEY=VALUE` lines, never JSON-quoted values.
17. A one-line local log-tail formatter had an extra closing brace and failed `SyntaxError: Unexpected token '}'`; corrected the formatter and read the real build logs successfully. The application build itself passed.
18. The first process-cleanup helper exited 143 after terminating the two pending device-login children; a second targeted inventory/cleanup completed with `remainingDeviceLoginsCanceled:0`. No pending device login remains.
19. Runtime logged `listen() is serving on 0.0.0.0 without Host validation`. The framework explicitly identifies this as expected behind a platform edge that only routes the server's domains; Manufact supplies that edge. No direct listener was exposed by this spike.

## Human Claude Code acceptance and widget follow-up

On October 17 the user confirmed that Claude Code successfully called deployed ping and received `pong: all platform checks passed`: outbound HTTPS 200; Anthropic, Blaxel and workspace secrets set; sandbox DEPLOYED; original run axlint-spike-1792264922765 completed 23 ticks in about 120 seconds. This satisfies the remaining S4 Claude Code tool-call acceptance. At this initial check the user saw plain JSON and no displayed widget in the Claude Code terminal; Claude app rendering had not yet been tested. The subsequent Claude app confirmation is recorded below.

A direct official SDK wire check at 12:54 PM Pacific found the existing deployment already declared `ui://views/ping.html` in both `tools/list._meta.ui.resourceUri` and `tools/call._meta.ui.resourceUri` (plus legacy `ui/resourceUri`). `resources/list` advertised `text/html;profile=mcp-app`, and `resources/read` returned the real 1,259-character HTML shell with same-origin CSP metadata. Plain JSON in the Claude Code display did not establish that the UI resource was undeclared.

Version 0.1.1 keeps the native mcp-use View binding, outputSchema and structuredContent, changes model-readable text to a concise status message, and adds an explicit `resource_link` content block for the same MCP App HTML resource on successful calls. The framework still stamps the native result metadata. Error calls do not advertise a successful widget. This makes the UI reference directly inspectable in result content as well as metadata. Local production typecheck and build passed (442 ms build). A real MCP integration check passed at 12:55:58 PM Pacific for server version 0.1.1: native tool/result UI metadata, explicit resource link, readable MCP App HTML, HTTP 200 for widget JavaScript and CSS, and all platform checks. Redeployment and the hosted wire check passed at 12:58:32 PM Pacific. At that stage only Inspector rendering had been checked; the subsequent user-confirmed Claude app rendering is recorded below.

## Reconfirmed independent Blaxel reads

The original launcher exited successfully after starting the detached process. A fresh process run during this follow-up invoked `pnpm exec tsx scripts/blaxel-spike.ts read axlint-spike-1792264922765`; it found the sandbox by ID and read both final files without the original launcher or local state:

```json
{"run_id":"axlint-spike-1792264922765","process_status":"completed","exit_code":0,"progress":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"},"result":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"}}
```

A second fresh process at 12:54:56 PM Pacific read both files again, 30.87 minutes after completion, and observed status DEPLOYED and `expiresIn:8826` seconds. The accepted three-hour TTL expires around 3:22:02 PM Pacific on October 17. For the observed completion at 12:24:03 PM, the sandbox and files are configured to survive about 2 hours 58 minutes after completion, exceeding the required two hours. These fresh reads directly demonstrate launcher independence and approximately 31 minutes of elapsed persistence; a full two-hour wall-clock read has not yet been performed. Files survive standby and are erased on TTL expiry or explicit deletion. Longer jobs must reserve at least two hours after their maximum duration, with a margin.

The user subsequently tested rendering in the Claude app and confirmed success, as recorded below. The proof sandbox expires around 3:22 PM Pacific; after expiry, start a new spike and update the hosted AXLINT_SPIKE_RUN_ID rather than claiming stale connectivity.

## Hosted widget follow-up acceptance

The follow-up began at 12:53:41 PM Pacific. Version 0.1.1 was verified live at 12:58:32 PM, within five minutes. Manufact reports deployment 2b8f9bfb-ab47-4aa1-863f-e89dff795802 running from source commit 75ad22b748beb1461d34b51ef0ee90691f9200d8. No new project, merge, dependency or Phase 2 work was needed.

The real hosted call returned the following content, in addition to matching structuredContent and native `_meta.ui.resourceUri` metadata:

```json
[{"type":"text","text":"pong: all platform checks passed"},{"type":"resource_link","uri":"ui://views/ping.html","name":"AX Lint platform ping","description":"Interactive platform connectivity widget","mimeType":"text/html;profile=mcp-app"}]
```

Actual integration-check output:

```text
PASS ping0.1.1: tool and result UI metadata, explicit resource link, readable MCP App HTML, all platform checks
PASS expected failure: real sandbox404 preserved; no success-widget link or UI metadata
```

Hosted `resources/read` returned the 1,259-character MCP App HTML shell. Both the widget JavaScript and CSS returned HTTP 200. Outbound HTTPS, all three secret-presence flags and the original Blaxel run still passed. The actual hosted screenshot at `/private/tmp/axlint-ping-explicit-widget.png` was visually inspected: the widget is readable and shows all four platform checks passing. This is Inspector evidence, not a claim about Claude app rendering. Typecheck, production build and git diff checks passed. The two temporary local listeners used for successful/error-path verification were stopped.

## Claude app confirmation and Lane C completion

On October 17, 2026, the user confirmed the Claude app shows "Widget from AxLint ping" and renders the deployed MCP App widget. The MCP App renders in the Claude app; the Claude Code terminal shows text only. This is direct human confirmation in Claude, separate from the earlier Inspector screenshots.

The Claude Code ping call, Blaxel detached-run and independent-file-read checks, hosted platform checks, and Claude app widget rendering are complete. Lane C is done and stopped at the user's request. No merge or Phase 2 work is authorized by this confirmation.

## Lane G follow-up

The subsequently authorized bearer authentication and fixture MCP App viewer are on `lane/viewer`. Hosted auth and viewer checks passed on October 17; see [viewer acceptance and client configuration](../viewer/README.md). The Lane C deployment identifiers above describe its accepted snapshot. Claude app rendering with the new bearer header and the gateway response policy decision are still pending.

The user subsequently confirmed successful Claude app connection using No sign-in plus the Authorization bearer header. This confirms authenticated connector connectivity; a new widget-rendering observation after authentication was not included in that reply. See the Lane G acceptance report for the deployed version 0.2.1 auth correction and wire checks.

The user then explicitly confirmed authenticated ping-widget rendering and `preview_run` viewer rendering in the Claude app, plus axlint connected in Claude Code from the trackr folder. Authenticated client rendering and connectivity acceptance are complete. Further authorized work is fixture-driven viewer polish on `lane/viewer`; `src/core/` remains outside that work.

## Empirical two-hour retention follow-up

During Checkpoint2 integration on October17, a fresh independent process found axlint-spike-1792264922765 by ID and read both progress.json and result.json at130.38 minutes after completion, with sandbox status DEPLOYED. The original launcher was long gone. This closes the earlier full two-hour elapsed-read gap; the configured three-hour creation TTL remains unchanged.

## Shared runner pool (ordered follow-up C, October 17)

The default verifier now uses a long-lived shared sandbox discovered by `axlint_role=shared-runner`, with `axlint_pool=1` (a secondary is created only when the primary's atomic reservation reports full). `AXLINT_MAX_CONCURRENT_RUNS` defaults to 4 per sandbox. There are at most two shared pools. Fresh pools have at least 1024 MB; the default four-process budget is 256 MB per run. Sandbox TTL is cleared: lifecycle retention is now per run directory, not VM lifetime.

At the existing 10/10 quota, the completed milestone sandbox `axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d` was safely reused under that label. Its existing `/app/axlint-run/` files were preserved. No VM was deleted or resized, no young per-run sandbox was retired, and no additional slot was required. Shared pools are protected from the legacy part-A cleanup. Legacy per-run sandboxes otherwise retain their old TTL and part-A retirement rules.

New opaque IDs have format `axlint-v2.<base64url sandbox name>.<UUID>` and resolve without local server state. Each process has `/runs/<run_id>/input.json`, its own runner payload and context/progress/result files, plus a small lifecycle lease. A filesystem-exclusive allocator lock coordinates callers across server processes and limits queued/running leases. The worker records terminal completion; a dead worker can be recognized as failed without discarding partial progress. Pre-launch upload failures become terminal leases, while ambiguous launches remain protected. The allocator sweeps only complete/failed directories more than **2h15m after completion**, never queued/running or young directories. It runs at pool initialization and on every verify_patch allocation.

**If a shared sandbox is lost, its run files are gone.** `get_verification_result` reports `run_unavailable` for an unreachable shared sandbox, and `run_expired` for a missing run directory. New verifications create a replacement pool if necessary. There is no independent durable object store in this design. The recorded S8 fallback remains committed in the repository. Old-format IDs still resolve to their original directory while their sandboxes exist. confirm_patch and the MCP App viewer use the same new/legacy resolver. Setting `AXLINT_RUNNER_MODE=per-run` retains the part-A launch fallback.

C began at 22:49 UTC with a one-hour limit. First, two local acceptance harness startups failed before any verification launch because the source entry had not primed MCP App views. Both failure records are retained under `scripts/results/shared-runner-2026-10-17T22-55-19.700Z/` and `...22-56-02.827Z/`. Loading the production build entry corrected the harness.

The first real pair then completed in one sandbox: both Improved, 9/12 → 12/12, 24 schema-valid trials each. The actual AX Lint OS process was killed while a verification process was running, then a new AX Lint PID polled the same IDs successfully. Its warm launch was 1474.6 ms. Replacing the allocator's coarse synchronous wait with direct process polling produced a second complete pair; all four runs and every failed baseline trial are preserved, not substituted.

Final pair evidence: `scripts/results/shared-runner-2026-10-17T22-57-44.693Z/`.

```text
Typecheck PASS; full suite 12 files / 130 tests PASS; production build PASS
Launch 1 1082.6 ms; warm launch 2 928.4 ms
RUN 1 COMPLETE: Improved; 9/12 → 12/12; 24 schema-valid trials
RUN 2 COMPLETE: Improved; 9/12 → 12/12; 24 schema-valid trials
PASS AX Lint killed mid-run and restarted with a different PID; independent Blaxel work preserved
PASS same sandbox, distinct run directories and process names
PASS missing run directory: run_expired
PASS unapplied new-format run confirmation: revision_mismatch (correct; no patch applied)
Workspace: 10 sandboxes, 1 shared pool, 0 free VM slots
Trackr: trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96
Tools hash: sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5
```

The 928.4 ms observed warm launch is within the previous hosted range, 894.4–997.1 ms (mean 949.8 ms), from docs/stability-results.md. This is one launch measurement, not a statistical speed claim. The first final-pair launch exceeded one second; warm launch met the earlier S6 target. Real VM loss was not induced because that would destroy recent runs; recreation and status behavior are unit-tested. Hosted deployment and Claude/native widget evidence are recorded next when complete.

At 23:04:44 UTC, Manufact confirmed main application commit `64e458d3639318aaa901a16549af08500b7dbb43` active/running, pipeline complete, deployment `fd64027c-d083-4eb0-8405-1e676f28a43b`. `scripts/check-shared-hosted.ts` then passed: new-format complete result, 24 schema-valid trials, live viewer data, native UI resource, readable MCP App HTML, and the old milestone result with its saved confirmation. The hosted fallback/auth/public-assets check also passed (`scripts/results/s8-fallback-hosted-output.txt`).

The hosted new-format run was captured with the official mcp-use screenshot renderer at `/private/tmp/axlint-shared-run.png` and visually inspected: Improved, 9/12 → 12/12, 24 trials, 115,194 → 13,917 tokens, static 651 → 903, and confirmation correctly not checked. A Claude app retest was requested using run `axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.542700b5-5900-4a3f-a584-b6d1344a35e0`; human confirmation is pending. C technical acceptance finished within the one-hour limit. No recent sandbox was deleted.

## Claude app confirmation for new-format shared runs

On October 17 the user answered “Renders correctly” to the shared-runner get_verification_result widget check for run ending 542700b5-5900-4a3f-a584-b6d1344a35e0: Improved, 9/12 → 12/12, 24 trials. This closes the manual rendering acceptance. The subsequent explicitly authorized one-time historical cleanup deleted nine legacy VMs only after exact export/hash and terminal-process checks, leaving this shared runner and its results intact; see one-time-capacity-cleanup.md. Future retention is unchanged.
