# Three-minute demo

**Provisional: 3 trials per condition.** Keep the frozen compact result separate
from the historical S8 replay and from any new live proposal. Do not replace an
unfavorable live result with a favorable one without saying it is a replay.

## Preflight

Use [client setup](multi-client.md) and [submission checklist](submission.md).
Confirm Trackr is baseline: tools hash
`sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5`.
Dry-run from the AX Lint repo:

```sh
node --import tsx scripts/reset-trackr-baseline.ts --dry-run --repo /Users/ransomhorne/Documents/trackr
```

This checks local Git/source only. The separate live smoke check must confirm
current tools/list; a dry run's printed frozen hash is not a live observation.
Check free process slots on the shared Blaxel runner, anonymous audit and ping,
and an authenticated preview_run. Keep the historical S8 widget ready. Use
claude.token for rehearsal; preserve judges' limited verify allowance.
Do not record `.env`, bearer headers, private/, client settings with secrets, or
a terminal command that expands credentials. Keep the token in the client env.

## Recording timeline

| Time | Screen and action | Narration |
| --- | --- | --- |
| 0:00–0:20 | Claude Code in Trackr; connect to the same hosted AX Lint URL | “Agents are our users. Tool descriptions are part of the interface. AX Lint tests whether a metadata change helps before we apply it.” |
| 0:20–0:45 | Run public audit_server; show high-priority missing size-control finding | “No sign-in for the first useful call. This audit never executes target tools. Missing response-size guidance is our strongest demonstrated failure pattern.” |
| 0:45–1:15 | propose_patch with tools, validation and handlers; show diff and start verify | “We supply every allowed value and default from source. The patch changes descriptions only. Blaxel runs both conditions with the same tasks and model.” |
| 1:15–1:35 | Poll get_verification_result; show all trials and actual verdict | “Three trials per condition: provisional. Frozen compact Trackr rose 9/12 to 12/12 with 88.5% fewer returned tokens; this live patch has its own measurements.” |
| 1:35–2:20 | If Improved, apply exact edits, commit/push, and wait for Railway | Use the redeploy narration below. If another verdict, skip apply and use the labeled S8 replay. |
| 2:20–2:35 | confirm_patch; show all four gates | “Same deployment, new revision, and exact candidate metadata. This verifies what actually shipped.” |
| 2:35–2:50 | Codex then Cursor each calls tools on the same AX Lint URL | “The same MCP server works across coding clients; each uses its own named credential.” |
| 2:50–3:00 | Claude app shows verdict widget; finish on evidence links | “The human reviews the verdict inside chat. We retain wins, regressions and inconclusive results.” |

Latency can exceed this schedule. Record a full honest run first, then edit wait
time with a visible cut. Do not imply that a replay or cut is live. Three-minute
submission should retain setup → tool call → result and both extra clients.

## Exact Claude Code prompt

```text
We are in /Users/ransomhorne/Documents/trackr. Use the already configured
axlint MCP server at https://fast-pulse-rlqvb.run.mcp-use.com/mcp.
Audit https://trackr-production-e1a6.up.railway.app/mcp. Read src/tools.ts,
src/validation.ts and src/handlers.ts, plus any imports that define accepted
values or defaults. Select the missing include_comments size-control finding,
the list/search overlap finding and the status allowed-values finding by their
content, not array position. Propose a compact metadata-only patch with all
source files, and review any warnings. Use the four unchanged pre-registered
tasks from /Users/ransomhorne/Documents/ChatGPT/AX Lint/runner/evidence/corrected-input.json,
with trials=3, model=default and scoring_version=v1. Call verify_patch and poll
get_verification_result to completion. Report every failure, verdict and token
count. Apply the exact proposed source edits ONLY for Improved. If Improved,
commit and push, wait for Railway's new revision, then call confirm_patch with
that exact SHA and report all four gates. For Inconclusive or Regressed, leave
source unchanged and explain why. Never print credentials or read private/.
```

## During the Railway redeploy (~44 seconds)

“Railway took 43.6 seconds in the recorded S8 milestone; we're waiting for this
run's actual deployment. A patch can reduce returned context while increasing
static descriptions, so we report both. On the official filesystem server,
passes rose 4/9 to 9/9. A separate Commander.js size check went from about 1,037K
to 19K tokens by excluding dependency and Git directories. Memory, PopHIVE and
Yahoo Finance did not clear our improvement threshold. We publish those too.
The roadmap is model choice, safe write-tool checks, default changes, and CI.”

## If the live verdict is Inconclusive or Regressed

“AX Lint didn't approve this patch, so we won't apply it. That is the gate doing
its job. In S8 attempt 1, supplying only tools.ts produced a harmful description
change: 9/12 fell to 6/12, and verification caught it before apply. With complete
source, a later S8 patch passed all four confirmation gates. Here is that
**recorded S8 milestone**, not a replacement live score.”

Call preview_run in the Claude app. Its static count is 903 and its returned
result count is 13,917; do not label it the frozen compact patch's 837 / 13,272.
Recorded confirmation is historical, never confirmation of today's baseline.

## Extra-client copy-paste calls

In Codex, then Cursor: “Use axlint.audit_server on
https://trackr-production-e1a6.up.railway.app/mcp, then use
axlint.get_verification_result for [the actual run_id from Claude Code]. Report
the same verdict without applying any source edit.” In the Claude app, call that
same run_id for the live widget, or preview_run for the explicitly labeled S8
fallback. Fill the evidence column in multi-client.md with each real recording.

After a successful live apply, restore baseline with the guarded reset script
only after checking its dry run; use a new revert commit and verify the live hash.
The wrap-up smoke itself verifies descriptions in memory and never applies them.
