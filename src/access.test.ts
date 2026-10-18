import { describe, it, expect, vi, afterEach } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { namedToken, protectedTools, quotaScript, checkToolAccess } from './access.js';
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

afterEach(()=>vi.unstubAllEnvs());
describe('protected tool gates and quota errors',()=>{
  const input=JSON.parse(readFileSync('runner/evidence/corrected-input.json','utf8'));
  it('gates every protected tool and leaves audit/ping public without configuration',async()=>{
    vi.stubEnv('AXLINT_API_TOKENS','{}');
    for(const name of protectedTools)expect(await checkToolAccess(name,{},undefined)).toMatchObject({isError:true});
    for(const name of ['audit_server','ping'])expect(await checkToolAccess(name,{},undefined)).toBeUndefined();
  });
  it('returns quota_exceeded, keeps polling available, and does not charge invalid inputs',async()=>{
    vi.stubEnv('AXLINT_API_TOKENS',JSON.stringify({judges:{token,daily_verify_limit:5}}));
    const consume=vi.fn(async()=>({allowed:false,used:5,limit:5,day:'2026-10-18'}));
    const error=await checkToolAccess('verify_patch',input,`Bearer ${token}`,consume);
    expect(JSON.parse(error!.content[0]!.text)).toMatchObject({error:{code:'quota_exceeded',message:expect.stringContaining('00:00 UTC')}});
    expect(await checkToolAccess('get_verification_result',{run_id:'x'},`Bearer ${token}`,consume)).toBeUndefined();
    expect(await checkToolAccess('verify_patch',{},`Bearer ${token}`,consume)).toBeUndefined();
    expect(consume).toHaveBeenCalledTimes(1);
  });
  it('fails closed when quota storage is unavailable, without exposing the underlying error',async()=>{
    vi.stubEnv('AXLINT_API_TOKENS',JSON.stringify({judges:{token,daily_verify_limit:5}}));
    const error=await checkToolAccess('verify_patch',input,`Bearer ${token}`,async()=>{throw Error('sensitive provider detail')});
    expect(JSON.parse(error!.content[0]!.text).error.code).toBe('quota_unavailable');expect(error!.content[0]!.text).not.toContain('sensitive provider detail');
  });
});
