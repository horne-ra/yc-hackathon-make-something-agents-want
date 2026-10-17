import { VerifyPatchInputSchema, VerifyPatchOutputSchema } from '../core/contracts.js';
import { runStartError } from '../blaxel/errors.js';
import { startRun } from '../blaxel/runs.js';
export const verifyPatchDefinition={name:'verify_patch',description:'Start single-turn baseline/candidate verification in a retained Blaxel sandbox. Returns a run_id; poll get_verification_result. Does not apply source edits.',inputSchema:VerifyPatchInputSchema,outputSchema:VerifyPatchOutputSchema,annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:true}};
export const verifyPatch=async(input:unknown)=>startRun(VerifyPatchInputSchema.parse(input));
export const verifyPatchHandler=async(input:unknown)=>{try{const data=await verifyPatch(input);return{content:[{type:'text' as const,text:JSON.stringify(data)}],structuredContent:data};}catch(error){const named=runStartError(error);return{isError:true as const,content:[{type:'text' as const,text:JSON.stringify({error:{code:named.code,message:named.message}})}]};}};
