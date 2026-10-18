import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const hash = value => createHash('sha256').update(value).digest('hex');
export const files = [
  ['filesystem/hand-run-filesystem.ts', 'scripts/filesystem-prompt-check/harness/hand-run-filesystem.ts', false],
  ['filesystem/hand-run-common.ts', 'scripts/filesystem-prompt-check/harness/hand-run-common.ts', false],
  ['filesystem/filesystem-runner.ts', 'scripts/filesystem-prompt-check/harness/filesystem-runner.ts', true],
  ['trackr/hand-run.ts', 'scripts/hand-run.ts', false],
  ['trackr/hand-run-common.ts', 'scripts/hand-run-common.ts', true],
];
export async function checkSources() {
  const proof = [];
  for (const [name, originalPath, instrumented] of files) {
    const original = await readFile(originalPath, 'utf8');
    const execution = await readFile(`scripts/max-tokens-check/harness/${name}`, 'utf8');
    let reversed = execution;
    if (instrumented) {
      reversed = reversed.replace(/        \/\/ Observation only: no request, scoring, or dispatch changes\.[\s\S]*?        await writeFile\(`\$\{output\}\/\$\{record\.model_response_file\}`, JSON\.stringify\(response, null, 2\)\);\n/u, '');
      reversed = reversed.replace("; stop_reason?: Anthropic.Message['stop_reason']; pre_tool_text_present?: boolean | null; pre_tool_text_characters?: number | null; pre_tool_text_words?: number | null; model_response_file?: string };", ' };');
      if (name.startsWith('trackr/')) reversed = reversed.replace('\n            await writeFile(`${output}/${task.id}-${condition}-${trial}-response.json`, JSON.stringify(execution.result, null, 2));', '');
      assert.equal(reversed.split('max_tokens: 4096').length, 3);
      reversed = reversed.replaceAll('max_tokens: 4096', 'max_tokens: 300');
    }
    assert.equal(reversed, original, `Only budget and response-only observations may differ: ${name}`);
    proof.push({ name, original_path: originalPath, original_sha256: hash(original), execution_sha256: hash(execution), reversed_equal: true, max_tokens_change: instrumented ? '300 -> 4096' : null });
  }
  return proof;
}
if (process.argv[1]?.endsWith('/control.mjs')) console.log(JSON.stringify(await checkSources(), null, 2));
