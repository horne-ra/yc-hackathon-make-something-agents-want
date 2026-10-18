# Hosted judges smoke — October 17, 2026

**Provisional: 3 trials per condition.** This is a new deployment smoke run, not a replacement for a frozen benchmark or an estimate of reliability.

The real judges credential started exactly one verification against unchanged baseline Trackr. The committed corrected-runner candidate was used directly; no proposal model call, source apply, commit or Railway redeploy occurred on Trackr. Its candidate static cost is **955**, distinct from the frozen compact patch’s **837** and the recorded S8 milestone’s **903**.

| Measure | Baseline | Candidate |
| --- | ---: | ---: |
| Passes | 9/12 | 12/12 |
| Returned-result tokens | 115,194 | 13,917 |
| Static tool tokens | 651 | 955 |

**Verdict: Improved.** All 24 trials, including all three baseline payload failures, are retained. The one-turn model does not consume the returned results.

| Task | Baseline passes | Candidate passes | Returned tokens baseline → candidate |
| --- | ---: | ---: | ---: |
| t1-route | 3/3 | 3/3 | 19,710 → 1,677 |
| t2-status | 3/3 | 3/3 | 56,310 → 2,967 |
| t3-payload | 0/3 | 3/3 | 31,224 → 1,323 |
| t4-control | 3/3 | 3/3 | 7,950 → 7,950 |

Model: `claude-sonnet-5-5`; provider-default sampling, no temperature; scoring_version=`v1`. The exact run config is in the raw result. This uses the legacy first-call runner; v2 was not used to obtain or improve these scores.

Run ID: `axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.373d9bcb-163e-4fba-8e75-3ce1fef2a443`.

Baseline identity before and after: `trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96`, tools hash `sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5`. No confirmation is claimed for this smoke because no candidate was applied.

The launch spent one judges allowance; the final read-only check records the actual remaining allowance without resetting counters. Daily quota claims are persistent on the shared runner.

[Complete result, every trial and live viewer payload](evidence/wrapup/judges-complete.json) · [Poll history](evidence/wrapup/judges-polls.json) · [Launch](evidence/wrapup/judges-launch.json) · [Public/auth/quota smoke checks](evidence/wrapup/smoke-summary.json).
