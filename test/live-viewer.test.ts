import {describe,it,expect} from "vitest";
import {livePresentation} from "../viewer/live-run.js";
import {GetVerificationResultOutputSchema,VerifyPatchInputSchema,ToolsSchema,hashTools} from "../src/core/index.js";
import pollFile from "../runner/evidence/corrected-complete-poll.json" with {type:"json"};
import inputFile from "../runner/evidence/corrected-input.json" with {type:"json"};
import recorded from "../scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json" with {type:"json"};
const state=GetVerificationResultOutputSchema.parse(pollFile);
if(state.status!=="complete")throw Error("Expected recorded complete fixture");
const input=VerifyPatchInputSchema.parse(inputFile);
const context={baseline_tools:ToolsSchema.parse(recorded.baseline_tools),patch:input.patch,tasks:input.tasks,model:state.result.config.model,trials:3,server_version:state.result.config.server_version,static_tool_tokens:state.result.static_tool_tokens};
describe("real-run widget adapter",()=>{
 it("shows actual stored result and honest unavailable context for older runs",()=>{const view=livePresentation(state.result.run_id,state,{});expect(view?.fixture).toBe(false);expect(view?.auditAvailable).toBe(false);expect(view?.confirmationAvailable).toBe(false);expect(view?.tasks.flatMap(t=>t.trials)).toHaveLength(24);expect(view?.totals.candidate.result_tokens).toBe(13917);expect(view?.staticTokens.candidate).toBe(955)});
 it("uses hash-matching saved baseline, patch and task context",()=>{expect(hashTools(context.baseline_tools)).toBe(state.result.config.baseline_tools_hash);const view=livePresentation(state.result.run_id,state,{context});expect(view?.patch).toHaveLength(5);expect(view?.tasks.find(t=>t.id==="t3-payload")?.prompt).toBe("Give me a quick list of maria's open issues.");expect(view?.audit.tools.find(t=>t.name==="list_issues")?.findings.find(f=>f.id==="F2")?.param).toBe("status")});
 it("partial files reveal only recorded calls and do not fabricate confirmation",()=>{const records=state.result.tasks.flatMap(t=>t.trials.map(trial=>({task_id:t.id,trial}))).slice(0,5);const view=livePresentation(state.result.run_id,{status:"running",progress:{done:5,total:24}},{context,progress:{progress:{done:5,total:24},trials:records}})!;expect(view.phase).toBe("running");expect(view.progress.done).toBe(5);expect(view.tasks.flatMap(t=>t.trials).filter(t=>t.order<5)).toHaveLength(5);expect(view.confirmationAvailable).toBe(false)});
 it("does not label gates after a stopped confirmation as failures",()=>{const confirmation={match:false,gates:{run_approved:true,same_deployment:true,revision_updated:false,metadata_match:false},live_server_version:state.result.config.server_version,live_tools_hash:state.result.config.baseline_tools_hash,verified_tools_hash:state.result.config.candidate_tools_hash,diffs:[],error:"revision_mismatch" as const};const view=livePresentation(state.result.run_id,state,{context,confirmation})!;expect(view.confirm.map(g=>g.checked)).toEqual([true,true,true,false]);expect(view.confirm[2].passed).toBe(false)});
 it("does not pretend queued/expired runs have result data",()=>{expect(livePresentation("none",{status:"queued"},{})).toBeUndefined();expect(livePresentation("none",{status:"run_expired"},{})).toBeUndefined()});
});
