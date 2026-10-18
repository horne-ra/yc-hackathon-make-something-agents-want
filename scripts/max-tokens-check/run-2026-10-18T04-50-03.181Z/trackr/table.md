# trackr

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Model: claude-sonnet-5-5

| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| t4-control | candidate | 3 | get_issue | {"id":"TRK-117"} | pass | 2650 |
| t1-route | candidate | 3 | search_issues | {"query":"checkout page","include_comments":false} | pass | 344 |
| t1-route | candidate | 2 | search_issues | {"query":"checkout page","include_comments":false} | pass | 344 |
| t3-payload | baseline | 2 | list_issues | {"assignee":"maria","status":"open"} | fail: bad_args | 10408 |
| t2-status | candidate | 2 | list_issues | {"status":"in_progress","include_comments":false} | pass | 989 |
| t1-route | baseline | 2 | search_issues | {"query":"checkout page"} | pass | 6570 |
| t4-control | baseline | 2 | get_issue | {"id":"TRK-117"} | pass | 2650 |
| t1-route | candidate | 1 | search_issues | {"query":"checkout page","include_comments":false} | pass | 344 |
| t4-control | baseline | 1 | get_issue | {"id":"TRK-117"} | pass | 2650 |
| t3-payload | baseline | 1 | list_issues | {"assignee":"maria","status":"open"} | fail: bad_args | 10408 |
| t3-payload | candidate | 1 | list_issues | {"assignee":"maria","status":"open","include_comments":false} | pass | 441 |
| t3-payload | candidate | 3 | list_issues | {"assignee":"maria","status":"open","include_comments":false} | pass | 441 |
| t2-status | candidate | 3 | list_issues | {"status":"in_progress","include_comments":false} | pass | 989 |
| t2-status | baseline | 3 | list_issues | {"status":"in_progress"} | pass | 18770 |
| t3-payload | candidate | 2 | list_issues | {"assignee":"maria","status":"open","include_comments":false} | pass | 441 |
| t2-status | candidate | 1 | list_issues | {"status":"in_progress","include_comments":false} | pass | 989 |
| t1-route | baseline | 3 | search_issues | {"query":"checkout page"} | pass | 6570 |
| t4-control | baseline | 3 | get_issue | {"id":"TRK-117"} | pass | 2650 |
| t3-payload | baseline | 3 | list_issues | {"assignee":"maria","status":"open"} | fail: bad_args | 10408 |
| t1-route | baseline | 1 | search_issues | {"query":"checkout page"} | pass | 6570 |
| t2-status | baseline | 1 | list_issues | {"status":"in_progress"} | pass | 18770 |
| t2-status | baseline | 2 | list_issues | {"status":"in_progress"} | pass | 18770 |
| t4-control | candidate | 2 | get_issue | {"id":"TRK-117"} | pass | 2650 |
| t4-control | candidate | 1 | get_issue | {"id":"TRK-117"} | pass | 2650 |

## Summary

```json
[
  {
    "task_id": "t1-route",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 19710
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1032
    }
  },
  {
    "task_id": "t2-status",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 56310
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 2967
    }
  },
  {
    "task_id": "t3-payload",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 0,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 31224
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1323
    }
  },
  {
    "task_id": "t4-control",
    "control": true,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 7950
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 7950
    }
  }
]
```
