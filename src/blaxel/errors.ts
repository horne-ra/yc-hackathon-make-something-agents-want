/** Extract public provider diagnostics; never coerce a thrown object to String(). */
export function errorMessage(error: unknown): string {
  const seen=new Set<unknown>();
  function visit(value:unknown):string {
    if(typeof value==='string')return value;
    if(value instanceof Error)return value.message;
    if(!value||typeof value!=='object'||seen.has(value))return '';
    seen.add(value);
    const object=value as Record<string,unknown>;
    return ['code','message','detail','error','errors','body','data'].map(key=>Array.isArray(object[key])?(object[key] as unknown[]).map(visit).filter(Boolean).join('; '):visit(object[key])).filter(Boolean).join(': ');
  }
  let message=visit(error).replaceAll('[object Object]','unstructured provider error')||'The sandbox provider request failed without a diagnostic message.';
  for(const [key,value] of Object.entries(process.env))if(value&&/KEY|TOKEN|SECRET/.test(key))message=message.replaceAll(value,'<redacted>');
  return message.slice(0,2000);
}
export class RunStartError extends Error {
  constructor(public readonly code:string,message:string){super(message);this.name='RunStartError';}
}
export function runStartError(error:unknown):RunStartError {
  if(error instanceof RunStartError)return error;
  const message=errorMessage(error);
  if(/QUOTA_EXCEEDED|quota exceeded|capacity_exhausted/i.test(message))return new RunStartError('capacity_exhausted','Blaxel sandbox capacity is exhausted. Completed verification runs are retained for at least two hours. Wait for an eligible run to expire or increase the workspace sandbox quota; queued, running, recent runs and the proof sandbox are protected.');
  if(/unauthorized|forbidden|UNAUTHENTICATED|PERMISSION_DENIED/i.test(message))return new RunStartError('sandbox_auth_failed',`Blaxel rejected the workspace credentials: ${message}`);
  return new RunStartError('sandbox_request_failed',`Blaxel could not start the verification run: ${message}`);
}
