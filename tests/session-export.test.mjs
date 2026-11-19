import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createSession,recordEvent,snapshot,updateFinal,completeEvent,finishSession,sessionMessages,analyzeSession} from '../dist/session-log.mjs';
import {buildSessionJSON,buildSessionExport,sessionZip} from '../dist/session-export.mjs';
import {crc32,zipFiles} from '../dist/zip.mjs';
import {saveSession,listSessions,getSession} from '../dist/session-store.mjs';
const at=n=>new Date(Date.UTC(2026,10,19,16,0,n)).toISOString();
const make=()=>createSession({id:'two-sum',title:'Two Sum',prompt:'Return two indices.',track:'algorithm',difficulty:'Easy'},'assisted','test-model',at(0));
function turn(s,n=10){return recordEvent(s,'ai.turn',{prompt:'What happens with duplicates?\n你好',response:'',request:[{role:'system',content:'Exact context'},{role:'user',content:'What happens with duplicates?\n你好'}],selectedFile:'solution.js',includeCode:true,language:'javascript',snapshotId:snapshot(s,{'solution.js':'// initial'},'javascript',at(n)),status:'streaming'},at(n));}
function run(s,passed,n=20,language='javascript'){const e=recordEvent(s,'test.run',{status:'running',language,provider:'browser',snapshotId:snapshot(s,{'solution.js':'// revision'},language,at(n))},at(n));completeEvent(s,e,{status:'completed',results:[{name:'Duplicates',passed,error:passed?undefined:'Wrong indices'}]},at(n+1));return e;}
test('Session JSON is versioned, complete beyond 40 messages, and round-trips Unicode',()=>{
 const s=make();for(let i=0;i<30;i++){const t=turn(s,i+1);completeEvent(s,t,{status:'completed',response:`Reply ${i} 🧪`},at(i+1));}
 updateFinal(s,{'solution.js':'const greeting = "你好";'},'javascript','Checked duplicates.',at(40));
 const bundle=buildSessionExport(s,at(50)),parsed=JSON.parse(bundle.files['session.json']);
 assert.deepEqual(buildSessionJSON(s,at(50)).session,parsed);assert.match(buildSessionJSON(s,at(50)).filename,/\.json$/);assert.equal(parsed.format,'newcode-session');assert.equal(parsed.schemaVersion,1);assert.equal(sessionMessages(parsed).length,60);assert.equal(parsed.events.filter(e=>e.type==='ai.turn').at(-1).response,'Reply 29 🧪');assert.deepEqual(parsed.events[1].request,s.events[1].request);
 assert.ok(!Object.keys(bundle.files).some(n=>n.endsWith('.csv')));assert.equal(parsed.final.files['solution.js'],'const greeting = "你好";');
});
test('Snapshots are immutable, deduplicated, and separate by language',()=>{
 const s=make(),files={'b.js':'b','a.js':'a'};const first=snapshot(s,files,'javascript',at(0));files['a.js']='changed';
 assert.equal(s.snapshots[0].files['a.js'],'a');assert.equal(snapshot(s,{'a.js':'a','b.js':'b'},'javascript'),first);assert.notEqual(snapshot(s,{'a.js':'a','b.js':'b'},'python'),first);
});
test('Exports do not mutate a running session and include a final checkpoint',()=>{
 const s=make();const t=turn(s);t.response='Partial text';updateFinal(s,{'solution.js':'latest draft'},'javascript','notes',at(15));const before=structuredClone(s);
 const {session,files}=buildSessionExport(s,at(20));assert.deepEqual(s,before);assert.equal(session.events[1].status,'streaming');assert.equal(session.snapshots.find(x=>x.id===session.final.snapshotId).files['solution.js'],'latest draft');assert.match(files['report.md'],/Partial text/);
});
test('A completed reply followed by a later run is distinguishable from an overlapping run',()=>{
 const s=make(),t=turn(s,5);run(s,false,6);completeEvent(s,t,{status:'completed',response:'Try a map.'},at(10));
 assert.equal(analyzeSession(s,at(12)).metrics.testedAfterLastReply,false);
 run(s,true,11);const a=analyzeSession(s,at(20));assert.equal(a.metrics.testedAfterLastReply,true);assert.equal(a.metrics.firstPassingRunSeconds,12);assert.equal(a.metrics.completedTestRuns,2);assert.equal(a.metrics.byLanguage.javascript.firstPassed,0);assert.equal(a.metrics.byLanguage.javascript.lastPassed,1);
});
test('Test progression is kept separate for each language',()=>{
 const s=make();run(s,false,1,'javascript');run(s,true,5,'python');const m=analyzeSession(s).metrics;
 assert.equal(m.byLanguage.javascript.lastPassed,0);assert.equal(m.byLanguage.python.lastPassed,1);
});
test('Cancelled, failed and truncated replies are not counted as completed advice',()=>{
 const s=make();for(const [i,status] of ['cancelled','error','truncated'].entries()){const t=turn(s,i+1);completeEvent(s,t,{status,response:'partial',error:'operation note'},at(i+2));}
 const a=analyzeSession(s);assert.equal(a.metrics.completedReplies,0);assert.equal(a.metrics.incompleteReplies,3);assert.equal(a.metrics.testedAfterLastReply,null);assert.match(a.observations.join(' '),/tool events, not evidence of coding ability/);
});
test('Closing a session marks in-flight work interrupted and late callbacks cannot overwrite it',()=>{
 const s=make(),t=turn(s),r=recordEvent(s,'test.run',{status:'running'},at(11));finishSession(s,at(12));finishSession(s,at(15));
 assert.equal(t.status,'interrupted');assert.equal(r.status,'interrupted');assert.equal(completeEvent(s,t,{status:'completed',response:'late'},at(20)),false);assert.equal(s.endedAt,at(12));assert.equal(s.events.filter(e=>e.type==='session.ended').length,1);
});
test('Stored sessions use the last recorded time instead of counting days until a later export',()=>{
 const s=make();updateFinal(s,{},'javascript','',at(9));assert.equal(analyzeSession(s,'2027-01-01T00:00:00Z').metrics.elapsedWallSeconds,9);
});
test('No observations fabricate a skill score or causal conclusion',()=>{
 const s=make(),a=analyzeSession(s);assert.equal(a.metrics.latestPassed,null);assert.equal(a.metrics.firstPassingRunSeconds,null);assert.ok(!Object.hasOwn(a.metrics,'score'));assert.match(a.observations.join(' '),/No completed test run/);assert.match(a.limitations.join(' '),/No score or causal attribution/);
});
test('Report fences preserve Markdown and embedded HTML as transcript data',()=>{
 const s=make(),t=turn(s);completeEvent(s,t,{status:'completed',response:'```js\n</script><img src=x>\n```\n````'},at(15));updateFinal(s,{},'javascript','```notes```',at(16));
 const text=buildSessionExport(s).files['report.md'];assert.match(text,/`````\n```js/);assert.match(text,/untrusted data/);
});
test('Archive paths cannot escape the export and final filenames are normalized',()=>{
 assert.throws(()=>zipFiles({'../escape':'x'}),/filename/);assert.throws(()=>zipFiles({'/absolute':'x'}),/filename/);
 const s=make();updateFinal(s,{'../../private.js':'code','../../private?.js':'other'},'javascript','');const files=buildSessionExport(s).files;
 const names=Object.keys(files).filter(n=>n.startsWith('code/'));assert.equal(names.length,2);assert.ok(names.every(n=>!n.split('/').includes('..')));
});
test('CRC32 matches the standard check vector',()=>assert.equal(crc32(new TextEncoder().encode('123456789')),0xcbf43926));
test('ZIP opens in Python standard zipfile and every UTF-8 entry matches exactly',()=>{
 const s=make(),t=turn(s);completeEvent(s,t,{status:'completed',response:'你好 🧪\nA complete response.'},at(15));updateFinal(s,{'solution.js':'const x = "🧪";'},'javascript','Trade-off: memory.',at(20));
 const expected=buildSessionExport(s,at(25)),archive=sessionZip(s,at(25));
 const output=execFileSync('python3',['-c',`import sys,io,zipfile,json\nz=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read()))\nassert z.testzip() is None\nprint(json.dumps({n:z.read(n).decode('utf-8') for n in z.namelist()}, ensure_ascii=False))`],{input:archive.bytes,maxBuffer:2_000_000}).toString();
 assert.deepEqual(JSON.parse(output),expected.files);
});
test('When browser storage is unavailable the session remains downloadable in memory',async()=>{
 const s=make();const t=turn(s);completeEvent(s,t,{status:'completed',response:'saved in memory'},at(15));assert.equal(await saveSession(s),false);
 const stored=await getSession(s.id);assert.deepEqual(stored,s);stored.problem.title='changed';assert.notEqual((await getSession(s.id)).problem.title,'changed');
 const history=await listSessions();assert.equal(history.persistent,false);assert.ok(history.sessions.some(item=>item.id===s.id&&item.prompts===1));assert.ok(sessionZip(stored).bytes.length>0);
});
