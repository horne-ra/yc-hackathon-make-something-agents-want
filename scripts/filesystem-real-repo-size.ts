/** Measurement only: no model generation, scorer, benchmark edit, or Trackr access. */
import Anthropic from '@anthropic-ai/sdk';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, realpath, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema, type TextContent } from '@modelcontextprotocol/sdk/types.js';

const project={repository:'https://github.com/tj/commander.js.git',tag:'v13.1.0',commit:'e6f56c888c96d1339c2b974fee7e6ba4f2e3d218'};
const server=resolve('vendor/mcp-servers');
const serverCommit='bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c';
const evidence=resolve('scripts/real-repository-size',`commander-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(evidence,{recursive:true});
const temporary=await mkdtemp(join(tmpdir(),'axlint-real-repo-size-'));
const checkout=join(temporary,'commander');
const childEnv={PATH:process.env.PATH??'',LANG:'en_US.UTF-8',npm_config_cache:join(temporary,'npm-cache')};
const report:Record<string,unknown>={kind:'measurement_only',started_at:new Date().toISOString(),project,official_filesystem_server_commit:serverCommit,model_generation_calls:0,count_tokens_calls:0,node_version:process.version,npm_version:execFileSync('npm',['--version'],{env:childEnv,encoding:'utf8'}).trim(),git_version:execFileSync('git',['--version'],{env:childEnv,encoding:'utf8'}).trim(),platform:process.platform,architecture:process.arch,install_command:'npm ci',count_basis:'JSON.stringify of each full MCP callTool response, including content and structuredContent',measurements:[],temporary_clone_deleted:false};
const save=()=>writeFile(join(evidence,'measurement.json'),JSON.stringify(report,null,2)+'\n');
let client:Client|undefined;
type Tree={name:string;type:'file'|'directory';children?:Tree[]};
function treeCounts(nodes:Tree[]){let files=0,directories=0;for(const node of nodes){if(node.type==='file')files++;else if(node.type==='directory'){directories++;const sub=treeCounts(node.children??[]);files+=sub.files;directories+=sub.directories;}else throw new Error('Unexpected directory_tree node type');}return{files,directories};}
async function physicalCounts(path:string):Promise<{regular_files:number;directories:number;symlinks:number}>{let regular_files=0,directories=0,symlinks=0;for(const item of await readdir(path,{withFileTypes:true})){if(item.isDirectory()){directories++;const sub=await physicalCounts(join(path,item.name));regular_files+=sub.regular_files;directories+=sub.directories;symlinks+=sub.symlinks;}else if(item.isFile())regular_files++;else if(item.isSymbolicLink())symlinks++;}return{regular_files,directories,symlinks};}
try{
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:server,encoding:'utf8'}).trim(),serverCommit);
 execFileSync('git',['clone','--depth','1','--branch',project.tag,project.repository,checkout],{env:childEnv,stdio:'pipe'});
 execFileSync('git',['checkout','--detach',project.commit],{cwd:checkout,env:childEnv,stdio:'pipe'});
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim(),project.commit);
 const lockBefore=await readFile(join(checkout,'package-lock.json'));
 report.package_lock_sha256=createHash('sha256').update(lockBefore).digest('hex');
 const before=await physicalCounts(checkout);report.before_install=before;
 console.log(`PIN ${project.repository} @ ${project.commit}; npm ci starting`);
 try{const output=execFileSync('npm',['ci'],{cwd:checkout,env:childEnv,encoding:'utf8',maxBuffer:16*1024*1024,timeout:600000});await writeFile(join(evidence,'npm-ci.log'),output);}
 catch(error){const e=error as {stdout?:string;stderr?:string;status?:number};await writeFile(join(evidence,'npm-ci.log'),String(e.stdout??'')+'\n'+String(e.stderr??''));report.npm_ci_exit_code=e.status??null;throw new Error(`npm ci failed, exit ${e.status??'unknown'}; full log retained`);}
 report.npm_ci_exit_code=0;
 assert.deepEqual(await readFile(join(checkout,'package-lock.json')),lockBefore,'npm ci must not modify the pinned lockfile');
 report.after_install=await physicalCounts(checkout);
 console.log('PASS npm ci; pinned package-lock unchanged; physical counts '+JSON.stringify(report.after_install));
 const root=await realpath(checkout);
 client=new Client({name:'axlint-real-repository-size',version:'1.0.0'});
 const transport=new StdioClientTransport({command:process.execPath,args:[join(server,'src/filesystem/dist/index.js'),root],cwd:root,env:{PATH:process.env.PATH??''},stderr:'pipe'});
 await client.connect(transport);
 const tools=(await client.listTools()).tools;
 assert.deepEqual(tools,JSON.parse(await readFile('scripts/filesystem-evidence/baseline-tools.json','utf8')));
 console.log('PASS pinned official server; tools/list exactly equals frozen 14-tool baseline');
 process.loadEnvFile('.env');
 const model=process.env.AXLINT_MODEL!;assert.equal(model,'claude-sonnet-5-5');report.model_for_count_tokens=model;
 const provider=new Anthropic({maxRetries:0,timeout:120000});
 for(const [name,extra] of [['unfiltered',{}],['excluded',{excludePatterns:['node_modules','.git']}]] as const){
  const args={path:root,...extra};const response=await client.callTool({name:'directory_tree',arguments:args},undefined,{timeout:120000});assert.ok(!response.isError);
  const text=JSON.stringify(response);await writeFile(join(evidence,`${name}-response.json`),text+'\n');
  const textBlock:TextContent|undefined=CallToolResultSchema.parse(response).content.find((block):block is TextContent=>block.type==='text');assert.ok(textBlock);const tree=JSON.parse(textBlock.text) as Tree[];
  const fileCounts=treeCounts(tree);
  if(name==='unfiltered'){assert.ok(tree.some(t=>t.name==='node_modules'));assert.ok(tree.some(t=>t.name==='.git'));}
  else {assert.ok(tree.every(t=>!['node_modules','.git'].includes(t.name)));}
  const counted=await provider.messages.countTokens({model,messages:[{role:'user',content:text}]});
  report.count_tokens_calls=Number(report.count_tokens_calls)+1;
  const result={name,arguments:{path:'<PINNED_TEMP_REPOSITORY>',...extra},...fileCounts,full_response_characters:text.length,full_response_sha256:createHash('sha256').update(text).digest('hex'),result_tokens:counted.input_tokens,approximate:false};
  (report.measurements as unknown[]).push(result);await save();
  console.log(`MEASURE ${name}: ${fileCounts.files} tree files; ${fileCounts.directories} directories; ${counted.input_tokens} full-response tokens (${text.length} chars)`);
 }
 report.status='complete';
}catch(error){report.status='failed';let message=error instanceof Error?error.message:String(error);for(const [key,value] of Object.entries(process.env))if(value&&/KEY|TOKEN|SECRET/.test(key))message=message.replaceAll(value,'[redacted]');report.error=message;console.error(message);process.exitCode=1;}
finally{await client?.close().catch(()=>{});await rm(temporary,{recursive:true,force:true});await assert.rejects(access(temporary));report.temporary_clone_deleted=true;report.finished_at=new Date().toISOString();await save();console.log('PASS temporary clone and install cache deleted; no model generation calls');console.log(`Evidence: ${evidence}/measurement.json`);}
