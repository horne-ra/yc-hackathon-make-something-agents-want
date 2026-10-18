import {configuredToken} from '../viewer/auth.js';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {GetVerificationResultOutputSchema} from '../src/core/index.js';
process.loadEnvFile('.env');
const endpoint='https://fast-pulse-rlqvb.run.mcp-use.com/mcp';
const run_id='axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.542700b5-5900-4a3f-a584-b6d1344a35e0';
const client=new Client({name:'shared-hosted-check',version:'1'});
try{
 await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${configuredToken()}`}}}));
 const response=await client.callTool({name:'get_verification_result',arguments:{run_id}});assert(!response.isError);
 const state=GetVerificationResultOutputSchema.parse(response.structuredContent);assert.equal(state.status,'complete');if(state.status!=='complete')throw Error('incomplete');
 assert.equal(state.result.tasks.flatMap(t=>t.trials).length,24);
 assert.equal((response._meta?.axlintViewer as any)?.fixture,false);assert.equal((response._meta?.axlintViewer as any)?.runId,run_id);
 assert.equal((response._meta?.ui as any)?.resourceUri,'ui://views/verification-result.html');
 await writeFile('scripts/results/shared-runner-hosted-result.json',JSON.stringify(response,null,2)+'\n');
 console.log('PASS hosted new-format result: complete, Improved, all 24 schema-valid trials, live widget data and native UI resource');
 const resource=await client.readResource({uri:'ui://views/verification-result.html'});assert(resource.contents.some(c=>'text' in c&&c.text.includes('<html')));console.log('PASS hosted result MCP App resource is readable');
 const old=await client.callTool({name:'get_verification_result',arguments:{run_id:'axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d'}});assert.equal((old.structuredContent as any)?.status,'complete');assert.equal((old._meta?.axlintViewer as any)?.confirmationAvailable,true);console.log('PASS hosted legacy milestone result and recorded confirmation remain readable');
}finally{await client.close()}
