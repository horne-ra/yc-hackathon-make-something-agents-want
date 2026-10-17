# Platform proof notes

## Blaxel

Implemented `scripts/blaxel-spike.ts` with `start`, `read <run_id>` and explicit `delete <run_id>` commands. The sandbox name is the run ID; no local run registry is needed. `start` uploads a Node runner and starts it with `waitForCompletion:false`, `keepAlive:true`, `timeout:180`. The runner atomically updates `progress.json` every five seconds for 120 seconds, then writes `result.json`.

Observed on October 17, 2026:

```json
{"run_id":"axlint-spike-1792264922765","status":"running","process":"axlint-retention-spike","launch_ms":111,"setup_ms":844,"ttl":"3h"}
```

The launcher process exited with code 0. A separate `tsx ... read` process then reconnected by ID:

```json
{"process_status":"running","progress":{"status":"running","ticks":2,"elapsedMs":10013},"result":null}
```

A later independent process, after the original launcher had exited, read both files:

```json
{"process_status":"completed","exit_code":0,"progress":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"},"result":{"status":"complete","ticks":23,"elapsedMs":120008,"startedAt":"2026-10-17T19:22:03.707Z","completedAt":"2026-10-17T19:24:03.715Z"}}
```

The last interval and completion timer share the 120-second boundary, so 23 interval ticks are expected; actual elapsed execution exceeded 120 seconds. Detached wall-clock progress requires `keepAlive:true`: ordinary sandbox standby freezes processes.

Retention is configured with a **3-hour max-age TTL from creation**, not from completion. For this 2-minute job that leaves about 2 hours 58 minutes to retrieve results, and cleanup happens automatically afterward. For a longer verification run, set TTL to maximum runner duration plus at least 2 hours and a margin. Do not explicitly delete on completion. Standby preserves files; TTL deletion or manual deletion erases them. No volume is needed for this retention window. Actual two-hour elapsed persistence has not yet been waited out; the successful independent reads prove process independence, while the configured API TTL supplies the retention policy.

References: installed `@blaxel/core` 0.3.30 declarations (`SandboxCreateConfiguration.ttl`, `ProcessRequest.keepAlive`, max-age TTL documentation), [Blaxel sandbox best practices](https://docs.blaxel.ai/Sandboxes/best-practices).

## Manufact

Read [mcp-use v2 welcome](https://docs.mcp-use.com/v2/typescript/getting-started/welcome), then installed the requested `mcp-apps-builder` skill non-interactively and read its server, Views and verification references. Installed server framework is mcp-use 2.10.0; CLI is @mcp-use/cli 4.4.0.

Scaffolded exactly with `npx -y create-mcp-use-app@latest axlint-ping-app --template mcp-apps` in `/private/tmp`. The product server follows that scaffold's default export and exported tool-ref API.

`src/server.ts` exposes only `ping`. It reads configured secrets but returns only booleans, performs a fixed outbound HTTPS request to `https://example.com`, and reconnects to `AXLINT_SPIKE_RUN_ID` to read the proof sandbox's progress. No arbitrary target URLs or secret values are returned. Set `ANTHROPIC_API_KEY`, `BL_API_KEY`, `BL_WORKSPACE` and `AXLINT_SPIKE_RUN_ID` in the hosting environment.

The existing `.env` Manufact API key passed a real `whoami --json` call. The supplied device login was attempted; it has produced no result yet (likely authorization pending). Existing API-key authentication lets independent build work continue. CLI deployment supports `--branch lane/platform`, enabling the existing GitHub origin without a merge to main.

Claude Code mount/call, hosted outbound connectivity, hosted secret reads, hosted Blaxel reconnect and widget rendering remain pending deployment and actual client checks. No Claude rendering claim has been made.

## Errors and warnings encountered

1. First SDK create emitted: `SandboxInstance.create: 'region' is not set. In a future version, 'region' will be a required parameter.` Creation succeeded. Subsequent code sets `BL_REGION` or `us-pdx-1` explicitly.
2. Initial declaration lookup used `dist/esm/types/...` and failed with `No such file or directory`; installed SDK declarations live at `dist/cjs/types/...`.
3. Public web open of the guessed `/Sandboxes/Lifecycle` documentation path failed as inaccessible. Used installed authoritative SDK types and packaged skill instead.
4. A process inventory command failed with `operation not permitted: ps`; no dependency on process inventory remains.
5. Initial direct CLI path `mcp-use/dist/cli.js` failed `MODULE_NOT_FOUND`; installed entry is `mcp-use/dist/bin.js`. Corrected call passed authentication.
6. Adding explicit region initially exposed local variable shadowing: `Block-scoped variable 'process' used before its declaration` and missing `.env` on the process response. Renamed the local response to `job`; `pnpm typecheck` passes.
7. Device-code login remains pending without output. No secrets or credential-bearing HTTP objects were printed.
8. A deliberate read of nonexistent run `axlint-does-not-exist-s4` returned API `{code:404,error:"Sandbox not found"}`. The first generic formatter produced `[object Object]`; corrected both spike and ping error formatting to preserve only the safe code/error fields. Confirmed CLI output `{"status":"failed","error":"404: Sandbox not found"}` and exit 1.
9. Starting the view-bound server before adding its View produced `Tool "ping" is bound to view "ping" which is not in the primed views registry`. Added the approved `views/ping/view.tsx`; the CLI generated `mcp-env.d.ts` from the real server ref.
10. Initial real production build before root dependency setup failed `Rolldown failed to resolve import "react/jsx-runtime"`. Required direct React/React DOM dependencies and JSX typecheck configuration have been requested from the lead (root config is owned by Step 0).

The Manufact organization was verified as `Ax Lint`, slug `org-41c8b7a1-w8fak`. Existing active GitHub App installation for `horne-ra` was found; a repository-specific API access check returned `{"hasAccess":true}` for `horne-ra/yc-hackathon-make-something-agents-want`. No extra GitHub authorization is currently required. Server list was empty, so this creates the first deployment rather than replacing another server.

## Local production verification

After cherry-picking the lead's root setup commit, `pnpm install --frozen-lockfile`, `pnpm typecheck` (including the View) and `pnpm build` passed. Build output: `[mcp-use] built src/server.ts + views (ping) → .mcp-use/build/index.js (450ms)`.

Started the actual production build on port 3007 and connected with the official MCP SDK HTTP client. `tools/list` returned only `ping` with `ui://views/ping.html`; `resources/list` advertised `text/html;profile=mcp-app`. `tools/call ping {}` returned structured content `pong: all platform checks passed`, outbound `HTTP 200`, all three secret-presence booleans true, sandbox `DEPLOYED`, and the real completed 120008ms progress document. This local proof does not substitute for the hosted proof or Claude rendering.
11. The Inspector screenshot command first returned `client_install_required: @mcp-use/client is required for this command`. Re-ran through an ephemeral `npx -p mcp-use@2.10.0 -p @mcp-use/client@latest` installation, leaving root dependencies unchanged.
12. Real Inspector capture succeeded but visual inspection found inherited black text on a black background. Added explicit dark background and light text, then typechecked and rebuilt successfully; repeating capture against the rebuilt production entry.
13. First deployment validation returned `usage_error: --env-file must be relative.` Moved the minimal environment file into gitignored `.env.platform-deploy` with mode 0600 and retried. No secret values appeared in output or commits.

## Cloud deployment

Created Manufact server `1df33784-bc1a-4b0a-a539-22c8ed18ab05` from the existing GitHub repository's `lane/platform` branch. Its production branch is explicitly `lane/platform`; main has not been merged or replaced. Build command is `pnpm build`; start command is `pnpm exec mcp-use start --host 0.0.0.0`. Initial deployment ID is `ae8080dc-90ad-4e7f-ba7a-93c8c19b48fd`.

- Assigned MCP URL: `https://fast-pulse-rlqvb.run.mcp-use.com/mcp` (hosted checks pending).
- Manufact dashboard: `https://manufact.com/cloud/org-41c8b7a1-w8fak/servers/1df33784-bc1a-4b0a-a539-22c8ed18ab05/overview`.
14. Deployment metadata inspection without selecting an active CLI organization returned `organization_required`; passing `--org` to `deployments get` itself then returned `Unknown option '--org'` (that subcommand does not accept it). Selected the already authorized organization with `mcp-use org use`; subsequent deployment reads work.
15. Pending hosted MCP initialization returned HTTP 404 `{"error":"Not found"}` while builds were provisioning. Gateway `/health` returned 200, but it is the shared gateway and is not proof of the app's readiness. The local mcp-use production server also lacked `/health`, whereas Manufact deployment metadata configures `healthCheckPath:/health`; added a real application health route using the installed `server.get` API before final readiness verification.

Canceled the two redundant pending device-code login children after API-key authentication succeeded, and verified no pending device-login process remains. No user login action is needed. Actual Inspector screenshot of the rebuilt high-contrast widget is readable and shows all four checks passing. Claude rendering remains unverified.
