import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { runBenchmark, type Connection, type Task } from './hand-run-common.js';

const tasks: Task[] = [
  { id: 't1-route', prompt: 'List the issues about the checkout page.', expect: { tool: 'search_issues', args: { query: { contains: 'checkout' } } } },
  { id: 't2-status', prompt: 'Which issues is someone actively working on right now?', expect: { tool: 'list_issues', args: { status: { equals: 'in_progress' } } } },
  { id: 't3-payload', prompt: "Give me a quick list of maria's open issues.", expect: { tool: 'list_issues', args: { status: { equals: 'open' }, assignee: { contains: 'maria' }, include_comments: { equals: false } } } },
  { id: 't4-control', prompt: 'Pull up issue TRK-117.', control: true, expect: { tool: 'get_issue', args: { id: { equals: 'TRK-117' } } } },
];
export const TRACKR_PATCH = [
  { op: 'set_tool_description', tool: 'list_issues', value: 'Filter issues by structured fields (status, assignee). Does not search text; to find issues by topic or keyword, use search_issues.' },
  { op: 'set_tool_description', tool: 'search_issues', value: 'Full-text search over issue titles and bodies. Use when the user describes issues by topic or keyword. To filter by status or assignee, use list_issues.' },
  { op: 'set_param_description', tool: 'list_issues', param: 'status', value: 'One of: open, in_progress, blocked, closed. open: not started. in_progress: someone is actively working on it. blocked: waiting on something. closed: done.' },
  { op: 'set_param_description', tool: 'list_issues', param: 'include_comments', value: 'Include full comment threads, roughly 1 to 2K tokens per issue. Defaults to true. Set false when only titles and status are needed.' },
];
export function patchTrackr(tools: Tool[]) {
  for (const op of TRACKR_PATCH) {
    const tool = tools.find(t => t.name === op.tool);
    assert.ok(tool, `Missing patch tool ${op.tool}`);
    if (op.op === 'set_tool_description') tool.description = op.value;
    else {
      const properties = tool.inputSchema.properties as Record<string, Record<string, unknown>>;
      assert.ok(op.param && properties?.[op.param], `Missing patch parameter ${op.tool}.${op.param}`);
      properties[op.param].description = op.value;
    }
  }
  return tools;
}
async function connect(url: string): Promise<Connection> {
  const client = new Client({ name: 'axlint-trackr-hand-run', version: '0.1.0' });
  const transport = new StreamableHTTPClientTransport(new URL(url));
  try {
    await client.connect(transport);
    const tools = (await client.listTools()).tools;
    assert.deepEqual(tools.map(t => t.name).sort(), ['get_issue', 'list_issues', 'search_issues']);
    return { tools, identity: client.getServerVersion(), call: (name, args) => client.callTool({ name, arguments: args }, undefined, { timeout: 30_000 }), close: () => client.close() };
  } catch (error) { await transport.close().catch(() => {}); throw error; }
}
async function main() {
  try { process.loadEnvFile(resolve('.env')); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  const url = process.env.TRACKR_URL;
  if (!url) throw new Error('Missing TRACKR_URL in .env; ask the lead for the local or Railway MCP URL.');
  if (process.argv.includes('--check')) {
    const connection = await connect(url);
    try {
      assert.equal(connection.tools.find(t => t.name === 'list_issues')?.description, 'List issues.');
      assert.equal(connection.tools.find(t => t.name === 'search_issues')?.description, 'Search issues.');
      const candidate = patchTrackr(structuredClone(connection.tools));
      assert.equal(candidate.find(t => t.name === 'get_issue')?.description, connection.tools.find(t => t.name === 'get_issue')?.description);
      const result = await connection.call('get_issue', { id: 'TRK-117' });
      assert.equal(Boolean((result as { isError?: boolean }).isError), false);
      console.log(`PASS trackr tools/list: three tools; baseline descriptions exact; control unchanged; TRK-117 read succeeds; identity ${JSON.stringify(connection.identity)}`);
    } finally { await connection.close(); }
    return;
  }
  await runBenchmark({ name: 'trackr', tasks, connect: () => connect(url), patch: patchTrackr, allowlist: new Set(['list_issues', 'search_issues', 'get_issue']), provenance: { server_url: url, patch: TRACKR_PATCH, source: 'Frozen SPEC.md four tasks and compact patch verbatim', result_token_basis: 'JSON.stringify of the complete MCP callTool response', behavior: 'Both metadata conditions execute against the identical live TRACKR_URL; candidate metadata applied in the client only.' } });
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
