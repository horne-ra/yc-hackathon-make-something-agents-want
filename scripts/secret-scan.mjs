// Full reachable Git history and tracked worktree, never prints secret values.
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
const git=args=>execFileSync('git',args,{maxBuffer:512*1024*1024});
const env=readFileSync('.env','utf8');
const secrets=[];
for(const line of env.split('\n')){const m=/^([A-Z_]+)=(.*)$/.exec(line);if(!m||!/KEY|TOKEN/.test(m[1]))continue;let v=m[2].trim().replace(/^['"]|['"]$/g,'');if(m[1]==='AXLINT_API_TOKENS'){for(const entry of Object.values(JSON.parse(v)))secrets.push(entry.token)}else if(v.length>=24)secrets.push(v)}
const patterns=[/sk-ant-[A-Za-z0-9_-]{30,}/g,/gh[pousr]_[A-Za-z0-9]{30,}/g,/github_pat_[A-Za-z0-9_]{40,}/g,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g];
const objects=git(['rev-list','--objects','--all']).toString().trim().split('\n').map(line=>({id:line.split(' ')[0],path:line.slice(41)}));
const blobs=execFileSync('git',['cat-file','--batch'],{input:objects.map(o=>o.id).join('\n')+'\n',maxBuffer:512*1024*1024});
let offset=0,checked=0;const findings=[];
function check(content,label){for(const secret of secrets)if(content.includes(secret))findings.push({location:label,kind:'configured secret'});for(const pattern of patterns){pattern.lastIndex=0;if(pattern.test(content))findings.push({location:label,kind:'credential pattern'});}}
for(const object of objects){const end=blobs.indexOf(10,offset),header=blobs.subarray(offset,end).toString().split(' '),size=Number(header[2]);offset=end+1;if(header[1]==='blob'){checked++;check(blobs.subarray(offset,offset+size).toString(),object.id+' '+object.path)}offset+=size+1;}
for(const path of git(['ls-files','-z']).toString().split('\0').filter(Boolean))if(existsSync(path))check(readFileSync(path,'utf8'),'worktree '+path);
console.log(JSON.stringify({check:'full reachable history and tracked worktree',objects:objects.length,blobs:checked,known_secret_values:secrets.length,pattern_families:patterns.length,findings},null,2));
if(findings.length)process.exitCode=1;
