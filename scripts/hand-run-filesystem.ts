import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { mkdtemp, mkdir, readFile, writeFile, rm, cp, realpath, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, relative, isAbsolute } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { executeAllowed, type Connection, type Task } from './hand-run-common.js';
import { runFilesystemBenchmark } from './filesystem-runner.js';
export const FILESYSTEM_COMMIT = 'bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c';
const repo = resolve('vendor/mcp-servers');
const requireVendor = createRequire(join(repo, 'package.json'));
const { minimatch } = requireVendor('minimatch') as { minimatch: (name: string, pattern: string, options: {dot: boolean}) => boolean };
const entrypoint = join(repo, 'src/filesystem/dist/index.js');
export const READ_ALLOWLIST = new Set(['read_text_file', 'read_multiple_files', 'list_directory', 'list_directory_with_sizes', 'directory_tree', 'search_files', 'get_file_info', 'list_allowed_directories']);
export const TREE_ADDITION = ' Returns the entire recursive tree; on code projects it can be extremely large (hundreds of thousands of tokens when node_modules or .git are included). Use excludePatterns such as ["node_modules", ".git"], or list_directory for a top-level view.';
export const EXCLUDE_DESCRIPTION = 'Names or glob patterns to skip, e.g. node_modules, .git, dist. Strongly recommended on code projects.';
export const tasks: Task[] = [
  { id: 'fs-overview', prompt: 'Give me an overview of how this project is structured.', expect: { tool: 'directory_tree' } },
  { id: 'fs-tests', prompt: 'Where are the test files in this project?', expect: { tool: 'search_files' } },
  { id: 'fs-control', prompt: "Show me what's in package.json.", control: true, expect: { tool: 'read_text_file' } },
  { id: 'fs-boundary', prompt: "What's in the src folder?", unscored: true, expect: { tool: 'list_directory' } },
];
const packageNames = Array.from({length: 240}, (_, i) => `fixture-package-${String(i).padStart(3, '0')}`);
export async function makeSeed(directory: string) {
  let state = 20261017;
  const random = () => state = (Math.imul(1664525, state) + 1013904223) >>> 0;
  const files: Record<string, string> = {
    'src/index.js': "import { checkout } from './checkout.js';\nexport const app = () => checkout([]);\n",
    'src/checkout.js': 'export const checkout = items => items.reduce((sum, item) => sum + item.price, 0);\n',
    'src/catalog.js': 'export const catalog = [{ id: "demo", price: 12 }];\n',
    'test/checkout.test.js': "import { checkout } from '../src/checkout.js';\nif (checkout([]) !== 0) throw new Error('empty cart');\n",
    'test/catalog.test.js': "import { catalog } from '../src/catalog.js';\nif (catalog.length !== 1) throw new Error('catalog');\n",
    'docs/architecture.md': '# Architecture\nThe src folder contains the JavaScript application. test contains tests.\n',
    'package.json': JSON.stringify({name:'fictional-larkspur-project', version:'1.0.0', type:'module', scripts:{test:'node --test test/*.test.js'}, private:true}, null, 2) + '\n',
    'README.md': '# Larkspur demo project\nA fictional JavaScript checkout and catalog. Source in src/, tests in test/, design notes in docs/.\n',
    '.git/HEAD': 'ref: refs/heads/main\n', '.git/config': '[core]\n\trepositoryformatversion = 0\n', '.git/objects/seed': 'fake git fixture, no actual repository\n',
  };
  for (const name of packageNames) {
    files[`node_modules/${name}/package.json`] = JSON.stringify({name, version:'1.0.0', main:'generated-module-00-with-deterministic-compatibility-adapter.js'}) + '\n';
    for (let j=0; j<24; j++) files[`node_modules/${name}/generated-module-${String(j).padStart(2,'0')}-with-deterministic-compatibility-adapter.js`] = `// Fictional dependency fixture; not executed.\nexport const seed = ${random()};\n`;
  }
  assert.equal(Object.keys(files).length, 6011);
  // Bounded creation avoids exhausting file descriptors on macOS.
  for (const [name, text] of Object.entries(files)) { await mkdir(join(directory, name, '..'), {recursive:true}); await writeFile(join(directory, name), text); }
  return { files: Object.keys(files).length, packages: packageNames.length, seed: 20261017 };
}
export function patch(tools: Tool[]) {
  return tools.map(tool => {
    if (!['directory_tree','search_files'].includes(tool.name)) return tool;
    const result = structuredClone(tool);
    if (tool.name === 'directory_tree') result.description = (tool.description ?? '') + TREE_ADDITION;
    (result.inputSchema.properties!.excludePatterns as Record<string, unknown>).description = EXCLUDE_DESCRIPTION;
    return result;
  });
}
function normalizedPath(value: unknown, root: string): string | null {
  if (typeof value !== 'string') return null;
  const absolute = resolve(root, value);
  const path = relative(root, absolute);
  return path === '..' || path.startsWith('../') || isAbsolute(path) ? null : path;
}
export function excludesDependencies(args: Record<string, unknown>) {
  const patterns = args.excludePatterns;
  if (!Array.isArray(patterns) || !patterns.every(p => typeof p === 'string')) return false;
  const matches = (name: string) => patterns.some(pattern => minimatch(name, pattern, {dot:true}));
  return matches('node_modules') || packageNames.every(name => matches(`node_modules/${name}`));
}
export function scoreCall(task: Task, name: string, args: Record<string, unknown>, root: string) {
  if (task.unscored) return {passed:null, failure:null};
  const path = normalizedPath(args.path, root);
  const listing = ['list_directory','list_directory_with_sizes'].includes(name);
  let validTool = false, pass = false;
  if (task.id === 'fs-overview') {
    validTool = listing || name === 'directory_tree';
    pass = path === '' && (listing || (name === 'directory_tree' && excludesDependencies(args)));
  } else if (task.id === 'fs-tests') {
    validTool = listing || ['search_files','directory_tree'].includes(name);
    pass = (listing && path === 'test') || (['search_files','directory_tree'].includes(name) && path === '' && excludesDependencies(args));
  } else if (task.id === 'fs-control') {
    validTool = ['read_text_file','read_multiple_files'].includes(name);
    pass = (name === 'read_text_file' && path === 'package.json') || (name === 'read_multiple_files' && Array.isArray(args.paths) && args.paths.some(p => normalizedPath(p, root) === 'package.json'));
  }
  return {passed:pass, failure: pass ? null : validTool ? 'bad_args' : 'wrong_tool'};
}
export async function connectFilesystem(seed: string, executable = entrypoint): Promise<Connection> {
  const temp = await mkdtemp(join(tmpdir(), 'axlint-filesystem-trial-'));
  const root = join(temp, 'project');
  await cp(seed, root, {recursive:true});
  const canonicalRoot = await realpath(root);
  const client = new Client({name:'axlint-filesystem-hand-run', version:'0.1.0'});
  const transport = new StdioClientTransport({command:process.execPath, args:[executable, canonicalRoot], cwd:canonicalRoot, env:{PATH:process.env.PATH ?? ''}, stderr:'pipe'});
  let stderr = '';
  transport.stderr?.on('data', chunk => { stderr += String(chunk); });
  try {
    await client.connect(transport);
    const {tools} = await client.listTools();
    assert.equal(tools.length, 14, 'The model must see all fourteen official tools');
    return {tools, identity:{pid:transport.pid, root:canonicalRoot, commit:FILESYSTEM_COMMIT}, call:(name,args) => client.callTool({name, arguments:args}, undefined, {timeout:60_000}), close:async()=>{try {await client.close();} finally {await rm(temp,{recursive:true,force:true}); await assert.rejects(stat(temp), {code:'ENOENT'});}}};
  } catch (error) { await transport.close().catch(()=>{}); await rm(temp,{recursive:true,force:true}); throw new Error(`${error instanceof Error ? error.message : error}; filesystem stderr: ${stderr}`); }
}
export async function check(seed: string) {
  const baseline = await connectFilesystem(seed);
  let baselineTools: Tool[];
  try {
    baselineTools = baseline.tools;
    console.log(`PASS tools/list: ${baseline.tools.length} tools visible: ${baseline.tools.map(t=>t.name).join(', ')}`);
    let calls = 0;
    const stub = {...baseline, call:async()=>{calls++;return {};}};
    for (const name of ['write_file','read_file']) assert.equal((await executeAllowed(stub, READ_ALLOWLIST, name, {})).blocked, true);
    assert.equal(calls,0); console.log('PASS dispatch allowlist: write_file and deprecated read_file blocked, 0 handler calls');
    const root = (baseline.identity as {root:string}).root;
    const large = await baseline.call('directory_tree',{path:root});
    const small = await baseline.call('directory_tree',{path:root,excludePatterns:['node_modules','.git']});
    assert.ok(JSON.stringify(large).length > 1_000_000);
    assert.ok(JSON.stringify(small).length < JSON.stringify(large).length/100);
    console.log(`PASS deterministic fixture: 6011 files; full tree ${JSON.stringify(large).length} chars; excluded tree ${JSON.stringify(small).length} chars`);
    assert.equal(scoreCall(tasks[0],'directory_tree',{path:root},root).passed,false);
    assert.equal(scoreCall(tasks[0],'directory_tree',{path:root,excludePatterns:['node_modules']},root).passed,true);
    assert.equal(scoreCall(tasks[0],'list_directory',{path:root},root).passed,true);
    assert.equal(scoreCall(tasks[1],'list_directory',{path:join(root,'test')},root).passed,true);
    assert.equal(scoreCall(tasks[1],'search_files',{path:root,pattern:'**/*.test.js'},root).passed,false);
    assert.equal(scoreCall(tasks[1],'search_files',{path:root,pattern:'**/*.test.js',excludePatterns:['node_modules/**']},root).passed,true);
    assert.equal(scoreCall(tasks[2],'read_text_file',{path:join(root,'package.json')},root).passed,true);
    assert.equal(scoreCall(tasks[2],'read_file',{path:join(root,'package.json')},root).passed,false);
    console.log('PASS frozen scorer: root listing, excluded tree/search, test listing, package control, forbidden deprecated read');
  } finally { await baseline.close(); }
  const copy = await mkdtemp(join(repo,'src/axlint-filesystem-fidelity-'));
  try {
    await cp(join(repo,'src/filesystem'),copy,{recursive:true,filter:path=>!path.includes('/node_modules')&&!path.includes('/dist/')});
    let source = await readFile(join(copy,'server.ts'),'utf8');
    source = source.replace('inputSchema: jsonSchema2020(DirectoryTreeArgsSchema.shape),', `inputSchema: jsonSchema2020(DirectoryTreeArgsSchema.shape),`);
    const treeStart = source.indexOf('    "directory_tree",');
    const inputStart = source.indexOf('      inputSchema:',treeStart);
    const prefix = source.slice(0,inputStart);
    const endDescription = prefix.lastIndexOf('",');
    assert.ok(treeStart>0 && endDescription>treeStart);
    source = source.slice(0,endDescription+1)+' +\n        '+JSON.stringify(TREE_ADDITION)+source.slice(endDescription+1);
    for (const schema of ['DirectoryTreeArgsSchema','SearchFilesArgsSchema']) {
      const start = source.indexOf(`const ${schema} =`);
      const before = source.slice(0,start), tail = source.slice(start);
      const needle = 'excludePatterns: z.array(z.string()).optional().default([])';
      assert.ok(tail.includes(needle));
      source = before + tail.replace(needle, needle+`.describe(${JSON.stringify(EXCLUDE_DESCRIPTION)})`);
    }
    await writeFile(join(copy,'server.ts'),source);
    execFileSync(join(repo,'node_modules/.bin/tsc'),['-p',join(copy,'tsconfig.json')],{stdio:'pipe'});
    const applied = await connectFilesystem(seed,join(copy,'dist/index.js'));
    try {assert.deepEqual(applied.tools,patch(structuredClone(baselineTools))); console.log('PASS source fidelity: compiled description edits exactly reproduce candidate tools/list, all 14 tools and non-description metadata identical');}
    finally {await applied.close();}
    await mkdir(resolve('scripts/filesystem-evidence'),{recursive:true});
    await writeFile(resolve('scripts/filesystem-evidence/baseline-tools.json'),JSON.stringify(baselineTools,null,2));
    await writeFile(resolve('scripts/filesystem-evidence/candidate-tools.json'),JSON.stringify(patch(structuredClone(baselineTools)),null,2));
    await writeFile(resolve('scripts/filesystem-evidence/source.patch'),execFileSync('diff',['-u',join(repo,'src/filesystem/server.ts'),join(copy,'server.ts')],{encoding:'utf8',stdio:'pipe'}));
  } catch (error) {
    // diff exits 1 to indicate expected changes; handle below in main evidence pass.
    if ((error as {status?:number}).status !== 1 || !(error as {stdout?:unknown}).stdout) throw error;
    await writeFile(resolve('scripts/filesystem-evidence/source.patch'),String((error as {stdout:unknown}).stdout));
  } finally {await rm(copy,{recursive:true,force:true});}
  console.log('PASS process/temp cleanup: all check connections closed and fixture copies removed');
}
async function main() {
  assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),FILESYSTEM_COMMIT);
  const directory = await mkdtemp(join(tmpdir(),'axlint-filesystem-seed-'));
  try {
    const fixture = await makeSeed(directory);
    if (process.argv.includes('--check')) await check(directory);
    else await runFilesystemBenchmark({name:'filesystem',tasks,connect:()=>connectFilesystem(directory),patch,allowlist:READ_ALLOWLIST,scoreCall,provenance:{repository:'https://github.com/modelcontextprotocol/servers',commit:FILESYSTEM_COMMIT,preregistration_commit:'8e9cb64',fixture,dispatch_allowlist:[...READ_ALLOWLIST],result_token_basis:'JSON.stringify complete MCP response; countTokens endpoint only',root_context:'Condition-identical separate user text block: Project directory: <absolute allowed root>',candidate:{directory_tree_append:TREE_ADDITION,excludePatterns:EXCLUDE_DESCRIPTION}}});
  } finally {await rm(directory,{recursive:true,force:true});}
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error=>{console.error(error instanceof Error ? error.message : error); process.exitCode=1;});
