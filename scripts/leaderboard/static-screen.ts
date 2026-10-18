/** Metadata only. A network guard rejects every RPC except initialize/tools/list
 * and the required initialized notification. No target tools can execute. */
import {readFile,writeFile,mkdir,readdir,rename} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {lookup} from 'node:dns/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {pathToFileURL} from 'node:url';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {SSEClientTransport} from '@modelcontextprotocol/sdk/client/sse.js';
import {z} from 'zod';
import {ToolsSchema,auditTools,hashTools,type Tool} from '../../src/core/index.js';
import {countStaticTokens} from '../../src/tools/audit.js';
export const ROOT=resolve(import.meta.dirname),UA='AX Lint hackathon research';
const queues=new Map<string,Promise<void>>(),last=new Map<string,number>();
const allowed=new Set(['initialize','notifications/initialized','tools/list']);
export async function save(path:string,data:unknown){await mkdir(resolve(path,'..'),{recursive:true});await writeFile(path+'.tmp',JSON.stringify(data,null,2)+'\n');await rename(path+'.tmp',path);}
async function slot(host:string){const prior=queues.get(host)??Promise.resolve();let release!:()=>void;const next=new Promise<void>(r=>release=r);queues.set(host,prior.then(()=>next));await prior;await delay(Math.max(0,(last.get(host)??0)+1050-Date.now()));last.set(host,Date.now());release();}
function isPublic(address:string){
 if(address.includes(':'))return !/^(?:::|fc|fd|fe[89ab]|ff)/i.test(address);
 const [a,b]=address.split('.').map(Number);
 return !(a===0||a===10||a===127||a===169&&b===254||a===172&&b!>=16&&b!<=31||a===192&&b===168||a!>=224||a===100&&b!>=64&&b!<=127||a===198&&(b===18||b===19));
}
export async function readStaticMetadata(endpoint:string,token?:string){
 const url=new URL(endpoint);
 if(token&&url.href!=='https://mcp.manufact.com/mcp')throw Error('credential_origin_rejected');
 if(url.protocol!=='https:'||url.username||url.password||/(?:api[_-]?key|token|secret|auth)=/i.test(url.search))throw Error('not_public_url');
 const addresses=await lookup(url.hostname,{all:true});if(!addresses.length||addresses.some(x=>!isPublic(x.address)))throw Error('not_public_address');
 const deadline=AbortSignal.timeout(30_000),requests:{method:string;rpc_method?:string;at:string;status?:number}[]=[],attempts:{transport:string;status:string}[]=[];
 const guardedFetch:typeof fetch=async(input,init={})=>{
  const target=new URL(input instanceof Request?input.url:String(input));if(target.origin!==url.origin)throw Error('cross_origin_rejected');
  const method=init.method??(input instanceof Request?input.method:'GET');let rpc:string|undefined;
  const body=init.body??(input instanceof Request&&method==='POST'?await input.clone().text():undefined);
  if(body!=null){const value=JSON.parse(String(body)),messages=Array.isArray(value)?value:[value];if(messages.some(m=>!allowed.has(m.method)))throw Error('non_metadata_rpc_rejected');rpc=messages.map(m=>m.method).join(',');}
  else if(method!=='GET')throw Error('non_metadata_http_rejected');
  await slot(target.host);if(deadline.aborted)throw Error('timeout');
  const headers=new Headers(init.headers??(input instanceof Request?input.headers:undefined));headers.set('User-Agent',UA);if(token)headers.set('Authorization',`Bearer ${token}`);
  const entry:{method:string;rpc_method?:string;at:string;status?:number}={method,...(rpc?{rpc_method:rpc}:{}),at:new Date().toISOString()};requests.push(entry);
  const response=await fetch(input,{...init,headers,redirect:'manual',signal:AbortSignal.any([deadline,AbortSignal.timeout(8000),...(init.signal?[init.signal]:[])])});entry.status=response.status;
  if(response.status>=300&&response.status<400){await response.body?.cancel();throw Error('redirect_not_followed');}return response;
 };
 for(const mode of(url.pathname.endsWith('/sse')?['sse','streamable']:['streamable','sse'])){
  const client=new Client({name:'AX Lint static screen',version:'1.0.0'});
  const transport=mode==='sse'?new SSEClientTransport(url,{fetch:guardedFetch}):new StreamableHTTPClientTransport(url,{fetch:guardedFetch,reconnectionOptions:{maxRetries:0,initialReconnectionDelay:1000,maxReconnectionDelay:1000,reconnectionDelayGrowFactor:1}});
  try{
   await client.connect(transport,{timeout:10_000,signal:deadline});
   const pages:Record<string,unknown>[]=[],tools:unknown[]=[],seen=new Set<string>();let cursor:string|undefined;
   do{
    const page=await client.request({method:'tools/list',params:cursor?{cursor}:{}},z.record(z.string(),z.unknown()),{timeout:8000,signal:deadline});
    if(!Array.isArray(page.tools))throw Error('invalid_tools');pages.push(page);tools.push(...page.tools);cursor=typeof page.nextCursor==='string'&&page.nextCursor?page.nextCursor:undefined;
    if(cursor&&seen.has(cursor))throw Error('repeated_cursor');if(cursor)seen.add(cursor);if(pages.length>100)throw Error('page_cap');
   }while(cursor);
   return{source:'live_tools_list',fetched_at:new Date().toISOString(),endpoint,transport:mode,server:client.getServerVersion(),capabilities:client.getServerCapabilities(),instructions:client.getInstructions(),pages,tools,requests,attempts};
  }catch{
   const statuses=requests.map(x=>x.status);const status=statuses.includes(401)?'credentials_required':statuses.includes(403)?'forbidden_or_blocked':statuses.includes(429)?'rate_limited_stop':deadline.aborted?'timeout':statuses.some(s=>s&&s>=500)?'server_error':'connection_or_protocol_failure';attempts.push({transport:mode,status});
   if(status==='credentials_required'||status==='forbidden_or_blocked'||status==='rate_limited_stop'||deadline.aborted)break;
  }finally{await client.close().catch(()=>{});} // local abort, no DELETE/session termination.
 }
 return{source:'live_attempt',fetched_at:new Date().toISOString(),endpoint,status:attempts.at(-1)?.status??'connection_failure',requests,attempts};
}
export type RiskFlag={kind:string;tools:string[];path?:string;description?:string;default?:unknown;default_source?:string;hypothesis:string};
const control=/(?:^(?:limit|page_size|per_page|offset|skip|cursor|lines|count|top_n|fields|verbose|detail|format|depth|mode|max|include|exclude|num_results|time_range|timeframe|duration|window|summary|compact|raw|return|expand)(?:_|$)|_(?:limit|fields|format|depth)$)/i;
const controlParameter=(name:string)=>control.test(name.replace(/([a-z0-9])([A-Z])/g,'$1_$2'));
const size=/\b(?:size|cost|tokens?|bytes?|characters?|units|budget|maximum|max|minimum|limit|truncat\w*|page|rows?|entries|items|records|docs|documents|results|how many|number of|depth|full|compact|verbose|summary|exclude|include|all|omit|default|newest|oldest)\b/i;
export function riskScreen(tools:Tool[]){
 const flags:RiskFlag[]=[],controls:Record<string,unknown>[]=[];
 function walk(value:unknown,tool:Tool,path='inputSchema'){
  if(!value||typeof value!=='object')return;const schema=value as Record<string,any>;
  for(const[name,param]of Object.entries(schema.properties??{})as[string,Record<string,any>][]){
   if(!param||typeof param!=='object')continue;const field=`${path}.properties.${name}`,description=typeof param.description==='string'?param.description:'';
   if(controlParameter(name)){
    const documented=size.test(description),describedDefault=description.match(/\bdefaults?(?:\s+to)?\s*(?::|=)?\s*(\d+)/i);
    const effectiveDefault='default'in param?param.default:describedDefault?Number(describedDefault[1]):undefined;
    controls.push({tool:tool.name,path:field,name,description,mentions_size_or_cost:documented,...('default'in param?{default:param.default}:{}),...(describedDefault?{described_default:Number(describedDefault[1])}:{}),...('maximum'in param?{maximum:param.maximum}:{})});
    if(!documented)flags.push({kind:'response_control_size_unclear',tools:[tool.name],path:field,description,hypothesis:'Response-size control may be overlooked because its size/cost effect is unclear.'});
    if(typeof effectiveDefault==='number'&&effectiveDefault>=50||/^(?:include|verbose|detail)/i.test(name)&&param.default===true||typeof param.default==='string'&&/^(?:all|full|detailed|verbose|raw|deep)$/i.test(param.default)||typeof param.default==='number'&&param.default<=0&&/limit|max|depth/i.test(name))flags.push({kind:'potentially_expensive_default',tools:[tool.name],path:field,description,default:effectiveDefault,default_source:'default'in param?'schema':'description',hypothesis:'Default may exceed a narrow task’s context needs. Numeric threshold >=50 is a screening heuristic, not a measured response size.'});
   }walk(param,tool,field);
  }
  for(const keyword of['anyOf','oneOf','allOf'])if(Array.isArray(schema[keyword]))schema[keyword].forEach((v:unknown,i:number)=>walk(v,tool,`${path}.${keyword}[${i}]`));
  if(schema.items)walk(schema.items,tool,`${path}.items`);
  for(const keyword of['$defs','definitions'])for(const[name,v]of Object.entries(schema[keyword]??{}))walk(v,tool,`${path}.${keyword}.${name}`);
 }
 for(const tool of tools){walk(tool.inputSchema,tool);const description=tool.description??'';if(/\b(?:all|entire|complete|everything|unlimited|dump)\b/i.test(description)||/(?:dump|all|export|graph|tree)(?:_|$)/i.test(tool.name))flags.push({kind:'broad_response_candidate',tools:[tool.name],description,hypothesis:'Broad language may route a narrow task to an unnecessarily large response; bounded semantics may explain this language.'});}
 const verbs=new Set(['list','get','search','find','query','fetch','read','retrieve','browse','lookup']);
 const names=tools.map(tool=>({tool,words:tool.name.replace(/([a-z])([A-Z])/g,'$1_$2').toLowerCase().split(/[_\-.]/).map(x=>x.replace(/s$/,''))}));
 for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){
  const a=names[i]!,b=names[j]!;if(!verbs.has(a.words[0]!)||!verbs.has(b.words[0]!))continue;
  const shared=a.words.slice(1).filter(x=>x.length>2&&!['server','tool','data','page','item'].includes(x)&&b.words.slice(1).includes(x));
  if(shared.length&&!(a.tool.description??'').includes(b.tool.name)&&!(b.tool.description??'').includes(a.tool.name))flags.push({kind:'overlapping_read_tools',tools:[a.tool.name,b.tool.name],hypothesis:`Read tools share resource terms (${[...new Set(shared)].join(', ')}), without a cross-reference. Exact semantics may already distinguish them.`});
 }return{status:'static_hypotheses_only',controls,flags};
}
export async function analyze(raw:unknown[],count=true){
 const parsed=ToolsSchema.safeParse(raw);if(!parsed.success)return{status:'schema_invalid',tool_count:raw.length,validation_issues:parsed.error.issues.map(i=>({path:i.path,code:i.code})),static_tool_tokens:null};
 const tools=parsed.data,findings=auditTools(tools);let tokens:number|null=null,tokenStatus='not_counted';
 if(count)try{tokens=await countStaticTokens(tools);tokenStatus='provider_countTokens';}catch{tokenStatus='countTokens_failed';}
 return{status:'complete',tool_count:tools.length,tools_hash:hashTools(tools),static_tool_tokens:tokens,token_status:tokenStatus,token_model:process.env.AXLINT_MODEL??null,token_basis:'audit_server countStaticTokens: with-tools minus without-tools input_tokens. No generation.',findings,severity_counts:{high:findings.filter(x=>x.severity==='high').length,medium:findings.filter(x=>x.severity==='medium').length,warning:findings.filter(x=>x.severity==='warning').length},risk:riskScreen(tools),read_only_allowlist:tools.filter(t=>(t.annotations as any)?.readOnlyHint===true&&(t.annotations as any)?.destructiveHint!==true).map(t=>t.name)};
}
async function main(){
 try{process.loadEnvFile(resolve(ROOT,'../../.env'));}catch{}
 const watch=process.argv.includes('--watch'),results=join(ROOT,'screen');await mkdir(results,{recursive:true});
 const done=new Set((await readdir(results)).filter(f=>f.endsWith('.json')).map(f=>f.slice(0,-5))),queue:string[]=[];let active=0,completed=0;
 async function screen(slug:string){
  const detail=JSON.parse(await readFile(join(ROOT,'catalog',slug+'.json'),'utf8')),result:any={slug,source_url:detail._provenance?.source_url,metadata_only:true};
  result.catalog_review_used_auth=detail.reviewUsedAuth??null;
  try{result.live=await readStaticMetadata(detail.url);}catch{result.live={status:'nonpublic_or_unreachable_url'};}if(result.live.tools)result.analysis=await analyze(result.live.tools);
  await save(join(results,slug+'.json'),result);completed++;if(completed%10===0)console.log(JSON.stringify({screened_this_run:completed,at:new Date().toISOString()}));
 }
 while(true){
  for(const file of(await readdir(join(ROOT,'catalog'))).filter(f=>f.endsWith('.json'))){const slug=file.slice(0,-5);if(!done.has(slug)){done.add(slug);queue.push(slug);}}
  while(queue.length&&active<6){const slug=queue.shift()!;active++;screen(slug).catch(async()=>{await save(join(results,slug+'.json'),{slug,live:{status:'screen_internal_failure'}});}).finally(()=>active--);}
  let scraping=false;try{scraping=JSON.parse(await readFile(join(ROOT,'scrape-progress.json'),'utf8')).status==='running';}catch{}
  if(!queue.length&&!active&&(!watch||!scraping))break;await delay(500);
 }console.log(JSON.stringify({status:'static_screen_complete',screened_this_run:completed}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)await main();
