import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {scoreTurn,VerifyPatchInputSchema,VerificationResultSchema,auditTools,ToolsSchema} from '../src/core/index.js';
const task={expect:{tool:'history',args:{interval:{equals:'1mo' as const}}},forbidden_tools:['trade']};
const right={name:'history',arguments:{interval:'1mo'}};
const lookup={name:'info',arguments:{}};
const wrong={name:'history',arguments:{interval:'1d'}};
describe('opt-in scoring v2',()=>{
 it('accepts a matching predicate anywhere among parallel first-turn calls',()=>{
  expect(scoreTurn(task,[lookup,right],'v2').passed).toBe(true);
  expect(scoreTurn(task,[right,lookup],'v2').passed).toBe(true);
  expect(scoreTurn(task,[wrong,right],'v2').passed).toBe(true);
 });
 it('preserves legacy first-call behavior by default and for explicit v1',()=>{
  expect(scoreTurn(task,[lookup,right]).failure).toBe('wrong_tool');
  expect(scoreTurn(task,[lookup,right],'v1').failure).toBe('wrong_tool');
  expect(scoreTurn(task,[right,lookup],'v1').passed).toBe(true);
 });
 it('fails if any forbidden tool is proposed, even with a matching call',()=>{
  expect(scoreTurn(task,[right,{name:'trade',arguments:{}}],'v2').failure).toBe('forbidden_tool');
  expect(scoreTurn(task,[{name:'trade',arguments:{}},right],'v2').passed).toBe(false);
 });
 it('retains no-call, bad-argument and infrastructure failures',()=>{
  expect(scoreTurn(task,[],'v2').failure).toBe('no_tool_call');
  expect(scoreTurn(task,[lookup,wrong],'v2').failure).toBe('bad_args');
  expect(scoreTurn(task,[right],'v2','timeout').failure).toBe('infra');
 });
 it('defaults new inputs to v1 and accepts an explicit v2',()=>{
  const input=JSON.parse(readFileSync('runner/evidence/corrected-input.json','utf8'));
  expect(VerifyPatchInputSchema.parse(input).scoring_version).toBe('v1');
  expect(VerifyPatchInputSchema.parse({...input,scoring_version:'v2'}).scoring_version).toBe('v2');
  expect(VerifyPatchInputSchema.safeParse({...input,scoring_version:'v3'}).success).toBe(false);
 });
 it('reads frozen results without inserting a version or changing a byte',()=>{
  const path='viewer/fixtures/result.json',before=readFileSync(path,'utf8');
  const raw=JSON.parse(before);const result=VerificationResultSchema.parse(raw.result??raw);
  expect(result.config.scoring_version).toBeUndefined();
  expect(readFileSync(path,'utf8')).toBe(before);
 });
});
describe('missing size controls rank first',()=>{
 it('finds actual Trackr include_comments and filesystem array excludePatterns',()=>{
  const trackr=JSON.parse(readFileSync('viewer/fixtures/provenance.json','utf8')).baseline_tools;
  const filesystem=JSON.parse(readFileSync('scripts/filesystem-evidence/baseline-tools.json','utf8'));
  for(const [tools,param] of [[trackr,'include_comments'],[filesystem,'excludePatterns']] as const){
   const findings=auditTools(ToolsSchema.parse(tools));
   expect(findings[0]?.kind).toBe('size_control_undocumented');
   expect(findings.some(f=>f.kind==='size_control_undocumented'&&f.param===param&&f.severity==='high')).toBe(true);
   const firstOther=findings.findIndex(f=>f.kind!=='size_control_undocumented');
   expect(findings.slice(firstOther).some(f=>f.kind==='size_control_undocumented')).toBe(false);
  }
 });
 it('covers camelCase, arrays, strings and numeric controls; documented controls do not trigger',()=>{
  const names=['limit','page_size','pageSize','max_results','maxDepth','include_comments','fields','excludePatterns','depth','verbose','detail','format'];
  const properties=Object.fromEntries(names.map(name=>[name,{type:name==='excludePatterns'?'array':'string'}]));
  const findings=auditTools([{name:'read',description:'Use to read data.',inputSchema:{type:'object',properties}}]);
  expect(findings.filter(f=>f.kind==='size_control_undocumented').map(f=>f.param)).toEqual(names);
  expect(auditTools([{name:'read',description:'Use to read data.',inputSchema:{type:'object',properties:{limit:{type:'number',description:'Defaults to 10; up to 50 rows.'}}}}]).some(f=>f.kind==='size_control_undocumented')).toBe(false);
 });
});
