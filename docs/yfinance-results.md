# Yahoo Finance results

**Inconclusive.** Baseline **8/12** frozen trial passes; candidate **9/12**. Routing/argument passes 8/12 → 9/12. **Provisional: 3 trials per task and condition, not a statistical claim.**

Ordered verdict follows the unchanged [core rules](../src/core/verdict.ts): regression first, insufficient data second, then nonnegative task deltas with at least a two-pass non-control gain for Improved. Y1 unchanged at 2/3; Y2 unchanged at 3/3; Y3 rose 0/3 to 1/3; Y4-control unchanged at 3/3. Returned-token differences alone cannot make Improved.

## What the model already did correctly

The daily-default failure hypothesis was **not observed** for the trend tasks. Baseline Y2 selected quarterly observations in all three trials, which the user-approved predicate accepts. All three baseline Y3 turns proposed monthly historical data, also an acceptable interval, together with an extra stock-info call. No historical-price proposal in either condition sent unsupported start/end arguments.

The pre-registration also required exactly one proposed tool call. That additional gate rejected 5 multi-call turns, including all three baseline Y3 turns, even though their first historical-price arguments were correct. These are single-call-budget failures, not evidence of bad resolution selection. Frozen scores and the ordered verdict are unchanged. [Descriptive diagnostics](../scripts/yfinance/interpretation.json).

Y1 remained imperfect: one baseline turn produced no tool call (stop reason max_tokens), and one candidate call omitted the covering period and received the default latest month. The six news-control calls selected the right tool but returned no articles; their passes establish selection only, not successful news coverage.

Aggregate result-token totals below cover different numbers of executed calls (8 versus 10), because blocked/no-call turns produce no result. They must not be treated as comparable token savings or as evidence that executing fewer useful calls is cheaper behavior. The setup comparison isolates row resolution; the behavioral trials did not establish a resolution-related improvement.

## Source, context and prior evidence

Pinned current repository commit: [b9c176547d3797b2196adeba0210ae67861ac589](https://github.com/Alex2Yang97/yahoo-finance-mcp/tree/b9c176547d3797b2196adeba0210ae67861ac589). Runtime: Python 3.14.6, MCP 2.1.0, yfinance 1.6.0, exact upstream uv.lock; stdio via uv. Nine source-reviewed read-only tools visible in both conditions. No read-only annotations were invented: this source exports none, and the explicit allowlist is enforced at dispatch.

The [SAIL paper, v3 §2](https://arxiv.org/html/2602.14878v3#S2) uses ambiguous date-range guidance as its motivating example. This run tests current pinned source with a description-only change. It does not add the date parameters available in the paper’s fork and is not a reproduction of the paper’s full evaluation.

Initial setup registration: [0ad8496](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/0ad8496ae53173c3b4cb97c7370102b123b6d7e6), before any target/provider call. Final freeze: [d4b28f1](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/d4b28f12e61562ea998a2c5afc0d1ccdd6bcbf47), before generation. Both conditions received exactly: **Today's date: 2026-10-17 (America/Los_Angeles).** [Pre-registration](yfinance-preregistration.md) · [Frozen hashes](../scripts/yfinance/frozen/hashes.json).

Time box: 2026-10-18T00:53:37.000Z to 2026-10-18T01:38:37.000Z (45 minutes). Finished 2026-10-18T01:05:10.636Z; within the time box. All timestamps in evidence are UTC; the date context is America/Los_Angeles.

## Confirmed mismatch and one unknown-argument probe

The description says “Either Use period parameter or use start and end,” but the function signature and tools/list accept only ticker, period and interval. The single registered probe supplied AAPL, period=1mo, interval=1d, start=2025-01-01, end=2025-03-31.

Observed behavior: **silent ignore of unsupported start/end**. The probe returned 22 rows spanning 2026-09-17T04:00:00.000Z to 2026-10-16T04:00:00.000Z; it did not enforce the requested Q1 2025 bounds. No repeat probe was made. [Complete setup evidence](../scripts/yfinance/setup/result.json).

## Real row/token comparison and source fidelity

| Setup | Rows | Full-response input tokens |
|---|---:|---:|
| NVDA 5y, 1d | 1,255 | 287,653 |
| NVDA 5y, 1mo | 60 | 13,935 |

Counts use the entire serialized MCP response, including both content and structuredContent when returned, through Anthropic countTokens. They are not the raw JSON string alone, a character estimate, or model-generated output tokens. Counts vary with live data and response formatting. The returned result is not fed back to the generation model.

Only the historical-price tool description changes: it removes false date-range guidance, names the three real arguments, explains covering periods and row resolution, includes the measured example above, and recommends weekly/monthly observations for broad trends. All defaults, schemas, annotations, other descriptions, and executable behavior are unchanged. The actual hand-edited server exported the exact candidate tools/list; AST comparison matched after masking only that decorator description. [Patch](../scripts/yfinance/candidate-patch.json) · [Source edit](../scripts/yfinance/source-edit.json) · [Fidelity proof](../scripts/yfinance/source-fidelity/result.json).

## Natural tasks and exact results

Y2/Y3 ask for overall trends, which weekly/monthly observations can answer. Y1 asks for dates expressible only through a covering period. As of October 17, 2026, 2y is the smallest documented period covering Q1 2025; 1y misses it. Wider covering periods pass Y1; its interval is unscored. No prompt names a tool or parameter. We score first-call selection/arguments, not investment advice or final-answer quality.

| Task | Exact prompt | Baseline | Candidate |
|---|---|---:|---:|
| Y1 | How did Apple's stock do between January 1 and March 31, 2025? | 2/3 | 2/3 |
| Y2 | How has NVIDIA's stock performed over the last 5 years? Just the overall trend. | 3/3 | 3/3 |
| Y3 | What's the general trend for Tesla's stock over the past year? | 0/3 | 1/3 |
| Control | What's the latest news about Microsoft? | 3/3 | 3/3 |

Y1: baseline arguments [null,{"ticker":"AAPL","period":"2y","interval":"1d"},{"ticker":"AAPL","period":"2y","interval":"1d"}]; candidate arguments [{"ticker":"AAPL","period":"2y","interval":"1d"},{"ticker":"AAPL","period":"2y","interval":"1d"},{"ticker":"AAPL"}]. Baseline already met the selection predicate in 2/3 trials.
Y2: baseline arguments [{"ticker":"NVDA","period":"5y","interval":"3mo"},{"ticker":"NVDA","period":"5y","interval":"3mo"},{"ticker":"NVDA","period":"5y","interval":"3mo"}]; candidate arguments [{"ticker":"NVDA","period":"5y","interval":"3mo"},{"ticker":"NVDA","period":"5y","interval":"3mo"},{"ticker":"NVDA","period":"5y","interval":"3mo"}]. Baseline already met the selection predicate in 3/3 trials.
Y3: baseline arguments [null,null,null]; candidate arguments [null,null,{"ticker":"TSLA","period":"1y","interval":"1wk"}]. Baseline already met the selection predicate in 0/3 trials.

## Every trial in execution order

Complete pass additionally requires no transport, MCP, or explicit server-text error. Empty successful responses are marked but do not establish usable data. All failures, unsupported arguments, warnings and count errors remain in evidence; no retries or replacement trials were run.

| Order | Task | Condition | Replicate | Tool/proposed tools | Arguments | Dispatch | Verdict | Rows | Full-response tokens | Evidence |
|---:|---|---|---:|---|---|---|---|---:|---:|---|
| 1 | Y1 | candidate | 2 | get_historical_stock_prices | {"ticker":"AAPL","period":"2y","interval":"1d"} | allowed | pass | 501 | 114,773 | [trial](../scripts/yfinance/run/trial-1.json) |
| 2 | Y1 | candidate | 3 | get_historical_stock_prices | {"ticker":"AAPL","period":"2y","interval":"1d"} | allowed | pass | 501 | 114,805 | [trial](../scripts/yfinance/run/trial-2.json) |
| 3 | Y4-control | candidate | 3 | get_yahoo_finance_news | {"ticker":"MSFT"} | allowed | pass (empty) | unavailable | 70 | [trial](../scripts/yfinance/run/trial-3.json) |
| 4 | Y3 | baseline | 2 | get_historical_stock_prices; get_stock_info | [{"name":"get_historical_stock_prices","args":{"ticker":"TSLA","period":"1y","interval":"1mo"}},{"name":"get_stock_info","args":{"ticker":"TSLA"}}] | blocked_multiple_calls | fail: multiple_tool_calls | unavailable | unavailable | [trial](../scripts/yfinance/run/trial-4.json) |
| 5 | Y2 | candidate | 2 | get_historical_stock_prices | {"ticker":"NVDA","period":"5y","interval":"3mo"} | allowed | pass | 21 | 4,903 | [trial](../scripts/yfinance/run/trial-5.json) |
| 6 | Y1 | baseline | 2 |  | [] | not_attempted | fail: no_tool_call | unavailable | unavailable | [trial](../scripts/yfinance/run/trial-6.json) |
| 7 | Y4-control | baseline | 2 | get_yahoo_finance_news | {"ticker":"MSFT"} | allowed | pass (empty) | unavailable | 70 | [trial](../scripts/yfinance/run/trial-7.json) |
| 8 | Y1 | candidate | 1 | get_historical_stock_prices | {"ticker":"AAPL"} | allowed | fail: bad_args | 22 | 5,053 | [trial](../scripts/yfinance/run/trial-8.json) |
| 9 | Y3 | candidate | 3 | get_historical_stock_prices; get_stock_info | [{"name":"get_historical_stock_prices","args":{"ticker":"TSLA","period":"1y","interval":"1mo"}},{"name":"get_stock_info","args":{"ticker":"TSLA"}}] | blocked_multiple_calls | fail: multiple_tool_calls | unavailable | unavailable | [trial](../scripts/yfinance/run/trial-9.json) |
| 10 | Y4-control | baseline | 1 | get_yahoo_finance_news | {"ticker":"MSFT"} | allowed | pass (empty) | unavailable | 70 | [trial](../scripts/yfinance/run/trial-10.json) |
| 11 | Y3 | candidate | 1 | get_historical_stock_prices; get_stock_info | [{"name":"get_historical_stock_prices","args":{"ticker":"TSLA","period":"1y","interval":"1mo"}},{"name":"get_stock_info","args":{"ticker":"TSLA"}}] | blocked_multiple_calls | fail: multiple_tool_calls | unavailable | unavailable | [trial](../scripts/yfinance/run/trial-11.json) |
| 12 | Y3 | baseline | 1 | get_historical_stock_prices; get_stock_info | [{"name":"get_historical_stock_prices","args":{"ticker":"TSLA","period":"1y","interval":"1mo"}},{"name":"get_stock_info","args":{"ticker":"TSLA"}}] | blocked_multiple_calls | fail: multiple_tool_calls | unavailable | unavailable | [trial](../scripts/yfinance/run/trial-12.json) |
| 13 | Y2 | candidate | 3 | get_historical_stock_prices | {"ticker":"NVDA","period":"5y","interval":"3mo"} | allowed | pass | 21 | 4,911 | [trial](../scripts/yfinance/run/trial-13.json) |
| 14 | Y3 | candidate | 2 | get_historical_stock_prices | {"ticker":"TSLA","period":"1y","interval":"1wk"} | allowed | pass | 53 | 12,095 | [trial](../scripts/yfinance/run/trial-14.json) |
| 15 | Y2 | baseline | 3 | get_historical_stock_prices | {"ticker":"NVDA","period":"5y","interval":"3mo"} | allowed | pass | 21 | 4,907 | [trial](../scripts/yfinance/run/trial-15.json) |
| 16 | Y2 | candidate | 1 | get_historical_stock_prices | {"ticker":"NVDA","period":"5y","interval":"3mo"} | allowed | pass | 21 | 4,905 | [trial](../scripts/yfinance/run/trial-16.json) |
| 17 | Y1 | baseline | 3 | get_historical_stock_prices | {"ticker":"AAPL","period":"2y","interval":"1d"} | allowed | pass | 501 | 114,789 | [trial](../scripts/yfinance/run/trial-17.json) |
| 18 | Y4-control | baseline | 3 | get_yahoo_finance_news | {"ticker":"MSFT"} | allowed | pass (empty) | unavailable | 70 | [trial](../scripts/yfinance/run/trial-18.json) |
| 19 | Y3 | baseline | 3 | get_historical_stock_prices; get_stock_info | [{"name":"get_historical_stock_prices","args":{"ticker":"TSLA","period":"1y","interval":"1mo"}},{"name":"get_stock_info","args":{"ticker":"TSLA"}}] | blocked_multiple_calls | fail: multiple_tool_calls | unavailable | unavailable | [trial](../scripts/yfinance/run/trial-19.json) |
| 20 | Y1 | baseline | 1 | get_historical_stock_prices | {"ticker":"AAPL","period":"2y","interval":"1d"} | allowed | pass | 501 | 114,785 | [trial](../scripts/yfinance/run/trial-20.json) |
| 21 | Y4-control | candidate | 1 | get_yahoo_finance_news | {"ticker":"MSFT"} | allowed | pass (empty) | unavailable | 70 | [trial](../scripts/yfinance/run/trial-21.json) |
| 22 | Y4-control | candidate | 2 | get_yahoo_finance_news | {"ticker":"MSFT"} | allowed | pass (empty) | unavailable | 70 | [trial](../scripts/yfinance/run/trial-22.json) |
| 23 | Y2 | baseline | 1 | get_historical_stock_prices | {"ticker":"NVDA","period":"5y","interval":"3mo"} | allowed | pass | 21 | 4,903 | [trial](../scripts/yfinance/run/trial-23.json) |
| 24 | Y2 | baseline | 2 | get_historical_stock_prices | {"ticker":"NVDA","period":"5y","interval":"3mo"} | allowed | pass | 21 | 4,905 | [trial](../scripts/yfinance/run/trial-24.json) |

## Consistency and cost

| Task | Condition | Tool/args disagree | Outcomes disagree | Tokens disagree |
|---|---|---|---|---|
| Y1 | baseline | true | true | true |
| Y1 | candidate | true | true | true |
| Y2 | baseline | false | false | true |
| Y2 | candidate | false | false | true |
| Y3 | baseline | false | false | false |
| Y3 | candidate | true | true | true |
| Y4-control | baseline | false | false | false |
| Y4-control | candidate | false | false | false |

Returned-context totals: baseline **244,499** across 8 counted responses; candidate **261,655** across 10. 0 response counts unavailable; no approximate counts. Static tool-definition tokens are separate: baseline 3459, candidate 3624.

These small live-data observations do not establish general reliability, final-answer quality, causality, or end-to-end/invoiced cost. Wider coverage and finer resolution can be correct for other tasks. Source fidelity proves metadata reproduction, not improved behavior; the ordered trial verdict supplies the behavioral result.

## Protocol and retention checks

Fresh processes: 24/24; minimum gap after the prior trial closed: 1.049s. All nine tools and the same date context were verified. 18/18 complete returned responses have provider counts. 0 response redactions. All frozen hashes match. 24 startup/protocol warnings were retained; the unmodified server’s stdout banner can trigger an invalid-JSON warning without preventing the result. No baseline logic was silently patched.

The first default uv attempt selected an incompatible Python 3.14.3; the old uv also lacked a Python 3.14.6 download. Isolated uv 0.13.1 installed the required interpreter and locked dependencies; the original uv 0.10.6 then launched the server unchanged. These setup failures are recorded, and no model was substituted.

Offline regeneration: `node --import tsx scripts/yfinance/report.ts`, then `node --import tsx scripts/yfinance/interpret.ts`. The second command adds descriptive notes without changing trial scores.

[Full run](../scripts/yfinance/run/result.json) · [Machine summary and verification](../scripts/yfinance/summary.json) · [Source snapshots and license](../scripts/yfinance/source/) · [All setup responses](../scripts/yfinance/setup/). Manufact artifacts remain ignored and private.
