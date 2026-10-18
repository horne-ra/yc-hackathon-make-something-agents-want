import {resolve} from 'node:path';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {z} from 'zod';
export {json,save,hash,stable,environment,redact,cleanError,provider,SYSTEM} from '../pophive/common.js';
import {json,save,hash,redact,cleanError} from '../pophive/common.js';
export const ROOT=resolve(import.meta.dirname),REPO=resolve(ROOT,'../..');
export const PIN='b9c176547d3797b2196adeba0210ae67861ac589';
export const BASELINE=resolve(REPO,'vendor/yahoo-finance-mcp'),CANDIDATE=resolve(REPO,'vendor/yahoo-finance-mcp-candidate');
export const START='2026-10-18T00:53:37.000Z',DEADLINE='2026-10-18T01:38:37.000Z';
export const DATE='2026-10-17',DATE_CONTEXT="Today's date: 2026-10-17 (America/Los_Angeles).";
export const ALLOW=['get_historical_stock_prices','get_stock_info','get_yahoo_finance_news','get_stock_actions','get_financial_statement','get_holder_info','get_option_expiration_dates','get_option_chain','get_recommendations'];
export function withinDeadline(){if(Date.now()>=Date.parse(DEADLINE))throw Error('45_minute_timebox_reached');}
export async function connect(directory:string,out:string,env:Record<string,string>,phase:'metadata'|'setup'|'trial',setupArguments?:any){
 withinDeadline();await mkdir(out,{recursive:true});
 const log:any={started_at:new Date().toISOString(),directory:directory===BASELINE?'baseline':'candidate',command:'uv',arguments:['run','--frozen','--no-sync','--python','3.14.6','server.py'],phase,requests:[],protocol_errors:[],stderr:''};
 const c=new Client({name:'AX Lint pre-registered Yahoo Finance benchmark',version:'1.0.0'});
 const transport=new StdioClientTransport({command:process.env.AXLINT_UV_COMMAND??'/Users/ransomhorne/.local/bin/uv',args:log.arguments,cwd:directory,env:{PYTHONUNBUFFERED:'1',PYTHONDONTWRITEBYTECODE:'1'},stderr:'pipe',maxBufferSize:20*1024*1024});
 transport.stderr?.on('data',chunk=>{log.stderr+=redact(String(chunk),env).data;});
 c.onerror=(e)=>{log.protocol_errors.push({at:new Date().toISOString(),error:cleanError(e,env)});};
 const originalSend=transport.send.bind(transport);let calls=0;
 transport.send=async(message:any)=>{
  const method=message.method;
  if(!['initialize','notifications/initialized','tools/list','tools/call'].includes(method))throw Error('rpc_rejected');
  if(method==='tools/call'){
   if(phase==='metadata'||!ALLOW.includes(message.params?.name)||calls>=1)throw Error('read_only_allowlist_or_call_budget_rejected');
   if(phase==='setup'&&setupArguments&&JSON.stringify(message.params)!==JSON.stringify(setupArguments))throw Error('unregistered_setup_call_rejected');
   calls++;
  }
  log.requests.push({at:new Date().toISOString(),method,...(method==='tools/call'?{tool:message.params.name,arguments:redact(message.params.arguments,env).data}:{})});
  await originalSend(message);
 };
 try{await c.connect(transport,{timeout:45_000});log.transport_pid=transport.pid;}
 catch(e){log.error=cleanError(e,env);await c.close().catch(()=>{});await save(`${out}/process.json`,log);throw e;}
 const tools:any[]=[];const pages:any[]=[];let cursor:string|undefined;const cursors=new Set<string>();
 try{
  do{const page=await c.request({method:'tools/list',params:cursor?{cursor}:{}},z.record(z.string(),z.unknown()),{timeout:30_000});if(!Array.isArray(page.tools))throw Error('invalid_tools_list');pages.push(page);tools.push(...page.tools);cursor=typeof page.nextCursor==='string'?page.nextCursor:undefined;if(cursor&&cursors.has(cursor))throw Error('repeated_cursor');if(cursor)cursors.add(cursor);}while(cursor);
  log.server=c.getServerVersion();log.tools_count=tools.length;await save(`${out}/metadata.json`,{tools,pages,server:c.getServerVersion(),instructions:c.getInstructions()});
 }catch(e){log.error=cleanError(e,env);await c.close().catch(()=>{});await save(`${out}/process.json`,log);throw e;}
 return{tools,pid:transport.pid,log,call:async(name:string,args:any)=>{
  const tool=tools.find(t=>t.name===name);
  if(!tool||!ALLOW.includes(name)||tool.annotations?.destructiveHint===true)throw Error('readonly_dispatch_gate_rejected');
  return c.request({method:'tools/call',params:{name,arguments:args}},z.record(z.string(),z.unknown()),{timeout:90_000});
 },close:async()=>{await c.close().catch(e=>{log.close_error=cleanError(e,env);});log.finished_at=new Date().toISOString();await save(`${out}/process.json`,log);}};
}
export function score(task:any,name:string,args:any){
 if(name!==task.tool)return{routing_pass:false,failure:'wrong_tool'};
 if(!args||typeof args!=='object'||Array.isArray(args))return{routing_pass:false,failure:'bad_args'};
 const allowed=task.control?['ticker']:['ticker','period','interval'];
 if(Object.keys(args).some(k=>!allowed.includes(k)))return{routing_pass:false,failure:'bad_args'};
 const symbol=typeof args.ticker==='string'?args.ticker.trim().toUpperCase():null;
 let ok=symbol===task.ticker;
 if(task.id==='Y1')ok=ok&&['2y','5y','10y','max'].includes(args.period);
 if(task.id==='Y2')ok=ok&&args.period==='5y'&&['1wk','1mo','3mo'].includes(args.interval);
 if(task.id==='Y3')ok=ok&&args.period==='1y'&&['1wk','1mo'].includes(args.interval);
 return{routing_pass:ok,failure:ok?null:'bad_args'};
}
/** Server errors are sometimes ordinary text rather than MCP isError. */
export function inspectResponse(response:any){
 const text=(response.content??[]).filter((x:any)=>x.type==='text').map((x:any)=>x.text).join('\n');
 let data:any;try{data=JSON.parse(text);}catch{}
 const error=!!response.isError||/^\s*Error:/i.test(text);
 return{mcp_is_error:!!response.isError,server_text_error:error&&!response.isError,rows:Array.isArray(data)?data.length:null,empty:(Array.isArray(data)&&data.length===0)||/^\s*No (?:news|stock info|financial statement|options) found/i.test(text),first_date:Array.isArray(data)&&data.length?data[0]?.Date??data[0]?.date??null:null,last_date:Array.isArray(data)&&data.length?data.at(-1)?.Date??data.at(-1)?.date??null:null,text_chars:text.length};
}
export async function countCompleteResponse(p:any,model:string,response:any){return{status:'provider_countTokens',tokens:(await p.messages.countTokens({model,messages:[{role:'user',content:JSON.stringify(response)}]})).input_tokens,approximate:false,basis:'Complete JSON.stringify MCP response, including all content and structuredContent, as one countTokens user message; no result feedback or approximation.'};}
export async function verifyVendor(){
 const pin=execFileSync('git',['-C',BASELINE,'rev-parse','HEAD']).toString().trim();if(pin!==PIN)throw Error('vendor_pin_drift');
 const changed=execFileSync('git',['-C',BASELINE,'status','--porcelain']).toString();if(changed.trim())throw Error('baseline_vendor_modified');
 return{repository:'https://github.com/Alex2Yang97/yahoo-finance-mcp',commit:pin,server_sha256:hash(await readFile(`${BASELINE}/server.py`)),uv_lock_sha256:hash(await readFile(`${BASELINE}/uv.lock`))};
}
let lastTrialFinished=0;
export async function trialSpacing(){await delay(Math.max(0,lastTrialFinished+1050-Date.now()));withinDeadline();}
export function trialFinished(){lastTrialFinished=Date.now();}
