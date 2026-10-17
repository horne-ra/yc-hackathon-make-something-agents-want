import { createHash, timingSafeEqual } from "node:crypto";

/** Static bearer credentials are supplied only through the hosting environment. */
export function acceptsBearer(header: string | undefined, expected: string): boolean {
  const match = /^Bearer ([A-Za-z0-9._~+\/-]+=*)$/i.exec(header ?? "");
  if (!match) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(match[1]), digest(expected));
}
