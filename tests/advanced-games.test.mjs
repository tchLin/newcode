import test from 'node:test';
import assert from 'node:assert/strict';
import {games,newRound,move,roadmap,accepts} from '../dist/arcade/logic.mjs';
import {windowInfo} from '../dist/arcade/advanced-games.mjs';
import {resources,tutorialsFor,tutorialPanel} from '../dist/arcade/tutorials.mjs';
import {buildProgram,starter} from '../dist/arcade/languages.mjs';
const game=id=>games.find(g=>g.id===id);

test('Water game measures before discarding and agrees with exhaustive pair search',()=>{
 for(const values of [[1,8,6,2,5,7],[4,3,2,1,4],[0,0],[1,1],[3,2,1],[2,5,2,7,6]]){
  const g={...game('water'),rounds:[{values}]};let s=newRound(g),best=0;
  for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)best=Math.max(best,(j-i)*Math.min(values[i],values[j]));
  while(!s.done){
   const area=(s.right-s.left)*Math.min(values[s.left],values[s.right]);
   assert.equal(move(g,s,'area',area+1).error,true);assert.equal(move(g,s,'left').error,true);
   s=move(g,s,'area',area);if(s.done)break;
   const action=values[s.left]<=values[s.right]?'left':'right';
   if(values[s.left]!==values[s.right])assert.equal(move(g,s,action==='left'?'right':'left').error,true);
   s=move(g,s,action);
  }
  assert.equal(s.best,best);assert.deepEqual(move(g,s,'left'),s);
 }
});
test('LIS rejects equal/later values and suboptimal predecessors, allowing tied best choices',()=>{
 const g=game('lis');let s=newRound(g);
 assert.equal(move(g,s,'extend',0).error,true);
 for(const choice of [-1,-1,1,2,1,3])s=move(g,s,'extend',choice);
 assert.equal(s.done,true);assert.deepEqual(s.dp,[1,1,2,3,2,4]);
 s=newRound(g,1);s=move(g,s,'extend',-1);assert.equal(move(g,s,'extend',0).error,true);
 s=move(g,s,'extend',-1);s=move(g,s,'extend',-1);assert.deepEqual(s.dp,[1,1,1]);
 const tied={...g,rounds:[{values:[1,1,2]}]};s=newRound(tied);s=move(tied,s,'extend',-1);s=move(tied,s,'extend',-1);
 assert.equal(move(tied,s,'extend',0).done,true);assert.equal(move(tied,s,'extend',1).done,true);
});
test('Island queue never duplicates a cell and diagonal land remains disconnected',()=>{
 const g=game('islands');
 for(const round of [0,1]){
  let s=newRound(g,round);const values=g.rounds[round].grid.join('');
  assert.equal(move(g,s,'visit',-1).error,true);
  while(!s.done){
   const choice=s.queue[0]??[...values].findIndex((c,i)=>c==='1'&&!s.visited.includes(i));
   const water=[...values].findIndex(c=>c==='0');assert.equal(move(g,s,'visit',water).error,true);
   s=move(g,s,'visit',choice);assert.equal(new Set(s.queue).size,s.queue.length);
   assert.ok(s.queue.every(i=>!s.visited.includes(i)));
   if(!s.done)assert.equal(move(g,s,'visit',choice).error,true);
  }
  assert.equal(s.island,round===0?3:5);
 }
});
test('Sliding window handles repeated letters, shrinking at the end, and missing targets',()=>{
 const original=game('window');
 for(const [source,target,expected] of [['CABBAAC','ABC','CAB'],['ABAAC','AAC','AAC'],['ab','b','b'],['a','aa',null],['aA','A','A']]){
  const g={...original,rounds:[{values:[...source],target}]};let s=newRound(g),steps=0;
  while(!s.done){
   const info=windowInfo(g.rounds[0],s),action=info.valid?'shrink':s.right<source.length?'expand':'finish';
   const wrong=move(g,s,action==='expand'?'shrink':'expand');assert.equal(wrong.error,true);assert.equal(wrong.left,s.left);assert.equal(wrong.right,s.right);
   s=move(g,s,action);assert.ok(++steps<=source.length*2+1);
  }
  assert.equal(s.best,expected);
 }
});
test('All 75 unique problems have algorithm tutorials and labels preserve publication status',()=>{
 const all=[...games,...Object.values(roadmap).flat()];assert.equal(new Set(all.map(g=>g.number)).size,75);
 for(const g of all){assert.ok(tutorialsFor(g.number).length,g.problem);assert.match(tutorialPanel(g.number),/target="_blank"/);}
 for(const r of Object.values(resources)){assert.equal(new URL(r.url).protocol,'https:');assert.ok(r.publisher&&r.title);}
 assert.equal(games.length,75);assert.equal(games.filter(g=>g.difficulty==='Hard').length,7);
});
test('New signatures preserve conventional Rust names and character grids',()=>{
 assert.match(starter(game('lis'),'rust'),/length_of_lis/);
 for(const [id,pattern] of [['c',/char\*\* grid, int gridSize, int\* gridColSize/],['java',/char\[\]\[\] grid/],['rust',/Vec<Vec<char>>/],['go',/\[\]\[\]byte/],['python',/list\[list\[str\]\]/]])assert.match(starter(game('islands'),id),pattern);
 const c=buildProgram(game('window'),'c',starter(game('window'),'c'));
 assert.match(c,/aa_print_json\(value\); free\(value\)/);assert.match(c,/calloc\(1, 1\)/);
 assert.equal(accepts(game('window'),game('window').tests[2],''),true);
 assert.equal(accepts(game('window'),game('window').tests[2],null),false);
});
