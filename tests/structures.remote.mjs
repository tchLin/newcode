// Opt-in: one compilation per language, running every new exercise's independent reference solution.
import assert from 'node:assert/strict';
import {games,accepts} from '../dist/arcade/logic.mjs';
import {languages,compileRequest,getProvider,parseExecution} from '../dist/arcade/languages.mjs';
import {structureSuite} from '../dist/arcade/structure-languages.mjs';
import {readFileSync} from 'node:fs';
const selected=process.argv[2];
if(selected&&!languages.some(l=>l.compiler&&l.id===selected))throw new Error('Unknown remote language');
const added=games.filter(g=>g.structures),tests=added.flatMap(g=>g.tests.map(t=>({g,t})));
let failures=0;
for(const language of languages.filter(l=>l.compiler&&(!selected||l.id===selected))){
 try{
  const suffix={c:'c',cpp:'cpp',java:'java',rust:'rs',go:'go',python:'py'}[language.id],code=readFileSync(new URL('./fixtures/structure-'+language.id+'.'+suffix,import.meta.url),'utf8'),source=structureSuite(added,language.id,code),body=compileRequest(added[0],language.id,code);
  if(language.provider==='compiler-explorer')body.source=source;else body.code=source;
  const response=await fetch(getProvider(language.id).endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});
  assert.ok(response.ok,`HTTP ${response.status}`);let data=await response.json();
  if(language.id==='rust')data={status:data.success?'0':'1',program_output:data.stdout,compiler_message:data.stderr||data.error};
  if(language.provider==='compiler-explorer'){const lines=a=>Array.isArray(a)?a.map(x=>x.text||'').join('\n'):'';data={status:data.didExecute&&data.code===0&&data.buildResult?.code===0?'0':'1',program_output:lines(data.stdout),compiler_message:lines(data.buildResult?.stderr),program_error:lines(data.stderr)};}
  const result=parseExecution(data,tests.length);assert.equal(result.error,undefined);
  assert.equal(result.results.length,tests.length);
  result.results.forEach((r,i)=>assert.ok(!r.error&&accepts(tests[i].g,tests[i].t,r.value),`${tests[i].g.number}: input ${JSON.stringify(tests[i].t.args)} => ${JSON.stringify(r)}`));
  console.log(`PASS ${language.label}: all ${added.length} exercises, ${tests.length} cases, including node identities, tree shape, codec round trips, stateful operations, and alternate valid answers.`);
 }catch(e){failures++;console.error(`FAIL ${language.label}: ${e.message}`);}
}
process.exitCode=failures?1:0;
