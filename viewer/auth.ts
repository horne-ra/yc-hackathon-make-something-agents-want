import { createHash, timingSafeEqual } from "node:crypto";

/** Static bearer credentials are supplied only through the hosting environment. */
export function acceptsBearer(header: string | undefined, expected: string): boolean {
  const match = /^Bearer ([A-Za-z0-9._~+\/-]+=*)$/i.exec(header ?? "");
  if (!match) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(match[1]), digest(expected));
}

/** Local acceptance utilities use named credentials; never fall back to the retired token. */
export function configuredToken(name = 'codex'): string {
  let token: unknown;
  try { token = JSON.parse(process.env.AXLINT_API_TOKENS ?? '{}')[name]?.token; } catch { /* Named configuration is validated by the server as well. */ }
  if (typeof token !== 'string' || token.length < 32) throw new Error(`Configure ${name}.token in the local .env AXLINT_API_TOKENS value; the retired single token is not supported.`);
  return token;
}
