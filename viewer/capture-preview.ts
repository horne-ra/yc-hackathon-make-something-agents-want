// Development QA: invoke the real screenshot CLI without exposing its header.
import { spawnSync } from "node:child_process";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
loadEnvFile(fileURLToPath(new URL("../.env",import.meta.url)));
const token=process.env.AXLINT_API_TOKEN;
if(!token)throw Error("AXLINT_API_TOKEN is missing");
const [endpoint="http://127.0.0.1:3014/mcp",output="/private/tmp/axlint-viewer-preview.png",phase="complete",width="1100"] = process.argv.slice(2);
const extra = [...(process.env.AXLINT_QA_CDP_URL ? ["--cdp-url",process.env.AXLINT_QA_CDP_URL] : []),...(process.env.AXLINT_QA_CAPTURE_DELAY_MS ? ["--delay",process.env.AXLINT_QA_CAPTURE_DELAY_MS] : [])];
const result=spawnSync("npx",["-y","-p","mcp-use@2.10.0","-p","@mcp-use/client@latest","mcp-use","screenshot","--mcp",endpoint,"--tool","preview_run",`phase=${phase}`,"--header",`Authorization: Bearer ${token}`,"--output",output,"--width",width,"--height","1200","--json",...extra],{encoding:"utf8",maxBuffer:1024*1024});
console.log([result.stdout,result.stderr].filter(Boolean).join("\n").replaceAll(token,"<redacted>"));
process.exitCode=result.status??1;
