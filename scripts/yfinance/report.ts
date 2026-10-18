/** Offline, preserves every row and applies the existing ordered verdict. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {evaluateVerdict} from '../../src/core/verdict.js';
import {ROOT,REPO,PIN,DATE_CONTEXT,json,environment,save,hash,stable,redact,inspectResponse} from './common.js';
const env=await environment(),r=await json(`${ROOT}/frozen/registration.json`),run=await json(`${ROOT}/run/result.json`),setup=await json(`${ROOT}/setup/result.json`),manifest=await json(`${ROOT}/frozen/hashes.json`);
for(const f of manifest.files)assert.equal(hash(await readFile(`${REPO}/${f.path}`)),f.sha256,'Frozen file drift');
assert.equal(run.manifest_sha256,hash(await readFile(`${ROOT}/frozen/hashes.json`)));assert.equal(run.source_pin,PIN);
execFileSync('git',['-C',REPO,'merge-base','--is-ancestor',setup.registration_commit,run.frozen_commit]);
const complete=run.status==='complete'&&run.trials.length===24;
const groups:any[]=[],consistency:any[]=[];
const infrastructure=(t:any)=>!!t.error||['transport_error','mcp_error','server_text_error'].includes(t.execution_status);
for(const task of r.tasks){const grouped:any={id:task.id,control:task.control};
 for(const condition of['baseline','candidate']){const rows=run.trials.filter((t:any)=>t.task_id===task.id&&t.condition===condition),valid=rows.filter((t:any)=>!infrastructure(t));
  grouped[condition]={passed:valid.filter((t:any)=>t.passed).length,of:valid.length,infra_errors:rows.length-valid.length,insufficient_data:rows.length!==3||rows.length-valid.length>1};
  const disagreement=(fn:(t:any)=>any)=>new Set(rows.map((t:any)=>stable(fn(t)))).size>1;
  const flags={call_disagreement:disagreement(t=>t.proposed_calls.map((c:any)=>({name:c.name,args:c.input}))),outcome_disagreement:disagreement(t=>({pass:t.passed,failure:t.failure,execution:t.execution_status})),token_disagreement:disagreement(t=>t.result_tokens?.tokens??null)};
  consistency.push({task_id:task.id,condition,trials:rows.length,...flags,disagree:Object.values(flags).some(Boolean)});
 }groups.push(grouped);
}
const verdict=evaluateVerdict(groups);const gaps:any[]=[],pids:number[]=[];let returned=0,counted=0,redactions=0,priorFinished=0,callCount=0,protocolWarnings=0;
for(let i=0;i<run.trials.length;i++){
 const t=run.trials[i],plan=r.schedule[i];assert.equal(t.index,i+1);for(const k of['task_id','condition','trial'])assert.equal(t[k],plan[k]);assert.equal(t.date_context,DATE_CONTEXT);
 assert.equal(redact(t,env).redactions,0);assert(t.model_attempts<=1);
 const task=r.tasks.find((x:any)=>x.id===t.task_id);assert.equal(task.prompt,t.prompt);
 const started=Date.parse(t.started_at);if(priorFinished){const gap=(started-priorFinished)/1000;gaps.push(gap);assert(gap>=1,'Trial spacing rule violated');}priorFinished=Date.parse(t.finished_at);
 const process=await json(`${ROOT}/run/trial-${i+1}-process/process.json`);assert.equal(process.transport_pid,t.process_pid);if(t.process_pid)pids.push(t.process_pid);protocolWarnings+=process.protocol_errors.length;
 const expectedTools=await json(`${ROOT}/frozen/${t.condition==='baseline'?'baseline':'candidate'}-tools.json`);
 const metadata=await json(`${ROOT}/run/trial-${i+1}-process/metadata.json`);assert.equal(stable(metadata.tools),stable(expectedTools));
 const calls=process.requests.filter((q:any)=>q.method==='tools/call');assert(calls.length<=1);assert.equal(calls.length,t.executed?1:0);callCount+=calls.length;
 if(t.response_file){const response=await json(`${ROOT}/run/${t.response_file}`);assert.equal(hash(JSON.stringify(response.data)),t.response_sha256);assert.equal(redact(response.data,env).redactions,0);assert.equal(stable(inspectResponse(response.data)),stable(t.observed));returned++;redactions+=response.redactions;
  if(t.result_token_status==='provider_countTokens'){assert(Number.isInteger(t.result_tokens.tokens)&&t.result_tokens.tokens>=0);assert.equal(t.result_tokens.approximate,false);counted++;}
 }
}
assert.equal(new Set(pids).size,pids.length,'A process was reused');
const rowsFor=(condition:string)=>run.trials.filter((t:any)=>t.condition===condition);
const totals=(rows:any[])=>({trials:rows.length,passes:rows.filter(t=>t.passed).length,routing_passes:rows.filter(t=>t.routing_pass).length,infra_errors:rows.filter(infrastructure).length,result_tokens:rows.reduce((n,t)=>n+(t.result_tokens?.tokens??0),0),counts:rows.filter(t=>t.result_token_status==='provider_countTokens').length});
const summary={status:run.status,complete,...verdict,source_pin:PIN,setup_registration_commit:setup.registration_commit,frozen_commit:run.frozen_commit,groups,consistency,baseline:totals(rowsFor('baseline')),candidate:totals(rowsFor('candidate')),verification:{frozen_hashes_match:true,all_trial_rows_retained:run.trials.length,planned_trials:24,unique_fresh_processes:new Set(pids).size,minimum_trial_gap_seconds:gaps.length?Math.min(...gaps):null,at_most_one_target_call_per_trial:true,target_trial_calls:callCount,full_responses:returned,response_token_counts:counted,response_count_errors:returned-counted,response_redactions:redactions,all_nine_tools_visible:true,date_context_identical:true,protocol_warnings_retained:protocolWarnings,time_box_start:r.started_at,deadline:r.deadline,finished_at:run.finished_at,completed_before_deadline:Date.parse(run.finished_at)<=Date.parse(r.deadline)},setup:setup.calls.map((x:any)=>({id:x.id,arguments:x.arguments,observed:x.observed,tokens:x.token_count?.tokens??null})),unknown_argument_behavior:setup.unknown_argument_behavior,source_fidelity:'exact tools/list and AST identity except the one decorator description'};
await save(`${ROOT}/summary.json`,summary);
const esc=(v:any)=>String(v??'—').replaceAll('|','\\|').replaceAll('\n',' '),fmt=(x:any)=>typeof x==='number'?x.toLocaleString('en-US'):'unavailable';
const label=verdict.verdict[0]!.toUpperCase()+verdict.verdict.slice(1),baseline=summary.baseline,candidate=summary.candidate;
const lines=['# Yahoo Finance results','',
 `**${label}.** Baseline **${baseline.passes}/${baseline.trials}** complete first-call passes; candidate **${candidate.passes}/${candidate.trials}**. Routing/argument passes ${baseline.routing_passes}/${baseline.trials} → ${candidate.routing_passes}/${candidate.trials}. **Provisional: 3 trials per task and condition, not a statistical claim.**`, '',
 ...(baseline.trials===12&&baseline.passes===12?['**The baseline already passes every task. That is a valid result; these trials establish no selection improvement from the candidate.**','']:[]),
 `Ordered verdict follows the unchanged [core rules](../src/core/verdict.ts): regression first, insufficient data second, then nonnegative task deltas with at least a two-pass non-control gain for Improved. ${verdict.verdict_reasons.join('; ')}. Returned-token differences alone cannot make Improved.`, '',
 '## Source, context and prior evidence','',
 `Pinned current repository commit: [${PIN}](https://github.com/Alex2Yang97/yahoo-finance-mcp/tree/${PIN}). Runtime: Python 3.14.6, MCP 2.1.0, yfinance 1.6.0, exact upstream uv.lock; stdio via uv. Nine source-reviewed read-only tools visible in both conditions. No read-only annotations were invented: this source exports none, and the explicit allowlist is enforced at dispatch.`, '',
 'The [SAIL paper, v3 §2](https://arxiv.org/html/2602.14878v3#S2) uses ambiguous date-range guidance as its motivating example. This run tests current pinned source with a description-only change. It does not add the date parameters available in the paper’s fork and is not a reproduction of the paper’s full evaluation.', '',
 `Initial setup registration: [${setup.registration_commit.slice(0,7)}](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/${setup.registration_commit}), before any target/provider call. Final freeze: [${run.frozen_commit.slice(0,7)}](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/${run.frozen_commit}), before generation. Both conditions received exactly: **${run.date_context}** [Pre-registration](yfinance-preregistration.md) · [Frozen hashes](../scripts/yfinance/frozen/hashes.json).`, '',
 `Time box: ${r.started_at} to ${r.deadline} (45 minutes). Finished ${run.finished_at}; ${summary.verification.completed_before_deadline?'within the time box':'deadline exceeded; retain this deviation'}. All timestamps in evidence are UTC; the date context is America/Los_Angeles.`, '',
 '## Confirmed mismatch and one unknown-argument probe','',
 'The description says “Either Use period parameter or use start and end,” but the function signature and tools/list accept only ticker, period and interval. The single registered probe supplied AAPL, period=1mo, interval=1d, start=2025-01-01, end=2025-03-31.', '',
 `Observed behavior: **${setup.unknown_argument_behavior==='accepted_without_error'?'silent ignore of unsupported start/end':'error'}**. The probe returned ${setup.calls[0].observed?.rows??'unknown'} rows spanning ${setup.calls[0].observed?.first_date??'unknown'} to ${setup.calls[0].observed?.last_date??'unknown'}; it did not enforce the requested Q1 2025 bounds. No repeat probe was made. [Complete setup evidence](../scripts/yfinance/setup/result.json).`, '',
 '## Real row/token comparison and source fidelity','',
 '| Setup | Rows | Full-response input tokens |','|---|---:|---:|',
 ...setup.calls.slice(1).map((x:any)=>`| NVDA 5y, ${x.arguments.interval} | ${fmt(x.observed?.rows)} | ${fmt(x.token_count?.tokens)} |`),'',
 'Counts use the entire serialized MCP response, including both content and structuredContent when returned, through Anthropic countTokens. They are not the raw JSON string alone, a character estimate, or model-generated output tokens. Counts vary with live data and response formatting. The returned result is not fed back to the generation model.', '',
 'Only the historical-price tool description changes: it removes false date-range guidance, names the three real arguments, explains covering periods and row resolution, includes the measured example above, and recommends weekly/monthly observations for broad trends. All defaults, schemas, annotations, other descriptions, and executable behavior are unchanged. The actual hand-edited server exported the exact candidate tools/list; AST comparison matched after masking only that decorator description. [Patch](../scripts/yfinance/candidate-patch.json) · [Source edit](../scripts/yfinance/source-edit.json) · [Fidelity proof](../scripts/yfinance/source-fidelity/result.json).', '',
 '## Natural tasks and exact results','',
 'Y2/Y3 ask for overall trends, which weekly/monthly observations can answer. Y1 asks for dates expressible only through a covering period. As of October 17, 2026, 2y is the smallest documented period covering Q1 2025; 1y misses it. Wider covering periods pass Y1; its interval is unscored. No prompt names a tool or parameter. We score first-call selection/arguments, not investment advice or final-answer quality.', '',
 '| Task | Exact prompt | Baseline | Candidate |','|---|---|---:|---:|',
 ...r.tasks.map((t:any)=>{const g=groups.find(x=>x.id===t.id);return`| ${t.control?'Control':t.id} | ${esc(t.prompt)} | ${g.baseline.passed}/${g.baseline.of}${g.baseline.infra_errors?' + '+g.baseline.infra_errors+' infra':''} | ${g.candidate.passed}/${g.candidate.of}${g.candidate.infra_errors?' + '+g.candidate.infra_errors+' infra':''} |`;}),'',
 ...r.tasks.filter((t:any)=>!t.control).map((t:any)=>{const bs=rowsFor('baseline').filter((x:any)=>x.task_id===t.id),cs=rowsFor('candidate').filter((x:any)=>x.task_id===t.id);return`${t.id}: baseline arguments ${esc(JSON.stringify(bs.map((x:any)=>x.arguments)))}; candidate arguments ${esc(JSON.stringify(cs.map((x:any)=>x.arguments)))}. Baseline already met the selection predicate in ${bs.filter((x:any)=>x.routing_pass).length}/${bs.length} trials.`;}),'',
 '## Every trial in execution order','',
 'Complete pass additionally requires no transport, MCP, or explicit server-text error. Empty successful responses are marked but do not establish usable data. All failures, unsupported arguments, warnings and count errors remain in evidence; no retries or replacement trials were run.', '',
 '| Order | Task | Condition | Replicate | Tool/proposed tools | Arguments | Dispatch | Verdict | Rows | Full-response tokens | Evidence |','|---:|---|---|---:|---|---|---|---|---:|---:|---|',
 ...run.trials.map((t:any)=>`| ${t.index} | ${t.control?'Control':t.task_id} | ${t.condition} | ${t.trial} | ${esc(t.selected_tool??t.proposed_calls.map((c:any)=>c.name).join('; '))} | ${esc(JSON.stringify(t.arguments??t.proposed_calls.map((c:any)=>({name:c.name,args:c.input}))))} | ${t.dispatch} | ${t.passed?'pass':'fail: '+t.failure}${t.observed?.empty?' (empty)':''} | ${fmt(t.observed?.rows)} | ${fmt(t.result_tokens?.tokens)} | [trial](../scripts/yfinance/run/trial-${t.index}.json) |`),'',
 '## Consistency and cost','',
 '| Task | Condition | Tool/args disagree | Outcomes disagree | Tokens disagree |','|---|---|---|---|---|',
 ...consistency.map(x=>`| ${x.task_id} | ${x.condition} | ${x.call_disagreement} | ${x.outcome_disagreement} | ${x.token_disagreement} |`),'',
 `Returned-context totals: baseline **${fmt(baseline.result_tokens)}** across ${baseline.counts} counted responses; candidate **${fmt(candidate.result_tokens)}** across ${candidate.counts}. ${returned-counted} response counts unavailable; no approximate counts. Static tool-definition tokens are separate: baseline ${run.static_tool_tokens?.baseline??'unavailable'}, candidate ${run.static_tool_tokens?.candidate??'unavailable'}.`, '',
 'These small live-data observations do not establish general reliability, final-answer quality, causality, or end-to-end/invoiced cost. Wider coverage and finer resolution can be correct for other tasks. Source fidelity proves metadata reproduction, not improved behavior; the ordered trial verdict supplies the behavioral result.', '',
 '## Protocol and retention checks','',
 `Fresh processes: ${new Set(pids).size}/${run.trials.length}; minimum gap after the prior trial closed: ${summary.verification.minimum_trial_gap_seconds?.toFixed(3)??'unavailable'}s. All nine tools and the same date context were verified. ${counted}/${returned} complete returned responses have provider counts. ${redactions} response redactions. All frozen hashes match. ${protocolWarnings} startup/protocol warnings were retained; the unmodified server’s stdout banner can trigger an invalid-JSON warning without preventing the result. No baseline logic was silently patched.`, '',
 'The first default uv attempt selected an incompatible Python 3.14.3; the old uv also lacked a Python 3.14.6 download. Isolated uv 0.13.1 installed the required interpreter and locked dependencies; the original uv 0.10.6 then launched the server unchanged. These setup failures are recorded, and no model was substituted.', '',
 '[Full run](../scripts/yfinance/run/result.json) · [Machine summary and verification](../scripts/yfinance/summary.json) · [Source snapshots and license](../scripts/yfinance/source/) · [All setup responses](../scripts/yfinance/setup/). Manufact artifacts remain ignored and private.',''];
await writeFile(`${REPO}/docs/yfinance-results.md`,lines.map(x=>x.trimEnd()).join('\n').trimEnd()+'\n');
console.log(JSON.stringify({status:'report_verified',complete,trials:run.trials.length,verdict:verdict.verdict,baseline:baseline.passes,candidate:candidate.passes,counts:counted,report:'docs/yfinance-results.md'}));
