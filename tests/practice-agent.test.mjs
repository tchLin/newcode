import test from 'node:test';
import assert from 'node:assert/strict';
import {runAgent,parseAgentAction,buildAgentMessages} from '../dist/practice-agent.mjs';
function harness(actions,overrides={}){
 const files={'answer.js':'function answer() { return 0; }'},events=[],requests=[],applied=[];
 let index=0;
 const options={prompt:'Fix the function.',problem:'Return 42.',language:'javascript',readFiles:()=>({...files}),generate:async messages=>{requests.push(messages);const action=actions[index++];return typeof action==='string'?action:JSON.stringify(action);},approveEdit:async()=>true,applyEdit:({file,before,after})=>{assert.equal(files[file],before);files[file]=after;applied.push(file);},runTests:async()=>({status:'completed',results:[{passed:files['answer.js'].includes('42')}]}),onEvent:(type,data)=>events.push({type,...data}),...overrides};
 return {options,files,events,requests,applied,run:()=>runAgent(options)};
}
const read={action:'read_file',file:'answer.js'};
const edit={action:'propose_edit',file:'answer.js',content:'function answer() { return 42; }',reason:'Return the required value.'};
const done={action:'finish',summary:'Applied the reviewed edit and passed the test.'};
test('agent reads, gets explicit approval, applies, tests and finishes with an auditable log',async()=>{
 const h=harness([read,edit,{action:'run_tests'},done]);const result=await h.run();
 assert.equal(result.status,'completed');assert.equal(result.steps,4);assert.equal(h.files['answer.js'],edit.content);
 assert.deepEqual(h.events.filter(e=>e.action?.action==='propose_edit').map(e=>e.status),['awaiting_approval','accepted','applied']);
 assert.equal(h.events.filter(e=>e.type==='agent.request').length,4);
 assert.match(h.requests[2].at(-1).content,/"applied":true/);
 assert.match(h.requests[3].at(-1).content,/"passed":true/);
 assert.equal(h.events.at(-1).type,'agent.finished');
});
test('agent tool boundary rejects external files, shell tools, extra fields and multiple actions',()=>{
 for(const action of [{action:'read_file',file:'../secrets'},{action:'read_file',file:'/tmp/answer.js'},{action:'shell',command:'curl example.com'},{action:'run_tests',command:'npm test'},{action:'propose_edit',file:'answer.js',content:'x',reason:'ok',url:'https://example.com'},[{action:'run_tests'}]])assert.throws(()=>parseAgentAction(JSON.stringify(action),['answer.js']));
 assert.throws(()=>parseAgentAction('{"action":"run_tests","__proto__":{}}',['answer.js']));
 assert.throws(()=>parseAgentAction(''.padEnd(12001,'x'),['answer.js']),/large/);
 assert.deepEqual(parseAgentAction('```json\n{"action":"run_tests"}\n```',['answer.js']),{action:'run_tests'});
});
test('rejected proposal never edits, and the model receives rejection feedback',async()=>{
 const h=harness([read,edit,done],{approveEdit:async()=>false});await h.run();
 assert.deepEqual(h.applied,[]);assert.match(h.requests[2].at(-1).content,/User rejected/);
 assert.ok(h.events.some(e=>e.status==='rejected'));assert.ok(!h.events.some(e=>e.status==='accepted'));
});
test('truthy nonboolean approval does not authorize a change',async()=>{
 const h=harness([read,edit,done],{approveEdit:async()=>({approved:true})});await h.run();assert.deepEqual(h.applied,[]);
});
test('edits require a read of the same current file',async()=>{
 const h=harness([edit,done]);await h.run();assert.deepEqual(h.applied,[]);assert.match(h.requests[1].at(-1).content,/Read this file/);
});
test('edits cannot overwrite manual changes made during approval',async()=>{
 const h=harness([read,edit,done]);h.options.approveEdit=async()=>{h.files['answer.js']='manual changes';return true;};await h.run();
 assert.equal(h.files['answer.js'],'manual changes');assert.deepEqual(h.applied,[]);assert.ok(h.events.some(e=>e.status==='accepted'));assert.ok(h.events.some(e=>e.status==='error'&&/changed while approval/.test(e.error)));assert.ok(!h.events.some(e=>e.status==='applied'));
});
test('failed application is distinguished from an accepted proposal',async()=>{
 const h=harness([read,edit,done],{applyEdit:()=>{throw new Error('Editor is gone.');}});await h.run();assert.ok(h.events.some(e=>e.status==='accepted'));assert.ok(!h.events.some(e=>e.status==='applied'));assert.match(h.requests[2].at(-1).content,/Editor is gone/);
});
test('invalid actions consume the bounded step budget without running capabilities',async()=>{
 let testRuns=0;const h=harness(Array(3).fill('not JSON'),{maxSteps:3,runTests:async()=>testRuns++});const result=await h.run();
 assert.equal(result.status,'step_limit');assert.equal(result.steps,3);assert.equal(testRuns,0);assert.equal(h.requests.length,3);
 assert.equal((await runAgent({...h.options,maxSteps:100})).status,'error');
});
test('stop during approval returns promptly and late approval cannot apply',async()=>{
 const controller=new AbortController();let resolveApproval,started;
 const approvalStarted=new Promise(resolve=>started=resolve);
 const h=harness([read,edit,done],{signal:controller.signal,approveEdit:()=>{started();return new Promise(resolve=>resolveApproval=resolve);}});
 const running=h.run();await approvalStarted;controller.abort();const result=await running;resolveApproval(true);await Promise.resolve();
 assert.equal(result.status,'cancelled');assert.deepEqual(h.applied,[]);assert.equal(h.requests.length,2);
});
test('stop during inference ignores late model output and never calls tools',async()=>{
 const controller=new AbortController();let finish,started;const startedPromise=new Promise(resolve=>started=resolve);
 const h=harness([],{signal:controller.signal,generate:()=>{started();return new Promise(resolve=>finish=resolve);}});
 const running=h.run();await startedPromise;controller.abort();const result=await running;finish(JSON.stringify(edit));await Promise.resolve();
 assert.equal(result.status,'cancelled');assert.deepEqual(h.applied,[]);assert.ok(h.events.some(e=>e.type==='agent.request'&&e.status==='cancelled'));
});
test('tool failures become feedback and do not fabricate successful tests',async()=>{
 const h=harness([{action:'run_tests'},done],{runTests:async()=>{throw new Error('Execution unavailable.');}});await h.run();
 assert.match(h.requests[1].at(-1).content,/Execution unavailable/);assert.ok(h.events.some(e=>e.action?.action==='run_tests'&&e.status==='error'));
});
test('agent context stays within inference bounds with maximum file names and input sizes',()=>{
 const messages=buildAgentMessages({prompt:'p'.repeat(10000),problem:'s'.repeat(10000),language:'l'.repeat(1000),files:Array.from({length:16},(_,i)=>`${i}`.padEnd(100,'f')),feedback:'r'.repeat(10000),history:Array(6).fill('h'.repeat(1000))});
 assert.ok(messages.reduce((sum,m)=>sum+m.content.length,0)<=10000);assert.equal(messages.length,2);assert.equal(messages.at(-1).role,'user');
});
test('a 6,000-character file cannot be replaced after a clipped read',async()=>{
 let approvals=0;
 const h=harness([read,edit,done],{approveEdit:async()=>{approvals++;return true;}});h.files['answer.js']='x'.repeat(6000);
 await h.run();assert.equal(approvals,0);assert.equal(h.files['answer.js'].length,6000);
 assert.match(h.requests[1].at(-1).content,/Partial read/);assert.match(h.requests[2].at(-1).content,/cannot be edited/);
 const readResult=h.events.find(e=>e.action?.action==='read_file').result;
 assert.equal(readResult.truncated,true);assert.ok(JSON.stringify(readResult).length<=4000);
});
test('escaping expansion cannot turn a partial read into replacement permission',async()=>{
 const h=harness([read,edit,done]);h.files['answer.js']='\\\n"'.repeat(1000);await h.run();assert.deepEqual(h.applied,[]);
 const readResult=h.events.find(e=>e.action?.action==='read_file').result;
 assert.equal(readResult.truncated,true);assert.ok(JSON.stringify(readResult).length<=4000);
});
test('an old read cannot authorize replacement when its source is no longer in context',async()=>{
 const h=harness([read,{action:'run_tests'},edit,done]);await h.run();assert.deepEqual(h.applied,[]);assert.match(h.requests[3].at(-1).content,/full source is in context/);
});
