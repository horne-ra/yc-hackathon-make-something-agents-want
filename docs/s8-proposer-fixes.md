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

## Final production confirmation

Final application commit `9290c3c3eb7594c29d91c85458740e39c3907b61` on `main` is active in Manufact deployment `bd0b2d47-151f-4aa2-9340-d5f147ddea2f`: status **running**, pipeline **complete**, confirmed 2026-10-17T22:42:16.016Z. A separate hosted check then passed at 22:42:47 UTC, again returning `capacity_exhausted` with `isError:true`, preserving the original Regressed run, and exposing the complete-source proposer metadata. Evidence: `scripts/results/s8-final-deployment.json` and `scripts/results/s8-final-hosted-capacity.json`. Free slots remained **0 of 10**. No sandbox was deleted and neither Trackr nor Railway was accessed. The 256 MB VM execution check and both requested C verification verdicts remain blocked by capacity and the active-S8 restriction.

## Ordered follow-up D: real verification completed

Provisional: 3 trials per condition. This section supersedes the earlier active-S8/capacity blocks. D began at 23:07 UTC and completed at 23:09 UTC on October 17, within its 45-minute time box. The source files used by the harness were checked byte-for-byte against the current baseline Trackr files: all three matched. No patch was applied, and Trackr was not redeployed during these checks.

Both cases used the same four frozen tasks, prompts, matchers and three trials per condition, AXLINT_MODEL=claude-sonnet-5-5, provider default sampling, with no temperature parameter. The second verification was launched only after the first completed. Both ran in isolated directories in the same shared sandbox. Each proposer accepted its first attempt; all proposal attempts, warnings, polling responses and final trials are saved.

| Case | Verdict | Passes | Returned tokens | Static tokens | Warnings |
| --- | --- | --- | --- | --- | --- |
| top-three-full-source | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 941 | 1 |
| all-findings-tools-only | Regressed | 9/12 → 6/12 | 115,194 → 59,010 | 651 → 968 | 9 |

The full-source case used F1–F3 and tools, validation and handlers. t3-payload improved from 0/3 to 3/3; other tasks stayed 3/3. The tools-only case used all 20 findings: t2-status regressed from 3/3 to 0/3, with `status: "In Progress"` in every candidate trial; t3-payload remained 0/3 because all candidate calls omitted include_comments=false. Routing and control stayed 3/3. Its lower returned-token total includes rejected status calls and is not evidence of a successful optimization. Every condition was consistent on pass/fail across its three trials; neither run had infrastructure errors.

The tools-only proposal omitted the unverified status enumeration and runtime comment default and returned nine explicit warnings. Those warnings do not establish safety; verification still rejected this patch. No task, prompt, scorer or baseline was changed to obtain either result. The original harmful attempt remains preserved separately.

### Per-task results

| Case | Task | Baseline | Candidate | Consistent within each condition |
| --- | --- | --- | --- | --- |
| top-three-full-source | t1-route | 3/3 | 3/3 | yes |
| top-three-full-source | t2-status | 3/3 | 3/3 | yes |
| top-three-full-source | t3-payload | 0/3 | 3/3 | yes |
| top-three-full-source | t4-control | 3/3 | 3/3 | yes |
| all-findings-tools-only | t1-route | 3/3 | 3/3 | yes |
| all-findings-tools-only | t2-status | 3/3 | 0/3 | yes |
| all-findings-tools-only | t3-payload | 0/3 | 0/3 | yes |
| all-findings-tools-only | t4-control | 3/3 | 3/3 | yes |

### All 48 observed trials

| Case | Task | Condition | Trial | Tool | Arguments | Result | Result tokens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| top-three-full-source | t1-route | baseline | 1 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| top-three-full-source | t1-route | baseline | 2 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| top-three-full-source | t1-route | baseline | 3 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| top-three-full-source | t1-route | candidate | 1 | search_issues | `{"include_comments":false,"query":"checkout page"}` | pass | 344 |
| top-three-full-source | t1-route | candidate | 2 | search_issues | `{"include_comments":false,"query":"checkout page"}` | pass | 344 |
| top-three-full-source | t1-route | candidate | 3 | search_issues | `{"include_comments":false,"query":"checkout page"}` | pass | 344 |
| top-three-full-source | t2-status | baseline | 1 | list_issues | `{"status":"in_progress"}` | pass | 18,770 |
| top-three-full-source | t2-status | baseline | 2 | list_issues | `{"status":"in_progress"}` | pass | 18,770 |
| top-three-full-source | t2-status | baseline | 3 | list_issues | `{"status":"in_progress"}` | pass | 18,770 |
| top-three-full-source | t2-status | candidate | 1 | list_issues | `{"include_comments":false,"status":"in_progress"}` | pass | 989 |
| top-three-full-source | t2-status | candidate | 2 | list_issues | `{"include_comments":false,"status":"in_progress"}` | pass | 989 |
| top-three-full-source | t2-status | candidate | 3 | list_issues | `{"include_comments":false,"status":"in_progress"}` | pass | 989 |
| top-three-full-source | t3-payload | baseline | 1 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| top-three-full-source | t3-payload | baseline | 2 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| top-three-full-source | t3-payload | baseline | 3 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| top-three-full-source | t3-payload | candidate | 1 | list_issues | `{"assignee":"maria","include_comments":false,"status":"open"}` | pass | 441 |
| top-three-full-source | t3-payload | candidate | 2 | list_issues | `{"assignee":"maria","include_comments":false,"status":"open"}` | pass | 441 |
| top-three-full-source | t3-payload | candidate | 3 | list_issues | `{"assignee":"maria","include_comments":false,"status":"open"}` | pass | 441 |
| top-three-full-source | t4-control | baseline | 1 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| top-three-full-source | t4-control | baseline | 2 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| top-three-full-source | t4-control | baseline | 3 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| top-three-full-source | t4-control | candidate | 1 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| top-three-full-source | t4-control | candidate | 2 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| top-three-full-source | t4-control | candidate | 3 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| all-findings-tools-only | t1-route | baseline | 1 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| all-findings-tools-only | t1-route | baseline | 2 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| all-findings-tools-only | t1-route | baseline | 3 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| all-findings-tools-only | t1-route | candidate | 1 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| all-findings-tools-only | t1-route | candidate | 2 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| all-findings-tools-only | t1-route | candidate | 3 | search_issues | `{"query":"checkout page"}` | pass | 6,570 |
| all-findings-tools-only | t2-status | baseline | 1 | list_issues | `{"status":"in_progress"}` | pass | 18,770 |
| all-findings-tools-only | t2-status | baseline | 2 | list_issues | `{"status":"in_progress"}` | pass | 18,770 |
| all-findings-tools-only | t2-status | baseline | 3 | list_issues | `{"status":"in_progress"}` | pass | 18,770 |
| all-findings-tools-only | t2-status | candidate | 1 | list_issues | `{"status":"In Progress"}` | FAIL | 42 |
| all-findings-tools-only | t2-status | candidate | 2 | list_issues | `{"status":"In Progress"}` | FAIL | 42 |
| all-findings-tools-only | t2-status | candidate | 3 | list_issues | `{"status":"In Progress"}` | FAIL | 42 |
| all-findings-tools-only | t3-payload | baseline | 1 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| all-findings-tools-only | t3-payload | baseline | 2 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| all-findings-tools-only | t3-payload | baseline | 3 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| all-findings-tools-only | t3-payload | candidate | 1 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| all-findings-tools-only | t3-payload | candidate | 2 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| all-findings-tools-only | t3-payload | candidate | 3 | list_issues | `{"assignee":"maria","status":"open"}` | FAIL | 10,408 |
| all-findings-tools-only | t4-control | baseline | 1 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| all-findings-tools-only | t4-control | baseline | 2 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| all-findings-tools-only | t4-control | baseline | 3 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| all-findings-tools-only | t4-control | candidate | 1 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| all-findings-tools-only | t4-control | candidate | 2 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |
| all-findings-tools-only | t4-control | candidate | 3 | get_issue | `{"id":"TRK-117"}` | pass | 2,650 |

### Saved evidence and real check output

- `scripts/results/s8-proposer-2026-10-17T23-07-22.577Z/`: complete proposals, attempts, warnings, launch IDs and polling responses for both cases.
- `scripts/results/blaxel-export-2026-10-17T23-08-30.579Z/` and `...23-08-31.709Z/`: both complete context.json/progress.json/result.json exports, six files saved, none missing.
- `scripts/results/ordered-follow-up-final-check.json`: independent deployed-tool reads of both results, unchanged baseline identity, proposer metadata, persisted new-format confirmation and workspace count.

```text
PASS hosted proposer tool and parameter descriptions match complete-source and severity guidance
PASS hosted retained top-three-full-source: improved, 9/12 → 12/12, 24 trials
PASS hosted retained all-findings-tools-only: regressed, 9/12 → 6/12, 24 trials
PASS new-format confirmation persisted in its isolated directory
PASS Trackr baseline unchanged; version ad88596baf761ec9b44abd019d3e8a90f84ceb96
Typecheck PASS; full test suite 12 files / 130 tests PASS
Workspace: 10 sandboxes, 0 free VM slots, 1 shared pool
```

The exact before/after tool description is recorded at the start of this document. It is now independently checked against production tools/list; parameter guidance and behavior/source-claim tests pass. No new dependency was needed.
