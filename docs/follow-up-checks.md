# Follow-up checks — October 17, 2026

All requested work is on main. The active Trackr checkout and Railway endpoint were never accessed during these follow-ups. Frozen benchmark artifacts and trial outcomes are unchanged. No PR was opened.

## 1. Merge and validate

Merged origin/lane/filesystem (069d304), then origin/lane/models (4dde5f8), and pushed main. Both merges were clean; package.json and lockfile are unchanged.

```text
pnpm typecheck: exit 0
Test Files 5 passed (5)
Tests 66 passed (66)
```

## 2. Real-repository size measurement

Pushed 161139c. Commander.js v13.1.0, commit e6f56c888c96d1339c2b974fee7e6ba4f2e3d218, was cloned into a temporary directory; npm ci exited 0 without changing its pinned lockfile. The official filesystem server remained at bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c. No generation calls; two countTokens calls.

```text
PASS npm ci; pinned package-lock unchanged
PASS pinned official server; tools/list exactly equals frozen 14-tool baseline
MEASURE unfiltered: 9985 tree files; 1477 directories; 1037509 full-response tokens (3470786 chars)
MEASURE excluded: 219 tree files; 12 directories; 19443 full-response tokens (43484 chars)
PASS temporary clone and install cache deleted; no model generation calls
```

Both full MCP response fields are counted, including repeated tree content. Tree files include symbolic links. This is a measurement of explicit tool calls, separate from behavioral benchmark results. The original filesystem report was preserved byte-for-byte as a prefix, with only a new section appended. [Report and raw response links](filesystem-results.md#real-repository-size-check).

## 3. Upstream PR draft

Pushed f5155e6. [Draft](upstream-pr-filesystem.md) cites issue #1077 and PR #623, uses the real-repository measurements, reports 4/9→9/9 provisional synthetic-task passes and the +172 static-token cost, and embeds the exact frozen three-description diff with portable paths.

```text
PASS portable diff applies to pinned base; exact frozen hunks and PR diff agree
PASS compiled draft tools/list exactly equals frozen candidate: all 14 tools, three description edits, unchanged remaining metadata
PASS temporary source copy removed; original vendor source untouched; zero model calls; no PR opened
pnpm typecheck: exit 0
```

## 4. Results summary

Pushed 3947139. [One-page summary](results-summary.md) covers Trackr, filesystem, cross-model costs, and Memory's null result, all from committed reports.

```text
PASS one-page summary: 412 words; four provisional labels; all local source reports exist
```

The cost gap is mainly Haiku's lower unit price; the patch enabled matching/exceeding Sonnet baseline task success in this benchmark. The estimate is one model turn only.

## 5. Reset script — written; only fixture dry runs tested

[scripts/reset-trackr-baseline.ts](../scripts/reset-trackr-baseline.ts) defaults to an offline dry run. With --execute later, it fetches/synchronization-checks main, plans metadata-only commits after the verified baseline, creates one new revert commit, pushes normally, and waits for Railway's new full commit SHA plus the exact frozen tools hash. It never force-pushes or rewrites history. Mixed commits, merge commits affecting tools, behavior/format changes, dirty tracked files, and diverged history stop the process. An unexpected revert or verification error is reported rather than pushing an unverified source state.

The fixtures were constructed entirely from already committed source/proposal evidence. They use a Git shim allowing only local read commands and a localhost sentinel instead of Railway. Every fixture file, HEAD, index and ref was checked unchanged by the dry run. No command ran against the real Trackr checkout, and no Railway request was sent.

```text
PASS baseline dry run: no revert planned; complete repo content/HEAD/index/refs unchanged
PASS patched dry run: exactly one metadata commit planned; unrelated commit preserved; complete repo unchanged
PASS behavior-change dry run: rejected before mutation; complete repo unchanged
PASS Git command audit: only local read commands; mutation/fetch/push disabled by shim
PASS temporary fixture deleted; active Trackr repo/Railway never accessed; --execute never run
pnpm typecheck: exit 0
```

[Dry-run check program](../scripts/check-reset-trackr-dry-run.ts) · [retained check output](../scripts/reset-evidence/checks.log) · [planned fixture revert](../scripts/reset-evidence/metadata-patch.log) · [Git command audit](../scripts/reset-evidence/git-read-commands.log).

**Not run:** --execute, any live-repository dry run/read, actual revert/commit/push in Trackr, or Railway deployment/poll. Those remain intentionally untested until the user finishes S8 and requests the reset. When authorized later, from the AX Lint checkout:

```sh
pnpm exec tsx scripts/reset-trackr-baseline.ts --execute
```

The non-mutating default command is pnpm exec tsx scripts/reset-trackr-baseline.ts --dry-run; do not run it on the active checkout during S8. No new dependencies or product runtime changes were required. Waiting for the user's next instruction.
