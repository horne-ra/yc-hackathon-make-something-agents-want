// Offline conversion of the preserved live Railway gate run into core run files.
// No provider requests, model sampling or target calls occur in this adapter.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  AuditSchema, PatchSpecSchema, VerificationResultSchema,
  GetVerificationResultOutputSchema, ConfirmPatchOutputSchema,
  TasksSchema, ToolsSchema, WireOpsSchema, applyWireOps, auditTools,
  parameterSummaries, hashTools, hashJson, hashText, generateSourceEdits,
  scoreTrial, explain, summarizeCondition, representativeTrial, evaluateVerdict,
  type Trial, type TaskResult,
} from "../src/core/index.js";

const [gateFile="scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json",toolsSource="test/fixtures/trackr-tools.ts"] = process.argv.slice(2);
const raw=fs.readFileSync(gateFile,"utf8");
const gate=JSON.parse(raw);
assert.equal(gate.status,"complete");
assert.equal(gate.model,"claude-sonnet-5-5");
assert.equal(gate.temperature,"omitted; model-default sampling");
const tasks=TasksSchema.parse({tasks:gate.tasks.map((task:Record<string,unknown>)=>({...task,control:task.control===true}))}).tasks;
const baselineTools=ToolsSchema.parse(gate.baseline_tools),candidateTools=ToolsSchema.parse(gate.candidate_tools);
const findings=auditTools(baselineTools);
const baselineHash=hashTools(baselineTools),candidateHash=hashTools(candidateTools);
const runId=path.basename(path.dirname(gateFile));
const audit=AuditSchema.parse({audit_id:`audit-${runId}`,server_url:gate.provenance.server_url,server_version:gate.server_identity.version,tools_hash:baselineHash,static_tool_tokens:gate.static_tool_tokens.baseline,tools:baselineTools.map(tool=>({name:tool.name,description_chars:(tool.description??"").length,params:parameterSummaries(tool)})),findings});
const ops=WireOpsSchema.parse(gate.provenance.patch.map((op:Record<string,unknown>,index:number)=>({...op,finding_ids:[index<2?"F1":index===2?"F2":"F3"]})));
assert.equal(hashTools(applyWireOps(baselineTools,ops)),candidateHash,"Wire operations must exactly reproduce the recorded candidate");
// Remove only the Checkpoint 1 provenance header, preserving the pinned source bytes.
const source=fs.readFileSync(toolsSource,"utf8").replace(/^\/\/ Real trackr src\/tools\.ts pinned at commit 91b0484; copied at Checkpoint 1\.\n/,"");
const edits=generateSourceEdits([{path:"src/tools.ts",content:source}],ops);
const patch=PatchSpecSchema.parse({patch_id:`compact-${runId}`,base_server_version:gate.server_identity.version,base_tools_hash:baselineHash,base_source_hashes:edits.base_source_hashes,candidate_tools:candidateTools,candidate_tools_hash:candidateHash,wire_ops:ops,...edits,static_tool_tokens:{before:gate.static_tool_tokens.baseline,after:gate.static_tool_tokens.candidate}});
const resultTasks:TaskResult[]=tasks.map(task=>{
  const trials:Trial[]=gate.trials.filter((trial:{task_id:string})=>trial.task_id===task.id).map((trial:any)=>{
    const call=trial.tool?{name:trial.tool,arguments:trial.arguments}:null;
    const score=scoreTrial(task,call,trial.failure==="infra"?"Recorded infrastructure error":undefined);
    assert.equal(score.passed,trial.passed,`Recorded score changed: ${task.id}`);
    assert.equal(score.failure,trial.failure,`Recorded failure changed: ${task.id}`);
    return {condition:trial.condition,index:trial.trial,...score,chosen_tool:trial.tool,args:trial.arguments,explanation:explain(task,call,findings),model_text:trial.model_text||null,input_tokens:trial.input_tokens,output_tokens:trial.output_tokens,result_tokens:trial.result_tokens,result_tokens_approximate:trial.result_tokens_approximate,latency_ms:0};
  }).sort((a:Trial,b:Trial)=>a.index-b.index||a.condition.localeCompare(b.condition));
  const baseline=trials.filter(trial=>trial.condition==="baseline"),candidate=trials.filter(trial=>trial.condition==="candidate");
  assert.deepEqual(baseline.map(trial=>trial.index),[1,2,3]);
  assert.deepEqual(candidate.map(trial=>trial.index),[1,2,3]);
  return {id:task.id,control:task.control,baseline:summarizeCondition(baseline),candidate:summarizeCondition(candidate),representative:{baseline_trial:representativeTrial(baseline),candidate_trial:representativeTrial(candidate)},trials};
});
assert.equal(resultTasks.flatMap(task=>task.trials).length,gate.trials.length,"Every recorded trial must survive conversion");
const total=(condition:"baseline"|"candidate")=>{const trials=resultTasks.flatMap(task=>task.trials).filter(trial=>trial.condition===condition);return {passed:trials.filter(trial=>trial.passed).length,of:trials.filter(trial=>trial.failure!=="infra").length,result_tokens:trials.reduce((sum,trial)=>sum+trial.result_tokens,0)}};
const result=VerificationResultSchema.parse({run_id:runId,provisional:true,label:gate.label,config:{model:gate.model,trials:3,server_version:gate.server_identity.version,tasks_hash:hashJson({tasks}),baseline_tools_hash:baselineHash,candidate_tools_hash:candidateHash},candidate_tools:candidateTools,static_tool_tokens:{baseline:gate.static_tool_tokens.baseline,candidate:gate.static_tool_tokens.candidate},tasks:resultTasks,totals:{baseline:total("baseline"),candidate:total("candidate")},...evaluateVerdict(resultTasks)});
const progress=GetVerificationResultOutputSchema.parse({status:"running",progress:{done:8,total:gate.trials.length}});
// Explicit example data: no source patch was applied/confirmed in this recorded run.
const confirm=ConfirmPatchOutputSchema.parse({match:true,gates:{run_approved:true,same_deployment:true,revision_updated:true,metadata_match:true},live_server_version:"trackr-demo-001@example-not-an-observed-revision",live_tools_hash:candidateHash,verified_tools_hash:candidateHash,diffs:[]});
const provenance={kind:"recorded-live-run",source:path.relative(process.cwd(),path.resolve(gateFile)),source_sha256:hashText(raw),source_revision:"91b0484",source_note:"Source edits are derived from trackr src/tools.ts at Checkpoint 1 commit 91b0484. The actual benchmark server revision is preserved separately in result.config.server_version.",measured:["server_url","server_identity","baseline_tools","candidate_tools","trial tool choices and arguments","pass/fail","input_tokens","output_tokens","result_tokens","static_tool_tokens"],derived:["audit findings","source edits","checks","explanations","condition summaries","representative trials","verdict"],example_data:["progress.json is an illustrative partial playback snapshot, not observed timing","confirm.json is illustrative layout data; no patch application or confirmation occurred"],unavailable:["latency_ms was not recorded: required numeric slots are zero placeholders only, never displayed as measurements"],note:"All 24 trials, including the three baseline failures, are preserved. Replay reveals recorded trials in task/index order, not original timing. This adapter makes no new provider or target calls. Model default sampling; no temperature parameter.",tasks,baseline_tools:baselineTools};
for(const [name,value] of Object.entries({audit,patch,result,progress,confirm,provenance})){fs.mkdirSync("viewer/fixtures",{recursive:true});fs.writeFileSync(`viewer/fixtures/${name}.json`,JSON.stringify(value,null,2)+"\n")}
console.log(`PASS live run conversion: ${tasks.length} tasks, ${gate.trials.length} trials retained, 3 baseline failures; five run-file contracts validate against merged src/core`);
console.log(`PASS observed verdict: ${result.verdict}; ${result.totals.baseline.passed}/12 → ${result.totals.candidate.passed}/12; result tokens ${result.totals.baseline.result_tokens} → ${result.totals.candidate.result_tokens}; static tokens ${result.static_tool_tokens.baseline} → ${result.static_tool_tokens.candidate}`);
