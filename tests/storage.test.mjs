import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBackup,read,write} from '../dist/storage.mjs';
import {games} from '../dist/arcade/logic.mjs';
import {labs} from '../dist/labs.mjs';
test('Backup validation preserves empty drafts, language completions, and lab notes',()=>{
 const source={format:'newcode-v1',progress:{'two-sum':{drafts:{javascript:'',python:'pass'},solvedLanguages:{python:true},bookmark:true}},labs:{cache:{files:{'cache.js':''},solved:true,notes:'Review TTL',mode:'strict'}}};
 const result=validateBackup(source,games,labs);assert.equal(result.progress['two-sum'].drafts.javascript,'');assert.equal(result.progress['two-sum'].solved,true);assert.equal(result.labs.cache.files['cache.js'],'');assert.equal(result.labs.cache.mode,'strict');assert.equal(result.labs.cache.notes,'Review TTL');
});
test('Backup validation rejects foreign data and strips unknown files and metadata',()=>{
 assert.throws(()=>validateBackup({},games,labs),/Newcode/);
 const result=validateBackup({format:'newcode-v1',progress:{unknown:{solved:true},'two-sum':{drafts:{evil:'x'},solvedLanguages:{evil:true}}},labs:{cache:{files:{'cache.js':'ok','evil.js':'bad'},deadline:123,messages:[{role:'system',content:'bad'}]}}},games,labs);
 assert.equal(result.progress.unknown,undefined);assert.equal(result.progress['two-sum'].solved,false);assert.deepEqual(result.labs.cache.files,{'cache.js':'ok'});assert.equal(result.labs.cache.deadline,undefined);assert.equal(result.labs.cache.messages,undefined);
});
test('Unavailable storage and malformed JSON do not prevent startup',()=>{
 globalThis.localStorage={getItem(){throw new Error('blocked');},setItem(){throw new Error('quota');}};assert.deepEqual(read('test'),{});assert.equal(write('test',{}),false);
 for(const value of ['no json','null','[]','4']){globalThis.localStorage.getItem=()=>value;assert.deepEqual(read('test'),{});}delete globalThis.localStorage;
});
