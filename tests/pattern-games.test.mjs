import test from 'node:test';
import assert from 'node:assert/strict';
import {games,newRound,move} from '../dist/arcade/logic.mjs';
import {wordChoices,productChoices} from '../dist/arcade/pattern-games.mjs';
const game=id=>games.find(g=>g.id===id);
test('Word Search backtracks dead ends, restores cells, and exhausts starts before rejecting',()=>{
 const g=game('word-search');let s=newRound(g);const original=structuredClone(s);
 assert.equal(move(g,s,'absent').error,true);assert.equal(move(g,s,'cell',4).error,true);s=move(g,s,'cell',0);assert.deepEqual(original,newRound(g));
 assert.equal(move(g,s,'back').error,true);s=move(g,s,'cell',1);assert.deepEqual(wordChoices(g.rounds[0],s),[]);assert.equal(move(g,s,'cell',0).error,true);
 s=move(g,s,'back');assert.deepEqual(s.path,[0]);assert.equal(move(g,s,'cell',1).error,true);
 for(const c of [3,6,7])s=move(g,s,'cell',c);assert.equal(s.done,true);assert.equal(s.answer,true);assert.equal(s.backtracks,1);
 s=newRound(g,1);for(const c of [0,1])s=move(g,s,'cell',c);assert.equal(move(g,s,'cell',0).error,true);assert.equal(move(g,s,'cell',2).error,true);
 s=move(g,s,'back');s=move(g,s,'back');assert.deepEqual(wordChoices(g.rounds[1],s),[]);s=move(g,s,'absent');assert.equal(s.done,true);assert.equal(s.answer,false);
});
test('Word Search game agrees with exhaustive DFS fixtures, including alternate starts',()=>{
 const base=game('word-search');
 for(const t of base.tests){const g={...base,rounds:[{grid:t.args[0].map(r=>r.join('')),word:t.args[1]}]};let s=newRound(g),steps=0;
  while(!s.done){const options=wordChoices(g.rounds[0],s);s=options.length?move(g,s,'cell',options[0]):move(g,s,s.path.length?'back':'absent');assert.equal(s.error,false);assert.ok(++steps<2000);}
  assert.equal(s.answer,t.expected);
 }
});
test('Unique window removes repeated occurrences without moving left backward',()=>{
 const g=game('unique-window');let s=newRound(g);assert.equal(move(g,s,'shrink').error,true);
 for(const a of ['expand','expand'])s=move(g,s,a);assert.equal(move(g,s,'expand').error,true);
 s=move(g,s,'shrink');assert.equal(s.left,1);assert.equal(move(g,s,'expand').error,true);
 for(const a of ['shrink','expand','expand','finish'])s=move(g,s,a);assert.equal(s.done,true);assert.equal(s.answer,2);assert.equal(s.left,2);
});
test('House Robber prefix DP agrees with exhaustive nonadjacent subsets, including ties',()=>{
 const base=game('robber');
 for(const values of [[2,7,9,3,1],[2,1,1,2],[0,0],[3],[6,1,1,6],[1,2,1,2,1]]){
  const g={...base,rounds:[{values}]};let s=newRound(g),best=0;
  for(let mask=0;mask<(1<<values.length);mask++)if(!(mask&(mask<<1)))best=Math.max(best,values.reduce((n,v,i)=>n+((mask>>i)&1?v:0),0));
  while(!s.done){const skip=s.dp[s.index],take=values[s.index]+s.dp[Math.max(0,s.index-1)];if(skip===take)assert.equal(move(g,s,'skip').error,false);s=move(g,s,take>=skip?'take':'skip');}
  assert.equal(s.answer,best);
 }
});
test('Jump frontier agrees with reachable-position search for short arrays',()=>{
 const base=game('jump');
 for(let code=0;code<243;code++){
  let x=code;const values=Array.from({length:5},()=>{const v=x%3;x=Math.floor(x/3);return v;}),reachable=new Set([0]);
  for(let i=0;i<values.length;i++)if(reachable.has(i))for(let j=1;j<=values[i];j++)reachable.add(i+j);
  const g={...base,rounds:[{values}]};let s=newRound(g);
  while(!s.done){const a=s.farthest>=values.length-1?'reachable':s.index>s.farthest?'blocked':s.index+values[s.index]>s.farthest?'extend':'keep';s=move(g,s,a);assert.equal(s.error,false);}
  assert.equal(s.answer,reachable.has(values.length-1));
 }
});
test('Product game uses the old pair for both extrema and agrees with exhaustive subarrays',()=>{
 const base=game('max-product');
 for(const values of [[-2,3,-4],[-2,0,-1],[-3],[-1,-2,-9,-6],[0,2],[-2,-3,0,-2,-40]]){
  const g={...base,rounds:[{values}]};let s=newRound(g),best=-Infinity;
  for(let i=0;i<values.length;i++){let p=1;for(let j=i;j<values.length;j++){p*=values[j];best=Math.max(best,p);}}
  while(!s.done){const options=productChoices(g.rounds[0],s),before=[s.low,s.high];s=move(g,s,'high',Math.max(...options));assert.deepEqual([s.low,s.high],before);s=move(g,s,'low',Math.min(...options));assert.equal(s.error,false);}
  assert.equal(s.answer,best);assert.deepEqual(move(g,s,'high',0),s);
 }
});
