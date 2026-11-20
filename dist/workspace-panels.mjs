// Move existing controls without recreating their contents, drafts, or event handlers.
export function createWorkspacePanels(root,{onSelect=()=>{}}={}){
 const find=selector=>root.querySelector(selector),doc=root.ownerDocument;
 const grid=find('.work-grid'),code=find('.editor-column'),problem=find('.brief'),conversation=find('.assistant'),tests=find('.test-panel');
 const create=(tag,className)=>{const node=doc.createElement(tag);node.className=className;return node;};
 const tools=create('section','workspace-window panel');tools.id='workspace-tools';tools.setAttribute('aria-label','Workspace panels');
 tools.innerHTML='<div class="window-toolbar"><div class="window-tabs" role="tablist" aria-label="Workspace panels"></div><button id="expand-panel" class="quiet-button" aria-controls="workspace-tools" aria-expanded="false">Expand</button></div><div class="window-content"></div>';
 const review=create('section','review-window'),settings=create('section','settings-window');
 review.innerHTML='<h2>Review your session</h2><p>Capture your reasoning and download your work when you’re ready.</p>';
 const notes=find('#notes'),notesLabel=find('label[for="notes"]');
 const questions=notesLabel.previousElementSibling;
 if(questions?.matches('ul.checks')){const heading=questions.previousElementSibling;review.append(heading,questions);}
 review.append(notesLabel,notes,find('.session-download'));
 settings.innerHTML='<h2>Practice settings</h2><h3>Assistance</h3>';
 settings.append(find('.practice-mode'),find('#mode-description'));
 const modelHeading=create('h3','model-settings-heading');modelHeading.textContent='Local model';settings.append(modelHeading,find('#model-box'));
 const timerHeading=create('h3','');timerHeading.textContent='Timer';settings.append(timerHeading);
 const timerSettings=create('div','timer-settings'),duration=find('#timer-duration'),durationLabel=find('label[for="timer-duration"]');durationLabel.classList.remove('sr-only');
 timerSettings.append(durationLabel,duration,find('#timer-reset'));settings.append(timerSettings);
 const timerHelp=create('p','small');timerHelp.textContent='The countdown continues while you switch panels or leave the workspace. Pause it to stop.';settings.append(timerHelp);
 const heading=conversation.querySelector('.panel-heading');heading.innerHTML='<span>Conversation</span><span id="chat-model-summary" class="muted"></span>';
 const setup=create('button','chat-setup-link');setup.type='button';setup.id='open-ai-setup';setup.textContent='Set up local AI';conversation.querySelector('#ai-content').prepend(setup);
 const cancelTests=create('button','quiet-button');cancelTests.id='cancel-tests';cancelTests.type='button';cancelTests.textContent='Cancel run';cancelTests.hidden=true;tests.querySelector('.panel-heading').append(cancelTests);
 const panelMap={problem,conversation,tests,review,settings};
 const labels={problem:'Problem',conversation:'Chat',tests:'Tests',review:'Review',settings:'Settings'};
 const tablist=tools.querySelector('[role=tablist]'),content=tools.querySelector('.window-content'),tabs={};
 for(const [id,panel] of Object.entries(panelMap)){
  const tab=create('button','window-tab');tab.type='button';tab.id='tab-'+id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','window-'+id);tab.textContent=labels[id];
  if(id==='tests'){const badge=create('span','test-tab-badge');badge.id='test-tab-status';badge.hidden=true;tab.append(badge);}
  tabs[id]=tab;tablist.append(tab);panel.id='window-'+id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;content.append(panel);
 }
 grid.append(code,tools);
 const focusCode=create('button','quiet-button');focusCode.id='focus-code';focusCode.type='button';focusCode.textContent='Focus code';focusCode.setAttribute('aria-expanded','false');focusCode.setAttribute('aria-controls','workspace-code');code.id='workspace-code';code.querySelector('.panel-heading').append(focusCode);
 const mobile=create('div','workspace-mobile-switch');mobile.setAttribute('role','group');mobile.setAttribute('aria-label','Workspace view');mobile.innerHTML='<button type="button" data-workspace-view="code" aria-pressed="true">Code</button><button type="button" data-workspace-view="tools" aria-pressed="false">Panels</button>';root.insertBefore(mobile,grid);
 let selected='problem',focus='split';const scrolls=new Map();
 const saveScroll=()=>{const panel=panelMap[selected];if(!panel.getClientRects().length)return;scrolls.set(selected,[panel,...panel.querySelectorAll('.brief-body,#messages,#results')].map(node=>({node,top:node.scrollTop,follow:node.id==='messages'&&node.scrollHeight-node.clientHeight-node.scrollTop<48})));};
 const restoreScroll=()=>{for(const {node,top,follow} of scrolls.get(selected)||[])node.scrollTop=follow?node.scrollHeight:top;};
 function mobileView(value,notify=true){const fromCode=code.contains(doc.activeElement);root.dataset.mobileView=value;mobile.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workspaceView===value)));if(value==='tools'){restoreScroll();if(fromCode&&globalThis.matchMedia?.('(max-width:900px)').matches)tabs[selected].focus({preventScroll:true});if(notify)onSelect(selected);}}
 function setFocus(value){saveScroll();focus=value;root.dataset.workspaceFocus=value;focusCode.textContent=value==='code'?'Show panels':'Focus code';focusCode.setAttribute('aria-expanded',String(value==='code'));find('#expand-panel').textContent=value==='tools'?'Restore split':'Expand';find('#expand-panel').setAttribute('aria-expanded',String(value==='tools'));restoreScroll();}
 function select(id,{reveal=true,focusTab=false}={}){
  if(!panelMap[id])return;const previous=panelMap[selected],focused=doc.activeElement;if(previous!==panelMap[id]&&previous.contains(focused))focusTab=true;saveScroll();selected=id;
  for(const [name,panel] of Object.entries(panelMap)){panel.hidden=name!==id;tabs[name].setAttribute('aria-selected',String(name===id));tabs[name].tabIndex=name===id?0:-1;}
  if(reveal){if(focus==='code')setFocus('split');mobileView('tools',false);}
  restoreScroll();if(focusTab)tabs[id].focus({preventScroll:true});if(tabs[id].getClientRects().length)tabs[id].scrollIntoView({block:'nearest',inline:'nearest'});onSelect(id);
 }
 for(const [id,tab] of Object.entries(tabs)){
  tab.onclick=()=>select(id);
  tab.onkeydown=event=>{const ids=Object.keys(tabs),index=ids.indexOf(id);let next;
   if(event.key==='ArrowRight')next=ids[(index+1)%ids.length];else if(event.key==='ArrowLeft')next=ids[(index+ids.length-1)%ids.length];else if(event.key==='Home')next=ids[0];else if(event.key==='End')next=ids.at(-1);
   if(next){event.preventDefault();select(next,{focusTab:true});}
  };
 }
 focusCode.onclick=()=>setFocus(focus==='code'?'split':'code');find('#expand-panel').onclick=()=>setFocus(focus==='tools'?'split':'tools');
 mobile.querySelectorAll('button').forEach(button=>button.onclick=()=>{saveScroll();mobileView(button.dataset.workspaceView);});
 setup.onclick=()=>select('settings');
 const header=doc.querySelector('.header');const resize=()=>{if(header)root.style.setProperty('--app-header-height',header.getBoundingClientRect().height+'px');};const observer=globalThis.ResizeObserver?new ResizeObserver(resize):null;if(header)observer?.observe(header);resize();
 root.dataset.workspaceFocus='split';root.dataset.mobileView='code';select('problem',{reveal:false});
 return {select,isVisible:id=>!!panelMap[id]?.getClientRects().length,destroy:()=>observer?.disconnect(),selected:()=>selected,setTestStatus(text){const badge=find('#test-tab-status');badge.textContent=text;badge.hidden=!text;}};
}
