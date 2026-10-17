# Filesystem benchmark preregistration

Frozen before any model API call. Source: official https://github.com/modelcontextprotocol/servers at bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c, src/filesystem. No baseline metadata, task, scorer, fixture or candidate changes after observations.

## Settings and fixture

Use AXLINT_MODEL from gitignored .env (claude-sonnet-5-5), Anthropic provider-default sampling: never send temperature. System verbatim: `You are an assistant with access to an issue tracker. Use the available tools to help the user.` One user message contains the verbatim task followed by a separate text block `Project directory: <absolute trial fixture root>`. This condition-identical context supplies location only. One turn, first tool call scored, automatic tool choice, max_tokens 300, three trials/task/condition, concurrency 4, seeded shuffle 173201. Provider 429/5xx retry twice with 1s/2s backoff; all attempts retained. No result fed back to model.

Deterministic fixture generator seed 20261017 (LCG 1664525/1013904223, unsigned 32-bit). Fake JavaScript project with src/{index,checkout,catalog}.js, test/{checkout,catalog}.test.js, docs/architecture.md, package.json, README.md, .git/{HEAD,config,objects/seed}, and node_modules containing 240 fictional packages named fixture-package-000 through fixture-package-239. Each has package.json and 24 .js files named generated-module-00-through-23-with-deterministic-compatibility-adapter.js, seeded integer content. Total 6,013 files. No real user files, symlinks, network, executable fixture scripts or external dependencies.

Each trial receives a fresh temp COPY of the seed, fresh official stdio server process, with only that temp project allowed. Model sees all 14 original tools. Dispatch executes only read_text_file, read_multiple_files, list_directory, list_directory_with_sizes, directory_tree, search_files, get_file_info, list_allowed_directories. Anything else (including deprecated read_file) is wrong_tool and never dispatched; boundary remains unscored with forbidden choices flagged. Close process and remove temp fixture after each trial. Child env excludes provider secrets.

## Tasks and scoring (frozen)

- fs-overview: `Give me an overview of how this project is structured.` Pass: list_directory/list_directory_with_sizes at project root, or directory_tree at root with excludePatterns excluding node_modules contents. Otherwise fail.
- fs-tests: `Where are the test files in this project?` Pass: search_files or directory_tree at project root with excludePatterns excluding node_modules contents, or list_directory/list_directory_with_sizes directly at test/. Otherwise fail.
- fs-control (control): `Show me what's in package.json.` Pass: read_text_file at root package.json, or read_multiple_files with package.json among its paths. Otherwise fail.
- fs-boundary (unscored): `What's in the src folder?` Record chosen tool, arguments and result tokens. No contribution to verdict or scored pass counts.

Path normalization accepts absolute trial root or relative paths resolved against that root, including . and trailing slash, but rejects escapes. Paths use exact case. Exclusion passes if patterns match the node_modules directory itself OR match all its package directories (which prevents traversal into files), checked using the pinned server's own minimatch with dot:true and actual fixture names. This recognizes e.g. node_modules, **/node_modules, node_modules/** and **/node_modules/**. No guessing from prose. For successful execution, also require no isError result. Forbidden choices wrong_tool; allowlisted choice outside task alternatives wrong_tool; valid alternative failing paths/exclusion bad_args. Provider/server/count-token errors infra. Missing tool no_tool_call. No silent replacement trials.

All original tool calls and complete responses retained. Result token basis: countTokens of JSON.stringify(complete MCP callTool response), including content and structuredContent. Use countTokens endpoint, no approximate substitution. Static tool tokens: countTokens with tools minus without, identical system/user Count. context. Per-group consistency includes tool, root-normalized arguments, pass/fail and tokens; all disagreements flagged. Fresh temp path differences are normalized only for consistency, never before execution.

## Candidate (exact description-only changes)

Keep original directory_tree description and append exactly:

` Returns the entire recursive tree; on code projects it can be extremely large (hundreds of thousands of tokens when node_modules or .git are included). Use excludePatterns such as ["node_modules", ".git"], or list_directory for a top-level view.`

Set both directory_tree.excludePatterns and search_files.excludePatterns description exactly to:

`Names or glob patterns to skip, e.g. node_modules, .git, dist. Strongly recommended on code projects.`

No other metadata changes. Before model calls, source fidelity must compile a copy of src/filesystem with those edits, start it, and assert exact tools/list equality with candidate (all 14 tools/all non-description metadata identical). Enforce dispatch with forbidden write_file and read_file stub checks before model calls.

## Verdict (ordered spec rules, scored tasks only)

Infra excluded from passed/of. More than one infra in either condition makes a task insufficient_data. Regressed first if a sufficient-data control falls or any sufficient-data task falls by >=2. Otherwise Inconclusive if any scored task insufficient. Otherwise Improved only if no scored task falls and a non-control rises by >=2. Otherwise Inconclusive. Tokens do not decide verdict. Always label: Provisional: 3 trials per condition. A demonstration, not a statistical claim.

Report all 24 trials, summaries and tokens, 8 consistency groups, static tokens, failures and verdict in docs/filesystem-results.md. If baseline passes, say so honestly. Do not begin Yahoo Finance without user's go-ahead.
