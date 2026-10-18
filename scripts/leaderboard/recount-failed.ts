/** One explicit countTokens recheck, using saved public definitions only. */
import {readdir,readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {countStaticTokens} from '../../src/tools/audit.js';
import {ToolsSchema} from '../../src/core/index.js';
import {ROOT,save} from './static-screen.js';
process.loadEnvFile(resolve(ROOT,'../../.env'));
for(const file of await readdir(join(ROOT,'screen'))){
 if(!file.endsWith('.json'))continue;
 const path=join(ROOT,'screen',file),screen=JSON.parse(await readFile(path,'utf8'));
 if(screen.analysis?.token_status!=='countTokens_failed'||screen.analysis.token_recheck)continue;
 const record:any={at:new Date().toISOString(),prior_status:screen.analysis.token_status,metadata_only:true};
 try{screen.analysis.static_tool_tokens=await countStaticTokens(ToolsSchema.parse(screen.live.tools));screen.analysis.token_status='provider_countTokens';record.status='provider_countTokens';}
 catch(error){const e=error as any;record.status='countTokens_failed';record.http_status=typeof e.status==='number'?e.status:null;record.error_type=e.error?.error?.type??e.error?.type??e.constructor?.name??'unknown';
  // Only retain a provider schema/path explanation, never headers or raw errors.
  let message=String(e.error?.error?.message??e.error?.message??'').slice(0,1000);
  for(const[key,value]of Object.entries(process.env))if(/TOKEN|KEY|SECRET|PASSWORD/.test(key)&&value&&value.length>=8)message=message.split(value).join('[REDACTED]');
  record.provider_explanation=message;
 }
 screen.analysis.token_recheck=record;await save(path,screen);console.log(JSON.stringify({slug:screen.slug,token_status:screen.analysis.token_status,http_status:record.http_status??null}));
}
