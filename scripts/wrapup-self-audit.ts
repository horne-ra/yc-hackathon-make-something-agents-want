import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {auditTools} from '../src/core/audit.js';
import {ToolsSchema} from '../src/core/contracts.js';
import {AuditSchema} from '../src/core/contracts.js';
const url=process.argv[2]??'https://fast-pulse-rlqvb.run.mcp-use.com/mcp';
const c=new Client({name:'axlint-public-self-audit',version:'1'});
try{
 await c.connect(new StreamableHTTPClientTransport(new URL(url)));
 const tools=(await c.listTools()).tools;
 for(const tool of tools){assert(tool.title,tool.name);assert(tool.outputSchema,tool.name);for(const hint of ['readOnlyHint','destructiveHint','idempotentHint','openWorldHint'] as const)assert.equal(typeof tool.annotations?.[hint],'boolean',`${tool.name}.${hint}`);}
 if(process.argv.includes('--metadata-only')) {const findings=auditTools(ToolsSchema.parse(tools));assert.equal(findings.length,0,JSON.stringify(findings));await writeFile('docs/evidence/wrapup/self-audit-local.json',JSON.stringify({server_version:c.getServerVersion(),findings,tools,provider_count:'not requested in metadata-only check'},null,2)+'\n');console.log('PASS local production metadata: 7 titles/output schemas/all four annotations; 0 deterministic audit findings');process.exit(0);}
 const result=await c.callTool({name:'audit_server',arguments:{server_url:url}});assert(!result.isError,JSON.stringify(result));
 const audit=AuditSchema.parse(result.structuredContent);assert.equal(audit.findings.length,0,JSON.stringify(audit.findings));
 await writeFile('docs/evidence/wrapup/self-audit-after.json',JSON.stringify(audit,null,2)+'\n');
 console.log(JSON.stringify({check:'anonymous self audit',version:c.getServerVersion(),tools:tools.length,output_schemas:tools.filter(t=>t.outputSchema).length,findings:audit.findings.length,static_tool_tokens:audit.static_tool_tokens}));
}finally{await c.close();}
