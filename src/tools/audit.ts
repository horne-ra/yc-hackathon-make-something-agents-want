import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { AuditInputSchema, AuditSchema, ToolsSchema, auditTools, hashTools, parameterSummaries, type Tool } from '../core/index.js';

export type Metadata = { server_version: string; tools: Tool[] };
export type AuditDependencies = { readMetadata?: (url: string) => Promise<Metadata>; countStaticTokens?: (tools: Tool[]) => Promise<number> };
/** Deliberately exposes only initialize and tools/list: audit never calls target tools. */
export async function readMetadata(url: string): Promise<Metadata> {
  const client = new Client({ name: 'axlint-metadata', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(url));
  try {
    await client.connect(transport);
    const tools: Tool[] = []; let cursor: string | undefined;
    do { const page = await client.listTools(cursor ? { cursor } : {}); tools.push(...ToolsSchema.parse(page.tools)); cursor = page.nextCursor; } while (cursor);
    const version = client.getServerVersion()?.version;
    if (!version) throw new Error('missing_server_version: initialize did not report serverInfo.version');
    return { server_version: version, tools: ToolsSchema.parse(tools) };
  } finally { await client.close().catch(() => {}); }
}
export const providerTools = (tools: Tool[]): Anthropic.Tool[] => tools.map(t => ({ name: t.name, description: t.description ?? '', input_schema: t.inputSchema as Anthropic.Tool.InputSchema }));
export async function countStaticTokens(tools: Tool[]): Promise<number> {
  const model = process.env.AXLINT_MODEL;
  if (!model) throw new Error('missing_model: set AXLINT_MODEL');
  const provider = new Anthropic({ maxRetries: 0, timeout: 60_000 });
  const common = { model, system: 'You are a helpful assistant. Use the available tools to answer the user.', messages: [{ role: 'user' as const, content: 'Count.' }] };
  const without = await provider.messages.countTokens(common);
  const withTools = await provider.messages.countTokens({ ...common, tools: providerTools(tools) });
  return withTools.input_tokens - without.input_tokens;
}
export async function auditServer(raw: unknown, deps: AuditDependencies = {}) {
  const input = AuditInputSchema.parse(raw);
  const metadata = await (deps.readMetadata ?? readMetadata)(input.server_url);
  return AuditSchema.parse({ audit_id: `aud_${randomUUID()}`, server_url: input.server_url, server_version: metadata.server_version, tools_hash: hashTools(metadata.tools), static_tool_tokens: await (deps.countStaticTokens ?? countStaticTokens)(metadata.tools), tools: metadata.tools.map(t => ({ name: t.name, description_chars: (t.description ?? '').length, params: parameterSummaries(t) })), findings: auditTools(metadata.tools) });
}
export const auditServerTool = { name: 'audit_server', title: 'Audit MCP metadata', description: 'Use to read live MCP tools/list and deployment identity, report deterministic metadata findings and provider-counted static tool tokens. Never executes target tools.', inputSchema: AuditInputSchema.extend({server_url:AuditInputSchema.shape.server_url.describe('HTTP(S) MCP endpoint to inspect; only initialize and tools/list are called.')}), outputSchema: AuditSchema, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } };
