# Every S6 trial retained

All prompts/tasks are unchanged; all conditions use provider default sampling with no temperature. These are three separate runs/candidates.

## Local frozen compact

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Verdict: improved; totals {"baseline": {"passed": 9, "of": 12, "result_tokens": 115194}, "candidate": {"passed": 12, "of": 12, "result_tokens": 13272}}

| Task | Condition | Trial | Tool | Arguments | Pass/failure | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| t1-route | baseline | 1 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | baseline | 2 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | baseline | 3 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | candidate | 1 | search_issues | {"include_comments": false, "query": "checkout page"} | pass | 344 |
| t1-route | candidate | 2 | search_issues | {"include_comments": false, "query": "checkout page"} | pass | 344 |
| t1-route | candidate | 3 | search_issues | {"include_comments": false, "query": "checkout page"} | pass | 344 |
| t2-status | baseline | 1 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | baseline | 2 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | baseline | 3 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | candidate | 1 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t2-status | candidate | 2 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t2-status | candidate | 3 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t3-payload | baseline | 1 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | baseline | 2 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | baseline | 3 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | candidate | 1 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t3-payload | candidate | 2 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t3-payload | candidate | 3 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t4-control | baseline | 1 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | baseline | 2 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | baseline | 3 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 1 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 2 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 3 | get_issue | {"id": "TRK-117"} | pass | 2650 |

## Superseded first F proposal

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Verdict: inconclusive; totals {"baseline": {"passed": 9, "of": 12, "result_tokens": 115194}, "candidate": {"passed": 11, "of": 12, "result_tokens": 17148}}

| Task | Condition | Trial | Tool | Arguments | Pass/failure | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| t1-route | baseline | 1 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | baseline | 2 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | baseline | 3 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | candidate | 1 | search_issues | {"include_comments": false, "query": "checkout"} | pass | 559 |
| t1-route | candidate | 2 | search_issues | {"include_comments": false, "query": "checkout"} | pass | 559 |
| t1-route | candidate | 3 | search_issues | {"include_comments": false, "query": "checkout"} | pass | 559 |
| t2-status | baseline | 1 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | baseline | 2 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | baseline | 3 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | candidate | 1 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t2-status | candidate | 2 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t2-status | candidate | 3 | list_issues | {"include_comments": false, "limit": 200} | bad_args | 4220 |
| t3-payload | baseline | 1 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | baseline | 2 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | baseline | 3 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | candidate | 1 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t3-payload | candidate | 2 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t3-payload | candidate | 3 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t4-control | baseline | 1 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | baseline | 2 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | baseline | 3 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 1 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 2 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 3 | get_issue | {"id": "TRK-117"} | pass | 2650 |

## Corrected F V2 proposal

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Verdict: improved; totals {"baseline": {"passed": 9, "of": 12, "result_tokens": 115194}, "candidate": {"passed": 12, "of": 12, "result_tokens": 13917}}

| Task | Condition | Trial | Tool | Arguments | Pass/failure | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| t1-route | baseline | 1 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | baseline | 2 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | baseline | 3 | search_issues | {"query": "checkout page"} | pass | 6570 |
| t1-route | candidate | 1 | search_issues | {"include_comments": false, "query": "checkout"} | pass | 559 |
| t1-route | candidate | 2 | search_issues | {"include_comments": false, "query": "checkout"} | pass | 559 |
| t1-route | candidate | 3 | search_issues | {"include_comments": false, "query": "checkout"} | pass | 559 |
| t2-status | baseline | 1 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | baseline | 2 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | baseline | 3 | list_issues | {"status": "in_progress"} | pass | 18770 |
| t2-status | candidate | 1 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t2-status | candidate | 2 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t2-status | candidate | 3 | list_issues | {"include_comments": false, "status": "in_progress"} | pass | 989 |
| t3-payload | baseline | 1 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | baseline | 2 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | baseline | 3 | list_issues | {"assignee": "maria", "status": "open"} | bad_args | 10408 |
| t3-payload | candidate | 1 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t3-payload | candidate | 2 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t3-payload | candidate | 3 | list_issues | {"assignee": "maria", "include_comments": false, "status": "open"} | pass | 441 |
| t4-control | baseline | 1 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | baseline | 2 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | baseline | 3 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 1 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 2 | get_issue | {"id": "TRK-117"} | pass | 2650 |
| t4-control | candidate | 3 | get_issue | {"id": "TRK-117"} | pass | 2650 |

