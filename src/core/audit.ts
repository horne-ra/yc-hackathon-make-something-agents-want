import type { Finding, Json, Tool } from './contracts.js';
const readVerbs = new Set(['list', 'search', 'find', 'get', 'query', 'fetch', 'lookup', 'retrieve']);
export const severityByKind: Record<Finding['kind'], Finding['severity']> = {
  unclear_purpose: 'high', missing_usage_guidelines: 'medium', opaque_parameter: 'medium', unconstrained_string: 'high', sibling_overlap: 'high', payload_control_undocumented: 'medium', size_control_undocumented: 'high', description_too_long: 'warning', missing_output_schema: 'medium',
};
export function parameterSummaries(tool: Tool) {
  const required = Array.isArray(tool.inputSchema.required) ? tool.inputSchema.required : [];
  const properties = tool.inputSchema.properties;
  if (!properties || Array.isArray(properties) || typeof properties !== 'object') return [];
  return Object.entries(properties).map(([name, value]) => {
    const schema = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return { name, type: typeof schema.type === 'string' ? schema.type : 'unknown', required: required.includes(name), has_description: typeof schema.description === 'string' && schema.description.trim().length > 0, has_enum: Array.isArray(schema.enum) };
  });
}
export function auditTools(tools: readonly Tool[]): Finding[] {
  type Unnumbered = Omit<Finding, 'id' | 'severity'>;
  const findings: Unnumbered[] = [];
  const add = (kind: Finding['kind'], tool: string, message: string, param?: string) => findings.push({ kind, tool, message, ...(param === undefined ? {} : { param }) });
  for (let i = 0; i < tools.length; i++) for (let j = i + 1; j < tools.length; j++) {
    const a = tools[i]!, b = tools[j]!;
    const [av, ...an] = a.name.split('_'), [bv, ...bn] = b.name.split('_');
    const noun = an.find(n => bn.includes(n));
    const isIdLookup = (t: Tool) => t.name.startsWith('get_') && parameterSummaries(t).some(p => p.name === 'id' && p.required);
    const ad = a.description ?? '', bd = b.description ?? '';
    if (noun && readVerbs.has(av!) && readVerbs.has(bv!) && !isIdLookup(a) && !isIdLookup(b) && !ad.includes(b.name) && !bd.includes(a.name) && Math.min(ad.length, bd.length) < 60) {
      findings.push({ kind: 'sibling_overlap', tools: [a.name, b.name], message: 'Both tools read the same resource, at least one description is under 60 characters, and neither says when to use it instead of the other.', evidence: { shared_noun: noun, verbs: [av!, bv!], description_chars: [ad.length, bd.length], cross_reference: false } });
    }
  }
  for (const tool of tools) {
    const d = tool.description ?? '';
    if (!d.trim()) add('unclear_purpose', tool.name, 'Tool has no description explaining its purpose.');
    if (!/\b(use|when|instead|for example)\b/i.test(d)) add('missing_usage_guidelines', tool.name, 'Description does not say when to use this tool.');
    if (d.length > 1000) add('description_too_long', tool.name, 'Description exceeds 1,000 characters.');
    if (!Object.hasOwn(tool, 'outputSchema')) add('missing_output_schema', tool.name, 'Tool has no output schema.');
    for (const p of parameterSummaries(tool)) {
      if (!p.has_description) add('opaque_parameter', tool.name, 'Parameter has no description.', p.name);
      if (p.type === 'string' && !p.has_description && !p.has_enum) add('unconstrained_string', tool.name, 'Free-form string with no description or allowed values.', p.name);
      const normalized = p.name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
      if (!p.has_description && /^(?:limit|page_size|fields|depth|verbose|detail|format)$|^(?:max_|include_|exclude)/.test(normalized)) add('size_control_undocumented', tool.name, 'Size-controlling parameter has no description; explain response cost, accepted values and the actual default from source.', p.name);
    }
  }
  // New audits prioritize missing size controls. Frozen audit artifacts and their IDs remain unchanged.
  const ordered: Unnumbered[] = [];
  for (const kind of ['size_control_undocumented', 'sibling_overlap', 'unconstrained_string']) {
    const matching = findings.filter(f => f.kind === kind);
    if (kind === 'size_control_undocumented') ordered.push(...matching);
    else if (matching[0]) ordered.push(matching[0]);
  }
  ordered.push(...findings.filter(f => !ordered.includes(f)));
  const reserved: Partial<Record<Finding['kind'], number>> = { sibling_overlap: 1, unconstrained_string: 2, payload_control_undocumented: 3, size_control_undocumented: 3 };
  const assigned = new Set<Finding['kind']>();
  let next = 4;
  return ordered.map(f => {
    const id = reserved[f.kind] && !assigned.has(f.kind) ? reserved[f.kind]! : next++;
    assigned.add(f.kind);
    return { id: `F${id}`, severity: severityByKind[f.kind], ...f };
  });
}
