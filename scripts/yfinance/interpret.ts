/** Post-run descriptive notes only. Does not rescore or alter frozen trials. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {ROOT,REPO,json,save} from './common.js';
const run=await json(`${ROOT}/run/result.json`);assert.equal(run.status,'complete');
const notes:any={label:'Post-run descriptive diagnostics; no rescore or new model/tool calls',historical_proposals:[],stop_reasons:{},empty_news_responses:0,multiple_call_failures:[],no_tool_call_trials:[]};
for(const row of run.trials){
 notes.stop_reasons[row.model_stop_reason??'unavailable']=(notes.stop_reasons[row.model_stop_reason??'unavailable']??0)+1;
 if(row.failure==='multiple_tool_calls')notes.multiple_call_failures.push(row.index);
 if(row.failure==='no_tool_call')notes.no_tool_call_trials.push({index:row.index,stop_reason:row.model_stop_reason??null});
 if(row.selected_tool==='get_yahoo_finance_news'&&row.observed?.empty)notes.empty_news_responses++;
 for(const call of row.proposed_calls)if(call.name==='get_historical_stock_prices')notes.historical_proposals.push({index:row.index,task_id:row.task_id,condition:row.condition,arguments:call.input,executed:row.executed,unsupported_argument_names:Object.keys(call.input).filter(k=>!['ticker','period','interval'].includes(k))});
}
const baselineTrend=notes.historical_proposals.filter((x:any)=>x.condition==='baseline'&&['Y2','Y3'].includes(x.task_id));
notes.baseline_trend_interval_counts={};for(const x of baselineTrend)notes.baseline_trend_interval_counts[x.arguments.interval??'omitted']=(notes.baseline_trend_interval_counts[x.arguments.interval??'omitted']??0)+1;
notes.unsupported_historical_argument_proposals=notes.historical_proposals.filter((x:any)=>x.unsupported_argument_names.length>0).length;
await save(`${ROOT}/interpretation.json`,notes);
let report=await readFile(`${REPO}/docs/yfinance-results.md`,'utf8');
report=report.replace('complete first-call passes','frozen trial passes');
const needle='## Source, context and prior evidence';
assert(report.includes(needle));
const text=['## What the model already did correctly','',
 'The daily-default failure hypothesis was **not observed** for the trend tasks. Baseline Y2 selected quarterly observations in all three trials, which the user-approved predicate accepts. All three baseline Y3 turns proposed monthly historical data, also an acceptable interval, together with an extra stock-info call. No historical-price proposal in either condition sent unsupported start/end arguments.', '',
 `The pre-registration also required exactly one proposed tool call. That additional gate rejected ${notes.multiple_call_failures.length} multi-call turns, including all three baseline Y3 turns, even though their first historical-price arguments were correct. These are single-call-budget failures, not evidence of bad resolution selection. Frozen scores and the ordered verdict are unchanged. [Descriptive diagnostics](../scripts/yfinance/interpretation.json).`, '',
 `Y1 remained imperfect: one baseline turn produced no tool call (stop reason ${notes.no_tool_call_trials[0]?.stop_reason??'unavailable'}), and one candidate call omitted the covering period and received the default latest month. The six news-control calls selected the right tool but returned no articles; their passes establish selection only, not successful news coverage.`, '',
 'Aggregate result-token totals below cover different numbers of executed calls (8 versus 10), because blocked/no-call turns produce no result. They must not be treated as comparable token savings or as evidence that executing fewer useful calls is cheaper behavior. The setup comparison isolates row resolution; the behavioral trials did not establish a resolution-related improvement.', '',needle];
report=report.replace(needle,text.join('\n'));
report=report.replace('[Full run](../scripts/yfinance/run/result.json)','Offline regeneration: `node --import tsx scripts/yfinance/report.ts`, then `node --import tsx scripts/yfinance/interpret.ts`. The second command adds descriptive notes without changing trial scores.\n\n[Full run](../scripts/yfinance/run/result.json)');
await writeFile(`${REPO}/docs/yfinance-results.md`,report.trimEnd()+'\n');
console.log(JSON.stringify({status:'descriptive_notes_added_without_rescoring',baseline_trend_intervals:notes.baseline_trend_interval_counts,unsupported_historical_proposals:notes.unsupported_historical_argument_proposals,multiple_call_failures:notes.multiple_call_failures.length}));
