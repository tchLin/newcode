import test from 'node:test';
import assert from 'node:assert/strict';
import {games,newRound,move} from '../dist/arcade/logic.mjs';
const game=id=>games.find(g=>g.id===id);
test('Course Schedule accepts either ready order, detects a cycle, and never mutates prior state',()=>{
 const g=game('courses');
 for(const order of [[0,1,2,3],[0,2,1,3]]){
  let s=newRound(g);const before=structuredClone(s);
  assert.equal(move(g,s,'course',3).error,true);assert.equal(move(g,s,'cycle').error,true);
  const next=move(g,s,'course',0);assert.deepEqual(s,before);assert.deepEqual(next.indegree,[0,0,0,2]);
  for(const c of order){s=move(g,s,'course',c);assert.equal(s.error,false);}
  assert.equal(s.done,true);assert.equal(s.answer,true);assert.deepEqual(move(g,s,'cycle'),s);
 }
 let s=newRound(g,1);assert.equal(move(g,s,'course',0).error,true);s=move(g,s,'cycle');assert.equal(s.done,true);assert.equal(s.answer,false);
});
test('Interval game preserves touching intervals and removes enclosing intervals',()=>{
 const g=game('intervals');
 for(const [round,actions,answer] of [[0,['keep','remove','keep','remove'],2],[1,['keep','keep','keep','remove'],1]]){
  let s=newRound(g,round);assert.equal(move(g,s,'remove').error,true);
  for(const a of actions){assert.equal(move(g,s,a==='keep'?'remove':'keep').error,true);s=move(g,s,a);assert.equal(s.error,false);}
  assert.equal(s.done,true);assert.equal(s.answer,answer);
 }
});
test('Binary search retains minimum for every rotation, including singleton and sorted arrays',()=>{
 const base=game('rotated');
 for(let n=1;n<=12;n++)for(let rotation=0;rotation<n;rotation++){
  const sorted=Array.from({length:n},(_,i)=>i-6),values=[...sorted.slice(rotation),...sorted.slice(0,rotation)],g={...base,rounds:[{values}]};let s=newRound(g),steps=0;
  while(s.left<s.right){const mid=Math.floor((s.left+s.right)/2),action=values[mid]>values[s.right]?'right':'left';assert.equal(move(g,s,action==='right'?'left':'right').error,true);s=move(g,s,action);assert.ok(values.slice(s.left,s.right+1).includes(-6));assert.ok(++steps<=Math.ceil(Math.log2(n)));}
  s=move(g,s,'minimum',s.left);assert.equal(s.done,true);assert.equal(s.answer,-6);
 }
});
test('Coin DP allows tied optimal coins and preserves unreachable subtotals',()=>{
 const g=game('coins');let s=newRound(g);assert.equal(move(g,s,'coin',4).error,true);
 for(const c of [1,1,3,4])s=move(g,s,'coin',c);
 assert.equal(move(g,s,'coin',1).error,false);assert.equal(move(g,s,'coin',4).error,false);
 s=move(g,s,'coin',1);assert.equal(move(g,s,'coin',4).error,true);s=move(g,s,'coin',3);
 assert.deepEqual(s.dp,[0,1,2,1,1,2,2]);assert.equal(s.answer,2);
 s=newRound(g,1);for(const c of [-1,2,-1,4,-1,2,-1]){s=move(g,s,'coin',c);assert.equal(s.error,false);}
 assert.equal(s.done,true);assert.equal(s.answer,-1);assert.equal(s.dp[5],Infinity);
});
test('Bit game only clears the lowest 1, uses zero-based positions, and counts correctly',()=>{
 const g=game('bits');let s=newRound(g);assert.equal(move(g,s,'bit',3).error,true);assert.equal(move(g,s,'bit',1).error,true);
 for(const bit of [0,2,3])s=move(g,s,'bit',bit);assert.equal(s.remaining,0);assert.equal(s.answer,3);
 s=newRound(g,1);for(const bit of [3,5])s=move(g,s,'bit',bit);assert.equal(s.done,true);assert.equal(s.answer,2);
});
