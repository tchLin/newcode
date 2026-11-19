import {compileRequest,parseExecution,getProvider,getLanguage} from './languages.mjs';
export const REMOTE_TIMEOUT=45000;
function abortError(){return new DOMException('Run cancelled.','AbortError');}

export function runJavaScript(game,code,signal){
  return new Promise((resolve,reject)=>{
    if(signal.aborted){reject(abortError());return;}
    const worker=new Worker(new URL('./runner.mjs',import.meta.url),{type:'module'});
    let timer;
    const cleanup=()=>{worker.terminate();clearTimeout(timer);signal.removeEventListener('abort',abort);};
    const finish=value=>{cleanup();resolve(value);};
    const abort=()=>{cleanup();reject(abortError());};
    signal.addEventListener('abort',abort,{once:true});
    worker.onerror=event=>{event.preventDefault();finish({error:'Could not run your solution. '+(event.message||'Check your browser settings.')});};
    worker.onmessage=({data})=>finish(data);
    timer=setTimeout(()=>finish({error:'Stopped after 2 seconds. Check for an infinite loop or a missing stopping condition.'}),2000);
    worker.postMessage({code,fn:game.fn,mutates:game.mutates,tests:game.tests.map(t=>t.args)});
  });
}

export async function runRemote(game,language,code,signal,fetcher=fetch){
  const request=compileRequest(game,language,code);
  if(signal.aborted)throw abortError();
  const response=await fetcher(getProvider(language).endpoint,{
    method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
    credentials:'omit',referrerPolicy:'no-referrer',signal,body:JSON.stringify(request)
  });
  if(!response.ok){
    if(response.status===429)throw new Error('The compiler service is busy. Wait a moment, then run your tests again.');
    throw new Error(`The compiler service is unavailable (HTTP ${response.status}). Your draft is saved. Please try again later.`);
  }
  // Bound diagnostics/output before parsing. A noisy program must not freeze the editor.
  const reader=response.body.getReader();
  const decoder=new TextDecoder();let text='',size=0;
  try{
    while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;
      if(size>200000){await reader.cancel();throw new Error('The compiler returned too much output. Remove extra logging and try again.');}
      text+=decoder.decode(value,{stream:true});
    }
    text+=decoder.decode();
  }finally{reader.releaseLock();}
  let data;try{data=JSON.parse(text);}catch{throw new Error('The compiler service returned an unreadable response. Please try again.');}
  if(language==='rust')data={status:data.success===true?'0':'1',program_output:data.stdout,compiler_message:data.stderr||data.error||data.exitDetail};
  if(getLanguage(language).provider==='compiler-explorer'){
    const lines=items=>Array.isArray(items)?items.map(item=>item.text||'').join('\n'):'';
    if(data.timedOut||data.buildResult?.timedOut)return {error:'The compiler stopped the program because it ran too long. Check for an infinite loop.'};
    if(data.truncated||data.buildResult?.truncated)return {error:'The compiler truncated the output. Remove extra logging and try again.'};
    data={status:data.didExecute&&data.code===0&&data.buildResult?.code===0?'0':'1',program_output:lines(data.stdout),compiler_message:lines(data.buildResult?.stderr),program_error:lines(data.stderr)};
  }
  return parseExecution(data,game.tests.length);
}
