# Cross-model benchmark: Sonnet 5.5 versus Haiku 5.5

**The patch mattered more for Haiku on Trackr:** scored passes rose 6/12 → 12/12 (+6), versus Sonnet’s 9/12 → 12/12 (+3). **On Memory it mattered the same:** both models passed 9/9 in both conditions, with no observed patch benefit.

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

## Model and protocol

Before any benchmark model call, authenticated GET /v1/models listed **claude-haiku-5-5**, displayed as Claude Haiku 5.5, created 2026-10-07T18:00:00Z. GET /v1/models/claude-haiku-5-5 confirmed that exact ID; no dated Haiku 5.5 snapshot appeared. Evidence checked at 2026-10-17T21:40:38.888Z is retained in [preflight.json](../scripts/cross-model-evidence/preflight.json), pushed before trials in cf005dd.

Runs use a process-only AXLINT_MODEL=claude-haiku-5-5 override. The shared .env and production Sonnet setting are unchanged. Same harness entrypoints, tasks, prompts, scorers, candidate patches, seeds, max_tokens=300, automatic tool choice, single turn, three trials per task and condition, and four-worker limit. Provider-default sampling; temperature is never sent. The only shared-harness edit removes a legacy non-Sonnet temperature:0 fallback and records default sampling for every model. Neither entrypoint, tasks, scoring, fixture nor patch changed.

Sonnet values are the retained successful runs cited in [docs/gate-results.md](gate-results.md), not reruns. Byte-for-byte equality checks cover tasks, neutral system prompt, baseline/candidate tools and patch provenance between models. Memory uses pinned official server bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c, all nine tools visible, the same fictional seed, dispatch-enforced read allowlist, and one fresh process/graph per trial.

Trackr ran against https://trackr-production-e1a6.up.railway.app/mcp. Before both model runs, the live baseline descriptions and complete tools hash matched the frozen baseline: sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5. Haiku serverInfo.version and every trial identity report trackr-demo-001@f9b6c2beae2ec8c5774a7b902349618052582f2f. This is the new revert SHA; source metadata matches the earlier Sonnet deployment. Both metadata conditions execute against that identical baseline deployment; patches affect only model-visible descriptions. No source edits were applied.

Result tokens use countTokens on the complete serialized MCP response, including content and structuredContent where present. They measure potential returned context; the one-turn model does not consume tool results. Static tool-definition tokens are separate. There are no approximate counts, provider retries or infrastructure failures in either new run. All 48 trials, including failures and unscored boundary calls, are retained.

## Memory

| Task | Sonnet passes B → C | Haiku passes B → C | Sonnet result tokens B → C | Haiku result tokens B → C |
| --- | --- | --- | ---: | ---: |
| memory-broad | 3/3 → 3/3 | 3/3 → 3/3 | 715,578 → 715,578 | 715,578 → 715,578 |
| memory-search | 3/3 → 3/3 | 3/3 → 3/3 | 24,984 → 24,984 | 24,984 → 24,984 |
| memory-control (control) | 3/3 → 3/3 | 3/3 → 3/3 | 24,090 → 24,090 | 24,090 → 24,090 |
| memory-boundary (unscored) | unscored → unscored | unscored → unscored | 24,984 → 24,984 | 219 → 219 |

| Model | Scored passes B → C | Scored result tokens B → C | Static tool tokens B → C | Ordered verdict |
| --- | --- | ---: | ---: | --- |
| claude-sonnet-5-5 | 9/9 → 9/9 | 764,652 → 764,652 | 1,961 → 2,121 | **Inconclusive** |
| claude-haiku-5-5 | 9/9 → 9/9 | 764,652 → 764,652 | 1,961 → 2,121 | **Inconclusive** |

claude-sonnet-5-5: memory-broad unchanged at 3/3; memory-search unchanged at 3/3; memory-control unchanged at 3/3. Unscored tasks are excluded from the verdict.
claude-haiku-5-5: memory-broad unchanged at 3/3; memory-search unchanged at 3/3; memory-control unchanged at 3/3. Unscored tasks are excluded from the verdict.

| Task | Sonnet baseline | Sonnet candidate | Haiku baseline | Haiku candidate |
| --- | --- | --- | --- | --- |
| memory-broad | agree | agree | agree | agree |
| memory-search | agree | agree | agree | agree |
| memory-control | agree | agree | agree | agree |
| memory-boundary | agree | agree | agree | agree |

Evidence: [Sonnet result](../scripts/results/memory-2026-10-17T19-34-10.561Z/result.json), [Haiku result](../scripts/results/memory-2026-10-17T21-41-09.662Z/result.json), [Haiku full trial table](../scripts/results/memory-2026-10-17T21-41-09.662Z/table.md), [captured harness output](../scripts/cross-model-evidence/haiku-memory.log).

Both verdicts are **Inconclusive** under the ordered rules: no regression or insufficient data, but no scored task gains two passes. Scored result totals are identical in both conditions and both models. Including unscored boundary calls, Sonnet totals are 789,636 → 789,636; Haiku totals are 764,871 → 764,871. On the boundary Haiku consistently searched the combined string "Priya Nair checkout migration", returning an empty match (73 tokens), versus Sonnet’s "Priya Nair" (8,328 tokens). That unscored difference is not evidence of better task success or a patch benefit.

## Trackr

| Task | Sonnet passes B → C | Haiku passes B → C | Sonnet result tokens B → C | Haiku result tokens B → C |
| --- | --- | --- | ---: | ---: |
| t1-route | 3/3 → 3/3 | 3/3 → 3/3 | 19,710 → 1,032 | 19,710 → 13,484 |
| t2-status | 3/3 → 3/3 | 0/3 → 3/3 | 56,310 → 2,967 | 161,939 → 2,967 |
| t3-payload | 0/3 → 3/3 | 0/3 → 3/3 | 31,224 → 1,323 | 31,224 → 1,323 |
| t4-control (control) | 3/3 → 3/3 | 3/3 → 3/3 | 7,950 → 7,950 | 7,950 → 7,950 |

| Model | Scored passes B → C | Scored result tokens B → C | Static tool tokens B → C | Ordered verdict |
| --- | --- | ---: | ---: | --- |
| claude-sonnet-5-5 | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 837 | **Improved** |
| claude-haiku-5-5 | 6/12 → 12/12 | 220,823 → 25,724 | 651 → 837 | **Improved** |

claude-sonnet-5-5: t1-route unchanged at 3/3; t2-status unchanged at 3/3; t3-payload rose 0/3 to 3/3; t4-control unchanged at 3/3. Unscored tasks are excluded from the verdict.
claude-haiku-5-5: t1-route unchanged at 3/3; t2-status rose 0/3 to 3/3; t3-payload rose 0/3 to 3/3; t4-control unchanged at 3/3. Unscored tasks are excluded from the verdict.

| Task | Sonnet baseline | Sonnet candidate | Haiku baseline | Haiku candidate |
| --- | --- | --- | --- | --- |
| t1-route | agree | agree | agree | calls, tokens |
| t2-status | agree | agree | calls, tokens | agree |
| t3-payload | agree | agree | agree | agree |
| t4-control | agree | agree | agree | agree |

Evidence: [Sonnet result](../scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json), [Haiku result](../scripts/results/trackr-2026-10-17T21-41-08.977Z/result.json), [Haiku full trial table](../scripts/results/trackr-2026-10-17T21-41-08.977Z/table.md), [captured harness output](../scripts/cross-model-evidence/haiku-trackr.log).

Haiku has two within-condition flags, with **no pass/fail disagreement**: t1-route candidate omits include_comments in trials 2 and 3 (6,570 tokens each) but sets false in trial 1 (344); t2-status baseline omits status in trials 1 and 3 (80,949 tokens each) and sends invalid "in progress" in trial 2 (41-token tool validation error). All three status baseline calls fail the unchanged scorer; every failure remains in the evidence. Other Haiku groups agree; every Sonnet group agrees.

Trackr’s patch gains six passes for Haiku, compared with three for Sonnet: Haiku additionally needs the documented in_progress spelling. Both models already pass routing and exact-issue lookup 3/3. Potential returned result tokens fall 88.4% for Haiku (220,823 → 25,724), versus 88.5% for Sonnet (115,194 → 13,272); accuracy gains are larger for Haiku while its routing payload reduction is less consistent. Static cost rises 651 → 837 for both. Tokens do not determine either Improved verdict.

## Checks run

```text
pnpm typecheck: exit 0
hand-run-memory.ts --check: nine tools; dispatch blocks delete_entities; deterministic seed size; compiled source fidelity exact
hand-run.ts --check: exact baseline descriptions; control unchanged; TRK-117 succeeds; deployed revert SHA
hand-run-memory.ts: exit 0; 24 Haiku trials retained
hand-run.ts: exit 0; 24 Haiku trials retained
PASS memory/sonnet: 24 trials; all eight groups contain trials 1,2,3; exact token counts and summaries; no infra
PASS memory/haiku: 24 trials; all eight groups contain trials 1,2,3; exact token counts and summaries; no infra
PASS memory/haiku: 24 unique server PIDs/graph copies; every graph removed; only allowlisted reads executed
PASS memory: tasks/prompts/scoring entrypoints and baseline/candidate metadata unchanged across models; candidate patch provenance identical
PASS trackr/sonnet: 24 trials; all eight groups contain trials 1,2,3; exact token counts and summaries; no infra
PASS trackr/haiku: 24 trials; all eight groups contain trials 1,2,3; exact token counts and summaries; no infra
PASS trackr/haiku: exact frozen baseline hash; all 24 trials use the deployed revert SHA
PASS trackr: tasks/prompts/scoring entrypoints and baseline/candidate metadata unchanged across models; candidate patch provenance identical
PASS unchanged harness entrypoints: git diff origin/main -- scripts/hand-run.ts scripts/hand-run-memory.ts is empty
```

Only scripts/ and docs/ are changed on lane/models. No new dependency, package/lockfile edit, source apply, Manufact change or main merge. Existing ignored vendor/build dependencies were reused. The prior production stability work remains paused for the user’s deployment-branch confirmation.
