# memory

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Model: claude-sonnet-5-5

| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| memory-broad | candidate | 2 | - | null | infra | 0 |
| memory-broad | candidate | 3 | - | null | infra | 0 |
| memory-boundary | candidate | 3 | - | null | infra | 0 |
| memory-control | baseline | 2 | - | null | infra | 0 |
| memory-broad | candidate | 1 | - | null | infra | 0 |
| memory-broad | baseline | 2 | - | null | infra | 0 |
| memory-search | candidate | 2 | - | null | infra | 0 |
| memory-boundary | baseline | 2 | - | null | infra | 0 |
| memory-control | baseline | 1 | - | null | infra | 0 |
| memory-control | candidate | 1 | - | null | infra | 0 |
| memory-boundary | baseline | 1 | - | null | infra | 0 |
| memory-control | candidate | 3 | - | null | infra | 0 |
| memory-search | candidate | 1 | - | null | infra | 0 |
| memory-control | candidate | 2 | - | null | infra | 0 |
| memory-search | candidate | 3 | - | null | infra | 0 |
| memory-search | baseline | 3 | - | null | infra | 0 |
| memory-broad | baseline | 1 | - | null | infra | 0 |
| memory-control | baseline | 3 | - | null | infra | 0 |
| memory-boundary | baseline | 3 | - | null | infra | 0 |
| memory-broad | baseline | 3 | - | null | infra | 0 |
| memory-search | baseline | 1 | - | null | infra | 0 |
| memory-boundary | candidate | 1 | - | null | infra | 0 |
| memory-search | baseline | 2 | - | null | infra | 0 |
| memory-boundary | candidate | 2 | - | null | infra | 0 |

## Summary

```json
[
  {
    "task_id": "memory-broad",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 0,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    },
    "candidate": {
      "passed": 0,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    }
  },
  {
    "task_id": "memory-search",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 0,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    },
    "candidate": {
      "passed": 0,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    }
  },
  {
    "task_id": "memory-control",
    "control": true,
    "unscored": false,
    "baseline": {
      "passed": 0,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    },
    "candidate": {
      "passed": 0,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    }
  },
  {
    "task_id": "memory-boundary",
    "control": false,
    "unscored": true,
    "baseline": {
      "passed": null,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    },
    "candidate": {
      "passed": null,
      "of": 0,
      "infra_errors": 3,
      "insufficient_data": true,
      "result_tokens": 0
    }
  }
]
```
