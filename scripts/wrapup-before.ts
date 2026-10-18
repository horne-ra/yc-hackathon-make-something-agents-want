import {writeFile} from 'node:fs/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {SandboxInstance} from '@blaxel/core';
import {ToolsSchema} from '../src/core/contracts.js';
import {auditServer} from '../src/tools/audit.js';
const url='https://fast-pulse-rlqvb.run.mcp-use.com/mcp';
const c=new Client({name:'axlint-self-audit-before',version:'1'});
try {
 await c.connect(new StreamableHTTPClientTransport(new URL(url),{requestInit:{headers:{Authorization:`Bearer ${process.env.AXLINT_API_TOKEN}`}}}));
 const tools=(await c.listTools()).tools;
 const audit=await auditServer({server_url:url},{readMetadata:async()=>({server_version:c.getServerVersion()!.version,tools:ToolsSchema.parse(tools)})});
 await writeFile('docs/evidence/wrapup/self-audit-before.json',JSON.stringify(audit,null,2)+'\n');
 console.log(JSON.stringify({before_findings:audit.findings.length,by_kind:audit.findings.reduce((r,f)=>({...r,[f.kind]:(r[f.kind]??0)+1}),{} as Record<string,number>)}));
 const rows=[];for await(const s of await SandboxInstance.list({limit:100}))rows.push({name:s.metadata.name,status:s.status,role:s.metadata.labels?.axlint_role});
 await writeFile('docs/evidence/wrapup/capacity-before.json',JSON.stringify(rows,null,2)+'\n');
 console.log(JSON.stringify({capacity:rows}));
} finally {await c.close();}
