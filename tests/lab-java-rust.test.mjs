import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import * as java from '../dist/lab-languages/java.mjs';
import * as rust from '../dist/lab-languages/rust.mjs';
import {solutions} from './fixtures/lab-java-rust-solutions.mjs';
import {parseExecution} from '../dist/arcade/languages.mjs';
function available(candidates,args){return candidates.find(command=>command&&spawnSync(command,args,{encoding:'utf8',timeout:5000}).status===0);}
const javac=available([process.env.JAVA_HOME&&join(process.env.JAVA_HOME,'bin/javac'),'/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home/bin/javac','javac'],['-version']);
const javaBin=javac?.includes('/')?join(dirname(javac),'java'):'java';
const rustc=available([process.env.RUSTC,'rustc'],['--version']);
function execute(t,language,source){
 const dir=mkdtempSync(join(tmpdir(),'newcode-native-lab-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const file=join(dir,language==='java'?'prog.java':'main.rs');writeFileSync(file,source);
 const command=language==='java'?javac:rustc;
 const args=language==='java'?['--release','21',file]:['--edition=2021',file,'-o',join(dir,'lab')];
 const compile=spawnSync(command,args,{encoding:'utf8',timeout:30000,maxBuffer:2000000});
 assert.equal(compile.status,0,compile.stderr||compile.error?.message);
 const run=spawnSync(language==='java'?javaBin:join(dir,'lab'),language==='java'?['-cp',dir,'Wandbox']:[],{encoding:'utf8',timeout:15000,maxBuffer:2000000});
 assert.equal(run.status,0,run.stderr||run.error?.message);
 const result=parseExecution({status:'0',program_output:run.stdout},8);assert.equal(result.error,undefined,JSON.stringify(result));
 return result.results;
}
for(const [language,module,compiler] of [['java',java,javac],['rust',rust,rustc]])for(const [id,project] of Object.entries(module.projects)){
 test(`${language} ${id}: native reference passes every acceptance check`,{skip:!compiler},t=>{
  const results=execute(t,language,module.buildProgram(id,solutions[language][id]));assert.ok(results.every(r=>r.value===true),JSON.stringify(results));
 });
 test(`${language} ${id}: starter runs but cannot award completion`,{skip:!compiler},t=>{
  const results=execute(t,language,module.buildProgram(id,project.files));assert.ok(results.some(r=>r.value!==true),JSON.stringify(results));
 });
}
test('Java/Rust builders reject unknown projects and missing source instead of falling back',()=>{
 for(const module of [java,rust]){assert.throws(()=>module.buildProgram('missing',{}),/Unknown lab/);assert.throws(()=>module.buildProgram('cache',{}),/Missing exercise file/);}
});
