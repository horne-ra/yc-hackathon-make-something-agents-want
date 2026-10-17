import {spawnSync} from "node:child_process";
import {loadEnvFile} from "node:process";
loadEnvFile();const token=process.env.AXLINT_API_TOKEN;if(!token)throw Error("AXLINT_API_TOKEN missing");
const [endpoint="http://127.0.0.1:3016/mcp",runId="axlint-run-e0aaa3be-cf54-4d77-9b2e-17fe41aed395",output="/private/tmp/axlint-live-result.png"]=process.argv.slice(2);
const result=spawnSync("npx",["-y","-p","mcp-use@2.10.0","-p","@mcp-use/client@latest","mcp-use","screenshot","--mcp",endpoint,"--tool","get_verification_result",`run_id=${runId}`,"--header",`Authorization: Bearer ${token}`,"--output",output,"--width","768","--height","1200","--json"],{encoding:"utf8",maxBuffer:1048576});
console.log([result.stdout,result.stderr].filter(Boolean).join("\n").replaceAll(token,"<redacted>"));process.exitCode=result.status??1;
