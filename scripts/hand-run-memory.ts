import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { mkdtemp, readFile, writeFile, rm, cp, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { runBenchmark, executeAllowed, type Connection, type Task } from './hand-run-common.js';
export const MEMORY_COMMIT = 'bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c';
const repo = resolve('vendor/mcp-servers');
const entrypoint = join(repo, 'src/memory/dist/index.js');
export const READ_ALLOWLIST = new Set(['read_graph', 'search_nodes', 'open_nodes']);
export const MEMORY_PATCH: Record<string, string> = {
  read_graph: 'Read the entire memory graph, including every entity, observation and relation. Use for broad requests for all remembered information. For a topic or keyword use search_nodes; for exact entity names use open_nodes.',
  search_nodes: 'Search entity names, types and observations by a case-insensitive keyword or topic; return matching entities and their connecting relations. Use for targeted questions about remembered information. For exact entity names use open_nodes; for the whole graph use read_graph.',
  open_nodes: 'Retrieve memory entities by exact, case-sensitive names, with their observations and connecting relations. Use when the user names the entries to open. Use search_nodes when the names are unknown or the request describes a topic.',
};
const tasks: Task[] = [
  { id: 'memory-broad', prompt: 'Show me everything you remember about this project.', expect: { tool: 'read_graph' } },
  { id: 'memory-search', prompt: 'Find anything mentioning the checkout migration.', expect: { tool: 'search_nodes' }, checkArgs: args => typeof args.query === 'string' && /checkout|migration/i.test(args.query) },
  { id: 'memory-control', prompt: 'Open the memory entries for Priya Nair and Dev Patel.', control: true, expect: { tool: 'open_nodes' }, checkArgs: args => Array.isArray(args.names) && args.names.includes('Priya Nair') && args.names.includes('Dev Patel') },
  { id: 'memory-boundary', prompt: "What do you know about Priya Nair's work on the checkout migration?", unscored: true, expect: { tool: 'search_nodes' } },
];
function makeSeed() {
  const people = ['Priya Nair', 'Dev Patel', 'Maria Lopez', 'Sam Okafor'].map(name => ({ type: 'entity', name, entityType: 'person', observations: [`${name} is an engineer at fictional Larkspur Goods.`, name === 'Priya Nair' ? 'Priya Nair leads the checkout migration and coordinates payment compatibility testing with Dev Patel.' : name === 'Dev Patel' ? 'Dev Patel works with Priya Nair on the checkout migration payment adapter.' : `${name} works on catalog reliability and inventory integrations.`] }));
  const checkout = { type: 'entity', name: 'Checkout Migration', entityType: 'project', observations: ['The checkout migration replaces the legacy order flow for fictional Larkspur Goods.', 'Priya Nair owns the rollout plan and Dev Patel owns payment adapter compatibility.', 'The checkout migration is in staging; launch depends on idempotency tests and a reviewed rollback plan.'] };
  const projects = Array.from({ length: 140 }, (_, i) => ({ type: 'entity', name: `Larkspur workstream ${String(i + 1).padStart(3, '0')}`, entityType: 'project', observations: Array.from({ length: 5 }, (_, j) => `Fictional workstream ${i + 1}, review ${j + 1}: the team maintains catalog availability, inventory synchronization, delivery estimates and account preferences. Acceptance requires reproducible reports, traceable changes, peer review, clear ownership, realistic staging data, rollback instructions and measured reliability before release. The planning record tracks dependencies, customer support feedback, routine monitoring, resource estimates and weekly checkpoints for this independent store initiative.`) }));
  const relations = [{ type: 'relation', from: 'Priya Nair', to: 'Checkout Migration', relationType: 'leads' }, { type: 'relation', from: 'Dev Patel', to: 'Checkout Migration', relationType: 'implements' }, ...projects.map((p, i) => ({ type: 'relation', from: people[i % 4].name, to: p.name, relationType: 'contributes_to' }))];
  return [...people, checkout, ...projects, ...relations].map(row => JSON.stringify(row)).join('\n') + '\n';
}
async function connectMemory(seedPath: string, executable = entrypoint): Promise<Connection> {
  const directory = await mkdtemp(join(tmpdir(), 'axlint-memory-trial-'));
  const memoryPath = join(directory, 'memory.jsonl');
  await copyFile(seedPath, memoryPath);
  const client = new Client({ name: 'axlint-memory-hand-run', version: '0.1.0' });
  const transport = new StdioClientTransport({ command: process.execPath, args: [executable], env: { PATH: process.env.PATH ?? '', MEMORY_FILE_PATH: memoryPath }, stderr: 'pipe' });
  let stderr = '';
  transport.stderr?.on('data', chunk => { stderr += String(chunk); });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.equal(tools.length, 9, 'The model must see all nine official tools');
    return { tools, identity: { pid: transport.pid, memory_file: memoryPath, commit: MEMORY_COMMIT }, call: (name, args) => client.callTool({ name, arguments: args }, undefined, { timeout: 30_000 }), close: async () => { try { await client.close(); } finally { await rm(directory, { recursive: true, force: true }); } } };
  } catch (error) { await transport.close().catch(() => {}); await rm(directory, { recursive: true, force: true }); throw new Error(`${error instanceof Error ? error.message : error}; memory stderr: ${stderr}`); }
}
function patch(tools: Tool[]) { return tools.map(tool => MEMORY_PATCH[tool.name] ? { ...tool, description: MEMORY_PATCH[tool.name] } : tool); }
async function check(seedPath: string) {
  const baseline = await connectMemory(seedPath);
  let baselineTools: Tool[];
  try {
    baselineTools = baseline.tools;
    console.log(`PASS tools/list: ${baseline.tools.length} tools visible`);
    let calls = 0;
    const stub = { ...baseline, call: async () => { calls++; return {}; } };
    const blocked = await executeAllowed(stub, READ_ALLOWLIST, 'delete_entities', { entityNames: ['Priya Nair'] });
    assert.equal(blocked.blocked, true); assert.equal(calls, 0);
    console.log('PASS execution allowlist: delete_entities blocked; handler calls = 0');
    const broad = await executeAllowed(baseline, READ_ALLOWLIST, 'read_graph', {});
    const narrow = await executeAllowed(baseline, READ_ALLOWLIST, 'search_nodes', { query: 'checkout migration' });
    assert.ok(JSON.stringify(broad.result).length > 400_000);
    assert.ok(JSON.stringify(narrow.result).length < JSON.stringify(broad.result).length / 10);
    console.log(`PASS seed size: read_graph ${JSON.stringify(broad.result).length} characters; search_nodes ${JSON.stringify(narrow.result).length} characters`);
  } finally { await baseline.close(); }
  const copy = await mkdtemp(join(repo, 'src/axlint-memory-fidelity-'));
  try {
    await cp(join(repo, 'src/memory'), copy, { recursive: true, filter: path => !path.includes('/node_modules') });
    let text = await readFile(join(repo, 'src/memory/index.ts'), 'utf8');
    for (const [name, value] of Object.entries(MEMORY_PATCH)) {
      const expression = new RegExp(`(server\\.registerTool\\(\\s*"${name}"[\\s\\S]*?description:\\s*)"(?:[^"\\\\]|\\\\.)*"`);
      assert.ok(expression.test(text), `source description exists for ${name}`);
      text = text.replace(expression, (_match, prefix) => prefix + JSON.stringify(value));
    }
    await writeFile(join(copy, 'index.ts'), text);
    execFileSync(join(repo, 'node_modules/.bin/tsc'), ['-p', join(copy, 'tsconfig.json')], { stdio: 'pipe' });
    const applied = await connectMemory(seedPath, join(copy, 'dist/index.js'));
    try { assert.deepEqual(applied.tools, patch(structuredClone(baselineTools))); console.log('PASS source fidelity: hand-applied src/memory/index.ts descriptions exactly reproduce candidate tools/list; all remaining metadata identical'); }
    finally { await applied.close(); }
  } finally { await rm(copy, { recursive: true, force: true }); }
}
async function main() {
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(), MEMORY_COMMIT);
  const directory = await mkdtemp(join(tmpdir(), 'axlint-memory-seed-'));
  const seedPath = join(directory, 'seed.jsonl');
  await writeFile(seedPath, makeSeed());
  try {
    if (process.argv.includes('--check')) await check(seedPath);
    else await runBenchmark({ name: 'memory', tasks, connect: () => connectMemory(seedPath), patch, allowlist: READ_ALLOWLIST, provenance: { repository: 'https://github.com/modelcontextprotocol/servers', commit: MEMORY_COMMIT, start_command: 'node vendor/mcp-servers/src/memory/dist/index.js', seed: 'Fictional Larkspur Goods graph: 145 entities, 142 relations; generated deterministically in hand-run-memory.ts', result_token_basis: 'JSON.stringify of the complete MCP callTool response, including content and structuredContent', scoring: { search: 'search_nodes with a string query containing checkout or migration, case insensitive', control: 'open_nodes with names containing exact Priya Nair and Dev Patel', boundary: 'unscored' }, patch: MEMORY_PATCH } });
  } finally { await rm(directory, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
