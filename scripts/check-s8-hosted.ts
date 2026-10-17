/** Read-only AX Lint checks plus capacity rejection against a local-only dummy target. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {CallToolResultSchema} from '@modelcontextprotocol/sdk/types.js';
import {SandboxInstance} from '@blaxel/core';
import {proposePatchTool} from '../src/tools/propose.js';
process.loadEnvFile('.env');
const output=process.argv[2]??'scripts/results/s8-hosted-capacity.json';
const endpoint='https://fast-pulse-rlqvb.run.mcp-use.com/mcp';
const client=new Client({name:'axlint-s8-capacity-check',version:'1.0.0'});
try{
 await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${process.env.AXLINT_API_TOKEN}`}}}));
 const tools=(await client.listTools()).tools;
 const propose=tools.find(t=>t.name==='propose_patch');
 assert.equal(propose?.description,proposePatchTool.description);
 const properties=propose?.inputSchema.properties as Record<string,{description?:string}>;
 assert.ok(properties.source_files?.description?.includes('src/handlers.ts'));
 const retained=await client.callTool({name:'get_verification_result',arguments:{run_id:'axlint-run-470aab7c-82b1-4391-99ba-1862c49d4951'}});
 const result=retained.structuredContent as {status:string;result:{verdict:string;totals:unknown}};
 assert.equal(result.status,'complete');assert.equal(result.result.verdict,'regressed');
 const rows=[];for await(const s of await SandboxInstance.list({limit:100}))rows.push(s.metadata.name);
 const record:{checked_at:string;tool_metadata:string;retained_attempt_1:string;occupied:number;free_slots:number;capacity_check:unknown}={checked_at:new Date().toISOString(),tool_metadata:'PASS complete-source and severity guidance',retained_attempt_1:'PASS complete/regressed via hosted get_verification_result',occupied:rows.length,free_slots:Math.max(0,10-rows.length),capacity_check:'skipped: a free slot exists'};
 if(rows.length>=10){
  const input=JSON.parse(await readFile('runner/evidence/corrected-input.json','utf8'));
  // Even if capacity changes concurrently, this cannot reach Trackr or call a model.
  input.server_url='http://127.0.0.1:1/mcp';
  const response=CallToolResultSchema.parse(await client.callTool({name:'verify_patch',arguments:input}));
  record.capacity_check={response};
  await writeFile(output,JSON.stringify(record,null,2)+'\n');
  assert.equal(response.isError,true);
  const text=response.content.filter(c=>c.type==='text').map(c=>c.text).join('\n');
  assert.ok(!text.includes('[object Object]'));const error=JSON.parse(text).error;
  assert.equal(error.code,'capacity_exhausted');record.capacity_check={isError:response.isError,error};
 }
 await writeFile(output,JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record));
}finally{await client.close();}
process.exit(0);
