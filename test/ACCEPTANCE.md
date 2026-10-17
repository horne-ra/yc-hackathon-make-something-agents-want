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

**Skipped:** S3's real mcp-use server fidelity integration. That test must apply the generator's edits to the pinned real trackr source, start the actual server and call `tools/list`. The local Zod emission check does not satisfy that integration gate. Fixture replacement belongs to Checkpoint 1, as required by the lane instructions.

Representative trials exclude infrastructure errors. If infrastructure exclusion leaves an exact pass/fail tie, there is no majority and the representative is null rather than inventing one.
