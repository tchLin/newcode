export function moreArt(g){
 if(g.id==='stock')return '<div class="stock-mini" aria-hidden="true">'+[7,2,5,3,8].map((n,i)=>`<i style="height:${n*9}px" class="${i===1||i===4?'accent':''}"></i>`).join('')+'<span>↗</span></div>';
 if(g.id==='anagram')return '<div class="letter-mini" aria-hidden="true"><span>e a t</span><b>↕</b><span>t e a</span></div>';
 return '<div class="stairs-mini" aria-hidden="true">'+[1,2,3,5].map((n,i)=>`<span style="height:${30+i*15}px">${n}</span>`).join('')+'</div>';
}
export function moreBoard(g,state){
 const r=g.rounds[state.round],stock=g.id==='stock',anagram=g.id==='anagram';
 let body,title,subtitle,steps;
 if(stock){
  title='Keep two records. Inspect one day at a time.';
  subtitle=state.done?'All days checked.':`Day ${state.index+1}: the price is ${r.values[state.index]}. Which record changes?`;
  body=`<div class="price-chart" aria-label="Daily prices">${r.values.map((v,i)=>`<div class="price-day ${i===state.index?'active':''} ${i<state.index?'visited':''}"><b>${v}</b><i style="height:${20+v*12}px"></i><small>Day ${i+1}</small></div>`).join('')}</div><div class="record-row"><div>Cheapest so far<strong>${state.minimum??'—'}</strong></div><div>Best profit<strong>${state.best}</strong></div></div><div class="controls">${state.done?'':'<button class="btn" data-action="low">Save new low ↓</button><button class="btn orange" data-action="profit">Update best profit ↗</button><button class="btn ghost" data-action="skip">Keep records →</button>'}</div>`;
  steps=['Save a price when it is cheaper than every earlier day.','Otherwise compare today’s price − cheapest price with your best profit.','Keep a profit of zero if no trade makes money.'];
 }else if(anagram){
  title='Spend one saved letter for every match.';
  subtitle=state.done?'Letter check complete.':`Find one “${r.values[state.index]}” in your saved letters, or reject if none remains.`;
  body=`<div class="word-pair"><span>First word <b>${r.source}</b></span><span>Second word <b>${r.values.join('')}</b></span></div><div class="tiles">${r.values.map((v,i)=>`<div class="tile ${i===state.index&&!state.done?'current':i<state.index?'processed':''}">${v}<small>letter ${i+1}</small></div>`).join('')}</div><div class="memory-label">SAVED LETTERS · SELECT ONE MATCH</div><div class="memory">${state.memory.length?state.memory.map((m,i)=>`<button data-match="${i}" ${state.done?'disabled':''} aria-label="Use letter ${m.value} from position ${m.index+1}">${m.value}</button>`).join(''):'<span>No letters left.</span>'}</div><div class="controls">${state.done?'':'<button class="btn ghost" data-action="reject">No matching letter · reject</button>'}</div>`;
  steps=['Save the letters of the first word. Repeats count separately.','For each letter of the second word, use one matching saved letter.','A missing match or unused letters means false.'];
 }else{
  title='Build the number of routes, one step at a time.';
  const a=state.memory.at(-2),b=state.memory.at(-1),sum=a.value+b.value;
  subtitle=state.done?'You reached the top.':`How many routes reach step ${state.index}? Add the two highlighted counts.`;
  body=`<div class="staircase" aria-label="Ways to reach each step">${r.values.map((v,i)=>{const known=state.memory.find(m=>m.index===i);return `<div class="stair ${i===state.index?'target-step':''} ${i===state.index-1||i===state.index-2?'source-step':''}" style="height:${65+i*17}px"><strong>${known?known.value:'?'}</strong><small>${i===0?'Ground':'Step '+i}</small></div>`;}).join('')}</div>${state.done?'':`<div class="route-equation"><span>Step ${state.index-2}<b>${a.value} ${a.value===1?'route':'routes'}</b><small>+ a 2-step move</small></span><strong>+</strong><span>Step ${state.index-1}<b>${b.value} ${b.value===1?'route':'routes'}</b><small>+ a 1-step move</small></span></div><div class="controls" aria-label="Choose the number of routes">${[sum-1,sum,sum+1].map(n=>`<button class="btn" data-action="ways" data-value="${n}">${n} ${n===1?'route':'routes'}</button>`).join('')}</div>`}`;
  steps=['There is one way to stand at ground level and one way to reach step 1.','A last move of 1 step comes from the previous step. A last move of 2 comes from two steps back.','Add those two groups, save the total, and move up.'];
 }
 const feedback=state.message?`<p class="feedback ${state.error?'error':''}">${state.message}${state.done?'<br><strong>'+(state.round+1===g.rounds.length?'Pattern unlocked. Opening your coding exercise…':'Loading the next round…')+'</strong>':''}</p>`:'';
 return `<div class="game-layout"><section class="game-board"><div class="board-top"><span>ROUND ${state.round+1} OF ${g.rounds.length}</span><span class="target">${stock?'ONE BUY · ONE LATER SALE':anagram?'EVERY LETTER COUNTS':'ONE STEP OR TWO'}</span></div><h2 class="instruction">${title}</h2><p class="subtext">${subtitle}</p>${body}<div id="game-feedback" aria-live="polite">${feedback}</div></section><aside class="explanation"><div class="icon">✳</div><h2>${g.concept}</h2><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="divider">No timer. No lost lives.<br>Experiment until it clicks.</div></aside></div>`;
}
