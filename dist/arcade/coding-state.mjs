import {languages,starter} from './languages.mjs';
export function migrateProgress(progress){
  for(const state of Object.values(progress)){
    if(!state||typeof state!=='object')continue;
    state.drafts={...(state.drafts||{})};
    if(typeof state.draft==='string'&&!Object.hasOwn(state.drafts,'javascript'))state.drafts.javascript=state.draft;
    if(state.solved&&!state.solvedLanguages)state.solvedLanguages={javascript:true};
  }
  return progress;
}
export function draftFor(state,g,language){return typeof state?.drafts?.[language]==='string'?state.drafts[language]:starter(g,language);}
export function saveDraft(state,language,code){return {...state,drafts:{...state?.drafts,[language]:code}};}
export function passedLanguage(state,language){return {...state,solved:true,solvedLanguages:{...state?.solvedLanguages,[language]:true}};}
export function solvedIn(state){return languages.filter(l=>state?.solvedLanguages?.[l.id]).map(l=>l.label);}
