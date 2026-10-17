import type { Task, Tool, WireOp } from '../../src/core/index.js';
export const tools: Tool[] = [
  { name: 'list_issues', description: 'List issues.', inputSchema: { type: 'object', properties: { status: { type: 'string' }, assignee: { type: 'string' }, include_comments: { type: 'boolean' }, limit: { type: 'number' } }, additionalProperties: false } },
  { name: 'search_issues', description: 'Search issues.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, include_comments: { type: 'boolean' } }, required: ['query'], additionalProperties: false } },
  { name: 'get_issue', description: 'Get a single issue by its ID, for example TRK-117. Returns the title, status, assignee, body and full comment thread.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false } },
];
export const compactOps: WireOp[] = [
  { op: 'set_tool_description', tool: 'list_issues', value: 'Filter issues by structured fields (status, assignee). Does not search text; to find issues by topic or keyword, use search_issues.', finding_ids: ['F1'] },
  { op: 'set_tool_description', tool: 'search_issues', value: 'Full-text search over issue titles and bodies. Use when the user describes issues by topic or keyword. To filter by status or assignee, use list_issues.', finding_ids: ['F1'] },
  { op: 'set_param_description', tool: 'list_issues', param: 'status', value: 'One of: open, in_progress, blocked, closed. open: not started. in_progress: someone is actively working on it. blocked: waiting on something. closed: done.', finding_ids: ['F2'] },
  { op: 'set_param_description', tool: 'list_issues', param: 'include_comments', value: 'Include full comment threads, roughly 1 to 2K tokens per issue. Defaults to true. Set false when only titles and status are needed.', finding_ids: ['F3'] },
];
export const tasks: Task[] = [
  { id: 't1-route', prompt: 'List the issues about the checkout page.', control: false, expect: { tool: 'search_issues', args: { query: { contains: 'checkout' } } } },
  { id: 't2-status', prompt: 'Which issues is someone actively working on right now?', control: false, expect: { tool: 'list_issues', args: { status: { equals: 'in_progress' } } } },
  { id: 't3-payload', prompt: "Give me a quick list of maria's open issues.", control: false, expect: { tool: 'list_issues', args: { status: { equals: 'open' }, assignee: { contains: 'maria' }, include_comments: { equals: false } } } },
  { id: 't4-control', prompt: 'Pull up issue TRK-117.', control: true, expect: { tool: 'get_issue', args: { id: { equals: 'TRK-117' } } } },
];
