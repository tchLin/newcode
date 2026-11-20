import * as python from './lab-languages/python.mjs';
import * as go from './lab-languages/go.mjs';
import * as c from './lab-languages/c.mjs';
import * as cpp from './lab-languages/cpp.mjs';
import * as java from './lab-languages/java.mjs';
import * as rust from './lab-languages/rust.mjs';
export const labLanguages=['javascript','python','c','cpp','java','rust','go'];
const implementations={python,go,c,cpp,java,rust};
export function labProject(lab,language){
 if(language==='javascript')return {files:lab.files,contract:'Use the supplied CommonJS exports and relative require paths. Tests supply the entry point. '+(lab.id==='cache'?'Missing cache values are undefined; null is a valid stored value.':'')};
 const project=implementations[language]?.projects[lab.id];if(!project)throw new Error('This lab language is unavailable.');return project;
}
export function buildLabProgram(lab,language,files){
 const project=labProject(lab,language),expected=Object.keys(project.files);
 if(Object.keys(files).length!==expected.length||Object.keys(files).some(name=>!expected.includes(name))||expected.some(name=>typeof files[name]!=='string'))throw new Error('The lab file set does not match the selected language.');
 if(Object.values(files).some(code=>code.length>100000)||Object.values(files).reduce((n,s)=>n+s.length,0)>150000)throw new Error('Keep the lab project under 150,000 characters and each file under 100,000.');
 if(!implementations[language])throw new Error('Use the browser runner for JavaScript labs.');
 return implementations[language].buildProgram(lab.id,files);
}
export function labDrafts(state,language){
 state.filesByLanguage??={};
 if(!state.filesByLanguage.javascript)state.filesByLanguage.javascript={...state.files};
 state.solvedLanguages??=state.solved?{javascript:true}:{};
 return state.filesByLanguage[language]??={};
}
export function labFiles(lab,state,language){return {...labProject(lab,language).files,...labDrafts(state,language)};}
