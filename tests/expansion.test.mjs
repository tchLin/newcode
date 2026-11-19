import test from 'node:test';
import assert from 'node:assert/strict';
import {games,newRound,move,accepts} from '../dist/arcade/logic.mjs';
import {buildTrace} from '../dist/arcade/expansion-traces.mjs';
import {expansionBoard} from '../dist/arcade/expansion-ui.mjs';
import {starter,buildProgram} from '../dist/arcade/languages.mjs';
const added=games.filter(g=>g.expansion);
test('The thirty-game expansion retains two interactive rounds within the full collection',()=>{
 assert.equal(added.length,30);assert.equal(games.length,75);assert.equal(new Set(games.map(g=>g.number)).size,75);
 for(const g of added){assert.equal(g.rounds.length,2);for(let round=0;round<2;round++){
  let s=newRound(g,round),count=0;assert.ok(s.trace.steps.length>1,g.problem);
  while(!s.done){const before=structuredClone(s),step=s.trace.steps[s.index];assert.ok(step.correct>=0&&step.correct<step.choices.length,g.problem);assert.ok(!expansionBoard(g,s).includes('undefined'),g.problem);for(let i=0;i<step.choices.length;i++)if(i!==step.correct){const wrong=move(g,s,'decide',i);assert.equal(wrong.error,true);assert.equal(wrong.index,s.index);}assert.equal(move(g,s,'invalid',step.correct).error,true);s=move(g,s,'decide',step.correct);assert.deepEqual(before.trace,s.trace);assert.ok(++count<200,g.problem);}
  assert.deepEqual(move(g,s,'decide',0),s);
 }}
});
test('Every walkthrough result agrees with independent test fixtures without mutating inputs',()=>{
 for(const g of added)for(const t of g.tests){const before=structuredClone(t.args),trace=buildTrace(g,t.args);assert.ok(accepts(g,t,trace.answer),`${g.number}: ${JSON.stringify(t.args)} => ${JSON.stringify(trace.answer)}`);assert.deepEqual(t.args,before);}
});
test('Collection validation accepts valid ordering and rejects duplicates, wrong rows and coercions',()=>{
 const get=n=>games.find(g=>g.number===n);
 let g=get(15),t=g.tests[0];assert.ok(accepts(g,t,[[1,0,-1],[2,-1,-1]]));assert.equal(accepts(g,t,[[-1,0,1],[-1,0,1]]),false);
 g=get(347);t=g.tests[0];assert.ok(accepts(g,t,[2,1]));assert.equal(accepts(g,t,[1,1]),false);assert.equal(accepts(g,t,['1','2']),false);
 g=get(417);t=g.tests[0];assert.ok(accepts(g,t,[...t.expected].reverse()));assert.equal(accepts(g,t,[[1,0],[0,1],[1,0]]),false);
 g=get(5);t=g.tests[0];assert.ok(accepts(g,t,'aba'));assert.equal(accepts(g,t,'bad'),false);assert.equal(accepts(g,t,'a'),false);
 g=get(238);t=g.tests[0];assert.equal(accepts(g,t,[...t.expected].reverse()),false);
});
test('New native signatures preserve mutation, sizes, string dictionaries and unsigned results',()=>{
 const get=n=>games.find(g=>g.number===n);
 assert.match(starter(get(73),'c'),/void setZeroes\(int\*\* matrix, int matrixSize, int\* matrixColSize\)/);
 assert.match(starter(get(48),'rust'),/matrix: &mut Vec<Vec<i32>>/);
 assert.match(starter(get(15),'c'),/int\* returnSize, int\*\* returnColumnSizes/);
 assert.match(starter(get(139),'go'),/wordDict \[\]string/);
 assert.match(starter(get(190),'rust'),/n: u32/);
 assert.match(buildProgram(get(190),'java',starter(get(190),'java')),/Integer.toUnsignedLong\(value\)/);
 assert.match(buildProgram(get(73),'python',starter(get(73),'python')),/_aa_value = _aa_args\[0\]/);
});
