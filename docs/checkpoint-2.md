# Checkpoint 2 integration — October 17, 2026

Merged origin/lane/runner, origin/lane/tools and origin/lane/viewer into main in that order. All merges were clean; package/lockfile had no conflicts and pnpm install was already up to date. The merged suite initially passed61 tests.

Registered audit_server, propose_patch, verify_patch, get_verification_result and confirm_patch, alongside ping and recorded preview_run. Existing fixed-token middleware protects the entire MCP transport; public health/assets and absent OAuth discovery are preserved.

The real-result MCP App reads retained run files, carries render data in result _meta and preserves the exact structured result contract. New runners save hash-validated baseline/patch/task context to context.json; the self-contained runner payload was rebuilt. The widget polls through the authenticated host bridge, displays real trial results, and refreshes saved confirm checks. Confirmation persistence is auxiliary: the returned gate result remains authoritative if writing view bookkeeping fails. Older runs explicitly label unavailable context instead of inventing it. Preview remains the original recorded S3 run.

Final checks:

```text
pnpm typecheck: exit0
Test Files5 passed; Tests66 passed
pnpm build: ping, preview-run, verification-result (640ms)
PASS production tools/list: all five product tools plus ping and preview_run; bearer required
PASS actual retained Blaxel result: complete24/24, real13,917 tokens, live widget metadata, no fabricated confirmation
PASS public assets: ping; preview-run; verification-result
PASS explicit expired lifecycle status remains available with widget binding
PASS integrated ping: outbound HTTPS200, configured credentials, original Blaxel proof readable after two hours
```

The actual real-result Inspector capture /private/tmp/axlint-live-result.png was visually inspected. It shows the retained E/F run's9/12→12/12 passes, all24 trials/three baseline failures, result115,194→13,917, static651→955, unavailable legacy audit/patch context, and unchecked confirmation. New full-context bootstrap will be exercised by the requested stability runs after the human deployment-branch switch. No stability runs or source applies were performed during registration. The recorded fallback renderer checks also pass. Integration type errors were corrected by retaining generic structured output types and validating imported JSON through core schemas.

S4 follow-up: a fresh process read both original proof files from axlint-spike-1792264922765 at130.38 minutes after completion, status DEPLOYED. This directly proves more than two hours of elapsed persistence for the original proof (separate from the new runner's configured4hTTL/30mmax).

Next ordered steps: revert Trackr's S7 patch by a new commit, verify baseline byte-for-byte and new Railway SHA, then stop for the user's Manufact production-branch switch to main. Only afterward verify hosted seven-tool listing/ping and run the three consecutive propose/verify stability checks. The user runs S8 from Claude Code.
