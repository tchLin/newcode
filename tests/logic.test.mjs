import {executeJavaScript} from '../dist/arcade/javascript-runner.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {games,newRound,move,accepts,categories,roadmap} from '../dist/arcade/logic.mjs';

test('Two Sum requires checking complements before storing and returns both rounds',()=>{
 const g=games[0];
 for(let r=0;r<g.rounds.length;r++){
  let s=newRound(g,r);
  s=move(g,s,'store');s=move(g,s,'store');
  const wrong=move(g,s,'store');assert.equal(wrong.error,true);assert.equal(wrong.index,s.index);
  const match=s.memory.findIndex(x=>x.value+g.rounds[r].values[s.index]===g.rounds[r].target);
  assert.equal(move(g,s,'match',1-match).error,true);
  s=move(g,s,'match',match);assert.equal(s.done,true);
  assert.deepEqual(move(g,s,'store'),s);
 }
});
test('Duplicate game distinguishes unseen values, repeats, and all-unique input',()=>{
 const g=games[1];let s=newRound(g);
 assert.equal(move(g,s,'duplicate').error,true);
 for(let i=0;i<3;i++)s=move(g,s,'store');
 assert.equal(move(g,s,'store').error,true);
 assert.equal(move(g,s,'duplicate').done,true);
 s=newRound(g,1);for(let i=0;i<3;i++)s=move(g,s,'store');
 assert.equal(s.done,true);assert.match(s.message,/false/);
});
test('Bracket game enforces nesting and rejects mismatched closers',()=>{
 const g=games[2];let s=newRound(g);
 assert.equal(move(g,s,'reject').error,true);
 for(const action of ['push','push','pop','pop'])s=move(g,s,action);
 assert.equal(s.done,true);assert.equal(s.memory.length,0);
 s=newRound(g,1);s=move(g,s,'push');s=move(g,s,'push');
 assert.equal(move(g,s,'pop').error,true);assert.equal(move(g,s,'push').error,true);
 assert.equal(move(g,s,'reject').done,true);
});
test('Two Sum validation accepts either order and rejects reusing an index',()=>{
 const g=games[0], t=g.tests[0];
 assert.equal(accepts(g,t,[0,1]),true);assert.equal(accepts(g,t,[1,0]),true);
 for(const invalid of [[0,0],[2,3],[-1,1],[0,1,2],['0',1],null])assert.equal(accepts(g,t,invalid),false);
 assert.equal(accepts(g,g.tests[2],[0,1]),true);
 assert.equal(accepts(g,g.tests[2],[0,0]),false);
 assert.equal(accepts(games[1],games[1].tests[0],1),false);
});
test('Catalog counts match playable games and planned exercises',()=>{
 for(const [name,,count] of categories)assert.equal(games.filter(g=>g.category===name||g.alsoCategories?.includes(name)).length+roadmap[name].length,count);
});
function run(g,code){return executeJavaScript({code,fn:g.fn,tests:g.tests.map(t=>t.args)});}
test('Runner executes correct reference solutions against edge cases',()=>{
 const solutions=[
 'function twoSum(nums,target){const seen=new Map();for(let i=0;i<nums.length;i++){if(seen.has(target-nums[i]))return [seen.get(target-nums[i]),i];seen.set(nums[i],i);}}',
 'function containsDuplicate(nums){return new Set(nums).size!==nums.length;}',
 "function isValid(s){const stack=[],pairs={')':'(',']':'[','}':'{'};for(const c of s){if('([{'.includes(c))stack.push(c);else if(stack.pop()!==pairs[c])return false;}return stack.length===0;}"
 ];
 games.slice(0,3).forEach((g,i)=>{const result=run(g,solutions[i]);assert.equal(result.error,undefined);result.results.forEach((r,j)=>assert.equal(accepts(g,g.tests[j],r.value),true));});
});
test('Runner reports syntax errors, missing functions, exceptions, and invalid return types',()=>{
 const g=games[0];assert.ok(run(g,'function {').error);assert.match(run(g,'const x=1;').error,/Define a function/);
 assert.match(run(g,'function twoSum(){throw new Error("try again")}').results[0].error,/try again/);
 assert.match(run(g,'function twoSum(){return {wrong:true}}').results[0].error,/Return a boolean/);
});
