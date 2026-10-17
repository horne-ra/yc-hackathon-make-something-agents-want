import { MCPServer } from "mcp-use";
import { SandboxInstance } from "@blaxel/core";
import { z } from "zod";

const server = new MCPServer({
  name: "axlint-platform-ping",
  title: "AX Lint Platform Ping",
  version: "0.1.0",
  description: "AX Lint platform connectivity proof",
  instructions: "Call ping to check outbound HTTPS, secret configuration and Blaxel connectivity.",
});

server.get("/health", context => context.json({ status: "healthy" }));

const check = z.object({ ok: z.boolean(), status: z.string() });
const outputSchema = z.object({
  message: z.string(),
  checkedAt: z.string(),
  https: check,
  secrets: z.object({ anthropic: z.boolean(), blaxel: z.boolean(), workspace: z.boolean() }),
  sandbox: check.extend({ runId: z.string().nullable(), progress: z.unknown().nullable() }),
});

function safeError(error: unknown): string {
  const apiError = error as { code?: unknown; error?: unknown } | null;
  let message = error instanceof Error ? error.message : typeof apiError?.error === "string" ? `${String(apiError.code ?? "API error")}: ${apiError.error}` : String(error);
  for (const key of ["ANTHROPIC_API_KEY", "BL_API_KEY", "MCP_USE_API_KEY"]) {
    const secret = process.env[key];
    if (secret) message = message.replaceAll(secret, "<redacted>");
  }
  return message;
}

export const ping = server.tool({
  name: "ping",
  description: "Check AX Lint hosting: outbound HTTPS, configured secrets and access to the configured Blaxel proof sandbox. Returns no secret values.",
  inputSchema: z.object({}),
  outputSchema,
  view: { name: "ping", description: "AX Lint platform connectivity results" },
  annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
}, async () => {
  const secrets = {
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    blaxel: Boolean(process.env.BL_API_KEY?.trim()),
    workspace: Boolean(process.env.BL_WORKSPACE?.trim()),
  };
  let https = { ok: false, status: "not_checked" };
  try {
    const response = await fetch("https://example.com", { signal: AbortSignal.timeout(10000) });
    https = { ok: response.ok, status: `HTTP ${response.status}` };
    await response.body?.cancel();
  } catch (error) { https.status = safeError(error); }

  const runId = process.env.AXLINT_SPIKE_RUN_ID || null;
  let sandbox: z.infer<typeof outputSchema>["sandbox"] = {ok:false, status:"AXLINT_SPIKE_RUN_ID is not configured", runId, progress:null};
  if (runId && secrets.blaxel && secrets.workspace) {
    try {
      const instance = await SandboxInstance.get(runId);
      const progress = JSON.parse(await instance.fs.read("/app/axlint-spike/progress.json"));
      sandbox = { ok:true, status:instance.status ?? "reachable", runId, progress };
    } catch (error) { sandbox.status = safeError(error); }
  }
  const ok = https.ok && Object.values(secrets).every(Boolean) && sandbox.ok;
  const data = {message:ok ? "pong: all platform checks passed" : "pong: platform checks incomplete or failed", checkedAt:new Date().toISOString(), https, secrets, sandbox};
  return {content:[{type:"text" as const, text:JSON.stringify(data)}], structuredContent:data, ...(ok ? {} : {isError:true})};
});

export default server;
