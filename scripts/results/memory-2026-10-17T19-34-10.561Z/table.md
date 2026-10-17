# memory

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Model: claude-sonnet-5-5

| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| memory-broad | candidate | 3 | read_graph | {} | pass | 238526 |
| memory-broad | candidate | 2 | read_graph | {} | pass | 238526 |
| memory-boundary | candidate | 3 | search_nodes | {"query":"Priya Nair"} | unscored | 8328 |
| memory-control | baseline | 2 | open_nodes | {"names":["Priya Nair","Dev Patel"]} | pass | 8030 |
| memory-search | candidate | 2 | search_nodes | {"query":"checkout migration"} | pass | 8328 |
| memory-broad | baseline | 2 | read_graph | {} | pass | 238526 |
| memory-broad | candidate | 1 | read_graph | {} | pass | 238526 |
| memory-boundary | baseline | 2 | search_nodes | {"query":"Priya Nair"} | unscored | 8328 |
| memory-control | candidate | 3 | open_nodes | {"names":["Priya Nair","Dev Patel"]} | pass | 8030 |
| memory-control | candidate | 1 | open_nodes | {"names":["Priya Nair","Dev Patel"]} | pass | 8030 |
| memory-boundary | baseline | 1 | search_nodes | {"query":"Priya Nair"} | unscored | 8328 |
| memory-control | baseline | 1 | open_nodes | {"names":["Priya Nair","Dev Patel"]} | pass | 8030 |
| memory-search | candidate | 3 | search_nodes | {"query":"checkout migration"} | pass | 8328 |
| memory-control | candidate | 2 | open_nodes | {"names":["Priya Nair","Dev Patel"]} | pass | 8030 |
| memory-search | candidate | 1 | search_nodes | {"query":"checkout migration"} | pass | 8328 |
| memory-search | baseline | 3 | search_nodes | {"query":"checkout migration"} | pass | 8328 |
| memory-broad | baseline | 3 | read_graph | {} | pass | 238526 |
| memory-boundary | baseline | 3 | search_nodes | {"query":"Priya Nair"} | unscored | 8328 |
| memory-broad | baseline | 1 | read_graph | {} | pass | 238526 |
| memory-control | baseline | 3 | open_nodes | {"names":["Priya Nair","Dev Patel"]} | pass | 8030 |
| memory-boundary | candidate | 1 | search_nodes | {"query":"Priya Nair"} | unscored | 8328 |
| memory-boundary | candidate | 2 | search_nodes | {"query":"Priya Nair"} | unscored | 8328 |
| memory-search | baseline | 1 | search_nodes | {"query":"checkout migration"} | pass | 8328 |
| memory-search | baseline | 2 | search_nodes | {"query":"checkout migration"} | pass | 8328 |

## Summary

```json
[
  {
    "task_id": "memory-broad",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 715578
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 715578
    }
  },
  {
    "task_id": "memory-search",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 24984
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 24984
    }
  },
  {
    "task_id": "memory-control",
    "control": true,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 24090
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 24090
    }
  },
  {
    "task_id": "memory-boundary",
    "control": false,
    "unscored": true,
    "baseline": {
      "passed": null,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 24984
    },
    "candidate": {
      "passed": null,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 24984
    }
  }
]
```
