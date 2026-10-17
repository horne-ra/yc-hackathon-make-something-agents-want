import { createTwoFilesPatch } from 'diff';
import { SourceFileSchema, WireOpsSchema, type SourceEdit, type SourceFile, type Warning, type WireOp } from './contracts.js';
import { hashText } from './tools.js';
const unsupported = (message: string): never => { throw new Error(`unsupported_layout: ${message}`); };
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Match braces without treating quoted strings or comments as source syntax. */
function braceRanges(text: string): [number, number][] {
  const ranges: [number, number][] = [], stack: number[] = [];
  let quote = '', comment = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!, n = text[i + 1];
    if (comment === '//') { if (c === '\n') comment = ''; continue; }
    if (comment === '/*') { if (c === '*' && n === '/') { comment = ''; i++; } continue; }
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
    if (c === '/' && (n === '/' || n === '*')) { comment = c + n; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') stack.push(i);
    if (c === '}') { const start = stack.pop(); if (start === undefined) unsupported('unbalanced braces'); ranges.push([start!, i + 1]); }
  }
  if (stack.length || quote || comment === '/*') unsupported('unbalanced source');
  return ranges;
}
function targetLine(content: string, op: WireOp): { start: number; end: number; line: string; objectStart: number; objectEnd: number } {
  const ranges = braceRanges(content);
  const names = [...content.matchAll(new RegExp(`^[ \\t]*name:[ \\t]*${escapeRegex(JSON.stringify(op.tool))},?[ \\t]*\\r?$`, 'gm'))];
  if (names.length !== 1) unsupported(`expected one name for ${op.tool}, got ${names.length}`);
  const index = names[0]!.index!;
  const object = ranges.filter(([a, b]) => a < index && b > index).sort((a, b) => a[1] - a[0] - (b[1] - b[0]))[0];
  if (!object) unsupported(`missing object for ${op.tool}`);
  let [start, end] = object!;
  if (op.op === 'set_param_description') {
    const params = [...content.slice(start, end).matchAll(/^[ \t]*params:[ \t]*\{/gm)];
    if (params.length !== 1) unsupported(`expected one params object for ${op.tool}`);
    const brace = start + params[0]!.index! + params[0]![0].lastIndexOf('{');
    const range = ranges.find(([a]) => a === brace);
    if (!range) unsupported('missing params braces');
    [start, end] = range!;
  }
  const pattern = op.op === 'set_tool_description'
    ? /^[ \t]*description:[ \t]*"(?:[^"\\\r\n]|\\.)*",[ \t]*\r?$/gm
    : new RegExp(`^[ \\t]*${escapeRegex(op.param)}:[ \\t]*z\\.[^\\r\\n]+,[ \\t]*\\r?$`, 'gm');
  const matches = [...content.slice(start, end).matchAll(pattern)];
  // A match must belong directly to this object, not a nested parameter schema.
  const direct = matches.filter(m => !ranges.some(([a, b]) => a > start && b < end && start + m.index! > a && start + m.index! < b));
  if (direct.length !== 1) unsupported(`expected one target line for ${op.tool}${op.op === 'set_param_description' ? '.' + op.param : ''}, got ${direct.length}`);
  const m = direct[0]!;
  return { start: start + m.index!, end: start + m.index! + m[0].length, line: m[0], objectStart: object![0], objectEnd: object![1] };
}
/** A parameter line is one expression, not several object properties on one line. */
function assertSingleParamExpression(line: string): void {
  const expression = line.slice(line.indexOf(':') + 1).replace(/,[ \t]*\r?$/, '');
  const stack: string[] = [];
  let quote = '';
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i]!;
    if (quote) { if (char === '\\') i++; else if (char === quote) quote = ''; continue; }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue; }
    if ('([{'.includes(char)) stack.push(char);
    else if (')]}'.includes(char)) {
      const expected = { ')': '(', ']': '[', '}': '{' }[char];
      if (stack.pop() !== expected) unsupported('unbalanced parameter expression');
    } else if ((char === ',' || char === ';') && stack.length === 0) unsupported('expected one parameter per line');
    else if (char === '/' && (expression[i + 1] === '/' || expression[i + 1] === '*')) unsupported('comments inside parameter expressions');
  }
  if (quote || stack.length) unsupported('unbalanced parameter expression');
}
export function generateSourceEdits(files: readonly SourceFile[], operations: readonly WireOp[]): { source_edits: SourceEdit[]; unified_diff: string; base_source_hashes: Record<string, string> } {
  const sources = files.map(f => SourceFileSchema.parse(f));
  if (new Set(sources.map(f => f.path)).size !== sources.length) unsupported('duplicate source paths');
  const source = sources.filter(f => f.path === 'src/tools.ts');
  if (source.length !== 1) unsupported('expected src/tools.ts exactly once');
  const original = source[0]!.content;
  let content = original;
  const edits: SourceEdit[] = [];
  for (const op of WireOpsSchema.parse(operations)) {
    const { start, end, line, objectStart, objectEnd } = targetLine(content, op);
    let replacement: string;
    if (op.op === 'set_tool_description') replacement = line.replace(/(description:[ \t]*)"(?:[^"\\\r\n]|\\.)*"/, (_match, prefix: string) => prefix + JSON.stringify(op.value));
    else {
      assertSingleParamExpression(line);
      const descriptions = [...line.matchAll(/\.describe\("(?:[^"\\\r\n]|\\.)*"\)/g)];
      if (descriptions.length > 1 || (line.includes('.describe(') && descriptions.length !== 1)) unsupported('describe must be one double-quoted string literal');
      const base = descriptions.length ? line.replace(descriptions[0]![0], '') : line;
      // Put describe after optional, immediately before the comma, as prescribed.
      replacement = base.replace(/,([ \t]*\r?)$/, () => `.describe(${JSON.stringify(op.value)}),${base.match(/,([ \t]*\r?)$/)![1]}`);
    }
    // Identical parameter lines across tools need object context for an unambiguous apply.
    const find = content.split(line).length === 2 ? line : content.slice(objectStart, objectEnd);
    const replace = find === line ? replacement : content.slice(objectStart, start) + replacement + content.slice(end, objectEnd);
    if (content.split(find).length !== 2) unsupported('source edit find text is not unique');
    edits.push({ file: 'src/tools.ts', find, replace });
    content = content.slice(0, start) + replacement + content.slice(end);
  }
  return { source_edits: edits, unified_diff: content === original ? '' : createTwoFilesPatch('a/src/tools.ts', 'b/src/tools.ts', original, content), base_source_hashes: Object.fromEntries(sources.map(f => [f.path, hashText(f.content)])) };
}
export function validateDescriptionWarnings(files: readonly SourceFile[], operations: readonly WireOp[]): Warning[] {
  const constants = files.flatMap(f => [...f.content.matchAll(/\b(?:export\s+)?const\s+[A-Z][A-Z0-9_]*\s*=\s*\[((?:[^\]"']|"(?:[^"\\]|\\.)*"|'[^']*')*)\]\s*(?:as const)?/g)].map(m => {
    try { return JSON.parse(`[${m[1]}]`) as unknown[]; } catch { return []; }
  }));
  const warnings: Warning[] = [];
  for (const op of WireOpsSchema.parse(operations)) {
    const target = { tool: op.tool, ...(op.op === 'set_param_description' ? { param: op.param } : {}) };
    if (op.value.length > 1000) warnings.push({ code: 'description_too_long', ...target, message: 'Description exceeds 1,000 characters.' });
    if (op.op === 'set_param_description') {
      const clause = /(?:one of|allowed values(?: are)?|valid values(?: are)?)\s*:\s*([^.;\n]+)/i.exec(op.value);
      if (clause) {
        const values = clause[1]!.split(',').map(s => s.trim().replace(/^["'`]|["'`]$/g, ''));
        if (!constants.some(c => c.length === values.length && values.every(v => c.includes(v)))) warnings.push({ code: 'unverified_allowed_values', ...target, message: 'Stated allowed values do not match a constant in the provided source.' });
      }
    }
  }
  return warnings;
}
