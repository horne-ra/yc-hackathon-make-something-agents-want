import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, join, basename } from 'node:path';
const previous = JSON.parse(await readFile('scripts/e2e-filesystem/registration.json', 'utf8'));
const registration = JSON.parse(await readFile('scripts/e2e-filesystem-neutral/registration.json', 'utf8'));
const administrative = ['session_started_at', 'hard_deadline', 'model_calls_deadline'];
const protocol = value => Object.fromEntries(Object.entries(value).filter(([key]) => !administrative.includes(key)));
assert.deepEqual(protocol(registration), protocol(previous));
assert.equal(Date.parse(registration.hard_deadline) - Date.parse(registration.session_started_at), 60 * 60 * 1000);
assert.equal(Date.parse(registration.hard_deadline) - Date.parse(registration.model_calls_deadline), 7 * 60 * 1000);
let source = await readFile('scripts/e2e-filesystem/run.mjs', 'utf8');
assert.equal(source, execFileSync('git', ['show', '316baf6:scripts/e2e-filesystem/run.mjs'], { encoding: 'utf8' }));
const changes = [
  ["from './loop.mjs'", "from '../e2e-filesystem/loop.mjs'"],
  ["'scripts/e2e-filesystem/registration.json'", "'scripts/e2e-filesystem-neutral/registration.json'"],
  ["const preregistrationCommit = '0c50353';", "const preregistrationCommit = execFileSync('git', ['log', '-1', '--format=%H', '--', 'scripts/e2e-filesystem-neutral/preregistration.md'], { encoding: 'utf8' }).trim();"],
  ["resolve('scripts/e2e-filesystem',", "resolve('scripts/e2e-filesystem-neutral',"],
  ["'scripts/e2e-filesystem', 'scripts/filesystem-evidence'", "'scripts/e2e-filesystem-neutral', 'scripts/e2e-filesystem', 'scripts/filesystem-evidence'"],
  ["const copy = join(trialDirectory, 'commander');", "const copy = join(trialDirectory, 'project');"],
];
for (const [old, replacement] of changes) { assert.equal(source.split(old).length, 2); source = source.replace(old, replacement); }
assert.equal(await readFile('scripts/e2e-filesystem-neutral/run.mjs', 'utf8'), source);
assert.equal(await readFile('scripts/e2e-filesystem/loop.mjs', 'utf8'), execFileSync('git', ['show', '316baf6:scripts/e2e-filesystem/loop.mjs'], { encoding: 'utf8' }));
process.loadEnvFile('.env');
assert.equal(process.env.AXLINT_MODEL, 'claude-sonnet-5-5');
const proof = { protocol_equal_except_administrative_dates: true, shared_loop_byte_identical: true, only_experimental_source_change: "trial copy basename 'commander' -> 'project'", model: process.env.AXLINT_MODEL };
if (process.argv[2]) {
  const directory = resolve(process.argv[2]);
  const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
  const original = JSON.parse(await readFile('scripts/e2e-filesystem/run-2026-10-18T04-13-52.283Z/manifest.json', 'utf8'));
  for (const key of ['server_entry_sha256', 'server_compiled_inventory', 'server_source_commit', 'server_source_status', 'project_commit', 'npm_ci_exit_code', 'package_lock_sha256', 'baseline_sha256', 'candidate_sha256', 'node_version', 'npm_version', 'platform', 'architecture']) assert.deepEqual(manifest[key], original[key], key);
  assert.deepEqual(protocol(manifest.registration), protocol(previous));
  for (const key of ['files', 'directories', 'symlinks']) assert.equal(manifest.fixture_inventory[key], original.fixture_inventory[key]);
  proof.pins_lock_metadata_runtime_equal = true;
  try {
    const summary = JSON.parse(await readFile(join(directory, 'summary.json'), 'utf8'));
    assert.equal(summary.model, 'claude-sonnet-5-5');
    for (const row of summary.trials) {
      assert.equal(basename(row.root), 'project');
      const trial = JSON.parse(await readFile(join(directory, `${row.id}.json`), 'utf8'));
      assert.deepEqual(trial.messages[0], { role: 'user', content: [{ type: 'text', text: registration.task }, { type: 'text', text: `Project directory: ${row.root}` }] });
      assert.ok(!/commander/i.test(JSON.stringify(trial.messages[0])));
    }
    proof.all_initial_contexts_neutral = true;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
console.log(JSON.stringify(proof, null, 2));
