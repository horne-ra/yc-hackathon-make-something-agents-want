import { createHash } from 'node:crypto';
import { z } from 'zod';
import { acceptsBearer } from '../viewer/auth.js';

const TokenSchema = z.strictObject({ token: z.string().min(32).regex(/^[A-Za-z0-9_-]+$/), daily_verify_limit: z.number().int().positive().optional() });
const TokensSchema = z.record(z.string().regex(/^[a-z][a-z0-9_-]*$/), TokenSchema);
export type NamedToken = z.infer<typeof TokenSchema> & { name: string };
export const protectedTools = new Set(['propose_patch', 'verify_patch', 'get_verification_result', 'confirm_patch', 'preview_run']);
export const accessMessage = 'Full-loop access requires Authorization: Bearer <named token>. Ask the AX Lint maintainer for a client token; judges receive the judges token through the submission. Public audit_server and ping need no token. See docs/multi-client.md in the GitHub repository.';
export function namedToken(header: string | undefined, raw = process.env.AXLINT_API_TOKENS): NamedToken | null {
  // The retired AXLINT_API_TOKEN is deliberately never consulted.
  let tokens: z.infer<typeof TokensSchema>;
  try { tokens = TokensSchema.parse(JSON.parse(raw ?? '{}')); } catch { return null; }
  const entries = Object.entries(tokens);
  if (new Set(entries.map(([, v]) => v.token)).size !== entries.length) return null;
  let matched: NamedToken | null = null;
  for (const [name, value] of entries) if (acceptsBearer(header, value.token)) matched = { name, ...value };
  return matched;
}
export const tokenFingerprint = (token: NamedToken) => createHash('sha256').update(token.name).digest('hex');
export type QuotaResult = { allowed: boolean; used: number; limit: number; day: string };

// Executed on the persistent shared Blaxel runner. Exclusive per-day claim files
// are atomic across replicas/restarts; counters survive an AX Lint redeploy.
// Only a hash of the token NAME leaves the host, never any bearer credential.
export function quotaScript(key: string, limit: number, day: string, root = '/app/axlint-quotas'): string {
  return `const fs=await import('node:fs/promises');const dir=${JSON.stringify(root)}+'/'+${JSON.stringify(day)}+'/'+${JSON.stringify(key)};await fs.mkdir(dir,{recursive:true});let allowed=false,used=${limit};for(let i=1;i<=${limit};i++){try{const f=await fs.open(dir+'/'+i,'wx');await f.close();allowed=true;used=i;break}catch(e){if(e.code!=='EEXIST')throw e}}console.log(JSON.stringify({allowed,used,limit:${limit},day:${JSON.stringify(day)}}));`;
}
export async function consumeVerifyQuota(token: NamedToken): Promise<QuotaResult | null> {
  if (token.daily_verify_limit === undefined) return null;
  const sandboxName = process.env.AXLINT_QUOTA_SANDBOX;
  if (!sandboxName) throw new Error('quota_unavailable: AXLINT_QUOTA_SANDBOX must name the persistent shared runner. No verification was started.');
  const { SandboxInstance } = await import('@blaxel/core');
  const sandbox = await SandboxInstance.get(sandboxName);
  const script = Buffer.from(quotaScript(tokenFingerprint(token), token.daily_verify_limit, new Date().toISOString().slice(0, 10))).toString('base64');
  const started = await sandbox.process.exec({ command: `node --input-type=module -e 'await import("data:text/javascript;base64,${script}")'`, waitForCompletion: false, timeout: 20 });
  const result = started.status === 'running' ? await sandbox.process.wait(started.pid, { maxWait: 15000, interval: 25 }) : started;
  if (result.exitCode !== 0) throw new Error('quota_unavailable: Could not reserve a daily verification allowance. No verification was started.');
  return JSON.parse(result.stdout!.trim().split('\n').at(-1)!) as QuotaResult;
}
