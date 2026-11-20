import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import * as c from '../dist/lab-languages/c.mjs';
import * as cpp from '../dist/lab-languages/cpp.mjs';
import {labNativeSolutions} from './fixtures/lab-c-cpp-solutions.mjs';
import {parseExecution} from '../dist/arcade/languages.mjs';
const compiler=language=>language==='c'?(process.env.CC||'cc'):(process.env.CXX||'c++');
function execute(language,source){
 const dir=mkdtempSync(join(tmpdir(),'newcode-native-lab-'));
 try{
  const file=join(dir,'lab.'+language),exe=join(dir,'lab');writeFileSync(file,source);
  const build=spawnSync(compiler(language),[language==='c'?'-std=c11':'-std=c++17',file,'-o',exe],{encoding:'utf8',timeout:30000,maxBuffer:2e6});
  assert.equal(build.error,undefined,build.error?.message);assert.equal(build.status,0,build.stderr);
  const run=spawnSync(exe,[],{encoding:'utf8',timeout:10000,maxBuffer:2e6});
  assert.equal(run.error,undefined,run.error?.message);assert.equal(run.status,0,run.stderr);
  const parsed=parseExecution({status:'0',program_output:run.stdout},8);assert.equal(parsed.error,undefined,parsed.error);return parsed.results;
 }finally{rmSync(dir,{recursive:true,force:true});}
}
for(const [language,module] of [['c',c],['cpp',cpp]]){
 for(const id of Object.keys(module.projects)){
  test(`${language} ${id}: native reference passes all eight checks and starter cannot complete`,()=>{
   const correct=execute(language,module.buildProgram(id,labNativeSolutions[language][id]));
   assert.equal(correct.length,8);assert.ok(correct.every(result=>result.value===true),JSON.stringify(correct));
   const starter=execute(language,module.buildProgram(id,module.projects[id].files));
   assert.ok(starter.some(result=>result.value!==true),JSON.stringify(starter));
  });
 }
 test(`${language}: project builder refuses unknown labs and incomplete file maps`,()=>{
  assert.throws(()=>module.buildProgram('unknown',{}),/Unknown/);
  assert.throws(()=>module.buildProgram('cache',{}),/Missing lab file/);
 });
}
