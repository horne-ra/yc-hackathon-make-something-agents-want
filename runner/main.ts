import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runVerification } from './engine.js';
const [inputPath,runId,directoryArg]=process.argv.slice(2);
if(!inputPath||!runId)throw new Error('Usage: main.ts <input.json> <run_id> [output_directory]');
const directory=resolve(directoryArg??'.');await mkdir(directory,{recursive:true});
async function save(name:string,value:unknown){const path=resolve(directory,name);await writeFile(path+'.tmp',JSON.stringify(value,null,2));await rename(path+'.tmp',path);}
await runVerification(JSON.parse(await readFile(inputPath,'utf8')),runId,{progress:value=>save('progress.json',value),result:value=>save('result.json',value)});
