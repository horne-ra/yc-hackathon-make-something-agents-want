// Development-only adapter: freeze recorded S3 data into the S5 file contracts.
// Core is deliberately loaded from an external checkout until checkpoint merge.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const [coreRoot, gateFile, toolsSource] = process.argv.slice(2);
if (!coreRoot || !gateFile || !toolsSource) throw new Error("Usage: tsx viewer/create-fixture.ts <core-checkout> <recorded-gate-result.json> <trackr-tools.ts>");
const load = (name:string) => import(pathToFileURL(path.resolve(coreRoot,"src/core",name+".ts")).href);
const [contracts,tools,scoring,verdict,auditModule,sourceModule] = await Promise.all([load("contracts"),load("tools"),load("scoring"),load("verdict"),load("audit"),load("source-edits")]);
const gate = JSON.parse(fs.readFileSync(gateFile,"utf8"));
const tasks = gate.tasks.map((task:any)=>({...task,control:task.control===true}));
const findings = auditModule.auditTools(gate.baseline_tools);
const baselineHash = tools.hashTools(gate.baseline_tools), candidateHash=tools.hashTools(gate.candidate_tools);
const audit = {audit_id:"fixture-audit-trackr",server_url:gate.provenance.server_url,server_version:gate.server_identity.version,tools_hash:baselineHash,static_tool_tokens:gate.static_tool_tokens.baseline,tools:gate.baseline_tools.map((tool:any)=>({name:tool.name,description_chars:(tool.description??"").length,params:auditModule.parameterSummaries(tool)})),findings};
const ops = gate.provenance.patch.map((op:any,index:number)=>({...op,finding_ids:[index<2?"F1":index===2?"F2":"F3"]}));
const edits = sourceModule.generateSourceEdits([{path:"src/tools.ts",content:fs.readFileSync(toolsSource,"utf8")}],ops);
const patch={patch_id:"fixture-compact-patch",base_server_version:gate.server_identity.version,base_tools_hash:baselineHash,base_source_hashes:edits.base_source_hashes,candidate_tools:gate.candidate_tools,candidate_tools_hash:candidateHash,wire_ops:ops,source_edits:edits.source_edits,unified_diff:edits.unified_diff,static_tool_tokens:{before:gate.static_tool_tokens.baseline,after:gate.static_tool_tokens.candidate}};
const resultTasks = tasks.map((task:any)=>{
  const trials=gate.trials.filter((trial:any)=>trial.task_id===task.id).map((trial:any)=>{
    const call=trial.tool?{name:trial.tool,arguments:trial.arguments}:null;
    const score=scoring.scoreTrial(task,call,trial.failure==="infra"?"Recorded infrastructure error":undefined);
    if(score.passed!==trial.passed || score.failure!==trial.failure) throw new Error("Recorded score does not match core: "+task.id);
    return {condition:trial.condition,index:trial.trial,...score,chosen_tool:trial.tool,args:trial.arguments,explanation:scoring.explain(task,call,findings),model_text:trial.model_text||null,input_tokens:trial.input_tokens,output_tokens:trial.output_tokens,result_tokens:trial.result_tokens,result_tokens_approximate:trial.result_tokens_approximate,latency_ms:0};
  }).sort((a:any,b:any)=>a.index-b.index || a.condition.localeCompare(b.condition));
  const baseline=trials.filter((trial:any)=>trial.condition==="baseline"),candidate=trials.filter((trial:any)=>trial.condition==="candidate");
  return {id:task.id,control:task.control,baseline:verdict.summarizeCondition(baseline),candidate:verdict.summarizeCondition(candidate),representative:{baseline_trial:verdict.representativeTrial(baseline),candidate_trial:verdict.representativeTrial(candidate)},trials};
});
const total=(condition:string)=>{const trials=resultTasks.flatMap((task:any)=>task.trials).filter((trial:any)=>trial.condition===condition);return {passed:trials.filter((trial:any)=>trial.passed).length,of:trials.filter((trial:any)=>trial.failure!=="infra").length,result_tokens:trials.reduce((sum:number,trial:any)=>sum+trial.result_tokens,0)}};
const result={run_id:"fixture-recorded-trackr",provisional:true,label:gate.label,config:{model:gate.model,trials:3,server_version:gate.server_identity.version,tasks_hash:tools.hashJson({tasks}),baseline_tools_hash:baselineHash,candidate_tools_hash:candidateHash},candidate_tools:gate.candidate_tools,static_tool_tokens:{baseline:gate.static_tool_tokens.baseline,candidate:gate.static_tool_tokens.candidate},tasks:resultTasks,totals:{baseline:total("baseline"),candidate:total("candidate")},...verdict.evaluateVerdict(resultTasks)};
const progress={status:"running",progress:{done:8,total:24}};
const confirm={match:true,gates:{run_approved:true,same_deployment:true,revision_updated:true,metadata_match:true},live_server_version:"trackr-demo-001@fixture-candidate",live_tools_hash:candidateHash,verified_tools_hash:candidateHash,diffs:[]};
const provenance={kind:"recorded-gate-fixture",source:path.basename(path.dirname(gateFile))+"/result.json",note:"Trial choices, arguments, scores and token counts are recorded S3 data. Latency was not recorded by the S3 harness; required latency_ms is zero in the fixture only and is never displayed. Confirm gates are illustrative layout data, not an applied patch or real confirmation.",tasks,baseline_tools:gate.baseline_tools};
for(const [name,schema,value] of [["audit",contracts.AuditSchema,audit],["patch",contracts.PatchSpecSchema,patch],["result",contracts.VerificationResultSchema,result],["progress",contracts.GetVerificationResultOutputSchema,progress],["confirm",contracts.ConfirmPatchOutputSchema,confirm]] as const){schema.parse(value);fs.mkdirSync("viewer/fixtures",{recursive:true});fs.writeFileSync(`viewer/fixtures/${name}.json`,JSON.stringify(value,null,2)+"\n");}
fs.writeFileSync("viewer/fixtures/provenance.json",JSON.stringify(provenance,null,2)+"\n");
console.log(`PASS recorded fixture: ${resultTasks.length} tasks, ${resultTasks.flatMap((task:any)=>task.trials).length} real trials, ${result.totals.baseline.passed}/12 → ${result.totals.candidate.passed}/12, ${result.verdict}; all five file contracts validate against external core checkout`);
