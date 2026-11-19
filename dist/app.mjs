import {games,categories,accepts} from './arcade/logic.mjs';
import {languages,getLanguage,getProvider,languageHelp} from './arcade/languages.mjs';
import {draftFor,saveDraft,passedLanguage,migrateProgress} from './arcade/coding-state.mjs';
import {createCodeEditor} from './arcade/vendor/editor.mjs';
import {runJavaScript,runRemote,REMOTE_TIMEOUT} from './arcade/execution.mjs';
import {labs} from './labs.mjs';
import {read,write,validateBackup,PROGRESS_KEY,LAB_KEY} from './storage.mjs';
import * as ai from './ai.mjs';
import {modes,normalizeMode,capabilitiesFor} from './practice-modes.mjs';
import {getHints} from './practice-hints.mjs';
import {runAgent} from './practice-agent.mjs';
import {createSession,recordEvent,snapshot,updateFinal,completeEvent,finishSession,sessionMessages} from './session-log.mjs';
import {saveSession,listSessions,getSession} from './session-store.mjs';
import {sessionZip,buildSessionJSON} from './session-export.mjs';
const $=s=>document.querySelector(s), main=$('#main');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let progress=migrateProgress(read(PROGRESS_KEY)),labState=read(LAB_KEY),editor=null,active=null,current=null,language='javascript',file=null,ticker=null,chatBusy=false,chatEpoch=0;
let filters={search:'',topic:'All topics',difficulty:'All levels',status:'All problems'};
let agentController=null,agentRun=null,hintsRevealed=0;
let noticeTimer,session=null,activeTurn=null,sessionSaveTimer=null,storageWarning=false;
function notice(text){$('#notice').textContent=text;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#notice').textContent='',5000);}
function save(){const a=write(PROGRESS_KEY,progress),b=write(LAB_KEY,labState);if(!a||!b)notice('Browser storage is full or unavailable. Export a backup to keep your work.');}
function state(){return labState[current.id]??=( {files:{},mode:'chat',messages:[]} );}
function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function cleanup(){
 stopAgent('Left the workspace.');cancelTurn('Left the workspace.');
 if(session){captureFinal();finishSession(session);persistSession(session);session=null;}
 clearTimeout(sessionSaveTimer);ai.unload();active?.abort();active=null;editor?.destroy();editor=null;clearInterval(ticker);ticker=null;chatEpoch++;chatBusy=false;
}
function workFiles(){return current.isLab?{...current.files,...state().files}:{[getLanguage(language).filename]:editor?.getValue()??draftFor(progress[current.id],current,language)};}
function captureFinal(){if(session&&current)updateFinal(session,workFiles(),current.isLab?'javascript':language,$('#notes')?.value??session.final.notes);}
function persistSession(value=session){if(!value)return;void saveSession(value).then(ok=>{if(!ok&&!storageWarning){storageWarning=true;notice('Session history could not be saved. Download the current session before closing this tab.');}});}
function scheduleSessionSave(){clearTimeout(sessionSaveTimer);sessionSaveTimer=setTimeout(()=>persistSession(),700);}
function logEvent(type,data={}){if(session){recordEvent(session,type,data);persistSession();}}
function cancelTurn(reason){if(activeTurn){const {owner,event}=activeTurn;completeEvent(owner,event,{status:'cancelled',error:reason});persistSession(owner);activeTurn=null;}}
function downloadSessionJSON(value){try{const {filename,session:document}=buildSessionJSON(value);download(filename,document);}catch(error){notice('Could not create the JSON log: '+error.message);}}
function downloadBundle(value){
 try{const {filename,bytes}=sessionZip(value);const url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 catch(error){notice('Could not create the session bundle: '+error.message);}
}

function title(g){return g.problem||g.title;}
const badge=g=>`<span class="badge ${g.difficulty?.toLowerCase()||'easy'}">${g.difficulty||'Easy'}</span>`;
function expectedValue(g,test){if(g.id!=='two-sum')return test.expected;const seen=new Map(),[nums,target]=test.args;for(let i=0;i<nums.length;i++){if(seen.has(target-nums[i]))return [seen.get(target-nums[i]),i];seen.set(nums[i],i);}}
const solvedCount=()=>games.filter(g=>progress[g.id]?.solved).length;
function footer(){return `<footer><span><strong>newcode</strong> &nbsp; A little practice, every day.</span><span>Independent learning project · Progress stays on this browser</span></footer>`;}
function library(){
 const solved=solvedCount();
 main.className='page';main.innerHTML=`<section class="page-heading"><div><div class="eyebrow">YOUR DAILY PRACTICE SPACE</div><h1>Get a little better.<br><span>One problem at a time.</span></h1><p>Build the intuition. Write the code. Learn to trust your reasoning.</p></div><div class="progress-orbit" style="--percent:${solved/75*100}%"><div><strong>${solved}<small>/ 75</small></strong><span>patterns practiced</span></div></div></section>
 <section class="track-grid" aria-label="Practice tracks"><a class="track featured" href="#interviews"><span class="track-icon">⌘</span><div class="eyebrow">THE INTERVIEW LAB</div><h2>You lead. AI assists.</h2><p>Work through a real codebase with a small AI partner. Catch the bugs. Defend your decisions.</p><div class="track-meta"><span>3 multi-file challenges</span><span>45–60 min</span><strong>Open lab</strong></div></a><a class="track" href="arcade/"><span class="track-icon">▦</span><div class="eyebrow">A DIFFERENT WAY TO LEARN</div><h2>Play the pattern.</h2><p>Make an algorithm click with hands-on visual games. Then turn your moves into working code.</p><div class="track-meta"><span>75 visual lessons</span><strong>Explore games</strong></div></a></section>
 <section class="library"><div class="section-title"><div><h2>The problem library <span class="count">75</span></h2><p>The Blind 75 collection. Seven languages. Your pace.</p></div><a class="text-link" href="#practice/${games.find(g=>!progress[g.id]?.solved)?.id||'two-sum'}">Continue practicing</a></div><div class="filters"><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Search problems or patterns…" aria-label="Search problems" value="${esc(filters.search)}"></label><label class="sr-only" for="topic">Topic</label><select id="topic">${['All topics',...categories.map(c=>c[0])].map(x=>`<option ${x===filters.topic?'selected':''}>${x}</option>`).join('')}</select><label class="sr-only" for="difficulty">Difficulty</label><select id="difficulty">${['All levels','Easy','Medium','Hard'].map(x=>`<option ${x===filters.difficulty?'selected':''}>${x}</option>`).join('')}</select><label class="sr-only" for="status">Progress filter</label><select id="status">${['All problems','Unsolved','Solved','Bookmarked'].map(x=>`<option ${x===filters.status?'selected':''}>${x}</option>`).join('')}</select></div><div id="problem-list"></div></section>${footer()}`;
 for(const id of ['search','topic','difficulty','status'])$('#'+id).addEventListener(id==='search'?'input':'change',e=>{filters[id]=e.target.value;problemList();});problemList();
}
function problemList(){
 const list=games.filter(g=>(title(g)+' '+g.category+' '+g.tag+' '+g.number).toLowerCase().includes(filters.search.toLowerCase())&&(filters.topic==='All topics'||g.category===filters.topic||g.alsoCategories?.includes(filters.topic))&&(filters.difficulty==='All levels'||(g.difficulty||'Easy')===filters.difficulty)&&(filters.status==='All problems'||filters.status==='Solved'&&progress[g.id]?.solved||filters.status==='Unsolved'&&!progress[g.id]?.solved||filters.status==='Bookmarked'&&progress[g.id]?.bookmark));
 $('#problem-list').innerHTML=`<div class="list-meta" role="status">${list.length} problems <span>✓ Solved problems stay with you</span></div><div class="table-wrap"><table><thead><tr><th class="status-col"><span class="sr-only">Status</span></th><th>Problem</th><th>Pattern</th><th>Difficulty</th><th><span class="sr-only">Bookmark</span></th></tr></thead><tbody>${list.map(g=>`<tr><td><span class="solve-dot ${progress[g.id]?.solved?'done':''}" aria-label="${progress[g.id]?.solved?'Solved':'Not solved'}">${progress[g.id]?.solved?'✓':''}</span></td><td><a href="#practice/${g.id}"><span class="problem-number">${g.number}.</span> ${esc(title(g))}</a></td><td><span class="topic-tag">${g.category}</span></td><td>${badge(g)}</td><td><button class="bookmark ${progress[g.id]?.bookmark?'saved':''}" data-bookmark="${g.id}" aria-label="Bookmark ${esc(title(g))}" aria-pressed="${!!progress[g.id]?.bookmark}">${progress[g.id]?.bookmark?'★':'☆'}</button></td></tr>`).join('')}</tbody></table>${!list.length?'<div class="empty"><h3>No problems match these filters.</h3><button id="clear-filters">Clear filters</button></div>':''}</div>`;
 document.querySelectorAll('[data-bookmark]').forEach(b=>b.onclick=()=>{const id=b.dataset.bookmark;progress[id]={...progress[id],bookmark:!progress[id]?.bookmark};save();problemList();});if($('#clear-filters'))$('#clear-filters').onclick=()=>{filters={search:'',topic:'All topics',difficulty:'All levels',status:'All problems'};library();};
}
function interviews(){main.className='page';main.innerHTML=`<section class="page-heading"><div><div class="eyebrow">THE INTERVIEW LAB</div><h1>A small model.<br><span>A bigger role for you.</span></h1><p>Scope the request. Review the suggestion. Own the result.</p></div><div class="lab-illustration" aria-hidden="true">{ <span>you</span> + ai }</div></section><div class="info-strip"><span>▤ &nbsp; Real multi-file exercises</span><span>◷ &nbsp; 45–60 minute sessions</span><span>⌘ &nbsp; Optional local AI</span></div><div class="lab-grid">${labs.map((g,i)=>`<a href="#lab/${g.id}" class="lab-card"><div class="card-top"><span class="eyebrow">${g.category.toUpperCase()}</span>${badge(g)}</div><div class="lab-glyph" aria-hidden="true">${['{ ttl }','[ cursor ]','Σ events'][i]}</div><h2>${g.title}</h2><p>${g.description}</p><div class="track-meta"><span>${g.time} min · ${Object.keys(g.files).length} files</span><strong>${labState[g.id]?.solved?'Review completed lab':'Start challenge'}</strong></div></a>`).join('')}</div><section class="method"><div><div class="eyebrow">PRACTICE THE WHOLE INTERVIEW</div><h2>The code is only half the work.</h2></div><ol><li><strong>Understand the workspace.</strong> Read the files and find the boundary of the problem.</li><li><strong>Use AI with intention.</strong> Ask for a small, testable change. Choose curated hints, read-only chat, or an agent whose proposed edits you review.</li><li><strong>Review and explain.</strong> Run the tests, consider edge cases, and write down your trade-offs.</li></ol></section>${footer()}`;}
function assistantPanel(){return `<aside class="assistant panel" aria-label="Coding partner">
 <div class="panel-heading"><span>✳ &nbsp; Coding partner</span><span class="model-label">LOCAL AI</span></div>
 <div class="assistant-body">
  <div class="practice-mode"><label for="mode">Mode</label><select id="mode">${modes.map(m=>`<option value="${m.id}">${esc(m.label)}</option>`).join('')}</select></div>
  <p id="mode-description" class="small"></p>
  <div id="ai-content">
   <section class="model-box" id="model-box" data-state="idle" aria-label="Local model">
    <div class="model-ready" id="model-ready" hidden><span><strong role="status">✓ Model ready</strong><small>Qwen 2.5 Coder · 1.5B</small></span><button id="unload-ai" class="quiet-button">Unload</button></div>
    <div class="model-setup">
     <strong>Qwen 2.5 Coder · 1.5B</strong>
     <p>Optional local AI. First use downloads about 1 GB; allow 2 GB of GPU memory. Review its suggestions before using them.</p>
     <div class="model-actions"><button id="load-ai">Load local model</button><button id="stop-ai" hidden>Cancel load</button></div>
     <p id="ai-status" role="status">WebGPU browser required. No API key.</p>
    </div>
   </section>
   <div class="conversation-frame">
    <div id="messages" class="messages" role="log" aria-label="Conversation history" aria-live="polite" aria-relevant="additions text" tabindex="0"></div>
    <button id="latest-message" hidden>Jump to latest</button>
   </div>
   <section id="agent-proposal" hidden aria-label="Review proposed edit"></section>
   <div id="agent-controls" hidden><p id="agent-status" role="status">Agent actions are limited to these exercise files and tests. Every edit needs your approval.</p><button id="stop-agent" hidden>Stop agent</button></div>
   <form id="chat-form">
    <label id="prompt-label" for="chat-prompt">Ask a focused question</label>
    <textarea id="chat-prompt" maxlength="1000" placeholder="What edge case am I missing?" required></textarea>
    <div class="composer-actions"><label class="checkbox" title="Include up to 3,000 characters of the selected file"><input id="include-code" type="checkbox" checked> Include current file</label><button class="primary" id="send" disabled>Send</button></div>
   </form>
  </div>
  <div id="solo-content" hidden><h2>Just you and the problem.</h2><p>Solve and run tests independently. Switch modes to reveal hints or use AI; every switch is recorded.</p></div>
  <div id="hints-content" hidden><h2>One nudge at a time.</h2><p>Curated hints help you reason through the problem without a model download.</p><ol id="progressive-hints"></ol><button id="next-hint">Reveal next hint</button></div>
  <details class="session-download"><summary>Download conversation</summary><div class="session-download-content"><div class="export-actions"><button id="download-conversation-json">Download JSON</button><button id="download-conversation">Review bundle</button></div><p class="small">JSON for analysis, or a ZIP with a report and code. Includes your prompts and code. Each visit starts a new session; saved logs are in <a href="#progress">My progress</a>.</p></div></details>
 </div>
 </aside>`;}
function workspace(g,isLab){
 current={...g,isLab};const s=isLab?state():null;if(isLab){s.files||={};s.messages||=[];file=Object.keys(g.files)[0];}else file=null;
 main.className='workspace';
 main.innerHTML=`<div class="workspace-heading"><a href="${isLab?'#interviews':'#'}" class="text-link">${isLab?'Interview lab':'Problem library'}</a><span>/</span><strong>${esc(title(g))}</strong><div class="session-controls">${isLab?'<span id="timer" class="timer"></span><button id="timer-toggle">Start timer</button>':'<span class="browser-runtime">Drafts autosave</span>'}</div></div><div class="work-grid"><section class="brief panel"><div class="panel-heading"><span>▤ &nbsp; Description</span>${badge(g)}</div><div class="brief-body" role="region" aria-label="Problem statement" tabindex="0"><div class="eyebrow">${isLab?g.tag:g.category+' / #'+g.number}</div><h1>${esc(title(g))}</h1><p>${esc(g.prompt)}</p>${isLab?`<h3>Acceptance checks</h3><ol class="checks">${g.cases.map(x=>`<li>${x}</li>`).join('')}</ol>`:`<h3>Example</h3><div class="example"><span>INPUT</span><pre>${esc(g.tests[0].args.map(x=>JSON.stringify(x)).join(', '))}</pre><span>OUTPUT</span><pre>${esc(JSON.stringify(expectedValue(g,g.tests[0])))}</pre></div><div id="contract"></div>`}<p id="hint-location" class="small">Use Hints-only mode for progressive hints.</p>${!isLab?`<a class="visual-link" href="arcade/#play/${g.id}">▦ Learn this pattern visually</a><label for="notes">Your review notes</label><textarea id="notes" placeholder="What did you change, verify, or learn?"></textarea>`:`<h3>Defend your decisions</h3><ul class="checks">${g.review.map(x=>`<li>${x}</li>`).join('')}</ul><label for="notes">Your review notes</label><textarea id="notes" placeholder="Explain your approach and trade-offs…">${esc(s.notes||'')}</textarea>`}</div></section><section class="editor-column panel"><div class="panel-heading"><span>⌘ &nbsp; Workspace</span>${isLab?'<span class="muted">JavaScript</span>':`<label class="sr-only" for="language">Language</label><select id="language">${languages.map(l=>`<option value="${l.id}" ${l.id===language?'selected':''}>${l.label}</option>`).join('')}</select>`}</div><div class="file-tabs" id="file-tabs"></div><div id="editor"></div><div class="editor-tools"><span id="editor-help">Tab to indent · Esc then Tab to leave · ⌘/Ctrl Enter to run</span><button id="reset" class="quiet-button">Reset file</button></div><div class="run-bar"><span id="runtime"></span><button id="cancel" hidden>Cancel</button><button id="run" class="primary">Run tests</button></div><section class="test-panel"><div class="panel-heading">Test results <span class="muted">${isLab?g.cases.length:g.tests.length} checks</span></div><div id="results" role="status" aria-live="polite"><div class="results-empty"><span>⌁</span><h3>Make a change. See what happens.</h3><p>Your test results will appear here.</p></div></div></section></section>${assistantPanel()}</div>`;
 renderEditor();$('#run').onclick=run;$('#cancel').onclick=()=>active?.abort();$('#reset').onclick=resetFile;
 if(isLab){$('#notes').oninput=e=>{s.notes=e.target.value;captureFinal();save();scheduleSessionSave();};$('#timer-toggle').onclick=toggleTimer;updateTimer();ticker=setInterval(updateTimer,1000);}else $('#language').onchange=e=>{if(agentController)return;active?.abort();language=e.target.value;renderEditor();captureFinal();logEvent('language.changed',{language});renderHints();updateAgentDescription();};
 session=createSession({id:g.id,title:title(g),prompt:g.prompt,track:isLab?'interview-lab':'algorithm',difficulty:g.difficulty||'Easy',checks:isLab?g.cases:g.tests,previouslySolved:isLab?!!s.solved:!!progress[g.id]?.solved},normalizeMode(s?.mode||progress[g.id]?.mode),ai.MODEL);
 captureFinal();snapshot(session,session.final.files,session.final.language);persistSession();
 if(!isLab)$('#notes').oninput=()=>{captureFinal();scheduleSessionSave();};
 const prepareExport=()=>{captureFinal();snapshot(session,session.final.files,session.final.language);persistSession();};
 const exportCurrent=()=>{prepareExport();downloadBundle(session);};
 $('#download-conversation').onclick=exportCurrent;
 const exportJSON=()=>{prepareExport();downloadSessionJSON(session);};$('#download-conversation-json').onclick=exportJSON;
 hintsRevealed=0;setupChat(normalizeMode(s?.mode||progress[g.id]?.mode));

}
function renderEditor(){
 editor?.destroy();const g=current;
 if(g.isLab){$('#file-tabs').innerHTML=Object.keys(g.files).map(name=>`<button data-file="${name}" class="${name===file?'active':''}">${name}</button>`).join('');document.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>{if(active||agentController)return;file=b.dataset.file;renderEditor();});}
 else{$('#file-tabs').innerHTML=`<span class="active">${getLanguage(language).filename}</span>`;$('#contract').innerHTML=`<h3>Function contract</h3><p class="small">${esc(languageHelp(g,language).contract)}</p>`;}
 const value=g.isLab?(state().files[file]??g.files[file]):draftFor(progress[g.id],g,language);
 editor=createCodeEditor({parent:$('#editor'),value,language:g.isLab?'javascript':language,label:g.isLab?file:getLanguage(language).label+' solution',onChange:value=>{if(g.isLab)state().files[file]=value;else progress[g.id]=saveDraft(progress[g.id],language,value);captureFinal();save();scheduleSessionSave();},onRun:run});
 $('#runtime').textContent=g.isLab||language==='javascript'?'Runs in your browser':`Run sends code to ${getProvider(language).name}`;
}
function resetFile(){if(active||agentController)return;const b=$('#reset');if(b.dataset.confirm!=='yes'){b.dataset.confirm='yes';b.textContent='Confirm reset';setTimeout(()=>{if(b.isConnected){b.dataset.confirm='';b.textContent='Reset file';}},4000);return;}if(current.isLab)delete state().files[file];else{progress[current.id]??={};delete progress[current.id].drafts?.[language];}save();renderEditor();captureFinal();logEvent('file.reset',{selectedFile:file||getLanguage(language).filename,language:current.isLab?'javascript':language});b.dataset.confirm='';b.textContent='Reset file';}
function setRunning(value){const locked=value||!!agentController;$('#run').disabled=locked;$('#run').textContent=value?'Running…':'Run tests';$('#cancel').hidden=!value;$('#reset').disabled=locked;$('#language')?.toggleAttribute('disabled',locked);editor.setReadOnly(locked);}
function runLab(g,signal){return new Promise((resolve,reject)=>{const worker=new Worker(new URL('./lab-runner.mjs',import.meta.url),{type:'module'});const timer=setTimeout(()=>finish({error:'Stopped after 4 seconds. Check for an infinite loop or repeated work.'}),4000);const cleanup=()=>{worker.terminate();clearTimeout(timer);signal.removeEventListener('abort',abort);};const finish=data=>{cleanup();resolve(data);};const abort=()=>{cleanup();reject(new DOMException('Run cancelled. Your draft is saved.','AbortError'));};signal.addEventListener('abort',abort,{once:true});worker.onmessage=e=>finish(e.data);worker.onerror=e=>{e.preventDefault();finish({error:e.message});};worker.postMessage({id:g.id,files:{...g.files,...state().files}});});}
async function run(options={}){
 const fromAgent=options.source==='agent';if(active||agentController&&!fromAgent)return;
 if(options.signal?.aborted)throw new DOMException('Run cancelled.','AbortError');const g=current,controller=new AbortController();active=controller;setRunning(true);const target=$('#results');target.textContent='Checking your code…';const lang=language;
 const abort=()=>controller.abort();options.signal?.addEventListener('abort',abort,{once:true});
 const owner=session;captureFinal();const event=recordEvent(owner,'test.run',{status:'running',source:fromAgent?'agent':'user',mode:$('#mode').value,selectedFile:file||getLanguage(lang).filename,language:g.isLab?'javascript':lang,provider:g.isLab||lang==='javascript'?'browser':getProvider(lang).name,snapshotId:snapshot(owner,workFiles(),g.isLab?'javascript':lang)});persistSession(owner);
 const timer=setTimeout(()=>controller.abort(),REMOTE_TIMEOUT);
 try {
  const data=await(g.isLab?runLab(g,controller.signal):lang==='javascript'?runJavaScript(g,editor.getValue(),controller.signal):runRemote(g,lang,editor.getValue(),controller.signal));
  if(active!==controller)return;if(data.error)throw new Error(data.error);
  if(!Array.isArray(data.results)||data.results.length!==(g.isLab?g.cases.length:g.tests.length))throw new Error('The runner returned incomplete results. Please retry.');
  const results=data.results.map((r,i)=>g.isLab?r:{name:`Test ${i+1}`,passed:!r.error&&accepts(g,g.tests[i],r.value),error:r.error||`Input: ${JSON.stringify(g.tests[i].args)}\nExpected: ${JSON.stringify(expectedValue(g,g.tests[i]))}\nReceived: ${JSON.stringify(r.value)}`});
  completeEvent(owner,event,{status:'completed',results:results.map(r=>({name:r.name,passed:r.passed,...(!r.passed?{error:r.error}: {})})),diagnostics:data.diagnostics||''});persistSession(owner);
  const passed=results.filter(r=>r.passed).length;
  target.innerHTML=`<div class="result-summary ${passed===results.length?'success':''}">${passed===results.length?'✓ All checks passed':`${passed} of ${results.length} checks passed`}<p>Practice fixtures check behavior, not a proof of correctness or complexity.</p></div>${results.map(r=>`<details class="result-row ${r.passed?'passed':'failed'}"><summary>${r.passed?'✓':'×'} ${esc(r.name)}</summary><pre>${r.passed?'Passed this check.':esc(r.error)}</pre></details>`).join('')}${data.diagnostics?`<details class="result-row"><summary>Compiler notes</summary><pre>${esc(data.diagnostics)}</pre></details>`:''}`;
  if(passed===results.length){if(g.isLab)state().solved=true;else progress[g.id]=passedLanguage(progress[g.id],lang);}if(g.isLab)state().lastRun={at:new Date().toISOString(),passed,total:results.length};save();return {status:'completed',results:event.results,diagnostics:event.diagnostics};
 }catch(error){completeEvent(owner,event,{status:error.name==='AbortError'?'cancelled':'error',error:error.message});persistSession(owner);if(active===controller)target.textContent=error.message;return {status:event.status,error:event.error};}finally{options.signal?.removeEventListener('abort',abort);clearTimeout(timer);if(active===controller){active=null;setRunning(false);}}
}
function updateTimer(){const s=state();const remaining=s.deadline?Math.max(0,Math.ceil((s.deadline-Date.now())/1000)):(s.remaining??current.time*60);$('#timer').textContent=`${Math.floor(remaining/60).toString().padStart(2,'0')}:${(remaining%60).toString().padStart(2,'0')}`;$('#timer-toggle').textContent=s.deadline?'Pause timer':remaining===0?'Restart timer':'Start timer';if(s.deadline&&remaining===0){s.deadline=null;s.remaining=0;save();notice('Time is up. You can finish your work and review your decisions.');}}
function toggleTimer(){const s=state();if(s.deadline){s.remaining=Math.max(0,Math.ceil((s.deadline-Date.now())/1000));s.deadline=null;}else{s.deadline=Date.now()+((s.remaining||current.time*60)*1000);}save();logEvent('timer.changed',{action:s.deadline?'started':'paused',remainingSeconds:s.deadline?Math.ceil((s.deadline-Date.now())/1000):s.remaining});updateTimer();}
function messages(){return session?sessionMessages(session):[];}
function updateLatestButton(){const root=$('#messages');if(root)$('#latest-message').hidden=root.scrollHeight-root.clientHeight-root.scrollTop<48;}
function renderMessages({follow=false}={}){
 const root=$('#messages');if(!root)return;
 const stickToBottom=follow||root.scrollHeight-root.clientHeight-root.scrollTop<48;
 const position=root.scrollTop,history=messages();
 if(!history.length){root.innerHTML='<p class="chat-empty">Ask a focused question to start. Your conversation stays here as it grows.</p>';$('#latest-message').hidden=true;return;}
 root.querySelector('.chat-empty')?.remove();
 history.forEach((m,index)=>{
  let row=root.children[index];
  if(!row){row=document.createElement('article');row.className='message '+m.role;row.append(document.createElement('strong'),document.createElement('pre'),document.createElement('small'));root.append(row);}
  row.children[0].textContent=m.role==='user'?'You':'Coding partner';
  if(row.children[1].textContent!==m.content)row.children[1].textContent=m.content;
  row.children[2].hidden=m.role!=='assistant'||m.status==='completed';row.children[2].textContent=m.status||'';
 });
 while(root.children.length>history.length)root.lastElementChild.remove();
 root.scrollTop=stickToBottom?root.scrollHeight:position;updateLatestButton();
}
function setModelUI(state,text){
 $('#model-box').dataset.state=state;$('#model-ready').hidden=state!=='ready';
 $('#load-ai').disabled=state==='loading';$('#load-ai').textContent=state==='loading'?'Loading…':'Load local model';
 $('#stop-ai').hidden=state!=='loading';$('#send').disabled=state!=='ready'||chatBusy;
 $('#ai-status').textContent=text;updateLatestButton();
}
function setupChat(mode){
 $('#mode').value=mode;
 const unloadModel=reason=>{stopAgent(reason);cancelTurn(reason);ai.unload();chatEpoch++;chatBusy=false;setModelUI('idle','Model unloaded. Cached files can be reused when you load it again.');renderMessages();};
 const setMode=()=>{const mode=normalizeMode($('#mode').value),caps=capabilitiesFor(mode);
  $('#mode-description').textContent=modes.find(m=>m.id===mode).description;
  $('#ai-content').hidden=!caps.aiChat&&!caps.agent;$('#solo-content').hidden=mode!=='solo';$('#hints-content').hidden=mode!=='hints';
  $('#agent-controls').hidden=!caps.agent;updateAgentDescription();$('#include-code').closest('label').hidden=caps.agent;
  $('#prompt-label').textContent=caps.agent?'Give the agent a focused task':'Ask a focused question';$('#send').textContent=caps.agent?'Start agent':'Send';
  $('#chat-prompt').placeholder=caps.agent?'Read the files, fix one failing check, then run tests.':'What edge case am I missing?';
  $('.visual-link')?.toggleAttribute('hidden',mode==='solo');$('#hint-location').hidden=mode==='solo';
  if(current.isLab)state().mode=mode;else{progress[current.id]??={};progress[current.id].mode=mode;}save();renderHints();
  if(!caps.aiChat&&!caps.agent)unloadModel('Switched to '+mode+' mode.');
 };
 $('#mode').onchange=()=>{stopAgent('Practice mode changed.');cancelTurn('Practice mode changed.');ai.unload();chatEpoch++;chatBusy=false;setModelUI('idle','Load the model to use this mode.');logEvent('mode.changed',{mode:$('#mode').value});setMode();renderMessages();};setMode();setModelUI(ai.ready()?'ready':'idle',ai.ready()?'Ready on this device.':'WebGPU browser required. No API key.');renderMessages();
 $('#next-hint').onclick=revealHint;$('#stop-agent').onclick=()=>stopAgent('Stopped by the user.');
 $('#messages').onscroll=updateLatestButton;
 $('#latest-message').onclick=()=>{const root=$('#messages');root.scrollTop=root.scrollHeight;updateLatestButton();root.focus({preventScroll:true});};
 $('#load-ai').onclick=async()=>{const caps=capabilitiesFor($('#mode').value);if(ai.ready()||(!caps.aiChat&&!caps.agent))return;const status=$('#ai-status'),epoch=chatEpoch;setModelUI('loading','Checking GPU and loading model…');
  try{await ai.connect(text=>{if(epoch===chatEpoch&&status.isConnected)status.textContent=text;});if(epoch!==chatEpoch)return;setModelUI('ready','Ready. Inference runs locally on your device.');renderMessages();$('#chat-prompt').focus({preventScroll:true});}
  catch(error){if(epoch===chatEpoch&&status.isConnected)setModelUI('idle',error.message);}
 };
 $('#stop-ai').onclick=()=>unloadModel('Model loading cancelled by the user.');
 $('#unload-ai').onclick=()=>unloadModel('Model unloaded by the user.');
 $('#chat-form').onsubmit=async e=>{
  e.preventDefault();const caps=capabilitiesFor($('#mode').value);if(chatBusy||!ai.ready()||(!caps.aiChat&&!caps.agent))return;
  const prompt=$('#chat-prompt').value.trim();if(!prompt)return;if(caps.agent){if(!active)await startAgent(prompt);return;}
  const epoch=chatEpoch,owner=session;
  const previous=owner.events.filter(e=>e.type==='ai.turn'&&e.status==='completed').flatMap(e=>[{role:'user',content:e.prompt},{role:'assistant',content:e.response}]);
  const includeCode=$('#include-code').checked,selectedFile=file||getLanguage(language).filename,lang=current.isLab?'javascript':language;
  const context=`Problem: ${title(current)}\n${current.prompt}\n${includeCode?`Current file (${selectedFile}):\n${editor.getValue().slice(0,3000)}`:''}`;
  const request=ai.buildMessages(prompt,context,previous);captureFinal();
  const event=recordEvent(owner,'ai.turn',{prompt,request,includeCode,selectedFile,language:lang,mode:$('#mode').value,model:ai.MODEL,generation:{temperature:0.3,max_tokens:600},snapshotId:snapshot(owner,workFiles(),lang),status:'streaming',response:''});
  activeTurn={owner,event};persistSession(owner);chatBusy=true;$('#send').disabled=true;$('#chat-prompt').value='';renderMessages({follow:true});
  let lastSaved=0,finishReason=null;
  try{
   const reply=await ai.ask(prompt,context,previous,text=>{if(event.status!=='streaming')return;event.response=text;if(Date.now()-lastSaved>1000){lastSaved=Date.now();persistSession(owner);}if(epoch===chatEpoch)renderMessages();},request,metadata=>{finishReason=metadata.finishReason;});
   completeEvent(owner,event,{status:finishReason==='length'?'truncated':'completed',response:reply,finishReason});
  }catch(error){completeEvent(owner,event,{status:'error',error:error.message});}
  finally{persistSession(owner);if(activeTurn?.event===event)activeTurn=null;if(epoch===chatEpoch){chatBusy=false;setModelUI(ai.ready()?'ready':'idle',ai.ready()?'Ready on this device.':'Model unloaded. Load it again to continue.');renderMessages();}}
 };

}
function updateAgentDescription(){$('#agent-status').textContent='Up to six model steps. Every edit needs your approval. '+(current.isLab||language==='javascript'?'Tests run in your browser.':`Tests send code to ${getProvider(language).name}.`);}
function renderHints(){
 const hints=getHints(current,current.isLab?'javascript':language);
 $('#progressive-hints').innerHTML=hints.slice(0,hintsRevealed).map(h=>`<li><strong>${esc(h.title)}</strong><p>${esc(h.text)}</p></li>`).join('');
 $('#next-hint').disabled=hintsRevealed>=hints.length;$('#next-hint').textContent=hintsRevealed>=hints.length?'All hints revealed':'Reveal next hint';
}
function revealHint(){
 if(normalizeMode($('#mode').value)!=='hints')return;
 const hint=getHints(current,current.isLab?'javascript':language)[hintsRevealed];if(!hint)return;
 hintsRevealed++;logEvent('hint.revealed',{mode:'hints',hintId:hint.id,level:hintsRevealed,title:hint.title,text:hint.text,language:current.isLab?'javascript':language});renderHints();
}
function stopAgent(reason){
 if(!agentController)return;
 const controller=agentController;controller.abort();active?.abort();
 if(agentRun){completeEvent(agentRun.owner,agentRun.event,{status:'cancelled',summary:reason});for(const e of agentRun.owner.events.filter(e=>e.type==='agent.request'&&e.runId===agentRun.event.id))completeEvent(agentRun.owner,e,{status:'cancelled',error:reason});persistSession(agentRun.owner);}
 agentController=null;agentRun=null;chatBusy=false;ai.unload();
 if($('#agent-proposal')){$('#chat-form').hidden=false;$('#agent-proposal').hidden=true;$('#stop-agent').hidden=true;$('#agent-status').textContent=reason;setRunning(!!active);setModelUI('idle','Agent stopped. Load the model to continue.');renderMessages();}
}
function approveAgentEdit({file:filename,before,after,reason,signal}){
 return new Promise(resolve=>{
  const panel=$('#agent-proposal');
  const done=value=>{signal.removeEventListener('abort',abort);panel.hidden=true;panel.replaceChildren();resolve(value);};
  const abort=()=>done(false);if(signal.aborted){resolve(false);return;}
  panel.innerHTML=`<h3>Review edit: ${esc(filename)}</h3><p>${esc(reason)}</p><details><summary>Current code</summary><pre>${esc(before)}</pre></details><details open><summary>Proposed replacement</summary><pre>${esc(after)}</pre></details><div class="proposal-actions"><button id="accept-edit" class="primary">Accept edit</button><button id="reject-edit">Reject edit</button></div>`;
  panel.hidden=false;$('#agent-status').textContent='Waiting for your review. Accepting replaces this file.';
  $('#accept-edit').onclick=()=>done(true);$('#reject-edit').onclick=()=>done(false);signal.addEventListener('abort',abort,{once:true});
 });
}
async function startAgent(prompt){
 if(agentController||active||!capabilitiesFor($('#mode').value).agent||!ai.ready())return;
 const controller=new AbortController(),owner=session,lang=current.isLab?'javascript':language,g=current,epoch=chatEpoch;
 agentController=controller;chatBusy=true;setRunning(false);$('#chat-form').hidden=true;$('#send').disabled=true;$('#stop-agent').hidden=false;$('#chat-prompt').value='';
 captureFinal();const event=recordEvent(owner,'agent.run',{prompt,mode:'agent',language:lang,model:ai.MODEL,status:'running',snapshotId:snapshot(owner,workFiles(),lang),summary:''});
 agentRun={owner,event};persistSession(owner);renderMessages({follow:true});

 const check=()=>{if(controller.signal.aborted||session!==owner)throw new DOMException('Agent stopped.','AbortError');};
 try{
  const result=await runAgent({prompt,problem:{title:title(g),prompt:g.prompt},language:lang,signal:controller.signal,maxSteps:6,
   readFiles:()=>{check();return workFiles();},
   generate:async(request,options)=>{check();snapshot(owner,workFiles(),lang);$('#agent-status').textContent='Thinking locally…';const pending=owner.events.findLast(e=>e.type==='agent.request'&&e.runId===event.id);let savedAt=0;
    return ai.request(request,text=>{if(pending?.status!=='running')return;pending.response=text;if(Date.now()-savedAt>1000){savedAt=Date.now();persistSession(owner);}if(session===owner&&epoch===chatEpoch)renderMessages();},metadata=>{if(pending)pending.finishReason=metadata.finishReason;},{...options,signal:controller.signal});},
   approveEdit:approveAgentEdit,
   applyEdit:({file:filename,before,after})=>{check();if(workFiles()[filename]!==before)throw new Error('File changed while the edit was being reviewed.');if(g.isLab){state().files[filename]=after;file=filename;}else progress[g.id]=saveDraft(progress[g.id],lang,after);renderEditor();setRunning(false);captureFinal();save();persistSession(owner);},
   runTests:({signal})=>{check();$('#agent-status').textContent='Running exercise tests…';return run({source:'agent',signal});},
   onEvent:(type,data)=>{if(owner.endedAt)return;
    if(type==='agent.request'){const pending=owner.events.find(e=>e.type==='agent.request'&&e.runId===event.id&&e.step===data.step);if(pending)completeEvent(owner,pending,{...data,response:data.response||pending.response||'',status:data.status==='completed'&&pending.finishReason==='length'?'truncated':data.status});}
    else recordEvent(owner,type==='agent.requested'?'agent.request':type,{...data,runId:event.id,mode:'agent',language:lang,model:ai.MODEL,generation:type==='agent.requested'?{temperature:0.3,max_tokens:800}:undefined,snapshotId:snapshot(owner,owner.final.files,lang)});
    persistSession(owner);if(session===owner&&epoch===chatEpoch)renderMessages();}
  });
  completeEvent(owner,event,{status:result.status,summary:result.summary,steps:result.steps});
  if(session===owner&&epoch===chatEpoch)$('#agent-status').textContent=result.summary||`Agent ${result.status}.`;
 }catch(error){completeEvent(owner,event,{status:controller.signal.aborted?'cancelled':'error',summary:error.message,error:error.message});if(session===owner&&epoch===chatEpoch)$('#agent-status').textContent=error.message;}
 finally{persistSession(owner);if(agentController===controller){agentController=null;agentRun=null;chatBusy=false;$('#chat-form').hidden=false;$('#stop-agent').hidden=true;$('#agent-proposal').hidden=true;setRunning(!!active);setModelUI(ai.ready()?'ready':'idle',ai.ready()?'Ready on this device.':'Model unloaded. Load it again to continue.');renderMessages();}}
}

function progressPage(){
 const solved=solvedCount(),completed=labs.filter(g=>labState[g.id]?.solved).length;
 main.className='page';main.innerHTML=`<section class="page-heading"><div><div class="eyebrow">YOUR PRACTICE, YOUR PACE</div><h1>Small wins.<br><span>Lasting progress.</span></h1><p>Saved on this device. Export a backup to take your work with you.</p></div><div class="backup-actions"><button id="export" class="primary">Export progress</button><label class="button" for="import">Import backup</label><input type="file" id="import" accept="application/json,.json" hidden></div></section><div class="stats-grid"><div class="stat"><strong>${solved}<span>/ 75</span></strong><p>Problems solved</p></div><div class="stat"><strong>${completed}<span>/ 3</span></strong><p>Interview labs completed</p></div><div class="stat"><strong>${games.filter(g=>progress[g.id]?.played).length}</strong><p>Visual lessons completed</p></div></div><div class="section-title"><h2>Your pattern map</h2></div><div class="patterns">${categories.map(([name])=>{const gs=games.filter(g=>g.category===name||g.alsoCategories?.includes(name)),n=gs.filter(g=>progress[g.id]?.solved).length;return `<div class="pattern"><div><strong>${name}</strong><span>${n} / ${gs.length}</span></div><progress value="${n}" max="${gs.length}" aria-label="${name} progress"></progress></div>`;}).join('')}</div><div class="section-title"><h2>Pick up where you left off</h2></div><div class="recent">${games.filter(g=>Object.keys(progress[g.id]?.drafts||{}).length).map(g=>`<a href="#practice/${g.id}">${esc(title(g))}<span>${progress[g.id]?.solved?'Solved':'In progress'}</span></a>`).join('')||'<p>No code drafts yet. <a href="#">Find your first problem.</a></p>'}${labs.filter(g=>Object.keys(labState[g.id]?.files||{}).length).map(g=>`<a href="#lab/${g.id}">${g.title}<span>${labState[g.id]?.solved?'Completed':'In progress'}</span></a>`).join('')}</div><p class="small">Import merges drafts by problem; imported drafts replace matching local drafts. Export your current progress first if you want to keep both. Backups include code and review notes. Session history is saved separately from progress backups. Download logs below before moving devices.</p><section class="session-history"><div class="section-title"><div><h2>Conversation &amp; session history</h2><p>Download JSON for analysis or a review bundle with a report and code for each visit.</p></div></div><div id="session-history" aria-live="polite">Loading saved sessions…</div><div id="legacy-history"></div></section>${footer()}`;
 renderSessionHistory();
 $('#export').onclick=()=>download('newcode-progress.json',{format:'newcode-v1',exportedAt:new Date().toISOString(),progress,labs:labState});
 $('#import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>10000000)throw new Error('Backup is too large (10 MB maximum).');const parsed=validateBackup(JSON.parse(await f.text()),games,labs);progress={...progress,...parsed.progress};labState={...labState,...parsed.labs};save();progressPage();notice('Backup imported. Your progress is ready.');}catch(error){notice(error.message);}finally{e.target.value='';}};
}
async function renderSessionHistory(){
 const target=$('#session-history'),legacy=$('#legacy-history');
 const {sessions,persistent}=await listSessions();if(!target.isConnected)return;
 target.innerHTML=(!persistent?'<p>Saved history is unavailable in this browser. Sessions from this page remain downloadable until it closes.</p>':'')+(sessions.length?'<div class="saved-sessions">'+sessions.map(s=>`<article><div><strong>${esc(s.title)}</strong><p>${esc(new Date(s.startedAt).toLocaleString())} · ${s.prompts} AI requests · ${s.runs} test attempts</p></div><div class="history-downloads"><button data-session-json="${s.id}">JSON</button><button data-session-download="${s.id}">Review ZIP</button></div></article>`).join('')+'</div>':'<p>No recorded sessions yet. Open a problem or lab to start one.</p>');
 target.querySelectorAll('[data-session-download], [data-session-json]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{const value=await getSession(b.dataset.sessionDownload||b.dataset.sessionJson);if(!value)throw new Error('Session no longer available.');if(b.dataset.sessionJson)downloadSessionJSON(value);else downloadBundle(value);}catch(error){notice(error.message);}finally{b.disabled=false;}});
 const older=labs.filter(g=>labState[g.id]?.messages?.length);
 legacy.innerHTML=older.length?'<h3>Earlier chat logs</h3><p class="small">These predate session tracking. Only retained messages are available; earlier context and test history cannot be reconstructed.</p>'+older.map(g=>`<button data-legacy="${g.id}">Download earlier ${esc(g.title)} chat</button>`).join(''):'';
 legacy.querySelectorAll('[data-legacy]').forEach(b=>b.onclick=()=>download(`newcode-${b.dataset.legacy}-legacy-chat.json`,{format:'newcode-legacy-chat',schemaVersion:1,coverage:'Retained messages only; original timestamps may be incomplete. No exact request context or historical test events available.',problem:b.dataset.legacy,messages:labState[b.dataset.legacy].messages}));
}

function route(){cleanup();progress=migrateProgress(read(PROGRESS_KEY));labState=read(LAB_KEY);const [path,id]=location.hash.slice(1).split('/');document.querySelectorAll('[data-nav]').forEach(a=>{const selected=a.dataset.nav===(path==='lab'?'interviews':path==='practice'||!path?'library':path);a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(path==='practice'&&games.some(g=>g.id===id))workspace(games.find(g=>g.id===id),false);else if(path==='lab'&&labs.some(g=>g.id===id))workspace(labs.find(g=>g.id===id),true);else if(path==='interviews')interviews();else if(path==='progress')progressPage();else library();document.title=`${current&&(path==='practice'||path==='lab')?title(current)+' · ':''}Newcode`;window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);window.addEventListener('pagehide',()=>{save();cleanup();});window.addEventListener('pageshow',e=>{if(e.persisted)route();});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){captureFinal();persistSession();}});route();
