let engine=null,worker=null,loading=false,generation=0,cancelLoad=null;
export const MODEL='Qwen2.5-Coder-1.5B-Instruct-q4f32_1-MLC';
export function ready(){return !!engine;}
export function unload(){requestRuntime.cancel();generation++;cancelLoad?.(new Error('Model loading cancelled.'));cancelLoad=null;worker?.terminate();worker=null;engine=null;loading=false;}
export async function connect(onProgress){
 if(engine)return;if(loading)throw new Error('The model is already loading.');
 if(!globalThis.navigator?.gpu)throw new Error('This browser does not expose WebGPU. Try a WebGPU-enabled desktop browser. Practice and built-in hints still work.');
 loading=true;const token=++generation;let timer;
 const check=()=>{if(token!==generation)throw new Error('Model loading cancelled.');};
 const cancelled=new Promise((_,reject)=>{cancelLoad=reject;timer=setTimeout(()=>reject(new Error('Model loading timed out. Check your connection and available GPU memory, then retry.')),300000);});
 try {
  const initialize=async()=>{
   const adapter=await navigator.gpu.requestAdapter();check();if(!adapter)throw new Error('No compatible GPU was found. You can keep practicing with the built-in hints.');
   const {CreateWebWorkerMLCEngine}=await import('https://esm.run/@mlc-ai/web-llm@0.2.79');check();
   worker=new Worker(new URL('./ai-worker.mjs',import.meta.url),{type:'module'});
   worker.addEventListener('error',()=>{if(token===generation)cancelLoad?.(new Error('The model worker could not start. Check your connection or browser settings.'));});
   const result=await CreateWebWorkerMLCEngine(worker,MODEL,{initProgressCallback:p=>{if(token===generation)onProgress(p.text);}},{context_window_size:4096});check();return result;
  };
  engine=await Promise.race([initialize(),cancelled]);
 }catch(error){if(token===generation)unload();throw error;}
 finally{clearTimeout(timer);if(token===generation){loading=false;cancelLoad=null;}}
}
export function buildMessages(prompt,context,history){
 return [{role:'system',content:'You are a concise junior coding partner in interview practice. Help with the scoped request. Do not claim to run tests or edit files. State assumptions. The candidate reviews and manually applies suggestions.\n'+context.slice(0,4000)},...history.slice(-2).map(m=>({role:m.role,content:m.content.slice(0,450)})),{role:'user',content:prompt.slice(0,1000)}];
}
// Requests are text-only. Model output never grants permission to execute tools.
export function validateMessages(messages){
 if(!Array.isArray(messages)||messages.length<1||messages.length>12)throw new Error('Provide between 1 and 12 model messages.');
 let size=0;
 const result=messages.map((message,index)=>{
  if(!message||!['system','user','assistant'].includes(message.role)||typeof message.content!=='string'||!message.content.trim())throw new Error('Model messages must contain a supported role and non-empty text.');
  if(message.role==='system'&&index!==0)throw new Error('Only the first model message may contain system instructions.');
  if(Object.keys(message).some(key=>!['role','content'].includes(key)))throw new Error('Model messages cannot contain tool calls or extra fields.');
  size+=message.content.length;
  if(size>10000)throw new Error('Model context exceeds the 10,000-character limit. Shorten the request or file context.');
  return {role:message.role,content:message.content};
 });
 if(result.at(-1).role!=='user')throw new Error('The last model message must be a user request.');
 return result;
}

// The transport adapter also lets tests exercise cancellation without downloading a model.
export function createRequestRuntime({getEngine,stop,timeoutMs=120000}){
 let current=null;
 function cancel(){current?.reject(new Error('Model request cancelled.'));}
 async function request(messages,onText=()=>{},onMetadata=()=>{},{signal,maxTokens=600}={}){
  const localEngine=getEngine();
  if(!localEngine)throw new Error('Load the local model first.');
  if(current)throw new Error('A model request is already running.');
  if(signal?.aborted)throw new Error('Model request cancelled.');
  if(!Number.isInteger(maxTokens)||maxTokens<1||maxTokens>1000)throw new Error('Model output limit must be between 1 and 1,000 tokens.');
  const checked=validateMessages(messages);
  let rejectCancelled,timer,stopped=false;
  const cancellation=new Promise((_,reject)=>{rejectCancelled=reject;});
  const owner={reject:error=>{if(stopped)return;stopped=true;rejectCancelled(error);}};
  current=owner;
  const abort=()=>{owner.reject(new Error('Model request cancelled.'));stop();};
  const isCurrent=()=>!stopped&&current===owner&&getEngine()===localEngine;
  signal?.addEventListener('abort',abort,{once:true});
  timer=setTimeout(()=>{owner.reject(new Error('Model request timed out after two minutes. Reload the model to retry.'));stop();},timeoutMs);
  try{
   const generate=async()=>{
    const stream=await localEngine.chat.completions.create({messages:checked,max_tokens:maxTokens,temperature:0.3,stream:true});
    let reply='',finishReason=null;
    for await(const chunk of stream){
     if(!isCurrent())throw new Error('Model request cancelled.');
     reply+=chunk.choices[0]?.delta?.content||'';
     finishReason=chunk.choices[0]?.finish_reason||finishReason;
     onText(reply);
    }
    if(!isCurrent())throw new Error('Model request cancelled.');
    onMetadata({finishReason});
    return reply;
   };
   return await Promise.race([generate(),cancellation]);
  }finally{
   clearTimeout(timer);signal?.removeEventListener('abort',abort);
   if(current===owner)current=null;
  }
 }
 return {request,cancel};
}
const requestRuntime=createRequestRuntime({getEngine:()=>engine,stop:()=>unload()});
export const request=(...args)=>requestRuntime.request(...args);
export async function ask(prompt,context,history,onText,requestMessages,onMetadata=()=>{}){
 return request(requestMessages||buildMessages(prompt,context,history),onText,onMetadata);
}
