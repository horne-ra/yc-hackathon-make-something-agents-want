import Anthropic from '@anthropic-ai/sdk';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {parseEnv} from 'node:util';
import {setTimeout as delay} from 'node:timers/promises';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {AjvJsonSchemaValidator} from '@modelcontextprotocol/sdk/validation/ajv-provider.js';
import {z} from 'zod';
export const ROOT=resolve(import.meta.dirname),ENDPOINT='https://mcp.pophive.org/mcp';
export const SYSTEM='You are a helpful assistant. Use the available tools to answer the user.';
export const json=async(path:string)=>JSON.parse(await readFile(path,'utf8'));
export const hash=(value:string|Buffer)=>'sha256:'+createHash('sha256').update(value).digest('hex');
export const stable=(v:any):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';
export async function save(path:string,value:unknown){await mkdir(dirname(path),{recursive:true});await writeFile(path+'.tmp',JSON.stringify(value,null,2)+'\n');await rename(path+'.tmp',path);}
export async function environment(){const values=parseEnv(await readFile(resolve(ROOT,'../../.env'),'utf8'));process.loadEnvFile(resolve(ROOT,'../../.env'));return Object.fromEntries(Object.entries(values).filter((entry):entry is[string,string]=>typeof entry[1]==='string'));}
export function provider(){if(!process.env.AXLINT_MODEL||!process.env.ANTHROPIC_API_KEY)throw Error('missing_provider_environment');return new Anthropic({apiKey:process.env.ANTHROPIC_API_KEY,baseURL:'https://api.anthropic.com',maxRetries:0,timeout:120_000});}
export function redact(value:any,values:Record<string,string>){
 const secrets=Object.entries(values).filter(([k,v])=>/KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL/i.test(k)&&v).map(([,v])=>v).sort((a,b)=>b.length-a.length);let redactions=0;
 function walk(v:any):any{
  if(typeof v==='string'){
   for(const secret of secrets){const parts=v.split(secret);redactions+=parts.length-1;v=parts.join('[REDACTED]');}
   return v.replace(/\bBearer\s+[A-Za-z0-9_~+./=-]+|\b(?:sk-ant-|sk-proj-|gh[pousr]_|github_pat_)[A-Za-z0-9_-]{15,}|\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,()=>{redactions++;return'[REDACTED]';});
  }
  if(Array.isArray(v))return v.map(walk);
  if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>{
   if(k==='data'&&v.type==='image'){if(typeof x!=='string'||secrets.some(s=>x.includes(s)))throw Error('image_data_secret_or_invalid');return[k,x];}
   if(/^(?:.*api[_-]?key|.*access[_-]?token|.*refresh[_-]?token|authorization|password|client[_-]?secret)$/i.test(k)&&typeof x==='string'&&x&&x!=='[REDACTED]'){redactions++;return[k,'[REDACTED]'];}
   return[k,walk(x)];
  }));return v;
 }
 return{data:walk(value),redactions};
}
export function cleanError(e:any,values:Record<string,string>){return redact({name:e?.name??'Error',http_status:e?.status??null,message:String(e?.message??e).slice(0,2500)},values).data;}
/** Serializes reservations, including simultaneous background GET and tools/list. */
export function reservationQueue(ms=1050,now=Date.now,pause:(ms:number)=>Promise<any>=delay){
 let tail=Promise.resolve(),last=-Infinity;
 return()=>{const next=tail.then(async()=>{await pause(Math.max(0,last+ms-now()));last=now();});tail=next.catch(()=>{});return next;};
}
const reserve=reservationQueue();
export function dispatchAllowed(tools:any[],allowlist:string[],name:string){const tool=tools.find(t=>t.name===name);return!!tool&&allowlist.includes(name)&&tool.annotations?.readOnlyHint===true&&tool.annotations?.destructiveHint!==true;}
const validator=new AjvJsonSchemaValidator();
export function validArguments(tool:any,args:any){return!!tool&&args!==null&&typeof args==='object'&&!Array.isArray(args)&&validator.getValidator(tool.inputSchema)(args).valid;}
export async function connect(tools:any[],allowlist:string[],logPath:string,values:Record<string,string>,setup=false){
 const requests:any[]=[];let called=0;const setupSeen=new Set<string>();let saveTail=Promise.resolve();
 function persist(){const copy=structuredClone(requests);saveTail=saveTail.then(()=>save(logPath,copy));return saveTail;}
 const guarded:typeof fetch=async(input,init={})=>{
  const url=new URL(input instanceof Request?input.url:String(input));if(url.href!==ENDPOINT)throw Error('wrong_target_rejected');
  const method=init.method??(input instanceof Request?input.method:'GET');if(!['GET','POST'].includes(method))throw Error('non_read_transport_rejected');
  const headers=new Headers(init.headers??(input instanceof Request?input.headers:undefined));
  if(headers.has('Authorization')||headers.has('Cookie'))throw Error('credentials_rejected');
  const raw=init.body??(input instanceof Request&&method==='POST'?await input.clone().text():undefined);let rpc:string|null=null,name:string|null=null;
  if(raw!=null){const message=JSON.parse(String(raw));if(Array.isArray(message))throw Error('batch_rejected');rpc=message.method;
   if(rpc==='tools/call'){
    name=message.params?.name;const args=message.params?.arguments??{};const tool=tools.find(t=>t.name===name);
    if(!name||!dispatchAllowed(tools,allowlist,name))throw Error('readonly_dispatch_gate_rejected');
    if(!validArguments(tool,args))throw Error('invalid_arguments_rejected');
    if(setup){const kind=Object.hasOwn(args,'include_chart')?'without_chart':'with_chart';const expected=kind==='with_chart'?{disease:'flu',geography:'TX'}:{disease:'flu',geography:'TX',include_chart:false};
     if(name!=='get_current_status'||stable(args)!==stable(expected)||setupSeen.has(kind)||called>=2)throw Error('setup_budget_rejected');setupSeen.add(kind);
    }called++;
   }else if(!['initialize','notifications/initialized','tools/list'].includes(rpc!))throw Error('rpc_rejected');
  }else if(method!=='GET')throw Error('empty_post_rejected');
  await reserve();headers.set('User-Agent','AX Lint user-approved PopHIVE benchmark');
  const entry:any={at:new Date().toISOString(),http_method:method,rpc_method:rpc,tool:name};requests.push(entry);await persist();
  try{const response=await fetch(input,{...init,headers,redirect:'manual',signal:AbortSignal.any([AbortSignal.timeout(60_000),...(init.signal?[init.signal]:[])])});entry.status=response.status;await persist();if(response.status>=300&&response.status<400){await response.body?.cancel();throw Error('redirect_rejected');}return response;}
  catch(e){entry.error=cleanError(e,values);await persist();throw e;}
 };
 const client=new Client({name:'AX Lint PopHIVE pre-registered benchmark',version:'1.0.0'});
 const transport=new StreamableHTTPClientTransport(new URL(ENDPOINT),{fetch:guarded,reconnectionOptions:{maxRetries:0,initialReconnectionDelay:1000,maxReconnectionDelay:1000,reconnectionDelayGrowFactor:1}});
 await client.connect(transport,{timeout:60_000});
 return{requests,close:async()=>{await client.close();await saveTail;},list:async()=>{
  const pages:any[]=[],all:any[]=[];let cursor:string|undefined;const seen=new Set<string>();
  do{const page=await client.request({method:'tools/list',params:cursor?{cursor}:{}},z.record(z.string(),z.unknown()),{timeout:60_000});if(!Array.isArray(page.tools))throw Error('invalid_tools');pages.push(page);all.push(...page.tools);cursor=typeof page.nextCursor==='string'?page.nextCursor:undefined;if(cursor&&seen.has(cursor))throw Error('repeated_cursor');if(cursor)seen.add(cursor);}while(cursor);return{tools:all,pages,server:client.getServerVersion(),instructions:client.getInstructions()};
 },call:(name:string,args:any)=>client.request({method:'tools/call',params:{name,arguments:args}},z.record(z.string(),z.unknown()),{timeout:60_000})};
}
/** Preserve the complete envelope, substituting image references for binary data. */
export function responseParts(response:any){
 const images:Anthropic.ImageBlockParam[]=[],imageInfo:any[]=[];
 function walk(v:any,path='response'):any{
  if(Array.isArray(v))return v.map((x,i)=>walk(x,`${path}[${i}]`));
  if(v&&typeof v==='object'){
   if(v.type==='image'&&typeof v.data==='string'){
    if(!['image/png','image/jpeg','image/gif','image/webp'].includes(v.mimeType))throw Error('unsupported_image_type');
    const bytes=Buffer.from(v.data,'base64');if(bytes.toString('base64')!==v.data.replace(/\s/g,''))throw Error('invalid_image_base64');
    const info:any={index:images.length,path,mime_type:v.mimeType,bytes:bytes.length,sha256:hash(bytes)};
    if(v.mimeType==='image/png'){if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('invalid_png');info.width=bytes.readUInt32BE(16);info.height=bytes.readUInt32BE(20);}
    imageInfo.push(info);images.push({type:'image',source:{type:'base64',media_type:v.mimeType,data:v.data}});
    return{...Object.fromEntries(Object.entries(v).filter(([k])=>k!=='data').map(([k,x])=>[k,walk(x,`${path}.${k}`)])),image_part_index:images.length-1};
   }
   return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x,`${path}.${k}`)]));
  }return v;
 }
 const envelope=walk(response),text=JSON.stringify(envelope);
 return{text,images,image_info:imageInfo,content:[{type:'text' as const,text},...images]};
}
export async function countResponse(p:Anthropic,model:string,response:any){
 const parts=responseParts(response);
 const text=(await p.messages.countTokens({model,messages:[{role:'user',content:parts.text}]})).input_tokens;
 const full=parts.images.length?(await p.messages.countTokens({model,messages:[{role:'user',content:parts.content}]})).input_tokens:text;
 return{status:'provider_countTokens',text_tokens:text,image_tokens:full-text,total_tokens:full,images:parts.image_info,approximate:false,text_basis:'Complete non-image MCP JSON envelope including content, structuredContent and metadata, with image-part references; includes user-message overhead.',image_basis:'Incremental countTokens input_tokens for the same envelope plus image content parts. Base64 image data never counted as text.'};
}
export function score(task:any,name:string,args:any){
 if(name!==task.tool)return{routing_pass:false,failure:'wrong_tool'};
 const norm=(v:any)=>typeof v==='string'?v.trim().toLowerCase():null;
 let ok=true;
 if(task.id==='P1')ok=norm(args.disease)==='flu'&&['texas','tx'].includes(norm(args.geography)??'')&&args.include_chart===false;
 if(task.id==='P2')ok=norm(args.disease)==='rsv'&&args.include_chart===false;
 if(task.id==='P3')ok=norm(args.vaccine)==='mmr'&&['idaho','id'].includes(norm(args.geography)??'')&&args.include_chart===false;
 if(task.control)ok=!Object.hasOwn(args,'disease');
 return{routing_pass:ok,failure:ok?null:'bad_args'};
}
