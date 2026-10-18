/** Offline integrity verification and reporting; no target/provider calls. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {ROOT,json,environment,hash,save,stable,redact,responseParts} from './common.js';
import {evaluateVerdict} from '../../src/core/verdict.js';
const env=await environment(),repo=ROOT+'/../..',r=await json(`${ROOT}/frozen/registration.json`),report=await json(`${ROOT}/run/result.json`),setup=await json(`${ROOT}/setup/result.json`),manifest=await json(`${ROOT}/frozen/hashes.json`);
assert.equal(report.status,'complete');assert.equal(report.trials.length,24);assert.equal(hash(await readFile(`${ROOT}/frozen/hashes.json`)),report.frozen_manifest_sha256);
for(const f of manifest.files)assert.equal(hash(await readFile(`${repo}/${f.path}`)),f.sha256,'Frozen source changed: '+f.path);
execFileSync('git',['-C',repo,'merge-base','--is-ancestor',setup.registration_commit,report.frozen_commit]);
const requestSets=['preparation-requests.json','setup/requests.json','run/requests.json'];const rates:any[]=[];let callCount=0;
for(const file of requestSets){const requests=await json(`${ROOT}/${file}`);let min=Infinity;const violations:any[]=[];
 for(let i=0;i<requests.length;i++){const request=requests[i];assert(['GET','POST'].includes(request.http_method));assert([null,'initialize','notifications/initialized','tools/list','tools/call'].includes(request.rpc_method));if(request.rpc_method==='tools/call')callCount++;
  if(i){const seconds=(Date.parse(request.at)-Date.parse(requests[i-1].at))/1000;min=Math.min(min,seconds);if(seconds<1)violations.push({previous:i-1,next:i,seconds});}
 }rates.push({file,minimum_spacing_seconds:Number.isFinite(min)?min:null,violations});
}
assert(rates.every(x=>x.violations.length===0),'Request-spacing deviation; preserve and report before claiming protocol conformance');
const conditions=['baseline','candidate'];const groups:any[]=[];const consistency:any[]=[];
for(const task of r.tasks){const summaries:any={};
 for(const condition of conditions){const rows=report.trials.filter((t:any)=>t.task_id===task.id&&t.condition===condition);assert.equal(rows.length,3);
  const infra=(t:any)=>!!t.error||['transport_error','mcp_error'].includes(t.execution_status);
  const valid=rows.filter((t:any)=>!infra(t));const errors=rows.length-valid.length;
  summaries[condition]={passed:valid.filter((t:any)=>t.passed).length,of:valid.length,infra_errors:errors,insufficient_data:errors>1};
  const disagree=(f:(t:any)=>any)=>new Set(rows.map((t:any)=>stable(f(t)))).size>1;
  const flags={call_disagreement:disagree(t=>t.proposed_calls.map((c:any)=>({name:c.name,args:c.input}))),outcome_disagreement:disagree(t=>({passed:t.passed,failure:t.failure,execution:t.execution_status})),result_token_disagreement:disagree(t=>t.result_tokens?{text:t.result_tokens.text_tokens,image:t.result_tokens.image_tokens,total:t.result_tokens.total_tokens}:null),image_count_disagreement:disagree(t=>t.result_tokens?.images.length??null)};
  consistency.push({task_id:task.id,condition,...flags,disagree:Object.values(flags).some(Boolean)});
 }groups.push({id:task.id,control:task.control,...summaries});
}
let redactions=0,responseCount=0,counts=0;
for(let i=0;i<report.trials.length;i++){
 const t=report.trials[i],job=r.schedule[i];assert.equal(t.index,i+1);for(const k of['task_id','condition','trial'])assert.equal(t[k],job[k]);assert.equal(t.model_attempts,1);
 assert.equal(redact(t,env).redactions,0);const task=r.tasks.find((x:any)=>x.id===t.task_id);assert.equal(t.prompt,task.prompt);
 if(t.response_file){const response=await json(`${ROOT}/run/${t.response_file}`);assert.equal(redact(response.data,env).redactions,0);assert.equal(hash(JSON.stringify(response.data)),t.response_sha256);const parts=responseParts(response.data);
  responseCount++;redactions+=response.redactions;
  if(t.result_token_status==='provider_countTokens'){counts++;assert.equal(t.result_tokens.images.length,parts.images.length);assert.equal(t.result_tokens.total_tokens,t.result_tokens.text_tokens+t.result_tokens.image_tokens);assert(!parts.images.some((im:any)=>parts.text.includes(im.source.data)));}
 }
}
assert.equal(callCount,2+report.trials.filter((t:any)=>t.executed).length);
const verdict=evaluateVerdict(groups),baselineRows=report.trials.filter((t:any)=>t.condition==='baseline'),candidateRows=report.trials.filter((t:any)=>t.condition==='candidate');
const total=(rows:any[],field:string)=>rows.filter(t=>t[field]).length;
function tokenTotals(rows:any[]){return rows.reduce((sum:any,t:any)=>{if(t.result_tokens){sum.text+=t.result_tokens.text_tokens;sum.image+=t.result_tokens.image_tokens;sum.total+=t.result_tokens.total_tokens;sum.counts++;}return sum;},{text:0,image:0,total:0,counts:0});}
const summary={status:'complete',manufact:r.manufact,...verdict,provisional:true,groups,baseline:{passes:total(baselineRows,'passed'),of:12,routing_passes:total(baselineRows,'routing_pass'),result_tokens:tokenTotals(baselineRows)},candidate:{passes:total(candidateRows,'passed'),of:12,routing_passes:total(candidateRows,'routing_pass'),result_tokens:tokenTotals(candidateRows)},consistency,verification:{frozen_hashes_match:true,initial_registration_commit:setup.registration_commit,frozen_commit:report.frozen_commit,all_24_trials_retained:true,provider_attempts:24,target_tool_calls:callCount,setup_calls:2,trial_response_snapshots:responseCount,trial_token_counts:counts,response_redactions:redactions,all_images_counted_as_images:true,base64_image_data_counted_as_text:false,request_rates:rates},setup:{...r.setup_measurement,with_chart:setup.calls[0].tokens,without_chart:setup.calls[1].tokens}};
await save(`${ROOT}/summary.json`,summary);
const esc=(v:any)=>String(v??'—').replaceAll('|','\\|').replaceAll('\n',' '),taskName=(id:string)=>id==='P4-control'?'Control':id;
const fmt=(n:any)=>typeof n==='number'?n.toLocaleString('en-US'):'unavailable';
const title=verdict.verdict[0]!.toUpperCase()+verdict.verdict.slice(1);
const lines=['# PopHIVE results','',
 `**${title} — Manufact 88/A.** Imported catalog checklist score, not a per-tool documentation score. User-selected public endpoint: [PopHIVE](https://mcp.pophive.org/mcp). [Catalog evidence](../scripts/leaderboard/catalog/pophive.json). **Provisional: 3 trials per task and condition; a demonstration, not a statistical claim.**`, '',
 `Baseline: **${summary.baseline.passes}/12** complete first-call passes; candidate: **${summary.candidate.passes}/12**. Routing/argument passes: ${summary.baseline.routing_passes}/12 → ${summary.candidate.routing_passes}/12.`, '',
 ...(summary.baseline.passes===12?['**The baseline already passes everything, including explicit chart suppression for P1–P3. This is a valid result; the candidate establishes no selection improvement in this run.**','']:[]),
 `Ordered verdict uses the unchanged [core rules](../src/core/verdict.ts): regression first, insufficient data second, then nonnegative task deltas and a non-control gain of at least two passes for Improved. ${verdict.verdict_reasons.join('; ')}. Token savings alone do not make Improved.`, '',
 '## Registration and fairness','',
 `Initial setup registration was committed as [${setup.registration_commit.slice(0,7)}](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/${setup.registration_commit}) before any provider or target tool call. The final measured patch and registration were committed as [${report.frozen_commit.slice(0,7)}](https://github.com/horne-ra/yc-hackathon-make-something-agents-want/commit/${report.frozen_commit}) before generation. [Pre-registration](pophive-preregistration.md) · [Frozen hashes](../scripts/pophive/frozen/hashes.json).`, '',
 'The prompts ask for yes/no, a short list, or a single number, so a chart is unnecessary for the requested answer form. They contain no tool or parameter names. Explicit chart suppression is the user-approved predicate; this does not establish that charts or PopHIVE data are wrong. The benchmark scores first-call selection/arguments, not medical interpretation or final-answer quality. P2 top_n is recorded but unscored. Other schema-valid arguments are recorded but unscored.', '',
 '| Task | Exact natural prompt | Baseline | Candidate |','|---|---|---:|---:|',
 ...r.tasks.map((t:any)=>{const g=groups.find(x=>x.id===t.id);return`| ${taskName(t.id)} | ${esc(t.prompt)} | ${g.baseline.passed}/${g.baseline.of}${g.baseline.infra_errors?' + '+g.baseline.infra_errors+' infra':''} | ${g.candidate.passed}/${g.candidate.of}${g.candidate.infra_errors?' + '+g.candidate.infra_errors+' infra':''} |`;}),'',
 '## Paired setup — images counted as images','',
 'One registered setup experiment comprised exactly two anonymous calls: flu/TX current status with its chart default, then the same arguments with include_chart=false. Both succeeded; neither was retried. No other setup tool call was made. [Full setup results](../scripts/pophive/setup/result.json).','',
 '| Response | Non-image text/envelope tokens | Incremental image tokens | Total input tokens | PNGs |','|---|---:|---:|---:|---:|',
 ...setup.calls.map((x:any)=>`| ${x.condition} | ${fmt(x.tokens.text_tokens)} | ${fmt(x.tokens.image_tokens)} | ${fmt(x.tokens.total_tokens)} | ${x.tokens.images.length} |`),'',
 `The PNG contributes **${fmt(setup.measured_image_tokens)} image-input tokens**. The non-image text/envelope difference is **${fmt(setup.non_image_text_difference)}**; the complete mixed-response difference is **${fmt(setup.total_difference)} tokens**. The six include_chart descriptions say “about ${setup.patch_about_n_tokens} image-input tokens” and explicitly limit that estimate to this one status-chart example; actual chart costs vary with dimensions/content. [Exact six-description patch](../scripts/pophive/frozen/candidate-patch.json). All defaults, schema constraints, other descriptions, names, annotations, and runtime behavior are unchanged.`, '',
 'Full-response accounting recursively replaces each image block’s base64 data with a numbered image reference in the complete MCP JSON envelope, retaining other content, structuredContent, and metadata. The image bytes are attached to countTokens as native image content parts. Text tokens are the envelope-only input count, including message overhead; image tokens are the mixed count minus that text-only count. Base64 image data is never tokenized as text. These are potential returned-context counts; tool responses are not fed back to the generation model. No approximate counts are used.', '',
 '## All 24 trials, in execution order','',
 'Complete pass requires the approved routing/argument predicate and a successful tool response. Wrong tool, omitted/true chart flag for P1–P3, absent/multiple calls, bad arguments, transport/MCP errors, and blocked calls remain in the evidence. Empty successful data does not establish answer correctness. Every proposed call is retained even when dispatch is blocked.','',
 '| Order | Task | Condition | Replicate | Tool / proposed tools | Arguments | Dispatch | Verdict | Text tokens | Image tokens | Total | Evidence |','|---:|---|---|---:|---|---|---|---|---:|---:|---:|---|',
 ...report.trials.map((t:any)=>`| ${t.index} | ${taskName(t.task_id)} | ${t.condition} | ${t.trial} | ${esc(t.selected_tool??t.proposed_calls.map((c:any)=>c.name).join('; '))} | ${esc(JSON.stringify(t.arguments??t.proposed_calls.map((c:any)=>({tool:c.name,args:c.input}))))} | ${t.dispatch} | ${t.passed?'pass':'fail: '+t.failure} | ${fmt(t.result_tokens?.text_tokens)} | ${fmt(t.result_tokens?.image_tokens)} | ${fmt(t.result_tokens?.total_tokens)} | [trial](../scripts/pophive/run/trial-${t.index}.json) |`),'',
 '## Consistency and context cost','',
 '| Task | Condition | Tool/arguments disagree | Verdicts disagree | Token tuple disagrees | Image count disagrees |','|---|---|---|---|---|---|',
 ...consistency.map(x=>`| ${taskName(x.task_id)} | ${x.condition} | ${x.call_disagreement} | ${x.outcome_disagreement} | ${x.result_token_disagreement} | ${x.image_count_disagreement} |`),'',
 '| Condition | Counted responses | Text/envelope tokens | Image tokens | Total mixed tokens |','|---|---:|---:|---:|---:|',
 ...['baseline','candidate'].map(c=>{const t=(summary as any)[c].result_tokens;return`| ${c} | ${t.counts} | ${fmt(t.text)} | ${fmt(t.image)} | ${fmt(t.total)} |`;}),'',
 `Static tool-definition tokens, reported separately: baseline ${report.static_tool_tokens.baseline}; candidate ${report.static_tool_tokens.candidate}. ${counts}/${responseCount} returned trial responses have provider counts; ${responseCount-counts} counts unavailable. ${redactions} response redactions. No secret values are reported.`, '',
 'Response changes across tasks or time and different chart dimensions limit interpretation of aggregate token differences. These counts are not end-to-end agent cost, invoiced dollars, response latency improvements, or proof of general reliability. No final answer is generated or scored. All errors and disagreements remain visible.', '',
 '## Dispatch, spacing and retention','',
 `All seven frozen tools were visible in both conditions. The same allowlist was enforced at dispatch, with readOnlyHint true and destructiveHint true excluded. There was at most one target call per trial, concurrency 1, provider-default sampling with no temperature, no retries or replacement trials, and the same configured model (${report.model}). Frozen metadata was rechecked before setup and trials.`, '',
 `Request spacing passed across preparation, setup, and execution; observed minimums: ${rates.map(x=>x.file+' '+x.minimum_spacing_seconds.toFixed(3)+'s').join('; ')}. Startup GET/SSE requests use the same serialized reservation queue. All frozen hashes match. Setup and trial outputs are public aggregate data; no target credentials were used. Manufact outputs remain private.`, '',
 '[Complete run](../scripts/pophive/run/result.json) · [Machine summary and verification](../scripts/pophive/summary.json) · [Request log](../scripts/pophive/run/requests.json) · [Full responses and model outputs](../scripts/pophive/run/).',''];
await writeFile(`${repo}/docs/pophive-results.md`,lines.map(x=>x.trimEnd()).join('\n')+'\n');
console.log(JSON.stringify({status:'report_verified',verdict:verdict.verdict,baseline:summary.baseline.passes,candidate:summary.candidate.passes,trials:24,response_token_counts:counts,report:'docs/pophive-results.md'}));
