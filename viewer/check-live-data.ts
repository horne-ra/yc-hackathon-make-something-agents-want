// Check the converted preview against the immutable original, not expected UI alone.
import assert from "node:assert/strict";
import fs from "node:fs";
import {AuditSchema,PatchSpecSchema,VerificationResultSchema,GetVerificationResultOutputSchema,ConfirmPatchOutputSchema,hashText} from "../src/core/index.js";
import {fixturePresentation} from "./presentation.js";
const read=(name:string)=>JSON.parse(fs.readFileSync(`viewer/fixtures/${name}.json`,"utf8"));
const provenance=read("provenance"),raw=fs.readFileSync(provenance.source,"utf8"),gate=JSON.parse(raw);
assert.equal(hashText(raw),provenance.source_sha256);
AuditSchema.parse(read("audit"));PatchSpecSchema.parse(read("patch"));
const result=VerificationResultSchema.parse(read("result"));
GetVerificationResultOutputSchema.parse(read("progress"));ConfirmPatchOutputSchema.parse(read("confirm"));
const converted=result.tasks.flatMap(task=>task.trials.map(trial=>({task_id:task.id,...trial})));
assert.equal(converted.length,gate.trials.length);
for(const original of gate.trials){
  const trial=converted.find(item=>item.task_id===original.task_id&&item.condition===original.condition&&item.index===original.trial);
  assert(trial,`Missing ${original.task_id}/${original.condition}/${original.trial}`);
  assert.deepEqual({tool:trial.chosen_tool,args:trial.args,passed:trial.passed,failure:trial.failure,input:trial.input_tokens,output:trial.output_tokens,result:trial.result_tokens,approximate:trial.result_tokens_approximate},{tool:original.tool,args:original.arguments,passed:original.passed,failure:original.failure,input:original.input_tokens,output:original.output_tokens,result:original.result_tokens,approximate:original.result_tokens_approximate});
}
assert.equal(converted.filter(trial=>!trial.passed).length,3);
assert.deepEqual(result.totals,{baseline:{passed:9,of:12,result_tokens:115194},candidate:{passed:12,of:12,result_tokens:13272}});
assert.deepEqual(result.static_tool_tokens,{baseline:651,candidate:837});
assert.equal(result.verdict,"improved");
assert(!Object.hasOwn(result.config,"temperature"));
const preview=fixturePresentation("complete"),payload=preview.tasks.find(task=>task.id==="t3-payload")!;
for(const condition of ["baseline","candidate"] as const){
  const representative=condition==="baseline"?payload.representative.baseline_trial:payload.representative.candidate_trial;
  const trial=payload.trials.find(item=>item.condition===condition&&item.index===representative)!;
  assert.equal(trial.tool,"list_issues");assert.equal(trial.resultTokens,condition==="baseline"?10408:441);
  if(condition==="baseline")assert(!Object.hasOwn(trial.args,"include_comments"));else assert.equal(trial.args.include_comments,false);
}
assert(preview.reasons.some(reason=>reason.includes("−88.5%")));
assert(preview.reasons.some(reason=>reason.includes("651 → 837")));
assert(preview.reasons.some(reason=>reason.includes("hypotheses were rejected")));
assert(provenance.example_data.some((value:string)=>value.includes("confirm.json")));
assert(provenance.unavailable.some((value:string)=>value.includes("latency_ms")));
console.log("PASS merged core contracts: audit, patch, result, progress, confirm; original source hash unchanged");
console.log("PASS 24/24 original trials preserved exactly: tools, arguments, outcomes, input/output/result tokens; all 3 failures visible");
console.log("PASS spotlight t3-payload: list_issues omitted include_comments = 10408; explicit false = 441 result tokens");
console.log("PASS verdict Improved: 9/12 → 12/12; 115194 → 13272 (−88.5%); static651 → 837; rejected hypotheses explicit");
console.log("PASS provenance: live source/revision retained; example partial progress/confirm identified; latency unavailable; temperature omitted");
