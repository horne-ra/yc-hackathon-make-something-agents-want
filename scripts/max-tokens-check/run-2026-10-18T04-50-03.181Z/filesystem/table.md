# filesystem

Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Model: claude-sonnet-5-5

| Task | Condition | Trial | Tool | Arguments | Pass | Result tokens |
| --- | --- | --- | --- | --- | --- | --- |
| fs-boundary | candidate | 3 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-lmMOJw/project/src"} | unscored | 105 |
| fs-control | baseline | 2 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-5sVi9X/project/package.json"} | pass | 249 |
| fs-overview | candidate | 3 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-mDCGKS/project","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]} | pass | 949 |
| fs-overview | candidate | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-wV5ZvB/project","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]} | pass | 949 |
| fs-boundary | baseline | 2 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-ImKOsF/project/src"} | unscored | 105 |
| fs-overview | baseline | 2 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-AusIph/project"} | fail: bad_args | 701783 |
| fs-overview | candidate | 1 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-xKPwk1/project","excludePatterns":["node_modules",".git","dist","build","__pycache__",".venv"]} | pass | 949 |
| fs-tests | candidate | 2 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-4KZvcr/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 441 |
| fs-control | candidate | 3 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-2wC8OO/project/package.json"} | pass | 249 |
| fs-control | candidate | 1 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-Ldrhnv/project/package.json"} | pass | 249 |
| fs-boundary | baseline | 1 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-m2BGcV/project/src"} | unscored | 105 |
| fs-control | baseline | 1 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-rkKbTK/project/package.json"} | pass | 249 |
| fs-control | candidate | 2 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-QPE53M/project/package.json"} | pass | 249 |
| fs-tests | candidate | 1 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-HdWdgq/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 441 |
| fs-tests | candidate | 3 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-rOQ6Ug/project","pattern":"**/*test*","excludePatterns":["node_modules",".git"]} | pass | 453 |
| fs-tests | baseline | 3 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-LR5vTi/project","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]} | pass | 441 |
| fs-overview | baseline | 3 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-Jl0SKc/project","excludePatterns":["node_modules",".git"]} | pass | 949 |
| fs-control | baseline | 3 | read_text_file | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-NAOcYV/project/package.json"} | pass | 249 |
| fs-boundary | candidate | 1 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-UfDMRB/project/src"} | unscored | 105 |
| fs-boundary | baseline | 3 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-8LGiOi/project/src"} | unscored | 105 |
| fs-overview | baseline | 1 | directory_tree | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-dfJ2PV/project","excludePatterns":["node_modules",".git"]} | pass | 949 |
| fs-boundary | candidate | 2 | list_directory | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-PxNiPX/project/src"} | unscored | 105 |
| fs-tests | baseline | 2 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-L4HY53/project","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]} | pass | 435 |
| fs-tests | baseline | 1 | search_files | {"path":"/private/var/folders/6b/z4bypdqs1xv07hx87pnhcjy00000gn/T/axlint-filesystem-trial-Hdd1CB/project","pattern":"**/*test*","excludePatterns":["node_modules/**",".git/**"]} | pass | 447 |

## Summary

```json
[
  {
    "task_id": "fs-overview",
    "control": false,
    "unscored": false,
    "baseline": {
      "passed": 2,
      "of": 3,
      "infra_errors": 0,
      "insufficient_data": false,
      "result_tokens": 703681
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
      "passed": 3,
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
      "result_tokens": 1335
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
