import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {scoreCall,tasks,READ_ALLOWLIST,patch} from './hand-run-filesystem.js';
import type {Tool} from '@modelcontextprotocol/sdk/types.js';
const directory = resolve(process.argv[2] ?? 'scripts/results/filesystem-2026-10-17T21-31-17.655Z');
const report = JSON.parse(await readFile(join(directory,'result.json'),'utf8'));
assert.equal(report.trials.length,24);
assert.equal(report.status,'complete');
assert.equal(report.sampling,'provider default; temperature never sent');
assert.equal(report.baseline_tools.length,14);
assert.deepEqual(report.candidate_tools,patch(structuredClone(report.baseline_tools) as Tool[]));
assert.equal(report.static_tool_tokens.approximate,false);
const pids = new Set<number>(), roots = new Set<string>();
let attempts=0;
for (const task of tasks) for (const condition of ['baseline','candidate']) {
 const rows = report.trials.filter((r: any)=>r.task_id===task.id&&r.condition===condition);
 assert.deepEqual(rows.map((r: any)=>r.trial).sort(),[1,2,3]);
 for (const row of rows) {
  assert.ok(READ_ALLOWLIST.has(row.tool)); assert.equal(row.executed,true); assert.equal(row.result_is_error,false);
  assert.equal(row.result_tokens_approximate,false); assert.equal(row.failure==='infra',false);
  const expected = scoreCall(task,row.tool,row.arguments,row.server_pid.root);
  assert.equal(row.passed,expected.passed); assert.equal(row.failure,expected.failure);
  const response=JSON.parse(await readFile(join(directory,`${task.id}-${condition}-${row.trial}-response.json`),'utf8'));
  assert.ok(response.content?.length>0);
  await assert.rejects(access(row.server_pid.root),{code:'ENOENT'});
  pids.add(row.server_pid.pid); roots.add(row.server_pid.root); attempts+=row.attempts.length;
 }
}
assert.equal(pids.size,24);assert.equal(roots.size,24);assert.equal(attempts,24);
assert.equal((await readdir(directory)).filter(name=>name.endsWith('-response.json')).length,24);
assert.equal(report.verdict,'Improved');
console.log('PASS all24 trials: four tasks × three trials × two conditions, no replacements');
console.log('PASS all24 calls used allowlisted read tools; no MCP errors, infra failures or approximate token counts');
console.log('PASS frozen scoring recomputed from original calls; 24 complete raw responses retained');
console.log('PASS isolation: 24 unique PIDs, 24 unique allowed roots, every root now deleted');
console.log('PASS no provider retries: 24 attempts for24 trials; default sampling metadata');
console.log('PASS all14 baseline tools; candidate exact description-only patch; static counts exact');
console.log('PASS verdict Improved: overview +3, tests +2, control unchanged; no insufficient data');
