import { createHash } from 'node:crypto';
import { ToolsSchema, WireOpsSchema, type Json, type Tool, type ToolDiff, type WireOp } from './contracts.js';

/** JSON object keys and the top-level tools are sorted; nested arrays retain their order. */
export function canonicalize(tools: readonly Tool[]): Tool[] {
  const sorted = (v: Json): Json => {
    if (Array.isArray(v)) return v.map(sorted);
    if (v !== null && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sorted(v[k]!)]));
    return v;
  };
  return tools.map(t => sorted(t) as Tool).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
}
export const hashText = (text: string): string => `sha256:${createHash('sha256').update(text, 'utf8').digest('hex')}`;
export const hashTools = (tools: readonly Tool[]): string => hashText(JSON.stringify(canonicalize(tools)));
export const hashJson = (value: Json): string => {
  const stable = (v: Json): Json => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k]!)])) : v;
  return hashText(JSON.stringify(stable(value)));
};
export function applyWireOps(baseline: readonly Tool[], operations: readonly WireOp[]): Tool[] {
  const tools = ToolsSchema.parse(structuredClone(baseline));
  for (const op of WireOpsSchema.parse(operations)) {
    const tool = tools.find(t => t.name === op.tool);
    if (!tool) throw new Error(`unknown_tool: ${op.tool}`);
    if (op.op === 'set_tool_description') tool.description = op.value;
    else {
      const properties = tool.inputSchema.properties;
      if (!properties || Array.isArray(properties) || typeof properties !== 'object') throw new Error(`unknown_parameter: ${op.tool}.${op.param}`);
      if (!Object.hasOwn(properties, op.param)) throw new Error(`unknown_parameter: ${op.tool}.${op.param}`);
      const param = properties[op.param];
      if (!param || Array.isArray(param) || typeof param !== 'object') throw new Error(`unsupported_parameter_schema: ${op.tool}.${op.param}`);
      Object.defineProperty(param, 'description', { value: op.value, enumerable: true, writable: true, configurable: true });
    }
  }
  return canonicalize(tools);
}
const pathKey = (base: string, key: string): string => /^[A-Za-z_$][\w$]*$/.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`;
export function diffTools(verified: readonly Tool[], live: readonly Tool[]): ToolDiff[] {
  const diffs: ToolDiff[] = [];
  function walk(a: Json | undefined, b: Json | undefined, path: string): void {
    if (JSON.stringify(a) === JSON.stringify(b)) return;
    if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object' && a !== undefined && b !== undefined && Array.isArray(a) === Array.isArray(b)) {
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
      for (const key of keys) walk((a as Record<string, Json>)[key], (b as Record<string, Json>)[key], Array.isArray(a) ? `${path}[${key}]` : pathKey(path, key));
    } else diffs.push({ path, ...(a === undefined ? {} : { verified: a }), ...(b === undefined ? {} : { live: b }) });
  }
  const a = new Map(canonicalize(verified).map(t => [t.name, t]));
  const b = new Map(canonicalize(live).map(t => [t.name, t]));
  for (const name of [...new Set([...a.keys(), ...b.keys()])].sort()) walk(a.get(name), b.get(name), pathKey('tools', name));
  return diffs;
}
