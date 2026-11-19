import test from 'node:test';
import assert from 'node:assert/strict';
import {Worker as NodeWorker} from 'node:worker_threads';
import {runJavaScript} from '../dist/arcade/execution.mjs';
import {games,accepts} from '../dist/arcade/logic.mjs';
import {labSolutions} from './fixtures/lab-solutions.mjs';
// Exercise the browser worker entry points with Node's worker transport.
class BrowserWorker {
 constructor(url){assert.ok(url instanceof URL,'Worker path must be relative to its module, not the document');this.worker=new NodeWorker(new URL('./helpers/browser-worker.mjs',import.meta.url),{workerData:url.href});this.worker.on('message',data=>this.onmessage?.({data}));this.worker.on('error',error=>this.onerror?.({message:error.message,preventDefault(){}}));}
 postMessage(data){this.worker.postMessage(data);}
 terminate(){this.worker.terminate();}
}
globalThis.Worker=BrowserWorker;
test('JavaScript execution works after moving the runner into arcade/',async()=>{
 const g=games.find(g=>g.id==='two-sum');const code='function twoSum(nums,target){const m=new Map();for(let i=0;i<nums.length;i++){if(m.has(target-nums[i]))return [m.get(target-nums[i]),i];m.set(nums[i],i);}}';
 const data=await runJavaScript(g,code,new AbortController().signal);assert.ok(!data.error,JSON.stringify(data));assert.equal(data.results.length,g.tests.length);assert.ok(data.results.every((r,i)=>accepts(g,g.tests[i],r.value)));
});
test('An infinite program is terminated without blocking the application',async()=>{
 const data=await runJavaScript(games[0],'function twoSum(){while(true){}}',new AbortController().signal);assert.match(data.error,/Stopped after 2 seconds/);
});
test('Cancellation stops an active worker and a subsequent run succeeds',async()=>{
 const control=new AbortController();const pending=runJavaScript(games[0],'function twoSum(){while(true){}}',control.signal);control.abort();await assert.rejects(pending,{name:'AbortError'});
 const g=games.find(g=>g.id==='duplicate');const data=await runJavaScript(g,'function containsDuplicate(nums){return new Set(nums).size!==nums.length;}',new AbortController().signal);assert.ok(data.results.every((r,i)=>accepts(g,g.tests[i],r.value)));
});
test('Multi-file lab worker executes its actual browser entry point',async()=>{
 const data=await new Promise((resolve,reject)=>{const w=new BrowserWorker(new URL('../dist/lab-runner.mjs',import.meta.url));w.onmessage=e=>{w.terminate();resolve(e.data);};w.onerror=e=>{w.terminate();reject(new Error(e.message));};w.postMessage({id:'pagination',files:labSolutions.pagination});});assert.ok(data.results.every(r=>r.passed));
});
