# AX Lint: results for the README and demo

Description changes can improve first-call tool use while increasing static metadata cost. These small demonstrations do not establish statistical reliability. Returned-result tokens measure potential context; the single-turn models did not consume those results.

## Trackr · Sonnet 5.5

**Provisional: 3 trials per condition.**

The frozen compact patch improved **9/12 → 12/12** first-call passes. Returned-result tokens fell **115,194 → 13,272 (−88.5%)**; static tool-definition tokens rose **651 → 837**. The gain was the payload task (**0/3 → 3/3**): explicitly disabling comments made a quick issue list small. Routing and status already passed **3/3** at baseline; their failure hypotheses were rejected. Three fresh hosted proposal/verification runs were also **Improved**, each **9/12 → 12/12**, with **0/3 Inconclusive**; their generated descriptions and static costs varied. [Frozen results](gate-results.md) · [Hosted stability](stability-results.md).

## Official filesystem server

**Provisional: 3 trials per condition.**

The frozen description patch improved **4/9 → 9/9** passes on preregistered synthetic-project tasks, with static metadata **3,143 → 3,315 (+172 tokens)**. The baseline test-search group disagreed across trials; all outcomes remain reported. Separately, on real **Commander.js v13.1.0** after `npm ci`, explicit `directory_tree` calls returned **1,037,509 → 19,443 full-response tokens** when adding `["node_modules", ".git"]`, with **9,985 → 219 file entries**. This was a size measurement with no generation calls, not a behavioral benchmark on Commander; counts include repeated tree content in both MCP response fields. It illustrates the large-tree concern in [servers issue #1077](https://github.com/modelcontextprotocol/servers/issues/1077). [Benchmark, pin and measurement](filesystem-results.md).

## Cross-model · a cheaper model with better descriptions

**Provisional: 3 trials per condition.**

On Trackr, **Haiku 5.5 + the patch reached 12/12**, up from **6/12**, beating **Sonnet 5.5 + original descriptions at 9/12**. Estimated cost per successful task attempt was **$0.000132308 versus $0.002620000**, or **5.05%** of the cost. **Most of that cost gap comes from Haiku’s lower token prices; the patch made switching to the cheaper model viable on these measured tasks.** The estimate covers **one model turn only**, includes failed scored attempts, and excludes tool results as subsequent input because the harness never sends them back. Haiku’s candidate routing arguments/token counts varied while all three passed. Prices were checked **October 17, 2026**; these are estimates, not invoices or end-to-end agent costs. [2×2 tables, prices, failures and consistency flags](cross-model-results.md).

## Memory · no observed gain

**Provisional: 3 trials per condition.**

Both Sonnet 5.5 and Haiku 5.5 passed **9/9 → 9/9** scored trials. The patch added static tokens without improving scored task success; both verdicts were **Inconclusive**. [Sonnet evidence](gate-results.md) · [Cross-model evidence](cross-model-results.md).
