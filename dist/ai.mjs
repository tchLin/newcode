let engine=null,worker=null,loading=false,generation=0,cancelLoad=null;
export const MODEL='Qwen2.5-Coder-1.5B-Instruct-q4f32_1-MLC';
export function ready(){return !!engine;}
export function unload(){generation++;cancelLoad?.(new Error('Model loading cancelled.'));cancelLoad=null;worker?.terminate();worker=null;engine=null;loading=false;}
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
export async function ask(prompt,context,history,onText){
 if(!engine)throw new Error('Load the local model first.');
 const stream=await engine.chat.completions.create({messages:buildMessages(prompt,context,history),max_tokens:600,temperature:0.3,stream:true});
 let reply='';for await(const chunk of stream){reply+=chunk.choices[0]?.delta?.content||'';onText(reply);}return reply;
}
