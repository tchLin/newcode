import {projects as pythonProjects} from '../../dist/lab-languages/python.mjs';
import {projects as goProjects} from '../../dist/lab-languages/go.mjs';
export const labPythonGoSolutions={python:{},go:{}};
const put=(language,id,changes)=>{const projects=language==='python'?pythonProjects:goProjects;labPythonGoSolutions[language][id]={...projects[id].files,...changes};};
put('python','cache',{'cache.py':`MISSING=object()
class Cache:
 def __init__(self,now): self.now,self.entries=now,{}
 def set(self,key,value,ttl):
  if ttl<=0: self.entries.pop(key,None)
  else: self.entries[key]=(value,self.now()+ttl)
 def get(self,key):
  entry=self.entries.get(key)
  if entry is not None and self.now()>=entry[1]: self.entries.pop(key); entry=None
  return MISSING if entry is None else entry[0]
 def size(self):
  for key in list(self.entries): self.get(key)
  return len(self.entries)
def create_cache(now): return Cache(now)
`,'service.py':`def lookup(cache,key,load):
 value=cache.get(key)
 if value is not MISSING: return value
 value=load(); cache.set(key,value,100); return value
`});
put('python','pagination',{'order.py':`def order(records): return sorted(records,key=lambda r:(-r['createdAt'],-r['id']))
`,'feed.py':`def page(records,after=None,limit=10):
 if type(limit) is not int or not 1<=limit<=100: raise ValueError('limit')
 data=order(records); index=-1
 if after is not None:
  index=next((i for i,r in enumerate(data) if r['id']==after),-1)
  if index==-1: return {'items':[],'nextCursor':None}
 start=index+1; items=data[start:start+limit]
 return {'items':items,'nextCursor':items[-1]['id'] if start+len(items)<len(data) else None}
`});
put('python','events',{'normalize.py':`import math
def normalize(e):
 if not isinstance(e,dict): return None
 if not isinstance(e.get('id'),str) or not e['id'] or not isinstance(e.get('user'),str) or not e['user']: return None
 t,a=e.get('timestamp'),e.get('amount')
 if type(t) not in (int,float) or not math.isfinite(t) or t!=int(t) or type(a) not in (int,float) or not math.isfinite(a): return None
 return {k:e[k] for k in ('id','user','timestamp','amount')}
`,'summary.py':`def summarize(events,start,end):
 seen=set(); users={}; total=0
 for raw in events:
  e=normalize(raw)
  if e is None or e['id'] in seen: continue
  seen.add(e['id'])
  if not start<=e['timestamp']<end: continue
  u=users.setdefault(e['user'],{'user':e['user'],'count':0,'amount':0})
  u['count']+=1;u['amount']+=e['amount'];total+=e['amount']
 return {'users':[users[k] for k in sorted(users)],'total':total}
`});
put('python','rate-limit',{'limiter.py':`class Limiter:
 def __init__(self,limit,window_ms): self.limit,self.window_ms,self.windows=limit,window_ms,{}
 def allow(self,key,now):
  start,count=self.windows.get(key,(now,0))
  if now-start>=self.window_ms: start,count=now,0
  if count>=self.limit: return False
  self.windows[key]=(start,count+1);return True
def create_limiter(limit,window_ms): return Limiter(limit,window_ms)
`});
put('python','dependencies',{'graph.py':`def build_graph(tasks):
 graph={}
 for task in tasks:
  if not task['id'] or task['id'] in graph: return None
  graph[task['id']]=set(task['deps'])
 if any(dep not in graph for deps in graph.values() for dep in deps): return None
 return graph
`,'scheduler.py':`def schedule(tasks):
 graph=build_graph(tasks)
 if graph is None: return None
 result=[]
 while graph:
  ready=sorted(key for key,deps in graph.items() if not deps)
  if not ready: return None
  key=ready[0];result.append(key);del graph[key]
  for deps in graph.values(): deps.discard(key)
 return result
`});
put('python','inventory',{'inventory.py':`class Inventory:
 def __init__(self,stock): self.stock,self.orders=dict(stock),{}
 def available(self,sku): return self.stock.get(sku,0)
 def reserve(self,order_id,items):
  if order_id in self.orders: return True
  if not items: return False
  totals={}
  for line in items:
   sku,qty=line['sku'],line['quantity']
   if sku not in self.stock or type(qty) is not int or qty<=0: return False
   totals[sku]=totals.get(sku,0)+qty
  if any(qty>self.stock[sku] for sku,qty in totals.items()): return False
  for sku,qty in totals.items(): self.stock[sku]-=qty
  self.orders[order_id]=totals;return True
 def release(self,order_id):
  if order_id not in self.orders: return False
  for sku,qty in self.orders.pop(order_id).items(): self.stock[sku]+=qty
  return True
def create_inventory(stock): return Inventory(stock)
`});
put('go','cache',{'cache.go':`package main
type cacheEntry struct{value any;expires int64}
type Cache struct{now func()int64;entries map[string]cacheEntry}
func NewCache(now func()int64)*Cache{return &Cache{now,map[string]cacheEntry{}}}
func(c *Cache)Set(k string,v any,ttl int64){if ttl<=0{delete(c.entries,k)}else{c.entries[k]=cacheEntry{v,c.now()+ttl}}}
func(c *Cache)Get(k string)(any,bool){e,ok:=c.entries[k];if ok&&c.now()>=e.expires{delete(c.entries,k);return nil,false};return e.value,ok}
func(c *Cache)Size()int{for k:=range c.entries{c.Get(k)};return len(c.entries)}
`,'service.go':`package main
func Lookup(c *Cache,k string,load func()any)any{if v,ok:=c.Get(k);ok{return v};v:=load();c.Set(k,v,100);return v}
`});
put('go','pagination',{'order.go':`package main
import "sort"
type Record struct{ID int;CreatedAt int64}
func Order(records []Record)[]Record{out:=append([]Record{},records...);sort.Slice(out,func(i,j int)bool{if out[i].CreatedAt==out[j].CreatedAt{return out[i].ID>out[j].ID};return out[i].CreatedAt>out[j].CreatedAt});return out}
`,'feed.go':`package main
import "errors"
type Page struct{Items []Record;NextCursor *int}
func Paginate(records []Record,after *int,limit int)(Page,error){if limit<1||limit>100{return Page{},errors.New("limit")};data:=Order(records);start:=0;if after!=nil{found:=false;for i,r:=range data{if r.ID==*after{start=i+1;found=true;break}};if !found{return Page{Items:[]Record{}},nil}};end:=start+limit;if end>len(data){end=len(data)};p:=Page{Items:append([]Record{},data[start:end]...)};if end<len(data){cursor:=p.Items[len(p.Items)-1].ID;p.NextCursor=&cursor};return p,nil}
`});
put('go','events',{'normalize.go':`package main
import "math"
type Event struct{ID string;User string;Timestamp float64;Amount float64}
type UserTotal struct{User string;Count int;Amount float64}
type Summary struct{Users []UserTotal;Total float64}
func Normalize(e *Event)*Event{if e==nil||e.ID==""||e.User==""||math.IsNaN(e.Timestamp)||math.IsInf(e.Timestamp,0)||e.Timestamp!=math.Trunc(e.Timestamp)||math.IsNaN(e.Amount)||math.IsInf(e.Amount,0){return nil};copy:=*e;return &copy}
`,'summary.go':`package main
import "sort"
func Summarize(events []*Event,start,end float64)Summary{seen:=map[string]bool{};users:=map[string]UserTotal{};total:=0.0;for _,raw:=range events{e:=Normalize(raw);if e==nil||seen[e.ID]{continue};seen[e.ID]=true;if e.Timestamp<start||e.Timestamp>=end{continue};u:=users[e.User];u.User=e.User;u.Count++;u.Amount+=e.Amount;users[e.User]=u;total+=e.Amount};keys:=[]string{};for k:=range users{keys=append(keys,k)};sort.Strings(keys);out:=[]UserTotal{};for _,k:=range keys{out=append(out,users[k])};return Summary{out,total}}
`});
put('go','rate-limit',{'limiter.go':`package main
type window struct{start int64;count int}
type Limiter struct{limit int;windowMs int64;windows map[string]window}
func NewLimiter(limit int,windowMs int64)*Limiter{return &Limiter{limit,windowMs,map[string]window{}}}
func(l *Limiter)Allow(key string,now int64)bool{w,ok:=l.windows[key];if !ok||now-w.start>=l.windowMs{w=window{now,0}};if w.count>=l.limit{return false};w.count++;l.windows[key]=w;return true}
`});
put('go','dependencies',{'graph.go':`package main
import "errors"
type Task struct{ID string;Deps []string}
func BuildGraph(tasks []Task)(map[string]map[string]bool,error){g:=map[string]map[string]bool{};for _,t:=range tasks{if t.ID==""{return nil,errors.New("empty ID")};if _,ok:=g[t.ID];ok{return nil,errors.New("duplicate ID")};deps:=map[string]bool{};for _,d:=range t.Deps{deps[d]=true};g[t.ID]=deps};for _,deps:=range g{for d:=range deps{if _,ok:=g[d];!ok{return nil,errors.New("unknown dependency")}}};return g,nil}
`,'scheduler.go':`package main
import "sort"
import "errors"
func Schedule(tasks []Task)([]string,error){g,e:=BuildGraph(tasks);if e!=nil{return nil,e};result:=[]string{};for len(g)>0{ready:=[]string{};for k,deps:=range g{if len(deps)==0{ready=append(ready,k)}};if len(ready)==0{return nil,errors.New("cycle")};sort.Strings(ready);key:=ready[0];result=append(result,key);delete(g,key);for _,deps:=range g{delete(deps,key)}};return result,nil}
`});
put('go','inventory',{'inventory.go':`package main
type Line struct{SKU string;Quantity int}
type Order struct{ID string;Items []Line}
type Inventory struct{stock map[string]int;orders map[string]map[string]int}
func NewInventory(stock map[string]int)*Inventory{copy:=map[string]int{};for k,v:=range stock{copy[k]=v};return &Inventory{copy,map[string]map[string]int{}}}
func(i *Inventory)Available(sku string)int{return i.stock[sku]}
func(i *Inventory)Reserve(id string,items []Line)bool{if _,ok:=i.orders[id];ok{return true};if len(items)==0{return false};totals:=map[string]int{};for _,line:=range items{if _,ok:=i.stock[line.SKU];!ok||line.Quantity<=0{return false};totals[line.SKU]+=line.Quantity};for sku,qty:=range totals{if qty>i.stock[sku]{return false}};for sku,qty:=range totals{i.stock[sku]-=qty};i.orders[id]=totals;return true}
func(i *Inventory)Release(id string)bool{items,ok:=i.orders[id];if !ok{return false};for sku,qty:=range items{i.stock[sku]+=qty};delete(i.orders,id);return true}
`});
