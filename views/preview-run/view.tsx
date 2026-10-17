import { useToolContext } from "mcp-use/react";
import { PreviewState, Verification } from "./verification.js";
import "./view.css";

export default function PreviewRunView() {
  const {status,toolOutput,error}=useToolContext<"preview_run">();
  if(status==="pending") return <PreviewState/>;
  if(status==="error") return <PreviewState error={error.message}/>;
  return <Verification data={toolOutput}/>;
}
