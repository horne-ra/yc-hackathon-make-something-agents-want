# Platform proof notes

## Current result

Blaxel detached execution and the hosted Manufact platform checks pass. The deployed ping MCP App also renders correctly in the real mcp-use Inspector. Claude Code mounting, the human tool call and actual Claude widget rendering remain pending; those acceptance steps are reserved for the user by the lane brief. No Phase 2 work or lane merge has occurred.

- Live MCP URL: `https://fast-pulse-rlqvb.run.mcp-use.com/mcp`.
- Manufact dashboard: `https://manufact.com/cloud/org-41c8b7a1-w8fak/servers/1df33784-bc1a-4b0a-a539-22c8ed18ab05/overview`.
- Active deployment: `7e0cf84e-a991-4622-90a0-705878711e1b`, status `running`, source commit `84725c2593edf6f1c97beb47f9f4e0a347d20de7` on `lane/platform`.

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

## Remaining human acceptance

The lane brief explicitly reserves mounting and actual Claude client calls for the human:

1. In `/Users/ransomhorne/Documents/trackr`, run `claude mcp add --transport http axlint https://fast-pulse-rlqvb.run.mcp-use.com/mcp`. Syntax was verified against the installed `claude mcp add --help`.
2. Start a fresh Claude Code session, open `/mcp`, and confirm `axlint` is connected.
3. Ask: `Call the axlint ping tool. Show its result and, if this client supports MCP Apps, its platform ping widget.`
4. Record whether the tool succeeds and whether the widget actually renders. Expected result: `pong: all platform checks passed`. If the tool works but Claude does not render the widget, choose the web-page-first viewer path at the checkpoint. Do not report actual Claude rendering from Inspector screenshots.

The proof sandbox expires around 3:22 PM America/Los_Angeles on October 17. If the human check happens after that, start a fresh spike and update the hosted `AXLINT_SPIKE_RUN_ID`; an expired proof run should report its real failure rather than falsely claim connectivity.
