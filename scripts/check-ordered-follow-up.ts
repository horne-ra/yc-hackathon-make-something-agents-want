import {configuredToken} from '../viewer/auth.js';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {SandboxInstance} from '@blaxel/core';
import {GetVerificationResultOutputSchema,hashTools} from '../src/core/index.js';
import {readMetadata} from '../src/tools/audit.js';
import {proposePatchTool} from '../src/tools/propose.js';
import {readRunArtifacts} from '../viewer/live-run.js';
process.loadEnvFile('.env');
const baseline='sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5';
const version='trackr-demo-001@ad88596baf761ec9b44abd019d3e8a90f84ceb96';
const evidence='scripts/results/s8-proposer-2026-10-17T23-07-22.577Z';
const summary=JSON.parse(await readFile(`${evidence}/summary.json`,'utf8'));
const client=new Client({name:'ordered-follow-up-final-check',version:'1'});
try{
 await client.connect(new StreamableHTTPClientTransport(new URL('https://fast-pulse-rlqvb.run.mcp-use.com/mcp'),{requestInit:{headers:{Authorization:`Bearer ${configuredToken()}`}}}));
 const definition=(await client.listTools()).tools.find(t=>t.name==='propose_patch');assert.equal(definition?.description,proposePatchTool.description);
 assert.match((definition!.inputSchema.properties!.source_files as any).description,/src\/handlers.ts/);
 console.log('PASS hosted proposer tool and parameter descriptions match complete-source and severity guidance');
 const cases=[];
 for(const row of summary.report){
  assert(row.run_id,'Expected a completed real run for each requested case');
  const response=await client.callTool({name:'get_verification_result',arguments:{run_id:row.run_id}});
  const state=GetVerificationResultOutputSchema.parse(response.structuredContent);assert.equal(state.status,'complete');if(state.status!=='complete')throw Error('Incomplete result');
  const result=state.result;assert.equal(result.tasks.flatMap(t=>t.trials).length,24);assert.equal(result.config.baseline_tools_hash,baseline);assert.equal(result.config.server_version,version);assert.equal(result.config.model,process.env.AXLINT_MODEL);assert(!Object.hasOwn(result.config,'temperature'));assert.equal(result.verdict,row.verdict);
  const data={case:row.case,run_id:row.run_id,verdict:result.verdict,totals:result.totals,static_tokens:result.static_tool_tokens,tasks:result.tasks.map(t=>({id:t.id,baseline:t.baseline,candidate:t.candidate,consistency:([ 'baseline','candidate'] as const).map(condition=>({condition,consistent:new Set(t.trials.filter(x=>x.condition===condition).map(x=>x.passed)).size===1}))}))};cases.push(data);
  console.log(`PASS hosted retained ${row.case}: ${result.verdict}, ${result.totals.baseline.passed}/12 → ${result.totals.candidate.passed}/12, 24 trials`);
 }
 const cId='axlint-v2.YXhsaW50LXJ1bi1mMmY1YmUxMC0zNjdlLTRjZDUtODYxNC1jYjA2NThmYTNlMmQ.70aa4566-97a6-4bf5-bad9-c5de1a2d68ed';
 const artifacts=await readRunArtifacts(cId);assert.equal(artifacts.confirmation?.error,'revision_mismatch');assert.equal(artifacts.confirmation?.gates.revision_updated,false);console.log('PASS new-format confirmation persisted in its isolated directory');
 const metadata=await readMetadata(process.env.TRACKR_URL!);assert.equal(hashTools(metadata.tools),baseline);assert.equal(metadata.server_version,version);
 const sandboxes=[];for await(const s of await SandboxInstance.list({limit:100}))sandboxes.push({name:s.metadata.name,status:s.status,shared:s.metadata.labels?.axlint_role==='shared-runner'});
 const capacity=Number(process.env.AXLINT_SANDBOX_CAPACITY??10);
 const proof={checked_at:new Date().toISOString(),model:process.env.AXLINT_MODEL,proposer_description:definition!.description,cases,trackr:{version:metadata.server_version,tools_hash:hashTools(metadata.tools)},workspace:{sandboxes,occupied:sandboxes.length,free_slots:Math.max(0,capacity-sandboxes.length)},new_confirmation_persisted:true};
 await writeFile('scripts/results/ordered-follow-up-final-check.json',JSON.stringify(proof,null,2)+'\n');
 console.log(`PASS unchanged Trackr baseline: ${metadata.server_version}; ${hashTools(metadata.tools)}`);
 console.log(`Workspace: ${sandboxes.length} sandboxes, ${proof.workspace.free_slots} free VM slots, ${sandboxes.filter(s=>s.shared).length} shared pool`);
}finally{await client.close()}
process.exit(0);
