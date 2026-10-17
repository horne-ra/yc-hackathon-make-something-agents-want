// Run manually after configuring the Claude app; never prints a credential.
import { spawnSync } from "node:child_process";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
loadEnvFile(fileURLToPath(new URL("../.env", import.meta.url)));
const token = process.env.AXLINT_API_TOKEN;
if (!token) throw new Error("Set AXLINT_API_TOKEN in this checkout's gitignored .env first");
const target = process.argv[2] ?? "/Users/ransomhorne/Documents/trackr";
const run = (args: string[]) => {
  const result = spawnSync("claude",args,{cwd:target,encoding:"utf8"});
  const output = [result.stdout,result.stderr].filter(Boolean).join("\n").replaceAll(token,"<redacted>");
  if (output.trim()) console.log(output.trim());
  return result.status;
};
run(["mcp","remove","axlint","--scope","local"]);
const code = run(["mcp","add","--transport","http","--scope","local","axlint","https://fast-pulse-rlqvb.run.mcp-use.com/mcp","--header",`Authorization: Bearer ${token}`]);
if (code !== 0) process.exitCode=code ?? 1;
