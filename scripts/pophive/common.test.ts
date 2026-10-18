import {describe,it,expect} from 'vitest';
import {reservationQueue,responseParts,countResponse,score,dispatchAllowed,redact} from './common.js';
const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=';
describe('PopHIVE pre-registered boundaries',()=>{
 it('serializes simultaneous startup requests',async()=>{let now=0;const q=reservationQueue(1050,()=>now,async(ms)=>{now+=ms;});const times:number[]=[];await Promise.all(Array.from({length:5},async()=>{await q();times.push(now);}));expect(times).toEqual([0,1050,2100,3150,4200]);});
 it('preserves the full non-image envelope and uses native images',()=>{
  const full={content:[{type:'text',text:'full public evidence'},{type:'image',mimeType:'image/png',data:png}],structuredContent:{other:'must remain'},_meta:{also:'retained'}};
  const parts=responseParts(full);expect(parts.text).not.toContain(png);expect(parts.text).toContain('must remain');expect(parts.text).toContain('retained');expect(parts.images[0]?.source).toEqual({type:'base64',media_type:'image/png',data:png});expect(parts.image_info[0]).toMatchObject({width:1,height:1});
 });
 it('separates incremental image tokens from text and total',async()=>{const requests:any[]=[];const p={messages:{countTokens:async(x:any)=>{requests.push(x);return{input_tokens:Array.isArray(x.messages[0].content)?600:100};}}};const counts=await countResponse(p as any,'offline-model',{content:[{type:'image',mimeType:'image/png',data:png}]});expect(counts).toMatchObject({text_tokens:100,image_tokens:500,total_tokens:600});expect(requests[0].messages[0].content).not.toContain(png);expect(requests[1].messages[0].content[1].type).toBe('image');});
 it('fails absent/true chart flags and accepts the specified place spellings',()=>{
  const task={id:'P1',tool:'get_current_status'};expect(score(task,task.tool,{disease:'flu',geography:'TX'}).routing_pass).toBe(false);expect(score(task,task.tool,{disease:'flu',geography:'TX',include_chart:true}).routing_pass).toBe(false);expect(score(task,task.tool,{disease:'FLU',geography:'Texas',include_chart:false}).routing_pass).toBe(true);expect(score(task,'get_trend',{disease:'flu',geography:'TX',include_chart:false}).failure).toBe('wrong_tool');
 });
 it('does not score top_n and requires vaccine and absent control disease',()=>{
  expect(score({id:'P2',tool:'get_map'},'get_map',{disease:'RSV',include_chart:false,top_n:10}).routing_pass).toBe(true);
  expect(score({id:'P3',tool:'get_coverage'},'get_coverage',{geography:'ID',include_chart:false}).routing_pass).toBe(false);
  expect(score({id:'P3',tool:'get_coverage'},'get_coverage',{vaccine:'MMR',geography:'Idaho',include_chart:false}).routing_pass).toBe(true);
  expect(score({id:'P4-control',tool:'get_data',control:true},'get_data',{disease:null}).routing_pass).toBe(false);
  expect(score({id:'P4-control',tool:'get_data',control:true},'get_data',{}).routing_pass).toBe(true);
 });
 it('blocks writes, missing hints, destructive and unknown tools at dispatch',()=>{const tools=[{name:'read',annotations:{readOnlyHint:true}},{name:'write',annotations:{readOnlyHint:false}},{name:'danger',annotations:{readOnlyHint:true,destructiveHint:true}},{name:'unknown_hint'}];const allow=tools.map(t=>t.name);expect(dispatchAllowed(tools,allow,'read')).toBe(true);for(const name of['write','danger','unknown_hint','missing'])expect(dispatchAllowed(tools,allow,name)).toBe(false);});
 it('redacts secrets without corrupting image content',()=>{const value={content:[{type:'image',mimeType:'image/png',data:png},{type:'text',text:'Bearer offline_token12345678901234567890'}],apiKey:'offline-key-value-123456789'};const r=redact(value,{ANTHROPIC_API_KEY:'offline-key-value-123456789'});expect(r.redactions).toBe(2);expect(r.data.content[0].data).toBe(png);expect(JSON.stringify(r.data)).not.toContain('offline-key-value-123456789');expect(redact(r.data,{}).redactions).toBe(0);});
});
