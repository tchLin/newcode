import test from 'node:test';
import assert from 'node:assert/strict';
import {labs} from '../dist/labs.mjs';
import {evaluateLab,loadProject} from '../dist/lab-tests.mjs';
import {labSolutions} from './fixtures/lab-solutions.mjs';
for(const lab of labs){
 test(`${lab.id}: reference solution passes every named acceptance check`,async()=>{
  const results=await evaluateLab(lab.id,labSolutions[lab.id]);assert.equal(results.length,lab.cases.length);assert.deepEqual(results.map(r=>r.name),lab.cases);assert.ok(results.every(r=>r.passed),JSON.stringify(results));
 });
 test(`${lab.id}: incomplete starter cannot award completion`,async()=>{const results=await evaluateLab(lab.id,lab.files);assert.ok(results.some(r=>!r.passed));});
}
test('A runtime error is reported for each affected lab case',async()=>{
 const files={...labSolutions.cache,'service.js':'module.exports.lookup=()=>{throw new Error("intentional failure");}'};
 const results=await evaluateLab('cache',files);assert.equal(results.filter(r=>!r.passed).length,2);assert.ok(results.slice(-2).every(r=>r.error.includes('intentional failure')));
});
test('Project modules resolve relative paths and cache exports',()=>{
 const load=loadProject({'a.js':'module.exports = {value: Math.random()};','b.js':"module.exports = require('./a.js');"});assert.equal(load('a.js'),load('b.js'));assert.throws(()=>load('missing.js'),/Unknown module/);
});
test('Lab runner rejects malformed code and unknown exercises',async()=>{
 await assert.rejects(evaluateLab('cache',{'cache.js':'function {'}),SyntaxError);await assert.rejects(evaluateLab('unknown',{}),/Unknown lab/);
});
