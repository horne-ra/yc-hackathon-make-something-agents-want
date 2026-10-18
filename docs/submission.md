# Submission checklist

Deadline: **Sunday, October 18, 2026, 10:00 AM PT**. Preparation target: Saturday
10:00 PM PT. Submit only **Manufact Best MCP** and **Armature** tracks.

| Field | Value |
| --- | --- |
| Team | Ax Lint (confirmed by user) |
| Project | AX Lint |
| MCP server | https://fast-pulse-rlqvb.run.mcp-use.com/mcp |
| Source | https://github.com/horne-ra/yc-hackathon-make-something-agents-want |
| Manufact organization ID | 91542208-1224-4c86-a16f-99ed481abf09 |
| Organization slug | org-41c8b7a1-w8fak |
| Manufact server ID | 1df33784-bc1a-4b0a-a539-22c8ed18ab05 |
| Demo video | TODO: paste unlisted recording URL |
| Judges token location | Local gitignored `.env` → `AXLINT_API_TOKENS` → `judges.token`; also stored write-only in Manufact env |
| Sponsor submission | https://url.mcp-use.com/yc-submit (302 redirect verified) |
| Resolved sponsor form | https://docs.google.com/forms/d/e/1FAIpQLSeZ3VPtrcwQnZ7mz6Aqhb2d7WlTWvIP8rJyExtyHTBpD7sY_Q/viewform |
| YC general form, if separate | TODO: verify the event's current participant instructions; a separate form URL has not been verified |

The organization UUID and owner role were confirmed through the authenticated
Manufact whoami and server APIs, not inferred from the dashboard slug. The resolved form is “Manufact Track — Best MCP Server for Agents”; it requires
team name, endpoint, organization ID and video URL, and has optional setup
instructions. It does not expose a dedicated secret field or link a separate YC
form. Put setup instructions and the token location/contact route there, and
share the judges token through an organizer-approved private channel manually;
never place it in this file, GitHub, a video, a public URL or an evidence link.
Its limit is five verify launch attempts per UTC day; polling is unlimited. Do not submit duplicates or a
YC startup application in place of the hackathon form.

## Two-sentence description

AX Lint lets coding agents audit MCP tool interfaces, propose description-only
patches and run controlled before/after trials before changing source. Its MCP
App shows every trial, an Improved/Inconclusive/Regressed verdict and four
post-deployment confirmation gates inside the chat where the human reviews the
patch.

## Why MCP / why an MCP App

The coding agent calls AX Lint in its existing workflow and repository, and the
same hosted MCP server serves Claude Code, Codex and Cursor. The MCP App turns
verification into an inspectable in-chat result: patch, trial matrix, token costs,
verdict and actual confirmation gates. S8 caught a harmful patch before apply
and later confirmed a supported one. Evidence: [S8 milestone](s8-milestone.md),
[demo script](demo.md), [multi-client evidence table](multi-client.md).

## MCP quality

The server supplies clear tool names, titles, typed input/output schemas, all
four behavior annotations, two workflow prompts, GitHub website, icon and
instructions. Anonymous discovery and metadata audit enable scoring without a
credential; protected calls give explicit access and quota errors. Hosted
self-audit went from 25 findings to zero, and the judges smoke returned Improved
9/12 → 12/12 with all 24 trials retained. The official readiness score remains a
separate human request. Evidence: [self-audit](self-audit.md),
[method and contracts](SPEC.md), [full results](results-summary.md). Request the
official score now at [Manufact's catalog](https://manufact.com/mcp-catalog); A+ is a goal, not a claimed award or score.

## UX and scale

Setup starts with a token-free first audit, then named client credentials protect
model-cost operations. Prompts demand all files defining allowed values and
defaults, and prevent apply unless Improved. Blaxel's shared runner isolates run
directories, retains progress/results and enforces process capacity; daily judges
quota claims survive Manufact restarts. The widget lives where the human
reviews the coding agent's patch. Evidence: [setup](multi-client.md),
[shared-runner evidence](platform-notes.md), [capacity](one-time-capacity-cleanup.md).
Actual post-rotation client recordings remain a human checklist item.

## Armature fit

AX Lint tests the agent-facing interface as a product surface: whether a tool's
name, description and parameter guidance lets an agent make the right economical
call. The roadmap adds model choice, staging/reset or shadow-mode write checks,
default-change patches and pull-request CI. Evidence: [every verdict](results-summary.md)
and [specification](SPEC.md). No Armature SDK integration is claimed.

## Before pressing Submit

- Record the three-minute demo, publish its URL and verify viewing permissions.
- Retest the named credentials in Claude Code, Codex, Cursor and the Claude app;
  complete multi-client.md's evidence column with what each client really shows.
- Live deployment, anonymous audit/ping, judges verification, access/quotas,
  build/tests and secret scan have passed; see [final status](wrapup-status.md).
  Recheck baseline after any filmed apply, and keep the existing smoke separate
  from a newly recorded demo run.
- Request and link the official Manufact readiness report; do not claim A+
  before the report says so.
- Confirm Trackr is back at the frozen baseline hash after any filmed apply.
- Check sponsor and YC forms, choose only the two requested tracks, and submit
  before Sunday 10 AM PT. Upstream PR/issue drafts remain unposted.
