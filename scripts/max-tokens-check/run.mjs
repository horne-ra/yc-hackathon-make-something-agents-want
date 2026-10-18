import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, cp, symlink, rm, access, readdir } from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { checkSources } from './control.mjs';
const workspace = process.cwd();
const root = resolve('scripts/max-tokens-check');
const git = (args, cwd = workspace) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
assert.equal(git(['branch', '--show-current']), 'lane/e2e');
assert.equal(git(['status', '--porcelain', '--', 'scripts/max-tokens-check/harness', 'scripts/max-tokens-check/preregistration.md', 'scripts/max-tokens-check/run.mjs', 'scripts/max-tokens-check/control.mjs']), '');
const sources = await checkSources();
process.loadEnvFile('.env');
assert.equal(process.env.AXLINT_MODEL, 'claude-sonnet-5-5');
const output = join(root, `run-${new Date().toISOString().replaceAll(':', '-')}`);
await mkdir(output, { recursive: true });
const temporary = await mkdtemp(join(tmpdir(), 'axlint-max-tokens-'));
const sourceServer = resolve(process.env.AXLINT_FILESYSTEM_SOURCE ?? '/Users/ransomhorne/Documents/yc-hackathon-make-something-agents-want/vendor/mcp-servers');
const server = join(temporary, 'vendor/mcp-servers');
const manifest = { started_at: new Date().toISOString(), preregistration_commit: git(['log', '-1', '--format=%H', '--', 'scripts/max-tokens-check/preregistration.md']), harness_commit: git(['rev-parse', 'HEAD']), model: process.env.AXLINT_MODEL, only_experimental_change: 'max_tokens 300 -> 4096', sources, temporary, temporary_deleted: false, benchmarks: {}, status: 'preparing' };
const save = () => writeFile(join(output, 'execution.json'), JSON.stringify(manifest, null, 2) + '\n');
async function command(args, cwd, name) {
  const fd = openSync(join(output, name), 'w');
  try { return await new Promise((accept, reject) => { const child = spawn(process.execPath, args, { cwd, env: process.env, stdio: ['ignore', fd, fd] }); child.once('error', reject); child.once('exit', (code, signal) => accept({ code, signal })); }); }
  finally { closeSync(fd); }
}
try {
  assert.equal(git(['rev-parse', 'HEAD'], sourceServer), 'bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c');
  assert.equal(git(['status', '--porcelain'], sourceServer), '');
  await mkdir(join(temporary, 'vendor'), { recursive: true });
  execFileSync('git', ['clone', '--shared', sourceServer, server], { stdio: 'pipe', env: { PATH: process.env.PATH ?? '' } });
  await symlink(join(sourceServer, 'node_modules'), join(server, 'node_modules'));
  await cp(join(sourceServer, 'src/filesystem/dist'), join(server, 'src/filesystem/dist'), { recursive: true });
  await symlink(resolve('node_modules'), join(temporary, 'node_modules'));
  await symlink(resolve('.env'), join(temporary, '.env'));
  await cp(resolve('package.json'), join(temporary, 'package.json'));
  manifest.trackr_baseline = await command([join(root, 'trackr-preflight.mjs'), join(output, 'trackr-before.json')], workspace, 'trackr-before.log');
  assert.equal(manifest.trackr_baseline.code, 0, 'Full live Trackr baseline must match before generation');
  manifest.filesystem_preflight = await command(['--import', 'tsx', join(root, 'harness/filesystem/hand-run-filesystem.ts'), '--check'], temporary, 'filesystem-preflight.log');
  assert.equal(manifest.filesystem_preflight.code, 0);
  for (const name of ['baseline-tools.json', 'candidate-tools.json']) assert.deepEqual(JSON.parse(await readFile(join(temporary, 'scripts/filesystem-evidence', name), 'utf8')), JSON.parse(await readFile(join(workspace, 'scripts/filesystem-evidence', name), 'utf8')));
  await cp(join(temporary, 'scripts/filesystem-evidence'), join(output, 'filesystem-preflight-evidence'), { recursive: true });
  manifest.status = 'preflight_passed'; manifest.preflight_finished_at = new Date().toISOString(); await save();
  for (const [name, entry] of [['filesystem', 'harness/filesystem/hand-run-filesystem.ts'], ['trackr', 'harness/trackr/hand-run.ts']]) {
    if (name === 'trackr') {
      const baselineCheck = await command([join(root, 'trackr-preflight.mjs'), join(output, 'trackr-before-trials.json')], workspace, 'trackr-before-trials.log');
      assert.equal(baselineCheck.code, 0, 'Live baseline must still match immediately before Trackr trials');
    }
    console.log(`START ${name} at max_tokens=4096; original tasks/scorer/metadata/sampling`);
    const started_at = new Date().toISOString();
    const exit = await command(['--import', 'tsx', join(root, entry)], temporary, `${name}-runner.log`);
    const dirs = (await readdir(join(temporary, 'scripts/results'))).filter(dir => dir.startsWith(`${name}-`));
    assert.equal(dirs.length, 1, 'One run per benchmark, no replacements');
    await cp(join(temporary, 'scripts/results', dirs[0]), join(output, name), { recursive: true });
    const result = JSON.parse(await readFile(join(output, name, 'result.json'), 'utf8'));
    assert.equal(result.max_tokens, 4096); assert.equal(result.model, 'claude-sonnet-5-5');
    manifest.benchmarks[name] = { started_at, finished_at: new Date().toISOString(), exit, status: result.status, trials: result.trials.length, summary: result.summary };
    await save();
    console.log(`END ${name}: ${result.status}, ${result.trials.length} trials; ${JSON.stringify(result.summary)}`);
  }
  manifest.trackr_after = await command([join(root, 'trackr-preflight.mjs'), join(output, 'trackr-after.json')], workspace, 'trackr-after.log');
  assert.equal(manifest.trackr_after.code, 0);
  manifest.status = 'complete';
} catch (error) {
  let message = String(error.message ?? error);
  for (const [key, value] of Object.entries(process.env)) if (value && /KEY|TOKEN|SECRET/.test(key)) message = message.replaceAll(value, '[redacted]');
  manifest.status = 'failed'; manifest.error = message; process.exitCode = 1; console.error(message);
} finally {
  await rm(temporary, { recursive: true, force: true }); await assert.rejects(access(temporary));
  manifest.temporary_deleted = true; manifest.finished_at = new Date().toISOString(); await save();
  console.log(`Evidence: ${output}`);
}
