// Independent of progress backups: full session logs are kept in IndexedDB.
let connection;
const memory=new Map();
function database(){
 if(!globalThis.indexedDB)return Promise.reject(new Error('Session storage is unavailable.'));
 if(!connection)connection=new Promise((resolve,reject)=>{
  const request=indexedDB.open('newcode-session-history',1);
  request.onupgradeneeded=()=>{const store=request.result.createObjectStore('sessions',{keyPath:'id'});store.createIndex('updatedAt','updatedAt');};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>{connection=null;reject(request.error);};
  request.onblocked=()=>{connection=null;reject(new Error('Session history is blocked by another tab.'));};
 });
 return connection;
}
export async function saveSession(session){
 const value=structuredClone(session);memory.set(value.id,value);
 try{const db=await database();await new Promise((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').put(value);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});return true;}catch{return false;}
}
export async function getSession(id){
 if(memory.has(id))return structuredClone(memory.get(id));
 const db=await database();return new Promise((resolve,reject)=>{const request=db.transaction('sessions').objectStore('sessions').get(id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
}
export async function listSessions(){
 let saved=[];let persistent=true;
 try{const db=await database();saved=await new Promise((resolve,reject)=>{const request=db.transaction('sessions').objectStore('sessions').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}catch{persistent=false;}
 const all=new Map(saved.map(s=>[s.id,s]));for(const [id,s] of memory)all.set(id,s);
 return {persistent,sessions:[...all.values()].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map(s=>({id:s.id,title:s.problem.title,startedAt:s.startedAt,updatedAt:s.updatedAt,endedAt:s.endedAt,prompts:s.events.filter(e=>e.type==='ai.turn').length,runs:s.events.filter(e=>e.type==='test.run').length}))};
}
