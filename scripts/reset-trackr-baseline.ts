/** Defaults to an offline dry run. Execute only after the user finishes S8 and authorizes reset. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { ToolsSchema, hashTools } from '../src/core/index.js';

const FROZEN_BASELINE='f9b6c2beae2ec8c5774a7b902349618052582f2f';
const FROZEN_SOURCE_HASH='sha256:b666a8823e062edb2e3885f85fbe6f9fb1031745a45518365d6018e1571b84f9';
const FROZEN_TOOLS_HASH='sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5';
const hash=(text:string)=>'sha256:'+createHash('sha256').update(text).digest('hex');
const {values}=parseArgs({allowPositionals:false,options:{repo:{type:'string'},'baseline-revision':{type:'string'},url:{type:'string'},'dry-run':{type:'boolean'},execute:{type:'boolean'},'timeout-seconds':{type:'string'},help:{type:'boolean',short:'h'}}});
const help=`Usage: pnpm exec tsx scripts/reset-trackr-baseline.ts [--dry-run | --execute]
  --repo <directory>          Defaults to the sibling trackr checkout
  --baseline-revision <SHA>  Defaults to the verified f9b6c2b baseline revert
  --url <MCP URL>             Defaults to Trackr's public Railway MCP URL
  --timeout-seconds <n>       Deployment wait limit, default 600
Dry run is the default: local Git reads only, no fetch, edits, commit, push or MCP calls.
Execute requires clean tracked files on main, the expected Trackr origin, and HEAD equal to origin/main.
Only non-merge commits changing src/tools.ts descriptions are eligible. Mixed commits,
format/behavior changes, dirty files or diverged history stop without a push.
The baseline source hash is pinned independently; alternate baseline SHAs must have that exact source.`;
if(values.help){console.log(help);}else await main().catch(error=>{let message=error instanceof Error?error.message:String(error);for(const [key,value] of Object.entries(process.env))if(value&&/KEY|TOKEN|SECRET/.test(key))message=message.replaceAll(value,'[redacted]');console.error(message);process.exitCode=1;});

async function main(){
 assert.ok(!(values.execute&&values['dry-run']),'Choose only one of --execute and --dry-run');
 const execute=Boolean(values.execute);
 const repo=resolve(values.repo??fileURLToPath(new URL('../../trackr/',import.meta.url)));
 const baseline=values['baseline-revision']??FROZEN_BASELINE;
 assert.match(baseline,/^[a-f0-9]{40}$/,'Baseline revision must be a full commit SHA');
 const url=values.url??'https://trackr-production-e1a6.up.railway.app/mcp';
 const timeout=Number(values['timeout-seconds']??600);assert.ok(Number.isInteger(timeout)&&timeout>=1&&timeout<=3600,'Timeout must be 1–3600 seconds');
 // Prevent read-only git status from refreshing/writing the index during dry run.
 const git=(args:string[])=>execFileSync('git',args,{cwd:repo,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'},encoding:'utf8',stdio:['ignore','pipe','pipe']}).trimEnd();
 const origin=git(['remote','get-url','origin']);
 assert.match(origin,/^(?:https:\/\/github\.com\/|git@github\.com:)horne-ra\/trackr(?:\.git)?$/,'Unexpected repository origin; expected horne-ra/trackr');
 assert.equal(git(['branch','--show-current']),'main','Reset requires the main branch');
 const clean=()=>assert.equal(git(['status','--porcelain','--untracked-files=no']),'','Tracked files must be clean; finish or save current work first');
 clean();
 if(execute){git(['fetch','origin','main']);assert.equal(git(['rev-parse','HEAD']),git(['rev-parse','refs/remotes/origin/main']),'Local main must equal origin/main; synchronize or publish existing work first');}
 const head=git(['rev-parse','HEAD']);
 git(['merge-base','--is-ancestor',baseline,head]);
 const showSource=(ref:string)=>execFileSync('git',['show',`${ref}:src/tools.ts`],{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']});
 const frozen=showSource(baseline);assert.equal(hash(frozen),FROZEN_SOURCE_HASH,'Baseline source does not match the frozen original');
 const current=showSource(head);
 if(neutral(current)!==neutral(frozen))throw new Error('Non-description changes found in src/tools.ts; refusing to revert behavior or formatting');
 const revisions=current===frozen?[]:git(['rev-list','--first-parent',`${baseline}..${head}`,'--','src/tools.ts']).split('\n').filter(Boolean);
 const commits=revisions.map(sha=>{
  const parents=git(['rev-list','--parents','-n','1',sha]).split(' ').slice(1);assert.equal(parents.length,1,'A tools merge commit needs manual review');
  const files=git(['diff-tree','--no-commit-id','--name-only','-r',sha]).split('\n').filter(Boolean);
  assert.deepEqual(files,['src/tools.ts'],`Mixed commit ${sha}: only metadata-only src/tools.ts commits may be reverted`);
  assert.equal(neutral(showSource(parents[0])),neutral(showSource(sha)),`Behavior/layout change in ${sha}; manual review required`);
  return {sha,subject:git(['show','-s','--format=%s',sha])};
 });
 console.log(`${execute?'RESET':'DRY RUN'}: ${repo}`);console.log(`Current HEAD: ${head}`);console.log(`Frozen tools hash: ${FROZEN_TOOLS_HASH}`);
 if(!commits.length)console.log('Already at frozen baseline source; no revert or push needed.');
 else{
  console.log(`Would revert ${commits.length} metadata-only commit(s), newest first:`);
  for(const commit of commits)console.log(`  ${commit.sha} ${JSON.stringify(commit.subject)}`);
  console.log(`Would run: git revert --no-commit ${commits.map(c=>c.sha).join(' ')}`);
  console.log('Would create one new revert commit, push origin HEAD:main, then wait for the new Railway SHA and baseline tools hash.');
 }
 if(!execute){console.log('PASS dry run: no fetch, source edits, commit, push, Railway access or MCP calls.');return;}
 clean();assert.equal(git(['rev-parse','HEAD']),head,'HEAD changed while planning; retry after concurrent work stops');
 let revision=head;
 if(commits.length){
  // If Git reports a conflict, stop with its sequencer intact for inspection; never force or reset user work.
  try{git(['revert','--no-commit',...commits.map(c=>c.sha)]);}catch{throw new Error('Revert conflict: nothing pushed. Inspect git status; use git revert --abort to cancel the pending sequence.');}
  assert.equal(hash(await readFile(resolve(repo,'src/tools.ts'),'utf8')),FROZEN_SOURCE_HASH,'Revert did not produce the frozen source; nothing committed or pushed');
  assert.deepEqual(git(['diff','--cached','--name-only']).split('\n').filter(Boolean),['src/tools.ts'],'Unexpected staged files; nothing committed or pushed');
  git(['commit','-m','Revert AX Lint metadata patches to frozen Trackr baseline']);revision=git(['rev-parse','HEAD']);
  assert.equal(hash(showSource(revision)),FROZEN_SOURCE_HASH,'Committed source changed unexpectedly; nothing pushed');
  git(['push','origin','HEAD:main']);console.log(`Pushed new revert commit ${revision}`);
 }
 await waitForBaseline(url,revision,timeout);
}
function neutral(source:string):string{
 // Deliberately conservative: exactly the literal-string layouts emitted by core source_edits.
 // Everything outside tool description literals and .describe() suffixes on Zod parameter lines must match.
 return source.split('\n').map(line=>{
  if(/^\s*description:\s*"(?:[^"\\]|\\.)*",\s*$/.test(line))return line.replace(/"(?:[^"\\]|\\.)*"/,'""');
  if(/^\s*[A-Za-z_][A-Za-z0-9_]*:\s*z\./.test(line))return line.replace(/\.describe\("(?:[^"\\]|\\.)*"\)/g,'');
  return line;
 }).join('\n');
}
async function waitForBaseline(url:string,revision:string,timeoutSeconds:number){
 const deadline=Date.now()+timeoutSeconds*1000;let last='not checked';
 while(Date.now()<deadline){
  const client=new Client({name:'axlint-demo-reset',version:'1.0.0'});
  try{
   await client.connect(new StreamableHTTPClientTransport(new URL(url)));
   const version=client.getServerVersion()?.version??'';const tools=ToolsSchema.parse((await client.listTools()).tools);const actual=hashTools(tools);
   last=`version=${version}; tools_hash=${actual}`;
   if(version===`trackr-demo-001@${revision}`&&actual===FROZEN_TOOLS_HASH){console.log(`PASS baseline tools hash: ${actual}`);console.log(`serverInfo.version: ${version}`);return;}
  }catch(error){last=error instanceof Error?error.message:String(error);}
  finally{await client.close().catch(()=>{});}
  console.log(`Waiting for Railway: ${last}`);await new Promise(resolve=>setTimeout(resolve,5000));
 }
 throw new Error(`Railway baseline verification timed out after ${timeoutSeconds}s; ${last}`);
}
