// Configure a literal environment reference; never store a bearer value in client settings.
import { spawnSync } from "node:child_process";
const target = process.argv[2] ?? "/Users/ransomhorne/Documents/trackr";
const run = (args: string[]) => {
  const result = spawnSync("claude",args,{cwd:target,encoding:"utf8"});
  const output = [result.stdout,result.stderr].filter(Boolean).join("\n");
  if (output.trim()) console.log(output.trim());
  return result.status;
};
run(["mcp","remove","axlint","--scope","local"]);
const definition={type:"http",url:"https://fast-pulse-rlqvb.run.mcp-use.com/mcp",headers:{Authorization:"Bearer ${AXLINT_CLAUDE_TOKEN}"}};
const code = run(["mcp","add-json","--scope","local","axlint",JSON.stringify(definition)]);
if (code !== 0) process.exitCode=code ?? 1;
else console.log("Launch Claude Code with AXLINT_CLAUDE_TOKEN set from the local .env claude.token value. This script stored only the variable reference.");
