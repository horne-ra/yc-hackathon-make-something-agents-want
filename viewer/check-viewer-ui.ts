// Real Inspector DOM/interaction QA through the screenshot CLI's existing CDP hook.
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {mkdtemp,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
const profile=await mkdtemp(path.join(tmpdir(),"axlint-viewer-chrome-"));
const chrome=spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",["--headless=new","--remote-debugging-port=9237",`--user-data-dir=${profile}`,"--no-first-run","--no-default-browser-check","about:blank"],{stdio:"ignore"});
let capture:ReturnType<typeof spawn>|undefined;
let socket:WebSocket|undefined;
try {
  let ws="";
  for(let i=0;i<100;i++){try{const info=await(await fetch("http://127.0.0.1:9237/json/version")).json();ws=info.webSocketDebuggerUrl;break}catch{await wait(50)}}
  assert(ws,"Chrome debugging endpoint did not start");
  capture=spawn("pnpm",["exec","tsx","viewer/capture-preview.ts","http://127.0.0.1:3014/mcp","/private/tmp/axlint-viewer-interaction.png","complete","768"],{env:{...process.env,AXLINT_QA_CDP_URL:ws,AXLINT_QA_CAPTURE_DELAY_MS:"20000"},stdio:["ignore","pipe","pipe"]});
  let captureLog="";capture.stdout?.on("data",data=>captureLog+=String(data));capture.stderr?.on("data",data=>captureLog+=String(data));
  let target:any;
  for(let i=0;i<200;i++){const targets=await(await fetch("http://127.0.0.1:9237/json/list")).json();target=targets.find((item:any)=>item.type==="page"&&item.url.includes("/inspector/preview/preview-run"));if(target)break;await wait(100)}
  assert(target,"Real Inspector preview target was not found");
  socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise<void>((resolve,reject)=>{socket!.addEventListener("open",()=>resolve(),{once:true});socket!.addEventListener("error",()=>reject(Error("CDP connection failed")),{once:true})});
  let nextId=1;const pending=new Map<number,{resolve:(value:any)=>void,reject:(error:Error)=>void}>();const contexts:any[]=[];
  socket.addEventListener("message",event=>{const message=JSON.parse(String(event.data));if(message.method==="Runtime.executionContextCreated")contexts.push(message.params.context);const task=pending.get(message.id);if(task){pending.delete(message.id);message.error?task.reject(Error(message.error.message)):task.resolve(message.result)}});
  const send=(method:string,params:object={})=>new Promise<any>((resolve,reject)=>{const id=nextId++;pending.set(id,{resolve,reject});socket!.send(JSON.stringify({id,method,params}))});
  await send("Runtime.enable");
  const evaluate=async(expression:string,contextId?:number)=>{const result=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true,...(contextId?{contextId}:{})});if(result.exceptionDetails)throw Error("Inspector DOM evaluation failed");return result.result?.value};
  let contextId:number|undefined;
  for(let i=0;i<100;i++){for(const context of contexts){try{if(await evaluate('!!document.querySelector(".verification .trial-table")',context.id)){contextId=context.id;break}}catch{}}if(contextId)break;await wait(100)}
  assert(contextId,"Rendered viewer context was not found");
  const run=(expression:string)=>evaluate(expression,contextId);
  const initial=await run('({cells:document.querySelectorAll(".trial-cell").length,fail:document.querySelectorAll(".trial-cell.fail").length,minFont:Math.min(...[...document.querySelectorAll(".verification *")].filter(el=>getComputedStyle(el).display!=="none"&&el.textContent.trim()).map(el=>parseFloat(getComputedStyle(el).fontSize))),overflow:document.documentElement.scrollWidth>innerWidth})');
  assert.equal(initial.cells,24);assert.equal(initial.fail,3);assert(initial.minFont>=16);assert.equal(initial.overflow,false);
  await run('[...document.querySelectorAll(".task-button")].find(el=>el.textContent.includes("Exact issue")).click()');
  assert((await run('document.querySelector("blockquote").textContent')).includes("TRK-117"));
  await run('[...document.querySelectorAll(".task-button")].find(el=>el.textContent.includes("Maria")).click()');
  await run('[...document.querySelectorAll("button")].find(el=>el.textContent.includes("Replay fixture")).click()');
  const reset=await run('Number(document.querySelector("[role=progressbar]").getAttribute("aria-valuenow"))');assert(reset<24);
  await wait(1100);
  const advancing=await run('Number(document.querySelector("[role=progressbar]").getAttribute("aria-valuenow"))');assert(advancing>reset&&advancing<24);
  await run('[...document.querySelectorAll("button")].find(el=>el.textContent==="Show all").click()');
  assert.equal(await run('Number(document.querySelector("[role=progressbar]").getAttribute("aria-valuenow"))'),24);
  const secretInput=await run('document.querySelector("input[type=password]")!==null');assert.equal(secretInput,false);
  console.log(`PASS real Inspector UI:24cells/3failures,minFont${initial.minFont}px,noinlineoverflow; taskselectionchangesstory; replayresetsandadvanceswithoutreload; Showallrestores24`);
  const exit=await new Promise<number|null>(resolve=>capture!.on("exit",resolve));assert.equal(exit,0,captureLog);console.log(captureLog.trim());
} finally {socket?.close();capture?.kill("SIGTERM");chrome.kill("SIGTERM");await wait(200);await rm(profile,{recursive:true,force:true});}
