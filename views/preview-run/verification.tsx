import { useEffect, useState } from "react";
import { diffWords } from "diff";
import type { RunPresentation } from "../../viewer/presentation.js";

const number = (value:number)=>value.toLocaleString("en-US");
const titles:Record<string,string>={"t1-route":"Checkout routing","t2-status":"Active work","t3-payload":"Maria’s open issues","t4-control":"Exact issue lookup"};
const conditionName = (condition:string)=>condition==="baseline"?"Baseline":"Candidate";

export function Verification({data}:{data:RunPresentation}) {
  const total=data.progress.total;
  const verdictLabel=data.verdict.charAt(0).toUpperCase()+data.verdict.slice(1);
  const payload=data.tasks.find(task=>task.id==="t3-payload");
  const payloadTrial=(condition:"baseline"|"candidate")=>payload?.trials.find(trial=>trial.condition===condition&&trial.index===(condition==="baseline"?payload.representative.baseline_trial:payload.representative.candidate_trial));
  const [done,setDone]=useState(data.progress.done);
  const [playing,setPlaying]=useState(false);
  const [selected,setSelected]=useState("t3-payload");
  const [selectedTrial,setSelectedTrial]=useState<number|null>(null);
  useEffect(()=>{setDone(data.progress.done);setPlaying(false);setSelectedTrial(null)},[data.runId,data.progress.done,total]);
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setDone(value=>{if(value>=total){setPlaying(false);return total}return value+1}),450);return()=>clearInterval(timer)},[playing,total]);
  const complete=done===total;
  const focus=data.tasks.find(task=>task.id===selected)??data.tasks[0];
  const story=(condition:"baseline"|"candidate")=>focus.trials.find(trial=>trial.condition===condition&&trial.index===(selectedTrial??(condition==="baseline"?focus.representative.baseline_trial:focus.representative.candidate_trial)));
  const payloadTokens=(condition:"baseline"|"candidate")=>{const trial=payloadTrial(condition);return trial&&trial.order<done?number(trial.resultTokens):"Pending"};
  const trialsPerCondition=Math.max(0,...data.tasks.map(task=>task.trials.filter(trial=>trial.condition==="baseline").length));
  const selectTask=(id:string,index:number|null=null)=>{setSelected(id);setSelectedTrial(index)};
  const visible=(condition:"baseline"|"candidate")=>data.tasks.flatMap(task=>task.trials).filter(trial=>trial.condition===condition&&trial.order<done);
  const count=(condition:"baseline"|"candidate")=>`${visible(condition).filter(trial=>trial.passed).length}/${visible(condition).length}`;
  return <main className="verification">
    <header className="run-header">
      <div className="eyebrow">AX LINT <span>RECORDED FIXTURE PREVIEW</span></div>
      <div className="heading-row"><div><h1>Trackr verification</h1><p>Metadata changes. Measured first-call behavior.</p></div><span className={complete?`verdict-tag ${data.verdict}`:"waiting-tag"}>{complete?verdictLabel:playing?"Replaying fixture":"Playback paused"}</span></div>
      <div className="summary-strip"><div><span>First-call passes</span><strong>{count("baseline")} <b>→</b> {count("candidate")}</strong></div><div><span>Maria’s issue payload</span><strong>{payloadTokens("baseline")} <b>→</b> {payloadTokens("candidate")} <small>tokens</small></strong></div><div><span>Trials per condition</span><strong>{trialsPerCondition} <small>provisional</small></strong></div></div>
      <p className="fixture-note">Recorded S3 trial data, presented as a fixture. Playback does not start a job or apply a patch.</p>
      <nav aria-label="Verification sections">{["Audit","Patch","Trials","One trial","Verdict","Confirm"].map((name,index)=><a key={name} href={`#section-${index+1}`}>{index+1}. {name}</a>)}</nav>
    </header>

    <section id="section-1"><div className="section-heading"><span className="step">01</span><h2>Audit</h2><span className="section-caption">{data.audit.tools.length} tools · {data.audit.findingCount} findings</span></div>
      <div className="tool-grid">{data.audit.tools.map(tool=><article className="tool-card" key={tool.name}><h3>{tool.name}</h3><p>{tool.description}</p>
        <div className="badge-row">{tool.findings.filter(finding=>["F1","F2","F3"].includes(finding.id)).map(finding=><span className="finding-badge" key={finding.id}>{finding.id} · {finding.param??"Tool overlap"}</span>)}{tool.name==="get_issue"&&<span className="control-badge">Control tool</span>}</div>
        {tool.findings.length>0&&<details><summary>Inspect {tool.findings.length} findings</summary><ul>{tool.findings.map(finding=><li key={finding.id}><strong>{finding.id} · {finding.severity}</strong><p>{finding.message}</p></li>)}</ul></details>}
      </article>)}</div>
    </section>

    <section id="section-2"><div className="section-heading"><span className="step">02</span><h2>Patch</h2><span className="section-caption">Descriptions only</span></div>
      <p className="section-intro">The same tools, parameters and runtime behavior. Static tool metadata: {data.staticTokens.baseline} → {data.staticTokens.candidate} tokens.</p>
      <div className="patch-list">{data.patch.map(operation=><article className="patch-row" key={operation.target}><div className="patch-target"><h3>{operation.target}</h3><span>{operation.findingIds.join(" · ")}</span></div><div className="patch-copy"><p className="before"><span>Before</span>{operation.before==="No parameter description"?<em className="empty-description">No parameter description</em>:diffWords(operation.before,operation.after).filter(part=>!part.added).map((part,index)=><span className={part.removed?"removed-word":"unchanged-word"} key={index}>{part.value}</span>)}</p><p className="after"><span>After</span>{diffWords(operation.before,operation.after).filter(part=>!part.removed).map((part,index)=><span className={part.added?"added-word":"unchanged-word"} key={index}>{part.value}</span>)}</p></div></article>)}</div>
    </section>

    <section id="section-3"><div className="section-heading"><span className="step">03</span><h2>Trials</h2><span className="section-caption" aria-live="polite">{done} / {total} recorded trials</span></div>
      <div className="playback-row"><p>Choose a task for its representative pair, or a trial to compare that numbered pair.</p><button onClick={()=>{setDone(0);setPlaying(true)}} disabled={playing}>▶ Replay fixture</button>{done<total&&<button className="quiet-button" onClick={()=>setPlaying(value=>!value)}>{playing?"Pause":"Resume"}</button>}<button className="quiet-button" onClick={()=>{setPlaying(false);setDone(total)}}>Show all</button></div>
      <div className="progress-track" role="progressbar" aria-label="Fixture playback progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}><div style={{width:`${done/total*100}%`}} /></div>
      <p className="scroll-hint">Scroll the trial grid sideways to compare Baseline and Candidate.</p>
      <div className="trial-table-scroll" tabIndex={0} role="region" aria-label="Trial results; scroll horizontally on narrow screens"><div className="trial-table" role="table" aria-label="Baseline and candidate trial results"><div className="trial-row table-head" role="row"><span role="columnheader">Task</span><span role="columnheader">Baseline</span><span role="columnheader">Candidate</span></div>
        {data.tasks.map(task=><div className={`trial-row ${selected===task.id?"selected-row":""}`} role="row" key={task.id}><div role="cell"><button className="task-button" onClick={()=>selectTask(task.id)} aria-pressed={selected===task.id&&selectedTrial===null}>{titles[task.id]??task.id}</button><span className="task-id">{task.id}{task.control?" · control":""}</span></div>{(["baseline","candidate"] as const).map(condition=><div className="trial-cells" role="cell" key={condition}>{task.trials.filter(trial=>trial.condition===condition).map(trial=>{const shown=trial.order<done;return <button key={trial.index} className={`trial-cell ${shown?(trial.passed?"pass":"fail"):"pending"}`} onClick={()=>selectTask(task.id,trial.index)} aria-pressed={selected===task.id&&selectedTrial===trial.index} aria-label={`${task.id} ${condition} trial ${trial.index}: ${shown?(trial.passed?"passed":"failed"):"pending"}`}><strong>{shown?(trial.passed?"✓":"!"):"·"}</strong><span>{trial.index} · {shown?(trial.passed?"pass":"fail"):"wait"}</span></button>})}</div>)}</div>)}
      </div></div>
      <div className="legend"><span>✓ Solid blue = pass</span><span>! Dashed orange = fail</span><span>· Gray = pending</span></div>
    </section>

    <section id="section-4"><div className="section-heading"><span className="step">04</span><h2>One trial up close</h2><span className="section-caption">{focus.id} · {selectedTrial===null?"representative pair":`trial ${selectedTrial}`}</span></div><blockquote>{focus.prompt}</blockquote>
      <div className="story-grid">{(["baseline","candidate"] as const).map(condition=>{const trial=story(condition);const shown=Boolean(trial&&trial.order<done);return <article className={`story-card ${shown&&trial?(trial.passed?"pass":"fail"):"pending"}`} key={condition}><h3>{conditionName(condition)} <span>{shown&&trial?(trial.passed?"✓ Pass":"! Fail"):(trial?"Pending":"No recorded call")}</span></h3>{shown&&trial?<><code className="tool-name">{trial.tool}</code><pre>{JSON.stringify(trial.args,null,2)}</pre><div className="token-count"><strong>{number(trial.resultTokens)}</strong> result tokens</div><p className="explanation">{trial.explanation}</p></>:<p>{trial?"Waiting for this recorded trial in playback.":"No representative call was recorded for this condition."}</p>}</article>})}</div>
      {focus.id==="t3-payload"&&complete&&story("baseline")?.args.include_comments===undefined&&story("candidate")?.args.include_comments===false&&<p className="insight">The baseline omitted <code>include_comments</code>. The candidate explicitly set it to <code>false</code>, keeping the quick list small.</p>}
    </section>

    <section id="section-5"><div className="section-heading"><span className="step">05</span><h2>Verdict</h2><span className="section-caption">Programmatic scoring</span></div><div className={`verdict-panel ${complete?data.verdict:"awaiting"}`}><h3>{complete?verdictLabel:"Waiting for all trials"}</h3><p>{data.provisionalLabel}</p>{complete&&<><div className="verdict-counts"><strong>{data.totals.baseline.passed}/{data.totals.baseline.of}</strong><span>→</span><strong>{data.totals.candidate.passed}/{data.totals.candidate.of}</strong><span>first-call passes</span></div><ul>{data.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul><p>Total result tokens across the {data.totals.baseline.of} baseline and {data.totals.candidate.of} candidate calls: <strong>{number(data.totals.baseline.result_tokens)} → {number(data.totals.candidate.result_tokens)}</strong>.</p></>}</div></section>

    <section id="section-6"><div className="section-heading"><span className="step">06</span><h2>Confirm</h2><span className="section-caption">Illustrative fixture gates</span></div><p className="section-intro">These gates demonstrate the confirmation layout. No patch has been applied or confirmed by this preview.</p><div className="confirm-grid">{data.confirm.map((gate,index)=><div className={!complete?"confirm-gate awaiting":gate.passed?"confirm-gate":"confirm-gate failed"} key={gate.name}><span>{complete?(gate.passed?"✓":"!"):index+1}</span><strong>{gate.name}</strong><small>{complete?(gate.passed?"Fixture pass":"Fixture fail"):"Awaiting verdict"}</small></div>)}</div></section>
    <footer><span title="Target server deployment and source revision">{data.serverVersion}</span><span>{data.model}</span><span>{data.runId}</span><span>Read-only preview</span></footer>
  </main>;
}


export function PreviewState({error}:{error?:string}) {
  return error
    ? <main className="verification state-message" role="alert"><h1>Preview unavailable</h1><p>{error}</p><p>Call preview_run again to retry.</p></main>
    : <main className="verification state-message" aria-live="polite"><h1>Loading verification preview…</h1><p>Preparing the recorded fixture.</p></main>;
}
