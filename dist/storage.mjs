import {labProject,labLanguages} from './lab-projects.mjs';
import {portableTimer} from './practice-timer.mjs';
import {normalizeMode} from './practice-modes.mjs';
export const PROGRESS_KEY='algo-arcade-v1', LAB_KEY='newcode-labs-v1';
export function read(key) {try {const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}}
export function write(key,value) {try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function validateBackup(value, games, labs) {
 if(value?.format!=='newcode-v1'||!value.progress||!value.labs)throw new Error('Choose a Newcode progress backup.');
 const progress={}, labState={};
 for(const g of games){const s=value.progress[g.id];if(!s||typeof s!=='object')continue;
  const drafts={},solvedLanguages={};for(const lang of ['javascript','python','c','cpp','java','rust','go']){if(typeof s.drafts?.[lang]==='string')drafts[lang]=s.drafts[lang].slice(0,100000);if(s.solvedLanguages?.[lang]===true)solvedLanguages[lang]=true;}
  progress[g.id]={...(s.timer?{timer:portableTimer(s.timer)}:{}),mode:normalizeMode(s.mode),drafts,solvedLanguages,played:s.played===true,solved:Object.keys(solvedLanguages).length>0,bookmark:s.bookmark===true};
 }
 for(const lab of labs){
  const s=value.labs[lab.id];if(!s||typeof s!=='object')continue;
  const filesByLanguage={},solvedLanguages={};
  for(const language of labLanguages){
   const source=s.filesByLanguage?.[language]||(language==='javascript'?s.files:{}),files={};
   for(const name of Object.keys(labProject(lab,language).files))if(typeof source?.[name]==='string')files[name]=source[name].slice(0,100000);
   if(Object.keys(files).length)filesByLanguage[language]=files;
   if(s.solvedLanguages?.[language]===true)solvedLanguages[language]=true;
  }
  if(s.solved===true&&!s.solvedLanguages)solvedLanguages.javascript=true;
  labState[lab.id]={files:filesByLanguage.javascript||{},filesByLanguage,solvedLanguages,solved:Object.keys(solvedLanguages).length>0,language:labLanguages.includes(s.language)?s.language:'javascript',notes:typeof s.notes==='string'?s.notes.slice(0,20000):'',mode:normalizeMode(s.mode),...(s.timer?{timer:portableTimer(s.timer)}:{})};
 }
 return {progress,labs:labState};
}

export function progressBackup(progress,labs,now=Date.now()){
 const convert=states=>Object.fromEntries(Object.entries(states).map(([id,value])=>{const copy=structuredClone(value);if(copy.timer)copy.timer=portableTimer(copy.timer,now);if(copy.filesByLanguage)delete copy.files;return [id,copy];}));
 return {format:'newcode-v1',exportedAt:new Date(now).toISOString(),progress:convert(progress),labs:convert(labs)};
}
// Imported matching files replace local files; other language drafts remain intact.
export function mergeBackup(currentProgress,currentLabs,parsed){
 const progress=structuredClone(currentProgress),labs=structuredClone(currentLabs);
 for(const [id,incoming] of Object.entries(parsed.progress)){
  const old=progress[id]||{},solvedLanguages={...old.solvedLanguages,...incoming.solvedLanguages};
  progress[id]={...old,...incoming,drafts:{...old.drafts,...incoming.drafts},solvedLanguages,solved:Object.values(solvedLanguages).some(Boolean)};
 }
 for(const [id,incoming] of Object.entries(parsed.labs)){
  const old=labs[id]||{},filesByLanguage=structuredClone(old.filesByLanguage||{});
  filesByLanguage.javascript={...old.files,...filesByLanguage.javascript};
  for(const [language,files] of Object.entries(incoming.filesByLanguage||{}))filesByLanguage[language]={...filesByLanguage[language],...files};
  const solvedLanguages={...(old.solved&&!old.solvedLanguages?{javascript:true}:{}),...old.solvedLanguages,...incoming.solvedLanguages};
  labs[id]={...old,...incoming,filesByLanguage,files:filesByLanguage.javascript,solvedLanguages,solved:Object.values(solvedLanguages).some(Boolean)};
 }
 return {progress,labs};
}
