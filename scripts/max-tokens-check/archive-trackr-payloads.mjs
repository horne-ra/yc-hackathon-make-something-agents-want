// Publication boundary only: preserve complete live payloads locally, publish receipts.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, chmod, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const directory = resolve(process.argv[2]);
const report = JSON.parse(await readFile(join(directory, 'trackr/result.json'), 'utf8'));
const old = JSON.parse(await readFile('scripts/results/trackr-2026-10-17T20-10-18.320Z/result.json', 'utf8'));
const archive = await mkdtemp(join(tmpdir(), 'axlint-max-tokens-trackr-local-'));
await chmod(archive, 0o700);
const receipts = [];
for (const row of report.trials) {
  const previous = old.trials.find(t => t.task_id === row.task_id && t.condition === row.condition && t.trial === row.trial);
  assert.equal(row.tool, previous.tool); assert.deepEqual(row.arguments, previous.arguments);
  const model = JSON.parse(await readFile(join(directory, 'trackr', row.model_response_file), 'utf8'));
  assert.equal(model.content.length, 1); assert.equal(model.content[0].type, 'tool_use');
  assert.equal(row.model_text, '');
  const file = `${row.task_id}-${row.condition}-${row.trial}-response.json`;
  const bytes = await readFile(join(directory, 'trackr', file));
  const result = JSON.parse(bytes);
  receipts.push({ file, sha256: createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length, is_error: Boolean(result.isError), result_tokens: row.result_tokens, result_tokens_approximate: row.result_tokens_approximate });
  await rename(join(directory, 'trackr', file), join(archive, file));
  await chmod(join(archive, file), 0o600);
}
await writeFile(join(directory, 'trackr-tool-receipts.json'), JSON.stringify({ reason: 'Automatic approval review rejected exporting potentially private live issue payloads. Complete original bytes remain in a local mode-0700 archive; public evidence retains no issue bodies/comments.', local_archive_directory: archive, public_model_responses_contain_only_tool_inputs_already_present_in_the_300_token_reference: true, receipts }, null, 2) + '\n');
console.log(JSON.stringify({ archived_locally: receipts.length, raw_issue_payloads_in_public_trial_directory: 0, local_archive_directory: archive }));
