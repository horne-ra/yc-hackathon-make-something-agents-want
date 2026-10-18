/** Read-only post-deployment acceptance; never starts another verification. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {SandboxInstance} from '@blaxel/core';
import {configuredToken} from '../viewer/auth.js';
import {tokenFingerprint} from '../src/access.js';
import {AuditSchema,GetVerificationResultOutputSchema} from '../src/core/contracts.js';
import {readMetadata} from '../src/tools/audit.js';
import {hashTools} from '../src/core/tools.js';
const endpoint='https://fast-pulse-rlqvb.run.mcp-use.com/mcp',target='https://trackr-production-e1a6.up.railway.app/mcp';
const baseline='sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5';
const prior=JSON.parse(await readFile('docs/evidence/wrapup/judges-complete.json','utf8')).structuredContent;
const runId=prior.result.run_id;
const pub=new Client({name:'axlint-final-public-read',version:'1'}),authenticated=new Client({name:'axlint-final-retained-read',version:'1'});
const report:Record<string,unknown>={checked_at:new Date().toISOString()};
try{
 await pub.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
 report.server=pub.getServerVersion();assert.equal((await pub.listTools()).tools.length,7);assert.equal((await pub.listPrompts()).prompts.length,2);
 const ping=await pub.callTool({name:'ping',arguments:{}});assert(!ping.isError);const bytes=Buffer.byteLength(JSON.stringify(ping.structuredContent));assert(bytes<1500,'Ping should return a compact connectivity summary');assert.equal((ping.structuredContent as any).sandbox.progress.readable,true);report.ping={bytes,data:ping.structuredContent};
 const audit=await pub.callTool({name:'audit_server',arguments:{server_url:target}});assert(!audit.isError);const data=AuditSchema.parse(audit.structuredContent);assert.equal(data.tools_hash,baseline);report.public_audit={findings:data.findings.length,static_tool_tokens:data.static_tool_tokens};
 await authenticated.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${configuredToken()}`}}}));
 const response=await authenticated.callTool({name:'get_verification_result',arguments:{run_id:runId}});assert(!response.isError);const state=GetVerificationResultOutputSchema.parse(response.structuredContent);assert.equal(state.status,'complete');if(state.status!=='complete')throw Error('Retained run unavailable');
 assert.deepEqual(state,prior,'Retained judges result must be unchanged');report.retained_verification={run_id:runId,verdict:state.result.verdict,totals:state.result.totals,static_tool_tokens:state.result.static_tool_tokens,trials:state.result.tasks.flatMap(t=>t.trials).length,result_sha256:createHash('sha256').update(JSON.stringify(state)).digest('hex'),unchanged:true};
 const tokens=JSON.parse(process.env.AXLINT_API_TOKENS!);const day=new Date().toISOString().slice(0,10);const sandbox=await SandboxInstance.get(process.env.AXLINT_QUOTA_SANDBOX!);const directory=await sandbox.fs.ls(`/app/axlint-quotas/${day}/${tokenFingerprint({name:'judges',...tokens.judges})}`);const used=(directory.files??[]).filter(file=>/^[1-9][0-9]*$/.test(file.name??'')).length;assert(used>=1&&used<=tokens.judges.daily_verify_limit);report.judges_quota={day,used,limit:tokens.judges.daily_verify_limit,remaining:tokens.judges.daily_verify_limit-used};
 const metadata=await readMetadata(target);assert.equal(hashTools(metadata.tools),baseline);report.trackr={version:metadata.server_version,tools_hash:baseline};report.status='passed';
 await writeFile('docs/evidence/wrapup/final-hosted-checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await pub.close().catch(()=>{});await authenticated.close().catch(()=>{});}
