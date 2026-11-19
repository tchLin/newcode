export const PROGRESS_KEY='algo-arcade-v1', LAB_KEY='newcode-labs-v1';
export function read(key) {try {const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}}
export function write(key,value) {try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function validateBackup(value, games, labs) {
 if(value?.format!=='newcode-v1'||!value.progress||!value.labs)throw new Error('Choose a Newcode progress backup.');
 const progress={}, labState={};
 for(const g of games){const s=value.progress[g.id];if(!s||typeof s!=='object')continue;
  const drafts={},solvedLanguages={};for(const lang of ['javascript','python','c','cpp','java','rust','go']){if(typeof s.drafts?.[lang]==='string')drafts[lang]=s.drafts[lang].slice(0,100000);if(s.solvedLanguages?.[lang]===true)solvedLanguages[lang]=true;}
  progress[g.id]={drafts,solvedLanguages,played:s.played===true,solved:Object.keys(solvedLanguages).length>0,bookmark:s.bookmark===true};
 }
 for(const lab of labs){const s=value.labs[lab.id];if(!s||typeof s!=='object')continue;const files={};for(const name of Object.keys(lab.files))if(typeof s.files?.[name]==='string')files[name]=s.files[name].slice(0,100000);
  labState[lab.id]={files,solved:s.solved===true,notes:typeof s.notes==='string'?s.notes.slice(0,20000):'',mode:s.mode==='strict'?'strict':'assisted'};
 }
 return {progress,labs:labState};
}
