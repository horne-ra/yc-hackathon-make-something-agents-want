/** Final acceptance; one actual judges verification, no proposal generation or apply. */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {AuditSchema,GetVerificationResultOutputSchema,VerifyPatchOutputSchema} from '../src/core/contracts.js';
import {readMetadata} from '../src/tools/audit.js';
import {hashTools} from '../src/core/tools.js';
import {consumeVerifyQuota} from '../src/access.js';
const endpoint='https://fast-pulse-rlqvb.run.mcp-use.com/mcp';
const target='https://trackr-production-e1a6.up.railway.app/mcp';
const baseline='sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5';
const directory='docs/evidence/wrapup';await mkdir(directory,{recursive:true});
const checks:Record<string,unknown>={started_at:new Date().toISOString()};
const save=async(name:string,value:unknown)=>writeFile(`${directory}/${name}.json`,JSON.stringify(value,null,2)+'\n');
const publicClient=new Client({name:'axlint-judges-public-smoke',version:'1'});
const judges=new Client({name:'axlint-judges-full-loop-smoke',version:'1'});
try{
 const before=await readMetadata(target);assert.equal(hashTools(before.tools),baseline);checks.baseline_before={version:before.server_version,tools_hash:baseline};
 await publicClient.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
 checks.server=publicClient.getServerVersion();assert.equal(publicClient.getServerVersion()?.version,'0.4.0');
 const tools=await publicClient.listTools();assert.equal(tools.tools.length,7);await save('public-tools',tools);checks.public_tools=tools.tools.map(t=>t.name);
 assert.equal((await publicClient.listPrompts()).prompts.length,2);assert((await publicClient.listResources()).resources.length>=3);checks.public_discovery='PASS initialize, tools, prompts and resources';
 const resource=await publicClient.readResource({uri:'ui://views/preview-run.html'});
 const html=resource.contents.map(item=>'text' in item?item.text:'').join('\n');
 const assets=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(match=>new URL(match[1],endpoint).href);
 assert(assets.length>=2,'Widget JS and CSS are declared');
 const tokensForAssetCheck=JSON.parse(process.env.AXLINT_API_TOKENS??'{}');
 const secretValues=[...Object.values(tokensForAssetCheck).map((entry:any)=>entry.token),...['ANTHROPIC_API_KEY','BL_API_KEY','MCP_USE_API_KEY'].map(key=>process.env[key])].filter(Boolean);
 for(const url of assets){const asset=await fetch(url);assert.equal(asset.status,200);const text=await asset.text();for(const secret of secretValues)assert(!text.includes(secret),'Configured credential found in widget asset');}
 checks.public_widget_assets={count:assets.length,status:'PASS anonymous resources/read and JS/CSS HTTP 200; no configured credential values'};
 const audit=await publicClient.callTool({name:'audit_server',arguments:{server_url:target}});assert(!audit.isError,JSON.stringify(audit));
 const data=AuditSchema.parse(audit.structuredContent);assert.equal(data.tools_hash,baseline);assert.equal(data.findings[0]?.kind,'size_control_undocumented');await save('public-trackr-audit',data);checks.public_audit={findings:data.findings.length,static_tokens:data.static_tool_tokens,top_kind:data.findings[0]?.kind};
 const self=await publicClient.callTool({name:'audit_server',arguments:{server_url:endpoint}});assert(!self.isError,JSON.stringify(self));const selfAudit=AuditSchema.parse(self.structuredContent);assert.equal(selfAudit.findings.length,0);await save('self-audit-after',selfAudit);checks.self_audit_findings=0;
 const ping=await publicClient.callTool({name:'ping',arguments:{}});await save('public-ping',ping);assert(!ping.isError,JSON.stringify(ping));checks.ping=ping.structuredContent;
 for(const name of ['propose_patch','verify_patch','get_verification_result','confirm_patch','preview_run']){
  const denied=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name,arguments:{}}})});assert.equal(denied.status,401,name);assert.match(await denied.text(),/named token/);
 }
 checks.missing_token='PASS 401 on all five protected tools';
 const tokens=JSON.parse(process.env.AXLINT_API_TOKENS??'{}');assert(tokens.judges?.token,'Named judges token missing from local .env');
 await judges.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${tokens.judges.token}`}}}));
 const preview=await judges.callTool({name:'preview_run',arguments:{}});assert(!preview.isError,JSON.stringify(preview));checks.preview='PASS recorded S8 viewer';
 const credentialChecks:Record<string,string>={judges:'PASS authenticated preview'};
 for(const name of ['codex','cursor','claude']){
  const client=new Client({name:`axlint-${name}-credential-smoke`,version:'1'});
  try{await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${tokens[name].token}`}}}));const response=await client.callTool({name:'preview_run',arguments:{}});assert(!response.isError,`${name} credential rejected`);credentialChecks[name]='PASS authenticated preview';}
  finally{await client.close();}
 }
 checks.named_credential_checks=credentialChecks;
 // Exercise the real durable counter under an isolated non-credential test name.
 // It does not spend judges' allowance or start any model/sandbox allocation.
 const probe={name:`wrapup-quota-${Date.now()}`,token:'synthetic-test-value-not-a-real-credential',daily_verify_limit:1};
 const first=await consumeVerifyQuota(probe),second=await consumeVerifyQuota(probe);assert.equal(first?.allowed,true);assert.equal(second?.allowed,false);checks.durable_quota={first,second};
 const input=JSON.parse(await readFile('runner/evidence/corrected-input.json','utf8'));input.model='default';input.scoring_version='v1';input.trials=3;
 // Existing committed corrected-runner candidate; no new model proposal or target edit.
 const launch=await judges.callTool({name:'verify_patch',arguments:input});await save('judges-launch',launch);assert(!launch.isError,JSON.stringify(launch));
 const queued=VerifyPatchOutputSchema.parse(launch.structuredContent);checks.run_id=queued.run_id;await save('smoke-summary',checks);console.log(JSON.stringify(queued));
 const polls:unknown[]=[];const deadline=Date.now()+15*60_000;
 while(Date.now()<deadline){
  const response=await judges.callTool({name:'get_verification_result',arguments:{run_id:queued.run_id}});assert(!response.isError,JSON.stringify(response));
  const state=GetVerificationResultOutputSchema.parse(response.structuredContent);polls.push({at:new Date().toISOString(),state});await save('judges-polls',polls);
  if(state.status==='complete'){
   await save('judges-complete',response);assert.equal(state.result.config.scoring_version,'v1');assert(!('temperature' in state.result.config));
   checks.verification={verdict:state.result.verdict,model:state.result.config.model,scoring_version:state.result.config.scoring_version,totals:state.result.totals,static_tool_tokens:state.result.static_tool_tokens,trials:state.result.tasks.flatMap(t=>t.trials).length};
   console.log(JSON.stringify(checks.verification));break;
  }
  if(['failed','run_expired','run_unavailable'].includes(state.status))throw Error(`Verification stopped: ${JSON.stringify(state)}`);
  await new Promise(resolve=>setTimeout(resolve,3000));
 }
 assert(checks.verification,'Verification did not complete within fifteen minutes');
 checks.status='passed';
}catch(error){checks.status='failed';checks.error=error instanceof Error?error.message:String(error);throw error;}
finally{
 await publicClient.close().catch(()=>{});await judges.close().catch(()=>{});
 const after=await readMetadata(target);const hash=hashTools(after.tools);checks.baseline_after={version:after.server_version,tools_hash:hash};checks.finished_at=new Date().toISOString();await save('smoke-summary',checks);assert.equal(hash,baseline,'Trackr must remain at baseline');
}
