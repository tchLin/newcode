import {executeJavaScript} from '../dist/arcade/javascript-runner.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {games,newRound,move,accepts,roadmap} from '../dist/arcade/logic.mjs';
import {solutions} from './fixtures/solutions.mjs';
const game=id=>games.find(g=>g.id===id);
test('Stock records only an earlier minimum and the best nonnegative profit',()=>{
 const g=game('stock');let s=newRound(g);
 assert.equal(move(g,s,'profit').error,true);assert.equal(s.minimum,null);
 for(const action of ['low','low','profit','skip','profit','skip'])s=move(g,s,action);
 assert.equal(s.done,true);assert.equal(s.best,5);assert.equal(s.minimum,1);
 assert.deepEqual(move(g,s,'profit'),s);
 s=newRound(g,1);for(const _ of g.rounds[1].values)s=move(g,s,'low');
 assert.equal(s.done,true);assert.equal(s.best,0);
});
test('Anagram uses duplicate letters separately and only rejects missing matches',()=>{
 const g=game('anagram');let s=newRound(g);
 assert.equal(move(g,s,'reject').error,true);assert.equal(move(g,s,'match',0).error,true);
 assert.equal(move(g,s,'match',99).error,true);
 for(const i of [2,0,0])s=move(g,s,'match',i);
 assert.equal(s.done,true);assert.equal(s.memory.length,0);
 s=newRound(g,1);s=move(g,s,'match',0);s=move(g,s,'match',1);
 assert.equal(s.memory.length,1);assert.equal(move(g,s,'match',0).error,true);
 s=move(g,s,'reject');assert.equal(s.done,true);assert.match(s.message,/false/);
 const leftover={...g,rounds:[{source:'aa',values:['a']}]};
 assert.match(move(leftover,newRound(leftover),'match',0).message,/unused/);
});
test('Stairs sums disjoint one-step and two-step routes and resets between rounds',()=>{
 const g=game('stairs');let s=newRound(g);
 const wrong=move(g,s,'ways',3);assert.equal(wrong.error,true);assert.equal(wrong.index,2);assert.deepEqual(wrong.memory,s.memory);
 for(const total of [2,3,5])s=move(g,s,'ways',total);
 assert.equal(s.done,true);assert.equal(s.memory.at(-1).value,5);
 s=newRound(g,1);assert.equal(s.memory.length,2);
 for(const total of [2,3,5,8])s=move(g,s,'ways',total);
 assert.equal(s.done,true);assert.equal(s.memory.at(-1).value,8);
});
test('New exercises have strict scalar validation and executable JavaScript edge cases',()=>{

 for(const [i,g] of games.entries()){
  if(!g.signature)continue;
  const result=executeJavaScript({code:solutions.javascript[i],fn:g.fn,mutates:g.mutates,tests:g.tests.map(t=>t.args)});
  assert.equal(result.error,undefined);
  result.results.forEach((r,j)=>assert.equal(accepts(g,g.tests[j],r.value),true,`${g.id} case ${j}`));
  assert.equal(accepts(g,g.tests[0],g.signature.result==='string'?123:String(g.tests[0].expected)),false);
  assert.equal(accepts(g,g.tests[0],null),false);
  assert.ok(!roadmap[g.category].some(p=>p.number===g.number));
 }
});
