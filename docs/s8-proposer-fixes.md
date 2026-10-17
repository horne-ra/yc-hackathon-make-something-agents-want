# S8 proposer repair (C)

C time box started October 17, 2026 at 22:25 UTC (3:25 PM Pacific), after the A code and evidence were pushed. A redeployment was confirmed running before C was pushed.

## Tool description, before and after

Before:

> Propose validated description-only metadata operations and deterministic Trackr source edits without writing files. Requires a fresh live audit and provided source.

After:

> Propose validated description-only metadata improvements and deterministic source edits without writing files. Include every file defining accepted values or defaults, including validation constants, enums and handlers. Start with the highest-severity findings. Omit unknown facts from descriptions; return missing source facts as warnings. Requires a fresh audit.

The `source_files` parameter now explicitly requests tool declarations, validation constants, enums and handlers, and names all three Trackr files. `finding_ids` asks callers to start with the highest severity and a focused first verification. The selected findings in the proposal prompt are ordered by severity; caller-selected findings are preserved.

## Behavior and validation

Unknown facts must be omitted from descriptions. Missing facts are returned separately as `missing_allowed_values` and `missing_default` warnings. Common source-absence hedges, inferred unrestricted values, unsupported or conflicting literal defaults, unverified side-effect guarantees, and unverified explicit allowed-value lists cause validation rejection and the existing one corrective retry. Both rejected and accepted attempts remain observable. A second invalid attempt fails clearly.

Source checks recognize Trackr's literal validation arrays, inline Zod enums/defaults and handler nullish/destructuring defaults. Unresolved expressions produce warnings. This is conservative source checking; verification still determines behavior. The only shared contract change adds the two warning codes; frozen results, tasks, scoring, provider sampling and baseline metadata are unchanged.

## Checks

- `pnpm typecheck`: passed.
- `pnpm test`: 9 test files passed, 108 tests passed.
- `pnpm build`: built server and all three views.
- `pnpm exec tsx scripts/s8-proposer-checks.ts`: plan only, no network calls.
- Original attempt: **Regressed, 9/12 → 6/12**, preserved in [s8-attempt-1.md](s8-attempt-1.md).

## Requested sequential verification cases

| Case | Source files | New verification verdict |
| --- | --- | --- |
| Top three findings | src/tools.ts, src/validation.ts, src/handlers.ts | Not run: S8 remains active; workspace has no free slot |
| All findings, attempt-1 setup | src/tools.ts | Not run: S8 remains active; workspace has no free slot |

The script defaults to a safe plan. `--proposals-only` may exercise the real proposer with committed source and recorded metadata while allowing network access only to Anthropic; it cannot contact Trackr. Those are proposal checks and cannot establish verification verdicts. `--after-s8` is prepared for use only after the user lifts the S8 restriction; it confirms the frozen baseline hash, performs each full check sequentially, retains failures and never modifies or deploys Trackr.

## Real sequential proposer checks (no target access)

Final evidence: `scripts/results/s8-proposer-2026-10-17T22-34-19.884Z/`. Both used `claude-sonnet-5-5`, provider default sampling, and the unchanged committed source and recorded audit. An enforced network allowlist permitted Anthropic only.

| Case | Proposer attempts | Accepted operations | Warnings | Static tokens | Verification verdict |
| --- | --- | --- | --- | --- | --- |
| Top three, full source | rejected, accepted | 4 | 1 | 651 → 869 | Not run / blocked |
| All findings, tools only | accepted | 10 | 9 | 651 → 955 | Not run / blocked |

The full-source case's first attempt included an unverified read-only guarantee; it was rejected and the corrective attempt removed it. The rejection and both proposed operation sets are preserved. Its accepted status description states the four verified values, and its include_comments description states `Defaults to true; set false` for smaller summaries. The tools-only case omitted status values and the runtime comment default, with explicit warnings for the missing source facts.

An earlier proposer snapshot is also retained in `scripts/results/s8-proposer-2026-10-17T22-32-41.398Z/`. Neither snapshot is a new verification run or a replacement for frozen benchmark results. The two requested verification verdicts are still unavailable while S8 remains active and Blaxel is at 10/10. A workspace quota of at least 12, with Manufact `AXLINT_SANDBOX_CAPACITY` matching it, would accommodate both retained checks once S8 access is permitted.

Hosted metadata verification passed at 22:38:27 UTC: the tool and source_files guidance were visible through the authenticated production tools/list. The original Regressed run remained readable after redeployment. See `scripts/results/s8-hosted-capacity.json`. The two new verification cases remain blocked, not scored.
