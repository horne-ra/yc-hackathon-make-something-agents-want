import {configuredToken} from '../viewer/auth.js';
// Read-only preflight. No model calls, source edits, allocations or deletions.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {SandboxInstance} from '@blaxel/core';
import {readMetadata} from '../src/tools/audit.js';
import {hashTools} from '../src/core/tools.js';
import {RunPresentationSchema} from '../viewer/presentation.js';
const metadata=await readMetadata('https://trackr-production-e1a6.up.railway.app/mcp');
const hash=hashTools(metadata.tools);
assert.equal(hash,'sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5');
const sandboxes=[];let active=0;
for await(const sandbox of await SandboxInstance.list({limit:100})){
 const row={name:sandbox.metadata.name,status:sandbox.status,role:sandbox.metadata.labels?.axlint_role,active:0};
 if(row.role==='shared-runner'){
  const listing=await sandbox.fs.ls('/runs');
  for(const directory of listing.subdirectories??[]){
   const name=directory.name;if(!name?.startsWith('axlint-v2.'))continue;
   const lease=JSON.parse(await sandbox.fs.read(`/runs/${name}/lease.json`));
   if(lease.status==='queued'||lease.status==='running')row.active++;
  }
  active+=row.active;
 }
 sandboxes.push(row);
}
const c=new Client({name:'wrapup-recorded-preview',version:'1'});
try{
 // Acceptance utilities never consult the retired single-token setting.
 const credential=configuredToken();
 await c.connect(new StreamableHTTPClientTransport(new URL('https://fast-pulse-rlqvb.run.mcp-use.com/mcp'),{requestInit:{headers:{Authorization:`Bearer ${credential}`}}}));
 const response=await c.callTool({name:'preview_run',arguments:{}});assert(!response.isError,JSON.stringify(response));
 const presentation=RunPresentationSchema.parse(response.structuredContent);
 assert.equal(presentation.fixture,true);assert.equal(presentation.runId,'axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d');
 assert.equal(presentation.confirm.filter(g=>g.passed).length,4);
 const report={checked_at:new Date().toISOString(),trackr:{version:metadata.server_version,tools_hash:hash},capacity:{occupied:sandboxes.length,free_vm_slots:Math.max(0,10-sandboxes.length),shared_active:active,free_shared_process_slots:Math.max(0,4-active),sandboxes},preview:{run_id:presentation.runId,fixture:presentation.fixture,confirm_gates_passed:4}};
 await writeFile('docs/evidence/wrapup/demo-readiness.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await c.close();}
