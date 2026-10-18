// Operate only on the existing AX Lint server; CLI JSON output omits values.
import {realpathSync,readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {randomBytes} from 'node:crypto';
const path=join(realpathSync(join(dirname(realpathSync('node_modules/mcp-use')),'@mcp-use/cli')),'dist/index.js');
const {main}=await import(pathToFileURL(path).href);
const server='1df33784-bc1a-4b0a-a539-22c8ed18ab05',org='org-41c8b7a1-w8fak';
// Refuse to mutate a different deployment, even if CLI defaults change.
const headers={'x-api-key':process.env.MCP_USE_API_KEY,'x-profile-id':'91542208-1224-4c86-a16f-99ed481abf09'};
const current=await fetch(`https://cloud.manufact.com/api/v1/servers/${server}`,{headers});
if(!current.ok)throw Error('Existing deployment ownership check failed');
const state=await current.json();
if(state.id!==server||state.organizationId!=='91542208-1224-4c86-a16f-99ed481abf09'||state.slug!=='fast-pulse-rlqvb')throw Error('Unexpected destination; refusing credential mutation');
console.log('PASS existing AX Lint deployment destination verified in owned organization');
let content=readFileSync('.env','utf8');
if(!process.env.AXLINT_API_TOKENS){
 const tokens=Object.fromEntries(['codex','cursor','claude','judges'].map(name=>[name,{token:randomBytes(32).toString('base64url'),...(name==='judges'?{daily_verify_limit:5}:{})}]));
 content=content.replace(/^AXLINT_API_TOKEN=.*\n?/m,'').trimEnd()+'\nAXLINT_API_TOKENS='+JSON.stringify(tokens)+'\nAXLINT_QUOTA_SANDBOX=axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d\n';
 writeFileSync('.env',content,{mode:0o600});chmodSync('.env',0o600);
 process.env.AXLINT_API_TOKENS=JSON.stringify(tokens);
 process.env.AXLINT_QUOTA_SANDBOX='axlint-run-f2f5be10-367e-4cd5-8614-cb0658fa3e2d';
}
for(const key of ['AXLINT_API_TOKENS','AXLINT_QUOTA_SANDBOX']){
 const code=await main(['servers','env','set',server,`${key}=${process.env[key]}`,'--secret','--org',org,'--json'],{frameworkVersion:'2.10.0'});
 if(code!==0)process.exit(code);
}
// Stop accepting the exposed credential; the new server never reads this key.
const code=await main(['servers','env','unset',server,'AXLINT_API_TOKEN','--yes','--org',org,'--json'],{frameworkVersion:'2.10.0'});
if(code!==0)process.exit(code);
console.log('PASS four named tokens stored only in local .env and write-only Manufact env; retired key removed.');
