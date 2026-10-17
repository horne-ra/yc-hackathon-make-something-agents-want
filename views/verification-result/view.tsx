import {useEffect} from "react";
import {useToolContext,useCallTool} from "mcp-use/react";
import {RunPresentationSchema} from "../../viewer/presentation.js";
import {Verification,PreviewState} from "../preview-run/verification.js";
import "../preview-run/view.css";
export default function VerificationResultView(){
 const context=useToolContext<"get_verification_result">();
 const poll=useCallTool("get_verification_result");
 const state=poll.data?.structuredContent??(context.status==="ready"?context.toolOutput:undefined);
 const meta=poll.data?._meta??context.meta;
 const runId=context.toolInput?.run_id;
 const terminal=state&&["complete","failed","run_expired"].includes(state.status);
 useEffect(()=>{if(!runId||terminal)return;let pending=false;const timer=setInterval(()=>{if(pending)return;pending=true;poll.callTool({run_id:runId}).catch(()=>{}).finally(()=>{pending=false})},3000);return()=>clearInterval(timer)},[runId,terminal,poll.callTool]);
 if(context.status==="error")return <PreviewState error={context.error.message}/>;
 if(!state)return <PreviewState/>;
 const parsed=RunPresentationSchema.safeParse(meta?.axlintViewer);
 return <><div className="verification"><p role="status">Run status: <strong>{state.status}</strong>{state.progress?` · ${state.progress.done}/${state.progress.total} trials`:""}</p>{"error" in state&&state.error&&<p role="alert">{state.error.code}: {state.error.message}</p>}{poll.error&&<p role="alert">Refresh failed: {poll.error.message}. Ask Claude to poll this run again if this client does not support widget tool calls.</p>}<button className="run-refresh" onClick={()=>poll.callTool({run_id:runId??parsed.data?.runId??""}).catch(()=>{})} disabled={poll.isPending||!runId}>Refresh run</button></div>{parsed.success?<Verification data={parsed.data}/>:<main className="verification"><h1>Verification {state.status}</h1><p>{terminal?"No additional render context is available for this run.":"Waiting for the runner to save its metadata and trial files. This view refreshes every three seconds."}</p></main>}</>;
}
