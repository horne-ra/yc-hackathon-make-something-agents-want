# Upstream Yahoo Finance issue draft

Draft only. No issue has been opened or sent; the maintainer will post it.

## Title

get_historical_stock_prices description mentions start/end, which the tool silently ignores

## Reproduction and observed behavior

Pinned source: Alex2Yang97/yahoo-finance-mcp at
[b9c176547d3797b2196adeba0210ae67861ac589](https://github.com/Alex2Yang97/yahoo-finance-mcp/tree/b9c176547d3797b2196adeba0210ae67861ac589).
The tool description tells callers to use period or start/end. Its exported
schema and handler accept only ticker, period and interval.

A single pre-registered probe supplied:

```json
{"ticker":"AAPL","period":"1mo","interval":"1d","start":"2025-01-01","end":"2025-03-31"}
```

It returned 22 rows spanning **2026-09-17..2026-10-16**. Unsupported start/end
were silently ignored, so the requested Q1 2025 bounds were not honored. The full
result preserves the timestamps and original response. No repeat probe was made.

## Suggested description correction

Describe only the implemented arguments: ticker, period (default 1mo), and
interval (default 1d). Remove the claim that start/end are supported. Explain
that historical date ranges require a covering period and filtering the returned
rows; period is not an exact date-bound request. For broad trends recommend
weekly or monthly observations. Adding real date-bound parameters or rejecting
unknown arguments could be separate behavioral fixes.

Resolution has a large measured response-size impact. One NVDA setup comparison:

| period | interval | Rows | Full-response input tokens |
| --- | --- | ---: | ---: |
| 5y | 1d | 1,255 | 287,653 |
| 5y | 1mo | 60 | 13,935 |

These count the entire serialized MCP response, including duplicate content and
structuredContent when present, through Anthropic countTokens. They are potential
returned context, not model-generated output or a claim about later agent cost.
Data and counts can vary over time.

## Benchmark context

**Provisional: 3 trials per condition.** A description-only candidate scored
8/12 → 9/12, **Inconclusive**, under the frozen scoring rules. That does not prove
behavioral improvement. Baseline broad-trend calls already selected coarse
intervals; parallel auxiliary lookups triggered the frozen one-call gate. All
trials and failed hypotheses remain reported. No defaults or handlers were
changed to obtain the candidate.

[Complete evidence and limitations](yfinance-results.md) ·
[Registered probe result](../scripts/yfinance/setup/result.json) ·
[Source fidelity](../scripts/yfinance/source-fidelity/result.json).
