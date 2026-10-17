# Core acceptance notes

Scope is S5 only. Tests use the spec-derived `test/fixtures/trackr-tools.ts`, not the still-unpinned real server source. No network or model calls occur in the core library.

## Example interpretation

All seven fenced JSON examples in `docs/SPEC.md` are loaded by the contract test. Only illustrative placeholders are replaced: `sha256:…` becomes an actual SHA-256 digest, nested `{"...": ...}` becomes the referenced complete audit/patch/tasks object, and placeholder strings inside `candidate_tools` become actual tool objects. Executable schemas reject those placeholders; they never become valid tool definitions. Inline audit, verification, polling and confirmation examples are checked separately.

The large result example explicitly illustrates shape: it shows one task and one trial while totals describe four tasks and 24 trials. The contract schema validates field shapes and local constraints; it does not invent omitted trial records or claim that example is an actual complete run. Trial aggregation and verdict behavior are tested with independently constructed records.

The sample `serverInfo.version`, token counts, pinned model label and source replacement ellipsis remain illustrative strings or numbers, as in the spec. The source generation test uses the complete four-op compact patch, not the truncated source replacement example.

User-authorized provider adjustment: Sonnet 5.5 rejects an explicit temperature. The result config accepts omitted `temperature` and the legacy example's explicit `0`. New runs should omit it and disclose effective model-default sampling; this library never inserts a temperature value.

## Conservative audit choices

The spec gives exact rules for overlap, unconstrained strings, opaque parameters, payload controls, description length and output schema. It does not specify a semantic classifier or fixed severity for each of the other finding kinds. The core flags `unclear_purpose` for absent/blank descriptions, and flags `missing_usage_guidelines` when no use/when/instead/example cue appears. These are deterministic, conservative checks. Severity is fixed by kind in `severityByKind`; the documented F1/F2/F3 severities are retained. Additional independently applicable findings are retained rather than suppressed. The first finding of overlap, unconstrained-string and payload-control kinds receives reserved IDs F1, F2 and F3 on baseline trackr. Those IDs are not reassigned across kinds, so fixing overlap removes F1 instead of giving its ID to a different check. Remaining findings start at F4.

Allowed-value warnings recognize explicit comma-separated clauses introduced by `One of:`, `Allowed values:` or `Valid values:` and compare them with literal array constants in supplied source. Unmatched clauses warn; long descriptions warn rather than fail. This is not natural-language extraction of arbitrary prose.

## Source generation and remaining fidelity check

Identical `include_comments` source lines occur in two tool objects. The generator first resolves the target inside its named object. If a returned find/replace line would be ambiguous globally, it includes the enclosing object as context, so applying each edit sequentially still matches exactly once. It never edits handler or validation files, but hashes every supplied source file.

The unit suite applies all four edits to the fixture, evaluates the resulting Zod shapes, and verifies emitted JSON Schema descriptions. This provides local coverage of JSON escaping, `.optional().describe(...)`, replacement of existing descriptions and field preservation.

**Passed:** S3's real mcp-use server fidelity integration subsequently ran against trackr commit `9489411`, using core-generated edits from its actual source. It started temporary baseline and patched servers, called `tools/list`, and proved the complete emitted metadata equals baseline plus wire ops. The local Zod emission check remains separate from that integration gate. The spec-derived fixture is unchanged; replacement still belongs to Checkpoint 1.

Representative trials exclude infrastructure errors. If infrastructure exclusion leaves an exact pass/fail tie, there is no majority and the representative is null rather than inventing one.

## Actual acceptance output 2026 10 17

`pnpm typecheck` exited 0:

```text
> axlint@0.0.0 typecheck /Users/ransomhorne/Documents/axlint-core
> tsc --noEmit
```

`pnpm test` exited 0 after reviewing the one-parameter-per-line rule and rejecting multiple parameter expressions on one line:

```text
> axlint@0.0.0 test /Users/ransomhorne/Documents/axlint-core
> vitest run

 RUN  v4.1.12 /Users/ransomhorne/Documents/axlint-core

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  13:10:44
   Duration  188ms (transform 37ms, setup 0ms, import 86ms, tests 15ms, environment 0ms)
```

Passing S5 acceptance checks:

- All seven fenced examples validate after explicit placeholder materialization, and inline contract examples validate.
- The t1-route baseline trial's checks, failure and explanation match the spec exactly.
- Wire ops change only description fields. Schema differences including `additionalProperties` and `required` are reported with paths.
- Ordered verdict cases pass: insufficient control data plus gains is Inconclusive; a one-pass non-control drop is Inconclusive; an observed control regression is Regressed.
- Baseline audit includes F1, F2 and F3; the ID lookup has no overlap finding; patched descriptions remove F1.

The live S3 fidelity integration also passed, as recorded below. All six S5 acceptance checks now pass. No new dependencies were required.

## Actual live source fidelity output 2026 10 17

Generated `/tmp/axlint-core-fidelity-patch.json` with the exported `generateSourceEdits` function and the exact compact wire ops, against actual trackr sources without changing the pinned fixture or live source. The patch included four wire ops, four sequential source edits and these received-source hashes:

```text
src/tools.ts sha256:b666a8823e062edb2e3885f85fbe6f9fb1031745a45518365d6018e1571b84f9
src/validation.ts sha256:cf485c948165fd19dba87e85f515c786211eefb5481f6e8bc97d9f83e2eae188
```

From `/Users/ransomhorne/Documents/trackr` at commit `9489411`, `pnpm exec tsx scripts/fidelity.test.ts /private/tmp/axlint-core-fidelity-patch.json` exited 0:

```text
PASS exact wire description: list_issues
PASS exact wire description: search_issues
PASS exact wire description: list_issues.status
EMITTED list_issues.status: {"schema":{"description":"One of: open, in_progress, blocked, closed. open: not started. in_progress: someone is actively working on it. blocked: waiting on something. closed: done.","type":"string"},"required":[]}
PASS exact wire description: list_issues.include_comments
EMITTED list_issues.include_comments: {"schema":{"description":"Include full comment threads, roughly 1 to 2K tokens per issue. Defaults to true. Set false when only titles and status are needed.","type":"boolean"},"required":[]}
PASS source fidelity: real mcp-use tools/list equals baseline plus wire_ops; all non-description metadata unchanged
PASS cleanup: temporary trackr source and server processes removed
```

The first non-escalated tsx patch-generation attempt failed with an IPC `listen EPERM` sandbox restriction; the authorized escalated retry passed. The integration itself passed on its first invocation. It uses temporary copies and removes its server processes; no secrets were printed or copied.
