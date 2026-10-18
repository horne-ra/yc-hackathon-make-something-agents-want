// Read-only deployment confirmation; returns only deployment metadata, never env values.
import {execFileSync} from 'node:child_process';
import {writeFile,mkdir} from 'node:fs/promises';
const expected=process.argv[2]??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const label=process.argv[3]??'deployment';if(!/^[a-z-]+$/.test(label))throw Error('Invalid record label');
const server='1df33784-bc1a-4b0a-a539-22c8ed18ab05';
const headers={'x-api-key':process.env.MCP_USE_API_KEY,'x-profile-id':'91542208-1224-4c86-a16f-99ed481abf09'};
await mkdir('docs/evidence/wrapup',{recursive:true});
const polls=[];const deadline=Date.now()+12*60_000;let last='';
while(Date.now()<deadline){
 const response=await fetch(`https://cloud.manufact.com/api/v1/servers/${server}`,{headers});
 if(!response.ok)throw Error(`Deployment metadata read failed: HTTP ${response.status}`);
 const data=await response.json();
 const deployment=data.deployments.find(d=>d.gitCommitSha===expected);
 const record={at:new Date().toISOString(),expected_commit:expected,server_status:data.status,active_deployment_id:data.activeDeploymentId,deployment:deployment?{id:deployment.id,status:deployment.status,gitCommitSha:deployment.gitCommitSha,gitBranch:deployment.gitBranch,buildStartedAt:deployment.buildStartedAt,buildCompletedAt:deployment.buildCompletedAt}:null};
 polls.push(record);await writeFile(`docs/evidence/wrapup/${label}-polls.json`,JSON.stringify(polls,null,2)+'\n');
 const state=JSON.stringify({status:deployment?.status??'awaiting webhook',active:deployment?.id===data.activeDeploymentId});
 if(state!==last){console.log(state);last=state;}
 if(deployment?.status==='running'&&deployment.id===data.activeDeploymentId){await writeFile(`docs/evidence/wrapup/${label}.json`,JSON.stringify(record,null,2)+'\n');console.log(`PASS Manufact running source ${expected} at ${deployment.id}`);process.exit(0);}
 if(deployment&&['failed','error','canceled'].includes(deployment.status))throw Error(`Deployment ${deployment.id} ${deployment.status}`);
 await new Promise(resolve=>setTimeout(resolve,10000));
}
throw Error('Deployment confirmation timed out; inspect retained polls and build logs.');
