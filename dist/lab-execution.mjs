import {getLanguage} from './arcade/languages.mjs';
import {executeRequest} from './arcade/execution.mjs';
import {buildLabProgram} from './lab-projects.mjs';
export function labCompileRequest(lab,language,files){
 const source=buildLabProgram(lab,language,files),lang=getLanguage(language);
 if(language==='rust')return {channel:'stable',mode:'debug',edition:'2021',crateType:'bin',tests:false,code:source,backtrace:false};
 if(lang.provider==='compiler-explorer')return {source,compiler:lang.compiler,lang:language,allowStoreCodeDebug:false,options:{compilerOptions:{executorRequest:true},filters:{execute:true},executeParameters:{args:[],stdin:''}}};
 return {compiler:lang.compiler,code:source,options:lang.options||'',save:false};
}
export async function runLab(lab,language,files,signal,fetcher=fetch){
 if(signal.aborted)throw new DOMException('Run cancelled.','AbortError');
 if(language==='javascript')return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./lab-runner.mjs',import.meta.url),{type:'module'});
  const cleanup=()=>{worker.terminate();clearTimeout(timer);signal.removeEventListener('abort',abort);};
  const finish=data=>{cleanup();resolve(data);};
  const abort=()=>{cleanup();reject(new DOMException('Run cancelled. Your draft is saved.','AbortError'));};
  const timer=setTimeout(()=>finish({error:'Stopped after 4 seconds. Check for an infinite loop or repeated work.'}),4000);
  signal.addEventListener('abort',abort,{once:true});worker.onmessage=e=>finish(e.data);worker.onerror=e=>{e.preventDefault();finish({error:e.message});};worker.postMessage({id:lab.id,files});
 });
 const data=await executeRequest(language,labCompileRequest(lab,language,files),lab.cases.length,signal,fetcher);
 if(data.error)return data;
 return {...data,results:data.results.map((r,i)=>({name:lab.cases[i],passed:!r.error&&r.value===true,error:r.error||'Acceptance check failed. Review the contract and your implementation.'}))};
}
