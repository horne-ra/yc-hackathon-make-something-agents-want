import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const token=randomBytes(32).toString('base64url');
const child=spawn(process.execPath,['node_modules/mcp-use/dist/bin.js','start','--host','127.0.0.1','--port','3011'],{env:{...process.env,AXLINT_API_TOKENS:JSON.stringify({codex:{token}})},stdio:'ignore'});
const base='http://127.0.0.1:3011';
const anonymous=new Client({name:'anonymous-auth-check',version:'1'});
const authorized=new Client({name:'authorized-auth-check',version:'1'});
try {
 for(let i=0;i<100;i++){try{if((await fetch(base+'/health')).ok)break}catch{}await new Promise(r=>setTimeout(r,50));}
 await anonymous.connect(new StreamableHTTPClientTransport(new URL(base+'/mcp')));
 assert.equal((await anonymous.listTools()).tools.length,7);
 assert.equal((await anonymous.listPrompts()).prompts.length,2);
 assert((await anonymous.listResources()).resources.length>=3);
 const prompt=await anonymous.getPrompt({name:'improve-agent-experience',arguments:{server_url:'https://example.com/mcp',source_paths:'src/tools.ts'}});assert.match(JSON.stringify(prompt),/ONLY if the verdict is Improved/);
 const resource=await anonymous.readResource({uri:'ui://views/ping.html'});
 const html=String(resource.contents.find(c=>'text' in c)?.text);assert.match(html,/<html/);
 for(const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g))assert.equal((await fetch(new URL(match[1],base))).status,200);
 for(const name of ['propose_patch','verify_patch','get_verification_result','confirm_patch','preview_run']){
  for(const authorization of [undefined,'Bearer incorrect',`Bearer ${token} extra`]){
   const response=await fetch(base+'/mcp',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream',...(authorization?{Authorization:authorization}:{})},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name,arguments:{}}})});
   assert.equal(response.status,401,name);assert.match(await response.text(),/named token/);assert.equal(response.headers.get('WWW-Authenticate'),null);
  }
 }
 await authorized.connect(new StreamableHTTPClientTransport(new URL(base+'/mcp'),{requestInit:{headers:{Authorization:`Bearer ${token}`}}}));
 const preview=await authorized.callTool({name:'preview_run',arguments:{}});assert(!preview.isError);assert.equal((preview.structuredContent as any).fixture,true);
 assert.equal((await fetch(base+'/icon.svg')).status,200);
 for(const route of ['/.well-known/oauth-protected-resource','/.well-known/oauth-authorization-server','/.well-known/openid-configuration'])assert.equal((await fetch(base+route)).status,404);
 console.log('PASS real HTTP auth: anonymous initialize/tools/resources/prompts/widget JS+CSS; all five protected tools reject missing/wrong/malformed bearer with 401; named bearer preview succeeds; public icon; no OAuth challenge');
} finally {await anonymous.close().catch(()=>{});await authorized.close().catch(()=>{});child.kill('SIGTERM');}
