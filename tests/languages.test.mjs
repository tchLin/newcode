import test from 'node:test';
import assert from 'node:assert/strict';
import {games} from '../dist/arcade/logic.mjs';
import {languages,starter,compileRequest,parseExecution,languageHelp} from '../dist/arcade/languages.mjs';
import {migrateProgress,draftFor,saveDraft,passedLanguage,solvedIn} from '../dist/arcade/coding-state.mjs';
import {runRemote} from '../dist/arcade/execution.mjs';

test('Existing JavaScript drafts and solved status migrate without overwriting new drafts',()=>{
 const progress=migrateProgress({'two-sum':{draft:'old JS',solved:true},duplicate:{draft:'older',drafts:{javascript:'newer',python:'py'},solved:true,solvedLanguages:{python:true}}});
 assert.equal(draftFor(progress['two-sum'],games[0],'javascript'),'old JS');
 assert.deepEqual(solvedIn(progress['two-sum']),['JavaScript']);
 assert.equal(progress.duplicate.drafts.javascript,'newer');
 assert.deepEqual(solvedIn(progress.duplicate),['Python']);
 assert.deepEqual(migrateProgress(progress),progress);
});
test('Drafts preserve empty content and stay separate for every language',()=>{
 let state={};
 for(const l of languages)state=saveDraft(state,l.id,l.id);
 for(const l of languages)assert.equal(draftFor(state,games[0],l.id),l.id);
 state=saveDraft(state,'python','');assert.equal(draftFor(state,games[0],'python'),'');
 state=passedLanguage(state,'java');state=passedLanguage(state,'go');
 assert.equal(state.solved,true);assert.deepEqual(solvedIn(state),['Java','Go']);
 assert.equal(state.drafts.python,'');
});
test('Every exercise has a distinct template, contract and hint for all seven languages',()=>{
 assert.equal(languages.length,7);
 for(const g of games){const templates=languages.map(l=>starter(g,l.id));assert.equal(new Set(templates).size,7);
  for(const l of languages){const help=languageHelp(g,l.id);assert.ok(help.hint.length>50);assert.ok(help.contract.includes('test harness'));assert.ok(help.lesson.includes(l.label));}
 }
});
test('Native requests use verified compilers, do not save permalinks, and include every case',()=>{
 for(const g of games)for(const l of languages.filter(l=>l.compiler)){
  const request=compileRequest(g,l.id,starter(g,l.id));
  if(l.id==='rust'){assert.equal(request.channel,'stable');assert.equal(request.edition,'2021');assert.equal(request.tests,false);}
  else if(l.provider==='compiler-explorer'){assert.equal(request.compiler,l.compiler);assert.equal(request.allowStoreCodeDebug,false);assert.equal(request.options.compilerOptions.executorRequest,true);}
  else{assert.equal(request.compiler,l.compiler);assert.equal(request.save,false);}
  assert.ok((request.code||request.source).includes(l.id==='python'?'enumerate(_aa_json.loads(':`__ALGO_ARCADE_RESULT_${g.tests.length-1}__`));
 }
 assert.throws(()=>compileRequest(games[0],'javascript',''),/Unsupported/);
 assert.throws(()=>compileRequest(games[0],'python','x'.repeat(50001)),/50,000/);
 assert.throws(()=>compileRequest(games[0],'go','func twoSum() {}'),/package main/);
});
const response=out=>({status:'0',signal:'',program_output:out});
test('Parser handles debug output, booleans, arrays and per-test errors',()=>{
 const output='debugging\n__ALGO_ARCADE_RESULT_0__{"value":[1,0]}\n__ALGO_ARCADE_RESULT_1__{"value":false}\n__ALGO_ARCADE_RESULT_2__{"error":"bad call"}\n';
 assert.deepEqual(parseExecution(response(output),3).results,[{value:[1,0]},{value:false},{error:'bad call'}]);
});
test('Missing, duplicate, invalid and excess results cannot award completion',()=>{
 for(const output of ['', '__ALGO_ARCADE_RESULT_0__bad', '__ALGO_ARCADE_RESULT_0__{}', '__ALGO_ARCADE_RESULT_0__{"value":true}\n__ALGO_ARCADE_RESULT_0__{"value":true}', '__ALGO_ARCADE_RESULT_2__{"value":true}', 'x'.repeat(64001)])assert.ok(parseExecution(response(output),2).error);
 assert.match(parseExecution({status:'1',compiler_message:'syntax error'},1).error,/syntax error/);
 assert.match(parseExecution({status:'0',signal:'Killed'},1).error,/Killed/);
 assert.ok(parseExecution({},1).error);
});
test('Remote transport handles unavailable service, cancellation, invalid JSON, and output limits',async()=>{
 const g=games[0],signal=new AbortController().signal;
 const run=(fetcher,s=signal)=>runRemote(g,'python',starter(g,'python'),s,fetcher);
 await assert.rejects(run(async()=>new Response('',{status:429})),/busy/);
 await assert.rejects(run(async()=>new Response('',{status:503})),/unavailable/);
 await assert.rejects(run(async()=>new Response('<html>error</html>')),/unreadable/);
 await assert.rejects(run(async()=>new Response('x'.repeat(200001))),/too much output/);
 const cancelled=new AbortController();cancelled.abort();let fetched=false;
 await assert.rejects(run(async()=>{fetched=true;},cancelled.signal),{name:'AbortError'});assert.equal(fetched,false);
});
test('Rust transport uses the official endpoint and normalizes compiler errors',async()=>{
 const game=games[1],signal=new AbortController().signal;
 const fetcher=async(url,init)=>{
  assert.equal(url,'https://play.rust-lang.org/execute');
  assert.equal(init.credentials,'omit');assert.equal(init.referrerPolicy,'no-referrer');
  assert.equal(JSON.parse(init.body).channel,'stable');
  return new Response(JSON.stringify({success:true,stdout:game.tests.map((t,i)=>`__ALGO_ARCADE_RESULT_${i}__${JSON.stringify({value:t.expected})}`).join('\n'),stderr:'compiler notes'}));
 };
 const result=await runRemote(game,'rust',starter(game,'rust'),signal,fetcher);
 assert.equal(result.results.length,game.tests.length);assert.equal(result.diagnostics,'compiler notes');
 const failed=await runRemote(game,'rust',starter(game,'rust'),signal,async()=>new Response(JSON.stringify({success:false,stderr:'Rust type mismatch'})));
 assert.match(failed.error,/Rust type mismatch/);
});
test('Compiler Explorer transport requires successful build AND execution',async()=>{
 const game=games[1],signal=new AbortController().signal;
 const success={code:0,didExecute:true,buildResult:{code:0,stderr:[]},stdout:game.tests.map((t,i)=>({text:`__ALGO_ARCADE_RESULT_${i}__${JSON.stringify({value:t.expected})}`})),stderr:[]};
 const run=data=>runRemote(game,'go',starter(game,'go'),signal,async(url,init)=>{
  assert.equal(url,'https://godbolt.org/api/compiler/gl1238/compile');
  assert.equal(init.headers.Accept,'application/json');assert.equal(JSON.parse(init.body).allowStoreCodeDebug,false);
  return new Response(JSON.stringify(data));
 });
 assert.equal((await run(success)).results.length,game.tests.length);
 assert.ok((await run({...success,code:1})).error);
 assert.ok((await run({...success,buildResult:{code:1}})).error);
 assert.ok((await run({...success,didExecute:false})).error);
 assert.match((await run({...success,timedOut:true})).error,/too long/);
 assert.match((await run({...success,truncated:true})).error,/truncated/);
});
