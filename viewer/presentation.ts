import { z } from "zod";
import auditFile from "./fixtures/audit.json" with {type:"json"};
import patchFile from "./fixtures/patch.json" with {type:"json"};
import resultFile from "./fixtures/result.json" with {type:"json"};
import provenance from "./fixtures/provenance.json" with {type:"json"};
import confirmFile from "./fixtures/confirm.json" with {type:"json"};

const summary = z.object({passed:z.number(),of:z.number(),result_tokens:z.number()});
const trial = z.object({condition:z.enum(["baseline","candidate"]),index:z.number(),passed:z.boolean(),failure:z.string().nullable(),tool:z.string().nullable(),args:z.record(z.string(),z.unknown()),explanation:z.string(),resultTokens:z.number(),order:z.number()});
export const RunPresentationSchema = z.object({
  fixture:z.boolean(),phase:z.enum(["running","complete"]),progress:z.object({done:z.number(),total:z.number()}),
  runId:z.string(),model:z.string(),serverVersion:z.string(),provisionalLabel:z.string(),
  audit:z.object({findingCount:z.number(),tools:z.array(z.object({name:z.string(),description:z.string(),findings:z.array(z.object({id:z.string(),severity:z.string(),message:z.string(),param:z.string().nullable()}))}))}),
  patch:z.array(z.object({target:z.string(),before:z.string(),after:z.string(),findingIds:z.array(z.string())})),
  tasks:z.array(z.object({id:z.string(),prompt:z.string(),control:z.boolean(),representative:z.object({baseline_trial:z.number().nullable(),candidate_trial:z.number().nullable()}),trials:z.array(trial)})),
  totals:z.object({baseline:summary,candidate:summary}),staticTokens:z.object({baseline:z.number(),candidate:z.number()}),
  verdict:z.enum(["improved","inconclusive","regressed"]),reasons:z.array(z.string()),
  auditAvailable:z.boolean().optional(),patchAvailable:z.boolean().optional(),confirmationAvailable:z.boolean().optional(),
  confirm:z.array(z.object({name:z.string(),passed:z.boolean(),checked:z.boolean().optional()})),
});
export type RunPresentation = z.infer<typeof RunPresentationSchema>;

export function fixturePresentation(phase:"running"|"complete"):RunPresentation {
  let order=0;
  const tasks=resultFile.tasks.map(task=>({id:task.id,prompt:provenance.tasks.find(item=>item.id===task.id)!.prompt,control:task.control,representative:task.representative,
    trials:task.trials.map(item=>({condition:item.condition as "baseline"|"candidate",index:item.index,passed:item.passed,failure:item.failure,tool:item.chosen_tool,args:item.args,explanation:item.explanation,resultTokens:item.result_tokens,order:order++}))}));
  return RunPresentationSchema.parse({
    fixture:true,phase,progress:{done:phase==="complete"?order:Math.min(8,order),total:order},runId:resultFile.run_id,model:resultFile.config.model,serverVersion:resultFile.config.server_version,provisionalLabel:resultFile.label,
    audit:{findingCount:auditFile.findings.length,tools:provenance.baseline_tools.map(tool=>({name:tool.name,description:tool.description??"",findings:auditFile.findings.filter(finding=>finding.tool===tool.name||finding.tools?.includes(tool.name)).map(finding=>({id:finding.id,severity:finding.severity,message:finding.message,param:finding.param??null}))}))},
    patch:patchFile.wire_ops.map(op=>{const tool=provenance.baseline_tools.find(item=>item.name===op.tool)!;const param="param" in op?op.param:null;return {target:param?`${op.tool}.${param}`:op.tool,before:param?((tool.inputSchema.properties as unknown as Record<string,{description?:string}>)[param]?.description??"No parameter description"):tool.description,after:op.value,findingIds:op.finding_ids}}),
    tasks,totals:resultFile.totals,staticTokens:resultFile.static_tool_tokens,verdict:resultFile.verdict,reasons:[...resultFile.verdict_reasons,
      `Returned result tokens: ${resultFile.totals.baseline.result_tokens.toLocaleString("en-US")} → ${resultFile.totals.candidate.result_tokens.toLocaleString("en-US")} (−${((1-resultFile.totals.candidate.result_tokens/resultFile.totals.baseline.result_tokens)*100).toFixed(1)}%). Potential returned context; the single-turn model did not consume these results.`,
      `Static tool-definition cost: ${resultFile.static_tool_tokens.baseline} → ${resultFile.static_tool_tokens.candidate} tokens.`,
      "The t1-route and t2-status baseline-failure hypotheses were rejected: both conditions passed 3/3. Spotlight: t3-payload, 0/3 → 3/3.",
    ],
    confirm:[{name:"Run approved",passed:confirmFile.gates.run_approved},{name:"Same deployment",passed:confirmFile.gates.same_deployment},{name:"Revision updated",passed:confirmFile.gates.revision_updated},{name:"Metadata matches",passed:confirmFile.gates.metadata_match}],
  });
}
