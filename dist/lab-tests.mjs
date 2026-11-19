// Educational fixtures, evaluated only in a disposable worker by the website.
export function loadProject(files) {
 const cache = new Map();
 function load(name) {
  name = name.replace(/^\.\//,'');
  if (!Object.hasOwn(files,name)) throw new Error(`Unknown module: ${name}`);
  if(cache.has(name)) return cache.get(name).exports;
  const module = {exports:{}}; cache.set(name,module);
  new Function('module','exports','require', '"use strict";\n'+files[name])(module,module.exports,load);
  return module.exports;
 }
 return load;
}
const eq=(actual,expected)=>{if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`Expected ${JSON.stringify(expected)}; received ${JSON.stringify(actual)}`);};
export async function evaluateLab(id,files) {
 const checks=[]; const check=(name,fn)=>checks.push({name,fn});
 const load=loadProject(files);
 if(id==='cache') {
  const {createCache}=load('cache.js'), {lookup}=load('service.js');
  const setup=()=>{let t=0;return {cache:createCache(()=>t),tick:n=>t=n};};
  check('Read a live value',()=>{const {cache}=setup();cache.set('a','hello',10);eq(cache.get('a'),'hello');});
  check('Expire at the exact deadline',()=>{const {cache,tick}=setup();cache.set('a',1,10);tick(9);eq(cache.get('a'),1);tick(10);eq(cache.get('a'),undefined);});
  check('Preserve false and zero',()=>{const {cache}=setup();for(const v of [false,0,'',null]){cache.set('a',v,10);eq(cache.get('a'),v);}});
  check('Replace an existing key',()=>{const {cache,tick}=setup();cache.set('a',1,10);tick(5);cache.set('a',2,20);tick(15);eq(cache.get('a'),2);eq(cache.size(),1);});
  check('Remove non-positive TTL values',()=>{const {cache}=setup();cache.set('a',1,10);cache.set('a',2,0);eq(cache.get('a'),undefined);cache.set('b',3,-1);eq(cache.size(),0);});
  check('Count only live entries',()=>{const {cache,tick}=setup();cache.set('a',1,5);cache.set('b',2,20);tick(5);eq(cache.size(),1);tick(20);eq(cache.size(),0);});
  check('Avoid duplicate service loads',()=>{for(const value of [0,false,'',null]){const {cache}=setup();let calls=0;const fn=()=>{calls++;return value;};lookup(cache,'a',fn);eq(lookup(cache,'a',fn),value);eq(calls,1);}});
  check('Reload an expired service value',()=>{const {cache,tick}=setup();let calls=0;const fn=()=>++calls;lookup(cache,'a',fn);tick(100);eq(lookup(cache,'a',fn),2);});
 } else if(id==='pagination') {
  const {order}=load('order.js'),{page}=load('feed.js');
  const records=[{id:1,createdAt:10},{id:2,createdAt:20},{id:3,createdAt:20},{id:4,createdAt:30}];
  check('Newest records first',()=>eq(order(structuredClone(records)).map(r=>r.id),[4,3,2,1]));
  check('Deterministic timestamp ties',()=>eq(order([{id:1,createdAt:1},{id:3,createdAt:1},{id:2,createdAt:1}]).map(r=>r.id),[3,2,1]));
  check('Follow a cursor without duplication',()=>{const p=page(structuredClone(records),null,2);eq(p,{items:[records[3],records[2]],nextCursor:3});eq(page(structuredClone(records),p.nextCursor,1),{items:[records[1]],nextCursor:2});});
  check('Final page has no cursor',()=>eq(page(structuredClone(records),3,2),{items:[records[1],records[0]],nextCursor:null}));
  check('Unknown cursor returns empty',()=>eq(page(structuredClone(records),999,2),{items:[],nextCursor:null}));
  check('Do not mutate input',()=>{const input=structuredClone(records);order(input);page(input,null,2);eq(input,records);});
  check('Reject invalid page sizes',()=>{for(const n of [0,-1,101,1.5,'2',NaN]){let error;try{page(records,null,n);}catch(e){error=e;}if(!(error instanceof RangeError))throw new Error(`limit ${n} must throw RangeError`);}});
  check('Handle empty and single-record feeds',()=>{eq(page([],null,1),{items:[],nextCursor:null});eq(page([records[0]],null,1),{items:[records[0]],nextCursor:null});eq(page([records[0]],1,1),{items:[],nextCursor:null});});
 } else if(id==='events') {
  const {normalize}=load('normalize.js'),{summarize}=load('summary.js');
  const e=(id,user='a',timestamp=5,amount=2)=>({id,user,timestamp,amount});
  check('Aggregate events by user',()=>eq(summarize([e('1'),e('2'),e('3','b')],0,10),{users:[{user:'a',count:2,amount:4},{user:'b',count:1,amount:2}],total:6}));
  check('Count repeated IDs once',()=>eq(summarize([e('1'),e('1','b',6,10)],0,10),{users:[{user:'a',count:1,amount:2}],total:2}));
  check('Use a half-open time window',()=>eq(summarize([e('1','a',0),e('2','a',10)],0,10),{users:[{user:'a',count:1,amount:2}],total:2}));
  check('Ignore invalid records',()=>{for(const x of [null,{},e('', 'a'),e('1',''),e('1','a',1.5),e('1','a',2,Infinity),e('1','a',2,'2')])eq(normalize(x),null);const original={...e('1'),extra:true};const n=normalize(original);eq(n,e('1'));if(n===original)throw new Error('Return a fresh object');eq(summarize([{},e('1','a',2,NaN),e('1')],0,10),{users:[{user:'a',count:1,amount:2}],total:2});});
  check('Preserve zero and negative amounts',()=>eq(summarize([e('1','a',5,0),e('2','a',5,-3)],0,10),{users:[{user:'a',count:2,amount:-3}],total:-3}));
  check('Deduplicate before window filtering',()=>eq(summarize([e('1','a',-1),e('1','a',5)],0,10),{users:[],total:0}));
  check('Sort users and preserve inputs',()=>{const input=[e('1','z'),e('2','a')],copy=structuredClone(input);eq(summarize(input,0,10),{users:[{user:'a',count:1,amount:2},{user:'z',count:1,amount:2}],total:4});eq(input,copy);});
  check('Process a larger batch',()=>{const input=Array.from({length:20000},(_,i)=>e(String(i),'a'));eq(summarize(input,0,10),{users:[{user:'a',count:20000,amount:40000}],total:40000});});
 } else throw new Error('Unknown lab');
 const results=[];
 for(const {name,fn} of checks){try{await fn();results.push({name,passed:true});}catch(error){results.push({name,passed:false,error:String(error.message).slice(0,1500)});}}
 return results;
}
