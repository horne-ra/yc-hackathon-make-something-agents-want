import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { confirmPatch, type ReadRun } from './confirm.js';
import { readMetadata } from './audit.js';
process.loadEnvFile('.env');
const [phase, approvedId, inconclusiveId, readerFile, expectedRevision] = process.argv.slice(2);
if (!['before', 'after'].includes(phase!) || !approvedId || !inconclusiveId || !readerFile) throw new Error('Usage: confirm.acceptance.ts before|after <approvedRunId> <inconclusiveRunId> <absolute reader module path> [expected new full SHA]');
// Acceptance-only explicit adapter: production receives readRun by dependency injection.
const { readRun } = await import(pathToFileURL(readerFile).href) as { readRun: ReadRun };
const server_url = process.env.TRACKR_URL!;
if (phase === 'before') {
  const rejected = await confirmPatch({ server_url, run_id: inconclusiveId, expected_revision: 'not-deployed-yet' }, { readRun });
  assert.equal(rejected.error, 'run_not_approved');
  assert.deepEqual(Object.values(rejected.gates), [false, false, false, false]);
  console.log('PASS real Inconclusive stored run rejected at gate 1: run_not_approved; no target metadata read');
  const live = await readMetadata(server_url);
  const revision = live.server_version.slice(live.server_version.lastIndexOf('@') + 1);
  const before = await confirmPatch({ server_url, run_id: approvedId, expected_revision: revision }, { readRun });
  assert.equal(before.error, 'revision_mismatch');
  assert.deepEqual(Object.values(before.gates), [true, true, false, false]);
  console.log(`PASS real Improved stored run rejected at gate 3 before redeploy: revision_mismatch; live=${live.server_version}`);
  await writeFile('src/tools/confirm.before-evidence.json', JSON.stringify({ rejected_run_id: inconclusiveId, approved_run_id: approvedId, rejected, before }, null, 2) + '\n');
} else {
  if (!expectedRevision) throw new Error('after requires full expected new SHA');
  const after = await confirmPatch({ server_url, run_id: approvedId, expected_revision: expectedRevision }, { readRun });
  assert.equal(after.match, true);
  assert.deepEqual(Object.values(after.gates), [true, true, true, true]);
  assert.deepEqual(after.diffs, []);
  assert.equal(after.live_tools_hash, after.verified_tools_hash);
  console.log(`PASS real apply/redeploy confirm: all four gates true; match=true; diffs=[]; live=${after.live_server_version}; hash=${after.live_tools_hash}`);
  await writeFile('src/tools/confirm.after-evidence.json', JSON.stringify({ approved_run_id: approvedId, after }, null, 2) + '\n');
}
