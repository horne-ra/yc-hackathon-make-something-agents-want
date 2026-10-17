import { MCPServer } from "mcp-use";
import { SandboxInstance } from "@blaxel/core";
import { z } from "zod";
import { acceptsBearer } from "../viewer/auth.js";
import { auditServer, auditServerTool } from "./tools/audit.js";
import { proposePatch, proposePatchTool } from "./tools/propose.js";
import { createConfirmPatchTool } from "./tools/confirm.js";
import { verifyPatchDefinition, verifyPatchHandler } from "./tools/verify-patch.js";
import { getVerificationResultDefinition, getVerificationResult } from "./tools/get-verification-result.js";
import { readRun } from "./blaxel/runs.js";
import { readRunArtifacts, livePresentation, saveRunConfirmation } from "../viewer/live-run.js";
import { fixturePresentation, RunPresentationSchema } from "../viewer/presentation.js";

const server = new MCPServer({
  name: "axlint-platform-ping",
  title: "AX Lint",
  version: "0.3.0",
  description: "Audit, propose, verify and confirm MCP interface improvements",
  instructions: "Use audit_server, propose_patch, verify_patch and get_verification_result to evaluate a metadata-only candidate. Apply source edits only after an Improved verdict, then redeploy and call confirm_patch. preview_run replays the recorded fallback; ping checks hosting.",
});

// Guard the MCP transport on every request, including existing-session calls.
// Widget JS/CSS are public static code; their render data arrives through MCP.
server.app.use("*", async (context, next) => {
  const path = context.req.path;
  // This service uses a fixed header credential, not OAuth discovery.
  if (path.startsWith("/.well-known/oauth-") || path.startsWith("/.well-known/openid-configuration")) {
    return context.json({ error: "Not found" }, 404);
  }
  if (path !== "/mcp" && path !== "/mcp/") return next();
  const expected = process.env.AXLINT_API_TOKEN;
  if (!expected || expected.length < 32) {
    return context.json({ error: "AX Lint authentication is not configured" }, 401);
  }
  if (!acceptsBearer(context.req.header("Authorization"), expected)) {
    return context.json({ error: "Unauthorized: send Authorization: Bearer <token>" }, 401);
  }
  return next();
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
  for (const key of ["ANTHROPIC_API_KEY", "BL_API_KEY", "MCP_USE_API_KEY", "AXLINT_API_TOKEN"]) {
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
  // Keep typed render data in structuredContent. Expose the View as an actual
  // content link too, so clients can discover it without displaying result _meta.
  // mcp-use stamps the matching ui.resourceUri metadata from the View binding.
  return {
    content: [
      { type: "text" as const, text: data.message },
      ...(ok ? [{
        type: "resource_link" as const,
        uri: "ui://views/ping.html",
        name: "AX Lint platform ping",
        description: "Interactive platform connectivity widget",
        mimeType: "text/html;profile=mcp-app",
      }] : []),
    ],
    structuredContent: data,
    ...(ok ? {} : { isError: true }),
  };
});

// Temporary fixture-only tool. It never starts, polls or mutates a real run.
export const previewRun = server.tool({
  name: "preview_run",
  description: "Preview AX Lint's read-only verification viewer using the recorded live Railway run. Replays the completed S8 milestone and its recorded confirmation gates; does not run verification or apply a patch.",
  inputSchema: z.object({phase:z.enum(["running", "complete"]).default("complete").describe("Choose the complete recorded live run or an illustrative partial playback snapshot")}),
  outputSchema: RunPresentationSchema,
  view: {name:"preview-run",description:"Recorded S8 milestone with audit, patch, trials, verdict and actual confirmation"},
  annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
}, async ({phase}) => ({
  content:[{type:"text" as const,text:"Recorded live Railway run: trackr improved from 9/12 to 12/12 first-call passes; returned result tokens 115,194 → 13,917 (−87.9%); static tool tokens 651 → 903. Spotlight: t3-payload, 10,408 → 441 result tokens. Provisional, 3 trials per condition. The four confirmation gates are recorded from the real S8 deployment. Partial playback timing is illustrative."},
    {type:"resource_link" as const,uri:"ui://views/preview-run.html",name:"AX Lint verification preview",mimeType:"text/html;profile=mcp-app"}],
  structuredContent:fixturePresentation(phase),
}));

const jsonResult = <T extends object>(data:T)=>({content:[{type:"text" as const,text:JSON.stringify(data)}],structuredContent:data});
export const audit = server.tool({...auditServerTool,name:"audit_server"},async input=>jsonResult(await auditServer(input)));
export const propose = server.tool({...proposePatchTool,name:"propose_patch"},async input=>jsonResult(await proposePatch(input)));
export const verify = server.tool({...verifyPatchDefinition,name:"verify_patch"},verifyPatchHandler);
export const result = server.tool({...getVerificationResultDefinition,name:"get_verification_result",view:{name:"verification-result",description:"Live retained verification run files"}},async input=>{
 const data=await getVerificationResult(input);
 let viewer;
 try{viewer=livePresentation(input.run_id,data,await readRunArtifacts(input.run_id))}catch{/* A view failure must not hide the core run result. */}
 return {...jsonResult(data),...(viewer?{_meta:{axlintViewer:viewer}}:{}),content:[{type:"text" as const,text:JSON.stringify(data)},{type:"resource_link" as const,uri:"ui://views/verification-result.html",name:"AX Lint verification run",mimeType:"text/html;profile=mcp-app"}]};
});
const confirmation=createConfirmPatchTool(readRun);
export const confirm = server.tool({...confirmation.definition,name:"confirm_patch"},async input=>{
 const data=await confirmation.handler(input);
 try{await saveRunConfirmation(input.run_id,data)}catch{/* The gate result remains authoritative if auxiliary view persistence fails. */}
 return jsonResult(data);
});
export default server;
