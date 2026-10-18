import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,copyFile,symlink} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {ROOT,BASELINE,CANDIDATE,environment,json,save,connect,stable,hash,verifyVendor} from './common.js';
const env=await environment(),setup=await json(`${ROOT}/setup/result.json`),metadata=await json(`${ROOT}/baseline-metadata.json`);
assert.equal(setup.status,'complete');await verifyVendor();
const daily=setup.calls.find((x:any)=>x.id==='daily-5y'),monthly=setup.calls.find((x:any)=>x.id==='monthly-5y');
const description=`Get historical OHLCV stock prices (Date, Open, High, Low, Close, Volume and adjusted close) from Yahoo Finance.
Only ticker, period and interval are accepted. Date-range arguments are NOT supported: do not send start, end, start_date or end_date. For requested dates, use today's date and choose the smallest valid period covering the entire requested range; the response may include extra dates that must be filtered after retrieval.
period: 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max. Default 1mo.
interval controls how many price rows are returned, and therefore response size. In one measured NVDA 5y example on 2026-10-17, 1d returned ${daily.observed.rows} rows and ${daily.token_count.tokens} complete-response input tokens; 1mo returned ${monthly.observed.rows} rows and ${monthly.token_count.tokens} tokens. Actual counts vary with data and response formatting.
For multi-month or multi-year overall trends, prefer 1wk or 1mo rather than daily data unless daily detail is requested.
Valid intervals: 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo. Default 1d. Intraday data cannot extend beyond the last 60 days.
ticker: stock symbol, for example AAPL.`;
const candidate=structuredClone(metadata.tools);candidate.find((t:any)=>t.name==='get_historical_stock_prices').description=description;
const baselineSource=await readFile(`${BASELINE}/server.py`,'utf8'),anchor=baselineSource.indexOf('name="get_historical_stock_prices"');assert(anchor>=0);
const start=baselineSource.indexOf('description="""',anchor)+'description='.length,end=baselineSource.indexOf('"""',start+3)+3;assert(start>anchor&&end>start);
const old=baselineSource.slice(start,end),replacement='"""'+description+'"""';
const source=baselineSource.slice(0,start)+replacement+baselineSource.slice(end);
await mkdir(CANDIDATE,{recursive:false});
for(const name of['pyproject.toml','uv.lock','.python-version','LICENSE'])await copyFile(`${BASELINE}/${name}`,`${CANDIDATE}/${name}`);
await symlink(`${BASELINE}/.venv`,`${CANDIDATE}/.venv`,'dir');await writeFile(`${CANDIDATE}/server.py`,source);
await writeFile(`${ROOT}/source/candidate-server.py`,source);await save(`${ROOT}/candidate-tools.json`,candidate);
await save(`${ROOT}/candidate-patch.json`,[{op:'set_tool_description',tool:'get_historical_stock_prices',value:description,finding_ids:[]}]);
await save(`${ROOT}/source-edit.json`,{file:'server.py',find:old,replace:replacement,baseline_sha256:hash(baselineSource),candidate_sha256:hash(source)});
// Prove AST identity except the one explicit decorator-description string.
const astCheck=execFileSync(`${BASELINE}/.venv/bin/python`,['-c',`import ast,pathlib
a=ast.parse(pathlib.Path(${JSON.stringify(BASELINE+'/server.py')}).read_text())
b=ast.parse(pathlib.Path(${JSON.stringify(CANDIDATE+'/server.py')}).read_text())
for tree in (a,b):
 for node in tree.body:
  if isinstance(node,ast.AsyncFunctionDef) and node.name=='get_historical_stock_prices':
   for dec in node.decorator_list:
    if isinstance(dec,ast.Call):
     for kw in dec.keywords:
      if kw.arg=='description':kw.value=ast.Constant(value='DESCRIPTION_PLACEHOLDER')
assert ast.dump(a)==ast.dump(b),'Non-description AST changed'
print('AST matches except the single tool description')`]).toString().trim();
const c=await connect(CANDIDATE,`${ROOT}/source-fidelity`,env,'metadata');
try{assert.equal(stable(c.tools),stable(candidate),'Hand-edited server does not exactly reproduce candidate tools/list');await save(`${ROOT}/source-fidelity/result.json`,{status:'exact_match',checked_at:new Date().toISOString(),tools:9,description_only:true,ast_check:astCheck,baseline_source_sha256:hash(baselineSource),candidate_source_sha256:hash(source),candidate_tools_sha256:hash(stable(candidate)),no_target_tool_called:true});console.log(JSON.stringify({status:'source_fidelity_exact',tools:9,changes:'one tool description, no executable AST change'}));}
finally{await c.close();}
