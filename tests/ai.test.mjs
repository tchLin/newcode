import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMessages,connect,unload,ready,ask} from '../dist/ai.mjs';
test('AI context is bounded and only uses the latest conversation pair',()=>{
 const messages=buildMessages('p'.repeat(5000),'c'.repeat(20000),Array.from({length:40},(_,i)=>({role:i%2?'assistant':'user',content:'h'.repeat(5000)})));
 assert.equal(messages.length,4);assert.ok(messages[0].content.length<4300);assert.equal(messages[1].content.length,450);assert.equal(messages.at(-1).content.length,1000);
});
test('AI reports unsupported browsers without attempting model downloads',async()=>{
 await assert.rejects(connect(()=>{}),/WebGPU/);assert.equal(ready(),false);await assert.rejects(ask('x','',[],()=>{}),/Load the local model/);
});
test('Cancelling while the GPU adapter is pending prevents a later download',async()=>{
 let finish;Object.defineProperty(globalThis.navigator,'gpu',{configurable:true,value:{requestAdapter:()=>new Promise(resolve=>{finish=resolve;})}});
 const pending=connect(()=>{});unload();finish({});await assert.rejects(pending,/cancelled/);assert.equal(ready(),false);delete globalThis.navigator.gpu;
});
