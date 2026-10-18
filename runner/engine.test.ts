import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {readFileSync} from 'node:fs';
const mock=vi.hoisted(()=>({create:vi.fn(),call:vi.fn(),tools:[] as unknown[]}));
vi.mock('@anthropic-ai/sdk',()=>({default:class{messages={create:mock.create,countTokens:async()=>({input_tokens:100})}}}));
vi.mock('@modelcontextprotocol/sdk/client/index.js',()=>({Client:class{
 async connect(){} async close(){} async listTools(){return{tools:mock.tools}} getServerVersion(){return{version:'trackr-test@baseline'}} callTool=mock.call;
}}));
import {runVerification,type ResultFile} from './engine.js';
const base=JSON.parse(readFileSync('runner/evidence/corrected-input.json','utf8'));
const baseline=JSON.parse(readFileSync('viewer/fixtures/provenance.json','utf8')).baseline_tools;
const right={type:'tool_use',id:'right',name:'list_issues',input:{include_comments:false}};
const lookup={type:'tool_use',id:'lookup',name:'get_issue',input:{id:'TRK-117'}};
beforeEach(()=>{vi.resetAllMocks();vi.stubEnv('AXLINT_MODEL','test-pinned-model');mock.tools=baseline;mock.call.mockResolvedValue({content:[{type:'text',text:'[]'}]});mock.create.mockResolvedValue({content:[lookup,right],usage:{input_tokens:120,output_tokens:20}});});
afterEach(()=>vi.unstubAllEnvs());
async function run(extra:Record<string,unknown>={}){
 let output:ResultFile|undefined;
 await runVerification({...base,model:'default',trials:1,tasks:{tasks:[{id:'payload',prompt:'Give me a quick list.',control:false,expect:{tool:'list_issues',args:{include_comments:{equals:false}}}}]},...extra},'test', {progress:async()=>{},result:async r=>{output=r}});
 if(!output)throw Error('No result');return output;
}
describe('runner scoring-version dispatch',()=>{
 it('records v1 by default and preserves original first-call dispatch',async()=>{
  const output=await run();expect(output.status).toBe('complete');if(output.status!=='complete')return;
  expect(output.result.config.scoring_version).toBe('v1');
  expect(output.result.tasks[0]?.trials.every(t=>!t.passed&&t.chosen_tool==='get_issue')).toBe(true);
  expect(mock.call.mock.calls.map(([request])=>request.name)).toEqual(['get_issue','get_issue']);
 });
 it('records v2, keeps all parallel proposals, dispatches read-only calls and scores the match',async()=>{
  const output=await run({scoring_version:'v2'});expect(output.status).toBe('complete');if(output.status!=='complete')return;
  expect(output.result.config.scoring_version).toBe('v2');
  expect(output.result.tasks[0]?.trials.every(t=>t.passed&&t.proposed_calls?.length===2&&t.chosen_tool==='list_issues')).toBe(true);
  expect(mock.call).toHaveBeenCalledTimes(4);
  for(const [request] of mock.create.mock.calls){expect(request.model).toBe('test-pinned-model');expect(request).not.toHaveProperty('temperature');}
 });
 it('blocks an entire v2 turn before dispatch when an unknown or forbidden tool appears',async()=>{
  mock.create.mockResolvedValue({content:[right,{type:'tool_use',id:'write',name:'delete_issue',input:{}}],usage:{input_tokens:120,output_tokens:20}});
  const output=await run({scoring_version:'v2'});expect(output.status).toBe('complete');if(output.status!=='complete')return;
  expect(output.result.tasks[0]?.trials.every(t=>t.failure==='forbidden_tool'&&t.proposed_calls?.length===2)).toBe(true);
  expect(mock.call).not.toHaveBeenCalled();
 });
 it('uses explicit forbidden_tools even when metadata advertises the tool as read-only',async()=>{
  const output=await run({scoring_version:'v2',tasks:{tasks:[{id:'payload',prompt:'Quick list.',control:false,expect:{tool:'list_issues',args:{}},forbidden_tools:['get_issue']}]}});
  expect(output.status).toBe('complete');if(output.status!=='complete')return;
  expect(output.result.tasks[0]?.trials.every(t=>t.failure==='forbidden_tool')).toBe(true);expect(mock.call).not.toHaveBeenCalled();
 });
 it('rejects a model override before any provider request',async()=>{
  expect(await run({model:'different-model'})).toMatchObject({status:'failed',error:{code:'model_override_not_allowed'}});expect(mock.create).not.toHaveBeenCalled();
 });
});
