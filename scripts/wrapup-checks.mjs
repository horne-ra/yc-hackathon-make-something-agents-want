import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('docs/evidence/wrapup',{recursive:true});
const results=[];
for(const command of ['typecheck','test','build']){
 const result=spawnSync('pnpm',[command],{encoding:'utf8',maxBuffer:8*1024*1024});
 const output=result.stdout+result.stderr;writeFileSync(`docs/evidence/wrapup/${command}.log`,output.trimEnd()+'\n');
 results.push({check:command,exit_code:result.status,summary:output.split('\n').filter(line=>/Test Files|Tests |built src/.test(line)).map(line=>line.trim())});
 if(result.status!==0){console.log(output);process.exit(result.status??1);}
}
const frozen=spawnSync('git',['diff','b9ac56f','--','runner/evidence','scripts/results','scripts/pophive/run','scripts/yfinance/run','viewer/fixtures'],{encoding:'utf8',maxBuffer:8*1024*1024});
if(frozen.status!==0||frozen.stdout)throw Error('Frozen evidence changed since research integration');
const privateFiles=spawnSync('git',['ls-files','private/'],{encoding:'utf8'});if(privateFiles.status!==0||privateFiles.stdout)throw Error('private/ must have no tracked files');
const scan=spawnSync(process.execPath,['--env-file=.env','scripts/secret-scan.mjs'],{encoding:'utf8',maxBuffer:8*1024*1024});writeFileSync('docs/evidence/wrapup/secret-scan.json',scan.stdout);if(scan.status!==0){console.log(scan.stdout+scan.stderr);process.exit(scan.status??1);}
const report={checked_at:new Date().toISOString(),results,frozen_evidence:'unchanged since research merge',private_tracked_files:0,secret_scan:JSON.parse(scan.stdout)};
writeFileSync('docs/evidence/wrapup/local-checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
