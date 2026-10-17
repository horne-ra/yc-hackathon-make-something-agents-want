import { useToolContext } from "mcp-use/react";

export default function PingView() {
  const { status, toolOutput, error } = useToolContext<"ping">();
  const style = {background:"#111827", color:"#f3f4f6", fontFamily:"system-ui, sans-serif", padding:24, fontSize:18, lineHeight:1.5};
  if (status === "pending") return <main style={style} aria-live="polite">Checking AX Lint platforms…</main>;
  if (status === "error") return <main style={style} role="alert">Platform check failed: {error.message}</main>;
  const { https, secrets, sandbox, checkedAt } = toolOutput;
  const checks = [
    {label:"Outbound HTTPS", ok:https.ok, detail:https.status},
    {label:"Provider secret", ok:secrets.anthropic, detail:secrets.anthropic ? "Configured" : "Missing"},
    {label:"Blaxel secrets", ok:secrets.blaxel && secrets.workspace, detail:secrets.blaxel && secrets.workspace ? "Configured" : "Missing"},
    {label:"Blaxel sandbox", ok:sandbox.ok, detail:sandbox.status},
  ];
  return <main style={style}>
    <h1 style={{fontSize:28,margin:"0 0 8px"}}>AX Lint platform ping</h1>
    <p style={{margin:"0 0 20px"}}>{toolOutput.message}</p>
    <ul style={{padding:0,listStyle:"none",margin:0}}>{checks.map(item => <li key={item.label} style={{padding:"12px 0",borderTop:"1px solid #888"}}>
      <strong>{item.ok ? "✓" : "!"} {item.label}</strong><br /><span>{item.detail}</span>
    </li>)}</ul>
    <p style={{fontSize:16,marginBottom:0}}>Checked {new Date(checkedAt).toLocaleTimeString()}</p>
  </main>;
}
