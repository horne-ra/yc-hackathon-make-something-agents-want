import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { loadEnvFile } from "node:process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
try { loadEnvFile(); } catch { /* CI may not have local platform credentials. */ }

const token = randomBytes(32).toString("base64url");
const children: ReturnType<typeof spawn>[] = [];
async function start(port: number, credential: string | undefined) {
  const env = {...process.env, PORT:String(port)};
  if (credential) env.AXLINT_API_TOKEN = credential;
  else delete env.AXLINT_API_TOKEN;
  const child = spawn(process.execPath, ["node_modules/mcp-use/dist/bin.js", "start", "--host", "127.0.0.1", "--port", String(port)], {env, stdio:"ignore"});
  children.push(child);
  const base = `http://127.0.0.1:${port}`;
  for (let i=0; i<100; i++) {
    try { if ((await fetch(base+"/health")).ok) return base; } catch { /* listener starting */ }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error("Authentication test server did not start");
}
try {
  const base = await start(3011, token);
  for (const authorization of [undefined, "Bearer incorrect", "Basic incorrect", `Bearer ${token} extra`]) {
    const response = await fetch(base+"/mcp", {method:"POST", headers:authorization?{Authorization:authorization}:undefined, body:"{}"});
    assert.equal(response.status,401);
    assert.match(response.headers.get("WWW-Authenticate")??"", /^Bearer/);
    assert.doesNotMatch(await response.text(), new RegExp(token));
  }
  for (const method of ["GET", "HEAD", "DELETE", "OPTIONS"]) {
    assert.equal((await fetch(base+"/mcp",{method})).status,401);
  }
  const client = new Client({name:"auth-acceptance", version:"1"});
  const transport = new StreamableHTTPClientTransport(new URL(base+"/mcp"), {requestInit:{headers:{Authorization:`Bearer ${token}`}}});
  await client.connect(transport);
  assert((await client.listTools()).tools.some(tool=>tool.name==="ping"));
  const resource = await client.readResource({uri:"ui://views/ping.html"});
  const html = resource.contents.find(item=>"text" in item)?.text;
  assert.equal(typeof html,"string");
  const scripts = [...String(html).matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(match=>match[1]);
  assert(scripts.length > 0);
  for (const asset of scripts) assert.equal((await fetch(new URL(asset,base))).status,200);
  const sessionResponse = await fetch(base+"/mcp", {method:"POST",headers:{"Content-Type":"application/json", ...(transport.sessionId?{"mcp-session-id":transport.sessionId}:{})},body:JSON.stringify({jsonrpc:"2.0",id:2,method:"tools/list"})});
  assert.equal(sessionResponse.status,401);
  await client.close();
  const unconfigured = await start(3012, undefined);
  assert.equal((await fetch(unconfigured+"/mcp",{headers:{Authorization:`Bearer ${token}`}})).status,401);
  assert.equal((await fetch(unconfigured+"/health")).status,200);
  console.log("PASS auth: missing/wrong/malformed401, correct bearer MCP access, session reuse cannot bypass, public widget assets/health, missing configuration401");
} finally { for (const child of children) child.kill("SIGTERM"); }
