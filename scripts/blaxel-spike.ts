import { loadEnvFile } from "node:process";
import { SandboxInstance } from "@blaxel/core";

try { loadEnvFile(); } catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

const directory = "/app/axlint-spike";
const processName = "axlint-retention-spike";
const [command = "start", runId] = process.argv.slice(2);

// There is deliberately no local run registry: the sandbox name is the run ID.
const runner = `
const fs = require("node:fs");
const path = ${JSON.stringify(directory)};
const startedAt = Date.now();
let ticks = 0;
const save = (name, data) => {
  fs.writeFileSync(path + "/" + name + ".tmp", JSON.stringify(data));
  fs.renameSync(path + "/" + name + ".tmp", path + "/" + name);
};
const progress = () => save("progress.json", {status:"running", ticks, elapsedMs:Date.now()-startedAt, startedAt:new Date(startedAt).toISOString()});
progress();
const interval = setInterval(() => { ticks++; progress(); }, 5000);
setTimeout(() => {
  clearInterval(interval);
  const result = {status:"complete", ticks, elapsedMs:Date.now()-startedAt, startedAt:new Date(startedAt).toISOString(), completedAt:new Date().toISOString()};
  save("progress.json", result);
  save("result.json", result);
}, 120000);
`;

async function main(): Promise<void> {
  for (const key of ["BL_API_KEY", "BL_WORKSPACE"]) {
    if (!process.env[key]) throw new Error(`Missing ${key}; populate the gitignored .env`);
  }
  if (command === "start") {
    const name = `axlint-spike-${Date.now()}`;
    const beforeCreate = performance.now();
    const sandbox = await SandboxInstance.createIfNotExists({
      name, image: "blaxel/base-image:latest", memory: 1024, ttl: "3h", region: process.env.BL_REGION || "us-pdx-1",
      labels: { project: "axlint", purpose: "platform-spike" },
    });
    await sandbox.fs.writeTree([{path:"runner.cjs", content:runner}], directory);
    const beforeExec = performance.now();
    const job = await sandbox.process.exec({
      name: processName,
      command: `node ${directory}/runner.cjs`,
      waitForCompletion: false,
      keepAlive: true,
      timeout: 180,
    });
    console.log(JSON.stringify({run_id:name, status:job.status, process:job.name,
      launch_ms:Math.round(performance.now()-beforeExec), setup_ms:Math.round(performance.now()-beforeCreate), ttl:"3h"}));
    return;
  }
  if ((command === "read" || command === "delete") && runId) {
    const sandbox = await SandboxInstance.get(runId);
    if (command === "delete") { await sandbox.delete(); console.log(JSON.stringify({run_id:runId, deleted:true})); return; }
    const job = await sandbox.process.get(processName);
    const progress = JSON.parse(await sandbox.fs.read(`${directory}/progress.json`));
    const listing = await sandbox.fs.ls(directory);
    const resultExists = listing.files?.some(file => file.name === "result.json");
    const result = resultExists ? JSON.parse(await sandbox.fs.read(`${directory}/result.json`)) : null;
    console.log(JSON.stringify({run_id:runId, process_status:job.status, exit_code:job.exitCode, progress, result}));
    return;
  }
  throw new Error("Usage: tsx scripts/blaxel-spike.ts start | read <run_id> | delete <run_id>");
}

main().catch(error => {
  // SDK request objects can contain authorization; print only the error message.
  const apiError = error as { code?: unknown; error?: unknown } | null;
  let message = error instanceof Error ? error.message : typeof apiError?.error === "string" ? `${String(apiError.code ?? "API error")}: ${apiError.error}` : String(error);
  for (const key of ["BL_API_KEY", "MCP_USE_API_KEY", "ANTHROPIC_API_KEY"]) {
    const secret = process.env[key];
    if (secret) message = message.replaceAll(secret, "<redacted>");
  }
  console.error(JSON.stringify({status:"failed", error:message}));
  process.exitCode = 1;
});
