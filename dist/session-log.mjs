// Observable practice activity. No grading, inferred intent, or keystroke recording.
const iso=()=>new Date().toISOString();
const clone=value=>structuredClone(value);
export function createSession(problem,mode,model,at=iso()){
 const session={format:'newcode-session',schemaVersion:1,id:globalThis.crypto.randomUUID(),startedAt:at,updatedAt:at,endedAt:null,problem:clone(problem),initialMode:mode,model:{id:model,runtime:'WebLLM 0.2.79',location:'browser'},events:[],snapshots:[],final:{files:{},language:'javascript',notes:''}};
 recordEvent(session,'session.started',{mode},at);return session;
}
export function recordEvent(session,type,data={},at=iso()){
 const event={...clone(data),id:`e${session.events.length+1}`,type,at};session.events.push(event);session.updatedAt=at;return event;
}
export function snapshot(session,files,language,at=iso()){
 const ordered=Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)));
 const signature=JSON.stringify({language,files:ordered});
 const previous=session.snapshots.find(s=>JSON.stringify({language:s.language,files:s.files})===signature);
 if(previous)return previous.id;
 const value={id:`s${session.snapshots.length+1}`,at,language,files:clone(ordered)};session.snapshots.push(value);return value.id;
}
export function updateFinal(session,files,language,notes,at=iso()){
 session.final={files:clone(files),language,notes:notes||''};session.updatedAt=at;
}
export function completeEvent(session,event,patch,at=iso()){
 if(event.status!=='running'&&event.status!=='streaming')return false;
 Object.assign(event,clone(patch),{completedAt:at});session.updatedAt=at;return true;
}
export function interruptPending(session,reason='Workspace left',at=iso()){
 for(const event of session.events){if(event.status==='running'||event.status==='streaming')completeEvent(session,event,{status:'interrupted',error:reason},at);}
}
export function finishSession(session,at=iso()){
 if(session.endedAt)return;
 interruptPending(session,'Session ended before the operation finished.',at);
 snapshot(session,session.final.files,session.final.language,at);
 recordEvent(session,'session.ended',{},at);session.endedAt=at;
}
export function sessionMessages(session){
 return session.events.flatMap(e=>{
  if(e.type==='ai.turn')return [{role:'user',content:e.prompt,at:e.at},{role:'assistant',content:e.response||(e.status==='streaming'?'Thinking locally…':e.error||'No response received.'),at:e.completedAt||e.at,status:e.status}];
  if(e.type==='agent.run')return [{role:'user',content:e.prompt,at:e.at},{role:'assistant',content:e.summary||'Agent run in progress…',at:e.completedAt||e.at,status:e.status}];
  if(e.type==='agent.request')return [{role:'assistant',content:`Step ${e.step}: ${e.response||e.error||'Thinking locally…'}`,at:e.completedAt||e.at,status:e.status}];
  if(e.type==='agent.action')return [{role:'assistant',content:`${e.action?.action||'Invalid action'}${e.action?.file?' · '+e.action.file:''}: ${e.status}${e.error?'\n'+e.error:''}${e.result?'\n'+JSON.stringify(e.result,null,2):''}`,at:e.at,status:e.status}];
  return [];
 });
}
const seconds=(a,b)=>Math.max(0,Math.round((Date.parse(b)-Date.parse(a))/1000));
export function analyzeSession(session,asOf=iso()){
 const turns=session.events.filter(e=>e.type==='ai.turn'||e.type==='agent.request');
 const agentRuns=session.events.filter(e=>e.type==='agent.run'),actions=session.events.filter(e=>e.type==='agent.action');
 const attempts=session.events.filter(e=>e.type==='test.run');
 const runs=attempts.filter(e=>e.status==='completed'&&Array.isArray(e.results));
 const passing=runs.filter(e=>e.results.length>0&&e.results.every(r=>r.passed===true));
 const latest=runs.at(-1),lastReply=turns.filter(e=>e.status==='completed').at(-1);
 // Sequence IDs, rather than timestamps alone, distinguish operations within one millisecond.
 const replyIndex=lastReply?session.events.indexOf(lastReply):-1;
 const testedAfterLastReply=lastReply?runs.some(e=>session.events.indexOf(e)>replyIndex&&Date.parse(e.at)>=Date.parse(lastReply.completedAt)):null;
 const byLanguage=Object.fromEntries([...new Set(runs.map(e=>e.language))].map(language=>{
  const group=runs.filter(e=>e.language===language),first=group[0],last=group.at(-1);
  return [language,{runs:group.length,firstPassed:first.results.filter(r=>r.passed).length,firstTotal:first.results.length,lastPassed:last.results.filter(r=>r.passed).length,lastTotal:last.results.length}];
 }));
 const metrics={elapsedWallSeconds:seconds(session.startedAt,session.endedAt||session.updatedAt||asOf),prompts:turns.length,completedReplies:turns.filter(e=>e.status==='completed').length,incompleteReplies:turns.filter(e=>e.status!=='completed').length,testAttempts:attempts.length,completedTestRuns:runs.length,unsuccessfulTestOperations:attempts.filter(e=>e.status==='error'||e.status==='cancelled'||e.status==='interrupted').length,firstPassingRunSeconds:passing.length?seconds(session.startedAt,passing[0].completedAt):null,latestPassed:latest?latest.results.filter(r=>r.passed).length:null,latestTotal:latest?latest.results.length:null,hintsOpened:session.events.filter(e=>e.type==='hint.opened'||e.type==='hint.revealed').length,testedAfterLastReply,byLanguage,agentRuns:agentRuns.length,agentEditsApplied:actions.filter(e=>e.status==='applied').length,agentEditsRejected:actions.filter(e=>e.status==='rejected').length,agentInvalidActions:actions.filter(e=>e.status==='invalid'||e.status==='error').length,modesUsed:[...new Set([session.initialMode,...session.events.filter(e=>e.type==='mode.changed').map(e=>e.mode)])],byMode:Object.fromEntries([...new Set([session.initialMode,...session.events.filter(e=>e.type==='mode.changed').map(e=>e.mode),...attempts.map(e=>e.mode||session.initialMode),...turns.map(e=>e.mode||session.initialMode)])].map(mode=>[mode,{testAttempts:attempts.filter(e=>(e.mode||session.initialMode)===mode).length,aiRequests:turns.filter(e=>(e.mode||session.initialMode)===mode).length}]))};
 const observations=[];
 if(!runs.length)observations.push('No completed test run was recorded. Run a baseline, then test the next small change.');
 if(latest&&latest.results.some(r=>!r.passed))observations.push(`The latest completed run still has ${latest.results.filter(r=>!r.passed).length} failing check(s). Pick one failure and explain the cause before asking for another fix.`);
 if(testedAfterLastReply===false)observations.push('No completed test run started after the last completed AI reply. Review any suggestion you used and test the resulting code. This does not establish whether you applied the suggestion.');
 if(turns.length&&runs.length&&Date.parse(runs[0].at)>Date.parse(turns[0].at))observations.push('The first AI request came before the first completed test attempt. Consider recording a baseline so you can compare the effect of later changes.');
 if(metrics.incompleteReplies)observations.push(`${metrics.incompleteReplies} reply/replies were incomplete or failed. Treat these as tool events, not evidence of coding ability.`);
 if(!session.final.notes.trim())observations.push('Add review notes explaining the approach, one rejected or corrected suggestion, and an edge case you checked.');
 if(passing.length)observations.push('At least one run passed the supplied checks. Explain why the approach works beyond those fixtures and discuss its time and space costs.');
 if(!observations.length)observations.push('Compare your code checkpoints and explain which change mattered most and why.');
 return {metrics,observations,limitations:['Elapsed time spans session start to session end or the last saved activity, includes idle time, and is not active coding time.','Prompt counts and hints measure activity, not quality or independence. Browser modes guide self-evaluation; they cannot verify use of outside tools.', 'Agent completion summaries are model claims. Use action events and test.run results to verify edits and tests.','Passing fixtures is not proof of correctness or complexity.','Code checkpoints are captured at session start, AI requests, test runs, and session end/export; edits between checkpoints are not recorded.','A test after a reply does not prove that advice was used or caused a change. No score or causal attribution is inferred.']};
}
