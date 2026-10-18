# End-to-end filesystem experiment

Baseline completed 3/3 trials using 86,707 reported input tokens; the frozen candidate completed 3/3 using 87,731. Both conditions independently excluded `node_modules` and `.git` and answered in two turns, so the patch showed no completion gain in this run.

## Protocol

Exact task: **Give me an overview of how this project is structured.** Model: `claude-sonnet-5-5`, from AXLINT_MODEL, default sampling with no temperature/top_p/top_k; max_tokens 4096 per response, up to eight attempted API turns. All 14 tools were model-visible; all ten read-only tools could execute, while the four write tools were blocked at dispatch.

The [pre-registration](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/../preregistration.md) was committed as `0c503536dbfba7a620d24acddbdeca949caab34b` before model calls; the frozen harness and no-model preparation were committed as `316baf6d7cba35fe7d61859aaab169c8ed4d101f`. Order: baseline-1, candidate-1, candidate-2, baseline-2, baseline-3, candidate-3. Model run: 2026-10-18T04:15:37.251Z–2026-10-18T04:17:12.841Z; the full 60-minute session was bounded by 2026-10-18T04:10:03Z–2026-10-18T05:10:03Z.

Official filesystem server: `bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`; Commander.js: `e6f56c888c96d1339c2b974fee7e6ba4f2e3d218` (v13.1.0), matching the earlier real-repository size check. npm ci exited 0, left the pinned lock unchanged (SHA-256 `aa6f6ec42ef38d4d533e442274e3ae3f53f7c3e65e660050c4fc3d06f2b77331`), and installed the template once. Every trial copied its entire installed tree, including node_modules and .git (9,953 regular files, 1,477 directories, 32 symlinks); byte-content inventories matched, roots and process IDs were unique, and all temporary copies/processes and the template were cleaned up.

The candidate uses exactly the frozen three description edits; the implementation and every other metadata field are identical. Tools/list matched the original 14-tool baseline before trials. Each returned MCP response was serialized in full with JSON.stringify, including both content and structuredContent, and fed back without truncation, summarization, deduplication, or context shrinking. No API request was rejected, and no retries occurred.

## Per-trial results

| Trial | Completed | Outcome | Turns attempted / responses | Input tokens | Output tokens | Total tokens | First-turn tools | Full evidence |
|---|---|---|---:|---:|---:|---:|---|---|
| baseline-1 | yes | answered | 2 / 2 | 28,901 | 1,684 | 30,585 | `directory_tree`, `read_text_file` | [raw](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/baseline-1.json), [answer](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/baseline-1-answer.txt) |
| candidate-1 | yes | answered | 2 / 2 | 29,245 | 1,910 | 31,155 | `directory_tree`, `read_text_file` | [raw](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/candidate-1.json), [answer](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/candidate-1-answer.txt) |
| candidate-2 | yes | answered | 2 / 2 | 29,245 | 1,816 | 31,061 | `directory_tree`, `read_text_file` | [raw](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/candidate-2.json), [answer](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/candidate-2-answer.txt) |
| baseline-2 | yes | answered | 2 / 2 | 28,901 | 1,673 | 30,574 | `directory_tree`, `read_text_file` | [raw](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/baseline-2.json), [answer](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/baseline-2-answer.txt) |
| baseline-3 | yes | answered | 2 / 2 | 28,905 | 1,623 | 30,528 | `directory_tree`, `read_text_file` | [raw](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/baseline-3.json), [answer](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/baseline-3-answer.txt) |
| candidate-3 | yes | answered | 2 / 2 | 29,241 | 1,694 | 30,935 | `directory_tree`, `read_text_file` | [raw](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/candidate-3.json), [answer](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/candidate-3-answer.txt) |

A turn is an attempted API request. Input/output totals sum only actual usage fields returned by successful API responses; a rejected request has null usage, so its oversized input is **not** counted as zero tokens or estimated into these totals. Repeated conversation history is counted again each time the provider reports it as input. All raw usage objects, including cache fields, are retained; total tokens = reported input_tokens + output_tokens.

| Condition | Completed | Input tokens | Output tokens | Total tokens |
|---|---:|---:|---:|---:|
| baseline | 3/3 | 86,707 | 4,980 | 91,687 |
| candidate | 3/3 | 87,731 | 5,420 | 93,151 |

Every trial made the same two first-turn calls: `directory_tree` at the trial root with `excludePatterns: ["node_modules", ".git"]`, followed by `read_text_file` on `package.json`. Both full results were returned together, and the next response was the final overview. Baseline avoided the huge tree on its own; there was no unfiltered-tree result, context-limit error, or subsequent recovery to observe. Candidate input usage was 1,024 tokens higher in aggregate (1.18%); this run supplies no evidence of a completion or input-token benefit for the patch.

## Turn-by-turn observations

### baseline-1

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,264 | 265 | tool_use | `directory_tree` 43,484; `read_text_file` 4,878 |
| 2 | 25,637 | 1,419 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### candidate-1

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,436 | 265 | tool_use | `directory_tree` 43,484; `read_text_file` 4,878 |
| 2 | 25,809 | 1,645 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### candidate-2

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,436 | 265 | tool_use | `directory_tree` 43,484; `read_text_file` 4,878 |
| 2 | 25,809 | 1,551 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### baseline-2

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,264 | 265 | tool_use | `directory_tree` 43,484; `read_text_file` 4,878 |
| 2 | 25,637 | 1,408 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### baseline-3

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,265 | 267 | tool_use | `directory_tree` 43,484; `read_text_file` 4,878 |
| 2 | 25,640 | 1,356 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### candidate-3

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,435 | 263 | tool_use | `directory_tree` 43,484; `read_text_file` 4,878 |
| 2 | 25,806 | 1,431 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

## Evidence and limits

[Manifest](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/manifest.json), [summary](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/summary.json), [npm ci log](../scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/npm-ci.log), and per-trial JSON above retain source/fixture hashes, process IDs, every call and arguments, complete responses, full conversations, per-turn actual API usage, errors, final answers, timestamps, and cleanup. Request hashes can be reconstructed from the retained conversation and frozen metadata with `node scripts/e2e-filesystem/verify.mjs scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z`.

Completed means a nonempty final text answer with end_turn and no pending tool call, without a terminal error. Read-tool errors may be recovered from. This scores completion only; usefulness and correctness of the overview were not graded. With three trials per condition, results describe this pinned fixture, model and run, with no general performance or significance claim.
