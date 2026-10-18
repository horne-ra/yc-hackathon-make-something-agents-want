# End-to-end filesystem experiment: neutral folder

Baseline completed 3/3 trials using 156,111 reported input tokens; the frozen candidate completed 3/3 using 158,662. Every baseline trial excluded `node_modules` on its own under the neutral folder name, so the revealing folder name was not necessary for that behavior in these observed trials.

## Protocol

Exact task: **Give me an overview of how this project is structured.** Model: `claude-sonnet-5-5`, from AXLINT_MODEL, default sampling with no temperature/top_p/top_k; max_tokens 4096 per response, up to eight attempted API turns. All 14 tools were model-visible; all ten read-only tools could execute, while the four write tools were blocked at dispatch.

The [pre-registration](../scripts/e2e-filesystem-neutral/preregistration.md) was committed as `ee4160c2cb28af41a621fdf249ba60e2de3ca937` before model calls; the frozen harness and no-model preparation were committed as `8f368c7ac6f2a561b803dca4a1223aca08031707`. Order: baseline-1, candidate-1, candidate-2, baseline-2, baseline-3, candidate-3. Model run: 2026-10-18T04:37:32.861Z–2026-10-18T04:39:14.792Z, within the 60-minute time box of 2026-10-18T04:34:56Z–2026-10-18T05:34:56Z.

Official filesystem server: `bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`; Commander.js: `e6f56c888c96d1339c2b974fee7e6ba4f2e3d218` (v13.1.0), matching the earlier real-repository size check. npm ci exited 0, left the pinned lock unchanged (SHA-256 `aa6f6ec42ef38d4d533e442274e3ae3f53f7c3e65e660050c4fc3d06f2b77331`), and installed the template once. Every trial copied its entire installed tree, including node_modules and .git (9,953 regular files, 1,477 directories, 32 symlinks); byte-content inventories matched, roots and process IDs were unique, and all temporary copies/processes and the template were cleaned up.

The candidate uses exactly the frozen three description edits; the implementation and every other metadata field are identical. Tools/list matched the original 14-tool baseline before trials. Each returned MCP response was serialized in full with JSON.stringify, including both content and structuredContent, and fed back without truncation, summarization, deduplication, or context shrinking. No API request was rejected, and no retries occurred.

## Per-trial results

| Trial | Completed | Outcome | Turns attempted / responses | Input tokens | Output tokens | Total tokens | First-turn tools | Full evidence |
|---|---|---|---:|---:|---:|---:|---|---|
| baseline-1 | yes | answered | 3 / 3 | 51,741 | 1,499 | 53,240 | `directory_tree` | [raw](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/baseline-1.json), [answer](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/baseline-1-answer.txt) |
| candidate-1 | yes | answered | 3 / 3 | 52,303 | 1,839 | 54,142 | `directory_tree` | [raw](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/candidate-1.json), [answer](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/candidate-1-answer.txt) |
| candidate-2 | yes | answered | 3 / 3 | 53,186 | 1,889 | 55,075 | `directory_tree` | [raw](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/candidate-2.json), [answer](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/candidate-2-answer.txt) |
| baseline-2 | yes | answered | 3 / 3 | 51,743 | 1,571 | 53,314 | `directory_tree` | [raw](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/baseline-2.json), [answer](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/baseline-2-answer.txt) |
| baseline-3 | yes | answered | 3 / 3 | 52,627 | 1,728 | 54,355 | `directory_tree` | [raw](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/baseline-3.json), [answer](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/baseline-3-answer.txt) |
| candidate-3 | yes | answered | 3 / 3 | 53,173 | 1,645 | 54,818 | `directory_tree` | [raw](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/candidate-3.json), [answer](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/candidate-3-answer.txt) |

A turn is an attempted API request. Input/output totals sum only actual usage fields returned by successful API responses; a rejected request has null usage, so its oversized input is **not** counted as zero tokens or estimated into these totals. Repeated conversation history is counted again each time the provider reports it as input. All raw usage objects, including cache fields, are retained; total tokens = reported input_tokens + output_tokens.

| Condition | Completed | Input tokens | Output tokens | Total tokens |
|---|---:|---:|---:|---:|
| baseline | 3/3 | 156,111 | 4,798 | 160,909 |
| candidate | 3/3 | 158,662 | 5,373 | 164,035 |

## Turn-by-turn observations

### baseline-1

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,265 | 151 | tool_use | `directory_tree` 43,484 |
| 2 | 22,856 | 146 | tool_use | `read_text_file` 4,878 |
| 3 | 25,620 | 1,202 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### candidate-1

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,437 | 173 | tool_use | `directory_tree` 43,484 |
| 2 | 23,050 | 148 | tool_use | `read_text_file` 4,878 |
| 3 | 25,816 | 1,518 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### candidate-2

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,438 | 174 | tool_use | `directory_tree` 43,484 |
| 2 | 23,052 | 264 | tool_use | `read_text_file` 4,878; `read_text_file` 1,746 |
| 3 | 26,696 | 1,451 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### baseline-2

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,265 | 151 | tool_use | `directory_tree` 43,484 |
| 2 | 22,856 | 148 | tool_use | `read_text_file` 4,878 |
| 3 | 25,622 | 1,272 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### baseline-3

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,266 | 152 | tool_use | `directory_tree` 43,484 |
| 2 | 22,858 | 265 | tool_use | `read_text_file` 4,878; `read_text_file` 1,746 |
| 3 | 26,503 | 1,311 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

### candidate-3

| Turn | Input tokens | Output tokens | Stop reason / error | Calls and full-result characters |
|---:|---:|---:|---|---|
| 1 | 3,437 | 170 | tool_use | `directory_tree` 43,484 |
| 2 | 23,047 | 262 | tool_use | `read_text_file` 4,878; `read_text_file` 1,746 |
| 3 | 26,689 | 1,213 | end_turn | none |

Final outcome: **answered**. No unfiltered directory_tree call was observed. The final answer is retained verbatim in the linked answer file.

## Evidence and limits

[Manifest](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/manifest.json), [summary](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/summary.json), [npm ci log](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/npm-ci.log), and per-trial JSON above retain source/fixture hashes, process IDs, every call and arguments, complete responses, full conversations, per-turn actual API usage, errors, final answers, timestamps, and cleanup. The [control proof](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/control-final.json) verifies the shared loop, protocol, original pins/runtime/metadata and neutral initial contexts; [integrity verification](../scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z/verification.json) reconstructs all 18 requests and checks all 15 complete tool results. Request hashes can be reconstructed from the retained conversation and frozen metadata with `node scripts/e2e-filesystem/verify.mjs scripts/e2e-filesystem-neutral/run-2026-10-18T04-36-20.531Z`.

Completed means a nonempty final text answer with end_turn and no pending tool call, without a terminal error. Read-tool errors may be recovered from. This scores completion only; usefulness and correctness of the overview were not graded. With three trials per condition, results describe this pinned fixture, model and run, with no general performance or significance claim.

## Neutral-folder change and comparison

Purpose: test whether the baseline's node_modules exclusion depended on the folder name revealing a known JavaScript project.

The sole experimental change was the final directory component of every trial copy: `project` instead of `commander`. The prompt, metadata, candidate descriptions, model, sampling, output budget, trial order, timeouts, dispatch and loop rules were unchanged. New evidence paths, registration pointers and session timestamps/deadlines are administrative. The same byte-identical loop module was reused. Every initial task/root message was checked for the absence of Commander; repository contents were left intact and can reveal its identity after a read.

| Run | Condition | Completed | Input tokens | Output tokens | Total tokens |
|---|---|---:|---:|---:|---:|
| Original commander folder | baseline | 3/3 | 86,707 | 4,980 | 91,687 |
| Original commander folder | candidate | 3/3 | 87,731 | 5,420 | 93,151 |
| Neutral project folder | baseline | 3/3 | 156,111 | 4,798 | 160,909 |
| Neutral project folder | candidate | 3/3 | 158,662 | 5,373 | 164,035 |

All six neutral-folder trials took three API turns, versus two in every original trial. Each first requested the excluded tree, then read `package.json` on turn two; baseline-3, candidate-2 and candidate-3 also read `index.js` on turn two. The final overview arrived on turn three. That additional request resent the tool-result history, which is included in the higher actual input totals; this observation does not establish that the folder name caused the extra turn.

### Every initial action in the neutral run

`<PROJECT>` replaces the absolute trial root for readability only. Exact arguments and paths are retained in the raw trial files.

| Trial | Initial tool calls and arguments |
|---|---|
| baseline-1 | `directory_tree {"path":"<PROJECT>","excludePatterns":["node_modules",".git"]}` |
| candidate-1 | `directory_tree {"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build",".next","venv","__pycache__"]}` |
| candidate-2 | `directory_tree {"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build",".next","venv","__pycache__"]}` |
| baseline-2 | `directory_tree {"path":"<PROJECT>","excludePatterns":["node_modules",".git"]}` |
| baseline-3 | `directory_tree {"path":"<PROJECT>","excludePatterns":["node_modules",".git"]}` |
| candidate-3 | `directory_tree {"path":"<PROJECT>","excludePatterns":["node_modules",".git","dist","build",".venv","__pycache__"]}` |

The original baseline explicitly excluded node_modules in its initial directory_tree call in all three trials. In this neutral run, 3/3 baseline trials did so in their initial directory_tree calls; the full action table above also records any alternative listing or search strategy. Across both neutral conditions, 0 entirely unfiltered directory_tree calls and 0 context_limit_error outcomes were observed. Every trial's subsequent calls, complete results and final answer or error remain in the raw evidence; the per-turn sections above flag any later directory-listing recovery.

The baseline still excluded node_modules on its own in all three neutral-folder trials. The revealing folder name was therefore not necessary for that behavior in these observed trials.

This is a later n=3 replication with provider-default sampling, not a concurrent randomized comparison of both folder names. Sampling variation and changes behind the same model ID limit causal interpretation. Completion is scored exactly as before; answer quality and correctness were not graded. No oversized request was retried, and no result was shortened to make a request fit. The [original report](e2e-filesystem.md) is preserved unchanged.
