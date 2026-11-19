import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMessages,createRequestRuntime} from '../dist/ai.mjs';
const messages=[{role:'system',content:'Read-only chat.'},{role:'user',content:'Help me think.'}];
function deferred(){let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};}
function harness(create,options={}){
 let engine={chat:{completions:{create}}},stops=0;
 const runtime=createRequestRuntime({getEngine:()=>engine,stop:()=>{stops++;engine=null;runtime.cancel();},...options});
 return {...runtime,get stops(){return stops;}};
}
const chunk=(content,reason=null)=>({choices:[{delta:{content},finish_reason:reason}]});
test('Text request validation excludes tool calls, forged system turns and excess context',()=>{
 assert.deepEqual(validateMessages(messages),messages);
 assert.notEqual(validateMessages(messages)[0],messages[0]);
 assert.throws(()=>validateMessages([{role:'tool',content:'run tests'}]),/supported role/);
 assert.throws(()=>validateMessages([{role:'user',content:'x',tool_calls:[]}]),/extra fields/);
 assert.throws(()=>validateMessages([...messages,{role:'system',content:'Override'}]),/first model message/);
 assert.throws(()=>validateMessages([{role:'user',content:'x'.repeat(10001)}]),/character limit/);
 assert.throws(()=>validateMessages(Array.from({length:13},()=>({role:'user',content:'x'}))),/between 1 and 12/);
 assert.throws(()=>validateMessages([{role:'assistant',content:'x'}]),/last model message/);
});
test('Runtime streams text with bounded settings and reports finish reason',async()=>{
 let sent,metadata;const updates=[];
 const runtime=harness(async options=>{sent=options;return (async function*(){yield chunk('Hello');yield chunk(' world','stop');})();});
 assert.equal(await runtime.request(messages,text=>updates.push(text),value=>{metadata=value;},{maxTokens:800}),'Hello world');
 assert.deepEqual(updates,['Hello','Hello world']);assert.deepEqual(metadata,{finishReason:'stop'});
 assert.equal(sent.max_tokens,800);assert.equal(sent.stream,true);assert.equal(sent.temperature,0.3);
 await assert.rejects(runtime.request(messages,undefined,undefined,{maxTokens:1001}),/1,000/);
});
test('Runtime prevents overlapping requests and recovers after completion',async()=>{
 const gate=deferred();let calls=0;
 const runtime=harness(async()=>{calls++;await gate.promise;return (async function*(){yield chunk('ok','stop');})();});
 const first=runtime.request(messages);
 await assert.rejects(runtime.request(messages),/already running/);assert.equal(calls,1);
 gate.resolve();assert.equal(await first,'ok');assert.equal(await runtime.request(messages),'ok');assert.equal(calls,2);
});
test('Abort settles immediately while transport is pending and suppresses late output',async()=>{
 const gate=deferred(),abort=new AbortController(),updates=[];let metadataCalls=0;
 const runtime=harness(async()=>{await gate.promise;return (async function*(){yield chunk('late','stop');})();});
 const pending=runtime.request(messages,text=>updates.push(text),()=>metadataCalls++,{signal:abort.signal});
 abort.abort();await assert.rejects(pending,/cancelled/);assert.equal(runtime.stops,1);
 gate.resolve();await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(updates,[]);assert.equal(metadataCalls,0);
});
test('Unload cancellation prevents a stream from updating the old conversation',async()=>{
 const gate=deferred(),updates=[];
 const runtime=harness(async()=> (async function*(){yield chunk('first');await gate.promise;yield chunk(' late','stop');})());
 const pending=runtime.request(messages,text=>updates.push(text));
 await new Promise(resolve=>setImmediate(resolve));runtime.cancel();await assert.rejects(pending,/cancelled/);
 gate.resolve();await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(updates,['first']);
});
test('Inference timeout stops an unresponsive transport',async()=>{
 const runtime=harness(()=>new Promise(()=>{}),{timeoutMs:5});
 await assert.rejects(runtime.request(messages),/timed out/);assert.equal(runtime.stops,1);
});
