# Wrap-up status — final acceptance October 17, 2026, 9:00 PM PT

Engineering, documents, token rotation and live acceptance are complete. Main is
pushed; Manufact is running the tested source. The official readiness score,
native-client recording and video/form submission remain human steps below.
The user directly approved the release operations; the earlier approval blocks
are resolved. The exposed single-token key is removed locally and in Manufact.

## Each part

| Part | Status and real output |
| --- | --- |
| 1 · judging criteria | Pushed/deployed. Anonymous discovery, prompts/resources, widget assets, audit and ping pass. All five protected tools return 401 without a token. All four named tokens passed authenticated preview calls. Judges limit is 5 verify attempts per UTC day; durable counter probe accepted then refused a second claim at limit 1. quota_exceeded and fail-closed behavior pass unit tests. Hosted self-audit: 25 → 0 findings, 7 output schemas/titles/all four annotations, website/icon/instructions and both prompts. Official A+ remains unconfirmed; request the score now. |
| 2 · research merge | origin/lane/leaderboard merged into main (b9ac56f) and pushed. Only conflict was whitespace before private/ in .gitignore. private/ is ignored and git ls-files private/ is empty. Integrated typecheck and all tests pass. |
| 3 · every verdict | Pushed. One table includes compact/stability/S8/proposer Trackr runs, filesystem, both models, Memory, PopHIVE, Yahoo and private-review wording. Every original verdict stands. Provisional labels, both findings sections and static census included. The new judges smoke is separately labeled. |
| 4 · method | Pushed/deployed. New runs record scoring_version; v1 is default. v2 accepts matching first-turn parallel calls and blocks unknown/unsafe or explicitly forbidden proposals before dispatch. Frozen artifacts are unchanged. High-priority missing size-control findings fire on committed include_comments and excludePatterns. Runner payload rebuilt. |
| 5 · upstream drafts | Yahoo draft pushed. Filesystem draft already contained Commander.js 1,037,509 → 19,443 token measurements, so that edit was skipped. Both drafts remain unposted. |
| 6 · judges/agent README | README and llms.txt pushed: why MCP/App, every verdict, first call, five core tools/two prompts, setup, architecture, evidence and roadmap. |
| 7 · demo assets | Script and exact Claude Code prompt pushed, including redeploy narration and unfavorable-verdict fallback. Guarded reset dry run found baseline source and no revert needed. Final live baseline and S8 preview pass. Blaxel has 9 free VM slots and 4 free shared process slots. |
| 8 · submission | Checklist pushed. Team Ax Lint; organization UUID confirmed through owner-authenticated API. Sponsor short link resolves to the verified Manufact Google Form. Video placeholder remains. No separate YC general form was linked or verified. |

## Running deployment

Final runtime source: `d609a2453f236041532079c87ab4b45ae74eaddb` on main.
Manufact deployment: `a37fee9a-9b47-4242-8095-8be28a2239dc`, **running and active**.
Endpoint: <https://fast-pulse-rlqvb.run.mcp-use.com/mcp>, server version **0.4.0**.
[Deployment proof](evidence/wrapup/ping-deployment.json).
The initial release at a7495a6 also reached running before the judges run;
[its record](evidence/wrapup/deployment.json) is retained. The follow-up makes
ping a 447-byte connectivity summary, with complete historical trial files
preserved. Subsequent documentation-only commits do not change this runtime.

## Final local checks: actual output

The final runtime change passed:

```text
typecheck: exit 0
Test Files  18 passed (18)
Tests  170 passed (170)
[mcp-use] built src/server.ts + views (ping, preview-run, verification-result)
  → .mcp-use/build/index.js (2099ms)
Frozen evidence unchanged since research integration.
private/ tracked files: 0
Post-rotation full reachable history + tracked worktree scan:
  8 configured secret values + 4 credential pattern families
  findings: []
```

[Machine-readable checks](evidence/wrapup/local-checks.json),
[typecheck](evidence/wrapup/typecheck.log), [tests](evidence/wrapup/test.log),
[build](evidence/wrapup/build.log), [post-rotation scan](evidence/wrapup/secret-scan-after-rotation.json),
[final staged/history scan](evidence/wrapup/secret-scan-final.json).
The scanner covers configured credentials and common patterns; other formats
can exist. The pre-rotation scan also checked the retired token and found no
matches. All newly staged evidence is scanned again before its final commit.

Actual local HTTP integration output:

```text
PASS real HTTP auth: anonymous initialize/tools/resources/prompts/widget JS+CSS;
all five protected tools reject missing/wrong/malformed bearer with 401;
named bearer preview succeeds; public icon; no OAuth challenge
```

The atomic quota test runs 12 independent concurrent processes: exactly five
claims succeed, subsequent same-day claims fail, and a new day is available.
Gate tests check quota_exceeded, invalid-input nonconsumption, polling and
fail-closed storage errors. Hosted acceptance separately checked all five 401s
and the real persistent counter's allowed=true then allowed=false responses.

## Live judges run and final readback

**Provisional: 3 trials per condition.** Exactly one judges verification ran:

```text
verdict: Improved
model: claude-sonnet-5-5; provider-default sampling, no temperature
scoring_version: v1
passes: 9/12 → 12/12
returned-result tokens: 115,194 → 13,917
static tool tokens: 651 → 955
trials retained: 24, including every baseline failure
```

The candidate is the committed corrected-runner input, distinct from the frozen
compact patch (837 static tokens) and recorded S8 milestone (903). No proposal
was generated and no source edit was applied. The later deployment read the same
completed result back unchanged; no second verification was started.
[Judges report](judges-smoke.md), [all trials](evidence/wrapup/judges-complete.json),
[polls](evidence/wrapup/judges-polls.json), [full smoke](evidence/wrapup/smoke-summary.json),
[final read-only acceptance](evidence/wrapup/final-hosted-checks.json).

Hosted public checks passed: tools/list, both prompts, resources/read, widget
JS/CSS HTTP 200, audit_server on Trackr, self-audit with zero findings, ping and
all five protected missing-token 401s. All named credentials authenticated.
Self-audit static cost is 4,612 → 5,080 tokens; improved coverage adds metadata.
[Before/after](self-audit.md).

Judges quota on UTC day October 18: **1 used, 4 remaining of 5**. Reset is Sunday,
October 18, **5 PM PT** (00:00 UTC October 19). Polling/preview do not use quota.
Use the claude credential for rehearsals to preserve judges' remaining allowance.

## Trackr and demo readiness

Final live state at 9:00 PM PT:

- Version: `trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96`.
- Tools hash: `sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5` — **baseline**.
- Blaxel: 1 occupied VM, 9 free VM slots; shared runner 0 active / 4 free process slots.
- preview_run: recorded milestone `axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d`, fixture=true, four confirmation gates passed.

[Current readiness record](evidence/wrapup/demo-readiness.json).
The actual reset dry run reported local HEAD ad88596b, baseline source, “Already
at frozen baseline source; no revert or push needed,” and no mutation/fetch/push
or Railway/MCP calls. The live hash above comes from separate real metadata
checks. No Trackr reset was needed after this smoke because no patch was applied.

## Human handoff

1. **Copy each token locally:** open
   `/Users/ransomhorne/Documents/ChatGPT/AX Lint/.env`, find AXLINT_API_TOKENS,
   and copy codex.token, cursor.token, claude.token or judges.token as needed.
   The local file is mode 0600. Manufact env is already updated: named JSON and
   AXLINT_QUOTA_SANDBOX are write-only; the old AXLINT_API_TOKEN key is gone.
   Do not print tokens or paste them into chat, source, recordings or public URLs.
2. **Update clients:** Claude app connector → No sign-in + Authorization header
   `Bearer ` followed by claude.token; reconnect. Claude Code → the literal
   AXLINT_CLAUDE_TOKEN header reference and launch with that selected token.
   Codex → bearer_token_env_var=AXLINT_CODEX_TOKEN from codex.token. Cursor →
   Authorization header using AXLINT_CURSOR_TOKEN from cursor.token. The
   token launcher and exact config examples are in [multi-client.md](multi-client.md).
   Complete actual native-client recordings; the new HTTP credential checks do
   not establish a new client video. Prior human widget confirmations stand.
3. **Request the official score now:** paste the public endpoint into
   [Manufact's MCP catalog](https://manufact.com/mcp-catalog). Link the resulting
   official report; A+ is not yet a confirmed grade.
4. **Record and submit:** use [demo.md](demo.md), put an accessible video URL in
   [submission.md](submission.md), fill the multi-client evidence column, and
   verify any separate YC/Armature form from participant instructions. Team and
   organization ID are already filled. Choose only Manufact Best MCP and
   Armature. Upstream drafts remain for you to post.

Engineering and document preparation finished before the Saturday 10 PM target. Submission is due
**Sunday, October 18, 10:00 AM PT**. The video, official score and manual client
checks are the remaining dependencies for submission.
