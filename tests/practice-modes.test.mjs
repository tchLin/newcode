import test from 'node:test';
import assert from 'node:assert/strict';
import {modes,normalizeMode,capabilitiesFor} from '../dist/practice-modes.mjs';
import {getHints} from '../dist/practice-hints.mjs';
import {games} from '../dist/arcade/logic.mjs';
import {languages} from '../dist/arcade/languages.mjs';
import {labs} from '../dist/labs.mjs';

test('Solo and hints-only cannot grant model or agent capabilities',()=>{
 for(const mode of ['solo','strict','hints']){
  const capabilities=capabilitiesFor(mode);
  assert.equal(capabilities.aiChat,false);
  assert.equal(capabilities.agent,false);
  assert.throws(()=>{capabilities.aiChat=true;},TypeError);
 }
 assert.equal(capabilitiesFor('solo').curatedHints,false);
 assert.equal(capabilitiesFor('hints').curatedHints,true);
});

test('Legacy mode values preserve independent practice versus manual chat',()=>{
 assert.equal(normalizeMode('strict'),'solo');
 assert.equal(normalizeMode('assisted'),'chat');
 assert.equal(capabilitiesFor('assisted').aiChat,true);
 assert.equal(capabilitiesFor('assisted').agent,false);
 for(const value of [undefined,null,'future-mode','__proto__','constructor']){
  assert.equal(normalizeMode(value),'chat');
  assert.equal(capabilitiesFor(value).agent,false);
 }
 for(const mode of modes)assert.equal(normalizeMode(mode.id),mode.id);
 assert.equal(capabilitiesFor('agent').agent,true);
 assert.equal(capabilitiesFor('chat').agent,false);
});

test('Every catalog exercise has three distinct usable hints across all supported languages',()=>{
 for(const problem of games){
  for(const language of languages){
   const hints=getHints(problem,language.id);
   assert.equal(hints.length,3,`${problem.id}/${language.id}`);
   assert.equal(new Set(hints.map(hint=>hint.id)).size,3);
   assert.equal(new Set(hints.map(hint=>hint.text)).size,3);
   assert.ok(hints.every(hint=>hint.title&&hint.text.length>30));
   assert.ok(hints.every(hint=>!hint.text.includes('undefined')));
   assert.ok(hints.every(hint=>!hint.text.includes(problem.hint)),`Full legacy recipe leaked for ${problem.id}`);
  }
 }
 const twoSum=games.find(problem=>problem.id==='two-sum');
 assert.match(getHints(twoSum,'c')[2].text,/malloc/);
 assert.match(getHints(twoSum,'rust')[2].text,/struct Solution/);
 assert.deepEqual(getHints(twoSum,'unknown'),getHints(twoSum,'javascript'));
});

test('Lab hints focus on critical boundaries and do not leak mutable shared content',()=>{
 const all=labs.map(problem=>getHints(problem));
 assert.ok(all.every(hints=>hints.length===3));
 assert.match(all[0].map(hint=>hint.text).join(' '),/false or zero/);
 assert.match(all[1].map(hint=>hint.text).join(' '),/exactly full final page/);
 assert.match(all[2].map(hint=>hint.text).join(' '),/outside the window/);
 const original=all[0][0].text;
 all[0][0].text='Changed by a caller';
 all[0].pop();
 assert.equal(getHints(labs[0]).length,3);
 assert.equal(getHints(labs[0])[0].text,original);
});

test('Unknown exercises do not inherit an unrelated exercise hint',()=>{
 for(const problem of [null,{}, {id:'__proto__'}, {id:'not-an-exercise'}])assert.deepEqual(getHints(problem),[]);
});
