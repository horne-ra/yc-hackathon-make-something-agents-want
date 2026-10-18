import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { namedToken, protectedTools, quotaScript } from './access.js';
const run = promisify(execFile);
const token = 'a'.repeat(43);
describe('named token access', () => {
  const raw = JSON.stringify({judges:{token,daily_verify_limit:5},codex:{token:'b'.repeat(43)}});
  it('authenticates a name and limit, rejecting missing, malformed and retired credentials', () => {
    expect(namedToken(`Bearer ${token}`,raw)).toEqual({name:'judges',token,daily_verify_limit:5});
    for (const header of [undefined,'Bearer wrong',`Basic ${token}`,`Bearer ${token} extra`]) expect(namedToken(header,raw)).toBeNull();
    expect(namedToken(`Bearer ${token}`,'{}')).toBeNull();
    expect(namedToken(`Bearer ${token}`,'not json')).toBeNull();
    expect(namedToken(`Bearer ${token}`,JSON.stringify({bad:{token:'short'}}))).toBeNull();
    expect(namedToken(`Bearer ${token}`,JSON.stringify({one:{token},two:{token}}))).toBeNull();
  });
  it('requires access on exactly the five full-loop tools and preview', () => {
    expect([...protectedTools]).toEqual(['propose_patch','verify_patch','get_verification_result','confirm_patch','preview_run']);
    for (const name of ['audit_server','ping','initialize','tools/list','resources/list','prompts/list']) expect(protectedTools.has(name)).toBe(false);
  });
  it('enforces five atomic daily claims across independent concurrent processes and permits a new day', async () => {
    const root = await mkdtemp(join(tmpdir(),'axlint-quota-test-'));
    const claim = async (day:string) => JSON.parse((await run(process.execPath,['--input-type=module','-e',quotaScript('judges',5,day,root)])).stdout);
    try {
      const results=await Promise.all(Array.from({length:12},()=>claim('2026-10-18')));
      expect(results.filter(r=>r.allowed)).toHaveLength(5);
      expect((await claim('2026-10-18')).allowed).toBe(false);
      expect((await claim('2026-10-19')).allowed).toBe(true);
      expect((await claim('2026-10-18')).allowed).toBe(false);
    } finally { await rm(root,{recursive:true,force:true}); }
  });
});
