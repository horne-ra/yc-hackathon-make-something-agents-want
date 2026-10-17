import {describe,it,expect} from 'vitest';
import {z} from 'zod';
import {sourceContextWarnings,validateSourceClaims} from './propose-context.js';
import {proposePatchTool} from './propose.js';
import type {Tool,WireOp,SourceFile,Finding} from '../core/index.js';
const tools:Tool[]=[{name:'list_issues',inputSchema:{type:'object',properties:{status:{type:'string'},include_comments:{type:'boolean'},limit:{type:'number'},query:{type:'string'}},required:['query']}}];
const source:SourceFile={path:'src/tools.ts',content:'export const listIssuesTool = {\n name: "list_issues",\n params: {\n status: z.string().optional(),\n include_comments: z.boolean().optional(),\n limit: z.number().optional(),\n query: z.string(),\n },\n};'};
const op=(param:string,value='Filter issues.'):WireOp=>({op:'set_param_description',tool:'list_issues',param,value,finding_ids:['F1']});
const handler:SourceFile={path:'src/handlers.ts',content:'export function listIssues(args) { return [args.include_comments ?? true, args.limit ?? 50]; }'};
const values:SourceFile={path:'src/validation.ts',content:'export const STATUS_VALUES = ["open", "in_progress", "blocked", "closed"] as const;'};
describe('proposer source context and metadata',()=>{
 it('warns for missing values and defaults even when descriptions make no claim',()=>{
  const warnings=sourceContextWarnings([source],[op('status'),op('include_comments')],tools,[]);
  expect(warnings.map(w=>[w.code,w.param])).toEqual([['missing_allowed_values','status'],['missing_default','status'],['missing_default','include_comments']]);
 });
 it('recognizes provided validation values and handler defaults',()=>{
  const warnings=sourceContextWarnings([source,values,handler],[op('status'),op('include_comments'),op('limit')],tools,[]);
  expect(warnings.map(w=>[w.code,w.param])).toEqual([['missing_default','status']]);
  expect(()=>validateSourceClaims([op('include_comments','Defaults true; set false for a quick list.'),op('limit','Defaults to 50.')],[source,handler])).not.toThrow();
 });
 it('does not count unrelated constants, comments or another tool handler as proof',()=>{
  const other:SourceFile={path:'src/other.ts',content:'// const STATUS_VALUES = ["open"];\n/* function listIssues(args) { return args.include_comments ?? true; } */\nexport const MODE_VALUES = ["open"];\nexport function searchIssues(args) { return args.include_comments ?? true; }'};
  const warnings=sourceContextWarnings([source,other],[op('status'),op('include_comments')],tools,[]);
  expect(warnings).toHaveLength(3);
 });
 it('recognizes inline enums and literal Zod defaults',()=>{
  const inline={...source,content:source.content.replace('z.string().optional()','z.enum(["open", "closed"]).default("open")').replace('z.boolean().optional()','z.boolean().default(true)')};
  expect(sourceContextWarnings([inline],[op('status'),op('include_comments')],tools,[])).toEqual([]);
 });
 it('does not invent a default for a required parameter',()=>expect(sourceContextWarnings([source],[op('query')],tools,[]).map(w=>w.code)).toEqual(['missing_allowed_values']));
 it('warns on selected parameter findings even if addressed by a tool description',()=>{
  const finding:Finding={id:'F1',kind:'unconstrained_string',severity:'high',tool:'list_issues',param:'status',message:'Missing values'};
  expect(sourceContextWarnings([source],[{op:'set_tool_description',tool:'list_issues',value:'Filter issues.',finding_ids:['F1']}],tools,[finding])).toHaveLength(2);
 });
 it.each(['Source defines no default.','Allowed values are not defined in source.','Output format is not documented in source.','Comments likely increase payload size.','Optional; no default.','Free-form string.'])('rejects hedge or unsupported absence claim: %s',value=>expect(()=>validateSourceClaims([op('status',value)],[source])).toThrow('unsupported_source_claim'));
 it('rejects invented allowed values and accepts verified enumerations',()=>{
  expect(()=>validateSourceClaims([op('status','One of: open, in_progress, blocked, closed.')],[source,values])).not.toThrow();
  expect(()=>validateSourceClaims([op('status','One of: open, invented.')],[source,values])).toThrow('unsupported_source_claim');
  expect(()=>validateSourceClaims([op('status','One of: open, closed.')],[source])).toThrow('unsupported_source_claim');
 });
 it('rejects unverified and conflicting default claims',()=>{
  expect(()=>validateSourceClaims([op('include_comments','Defaults true.')],[source])).toThrow('unsupported_source_claim');
  expect(()=>validateSourceClaims([op('include_comments','Defaults false.')],[source,handler])).toThrow('unsupported_source_claim');
 });
 it('publishes complete-source and severity guidance in tool and parameter metadata',()=>{
  expect(proposePatchTool.description).toContain('every file defining accepted values or defaults');
  expect(proposePatchTool.description).toContain('highest-severity');
  const schema=z.toJSONSchema(proposePatchTool.inputSchema);
  const parameters=schema.properties as Record<string,{description?:string}>;
  expect(parameters.source_files!.description).toContain('src/handlers.ts');
  expect(parameters.source_files!.description).toContain('validation constants');
  expect(parameters.finding_ids!.description).toContain('highest severity');
 });
});
