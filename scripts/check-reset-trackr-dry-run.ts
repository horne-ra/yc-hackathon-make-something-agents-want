/** Tests only --dry-run against a disposable Git fixture; never reads the active Trackr repo. */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, relative } from 'node:path';
const temp=await mkdtemp(join(tmpdir(),'axlint-reset-dry-fixture-'));
const repo=join(temp,'repo'),shim=join(temp,'read-only-bin'),gitLog=join(temp,'dry-git.log');
const realGit=execFileSync('which',['git'],{encoding:'utf8'}).trim();
const fixtureEnv={PATH:process.env.PATH??'',LANG:'en_US.UTF-8',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'};
const git=(args:string[])=>execFileSync(realGit,args,{cwd:repo,env:fixtureEnv,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const checks:string[]=[];
async function snapshot(){const files:Record<string,string>={};async function walk(path:string){for(const item of await readdir(path,{withFileTypes:true})){const full=join(path,item.name);if(item.isDirectory())await walk(full);else files[relative(repo,full)]=createHash('sha256').update(await readFile(full)).digest('hex');}}await walk(repo);return files;}
async function dry(label:string,baseline:string,expectedStatus:number){
 const before=await snapshot();
 const result=spawnSync(process.execPath,['--import','tsx',resolve('scripts/reset-trackr-baseline.ts'),'--dry-run','--repo',repo,'--baseline-revision',baseline,'--url','http://127.0.0.1:1/dry-run-must-not-connect'],{cwd:process.cwd(),env:{PATH:shim+':'+fixtureEnv.PATH,LANG:fixtureEnv.LANG,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',AXLINT_DRY_GIT_LOG:gitLog},encoding:'utf8'});
 assert.equal(result.status,expectedStatus,result.stdout+result.stderr);
 assert.deepEqual(await snapshot(),before,'Dry run modified fixture HEAD, index, refs, source or other files');
 assert.ok(!(result.stdout+result.stderr).includes('MUTATION_BLOCKED'),'Dry run attempted a mutating Git command');
 await writeFile(join(temp,label+'.log'),result.stdout+result.stderr);
 return result.stdout+result.stderr;
}
try{
 await mkdir(repo);await mkdir(shim);await mkdir(join(temp,'no-hooks'));
 // Even an implementation error cannot fetch/push/revert/commit during these tests.
 const shellQuote=(value:string)=>"'"+value.replaceAll("'","'\\''")+"'";
 await writeFile(join(shim,'git'),`#!/bin/sh\nprintf '%s\\n' "$*" >> "$AXLINT_DRY_GIT_LOG"\ncase "$1" in\n  remote) [ "$2" = "get-url" ] || { echo MUTATION_BLOCKED >&2; exit 97; } ;;\n  branch) [ "$2" = "--show-current" ] || { echo MUTATION_BLOCKED >&2; exit 97; } ;;\n  status|rev-parse|merge-base|show|rev-list|diff-tree) ;;\n  *) echo MUTATION_BLOCKED >&2; exit 97 ;;\nesac\nexec ${shellQuote(realGit)} "$@"\n`,{mode:0o755});
 git(['init','-b','main']);git(['config','user.name','AX Lint dry-run fixture']);git(['config','user.email','fixture@example.invalid']);git(['config','core.hooksPath',join(temp,'no-hooks')]);git(['config','commit.gpgsign','false']);
 // This URL is configuration only: fetch and push are blocked by the shim.
 git(['remote','add','origin','https://github.com/horne-ra/trackr.git']);
 const saved=JSON.parse(await readFile('scripts/results/hosted-stability-2026-10-17T21-52-45.266Z/run-1-proposal.json','utf8'));
 for(const source of saved.arguments.source_files as Array<{path:string;content:string}>){await mkdir(join(repo,source.path,'..'),{recursive:true});await writeFile(join(repo,source.path),source.content);}
 git(['add','.']);git(['commit','-m','Frozen baseline fixture']);const baseline=git(['rev-parse','HEAD']);
 const already=await dry('already-baseline',baseline,0);assert.ok(already.includes('no revert or push needed'));
 checks.push('PASS baseline dry run: no revert planned; complete repo content/HEAD/index/refs unchanged');
 let source=await readFile(join(repo,'src/tools.ts'),'utf8');
 for(const edit of saved.response.structuredContent.source_edits as Array<{file:string;find:string;replace:string}>){assert.equal(edit.file,'src/tools.ts');assert.equal(source.split(edit.find).length,2);source=source.replace(edit.find,edit.replace);}
 await writeFile(join(repo,'src/tools.ts'),source);git(['add','src/tools.ts']);git(['commit','-m','Apply fixture metadata proposal']);const patch=git(['rev-parse','HEAD']);
 await writeFile(join(repo,'README.md'),'Unrelated work must survive a reset.\n');git(['add','README.md']);git(['commit','-m','Unrelated documentation fixture']);const unrelated=git(['rev-parse','HEAD']);
 const proposed=await dry('metadata-patch',baseline,0);assert.ok(proposed.includes('Would revert 1 metadata-only commit(s)'));assert.ok(proposed.includes('\n  '+patch+' '));assert.ok(!proposed.includes('\n  '+unrelated+' '));assert.ok(proposed.includes('no fetch, source edits, commit, push, Railway access or MCP calls'));
 checks.push('PASS patched dry run: exactly one metadata commit planned; unrelated commit preserved; complete repo unchanged');
 source=source.replace('z.string()','z.number()');await writeFile(join(repo,'src/tools.ts'),source);git(['add','src/tools.ts']);git(['commit','-m','Unexpected behavior fixture']);
 const rejected=await dry('behavior-rejected',baseline,1);assert.ok(rejected.includes('Non-description changes found'));
 checks.push('PASS behavior-change dry run: rejected before mutation; complete repo unchanged');
 const calls=(await readFile(gitLog,'utf8')).trim().split('\n');assert.ok(calls.length>0);assert.ok(calls.every(call=>/^(remote get-url|branch --show-current|status |rev-parse |merge-base |show |rev-list |diff-tree )/.test(call)));
 checks.push('PASS Git command audit: only local read commands; mutation/fetch/push disabled by shim');
 await mkdir('scripts/reset-evidence',{recursive:true});
 for(const label of ['already-baseline','metadata-patch','behavior-rejected'])await writeFile(`scripts/reset-evidence/${label}.log`,await readFile(join(temp,label+'.log')));
 await writeFile('scripts/reset-evidence/git-read-commands.log',calls.join('\n')+'\n');
}finally{await rm(temp,{recursive:true,force:true});await assert.rejects(access(temp));}
checks.push('PASS temporary fixture deleted; active Trackr repo/Railway never accessed; --execute never run');
await writeFile('scripts/reset-evidence/checks.log',checks.join('\n')+'\n');console.log(checks.join('\n'));
