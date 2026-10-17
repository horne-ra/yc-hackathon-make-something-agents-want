import { GetVerificationResultInputSchema, GetVerificationResultOutputSchema } from '../core/contracts.js';
import { readRun } from '../blaxel/runs.js';
export const getVerificationResultDefinition={name:'get_verification_result',description:'Read retained sandbox progress and complete verification results by run_id. Returns all trials and provisional verdict, or an explicit lifecycle status. No server instance state is required.',inputSchema:GetVerificationResultInputSchema,outputSchema:GetVerificationResultOutputSchema,annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:true}};
export const getVerificationResult=async(input:unknown)=>readRun(GetVerificationResultInputSchema.parse(input).run_id);
export const getVerificationResultHandler=async(input:unknown)=>{const data=await getVerificationResult(input);return{content:[{type:'text' as const,text:JSON.stringify(data)}],structuredContent:data};};
