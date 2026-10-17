// Renderer regressions against real fixture data. Edge cases below are in-memory
// QA inputs only; they never replace the recorded benchmark or hosted fixture.
import assert from "node:assert/strict";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {PreviewState,Verification} from "../views/preview-run/verification.js";
import {fixturePresentation,RunPresentationSchema,type RunPresentation} from "./presentation.js";
const render=(data:RunPresentation)=>renderToStaticMarkup(createElement(Verification,{data}));
const complete=fixturePresentation("complete");
const ready=render(complete);
assert.equal((ready.match(/class="trial-cell fail"/g)??[]).length,3);
assert(ready.includes("10,408")&&ready.includes("441"));
assert.equal((ready.match(/Fixture pass/g)??[]).length,4);
assert(ready.includes("removed-word")&&ready.includes("added-word"));
assert.equal((ready.match(/class="empty-description"/g)??[]).length,2);
assert(!ready.includes('class="removed-word">No parameter description'));
const running=render(fixturePresentation("running"));
assert(running.includes('class="verdict-panel awaiting"'));
assert(running.includes("Waiting for all trials"));
assert(!running.includes("10,408")&&!running.includes("441"));
assert(!running.includes("Fixture pass"));
assert.equal((running.match(/confirm-gate awaiting/g)??[]).length,4);
console.log("PASS recorded fixtures: complete24/3fail, both diff sides; running hides future payload/verdict/confirmation");
for(const verdict of ["improved","inconclusive","regressed"] as const){
 const data=structuredClone(complete);data.verdict=verdict;
 const html=render(RunPresentationSchema.parse(data));
 assert(html.includes(`class="verdict-panel ${verdict}"`));
 assert(html.includes(verdict.charAt(0).toUpperCase()+verdict.slice(1)));
}
const failedGate=structuredClone(complete);failedGate.confirm[2].passed=false;
const gateHtml=render(failedGate);
assert(gateHtml.includes('class="confirm-gate failed"'));
assert.equal((gateHtml.match(/Fixture pass/g)??[]).length,3);
assert.equal((gateHtml.match(/Fixture fail/g)??[]).length,1);
const absentRepresentative=structuredClone(complete);
const payload=absentRepresentative.tasks.find(task=>task.id==="t3-payload")!;
payload.representative={baseline_trial:null,candidate_trial:null};
assert.equal((render(absentRepresentative).match(/No representative call was recorded/g)??[]).length,2);
console.log("PASS in-memory edge cases: all3verdicts; failed confirmation stays failed; missing representative stays unavailable");
const pending=renderToStaticMarkup(createElement(PreviewState));
assert(pending.includes('aria-live="polite"')&&pending.includes("Loading verification preview"));
const error=renderToStaticMarkup(createElement(PreviewState,{error:"Fixture request failed"}));
assert(error.includes('role="alert"')&&error.includes("Fixture request failed")&&error.includes("retry"));
console.log("PASS pending/error renderer: accessible loading and retry guidance");
