// Explicit opt-in: makes one request per selected language/problem combination.
import assert from 'node:assert/strict';
import {games,accepts} from '../dist/arcade/logic.mjs';
import {languages} from '../dist/arcade/languages.mjs';
import {runRemote} from '../dist/arcade/execution.mjs';
import {solutions} from './fixtures/solutions.mjs';
const selectedLanguage=process.argv[2],selectedProblem=process.argv[3];
if(selectedLanguage&&!languages.some(l=>l.compiler&&l.id===selectedLanguage))throw new Error('Unknown remote language.');
if(selectedProblem&&!['new','advanced','strategy','patterns','expansion','structures'].includes(selectedProblem)&&!games.some(g=>g.id===selectedProblem))throw new Error('Unknown exercise.');
let failures=0;
for(const language of languages.filter(l=>l.compiler&&(!selectedLanguage||l.id===selectedLanguage))){
 for(const [index,game] of games.entries()){
  if(selectedProblem==='structures'?!game.structures:selectedProblem==='expansion'?!game.expansion:selectedProblem==='patterns'?!game.patterns:selectedProblem==='strategy'?!game.strategy:selectedProblem==='advanced'?!game.advanced:selectedProblem==='new'?!game.signature:selectedProblem&&game.id!==selectedProblem)continue;
  try{
   const data=await runRemote(game,language.id,solutions[language.id][index],AbortSignal.timeout(45000));
   assert.equal(data.error,undefined);assert.equal(data.results.length,game.tests.length);
   data.results.forEach((r,i)=>assert.ok(!r.error&&accepts(game,game.tests[i],r.value),`Case ${i+1}: ${JSON.stringify(r)}`));
   console.log(`PASS ${language.label} · ${game.problem} (${data.results.length} cases)`);
  }catch(error){failures++;console.error(`FAIL ${language.label} · ${game.problem}: ${error.message}`);}
 }
}
process.exitCode=failures?1:0;
