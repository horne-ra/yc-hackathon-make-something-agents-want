import Anthropic from '@anthropic-ai/sdk';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, readdir, readlink, cp, rm, access, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { runLoop, hash } from './loop.mjs';

const registration = JSON.parse(await readFile('scripts/e2e-filesystem/registration.json', 'utf8'));
const server = resolve(process.env.AXLINT_FILESYSTEM_SOURCE ?? '/Users/ransomhorne/Documents/yc-hackathon-make-something-agents-want/vendor/mcp-servers');
const baseline = JSON.parse(await readFile('scripts/filesystem-evidence/baseline-tools.json', 'utf8'));
const candidate = JSON.parse(await readFile('scripts/filesystem-evidence/candidate-tools.json', 'utf8'));
const preregistrationCommit = '0c50353';
const git = (args, cwd = process.cwd()) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const json = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');
const childEnv = { PATH: process.env.PATH ?? '', LANG: 'en_US.UTF-8' };
const providerTools = metadata => metadata.map(tool => ({ name: tool.name, description: tool.description, input_schema: tool.inputSchema }));
const patchBaseline = structuredClone(baseline);
patchBaseline.find(x => x.name === 'directory_tree').description += ' Returns the entire recursive tree; on code projects it can be extremely large (hundreds of thousands of tokens when node_modules or .git are included). Use excludePatterns such as ["node_modules", ".git"], or list_directory for a top-level view.';
for (const name of ['directory_tree', 'search_files']) patchBaseline.find(x => x.name === name).inputSchema.properties.excludePatterns.description = 'Names or glob patterns to skip, e.g. node_modules, .git, dist. Strongly recommended on code projects.';
assert.deepEqual(candidate, patchBaseline);
assert.equal(baseline.length, 14);
assert.deepEqual(baseline.filter(t => t.annotations?.readOnlyHint).map(t => t.name).sort(), [...registration.read_tools].sort());
assert.equal(git(['rev-parse', 'HEAD'], server), registration.server_commit);
assert.equal(git(['status', '--porcelain'], server), '');
const entry = join(server, 'src/filesystem/dist/index.js');

async function inventory(root) {
  const entries = [];
  async function walk(relative = '') {
    for (const item of (await readdir(join(root, relative), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(relative, item.name);
      if (item.isDirectory()) { entries.push([path, 'directory']); await walk(path); }
      else if (item.isSymbolicLink()) entries.push([path, 'symlink', await readlink(join(root, path))]);
      else entries.push([path, 'file', hash(await readFile(join(root, path)))]);
    }
  }
  await walk();
  return { sha256: hash(JSON.stringify(entries)), files: entries.filter(x => x[1] === 'file').length, directories: entries.filter(x => x[1] === 'directory').length, symlinks: entries.filter(x => x[1] === 'symlink').length };
}

async function connect(root, evidence, label) {
  const transport = new StdioClientTransport({ command: process.execPath, args: [entry, root], cwd: root, env: childEnv, stderr: 'pipe' });
  const client = new Client({ name: 'axlint-e2e-filesystem', version: '1.0.0' });
  let stderr = '';
  transport.stderr?.on('data', chunk => { stderr += chunk.toString(); });
  try {
    await client.connect(transport);
    assert.deepEqual((await client.listTools()).tools, baseline);
    return { client, transport, close: async () => { await client.close(); await writeFile(join(evidence, `${label}-server-stderr.log`), stderr); } };
  } catch (error) { await client.close().catch(() => {}); throw error; }
}

const [mode, evidenceArg] = process.argv.slice(2);
assert.ok(['--prepare', '--run'].includes(mode), 'Use --prepare or --run <evidence directory>');
if (mode === '--prepare') {
  const evidence = resolve('scripts/e2e-filesystem', `run-${new Date().toISOString().replaceAll(':', '-')}`);
  await mkdir(evidence, { recursive: true });
  const temporary = await mkdtemp(join(tmpdir(), 'axlint-e2e-'));
  const template = join(temporary, 'commander-template');
  const env = { ...childEnv, npm_config_cache: join(temporary, 'npm-cache') };
  execFileSync('git', ['clone', '--depth', '1', '--branch', registration.project_tag, registration.project_repository, template], { env, stdio: 'pipe', timeout: 180000 });
  execFileSync('git', ['checkout', '--detach', registration.project_commit], { cwd: template, env, stdio: 'pipe' });
  assert.equal(git(['rev-parse', 'HEAD'], template), registration.project_commit);
  const lock = await readFile(join(template, 'package-lock.json'));
  console.log('Preparing pinned Commander.js with npm ci (no model calls).');
  try {
    const output = execFileSync('npm', ['ci'], { cwd: template, env, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 300000, stdio: ['ignore', 'pipe', 'pipe'] });
    await writeFile(join(evidence, 'npm-ci.log'), output);
  } catch (error) { await writeFile(join(evidence, 'npm-ci.log'), String(error.stdout ?? '') + String(error.stderr ?? '')); throw error; }
  assert.deepEqual(await readFile(join(template, 'package-lock.json')), lock);
  const fixtureInventory = await inventory(template);
  const compiledInventory = await inventory(join(server, 'src/filesystem/dist'));
  const session = await connect(template, evidence, 'preflight');
  await session.close();
  const manifest = { prepared_at: new Date().toISOString(), preregistration_commit: git(['rev-parse', preregistrationCommit]), registration, temporary, template, server, server_entry_sha256: hash(await readFile(entry)), server_compiled_inventory: compiledInventory, server_source_commit: git(['rev-parse', 'HEAD'], server), server_source_status: git(['status', '--porcelain'], server), project_commit: git(['rev-parse', 'HEAD'], template), npm_ci_exit_code: 0, package_lock_sha256: hash(lock), fixture_inventory: fixtureInventory, baseline_sha256: hash(await readFile('scripts/filesystem-evidence/baseline-tools.json')), candidate_sha256: hash(await readFile('scripts/filesystem-evidence/candidate-tools.json')), node_version: process.version, npm_version: execFileSync('npm', ['--version'], { env, encoding: 'utf8' }).trim(), platform: process.platform, architecture: process.arch, model_calls: 0, metadata_preflight: 'exact all-14 baseline match; exact three-description candidate delta' };
  await json(join(evidence, 'manifest.json'), manifest);
  console.log(JSON.stringify({ evidence, fixture_inventory: fixtureInventory, model_calls: 0 }));
} else {
  assert.ok(evidenceArg, 'Evidence directory from --prepare required');
  const evidence = resolve(evidenceArg);
  const manifest = JSON.parse(await readFile(join(evidence, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.registration, registration);
  assert.equal(git(['status', '--porcelain', '--', 'scripts/e2e-filesystem', 'scripts/filesystem-evidence']), '', 'Commit frozen harness and preparation evidence before live calls');
  assert.equal(hash(await readFile(entry)), manifest.server_entry_sha256);
  assert.deepEqual(await inventory(join(server, 'src/filesystem/dist')), manifest.server_compiled_inventory);
  assert.deepEqual(await inventory(manifest.template), manifest.fixture_inventory);
  process.loadEnvFile('.env');
  assert.ok(process.env.ANTHROPIC_API_KEY && process.env.AXLINT_MODEL);
  const provider = new Anthropic({ maxRetries: 0, timeout: registration.api_timeout_ms });
  const model = process.env.AXLINT_MODEL;
  const summary = { started_at: new Date().toISOString(), preregistration_commit: manifest.preregistration_commit, harness_commit: git(['rev-parse', 'HEAD']), model, sampling: 'provider defaults; no temperature/top_p/top_k', trials: [], temporary_deleted: false };
  const cleanError = error => {
    let serialized = JSON.stringify({ name: error?.name ?? null, status: error?.status ?? null, message: String(error?.message ?? error), body: error?.error ?? null, request_id: error?.request_id ?? null });
    for (const [key, value] of Object.entries(process.env)) if (value && /KEY|TOKEN|SECRET/.test(key)) serialized = serialized.replaceAll(value, '[redacted]');
    return JSON.parse(serialized);
  };
  try {
    for (const id of registration.trial_order) {
      const condition = id.split('-')[0];
      const trialDirectory = await mkdtemp(join(manifest.temporary, `${id}-`));
      const copy = join(trialDirectory, 'commander');
      let session;
      let trial = { id, condition, started_at: new Date().toISOString(), outcome: 'other error', completed: false, turns: 0, successful_responses: 0, input_tokens: 0, output_tokens: 0, total_tokens: 0, final_answer: '', turns_detail: [], copy_deleted: false };
      try {
        assert.ok(Date.now() < Date.parse(registration.model_calls_deadline), 'Administrative model-call deadline reached before trial');
        await cp(manifest.template, copy, { recursive: true, verbatimSymlinks: true });
        const root = await realpath(copy);
        const contents = await inventory(root);
        assert.deepEqual(contents, manifest.fixture_inventory, 'Every fresh installed copy must be byte-identical');
        session = await connect(root, evidence, id);
        Object.assign(trial, { root, server_pid: session.transport.pid, fixture_inventory: contents });
        console.log(`START ${id}; fresh server PID ${session.transport.pid}; ${contents.files} files`);
        const save = async result => { trial = { ...trial, ...result }; await json(join(evidence, `${id}.json`), trial); };
        const result = await runLoop({ registration, model, tools: providerTools(condition === 'baseline' ? baseline : candidate), root,
          create: async params => {
            const remaining = Date.parse(registration.model_calls_deadline) - Date.now();
            assert.ok(remaining > 0, 'Administrative model-call deadline reached');
            return provider.messages.create(params, { maxRetries: 0, timeout: Math.min(remaining, registration.api_timeout_ms) });
          },
          dispatch: (name, args) => session.client.callTool({ name, arguments: args }, undefined, { timeout: registration.tool_timeout_ms }), save, cleanError });
        trial = { ...trial, ...result };
      } catch (error) { trial.error = cleanError(error); trial.outcome = 'other error'; }
      finally {
        await session?.close().catch(error => { trial.cleanup_error = cleanError(error); });
        await rm(trialDirectory, { recursive: true, force: true });
        await assert.rejects(access(trialDirectory));
        trial.copy_deleted = true;
        trial.finished_at = new Date().toISOString();
        await json(join(evidence, `${id}.json`), trial);
        const { messages, turns_detail, final_answer, ...compact } = trial;
        summary.trials.push({ ...compact, evidence_file: `${id}.json`, final_answer_characters: final_answer.length, calls: turns_detail.flatMap(turn => turn.calls.map(call => ({ turn: turn.turn, name: call.name, arguments: call.arguments, result_characters: call.result_characters, is_error: call.result?.isError ?? false }))) });
        await json(join(evidence, 'summary.json'), summary);
        console.log(`END ${id}: ${trial.outcome}; ${trial.turns} turns; input=${trial.input_tokens} output=${trial.output_tokens}`);
      }
    }
  } finally {
    await rm(manifest.temporary, { recursive: true, force: true });
    await assert.rejects(access(manifest.temporary));
    summary.temporary_deleted = true;
    summary.finished_at = new Date().toISOString();
    summary.groups = Object.fromEntries(['baseline', 'candidate'].map(condition => {
      const rows = summary.trials.filter(trial => trial.condition === condition);
      return [condition, { completed: rows.filter(trial => trial.completed).length, trials: rows.length, input_tokens: rows.reduce((sum, trial) => sum + trial.input_tokens, 0), output_tokens: rows.reduce((sum, trial) => sum + trial.output_tokens, 0), total_tokens: rows.reduce((sum, trial) => sum + trial.total_tokens, 0) }];
    }));
    await json(join(evidence, 'summary.json'), summary);
    console.log(JSON.stringify(summary.groups));
  }
}
