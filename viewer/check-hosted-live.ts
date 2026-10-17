// Authenticated protocol checks, with no credential values in output.
import assert from "node:assert/strict";
import {loadEnvFile} from "node:process";
import {Client} from "@modelcontextprotocol/sdk/client/index.js";
import {StreamableHTTPClientTransport} from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {fixturePresentation,RunPresentationSchema} from "./presentation.js";
loadEnvFile(new URL("../.env",import.meta.url));
const token=process.env.AXLINT_API_TOKEN;if(!token)throw Error("AXLINT_API_TOKEN is missing");
const endpoint=process.argv[2]??"https://fast-pulse-rlqvb.run.mcp-use.com/mcp";
const client=new Client({name:"axlint-live-viewer-check",version:"1.0.0"});
try{
 const missing=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json",accept:"application/json, text/event-stream"},body:JSON.stringify({jsonrpc:"2.0",id:1,method:"initialize",params:{protocolVersion:"2025-06-18",capabilities:{},clientInfo:{name:"auth-check",version:"1"}}})});
 assert.equal(missing.status,401);assert.equal(missing.headers.get("www-authenticate"),null);
 console.log("PASS hosted auth: missing token401, no OAuth challenge");
 await client.connect(new StreamableHTTPClientTransport(new URL(endpoint),{requestInit:{headers:{Authorization:`Bearer ${token}`}}}));
 for(const phase of ["running","complete"] as const){
  const response=await client.callTool({name:"preview_run",arguments:{phase}});
  assert(!response.isError);
  const data=RunPresentationSchema.parse(response.structuredContent);
  assert(JSON.stringify(data)===JSON.stringify(fixturePresentation(phase)),`Hosted ${phase} data differs from local converted run; check active deployment`);
  assert.equal((response._meta as any)?.ui?.resourceUri,"ui://views/preview-run.html");
  assert(response.content.some((item:any)=>item.type==="resource_link"&&item.uri==="ui://views/preview-run.html"));
  console.log(`PASS hosted ${phase}: exact converted live data, all24trials, native MCP App metadata`);
 }
 const invalid=await client.callTool({name:"preview_run",arguments:{phase:"invalid"}});assert.equal(invalid.isError,true);
 console.log("PASS hosted schema: invalid playback phase rejected");
 const resource=await client.readResource({uri:"ui://views/preview-run.html"});
 const html=resource.contents.map(item=>"text" in item?item.text:"").join("\n");
 const assets=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)].map(match=>new URL(match[1],endpoint).href);
 assert(assets.length>=2);
 const secrets=Object.entries(process.env).filter(([key,value])=>value&&/(KEY|TOKEN|SECRET|PASSWORD)/i.test(key)).map(([,value])=>value!);
 let js="";
 for(const url of assets){const response=await fetch(url);assert.equal(response.status,200);const content=await response.text();for(const secret of secrets)assert(!content.includes(secret),"Configured secret found in public asset");if(url.includes(".js"))js+=content;}
 assert(js.includes("RECORDED LIVE RUN"));assert(!js.includes("RECORDED FIXTURE PREVIEW"));
 console.log("PASS hosted widget assets: public200, recorded-live label present, no configured credential values");
}finally{await client.close()}
