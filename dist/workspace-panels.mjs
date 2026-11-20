// Move existing controls without recreating their contents, drafts, or event handlers.
export function createWorkspacePanels(root,{onSelect=()=>{}}={}){
 const find=selector=>root.querySelector(selector),doc=root.ownerDocument;
 const grid=find('.work-grid'),code=find('.editor-column'),problem=find('.brief'),conversation=find('.assistant'),tests=find('.test-panel');
 const create=(tag,className)=>{const node=doc.createElement(tag);node.className=className;return node;};
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
 const panelMap={code,problem,conversation,tests,review,settings};
 const labels={code:'Code',problem:'Problem',conversation:'Chat',tests:'Tests',review:'Review',settings:'Settings'};
 const panes={},tabs={},scrolls=new Map();
 const layout=readWorkspaceLayout(doc.defaultView);
 let focus='split',mobilePane=layout.left.length?'left':'right',dragged=null,lastSelected='problem',dragPointer=null;
 const mobile=create('div','workspace-mobile-switch');mobile.setAttribute('role','group');mobile.setAttribute('aria-label','Workspace view');
 const announcement=create('div','sr-only');announcement.setAttribute('role','status');root.append(announcement);
 for(const side of ['left','right']){
  const pane=create('section','workspace-window panel');pane.id='workspace-'+side;pane.dataset.pane=side;pane.setAttribute('aria-label',side==='left'?'Left window':'Right window');
  pane.innerHTML=`<div class="window-toolbar"><div class="window-tabs" role="tablist" aria-label="${side==='left'?'Left':'Right'} window tabs"></div><button type="button" class="move-tab quiet-button">Move →</button><button type="button" class="expand-pane quiet-button" aria-controls="workspace-${side}" aria-expanded="false">Expand</button></div><div class="window-content"><div class="empty-window"><strong>Drop a tab here</strong><p>Drag a tab from the other window, or use its Move button.</p></div></div>`;
  panes[side]={node:pane,tabs:pane.querySelector('[role=tablist]'),content:pane.querySelector('.window-content'),empty:pane.querySelector('.empty-window'),move:pane.querySelector('.move-tab'),expand:pane.querySelector('.expand-pane')};
  const button=create('button','');button.type='button';button.dataset.workspaceView=side;mobile.append(button);
 }
 const divider=create('div','workspace-divider');divider.tabIndex=0;divider.setAttribute('role','separator');divider.setAttribute('aria-orientation','vertical');divider.setAttribute('aria-label','Resize workspace windows');divider.setAttribute('aria-controls','workspace-left workspace-right');divider.title='Drag to resize. Arrow keys adjust width; double-click to balance.';
 // Detach only once while assembling the workspace. Switching or resizing never recreates content.
 for(const [id,panel] of Object.entries(panelMap)){
  const tab=create('button','window-tab');tab.type='button';tab.id='tab-'+id;tab.draggable=true;tab.dataset.tab=id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','window-'+id);tab.textContent=labels[id];tab.title=`${labels[id]} · drag to move, or use the Move button`;
  if(id==='tests'){const badge=create('span','test-tab-badge');badge.id='test-tab-status';badge.hidden=true;tab.append(badge);}
  tabs[id]=tab;panel.id='window-'+id;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;
 }
 for(const side of ['left','right'])for(const id of layout[side]){panes[side].tabs.append(tabs[id]);panes[side].content.append(panelMap[id]);}
 grid.replaceChildren(panes.left.node,divider,panes.right.node);root.insertBefore(mobile,grid);
 function sideOf(id){return layout.left.includes(id)?'left':'right';}
 function persist(){try{doc.defaultView.localStorage.setItem('newcode.workspace-layout',JSON.stringify(layout));}catch{/* Browser storage may be disabled. */}}
 function saveScroll(){for(const [id,panel] of Object.entries(panelMap)){if(panel.getClientRects().length)scrolls.set(id,[panel,...panel.querySelectorAll('.brief-body,#messages,#results,.cm-scroller')].map(node=>({node,top:node.scrollTop,left:node.scrollLeft,follow:node.id==='messages'&&node.scrollHeight-node.clientHeight-node.scrollTop<48})));}}
 function restoreScroll(){for(const [id,entries] of scrolls){if(!panelMap[id].getClientRects().length)continue;for(const {node,top,left,follow} of entries){node.scrollTop=follow?node.scrollHeight:top;node.scrollLeft=left;}}}
 function refresh(){
  root.dataset.workspaceFocus=focus;root.dataset.mobileView=mobilePane;
  for(const side of ['left','right']){
   const pane=panes[side],active=layout.active[side];
   for(const id of layout[side]){panelMap[id].hidden=id!==active;tabs[id].setAttribute('aria-selected',String(id===active));tabs[id].tabIndex=id===active?0:-1;}
   pane.empty.hidden=!!layout[side].length;pane.move.disabled=!active;
   pane.move.textContent=side==='left'?'Move →':'← Move';pane.move.setAttribute('aria-label',active?`Move ${labels[active]} to the ${side==='left'?'right':'left'} window`:'No tab to move');pane.move.title=pane.move.getAttribute('aria-label');
   pane.expand.textContent=focus===side?'Restore':'Expand';pane.expand.setAttribute('aria-expanded',String(focus===side));pane.expand.setAttribute('aria-label',focus===side?'Restore split view':`Expand ${side} window`);
   const button=mobile.querySelector(`[data-workspace-view=${side}]`);button.textContent=`${side==='left'?'Left':'Right'} · ${labels[active]||'Empty'}`;button.setAttribute('aria-pressed',String(mobilePane===side));
  }
  restoreScroll();
 }
 function reveal(side){mobilePane=side;if(focus!=='split')focus=side;}
 function notifyVisible(){for(const side of ['left','right']){const id=layout.active[side];if(id&&panelMap[id].getClientRects().length)onSelect(id);}}
 function select(id,{reveal:shouldReveal=true,focusTab=false}={}){
  if(!panelMap[id])return;saveScroll();const side=sideOf(id),previous=panelMap[layout.active[side]],focusedPanel=Object.values(panelMap).find(panel=>panel.contains(doc.activeElement));
  if(previous!==panelMap[id]&&previous?.contains(doc.activeElement))focusTab=true;
  layout.active[side]=id;lastSelected=id;if(shouldReveal)reveal(side);refresh();persist();if(focusedPanel&&!focusedPanel.getClientRects().length)focusTab=true;
  if(focusTab)tabs[id].focus({preventScroll:true});if(tabs[id].getClientRects().length)tabs[id].scrollIntoView({block:'nearest',inline:'nearest'});onSelect(id);
 }
 function move(id,to,before=null){
  if(!panelMap[id]||!panes[to]||id===before)return;
  saveScroll();moveWorkspaceTab(layout,id,to,before);
  // Move the existing nodes, retaining editor state, handlers, and unsent drafts.
  panes[to].tabs.insertBefore(tabs[id],before?tabs[before]:null);panes[to].content.append(panelMap[id]);
  reveal(to);lastSelected=id;refresh();persist();tabs[id].focus({preventScroll:true});tabs[id].scrollIntoView({block:'nearest',inline:'nearest'});notifyVisible();
  announcement.textContent=`${labels[id]} moved to the ${to} window.`;
 }
 function clearDrag(){dragged=null;for(const tab of Object.values(tabs))tab.classList.remove('dragging','drop-before');for(const pane of Object.values(panes))pane.node.classList.remove('drop-target');}
 for(const [id,tab] of Object.entries(tabs)){
  tab.onclick=()=>select(id);
  tab.onkeydown=event=>{
   const side=sideOf(id),ids=layout[side],index=ids.indexOf(id);let next;
   if(event.key==='ArrowRight')next=ids[(index+1)%ids.length];else if(event.key==='ArrowLeft')next=ids[(index+ids.length-1)%ids.length];else if(event.key==='Home')next=ids[0];else if(event.key==='End')next=ids.at(-1);
   if(next){event.preventDefault();select(next,{focusTab:true});}
  };
  tab.ondragstart=event=>{dragged=id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id);tab.classList.add('dragging');};
  tab.ondragend=clearDrag;
 }
 for(const [side,pane] of Object.entries(panes)){
  pane.move.onclick=()=>move(layout.active[side],side==='left'?'right':'left');
  pane.expand.onclick=()=>{saveScroll();focus=focus===side?'split':side;mobilePane=side;refresh();notifyVisible();};
  pane.node.ondragover=event=>{if(!dragged)return;event.preventDefault();event.dataTransfer.dropEffect='move';for(const other of Object.values(panes))other.node.classList.toggle('drop-target',other===pane);for(const tab of Object.values(tabs))tab.classList.remove('drop-before');const target=event.target.closest('[data-tab]');if(target&&target!==tabs[dragged])target.classList.add('drop-before');};
  pane.node.ondragleave=event=>{if(!pane.node.contains(event.relatedTarget))pane.node.classList.remove('drop-target');};
  pane.node.ondrop=event=>{if(!dragged)return;event.preventDefault();const id=dragged,before=event.target.closest('[data-tab]')?.dataset.tab;clearDrag();move(id,side,before||null);};
 }
 for(const button of mobile.querySelectorAll('button'))button.onclick=()=>{saveScroll();mobilePane=button.dataset.workspaceView;refresh();notifyVisible();};
 function updateSplit(value=layout.ratio){
  const width=doc.defaultView.matchMedia('(max-width:900px)').matches?0:grid.getBoundingClientRect().width-divider.getBoundingClientRect().width;
  const {ratio,min,max}=workspaceSplit(value,width);layout.ratio=ratio;
  grid.style.setProperty('--left-pane',`${ratio}fr`);grid.style.setProperty('--right-pane',`${1-ratio}fr`);
  divider.setAttribute('aria-valuemin',String(Math.round(min*100)));divider.setAttribute('aria-valuemax',String(Math.round(max*100)));divider.setAttribute('aria-valuenow',String(Math.round(ratio*100)));divider.setAttribute('aria-valuetext',`Left window ${Math.round(ratio*100)}%, right window ${Math.round((1-ratio)*100)}%`);
 }
 function endResize(){if(dragPointer===null)return;const pointer=dragPointer;dragPointer=null;if(divider.hasPointerCapture(pointer))divider.releasePointerCapture(pointer);root.classList.remove('resizing');persist();}
 divider.onpointerdown=event=>{if(event.button!==0)return;event.preventDefault();dragPointer=event.pointerId;divider.setPointerCapture(dragPointer);divider.focus({preventScroll:true});root.classList.add('resizing');};
 divider.onpointermove=event=>{if(event.pointerId!==dragPointer)return;const bounds=grid.getBoundingClientRect(),handle=divider.getBoundingClientRect().width;updateSplit((event.clientX-bounds.left-handle/2)/(bounds.width-handle));};
 divider.onpointerup=endResize;divider.onpointercancel=endResize;divider.onlostpointercapture=endResize;
 divider.ondblclick=()=>{updateSplit(.5);persist();};
 divider.onkeydown=event=>{let value;if(event.key==='ArrowLeft')value=layout.ratio-.025;else if(event.key==='ArrowRight')value=layout.ratio+.025;else if(event.key==='Home')value=0;else if(event.key==='End')value=1;else if(event.key==='Enter')value=.5;if(value!==undefined){event.preventDefault();updateSplit(value);persist();}};
 setup.onclick=()=>select('settings');
 const header=doc.querySelector('.header');const resize=()=>{if(header)root.style.setProperty('--app-header-height',header.getBoundingClientRect().height+'px');if(focus==='split'&&!doc.defaultView.matchMedia('(max-width:900px)').matches)updateSplit();};
 const observer=globalThis.ResizeObserver?new ResizeObserver(resize):null;if(header)observer?.observe(header);observer?.observe(grid);
 refresh();updateSplit();resize();
 return {select,isVisible:id=>!!panelMap[id]?.getClientRects().length,destroy:()=>{endResize();observer?.disconnect();},selected:()=>lastSelected,setTestStatus(text){const badge=find('#test-tab-status');badge.textContent=text;badge.hidden=!text;}};
}

// Keep every panel in exactly one window; moving the last tab leaves a usable drop target.
export function moveWorkspaceTab(layout,id,to,before=null){
 const from=layout.left.includes(id)?'left':layout.right.includes(id)?'right':null;
 if(!from||!['left','right'].includes(to)||before===id)return;
 if(before!==null&&!layout[to].includes(before))return;
 const index=layout[from].indexOf(id);layout[from].splice(index,1);
 if(layout.active[from]===id)layout.active[from]=layout[from][Math.min(index,layout[from].length-1)]||null;
 const target=before===null?layout[to].length:layout[to].indexOf(before);layout[to].splice(target,0,id);layout.active[to]=id;
}
export function workspaceSplit(value,width){
 const min=width>0?Math.min(.5,Math.max(.2,280/width)):.2,max=1-min;
 return {ratio:Math.max(min,Math.min(max,Number.isFinite(value)?value:.5)),min,max};
}
export function readWorkspaceLayout(view){
 const initial={left:['code'],right:['problem','conversation','tests','review','settings'],active:{left:'code',right:'problem'},ratio:.51};
 try{
  const saved=JSON.parse(view?.localStorage.getItem('newcode.workspace-layout'));
  if(!saved||!Array.isArray(saved.left)||!Array.isArray(saved.right))return initial;
  const all=[...saved.left,...saved.right],expected=[...initial.left,...initial.right];
  if(all.length!==expected.length||new Set(all).size!==expected.length||!all.every(id=>expected.includes(id)))return initial;
  return {left:saved.left,right:saved.right,active:{left:saved.left.includes(saved.active?.left)?saved.active.left:saved.left[0]||null,right:saved.right.includes(saved.active?.right)?saved.active.right:saved.right[0]||null},ratio:workspaceSplit(saved.ratio,0).ratio};
 }catch{return initial;}
}
