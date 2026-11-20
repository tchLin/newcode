import test from 'node:test';
import assert from 'node:assert/strict';
import {labs} from '../dist/labs.mjs';
import {games} from '../dist/arcade/logic.mjs';
import {labProject,labFiles,labDrafts,labLanguages,buildLabProgram} from '../dist/lab-projects.mjs';
import {runLab,labCompileRequest} from '../dist/lab-execution.mjs';
import {validateBackup,progressBackup,mergeBackup} from '../dist/storage.mjs';

test('Every lab has a native two-module project in all seven languages',()=>{
 for(const lab of labs)for(const language of labLanguages){const project=labProject(lab,language);assert.ok(Object.keys(project.files).length>=2);assert.ok(project.contract.length>30);for(const [name,code] of Object.entries(project.files)){assert.ok(name.length>0);assert.equal(typeof code,'string');assert.ok(code.trim());}if(language!=='javascript')assert.ok(buildLabProgram(lab,language,project.files).includes('__ALGO_ARCADE_RESULT_'));}
});
test('Lab draft migration preserves legacy JS and separates all language drafts',()=>{
 const lab=labs[0],state={files:{'cache.js':'legacy'},solved:true};
 assert.equal(labFiles(lab,state,'javascript')['cache.js'],'legacy');assert.equal(state.solvedLanguages.javascript,true);
 for(const language of labLanguages){const first=Object.keys(labProject(lab,language).files)[0];labDrafts(state,language)[first]=language;}
 for(const language of labLanguages){const first=Object.keys(labProject(lab,language).files)[0];assert.equal(labFiles(lab,state,language)[first],language);}
});
test('Progress backups preserve language drafts, completions and paused countdowns',()=>{
 const lab=labs[0],state={filesByLanguage:{},solvedLanguages:{python:true,go:true},solved:true,language:'go',timer:{duration:1800,remaining:1800,deadline:1801000}};
 for(const lang of labLanguages)state.filesByLanguage[lang]={[Object.keys(labProject(lab,lang).files)[0]]:lang};
 const backup=progressBackup({'two-sum':{timer:state.timer}}, {[lab.id]:state},31000),restored=validateBackup(backup,games,labs);
 assert.equal(restored.progress['two-sum'].timer.remaining,1770);assert.equal(restored.labs[lab.id].timer.deadline,null);assert.equal(restored.labs[lab.id].language,'go');assert.deepEqual(restored.labs[lab.id].solvedLanguages,{python:true,go:true});
 for(const lang of labLanguages)assert.deepEqual(restored.labs[lab.id].filesByLanguage[lang],state.filesByLanguage[lang]);
});
test('Remote lab runner sends actual source and validates the complete Boolean result protocol',async()=>{
 const lab=labs[0],files=labProject(lab,'python').files,signal=new AbortController().signal;
 const stdout=lab.cases.map((_,i)=>({text:`__ALGO_ARCADE_RESULT_${i}__${JSON.stringify({value:i!==2})}`}));
 let sent;
 const result=await runLab(lab,'python',files,signal,async(url,options)=>{assert.match(url,/godbolt/);assert.equal(options.credentials,'omit');sent=JSON.parse(options.body);return new Response(JSON.stringify({didExecute:true,code:0,buildResult:{code:0},stdout}));});
 assert.ok(sent.source.includes(files[Object.keys(files)[0]].split('\n').find(line=>line.trim())||''));assert.deepEqual(result.results.map(r=>r.name),lab.cases);assert.equal(result.results.filter(r=>r.passed).length,7);
 const short=await runLab(lab,'python',files,signal,async()=>new Response(JSON.stringify({didExecute:true,code:0,buildResult:{code:0},stdout:stdout.slice(1)})));
 assert.match(short.error,/all test results/);
 const aborted=new AbortController();aborted.abort();await assert.rejects(runLab(lab,'python',files,aborted.signal),{name:'AbortError'});
});
test('Runner rejects unexpected or oversized files before sending them',()=>{
 const lab=labs[0],files=labProject(lab,'python').files;
 assert.throws(()=>labCompileRequest(lab,'python',{...files,'secret.py':'no'}),/file set/);
 const first=Object.keys(files)[0];assert.throws(()=>labCompileRequest(lab,'python',{...files,[first]:'x'.repeat(100001)}),/100,000/);
});

test('Importing a legacy JS backup preserves other language drafts and passes',()=>{
 const current={cache:{filesByLanguage:{javascript:{'cache.js':'old','service.js':'keep'},python:{'cache.py':'keep python'}},solvedLanguages:{python:true}}};
 const source={format:'newcode-v1',progress:{'two-sum':{drafts:{javascript:'new'}}},labs:{cache:{files:{'cache.js':'new JS'},solved:true}}};
 const parsed=validateBackup(source,games,labs),merged=mergeBackup({'two-sum':{drafts:{python:'keep'},solvedLanguages:{python:true}}},current,parsed);
 assert.equal(merged.labs.cache.filesByLanguage.javascript['cache.js'],'new JS');assert.equal(merged.labs.cache.filesByLanguage.javascript['service.js'],'keep');assert.equal(merged.labs.cache.filesByLanguage.python['cache.py'],'keep python');
 assert.deepEqual(merged.labs.cache.solvedLanguages,{python:true,javascript:true});assert.equal(merged.progress['two-sum'].drafts.python,'keep');assert.equal(merged.progress['two-sum'].drafts.javascript,'new');assert.equal(merged.progress['two-sum'].solved,true);
 assert.equal(current.cache.filesByLanguage.javascript['cache.js'],'old');
});
