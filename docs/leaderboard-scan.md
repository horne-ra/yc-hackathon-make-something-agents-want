# Leaderboard static scan

Manufact’s servers: reviewed separately; results shared with the Manufact team first.

Snapshot: 2026-10-17T23:17:33.903631+00:00. Collection/report: 2026-10-18T00:26:13.431Z. Status: **complete**. Public dataset: 2672 entries. Every risk flag is a **static hypothesis**. No target tool or model trial was executed for this public leaderboard scan. [Dataset](../scripts/leaderboard/servers.json), [view/page coverage](../scripts/leaderboard/views.json), [collection status](../scripts/leaderboard/scrape-progress.json).

Coverage: 2672 public detail pages collected; 446 anonymous tools/list snapshots; 432 provider token counts and 14 unavailable counts. [Summary](../scripts/leaderboard/summary.json) · [Coverage, dispatch, rate and publication checks](../scripts/leaderboard/verification.json).

## Headline numbers — static heuristics

Screened **2,672 public catalog entries**; **446** yielded complete anonymous tool-definition snapshots. Among **432** available provider counts, median static tool-definition cost is **4,018 tokens** and the 90th percentile is **20,431 tokens**. 14 counts are unavailable. These describe static definitions, not runtime responses or measured behavior.

**148 A or A+ entries** carry at least one context-cost heuristic flag, among 195 A/A+ entries with a complete live audit (280 A/A+ entries in the public census). Unscreenable entries have unknown flags, not zero.

Static Spearman correlation of per-tool documentation score with context-cost flag count: **-0.105** (1338 name-matched tools, 126 servers); **-0.252** (410 identical-definition tools, 49 servers). No behavioral, causal, or significance claim.

Ten largest available static tool-definition costs (catalog entries; unavailable counts cannot be ranked):

| Server | Static tool-definition tokens |
|---|---:|
| [Well](https://manufact.com/mcp-catalog/well) | 528,309 |
| [Drry](https://manufact.com/mcp-catalog/drry) | 343,394 |
| [Spoks](https://manufact.com/mcp-catalog/spoks) | 146,315 |
| [Gorgias MCP](https://manufact.com/mcp-catalog/gorgias-mcp) | 123,558 |
| [CivilQuants](https://manufact.com/mcp-catalog/civilquants) | 121,245 |
| [athenahq](https://manufact.com/mcp-catalog/athenahq) | 107,692 |
| [Knips](https://manufact.com/mcp-catalog/knips) | 103,358 |
| [Aisle Wedding](https://manufact.com/mcp-catalog/aisle-wedding) | 85,449 |
| [Fieldwerk](https://manufact.com/mcp-catalog/fieldwerk) | 84,624 |
| [Blynk](https://manufact.com/mcp-catalog/blynk) | 78,016 |

Median uses the middle observation(s); p90 uses nearest rank. Statistics include available counts only and retain distinct catalog entries that may share an endpoint. [Exact headline data and method](../scripts/leaderboard/headline-numbers.json).

The HTML supplies the complete leaderboard as initialResult. The public client filters community entries and the 12 categories locally, and Show more reveals 100 more local entries. All 26 views were reconstructed with the site’s exact category aliases and grade thresholds; the source code URLs/hashes are in [site-semantics.json](../scripts/leaderboard/site-semantics.json). Private entries are withheld, leaving their original rank gaps. Unknown legacy categories are retained in All.

Collection used `AX Lint hackathon research`, a 1.05-second minimum interval, and the published [robots.txt](https://manufact.com/robots.txt). Only public HTML pages and public client assets were read; disallowed `/api/` endpoints were not used. A 401/403/429 or challenge on catalog collection stops that part without bypassing it. HTTP/page failures remain in the collection evidence. Earlier null-metadata parser errors were corrected and are retained as resolved collector errors in [collection-attempt-errors.json](../scripts/leaderboard/collection-attempt-errors.json); they are not target-tool failures or model trials.

Live screening sends initialize, the required initialized notification, and all tools/list pages. HTTP GET/SSE is used only for transport. It sends no credentials to third parties, follows no redirects, caps request time at 8 seconds and a server attempt at 30 seconds, and spaces requests at least 1.05 seconds per host. Raw metadata/results and request methods/statuses are saved under [screen/](../scripts/leaderboard/screen/). The transport rejects all other outbound RPC methods, including tools/call. Full tools/list pages, including annotations and output schemas, are retained.

Core findings use the same `auditTools` implementation as `audit_server`. Static tool tokens use its exact `countStaticTokens`: Anthropic countTokens input tokens with tools minus the same prompt without tools, using AXLINT_MODEL and no generation or temperature. This counts the provider tool envelope (names/descriptions/input schemas), not output schemas, annotations, tool results, an agent conversation, or end-to-end cost. Missing counts are unavailable, never approximated or reported as zero. Some native MCP tool names or top-level schema compositions are rejected by Anthropic’s tool-envelope validation; sanitized 400 explanations are retained rather than renaming tools or flattening their schemas to force a count.

The extra context-cost screen walks nested schemas for size controls, notes size/cost wording, flags numeric defaults ≥50 (from the schema or explicit default wording), true include controls, and broad all/full/raw/deep default modes, broad-scope language, and overlapping read-tool resource names without cross-references. These are heuristics: documented or safely bounded behavior can still trigger them. The full parameter inventory and exact flagged text are in each screen file. The report does not rank servers by raw flag counts.

An anonymous metadata connection does not establish anonymous tool execution, absence of per-tool login, backend limits, or pricing. Credentials are “none for metadata” when that alone was verified. Free/paid is reported only where the catalog explicitly states it; unknown pricing stays unknown. A review having used auth is retained as evidence rather than treated as proof that anonymous metadata is blocked. HTTP 401 is an authentication failure; a bare 403 is labeled forbidden/blocked with credentials unknown, not treated as proof that login would resolve it.

## Documentation score versus context-cost flags

This is a **static correlation, not measured behavior**. Name-matched cohort: 1338 tools across 126 servers; Spearman ρ = -0.105. Identical-definition cohort: 410 tools across 49 servers; ρ = -0.252. 88 name-matched tools score ≥90 while retaining a risk flag. [Pairs and method](../scripts/leaderboard/static-correlation.json).

A high documentation score can coexist with response-size or routing hypotheses. The heuristics and the documentation review measure different properties. Imported overall checklist scores are not documentation scores; missing per-tool reviews are excluded. Metadata drift, parameter count, toolset size, duplicated endpoints, and paired tools within a server confound these descriptive associations. No p-value, causal effect, failure rate, or runtime token saving is inferred.

## Candidate benchmarks — drafts for selection

The five proposals below are hypotheses for user review. They connected anonymously for metadata and advertise read-only tools. Tool execution, usable backend access, and plan limits remain untested. Freeze concrete inputs, expected tool/arguments, complete metadata, model ID, and a description-only candidate before approval; do not run them from this scan. Writes/destructive/unknown tools must be blocked at dispatch and scored wrong_tool. Any empty result or transport/tool error must remain visible.

These draft tasks require revision to natural user phrasing before any future approval. None of these five servers is selected for execution today.

### Robtex Network Intelligence — 100/A+

[Catalog](https://manufact.com/mcp-catalog/robtex-network-intelligence) · [Full definitions and findings](../scripts/leaderboard/screen/robtex-network-intelligence.json). The overall score is an imported checklist score; no per-tool documentation score is implied.

Hypothesis: Reverse-IP tools overlap, the generic lookup defaults to only A records, and reverse-lookup pages default to 100 hostnames. A dual-stack or historical question may choose the wrong projection, while a five-result question may inherit a large page. Both descriptions already give useful scope clues; failure is not assumed.

Exact excerpt, `reverse_lookup_ip`: “Searches both A and AAAA records.”

Exact excerpt, `historic_reverse_lookup_ip`: “Find hostnames that *previously* pointed to a specific IP address but no longer do.”

Proposed tasks:

1. Show one page of at most five current hostnames pointing to IPv6 address 2606:4700:4700::1111. Pass: reverse_lookup_ip with that exact ip, limit=5, offset omitted/0; also accept reverse_lookup_dns_records with that exact value, record_type=AAAA, limit=5, offset omitted/0. The generic A default fails.
2. Show at most three hostnames that previously pointed to 1.1.1.1 and no longer do. Pass: historic_reverse_lookup_ip; ip=1.1.1.1, limit=3, offset omitted or 0. Current reverse lookup fails.
3. Find just two hostnames currently using the mail server aspmx.l.google.com. Pass: reverse_lookup_mx with mx_server=aspmx.l.google.com, limit=2, offset omitted/0; also accept reverse_lookup_dns_records with value=aspmx.l.google.com, record_type=MX, limit=2, offset omitted/0. Its generic A default fails.

Control: Look up the DNS records for example.com. Pass: lookup_dns with hostname=example.com and no reverse-lookup call.

Read-only allowlist (server hints; destructiveHint true excluded): `latest_lightning_channels`, `ip_reputation`, `lookup_dns`, `reverse_lookup_dns_records`, `reverse_lookup_mx`, `reverse_lookup_ns`, `reverse_lookup_ip`, `historic_reverse_lookup_ns`, `historic_reverse_lookup_mx`, `historic_reverse_lookup_ip`, `lookup_mac`, `lookup_as_whois`, `lookup_lightning_node`, `lookup_lightning_channel`, `lookup_lightning_channels_per_node`, `get_recommended_lightning_peers`, `search_lightning_nodes_by_alias`, `domain_rdap`, `parse_hostname`, `is_subdomain`, `registered_domain`, `tld_info`, `reverse_lookup_cname`, `historic_reverse_lookup_cname`, `ip_geolocation`, `ip_network`, `ip_to_asn`, `ip_blocklist_check`, `ip_threat_intel`, `as_info`, `as_prefixes`, `domain_reputation`, `domain_ranking`, `domain_blocklist_check`, `dns_differential`, `domain_shared_ip`, `domain_shared_ns`, `domain_shared_mx`, `check_email`, `ping`, `lookup_bitcoin_transaction`, `lookup_bitcoin_address`, `lookup_bitcoin_block`, `bitcoin_address_transactions`, `bitcoin_transaction_spends`, `bitcoin_blockchain_stats`.

### Griddo AX Docs — 100/A+

[Catalog](https://manufact.com/mcp-catalog/griddo-ax-docs) · [Full definitions and findings](../scripts/leaderboard/screen/griddo-ax-docs.json). The overall score is an imported checklist score; no per-tool documentation score is implied.

Hypothesis: An orientation/list tool returns every documentation page, a get tool returns a full page, and search returns excerpts. A narrow how-to may fetch the whole index or full page unnecessarily. Search limit lacks a parameter description even though its schema bounds it to 1–10 with default 5.

Exact excerpt, `get_griddo_editor_doc`: “Fetch the full Markdown of one Griddo backoffice (Author Experience) documentation page”

Exact excerpt, `list_griddo_editor_docs`: “List every page of the Griddo backoffice”

Proposed tasks:

1. Find one English documentation excerpt about adding an image in the Griddo editor; do not fetch an entire page. Pass: search_griddo_editor_docs; a relevant adding-image query, lang=en, limit=1; reject list/get and extra calls.
2. Find at most two Spanish excerpts about publishing a Griddo page. Pass: search_griddo_editor_docs; a relevant publishing query, lang=es, limit=2; reject full-index/full-page calls.
3. The documentation path is /editor/anadir-imagen. Read that exact page in full. Pass: get_griddo_editor_doc with that exact path (equivalent documented .md/full canonical URL forms may be frozen before approval); reject searching/listing instead.

Control: Give me an overview of every English Griddo editor documentation page, grouped by section. Pass: list_griddo_editor_docs with lang=en. The deliberately broad call is correct for this control.

Read-only allowlist (server hints; destructiveHint true excluded): `search_griddo_editor_docs`, `get_griddo_editor_doc`, `list_griddo_editor_docs`.

### SNOMED CT Terminology — 96/A+

[Catalog](https://manufact.com/mcp-catalog/snomed-ct-terminology) · [Full definitions and findings](../scripts/leaderboard/screen/snomed-ct-terminology.json). The overall score is an imported checklist score; no per-tool documentation score is implied.

Hypothesis: The metadata tool defaults include_raw=true; a count-only expansion has summary_only=false and max_contains=100 defaults; immediate-child and all-descendant tools sit together. These can cause raw payloads or a hierarchy dump for a narrow terminology-service request. This benchmark concerns API routing only, not clinical interpretation.

Exact excerpt, `fhir_metadata`: “Set include_raw=true (default) to also include the raw CapabilityStatement payload.”

Exact excerpt, `snomed_get_children`: “Get direct IS-A children of a SNOMED concept”

Proposed tasks:

1. Show only the parsed capability summary for the default terminology backend; omit the raw FHIR CapabilityStatement. Pass: fhir_metadata with include_raw=false and no alternate terminology/target. Returning raw metadata by default fails.
2. For concept ID 404684003, show only the first five immediate IS-A children, not all descendants. Pass: snomed_get_children; concept_id=404684003, count=5, offset omitted or 0. Freeze availability of the concept on the default public edition before approval; do not execute a setup call now.
3. Count the concepts in the value set http://snomed.info/sct?fhir_vs=ecl/<<404684003, without returning concept members. Pass: snomed_expand with that exact value_set_url and summary_only=true. Freeze optional count/max_contains handling from implementation documentation before approval; no clinical conclusion is scored.

Control: List the terminology editions and branches available on this server. Pass: list_terminologies with an empty argument object.

Read-only allowlist (server hints; destructiveHint true excluded): `list_terminologies`, `server_health`, `server_capabilities`, `fhir_metadata`, `snomed_lookup`, `snomed_validate_code`, `snomed_subsumes`, `snomed_expand`, `snomed_get_ancestors`, `snomed_get_children`, `snomed_get_descendants`, `snowstorm_list_codesystems`, `snowstorm_list_versions`, `snowstorm_search_concepts`, `snowstorm_get_concept_native`.

### SQD — 96/A+

[Catalog](https://manufact.com/mcp-catalog/sqd) · [Full definitions and findings](../scripts/leaderboard/screen/sqd.json). The overall score is an imported checklist score; no per-tool documentation score is implied.

Hypothesis: A wallet-summary tool offers summary/compact/full response formats and fast/deep execution, while raw transaction and analytics tools overlap in subject. include_tokens defaults true. A headline-only preview may request a deeper or fuller response, or a simple feed may route to raw VM records. The current descriptions already contain extensive routing/budget guidance; remaining risk is unmeasured.

Exact excerpt, `portal_get_wallet_summary.response_format`: “Use 'summary' for headline flow only”

Exact excerpt, `portal_get_head`: “Get just the latest indexed head block or slot”

Proposed tasks:

1. For the public Ethereum wallet address supplied in the frozen context, give only headline fund flow for the last hour, using an explicitly bounded preview. Exclude token and NFT transfers. Pass: portal_get_wallet_summary; exact frozen public address/network, timeframe=1h, response_format=summary, mode=fast, include_tokens=false, include_nfts=false. Freeze a public non-personal fixture address before approval; no wallet is queried now.
2. Show just the three newest recent-activity rows on Base over the last hour, as one page. Pass: portal_get_recent_activity; network=base-mainnet, timeframe=1h, limit=3, no cursor. Reject raw VM transaction tools.
3. Give a Bitcoin transaction-count chart for the last hour in 15-minute buckets, without raw transactions or previous-period comparison. Pass: portal_get_time_series; network=bitcoin-mainnet, metric=transaction_count, interval=15m, duration=1h, compare_previous omitted/false; freeze mode handling before approval.

Control: What is the latest indexed head block for Base? Pass: portal_get_head; network=base-mainnet and type omitted/latest. No freshness dump or raw blocks query.

Read-only allowlist (server hints; destructiveHint true excluded): `portal_list_networks`, `portal_get_network_info`, `portal_get_head`, `portal_resolve_entity`, `portal_get_recent_activity`, `portal_get_wallet_summary`, `portal_get_time_series`, `portal_evm_query_logs`, `portal_evm_query_transactions`, `portal_evm_query_traces`, `portal_evm_query_token_transfers`, `portal_evm_get_contract_deployment`, `portal_evm_get_contract_activity`, `portal_evm_get_analytics`, `portal_evm_get_ohlc`, `portal_solana_query_instructions`, `portal_solana_query_transactions`, `portal_solana_get_analytics`, `portal_bitcoin_query_transactions`, `portal_bitcoin_get_analytics`, `portal_substrate_query_events`, `portal_substrate_query_calls`, `portal_substrate_get_analytics`, `portal_hyperliquid_query_fills`, `portal_hyperliquid_get_analytics`, `portal_hyperliquid_get_ohlc`, `portal_tron_query_transactions`, `portal_tron_query_logs`, `portal_debug_query_blocks`, `portal_debug_resolve_time_to_block`, `portal_debug_hyperliquid_query_replica_commands`.

### GitCafe — 98/A+

[Catalog](https://manufact.com/mcp-catalog/git-cafe) · [Full definitions and findings](../scripts/leaderboard/screen/git-cafe.json).

Hypothesis: Public-repository read tools are available anonymously according to the live server instructions. File windows default to 200 lines, code search defaults to 100 matching lines plus three context lines, and directory pages default to 50 entries. A ten-line read or five-match search may inherit those defaults despite the current 96/100 documentation score. Existing bounds and guidance already reduce the risk; no failure or response size has been measured.

Exact excerpt, `read_file`: “A window holds at most maxLines lines and 64 KiB”

Exact excerpt, `search_code.maxMatches`: “How many matching lines to return at most; omit for the default.”

Freeze prerequisite: Before approval, choose a real public GitCafe repository and freeze owner, repo, full commit OID, an existing text-file path with at least 20 lines, a directory with at least three entries, and a literal pattern with at least five matches. Confirm availability from the public web UI or separately approved read-only setup; do not create a repository, execute a tool, or fabricate fixture contents during this scan.

Proposed tasks:

1. For the public repository, commit, and text-file path in the frozen context, show only lines 1 through 10. Pass: read_file with exact owner/repo/oid/path, startLine=1 (or omitted), maxLines=10. No search or directory listing is needed for the supplied path.
2. Search the supplied directory in that public repository for the frozen literal text. Return at most five matching lines and no surrounding context. Pass: search_code with exact owner/repo/oid/path/pattern, maxMatches=5, contextLines=0, ignoreCase omitted/false. Reject a full-file read or a default 100-match search.
3. List only the first three entries of the supplied directory at the frozen commit, without descending into subdirectories. Pass: list_tree with exact owner/repo/oid/path, limit=3, after omitted. Reject an implicit 50-entry page or recursive work.

Control: Show the identity, description, visibility, and default branch of the supplied public repository. Pass: get_repository with the exact owner and repo. This is a metadata lookup, not a tree or content search.

Read-only allowlist (server hints; destructiveHint true excluded): `list_repositories`, `get_repository`, `list_refs`, `list_tree`, `read_file`, `search_code`, `list_issues`, `issue_read`, `list_pull_requests`, `pull_request_read`, `get_pull_request_diff`, `ci_read`.

get_me is excluded from the candidate dispatch allowlist because the live anonymous-session instructions say it returns HTTP 401. Only a frozen public GitCafe repository may be read; private repositories are outside scope.

## Every public server — no outcomes omitted

H/M/W are AX Lint high/medium/warning finding counts. “—” means no valid live audit. A zero risk count is only the result of these heuristics. All tool behavior and cost implications remain hypotheses. Imported scores are tagged †. Both ranks and section/per-tool documentation scores are preserved in the dataset. Imported pages sometimes display only 12 tool-name chips even when their total is larger; only names actually shown are listed, with completeness marked separately. Directory tool counts, audit-discovered tool counts, and live tool counts are retained separately when they differ.

| Curated rank / all rank | Server | Score / grade | Category | H / M / W | Static tool tokens | Risk kinds (instances) | Credentials needed | Status |
|---|---|---|---|---|---:|---|---|---|
| — / 1 | [Autodesk Product Help](https://manufact.com/mcp-catalog/autodesk-product-help) | 100 / A+ † | productivity | 0/0/1 | 6913 |  (0) | none for metadata | complete |
| — / 2 | [BoardWise](https://manufact.com/mcp-catalog/boardwise) | 100 / A+ † | productivity | 4/13/0 | 5167 | broad_response_candidate, overlapping_read_tools (7) | none for metadata | complete |
| — / 3 | [ChargeHub](https://manufact.com/mcp-catalog/chargehub) | 100 / A+ † | travel | 0/5/0 | 1564 | potentially_expensive_default, overlapping_read_tools (3) | none for metadata | complete |
| — / 4 | [Contract-Factory — Sociétés & SIREN](https://manufact.com/mcp-catalog/contract-factory-soci-t-s-siren) | 100 / A+ † | financial-services | 0/1/3 | 3373 | broad_response_candidate (3) | none for metadata | complete |
| — / 5 | [Credits.fm](https://manufact.com/mcp-catalog/credits-fm) | 100 / A+ † | media-entertainment | 0/27/0 | 5012 | broad_response_candidate, potentially_expensive_default (6) | none for metadata | complete |
| — / 6 | [DocCheck Flexikon](https://manufact.com/mcp-catalog/doccheck-flexikon) | 100 / A+ † | education | 0/4/0 | 791 |  (0) | none for metadata | complete |
| — / 7 | [drivemcp](https://manufact.com/mcp-catalog/drivemcp) | 100 / A+ † |  | 1/4/2 | 5229 | response_control_size_unclear, overlapping_read_tools (10) | none for metadata | complete |
| — / 8 | [EbooksDepository](https://manufact.com/mcp-catalog/ebooksdepository) | 100 / A+ † | commerce-shopping | 0/1/0 | 873 | overlapping_read_tools (1) | none for metadata | complete |
| — / 9 | [ecoExperten Energieausweis](https://manufact.com/mcp-catalog/ecoexperten-energieausweis) | 100 / A+ † | commerce-shopping | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 10 | [Epicure](https://manufact.com/mcp-catalog/epicure) | 100 / A+ † | data-analytics | 12/58/0 | 5184 | response_control_size_unclear, broad_response_candidate (7) | none for metadata | complete |
| — / 11 | [FlagStat](https://manufact.com/mcp-catalog/flagstat) | 100 / A+ † | productivity | 0/1/0 | 1157 | response_control_size_unclear (1) | none for metadata | complete |
| — / 12 | [gmailmcp](https://manufact.com/mcp-catalog/gmailmcp) | 100 / A+ † |  | 0/3/2 | 16146 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (17) | none for metadata | complete |
| — / 13 | [Granted](https://manufact.com/mcp-catalog/granted) | 100 / A+ † | nonprofit | 0/7/0 | 2532 |  (0) | none for metadata | complete |
| — / 14 | [Griddo AX Docs](https://manufact.com/mcp-catalog/griddo-ax-docs) | 100 / A+ † | sales-and-marketing | 0/5/0 | 1090 | response_control_size_unclear, overlapping_read_tools (2) | none for metadata | complete |
| — / 15 | [Groupon](https://manufact.com/mcp-catalog/groupon) | 100 / A+ † | health-life-sciences | 0/2/0 | 2402 |  (0) | none for metadata | complete |
| — / 16 | [GVRN Company Incorporation MCP](https://manufact.com/mcp-catalog/gvrn-company-incorporation-mcp) | 100 / A+ † | legal | 0/14/0 | 3354 | overlapping_read_tools (1) | none for metadata | complete |
| — / 17 | [hacesfalta](https://manufact.com/mcp-catalog/hacesfalta) | 100 / A+ † | nonprofit | 0/4/0 | 1239 |  (0) | none for metadata | complete |
| — / 18 | [HYPERneobroker.com - prices, perps, prediction markets + paper desk](https://manufact.com/mcp-catalog/hyperneobroker-com-prices-perps-prediction-markets) | 100 / A+ † |  | 5/95/1 | 9126 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (20) | none for metadata | complete |
| — / 19 | [Inbin Pulse](https://manufact.com/mcp-catalog/inbin-pulse) | 100 / A+ † | travel | 0/3/0 | 946 | broad_response_candidate (1) | none for metadata | complete |
| — / 20 | [Keenable Web Search](https://manufact.com/mcp-catalog/keenable-web-search) | 100 / A+ † | productivity | 0/3/0 | 1861 | potentially_expensive_default (1) | none for metadata | complete |
| — / 21 | [Muju](https://manufact.com/mcp-catalog/muju) | 100 / A+ † | other | 0/12/0 | 2222 | broad_response_candidate, overlapping_read_tools (2) | none for metadata | complete |
| — / 22 | [Newsflash](https://manufact.com/mcp-catalog/newsflash) | 100 / A+ † | data-analytics | 0/8/0 | 1814 | broad_response_candidate (1) | none for metadata | complete |
| — / 23 | [PHS Pallets](https://manufact.com/mcp-catalog/phs-pallets) | 100 / A+ † | commerce-shopping | 17/28/0 | 1986 | response_control_size_unclear, overlapping_read_tools (3) | none for metadata | complete |
| — / 24 | [PLAZA Hotels](https://manufact.com/mcp-catalog/plaza-hotels) | 100 / A+ † | travel | 0/14/0 | 4603 | broad_response_candidate, overlapping_read_tools (5) | none for metadata | complete |
| — / 25 | [Point Hacks](https://manufact.com/mcp-catalog/point-hacks) | 100 / A+ † | travel | 0/0/1 | 1563 | broad_response_candidate (3) | none for metadata | complete |
| — / 26 | [Point Topic](https://manufact.com/mcp-catalog/point-topic) | 100 / A+ † | data-analytics | 0/2/0 | 726 |  (0) | none for metadata | complete |
| — / 27 | [PomoDial](https://manufact.com/mcp-catalog/pomodial) | 100 / A+ † | productivity | 0/9/0 | 1298 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default (4) | none for metadata | complete |
| — / 28 | [Pricing Optimizer AI](https://manufact.com/mcp-catalog/pricing-optimizer-ai) | 100 / A+ † | data-analytics | 6/12/1 | — | response_control_size_unclear, broad_response_candidate (6) | none for metadata | complete |
| — / 29 | [Promotion Pros Catalog](https://manufact.com/mcp-catalog/promotion-pros-catalog) | 100 / A+ † | commerce-shopping | 3/19/0 | 4648 | response_control_size_unclear, overlapping_read_tools (4) | none for metadata | complete |
| — / 30 | [Pyth](https://manufact.com/mcp-catalog/pyth) | 100 / A+ † | business-productivity | 0/6/5 | 7144 | potentially_expensive_default, broad_response_candidate (3) | none for metadata | complete |
| — / 31 | [RCO-A2A](https://manufact.com/mcp-catalog/rco-a2a) | 100 / A+ † | commerce-shopping | 1/3/0 | 1157 |  (0) | none for metadata | complete |
| — / 32 | [Robtex Network Intelligence](https://manufact.com/mcp-catalog/robtex-network-intelligence) | 100 / A+ † |  | 0/87/0 | 10682 | potentially_expensive_default, response_control_size_unclear, broad_response_candidate, overlapping_read_tools (43) | none for metadata | complete |
| — / 33 | [Rocket Sloth](https://manufact.com/mcp-catalog/rocket-sloth) | 100 / A+ † | sales-and-marketing | 0/18/0 | 4998 | broad_response_candidate (3) | none for metadata | complete |
| — / 34 | [SceneF](https://manufact.com/mcp-catalog/scenef) | 100 / A+ † | media-entertainment | 0/5/4 | 9409 | broad_response_candidate, response_control_size_unclear (2) | none for metadata | complete |
| — / 35 | [Skimetric](https://manufact.com/mcp-catalog/skimetric) | 100 / A+ † | travel | 51/85/0 | 8012 | response_control_size_unclear, broad_response_candidate (7) | none for metadata | complete |
| — / 36 | [Soracom Knowledge](https://manufact.com/mcp-catalog/soracom-knowledge) | 100 / A+ † | productivity | 0/4/0 | 2775 |  (0) | none for metadata | complete |
| — / 37 | [StatCite](https://manufact.com/mcp-catalog/statcite) | 100 / A+ † | data-analytics | 2/21/0 | 5747 |  (0) | none for metadata | complete |
| — / 38 | [StatelessServer](https://manufact.com/mcp-catalog/statelessserver) | 100 / A+ † |  | 0/7/0 | 10209 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (6) | none for metadata | complete |
| — / 39 | [Sweat & Tonic](https://manufact.com/mcp-catalog/sweat-tonic) | 100 / A+ † | consumer-health | 2/8/0 | 660 | response_control_size_unclear (1) | none for metadata | complete |
| — / 40 | [Taskrabbit Booking Assistance](https://manufact.com/mcp-catalog/taskrabbit-booking-assistance) | 100 / A+ † | productivity | 0/5/0 | — | broad_response_candidate (1) | none for metadata | complete |
| — / 41 | [TempGuru Event Staffing](https://manufact.com/mcp-catalog/tempguru-event-staffing) | 100 / A+ † | productivity | 0/0/0 | 7362 | broad_response_candidate, response_control_size_unclear (7) | none for metadata | complete |
| — / 42 | [TiCATi](https://manufact.com/mcp-catalog/ticati) | 100 / A+ † | travel | 0/13/0 | 5208 | broad_response_candidate, overlapping_read_tools (10) | none for metadata | complete |
| — / 43 | [Vitals Vault](https://manufact.com/mcp-catalog/vitals-vault) | 100 / A+ † | consumer-health | 0/17/0 | 4710 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (24) | none for metadata | complete |
| — / 44 | [Vocaneo](https://manufact.com/mcp-catalog/vocaneo) | 100 / A+ † | education | 0/22/7 | 11720 | overlapping_read_tools (12) | none for metadata | complete |
| — / 45 | [ZMAXINC](https://manufact.com/mcp-catalog/zmaxinc) | 100 / A+ † | other | 0/1/0 | 1460 | response_control_size_unclear, broad_response_candidate (2) | none for metadata | complete |
| — / 46 | [ココナラ](https://manufact.com/mcp-catalog/wild-zero-3tbjq) | 100 / A+ † | productivity | 0/2/0 | 598 | response_control_size_unclear (1) | none for metadata | complete |
| — / 47 | [Held at the Gate](https://manufact.com/mcp-catalog/killfear-held-at-the-gate-netlify-app) | 99 / A+ | developer-tools | 0/1/0 | 974 |  (0) | none for metadata | complete |
| 1 / 48 | [Speko](https://manufact.com/mcp-catalog/spekoai-docs) | 99 / A+ | developer-tools | 0/0/0 | — |  (0) | none for metadata | complete |
| 2 / 49 | [turva.dev](https://manufact.com/mcp-catalog/turva-dev) | 99 / A+ | developer-tools | 0/0/0 | 1598 |  (0) | none for metadata | complete |
| 3 / 50 | [Affonso.io](https://manufact.com/mcp-catalog/affonso-api-mcp) | 98 / A+ | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 4 / 51 | [Agentic Atlas: Agent Design Patterns](https://manufact.com/mcp-catalog/agentic-atlas) | 98 / A+ | search-research | 0/0/0 | 3171 |  (0) | none for metadata | complete |
| 5 / 52 | [AgentMail](https://manufact.com/mcp-catalog/agentmail) | 98 / A+ | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 53 | [Celesto Cloud Computers](https://manufact.com/mcp-catalog/mcp-celesto-ai) | 98 / A+ | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 6 / 54 | [ClickHouse Cloud MCP Server](https://manufact.com/mcp-catalog/clickhouse) | 98 / A+ | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 55 | [ClickHouse Cloud MCP Server](https://manufact.com/mcp-catalog/clickhouse-cloud-mcp-server) | 98 / A+ | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 56 | [ClickHouse Cloud MCP Server](https://manufact.com/mcp-catalog/mcp-clickhouse-dev-com) | 98 / A+ | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 7 / 57 | [common-practice](https://manufact.com/mcp-catalog/api-withcommonpractice-com) | 98 / A+ | search-research | — | — | — | unknown | connection_or_protocol_failure |
| — / 58 | [Datacircle](https://manufact.com/mcp-catalog/api-datacircle-dev) | 98 / A+ | sales-and-marketing | — | — | — | unknown | connection_or_protocol_failure |
| 8 / 59 | [GitCafe](https://manufact.com/mcp-catalog/git-cafe) | 98 / A+ | developer-tools | 0/17/0 | 20431 | potentially_expensive_default, broad_response_candidate, response_control_size_unclear, overlapping_read_tools (8) | none for metadata | complete |
| — / 60 | [GitCafe](https://manufact.com/mcp-catalog/staging-git-cafe) | 98 / A+ | developer-tools | 0/17/0 | 20431 | potentially_expensive_default, broad_response_candidate, response_control_size_unclear, overlapping_read_tools (8) | none for metadata | complete |
| 10 / 62 | [Reason](https://manufact.com/mcp-catalog/mcp-reasonmachines-com) | 98 / A+ | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 11 / 63 | [Tolt](https://manufact.com/mcp-catalog/mcp-tolt-com) | 98 / A+ | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 12 / 64 | [Affitor](https://manufact.com/mcp-catalog/mcp-affitor-com) | 97 / A+ | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 13 / 65 | [AgentLine: Phone Numbers for AI Agents](https://manufact.com/mcp-catalog/agentline) | 97 / A+ | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 66 | [Authdog](https://manufact.com/mcp-catalog/authdog) | 97 / A+ | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 14 / 67 | [Buzzfy](https://manufact.com/mcp-catalog/mcp-buzzfy-co) | 97 / A+ | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 15 / 68 | [GDELT Cloud](https://manufact.com/mcp-catalog/gdelt-cloud) | 97 / A+ | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 69 | [JustPark](https://manufact.com/mcp-catalog/justpark) | 97 / A+ † | travel | 0/1/0 | 1136 |  (0) | none for metadata | complete |
| 16 / 70 | [Marxel](https://manufact.com/mcp-catalog/marxel-shortlist-studio) | 97 / A+ | productivity | 0/3/1 | 6776 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (4) | none for metadata | complete |
| — / 71 | [Meta Wearables Developer Platform](https://manufact.com/mcp-catalog/meta-wearables-mcp-server) | 97 / A+ | developer-tools | 0/0/0 | 831 | overlapping_read_tools (1) | none for metadata | complete |
| 17 / 72 | [Motion](https://manufact.com/mcp-catalog/mcp-motion-so) | 97 / A+ | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 18 / 73 | [MotionVid](https://manufact.com/mcp-catalog/motionvid) | 97 / A+ | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 19 / 74 | [OpenWork Connect](https://manufact.com/mcp-catalog/api-openworklabs-com) | 97 / A+ | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 75 | [PGA – Play Golf](https://manufact.com/mcp-catalog/pga-play-golf) | 97 / A+ † | other | 0/2/2 | 2844 |  (0) | none for metadata | complete |
| — / 76 | [pick your match](https://manufact.com/mcp-catalog/pick-your-match) | 97 / A+ † | travel | 0/6/0 | 3628 | broad_response_candidate (2) | none for metadata | complete |
| 20 / 77 | [Ploti](https://manufact.com/mcp-catalog/mcp-ploti-ai) | 97 / A+ | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 21 / 78 | [Revnu](https://manufact.com/mcp-catalog/revnu-com) | 97 / A+ | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 22 / 79 | [Sleek](https://manufact.com/mcp-catalog/sleek-design) | 97 / A+ | design-creative | 0/5/0 | 4252 | potentially_expensive_default, broad_response_candidate, response_control_size_unclear, overlapping_read_tools (6) | none for metadata | complete |
| — / 80 | [Square Yards](https://manufact.com/mcp-catalog/square-yards) | 97 / A+ † | commerce-shopping | 0/9/5 | 13214 | broad_response_candidate, response_control_size_unclear (2) | none for metadata | complete |
| — / 81 | [Streamloop MCP](https://manufact.com/mcp-catalog/mcp-streamloop-app-2) | 97 / A+ | design-creative | 0/30/6 | 32013 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (23) | none for metadata | complete |
| — / 82 | [Turkish Airlines](https://manufact.com/mcp-catalog/turkish-airlines) | 97 / A+ † | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 83 | [Airefs AI Visibility](https://manufact.com/mcp-catalog/mcp-getairefs-com) | 96 / A+ | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 23 / 84 | [BookDNA](https://manufact.com/mcp-catalog/bookdna) | 96 / A+ | search-research | 0/0/0 | 1672 | overlapping_read_tools (1) | none for metadata | complete |
| — / 85 | [citytracker.ai](https://manufact.com/mcp-catalog/citytracker-ai) | 96 / A+ † | other | 0/6/1 | 1629 | broad_response_candidate (1) | none for metadata | complete |
| — / 86 | [Clipkit](https://manufact.com/mcp-catalog/clipkit) | 96 / A+ † | creative | 0/5/2 | 9047 | broad_response_candidate, response_control_size_unclear (9) | none for metadata | complete |
| — / 87 | [CMS Coverage](https://manufact.com/mcp-catalog/cms-coverage) | 96 / A+ † | health | 0/4/2 | 5332 | broad_response_candidate, overlapping_read_tools (7) | none for metadata | complete |
| — / 88 | [Commonlands Optics: M12 Lens and C-Mount Lens Finder + Field-of-View Calculator](https://manufact.com/mcp-catalog/commonlands-optics-m12-lens-and-c-mount-lens-finde) | 96 / A+ † | other | 10/62/3 | — | response_control_size_unclear, overlapping_read_tools (19) | required; free/paid unknown | complete |
| — / 89 | [Courtroom5](https://manufact.com/mcp-catalog/courtroom5) | 96 / A+ † | productivity | 0/0/3 | 3717 |  (0) | none for metadata | complete |
| 24 / 90 | [Data Legion](https://manufact.com/mcp-catalog/data-legion) | 96 / A+ | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 91 | [DatiTuristici.it](https://manufact.com/mcp-catalog/datituristici-it) | 96 / A+ † | data-analytics | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 92 | [Domhaul](https://manufact.com/mcp-catalog/domhaul) | 96 / A+ † | business-productivity | 0/0/0 | 948 |  (0) | none for metadata | complete |
| — / 93 | [Flevy](https://manufact.com/mcp-catalog/flevy) | 96 / A+ † | productivity | 0/5/1 | 2277 | broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| — / 94 | [GrailPeople Shopping](https://manufact.com/mcp-catalog/grailpeople-shopping) | 96 / A+ † | commerce-shopping | 0/0/4 | 8220 | broad_response_candidate (2) | none for metadata | complete |
| — / 95 | [Image Generation](https://manufact.com/mcp-catalog/image-generation) | 96 / A+ | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 96 | [It's Complicated — Therapist Directory](https://manufact.com/mcp-catalog/it-s-complicated-therapist-directory) | 96 / A+ † | consumer-health | 0/6/1 | 2823 | broad_response_candidate (1) | none for metadata | complete |
| — / 97 | [Jeroen.nl - Onafhankelijk energieplatform](https://manufact.com/mcp-catalog/jeroen-nl-onafhankelijk-energieplatform) | 96 / A+ † | data-analytics | 0/58/0 | 11125 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (31) | none for metadata | complete |
| — / 98 | [Kavara Kirk](https://manufact.com/mcp-catalog/kavara-kirk) | 96 / A+ † | financial-services | 0/0/8 | 8528 | broad_response_candidate (1) | none for metadata | complete |
| — / 99 | [Kiwi.com](https://manufact.com/mcp-catalog/kiwi-com) | 96 / A+ † | productivity | 0/1/1 | 5926 | response_control_size_unclear, broad_response_candidate (5) | none for metadata | complete |
| — / 100 | [Logimu Shopping](https://manufact.com/mcp-catalog/logimu-shopping) | 96 / A+ † | commerce-shopping | 0/21/13 | — | response_control_size_unclear, broad_response_candidate, potentially_expensive_default (21) | none for metadata | complete |
| — / 101 | [Lyon](https://manufact.com/mcp-catalog/lyon) | 96 / A+ | search-research | 0/10/0 | 6239 | response_control_size_unclear, overlapping_read_tools (8) | none for metadata | complete |
| — / 102 | [NPI Registry](https://manufact.com/mcp-catalog/npi-registry) | 96 / A+ † | health | 0/0/3 | 4797 | broad_response_candidate (2) | none for metadata | complete |
| — / 103 | [SELLIT9](https://manufact.com/mcp-catalog/sellit9) | 96 / A+ † | commerce-shopping | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 104 | [Sidewave Maggiordomo](https://manufact.com/mcp-catalog/sidewave-maggiordomo) | 96 / A+ | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 105 | [SNOMED CT Terminology](https://manufact.com/mcp-catalog/snomed-ct-terminology) | 96 / A+ † | health-life-sciences | 13/74/1 | 8691 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (24) | none for metadata | complete |
| — / 106 | [SQD](https://manufact.com/mcp-catalog/sqd) | 96 / A+ † | data-analytics | 0/0/12 | 41685 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (69) | none for metadata | complete |
| 25 / 107 | [Blitz API](https://manufact.com/mcp-catalog/blitz-api) | 95 / A+ | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 108 | [CeylonCharts](https://manufact.com/mcp-catalog/mcp-ceyloncharts-com) | 95 / A+ | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 109 | [Funraise Taiwan Real Estate](https://manufact.com/mcp-catalog/funraise-taiwan-real-estate) | 95 / A+ | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 26 / 110 | [JooVoice](https://manufact.com/mcp-catalog/app-joovoice-com) | 95 / A+ | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 111 | [Netzo](https://manufact.com/mcp-catalog/netzo-api) | 95 / A+ | financial-services | — | — | — | unknown | connection_or_protocol_failure |
| — / 112 | [OpenMail](https://manufact.com/mcp-catalog/mcp-openmail-sh) | 95 / A+ | communication | — | — | — | required; free/paid unknown | credentials_required |
| 27 / 113 | [Parallax](https://manufact.com/mcp-catalog/parallax) | 95 / A+ | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 114 | [Rift Flight Booking MCP](https://manufact.com/mcp-catalog/mcp-rift-co) | 95 / A+ | commerce-shopping | 0/0/0 | 5526 | response_control_size_unclear (1) | none for metadata | complete |
| — / 115 | [Soundcheck — Live Event Staffing](https://manufact.com/mcp-catalog/mcp-soundchecklive-io) | 95 / A+ | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 28 / 116 | [Apify MCP Server](https://manufact.com/mcp-catalog/apify-mcp-server) | 94 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 117 | [BeeGone Bee Removal](https://manufact.com/mcp-catalog/beegone-bee-removal) | 94 / A † | commerce-shopping | 0/5/1 | 2511 | broad_response_candidate (1) | none for metadata | complete |
| — / 118 | [BreckenWander](https://manufact.com/mcp-catalog/breckenwander) | 94 / A † | travel | 0/3/0 | 2864 | response_control_size_unclear, broad_response_candidate (5) | none for metadata | complete |
| — / 119 | [Civitatis](https://manufact.com/mcp-catalog/civitatis) | 94 / A † | travel | 0/0/0 | 7507 |  (0) | none for metadata | complete |
| — / 120 | [Clera](https://manufact.com/mcp-catalog/clera) | 94 / A | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 121 | [Common Sense Privacy](https://manufact.com/mcp-catalog/common-sense-privacy) | 94 / A † | productivity | 0/1/0 | 1134 |  (0) | none for metadata | complete |
| 29 / 122 | [Context](https://manufact.com/mcp-catalog/context-dev) | 94 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 30 / 123 | [Context7](https://manufact.com/mcp-catalog/context7) | 94 / A | developer-tools | 0/2/1 | 1997 |  (0) | none for metadata | complete |
| — / 124 | [Donde Onde Where](https://manufact.com/mcp-catalog/donde-onde-where) | 94 / A † | travel | 0/12/0 | 3879 | broad_response_candidate (1) | none for metadata | complete |
| — / 125 | [Evaneos](https://manufact.com/mcp-catalog/evaneos) | 94 / A † | other | 0/1/1 | 1448 |  (0) | none for metadata | complete |
| 31 / 126 | [Exa](https://manufact.com/mcp-catalog/exa) | 94 / A | search-research | 0/2/0 | 1048 | potentially_expensive_default (1) | required; free/paid unknown | complete |
| — / 127 | [FidelicAI: Hire AI Agents](https://manufact.com/mcp-catalog/fidelicai-hire-ai-agents) | 94 / A † | productivity | 0/2/0 | 1435 | overlapping_read_tools (1) | none for metadata | complete |
| — / 128 | [Figaro Immobilier](https://manufact.com/mcp-catalog/figaro-immobilier) | 94 / A † | e-commerce | 0/2/2 | 5098 |  (0) | none for metadata | complete |
| — / 129 | [GD](https://manufact.com/mcp-catalog/gd) | 94 / A † | other | 0/0/0 | 2187 | response_control_size_unclear, broad_response_candidate (4) | none for metadata | complete |
| — / 130 | [Grammaropolis](https://manufact.com/mcp-catalog/grammaropolis) | 94 / A † | education | 0/9/0 | 1837 | potentially_expensive_default, overlapping_read_tools (2) | none for metadata | complete |
| — / 131 | [GuruWalk – Tours & Activities](https://manufact.com/mcp-catalog/guruwalk-tours-activities) | 94 / A † | travel | 0/0/4 | 6199 | broad_response_candidate, overlapping_read_tools (2) | none for metadata | complete |
| — / 132 | [HANKOOKILBO MCP](https://manufact.com/mcp-catalog/hankookilbo-mcp) | 94 / A † | media-entertainment | 0/10/0 | 3526 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (15) | none for metadata | complete |
| — / 133 | [IXA.RO - Comparator de preturi](https://manufact.com/mcp-catalog/ixa-ro-comparator-de-preturi) | 94 / A † | commerce-shopping | 0/8/0 | 1650 | response_control_size_unclear, overlapping_read_tools (4) | none for metadata | complete |
| — / 134 | [Jobs and Careers](https://manufact.com/mcp-catalog/jobs-and-careers) | 94 / A † | productivity | 0/0/1 | 12201 | broad_response_candidate (1) | none for metadata | complete |
| 32 / 135 | [Kody](https://manufact.com/mcp-catalog/kody-codes) | 94 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 136 | [Markifact](https://manufact.com/mcp-catalog/markifact) | 94 / A | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 137 | [Moody Lenses](https://manufact.com/mcp-catalog/moody-lenses) | 94 / A † | commerce-shopping | 0/7/0 | 2648 | broad_response_candidate, overlapping_read_tools (12) | none for metadata | complete |
| — / 138 | [Normhyra.ai](https://manufact.com/mcp-catalog/normhyra-ai) | 94 / A † | productivity | 0/10/3 | 4997 | broad_response_candidate (1) | none for metadata | complete |
| — / 139 | [PGH Pest Control](https://manufact.com/mcp-catalog/pgh-pest-control) | 94 / A † | commerce-shopping | 0/19/2 | 5676 |  (0) | none for metadata | complete |
| — / 140 | [Ramp Data](https://manufact.com/mcp-catalog/ramp-data) | 94 / A † | financial-services | 0/15/0 | 3549 | broad_response_candidate, potentially_expensive_default (3) | none for metadata | complete |
| — / 141 | [REMAX Europe](https://manufact.com/mcp-catalog/remax-europe) | 94 / A † | commerce-shopping | 0/0/0 | 1839 | potentially_expensive_default, broad_response_candidate, overlapping_read_tools (3) | none for metadata | complete |
| — / 142 | [Sonar Connections](https://manufact.com/mcp-catalog/sonar-connections) | 94 / A † | data-analytics | 0/42/4 | 29169 | broad_response_candidate, response_control_size_unclear (5) | none for metadata | complete |
| — / 143 | [Super.com](https://manufact.com/mcp-catalog/super-com) | 94 / A † | travel | 0/1/1 | 2572 | broad_response_candidate, overlapping_read_tools (6) | none for metadata | complete |
| — / 144 | [swatchdog](https://manufact.com/mcp-catalog/swatchdog) | 94 / A † | developer-tools | 1/3/1 | 790 |  (0) | none for metadata | complete |
| 33 / 145 | [TalkGenAI](https://manufact.com/mcp-catalog/app-talkgen-ai) | 94 / A | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 146 | [Tarteel](https://manufact.com/mcp-catalog/tarteel) | 94 / A † | islamic-religious-content | 0/6/2 | 9386 | broad_response_candidate, overlapping_read_tools (8) | none for metadata | complete |
| — / 147 | [TheWholeTorah](https://manufact.com/mcp-catalog/thewholetorah) | 94 / A † | education | 0/12/0 | 1611 | overlapping_read_tools (1) | none for metadata | complete |
| — / 148 | [Ticketbox.vn](https://manufact.com/mcp-catalog/ticketbox-vn) | 94 / A † | media-entertainment | 0/0/3 | 3497 | broad_response_candidate, overlapping_read_tools (5) | none for metadata | complete |
| — / 149 | [time.quranmajeed.com](https://manufact.com/mcp-catalog/time-quranmajeed-com) | 94 / A † | productivity | 0/4/0 | 1083 |  (0) | none for metadata | complete |
| — / 150 | [Trade It](https://manufact.com/mcp-catalog/trade-it) | 94 / A | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 151 | [Travellers Group — Regional Australian Hotels](https://manufact.com/mcp-catalog/travellers-group-regional-australian-hotels) | 94 / A † | travel | 20/51/0 | 3312 |  (0) | none for metadata | complete |
| — / 152 | [Trioteca Hipotecas](https://manufact.com/mcp-catalog/trioteca-hipotecas) | 94 / A † | financial-services | 0/6/0 | 3129 | broad_response_candidate (1) | none for metadata | complete |
| 34 / 153 | [Zero to Hundred marketplace](https://manufact.com/mcp-catalog/zerotohundred-ai) | 94 / A | commerce-shopping | 0/7/0 | 8011 | response_control_size_unclear (1) | none for metadata | complete |
| — / 154 | [$$nipp](https://manufact.com/mcp-catalog/nipp) | 93 / A † | commerce-shopping | 0/0/1 | 2079 |  (0) | none for metadata | complete |
| — / 155 | [AutoMotion](https://manufact.com/mcp-catalog/automotion) | 93 / A † | commerce-shopping | 0/0/3 | 2494 | broad_response_candidate (2) | none for metadata | complete |
| — / 156 | [Backstage](https://manufact.com/mcp-catalog/backstage) | 93 / A † | creative | 0/2/1 | 4174 | broad_response_candidate, overlapping_read_tools (5) | none for metadata | complete |
| — / 157 | [Charts by Szum](https://manufact.com/mcp-catalog/charts-by-szum) | 93 / A † | data-analytics | 0/0/0 | 5201 | broad_response_candidate, potentially_expensive_default, overlapping_read_tools (13) | none for metadata | complete |
| 35 / 158 | [Corsair Cloud](https://manufact.com/mcp-catalog/corsair-cloud-2) | 93 / A | automation-workflows | — | — | — | unknown | connection_or_protocol_failure |
| 36 / 159 | [Crustdata](https://manufact.com/mcp-catalog/crustdata-2) | 93 / A | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 160 | [Cubi Estate](https://manufact.com/mcp-catalog/cubi-estate) | 93 / A † | commerce-shopping | 9/41/4 | 7536 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (13) | none for metadata | complete |
| — / 161 | [Fryd - Your Gardening Companion](https://manufact.com/mcp-catalog/fryd-your-gardening-companion) | 93 / A † | education | 0/1/0 | 2796 |  (0) | none for metadata | complete |
| — / 162 | [Interior Company](https://manufact.com/mcp-catalog/interior-company) | 93 / A † | creative | 6/19/0 | 8299 | overlapping_read_tools (15) | none for metadata | complete |
| — / 163 | [Italian Strikes](https://manufact.com/mcp-catalog/italian-strikes) | 93 / A † |  | 0/1/0 | 1117 | broad_response_candidate (2) | none for metadata | complete |
| — / 164 | [Klubbrabatten](https://manufact.com/mcp-catalog/klubbrabatten) | 93 / A † | commerce-shopping | 0/1/0 | 1232 |  (0) | none for metadata | complete |
| 37 / 165 | [Locus Pro API tools](https://manufact.com/mcp-catalog/locus-pro-api-tools) | 93 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 166 | [MilanMetroStatus.it](https://manufact.com/mcp-catalog/milanmetrostatus-it) | 93 / A † | travel | 0/1/0 | 453 |  (0) | none for metadata | complete |
| 38 / 167 | [Parallel Web Search MCP Server](https://manufact.com/mcp-catalog/parallel-search) | 93 / A | search-research | 0/0/0 | 2317 |  (0) | none for metadata | complete |
| — / 168 | [Pregnancy Wheel](https://manufact.com/mcp-catalog/pregnancy-wheel) | 93 / A † |  | 0/2/0 | 788 |  (0) | none for metadata | complete |
| 39 / 169 | [RankControl](https://manufact.com/mcp-catalog/rankcontrol) | 93 / A | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 170 | [Snagajob](https://manufact.com/mcp-catalog/snagajob) | 93 / A † | productivity | 3/10/0 | 961 | response_control_size_unclear, overlapping_read_tools (2) | none for metadata | complete |
| — / 171 | [Idiolect AI](https://manufact.com/mcp-catalog/idiolect) | 92 / A | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 172 | [Trivago](https://manufact.com/mcp-catalog/trivago) | 92 / A † | productivity | 0/0/0 | 7472 |  (0) | none for metadata | complete |
| — / 173 | [vivideo-prompt-builder](https://manufact.com/mcp-catalog/ai-video-prompt-generator-vivideo-ai) | 92 / A | creative | 0/2/0 | 1645 | response_control_size_unclear (1) | none for metadata | complete |
| — / 174 | [ADITUS Developer Documentation](https://manufact.com/mcp-catalog/aditus-developer-portal-mcp) | 91 / A | commerce-shopping | 0/8/0 | 1822 | broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| 40 / 175 | [AllTrails MCP Server](https://manufact.com/mcp-catalog/alltrails) | 91 / A | health | 0/7/2 | 26300 | broad_response_candidate, overlapping_read_tools (9) | none for metadata | complete |
| — / 176 | [API Lessons](https://manufact.com/mcp-catalog/api-lessons) | 91 / A | education | 0/0/0 | 609 | broad_response_candidate (1) | none for metadata | complete |
| 41 / 177 | [attentive-mcp-server](https://manufact.com/mcp-catalog/attentive-mcp-server) | 91 / A | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 178 | [Dreamlit MCP](https://manufact.com/mcp-catalog/mcp-dreamlit-ai) | 91 / A | marketing-seo | 0/0/0 | 11490 | potentially_expensive_default, response_control_size_unclear (4) | none for metadata | complete |
| 42 / 179 | [Eyes](https://manufact.com/mcp-catalog/eyes) | 91 / A | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 43 / 180 | [Eyes](https://manufact.com/mcp-catalog/eyes-sandbox) | 91 / A |  | 0/4/3 | 7058 | broad_response_candidate (2) | none for metadata | complete |
| 44 / 181 | [Granola](https://manufact.com/mcp-catalog/granola) | 91 / A | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 182 | [Zinc](https://manufact.com/mcp-catalog/zinc) | 91 / A | commerce-shopping | 0/6/1 | 3695 | response_control_size_unclear, overlapping_read_tools (4) | none for metadata | complete |
| — / 183 | [Besty AI](https://manufact.com/mcp-catalog/besty-ai) | 90 / A † | travel | 19/55/0 | 3935 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (8) | none for metadata | complete |
| — / 184 | [Blue Pillow Hotels & Stays](https://manufact.com/mcp-catalog/blue-pillow-hotels-stays) | 90 / A † | travel | 0/2/4 | 11831 | response_control_size_unclear, broad_response_candidate (4) | none for metadata | complete |
| — / 185 | [Checkatrade](https://manufact.com/mcp-catalog/checkatrade) | 90 / A † | productivity | 0/1/1 | 2615 | broad_response_candidate (1) | none for metadata | complete |
| 45 / 186 | [clickup-mcp-server](https://manufact.com/mcp-catalog/clickup) | 90 / A | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 46 / 187 | [CoinGecko](https://manufact.com/mcp-catalog/coingecko) | 90 / A | financial-services | 0/0/0 | 3714 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (9) | none for metadata | complete |
| — / 188 | [Dice](https://manufact.com/mcp-catalog/dice) | 90 / A † | productivity | 8/18/3 | 3424 | response_control_size_unclear, broad_response_candidate (2) | none for metadata | complete |
| — / 189 | [docs.devic.ai](https://manufact.com/mcp-catalog/docs-devic-ai) | 90 / A † | developer-tools | 0/3/1 | 2178 | broad_response_candidate, overlapping_read_tools (2) | none for metadata | complete |
| — / 190 | [Domino's India](https://manufact.com/mcp-catalog/domino-s-india) | 90 / A † | commerce-shopping | 0/30/2 | 8215 | broad_response_candidate, overlapping_read_tools (3) | none for metadata | complete |
| — / 191 | [HaitiDocs](https://manufact.com/mcp-catalog/haitidocs) | 90 / A † | data-analytics | 4/20/0 | 2421 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (9) | none for metadata | complete |
| — / 192 | [ICD-10 Codes](https://manufact.com/mcp-catalog/icd-10-codes) | 90 / A † | health | 0/3/0 | 3199 | broad_response_candidate, potentially_expensive_default, overlapping_read_tools (6) | none for metadata | complete |
| 47 / 193 | [Keyword Tool MCP Server](https://manufact.com/mcp-catalog/keyword-tool-free-seo-keyword-research) | 90 / A | marketing-seo | 0/1/0 | 1814 | potentially_expensive_default (1) | none for metadata | complete |
| — / 194 | [lastminute.com](https://manufact.com/mcp-catalog/lastminute-com) | 90 / A † | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 195 | [Limodia](https://manufact.com/mcp-catalog/limodia) | 90 / A † | travel | 0/0/1 | 1531 | broad_response_candidate (1) | none for metadata | complete |
| — / 196 | [LINEAR Site](https://manufact.com/mcp-catalog/api-linear-magazine-com) | 90 / A | commerce-shopping | 0/0/2 | 4017 | broad_response_candidate (2) | none for metadata | complete |
| 48 / 197 | [Locus Pro API tools](https://manufact.com/mcp-catalog/api-paywithlocus-com) | 90 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 49 / 199 | [Postman](https://manufact.com/mcp-catalog/postman) | 90 / A † | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 200 | [Ratehub Mortgage](https://manufact.com/mcp-catalog/ratehub-mortgage) | 90 / A † | financial-services | 0/4/0 | 3551 | broad_response_candidate, overlapping_read_tools (10) | none for metadata | complete |
| — / 201 | [Ryanair](https://manufact.com/mcp-catalog/ryanair) | 90 / A † | travel | 0/14/0 | 5346 |  (0) | none for metadata | complete |
| — / 202 | [Shop](https://manufact.com/mcp-catalog/shop) | 90 / A † | e-commerce | 0/0/0 | 732 |  (0) | none for metadata | complete |
| — / 203 | [StatelessServer](https://manufact.com/mcp-catalog/statelessserver-2) | 90 / A † |  | 0/2/2 | 6132 | broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| — / 204 | [Telgani](https://manufact.com/mcp-catalog/telgani) | 90 / A † |  | 4/10/1 | 1614 | broad_response_candidate (1) | none for metadata | complete |
| — / 205 | [TravExp](https://manufact.com/mcp-catalog/travexp) | 90 / A † | travel | 4/7/0 | 606 |  (0) | none for metadata | complete |
| — / 206 | [Veltra Activities](https://manufact.com/mcp-catalog/veltra-activities) | 90 / A † | travel | 0/1/1 | 951 |  (0) | none for metadata | complete |
| — / 207 | [Viator](https://manufact.com/mcp-catalog/viator) | 90 / A † | productivity | 0/1/2 | 3257 |  (0) | none for metadata | complete |
| 50 / 208 | [close](https://manufact.com/mcp-catalog/close) | 89 / A | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 51 / 209 | [DNS Inspector](https://manufact.com/mcp-catalog/dns-inspector) | 89 / A | developer-tools | 0/1/0 | 459 |  (0) | none for metadata | complete |
| 52 / 210 | [EmpirioLabs AI](https://manufact.com/mcp-catalog/empiriolabs-ai) | 89 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 53 / 211 | [fanatical-mcp](https://manufact.com/mcp-catalog/fanatical) | 89 / A | commerce-shopping | 0/3/0 | 4565 | potentially_expensive_default (2) | none for metadata | complete |
| 54 / 212 | [Fleet Connected Apps](https://manufact.com/mcp-catalog/fleet-connected-apps) | 89 / A | communication | 0/1/0 | 1459 |  (0) | none for metadata | complete |
| 55 / 213 | [Fleet Workspace](https://manufact.com/mcp-catalog/fleet-workspace-2) | 89 / A | automation-workflows | 0/26/2 | 17323 | response_control_size_unclear, broad_response_candidate (7) | none for metadata | complete |
| 56 / 214 | [pubmed-mcp-server](https://manufact.com/mcp-catalog/pubmed) | 89 / A | search-research | 0/0/7 | 6504 | overlapping_read_tools (10) | none for metadata | complete |
| 57 / 215 | [sugra-api](https://manufact.com/mcp-catalog/sugra-api) | 89 / A | financial-services | 3/9/4 | 8625 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default (5) | none for metadata | complete |
| 58 / 216 | [todoist-mcp-server](https://manufact.com/mcp-catalog/todoist) | 89 / A | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 59 / 217 | [Vamos](https://manufact.com/mcp-catalog/mcp-getvamos-ai) | 89 / A | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 60 / 218 | [Akiflow MCP](https://manufact.com/mcp-catalog/akiflow) | 88 / A | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 61 / 219 | [Apollo.io](https://manufact.com/mcp-catalog/apollo-io) | 88 / A | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 62 / 220 | [blockscout-mcp-server](https://manufact.com/mcp-catalog/blockscout) | 88 / A | financial-services | 0/5/0 | 7982 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (21) | none for metadata | complete |
| — / 221 | [drawnames](https://manufact.com/mcp-catalog/drawnames) | 88 / A † | media-entertainment | 0/0/1 | 3652 | broad_response_candidate (1) | none for metadata | complete |
| 63 / 222 | [Finta](https://manufact.com/mcp-catalog/finta) | 88 / A | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 64 / 223 | [GraphOS MCP Server](https://manufact.com/mcp-catalog/graphos-mcp-tools) | 88 / A | developer-tools | 55/105/3 | 16159 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (29) | none for metadata | complete |
| 65 / 224 | [inkbox](https://manufact.com/mcp-catalog/inkbox-2) | 88 / A | communication | — | — | — | required; free/paid unknown | credentials_required |
| 66 / 225 | [Just Domain.](https://manufact.com/mcp-catalog/just-domain) | 88 / A † | developer-tools | 0/2/2 | 1838 | broad_response_candidate (1) | none for metadata | complete |
| 67 / 226 | [Linear](https://manufact.com/mcp-catalog/mcp-linear-app) | 88 / A | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 68 / 227 | [LX Connect – Schnittstellenwissen](https://manufact.com/mcp-catalog/lx-connect-f-r-lexware) | 88 / A | developer-tools | 0/14/0 | 3019 |  (0) | none for metadata | complete |
| — / 228 | [Malwarebytes](https://manufact.com/mcp-catalog/malwarebytes) | 88 / A † | productivity | 0/0/0 | 2422 | broad_response_candidate (1) | none for metadata | complete |
| — / 229 | [Mixer4AI](https://manufact.com/mcp-catalog/mixer4ai) | 88 / A † | other | 10/40/0 | 8283 | broad_response_candidate, overlapping_read_tools (5) | none for metadata | complete |
| 69 / 230 | [Notion MCP](https://manufact.com/mcp-catalog/mcp-notion-com) | 88 / A | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 231 | [PopHIVE](https://manufact.com/mcp-catalog/pophive) | 88 / A † | health | 0/11/1 | 7356 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (12) | none for metadata | complete |
| 70 / 232 | [primitive](https://manufact.com/mcp-catalog/www-primitive-dev) | 88 / A | communication | 0/1/2 | 12447 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (21) | none for metadata | complete |
| 71 / 233 | [railway](https://manufact.com/mcp-catalog/railway) | 88 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 234 | [rapidata](https://manufact.com/mcp-catalog/rapidata-2) | 88 / A | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 235 | [Runway](https://manufact.com/mcp-catalog/mcp-runwayml-com) | 88 / A | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 236 | [Savvly](https://manufact.com/mcp-catalog/savvly) | 88 / A † | financial-services | 0/1/3 | 7702 | broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| — / 237 | [Simply.com public](https://manufact.com/mcp-catalog/simply-com-public) | 88 / A † | communication | 0/4/0 | 1491 | broad_response_candidate (1) | none for metadata | complete |
| — / 238 | [Stable.com](https://manufact.com/mcp-catalog/stable-com) | 88 / A † | financial-services | 0/3/0 | 2535 |  (0) | none for metadata | complete |
| — / 239 | [swissrailways](https://manufact.com/mcp-catalog/swissrailways) | 88 / A † | commerce-shopping | 3/14/1 | 8367 | response_control_size_unclear, broad_response_candidate (7) | none for metadata | complete |
| 72 / 240 | [videogen](https://manufact.com/mcp-catalog/videogen) | 88 / A | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 241 | [Vivid MCP](https://manufact.com/mcp-catalog/vivid-mcp) | 88 / A † | financial-services | 0/1/0 | 1257 |  (0) | none for metadata | complete |
| — / 242 | [Wego](https://manufact.com/mcp-catalog/wego) | 88 / A † | travel | 0/7/3 | 10684 | response_control_size_unclear, broad_response_candidate (4) | none for metadata | complete |
| 73 / 243 | [Wispr Flow](https://manufact.com/mcp-catalog/wispr-flow) | 88 / A | communication | — | — | — | required; free/paid unknown | credentials_required |
| 74 / 244 | [yes2sdk](https://manufact.com/mcp-catalog/yes2sdk) | 88 / A | developer-tools | 0/15/1 | 4788 | broad_response_candidate, overlapping_read_tools (2) | none for metadata | complete |
| — / 245 | [aster-share](https://manufact.com/mcp-catalog/aster-share) | 87 / A | business-productivity | 0/2/0 | 524 | broad_response_candidate (1) | none for metadata | complete |
| — / 246 | [Charming](https://manufact.com/mcp-catalog/charm-ing) | 87 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 75 / 247 | [CometChat Docs](https://manufact.com/mcp-catalog/cometchat) | 87 / A | developer-tools | 0/4/0 | 1218 | overlapping_read_tools (6) | none for metadata | complete |
| 76 / 248 | [dev-studio-devhub-mcp](https://manufact.com/mcp-catalog/sabre-developer-hub-mcp-server) | 87 / A | developer-tools | 0/10/0 | 1873 | overlapping_read_tools (1) | none for metadata | complete |
| 77 / 249 | [Empirical Health — Meals and Lab Locations](https://manufact.com/mcp-catalog/empirical-health-meals-and-lab-locations) | 87 / A |  | 0/10/0 | 1568 | response_control_size_unclear (5) | none for metadata | complete |
| 78 / 250 | [leadbay-mcp](https://manufact.com/mcp-catalog/mcp-leadbay-app) | 87 / A | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 79 / 251 | [pmw-mcp](https://manufact.com/mcp-catalog/postermywall) | 87 / A | design-creative | 0/0/0 | 3133 |  (0) | none for metadata | complete |
| 80 / 252 | [seam-docs-mcp](https://manufact.com/mcp-catalog/seam) | 87 / A | developer-tools | 0/11/1 | 2044 | broad_response_candidate, overlapping_read_tools (2) | none for metadata | complete |
| 81 / 253 | [Shoppable](https://manufact.com/mcp-catalog/shoppable) | 87 / A | commerce-shopping | 0/9/0 | 4722 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default (6) | none for metadata | complete |
| 82 / 254 | [Whalesync](https://manufact.com/mcp-catalog/whalesync) | 87 / A | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| 83 / 255 | [xflowpay-mcp](https://manufact.com/mcp-catalog/xflow) | 87 / A | financial-services | 0/3/0 | 1648 |  (0) | none for metadata | complete |
| — / 256 | [aloha-fyi-hawaii](https://manufact.com/mcp-catalog/aloha-fyi) | 86 / A | travel | 0/7/0 | 2381 | potentially_expensive_default, overlapping_read_tools (12) | none for metadata | complete |
| 84 / 257 | [Channel3 Shopping](https://manufact.com/mcp-catalog/channel3-shopping) | 86 / A | commerce-shopping | 8/15/0 | 2177 | response_control_size_unclear, overlapping_read_tools (4) | none for metadata | complete |
| — / 258 | [Cordelia Cruises](https://manufact.com/mcp-catalog/cordelia-cruises) | 86 / A † | travel | 0/9/0 | 1568 | broad_response_candidate (1) | none for metadata | complete |
| — / 259 | [courtsapp](https://manufact.com/mcp-catalog/courtsapp) | 86 / A | consumer-health | 10/22/1 | 6191 | response_control_size_unclear, broad_response_candidate (3) | none for metadata | complete |
| 85 / 260 | [eulaw.ai](https://manufact.com/mcp-catalog/eulaw-ai) | 86 / A | search-research | 0/4/0 | 1575 | potentially_expensive_default (1) | none for metadata | complete |
| 86 / 261 | [firecrawl-fastmcp](https://manufact.com/mcp-catalog/firecrawl) | 86 / A | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 262 | [MacQueen](https://manufact.com/mcp-catalog/macqueen) | 86 / A † | travel | 4/4/0 | 3247 | overlapping_read_tools (1) | none for metadata | complete |
| 87 / 263 | [monday.com](https://manufact.com/mcp-catalog/monday-com) | 86 / A | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 264 | [PttAVM](https://manufact.com/mcp-catalog/pttavm) | 86 / A † | commerce-shopping | 5/44/1 | 3225 | response_control_size_unclear (3) | none for metadata | complete |
| — / 265 | [Trip Logistics Assistant](https://manufact.com/mcp-catalog/trip-logistics-assistant) | 86 / A † | travel | 0/8/0 | 2182 | broad_response_candidate (2) | none for metadata | complete |
| 88 / 266 | [adobe-llm-apps](https://manufact.com/mcp-catalog/adobe-llm-apps) | 85 / A | commerce-shopping | 0/14/0 | 3066 | response_control_size_unclear, overlapping_read_tools (3) | none for metadata | complete |
| — / 267 | [agentphone](https://manufact.com/mcp-catalog/mcp-agentphone-ai) | 85 / A | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 268 | [AirShelf](https://manufact.com/mcp-catalog/airshelf) | 85 / A | commerce-shopping | 0/2/3 | 6252 | broad_response_candidate, overlapping_read_tools (3) | none for metadata | complete |
| 89 / 269 | [aiwyn](https://manufact.com/mcp-catalog/aiwyn-tax-formerly-column-tax) | 85 / A | financial-services | — | — | — | none (catalog; live unavailable) | server_error |
| — / 270 | [aquent-jobs](https://manufact.com/mcp-catalog/aquent-job-search) | 85 / A | business-productivity | 0/11/0 | 1564 | broad_response_candidate, potentially_expensive_default (6) | none for metadata | complete |
| 90 / 271 | [Clerk MCP Server](https://manufact.com/mcp-catalog/clerk) | 85 / A | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 91 / 272 | [Ezoic Setup](https://manufact.com/mcp-catalog/ezoic-setup) | 85 / A | developer-tools | 0/8/0 | 1011 |  (0) | none for metadata | complete |
| — / 273 | [flusterduck](https://manufact.com/mcp-catalog/flusterduck) | 85 / A | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 92 / 274 | [mastercard-developers-mcp](https://manufact.com/mcp-catalog/mastercard-developers) | 85 / A | financial-services | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| 93 / 275 | [mdn](https://manufact.com/mcp-catalog/mdn) | 85 / A | developer-tools | 0/6/0 | 699 |  (0) | none for metadata | complete |
| 94 / 276 | [Raylight](https://manufact.com/mcp-catalog/api-raylight-app) | 85 / A | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 277 | [Rhizome AI - FDA & HA Regulatory Research](https://manufact.com/mcp-catalog/rhizome-ai) | 85 / A | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 95 / 278 | [storyflow](https://manufact.com/mcp-catalog/mcp-storyflow-so) | 85 / A | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 96 / 279 | [stripe-mcp](https://manufact.com/mcp-catalog/stripe) | 85 / A | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 97 / 280 | [taxact](https://manufact.com/mcp-catalog/taxact) | 85 / A | financial-services | 0/17/0 | 4178 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default (6) | none for metadata | complete |
| 98 / 281 | [tixel](https://manufact.com/mcp-catalog/tixel) | 85 / A | commerce-shopping | 0/2/0 | 2781 | broad_response_candidate (1) | none for metadata | complete |
| 99 / 282 | [Zenfinance](https://manufact.com/mcp-catalog/mcp-zenfin-tech) | 85 / A | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 283 | [Airfield Directory MCP](https://manufact.com/mcp-catalog/airfield-directory) | 84 / B | search-research | 9/34/0 | 3423 | response_control_size_unclear (5) | none for metadata | complete |
| 100 / 284 | [Axiom MCP Server](https://manufact.com/mcp-catalog/axiom) | 84 / B | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 101 / 285 | [commercetools knowledge](https://manufact.com/mcp-catalog/commercetools-knowledge) | 84 / B | developer-tools | 0/7/0 | 6490 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 102 / 286 | [firecrawl-fastmcp](https://manufact.com/mcp-catalog/mcp-firecrawl-dev) | 84 / B | search-research | 4/40/2 | 7598 | response_control_size_unclear (19) | none for metadata | complete |
| 103 / 287 | [Microsoft Learn MCP Server](https://manufact.com/mcp-catalog/microsoft-learn-mcp-server) | 84 / B | developer-tools | 0/1/1 | 1612 | broad_response_candidate (1) | none for metadata | complete |
| 104 / 288 | [resend](https://manufact.com/mcp-catalog/resend-2) | 84 / B | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 289 | [Wirechunk](https://manufact.com/mcp-catalog/wirechunk) | 84 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 290 | [Acquirepad CRE Activity Intelligence](https://manufact.com/mcp-catalog/acquirepad-real-estate-intelligence) | 83 / B | data-analytics | 9/52/0 | 4519 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (21) | none for metadata | complete |
| — / 291 | [aeo-engine-aeo-report](https://manufact.com/mcp-catalog/aeoengine-ai) | 83 / B | sales-and-marketing | 0/3/0 | 1490 | broad_response_candidate (1) | none for metadata | complete |
| — / 292 | [almatar-mcp](https://manufact.com/mcp-catalog/almatar) | 83 / B | commerce-shopping | 2/10/2 | 3702 | broad_response_candidate (2) | none for metadata | complete |
| 105 / 293 | [b12-mcp-server](https://manufact.com/mcp-catalog/website-generator-by-b12) | 83 / B | developer-tools | 0/1/0 | 751 |  (0) | none for metadata | complete |
| — / 294 | [braintrust-mcp-server](https://manufact.com/mcp-catalog/api-braintrust-dev) | 83 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 106 / 295 | [dex](https://manufact.com/mcp-catalog/dex-personal-crm) | 83 / B | sales-and-marketing | 0/35/8 | 45479 | potentially_expensive_default, broad_response_candidate, response_control_size_unclear (35) | required; free/paid unknown | complete |
| 107 / 296 | [foodora](https://manufact.com/mcp-catalog/foodora) | 83 / B | commerce-shopping | 0/0/3 | 4733 | broad_response_candidate (1) | none for metadata | complete |
| 108 / 297 | [indiamart-marketplace](https://manufact.com/mcp-catalog/indiamart-b2b-marketplace) | 83 / B | commerce-shopping | 0/1/1 | 2840 | broad_response_candidate, response_control_size_unclear (2) | none for metadata | complete |
| 109 / 298 | [item-brain](https://manufact.com/mcp-catalog/item-2) | 83 / B | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 110 / 299 | [Kosa](https://manufact.com/mcp-catalog/kosa) | 83 / B | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 111 / 300 | [mallary-mcp](https://manufact.com/mcp-catalog/mallary-mcp) | 83 / B | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 112 / 301 | [mcp-server-neon](https://manufact.com/mcp-catalog/neon) | 83 / B | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 302 | [MyRace AI](https://manufact.com/mcp-catalog/myrace-ai) | 83 / B † | data-analytics | 0/10/4 | 5863 | response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (15) | none for metadata | complete |
| — / 303 | [Sim](https://manufact.com/mcp-catalog/sim) | 83 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 113 / 304 | [typenode-mcp](https://manufact.com/mcp-catalog/typenode-mcp) | 83 / B | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| 114 / 305 | [Zero MCP](https://manufact.com/mcp-catalog/api-zero-inc) | 83 / B | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 115 / 306 | [adwhispr](https://manufact.com/mcp-catalog/adwhispr-ads) | 82 / B | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 116 / 307 | [Atsign AI Architect](https://manufact.com/mcp-catalog/atsign-ai-architect) | 82 / B † | developer-tools | 0/36/0 | 6053 | broad_response_candidate, overlapping_read_tools (6) | none for metadata | complete |
| 117 / 308 | [Devart Learn](https://manufact.com/mcp-catalog/devart-learn) | 82 / B † | developer-tools | 0/3/0 | 631 | broad_response_candidate, overlapping_read_tools (2) | none for metadata | complete |
| — / 309 | [Dropbox Official MCP Server](https://manufact.com/mcp-catalog/dropbox-official-mcp-server) | 82 / B | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 118 / 310 | [firecrawl-fastmcp](https://manufact.com/mcp-catalog/mcp-firecrawl-dev-2) | 82 / B | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 119 / 311 | [foodpanda](https://manufact.com/mcp-catalog/foodpanda) | 82 / B | commerce-shopping | 0/0/3 | 4733 | broad_response_candidate (1) | none for metadata | complete |
| — / 312 | [GameAnalytics Documentation](https://manufact.com/mcp-catalog/gameanalytics-documentation) | 82 / B † | data-analytics | 0/2/0 | 668 | broad_response_candidate (2) | none for metadata | complete |
| — / 313 | [gpt-war](https://manufact.com/mcp-catalog/alpix) | 82 / B | creative | 0/2/1 | 1843 |  (0) | none for metadata | complete |
| 120 / 314 | [gpt-war](https://manufact.com/mcp-catalog/gpt-war) | 82 / B | design-creative | 0/2/1 | 1843 |  (0) | none for metadata | complete |
| 121 / 315 | [iscanner-mcp-app](https://manufact.com/mcp-catalog/iscanner) | 82 / B | productivity | 0/0/1 | 2677 | broad_response_candidate (3) | none for metadata | complete |
| 122 / 316 | [Mailgun Docs MCP](https://manufact.com/mcp-catalog/mailgun-docs-mcp) | 82 / B † | developer-tools | 0/2/1 | 1592 | broad_response_candidate (1) | none for metadata | complete |
| — / 317 | [NAVI Protocol](https://manufact.com/mcp-catalog/navi-protocol) | 82 / B † | financial-services | 0/85/0 | 8031 | broad_response_candidate, response_control_size_unclear (13) | none for metadata | complete |
| 123 / 318 | [pg-aiguide](https://manufact.com/mcp-catalog/pg-aiguide) | 82 / B | developer-tools | 0/0/1 | 5011 |  (0) | none for metadata | complete |
| 124 / 319 | [PostHog](https://manufact.com/mcp-catalog/posthog) | 82 / B | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 125 / 320 | [Sinch Build Docs](https://manufact.com/mcp-catalog/sinch-build-docs) | 82 / B † | developer-tools | 0/1/1 | 1314 | broad_response_candidate (1) | none for metadata | complete |
| 126 / 321 | [SlidesGPT](https://manufact.com/mcp-catalog/slidesgpt) | 82 / B | design-creative | 0/2/1 | 7210 | broad_response_candidate (2) | none for metadata | complete |
| 127 / 322 | [superhuman-mcp](https://manufact.com/mcp-catalog/superhuman-mail) | 82 / B | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 323 | [sz-mcp-coworker](https://manufact.com/mcp-catalog/senzing) | 82 / B | data-analytics | 5/21/4 | 14892 | broad_response_candidate (5) | none for metadata | complete |
| — / 324 | [theneo-editor-api](https://manufact.com/mcp-catalog/theneo-editor-api) | 82 / B † |  | — | — | — | required; free/paid unknown | credentials_required |
| 128 / 325 | [tinyfish](https://manufact.com/mcp-catalog/tinyfish) | 82 / B | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| 129 / 326 | [Vuetify MCP](https://manufact.com/mcp-catalog/vuetify-mcp) | 82 / B | developer-tools | 12/52/0 | 6230 | broad_response_candidate, overlapping_read_tools (84) | none for metadata | complete |
| 130 / 327 | [AgentCard](https://manufact.com/mcp-catalog/agentcard) | 81 / B | financial-services | 0/22/2 | 18634 | broad_response_candidate, overlapping_read_tools (14) | none for metadata | complete |
| — / 328 | [Brasserie Georges](https://manufact.com/mcp-catalog/brasserie-georges) | 81 / B | commerce-shopping | 0/4/0 | 4245 | overlapping_read_tools (1) | none for metadata | complete |
| 131 / 329 | [Claude App MCP Server](https://manufact.com/mcp-catalog/dropbox) | 81 / B | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 330 | [ClickStack MCP Server](https://manufact.com/mcp-catalog/mcp-clickhouse-cloud) | 81 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 132 / 331 | [compiler-explorer](https://manufact.com/mcp-catalog/compiler-explorer) | 81 / B | developer-tools | 0/14/0 | 3815 | potentially_expensive_default (3) | none for metadata | complete |
| 133 / 332 | [mermaid-claude-app](https://manufact.com/mcp-catalog/mermaid-chart) | 81 / B | design-creative | 0/1/0 | 565 |  (0) | none for metadata | complete |
| 134 / 333 | [omnilex](https://manufact.com/mcp-catalog/omnilex) | 81 / B | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 135 / 334 | [Supabase](https://manufact.com/mcp-catalog/supabase) | 81 / B | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 136 / 335 | [Wolfram](https://manufact.com/mcp-catalog/wolfram) | 81 / B | search-research | 0/3/0 | 971 |  (0) | none for metadata | complete |
| — / 336 | [almosafer-mcp](https://manufact.com/mcp-catalog/almosafer-com) | 80 / B | travel | 0/2/2 | 7957 | broad_response_candidate, response_control_size_unclear (3) | none for metadata | complete |
| 137 / 337 | [avo-mcp-server](https://manufact.com/mcp-catalog/avo) | 80 / B | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 138 / 338 | [block-cash-app-ordering-mcp-server](https://manufact.com/mcp-catalog/order-by-cash-app) | 80 / B | commerce-shopping | 0/9/0 | 3065 | overlapping_read_tools (1) | none for metadata | complete |
| — / 339 | [firm-memory](https://manufact.com/mcp-catalog/firm-memory-mcp-fly-dev) | 80 / B | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 139 / 340 | [Make MCP Server](https://manufact.com/mcp-catalog/make) | 80 / B | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 341 | [pietro.zullo](https://manufact.com/mcp-catalog/skilder) | 80 / B | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 140 / 342 | [recommerce-chatgpt-app](https://manufact.com/mcp-catalog/recommerce) | 80 / B | commerce-shopping | 0/2/0 | 3408 | broad_response_candidate (1) | none for metadata | complete |
| 141 / 343 | [tldraw Canvas](https://manufact.com/mcp-catalog/tldraw) | 80 / B | design-creative | 10/22/1 | 2224 | broad_response_candidate (1) | none for metadata | complete |
| 142 / 344 | [Zapier MCP](https://manufact.com/mcp-catalog/zapier) | 80 / B | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| 143 / 345 | [athenahq](https://manufact.com/mcp-catalog/athenahq) | 79 / B | marketing-seo | 182/358/10 | 107692 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (135) | none for metadata | complete |
| — / 346 | [Blossom Hill](https://manufact.com/mcp-catalog/calm-steel-fqshc-run-mcp-use-com) | 79 / B |  | 0/2/0 | — |  (0) | none for metadata | complete |
| 144 / 347 | [Coverage Cat Insurance](https://manufact.com/mcp-catalog/coverage-cat-insurance) | 79 / B | financial-services | 31/86/7 | 14441 | response_control_size_unclear (4) | none for metadata | complete |
| — / 348 | [Darwin](https://manufact.com/mcp-catalog/mcp-darwin-so) | 79 / B | automation-workflows | 14/37/0 | — | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (11) | none for metadata | complete |
| 145 / 349 | [findadomain-api](https://manufact.com/mcp-catalog/findadomain-api) | 79 / B | developer-tools | 0/2/0 | 571 | broad_response_candidate (1) | none for metadata | complete |
| 146 / 350 | [Gram](https://manufact.com/mcp-catalog/planetscale) | 79 / B | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 351 | [MCP LeadFlow](https://manufact.com/mcp-catalog/mcp-leadflow) | 79 / B | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 147 / 352 | [Monotype Fonts](https://manufact.com/mcp-catalog/fonts) | 79 / B | design-creative | 0/3/3 | 5390 | broad_response_candidate (2) | none for metadata | complete |
| 148 / 353 | [AWSKnowledgeMCP](https://manufact.com/mcp-catalog/awsknowledgemcp) | 78 / B | developer-tools | 0/7/2 | 3418 | potentially_expensive_default, broad_response_candidate (4) | none for metadata | complete |
| 149 / 354 | [OpenRouterMcp](https://manufact.com/mcp-catalog/openroutermcp) | 78 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 355 | [Virtual Fly Brain](https://manufact.com/mcp-catalog/virtual-fly-brain) | 78 / B † | healthcare | 0/12/5 | 9333 | broad_response_candidate, potentially_expensive_default (5) | none for metadata | complete |
| — / 356 | [advisorworld-reference-data](https://manufact.com/mcp-catalog/advisorworld-reference-data) | 77 / B | financial-services | 15/98/0 | 7395 | broad_response_candidate, overlapping_read_tools (12) | none for metadata | complete |
| — / 357 | [agentic-review](https://manufact.com/mcp-catalog/mcp-agenticreview-io) | 77 / B | travel | 15/60/1 | 5106 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| 150 / 358 | [alphavantage-mcp-server](https://manufact.com/mcp-catalog/alpha-vantage-mcp-server) | 77 / B | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 151 / 359 | [Carbon Voice MCP Server](https://manufact.com/mcp-catalog/carbon-voice) | 77 / B | communication | — | — | — | required; free/paid unknown | credentials_required |
| 152 / 360 | [clay-for-reps](https://manufact.com/mcp-catalog/clay) | 77 / B | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 153 / 361 | [hevy-mcp](https://manufact.com/mcp-catalog/mcp-hevy-mcp-dev) | 77 / B |  | — | — | — | required; free/paid unknown | credentials_required |
| 154 / 362 | [omnara](https://manufact.com/mcp-catalog/app-omnara-com) | 77 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 155 / 363 | [Sentry MCP](https://manufact.com/mcp-catalog/sentry) | 77 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 156 / 364 | [goodnotes-mcp-server](https://manufact.com/mcp-catalog/goodnotes) | 76 / B | productivity | 0/3/0 | 2932 | response_control_size_unclear (1) | none for metadata | complete |
| 157 / 365 | [htag-docs](https://manufact.com/mcp-catalog/htag-documentation) | 76 / B | developer-tools | 3/7/0 | 1138 | overlapping_read_tools (1) | none for metadata | complete |
| — / 366 | [LangQuang](https://manufact.com/mcp-catalog/langquang) | 76 / B | data-analytics | — | — | — | required; free/paid unknown | server_error |
| — / 367 | [mcp-techimpossible-public](https://manufact.com/mcp-catalog/mcp-techimpossible-com) | 76 / B |  | 12/49/0 | 10226 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (52) | none for metadata | complete |
| — / 368 | [atl-aliexpress](https://manufact.com/mcp-catalog/atl-aliexpress) | 75 / B | commerce-shopping | 7/32/0 | 4361 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (14) | none for metadata | complete |
| 158 / 369 | [MCP Lambdatest](https://manufact.com/mcp-catalog/mcp-lambdatest) | 75 / B | developer-tools | 0/159/1 | 30358 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (149) | none for metadata | complete |
| 159 / 370 | [orq-mcp](https://manufact.com/mcp-catalog/my-orq-ai) | 75 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 160 / 371 | [twilio-docs-mcp](https://manufact.com/mcp-catalog/twilio) | 75 / B | communication | 0/2/0 | 2027 | broad_response_candidate (2) | none for metadata | complete |
| 161 / 372 | [workers-bindings](https://manufact.com/mcp-catalog/workers-bindings) | 75 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 373 | [aediv-mcp](https://manufact.com/mcp-catalog/aedi-v) | 74 / B | commerce-shopping | 3/15/0 | 2049 |  (0) | none for metadata | complete |
| — / 374 | [Embassys](https://manufact.com/mcp-catalog/staging-embassys-ai) | 74 / B | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 375 | [light-remote](https://manufact.com/mcp-catalog/light-remote-thaiduy-digital) | 74 / B | developer-tools | 243/548/0 | 26088 | response_control_size_unclear, broad_response_candidate (36) | none for metadata | complete |
| — / 376 | [Wayfinder · Travel lab](https://manufact.com/mcp-catalog/wild-cloud-p762x-run-mcp-use-com) | 74 / B | commerce-shopping | 6/19/0 | 1777 | overlapping_read_tools (1) | none for metadata | complete |
| — / 377 | [Agno](https://manufact.com/mcp-catalog/agno) | 73 / B | developer-tools | 0/0/2 | 3535 |  (0) | none for metadata | complete |
| 162 / 378 | [biorxiv](https://manufact.com/mcp-catalog/biorxiv) | 73 / B | search-research | 0/0/1 | 5353 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (11) | none for metadata | complete |
| 163 / 379 | [clinical_trials](https://manufact.com/mcp-catalog/clinical-trials) | 73 / B | search-research | 0/1/5 | 9391 | broad_response_candidate, potentially_expensive_default (6) | none for metadata | complete |
| 164 / 380 | [magic-patterns](https://manufact.com/mcp-catalog/magic-patterns) | 73 / B | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 165 / 381 | [Model Context Protocol server for Open Targets Platform version 2026.7.1](https://manufact.com/mcp-catalog/open-targets) | 73 / B | search-research | 0/3/3 | 5726 | broad_response_candidate (2) | none for metadata | complete |
| 166 / 382 | [clarity-sfdr20-mcp](https://manufact.com/mcp-catalog/clarity-ai) | 72 / B | financial-services | 10/27/0 | 1876 |  (0) | none for metadata | complete |
| 167 / 383 | [Crypto.com Exchange MCP](https://manufact.com/mcp-catalog/crypto-com) | 72 / B | financial-services | 9/19/0 | 1431 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (8) | none for metadata | complete |
| 168 / 384 | [drawio-mcp-app](https://manufact.com/mcp-catalog/draw-io) | 72 / B | design-creative | 0/3/1 | 3705 | response_control_size_unclear (1) | none for metadata | complete |
| 169 / 385 | [Miro MCP](https://manufact.com/mcp-catalog/miro-mcp) | 72 / B | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 170 / 386 | [chembl](https://manufact.com/mcp-catalog/chembl) | 71 / B | search-research | 0/0/6 | 9915 | response_control_size_unclear, broad_response_candidate (3) | none for metadata | complete |
| 171 / 387 | [DeepWiki](https://manufact.com/mcp-catalog/deepwiki) | 71 / B | developer-tools | 0/3/0 | 724 | overlapping_read_tools (1) | none for metadata | complete |
| 172 / 388 | [PandaDoc](https://manufact.com/mcp-catalog/pandadoc) | 71 / B | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 173 / 389 | [Calendly](https://manufact.com/mcp-catalog/calendly) | 70 / B | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 174 / 390 | [coingecko_coingecko_typescript_api](https://manufact.com/mcp-catalog/coingecko-coingecko-typescript-api) | 70 / B | developer-tools | 0/2/1 | 986 | response_control_size_unclear (1) | none for metadata | complete |
| 175 / 391 | [seqera-mcp-server](https://manufact.com/mcp-catalog/seqera-mcp-server) | 70 / B | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 176 / 392 | [Crustdata MCP Server](https://manufact.com/mcp-catalog/crustdata) | 69 / C | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 177 / 393 | [motley](https://manufact.com/mcp-catalog/motley) | 69 / C | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 178 / 394 | [Site Visitor Assistant for site "Jordy Brechkoff " (https://www.jordybrechkoff.com/_api/mcp)](https://manufact.com/mcp-catalog/site-visitor-assistant-for-site-jordy-brechkoff-ht) | 69 / C | developer-tools | 0/10/5 | 14756 | broad_response_candidate, overlapping_read_tools (7) | none for metadata | complete |
| — / 395 | [Little Bookshop](https://manufact.com/mcp-catalog/little-bookshop) | 68 / C | commerce-shopping | 4/14/0 | — | broad_response_candidate, response_control_size_unclear (3) | none for metadata | complete |
| — / 396 | [Twinbay API Digital Twins](https://manufact.com/mcp-catalog/twinbay) | 68 / C | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 179 / 397 | [MoSPI Data Server](https://manufact.com/mcp-catalog/mospi) | 67 / C | data-analytics | 0/12/0 | 4019 | response_control_size_unclear, broad_response_candidate (6) | none for metadata | complete |
| 180 / 398 | [Excalidraw](https://manufact.com/mcp-catalog/excalidraw) | 65 / C | design-creative | 3/13/0 | 922 | broad_response_candidate (1) | none for metadata | complete |
| 181 / 399 | [netlify](https://manufact.com/mcp-catalog/netlify) | 65 / C | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 400 | [stagehand-api](https://manufact.com/mcp-catalog/mcp-browserbase-com) | 65 / C | search-research | 4/16/0 | 1529 |  (0) | none for metadata | complete |
| — / 401 | [AgentArea](https://manufact.com/mcp-catalog/api-agentarea-ru) | 64 / C | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 182 / 402 | [mysukriramli](https://manufact.com/mcp-catalog/mysukriramli) | 64 / C |  | — | — | — | required; free/paid unknown | credentials_required |
| 183 / 403 | [t0](https://manufact.com/mcp-catalog/t0) | 64 / C | financial-services | 38/80/0 | 24239 | response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (83) | none for metadata | complete |
| 184 / 404 | [Fleet Workspace](https://manufact.com/mcp-catalog/fleet-workspace) | 63 / C | productivity | 98/219/2 | 11285 | response_control_size_unclear, broad_response_candidate (29) | none for metadata | complete |
| 185 / 405 | [fiber-core](https://manufact.com/mcp-catalog/fiber-core) | 62 / C | developer-tools | 3/14/0 | 1543 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (8) | none for metadata | complete |
| — / 406 | [flywheel](https://manufact.com/mcp-catalog/flywheel-paradigma-inc) | 62 / C | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 186 / 407 | [Corsair Cloud](https://manufact.com/mcp-catalog/corsair-cloud) | 61 / C | automation-workflows | — | — | — | unknown | connection_or_protocol_failure |
| 187 / 408 | [crunchbase-mcp](https://manufact.com/mcp-catalog/crunchbase-mcp) | 61 / C | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 188 / 409 | [economic_index](https://manufact.com/mcp-catalog/anthropic-economic-index) | 61 / C | data-analytics | 0/0/8 | 6190 | broad_response_candidate (2) | none for metadata | complete |
| 189 / 410 | [Fleet connected tools](https://manufact.com/mcp-catalog/fleet-connected-tools) | 61 / C | communication | 9/16/0 | 1129 | response_control_size_unclear (1) | none for metadata | complete |
| 190 / 411 | [kaneo-mcp](https://manufact.com/mcp-catalog/cloud-kaneo-app) | 61 / C | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 412 | [mcp.bird.com](https://manufact.com/mcp-catalog/mcp-bird-com) | 60 / C |  | — | — | — | required; free/paid unknown | credentials_required |
| 191 / 413 | [mf-mcp-server](https://manufact.com/mcp-catalog/mcp-hostedgraphite-com) | 60 / C | developer-tools | 31/157/0 | 6979 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (27) | none for metadata | complete |
| — / 414 | [propelauth_mcp](https://manufact.com/mcp-catalog/propelauth-mcp) | 56 / C | developer-tools | 0/25/1 | 5779 | broad_response_candidate (1) | none for metadata | complete |
| 192 / 415 | [Klaviyo MCP Server](https://manufact.com/mcp-catalog/klaviyo-mcp-server) | 55 / C |  | — | — | — | required; free/paid unknown | credentials_required |
| 193 / 416 | [mcp.magichour.ai](https://manufact.com/mcp-catalog/mcp-magichour-ai) | 55 / C |  | 6/56/11 | 52495 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate, overlapping_read_tools (58) | none for metadata | complete |
| 194 / 417 | [Banger Company Email](https://manufact.com/mcp-catalog/banger-company-email) | 54 / C |  | — | — | — | required; free/paid unknown | credentials_required |
| 195 / 418 | [rentahuman.ai](https://manufact.com/mcp-catalog/rentahuman-ai) | 49 / C |  | 0/63/7 | 37777 | potentially_expensive_default, response_control_size_unclear, broad_response_candidate, overlapping_read_tools (37) | none for metadata | complete |
| — / 419 | [ERP L.O.M.](https://manufact.com/mcp-catalog/erp-l-o-m) | 48 / C |  | — | — | — | required; free/paid unknown | credentials_required |
| 196 / 420 | [mcp.chytryrejstrik.cz](https://manufact.com/mcp-catalog/mcp-chytryrejstrik-cz) | 46 / C |  | — | — | — | required; free/paid unknown | credentials_required |
| 197 / 421 | [MotherDuck](https://manufact.com/mcp-catalog/motherduck) | 42 / C | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 422 | [0Delta.ai](https://manufact.com/mcp-catalog/0delta-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 423 | [0xArchive](https://manufact.com/mcp-catalog/0xarchive) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 424 | [1Social](https://manufact.com/mcp-catalog/1social) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 425 | [1stCollab](https://manufact.com/mcp-catalog/1stcollab) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 426 | [3DOptix optical design and simulations](https://manufact.com/mcp-catalog/3doptix-optical-design-and-simulations) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 198 / 427 | [3dsellers MCP](https://manufact.com/mcp-catalog/3dsellers-mcp) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 199 / 428 | [3Min API](https://manufact.com/mcp-catalog/3min-api) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 200 / 429 | [6sense](https://manufact.com/mcp-catalog/6sense) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 201 / 430 | [8am MyCase](https://manufact.com/mcp-catalog/8am-mycase) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 202 / 431 | [9pm](https://manufact.com/mcp-catalog/9pm) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 203 / 432 | [Abacum.ai](https://manufact.com/mcp-catalog/abacum-ai) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 433 | [Able SEO by VibeSEO](https://manufact.com/mcp-catalog/able-seo-by-vibeseo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 434 | [Aboard](https://manufact.com/mcp-catalog/aboard) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 435 | [AC - Artificial Conscience®](https://manufact.com/mcp-catalog/ac-artificial-conscience) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 436 | [accessibilitytracker.com](https://manufact.com/mcp-catalog/accessibilitytracker-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 204 / 437 | [AccessLint](https://manufact.com/mcp-catalog/accesslint) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 438 | [Ace Work](https://manufact.com/mcp-catalog/ace-work) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 205 / 439 | [Acoustic](https://manufact.com/mcp-catalog/acoustic) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 440 | [Act Security](https://manufact.com/mcp-catalog/act-security) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 206 / 441 | [Actively](https://manufact.com/mcp-catalog/actively) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 442 | [Ad Superpowers](https://manufact.com/mcp-catalog/ad-superpowers) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 443 | [AdaptlyPost - social media scheduler](https://manufact.com/mcp-catalog/adaptlypost-social-media-scheduler) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 207 / 444 | [Addepar MCP](https://manufact.com/mcp-catalog/addepar-mcp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 445 | [AdisInsight](https://manufact.com/mcp-catalog/adisinsight) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 446 | [ADITUS Evo](https://manufact.com/mcp-catalog/aditus-evo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 447 | [AdKit - Ads Manager](https://manufact.com/mcp-catalog/adkit-ads-manager) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 448 | [AdLabs - Amazon Ads](https://manufact.com/mcp-catalog/adlabs-amazon-ads) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 449 | [Adlicio](https://manufact.com/mcp-catalog/adlicio) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 208 / 450 | [Admetrics](https://manufact.com/mcp-catalog/admetrics) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 209 / 451 | [Adobe Customer Journey Analytics](https://manufact.com/mcp-catalog/adobe-customer-journey-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 210 / 452 | [Adobe Experience Manager](https://manufact.com/mcp-catalog/adobe-experience-manager) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 211 / 453 | [Adobe for creativity](https://manufact.com/mcp-catalog/adobe-for-creativity) | — / — | design-creative | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| 212 / 454 | [Adobe Journey Optimizer](https://manufact.com/mcp-catalog/adobe-journey-optimizer) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 213 / 455 | [Adobe Marketing Agent](https://manufact.com/mcp-catalog/adobe-marketing-agent) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 214 / 456 | [Adobe Workfront](https://manufact.com/mcp-catalog/adobe-workfront) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 457 | [Adology](https://manufact.com/mcp-catalog/adology) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 458 | [Adomik Jean Pierre](https://manufact.com/mcp-catalog/adomik-jean-pierre) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 459 | [adplane](https://manufact.com/mcp-catalog/adplane) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 215 / 460 | [adsagent.md](https://manufact.com/mcp-catalog/adsagent-md) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 461 | [Adshelf](https://manufact.com/mcp-catalog/adshelf) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 462 | [AdShields](https://manufact.com/mcp-catalog/adshields) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 463 | [Adside — Meta Ads, Google Ads & LinkedIn Ads reporting for agencies](https://manufact.com/mcp-catalog/adside-meta-ads-google-ads-linkedin-ads-reporting) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 464 | [Adspirer Ads & Performance Marketing Agent](https://manufact.com/mcp-catalog/adspirer-ads-performance-marketing-agent) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 465 | [Advanced GSC](https://manufact.com/mcp-catalog/advanced-gsc) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 466 | [AdvisorPPC - Google Ads, Analytics, Tag Manager, Search Console and YouTube Connector](https://manufact.com/mcp-catalog/advisorppc-google-ads-analytics-tag-manager-search) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 467 | [Advogalia](https://manufact.com/mcp-catalog/advogalia) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 216 / 468 | [Adzviser](https://manufact.com/mcp-catalog/adzviser) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 469 | [Adzviser ActiveCampaign](https://manufact.com/mcp-catalog/adzviser-activecampaign) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 470 | [Adzviser Adobe Analytics](https://manufact.com/mcp-catalog/adzviser-adobe-analytics) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 471 | [Adzviser AdRoll](https://manufact.com/mcp-catalog/adzviser-adroll) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 472 | [Adzviser Amazon Seller Central](https://manufact.com/mcp-catalog/adzviser-amazon-seller-central) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 473 | [Adzviser BigCommerce](https://manufact.com/mcp-catalog/adzviser-bigcommerce) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 474 | [Adzviser Business Profile](https://manufact.com/mcp-catalog/adzviser-business-profile) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 475 | [Adzviser CallRail](https://manufact.com/mcp-catalog/adzviser-callrail) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 476 | [Adzviser CallTrackingMetrics](https://manufact.com/mcp-catalog/adzviser-calltrackingmetrics) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 477 | [Adzviser CM360](https://manufact.com/mcp-catalog/adzviser-cm360) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 478 | [Adzviser DV360](https://manufact.com/mcp-catalog/adzviser-dv360) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 479 | [Adzviser eBay](https://manufact.com/mcp-catalog/adzviser-ebay) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 480 | [Adzviser Google Analytics](https://manufact.com/mcp-catalog/adzviser-google-analytics) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 481 | [Adzviser HubSpot](https://manufact.com/mcp-catalog/adzviser-hubspot) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 482 | [Adzviser Instagram Insights](https://manufact.com/mcp-catalog/adzviser-instagram-insights) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 483 | [Adzviser Klaviyo](https://manufact.com/mcp-catalog/adzviser-klaviyo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 484 | [Adzviser Mailchimp](https://manufact.com/mcp-catalog/adzviser-mailchimp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 485 | [Adzviser Marketo](https://manufact.com/mcp-catalog/adzviser-marketo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 486 | [Adzviser Matomo](https://manufact.com/mcp-catalog/adzviser-matomo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 487 | [Adzviser Merchant Center](https://manufact.com/mcp-catalog/adzviser-merchant-center) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 488 | [Adzviser MNTN](https://manufact.com/mcp-catalog/adzviser-mntn) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 489 | [Adzviser Omnisend](https://manufact.com/mcp-catalog/adzviser-omnisend) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 490 | [Adzviser Pipedrive](https://manufact.com/mcp-catalog/adzviser-pipedrive) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 491 | [Adzviser SA360](https://manufact.com/mcp-catalog/adzviser-sa360) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 492 | [Adzviser Salesforce](https://manufact.com/mcp-catalog/adzviser-salesforce) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 493 | [Adzviser Search Console](https://manufact.com/mcp-catalog/adzviser-search-console) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 494 | [Adzviser Shopify](https://manufact.com/mcp-catalog/adzviser-shopify) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 495 | [Adzviser Sprout Social](https://manufact.com/mcp-catalog/adzviser-sprout-social) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 496 | [Adzviser The Trade Desk](https://manufact.com/mcp-catalog/adzviser-the-trade-desk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 497 | [Adzviser TikTok Shop](https://manufact.com/mcp-catalog/adzviser-tiktok-shop) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 498 | [Adzviser WooCommerce](https://manufact.com/mcp-catalog/adzviser-woocommerce) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 499 | [Adzviser YouTube](https://manufact.com/mcp-catalog/adzviser-youtube) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 500 | [Adzviser Zoho CRM](https://manufact.com/mcp-catalog/adzviser-zoho-crm) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 501 | [Aegis Mail](https://manufact.com/mcp-catalog/aegis-mail) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 502 | [Aerion](https://manufact.com/mcp-catalog/aerion) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 503 | [AFAS AI Connect, by iWebDevelopment](https://manufact.com/mcp-catalog/afas-ai-connect-by-iwebdevelopment) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 217 / 504 | [Affinity](https://manufact.com/mcp-catalog/affinity) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 218 / 505 | [Affirmed AI](https://manufact.com/mcp-catalog/affirmed-ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 506 | [AfterShip Channels for TikTok Shop](https://manufact.com/mcp-catalog/aftership-channels-for-tiktok-shop) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 219 / 507 | [AfterShip Post-Purchase](https://manufact.com/mcp-catalog/aftership-post-purchase) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 508 | [Agency AI](https://manufact.com/mcp-catalog/agency-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 220 / 509 | [AgencyAnalytics](https://manufact.com/mcp-catalog/agencyanalytics) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 510 | [AgendaForge](https://manufact.com/mcp-catalog/agendaforge) | — / — | productivity | 0/97/0 | 21948 | response_control_size_unclear, overlapping_read_tools (13) | required; free/paid unknown | complete |
| 221 / 511 | [Agensi](https://manufact.com/mcp-catalog/agensi) | — / — | developer-tools | 0/26/1 | 5195 | broad_response_candidate, overlapping_read_tools (4) | required; free/paid unknown | complete |
| — / 512 | [Agent Native Slides](https://manufact.com/mcp-catalog/agent-native-slides) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 513 | [agent-wiki](https://manufact.com/mcp-catalog/agent-wiki) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 514 | [AgentContext](https://manufact.com/mcp-catalog/agentcontext) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 515 | [AgentGrid.io](https://manufact.com/mcp-catalog/agentgrid-io) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 516 | [Agenticsis Visibility Monitor](https://manufact.com/mcp-catalog/agenticsis-visibility-monitor) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 517 | [Agentio](https://manufact.com/mcp-catalog/agentio) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 222 / 518 | [Agently](https://manufact.com/mcp-catalog/agently) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 519 | [AgentMailer](https://manufact.com/mcp-catalog/agentmailer) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 520 | [Agentwork](https://manufact.com/mcp-catalog/agentwork) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 223 / 521 | [Agility CMS](https://manufact.com/mcp-catalog/agility-cms) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 522 | [Agility PR Solutions](https://manufact.com/mcp-catalog/agility-pr-solutions) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 224 / 523 | [Agorapulse](https://manufact.com/mcp-catalog/agorapulse) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 225 / 524 | [Aha!](https://manufact.com/mcp-catalog/aha) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 226 / 525 | [Ahrefs](https://manufact.com/mcp-catalog/ahrefs) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 526 | [AI Dispatcher by FieldCamp](https://manufact.com/mcp-catalog/ai-dispatcher-by-fieldcamp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 527 | [Ai for Work](https://manufact.com/mcp-catalog/ai-for-work) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 528 | [AI Passport](https://manufact.com/mcp-catalog/ai-passport) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 529 | [AI TeamsMaestro](https://manufact.com/mcp-catalog/ai-teamsmaestro) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 530 | [AIclicks](https://manufact.com/mcp-catalog/aiclicks) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 227 / 531 | [Aiera](https://manufact.com/mcp-catalog/aiera) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 532 | [AIlon](https://manufact.com/mcp-catalog/ailon) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 533 | [AIOD Discounts & Free Gift](https://manufact.com/mcp-catalog/aiod-discounts-free-gift) | — / — | sales-and-marketing | — | — | — | free | credentials_required |
| — / 534 | [AIOProductOS](https://manufact.com/mcp-catalog/aioproductos) | — / — | data-analytics | 0/97/0 | 21940 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear (12) | required; free/paid unknown | complete |
| 228 / 535 | [Air](https://manufact.com/mcp-catalog/air) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 536 | [Airepoto](https://manufact.com/mcp-catalog/airepoto) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 537 | [AirHelp flight compensation checker](https://manufact.com/mcp-catalog/airhelp-flight-compensation-checker) | — / — | travel | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 229 / 538 | [AirOps](https://manufact.com/mcp-catalog/airops) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 230 / 539 | [Airtable](https://manufact.com/mcp-catalog/airtable) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 231 / 540 | [Airwallex Developer](https://manufact.com/mcp-catalog/airwallex-developer) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 541 | [Aisle Wedding](https://manufact.com/mcp-catalog/aisle-wedding) | — / — | business-productivity | 5/146/6 | 85449 | potentially_expensive_default, broad_response_candidate, response_control_size_unclear, overlapping_read_tools (36) | required; free/paid unknown | complete |
| — / 542 | [Aiso](https://manufact.com/mcp-catalog/aiso) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 543 | [AiTrillion](https://manufact.com/mcp-catalog/aitrillion) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 544 | [Aiva](https://manufact.com/mcp-catalog/aiva) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 232 / 545 | [Aiven MCP](https://manufact.com/mcp-catalog/aiven-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 546 | [AI事業変革シミュレーター](https://manufact.com/mcp-catalog/ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 233 / 547 | [Alai](https://manufact.com/mcp-catalog/alai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 234 / 548 | [Aleph](https://manufact.com/mcp-catalog/aleph) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 235 / 549 | [AlertKick](https://manufact.com/mcp-catalog/alertkick) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 550 | [alfred_](https://manufact.com/mcp-catalog/alfred) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 551 | [AlgoDriven](https://manufact.com/mcp-catalog/algodriven) | — / — | productivity | 0/0/4 | 11721 | potentially_expensive_default, response_control_size_unclear, broad_response_candidate (7) | required; free/paid unknown | complete |
| 236 / 552 | [Algolia Productivity](https://manufact.com/mcp-catalog/algolia-productivity) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 553 | [Alia](https://manufact.com/mcp-catalog/alia) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 554 | [Alice Flights](https://manufact.com/mcp-catalog/alice-flights) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 237 / 555 | [Aligned](https://manufact.com/mcp-catalog/aligned) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 556 | [Alison.AI](https://manufact.com/mcp-catalog/alison-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 557 | [Alizé](https://manufact.com/mcp-catalog/aliz) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 558 | [Allegrow](https://manufact.com/mcp-catalog/allegrow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 238 / 559 | [Allowance](https://manufact.com/mcp-catalog/allowance) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 239 / 560 | [Alloy](https://manufact.com/mcp-catalog/alloy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 561 | [Alloy Robotics](https://manufact.com/mcp-catalog/alloy-robotics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 562 | [Alma](https://manufact.com/mcp-catalog/alma) | — / — | health | — | — | — | required; free/paid unknown | credentials_required |
| 240 / 563 | [AlphaSights](https://manufact.com/mcp-catalog/alphasights) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 241 / 564 | [alphaXiv](https://manufact.com/mcp-catalog/alphaxiv) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 565 | [Alpic](https://manufact.com/mcp-catalog/alpic) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 566 | [Alt](https://manufact.com/mcp-catalog/alt) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 567 | [AlterVision](https://manufact.com/mcp-catalog/altervision) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 568 | [AMARI](https://manufact.com/mcp-catalog/amari) | — / — | business-productivity | 1/7/0 | 1359 | broad_response_candidate (2) | required; free/paid unknown | complete |
| — / 569 | [Amass Connector](https://manufact.com/mcp-catalog/amass-connector) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 242 / 570 | [ambiguous-workspace](https://manufact.com/mcp-catalog/ambiguous-workspace) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| 243 / 571 | [Amperity MCP](https://manufact.com/mcp-catalog/amperity-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 572 | [AMZ Vault](https://manufact.com/mcp-catalog/amz-vault) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 244 / 573 | [AMZScout Skill + MCP](https://manufact.com/mcp-catalog/amzscout-skill-mcp) | — / — | commerce-shopping | 0/14/2 | 9359 | potentially_expensive_default, broad_response_candidate (5) | required; free/paid unknown | complete |
| 245 / 574 | [Anakin](https://manufact.com/mcp-catalog/anakin) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 575 | [Analytics Brain](https://manufact.com/mcp-catalog/analytics-brain) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 576 | [Anarlog](https://manufact.com/mcp-catalog/anarlog) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 577 | [ANAV](https://manufact.com/mcp-catalog/anav) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 578 | [anc.dev](https://manufact.com/mcp-catalog/anc-dev) | — / — |  | 0/18/1 | 5365 | broad_response_candidate, overlapping_read_tools (6) | none for metadata | complete |
| — / 579 | [Anchor](https://manufact.com/mcp-catalog/anchor) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 246 / 580 | [AngelList](https://manufact.com/mcp-catalog/angellist) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 581 | [Aniva](https://manufact.com/mcp-catalog/aniva) | — / — | healthcare | 0/2/0 | 6611 | response_control_size_unclear (1) | required; free/paid unknown | complete |
| — / 582 | [Anny AI](https://manufact.com/mcp-catalog/anny-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 247 / 583 | [Anomity](https://manufact.com/mcp-catalog/anomity) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 584 | [Ansvar AI](https://manufact.com/mcp-catalog/ansvar-ai) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 248 / 585 | [Anvilogic](https://manufact.com/mcp-catalog/anvilogic) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 586 | [AnyDB](https://manufact.com/mcp-catalog/anydb) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 249 / 587 | [ANYMARKET-MCP](https://manufact.com/mcp-catalog/anymarket-mcp) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 588 | [Apaleo](https://manufact.com/mcp-catalog/apaleo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 589 | [Apartmentiq](https://manufact.com/mcp-catalog/apartmentiq) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 590 | [Aphex](https://manufact.com/mcp-catalog/aphex) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 591 | [api.agentarea.ai](https://manufact.com/mcp-catalog/api-agentarea-ai) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 592 | [api.agi.tech](https://manufact.com/mcp-catalog/api-agi-tech) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 250 / 593 | [api.app.stackguardian.io](https://manufact.com/mcp-catalog/api-app-stackguardian-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 251 / 594 | [api.aspnix.com](https://manufact.com/mcp-catalog/api-aspnix-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 595 | [api.autumn.ai](https://manufact.com/mcp-catalog/api-autumn-ai) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 596 | [api.breakreach.com](https://manufact.com/mcp-catalog/api-breakreach-com) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 252 / 597 | [api.githubcopilot.com](https://manufact.com/mcp-catalog/api-githubcopilot-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 598 | [api.hindsight.vectorize.io](https://manufact.com/mcp-catalog/api-hindsight-vectorize-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 253 / 599 | [api.island.io](https://manufact.com/mcp-catalog/api-island-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 600 | [api.last.app](https://manufact.com/mcp-catalog/api-last-app) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 601 | [api.llmgateway.io](https://manufact.com/mcp-catalog/api-llmgateway-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 254 / 602 | [api.withruntime.com](https://manufact.com/mcp-catalog/api-withruntime-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 255 / 603 | [Apiiro Guardian](https://manufact.com/mcp-catalog/apiiro-guardian) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 604 | [app.cotera.co](https://manufact.com/mcp-catalog/app-cotera-co) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 256 / 605 | [app.getoutline.com](https://manufact.com/mcp-catalog/app-getoutline-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 257 / 606 | [app.hookie.ai](https://manufact.com/mcp-catalog/app-hookie-ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 607 | [app.ownkube.io](https://manufact.com/mcp-catalog/app-ownkube-io-2) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 258 / 608 | [Appbot App Reviews](https://manufact.com/mcp-catalog/appbot-app-reviews) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 609 | [AppDeploy](https://manufact.com/mcp-catalog/appdeploy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 259 / 610 | [AppFolio Realm-X](https://manufact.com/mcp-catalog/appfolio-realm-x) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 260 / 611 | [AppFollow](https://manufact.com/mcp-catalog/appfollow) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 612 | [Appier Enterprise MCP Server](https://manufact.com/mcp-catalog/appier-enterprise-mcp-server) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 261 / 613 | [Appllama](https://manufact.com/mcp-catalog/appllama) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 614 | [AppSkyline](https://manufact.com/mcp-catalog/appskyline) | — / — | data-analytics | 0/0/0 | 5682 | response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (14) | required; free/paid unknown | complete |
| — / 615 | [Appstack](https://manufact.com/mcp-catalog/appstack) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 616 | [AppTrove](https://manufact.com/mcp-catalog/apptrove) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 617 | [Arbium](https://manufact.com/mcp-catalog/arbium) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 618 | [Arcana](https://manufact.com/mcp-catalog/arcana) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 262 / 619 | [Archisketch](https://manufact.com/mcp-catalog/archisketch) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 620 | [Archiveye](https://manufact.com/mcp-catalog/archiveye) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 621 | [Archivist AI MCP](https://manufact.com/mcp-catalog/archivist-ai-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 263 / 622 | [Arcjet](https://manufact.com/mcp-catalog/arcjet) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 623 | [Arkar](https://manufact.com/mcp-catalog/arkar) | — / — | data-analytics | — | — | — | required; free/paid unknown | nonpublic_or_unreachable_url |
| — / 624 | [Arroway](https://manufact.com/mcp-catalog/arroway) | — / — | productivity | 0/30/0 | — | broad_response_candidate (5) | required; free/paid unknown | complete |
| — / 625 | [Articulate EU](https://manufact.com/mcp-catalog/articulate-eu) | — / — | education | 0/0/2 | 2380 | broad_response_candidate, potentially_expensive_default (3) | required; free/paid unknown | complete |
| 264 / 626 | [Artie](https://manufact.com/mcp-catalog/artie) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 627 | [Artist Growth](https://manufact.com/mcp-catalog/artist-growth) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 265 / 628 | [Asana](https://manufact.com/mcp-catalog/asana) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 266 / 629 | [Ashby](https://manufact.com/mcp-catalog/ashby) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 630 | [Ask Soma - Astrology](https://manufact.com/mcp-catalog/ask-soma-astrology) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 631 | [AskNeedl](https://manufact.com/mcp-catalog/askneedl) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 632 | [ASPR AI](https://manufact.com/mcp-catalog/aspr-ai) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 267 / 633 | [Assembled](https://manufact.com/mcp-catalog/assembled) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 634 | [Asset Vision](https://manufact.com/mcp-catalog/asset-vision) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 635 | [Assuric](https://manufact.com/mcp-catalog/assuric) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 636 | [Astravue App](https://manufact.com/mcp-catalog/astravue-app) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 637 | [Astrotheoros](https://manufact.com/mcp-catalog/astrotheoros) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 638 | [Atelier](https://manufact.com/mcp-catalog/atelier) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 639 | [Athena Information](https://manufact.com/mcp-catalog/athena-information) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 268 / 640 | [atlan](https://manufact.com/mcp-catalog/atlan) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 269 / 641 | [Atlar](https://manufact.com/mcp-catalog/atlar) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 270 / 642 | [Atlas](https://manufact.com/mcp-catalog/atlas) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 271 / 643 | [Atlassian Rovo](https://manufact.com/mcp-catalog/atlassian-rovo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 644 | [Atominvest MCP](https://manufact.com/mcp-catalog/atominvest-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 645 | [Atomscale](https://manufact.com/mcp-catalog/atomscale) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 646 | [Attache](https://manufact.com/mcp-catalog/attache) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 272 / 647 | [Attention](https://manufact.com/mcp-catalog/attention) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 273 / 648 | [Attio](https://manufact.com/mcp-catalog/attio) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 274 / 649 | [Attribution MCP](https://manufact.com/mcp-catalog/attribution-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 650 | [Audible](https://manufact.com/mcp-catalog/audible) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 651 | [Audioscrape](https://manufact.com/mcp-catalog/audioscrape) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 652 | [august](https://manufact.com/mcp-catalog/august) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 653 | [Aura](https://manufact.com/mcp-catalog/aura) | — / — | data | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 654 | [Aurora](https://manufact.com/mcp-catalog/aurora) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 655 | [AutoDS — Dropshipping Product Research & Store Automation](https://manufact.com/mcp-catalog/autods-dropshipping-product-research-store-automat) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 656 | [Automo](https://manufact.com/mcp-catalog/automo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 657 | [Autonoma](https://manufact.com/mcp-catalog/autonoma) | — / — | productivity | — | — | — | required; free/paid unknown | nonpublic_or_unreachable_url |
| — / 658 | [AUTONOMAD](https://manufact.com/mcp-catalog/autonomad) | — / — | travel | 12/34/3 | 7277 |  (0) | none for metadata | complete |
| — / 659 | [Autoquote3D](https://manufact.com/mcp-catalog/autoquote3d) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 660 | [Autorender](https://manufact.com/mcp-catalog/autorender) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 661 | [Autosheet](https://manufact.com/mcp-catalog/autosheet) | — / — | productivity | 0/1/3 | 3624 | broad_response_candidate (2) | required; free/paid unknown | complete |
| — / 662 | [Autron](https://manufact.com/mcp-catalog/autron) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 663 | [AveryGPT](https://manufact.com/mcp-catalog/averygpt) | — / — | productivity | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 275 / 664 | [Avoma](https://manufact.com/mcp-catalog/avoma) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 276 / 665 | [Avvoka](https://manufact.com/mcp-catalog/avvoka) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 666 | [AwardWings](https://manufact.com/mcp-catalog/awardwings) | — / — | travel | — | — | — | required; free/paid unknown | credentials_required |
| 277 / 667 | [AWeber](https://manufact.com/mcp-catalog/aweber) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 668 | [AWS Marketplace](https://manufact.com/mcp-catalog/aws-marketplace) | — / — | productivity | 0/8/6 | 6912 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (11) | required; free/paid unknown | complete |
| — / 669 | [Axle Connect](https://manufact.com/mcp-catalog/axle-connect) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 670 | [Azava](https://manufact.com/mcp-catalog/azava) | — / — | productivity | — | — | — | required; free/paid unknown | server_error |
| — / 671 | [B2 Portal](https://manufact.com/mcp-catalog/b2-portal) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 278 / 672 | [B2B Wave](https://manufact.com/mcp-catalog/b2b-wave) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 673 | [Badger Maps (Advanced)](https://manufact.com/mcp-catalog/badger-maps-advanced) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 279 / 674 | [Badger Maps (Standard)](https://manufact.com/mcp-catalog/badger-maps-standard) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 675 | [Ballet](https://manufact.com/mcp-catalog/ballet) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 280 / 676 | [Balsamiq](https://manufact.com/mcp-catalog/balsamiq) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 677 | [BankSync](https://manufact.com/mcp-catalog/banksync) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 281 / 678 | [Bannerbear](https://manufact.com/mcp-catalog/bannerbear) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 282 / 679 | [Base.com](https://manufact.com/mcp-catalog/base-com) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 283 / 680 | [Base44](https://manufact.com/mcp-catalog/base44) | — / — | developer-tools | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 284 / 681 | [Basedash](https://manufact.com/mcp-catalog/basedash) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 285 / 682 | [Basic Memory Cloud](https://manufact.com/mcp-catalog/basic-memory-cloud) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 683 | [BasicOps](https://manufact.com/mcp-catalog/basicops) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 684 | [Bassethound](https://manufact.com/mcp-catalog/bassethound) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 685 | [BauLedger](https://manufact.com/mcp-catalog/bauledger) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 686 | [Bauta](https://manufact.com/mcp-catalog/bauta) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 687 | [Baz](https://manufact.com/mcp-catalog/baz) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 688 | [BBQAdvisor](https://manufact.com/mcp-catalog/bbqadvisor) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 286 / 689 | [Beaam](https://manufact.com/mcp-catalog/beaam) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 287 / 690 | [Beacons](https://manufact.com/mcp-catalog/beacons) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 288 / 691 | [Beautiful.ai](https://manufact.com/mcp-catalog/beautiful-ai) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 692 | [Bed-and-Breakfast.it](https://manufact.com/mcp-catalog/bed-and-breakfast-it) | — / — | travel | 0/1/0 | 2263 |  (0) | none for metadata | complete |
| 289 / 693 | [beehiiv](https://manufact.com/mcp-catalog/beehiiv) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 694 | [Beeline](https://manufact.com/mcp-catalog/beeline) | — / — | travel | 41/118/10 | 25508 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (38) | required; free/paid unknown | complete |
| — / 695 | [Beeline Workspace](https://manufact.com/mcp-catalog/beeline-workspace) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 696 | [BEEM](https://manufact.com/mcp-catalog/beem) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 697 | [Benevity](https://manufact.com/mcp-catalog/benevity) | — / — | nonprofit | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 698 | [BETA Climbing](https://manufact.com/mcp-catalog/beta-climbing) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 290 / 699 | [BIA Edge](https://manufact.com/mcp-catalog/bia-edge) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 700 | [BidPrime](https://manufact.com/mcp-catalog/bidprime) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 701 | [BidSkim](https://manufact.com/mcp-catalog/bidskim) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 702 | [BidSonar](https://manufact.com/mcp-catalog/bidsonar) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 703 | [BidX - Scale Marketplace Ads](https://manufact.com/mcp-catalog/bidx-scale-marketplace-ads) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 291 / 704 | [Bigdata.com](https://manufact.com/mcp-catalog/bigdata-com) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 705 | [BigGeo AI](https://manufact.com/mcp-catalog/biggeo-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 292 / 706 | [BigID](https://manufact.com/mcp-catalog/bigid) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 707 | [Bigmind](https://manufact.com/mcp-catalog/bigmind) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 708 | [Bikky](https://manufact.com/mcp-catalog/bikky) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 293 / 709 | [Billit](https://manufact.com/mcp-catalog/billit) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 710 | [BioFlow](https://manufact.com/mcp-catalog/bioflow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 294 / 711 | [BioRender](https://manufact.com/mcp-catalog/biorender) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 712 | [BioSkepsis](https://manufact.com/mcp-catalog/bioskepsis) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 713 | [BirdSift](https://manufact.com/mcp-catalog/birdsift) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 714 | [BirdyChat](https://manufact.com/mcp-catalog/birdychat) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 295 / 715 | [Birta](https://manufact.com/mcp-catalog/birta) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 296 / 716 | [Bitly](https://manufact.com/mcp-catalog/bitly) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 297 / 717 | [Bitrefill](https://manufact.com/mcp-catalog/bitrefill) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 718 | [Bizora Tax Research](https://manufact.com/mcp-catalog/bizora-tax-research) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 298 / 719 | [Black Diamond](https://manufact.com/mcp-catalog/black-diamond) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 720 | [BlackRock Advisor Center](https://manufact.com/mcp-catalog/blackrock-advisor-center) | — / — | productivity | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 721 | [BlackTwist](https://manufact.com/mcp-catalog/blacktwist) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 722 | [Blaze SQL](https://manufact.com/mcp-catalog/blaze-sql) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 299 / 723 | [Blinq](https://manufact.com/mcp-catalog/blinq) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 724 | [Bloom Profit Analytics](https://manufact.com/mcp-catalog/bloom-profit-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 300 / 725 | [Bloomberg Law](https://manufact.com/mcp-catalog/bloomberg-law) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 301 / 726 | [Blynk](https://manufact.com/mcp-catalog/blynk) | — / — | developer-tools | 1/25/1 | 78016 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (40) | required; free/paid unknown | complete |
| 302 / 727 | [BoardRepo](https://manufact.com/mcp-catalog/boardrepo) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 728 | [BOB Tools](https://manufact.com/mcp-catalog/bob-tools) | — / — | productivity | 0/17/5 | 23418 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (11) | required; free/paid unknown | complete |
| — / 729 | [BOCP - Business Online Control Panel](https://manufact.com/mcp-catalog/bocp-business-online-control-panel) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 730 | [Boltz API](https://manufact.com/mcp-catalog/boltz-api) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 303 / 731 | [Bonsai](https://manufact.com/mcp-catalog/bonsai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 732 | [Bonsai Solutions](https://manufact.com/mcp-catalog/bonsai-solutions) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 733 | [Booking.com](https://manufact.com/mcp-catalog/booking-com) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 734 | [BookYolo](https://manufact.com/mcp-catalog/bookyolo) | — / — | travel | — | — | — | required; free/paid unknown | credentials_required |
| — / 735 | [Boomerang](https://manufact.com/mcp-catalog/boomerang) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 736 | [Bouncie](https://manufact.com/mcp-catalog/bouncie) | — / — | data-analytics | 1/13/0 | 3077 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (6) | required; free/paid unknown | complete |
| — / 737 | [Bound](https://manufact.com/mcp-catalog/bound) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 304 / 738 | [Box](https://manufact.com/mcp-catalog/box) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 305 / 739 | [Brainfish](https://manufact.com/mcp-catalog/brainfish) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 306 / 740 | [Brand24](https://manufact.com/mcp-catalog/brand24) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 307 / 741 | [Brandfetch](https://manufact.com/mcp-catalog/brandfetch) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 742 | [Brandi AI](https://manufact.com/mcp-catalog/brandi-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 743 | [BreadAdvisor](https://manufact.com/mcp-catalog/breadadvisor) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 744 | [Breakcold](https://manufact.com/mcp-catalog/breakcold) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 308 / 745 | [Brevo](https://manufact.com/mcp-catalog/brevo) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 309 / 746 | [Brex](https://manufact.com/mcp-catalog/brex) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 747 | [Brightdeck](https://manufact.com/mcp-catalog/brightdeck) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 748 | [BrightHire](https://manufact.com/mcp-catalog/brighthire) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 310 / 749 | [BrightLocal](https://manufact.com/mcp-catalog/brightlocal) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 750 | [Brisk Teaching](https://manufact.com/mcp-catalog/brisk-teaching) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 751 | [Brixa Studio](https://manufact.com/mcp-catalog/brixa-studio) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 752 | [Brizz](https://manufact.com/mcp-catalog/brizz) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 753 | [BrokerIA Imoveis](https://manufact.com/mcp-catalog/brokeria-imoveis) | — / — |  | 2/36/0 | 4197 | response_control_size_unclear (3) | none for metadata | complete |
| 311 / 754 | [Bruin](https://manufact.com/mcp-catalog/bruin) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 755 | [Buddy Punch](https://manufact.com/mcp-catalog/buddy-punch) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 312 / 756 | [Buffer](https://manufact.com/mcp-catalog/buffer) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 313 / 757 | [Builder.io CMS](https://manufact.com/mcp-catalog/builder-io-cms) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 758 | [Buildfire](https://manufact.com/mcp-catalog/buildfire) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 759 | [Buildr](https://manufact.com/mcp-catalog/buildr) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 760 | [Bull AI](https://manufact.com/mcp-catalog/bull-ai) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 761 | [BullrunData Market Intelligence](https://manufact.com/mcp-catalog/bullrundata-market-intelligence) | — / — | financial-services | 0/59/5 | 10625 | broad_response_candidate, potentially_expensive_default (7) | required; free/paid unknown | complete |
| — / 762 | [BuyLater](https://manufact.com/mcp-catalog/buylater) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 763 | [byrdAI](https://manufact.com/mcp-catalog/byrdai) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 764 | [CaDoMi.ai](https://manufact.com/mcp-catalog/cadomi-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 314 / 765 | [Caffeine](https://manufact.com/mcp-catalog/caffeine) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 315 / 766 | [Cala](https://manufact.com/mcp-catalog/cala) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 767 | [Calendesk - Appointment scheduling software](https://manufact.com/mcp-catalog/calendesk-appointment-scheduling-software) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 768 | [Call Me](https://manufact.com/mcp-catalog/call-me) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 316 / 769 | [CallRail](https://manufact.com/mcp-catalog/callrail) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 770 | [calm-forge-78r58.run.mcp-use.com](https://manufact.com/mcp-catalog/calm-forge-78r58-run-mcp-use-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 317 / 771 | [Campfire](https://manufact.com/mcp-catalog/campfire) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 772 | [Canary Data](https://manufact.com/mcp-catalog/canary-data) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 773 | [Candid](https://manufact.com/mcp-catalog/candid) | — / — | nonprofit | — | — | — | required; free/paid unknown | credentials_required |
| 318 / 774 | [Canny](https://manufact.com/mcp-catalog/canny) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 775 | [Canonical Company Search](https://manufact.com/mcp-catalog/canonical-company-search) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 319 / 776 | [Canopy](https://manufact.com/mcp-catalog/canopy) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 320 / 777 | [Canva](https://manufact.com/mcp-catalog/canva) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 778 | [Canvs.io](https://manufact.com/mcp-catalog/canvs-io) | — / — | business-productivity | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| 321 / 779 | [Capacities](https://manufact.com/mcp-catalog/capacities) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 322 / 780 | [Capsule CRM](https://manufact.com/mcp-catalog/capsule-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 781 | [Carbon Arc](https://manufact.com/mcp-catalog/carbon-arc) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 782 | [CardChain AI](https://manufact.com/mcp-catalog/cardchain-ai) | — / — | media | 0/22/0 | 3342 | broad_response_candidate, overlapping_read_tools (7) | required; free/paid unknown | complete |
| — / 783 | [CardoAI ABF MCP](https://manufact.com/mcp-catalog/cardoai-abf-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 784 | [Cards Microlearning](https://manufact.com/mcp-catalog/cards-microlearning) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 785 | [Caretta](https://manufact.com/mcp-catalog/caretta) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 323 / 786 | [Cargo](https://manufact.com/mcp-catalog/cargo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 787 | [CargoAi](https://manufact.com/mcp-catalog/cargoai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 324 / 788 | [CarGurus](https://manufact.com/mcp-catalog/cargurus) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 789 | [Carly](https://manufact.com/mcp-catalog/carly) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 790 | [CarlyEmail](https://manufact.com/mcp-catalog/carlyemail) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 791 | [Carpedia](https://manufact.com/mcp-catalog/carpedia) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 792 | [CarsXE](https://manufact.com/mcp-catalog/carsxe) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 325 / 793 | [Carta](https://manufact.com/mcp-catalog/carta) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 794 | [Casepoint](https://manufact.com/mcp-catalog/casepoint) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 795 | [Cashfeed](https://manufact.com/mcp-catalog/cashfeed) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 326 / 796 | [Catchr MCP](https://manufact.com/mcp-catalog/catchr-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 797 | [Cayra MCP](https://manufact.com/mcp-catalog/cayra-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 327 / 798 | [CB Insights](https://manufact.com/mcp-catalog/cb-insights) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 328 / 799 | [CData Connect AI](https://manufact.com/mcp-catalog/cdata-connect-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 800 | [CE Cosmos Deep Dive](https://manufact.com/mcp-catalog/ce-cosmos-deep-dive) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 801 | [CE Cosmos Signal](https://manufact.com/mcp-catalog/ce-cosmos-signal) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 802 | [Celero.io](https://manufact.com/mcp-catalog/celero-io) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 803 | [Cello](https://manufact.com/mcp-catalog/cello) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 804 | [Certifier](https://manufact.com/mcp-catalog/certifier) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 329 / 805 | [CertScore.ai](https://manufact.com/mcp-catalog/certscore-ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 806 | [Cezanne HR Learning](https://manufact.com/mcp-catalog/cezanne-hr-learning) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 807 | [ChangeThisFile](https://manufact.com/mcp-catalog/changethisfile) | — / — | business-productivity | 0/14/0 | 2479 | response_control_size_unclear, broad_response_candidate (2) | none for metadata | complete |
| — / 808 | [Chariot](https://manufact.com/mcp-catalog/chariot) | — / — | nonprofit | — | — | — | required; free/paid unknown | credentials_required |
| 330 / 809 | [ChartMogul](https://manufact.com/mcp-catalog/chartmogul) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 810 | [Chatmu](https://manufact.com/mcp-catalog/chatmu) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 811 | [CheckCells](https://manufact.com/mcp-catalog/checkcells) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| — / 812 | [Checkin](https://manufact.com/mcp-catalog/checkin) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 331 / 813 | [Chronograph](https://manufact.com/mcp-catalog/chronograph) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 814 | [Chui](https://manufact.com/mcp-catalog/chui) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 815 | [Churn Solution](https://manufact.com/mcp-catalog/churn-solution) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 816 | [CI HUB](https://manufact.com/mcp-catalog/ci-hub) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| 332 / 817 | [Circleback](https://manufact.com/mcp-catalog/circleback) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 333 / 818 | [CircleCI](https://manufact.com/mcp-catalog/circleci) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 819 | [Circuitry.ai](https://manufact.com/mcp-catalog/circuitry-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 334 / 820 | [CISO360AI](https://manufact.com/mcp-catalog/ciso360ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 821 | [CISOGenie](https://manufact.com/mcp-catalog/cisogenie) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 822 | [Citare IA](https://manufact.com/mcp-catalog/citare-ia) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 823 | [CiteLaw](https://manufact.com/mcp-catalog/citelaw) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 824 | [Civic Marketplace](https://manufact.com/mcp-catalog/civic-marketplace) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 825 | [CivilQuants](https://manufact.com/mcp-catalog/civilquants) | — / — | business-productivity | 4/172/39 | 121245 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default (86) | required; free/paid unknown | complete |
| 335 / 826 | [Claap](https://manufact.com/mcp-catalog/claap) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 827 | [Clarifo](https://manufact.com/mcp-catalog/clarifo) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 828 | [Clarify](https://manufact.com/mcp-catalog/clarify) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 829 | [Clarity AI](https://manufact.com/mcp-catalog/clarity-ai-2) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 830 | [Clarivate IPOne CompuMark Trademarks](https://manufact.com/mcp-catalog/clarivate-ipone-compumark-trademarks) | — / — | data | — | — | — | required; free/paid unknown | credentials_required |
| 336 / 831 | [Clear Street](https://manufact.com/mcp-catalog/clear-street) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 337 / 832 | [ClearFeed](https://manufact.com/mcp-catalog/clearfeed) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 833 | [CLEATUS](https://manufact.com/mcp-catalog/cleatus) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 338 / 834 | [Clerky](https://manufact.com/mcp-catalog/clerky) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 339 / 835 | [ClickFunnels](https://manufact.com/mcp-catalog/clickfunnels) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 836 | [Clientify](https://manufact.com/mcp-catalog/clientify) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 837 | [ClinicalTrials.gov Explorer (by BLEN)](https://manufact.com/mcp-catalog/clinicaltrials-gov-explorer-by-blen) | — / — | healthcare | 4/12/0 | 932 |  (0) | none for metadata | complete |
| — / 838 | [Clipform](https://manufact.com/mcp-catalog/clipform) | — / — | productivity | 0/12/3 | 13911 | broad_response_candidate, response_control_size_unclear (7) | required; free/paid unknown | complete |
| — / 839 | [Clockwork](https://manufact.com/mcp-catalog/clockwork) | — / — | financial-services | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 840 | [Closai](https://manufact.com/mcp-catalog/closai) | — / — | data-analytics | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 841 | [Cloud Cost Coach](https://manufact.com/mcp-catalog/cloud-cost-coach) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 340 / 842 | [cloud.activepieces.com](https://manufact.com/mcp-catalog/cloud-activepieces-com) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| 341 / 843 | [CloudBees Unify MCP Server](https://manufact.com/mcp-catalog/cloudbees-unify-mcp-server) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 844 | [CloudEagle MCP](https://manufact.com/mcp-catalog/cloudeagle-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 845 | [CloudEagle.ai](https://manufact.com/mcp-catalog/cloudeagle-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 342 / 846 | [Cloudinary](https://manufact.com/mcp-catalog/cloudinary) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 847 | [CloudMindMaps](https://manufact.com/mcp-catalog/cloudmindmaps) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 848 | [Cloverleaf](https://manufact.com/mcp-catalog/cloverleaf) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 343 / 849 | [Cloze MCP](https://manufact.com/mcp-catalog/cloze-mcp) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 850 | [coadmap](https://manufact.com/mcp-catalog/coadmap) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 851 | [Cobot Coworking Software](https://manufact.com/mcp-catalog/cobot-coworking-software) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 852 | [CoCanvas](https://manufact.com/mcp-catalog/cocanvas) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 853 | [Coconut Context](https://manufact.com/mcp-catalog/coconut-context) | — / — | productivity | 7/79/0 | 10997 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (8) | required; free/paid unknown | complete |
| 344 / 854 | [CoCounsel Legal](https://manufact.com/mcp-catalog/cocounsel-legal) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 345 / 855 | [CodeWords](https://manufact.com/mcp-catalog/codewords) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 856 | [Coevera](https://manufact.com/mcp-catalog/coevera) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 857 | [Coffee & Contracts](https://manufact.com/mcp-catalog/coffee-contracts) | — / — | creative | 0/33/0 | 3349 | broad_response_candidate, overlapping_read_tools (18) | required; free/paid unknown | complete |
| — / 858 | [Coffeetable](https://manufact.com/mcp-catalog/coffeetable) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| 346 / 859 | [Cognitive Credit](https://manufact.com/mcp-catalog/cognitive-credit) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 347 / 860 | [Cognito Forms](https://manufact.com/mcp-catalog/cognito-forms) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 861 | [Cognizo](https://manufact.com/mcp-catalog/cognizo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 348 / 862 | [CoinDesk](https://manufact.com/mcp-catalog/coindesk) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 863 | [coinvest.liquid.trade](https://manufact.com/mcp-catalog/coinvest-liquid-trade) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 864 | [Collation MCP Server](https://manufact.com/mcp-catalog/collation-mcp-server) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 865 | [Commercient Data Lake \ Data Hub](https://manufact.com/mcp-catalog/commercient-data-lake-data-hub) | — / — | data-analytics | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 349 / 866 | [Common Paper](https://manufact.com/mcp-catalog/common-paper) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 350 / 867 | [Common Room](https://manufact.com/mcp-catalog/common-room) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 868 | [CommuteHub](https://manufact.com/mcp-catalog/commutehub) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 869 | [Companion.energy](https://manufact.com/mcp-catalog/companion-energy) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 870 | [Company Registry Lookup](https://manufact.com/mcp-catalog/company-registry-lookup) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 351 / 871 | [CompanyCam](https://manufact.com/mcp-catalog/companycam) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 872 | [Competiscan](https://manufact.com/mcp-catalog/competiscan) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 873 | [Componecat](https://manufact.com/mcp-catalog/componecat) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 874 | [CompSniper](https://manufact.com/mcp-catalog/compsniper) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 352 / 875 | [Comscore](https://manufact.com/mcp-catalog/comscore) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 876 | [Conductor MCP](https://manufact.com/mcp-catalog/conductor-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 353 / 877 | [Conduit](https://manufact.com/mcp-catalog/conduit) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 354 / 878 | [Connect The Dots](https://manufact.com/mcp-catalog/connect-the-dots) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 355 / 879 | [connect-ai.world](https://manufact.com/mcp-catalog/connect-ai-world) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 880 | [ConnectMachine](https://manufact.com/mcp-catalog/connectmachine) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 356 / 881 | [ConoHa VPS](https://manufact.com/mcp-catalog/conoha-vps) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 357 / 882 | [Consensus](https://manufact.com/mcp-catalog/consensus) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 883 | [Consensus](https://manufact.com/mcp-catalog/consensus-2) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 358 / 884 | [ConsentLayer](https://manufact.com/mcp-catalog/consentlayer) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 359 / 885 | [Constant Contact](https://manufact.com/mcp-catalog/constant-contact) | — / — | marketing-seo | 0/6/2 | 14275 | response_control_size_unclear, broad_response_candidate (5) | required; free/paid unknown | complete |
| 360 / 886 | [Constructable](https://manufact.com/mcp-catalog/constructable) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 361 / 887 | [Contentful MCP](https://manufact.com/mcp-catalog/contentful-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 888 | [ContentMonk](https://manufact.com/mcp-catalog/contentmonk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 362 / 889 | [Contentsquare](https://manufact.com/mcp-catalog/contentsquare) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 890 | [Context Switcher](https://manufact.com/mcp-catalog/context-switcher) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 891 | [Contextaco](https://manufact.com/mcp-catalog/contextaco) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 892 | [contextflo](https://manufact.com/mcp-catalog/contextflo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 893 | [Contextick](https://manufact.com/mcp-catalog/contextick) | — / — | productivity | — | — | — | required; free/paid unknown | server_error |
| — / 894 | [ContextSMS MCP](https://manufact.com/mcp-catalog/contextsms-mcp) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 895 | [Contour](https://manufact.com/mcp-catalog/contour) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 363 / 896 | [ContractHero](https://manufact.com/mcp-catalog/contracthero) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 897 | [Contractors Cloud](https://manufact.com/mcp-catalog/contractors-cloud) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 364 / 898 | [Control Plane](https://manufact.com/mcp-catalog/control-plane) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 899 | [Controlle](https://manufact.com/mcp-catalog/controlle) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 900 | [Converly](https://manufact.com/mcp-catalog/converly) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 901 | [Conversion](https://manufact.com/mcp-catalog/conversion) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 902 | [Convoke](https://manufact.com/mcp-catalog/convoke) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 903 | [Cookiedeal MCP](https://manufact.com/mcp-catalog/cookiedeal-mcp) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 904 | [CookieYes](https://manufact.com/mcp-catalog/cookieyes) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 905 | [Cor](https://manufact.com/mcp-catalog/cor) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 906 | [Cora](https://manufact.com/mcp-catalog/cora) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 907 | [Coret](https://manufact.com/mcp-catalog/coret) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 908 | [COROS](https://manufact.com/mcp-catalog/coros) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| — / 909 | [Cortellis CMC Intelligence](https://manufact.com/mcp-catalog/cortellis-cmc-intelligence) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 910 | [Cortena FinOps](https://manufact.com/mcp-catalog/cortena-finops) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 911 | [Costory](https://manufact.com/mcp-catalog/costory) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 912 | [Cotality](https://manufact.com/mcp-catalog/cotality) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 913 | [Coteach](https://manufact.com/mcp-catalog/coteach) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 914 | [Cottages](https://manufact.com/mcp-catalog/cottages) | — / — | travel | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 915 | [Country Club for Business](https://manufact.com/mcp-catalog/country-club-for-business) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 365 / 916 | [Coupler.io](https://manufact.com/mcp-catalog/coupler-io) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 917 | [Courrt](https://manufact.com/mcp-catalog/courrt) | — / — | data-analytics | 10/45/1 | 4306 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (11) | none for metadata | complete |
| — / 918 | [Coursera](https://manufact.com/mcp-catalog/coursera) | — / — | productivity | 1/7/0 | 4234 |  (0) | required; free/paid unknown | complete |
| 366 / 919 | [CourtListener](https://manufact.com/mcp-catalog/courtlistener) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 367 / 920 | [Coval](https://manufact.com/mcp-catalog/coval) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 921 | [Coverbase](https://manufact.com/mcp-catalog/coverbase) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 368 / 922 | [Craft](https://manufact.com/mcp-catalog/craft) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 923 | [CrawlRaven SEO](https://manufact.com/mcp-catalog/crawlraven-seo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 924 | [CRE Agents (Vic)](https://manufact.com/mcp-catalog/cre-agents-vic) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 925 | [CreateBases](https://manufact.com/mcp-catalog/createbases) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 926 | [CreatorDB MCP](https://manufact.com/mcp-catalog/creatordb-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 927 | [CredCore - Tusk Liquid](https://manufact.com/mcp-catalog/credcore-tusk-liquid) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 928 | [Credible](https://manufact.com/mcp-catalog/credible) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 929 | [Crisphive](https://manufact.com/mcp-catalog/crisphive) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 930 | [crm.care](https://manufact.com/mcp-catalog/crm-care) | — / — | productivity | 2/27/0 | 4029 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 369 / 931 | [Croft](https://manufact.com/mcp-catalog/croft) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 370 / 932 | [Crossbeam](https://manufact.com/mcp-catalog/crossbeam) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 933 | [Cryotos](https://manufact.com/mcp-catalog/cryotos) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 371 / 934 | [Cube](https://manufact.com/mcp-catalog/cube) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 935 | [CurrencyGuard](https://manufact.com/mcp-catalog/currencyguard) | — / — | financial-services | 0/17/2 | 7081 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (5) | none for metadata | complete |
| — / 936 | [Customer Luv Surveys](https://manufact.com/mcp-catalog/customer-luv-surveys) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 937 | [Customerscore](https://manufact.com/mcp-catalog/customerscore) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 372 / 938 | [Cypress Cloud](https://manufact.com/mcp-catalog/cypress-cloud) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 939 | [D-Tools Cloud](https://manufact.com/mcp-catalog/d-tools-cloud) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 373 / 940 | [D&B Finance Analytics](https://manufact.com/mcp-catalog/d-b-finance-analytics) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 374 / 941 | [D&B Risk Analytics](https://manufact.com/mcp-catalog/d-b-risk-analytics) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 942 | [Daily Command](https://manufact.com/mcp-catalog/daily-command) | — / — | data-analytics | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 943 | [Dalea - Research Orchestration Platform](https://manufact.com/mcp-catalog/dalea-research-orchestration-platform) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 375 / 944 | [Daloopa](https://manufact.com/mcp-catalog/daloopa) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 945 | [Dango](https://manufact.com/mcp-catalog/dango) | — / — | productivity | — | — | — | required; free/paid unknown | server_error |
| — / 946 | [DappleOS](https://manufact.com/mcp-catalog/dappleos) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 947 | [das Programm](https://manufact.com/mcp-catalog/das-programm) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 376 / 948 | [DashThis](https://manufact.com/mcp-catalog/dashthis) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 949 | [Data Parrot](https://manufact.com/mcp-catalog/data-parrot) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 377 / 950 | [Databox](https://manufact.com/mcp-catalog/databox) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 951 | [DataCamp](https://manufact.com/mcp-catalog/datacamp) | — / — | education | 0/43/23 | 74043 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (89) | required; free/paid unknown | complete |
| 378 / 952 | [DataHub](https://manufact.com/mcp-catalog/datahub) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 953 | [Datalastic](https://manufact.com/mcp-catalog/datalastic) | — / — | data-analytics | 0/9/3 | 12177 | broad_response_candidate, overlapping_read_tools (18) | required; free/paid unknown | complete |
| 379 / 954 | [Datarails FinanceOS](https://manufact.com/mcp-catalog/datarails-financeos) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 955 | [DataSelf MCP+](https://manufact.com/mcp-catalog/dataself-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 380 / 956 | [Datasite](https://manufact.com/mcp-catalog/datasite) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 381 / 957 | [Dataslayer mcp](https://manufact.com/mcp-catalog/dataslayer-mcp) | — / — | marketing-seo | 0/0/4 | 6695 | broad_response_candidate, overlapping_read_tools (8) | required; free/paid unknown | complete |
| — / 958 | [Davia Creation](https://manufact.com/mcp-catalog/davia-creation) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| 382 / 959 | [Day AI](https://manufact.com/mcp-catalog/day-ai) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 383 / 960 | [Dcipher Analytics](https://manufact.com/mcp-catalog/dcipher-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 961 | [Dealer Insights](https://manufact.com/mcp-catalog/dealer-insights) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 962 | [DealKeep](https://manufact.com/mcp-catalog/dealkeep) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 384 / 963 | [DealRoom](https://manufact.com/mcp-catalog/dealroom) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 964 | [DealTraq](https://manufact.com/mcp-catalog/dealtraq) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 965 | [Decile](https://manufact.com/mcp-catalog/decile) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 385 / 966 | [Decionis Execution Authority](https://manufact.com/mcp-catalog/decionis-execution-authority) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 967 | [Decision Matrix](https://manufact.com/mcp-catalog/decision-matrix) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 968 | [DecisionRules](https://manufact.com/mcp-catalog/decisionrules) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 386 / 969 | [Decisions](https://manufact.com/mcp-catalog/decisions) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 970 | [Decube](https://manufact.com/mcp-catalog/decube) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 387 / 971 | [Deel](https://manufact.com/mcp-catalog/deel) | — / — | financial-services | 0/13/0 | 4110 | response_control_size_unclear, broad_response_candidate (2) | required; free/paid unknown | complete |
| 388 / 972 | [DeepJudge](https://manufact.com/mcp-catalog/deepjudge) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 389 / 973 | [DeepL](https://manufact.com/mcp-catalog/deepl) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 974 | [Definely](https://manufact.com/mcp-catalog/definely) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 975 | [Deley - Investigación legal de Ecuador](https://manufact.com/mcp-catalog/deley-investigaci-n-legal-de-ecuador) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 976 | [Delivra](https://manufact.com/mcp-catalog/delivra) | — / — | data-analytics | 9/24/0 | 5052 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (51) | required; free/paid unknown | complete |
| 390 / 977 | [Demandbase](https://manufact.com/mcp-catalog/demandbase) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 391 / 978 | [demo.vanterics.com](https://manufact.com/mcp-catalog/demo-vanterics-com) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 979 | [Demographic and Health Surveys](https://manufact.com/mcp-catalog/demographic-and-health-surveys) | — / — | health | — | — | — | required; free/paid unknown | credentials_required |
| — / 980 | [demov7.dreamfactory.com](https://manufact.com/mcp-catalog/demov7-dreamfactory-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 392 / 981 | [Deplixo](https://manufact.com/mcp-catalog/deplixo) | — / — | developer-tools | 2/4/0 | 662 |  (0) | none for metadata | complete |
| 393 / 982 | [Descope for Claude](https://manufact.com/mcp-catalog/descope-for-claude) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 394 / 983 | [Descript](https://manufact.com/mcp-catalog/descript) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 395 / 984 | [Descrybe Legal Engine](https://manufact.com/mcp-catalog/descrybe-legal-engine) | — / — | search-research | 0/6/0 | 4820 | potentially_expensive_default, overlapping_read_tools (29) | required; free/paid unknown | complete |
| — / 985 | [Deskfirst](https://manufact.com/mcp-catalog/deskfirst) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 986 | [Detrics](https://manufact.com/mcp-catalog/detrics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 987 | [Develop21](https://manufact.com/mcp-catalog/develop21) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 396 / 988 | [DeviceLink](https://manufact.com/mcp-catalog/devicelink) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 397 / 989 | [Devil's Advocate](https://manufact.com/mcp-catalog/devil-s-advocate) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 398 / 990 | [DevRev](https://manufact.com/mcp-catalog/devrev) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 399 / 991 | [Dewey Data](https://manufact.com/mcp-catalog/dewey-data) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 992 | [Dexi](https://manufact.com/mcp-catalog/dexi) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 993 | [Diffit](https://manufact.com/mcp-catalog/diffit) | — / — | education | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 400 / 994 | [Digits](https://manufact.com/mcp-catalog/digits) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 995 | [Dillr](https://manufact.com/mcp-catalog/dillr) | — / — |  | 5/25/2 | 7965 | broad_response_candidate, overlapping_read_tools (9) | required; free/paid unknown | complete |
| — / 996 | [Dincer Logistics](https://manufact.com/mcp-catalog/dincer-logistics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 997 | [DingDuff](https://manufact.com/mcp-catalog/dingduff) | — / — | legal | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 998 | [DirectBooker](https://manufact.com/mcp-catalog/directbooker) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 999 | [DirectCase Legal Search](https://manufact.com/mcp-catalog/directcase-legal-search) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1000 | [Dispatch Tickets](https://manufact.com/mcp-catalog/dispatch-tickets) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1001 | [Distribb](https://manufact.com/mcp-catalog/distribb) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1002 | [Dixit](https://manufact.com/mcp-catalog/dixit) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1003 | [Docfarm](https://manufact.com/mcp-catalog/docfarm) | — / — | productivity | 2/33/1 | 9568 | broad_response_candidate, potentially_expensive_default, overlapping_read_tools (10) | required; free/paid unknown | complete |
| 401 / 1004 | [DocHub](https://manufact.com/mcp-catalog/dochub) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 402 / 1005 | [Dock](https://manufact.com/mcp-catalog/dock) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1006 | [Dock Optimizer](https://manufact.com/mcp-catalog/dock-optimizer) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 403 / 1007 | [DocketBird](https://manufact.com/mcp-catalog/docketbird) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1008 | [DocNexus Advanced Search MCP](https://manufact.com/mcp-catalog/docnexus-advanced-search-mcp) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 1009 | [DocStash](https://manufact.com/mcp-catalog/docstash) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1010 | [DocStudio MCP](https://manufact.com/mcp-catalog/docstudio-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 404 / 1011 | [Document360](https://manufact.com/mcp-catalog/document360) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 405 / 1012 | [DocuSeal](https://manufact.com/mcp-catalog/docuseal) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 406 / 1013 | [Docusign](https://manufact.com/mcp-catalog/docusign) | — / — | productivity | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 1014 | [DodgePrint](https://manufact.com/mcp-catalog/dodgeprint) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 407 / 1015 | [doDomain](https://manufact.com/mcp-catalog/dodomain) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 408 / 1016 | [Domainee](https://manufact.com/mcp-catalog/domainee) | — / — | developer-tools | 0/17/0 | 3969 | broad_response_candidate (1) | required; free/paid unknown | complete |
| — / 1017 | [Domus](https://manufact.com/mcp-catalog/domus) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1018 | [DOST](https://manufact.com/mcp-catalog/dost) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 409 / 1019 | [dot.](https://manufact.com/mcp-catalog/dot) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 410 / 1020 | [Dover](https://manufact.com/mcp-catalog/dover) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 411 / 1021 | [Dovetail](https://manufact.com/mcp-catalog/dovetail) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1022 | [Dovetail Regulatory](https://manufact.com/mcp-catalog/dovetail-regulatory) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1023 | [Dragonboat](https://manufact.com/mcp-catalog/dragonboat) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 412 / 1024 | [Drata](https://manufact.com/mcp-catalog/drata) | — / — | developer-tools | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 413 / 1025 | [Dreamdata](https://manufact.com/mcp-catalog/dreamdata) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1026 | [Driggsby](https://manufact.com/mcp-catalog/driggsby) | — / — | financial-services | 0/41/16 | 51448 | broad_response_candidate, overlapping_read_tools (17) | required; free/paid unknown | complete |
| — / 1027 | [Driva - Mind](https://manufact.com/mcp-catalog/driva-mind) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1028 | [Drivepoint](https://manufact.com/mcp-catalog/drivepoint) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1029 | [Droppah](https://manufact.com/mcp-catalog/droppah) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1030 | [Drry](https://manufact.com/mcp-catalog/drry) | — / — | productivity | 24/89/24 | 343394 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (97) | required; free/paid unknown | complete |
| 414 / 1031 | [Druva MCP](https://manufact.com/mcp-catalog/druva-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 415 / 1032 | [Dscout Researcher](https://manufact.com/mcp-catalog/dscout-researcher) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1033 | [Dtwo](https://manufact.com/mcp-catalog/dtwo) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 416 / 1034 | [DualEntry](https://manufact.com/mcp-catalog/dualentry) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1035 | [DunSocial](https://manufact.com/mcp-catalog/dunsocial) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1036 | [dVeracity Semantic API](https://manufact.com/mcp-catalog/dveracity-semantic-api) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1037 | [Dynamo](https://manufact.com/mcp-catalog/dynamo) | — / — | financial-services | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 1038 | [e2llm](https://manufact.com/mcp-catalog/e2llm) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1039 | [EasySignage](https://manufact.com/mcp-catalog/easysignage) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 417 / 1040 | [ECDB](https://manufact.com/mcp-catalog/ecdb) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1041 | [Economatica](https://manufact.com/mcp-catalog/economatica) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1042 | [EconomyBookings](https://manufact.com/mcp-catalog/economybookings) | — / — | travel | 0/2/0 | 2899 |  (0) | none for metadata | complete |
| — / 1043 | [EDEN by Basecamp Research](https://manufact.com/mcp-catalog/eden-by-basecamp-research) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 1044 | [edge.ballparkhq.com](https://manufact.com/mcp-catalog/edge-ballparkhq-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 418 / 1045 | [edrone](https://manufact.com/mcp-catalog/edrone) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1046 | [EduInsights](https://manufact.com/mcp-catalog/eduinsights) | — / — | education | 0/6/0 | 3085 |  (0) | required; free/paid unknown | complete |
| — / 1047 | [Eedi](https://manufact.com/mcp-catalog/eedi) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 1048 | [Effy AI](https://manufact.com/mcp-catalog/effy-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 419 / 1049 | [Egnyte](https://manufact.com/mcp-catalog/egnyte) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1050 | [eino](https://manufact.com/mcp-catalog/eino) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1051 | [ElevenFlo](https://manufact.com/mcp-catalog/elevenflo) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 420 / 1052 | [ElevenLabs](https://manufact.com/mcp-catalog/elevenlabs) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1053 | [Elfcare](https://manufact.com/mcp-catalog/elfcare) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| 421 / 1054 | [Elicit](https://manufact.com/mcp-catalog/elicit) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 422 / 1055 | [Elixion](https://manufact.com/mcp-catalog/elixion) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 423 / 1056 | [elluminate](https://manufact.com/mcp-catalog/elluminate) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1057 | [Elvance](https://manufact.com/mcp-catalog/elvance) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1058 | [EM+x](https://manufact.com/mcp-catalog/em-x) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 424 / 1059 | [Embat](https://manufact.com/mcp-catalog/embat) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1060 | [Emergent](https://manufact.com/mcp-catalog/emergent) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1061 | [empirio.ai](https://manufact.com/mcp-catalog/empirio-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1062 | [Encited](https://manufact.com/mcp-catalog/encited) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 425 / 1063 | [Endgame](https://manufact.com/mcp-catalog/endgame) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1064 | [Endlss](https://manufact.com/mcp-catalog/endlss) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 426 / 1065 | [Energy Aspects](https://manufact.com/mcp-catalog/energy-aspects) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1066 | [Entendre](https://manufact.com/mcp-catalog/entendre) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1067 | [Enterpret](https://manufact.com/mcp-catalog/enterpret) | — / — | data | — | — | — | required; free/paid unknown | credentials_required |
| — / 1068 | [Entropia](https://manufact.com/mcp-catalog/entropia) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 427 / 1069 | [Envestnet MoneyGuide](https://manufact.com/mcp-catalog/envestnet-moneyguide) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 428 / 1070 | [Envestnet Tamarac](https://manufact.com/mcp-catalog/envestnet-tamarac) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1071 | [Envia Shipping](https://manufact.com/mcp-catalog/envia-shipping) | — / — | productivity | 4/118/3 | 37750 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default (14) | required; free/paid unknown | complete |
| 429 / 1072 | [Epidemic Sound](https://manufact.com/mcp-catalog/epidemic-sound) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1073 | [Episto](https://manufact.com/mcp-catalog/episto) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1074 | [Era Context](https://manufact.com/mcp-catalog/era-context) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 430 / 1075 | [Eraser](https://manufact.com/mcp-catalog/eraser) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 431 / 1076 | [ESO](https://manufact.com/mcp-catalog/eso) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1077 | [estonian](https://manufact.com/mcp-catalog/estonian) | — / — |  | 0/13/10 | 13791 | broad_response_candidate (7) | none for metadata | complete |
| — / 1078 | [Etropo](https://manufact.com/mcp-catalog/etropo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1079 | [EULER](https://manufact.com/mcp-catalog/euler) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1080 | [Evarist](https://manufact.com/mcp-catalog/evarist) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1081 | [Eventfrog](https://manufact.com/mcp-catalog/eventfrog) | — / — | media-entertainment | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 1082 | [Eventrise](https://manufact.com/mcp-catalog/eventrise) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1083 | [Eventtia MCP](https://manufact.com/mcp-catalog/eventtia-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1084 | [Everinbox](https://manufact.com/mcp-catalog/everinbox) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1085 | [Everlaw](https://manufact.com/mcp-catalog/everlaw) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1086 | [Everly](https://manufact.com/mcp-catalog/everly) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1087 | [Everly for Vendors](https://manufact.com/mcp-catalog/everly-for-vendors) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 432 / 1088 | [Evernote](https://manufact.com/mcp-catalog/evernote) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1089 | [Everythings](https://manufact.com/mcp-catalog/everythings) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1090 | [Evidence Studio](https://manufact.com/mcp-catalog/evidence-studio) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1091 | [Evident UGC](https://manufact.com/mcp-catalog/evident-ugc) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1092 | [EVRoutes](https://manufact.com/mcp-catalog/evroutes) | — / — | travel | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 1093 | [Exact Online AI Connect, by iWebDevelopment](https://manufact.com/mcp-catalog/exact-online-ai-connect-by-iwebdevelopment) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1094 | [Exaforce](https://manufact.com/mcp-catalog/exaforce) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1095 | [exascale.build](https://manufact.com/mcp-catalog/exascale-build) | — / — | data-analytics | 2/77/27 | 36104 | broad_response_candidate, overlapping_read_tools (193) | none for metadata | complete |
| — / 1096 | [Excalidraw](https://manufact.com/mcp-catalog/excalidraw-2) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 1097 | [Exchange Server by Postgate AI](https://manufact.com/mcp-catalog/exchange-server-by-postgate-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1098 | [Expedia](https://manufact.com/mcp-catalog/expedia) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1099 | [ExpenseBot](https://manufact.com/mcp-catalog/expensebot) | — / — | financial-services | 2/20/8 | 38145 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (35) | required; free/paid unknown | complete |
| 433 / 1100 | [Expensify](https://manufact.com/mcp-catalog/expensify) | — / — | financial-services | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 1101 | [Expertise AI](https://manufact.com/mcp-catalog/expertise-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 434 / 1102 | [Expo](https://manufact.com/mcp-catalog/expo) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1103 | [Extract](https://manufact.com/mcp-catalog/extract) | — / — | data-analytics | 14/62/17 | 21657 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (43) | required; free/paid unknown | complete |
| — / 1104 | [eYantra Corporate Gifting](https://manufact.com/mcp-catalog/eyantra-corporate-gifting) | — / — | e-commerce | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 1105 | [Ezoic Analytics](https://manufact.com/mcp-catalog/ezoic-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1106 | [F2F TexPro - Sourcing Intelligence Tool](https://manufact.com/mcp-catalog/f2f-texpro-sourcing-intelligence-tool) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1107 | [Fabric](https://manufact.com/mcp-catalog/fabric) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1108 | [Faces App](https://manufact.com/mcp-catalog/faces-app) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 435 / 1109 | [FactSet AI-Ready Data](https://manufact.com/mcp-catalog/factset-ai-ready-data) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1110 | [FaithGPT: Christian Bible Study & Prayer](https://manufact.com/mcp-catalog/faithgpt-christian-bible-study-prayer) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 1111 | [Fandaqah PMS MCP](https://manufact.com/mcp-catalog/fandaqah-pms-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1112 | [fastwrite](https://manufact.com/mcp-catalog/fastwrite) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 436 / 1113 | [Fathom – Your Meeting Intelligence Layer](https://manufact.com/mcp-catalog/fathom-your-meeting-intelligence-layer) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1114 | [Fattura24](https://manufact.com/mcp-catalog/fattura24) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1115 | [FedMCP](https://manufact.com/mcp-catalog/fedmcp) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1116 | [Feedier](https://manufact.com/mcp-catalog/feedier) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 437 / 1117 | [Fellow.ai](https://manufact.com/mcp-catalog/fellow-ai) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 438 / 1118 | [Felt Maps](https://manufact.com/mcp-catalog/felt-maps) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1119 | [Femas HR AI connect](https://manufact.com/mcp-catalog/femas-hr-ai-connect) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1120 | [Fever Event Discovery](https://manufact.com/mcp-catalog/fever-event-discovery) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1121 | [FGAC.ai](https://manufact.com/mcp-catalog/fgac-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1122 | [FGO.ro](https://manufact.com/mcp-catalog/fgo-ro) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 439 / 1123 | [Fibery](https://manufact.com/mcp-catalog/fibery) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1124 | [Field Control](https://manufact.com/mcp-catalog/field-control) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1125 | [FieldCamp](https://manufact.com/mcp-catalog/fieldcamp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1126 | [Fieldwerk](https://manufact.com/mcp-catalog/fieldwerk) | — / — | productivity | 148/370/42 | 84624 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (103) | required; free/paid unknown | complete |
| — / 1127 | [Fieldy](https://manufact.com/mcp-catalog/fieldy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 440 / 1128 | [Figma](https://manufact.com/mcp-catalog/figma) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 441 / 1129 | [Figr](https://manufact.com/mcp-catalog/figr) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 442 / 1130 | [Files.com](https://manufact.com/mcp-catalog/files-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 443 / 1131 | [Filevine](https://manufact.com/mcp-catalog/filevine) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1132 | [FinancialFilings](https://manufact.com/mcp-catalog/financialfilings) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1133 | [Fincome](https://manufact.com/mcp-catalog/fincome) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 444 / 1134 | [Fine Structure](https://manufact.com/mcp-catalog/fine-structure) | — / — | developer-tools | 40/224/0 | 22599 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (135) | required; free/paid unknown | complete |
| — / 1135 | [Fingerprint](https://manufact.com/mcp-catalog/fingerprint) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1136 | [Finhay](https://manufact.com/mcp-catalog/finhay) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1137 | [Finseo](https://manufact.com/mcp-catalog/finseo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 445 / 1138 | [FINTRX](https://manufact.com/mcp-catalog/fintrx) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 446 / 1139 | [Fireflies](https://manufact.com/mcp-catalog/fireflies) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1140 | [Firmao](https://manufact.com/mcp-catalog/firmao) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1141 | [Firmenbuch](https://manufact.com/mcp-catalog/firmenbuch) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1142 | [First Answer](https://manufact.com/mcp-catalog/first-answer) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 447 / 1143 | [Fiscal.ai](https://manufact.com/mcp-catalog/fiscal-ai) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 448 / 1144 | [Fitch Solutions](https://manufact.com/mcp-catalog/fitch-solutions) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1145 | [Fixture and Finish](https://manufact.com/mcp-catalog/fixture-and-finish) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1146 | [Flaim Fantasy](https://manufact.com/mcp-catalog/flaim-fantasy) | — / — |  | 0/0/10 | 12551 | broad_response_candidate (6) | required; free/paid unknown | complete |
| 449 / 1147 | [Flanks Aggregate](https://manufact.com/mcp-catalog/flanks-aggregate) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 450 / 1148 | [flashcardzen-staging.vercel.app](https://manufact.com/mcp-catalog/flashcardzen-staging-vercel-app) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 451 / 1149 | [flashcardzen.com](https://manufact.com/mcp-catalog/flashcardzen-com) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 1150 | [Flatre](https://manufact.com/mcp-catalog/flatre) | — / — | productivity | 0/0/1 | 26384 | response_control_size_unclear, overlapping_read_tools (9) | required; free/paid unknown | complete |
| — / 1151 | [FlawPilot](https://manufact.com/mcp-catalog/flawpilot) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1152 | [Fleks Workforce Management](https://manufact.com/mcp-catalog/fleks-workforce-management) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 452 / 1153 | [Flockjay](https://manufact.com/mcp-catalog/flockjay) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1154 | [Flodesk](https://manufact.com/mcp-catalog/flodesk) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 453 / 1155 | [Floot](https://manufact.com/mcp-catalog/floot) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 454 / 1156 | [Flourish](https://manufact.com/mcp-catalog/flourish) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 455 / 1157 | [Flourish Financial](https://manufact.com/mcp-catalog/flourish-financial) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1158 | [flow](https://manufact.com/mcp-catalog/flow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1159 | [FlowAccount](https://manufact.com/mcp-catalog/flowaccount) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1160 | [Flowera](https://manufact.com/mcp-catalog/flowera) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1161 | [FlowGuideAI Assisted Documentation](https://manufact.com/mcp-catalog/flowguideai-assisted-documentation) | — / — | business-productivity | 0/16/1 | 6232 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 456 / 1162 | [Flowla](https://manufact.com/mcp-catalog/flowla) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1163 | [Flowsery - web analytics and session insights](https://manufact.com/mcp-catalog/flowsery-web-analytics-and-session-insights) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 457 / 1164 | [Flowstep](https://manufact.com/mcp-catalog/flowstep) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1165 | [FlowyTeam](https://manufact.com/mcp-catalog/flowyteam) | — / — | productivity | 0/30/0 | — | broad_response_candidate, overlapping_read_tools (9) | required; free/paid unknown | complete |
| 458 / 1166 | [Fluix](https://manufact.com/mcp-catalog/fluix) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 459 / 1167 | [FMP](https://manufact.com/mcp-catalog/fmp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 460 / 1168 | [folk](https://manufact.com/mcp-catalog/folk) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1169 | [Folloze](https://manufact.com/mcp-catalog/folloze) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1170 | [Fond](https://manufact.com/mcp-catalog/fond) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1171 | [Foodics MCP](https://manufact.com/mcp-catalog/foodics-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 461 / 1172 | [Forecastable](https://manufact.com/mcp-catalog/forecastable) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 462 / 1173 | [Formal Logic](https://manufact.com/mcp-catalog/formal-logic) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1174 | [Formasty](https://manufact.com/mcp-catalog/formasty) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1175 | [FormEdge](https://manufact.com/mcp-catalog/formedge) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1176 | [FormHug AI](https://manufact.com/mcp-catalog/formhug-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1177 | [ForthWrite](https://manufact.com/mcp-catalog/forthwrite) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 463 / 1178 | [Fospha  (EMEA & APAC)](https://manufact.com/mcp-catalog/fospha-emea-apac) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1179 | [Fospha (North & South America)](https://manufact.com/mcp-catalog/fospha-north-south-america) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 464 / 1180 | [Found](https://manufact.com/mcp-catalog/found) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1181 | [foundation-api.trychroma.com](https://manufact.com/mcp-catalog/foundation-api-trychroma-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1182 | [Foundry IMS](https://manufact.com/mcp-catalog/foundry-ims) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1183 | [Four/Four](https://manufact.com/mcp-catalog/four-four) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1184 | [FRAMEN](https://manufact.com/mcp-catalog/framen) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1185 | [Franchable](https://manufact.com/mcp-catalog/franchable) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 465 / 1186 | [Frase](https://manufact.com/mcp-catalog/frase) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 466 / 1187 | [freee](https://manufact.com/mcp-catalog/freee) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1188 | [FreightPOP](https://manufact.com/mcp-catalog/freightpop) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1189 | [FreqBlog Music Metadata](https://manufact.com/mcp-catalog/freqblog-music-metadata) | — / — | media | 0/5/5 | 10978 | broad_response_candidate, response_control_size_unclear (4) | none for metadata | complete |
| 467 / 1190 | [Fresha](https://manufact.com/mcp-catalog/fresha) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1191 | [Freshdi](https://manufact.com/mcp-catalog/freshdi) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1192 | [Friday4:30](https://manufact.com/mcp-catalog/friday4-30) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 468 / 1193 | [Front](https://manufact.com/mcp-catalog/front) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 469 / 1194 | [Frontify](https://manufact.com/mcp-catalog/frontify) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1195 | [FUGO SHARE TO SCREEN](https://manufact.com/mcp-catalog/fugo-share-to-screen) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 470 / 1196 | [Fullstory](https://manufact.com/mcp-catalog/fullstory) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1197 | [Funlet](https://manufact.com/mcp-catalog/funlet) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1198 | [Further](https://manufact.com/mcp-catalog/further) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 471 / 1199 | [Fuse Inventory](https://manufact.com/mcp-catalog/fuse-inventory) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1200 | [Futrumi](https://manufact.com/mcp-catalog/futrumi) | — / — | media | 0/13/0 | 2942 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| 472 / 1201 | [fynk](https://manufact.com/mcp-catalog/fynk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1202 | [fypnow](https://manufact.com/mcp-catalog/fypnow) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| 473 / 1203 | [Fyxer](https://manufact.com/mcp-catalog/fyxer) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 474 / 1204 | [G2](https://manufact.com/mcp-catalog/g2) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1205 | [GadgetOS](https://manufact.com/mcp-catalog/gadgetos) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1206 | [Gainable](https://manufact.com/mcp-catalog/gainable) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 475 / 1207 | [Gainsight (Customer Communities)](https://manufact.com/mcp-catalog/gainsight-customer-communities) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 476 / 1208 | [Gainsight (Staircase AI)](https://manufact.com/mcp-catalog/gainsight-staircase-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 477 / 1209 | [Gamma](https://manufact.com/mcp-catalog/gamma) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1210 | [Gather](https://manufact.com/mcp-catalog/gather) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1211 | [GatherHQ](https://manufact.com/mcp-catalog/gatherhq) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 478 / 1212 | [GC AI](https://manufact.com/mcp-catalog/gc-ai) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 479 / 1213 | [Geckoboard](https://manufact.com/mcp-catalog/geckoboard) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 480 / 1214 | [Geekbot](https://manufact.com/mcp-catalog/geekbot) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1215 | [Geenie](https://manufact.com/mcp-catalog/geenie) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1216 | [Gem](https://manufact.com/mcp-catalog/gem) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 481 / 1217 | [General Legal](https://manufact.com/mcp-catalog/general-legal) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1218 | [GenieSeo](https://manufact.com/mcp-catalog/genieseo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1219 | [Gentek Reg Agent](https://manufact.com/mcp-catalog/gentek-reg-agent) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1220 | [Get My eSIM](https://manufact.com/mcp-catalog/get-my-esim) | — / — | e-commerce | 0/0/1 | 3949 | broad_response_candidate (1) | none for metadata | complete |
| 482 / 1221 | [GetAccept](https://manufact.com/mcp-catalog/getaccept) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1222 | [GetItDone](https://manufact.com/mcp-catalog/getitdone) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1223 | [GetWhys](https://manufact.com/mcp-catalog/getwhys) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1224 | [GetYourGuide](https://manufact.com/mcp-catalog/getyourguide) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1225 | [Giatec](https://manufact.com/mcp-catalog/giatec) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 483 / 1226 | [GIS Cloud](https://manufact.com/mcp-catalog/gis-cloud) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 484 / 1227 | [GitBook MCP](https://manufact.com/mcp-catalog/gitbook-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1228 | [GitHits](https://manufact.com/mcp-catalog/githits) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1229 | [Givebutter](https://manufact.com/mcp-catalog/givebutter) | — / — | nonprofit | — | — | — | required; free/paid unknown | credentials_required |
| — / 1230 | [Givemeanode](https://manufact.com/mcp-catalog/givemeanode) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1231 | [GlacierGrid](https://manufact.com/mcp-catalog/glaciergrid) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 485 / 1232 | [GLG](https://manufact.com/mcp-catalog/glg) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1233 | [Global Database](https://manufact.com/mcp-catalog/global-database) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 486 / 1234 | [Glovo](https://manufact.com/mcp-catalog/glovo) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1235 | [Glow for WordPress](https://manufact.com/mcp-catalog/glow-for-wordpress) | — / — | productivity | 2/56/0 | 7993 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default (54) | required; free/paid unknown | complete |
| — / 1236 | [Goalie Trademark Search](https://manufact.com/mcp-catalog/goalie-trademark-search) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1237 | [GoBlinkly](https://manufact.com/mcp-catalog/goblinkly) | — / — | data-analytics | 140/709/8 | 49444 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (355) | required; free/paid unknown | complete |
| 487 / 1238 | [GoCardless](https://manufact.com/mcp-catalog/gocardless) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 488 / 1239 | [godaddy-domains-mcp](https://manufact.com/mcp-catalog/godaddy) | — / — | developer-tools | 0/4/0 | 1048 |  (0) | none for metadata | complete |
| 489 / 1240 | [GoLinks](https://manufact.com/mcp-catalog/golinks) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 490 / 1241 | [Gong](https://manufact.com/mcp-catalog/gong) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 491 / 1242 | [Good Tape](https://manufact.com/mcp-catalog/good-tape) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1243 | [GoodBarber](https://manufact.com/mcp-catalog/goodbarber) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1244 | [Goodday MCP](https://manufact.com/mcp-catalog/goodday-mcp) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 492 / 1245 | [GoodTime](https://manufact.com/mcp-catalog/goodtime) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 493 / 1246 | [Google Compute Engine](https://manufact.com/mcp-catalog/google-compute-engine) | — / — | developer-tools | 0/22/0 | 8692 | overlapping_read_tools (64) | required; free/paid unknown | complete |
| — / 1247 | [GoPublish: Publish & Schedule to WordPress](https://manufact.com/mcp-catalog/gopublish-publish-schedule-to-wordpress) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 494 / 1248 | [Gorgias MCP](https://manufact.com/mcp-catalog/gorgias-mcp) | — / — | customer-support | 9/77/20 | 123558 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (131) | required; free/paid unknown | complete |
| — / 1249 | [GoSearch MCP](https://manufact.com/mcp-catalog/gosearch-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1250 | [Govly](https://manufact.com/mcp-catalog/govly) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1251 | [GovQuery](https://manufact.com/mcp-catalog/govquery) | — / — | productivity | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 1252 | [GovTribe](https://manufact.com/mcp-catalog/govtribe) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 495 / 1253 | [Graffiticode](https://manufact.com/mcp-catalog/graffiticode) | — / — | developer-tools | 0/2/2 | 2930 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 496 / 1254 | [Grain](https://manufact.com/mcp-catalog/grain) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 497 / 1255 | [GrapesJS Studio](https://manufact.com/mcp-catalog/grapesjs-studio) | — / — | design-creative | 9/31/0 | 1961 | response_control_size_unclear, overlapping_read_tools (4) | required; free/paid unknown | complete |
| — / 1256 | [Graph of Thought](https://manufact.com/mcp-catalog/graph-of-thought) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 498 / 1257 | [Grasp](https://manufact.com/mcp-catalog/grasp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 499 / 1258 | [Grasshopper Bank](https://manufact.com/mcp-catalog/grasshopper-bank) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1259 | [Great Arrow Digital](https://manufact.com/mcp-catalog/great-arrow-digital) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1260 | [GReminders](https://manufact.com/mcp-catalog/greminders) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1261 | [Grid Control](https://manufact.com/mcp-catalog/grid-control) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1262 | [Gridbert](https://manufact.com/mcp-catalog/gridbert) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1263 | [Gridset](https://manufact.com/mcp-catalog/gridset) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1264 | [Grip Event Organiser](https://manufact.com/mcp-catalog/grip-event-organiser) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1265 | [Groundbook](https://manufact.com/mcp-catalog/groundbook) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 500 / 1266 | [GrowByData Compass](https://manufact.com/mcp-catalog/growbydata-compass) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1267 | [Growomat](https://manufact.com/mcp-catalog/growomat) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1268 | [Growrk](https://manufact.com/mcp-catalog/growrk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 501 / 1269 | [GrowthBook MCP](https://manufact.com/mcp-catalog/growthbook-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1270 | [grtwo-docs](https://manufact.com/mcp-catalog/grtwo-docs) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1271 | [Grw](https://manufact.com/mcp-catalog/grw) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 502 / 1272 | [Guidde](https://manufact.com/mcp-catalog/guidde) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1273 | [GuideBeam](https://manufact.com/mcp-catalog/guidebeam) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 1274 | [GuideCompare](https://manufact.com/mcp-catalog/guidecompare) | — / — | travel | 0/5/0 | 2130 | broad_response_candidate (1) | none for metadata | complete |
| 503 / 1275 | [Guidepoint](https://manufact.com/mcp-catalog/guidepoint) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 504 / 1276 | [Gumlet](https://manufact.com/mcp-catalog/gumlet) | — / — | developer-tools | 8/112/0 | 57454 | potentially_expensive_default, response_control_size_unclear, broad_response_candidate, overlapping_read_tools (51) | none for metadata | complete |
| 505 / 1277 | [Guru](https://manufact.com/mcp-catalog/guru) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 506 / 1278 | [Gusto](https://manufact.com/mcp-catalog/gusto) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 507 / 1279 | [Haloo Trademark Clearance](https://manufact.com/mcp-catalog/haloo-trademark-clearance) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1280 | [Hamla](https://manufact.com/mcp-catalog/hamla) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 508 / 1281 | [Handoff](https://manufact.com/mcp-catalog/handoff) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 509 / 1282 | [Handwrytten](https://manufact.com/mcp-catalog/handwrytten) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1283 | [Hanover Park](https://manufact.com/mcp-catalog/hanover-park) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1284 | [Happening Events Milwaukee](https://manufact.com/mcp-catalog/happening-events-milwaukee) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 1285 | [HappyCo](https://manufact.com/mcp-catalog/happyco) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 510 / 1286 | [HappyScribe](https://manufact.com/mcp-catalog/happyscribe) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1287 | [Hardal](https://manufact.com/mcp-catalog/hardal) | — / — | data-analytics | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 1288 | [Hardline](https://manufact.com/mcp-catalog/hardline) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 511 / 1289 | [Harmonic](https://manufact.com/mcp-catalog/harmonic) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 512 / 1290 | [Harness](https://manufact.com/mcp-catalog/harness) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 513 / 1291 | [Hatchable](https://manufact.com/mcp-catalog/hatchable) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 514 / 1292 | [Have I Been Pwned](https://manufact.com/mcp-catalog/have-i-been-pwned) | — / — | developer-tools | 0/15/0 | 6052 | potentially_expensive_default, broad_response_candidate (3) | required; free/paid unknown | complete |
| 515 / 1293 | [Haystack](https://manufact.com/mcp-catalog/haystack) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1294 | [Health Data Avatar (HDA)](https://manufact.com/mcp-catalog/health-data-avatar-hda) | — / — | healthcare | — | — | — | required; free/paid unknown | credentials_required |
| — / 1295 | [Heatseeker](https://manufact.com/mcp-catalog/heatseeker) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1296 | [Hector Ai - Amazon](https://manufact.com/mcp-catalog/hector-ai-amazon) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 516 / 1297 | [Helena by Enrich Labs](https://manufact.com/mcp-catalog/helena-by-enrich-labs) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1298 | [Heliciel — Propeller & Wing Design](https://manufact.com/mcp-catalog/heliciel-propeller-wing-design) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 517 / 1299 | [Helium 10](https://manufact.com/mcp-catalog/helium-10) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1300 | [Helix GenoSphere](https://manufact.com/mcp-catalog/helix-genosphere) | — / — | life-sciences | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| 518 / 1301 | [Hello Retail](https://manufact.com/mcp-catalog/hello-retail) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 519 / 1302 | [HelpDocs](https://manufact.com/mcp-catalog/helpdocs) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 520 / 1303 | [Hero by Vivun](https://manufact.com/mcp-catalog/hero-by-vivun) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1304 | [HeyCounsel](https://manufact.com/mcp-catalog/heycounsel) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 521 / 1305 | [HFS Research](https://manufact.com/mcp-catalog/hfs-research) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 522 / 1306 | [Hgraph](https://manufact.com/mcp-catalog/hgraph) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1307 | [Hi Energy](https://manufact.com/mcp-catalog/hi-energy) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 523 / 1308 | [Highspot](https://manufact.com/mcp-catalog/highspot) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1309 | [HilltopAds](https://manufact.com/mcp-catalog/hilltopads) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1310 | [Hindsight](https://manufact.com/mcp-catalog/hindsight) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1311 | [HireOtto - Google Analytics MCP](https://manufact.com/mcp-catalog/hireotto-google-analytics-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1312 | [HireOtto - Google Tag Manager MCP](https://manufact.com/mcp-catalog/hireotto-google-tag-manager-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1313 | [Hit The Road Rentals](https://manufact.com/mcp-catalog/hit-the-road-rentals) | — / — | travel | 0/4/0 | 836 | broad_response_candidate (1) | none for metadata | complete |
| — / 1314 | [HitPay](https://manufact.com/mcp-catalog/hitpay) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1315 | [Hitsteps Web Analytics](https://manufact.com/mcp-catalog/hitsteps-web-analytics) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1316 | [Hiveflow](https://manufact.com/mcp-catalog/hiveflow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1317 | [Hiver in Gmail](https://manufact.com/mcp-catalog/hiver-in-gmail) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 524 / 1318 | [Hiver Omni](https://manufact.com/mcp-catalog/hiver-omni) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 525 / 1319 | [Hjarni notes](https://manufact.com/mcp-catalog/hjarni-notes) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 526 / 1320 | [HoneyBook](https://manufact.com/mcp-catalog/honeybook) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 527 / 1321 | [Honeycomb](https://manufact.com/mcp-catalog/honeycomb) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1322 | [Honeydew](https://manufact.com/mcp-catalog/honeydew) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1323 | [Horizon](https://manufact.com/mcp-catalog/horizon) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 528 / 1324 | [Hostinger Connector](https://manufact.com/mcp-catalog/hostinger-connector) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 529 / 1325 | [Hostinger Mail](https://manufact.com/mcp-catalog/hostinger-mail) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1326 | [HtAG Spatial](https://manufact.com/mcp-catalog/htag-spatial) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 530 / 1327 | [HTML/CSS to Image MCP](https://manufact.com/mcp-catalog/html-css-to-image-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1328 | [HTMLvault](https://manufact.com/mcp-catalog/htmlvault) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1329 | [Hubbl](https://manufact.com/mcp-catalog/hubbl) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 531 / 1330 | [HubSpot](https://manufact.com/mcp-catalog/hubspot) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 532 / 1331 | [Hugging Face](https://manufact.com/mcp-catalog/hugging-face) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 533 / 1332 | [Huxly](https://manufact.com/mcp-catalog/huxly) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1333 | [hvacbuilder.app](https://manufact.com/mcp-catalog/hvacbuilder-app) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1334 | [HWPXkit](https://manufact.com/mcp-catalog/hwpxkit) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 534 / 1335 | [Hygraph MCP](https://manufact.com/mcp-catalog/hygraph-mcp) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1336 | [HYPD AI for Google Ads, Google Analytics, Meta Ads/Facebook Ads, Keyword Planner & Merchant Center](https://manufact.com/mcp-catalog/hypd-ai-for-google-ads-google-analytics-meta-ads-f) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 535 / 1337 | [HypeAgent by HypeAuditor](https://manufact.com/mcp-catalog/hypeagent-by-hypeauditor) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 536 / 1338 | [HyperFrames by HeyGen](https://manufact.com/mcp-catalog/hyperframes-by-heygen) | — / — | design-creative | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 537 / 1339 | [HYROS](https://manufact.com/mcp-catalog/hyros) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1340 | [IBI SMART](https://manufact.com/mcp-catalog/ibi-smart) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 538 / 1341 | [IBISWorld](https://manufact.com/mcp-catalog/ibisworld) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 539 / 1342 | [iCapital](https://manufact.com/mcp-catalog/icapital) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 540 / 1343 | [ICE Data Services](https://manufact.com/mcp-catalog/ice-data-services) | — / — | financial-services | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 1344 | [Iceflower](https://manufact.com/mcp-catalog/iceflower) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 541 / 1345 | [IcePanel](https://manufact.com/mcp-catalog/icepanel) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 542 / 1346 | [icod.ai](https://manufact.com/mcp-catalog/icod-ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1347 | [Ideaflow](https://manufact.com/mcp-catalog/ideaflow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1348 | [IdealData.io: Real-time signals for eCommerce Stores](https://manufact.com/mcp-catalog/idealdata-io-real-time-signals-for-ecommerce-store) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 543 / 1349 | [idealista](https://manufact.com/mcp-catalog/idealista) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1350 | [Ideals](https://manufact.com/mcp-catalog/ideals) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 544 / 1351 | [IDrive e2](https://manufact.com/mcp-catalog/idrive-e2) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 545 / 1352 | [IFTTT](https://manufact.com/mcp-catalog/ifttt) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 1353 | [IHCL Restaurant Reservations via AURA](https://manufact.com/mcp-catalog/ihcl-restaurant-reservations-via-aura) | — / — | other | 0/1/1 | 1190 | broad_response_candidate (1) | none for metadata | complete |
| — / 1354 | [iknow.dev](https://manufact.com/mcp-catalog/iknow-dev) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 546 / 1355 | [iManage Work](https://manufact.com/mcp-catalog/imanage-work) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1356 | [Impala](https://manufact.com/mcp-catalog/impala) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 547 / 1357 | [In Practise](https://manufact.com/mcp-catalog/in-practise) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 548 / 1358 | [Inbin](https://manufact.com/mcp-catalog/inbin) | — / — | developer-tools | 0/7/2 | 2586 | broad_response_candidate (1) | required; free/paid unknown | complete |
| — / 1359 | [inblog](https://manufact.com/mcp-catalog/inblog) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 549 / 1360 | [Inbox Monster MCP](https://manufact.com/mcp-catalog/inbox-monster-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 550 / 1361 | [incident.io](https://manufact.com/mcp-catalog/incident-io) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 551 / 1362 | [Indeed](https://manufact.com/mcp-catalog/indeed) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1363 | [Inductive Bio](https://manufact.com/mcp-catalog/inductive-bio) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 1364 | [Inflearn](https://manufact.com/mcp-catalog/inflearn) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 552 / 1365 | [Inflection.io](https://manufact.com/mcp-catalog/inflection-io) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1366 | [Infobip Documentation](https://manufact.com/mcp-catalog/infobip-documentation) | — / — | communication | 0/1/0 | 511 |  (0) | none for metadata | complete |
| 553 / 1367 | [Infobip Message](https://manufact.com/mcp-catalog/infobip-message) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1368 | [Infollion](https://manufact.com/mcp-catalog/infollion) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 554 / 1369 | [InfStones Blockchain Intelligence](https://manufact.com/mcp-catalog/infstones-blockchain-intelligence) | — / — | developer-tools | 0/31/0 | 5374 | broad_response_candidate (1) | required; free/paid unknown | complete |
| — / 1370 | [Inistate](https://manufact.com/mcp-catalog/inistate) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 555 / 1371 | [Inkbox](https://manufact.com/mcp-catalog/inkbox) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1372 | [Inrō](https://manufact.com/mcp-catalog/inr) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 556 / 1373 | [Insider One](https://manufact.com/mcp-catalog/insider-one) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1374 | [InsightfulPipe — Google Ads, Meta Ads, GA4, SEO, Social & Shopify](https://manufact.com/mcp-catalog/insightfulpipe-google-ads-meta-ads-ga4-seo-social) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 557 / 1375 | [Instacart](https://manufact.com/mcp-catalog/instacart) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1376 | [InstaDemo](https://manufact.com/mcp-catalog/instademo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1377 | [InstaPods](https://manufact.com/mcp-catalog/instapods) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1378 | [InstaWP](https://manufact.com/mcp-catalog/instawp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1379 | [Instrumentl](https://manufact.com/mcp-catalog/instrumentl) | — / — | nonprofit | — | — | — | required; free/paid unknown | server_error |
| — / 1380 | [Integral Motion](https://manufact.com/mcp-catalog/integral-motion) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1381 | [Intelas](https://manufact.com/mcp-catalog/intelas) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 558 / 1382 | [Intelligems](https://manufact.com/mcp-catalog/intelligems) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 559 / 1383 | [Interactive Brokers (IBKR)](https://manufact.com/mcp-catalog/interactive-brokers-ibkr) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 560 / 1384 | [Intercom](https://manufact.com/mcp-catalog/intercom) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 1385 | [Interfy](https://manufact.com/mcp-catalog/interfy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1386 | [InterMIND](https://manufact.com/mcp-catalog/intermind) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 561 / 1387 | [Introw Partner Connect](https://manufact.com/mcp-catalog/introw-partner-connect) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 562 / 1388 | [Introw PRM](https://manufact.com/mcp-catalog/introw-prm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 563 / 1389 | [Intuit Credit Karma](https://manufact.com/mcp-catalog/intuit-credit-karma) | — / — | financial-services | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 564 / 1390 | [Intuit Mailchimp](https://manufact.com/mcp-catalog/intuit-mailchimp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| 565 / 1391 | [Intuit QuickBooks](https://manufact.com/mcp-catalog/intuit-quickbooks) | — / — | financial-services | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 566 / 1392 | [Intuit TurboTax](https://manufact.com/mcp-catalog/intuit-turbotax) | — / — | financial-services | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 1393 | [Invoice Butler](https://manufact.com/mcp-catalog/invoice-butler) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1394 | [invoicing.nikhilbhatia.com](https://manufact.com/mcp-catalog/invoicing-nikhilbhatia-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1395 | [IQLand (Official)](https://manufact.com/mcp-catalog/iqland-official) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1396 | [Is It Legit by M8ven](https://manufact.com/mcp-catalog/is-it-legit-by-m8ven) | — / — | e-commerce | 0/3/0 | 1102 |  (0) | required; free/paid unknown | complete |
| — / 1397 | [isolved People Cloud](https://manufact.com/mcp-catalog/isolved-people-cloud) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1398 | [Isometric](https://manufact.com/mcp-catalog/isometric) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1399 | [iSpv](https://manufact.com/mcp-catalog/ispv) | — / — | data-analytics | 0/4/0 | 800 |  (0) | none for metadata | complete |
| — / 1400 | [Iterative Refinement](https://manufact.com/mcp-catalog/iterative-refinement) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 567 / 1401 | [iubenda](https://manufact.com/mcp-catalog/iubenda) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1402 | [iZap](https://manufact.com/mcp-catalog/izap) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 568 / 1403 | [Jam](https://manufact.com/mcp-catalog/jam) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1404 | [JamBase](https://manufact.com/mcp-catalog/jambase) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| 569 / 1405 | [Jasper](https://manufact.com/mcp-catalog/jasper) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1406 | [Jedify](https://manufact.com/mcp-catalog/jedify) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1407 | [Jenner Analytics](https://manufact.com/mcp-catalog/jenner-analytics) | — / — | data-analytics | 0/2/1 | 2746 |  (0) | required; free/paid unknown | complete |
| 570 / 1408 | [Jentic](https://manufact.com/mcp-catalog/jentic) | — / — | automation-workflows | 0/0/1 | 2193 | broad_response_candidate (3) | required; free/paid unknown | complete |
| — / 1409 | [JETNET](https://manufact.com/mcp-catalog/jetnet) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 571 / 1410 | [Jibble](https://manufact.com/mcp-catalog/jibble) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 572 / 1411 | [Jiminny](https://manufact.com/mcp-catalog/jiminny) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 573 / 1412 | [Joan AI (Joan Workplace management Agent)](https://manufact.com/mcp-catalog/joan-ai-joan-workplace-management-agent) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1413 | [JobDataLake](https://manufact.com/mcp-catalog/jobdatalake) | — / — | data-analytics | 0/11/0 | 1876 | overlapping_read_tools (2) | none for metadata | complete |
| — / 1414 | [Jobs to be Done (JTBD) Interview Analyzer](https://manufact.com/mcp-catalog/jobs-to-be-done-jtbd-interview-analyzer) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1415 | [JobTread](https://manufact.com/mcp-catalog/jobtread) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1416 | [Joby CRM](https://manufact.com/mcp-catalog/joby-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 574 / 1417 | [Jockey by TwelveLabs](https://manufact.com/mcp-catalog/jockey-by-twelvelabs) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1418 | [Join](https://manufact.com/mcp-catalog/join) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1419 | [JoomPulse](https://manufact.com/mcp-catalog/joompulse) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 575 / 1420 | [Jotform](https://manufact.com/mcp-catalog/jotform) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1421 | [Jotform Apps](https://manufact.com/mcp-catalog/jotform-apps) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 576 / 1422 | [Jotform Sign](https://manufact.com/mcp-catalog/jotform-sign) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1423 | [JP Bid](https://manufact.com/mcp-catalog/jp-bid) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1424 | [JUDY](https://manufact.com/mcp-catalog/judy) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 577 / 1425 | [Juicebox](https://manufact.com/mcp-catalog/juicebox) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1426 | [Juicy attribution & profit](https://manufact.com/mcp-catalog/juicy-attribution-profit) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 578 / 1427 | [Jump](https://manufact.com/mcp-catalog/jump) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 579 / 1428 | [JumpCloud Admin MCP](https://manufact.com/mcp-catalog/jumpcloud-admin-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1429 | [Juridata](https://manufact.com/mcp-catalog/juridata) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1430 | [Jurnie](https://manufact.com/mcp-catalog/jurnie) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 580 / 1431 | [Juro contracts](https://manufact.com/mcp-catalog/juro-contracts) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 581 / 1432 | [Jus AI by Jus Mundi (Light Mode)](https://manufact.com/mcp-catalog/jus-ai-by-jus-mundi-light-mode) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1433 | [Jusratio](https://manufact.com/mcp-catalog/jusratio) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1434 | [JusticeNow Library](https://manufact.com/mcp-catalog/justicenow-library) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1435 | [justtranscribe](https://manufact.com/mcp-catalog/justtranscribe) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1436 | [Kaiterra](https://manufact.com/mcp-catalog/kaiterra) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1437 | [KalenderSync](https://manufact.com/mcp-catalog/kalendersync) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1438 | [Kamai AI](https://manufact.com/mcp-catalog/kamai-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1439 | [Kanera](https://manufact.com/mcp-catalog/kanera) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1440 | [KANNA](https://manufact.com/mcp-catalog/kanna) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 582 / 1441 | [Kantata OX Expertise Engine](https://manufact.com/mcp-catalog/kantata-ox-expertise-engine) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1442 | [Karmly](https://manufact.com/mcp-catalog/karmly) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1443 | [Karumi](https://manufact.com/mcp-catalog/karumi) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 583 / 1444 | [Kastra](https://manufact.com/mcp-catalog/kastra) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1445 | [Kayse for Claude](https://manufact.com/mcp-catalog/kayse-for-claude) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 584 / 1446 | [Keenable SELECT](https://manufact.com/mcp-catalog/keenable-select) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1447 | [Kemory by SeKondBrain](https://manufact.com/mcp-catalog/kemory-by-sekondbrain) | — / — | productivity | 0/1/6 | 15414 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default (13) | required; free/paid unknown | complete |
| — / 1448 | [Kepler](https://manufact.com/mcp-catalog/kepler) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1449 | [Kernel](https://manufact.com/mcp-catalog/kernel) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 585 / 1450 | [kernelCAD](https://manufact.com/mcp-catalog/kernelcad) | — / — | developer-tools | 20/35/22 | — | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (35) | required; free/paid unknown | complete |
| 586 / 1451 | [Ketryx](https://manufact.com/mcp-catalog/ketryx) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1452 | [KEY ESG (Private Equity)](https://manufact.com/mcp-catalog/key-esg-private-equity) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1453 | [KEY ESG (Standalone)](https://manufact.com/mcp-catalog/key-esg-standalone) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 587 / 1454 | [Keynodex Memory](https://manufact.com/mcp-catalog/keynodex-memory) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 588 / 1455 | [Keyword Tool Pro](https://manufact.com/mcp-catalog/keyword-tool-pro) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 589 / 1456 | [Kick](https://manufact.com/mcp-catalog/kick) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1457 | [Kifly](https://manufact.com/mcp-catalog/kifly) | — / — | commerce-shopping | 0/30/3 | 15097 | broad_response_candidate (3) | required; free/paid unknown | complete |
| — / 1458 | [Kindora Funder Discovery](https://manufact.com/mcp-catalog/kindora-funder-discovery) | — / — | nonprofit | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 1459 | [KinElo](https://manufact.com/mcp-catalog/kinelo) | — / — | media | 0/6/0 | 2447 | response_control_size_unclear, overlapping_read_tools (20) | required; free/paid unknown | complete |
| — / 1460 | [Kinetik](https://manufact.com/mcp-catalog/kinetik) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 590 / 1461 | [Kintsugi](https://manufact.com/mcp-catalog/kintsugi) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 591 / 1462 | [KiriminAja](https://manufact.com/mcp-catalog/kiriminaja) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 592 / 1463 | [Klaviyo](https://manufact.com/mcp-catalog/klaviyo) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1464 | [Klaxoon](https://manufact.com/mcp-catalog/klaxoon) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 593 / 1465 | [Klue](https://manufact.com/mcp-catalog/klue) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1466 | [Klyf](https://manufact.com/mcp-catalog/klyf) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 594 / 1467 | [Knak](https://manufact.com/mcp-catalog/knak) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1468 | [Knips](https://manufact.com/mcp-catalog/knips) | — / — | sales-and-marketing | 0/34/8 | 103358 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (17) | required; free/paid unknown | complete |
| 595 / 1469 | [Knock](https://manufact.com/mcp-catalog/knock) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1470 | [Kometrics](https://manufact.com/mcp-catalog/kometrics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1471 | [komoot](https://manufact.com/mcp-catalog/komoot) | — / — | travel-outdoors-maps | 0/9/4 | 9437 | broad_response_candidate, overlapping_read_tools (7) | none for metadata | complete |
| — / 1472 | [Komplyt Zero](https://manufact.com/mcp-catalog/komplyt-zero) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1473 | [Konektor](https://manufact.com/mcp-catalog/konektor) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1474 | [KORE](https://manufact.com/mcp-catalog/kore) | — / — | healthcare | 0/3/3 | 2388 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 596 / 1475 | [Kpler](https://manufact.com/mcp-catalog/kpler) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 597 / 1476 | [Krisp](https://manufact.com/mcp-catalog/krisp) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1477 | [Kuliko AI](https://manufact.com/mcp-catalog/kuliko-ai) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 1478 | [Lab08 Lens](https://manufact.com/mcp-catalog/lab08-lens) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1479 | [Lace Labs](https://manufact.com/mcp-catalog/lace-labs) | — / — | productivity | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 1480 | [Laimonade.com](https://manufact.com/mcp-catalog/laimonade-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1481 | [Laioutr](https://manufact.com/mcp-catalog/laioutr) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1482 | [Laki.ai](https://manufact.com/mcp-catalog/laki-ai) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 598 / 1483 | [Lance App Manager](https://manufact.com/mcp-catalog/lance-app-manager) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 599 / 1484 | [LanderLab](https://manufact.com/mcp-catalog/landerlab) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1485 | [Lanlan](https://manufact.com/mcp-catalog/lanlan) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1486 | [Lantern](https://manufact.com/mcp-catalog/lantern) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1487 | [LatchBio](https://manufact.com/mcp-catalog/latchbio) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 1488 | [Latchel MCP](https://manufact.com/mcp-catalog/latchel-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 600 / 1489 | [Lattice](https://manufact.com/mcp-catalog/lattice) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 601 / 1490 | [LaunchNotes](https://manufact.com/mcp-catalog/launchnotes) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1491 | [Lawgical.vn](https://manufact.com/mcp-catalog/lawgical-vn) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1492 | [lawh.ai](https://manufact.com/mcp-catalog/lawh-ai) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1493 | [Lawstronaut](https://manufact.com/mcp-catalog/lawstronaut) | — / — | legal | 0/17/1 | 9672 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (10) | required; free/paid unknown | complete |
| — / 1494 | [LawToolBox MCP](https://manufact.com/mcp-catalog/lawtoolbox-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1495 | [Lawve AI](https://manufact.com/mcp-catalog/lawve-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 602 / 1496 | [LawVu](https://manufact.com/mcp-catalog/lawvu) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1497 | [Layers](https://manufact.com/mcp-catalog/layers) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1498 | [Layla Eco](https://manufact.com/mcp-catalog/layla-eco) | — / — | travel | — | — | — | required; free/paid unknown | credentials_required |
| — / 1499 | [Lead Recorder](https://manufact.com/mcp-catalog/lead-recorder) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 603 / 1500 | [Leadfeeder](https://manufact.com/mcp-catalog/leadfeeder) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 604 / 1501 | [LeadIQ MCP](https://manufact.com/mcp-catalog/leadiq-mcp) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 605 / 1502 | [Leadrat Real Estate CRM](https://manufact.com/mcp-catalog/leadrat-real-estate-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 606 / 1503 | [Leadsquared](https://manufact.com/mcp-catalog/leadsquared) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1504 | [Leagle - Turkish Law](https://manufact.com/mcp-catalog/leagle-turkish-law) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1505 | [LeapMemory](https://manufact.com/mcp-catalog/leapmemory) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1506 | [Learning Commons](https://manufact.com/mcp-catalog/learning-commons) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 1507 | [LedgerHQ](https://manufact.com/mcp-catalog/ledgerhq) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1508 | [LedgerMCP](https://manufact.com/mcp-catalog/ledgermcp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1509 | [LedgerPro](https://manufact.com/mcp-catalog/ledgerpro) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 607 / 1510 | [Leexi](https://manufact.com/mcp-catalog/leexi) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1511 | [Legal Brain Agent](https://manufact.com/mcp-catalog/legal-brain-agent) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1512 | [Legal Data Hunter](https://manufact.com/mcp-catalog/legal-data-hunter) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1513 | [LegalInk AI — Inka](https://manufact.com/mcp-catalog/legalink-ai-inka) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| 608 / 1514 | [LegalZoom](https://manufact.com/mcp-catalog/legalzoom) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 609 / 1515 | [lemlist](https://manufact.com/mcp-catalog/lemlist) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1516 | [Lenz](https://manufact.com/mcp-catalog/lenz) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1517 | [LetMeShip Next](https://manufact.com/mcp-catalog/letmeship-next) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1518 | [LetsBot](https://manufact.com/mcp-catalog/letsbot) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1519 | [Lev for Claude](https://manufact.com/mcp-catalog/lev-for-claude) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1520 | [Levitate](https://manufact.com/mcp-catalog/levitate) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1521 | [Librari](https://manufact.com/mcp-catalog/librari) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1522 | [LibreJustice](https://manufact.com/mcp-catalog/librejustice) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 610 / 1523 | [Light](https://manufact.com/mcp-catalog/light) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1524 | [Lightbringer](https://manufact.com/mcp-catalog/lightbringer) | — / — | legal | 5/42/4 | 14309 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (26) | required; free/paid unknown | complete |
| 611 / 1525 | [Lightfield](https://manufact.com/mcp-catalog/lightfield) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 612 / 1526 | [Lightrun](https://manufact.com/mcp-catalog/lightrun) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 613 / 1527 | [Lili](https://manufact.com/mcp-catalog/lili) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 614 / 1528 | [LILT](https://manufact.com/mcp-catalog/lilt) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1529 | [LilysAI](https://manufact.com/mcp-catalog/lilysai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 615 / 1530 | [LimaCharlie](https://manufact.com/mcp-catalog/limacharlie) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 616 / 1531 | [Limrun](https://manufact.com/mcp-catalog/limrun) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1532 | [Linkly](https://manufact.com/mcp-catalog/linkly) | — / — | sales-and-marketing | 3/29/0 | 5131 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (14) | required; free/paid unknown | complete |
| — / 1533 | [Links Connect](https://manufact.com/mcp-catalog/links-connect) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1534 | [Linnx](https://manufact.com/mcp-catalog/linnx) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1535 | [Listen Labs](https://manufact.com/mcp-catalog/listen-labs) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 617 / 1536 | [Listings API](https://manufact.com/mcp-catalog/listings-api) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 618 / 1537 | [livescoremcp.com](https://manufact.com/mcp-catalog/livescoremcp-com) | — / — |  | 0/24/0 | 5835 | potentially_expensive_default, broad_response_candidate, overlapping_read_tools (9) | none for metadata | complete |
| 619 / 1538 | [Livestorm](https://manufact.com/mcp-catalog/livestorm) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1539 | [LixRay](https://manufact.com/mcp-catalog/lixray) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1540 | [lizo.ai](https://manufact.com/mcp-catalog/lizo-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 620 / 1541 | [LlamaParse](https://manufact.com/mcp-catalog/llamaparse) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1542 | [llmgateway.io](https://manufact.com/mcp-catalog/llmgateway-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1543 | [LMGram](https://manufact.com/mcp-catalog/lmgram) | — / — | communication | 5/22/0 | 1467 | response_control_size_unclear (2) | required; free/paid unknown | complete |
| 621 / 1544 | [Lnk.Bio](https://manufact.com/mcp-catalog/lnk-bio) | — / — | marketing-seo | 0/39/0 | 7086 | broad_response_candidate, overlapping_read_tools (12) | required; free/paid unknown | complete |
| — / 1545 | [Loam Data](https://manufact.com/mcp-catalog/loam-data) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 622 / 1546 | [Local Falcon](https://manufact.com/mcp-catalog/local-falcon) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1547 | [LocalBeat](https://manufact.com/mcp-catalog/localbeat) | — / — | productivity | 0/0/1 | 2808 | broad_response_candidate (1) | none for metadata | complete |
| 623 / 1548 | [LogRocket](https://manufact.com/mcp-catalog/logrocket) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 624 / 1549 | [Longbridge](https://manufact.com/mcp-catalog/longbridge) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 625 / 1550 | [Loop Returns](https://manufact.com/mcp-catalog/loop-returns) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 626 / 1551 | [Loops](https://manufact.com/mcp-catalog/loops) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1552 | [Loopthink](https://manufact.com/mcp-catalog/loopthink) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 627 / 1553 | [Lorikeet](https://manufact.com/mcp-catalog/lorikeet) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 628 / 1554 | [LottieFiles MCP](https://manufact.com/mcp-catalog/lottiefiles-mcp) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 629 / 1555 | [Lovable](https://manufact.com/mcp-catalog/lovable) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 630 / 1556 | [LoyaltyLion](https://manufact.com/mcp-catalog/loyaltylion) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 631 / 1557 | [LSEG](https://manufact.com/mcp-catalog/lseg) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 632 / 1558 | [Lucid](https://manufact.com/mcp-catalog/lucid) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1559 | [Lucidity](https://manufact.com/mcp-catalog/lucidity) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1560 | [Lueira](https://manufact.com/mcp-catalog/lueira) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1561 | [Luma](https://manufact.com/mcp-catalog/luma) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 1562 | [Lumiere](https://manufact.com/mcp-catalog/lumiere) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| 633 / 1563 | [Lumin](https://manufact.com/mcp-catalog/lumin) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1564 | [Lumini](https://manufact.com/mcp-catalog/lumini) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 634 / 1565 | [Lumonic](https://manufact.com/mcp-catalog/lumonic) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 635 / 1566 | [LunarCrush](https://manufact.com/mcp-catalog/lunarcrush) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1567 | [Lune](https://manufact.com/mcp-catalog/lune) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 636 / 1568 | [Lusha](https://manufact.com/mcp-catalog/lusha) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1569 | [Lyssna](https://manufact.com/mcp-catalog/lyssna) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1570 | [LZ Virtual Mail](https://manufact.com/mcp-catalog/lz-virtual-mail) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 637 / 1571 | [Macaly Cloud](https://manufact.com/mcp-catalog/macaly-cloud) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1572 | [MachineTranslation.com](https://manufact.com/mcp-catalog/machinetranslation-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1573 | [Macro](https://manufact.com/mcp-catalog/macro) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1574 | [Made In Show](https://manufact.com/mcp-catalog/made-in-show) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 638 / 1575 | [Madgicx Facebook MCP](https://manufact.com/mcp-catalog/madgicx-facebook-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1576 | [magicplan](https://manufact.com/mcp-catalog/magicplan) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1577 | [MagicSchool AI](https://manufact.com/mcp-catalog/magicschool-ai) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 639 / 1578 | [Magicweave](https://manufact.com/mcp-catalog/magicweave) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1579 | [magnews](https://manufact.com/mcp-catalog/magnews) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1580 | [MAI Second Brain](https://manufact.com/mcp-catalog/mai-second-brain) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1581 | [MaidPad](https://manufact.com/mcp-catalog/maidpad) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1582 | [Mailercloud](https://manufact.com/mcp-catalog/mailercloud) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 640 / 1583 | [MailerLite](https://manufact.com/mcp-catalog/mailerlite) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 641 / 1584 | [MailerSend](https://manufact.com/mcp-catalog/mailersend) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 642 / 1585 | [mailnix](https://manufact.com/mcp-catalog/mailnix) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1586 | [Mailopoly Inbox](https://manufact.com/mcp-catalog/mailopoly-inbox) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1587 | [mailows](https://manufact.com/mcp-catalog/mailows) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1588 | [Mailrith](https://manufact.com/mcp-catalog/mailrith) | — / — | sales-and-marketing | 0/35/0 | 49412 | broad_response_candidate, response_control_size_unclear (18) | required; free/paid unknown | complete |
| — / 1589 | [Mailsoftly](https://manufact.com/mcp-catalog/mailsoftly) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1590 | [Majir](https://manufact.com/mcp-catalog/majir) | — / — | commerce-shopping | 10/18/0 | 8703 | response_control_size_unclear, overlapping_read_tools (12) | required; free/paid unknown | complete |
| — / 1591 | [Mallary](https://manufact.com/mcp-catalog/mallary) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 643 / 1592 | [Manatal](https://manufact.com/mcp-catalog/manatal) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1593 | [MANDA](https://manufact.com/mcp-catalog/manda) | — / — | business-productivity | 0/4/0 | 1235 |  (0) | none for metadata | complete |
| 644 / 1594 | [Manifestly](https://manufact.com/mcp-catalog/manifestly) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 1595 | [Mantle Portal](https://manufact.com/mcp-catalog/mantle-portal) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1596 | [Marcora: Brand Context & Writing](https://manufact.com/mcp-catalog/marcora-brand-context-writing) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1597 | [Margins](https://manufact.com/mcp-catalog/margins) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 645 / 1598 | [Marq](https://manufact.com/mcp-catalog/marq) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1599 | [Maryland Community Compass](https://manufact.com/mcp-catalog/maryland-community-compass) | — / — | productivity | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| 646 / 1600 | [Massive](https://manufact.com/mcp-catalog/massive) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1601 | [Matchory](https://manufact.com/mcp-catalog/matchory) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 647 / 1602 | [Mathify](https://manufact.com/mcp-catalog/mathify) | — / — | developer-tools | 0/2/1 | 1088 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 648 / 1603 | [Matia MCP](https://manufact.com/mcp-catalog/matia-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 649 / 1604 | [Matrixify](https://manufact.com/mcp-catalog/matrixify) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 650 / 1605 | [Maven Bio](https://manufact.com/mcp-catalog/maven-bio) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 651 / 1606 | [Maze](https://manufact.com/mcp-catalog/maze) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1607 | [McAfee](https://manufact.com/mcp-catalog/mcafee) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 652 / 1608 | [mcp.adalysis.com](https://manufact.com/mcp-catalog/mcp-adalysis-com) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1609 | [mcp.adeci.pt](https://manufact.com/mcp-catalog/mcp-adeci-pt) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1610 | [mcp.agentweb.us](https://manufact.com/mcp-catalog/mcp-agentweb-us) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1611 | [mcp.airsidelabs.com](https://manufact.com/mcp-catalog/mcp-airsidelabs-com) | — / — | productivity | 25/118/28 | 27337 | response_control_size_unclear, broad_response_candidate (12) | required; free/paid unknown | complete |
| — / 1612 | [mcp.alphractal.com](https://manufact.com/mcp-catalog/mcp-alphractal-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 653 / 1613 | [mcp.app-us1.com](https://manufact.com/mcp-catalog/mcp-app-us1-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1614 | [mcp.basitkargo.com](https://manufact.com/mcp-catalog/mcp-basitkargo-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 654 / 1615 | [mcp.datadoghq.com](https://manufact.com/mcp-catalog/mcp-datadoghq-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1616 | [mcp.facebook.com](https://manufact.com/mcp-catalog/mcp-facebook-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1617 | [mcp.facebook.com](https://manufact.com/mcp-catalog/mcp-facebook-com-2) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 1618 | [mcp.facebook.com](https://manufact.com/mcp-catalog/mcp-facebook-com-3) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1619 | [mcp.feedspace.io](https://manufact.com/mcp-catalog/mcp-feedspace-io) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1620 | [mcp.fuseai.com](https://manufact.com/mcp-catalog/mcp-fuseai-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1621 | [mcp.getaltera.com](https://manufact.com/mcp-catalog/mcp-getaltera-com) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1622 | [mcp.gocodes.com](https://manufact.com/mcp-catalog/mcp-gocodes-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1623 | [mcp.hologrow.ai](https://manufact.com/mcp-catalog/mcp-hologrow-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1624 | [mcp.hubspot.com](https://manufact.com/mcp-catalog/mcp-hubspot-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1625 | [mcp.lineareads.com](https://manufact.com/mcp-catalog/mcp-lineareads-com) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 1626 | [mcp.natural.com](https://manufact.com/mcp-catalog/mcp-natural-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1627 | [mcp.natural.com](https://manufact.com/mcp-catalog/mcp-natural-com-2) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1628 | [mcp.nerve.mattemena.com](https://manufact.com/mcp-catalog/mcp-nerve-mattemena-com) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 655 / 1629 | [mcp.operata.io](https://manufact.com/mcp-catalog/mcp-operata-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1630 | [mcp.opus.pro](https://manufact.com/mcp-catalog/mcp-opus-pro) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1631 | [mcp.promptingco.com](https://manufact.com/mcp-catalog/mcp-promptingco-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 656 / 1632 | [mcp.quiet.ninja](https://manufact.com/mcp-catalog/mcp-quiet-ninja) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1633 | [mcp.rankspot.ai](https://manufact.com/mcp-catalog/mcp-rankspot-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 657 / 1634 | [mcp.reduck.ai](https://manufact.com/mcp-catalog/mcp-reduck-ai) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 658 / 1635 | [mcp.riveterhq.com](https://manufact.com/mcp-catalog/mcp-riveterhq-com) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 659 / 1636 | [mcp.rudderstack.com](https://manufact.com/mcp-catalog/mcp-rudderstack-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1637 | [mcp.savee.com](https://manufact.com/mcp-catalog/mcp-savee-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1638 | [mcp.scanpower.com](https://manufact.com/mcp-catalog/mcp-scanpower-com) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1639 | [mcp.sendseven.com](https://manufact.com/mcp-catalog/mcp-sendseven-com) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 660 / 1640 | [mcp.storage.dev](https://manufact.com/mcp-catalog/mcp-storage-dev) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1641 | [mcp.streamloop.app](https://manufact.com/mcp-catalog/mcp-streamloop-app) | — / — |  | — | — | — | unknown | connection_or_protocol_failure |
| — / 1642 | [mcp.supermemory.ai](https://manufact.com/mcp-catalog/mcp-supermemory-ai) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1643 | [mcp.tavus.io](https://manufact.com/mcp-catalog/mcp-tavus-io) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1644 | [mcp.usewheelhouse.com](https://manufact.com/mcp-catalog/mcp-usewheelhouse-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 661 / 1645 | [mcp.webdock.io](https://manufact.com/mcp-catalog/mcp-webdock-io) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1646 | [mcp.xfa.tech](https://manufact.com/mcp-catalog/mcp-xfa-tech) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1647 | [mcp.zernio.com](https://manufact.com/mcp-catalog/mcp-zernio-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| 662 / 1648 | [mcp.zuperpro.com](https://manufact.com/mcp-catalog/mcp-zuperpro-com) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1649 | [mcpMyAdmin](https://manufact.com/mcp-catalog/mcpmyadmin) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 663 / 1650 | [Measure Studio](https://manufact.com/mcp-catalog/measure-studio) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1651 | [Medialister](https://manufact.com/mcp-catalog/medialister) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1652 | [Medidata](https://manufact.com/mcp-catalog/medidata) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 664 / 1653 | [MeetGeek Cloud](https://manufact.com/mcp-catalog/meetgeek-cloud) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1654 | [Meeting Ink](https://manufact.com/mcp-catalog/meeting-ink) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 665 / 1655 | [MeisterTask](https://manufact.com/mcp-catalog/meistertask) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1656 | [Mekago](https://manufact.com/mcp-catalog/mekago) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1657 | [Meko](https://manufact.com/mcp-catalog/meko) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 666 / 1658 | [melibo](https://manufact.com/mcp-catalog/melibo) | — / — | customer-support | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 1659 | [Melon](https://manufact.com/mcp-catalog/melon) | — / — | productivity | 0/3/2 | 12032 | potentially_expensive_default, broad_response_candidate, overlapping_read_tools (45) | required; free/paid unknown | complete |
| 667 / 1660 | [Meltwater](https://manufact.com/mcp-catalog/meltwater) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 668 / 1661 | [Mem](https://manufact.com/mcp-catalog/mem) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 669 / 1662 | [Mem0](https://manufact.com/mcp-catalog/mem0) | — / — | developer-tools | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 1663 | [Memco Personal Memory](https://manufact.com/mcp-catalog/memco-personal-memory) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 670 / 1664 | [Memco Shared Memory](https://manufact.com/mcp-catalog/memco-shared-memory) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1665 | [Memoket](https://manufact.com/mcp-catalog/memoket) | — / — | productivity | 1/12/0 | 2242 | response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (7) | required; free/paid unknown | complete |
| — / 1666 | [Memories.ai](https://manufact.com/mcp-catalog/memories-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1667 | [MemoryPlugin](https://manufact.com/mcp-catalog/memoryplugin) | — / — | productivity | 0/16/1 | 4479 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (15) | required; free/paid unknown | complete |
| 671 / 1668 | [Mention Me](https://manufact.com/mcp-catalog/mention-me) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 672 / 1669 | [Mentionlytics](https://manufact.com/mcp-catalog/mentionlytics) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 673 / 1670 | [MercadoLibre](https://manufact.com/mcp-catalog/mercadolibre) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 1671 | [MerchantSpring](https://manufact.com/mcp-catalog/merchantspring) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 674 / 1672 | [Mercury](https://manufact.com/mcp-catalog/mercury) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1673 | [Mergr](https://manufact.com/mcp-catalog/mergr) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1674 | [Meridian AI](https://manufact.com/mcp-catalog/meridian-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1675 | [Meridian Connector for QuickBooks](https://manufact.com/mcp-catalog/meridian-connector-for-quickbooks) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 675 / 1676 | [Mesh](https://manufact.com/mcp-catalog/mesh) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 676 / 1677 | [Metal](https://manufact.com/mcp-catalog/metal) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1678 | [Metal Fundraising](https://manufact.com/mcp-catalog/metal-fundraising) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1679 | [Metaview](https://manufact.com/mcp-catalog/metaview) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 677 / 1680 | [Meticulous](https://manufact.com/mcp-catalog/meticulous) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 678 / 1681 | [Metorik](https://manufact.com/mcp-catalog/metorik) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1682 | [MetricDuck](https://manufact.com/mcp-catalog/metricduck) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 679 / 1683 | [Metricool Social Media Management](https://manufact.com/mcp-catalog/metricool-social-media-management) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1684 | [MFIT Personal](https://manufact.com/mcp-catalog/mfit-personal) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| — / 1685 | [mfloow](https://manufact.com/mcp-catalog/mfloow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 680 / 1686 | [Microsoft 365](https://manufact.com/mcp-catalog/microsoft-365) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 681 / 1687 | [Midpage Legal Research](https://manufact.com/mcp-catalog/midpage-legal-research) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1688 | [Milan Metro Status](https://manufact.com/mcp-catalog/milan-metro-status) | — / — | travel | 0/2/0 | 451 |  (0) | none for metadata | complete |
| — / 1689 | [Mind One](https://manufact.com/mcp-catalog/mind-one) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1690 | [MindMap](https://manufact.com/mcp-catalog/mindmap) | — / — | business-productivity | 0/1/0 | 885 |  (0) | none for metadata | complete |
| — / 1691 | [MindMap AI](https://manufact.com/mcp-catalog/mindmap-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1692 | [Mindy](https://manufact.com/mcp-catalog/mindy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1693 | [Minhas Economias](https://manufact.com/mcp-catalog/minhas-economias) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1694 | [miniOrange MCP for Magento](https://manufact.com/mcp-catalog/miniorange-mcp-for-magento) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1695 | [miniOrange MCP for WordPress](https://manufact.com/mcp-catalog/miniorange-mcp-for-wordpress) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 682 / 1696 | [Minter.io](https://manufact.com/mcp-catalog/minter-io) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 683 / 1697 | [Mintlify](https://manufact.com/mcp-catalog/mintlify) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1698 | [MiranteSEO](https://manufact.com/mcp-catalog/miranteseo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1699 | [Miss U More](https://manufact.com/mcp-catalog/miss-u-more) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 684 / 1700 | [Missive](https://manufact.com/mcp-catalog/missive) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1701 | [Mitosis Labs](https://manufact.com/mcp-catalog/mitosis-labs) | — / — | communication | 0/26/1 | 5895 | broad_response_candidate (2) | required; free/paid unknown | complete |
| 685 / 1702 | [mittwald](https://manufact.com/mcp-catalog/mittwald) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 686 / 1703 | [Mixpanel](https://manufact.com/mcp-catalog/mixpanel) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1704 | [MMM Labs](https://manufact.com/mcp-catalog/mmm-labs) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 687 / 1705 | [Mobbin](https://manufact.com/mcp-catalog/mobbin) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1706 | [MobiCRM](https://manufact.com/mcp-catalog/mobicrm) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 688 / 1707 | [Mobile Text Alerts](https://manufact.com/mcp-catalog/mobile-text-alerts) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 689 / 1708 | [Modjo](https://manufact.com/mcp-catalog/modjo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1709 | [Mojo — Pocket Capture](https://manufact.com/mcp-catalog/mojo-pocket-capture) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1710 | [Moloni ON](https://manufact.com/mcp-catalog/moloni-on) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1711 | [Momently](https://manufact.com/mcp-catalog/momently) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 690 / 1712 | [MongoDB Atlas](https://manufact.com/mcp-catalog/mongodb-atlas) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1713 | [Monk](https://manufact.com/mcp-catalog/monk) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1714 | [Montage](https://manufact.com/mcp-catalog/montage) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| 691 / 1715 | [Monte Carlo](https://manufact.com/mcp-catalog/monte-carlo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 692 / 1716 | [Montra](https://manufact.com/mcp-catalog/montra) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 693 / 1717 | [Moody's Credit MCP](https://manufact.com/mcp-catalog/moody-s-credit-mcp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 694 / 1718 | [Moody's Growth & Strategy](https://manufact.com/mcp-catalog/moody-s-growth-strategy) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1719 | [More Good Reviews](https://manufact.com/mcp-catalog/more-good-reviews) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 695 / 1720 | [Morningstar](https://manufact.com/mcp-catalog/morningstar) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 696 / 1721 | [Morningstar Credit Analytics](https://manufact.com/mcp-catalog/morningstar-credit-analytics) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1722 | [Mosaic Research Management MCP](https://manufact.com/mcp-catalog/mosaic-research-management-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1723 | [Motion Creative Analytics](https://manufact.com/mcp-catalog/motion-creative-analytics) | — / — | data | — | — | — | required; free/paid unknown | credentials_required |
| — / 1724 | [Motion4Rent](https://manufact.com/mcp-catalog/motion4rent) | — / — | travel | — | — | — | required; free/paid unknown | credentials_required |
| — / 1725 | [Motive MCP](https://manufact.com/mcp-catalog/motive-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1726 | [Motivosity](https://manufact.com/mcp-catalog/motivosity) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 697 / 1727 | [Moz Data](https://manufact.com/mcp-catalog/moz-data) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 698 / 1728 | [Moz Local](https://manufact.com/mcp-catalog/moz-local) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 699 / 1729 | [MSCI Connector](https://manufact.com/mcp-catalog/msci-connector) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 700 / 1730 | [MT Newswires](https://manufact.com/mcp-catalog/mt-newswires) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 701 / 1731 | [MuleSoft](https://manufact.com/mcp-catalog/mulesoft) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 1732 | [Multiples.vc](https://manufact.com/mcp-catalog/multiples-vc) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1733 | [My Hours](https://manufact.com/mcp-catalog/my-hours) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1734 | [My Local Press](https://manufact.com/mcp-catalog/my-local-press) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 1735 | [MyChatBot](https://manufact.com/mcp-catalog/mychatbot) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1736 | [MyCoach Pro](https://manufact.com/mcp-catalog/mycoach-pro) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1737 | [MyEmailVerifier](https://manufact.com/mcp-catalog/myemailverifier) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1738 | [MyGeotab MCP](https://manufact.com/mcp-catalog/mygeotab-mcp) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1739 | [MyMovement.Space](https://manufact.com/mcp-catalog/mymovement-space) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| 702 / 1740 | [MYOB](https://manufact.com/mcp-catalog/myob) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1741 | [MyOps](https://manufact.com/mcp-catalog/myops) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 703 / 1742 | [Mystore](https://manufact.com/mcp-catalog/mystore) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1743 | [Nausika](https://manufact.com/mcp-catalog/nausika) | — / — | travel | 0/13/1 | 16584 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (11) | required; free/paid unknown | complete |
| — / 1744 | [Nectar](https://manufact.com/mcp-catalog/nectar) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1745 | [NeetoCal](https://manufact.com/mcp-catalog/neetocal) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 704 / 1746 | [NeetoDesk](https://manufact.com/mcp-catalog/neetodesk) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 1747 | [NeetoForm](https://manufact.com/mcp-catalog/neetoform) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1748 | [NeetoKB](https://manufact.com/mcp-catalog/neetokb) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1749 | [NeetoRecord](https://manufact.com/mcp-catalog/neetorecord) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 705 / 1750 | [NeoSapien](https://manufact.com/mcp-catalog/neosapien) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1751 | [Netchex - Mesh AI Teammates](https://manufact.com/mcp-catalog/netchex-mesh-ai-teammates) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1752 | [NetExplorer](https://manufact.com/mcp-catalog/netexplorer) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 706 / 1753 | [Nevo](https://manufact.com/mcp-catalog/nevo) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1754 | [New Vintage](https://manufact.com/mcp-catalog/new-vintage) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1755 | [Nexadata](https://manufact.com/mcp-catalog/nexadata) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 707 / 1756 | [Nexoya](https://manufact.com/mcp-catalog/nexoya) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1757 | [Nextatlas](https://manufact.com/mcp-catalog/nextatlas) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1758 | [Nexus](https://manufact.com/mcp-catalog/nexus) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| — / 1759 | [NiaHealth](https://manufact.com/mcp-catalog/niahealth) | — / — | consumer-health | — | — | — | required; free/paid unknown | credentials_required |
| — / 1760 | [Nifty](https://manufact.com/mcp-catalog/nifty) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1761 | [Nimble](https://manufact.com/mcp-catalog/nimble) | — / — | data | — | — | — | required; free/paid unknown | credentials_required |
| 708 / 1762 | [Nimble CRM](https://manufact.com/mcp-catalog/nimble-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1763 | [Ninjo](https://manufact.com/mcp-catalog/ninjo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1764 | [Ninout](https://manufact.com/mcp-catalog/ninout) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1765 | [Nirvana](https://manufact.com/mcp-catalog/nirvana) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1766 | [Nitrosend](https://manufact.com/mcp-catalog/nitrosend) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 709 / 1767 | [NocoDB](https://manufact.com/mcp-catalog/nocodb) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 710 / 1768 | [Noibu](https://manufact.com/mcp-catalog/noibu) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 711 / 1769 | [Nooks](https://manufact.com/mcp-catalog/nooks) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 712 / 1770 | [Noota](https://manufact.com/mcp-catalog/noota) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1771 | [nordata.io](https://manufact.com/mcp-catalog/nordata-io) | — / — | data-analytics | 0/5/1 | 4203 | broad_response_candidate, overlapping_read_tools (4) | required; free/paid unknown | complete |
| 713 / 1772 | [Norma by Quality Clouds](https://manufact.com/mcp-catalog/norma-by-quality-clouds) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1773 | [Normal Framework](https://manufact.com/mcp-catalog/normal-framework) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1774 | [Norman Finance](https://manufact.com/mcp-catalog/norman-finance) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1775 | [Norrsent - Agentic Risk Management & GRC](https://manufact.com/mcp-catalog/norrsent-agentic-risk-management-grc) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1776 | [North Noir](https://manufact.com/mcp-catalog/north-noir) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 1777 | [Norton](https://manufact.com/mcp-catalog/norton) | — / — | business-productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1778 | [Notehub](https://manufact.com/mcp-catalog/notehub) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1779 | [Notfair](https://manufact.com/mcp-catalog/notfair) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1780 | [Novasol](https://manufact.com/mcp-catalog/novasol) | — / — | travel | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 1781 | [Nproc](https://manufact.com/mcp-catalog/nproc) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1782 | [NUEIP](https://manufact.com/mcp-catalog/nueip) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 714 / 1783 | [Numeric](https://manufact.com/mcp-catalog/numeric) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1784 | [NuMetric](https://manufact.com/mcp-catalog/numetric) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 715 / 1785 | [Nutshell CRM](https://manufact.com/mcp-catalog/nutshell-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 716 / 1786 | [Nuvemshop](https://manufact.com/mcp-catalog/nuvemshop) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1787 | [NyquistAI MedTech](https://manufact.com/mcp-catalog/nyquistai-medtech) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 717 / 1788 | [O’Reilly](https://manufact.com/mcp-catalog/o-reilly) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1789 | [OasisLMS Nexus](https://manufact.com/mcp-catalog/oasislms-nexus) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1790 | [Ocean](https://manufact.com/mcp-catalog/ocean) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1791 | [Octen](https://manufact.com/mcp-catalog/octen) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1792 | [Octolane](https://manufact.com/mcp-catalog/octolane-2) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 718 / 1793 | [OctoPerf MCP](https://manufact.com/mcp-catalog/octoperf-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1794 | [Octopus.do](https://manufact.com/mcp-catalog/octopus-do) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 719 / 1795 | [Octus](https://manufact.com/mcp-catalog/octus) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1796 | [Offri](https://manufact.com/mcp-catalog/offri) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1797 | [Ofia: PDF & Document Creator](https://manufact.com/mcp-catalog/ofia-pdf-document-creator) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 720 / 1798 | [ohdear.app](https://manufact.com/mcp-catalog/ohdear-app) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1799 | [Ollang](https://manufact.com/mcp-catalog/ollang) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| 721 / 1800 | [Omneky](https://manufact.com/mcp-catalog/omneky) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 722 / 1801 | [Omni Analytics](https://manufact.com/mcp-catalog/omni-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1802 | [Omni by xpander](https://manufact.com/mcp-catalog/omni-by-xpander) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 723 / 1803 | [Omnisend MCP](https://manufact.com/mcp-catalog/omnisend-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1804 | [Omnivio Lens](https://manufact.com/mcp-catalog/omnivio-lens) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 724 / 1805 | [OnceHub](https://manufact.com/mcp-catalog/oncehub) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1806 | [OneLens](https://manufact.com/mcp-catalog/onelens) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1807 | [Onepage](https://manufact.com/mcp-catalog/onepage) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 725 / 1808 | [OnePageCRM](https://manufact.com/mcp-catalog/onepagecrm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1809 | [ONES](https://manufact.com/mcp-catalog/ones) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 726 / 1810 | [OneSignal](https://manufact.com/mcp-catalog/onesignal) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1811 | [Oneteam](https://manufact.com/mcp-catalog/oneteam) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1812 | [OnMessage](https://manufact.com/mcp-catalog/onmessage) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1813 | [Onplana](https://manufact.com/mcp-catalog/onplana) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1814 | [Onsite](https://manufact.com/mcp-catalog/onsite) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1815 | [onX Offroad](https://manufact.com/mcp-catalog/onx-offroad) | — / — |  | 0/1/0 | 3975 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (5) | none for metadata | complete |
| — / 1816 | [Open Context](https://manufact.com/mcp-catalog/open-context) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1817 | [Opendate](https://manufact.com/mcp-catalog/opendate) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 727 / 1818 | [OpenFunnel Agent Primitives](https://manufact.com/mcp-catalog/openfunnel-agent-primitives) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1819 | [OpenRush](https://manufact.com/mcp-catalog/openrush) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1820 | [OpenSEO](https://manufact.com/mcp-catalog/openseo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1821 | [Opinly](https://manufact.com/mcp-catalog/opinly) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 728 / 1822 | [OpsLevel](https://manufact.com/mcp-catalog/opslevel) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1823 | [Optilogic](https://manufact.com/mcp-catalog/optilogic) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 729 / 1824 | [Optimove](https://manufact.com/mcp-catalog/optimove) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 730 / 1825 | [Optmyzr MCP](https://manufact.com/mcp-catalog/optmyzr-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 731 / 1826 | [OpusClip](https://manufact.com/mcp-catalog/opusclip) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1827 | [Orb](https://manufact.com/mcp-catalog/orb) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1828 | [Orbismo](https://manufact.com/mcp-catalog/orbismo) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1829 | [Orca Scan](https://manufact.com/mcp-catalog/orca-scan) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 732 / 1830 | [Orca Security](https://manufact.com/mcp-catalog/orca-security) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1831 | [origami.publica.la](https://manufact.com/mcp-catalog/origami-publica-la) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1832 | [Origin](https://manufact.com/mcp-catalog/origin) | — / — | data | — | — | — | required; free/paid unknown | credentials_required |
| 733 / 1833 | [Orion](https://manufact.com/mcp-catalog/orion) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1834 | [Orion by Gravity](https://manufact.com/mcp-catalog/orion-by-gravity) | — / — | data | — | — | — | required; free/paid unknown | credentials_required |
| — / 1835 | [Ornn Data](https://manufact.com/mcp-catalog/ornn-data) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1836 | [Orphex](https://manufact.com/mcp-catalog/orphex) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1837 | [Osiro](https://manufact.com/mcp-catalog/osiro) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1838 | [Osmosis Analyst](https://manufact.com/mcp-catalog/osmosis-analyst) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1839 | [OSuite](https://manufact.com/mcp-catalog/osuite) | — / — | business-productivity | 12/25/0 | 1132 | response_control_size_unclear (1) | required; free/paid unknown | complete |
| — / 1840 | [Otnox](https://manufact.com/mcp-catalog/otnox) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 734 / 1841 | [Otter.ai](https://manufact.com/mcp-catalog/otter-ai) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1842 | [Otto Travel](https://manufact.com/mcp-catalog/otto-travel) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 735 / 1843 | [OutlierKit](https://manufact.com/mcp-catalog/outlierkit) | — / — | marketing-seo | 2/20/0 | 2844 | potentially_expensive_default (1) | required; free/paid unknown | complete |
| 736 / 1844 | [Outreach](https://manufact.com/mcp-catalog/outreach) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1845 | [Outset](https://manufact.com/mcp-catalog/outset) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1846 | [Outtake](https://manufact.com/mcp-catalog/outtake) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 1847 | [ovilloMCP](https://manufact.com/mcp-catalog/ovillomcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1848 | [Oviond](https://manufact.com/mcp-catalog/oviond) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1849 | [Owkin](https://manufact.com/mcp-catalog/owkin) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 1850 | [Owll](https://manufact.com/mcp-catalog/owll) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 737 / 1851 | [OWOX Data Marts](https://manufact.com/mcp-catalog/owox-data-marts) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 738 / 1852 | [Oxford Economics](https://manufact.com/mcp-catalog/oxford-economics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1853 | [Pace AI](https://manufact.com/mcp-catalog/pace-ai) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1854 | [Paddock Finance](https://manufact.com/mcp-catalog/paddock-finance) | — / — | data-analytics | 0/23/1 | 6651 | broad_response_candidate, overlapping_read_tools (4) | none for metadata | complete |
| 739 / 1855 | [Padlet](https://manufact.com/mcp-catalog/padlet) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 1856 | [PageFly](https://manufact.com/mcp-catalog/pagefly) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1857 | [pagent.ai](https://manufact.com/mcp-catalog/pagent-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 740 / 1858 | [PagerDuty](https://manufact.com/mcp-catalog/pagerduty) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 741 / 1859 | [Pagos](https://manufact.com/mcp-catalog/pagos) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1860 | [PaidSync.ai](https://manufact.com/mcp-catalog/paidsync-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 742 / 1861 | [Pallyy](https://manufact.com/mcp-catalog/pallyy) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1862 | [Pantry Persona](https://manufact.com/mcp-catalog/pantry-persona) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 743 / 1863 | [Pappers France](https://manufact.com/mcp-catalog/pappers-france) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1864 | [Parallel](https://manufact.com/mcp-catalog/parallel) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1865 | [Parameter](https://manufact.com/mcp-catalog/parameter) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1866 | [parcelparcel](https://manufact.com/mcp-catalog/parcelparcel) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1867 | [Parker](https://manufact.com/mcp-catalog/parker) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1868 | [Parliament Connect](https://manufact.com/mcp-catalog/parliament-connect) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 744 / 1869 | [Parse.ly](https://manufact.com/mcp-catalog/parse-ly) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1870 | [Partner.io](https://manufact.com/mcp-catalog/partner-io) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1871 | [PartnerOS](https://manufact.com/mcp-catalog/partneros) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1872 | [Partnership Leaders Research](https://manufact.com/mcp-catalog/partnership-leaders-research) | — / — | productivity | 0/16/0 | 1791 | overlapping_read_tools (1) | required; free/paid unknown | complete |
| 745 / 1873 | [PartnerTap](https://manufact.com/mcp-catalog/partnertap) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 746 / 1874 | [Patlytics](https://manufact.com/mcp-catalog/patlytics) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 747 / 1875 | [Patsnap Patent & Literature Search (OAuth)](https://manufact.com/mcp-catalog/patsnap-patent-literature-search-oauth) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1876 | [Pattern Intelligence](https://manufact.com/mcp-catalog/pattern-intelligence) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 748 / 1877 | [Paxton Legal Research](https://manufact.com/mcp-catalog/paxton-legal-research) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 1878 | [PayHero](https://manufact.com/mcp-catalog/payhero) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 749 / 1879 | [PayPal](https://manufact.com/mcp-catalog/paypal) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 750 / 1880 | [Paytm Payment Gateway](https://manufact.com/mcp-catalog/paytm-payment-gateway) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1881 | [pcba.axal.ai](https://manufact.com/mcp-catalog/pcba-axal-ai) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1882 | [PDF Viewer](https://manufact.com/mcp-catalog/pdf-viewer) | — / — | productivity | 0/3/0 | 1053 | overlapping_read_tools (1) | required; free/paid unknown | complete |
| — / 1883 | [PDF.net](https://manufact.com/mcp-catalog/pdf-net) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1884 | [PDF4me](https://manufact.com/mcp-catalog/pdf4me) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1885 | [PDQ Connect](https://manufact.com/mcp-catalog/pdq-connect) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1886 | [PEAK Account](https://manufact.com/mcp-catalog/peak-account) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 751 / 1887 | [Peaka](https://manufact.com/mcp-catalog/peaka) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1888 | [Pearl](https://manufact.com/mcp-catalog/pearl) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 752 / 1889 | [Pearler](https://manufact.com/mcp-catalog/pearler) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 753 / 1890 | [Peec AI](https://manufact.com/mcp-catalog/peec-ai) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1891 | [Peepz](https://manufact.com/mcp-catalog/peepz) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 1892 | [Peerbound](https://manufact.com/mcp-catalog/peerbound) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1893 | [Peerdom](https://manufact.com/mcp-catalog/peerdom) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 754 / 1894 | [Pega Blueprint](https://manufact.com/mcp-catalog/pega-blueprint) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 755 / 1895 | [Pemo](https://manufact.com/mcp-catalog/pemo) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1896 | [Pensieve](https://manufact.com/mcp-catalog/pensieve) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1897 | [Pepita](https://manufact.com/mcp-catalog/pepita) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1898 | [Pepper Cloud](https://manufact.com/mcp-catalog/pepper-cloud) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1899 | [Perceptis](https://manufact.com/mcp-catalog/perceptis) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 756 / 1900 | [Perdoo](https://manufact.com/mcp-catalog/perdoo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 757 / 1901 | [Perfect Wiki](https://manufact.com/mcp-catalog/perfect-wiki) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1902 | [Perk](https://manufact.com/mcp-catalog/perk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1903 | [Personyze](https://manufact.com/mcp-catalog/personyze) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1904 | [Perspective AI](https://manufact.com/mcp-catalog/perspective-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1905 | [Perspective: Funnel & Landing Page Builder](https://manufact.com/mcp-catalog/perspective-funnel-landing-page-builder) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1906 | [Pheedback](https://manufact.com/mcp-catalog/pheedback) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 758 / 1907 | [Phished](https://manufact.com/mcp-catalog/phished) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 759 / 1908 | [Phoenix by HG Insights](https://manufact.com/mcp-catalog/phoenix-by-hg-insights) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1909 | [PhotonCommerce](https://manufact.com/mcp-catalog/photoncommerce) | — / — | data-analytics | 0/14/0 | 2153 | broad_response_candidate (2) | required; free/paid unknown | complete |
| 760 / 1910 | [Phrase](https://manufact.com/mcp-catalog/phrase) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 761 / 1911 | [Pi by Placer.ai](https://manufact.com/mcp-catalog/pi-by-placer-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 762 / 1912 | [Pi Dash](https://manufact.com/mcp-catalog/pi-dash) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 763 / 1913 | [Pi Security](https://manufact.com/mcp-catalog/pi-security) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 764 / 1914 | [PicPay](https://manufact.com/mcp-catalog/picpay) | — / — | financial-services | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 1915 | [Pierview](https://manufact.com/mcp-catalog/pierview) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1916 | [Pillar](https://manufact.com/mcp-catalog/pillar) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1917 | [Pine Labs Payments Assistant](https://manufact.com/mcp-catalog/pine-labs-payments-assistant) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 765 / 1918 | [Pinegap](https://manufact.com/mcp-catalog/pinegap) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 766 / 1919 | [Pingcore](https://manufact.com/mcp-catalog/pingcore) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 767 / 1920 | [Pipedrive](https://manufact.com/mcp-catalog/pipedrive) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 768 / 1921 | [PitchBook Premium](https://manufact.com/mcp-catalog/pitchbook-premium) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 769 / 1922 | [Plaid Developer Tools](https://manufact.com/mcp-catalog/plaid-developer-tools) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1923 | [Plainpaper](https://manufact.com/mcp-catalog/plainpaper) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1924 | [Plan@Job](https://manufact.com/mcp-catalog/plan-job) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 770 / 1925 | [Planable](https://manufact.com/mcp-catalog/planable) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 771 / 1926 | [Planday](https://manufact.com/mcp-catalog/planday) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 772 / 1927 | [Plane](https://manufact.com/mcp-catalog/plane) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 773 / 1928 | [Planning Center](https://manufact.com/mcp-catalog/planning-center) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 774 / 1929 | [Planoly](https://manufact.com/mcp-catalog/planoly) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1930 | [PlantPredict](https://manufact.com/mcp-catalog/plantpredict) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1931 | [platform.eved.com](https://manufact.com/mcp-catalog/platform-eved-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1932 | [Platoon AI](https://manufact.com/mcp-catalog/platoon-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 775 / 1933 | [Plaud](https://manufact.com/mcp-catalog/plaud) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1934 | [Play Sheet Music](https://manufact.com/mcp-catalog/play-sheet-music) | — / — | productivity | 0/1/0 | 643 |  (0) | required; free/paid unknown | complete |
| — / 1935 | [PlayMCP](https://manufact.com/mcp-catalog/playmcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 776 / 1936 | [PocketSmith Complete Access](https://manufact.com/mcp-catalog/pocketsmith-complete-access) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 777 / 1937 | [Pod](https://manufact.com/mcp-catalog/pod) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1938 | [POHODA – AI účtovný konektor od ÚčtoMost](https://manufact.com/mcp-catalog/pohoda-ai-tovn-konektor-od-tomost) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 1939 | [PointOne](https://manufact.com/mcp-catalog/pointone) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 778 / 1940 | [Polar Analytics](https://manufact.com/mcp-catalog/polar-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1941 | [Policy Doctor](https://manufact.com/mcp-catalog/policy-doctor) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 1942 | [PolicyNote](https://manufact.com/mcp-catalog/policynote) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1943 | [POMA Grill](https://manufact.com/mcp-catalog/poma-grill) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1944 | [PontaHR](https://manufact.com/mcp-catalog/pontahr) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| 779 / 1945 | [Popl](https://manufact.com/mcp-catalog/popl) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 780 / 1946 | [Porter Metrics](https://manufact.com/mcp-catalog/porter-metrics) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1947 | [post bridge - social media scheduler](https://manufact.com/mcp-catalog/post-bridge-social-media-scheduler) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1948 | [Postbeam](https://manufact.com/mcp-catalog/postbeam) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1949 | [PostCo](https://manufact.com/mcp-catalog/postco) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1950 | [PostEverywhere](https://manufact.com/mcp-catalog/posteverywhere) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 781 / 1951 | [PostGrid](https://manufact.com/mcp-catalog/postgrid) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 782 / 1952 | [Postiz](https://manufact.com/mcp-catalog/postiz) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 783 / 1953 | [PostNitro](https://manufact.com/mcp-catalog/postnitro) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 1954 | [Postproxy](https://manufact.com/mcp-catalog/postproxy) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 1955 | [PredictHQ](https://manufact.com/mcp-catalog/predicthq) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 784 / 1956 | [PredictLeads](https://manufact.com/mcp-catalog/predictleads) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 785 / 1957 | [Prediko](https://manufact.com/mcp-catalog/prediko) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 1958 | [Prefect](https://manufact.com/mcp-catalog/prefect) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1959 | [Prefix WhoIs](https://manufact.com/mcp-catalog/prefix-whois) | — / — | data-analytics | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 786 / 1960 | [Presentations.AI](https://manufact.com/mcp-catalog/presentations-ai) | — / — | design-creative | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 787 / 1961 | [Pressable MCP](https://manufact.com/mcp-catalog/pressable-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1962 | [Pressmaster.ai](https://manufact.com/mcp-catalog/pressmaster-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1963 | [Preuve AI: Startup Idea Validation](https://manufact.com/mcp-catalog/preuve-ai-startup-idea-validation) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1964 | [PreVibe](https://manufact.com/mcp-catalog/previbe) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 788 / 1965 | [PriceLabs](https://manufact.com/mcp-catalog/pricelabs) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1966 | [Pricewatcha](https://manufact.com/mcp-catalog/pricewatcha) | — / — | e-commerce | 1/18/0 | 5074 | response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (9) | required; free/paid unknown | complete |
| — / 1967 | [Primary Treasury](https://manufact.com/mcp-catalog/primary-treasury) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 789 / 1968 | [Primate Vision](https://manufact.com/mcp-catalog/primate-vision) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 1969 | [primitive](https://manufact.com/mcp-catalog/primitive) | — / — |  | 0/1/2 | 12447 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (21) | none for metadata | complete |
| 790 / 1970 | [Print.com](https://manufact.com/mcp-catalog/print-com) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 791 / 1971 | [Prisma](https://manufact.com/mcp-catalog/prisma) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 792 / 1972 | [Privacy.com](https://manufact.com/mcp-catalog/privacy-com) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 793 / 1973 | [PrivCo](https://manufact.com/mcp-catalog/privco) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 794 / 1974 | [Privy](https://manufact.com/mcp-catalog/privy) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 795 / 1975 | [Process Street](https://manufact.com/mcp-catalog/process-street) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 1976 | [Product Research](https://manufact.com/mcp-catalog/product-research) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1977 | [production.pretty-prompt.com](https://manufact.com/mcp-catalog/production-pretty-prompt-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1978 | [Productised](https://manufact.com/mcp-catalog/productised) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 796 / 1979 | [Productlane](https://manufact.com/mcp-catalog/productlane) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 1980 | [ProductNow](https://manufact.com/mcp-catalog/productnow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1981 | [Profit.co MCP](https://manufact.com/mcp-catalog/profit-co-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 797 / 1982 | [Profound](https://manufact.com/mcp-catalog/profound) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 1983 | [Prognosite](https://manufact.com/mcp-catalog/prognosite) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1984 | [Progus Subscriptions](https://manufact.com/mcp-catalog/progus-subscriptions) | — / — | productivity | — | — | — | paid | credentials_required |
| — / 1985 | [Project Desk](https://manufact.com/mcp-catalog/project-desk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1986 | [Projexion](https://manufact.com/mcp-catalog/projexion) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1987 | [Promocodes.com](https://manufact.com/mcp-catalog/promocodes-com) | — / — | e-commerce | 0/3/0 | 618 |  (0) | none for metadata | complete |
| 798 / 1988 | [PromptedSite](https://manufact.com/mcp-catalog/promptedsite) | — / — | developer-tools | 2/8/0 | 1553 | response_control_size_unclear, overlapping_read_tools (2) | required; free/paid unknown | complete |
| — / 1989 | [Promptwatch](https://manufact.com/mcp-catalog/promptwatch) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1990 | [PropertyMe](https://manufact.com/mcp-catalog/propertyme) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1991 | [Proposal App](https://manufact.com/mcp-catalog/proposal-app) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1992 | [Propush.me](https://manufact.com/mcp-catalog/propush-me) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1993 | [Proshort](https://manufact.com/mcp-catalog/proshort) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 1994 | [ProSocial](https://manufact.com/mcp-catalog/prosocial) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 1995 | [Protobi Claude MCP](https://manufact.com/mcp-catalog/protobi-claude-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 1996 | [prox](https://manufact.com/mcp-catalog/prox) | — / — | business-productivity | 0/1/0 | 1240 | broad_response_candidate (1) | required; free/paid unknown | complete |
| — / 1997 | [PubCrawl](https://manufact.com/mcp-catalog/pubcrawl) | — / — | healthcare | 0/27/0 | 4923 | potentially_expensive_default, overlapping_read_tools (4) | none for metadata | complete |
| — / 1998 | [Publive](https://manufact.com/mcp-catalog/publive) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 1999 | [Pulse MCP](https://manufact.com/mcp-catalog/pulse-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2000 | [Pulsora MCP - PreProd](https://manufact.com/mcp-catalog/pulsora-mcp-preprod) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 799 / 2001 | [Pumble](https://manufact.com/mcp-catalog/pumble) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2002 | [PuraFi Expenses](https://manufact.com/mcp-catalog/purafi-expenses) | — / — | productivity | 13/24/0 | 5980 | broad_response_candidate, response_control_size_unclear (5) | required; free/paid unknown | complete |
| 800 / 2003 | [Pylon](https://manufact.com/mcp-catalog/pylon) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 2004 | [Pyplan](https://manufact.com/mcp-catalog/pyplan) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 801 / 2005 | [QA Wolf](https://manufact.com/mcp-catalog/qa-wolf) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 802 / 2006 | [QA.tech](https://manufact.com/mcp-catalog/qa-tech) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 803 / 2007 | [Qencode](https://manufact.com/mcp-catalog/qencode) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2008 | [Qmutator](https://manufact.com/mcp-catalog/qmutator) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2009 | [Qontext](https://manufact.com/mcp-catalog/qontext) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 804 / 2010 | [Qonto](https://manufact.com/mcp-catalog/qonto) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2011 | [Qualisend](https://manufact.com/mcp-catalog/qualisend) | — / — | communication | 0/21/0 | 3096 | response_control_size_unclear (1) | required; free/paid unknown | complete |
| — / 2012 | [Qualyteam-MCP](https://manufact.com/mcp-catalog/qualyteam-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 805 / 2013 | [Quartr](https://manufact.com/mcp-catalog/quartr) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 806 / 2014 | [QuickFile Accounting Software](https://manufact.com/mcp-catalog/quickfile-accounting-software) | — / — | financial-services | 0/44/0 | 7177 | response_control_size_unclear (6) | required; free/paid unknown | complete |
| 807 / 2015 | [QuickNode](https://manufact.com/mcp-catalog/quicknode) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2016 | [Quilty](https://manufact.com/mcp-catalog/quilty) | — / — | media-entertainment | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 808 / 2017 | [Quire](https://manufact.com/mcp-catalog/quire) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 809 / 2018 | [Quiver Quant](https://manufact.com/mcp-catalog/quiver-quant) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2019 | [QuizHP](https://manufact.com/mcp-catalog/quizhp) | — / — | media | 0/2/0 | 1039 | broad_response_candidate (1) | none for metadata | complete |
| 810 / 2020 | [Quo](https://manufact.com/mcp-catalog/quo) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2021 | [Quotient](https://manufact.com/mcp-catalog/quotient) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2022 | [quran.ai](https://manufact.com/mcp-catalog/quran-ai) | — / — | education-research | 10/57/12 | 37911 | broad_response_candidate, overlapping_read_tools (10) | none for metadata | complete |
| 811 / 2023 | [Ragic](https://manufact.com/mcp-catalog/ragic) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2024 | [Rally MCP](https://manufact.com/mcp-catalog/rally-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2025 | [RAMMP](https://manufact.com/mcp-catalog/rammp) | — / — | business-productivity | 0/12/0 | 4085 | broad_response_candidate, overlapping_read_tools (18) | none for metadata | complete |
| 812 / 2026 | [Ramp](https://manufact.com/mcp-catalog/ramp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 813 / 2027 | [Rams](https://manufact.com/mcp-catalog/rams) | — / — | developer-tools | 0/0/0 | 2524 |  (0) | required; free/paid unknown | complete |
| — / 2028 | [RankAuthority](https://manufact.com/mcp-catalog/rankauthority) | — / — | productivity | 58/177/4 | 16073 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (28) | required; free/paid unknown | complete |
| — / 2029 | [RankedIn - Career Intelligence & Network Analytics](https://manufact.com/mcp-catalog/rankedin-career-intelligence-network-analytics) | — / — | data-analytics | 0/7/0 | 2152 | broad_response_candidate, overlapping_read_tools (2) | required; free/paid unknown | complete |
| — / 2030 | [RankParse](https://manufact.com/mcp-catalog/rankparse) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 814 / 2031 | [Raygun](https://manufact.com/mcp-catalog/raygun) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 815 / 2032 | [Razorpay](https://manufact.com/mcp-catalog/razorpay) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2033 | [Rdash](https://manufact.com/mcp-catalog/rdash) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2034 | [Re:port Flow](https://manufact.com/mcp-catalog/re-port-flow) | — / — | productivity | 0/4/0 | 1100 | response_control_size_unclear (1) | required; free/paid unknown | complete |
| — / 2035 | [ReachStream Email Verifier](https://manufact.com/mcp-catalog/reachstream-email-verifier) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 816 / 2036 | [ReactVision: ViroReact MCP](https://manufact.com/mcp-catalog/reactvision-viroreact-mcp) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 817 / 2037 | [Read AI](https://manufact.com/mcp-catalog/read-ai) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2038 | [Readplace](https://manufact.com/mcp-catalog/readplace) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 818 / 2039 | [Readwise](https://manufact.com/mcp-catalog/readwise) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2040 | [Real-Time LCA MCP](https://manufact.com/mcp-catalog/real-time-lca-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2041 | [RealAI](https://manufact.com/mcp-catalog/realai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2042 | [Realize MCP](https://manufact.com/mcp-catalog/realize-mcp) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2043 | [Rebbel](https://manufact.com/mcp-catalog/rebbel) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 819 / 2044 | [Rebrandly](https://manufact.com/mcp-catalog/rebrandly) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2045 | [Recall](https://manufact.com/mcp-catalog/recall) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 820 / 2046 | [Recall.ai](https://manufact.com/mcp-catalog/recall-ai) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2047 | [Receiptor AI](https://manufact.com/mcp-catalog/receiptor-ai) | — / — | productivity | 32/218/0 | — | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (42) | required; free/paid unknown | complete |
| — / 2048 | [Reckon](https://manufact.com/mcp-catalog/reckon) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 821 / 2049 | [Reclaim.ai](https://manufact.com/mcp-catalog/reclaim-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2050 | [RECOG](https://manufact.com/mcp-catalog/recog) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2051 | [Recooty](https://manufact.com/mcp-catalog/recooty) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 822 / 2052 | [Recruit CRM](https://manufact.com/mcp-catalog/recruit-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2053 | [RED Atlas API](https://manufact.com/mcp-catalog/red-atlas-api) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 823 / 2054 | [Redo](https://manufact.com/mcp-catalog/redo) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 824 / 2055 | [Redox](https://manufact.com/mcp-catalog/redox) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2056 | [RedReplier - social listening and lead finder](https://manufact.com/mcp-catalog/redreplier-social-listening-and-lead-finder) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2057 | [Reepl](https://manufact.com/mcp-catalog/reepl) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2058 | [Reevo](https://manufact.com/mcp-catalog/reevo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2059 | [Refine.ink](https://manufact.com/mcp-catalog/refine-ink) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 825 / 2060 | [Reflect](https://manufact.com/mcp-catalog/reflect) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2061 | [Reformat](https://manufact.com/mcp-catalog/reformat) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 2062 | [RelPro](https://manufact.com/mcp-catalog/relpro) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 826 / 2063 | [Remesh](https://manufact.com/mcp-catalog/remesh) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2064 | [Remote Desktop Commander](https://manufact.com/mcp-catalog/remote-desktop-commander) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 827 / 2065 | [Remote.com](https://manufact.com/mcp-catalog/remote-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 828 / 2066 | [Render](https://manufact.com/mcp-catalog/render) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 829 / 2067 | [Rendley](https://manufact.com/mcp-catalog/rendley) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 830 / 2068 | [Replit](https://manufact.com/mcp-catalog/replit) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2069 | [Replo](https://manufact.com/mcp-catalog/replo) | — / — | sales-and-marketing | 70/227/5 | 52471 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (31) | required; free/paid unknown | complete |
| 831 / 2070 | [Reprise](https://manufact.com/mcp-catalog/reprise) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2071 | [RepSpec](https://manufact.com/mcp-catalog/repspec) | — / — | business-productivity | 0/26/0 | 3718 | broad_response_candidate, overlapping_read_tools (5) | none for metadata | complete |
| — / 2072 | [Repuso](https://manufact.com/mcp-catalog/repuso) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2073 | [Resell Pro](https://manufact.com/mcp-catalog/resell-pro) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 832 / 2074 | [Resolve AI](https://manufact.com/mcp-catalog/resolve-ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2075 | [ResortPass](https://manufact.com/mcp-catalog/resortpass) | — / — | e-commerce | — | — | — | required; free/paid unknown | credentials_required |
| — / 2076 | [Respond.io](https://manufact.com/mcp-catalog/respond-io) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 833 / 2077 | [Responsive](https://manufact.com/mcp-catalog/responsive) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2078 | [Resy](https://manufact.com/mcp-catalog/resy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2079 | [Revealed](https://manufact.com/mcp-catalog/revealed) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2080 | [Revelata deepKPI](https://manufact.com/mcp-catalog/revelata-deepkpi) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 834 / 2081 | [Revelica](https://manufact.com/mcp-catalog/revelica) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2082 | [Revelio Labs Internal](https://manufact.com/mcp-catalog/revelio-labs-internal) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 835 / 2083 | [Reverse Contact](https://manufact.com/mcp-catalog/reverse-contact) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2084 | [Reviewbird](https://manufact.com/mcp-catalog/reviewbird) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2085 | [Revise](https://manufact.com/mcp-catalog/revise) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2086 | [Revscale AI](https://manufact.com/mcp-catalog/revscale-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 836 / 2087 | [Rezonant](https://manufact.com/mcp-catalog/rezonant) | — / — | developer-tools | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 837 / 2088 | [Rho](https://manufact.com/mcp-catalog/rho) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2089 | [Rhythm Systems](https://manufact.com/mcp-catalog/rhythm-systems) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2090 | [RiConnect](https://manufact.com/mcp-catalog/riconnect) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2091 | [Riddle MCP](https://manufact.com/mcp-catalog/riddle-mcp) | — / — | media-entertainment | 0/60/17 | — | response_control_size_unclear, potentially_expensive_default, broad_response_candidate (15) | required; free/paid unknown | complete |
| — / 2092 | [Riido](https://manufact.com/mcp-catalog/riido) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2093 | [Riley](https://manufact.com/mcp-catalog/riley) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 838 / 2094 | [Rill](https://manufact.com/mcp-catalog/rill) | — / — | data-analytics | 3/5/1 | 7807 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (12) | required; free/paid unknown | complete |
| 839 / 2095 | [Rillet](https://manufact.com/mcp-catalog/rillet) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 840 / 2096 | [Rimo Voice](https://manufact.com/mcp-catalog/rimo-voice) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 841 / 2097 | [RingCentral Chat](https://manufact.com/mcp-catalog/ringcentral-chat) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2098 | [Rippit](https://manufact.com/mcp-catalog/rippit) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 842 / 2099 | [Riverside](https://manufact.com/mcp-catalog/riverside) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2100 | [Rntor](https://manufact.com/mcp-catalog/rntor) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 843 / 2101 | [Roam Research](https://manufact.com/mcp-catalog/roam-research) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2102 | [Roamze](https://manufact.com/mcp-catalog/roamze) | — / — | travel | — | — | — | required; free/paid unknown | credentials_required |
| 844 / 2103 | [Roboflow](https://manufact.com/mcp-catalog/roboflow) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 845 / 2104 | [Rocketlane](https://manufact.com/mcp-catalog/rocketlane) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2105 | [Rockhopper](https://manufact.com/mcp-catalog/rockhopper) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 846 / 2106 | [Roivenue](https://manufact.com/mcp-catalog/roivenue) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2107 | [Rome2Rio](https://manufact.com/mcp-catalog/rome2rio) | — / — | travel | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2108 | [Rooster Wake](https://manufact.com/mcp-catalog/rooster-wake) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2109 | [RothGPT](https://manufact.com/mcp-catalog/rothgpt) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2110 | [Routal](https://manufact.com/mcp-catalog/routal) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 847 / 2111 | [Routific](https://manufact.com/mcp-catalog/routific) | — / — | business-productivity | 13/43/1 | 10109 | response_control_size_unclear, broad_response_candidate, overlapping_read_tools (24) | none for metadata | complete |
| — / 2112 | [Rubikc](https://manufact.com/mcp-catalog/rubikc) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 848 / 2113 | [Runway (runway.team)](https://manufact.com/mcp-catalog/runway-runway-team) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 849 / 2114 | [Rydoo](https://manufact.com/mcp-catalog/rydoo) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2115 | [Ryze AI — Google Ads, Meta Ads, SEO & GEO](https://manufact.com/mcp-catalog/ryze-ai-google-ads-meta-ads-seo-geo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 850 / 2116 | [S&P - Deterministic Retrieval](https://manufact.com/mcp-catalog/s-p-deterministic-retrieval) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 851 / 2117 | [S&P Global - Adaptive Retrieval](https://manufact.com/mcp-catalog/s-p-global-adaptive-retrieval) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2118 | [SaaSify - Cloud Marketplaces GTM Platform](https://manufact.com/mcp-catalog/saasify-cloud-marketplaces-gtm-platform) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2119 | [sacflow](https://manufact.com/mcp-catalog/sacflow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 852 / 2120 | [Sacra](https://manufact.com/mcp-catalog/sacra) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 853 / 2121 | [Safeguard](https://manufact.com/mcp-catalog/safeguard) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2122 | [SalesEQ](https://manufact.com/mcp-catalog/saleseq) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 854 / 2123 | [Salesflare](https://manufact.com/mcp-catalog/salesflare) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 855 / 2124 | [Salesforce - Beta](https://manufact.com/mcp-catalog/salesforce-beta) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 856 / 2125 | [Salesloft](https://manufact.com/mcp-catalog/salesloft) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 857 / 2126 | [SAMMY](https://manufact.com/mcp-catalog/sammy) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2127 | [Sanction Scanner](https://manufact.com/mcp-catalog/sanction-scanner) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 858 / 2128 | [Sanity](https://manufact.com/mcp-catalog/sanity) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2129 | [Saturation](https://manufact.com/mcp-catalog/saturation) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2130 | [Savri](https://manufact.com/mcp-catalog/savri) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2131 | [ScalperIntel AI](https://manufact.com/mcp-catalog/scalperintel-ai) | — / — | productivity | 1/15/0 | 2911 | broad_response_candidate, response_control_size_unclear (6) | required; free/paid unknown | complete |
| — / 2132 | [Schemon](https://manufact.com/mcp-catalog/schemon) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2133 | [Scholar Feed](https://manufact.com/mcp-catalog/scholar-feed) | — / — | science | 0/11/5 | 20300 | response_control_size_unclear, broad_response_candidate, potentially_expensive_default, overlapping_read_tools (13) | required; free/paid unknown | complete |
| 859 / 2134 | [Scholar Gateway](https://manufact.com/mcp-catalog/scholar-gateway) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 860 / 2135 | [SciSpace](https://manufact.com/mcp-catalog/scispace) | — / — | search-research | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2136 | [Scispot.io](https://manufact.com/mcp-catalog/scispot-io) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 861 / 2137 | [Scite](https://manufact.com/mcp-catalog/scite) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 862 / 2138 | [Scorechain](https://manufact.com/mcp-catalog/scorechain) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2139 | [Scribe Mail](https://manufact.com/mcp-catalog/scribe-mail) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2140 | [Scry](https://manufact.com/mcp-catalog/scry) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 863 / 2141 | [SE Ranking](https://manufact.com/mcp-catalog/se-ranking) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 864 / 2142 | [Seamless](https://manufact.com/mcp-catalog/seamless) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2143 | [SearchTheTrend](https://manufact.com/mcp-catalog/searchthetrend) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 865 / 2144 | [SeedLegals](https://manufact.com/mcp-catalog/seedlegals) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2145 | [seen](https://manufact.com/mcp-catalog/seen) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 866 / 2146 | [Seismic](https://manufact.com/mcp-catalog/seismic) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2147 | [SellBridge](https://manufact.com/mcp-catalog/sellbridge) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 867 / 2148 | [Seller Assistant](https://manufact.com/mcp-catalog/seller-assistant) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2149 | [SellerClaw](https://manufact.com/mcp-catalog/sellerclaw) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2150 | [Sellergoo](https://manufact.com/mcp-catalog/sellergoo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 868 / 2151 | [Sellerise](https://manufact.com/mcp-catalog/sellerise) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2152 | [SellerMate.AI — Amazon Ads & Retail Analytics](https://manufact.com/mcp-catalog/sellermate-ai-amazon-ads-retail-analytics) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 869 / 2153 | [Seltz](https://manufact.com/mcp-catalog/seltz) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2154 | [Semantica](https://manufact.com/mcp-catalog/semantica) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2155 | [Semantika](https://manufact.com/mcp-catalog/semantika) | — / — | data-analytics | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 870 / 2156 | [Semji](https://manufact.com/mcp-catalog/semji) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 871 / 2157 | [Semrush](https://manufact.com/mcp-catalog/semrush) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2158 | [Send](https://manufact.com/mcp-catalog/send) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2159 | [Sendd MCP](https://manufact.com/mcp-catalog/sendd-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 872 / 2160 | [SenderKit](https://manufact.com/mcp-catalog/senderkit) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 873 / 2161 | [Sensor Tower](https://manufact.com/mcp-catalog/sensor-tower) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2162 | [Sent](https://manufact.com/mcp-catalog/sent) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2163 | [SEO Expert: Digital Darts](https://manufact.com/mcp-catalog/seo-expert-digital-darts) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 874 / 2164 | [SEO Gets](https://manufact.com/mcp-catalog/seo-gets) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2165 | [SEOcrawl AI](https://manufact.com/mcp-catalog/seocrawl-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2166 | [SEOmatic](https://manufact.com/mcp-catalog/seomatic) | — / — | sales-and-marketing | 0/3/0 | 649 |  (0) | required; free/paid unknown | complete |
| 875 / 2167 | [SEON](https://manufact.com/mcp-catalog/seon) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 876 / 2168 | [SEOTesting](https://manufact.com/mcp-catalog/seotesting) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 877 / 2169 | [Sequence](https://manufact.com/mcp-catalog/sequence) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2170 | [Sequentum MCP](https://manufact.com/mcp-catalog/sequentum-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 878 / 2171 | [Servebolt](https://manufact.com/mcp-catalog/servebolt) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 879 / 2172 | [ServiceM8](https://manufact.com/mcp-catalog/servicem8) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2173 | [Sessionboard](https://manufact.com/mcp-catalog/sessionboard) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 880 / 2174 | [Setyl](https://manufact.com/mcp-catalog/setyl) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2175 | [Shapes](https://manufact.com/mcp-catalog/shapes) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2176 | [Sharable Link](https://manufact.com/mcp-catalog/sharable-link) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 881 / 2177 | [Share-A-Cart](https://manufact.com/mcp-catalog/share-a-cart) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2178 | [Sharebird Coach](https://manufact.com/mcp-catalog/sharebird-coach) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2179 | [ShareWatch](https://manufact.com/mcp-catalog/sharewatch) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2180 | [Sheets AI](https://manufact.com/mcp-catalog/sheets-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 882 / 2181 | [Ship.com](https://manufact.com/mcp-catalog/ship-com) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 883 / 2182 | [ShipBob](https://manufact.com/mcp-catalog/shipbob) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 884 / 2183 | [Shippo](https://manufact.com/mcp-catalog/shippo) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2184 | [Shipstar](https://manufact.com/mcp-catalog/shipstar) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 885 / 2185 | [Shipt](https://manufact.com/mcp-catalog/shipt) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| 886 / 2186 | [Shopify](https://manufact.com/mcp-catalog/shopify) | — / — | commerce-shopping | 1/22/16 | 27106 | broad_response_candidate, overlapping_read_tools (21) | required; free/paid unknown | complete |
| 887 / 2187 | [SHOPLINE](https://manufact.com/mcp-catalog/shopline) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2188 | [ShopMCP](https://manufact.com/mcp-catalog/shopmcp) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 888 / 2189 | [Shoptet](https://manufact.com/mcp-catalog/shoptet) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2190 | [Shorty](https://manufact.com/mcp-catalog/shorty) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 889 / 2191 | [Shutterstock](https://manufact.com/mcp-catalog/shutterstock) | — / — | design-creative | 0/0/0 | 798 |  (0) | none for metadata | complete |
| — / 2192 | [SiD Corp MCP](https://manufact.com/mcp-catalog/sid-corp-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2193 | [Sidecloud.ai Platform](https://manufact.com/mcp-catalog/sidecloud-ai-platform) | — / — | productivity | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2194 | [SiftedAI](https://manufact.com/mcp-catalog/siftedai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2195 | [Signals.ai](https://manufact.com/mcp-catalog/signals-ai) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2196 | [SignalSync](https://manufact.com/mcp-catalog/signalsync) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2197 | [Signara](https://manufact.com/mcp-catalog/signara) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 890 / 2198 | [Signeasy](https://manufact.com/mcp-catalog/signeasy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 891 / 2199 | [SignNow](https://manufact.com/mcp-catalog/signnow) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 892 / 2200 | [Siit AI service desk](https://manufact.com/mcp-catalog/siit-ai-service-desk) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 893 / 2201 | [Similarweb](https://manufact.com/mcp-catalog/similarweb) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2202 | [Simple Product](https://manufact.com/mcp-catalog/simple-product) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 894 / 2203 | [SimpleBackups](https://manufact.com/mcp-catalog/simplebackups) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2204 | [SimplePost](https://manufact.com/mcp-catalog/simplepost) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2205 | [SimpleSend](https://manufact.com/mcp-catalog/simplesend) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2206 | [Simpliciter](https://manufact.com/mcp-catalog/simpliciter) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 2207 | [Simply Asking](https://manufact.com/mcp-catalog/simply-asking) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 895 / 2208 | [SiteGPT](https://manufact.com/mcp-catalog/sitegpt) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 896 / 2209 | [SiteGuru](https://manufact.com/mcp-catalog/siteguru) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2210 | [Sitelas](https://manufact.com/mcp-catalog/sitelas) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 897 / 2211 | [Sitelemetry](https://manufact.com/mcp-catalog/sitelemetry) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2212 | [Sitemate](https://manufact.com/mcp-catalog/sitemate) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2213 | [Skailer](https://manufact.com/mcp-catalog/skailer) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2214 | [Skillsail](https://manufact.com/mcp-catalog/skillsail) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2215 | [SkilzVolt](https://manufact.com/mcp-catalog/skilzvolt) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2216 | [Skipo](https://manufact.com/mcp-catalog/skipo) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2217 | [SkyWatch](https://manufact.com/mcp-catalog/skywatch) | — / — | data-analytics | 0/9/0 | 2803 | potentially_expensive_default, broad_response_candidate (3) | none for metadata | complete |
| 898 / 2218 | [Slack](https://manufact.com/mcp-catalog/slack) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2219 | [Slatemark](https://manufact.com/mcp-catalog/slatemark) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2220 | [Sleekplan](https://manufact.com/mcp-catalog/sleekplan) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2221 | [Slice](https://manufact.com/mcp-catalog/slice) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2222 | [SlideForge](https://manufact.com/mcp-catalog/slideforge) | — / — | productivity | 8/24/1 | 14932 | response_control_size_unclear, broad_response_candidate (5) | required; free/paid unknown | complete |
| — / 2223 | [Slides AI](https://manufact.com/mcp-catalog/slides-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2224 | [Slingshot](https://manufact.com/mcp-catalog/slingshot) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 899 / 2225 | [Slite](https://manufact.com/mcp-catalog/slite) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2226 | [Smacient](https://manufact.com/mcp-catalog/smacient) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 900 / 2227 | [Smara](https://manufact.com/mcp-catalog/smara) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2228 | [Smart Led Messenger](https://manufact.com/mcp-catalog/smart-led-messenger) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2229 | [smart-me](https://manufact.com/mcp-catalog/smart-me) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2230 | [SmartHome CRM](https://manufact.com/mcp-catalog/smarthome-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 901 / 2231 | [Smartling](https://manufact.com/mcp-catalog/smartling) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2232 | [smarts.bio](https://manufact.com/mcp-catalog/smarts-bio) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 902 / 2233 | [SmartSpectra](https://manufact.com/mcp-catalog/smartspectra) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 903 / 2234 | [Social Champ](https://manufact.com/mcp-catalog/social-champ) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2235 | [Social Index](https://manufact.com/mcp-catalog/social-index) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 904 / 2236 | [SocialAPI](https://manufact.com/mcp-catalog/socialapi) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 905 / 2237 | [Socialinsider](https://manufact.com/mcp-catalog/socialinsider) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 906 / 2238 | [Sociality.io](https://manufact.com/mcp-catalog/sociality-io) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2239 | [SocialListeningAPI](https://manufact.com/mcp-catalog/sociallisteningapi) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2240 | [Sola Security](https://manufact.com/mcp-catalog/sola-security) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 2241 | [Sóley — Iceland travel and direct booking](https://manufact.com/mcp-catalog/s-ley-iceland-travel-and-direct-booking) | — / — | travel | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2242 | [Solo MCP](https://manufact.com/mcp-catalog/solo-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 907 / 2243 | [Solve Intelligence](https://manufact.com/mcp-catalog/solve-intelligence) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2244 | [Soracom Query](https://manufact.com/mcp-catalog/soracom-query) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2245 | [Soundcharts](https://manufact.com/mcp-catalog/soundcharts) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 2246 | [SoupNet](https://manufact.com/mcp-catalog/soupnet) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2247 | [Source Library](https://manufact.com/mcp-catalog/source-library) | — / — |  | 13/45/10 | 17988 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate, overlapping_read_tools (11) | required; free/paid unknown | complete |
| 908 / 2248 | [SourcePRD](https://manufact.com/mcp-catalog/sourceprd) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2249 | [Spacebring](https://manufact.com/mcp-catalog/spacebring) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2250 | [SPACInsider](https://manufact.com/mcp-catalog/spacinsider) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2251 | [SPARK by SILEX](https://manufact.com/mcp-catalog/spark-by-silex) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2252 | [SpeakApp](https://manufact.com/mcp-catalog/speakapp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2253 | [Speakflow Teleprompter](https://manufact.com/mcp-catalog/speakflow-teleprompter) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2254 | [Spectra Intelligence MCP](https://manufact.com/mcp-catalog/spectra-intelligence-mcp) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 2255 | [Speeda](https://manufact.com/mcp-catalog/speeda) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 909 / 2256 | [Speko](https://manufact.com/mcp-catalog/speko) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 910 / 2257 | [Spendflo](https://manufact.com/mcp-catalog/spendflo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2258 | [Spendify](https://manufact.com/mcp-catalog/spendify) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 911 / 2259 | [Spinach AI](https://manufact.com/mcp-catalog/spinach-ai) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 912 / 2260 | [Splice](https://manufact.com/mcp-catalog/splice) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2261 | [Spoks](https://manufact.com/mcp-catalog/spoks) | — / — | sales-and-marketing | 0/38/8 | 146315 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (21) | required; free/paid unknown | complete |
| — / 2262 | [Sponsara](https://manufact.com/mcp-catalog/sponsara) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2263 | [Spot2](https://manufact.com/mcp-catalog/spot2) | — / — |  | 0/1/0 | 703 |  (0) | none for metadata | complete |
| — / 2264 | [Spotify](https://manufact.com/mcp-catalog/spotify) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2265 | [Spotsnow](https://manufact.com/mcp-catalog/spotsnow) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2266 | [SpreadX](https://manufact.com/mcp-catalog/spreadx) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 913 / 2267 | [Sprites](https://manufact.com/mcp-catalog/sprites) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 914 / 2268 | [Sprouts Data Intelligence](https://manufact.com/mcp-catalog/sprouts-data-intelligence) | — / — | sales-and-marketing | 0/27/4 | 19858 | potentially_expensive_default, response_control_size_unclear, broad_response_candidate (11) | required; free/paid unknown | complete |
| — / 2269 | [Sprucely.io](https://manufact.com/mcp-catalog/sprucely-io) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 915 / 2270 | [Squad AI](https://manufact.com/mcp-catalog/squad-ai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 916 / 2271 | [Square](https://manufact.com/mcp-catalog/square) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2272 | [SSHOW](https://manufact.com/mcp-catalog/sshow) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2273 | [STACK](https://manufact.com/mcp-catalog/stack) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 917 / 2274 | [Stack Overflow](https://manufact.com/mcp-catalog/stack-overflow) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2275 | [Stacklist](https://manufact.com/mcp-catalog/stacklist) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2276 | [Starbuzz for Claude](https://manufact.com/mcp-catalog/starbuzz-for-claude) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2277 | [Stark](https://manufact.com/mcp-catalog/stark) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2278 | [Statista](https://manufact.com/mcp-catalog/statista) | — / — |  | — | — | — | required; free/paid unknown | credentials_required |
| — / 2279 | [StatsDeck](https://manufact.com/mcp-catalog/statsdeck) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 2280 | [Steady](https://manufact.com/mcp-catalog/steady) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 918 / 2281 | [Steadybit](https://manufact.com/mcp-catalog/steadybit) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2282 | [Stealthium](https://manufact.com/mcp-catalog/stealthium) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 919 / 2283 | [Steep](https://manufact.com/mcp-catalog/steep) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2284 | [Stem](https://manufact.com/mcp-catalog/stem) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2285 | [Stocklake](https://manufact.com/mcp-catalog/stocklake) | — / — | financial-services | 0/5/16 | 21796 | broad_response_candidate, overlapping_read_tools (27) | required; free/paid unknown | complete |
| 920 / 2286 | [Stocktwits](https://manufact.com/mcp-catalog/stocktwits) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2287 | [StopChurn](https://manufact.com/mcp-catalog/stopchurn) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 921 / 2288 | [Stord](https://manufact.com/mcp-catalog/stord) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2289 | [Storepoint Store Locator](https://manufact.com/mcp-catalog/storepoint-store-locator) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 922 / 2290 | [Storyblok](https://manufact.com/mcp-catalog/storyblok) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2291 | [storydoc](https://manufact.com/mcp-catalog/storydoc) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2292 | [Stratws](https://manufact.com/mcp-catalog/stratws) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2293 | [Stratyfix](https://manufact.com/mcp-catalog/stratyfix) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2294 | [Strava](https://manufact.com/mcp-catalog/strava) | — / — | health | — | — | — | required; free/paid unknown | credentials_required |
| 923 / 2295 | [Streak](https://manufact.com/mcp-catalog/streak) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 924 / 2296 | [Streamkap](https://manufact.com/mcp-catalog/streamkap) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 925 / 2297 | [Streamline Icons, Illustrations, Emojis](https://manufact.com/mcp-catalog/streamline-icons-illustrations-emojis) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2298 | [Strella](https://manufact.com/mcp-catalog/strella) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2299 | [Strety](https://manufact.com/mcp-catalog/strety) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2300 | [Structured](https://manufact.com/mcp-catalog/structured) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2301 | [Structured Reflection](https://manufact.com/mcp-catalog/structured-reflection) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2302 | [Strunk](https://manufact.com/mcp-catalog/strunk) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 926 / 2303 | [StubHub](https://manufact.com/mcp-catalog/stubhub) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2304 | [Study Bible](https://manufact.com/mcp-catalog/study-bible) | — / — |  | 0/41/8 | 17140 | potentially_expensive_default, broad_response_candidate, overlapping_read_tools (8) | none for metadata | complete |
| 927 / 2305 | [Stytch](https://manufact.com/mcp-catalog/stytch) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 928 / 2306 | [SubImage](https://manufact.com/mcp-catalog/subimage) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 2307 | [subscline](https://manufact.com/mcp-catalog/subscline) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2308 | [Subscribr](https://manufact.com/mcp-catalog/subscribr) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 929 / 2309 | [Subtext](https://manufact.com/mcp-catalog/subtext) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2310 | [Suger](https://manufact.com/mcp-catalog/suger) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 930 / 2311 | [Sumble](https://manufact.com/mcp-catalog/sumble) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2312 | [SumIt](https://manufact.com/mcp-catalog/sumit) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 931 / 2313 | [Sumsub](https://manufact.com/mcp-catalog/sumsub) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2314 | [Supademo](https://manufact.com/mcp-catalog/supademo) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2315 | [SuperBot](https://manufact.com/mcp-catalog/superbot) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 932 / 2316 | [Supercut](https://manufact.com/mcp-catalog/supercut) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 933 / 2317 | [Superhuman Docs](https://manufact.com/mcp-catalog/superhuman-docs) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 934 / 2318 | [Supericons](https://manufact.com/mcp-catalog/supericons) | — / — | developer-tools | 0/0/0 | 3335 | response_control_size_unclear, potentially_expensive_default (2) | none for metadata | complete |
| — / 2319 | [SuperIntern](https://manufact.com/mcp-catalog/superintern) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 935 / 2320 | [Superlist](https://manufact.com/mcp-catalog/superlist) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2321 | [SuperMe](https://manufact.com/mcp-catalog/superme) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 936 / 2322 | [Supermetrics Marketing Analytics](https://manufact.com/mcp-catalog/supermetrics-marketing-analytics) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2323 | [Supernova](https://manufact.com/mcp-catalog/supernova) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2324 | [Superr MCP](https://manufact.com/mcp-catalog/superr-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 937 / 2325 | [Suralink](https://manufact.com/mcp-catalog/suralink) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2326 | [Surplus](https://manufact.com/mcp-catalog/surplus) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2327 | [SurveyFlip](https://manufact.com/mcp-catalog/surveyflip) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 938 / 2328 | [SurveyMonkey](https://manufact.com/mcp-catalog/surveymonkey) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 939 / 2329 | [SVGator](https://manufact.com/mcp-catalog/svgator) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 940 / 2330 | [Swagger](https://manufact.com/mcp-catalog/swagger) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2331 | [Swarm by Foursquare](https://manufact.com/mcp-catalog/swarm-by-foursquare) | — / — | travel | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2332 | [Swath API](https://manufact.com/mcp-catalog/swath-api) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2333 | [Switch](https://manufact.com/mcp-catalog/switch) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2334 | [Swoop](https://manufact.com/mcp-catalog/swoop) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 941 / 2335 | [Sybill](https://manufact.com/mcp-catalog/sybill) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2336 | [Synaply](https://manufact.com/mcp-catalog/synaply) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2337 | [Synapse.org](https://manufact.com/mcp-catalog/synapse-org) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 2338 | [Syncly Social](https://manufact.com/mcp-catalog/syncly-social) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2339 | [SyncMe](https://manufact.com/mcp-catalog/syncme) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 942 / 2340 | [Syncro](https://manufact.com/mcp-catalog/syncro) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| — / 2341 | [SyncWith Marketing Analytics](https://manufact.com/mcp-catalog/syncwith-marketing-analytics) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2342 | [Synthesize Bio](https://manufact.com/mcp-catalog/synthesize-bio) | — / — | life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| — / 2343 | [Syntitan](https://manufact.com/mcp-catalog/syntitan) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 943 / 2344 | [Systeme.io](https://manufact.com/mcp-catalog/systeme-io) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2345 | [table](https://manufact.com/mcp-catalog/table) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 944 / 2346 | [Tableau Cloud](https://manufact.com/mcp-catalog/tableau-cloud) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2347 | [TableLink](https://manufact.com/mcp-catalog/tablelink) | — / — | e-commerce | 0/5/0 | 2116 | broad_response_candidate (1) | required; free/paid unknown | complete |
| 945 / 2348 | [Tabs](https://manufact.com/mcp-catalog/tabs) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 946 / 2349 | [Tactiq](https://manufact.com/mcp-catalog/tactiq) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2350 | [Talarion](https://manufact.com/mcp-catalog/talarion) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 947 / 2351 | [Tally](https://manufact.com/mcp-catalog/tally) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 948 / 2352 | [TALON Knowledge](https://manufact.com/mcp-catalog/talon-knowledge) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 949 / 2353 | [Tango](https://manufact.com/mcp-catalog/tango) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 950 / 2354 | [Tapcart](https://manufact.com/mcp-catalog/tapcart) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2355 | [Tariff Code Compliance](https://manufact.com/mcp-catalog/tariff-code-compliance) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2356 | [TaskLite](https://manufact.com/mcp-catalog/tasklite) | — / — | productivity | 0/92/7 | 31965 | response_control_size_unclear, potentially_expensive_default, broad_response_candidate, overlapping_read_tools (28) | required; free/paid unknown | complete |
| — / 2357 | [taskPilot](https://manufact.com/mcp-catalog/taskpilot) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 951 / 2358 | [Tastewise](https://manufact.com/mcp-catalog/tastewise) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2359 | [Taverity](https://manufact.com/mcp-catalog/taverity) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 952 / 2360 | [Tavily](https://manufact.com/mcp-catalog/tavily) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 2361 | [TaxGraph](https://manufact.com/mcp-catalog/taxgraph) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 2362 | [TaxMCP](https://manufact.com/mcp-catalog/taxmcp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2363 | [TeamGuide](https://manufact.com/mcp-catalog/teamguide) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2364 | [Teamspective](https://manufact.com/mcp-catalog/teamspective) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 953 / 2365 | [Teamtailor](https://manufact.com/mcp-catalog/teamtailor) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 954 / 2366 | [Teamwork.com](https://manufact.com/mcp-catalog/teamwork-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2367 | [Tekst](https://manufact.com/mcp-catalog/tekst) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2368 | [Teleprompter.com](https://manufact.com/mcp-catalog/teleprompter-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 955 / 2369 | [Tella](https://manufact.com/mcp-catalog/tella) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2370 | [tembi-intelligence-dev](https://manufact.com/mcp-catalog/tembi-intelligence-dev) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 956 / 2371 | [Templafy](https://manufact.com/mcp-catalog/templafy) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 957 / 2372 | [Templated.io](https://manufact.com/mcp-catalog/templated-io) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2373 | [Tempreon](https://manufact.com/mcp-catalog/tempreon) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2374 | [Tenderlake](https://manufact.com/mcp-catalog/tenderlake) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2375 | [Tennsa OS](https://manufact.com/mcp-catalog/tennsa-os) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2376 | [Tenqual](https://manufact.com/mcp-catalog/tenqual) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2377 | [Tenzo AI](https://manufact.com/mcp-catalog/tenzo-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2378 | [Terac](https://manufact.com/mcp-catalog/terac) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2379 | [Terminal49](https://manufact.com/mcp-catalog/terminal49) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 958 / 2380 | [Testimonial.to](https://manufact.com/mcp-catalog/testimonial-to) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2381 | [Textalize MCP](https://manufact.com/mcp-catalog/textalize-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 959 / 2382 | [TextExpander](https://manufact.com/mcp-catalog/textexpander) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 960 / 2383 | [Textmagic](https://manufact.com/mcp-catalog/textmagic) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2384 | [The Big Whale MCP](https://manufact.com/mcp-catalog/the-big-whale-mcp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2385 | [The Tie Fundraising and M&A](https://manufact.com/mcp-catalog/the-tie-fundraising-and-m-a) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2386 | [Theia Insights](https://manufact.com/mcp-catalog/theia-insights) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2387 | [theMarketer](https://manufact.com/mcp-catalog/themarketer) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 961 / 2388 | [Third Bridge](https://manufact.com/mcp-catalog/third-bridge) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2389 | [Thirst](https://manufact.com/mcp-catalog/thirst) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 962 / 2390 | [ThoughtLeaders - YouTube Data](https://manufact.com/mcp-catalog/thoughtleaders-youtube-data) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 963 / 2391 | [ThoughtMetric](https://manufact.com/mcp-catalog/thoughtmetric) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 964 / 2392 | [ThoughtSpot Spotter](https://manufact.com/mcp-catalog/thoughtspot-spotter) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2393 | [Three.js 3D Viewer](https://manufact.com/mcp-catalog/three-js-3d-viewer) | — / — | code | 0/3/0 | 1006 |  (0) | required; free/paid unknown | complete |
| — / 2394 | [Thumbtack](https://manufact.com/mcp-catalog/thumbtack) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2395 | [Ticket Tailor](https://manufact.com/mcp-catalog/ticket-tailor) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 965 / 2396 | [Ticketmaster](https://manufact.com/mcp-catalog/ticketmaster) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2397 | [TickM](https://manufact.com/mcp-catalog/tickm) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 966 / 2398 | [TickTick](https://manufact.com/mcp-catalog/ticktick) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2399 | [Tiendanube](https://manufact.com/mcp-catalog/tiendanube) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 967 / 2400 | [TikTok for Business](https://manufact.com/mcp-catalog/tiktok-for-business) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2401 | [Tilde Canvas](https://manufact.com/mcp-catalog/worker-tilde-audio) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 968 / 2402 | [Tiller](https://manufact.com/mcp-catalog/tiller) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2403 | [Time Machine](https://manufact.com/mcp-catalog/time-machine) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 969 / 2404 | [TimeChimp](https://manufact.com/mcp-catalog/timechimp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2405 | [Timeless](https://manufact.com/mcp-catalog/timeless) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 970 / 2406 | [timr](https://manufact.com/mcp-catalog/timr) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 971 / 2407 | [TipRanks Financial Data](https://manufact.com/mcp-catalog/tipranks-financial-data) | — / — | financial-services | 42/194/16 | 32469 | broad_response_candidate, response_control_size_unclear, potentially_expensive_default, overlapping_read_tools (176) | required; free/paid unknown | complete |
| — / 2408 | [TitanSigma](https://manufact.com/mcp-catalog/titansigma) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 972 / 2409 | [tldv](https://manufact.com/mcp-catalog/tldv) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2410 | [to-teach](https://manufact.com/mcp-catalog/to-teach) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| — / 2411 | [Tofu Ads](https://manufact.com/mcp-catalog/tofu-ads) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 973 / 2412 | [Token Terminal](https://manufact.com/mcp-catalog/token-terminal) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2413 | [Tomi — AI Phone Calls](https://manufact.com/mcp-catalog/tomi-ai-phone-calls) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 974 / 2414 | [TomTom Maps](https://manufact.com/mcp-catalog/tomtom-maps) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 975 / 2415 | [Tool4seller](https://manufact.com/mcp-catalog/tool4seller) | — / — | commerce-shopping | 0/36/18 | — | broad_response_candidate, potentially_expensive_default, response_control_size_unclear, overlapping_read_tools (119) | required; free/paid unknown | complete |
| — / 2416 | [TOP](https://manufact.com/mcp-catalog/top) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2417 | [TopCounsel by The L Suite](https://manufact.com/mcp-catalog/topcounsel-by-the-l-suite) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 976 / 2418 | [Torii](https://manufact.com/mcp-catalog/torii) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2419 | [TotalCtrl](https://manufact.com/mcp-catalog/totalctrl) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2420 | [Trace](https://manufact.com/mcp-catalog/trace) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2421 | [Trackunit IrisX](https://manufact.com/mcp-catalog/trackunit-irisx) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 977 / 2422 | [Tracxn](https://manufact.com/mcp-catalog/tracxn) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2423 | [Trademo Hermes for Claude](https://manufact.com/mcp-catalog/trademo-hermes-for-claude) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 978 / 2424 | [Transcript LOL](https://manufact.com/mcp-catalog/transcript-lol) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 979 / 2425 | [Transkriptor](https://manufact.com/mcp-catalog/transkriptor) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2426 | [Translead CRM](https://manufact.com/mcp-catalog/translead-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2427 | [Trata](https://manufact.com/mcp-catalog/trata) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2428 | [Traveler.md](https://manufact.com/mcp-catalog/traveler-md) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 980 / 2429 | [TreasurySpring](https://manufact.com/mcp-catalog/treasuryspring) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2430 | [Trellis](https://manufact.com/mcp-catalog/trellis) | — / — | productivity | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 2431 | [Trellis](https://manufact.com/mcp-catalog/trellis-2) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 981 / 2432 | [Trello](https://manufact.com/mcp-catalog/trello) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2433 | [Trifolia](https://manufact.com/mcp-catalog/trifolia) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 982 / 2434 | [Trimble SketchUp](https://manufact.com/mcp-catalog/trimble-sketchup) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 983 / 2435 | [Trint](https://manufact.com/mcp-catalog/trint) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2436 | [Tripadvisor](https://manufact.com/mcp-catalog/tripadvisor) | — / — | productivity | 0/3/3 | 9443 | broad_response_candidate, response_control_size_unclear (2) | none for metadata | complete |
| — / 2437 | [tripdeal](https://manufact.com/mcp-catalog/tripdeal) | — / — | travel | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 984 / 2438 | [Triple Whale](https://manufact.com/mcp-catalog/triple-whale) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 985 / 2439 | [Tropic](https://manufact.com/mcp-catalog/tropic) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2440 | [Trove](https://manufact.com/mcp-catalog/trove) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 986 / 2441 | [TrueClicks MCP](https://manufact.com/mcp-catalog/trueclicks-mcp) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2442 | [TrueGradient](https://manufact.com/mcp-catalog/truegradient) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2443 | [Truehome Desk](https://manufact.com/mcp-catalog/truehome-desk) | — / — | productivity | — | — | — | required; free/paid unknown | nonpublic_or_unreachable_url |
| — / 2444 | [TrueProfit](https://manufact.com/mcp-catalog/trueprofit) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 987 / 2445 | [trumpet](https://manufact.com/mcp-catalog/trumpet) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2446 | [Trussi AI](https://manufact.com/mcp-catalog/trussi-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2447 | [Trustdata](https://manufact.com/mcp-catalog/trustdata) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2448 | [TrustFoundry Legal Search and Reasoning](https://manufact.com/mcp-catalog/trustfoundry-legal-search-and-reasoning) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| — / 2449 | [Trustgrid MCP](https://manufact.com/mcp-catalog/trustgrid-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2450 | [TrustyData](https://manufact.com/mcp-catalog/trustydata) | — / — | data-analytics | 0/11/4 | 16446 | response_control_size_unclear, overlapping_read_tools (9) | required; free/paid unknown | complete |
| — / 2451 | [TruthScan](https://manufact.com/mcp-catalog/truthscan) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2452 | [Tseha.io](https://manufact.com/mcp-catalog/tseha-io) | — / — | productivity | 0/9/1 | 4164 | broad_response_candidate, overlapping_read_tools (5) | required; free/paid unknown | complete |
| — / 2453 | [tseller.co.za](https://manufact.com/mcp-catalog/tseller-co-za) | — / — | productivity | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| 988 / 2454 | [Tsuga](https://manufact.com/mcp-catalog/tsuga) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2455 | [TubeAlfred](https://manufact.com/mcp-catalog/tubealfred) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 989 / 2456 | [Tubular](https://manufact.com/mcp-catalog/tubular) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2457 | [TUI](https://manufact.com/mcp-catalog/tui) | — / — | travel | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| 990 / 2458 | [Turbofy](https://manufact.com/mcp-catalog/turbofy) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2459 | [Turo](https://manufact.com/mcp-catalog/turo) | — / — | travel | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2460 | [Turquoise](https://manufact.com/mcp-catalog/turquoise) | — / — | health | — | — | — | required; free/paid unknown | credentials_required |
| — / 2461 | [Tweek](https://manufact.com/mcp-catalog/tweek) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 991 / 2462 | [Twelve Data](https://manufact.com/mcp-catalog/twelve-data) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2463 | [Twinfield AI Connect, by iWebDevelopment](https://manufact.com/mcp-catalog/twinfield-ai-connect-by-iwebdevelopment) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 992 / 2464 | [TwinMind](https://manufact.com/mcp-catalog/twinmind) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 993 / 2465 | [Two Minute Reports For Marketing Analytics](https://manufact.com/mcp-catalog/two-minute-reports-for-marketing-analytics) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| 994 / 2466 | [Typeform](https://manufact.com/mcp-catalog/typeform) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2467 | [ualet](https://manufact.com/mcp-catalog/ualet) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2468 | [Uber](https://manufact.com/mcp-catalog/uber) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 995 / 2469 | [Uber Eats](https://manufact.com/mcp-catalog/uber-eats) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 996 / 2470 | [Ubersuggest](https://manufact.com/mcp-catalog/ubersuggest) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2471 | [Udemy Business](https://manufact.com/mcp-catalog/udemy-business) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2472 | [Unabyss](https://manufact.com/mcp-catalog/unabyss) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 997 / 2473 | [Unblocked](https://manufact.com/mcp-catalog/unblocked) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 998 / 2474 | [Unbounce Landing Page Builder](https://manufact.com/mcp-catalog/unbounce-landing-page-builder) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2475 | [Undermind](https://manufact.com/mcp-catalog/undermind) | — / — | health-life-sciences | — | — | — | required; free/paid unknown | credentials_required |
| 999 / 2476 | [UnfoldIP Patent Search](https://manufact.com/mcp-catalog/unfoldip-patent-search) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| 1000 / 2477 | [Unify](https://manufact.com/mcp-catalog/unify) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2478 | [Unifyr](https://manufact.com/mcp-catalog/unifyr) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2479 | [Uniqode](https://manufact.com/mcp-catalog/uniqode) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2480 | [UnlistedRoles](https://manufact.com/mcp-catalog/unlistedroles) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2481 | [uNotes](https://manufact.com/mcp-catalog/unotes) | — / — | education | — | — | — | required; free/paid unknown | credentials_required |
| 1001 / 2482 | [Unsplash](https://manufact.com/mcp-catalog/unsplash) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2483 | [Unstructured Foundation](https://manufact.com/mcp-catalog/unstructured-foundation) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2484 | [Unstructured Transform](https://manufact.com/mcp-catalog/unstructured-transform) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1002 / 2485 | [Unthread](https://manufact.com/mcp-catalog/unthread) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 1003 / 2486 | [Unwrap](https://manufact.com/mcp-catalog/unwrap) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2487 | [Upbuild](https://manufact.com/mcp-catalog/upbuild) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 1004 / 2488 | [Upfling.host](https://manufact.com/mcp-catalog/upfling-host) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1005 / 2489 | [Upflow MCP](https://manufact.com/mcp-catalog/upflow-mcp) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 1006 / 2490 | [Upfluence](https://manufact.com/mcp-catalog/upfluence) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2491 | [Upsolve AI](https://manufact.com/mcp-catalog/upsolve-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2492 | [Upspring](https://manufact.com/mcp-catalog/upspring) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1007 / 2493 | [Uptimely](https://manufact.com/mcp-catalog/uptimely) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1008 / 2494 | [UptimeRobot](https://manufact.com/mcp-catalog/uptimerobot) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1009 / 2495 | [Upwork](https://manufact.com/mcp-catalog/upwork) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2496 | [UseMyContext.ai](https://manufact.com/mcp-catalog/usemycontext-ai) | — / — | productivity | 0/1/2 | 7238 | broad_response_candidate, response_control_size_unclear, overlapping_read_tools (5) | required; free/paid unknown | complete |
| 1010 / 2497 | [Userback](https://manufact.com/mcp-catalog/userback) | — / — | customer-support | — | — | — | required; free/paid unknown | credentials_required |
| 1011 / 2498 | [Userbrain](https://manufact.com/mcp-catalog/userbrain) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1012 / 2499 | [UserTesting](https://manufact.com/mcp-catalog/usertesting) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2500 | [USLege](https://manufact.com/mcp-catalog/uslege) | — / — | legal | — | — | — | required; free/paid unknown | credentials_required |
| 1013 / 2501 | [UX Pilot](https://manufact.com/mcp-catalog/ux-pilot) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 1014 / 2502 | [v0](https://manufact.com/mcp-catalog/v0) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2503 | [Vacation Tracker: PTO & Leave](https://manufact.com/mcp-catalog/vacation-tracker-pto-leave) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 1015 / 2504 | [Vaisala Xweather](https://manufact.com/mcp-catalog/vaisala-xweather) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2505 | [Valency](https://manufact.com/mcp-catalog/valency) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 2506 | [Valossa Assistant](https://manufact.com/mcp-catalog/valossa-assistant) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| 1016 / 2507 | [Valuecase App](https://manufact.com/mcp-catalog/valuecase-app) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2508 | [ValYou](https://manufact.com/mcp-catalog/valyou) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 1017 / 2509 | [Vanguard Advisor Tools](https://manufact.com/mcp-catalog/vanguard-advisor-tools) | — / — | financial-services | — | — | — | none (catalog; live unavailable) | connection_or_protocol_failure |
| — / 2510 | [Varify MCP](https://manufact.com/mcp-catalog/varify-mcp) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2511 | [Vasara](https://manufact.com/mcp-catalog/vasara) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2512 | [Vasco](https://manufact.com/mcp-catalog/vasco) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2513 | [VComply](https://manufact.com/mcp-catalog/vcomply) | — / — | data-analytics | — | — | — | required; free/paid unknown | server_error |
| — / 2514 | [Velocitra](https://manufact.com/mcp-catalog/velocitra) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2515 | [Velvoite](https://manufact.com/mcp-catalog/velvoite) | — / — | financial-services | — | — | — | required; free/paid unknown | server_error |
| — / 2516 | [Vendizap](https://manufact.com/mcp-catalog/vendizap) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2517 | [Vendooly](https://manufact.com/mcp-catalog/vendooly) | — / — | commerce-shopping | 126/390/13 | 56994 | potentially_expensive_default, broad_response_candidate, response_control_size_unclear, overlapping_read_tools (68) | required; free/paid unknown | complete |
| — / 2518 | [Venio](https://manufact.com/mcp-catalog/venio) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2519 | [Verb](https://manufact.com/mcp-catalog/verb) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1018 / 2520 | [Vercel](https://manufact.com/mcp-catalog/vercel) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2521 | [Vergabe Dashboard](https://manufact.com/mcp-catalog/vergabe-dashboard) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1019 / 2522 | [Verisk Underwriting Intelligence](https://manufact.com/mcp-catalog/verisk-underwriting-intelligence) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2523 | [Verisk XactRestore](https://manufact.com/mcp-catalog/verisk-xactrestore) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 1020 / 2524 | [Versive](https://manufact.com/mcp-catalog/versive) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2525 | [Vertiso Memory](https://manufact.com/mcp-catalog/vertiso-memory) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2526 | [viaNexus vAST](https://manufact.com/mcp-catalog/vianexus-vast) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2527 | [Vibe AI](https://manufact.com/mcp-catalog/vibe-ai) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1021 / 2528 | [Vibe Prospecting](https://manufact.com/mcp-catalog/vibe-prospecting) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2529 | [Viberate music data](https://manufact.com/mcp-catalog/viberate-music-data) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 2530 | [Vibsync](https://manufact.com/mcp-catalog/vibsync) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2531 | [Vid Kraken](https://manufact.com/mcp-catalog/vid-kraken) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 2532 | [Vidalytics](https://manufact.com/mcp-catalog/vidalytics) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2533 | [VideoDB](https://manufact.com/mcp-catalog/videodb) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1022 / 2534 | [vidIQ](https://manufact.com/mcp-catalog/vidiq) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2535 | [ViewPrinter](https://manufact.com/mcp-catalog/viewprinter) | — / — | sales-and-marketing | 2/10/4 | 13630 | broad_response_candidate, potentially_expensive_default (7) | required; free/paid unknown | complete |
| — / 2536 | [Vight](https://manufact.com/mcp-catalog/vight) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2537 | [Virlo Social Media Brain](https://manufact.com/mcp-catalog/virlo-social-media-brain) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2538 | [VisiGrid](https://manufact.com/mcp-catalog/visigrid) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1023 / 2539 | [Vitally MCP](https://manufact.com/mcp-catalog/vitally-mcp) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2540 | [VIZBL](https://manufact.com/mcp-catalog/vizbl) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2541 | [Vocci](https://manufact.com/mcp-catalog/vocci) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2542 | [Voibe Transcription](https://manufact.com/mcp-catalog/voibe-transcription) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2543 | [VoiceCap](https://manufact.com/mcp-catalog/voicecap) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1024 / 2544 | [Voicenotes](https://manufact.com/mcp-catalog/voicenotes) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 1025 / 2545 | [Voicenter](https://manufact.com/mcp-catalog/voicenter) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2546 | [Voicepanel](https://manufact.com/mcp-catalog/voicepanel) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2547 | [VoIP.ms (Unofficial)](https://manufact.com/mcp-catalog/voip-ms-unofficial) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| 1026 / 2548 | [Voluum](https://manufact.com/mcp-catalog/voluum) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2549 | [Voris](https://manufact.com/mcp-catalog/voris) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2550 | [Vortex IQ](https://manufact.com/mcp-catalog/vortex-iq) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2551 | [Voxtell Chat](https://manufact.com/mcp-catalog/voxtell-chat) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1027 / 2552 | [Voxtell Phone](https://manufact.com/mcp-catalog/voxtell-phone) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2553 | [Voygent](https://manufact.com/mcp-catalog/voygent) | — / — | travel | — | — | — | required; free/paid unknown | credentials_required |
| — / 2554 | [VybeOS](https://manufact.com/mcp-catalog/vybeos) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2555 | [Vysto AI](https://manufact.com/mcp-catalog/vysto-ai) | — / — | productivity | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2556 | [WalkMyPlan — AI Home Design & 3D Floor Plans](https://manufact.com/mcp-catalog/walkmyplan-ai-home-design-3d-floor-plans) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2557 | [Walletap](https://manufact.com/mcp-catalog/walletap) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2558 | [Walls.io Echo](https://manufact.com/mcp-catalog/walls-io-echo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 1028 / 2559 | [Waniwani](https://manufact.com/mcp-catalog/waniwani) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1029 / 2560 | [Watchgoose](https://manufact.com/mcp-catalog/watchgoose) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2561 | [Watching That](https://manufact.com/mcp-catalog/watching-that) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2562 | [Wattwin](https://manufact.com/mcp-catalog/wattwin) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2563 | [Wave AI Note Taker](https://manufact.com/mcp-catalog/wave-ai-note-taker) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2564 | [Wawai Mail](https://manufact.com/mcp-catalog/wawai-mail) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2565 | [Wayfront](https://manufact.com/mcp-catalog/wayfront) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 1030 / 2566 | [Wealth.com](https://manufact.com/mcp-catalog/wealth-com) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 1031 / 2567 | [Wealthbox](https://manufact.com/mcp-catalog/wealthbox) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2568 | [Weasel Den](https://manufact.com/mcp-catalog/weasel-den) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2569 | [Weav](https://manufact.com/mcp-catalog/weav) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2570 | [Weave Fabric](https://manufact.com/mcp-catalog/weave-fabric) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1032 / 2571 | [Webex Meetings](https://manufact.com/mcp-catalog/webex-meetings) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2572 | [Webeyez](https://manufact.com/mcp-catalog/webeyez) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1033 / 2573 | [Webflow](https://manufact.com/mcp-catalog/webflow) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2574 | [WebsitePublisher AI](https://manufact.com/mcp-catalog/websitepublisher-ai) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| 1034 / 2575 | [Webull](https://manufact.com/mcp-catalog/webull) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2576 | [Weld](https://manufact.com/mcp-catalog/weld) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2577 | [Well](https://manufact.com/mcp-catalog/well) | — / — | financial-services | 29/150/196 | 528309 | broad_response_candidate, potentially_expensive_default, response_control_size_unclear (103) | required; free/paid unknown | complete |
| — / 2578 | [wer kennt den BESTEN](https://manufact.com/mcp-catalog/wer-kennt-den-besten) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2579 | [weReci](https://manufact.com/mcp-catalog/wereci) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| 1035 / 2580 | [WeTransfer](https://manufact.com/mcp-catalog/wetransfer) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1036 / 2581 | [WeWeb](https://manufact.com/mcp-catalog/weweb) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1037 / 2582 | [Whatagraph](https://manufact.com/mcp-catalog/whatagraph) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1038 / 2583 | [Wherobots Spatial AI Assistant](https://manufact.com/mcp-catalog/wherobots-spatial-ai-assistant) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1039 / 2584 | [Whimsical](https://manufact.com/mcp-catalog/whimsical) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| 1040 / 2585 | [WhisperGraph](https://manufact.com/mcp-catalog/whispergraph) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1041 / 2586 | [WhoisXML API](https://manufact.com/mcp-catalog/whoisxml-api) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1042 / 2587 | [Windmill](https://manufact.com/mcp-catalog/windmill) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 2588 | [Windmill HR](https://manufact.com/mcp-catalog/windmill-hr) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1043 / 2589 | [Windsor.ai](https://manufact.com/mcp-catalog/windsor-ai) | — / — | marketing-seo | — | — | — | required; free/paid unknown | credentials_required |
| — / 2590 | [Windsor.ai for CRM](https://manufact.com/mcp-catalog/windsor-ai-for-crm) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2591 | [Windsor.ai for E-commerce](https://manufact.com/mcp-catalog/windsor-ai-for-e-commerce) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2592 | [Windsor.ai for Paid Media](https://manufact.com/mcp-catalog/windsor-ai-for-paid-media) | — / — | sales-and-marketing | — | — | — | paid | credentials_required |
| — / 2593 | [Windsor.ai for Social Media](https://manufact.com/mcp-catalog/windsor-ai-for-social-media) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2594 | [Windsor.ai for Web Analytics](https://manufact.com/mcp-catalog/windsor-ai-for-web-analytics) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2595 | [Wisdom Recall](https://manufact.com/mcp-catalog/wisdom-recall) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2596 | [wiserwork](https://manufact.com/mcp-catalog/wiserwork) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1044 / 2597 | [Wisesheets](https://manufact.com/mcp-catalog/wisesheets) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 1045 / 2598 | [Wistia](https://manufact.com/mcp-catalog/wistia) | — / — | media | — | — | — | required; free/paid unknown | credentials_required |
| — / 2599 | [WitCloud](https://manufact.com/mcp-catalog/witcloud) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2600 | [Within](https://manufact.com/mcp-catalog/within) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1046 / 2601 | [withPICA](https://manufact.com/mcp-catalog/withpica) | — / — | automation-workflows | — | — | — | required; free/paid unknown | credentials_required |
| — / 2602 | [Wiv](https://manufact.com/mcp-catalog/wiv) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1047 / 2603 | [Wix](https://manufact.com/mcp-catalog/wix) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2604 | [Wizerr](https://manufact.com/mcp-catalog/wizerr) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2605 | [WoopDrive](https://manufact.com/mcp-catalog/woopdrive) | — / — | travel | 0/3/0 | 1595 | response_control_size_unclear (2) | none for metadata | complete |
| 1048 / 2606 | [WordPress.com](https://manufact.com/mcp-catalog/wordpress-com) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| 1049 / 2607 | [Workable](https://manufact.com/mcp-catalog/workable) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1050 / 2608 | [WorkflowMAX](https://manufact.com/mcp-catalog/workflowmax) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2609 | [Workopia](https://manufact.com/mcp-catalog/workopia) | — / — | business-productivity | 8/21/4 | 7819 | response_control_size_unclear, broad_response_candidate (5) | required; free/paid unknown | complete |
| 1051 / 2610 | [WorkOS](https://manufact.com/mcp-catalog/workos) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2611 | [World Office Cloud](https://manufact.com/mcp-catalog/world-office-cloud) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2612 | [WP Agent](https://manufact.com/mcp-catalog/wp-agent) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2613 | [WPJshop](https://manufact.com/mcp-catalog/wpjshop) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 1052 / 2614 | [Wren AI](https://manufact.com/mcp-catalog/wren-ai) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1053 / 2615 | [Wrike](https://manufact.com/mcp-catalog/wrike) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2616 | [www.hofmanager.plus](https://manufact.com/mcp-catalog/www-hofmanager-plus) | — / — | productivity | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2617 | [www.rapidly.co](https://manufact.com/mcp-catalog/www-rapidly-co) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1054 / 2618 | [www.rescuetime.com](https://manufact.com/mcp-catalog/www-rescuetime-com) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2619 | [www.wattscope.com.au](https://manufact.com/mcp-catalog/www-wattscope-com-au) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 2620 | [Wyatt](https://manufact.com/mcp-catalog/wyatt) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1055 / 2621 | [WyberAi](https://manufact.com/mcp-catalog/wyberai) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2622 | [Wyndham Hotels and Resorts](https://manufact.com/mcp-catalog/wyndham-hotels-and-resorts) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 1056 / 2623 | [Xero](https://manufact.com/mcp-catalog/xero) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2624 | [XLSCOUT ClaimChart LLM](https://manufact.com/mcp-catalog/xlscout-claimchart-llm) | — / — | productivity | 17/39/3 | 7382 | response_control_size_unclear, broad_response_candidate (4) | required; free/paid unknown | complete |
| 1057 / 2625 | [xTiles](https://manufact.com/mcp-catalog/xtiles) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2626 | [Yamdu](https://manufact.com/mcp-catalog/yamdu) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2627 | [Yardi Deal Manager](https://manufact.com/mcp-catalog/yardi-deal-manager) | — / — | productivity | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| 1058 / 2628 | [Yardi Matrix](https://manufact.com/mcp-catalog/yardi-matrix) | — / — | data-analytics | — | — | — | required; free/paid unknown | connection_or_protocol_failure |
| — / 2629 | [Yardi Virtuoso](https://manufact.com/mcp-catalog/yardi-virtuoso) | — / — | financial-services | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| — / 2630 | [Yespark MCP Public](https://manufact.com/mcp-catalog/yespark-mcp-public) | — / — | travel | 0/1/1 | 1663 |  (0) | required; free/paid unknown | complete |
| — / 2631 | [Yirla](https://manufact.com/mcp-catalog/yirla) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2632 | [Yodeck](https://manufact.com/mcp-catalog/yodeck) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2633 | [Yogi](https://manufact.com/mcp-catalog/yogi) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2634 | [Yokitup](https://manufact.com/mcp-catalog/yokitup) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2635 | [Yolodex](https://manufact.com/mcp-catalog/yolodex) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| 1059 / 2636 | [You.com](https://manufact.com/mcp-catalog/you-com) | — / — | search-research | — | — | — | required; free/paid unknown | credentials_required |
| — / 2637 | [YourBI](https://manufact.com/mcp-catalog/yourbi) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2638 | [YPulse Insights](https://manufact.com/mcp-catalog/ypulse-insights) | — / — | productivity | 0/0/0 | 1056 |  (0) | required; free/paid unknown | complete |
| — / 2639 | [Ysaere](https://manufact.com/mcp-catalog/ysaere) | — / — | data-analytics | 4/52/1 | 6552 | response_control_size_unclear (1) | required; free/paid unknown | complete |
| — / 2640 | [Yuno](https://manufact.com/mcp-catalog/yuno) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1060 / 2641 | [Zacks Data](https://manufact.com/mcp-catalog/zacks-data) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| — / 2642 | [Zaprep](https://manufact.com/mcp-catalog/zaprep) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2643 | [Zeck MCP](https://manufact.com/mcp-catalog/zeck-mcp) | — / — | nonprofit | — | — | — | required; free/paid unknown | credentials_required |
| 1061 / 2644 | [Zendrop](https://manufact.com/mcp-catalog/zendrop) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2645 | [ZenHR](https://manufact.com/mcp-catalog/zenhr) | — / — | other | — | — | — | required; free/paid unknown | credentials_required |
| — / 2646 | [Zentor](https://manufact.com/mcp-catalog/zentor) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| — / 2647 | [Zentrik](https://manufact.com/mcp-catalog/zentrik) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2648 | [Zernote](https://manufact.com/mcp-catalog/zernote) | — / — | productivity | 11/39/0 | 7797 | potentially_expensive_default, broad_response_candidate (3) | required; free/paid unknown | complete |
| — / 2649 | [ZeroBounce](https://manufact.com/mcp-catalog/zerobounce) | — / — | productivity | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| 1062 / 2650 | [ZeroBounce Official](https://manufact.com/mcp-catalog/zerobounce-official) | — / — | marketing-seo | — | — | — | required; free/paid unknown | forbidden_or_blocked |
| 1063 / 2651 | [zeroheight](https://manufact.com/mcp-catalog/zeroheight) | — / — | developer-tools | — | — | — | required; free/paid unknown | credentials_required |
| — / 2652 | [Zeydoo](https://manufact.com/mcp-catalog/zeydoo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1064 / 2653 | [Zight MCP](https://manufact.com/mcp-catalog/zight-mcp) | — / — | design-creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2654 | [Zime](https://manufact.com/mcp-catalog/zime) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2655 | [Zint](https://manufact.com/mcp-catalog/zint) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1065 / 2656 | [ZipRecruiter](https://manufact.com/mcp-catalog/ziprecruiter) | — / — | productivity | — | — | — | none (catalog; live unavailable) | rate_limited_stop |
| — / 2657 | [ZITA](https://manufact.com/mcp-catalog/zita) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2658 | [Zite](https://manufact.com/mcp-catalog/zite) | — / — | business-productivity | — | — | — | required; free/paid unknown | credentials_required |
| 1066 / 2659 | [Zocks](https://manufact.com/mcp-catalog/zocks) | — / — | financial-services | — | — | — | required; free/paid unknown | credentials_required |
| 1067 / 2660 | [Zomato](https://manufact.com/mcp-catalog/zomato) | — / — | commerce-shopping | — | — | — | required; free/paid unknown | credentials_required |
| 1068 / 2661 | [Zoom for Claude](https://manufact.com/mcp-catalog/zoom-for-claude) | — / — | communication | — | — | — | required; free/paid unknown | credentials_required |
| — / 2662 | [Zoom Revenue Accelerator Connector](https://manufact.com/mcp-catalog/zoom-revenue-accelerator-connector) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| 1069 / 2663 | [ZoomInfo](https://manufact.com/mcp-catalog/zoominfo) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2664 | [Zsper](https://manufact.com/mcp-catalog/zsper) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2665 | [ZTR — Temporal Registry](https://manufact.com/mcp-catalog/ztr-temporal-registry) | — / — | legal | 0/8/0 | 893 |  (0) | required; free/paid unknown | complete |
| 1070 / 2666 | [Zylo](https://manufact.com/mcp-catalog/zylo) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2667 | [Zynq](https://manufact.com/mcp-catalog/zynq) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2668 | [다나와 가격비교](https://manufact.com/mcp-catalog/calm-wave-09mq5) | — / — | commerce-shopping | — | — | — | none (catalog; live unavailable) | forbidden_or_blocked |
| — / 2669 | [댓글몽](https://manufact.com/mcp-catalog/dark-cloud-m3juc) | — / — | data-analytics | — | — | — | required; free/paid unknown | credentials_required |
| — / 2670 | [유아이볼 (uibowl)](https://manufact.com/mcp-catalog/uibowl) | — / — | creative | — | — | — | required; free/paid unknown | credentials_required |
| — / 2671 | [カーリル for AI](https://manufact.com/mcp-catalog/for-ai) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |
| — / 2672 | [マネーフォワード クラウド会計](https://manufact.com/mcp-catalog/wild-cloud-glgo7) | — / — | productivity | — | — | — | required; free/paid unknown | credentials_required |
| — / 2673 | [ラッコキーワード](https://manufact.com/mcp-catalog/warm-wave-dxfqh) | — / — | sales-and-marketing | — | — | — | required; free/paid unknown | credentials_required |
| — / 2674 | [中央社新聞 CNA TAIWAN NEWS](https://manufact.com/mcp-catalog/cna-taiwan-news) | — / — | media-entertainment | — | — | — | required; free/paid unknown | credentials_required |

## Reproduction and limits

From the repository root: `python3 scripts/leaderboard/scrape.py --resume`, then `pnpm exec tsx scripts/leaderboard/static-screen.ts --watch`, and after collection `pnpm exec tsx scripts/leaderboard/finalize.ts`. The collector requires `private/` to be ignored before saving mixed-source/private snapshots. Existing page snapshots are reused; any blocked scrape must be reported and stopped rather than resumed to evade the block. Keep .env ignored. Only provider countTokens is permitted in these scripts; they contain no model-generation/trial path.

The scan is a time-stamped catalog census, not a reproducible snapshot of upstream deployment identity: catalog reviews, deployed toolsets, auth policy, and endpoint availability can change. Name-matched comparisons may refer to changed definitions; identical-definition pairing is reported separately. No tool execution proves the semantics, safety, response size, or pricing of any candidate. User selection and explicit frozen pre-registration approval are required before a benchmark.
