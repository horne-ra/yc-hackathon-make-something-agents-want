# filesystem

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Model: claude-sonnet-5-5

| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| fs-boundary | candidate | 3 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-bbOk9D/project/src"} | unscored | 105 |
| fs-control | baseline | 2 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-TJDMYq/project/package.json"} | pass | 249 |
| fs-overview | candidate | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-okfewJ/project","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]} | pass | 949 |
| fs-overview | candidate | 3 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-nyj7CY/project","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]} | pass | 949 |
| fs-boundary | baseline | 2 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-DWKkVu/project/src"} | unscored | 105 |
| fs-overview | baseline | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-1ETsXe/project"} | fail: bad_args | 701783 |
| fs-overview | candidate | 1 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-GmGrUN/project","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]} | pass | 949 |
| fs-tests | candidate | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-rmdN1L/project","excludePatterns":["node_modules",".git","dist"]} | pass | 949 |
| fs-control | candidate | 1 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-IOJrRt/project/package.json"} | pass | 249 |
| fs-boundary | baseline | 1 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-wtwiPX/project/src"} | unscored | 105 |
| fs-control | baseline | 1 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-QfT8lC/project/package.json"} | pass | 249 |
| fs-control | candidate | 3 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-V24YTN/project/package.json"} | pass | 249 |
| fs-control | candidate | 2 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-2viv0K/project/package.json"} | pass | 249 |
| fs-tests | baseline | 3 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-XYMLv6/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 441 |
| fs-tests | candidate | 1 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-lyflPe/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 435 |
| fs-tests | candidate | 3 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-NOog9P/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 435 |
| fs-overview | baseline | 3 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-sAPp9V/project"} | fail: bad_args | 701783 |
| fs-boundary | baseline | 3 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-3RLGmf/project/src"} | unscored | 105 |
| fs-overview | baseline | 1 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-Q3UxRY/project","excludePatterns":["node_modules",".git"]} | pass | 949 |
| fs-control | baseline | 3 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-lLUn81/project/package.json"} | pass | 249 |
| fs-boundary | candidate | 1 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-JC728O/project/src"} | unscored | 105 |
| fs-boundary | candidate | 2 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-dTZs5z/project/src"} | unscored | 105 |
| fs-tests | baseline | 2 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-EA0GKK/project","pattern":"**/*{test,tests,spec,__tests__}*","excludePatterns":["node_modules",".git"]} | pass | 441 |
| fs-tests | baseline | 1 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-DvUZUY/project","pattern":"**/*test*"} | fail: bad_args | 441 |

## Summary

```json
[
  {
    "task_id": "fs-overview",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 1,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1404515
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 2847
    }
  },
  {
    "task_id": "fs-tests",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 2,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1323
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1819
    }
  },
  {
    "task_id": "fs-control",
    "control": true,
    "unscored": false,
    "baseline": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 747
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 747
    }
  },
  {
    "task_id": "fs-boundary",
    "control": false,
    "unscored": true,
    "baseline": {
      "passed": null,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 315
    },
    "candidate": {
      "passed": null,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 315
    }
  }
]
```
