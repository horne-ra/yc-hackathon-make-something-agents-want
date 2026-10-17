# filesystem

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Model: claude-sonnet-5-5

| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| fs-control | baseline | 2 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-pCvjc1/project/package.json"} | pass | 249 |
| fs-boundary | candidate | 3 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-yzZkjx/project/src"} | unscored | 105 |
| fs-overview | candidate | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-u6JPGl/project","excludePatterns":["node_modules",".git","dist"]} | pass | 949 |
| fs-overview | candidate | 3 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-Fwix9w/project","excludePatterns":["node_modules",".git","dist"]} | pass | 949 |
| fs-boundary | baseline | 2 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-TEO5JU/project/src"} | unscored | 105 |
| fs-overview | candidate | 1 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-ayZcnO/project","excludePatterns":["node_modules",".git","dist"]} | pass | 949 |
| fs-overview | baseline | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-ekt2xW/project"} | fail: bad_args | 701783 |
| fs-tests | candidate | 2 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-Bbafa9/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 441 |
| fs-boundary | baseline | 1 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-H8YRRi/project/src"} | unscored | 105 |
| fs-control | candidate | 3 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-xfqgWD/project/package.json"} | pass | 249 |
| fs-control | baseline | 1 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-3OgPG7/project/package.json"} | pass | 249 |
| fs-control | candidate | 1 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-QHTVJj/project/package.json"} | pass | 249 |
| fs-control | candidate | 2 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-a6zp04/project/package.json"} | pass | 249 |
| fs-tests | candidate | 3 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-zeXczS/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 435 |
| fs-tests | candidate | 1 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-HCdT6c/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 441 |
| fs-tests | baseline | 3 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-48117W/project","pattern":"**/*test*"} | fail: bad_args | 423 |
| fs-overview | baseline | 3 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-imjY5M/project"} | fail: bad_args | 701783 |
| fs-control | baseline | 3 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-pyq2oc/project/package.json"} | pass | 249 |
| fs-boundary | baseline | 3 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-FmMA4g/project/src"} | unscored | 105 |
| fs-overview | baseline | 1 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-xmsni3/project"} | fail: bad_args | 701783 |
| fs-boundary | candidate | 1 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-q4SjzY/project/src"} | unscored | 105 |
| fs-boundary | candidate | 2 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-yhyNDN/project/src"} | unscored | 105 |
| fs-tests | baseline | 2 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-LHy1Zs/project","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]} | pass | 447 |
| fs-tests | baseline | 1 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-UwAReD/project","pattern":"**/*test*"} | fail: bad_args | 435 |

## Summary

```json
[
  {
    "task_id": "fs-overview",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 0,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 2105349
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
      "passed": 1,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1305
    },
    "candidate": {
      "passed": 3,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 1317
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
