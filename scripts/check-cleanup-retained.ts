import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {SandboxInstance} from '@blaxel/core';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {GetVerificationResultOutputSchema,hashTools} from '../src/core/index.js';
import {readMetadata} from '../src/tools/audit.js';
process.loadEnvFile('.env');
const directory='scripts/results/one-time-cleanup-2026-10-17T23-12-29.761Z';
const manifest=JSON.parse(await readFile(`${directory}/manifest.json`,'utf8'));assert.equal(manifest.mode,'execute-once');
const cleanup=manifest.rows.findLast((r:any)=>r.action==='summary');assert.equal(cleanup.deleted.length,9);
const prior=JSON.parse(await readFile('scripts/results/ordered-follow-up-final-check.json','utf8'));
const client=new Client({name:'post-cleanup-live-proof',version:'1'});
try{
 await client.connect(new StreamableHTTPClientTransport(new URL('https://fast-pulse-rlqvb.run.mcp-use.com/mcp'),{requestInit:{headers:{Authorization:`Bearer ${process.env.AXLINT_API_TOKEN}`}}}));
 const cases=[];
 for(const item of [{run_id:'axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d',expected:'improved'},...prior.cases.map((r:any)=>({run_id:r.run_id,expected:r.verdict}))]){
  const wire=await client.callTool({name:'get_verification_result',arguments:{run_id:item.run_id}});
  const state=GetVerificationResultOutputSchema.parse(wire.structuredContent);assert.equal(state.status,'complete');if(state.status!=='complete')throw Error('Run unavailable');
  assert.equal(state.result.verdict,item.expected);assert.equal(state.result.tasks.flatMap(t=>t.trials).length,24);
  cases.push({run_id:item.run_id,verdict:state.result.verdict,trials:24,totals:state.result.totals});
 }
 const retained=cases.some(r=>r.run_id===cleanup.newest_kept.run_id);assert(retained);console.log('PASS live milestone and both sequential proposer results retained; newest completed run is readable');
 const remaining=[];for await(const s of await SandboxInstance.list({limit:100}))remaining.push({name:s.metadata.name,status:s.status});
 const active=remaining.filter(s=>!['TERMINATED','TERMINATING','DELETING','FAILED'].includes(s.status??''));
 assert.equal(active.length,1);assert.equal(active[0]!.name,'axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d');
 assert(!remaining.some(s=>cleanup.deleted.includes(s.name)&&s.status!=='TERMINATED'),'Deleted resources must have completed deletion');
 const metadata=await readMetadata(process.env.TRACKR_URL!);assert.equal(metadata.server_version,prior.trackr.version);assert.equal(hashTools(metadata.tools),prior.trackr.tools_hash);
 const proof={checked_at:new Date().toISOString(),deleted:cleanup.deleted,cases,remaining,occupied:active.length,free_slots:10-active.length,trackr:{version:metadata.server_version,tools_hash:hashTools(metadata.tools)},production_retention_changed:false};
 await writeFile(`${directory}/post-cleanup-check.json`,JSON.stringify(proof,null,2)+'\n');
 console.log(`PASS settled capacity: ${active.length} occupied, ${proof.free_slots} free slots`);console.log(`PASS Trackr unchanged at ${metadata.server_version}; ${hashTools(metadata.tools)}`);
}finally{await client.close()}
process.exit(0);
