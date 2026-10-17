import type { SourceFile, Tool, WireOp, Warning, Finding } from '../core/index.js';
const escape=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
/** Conservative lexical checks, not execution or inference from absent code. */
function withoutComments(source:string):string {
 let output='',quote='';
 for(let i=0;i<source.length;i++){
  const c=source[i]!,next=source[i+1];
  if(quote){output+=c;if(c==='\\')output+=source[++i]??'';else if(c===quote)quote='';continue;}
  if(c==='"'||c==="'"||c==='`'){quote=c;output+=c;continue;}
  if(c==='/'&&next==='/'){while(i<source.length&&source[i]!=='\n')i++;output+='\n';continue;}
  if(c==='/'&&next==='*'){i+=2;while(i<source.length&&!(source[i]==='*'&&source[i+1]==='/'))i++;i++;output+=' ';continue;}
  output+=c;
 }
 return output;
}
function sourceForTool(files:readonly SourceFile[],tool:string):string {
 const camel=tool.replace(/_([a-z])/g,(_,c:string)=>c.toUpperCase());
 const declaration=new RegExp(`(?:export\\s+)?(?:async\\s+)?function\\s+${escape(camel)}\\b|(?:export\\s+)?const\\s+${escape(camel)}(?:Tool)?\\s*=`,'g');
 const blocks:string[]=[];
 for(const file of files){
  const text=withoutComments(file.content);
  for(const match of text.matchAll(declaration)){
   const rest=text.slice(match.index!+match[0].length);
   const next=/\n(?:export\s+)?(?:async\s+function|function|const)\s+\w+/.exec(rest);
   blocks.push(match[0]+rest.slice(0,next?.index??rest.length));
  }
 }
 return blocks.join('\n');
}
const literalPattern='(?:true|false|null|-?\\d+(?:\\.\\d+)?|"(?:[^"\\\\]|\\\\.)*"|\'[^\']*\')';
function sourceDefaults(files:readonly SourceFile[],tool:string,param:string):string[]{
 const snippet=sourceForTool(files,tool),name=escape(param);
 const matches=[...snippet.matchAll(new RegExp(`\\b(?:args|input|params)\\.${name}\\s*\\?\\?\\s*(${literalPattern})|\\b${name}\\s*=\\s*(${literalPattern})`,'g'))].map(m=>m[1]??m[2]!);
 const line=new RegExp(`\\b${name}\\s*:\\s*z\\.[^\\n]+`).exec(snippet)?.[0]??'';
 for(const m of line.matchAll(new RegExp(`\\.default\\s*\\(\\s*(${literalPattern})\\s*\\)`,'g')))matches.push(m[1]!);
 return matches;
}
function sourceAllowedValues(files:readonly SourceFile[],tool:string,param:string):string[][] {
 const prefix=escape(param.toUpperCase().replace(/S$/,''));
 const sources=files.map(f=>withoutComments(f.content)).join('\n');
 const arrays=[...sources.matchAll(new RegExp(`^[ \\t]*(?:export\\s+)?const\\s+(?:[A-Z0-9_]*_)?${prefix}(?:S|ES)?_(?:VALUES|OPTIONS|ALLOWED)\\s*=\\s*\\[([^\\]]+)\\]`,'gm'))].map(m=>m[1]!);
 const line=new RegExp(`\\b${escape(param)}\\s*:\\s*z\\.[^\\n]+`).exec(sourceForTool(files,tool))?.[0]??'';
 const inline=/z\.enum\s*\(\s*\[([^\]]+)\]/.exec(line);
 if(inline)arrays.push(inline[1]!);
 return arrays.map(array=>{
  const literals=[...array.matchAll(/"((?:[^"\\]|\\.)*)"|'([^']*)'/g)];
  const remaining=array.replace(/"(?:[^"\\]|\\.)*"|'[^']*'|[,\s]/g,'');
  if(remaining)return [];
  return literals.map(m=>m[2]??JSON.parse('"'+m[1]+'"'));
 }).filter(values=>values.length>0);
}
export function validateSourceClaims(operations:readonly WireOp[],files:readonly SourceFile[]=[]):void {
 for(const op of operations){
  const missing=/\b(?:source|sources|provided (?:code|files)|implementation)\b[^.!?\n]{0,100}\b(?:not|no|missing|unknown|undefined|undocumented|unspecified|unavailable)\b|\b(?:not|never)\s+(?:defined|specified|documented|shown|provided|visible|available|verified|found)\b|\b(?:likely|probably|perhaps|presumably|apparently|seems?|appears?|guess(?:ed|ing)?)\b|\bno\s+(?:default|allowed values)\b/i;
  if(op.op==='set_param_description'){
   const values=/(?:one of|allowed values(?: are)?|valid values(?: are)?)\s*:\s*([^.;\n]+)/i.exec(op.value);
   if(values){const claimed=values[1]!.split(',').map(v=>v.trim().replace(/^["'`]|["'`]$/g,''));if(!sourceAllowedValues(files,op.tool,op.param).some(known=>known.length===claimed.length&&claimed.every(v=>known.includes(v))))throw new Error(`unsupported_source_claim: ${op.tool}.${op.param}: omit accepted values that are not verified by the provided source`);}
   const claim=new RegExp(`\\bdefaults?(?:\\s+(?:to|is))?\\s*[:=]?\\s*(${literalPattern})(?=[\\s,.;)]|$)`,'i').exec(op.value);
   if(claim&&!sourceDefaults(files,op.tool,op.param).includes(claim[1]!))throw new Error(`unsupported_source_claim: ${op.tool}.${op.param}: omit an unverified or conflicting default value`);
   if(/\b(?:free[- ]form|unconstrained|unrestricted|any string)\b/i.test(op.value))throw new Error(`unsupported_source_claim: ${op.tool}.${op.param}: do not infer unrestricted accepted values from missing validation source`);
  }
  if(missing.test(op.value))throw new Error(`unsupported_source_claim: ${op.tool}${op.op==='set_param_description'?'.'+op.param:''}: omit unknown facts and source-absence commentary from descriptions; return missing facts as warnings only`);
 }
}
export function sourceContextWarnings(files:readonly SourceFile[],operations:readonly WireOp[],tools:readonly Tool[],findings:readonly Finding[]):Warning[]{
 const warnings:Warning[]=[];
 const targets=new Map<string,{tool:string;param:string}>();
 for(const op of operations)if(op.op==='set_param_description')targets.set(`${op.tool}.${op.param}`,{tool:op.tool,param:op.param});
 for(const f of findings)if(f.tool&&f.param)targets.set(`${f.tool}.${f.param}`,{tool:f.tool,param:f.param});
 for(const {tool,param} of targets.values()){
  const snippet=sourceForTool(files,tool),name=escape(param);
  const parameter=new RegExp(`\\b${name}\\s*:\\s*z\\.([^\\n,;]*(?:\\([^\\n]*))?`).exec(snippet)?.[0]??'';
  const schema=tools.find(t=>t.name===tool)?.inputSchema;
  const properties=schema?.properties as Record<string,Record<string,unknown>>|undefined;
  const property=properties?.[param];
  // Inline enums and an explicitly named source constant establish finite values.
  // Unrelated constants, comments and tool descriptions do not establish them.
  const allowed=sourceAllowedValues(files,tool,param);
  const inlineLiteral=/z\.literal\s*\(/.test(parameter);
  if(property?.type==='string'&&!allowed.length&&!inlineLiteral)warnings.push({code:'missing_allowed_values',tool,param,message:`Accepted values for ${tool}.${param} could not be established from the provided sources. Include its validation constants, enums and handler files; leave unverified values out of the description.`});
  const required=Array.isArray(schema?.required)&&schema.required.includes(param);
  const declaredDefault=sourceDefaults(files,tool,param).length>0;
  if(!required&&!declaredDefault)warnings.push({code:'missing_default',tool,param,message:`The runtime default for ${tool}.${param} could not be established from the provided sources. Include the defining handler or schema; omit unverified defaults from descriptions.`});
 }
 return warnings;
}
