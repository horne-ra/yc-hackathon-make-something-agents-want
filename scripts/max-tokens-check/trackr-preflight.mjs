import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
process.loadEnvFile('.env');
assert.equal(process.env.AXLINT_MODEL, 'claude-sonnet-5-5');
const original = JSON.parse(await readFile('scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json', 'utf8'));
assert.equal(process.env.TRACKR_URL, original.provenance.server_url);
const client = new Client({ name: 'axlint-max-tokens-baseline-check', version: '1.0.0' });
try {
  await client.connect(new StreamableHTTPClientTransport(new URL(process.env.TRACKR_URL)));
  const tools = (await client.listTools()).tools;
  assert.deepEqual(tools, original.baseline_tools, 'Trackr full tools/list must equal the earlier live baseline');
  const response = await client.callTool({ name: 'get_issue', arguments: { id: 'TRK-117' } }, undefined, { timeout: 30000 });
  assert.ok(!response.isError);
  const proof = { checked_at: new Date().toISOString(), endpoint: process.env.TRACKR_URL, identity: client.getServerVersion(), baseline_matches_original: true, tools_sha256: createHash('sha256').update(JSON.stringify(tools)).digest('hex'), tools, control_read_success: true };
  if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(proof, null, 2) + '\n');
  console.log(JSON.stringify({ baseline_matches_original: true, identity: proof.identity, control_read_success: true }));
} finally { await client.close(); }
