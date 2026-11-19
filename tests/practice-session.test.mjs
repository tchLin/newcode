import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,recordEvent,completeEvent,snapshot,updateFinal,finishSession,sessionMessages} from '../dist/session-log.mjs';
import {buildSessionExport} from '../dist/session-export.mjs';
import {validateBackup} from '../dist/storage.mjs';
import {games} from '../dist/arcade/logic.mjs';
import {labs} from '../dist/labs.mjs';

test('All four modes survive progress export/import and legacy aliases migrate',()=>{
 for(const [input,expected] of [['solo','solo'],['hints','hints'],['chat','chat'],['agent','agent'],['strict','solo'],['assisted','chat']]){
  const value=validateBackup({format:'newcode-v1',progress:{'two-sum':{mode:input}},labs:{cache:{mode:input}}},games,labs);
  assert.equal(value.progress['two-sum'].mode,expected);assert.equal(value.labs.cache.mode,expected);
 }
});

test('Review export retains assistance evidence and separates agent claims from actions',()=>{
 const session=createSession({id:'cache',title:'Cache',prompt:'Fix the cache.',track:'interview-lab'},'solo','test-model');
 updateFinal(session,{'cache.js':'original'},'javascript','Reviewed the edit.');const before=snapshot(session,session.final.files,'javascript');
 recordEvent(session,'mode.changed',{mode:'hints'});recordEvent(session,'hint.revealed',{mode:'hints',level:1,text:'Check expiry.'});
 recordEvent(session,'mode.changed',{mode:'agent'});
 recordEvent(session,'agent.run',{mode:'agent',prompt:'Fix expiry',status:'completed',summary:'All fixed',snapshotId:before});
 const request=recordEvent(session,'agent.request',{mode:'agent',step:1,request:[{role:'user',content:'Fix expiry'}],response:'{"action":"finish","summary":"All fixed"}',status:'running',snapshotId:before});
 completeEvent(session,request,{status:'completed'});
 recordEvent(session,'agent.action',{mode:'agent',status:'accepted',action:{action:'propose_edit',file:'cache.js'}});
 recordEvent(session,'agent.action',{mode:'agent',status:'error',action:{action:'propose_edit',file:'cache.js'},error:'Stale file'});
 recordEvent(session,'agent.action',{mode:'agent',status:'rejected',action:{action:'propose_edit',file:'cache.js'}});
 recordEvent(session,'test.run',{status:'completed',mode:'agent',language:'javascript',provider:'browser',results:[{name:'TTL',passed:false}],snapshotId:before});
 finishSession(session);
 const result=buildSessionExport(session),metrics=result.session.analysis.metrics;
 assert.equal(metrics.agentEditsApplied,0);assert.equal(metrics.agentEditsRejected,1);assert.equal(metrics.agentInvalidActions,1);
 assert.equal(metrics.prompts,1);assert.equal(metrics.hintsOpened,1);assert.equal(metrics.latestPassed,0);assert.equal(metrics.byMode.agent.aiRequests,1);
 assert.deepEqual(metrics.modesUsed,['solo','hints','agent']);
 assert.match(result.files['report.md'],/Stale file/);assert.match(result.files['report.md'],/Check expiry/);
 assert.match(result.session.analysis.limitations.join(' '),/model claims/);
 assert.ok(sessionMessages(session).some(message=>message.content.includes('Fix expiry')));
 assert.equal(result.session.snapshots[0].files['cache.js'],'original');
});

test('Navigation interrupts outstanding agent requests without losing partial output',()=>{
 const session=createSession({id:'cache'},'agent','test-model');
 const event=recordEvent(session,'agent.request',{status:'running',response:'{"action":',step:1});finishSession(session);
 assert.equal(event.status,'interrupted');assert.equal(event.response,'{"action":');
 assert.equal(completeEvent(session,event,{status:'completed',response:'late'}),false);
});

test('Agent-only sessions report AI activity even before any tests',()=>{
 const session=createSession({id:'cache',title:'Cache'},'solo','test-model');
 recordEvent(session,'mode.changed',{mode:'agent'});
 recordEvent(session,'agent.request',{mode:'agent',status:'completed',step:1,response:'read_file'});
 const exported=buildSessionExport(session);
 assert.deepEqual(exported.session.analysis.metrics.byMode,{solo:{testAttempts:0,aiRequests:0},agent:{testAttempts:0,aiRequests:1}});
 assert.equal(exported.session.analysis.metrics.prompts,1);
 assert.doesNotMatch(exported.files['report.md'],/No AI requests were recorded/);
});
