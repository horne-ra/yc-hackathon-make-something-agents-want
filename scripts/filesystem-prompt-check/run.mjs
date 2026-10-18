// Run the historical benchmark unchanged except for its SYSTEM string.
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, cp, symlink, rm, access, readdir } from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

const workspace = process.cwd();
const originalCommit = 'f14254e';
const oldSystem = 'You are an assistant with access to an issue tracker. Use the available tools to help the user.';
const system = 'You are an assistant with access to filesystem tools. Use the available tools to help the user.';
const serverCommit = 'bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c';
const sourceServer = resolve(process.env.AXLINT_FILESYSTEM_SOURCE ?? '/Users/ransomhorne/Documents/yc-hackathon-make-something-agents-want/vendor/mcp-servers');
const harness = resolve('scripts/filesystem-prompt-check/harness');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const git = (args, cwd = workspace) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const sources = {};
for (const name of ['hand-run-filesystem.ts', 'hand-run-common.ts', 'filesystem-runner.ts']) {
  const original = execFileSync('git', ['show', `${originalCommit}:scripts/${name}`], { cwd: workspace, encoding: 'utf8' });
  const snapshot = await readFile(join(harness, name), 'utf8');
  const expected = name === 'filesystem-runner.ts' ? original.replace(oldSystem, system) : original;
  assert.equal(snapshot, expected, `Only the SYSTEM string may change: ${name}`);
  if (name === 'filesystem-runner.ts') {
    assert.equal(original.split(oldSystem).length, 2);
    assert.equal(snapshot.replace(system, oldSystem), original);
  }
  sources[name] = { original_sha256: hash(original), execution_sha256: hash(snapshot), only_system_changed: name === 'filesystem-runner.ts' };
}
assert.equal(git(['branch', '--show-current']), 'lane/e2e');
assert.equal(git(['status', '--porcelain', '--', 'scripts/filesystem-prompt-check/harness', 'scripts/filesystem-prompt-check/preregistration.md', 'scripts/filesystem-prompt-check/run.mjs']), '', 'Commit registration and executable snapshots before any model calls');
assert.equal(git(['rev-parse', 'HEAD'], sourceServer), serverCommit);
assert.equal(git(['status', '--porcelain'], sourceServer), '');
process.loadEnvFile(resolve('.env'));
assert.equal(process.env.AXLINT_MODEL, 'claude-sonnet-5-5', 'Use the original configured model without substitution');
assert.ok(process.env.ANTHROPIC_API_KEY);
const output = resolve('scripts/filesystem-prompt-check', `run-${new Date().toISOString().replaceAll(':', '-')}`);
await mkdir(output, { recursive: true });
const temporary = await mkdtemp(join(tmpdir(), 'axlint-filesystem-prompt-check-'));
const server = join(temporary, 'vendor/mcp-servers');
const manifest = { purpose: 'Purpose: test whether the original baseline failures depended on the mismatched system prompt.', started_at: new Date().toISOString(), preregistration_commit: git(['log', '-1', '--format=%H', '--', 'scripts/filesystem-prompt-check/preregistration.md']), execution_commit: git(['rev-parse', 'HEAD']), original_harness_commit: git(['rev-parse', originalCommit]), original_preregistration_commit: '8e9cb64', system, model: process.env.AXLINT_MODEL, original_server_commit: serverCommit, sources, node_version: process.version, platform: process.platform, architecture: process.arch, temporary_workspace: temporary, temporary_workspace_deleted: false, status: 'preparing' };
const save = () => writeFile(join(output, 'execution.json'), JSON.stringify(manifest, null, 2) + '\n');
const cleanError = error => {
  let message = String(error.message ?? error);
  for (const [key, value] of Object.entries(process.env)) if (value && /KEY|TOKEN|SECRET/.test(key)) message = message.replaceAll(value, '[redacted]');
  return message;
};
async function command(args, logName) {
  const fd = openSync(join(output, logName), 'w');
  try {
    return await new Promise((accept, reject) => {
      const child = spawn(process.execPath, args, { cwd: temporary, env: process.env, stdio: ['ignore', fd, fd] });
      child.once('error', reject);
      child.once('exit', (code, signal) => accept({ code, signal }));
    });
  } finally { closeSync(fd); }
}
try {
  await mkdir(join(temporary, 'vendor'), { recursive: true });
  execFileSync('git', ['clone', '--shared', sourceServer, server], { stdio: 'pipe', env: { PATH: process.env.PATH ?? '' } });
  execFileSync('git', ['checkout', '--detach', serverCommit], { cwd: server, stdio: 'pipe', env: { PATH: process.env.PATH ?? '' } });
  await symlink(join(sourceServer, 'node_modules'), join(server, 'node_modules'));
  await cp(join(sourceServer, 'src/filesystem/dist'), join(server, 'src/filesystem/dist'), { recursive: true });
  await symlink(resolve('node_modules'), join(temporary, 'node_modules'));
  await symlink(resolve('.env'), join(temporary, '.env'));
  await cp(resolve('package.json'), join(temporary, 'package.json'));
  manifest.server_entry_sha256 = hash(await readFile(join(server, 'src/filesystem/dist/index.js')));
  console.log(`NO-MODEL PREFLIGHT: exact historical --check; evidence ${output}`);
  manifest.preflight = await command(['--import', 'tsx', join(harness, 'hand-run-filesystem.ts'), '--check'], 'preflight.log');
  assert.equal(manifest.preflight.code, 0, 'Original offline --check must pass before model calls');
  for (const name of ['baseline-tools.json', 'candidate-tools.json']) {
    const observed = await readFile(join(temporary, 'scripts/filesystem-evidence', name));
    const frozen = await readFile(join(workspace, 'scripts/filesystem-evidence', name));
    assert.deepEqual(JSON.parse(observed), JSON.parse(frozen));
    manifest[name.replace('.json', '_sha256')] = hash(frozen);
  }
  await cp(join(temporary, 'scripts/filesystem-evidence'), join(output, 'preflight-evidence'), { recursive: true });
  manifest.status = 'preflight_passed';
  manifest.preflight_finished_at = new Date().toISOString();
  await save();
  console.log('PASS one-line-only source delta, original checks, compiled candidate fidelity and frozen metadata. Starting original 24-trial runner.');
  manifest.model_runner_started_at = new Date().toISOString();
  manifest.runner_exit = await command(['--import', 'tsx', join(harness, 'hand-run-filesystem.ts')], 'runner.log');
  const resultDirectories = await readdir(join(temporary, 'scripts/results'));
  assert.equal(resultDirectories.length, 1, 'One benchmark run; no replacements');
  await cp(join(temporary, 'scripts/results', resultDirectories[0]), join(output, 'results'), { recursive: true });
  manifest.original_output_directory_name = resultDirectories[0];
  const result = JSON.parse(await readFile(join(output, 'results/result.json'), 'utf8'));
  assert.equal(result.system, system);
  assert.equal(result.max_tokens, 300);
  assert.equal(result.model, 'claude-sonnet-5-5');
  manifest.status = result.status;
  manifest.verdict = result.verdict ?? null;
  manifest.trials = result.trials.length;
  console.log(JSON.stringify({ status: result.status, verdict: result.verdict, trials: result.trials.length, summary: result.summary, evidence: output }));
} catch (error) {
  manifest.status = 'failed'; manifest.error = cleanError(error); process.exitCode = 1; console.error(manifest.error);
} finally {
  await rm(temporary, { recursive: true, force: true });
  await assert.rejects(access(temporary));
  manifest.temporary_workspace_deleted = true;
  manifest.finished_at = new Date().toISOString();
  await save();
  console.log(`Evidence: ${output}; temporary workspace deleted.`);
}
