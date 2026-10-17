import {SandboxInstance} from "@blaxel/core";
import {z} from "zod";
import {ToolsSchema,PatchSpecSchema,TasksSchema,TrialSchema,ConfirmPatchOutputSchema,provisionalLabel,auditTools,type Tool,type Trial} from "../src/core/index.js";
import type {GetVerificationResultOutput} from "../src/blaxel/runs.js";
import {RUN_DIRECTORY} from "../src/blaxel/runs.js";
import {RunPresentationSchema,type RunPresentation} from "./presentation.js";
const ContextSchema=z.object({baseline_tools:ToolsSchema,patch:PatchSpecSchema,tasks:TasksSchema,model:z.string(),trials:z.number(),server_version:z.string(),static_tool_tokens:z.object({baseline:z.number(),candidate:z.number()})});
const ProgressFileSchema=z.object({trials:z.array(z.object({task_id:z.string(),trial:TrialSchema})),progress:z.object({done:z.number(),total:z.number()})});
export type RunArtifacts={context?:z.infer<typeof ContextSchema>;progress?:z.infer<typeof ProgressFileSchema>;confirmation?:z.infer<typeof ConfirmPatchOutputSchema>};
export async function readRunArtifacts(runId:string):Promise<RunArtifacts>{
 if(!/^axlint-run-[a-z0-9-]{1,64}$/.test(runId))return {};
 const sandbox=await SandboxInstance.get(runId);
 const optional=async(name:string,schema:z.ZodType)=>{try{return schema.parse(JSON.parse(await sandbox.fs.read(`${RUN_DIRECTORY}/${name}.json`)))}catch{return undefined}};
 const [context,progress,confirmation]=await Promise.all([optional("context",ContextSchema),optional("progress",ProgressFileSchema),optional("confirm",ConfirmPatchOutputSchema)]);
 return {context,progress,confirmation} as RunArtifacts;
}
export async function saveRunConfirmation(runId:string,value:unknown){
 if(!/^axlint-run-[a-z0-9-]{1,64}$/.test(runId))return;
 const parsed=ConfirmPatchOutputSchema.parse(value);const sandbox=await SandboxInstance.get(runId);
 await sandbox.fs.write(`${RUN_DIRECTORY}/confirm.json`,JSON.stringify(parsed));
}
const summary=(rows:Trial[])=>({passed:rows.filter(t=>t.passed).length,of:rows.filter(t=>t.failure!=="infra").length,result_tokens:rows.reduce((n,t)=>n+t.result_tokens,0)});
const description=(tool:Tool|undefined,param?:string)=>{if(!tool)return "Unavailable";if(!param)return tool.description??"No tool description";const props=tool.inputSchema.properties as Record<string,{description?:string}>|undefined;return props?.[param]?.description??"No parameter description"};
export function livePresentation(runId:string,state:GetVerificationResultOutput,files:RunArtifacts):RunPresentation|undefined{
 const result=state.status==="complete"?state.result:undefined;const context=files.context;
 if(!result&&!context)return undefined;
 const records=result?result.tasks.flatMap(task=>task.trials.map(trial=>({task_id:task.id,trial}))):files.progress?.trials??[];
 const done=records.length;const config=result?.config??context!;
 const definitions=context?.tasks.tasks??result!.tasks.map(t=>({id:t.id,prompt:"Prompt was not saved for this earlier run.",control:t.control}));
 const perCondition=config.trials;const total=definitions.length*perCondition*2;let pending=done;
 const tasks=definitions.map(task=>({id:task.id,prompt:task.prompt,control:task.control,representative:result?.tasks.find(t=>t.id===task.id)?.representative??{baseline_trial:1,candidate_trial:1},trials:(["baseline","candidate"] as const).flatMap(condition=>Array.from({length:perCondition},(_,i)=>{
 const index=i+1;const position=records.findIndex(r=>r.task_id===task.id&&r.trial.condition===condition&&r.trial.index===index);const trial=position>=0?records[position].trial:undefined;
 return {condition,index,passed:trial?.passed??false,failure:trial?.failure??null,tool:trial?.chosen_tool??null,args:trial?.args??{},explanation:trial?.explanation??"",resultTokens:trial?.result_tokens??0,order:trial?position:pending++};
 }))}));
 const baseline=context?.baseline_tools??[];const findings=context?auditTools(baseline):[];
 const before=summary(records.filter(r=>r.trial.condition==="baseline").map(r=>r.trial));const after=summary(records.filter(r=>r.trial.condition==="candidate").map(r=>r.trial));
 const totals=result?.totals??{baseline:before,candidate:after};const delta=totals.baseline.result_tokens?((1-totals.candidate.result_tokens/totals.baseline.result_tokens)*100):0;
 const confirmation=files.confirmation;
 const stop=confirmation?.error==="run_not_approved"?0:confirmation?.error==="wrong_deployment"?1:confirmation?.error==="revision_mismatch"?2:3;
 return RunPresentationSchema.parse({fixture:false,phase:result?"complete":"running",progress:{done,total},runId,model:config.model,serverVersion:config.server_version,provisionalLabel:result?.label??provisionalLabel(perCondition),
 auditAvailable:Boolean(context),patchAvailable:Boolean(context),confirmationAvailable:Boolean(confirmation),
 audit:{findingCount:findings.length,tools:baseline.map(tool=>({name:tool.name,description:tool.description??"",findings:findings.filter(f=>f.tool===tool.name||f.tools?.includes(tool.name)).map(f=>({id:f.id,severity:f.severity,message:f.message,param:f.param??null}))}))},
 patch:context?.patch.wire_ops.map(op=>({target:op.op==="set_param_description"?`${op.tool}.${op.param}`:op.tool,before:description(baseline.find(t=>t.name===op.tool),op.op==="set_param_description"?op.param:undefined),after:op.value,findingIds:op.finding_ids}))??[],
 tasks,totals,staticTokens:result?.static_tool_tokens??context!.static_tool_tokens,verdict:result?.verdict??"inconclusive",reasons:result?[...result.verdict_reasons,`Returned result tokens: ${totals.baseline.result_tokens.toLocaleString("en-US")} → ${totals.candidate.result_tokens.toLocaleString("en-US")} (${delta.toFixed(1)}% reduction). Potential returned context; the single-turn model did not consume these results.`]:[],
 confirm:[{name:"Run approved",passed:confirmation?.gates.run_approved??false},{name:"Same deployment",passed:confirmation?.gates.same_deployment??false},{name:"Revision updated",passed:confirmation?.gates.revision_updated??false},{name:"Metadata matches",passed:confirmation?.gates.metadata_match??false}].map((gate,index)=>({...gate,checked:Boolean(confirmation)&&index<=stop})),
 });
}
