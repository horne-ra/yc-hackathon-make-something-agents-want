/** Offline transport replay of an archived run. No provider or Trackr network access. */
import { readFile } from 'node:fs/promises';
import { runVerification } from '../runner/engine.js';
const [directory]=process.argv.slice(2);
const context=JSON.parse(await readFile(`${directory}/context.json`,'utf8'));
const archived=JSON.parse(await readFile(`${directory}/result.json`,'utf8')).result;
process.env.AXLINT_MODEL=context.model;process.env.ANTHROPIC_API_KEY='offline-memory-replay';
const descriptions=(tools:Array<{name:string;description?:string}>)=>JSON.stringify(tools.map(t=>[t.name,t.description]).sort(([a],[b])=>a!.localeCompare(b!)));
const baseline=descriptions(context.baseline_tools);
let calls=0,peakRss=0,minAvailable=Infinity;
const sample=async()=>{peakRss=Math.max(peakRss,process.memoryUsage().rss);try{const mem=await readFile('/proc/meminfo','utf8');minAvailable=Math.min(minAvailable,Number(/MemAvailable:\s+(\d+)/.exec(mem)?.[1])*1024);}catch{}};
await sample();const timer=setInterval(sample,10);
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async(request,init)=>{
 const url=String(request instanceof Request?request.url:request);
 const method=init?.method??(request instanceof Request?request.method:'GET');
 const body=init?.body?JSON.parse(String(init.body)):request instanceof Request?JSON.parse(await request.clone().text()||'{}'):{};
 if(url==='http://offline-memory-replay.invalid/mcp'){
  if(method==='GET'||method==='DELETE')return new Response(null,{status:405});
  if(body.method==='notifications/initialized')return new Response(null,{status:202});
  let result:unknown;
  if(body.method==='initialize')result={protocolVersion:body.params.protocolVersion,capabilities:{tools:{}},serverInfo:{name:'offline-memory-replay',version:context.server_version}};
  else if(body.method==='tools/list')result={tools:context.baseline_tools};
  else if(body.method==='tools/call')result={content:[{type:'text',text:'x '.repeat(body.params.arguments.include_comments===false?441:10408)}]};
  else throw Error(`Unexpected replay MCP method ${body.method}`);
  return reply({jsonrpc:'2.0',id:body.id,result});
 }
 if(url.startsWith('https://api.anthropic.com/')){
  if(url.includes('count_tokens'))return reply({input_tokens:Math.ceil(JSON.stringify(body).length/4)});
  const task=context.tasks.tasks.find((t:{prompt:string})=>t.prompt===body.messages[0].content);
  const condition=descriptions(body.tools)===baseline?'baseline':'candidate';
  const trial=archived.tasks.find((t:{id:string})=>t.id===task.id).trials.find((t:{condition:string})=>t.condition===condition);
  calls++;
  return reply({id:`offline-${calls}`,type:'message',role:'assistant',model:context.model,content:[{type:'tool_use',id:`tool-${calls}`,name:trial.chosen_tool,input:trial.args}],stop_reason:'tool_use',stop_sequence:null,usage:{input_tokens:trial.input_tokens,output_tokens:trial.output_tokens}});
 }
 throw Error(`Network disabled for memory replay: ${new URL(url).origin}`);
};
let result:unknown;
await runVerification({server_url:'http://offline-memory-replay.invalid/mcp',patch:context.patch,tasks:context.tasks,trials:3,model:'default'},'axlint-run-memory-replay',{progress:async()=>{},context:async()=>{},result:async value=>{result=value;}});
clearInterval(timer);
const final=result as {status:string;error?:unknown;result?:{tasks:Array<{trials:unknown[]}>}};
console.log(JSON.stringify({measurement:'offline transport replay; no model or Trackr calls; not a benchmark',status:final.status,error:final.error,trials:final.result?.tasks.reduce((sum,t)=>sum+t.trials.length,0),provider_turns_replayed:calls,peak_rss_bytes:Math.max(peakRss,process.resourceUsage().maxRSS*1024),minimum_available_bytes:Number.isFinite(minAvailable)?minAvailable:null}));
process.exit(final.status==='complete'&&calls===24?0:1);
