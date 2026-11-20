// Native multi-file lab starters and executable acceptance harnesses.
export const projects={
  "cache": {
    "files": {
      "cache.rs": "#[derive(Clone, Debug, PartialEq)]\nenum Value { Number(i64), Bool(bool), Text(String), Null }\nstruct Cache { now: Rc<Cell<i64>>, entries: HashMap<String, Value> }\nimpl Cache {\n fn new(now: Rc<Cell<i64>>) -> Self { Self { now, entries: HashMap::new() } }\n fn set(&mut self,key:&str,value:Value,ttl:i64) { self.entries.insert(key.to_owned(),value); }\n fn get(&mut self,key:&str)->Option<Value> { self.entries.get(key).cloned() }\n fn size(&mut self)->usize { self.entries.len() }\n}\n",
      "service.rs": "fn lookup<F: FnMut() -> Value>(cache:&mut Cache,key:&str,mut load:F)->Value {\n // TODO: reuse present values; None alone denotes a cache miss.\n let fresh=load(); cache.set(key,fresh.clone(),100); fresh\n}\n"
    },
    "contract": "The two files are joined into one crate (no mod declarations). Keep Value variants Number(i64), Bool(bool), Text(String), Null; Cache::new(Rc<Cell<i64>>), set(&str,Value,i64), get(&str)->Option<Value>, size()->usize. All methods except new take &mut self. None is a miss; Some(Value::Null) is present. lookup accepts &mut Cache, &str and FnMut()->Value. std collections, Rc and Cell imports are supplied."
  },
  "pagination": {
    "files": {
      "order.rs": "#[derive(Clone, Debug, PartialEq)]\nstruct FeedRecord { id:i64, created_at:i64 }\nfn order(records:&[FeedRecord])->Vec<FeedRecord> { records.to_vec() }\n",
      "feed.rs": "#[derive(Debug, PartialEq)]\nstruct Page { items:Vec<FeedRecord>, next_cursor:Option<i64> }\nfn page(records:&[FeedRecord],after:Option<i64>,limit:i64)->Result<Page,String> {\n // TODO: validate limit, order a copy, then form the page.\n Ok(Page {items:vec![],next_cursor:None})\n}\n"
    },
    "contract": "Files share one crate. Keep FeedRecord { id:i64, created_at:i64 }, order(&[FeedRecord])->Vec<FeedRecord>, Page {items:Vec<FeedRecord>,next_cursor:Option<i64>}, page(&[FeedRecord],Option<i64>,i64)->Result<Page,String>. None means absent cursor. Invalid limits return Err; the i64 signature excludes fractional/string limits. Do not add main or mod declarations."
  },
  "events": {
    "files": {
      "normalize.rs": "#[derive(Clone, Debug, PartialEq)]\nstruct Event { id:String, user:String, timestamp:f64, amount:f64 }\nfn normalize(event:&Event)->Option<Event> { Some(event.clone()) }\n",
      "summary.rs": "#[derive(Debug, PartialEq)]\nstruct UserTotal { user:String, count:usize, amount:f64 }\n#[derive(Debug, PartialEq)]\nstruct Summary { users:Vec<UserTotal>, total:f64 }\nfn summarize(events:&[Event],start:i64,end:i64)->Summary {\n // TODO: normalize, keep first valid ID, filter half-open window, group, sort.\n Summary {users:vec![],total:0.0}\n}\n"
    },
    "contract": "Files share one crate. Keep Event {id:String,user:String,timestamp:f64,amount:f64}, normalize(&Event)->Option<Event>, UserTotal {user:String,count:usize,amount:f64}, Summary {users:Vec<UserTotal>,total:f64}, summarize(&[Event],i64 start,i64 end)->Summary. normalize returns an owned fresh clone or None; timestamps must be finite and integral, amounts finite, strings nonempty. Rust static types exclude null/arbitrary object events. Use ordinary Rust String ordering. Standard collection imports are supplied."
  },
  "rate-limit": {
    "files": {
      "limiter.rs": "struct Limiter { limit:usize, window_ms:i64 }\nimpl Limiter {\n fn new(limit:usize,window_ms:i64)->Self { Self {limit,window_ms} }\n fn allow(&mut self,key:&str,now:i64)->bool { true }\n}\n",
      "gateway.rs": "fn handle(limiter:&mut Limiter,keys:&[&str],now:i64)->Vec<bool> {\n // TODO: apply the limiter sequentially to every request.\n vec![]\n}\n"
    },
    "contract": "Files share one crate. Keep Limiter::new(usize limit,i64 window_ms), allow(&mut self,&str key,i64 now)->bool, handle(&mut Limiter,&[&str],i64 now)->Vec<bool>. Limits/windows are positive; timestamps are nonnegative and nondecreasing per key. Standard collection imports are supplied."
  },
  "dependencies": {
    "files": {
      "graph.rs": "#[derive(Clone,Debug,PartialEq)]\nstruct Task { id:String, deps:Vec<String> }\nfn build_graph(tasks:&[Task])->Option<BTreeMap<String,BTreeSet<String>>> {\n // TODO: validate IDs/dependencies and return an owned deduplicated map.\n Some(BTreeMap::new())\n}\n",
      "scheduler.rs": "fn schedule(tasks:&[Task])->Option<Vec<String>> {\n // TODO: use build_graph; return None for invalid input or cycles.\n Some(vec![])\n}\n"
    },
    "contract": "Files share one crate. Keep Task {id:String,deps:Vec<String>}, build_graph(&[Task])->Option<BTreeMap<String,BTreeSet<String>>> (owned graph, None for invalid input), and schedule(&[Task])->Option<Vec<String>> (None for cycles/invalid input). Choose the lexicographically smallest currently-ready ID using Rust String ordering. Imports are supplied."
  },
  "inventory": {
    "files": {
      "inventory.rs": "#[derive(Clone)]\nstruct Item { sku:String, quantity:i64 }\nstruct Inventory { stock:HashMap<String,i64> }\nimpl Inventory {\n fn new(stock:HashMap<String,i64>)->Self { Self {stock} }\n fn available(&self,sku:&str)->i64 { *self.stock.get(sku).unwrap_or(&0) }\n fn reserve(&mut self,id:&str,items:&[Item])->bool { false }\n fn release(&mut self,id:&str)->bool { false }\n}\n",
      "checkout.rs": "struct Order { id:String, items:Vec<Item> }\nfn reserve_many(inventory:&mut Inventory,orders:&[Order])->Vec<bool> {\n // TODO: process every order sequentially through reserve.\n vec![]\n}\n"
    },
    "contract": "Files share one crate. Keep Item {sku:String,quantity:i64}, Inventory::new(HashMap<String,i64>), available(&self,&str)->i64, reserve(&mut self,&str,&[Item])->bool, release(&mut self,&str)->bool, Order {id:String,items:Vec<Item>}, reserve_many(&mut Inventory,&[Order])->Vec<bool>. Initial stock is nonnegative. Types exclude nonintegral quantities; zero/negative quantities fail. Imports are supplied."
  }
};
const checks={
  "cache": [
    "let mut c=cache();c.set(\"a\",Value::Text(\"hello\".into()),10);c.get(\"a\")==Some(Value::Text(\"hello\".into()))",
    "let t=Rc::new(Cell::new(0));let mut c=Cache::new(t.clone());c.set(\"a\",Value::Number(1),10);t.set(9);let live=c.get(\"a\")==Some(Value::Number(1));t.set(10);live&&c.get(\"a\").is_none()",
    "let mut c=cache();[Value::Bool(false),Value::Number(0),Value::Text(\"\".into()),Value::Null].into_iter().all(|v|{c.set(\"a\",v.clone(),10);c.get(\"a\")==Some(v)})",
    "let t=Rc::new(Cell::new(0));let mut c=Cache::new(t.clone());c.set(\"a\",Value::Number(1),10);t.set(5);c.set(\"a\",Value::Number(2),20);t.set(15);c.get(\"a\")==Some(Value::Number(2))&&c.size()==1",
    "let mut c=cache();c.set(\"a\",Value::Number(1),10);c.set(\"a\",Value::Number(2),0);c.set(\"b\",Value::Number(3),-1);c.get(\"a\").is_none()&&c.size()==0",
    "let t=Rc::new(Cell::new(0));let mut c=Cache::new(t.clone());c.set(\"a\",Value::Number(1),5);c.set(\"b\",Value::Number(2),20);t.set(5);let one=c.size()==1;t.set(20);one&&c.size()==0",
    "[Value::Number(0),Value::Bool(false),Value::Text(\"\".into()),Value::Null].into_iter().all(|v|{let mut c=cache();let mut calls=0;let mut load=||{calls+=1;v.clone()};lookup(&mut c,\"a\",&mut load);let got=lookup(&mut c,\"a\",&mut load);got==v&&calls==1})",
    "let t=Rc::new(Cell::new(0));let mut c=Cache::new(t.clone());let mut calls=0;let mut load=||{calls+=1;Value::Number(calls)};lookup(&mut c,\"a\",&mut load);t.set(100);lookup(&mut c,\"a\",&mut load)==Value::Number(2)"
  ],
  "pagination": [
    "ids(&order(&records()))==vec![4,3,2,1]",
    "ids(&order(&[rec(1,1),rec(3,1),rec(2,1)]))==vec![3,2,1]",
    "let p=page(&records(),None,2).unwrap();let q=page(&records(),p.next_cursor,1).unwrap();ids(&p.items)==vec![4,3]&&p.next_cursor==Some(3)&&ids(&q.items)==vec![2]&&q.next_cursor==Some(2)",
    "let p=page(&records(),Some(3),2).unwrap();ids(&p.items)==vec![2,1]&&p.next_cursor.is_none()",
    "let p=page(&records(),Some(999),2).unwrap();p.items.is_empty()&&p.next_cursor.is_none()",
    "let r=records();let copy=r.clone();order(&r);page(&r,None,2).unwrap();r==copy",
    "[0,-1,101].into_iter().all(|n|page(&records(),None,n).is_err())",
    "let a=page(&[],None,1).unwrap();let b=page(&[rec(1,10)],None,1).unwrap();let c=page(&[rec(1,10)],Some(1),1).unwrap();a.items.is_empty()&&a.next_cursor.is_none()&&ids(&b.items)==vec![1]&&b.next_cursor.is_none()&&c.items.is_empty()&&c.next_cursor.is_none()"
  ],
  "events": [
    "summarize(&[e(\"1\",\"a\",5.0,2.0),e(\"2\",\"a\",5.0,2.0),e(\"3\",\"b\",5.0,2.0)],0,10)==sum(vec![u(\"a\",2,4.0),u(\"b\",1,2.0)],6.0)",
    "summarize(&[e(\"1\",\"a\",5.0,2.0),e(\"1\",\"b\",6.0,10.0)],0,10)==sum(vec![u(\"a\",1,2.0)],2.0)",
    "summarize(&[e(\"1\",\"a\",0.0,2.0),e(\"2\",\"a\",10.0,2.0)],0,10)==sum(vec![u(\"a\",1,2.0)],2.0)",
    "let bad=[e(\"\",\"a\",1.0,2.0),e(\"1\",\"\",1.0,2.0),e(\"1\",\"a\",1.5,2.0),e(\"1\",\"a\",2.0,f64::INFINITY)];let original=e(\"1\",\"a\",5.0,2.0);bad.iter().all(|v|normalize(v).is_none())&&normalize(&original)==Some(original.clone())&&summarize(&[e(\"1\",\"a\",2.0,f64::NAN),original],0,10).total==2.0",
    "summarize(&[e(\"1\",\"a\",5.0,0.0),e(\"2\",\"a\",5.0,-3.0)],0,10)==sum(vec![u(\"a\",2,-3.0)],-3.0)",
    "summarize(&[e(\"1\",\"a\",-1.0,2.0),e(\"1\",\"a\",5.0,2.0)],0,10)==sum(vec![],0.0)",
    "let input=vec![e(\"1\",\"z\",5.0,2.0),e(\"2\",\"a\",5.0,2.0)];let copy=input.clone();let out=summarize(&input,0,10);input==copy&&out==sum(vec![u(\"a\",1,2.0),u(\"z\",1,2.0)],4.0)",
    "let input:Vec<Event>=(0..20000).map(|i|e(&i.to_string(),\"a\",5.0,2.0)).collect();summarize(&input,0,10)==sum(vec![u(\"a\",20000,40000.0)],40000.0)"
  ],
  "rate-limit": [
    "let mut l=Limiter::new(2,10);l.allow(\"a\",0)&&l.allow(\"a\",1)",
    "let mut l=Limiter::new(1,10);l.allow(\"a\",0)&&!l.allow(\"a\",1)&&!l.allow(\"a\",9)",
    "let mut l=Limiter::new(1,10);l.allow(\"a\",5)&&!l.allow(\"a\",14)&&l.allow(\"a\",15)",
    "let mut l=Limiter::new(1,10);l.allow(\"a\",0)&&l.allow(\"b\",1)&&!l.allow(\"a\",2)&&!l.allow(\"b\",2)",
    "let mut l=Limiter::new(1,10);l.allow(\"a\",0)&&!l.allow(\"a\",9)&&l.allow(\"a\",10)",
    "let mut l=Limiter::new(1,10);l.allow(\"a\",3)&&l.allow(\"a\",100)&&!l.allow(\"a\",109)&&l.allow(\"a\",110)",
    "handle(&mut Limiter::new(2,10),&[\"a\",\"a\",\"b\",\"a\",\"b\"],0)==vec![true,true,true,false,true]",
    "let mut a=Limiter::new(1,10);let mut b=Limiter::new(1,10);a.allow(\"x\",0)&&!a.allow(\"x\",1)&&b.allow(\"x\",1)"
  ],
  "dependencies": [
    "schedule(&[t(\"c\",&[\"b\"]),t(\"a\",&[]),t(\"b\",&[\"a\"])])==Some(strings(&[\"a\",\"b\",\"c\"]))",
    "schedule(&[t(\"z\",&[]),t(\"b\",&[]),t(\"a\",&[\"b\"])])==Some(strings(&[\"b\",\"a\",\"z\"]))",
    "schedule(&[t(\"a\",&[]),t(\"b\",&[\"a\",\"a\"])])==Some(strings(&[\"a\",\"b\"]))",
    "schedule(&[t(\"a\",&[\"missing\"])]).is_none()",
    "schedule(&[t(\"a\",&[\"b\"]),t(\"b\",&[\"a\"])]).is_none()&&schedule(&[t(\"a\",&[\"a\"])]).is_none()",
    "schedule(&[t(\"a\",&[]),t(\"a\",&[])]).is_none()&&schedule(&[t(\"\",&[])]).is_none()",
    "schedule(&[])==Some(vec![])",
    "let input=vec![t(\"b\",&[\"a\",\"a\"]),t(\"a\",&[])];let copy=input.clone();schedule(&input);input==copy"
  ],
  "inventory": [
    "let mut i=inv();i.reserve(\"1\",&[item(\"a\",2)])&&i.available(\"a\")==3&&i.available(\"unknown\")==0",
    "let mut i=inv();!i.reserve(\"1\",&[item(\"a\",2),item(\"b\",9)])&&i.available(\"a\")==5&&i.available(\"b\")==2",
    "let mut i=inv();!i.reserve(\"1\",&[item(\"a\",3),item(\"a\",3)])&&i.available(\"a\")==5&&i.reserve(\"2\",&[item(\"a\",2),item(\"a\",3)])&&i.available(\"a\")==0",
    "let mut i=inv();i.reserve(\"1\",&[item(\"a\",2)])&&i.reserve(\"1\",&[item(\"b\",100)])&&i.available(\"a\")==3&&i.available(\"b\")==2",
    "let mut i=inv();i.reserve(\"1\",&[item(\"a\",2)])&&i.release(\"1\")&&i.available(\"a\")==5&&!i.release(\"1\")&&i.reserve(\"1\",&[item(\"a\",1)])&&i.available(\"a\")==4",
    "let mut i=inv();!i.reserve(\"1\",&[item(\"a\",6)])&&i.reserve(\"1\",&[item(\"a\",1)])&&i.available(\"a\")==4",
    "let mut i=inv();!i.reserve(\"1\",&[])&&!i.reserve(\"2\",&[item(\"x\",1)])&&!i.reserve(\"3\",&[item(\"a\",0)])&&!i.reserve(\"4\",&[item(\"a\",-1)])&&i.available(\"a\")==5",
    "let mut i=inv();reserve_many(&mut i,&[ord(\"1\",vec![item(\"a\",4)]),ord(\"2\",vec![item(\"a\",2)]),ord(\"3\",vec![item(\"b\",2)])])==vec![true,false,true]&&i.available(\"a\")==1&&i.available(\"b\")==0"
  ]
};
const helpers={
  "cache": "fn cache()->Cache{Cache::new(Rc::new(Cell::new(0)))}",
  "pagination": "fn rec(id:i64,created_at:i64)->FeedRecord{FeedRecord{id,created_at}}fn records()->Vec<FeedRecord>{vec![rec(1,10),rec(2,20),rec(3,20),rec(4,30)]}fn ids(records:&[FeedRecord])->Vec<i64>{records.iter().map(|r|r.id).collect()}",
  "events": "fn e(id:&str,user:&str,timestamp:f64,amount:f64)->Event{Event{id:id.into(),user:user.into(),timestamp,amount}}fn u(user:&str,count:usize,amount:f64)->UserTotal{UserTotal{user:user.into(),count,amount}}fn sum(users:Vec<UserTotal>,total:f64)->Summary{Summary{users,total}}",
  "dependencies": "fn strings(s:&[&str])->Vec<String>{s.iter().map(|s|s.to_string()).collect()}fn t(id:&str,deps:&[&str])->Task{Task{id:id.into(),deps:strings(deps)}}",
  "inventory": "fn inv()->Inventory{Inventory::new(HashMap::from([(\"a\".into(),5),(\"b\".into(),2)]))}fn item(sku:&str,quantity:i64)->Item{Item{sku:sku.into(),quantity}}fn ord(id:&str,items:Vec<Item>)->Order{Order{id:id.into(),items}}"
};
function sources(id,files){const project=Object.hasOwn(projects,id)?projects[id]:null;if(!project)throw new Error('Unknown lab');return Object.keys(project.files).map(name=>{if(typeof files[name]!=='string')throw new Error('Missing exercise file: '+name);if(files[name].length>100000)throw new Error('Exercise file is too large.');return files[name];}).join('\n');}
export function buildProgram(id,files){
 const code=sources(id,files);
 const body=checks[id].map((check,i)=>`check(${i},||{${check}});`).join('\n');
 return '#![allow(dead_code,unused_variables,unused_imports)]\nuse std::collections::{HashMap,HashSet,BTreeMap,BTreeSet};\nuse std::rc::Rc;\nuse std::cell::Cell;\n'+code+'\n'+(helpers[id]||'')+'\nfn check<F:FnOnce()->bool>(i:usize,f:F){let passed=std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)).unwrap_or(false);println!("__ALGO_ARCADE_RESULT_{}__{{\\\"value\\\":{}}}",i,passed);}\nfn main(){std::panic::set_hook(Box::new(|_|{}));\n'+body+'\n}\n';
}
