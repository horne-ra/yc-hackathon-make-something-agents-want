/** Two requested cases. Default is a plan; active S8 must never be contacted. */
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {auditServer,readMetadata} from '../src/tools/audit.js';
import {proposePatch,type ProposalAttempt} from '../src/tools/propose.js';
import {startRun,readRun} from '../src/blaxel/runs.js';
import {errorMessage} from '../src/blaxel/errors.js';
import {AuditSchema,hashTools,VerifyPatchInputSchema} from '../src/core/index.js';
const mode=process.argv[2];
const cases=[{name:'top-three-full-source',all:false,full:true},{name:'all-findings-tools-only',all:true,full:false}];
if(!['--proposals-only','--after-s8'].includes(mode??'')){
 console.log(JSON.stringify({mode:'plan',cases,live_checks:'Blocked until the user confirms S8 is done and Blaxel capacity is available.',commands:['pnpm exec tsx scripts/s8-proposer-checks.ts --proposals-only','pnpm exec tsx scripts/s8-proposer-checks.ts --after-s8 (only after user authorization)']},null,2));
 process.exit(0);
}
process.loadEnvFile('.env');
const cached='scripts/results/hosted-stability-2026-10-17T21-52-45.266Z';
const auditFrame=JSON.parse(await readFile(`${cached}/run-1-audit.json`,'utf8'));
const proposalFrame=JSON.parse(await readFile(`${cached}/run-1-proposal.json`,'utf8'));
const context=JSON.parse(await readFile('scripts/results/blaxel-export-2026-10-17T22-18-48.408Z/axlint-run-5ce8aaba-bb3a-4410-9d49-03bd849f5f69/context.json','utf8'));
const inputTemplate=JSON.parse(await readFile('runner/evidence/corrected-input.json','utf8'));
const recordedAudit=AuditSchema.parse(auditFrame.response.structuredContent);
const metadata={server_version:recordedAudit.server_version,tools:context.baseline_tools};
assert.equal(hashTools(metadata.tools),'sha256:df53e86195ee4202079dc899964072aa655d72e1b3b0c81fdd3db03c6e7737d5');
const directory=resolve('scripts/results',`s8-proposer-${new Date().toISOString().replaceAll(':','-')}`);
await mkdir(directory,{recursive:true});
async function save(name:string,value:unknown){let text=JSON.stringify(value,null,2);for(const[key,secret]of Object.entries(process.env))if(secret&&/KEY|TOKEN|SECRET/.test(key))text=text.replaceAll(secret,'<redacted>');await writeFile(`${directory}/${name}.json`,text+'\n');}
if(mode==='--proposals-only'){
 const network=globalThis.fetch;
 globalThis.fetch=async(request,options)=>{
  const url=new URL(request instanceof Request?request.url:String(request));
  if(url.origin!=='https://api.anthropic.com')throw new Error(`Target access disabled while S8 is active: ${url.origin}`);
  return network(request,options);
 };
}
const report:unknown[]=[];
for(const scenario of cases){
 const attempts:ProposalAttempt[]=[];
 try{
  const audit=mode==='--proposals-only'?recordedAudit:await auditServer({server_url:process.env.TRACKR_URL!});
  assert.equal(audit.tools_hash,recordedAudit.tools_hash,'Trackr must already have its frozen baseline descriptions. This script never resets or deploys Trackr.');
  const source_files=proposalFrame.arguments.source_files.filter((f:{path:string})=>scenario.full||f.path==='src/tools.ts');
  const finding_ids=(scenario.all?audit.findings:audit.findings.slice(0,3)).map(f=>f.id);
  const patch=await proposePatch({audit,source_files,finding_ids,style:'compact'},{...(mode==='--proposals-only'?{readMetadata:async()=>metadata}:{}),onAttempt:attempt=>{attempts.push(attempt);}});
  await save(`${scenario.name}-proposal`,{mode,model:process.env.AXLINT_MODEL,audit,source_paths:source_files.map((f:{path:string})=>f.path),finding_ids,attempts,patch});
  if(mode==='--proposals-only'){
   const row={case:scenario.name,proposal:'accepted',ops:patch.wire_ops.length,warnings:patch.warnings??[],verification_status:'blocked',verdict:null,reason:'S8 is active; no Trackr calls permitted. Recorded metadata was used for proposal checks only.'};report.push(row);console.log(JSON.stringify(row));continue;
  }
  const queued=await startRun(VerifyPatchInputSchema.parse({...inputTemplate,server_url:process.env.TRACKR_URL!,patch}));
  await save(`${scenario.name}-launch`,queued);
  const deadline=Date.now()+15*60000;
  for(;;){
   const state=await readRun(queued.run_id);await save(`${scenario.name}-poll-${Date.now()}`,state);
   if(state.status==='complete'){const row={case:scenario.name,run_id:queued.run_id,verdict:state.result.verdict,totals:state.result.totals};report.push(row);console.log(JSON.stringify(row));break;}
   if(state.status==='failed'||state.status==='run_expired')throw new Error(JSON.stringify(state));
   if(Date.now()>deadline)throw new Error(`Polling deadline exceeded; retained run ${queued.run_id}`);
   await new Promise(resolve=>setTimeout(resolve,3000));
  }
 }catch(error){const row={case:scenario.name,status:'failed_or_blocked',error:errorMessage(error),attempts,verdict:null};await save(`${scenario.name}-failure`,row);report.push(row);console.log(JSON.stringify({case:scenario.name,status:row.status,error:row.error,verdict:null}));}
 await save('summary',{mode,model:process.env.AXLINT_MODEL,report});
}
await save('summary',{mode,model:process.env.AXLINT_MODEL,report});console.log(`Evidence: ${directory}`);process.exit(0);
