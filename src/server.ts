import { MCPServer } from "mcp-use";
import { SandboxInstance } from "@blaxel/core";
import { z } from "zod";
import { namedToken, protectedTools, accessMessage, checkToolAccess } from "./access.js";
import { auditServer, auditServerTool } from "./tools/audit.js";
import { proposePatch, proposePatchTool } from "./tools/propose.js";
import { createConfirmPatchTool } from "./tools/confirm.js";
import { verifyPatchDefinition, verifyPatchHandler } from "./tools/verify-patch.js";
import { getVerificationResultDefinition, getVerificationResult } from "./tools/get-verification-result.js";
import { readRun } from "./blaxel/runs.js";
import { readRunArtifacts, livePresentation, saveRunConfirmation } from "../viewer/live-run.js";
import { fixturePresentation, RunPresentationSchema } from "../viewer/presentation.js";

const server = new MCPServer({
  name: "axlint",
  title: "AX Lint",
  version: "0.4.0",
  websiteUrl: "https://github.com/horne-ra/yc-hackathon-make-something-agents-want",
  icons: [{src:"https://fast-pulse-rlqvb.run.mcp-use.com/icon.svg", mimeType:"image/svg+xml", sizes:["any"]}],
  description: "Audit, propose, verify and confirm MCP interface improvements",
  instructions: "Use audit_server, propose_patch, verify_patch and get_verification_result to evaluate a metadata-only candidate. Apply source edits only after an Improved verdict, then redeploy and call confirm_patch. preview_run replays the recorded fallback; ping checks hosting.",
});

// Discovery, prompts, metadata auditing and widget assets are public. Recheck
// credentials on every protected request, even when reusing an MCP session.
server.app.use("*", async (context, next) => {
  const path = context.req.path;
  if (path.startsWith("/.well-known/oauth-") || path.startsWith("/.well-known/openid-configuration")) return context.json({ error: "Not found" }, 404);
  if ((path === "/mcp" || path === "/mcp/") && context.req.method === "POST") {
    let body;
    try { body = await context.req.raw.clone().json(); } catch { return next(); }
    const calls = Array.isArray(body) ? body : [body];
    if (calls.some(call => call?.method === "tools/call" && protectedTools.has(call.params?.name)) && !namedToken(context.req.header("Authorization"))) {
      return context.json({error:{code:"unauthorized",message:accessMessage}}, 401);
    }
  }
  return next();
});
server.use("mcp:tools/call", async (context, next) => {
  // The protocol guard also covers in-process transports and validates quota
  // only after a well-formed verify input. HTTP failures above return 401.
  const failure = await checkToolAccess(context.params.name, context.params.arguments, context.request?.header("Authorization"));
  return failure ?? next();
});
server.get("/icon.svg", context => context.body('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#101827"/><path d="M13 34l12 12 26-28" fill="none" stroke="#57e3ad" stroke-width="7"/></svg>',200,{"Content-Type":"image/svg+xml"}));

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
  for (const key of ["ANTHROPIC_API_KEY", "BL_API_KEY", "MCP_USE_API_KEY", "AXLINT_API_TOKENS"]) {
    const secret = process.env[key];
    if (secret) message = message.replaceAll(secret, "<redacted>");
  }
  return message;
}

export const ping = server.tool({
  name: "ping",
  title: "Check hosting",
  description: "Use to check AX Lint hosting: outbound HTTPS, configured secrets and access to the configured Blaxel proof sandbox. Returns no secret values.",
  inputSchema: z.object({}),
  outputSchema,
  view: { name: "ping", description: "AX Lint platform connectivity results" },
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
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

  const runId = process.env.AXLINT_QUOTA_SANDBOX || process.env.AXLINT_SPIKE_RUN_ID || null;
  let sandbox: z.infer<typeof outputSchema>["sandbox"] = {ok:false, status:"AXLINT_QUOTA_SANDBOX or AXLINT_SPIKE_RUN_ID is not configured", runId, progress:null};
  if (runId && secrets.blaxel && secrets.workspace) {
    try {
      const instance = await SandboxInstance.get(runId);
      const stored = JSON.parse(await instance.fs.read(process.env.AXLINT_QUOTA_SANDBOX ? "/app/axlint-run/progress.json" : "/app/axlint-spike/progress.json"));
      // Connectivity proof is a summary. Complete historical trials remain in
      // retained run files and are available through get_verification_result.
      const progress = {
        readable: true,
        source: "retained connectivity proof; not current verification status",
        ...(typeof stored?.updated_at === "string" ? { updated_at: stored.updated_at } : {}),
        ...(typeof stored?.progress?.done === "number" ? { done: stored.progress.done } : {}),
        ...(typeof stored?.progress?.total === "number" ? { total: stored.progress.total } : {}),
        ...(typeof stored?.ticks === "number" ? { ticks: stored.ticks } : {}),
      };
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
  title: "Replay S8 milestone",
  description: "Use to preview AX Lint's read-only verification viewer using the recorded live Railway run. Replays the completed S8 milestone and its recorded confirmation gates; does not run verification or apply a patch.",
  inputSchema: z.object({phase:z.enum(["running", "complete"]).default("complete").describe("Choose the complete recorded live run or an illustrative partial playback snapshot")}),
  outputSchema: RunPresentationSchema,
  view: {name:"preview-run",description:"Recorded S8 milestone with audit, patch, trials, verdict and actual confirmation"},
  annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false},
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
const promptSchema = z.object({server_url:z.string().describe("Target MCP URL"),source_paths:z.string().describe("Source file paths, separated by commas; include declarations, enums, validation constants and handlers")});
server.prompt({name:"improve-agent-experience",title:"Improve agent experience",description:"Audit, propose with complete source facts, verify, then apply only an Improved candidate and confirm the deployed metadata.",schema:promptSchema},async ({server_url,source_paths})=>({messages:[{role:"user",content:{type:"text",text:`Improve ${server_url}. Read ${source_paths} and every file defining allowed values and defaults, including imports, enums, validation constants and handlers. Call audit_server; select the highest severity findings. Call propose_patch with the fresh audit and complete source files. Review warnings and the metadata-only diff. Use pre-registered tasks and verify_patch, then poll get_verification_result to completion. Apply source edits ONLY if the verdict is Improved; preserve all trials if Inconclusive or Regressed. After Improved, commit, push and wait for redeployment, then call confirm_patch with the new exact revision. Report all four confirmation gates and the provisional three-trials limitation.`}}]}));
server.prompt({name:"verify-only",title:"Verify without applying",description:"Verify an existing metadata-only PatchSpec with frozen tasks, poll to completion and report every verdict; never apply edits.",schema:z.object({server_url:z.string().describe("Target MCP URL"),patch_path:z.string().describe("Local PatchSpec JSON path"),tasks_path:z.string().describe("Local pre-registered Tasks JSON path")})},async ({server_url,patch_path,tasks_path})=>({messages:[{role:"user",content:{type:"text",text:`Read the PatchSpec at ${patch_path} and frozen tasks at ${tasks_path}. Verify against ${server_url} with verify_patch (trials:3, model:default), then poll get_verification_result to completion. Report the verdict, all failures, token counts, model and scoring version. Provisional: 3 trials per condition. Do not apply source edits, change tasks, or rescore frozen results.`}}]}));
export default server;
