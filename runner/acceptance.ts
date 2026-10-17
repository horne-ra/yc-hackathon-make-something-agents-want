// Private S6 acceptance harness. Never imported by production server registration.
import { loadEnvFile } from 'node:process';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { MCPServer } from 'mcp-use';
import { VerifyPatchInputSchema, VerifyPatchOutputSchema, ToolsSchema, GetVerificationResultOutputSchema } from '../src/core/contracts.js';
import { hashTools } from '../src/core/tools.js';
import { verifyPatchDefinition,verifyPatchHandler } from '../src/tools/verify-patch.js';
import { getVerificationResultDefinition,getVerificationResultHandler } from '../src/tools/get-verification-result.js';
import { runVerification } from './engine.js';
try{loadEnvFile();}catch{}
const [mode='prepare',argument,extra]=process.argv.slice(2);
const output=resolve('runner/evidence');await mkdir(output,{recursive:true});
if(mode==='prepare'){
 const patch=JSON.parse(await readFile(argument??'viewer/fixtures/patch.json','utf8'));
 const provenance=JSON.parse(await readFile('viewer/fixtures/provenance.json','utf8'));
 const client=new Client({name:'axlint-acceptance-preflight',version:'1'});await client.connect(new StreamableHTTPClientTransport(new URL(process.env.TRACKR_URL!)));
 const live=(await client.listTools()).tools;const version=client.getServerVersion()?.version;
 if(hashTools(ToolsSchema.parse(live))!==patch.base_tools_hash)throw new Error('Live base hash differs; do not run');
 patch.base_server_version=version;
 const input=VerifyPatchInputSchema.parse({server_url:process.env.TRACKR_URL,patch,tasks:{tasks:provenance.tasks},trials:3,model:'default'});
 await writeFile(resolve(output,'input.json'),JSON.stringify(input,null,2));await client.close();
 console.log(JSON.stringify({preflight:'pass',server_version:version,base_tools_hash:patch.base_tools_hash,input:'runner/evidence/input.json'}));
}else if(mode==='local'||mode==='stale-local'){
 const input=JSON.parse(await readFile(resolve(output,'input.json'),'utf8'));
 if(mode==='stale-local')input.patch.base_tools_hash='sha256:'+'0'.repeat(64);
 const directory=resolve(output,mode);await mkdir(directory,{recursive:true});
 await runVerification(input,`axlint-run-${mode}`,{progress:async value=>{await writeFile(resolve(directory,'progress.json'),JSON.stringify(value,null,2));console.log(`PROGRESS ${value.progress.done}/${value.progress.total}`);},result:async value=>{await writeFile(resolve(directory,'result.json'),JSON.stringify(value,null,2));console.log(JSON.stringify(value.status==='failed'?value:{status:value.status,totals:value.result.totals,verdict:value.result.verdict,trial_count:value.result.tasks.reduce((n,t)=>n+t.trials.length,0)}));}});
}else if(mode==='mcp-start'||mode==='mcp-stale'||mode==='mcp-read'){
 const server=new MCPServer({name:'axlint-s6-private-acceptance',version:'1.0.0'});
 server.tool(verifyPatchDefinition,verifyPatchHandler);
 server.tool(getVerificationResultDefinition,getVerificationResultHandler);
 const {url}=await server.listen(0);
 const client=new Client({name:'s6-acceptance-client',version:'1'});await client.connect(new StreamableHTTPClientTransport(new URL(url)));
 try{
  if(mode==='mcp-read'){
   const runId=argument==='latest'?JSON.parse(await readFile(resolve(output,'launch.json'),'utf8')).run_id:argument;
   const response=await client.callTool({name:'get_verification_result',arguments:{run_id:runId}});const data=GetVerificationResultOutputSchema.parse(response.structuredContent);
   await writeFile(resolve(output,extra??'last-poll.json'),JSON.stringify(data,null,2));console.log(JSON.stringify(data.status==='complete'?{status:data.status,progress:data.progress,totals:data.result.totals,verdict:data.result.verdict,server_version:data.result.config.server_version}:data));
  }else{
   const input=JSON.parse(await readFile(resolve(output,'input.json'),'utf8'));if(mode==='mcp-stale')input.patch.base_tools_hash='sha256:'+'0'.repeat(64);
   const start=performance.now();const response=await client.callTool({name:'verify_patch',arguments:input});const elapsed=performance.now()-start;
   const data=VerifyPatchOutputSchema.parse(response.structuredContent);if(response.isError)throw new Error(JSON.stringify(response.content));
   await writeFile(resolve(output,mode==='mcp-stale'?'stale-launch.json':'launch.json'),JSON.stringify({elapsed_ms:elapsed,under_one_second:elapsed<1000,...data},null,2));console.log(JSON.stringify({elapsed_ms:elapsed,under_one_second:elapsed<1000,...data}));
  }
 }finally{await client.close();await server.close();}
}else throw new Error('Unknown acceptance mode');
