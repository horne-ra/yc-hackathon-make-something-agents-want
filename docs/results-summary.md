# AX Lint results: every verdict

**Provisional: 3 trials per condition.** These are small demonstrations, not
statistical reliability claims. All numbers below come from committed reports.
Returned-result tokens measure potential context; the one-turn model never
consumes the result. Static tool-definition tokens are separate.

## Benchmarks — Provisional: 3 trials per condition.

| Benchmark / run | Verdict | Baseline → candidate passes | Returned-result tokens / observation | Static tool tokens | Committed evidence |
| --- | --- | --- | --- | --- | --- |
| Trackr, frozen compact · Sonnet 5.5 | Improved | 9/12 → 12/12 | 115,194 → 13,272 (−88.5%) | 651 → 837 | [Gate results](gate-results.md) |
| Trackr, hosted stability 1 | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 907 | [Stability](stability-results.md) |
| Trackr, hosted stability 2 | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 911 | [Stability](stability-results.md) |
| Trackr, hosted stability 3 | Improved | 9/12 → 12/12 | 115,194 → 13,702 | 651 → 947 | [Stability](stability-results.md) |
| Trackr, S8 attempt 1 · tools.ts only | **Regressed** | 9/12 → 6/12 | 115,194 → 59,007; errors are not savings | 651 → 1,153 | [Caught before apply](s8-attempt-1.md) |
| Trackr, S8 milestone · complete source | Improved | 9/12 → 12/12 | 115,194 → 13,917 | 651 → 903 | [All four confirm gates passed](s8-milestone.md) |
| Trackr, proposer follow-up · top three/full source | Improved | 9/12 → 12/12 | 115,194 → 13,272 | 651 → 941 | [Every trial](s8-proposer-fixes.md) |
| Trackr, proposer follow-up · all findings/tools only | **Regressed** | 9/12 → 6/12 | 115,194 → 59,010; rejected calls are not savings | 651 → 968 | [Every trial and nine warnings](s8-proposer-fixes.md) |
| Official filesystem server · Sonnet 5.5 | Improved | 4/9 → 9/9 | Separate real-repo size check below | 3,143 → 3,315 | [Filesystem](filesystem-results.md) |
| Trackr · Haiku 5.5 | Improved | 6/12 → 12/12 | See full cross-model trial table | 651 → 837 | [Cross-model](cross-model-results.md) |
| Official Memory · Sonnet 5.5 | Inconclusive | 9/9 → 9/9 | 764,652 → 764,652 | 1,961 → 2,121 | [Gate results](gate-results.md) |
| Official Memory · Haiku 5.5 | Inconclusive | 9/9 → 9/9 | 764,652 → 764,652 | 1,961 → 2,121 | [Cross-model](cross-model-results.md) |
| PopHIVE · Manufact 88/A | Inconclusive | 9/12 → 9/12 | 52,443 → 52,443 (including images) | See frozen report | [PopHIVE](pophive-results.md) |
| Yahoo Finance · SAIL motivating server | Inconclusive | 8/12 → 9/12 | Q1-2025 calls fetched about 115K tokens of daily data | See frozen report | [Yahoo Finance](yfinance-results.md) |
| Hosted judges smoke · Sonnet 5.5 | Improved | 9/12 → 12/12 | 115,194 → 13,917 | 651 → 955 | [New smoke, separate candidate](judges-smoke.md) |
| Manufact Cloud | reviewed privately; results shared with the Manufact team first. | — | — | — | Private evidence stays local |

The three hosted stability runs all returned Improved; each used a fresh proposal
with different wording and cost. They are not the frozen compact patch. S8's
recorded successful patch passed run approval, same deployment, updated revision
and exact metadata match. The recording is historical; Trackr was subsequently
reset to baseline. Shared-runner engineering acceptance is recorded separately in
[platform notes](platform-notes.md), not pooled into benchmark success rates.

## Real-repo filesystem check — Provisional: 3 trials per condition.

On Commander.js v13.1.0 after npm ci, explicit directory_tree size measurements
returned **1,037,509 → 19,443 full-response tokens**, with **9,985 → 219 file
entries**, by excluding node_modules and .git. This separate size check used no
model generation and is not a Commander behavioral benchmark. Counts include
repeated content in both MCP response fields. The synthetic fixture's 700K figure
is not the real-repo claim. See [filesystem evidence](filesystem-results.md) and
[servers issue #1077](https://github.com/modelcontextprotocol/servers/issues/1077).

## Cross-model interpretation — Provisional: 3 trials per condition.

Haiku 5.5 improved **6/12 → 12/12** on Trackr, beating Sonnet 5.5 with the original
descriptions (**9/12**). Estimated cost per successful task attempt was
**$0.000132308 vs $0.002620000** (5.05%). Most of that gap comes from Haiku's lower
token prices; improved descriptions made the cheaper model viable on these tasks.
These estimates cover **one model turn only**, include failed attempts and exclude
results as next-turn input. They are not invoices or end-to-end agent costs.
Prices and full 2×2 cells are frozen in [cross-model results](cross-model-results.md).
Both Memory models already passed every scored task: Inconclusive, nothing to fix
on these measured tasks. The patch only added static tokens.

## External inconclusive cases — Provisional: 3 trials per condition.

PopHIVE's imported **88/A** is an overall Manufact checklist score, not a per-tool
documentation score. Its coverage question kept charts enabled in every baseline
and candidate trial. A default change would be needed for reliable suppression on
these tasks; default changes are outside description-only patches. The hypothesis
did not produce a measured win. [Full image-aware evidence](pophive-results.md).

Yahoo Finance is the SAIL paper's motivating example, tested here at pinned
current source, not as a replication of the paper. Its tool description mentions
start/end but silently ignores them: the registered Q1-2025 probe returned the
latest month, **2026-09-17..2026-10-16**. Q1 answers using a covering period fetched
about **115K tokens** of daily data. The scored gain **8/12 → 9/12** is below the
Improved threshold, so the verdict remains Inconclusive. The daily-default trend
failure hypothesis was not observed; baseline selected coarse observations.
[All 24 trials, probe and caveats](yfinance-results.md).

## What breaks agents — Provisional: 3 trials per condition.

Both clear server-level wins involved **size-controlling parameters with no
description at all**: Trackr's include_comments and filesystem's excludePatterns.
Documented parameters were mostly handled. This small selected set supports an
audit-prioritization hypothesis, not a universal failure-rate claim. Missing source
context can also make a proposer invent values or defaults: S8 attempt 1 supplied
only src/tools.ts, regressed, and was caught before applying.

## Scoring lesson — Provisional: 3 trials per condition.

Two benchmark cases exposed the same limitation: the model made the right call
plus a parallel lookup, and the frozen one-call rule scored the turn as a failure
(Manufact M3 and Yahoo Y3). **Frozen results stand.** No private Manufact numbers
are published. Future runs may explicitly opt into scoring v2: a matching call
among the first turn's parallel calls can pass if no forbidden tool is proposed.
[Method amendment](SPEC.md). This is a future method change, not a rescore.

## Leaderboard census — static; Provisional: 3 trials per condition applies only to behavioral benchmarks

**Static census:** 2,672 public entries; 446 complete anonymous tool snapshots;
432 provider-counted static costs and 14 unavailable counts. Median static cost
**4,018 tokens**, p90 **20,431**. Among 195 audited A/A+ entries, **148** have at
least one context-cost heuristic flag (280 A/A+ in the census). Static flags are
hypotheses, not measured tool failures or savings. Name-matched documentation vs
flag Spearman correlation is **−0.105** (1,338 tools/126 servers); the
identical-definition cohort is **−0.252** (410 tools/49 servers). No causal,
behavioral or significance claim. [Census and coverage](leaderboard-scan.md).
