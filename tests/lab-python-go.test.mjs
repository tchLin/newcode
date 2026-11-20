import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import * as python from '../dist/lab-languages/python.mjs';
import * as go from '../dist/lab-languages/go.mjs';
import {labPythonGoSolutions} from './fixtures/lab-python-go-solutions.mjs';
import {parseExecution} from '../dist/arcade/languages.mjs';
const run=(language,source)=>{
 const dir=mkdtempSync(join(tmpdir(),'newcode-labs-'));
 try{
  const path=join(dir,language==='python'?'main.py':'main.go');writeFileSync(path,source);
  const result=spawnSync(language==='python'?'python3':'go',language==='python'?[path]:['run',path],{encoding:'utf8',timeout:60000,maxBuffer:200000,env:{...process.env,GOCACHE:join(tmpdir(),'newcode-go-test-cache')}});
  assert.equal(result.error,undefined,result.error?.message);assert.equal(result.status,0,result.stderr);
  return parseExecution({status:'0',program_output:result.stdout},8);
 }finally{rmSync(dir,{recursive:true,force:true});}
};
for(const [language,module] of Object.entries({python,go}))for(const [id,project] of Object.entries(module.projects)){
 test(`${language} ${id}: native reference passes and starter does not claim completion`,{timeout:120000},()=>{
  const reference=run(language,module.buildProgram(id,labPythonGoSolutions[language][id]));assert.equal(reference.error,undefined,reference.error);assert.ok(reference.results.every(r=>r.value===true),JSON.stringify(reference));
  const starter=run(language,module.buildProgram(id,project.files));assert.equal(starter.error,undefined,starter.error);assert.ok(starter.results.some(r=>r.value!==true),'Incomplete starter unexpectedly passed');
 });
}
test('Python and Go lab builders reject missing and unknown projects',()=>{
 for(const module of [python,go]){assert.throws(()=>module.buildProgram('unknown',{}),/Unknown/);assert.throws(()=>module.buildProgram('cache',{}),/Missing/);}
});
