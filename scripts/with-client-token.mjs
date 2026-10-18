// Launch a client with only its selected credential from local .env; never print it.
import {loadEnvFile} from 'node:process';
import {spawn} from 'node:child_process';
const [client,...args]=process.argv.slice(2);
const variables={codex:'AXLINT_CODEX_TOKEN',cursor:'AXLINT_CURSOR_TOKEN',claude:'AXLINT_CLAUDE_TOKEN'};
if(!Object.hasOwn(variables,client??''))throw Error('Usage: node scripts/with-client-token.mjs <codex|cursor|claude> [client arguments...]');
const inherited={...process.env};
loadEnvFile(new URL('../.env',import.meta.url));
let token;
try{token=JSON.parse(process.env.AXLINT_API_TOKENS??'{}')[client]?.token;}catch{throw Error('Invalid AXLINT_API_TOKENS in local .env; no credential was printed.');}
if(typeof token!=='string'||token.length<32)throw Error(`Missing ${client}.token in local .env AXLINT_API_TOKENS`);
const child=spawn(client,args,{stdio:'inherit',env:{...inherited,[variables[client]]:token}});
child.on('error',()=>{console.error(`Could not launch ${client}; install its command-line launcher and retry.`);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
