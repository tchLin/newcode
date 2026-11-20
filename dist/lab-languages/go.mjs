const project=(files,contract)=>({files,contract:'Go files share package main and are combined for the runner; the harness supplies main. Standard-library imports may be added. '+contract});
export const projects={
 cache:project({'cache.go':`package main\ntype cacheEntry struct { value any; expires int64 }\ntype Cache struct { now func() int64; entries map[string]cacheEntry }\nfunc NewCache(now func() int64) *Cache { return &Cache{now:now,entries:map[string]cacheEntry{}} }\nfunc (c *Cache) Set(key string,value any,ttl int64) { c.entries[key]=cacheEntry{value,c.now()+ttl} }\nfunc (c *Cache) Get(key string) (any,bool) { e,ok:=c.entries[key]; return e.value,ok }\nfunc (c *Cache) Size() int { return len(c.entries) }\n`,'service.go':`package main\nfunc Lookup(c *Cache,key string,load func() any) any {\n // TODO: load only when the cache entry is absent.\n fresh:=load(); c.Set(key,fresh,100); return fresh\n}\n`},'Implement NewCache(func() int64), (*Cache).Set(string,any,int64), Get(string)(any,bool), Size()int and Lookup(*Cache,string,func()any)any. Get returns found=false only when missing/expired; nil, false, zero and empty string are cached values.'),
 pagination:project({'order.go':`package main\ntype Record struct { ID int; CreatedAt int64 }\nfunc Order(records []Record) []Record {\n // TODO: return a sorted copy.\n return records\n}\n`,'feed.go':`package main\ntype Page struct { Items []Record; NextCursor *int }\nfunc Paginate(records []Record,after *int,limit int) (Page,error) {\n // TODO: validate limit, use Order, and locate the cursor.\n return Page{Items:[]Record{}},nil\n}\n`},'Record has ID int and CreatedAt int64. Order returns a new []Record. Paginate([]Record,*int,int)(Page,error), with Page{Items []Record,NextCursor *int}; nil cursor means none. Return a non-nil error for limits outside 1..100. Static int typing excludes fractional/string limits.'),
 events:project({'normalize.go':`package main\ntype Event struct { ID string; User string; Timestamp float64; Amount float64 }\ntype UserTotal struct { User string; Count int; Amount float64 }\ntype Summary struct { Users []UserTotal; Total float64 }\nfunc Normalize(event *Event) *Event {\n // TODO: validate fields and return a new value.\n return event\n}\n`,'summary.go':`package main\nfunc Summarize(events []*Event,start,end float64) Summary {\n // TODO: normalize, deduplicate, filter, aggregate, sort.\n return Summary{Users:[]UserTotal{}}\n}\n`},'Event has ID/User string and Timestamp/Amount float64. Normalize(*Event)*Event returns a fresh pointer or nil; timestamps must be finite integers and amounts finite. Typed fields replace malformed-type checks; nil and invalid values are still checked. Summarize([]*Event,float64,float64)Summary returns sorted []UserTotal and Total.'),
 'rate-limit':project({'limiter.go':`package main\ntype window struct { start int64; count int }\ntype Limiter struct { limit int; windowMs int64; windows map[string]window }\nfunc NewLimiter(limit int,windowMs int64) *Limiter { return &Limiter{limit:limit,windowMs:windowMs,windows:map[string]window{}} }\nfunc (l *Limiter) Allow(key string,now int64) bool {\n // TODO: enforce independent fixed windows.\n return true\n}\n`,'service.go':`package main\nfunc Handle(l *Limiter,keys []string,now int64) []bool {\n result:=make([]bool,len(keys)); for i,key:=range keys { result[i]=l.Allow(key,now) }; return result\n}\n`},'Implement NewLimiter(int,int64)*Limiter, (*Limiter).Allow(string,int64)bool and Handle(*Limiter,[]string,int64)[]bool. Use integer milliseconds and preserve per-key windows.'),
 dependencies:project({'graph.go':`package main\ntype Task struct { ID string; Deps []string }\nfunc BuildGraph(tasks []Task) (map[string]map[string]bool,error) {\n // TODO: validate and deduplicate dependencies without mutation.\n return map[string]map[string]bool{},nil\n}\n`,'scheduler.go':`package main\nfunc Schedule(tasks []Task) ([]string,error) {\n // TODO: use BuildGraph, choose smallest ready ID, detect cycles.\n return []string{},nil\n}\n`},'Task{ID string,Deps []string}. BuildGraph([]Task)(map[string]map[string]bool,error) creates dependency sets. Schedule([]Task)([]string,error) returns ordering or non-nil error for invalid input/cycles. Return an empty slice for an empty graph.'),
 inventory:project({'inventory.go':`package main\ntype Line struct { SKU string; Quantity int }\ntype Order struct { ID string; Items []Line }\ntype Inventory struct { stock map[string]int; orders map[string]map[string]int }\nfunc NewInventory(stock map[string]int) *Inventory {\n copy:=map[string]int{}; for k,v:=range stock { copy[k]=v }; return &Inventory{stock:copy,orders:map[string]map[string]int{}}\n}\nfunc (i *Inventory) Available(sku string) int { return i.stock[sku] }\nfunc (i *Inventory) Reserve(orderID string,items []Line) bool { return false }\nfunc (i *Inventory) Release(orderID string) bool { return false }\n`,'service.go':`package main\nfunc ReserveMany(inventory *Inventory,orders []Order) []bool {\n result:=make([]bool,len(orders)); for i,order:=range orders { result[i]=inventory.Reserve(order.ID,order.Items) }; return result\n}\n`},'Line{SKU string,Quantity int}, Order{ID string,Items []Line}. Implement NewInventory(map[string]int)*Inventory, Available(string)int, Reserve(string,[]Line)bool, Release(string)bool, ReserveMany(*Inventory,[]Order)[]bool. Static integer types exclude fractional quantities; validate positive quantities and SKU existence, copy initial stock.')
};
const checks={
 cache:[
 `c,_:=setup(); c.Set("a","hello",10); v,ok:=c.Get("a"); must(ok&&v=="hello")`,
 `c,t:=setup();c.Set("a",1,10);*t=9;v,ok:=c.Get("a");must(ok&&v==1);*t=10;_,ok=c.Get("a");must(!ok)`,
 `for _,value:=range []any{false,0,"",nil}{c,_:=setup();c.Set("a",value,10);v,ok:=c.Get("a");must(ok&&reflect.DeepEqual(v,value))}`,
 `c,t:=setup();c.Set("a",1,10);*t=5;c.Set("a",2,20);*t=15;v,ok:=c.Get("a");must(ok&&v==2&&c.Size()==1)`,
 `c,_:=setup();c.Set("a",1,10);c.Set("a",2,0);c.Set("b",3,-1);_,ok:=c.Get("a");must(!ok&&c.Size()==0)`,
 `c,t:=setup();c.Set("a",1,5);c.Set("b",2,20);*t=5;must(c.Size()==1);*t=20;must(c.Size()==0)`,
 `for _,value:=range []any{0,false,"",nil}{c,_:=setup();calls:=0;load:=func()any{calls++;return value};must(reflect.DeepEqual(Lookup(c,"a",load),value));must(reflect.DeepEqual(Lookup(c,"a",load),value));must(calls==1)}`,
 `c,t:=setup();calls:=0;load:=func()any{calls++;return calls};must(Lookup(c,"a",load)==1);*t=100;must(Lookup(c,"a",load)==2)`
 ],
 pagination:[
 `must(reflect.DeepEqual(Order(records()),[]Record{{4,30},{3,20},{2,20},{1,10}}))`,
 `must(reflect.DeepEqual(Order([]Record{{1,1},{3,1},{2,1}}),[]Record{{3,1},{2,1},{1,1}}))`,
 `p,e:=Paginate(records(),nil,2);must(e==nil&&reflect.DeepEqual(p.Items,[]Record{{4,30},{3,20}})&&p.NextCursor!=nil&&*p.NextCursor==3);p,e=Paginate(records(),p.NextCursor,1);must(e==nil&&reflect.DeepEqual(p.Items,[]Record{{2,20}})&&p.NextCursor!=nil&&*p.NextCursor==2)`,
 `after:=3;p,e:=Paginate(records(),&after,2);must(e==nil&&reflect.DeepEqual(p.Items,[]Record{{2,20},{1,10}})&&p.NextCursor==nil)`,
 `after:=999;p,e:=Paginate(records(),&after,2);must(e==nil&&len(p.Items)==0&&p.NextCursor==nil)`,
 `r:=records();o:=Order(r);if len(o)>0{o[0].ID=99};must(reflect.DeepEqual(r,records()));_,_ = Paginate(r,nil,2);must(reflect.DeepEqual(r,records()))`,
 `for _,n:=range []int{0,-1,101}{_,e:=Paginate(records(),nil,n);must(e!=nil)}`,
 `p,e:=Paginate([]Record{},nil,1);must(e==nil&&len(p.Items)==0&&p.NextCursor==nil);p,e=Paginate([]Record{{1,10}},nil,1);must(e==nil&&reflect.DeepEqual(p.Items,[]Record{{1,10}})&&p.NextCursor==nil);after:=1;p,e=Paginate([]Record{{1,10}},&after,1);must(e==nil&&len(p.Items)==0&&p.NextCursor==nil)`
 ],
 events:[
 `must(reflect.DeepEqual(Summarize([]*Event{ev("1","a",5,2),ev("2","a",5,2),ev("3","b",5,2)},0,10),Summary{[]UserTotal{{"a",2,4},{"b",1,2}},6}))`,
 `must(reflect.DeepEqual(Summarize([]*Event{ev("1","a",5,2),ev("1","b",6,10)},0,10),Summary{[]UserTotal{{"a",1,2}},2}))`,
 `must(reflect.DeepEqual(Summarize([]*Event{ev("1","a",0,2),ev("2","a",10,2)},0,10),Summary{[]UserTotal{{"a",1,2}},2}))`,
 `for _,x:=range []*Event{nil,ev("","a",5,2),ev("1","",5,2),ev("1","a",1.5,2),ev("1","a",2,math.Inf(1)),ev("1","a",math.NaN(),2)}{must(Normalize(x)==nil)};x:=ev("1","a",5,2);n:=Normalize(x);must(n!=nil&&n!=x&&*n==*x);s:=Summarize([]*Event{nil,ev("1","a",2,math.NaN()),x},0,10);must(reflect.DeepEqual(s,Summary{[]UserTotal{{"a",1,2}},2}))`,
 `must(reflect.DeepEqual(Summarize([]*Event{ev("1","a",5,0),ev("2","a",5,-3)},0,10),Summary{[]UserTotal{{"a",2,-3}},-3}))`,
 `s:=Summarize([]*Event{ev("1","a",-1,2),ev("1","a",5,2)},0,10);must(len(s.Users)==0&&s.Total==0)`,
 `a,b:=ev("1","z",5,2),ev("2","a",5,2);beforeA,beforeB:=*a,*b;data:=[]*Event{a,b};must(reflect.DeepEqual(Summarize(data,0,10),Summary{[]UserTotal{{"a",1,2},{"z",1,2}},4}));must(*a==beforeA&&*b==beforeB&&data[0]==a&&data[1]==b)`,
 `data:=make([]*Event,20000);for j:=range data{data[j]=ev(fmt.Sprint(j),"a",5,2)};must(reflect.DeepEqual(Summarize(data,0,10),Summary{[]UserTotal{{"a",20000,40000}},40000}))`
 ],
 'rate-limit':[
 `l:=NewLimiter(2,10);must(l.Allow("a",0)&&l.Allow("a",1))`,
 `l:=NewLimiter(1,10);must(l.Allow("a",0)&&!l.Allow("a",1)&&!l.Allow("a",9))`,
 `l:=NewLimiter(1,10);must(l.Allow("a",0)&&!l.Allow("a",9)&&l.Allow("a",10))`,
 `l:=NewLimiter(1,10);must(l.Allow("a",0)&&l.Allow("b",1)&&!l.Allow("a",2)&&!l.Allow("b",2))`,
 `l:=NewLimiter(1,10);must(l.Allow("a",0)&&!l.Allow("a",9)&&l.Allow("a",10)&&!l.Allow("a",19)&&l.Allow("a",20))`,
 `l:=NewLimiter(2,10);must(l.Allow("a",4)&&l.Allow("a",100)&&l.Allow("a",101)&&!l.Allow("a",109)&&l.Allow("a",110))`,
 `l:=NewLimiter(2,10);must(reflect.DeepEqual(Handle(l,[]string{"a","b","a","a","b","b"},0),[]bool{true,true,true,false,true,false}))`,
 `a,b:=NewLimiter(1,10),NewLimiter(1,10);must(a.Allow("x",0)&&b.Allow("x",0)&&!a.Allow("x",1))`
 ],
 dependencies:[
 `v,e:=Schedule([]Task{{"c",[]string{"b"}},{"a",nil},{"b",[]string{"a"}}});must(e==nil&&reflect.DeepEqual(v,[]string{"a","b","c"}))`,
 `v,e:=Schedule([]Task{{"z",nil},{"b",nil},{"a",[]string{"b"}},{"c",nil}});must(e==nil&&reflect.DeepEqual(v,[]string{"b","a","c","z"}))`,
 `v,e:=Schedule([]Task{{"a",nil},{"b",[]string{"a","a"}}});must(e==nil&&reflect.DeepEqual(v,[]string{"a","b"}))`,
 `_,e:=Schedule([]Task{{"a",[]string{"missing"}}});must(e!=nil);_,e=BuildGraph([]Task{{"a",[]string{"missing"}}});must(e!=nil)`,
 `_,e:=Schedule([]Task{{"a",[]string{"b"}},{"b",[]string{"a"}}});must(e!=nil);_,e=Schedule([]Task{{"a",[]string{"a"}}});must(e!=nil)`,
 `_,e:=Schedule([]Task{{"a",nil},{"a",nil}});must(e!=nil);_,e=Schedule([]Task{{"",nil}});must(e!=nil)`,
 `v,e:=Schedule([]Task{});must(e==nil&&len(v)==0)`,
 `data:=[]Task{{"b",[]string{"a","a"}},{"a",[]string{}}};before:=[]Task{{"b",[]string{"a","a"}},{"a",[]string{}}};g,e:=BuildGraph(data);must(e==nil&&len(g)==2&&len(g["b"])==1&&g["b"]["a"]);v,e:=Schedule(data);must(e==nil&&reflect.DeepEqual(v,[]string{"a","b"})&&reflect.DeepEqual(data,before))`
 ],
 inventory:[
 `i:=NewInventory(map[string]int{"a":5});must(i.Reserve("o",[]Line{{"a",2}})&&i.Available("a")==3&&i.Available("unknown")==0)`,
 `i:=NewInventory(map[string]int{"a":5,"b":1});must(!i.Reserve("o",[]Line{{"a",2},{"b",2}})&&i.Available("a")==5&&i.Available("b")==1)`,
 `i:=NewInventory(map[string]int{"a":5});must(!i.Reserve("bad",[]Line{{"a",3},{"a",3}})&&i.Available("a")==5);must(i.Reserve("ok",[]Line{{"a",2},{"a",3}})&&i.Available("a")==0)`,
 `i:=NewInventory(map[string]int{"a":5});must(i.Reserve("o",[]Line{{"a",2}})&&i.Reserve("o",[]Line{{"a",5}})&&i.Available("a")==3)`,
 `i:=NewInventory(map[string]int{"a":5});must(i.Reserve("o",[]Line{{"a",2}})&&i.Release("o")&&!i.Release("o")&&i.Available("a")==5);must(i.Reserve("o",[]Line{{"a",1}})&&i.Available("a")==4)`,
 `i:=NewInventory(map[string]int{"a":3});must(i.Reserve("held",[]Line{{"a",3}})&&!i.Reserve("retry",[]Line{{"a",1}})&&i.Release("held")&&i.Reserve("retry",[]Line{{"a",1}})&&i.Available("a")==2)`,
 `i:=NewInventory(map[string]int{"a":5});for _,items:=range [][]Line{{},{{"missing",1}},{{"a",0}},{{"a",-1}}}{must(!i.Reserve("bad",items))};must(i.Available("a")==5)`,
 `stock:=map[string]int{"a":3,"b":2};i:=NewInventory(stock);orders:=[]Order{{"1",[]Line{{"a",2}}},{"2",[]Line{{"a",2}}},{"3",[]Line{{"b",1}}}};before,_:=json.Marshal(orders);must(reflect.DeepEqual(ReserveMany(i,orders),[]bool{true,false,true}));after,_:=json.Marshal(orders);must(string(before)==string(after)&&stock["a"]==3&&stock["b"]==2)`
 ]
};
const supports={cache:'func setup()(*Cache,*int64){t:=int64(0);return NewCache(func()int64{return t}),&t}',pagination:'func records()[]Record{return []Record{{1,10},{2,20},{3,20},{4,30}}}',events:'func ev(id,user string,t,a float64)*Event{return &Event{id,user,t,a}}'};
export function buildProgram(id,files){
 const p=projects[id];if(!p)throw new Error('Unknown Go lab.');
 const imports=new Set(['"fmt"','"encoding/json"','"math"','"reflect"','"sort"','"errors"']);
 const source=Object.keys(p.files).map(name=>{if(typeof files[name]!=='string')throw new Error('Missing '+name);return files[name].replace(/^\s*package\s+main\s*$/gm,'').replace(/^\s*import\s*\(([\s\S]*?)\)/gm,(_,body)=>{for(const line of body.split('\n'))if(line.trim()&&!line.trim().startsWith('//'))imports.add(line.trim());return '';}).replace(/^\s*import\s+([^\n]+)$/gm,(_,line)=>{imports.add(line.trim());return '';});}).join('\n');
 return `package main\nimport (\n${[...imports].join('\n')}\n)\nvar _=fmt.Sprint\nvar _=json.Marshal\nvar _=math.IsNaN\nvar _=reflect.DeepEqual\nvar _=sort.Strings\nvar _=errors.New\n${source}\n${supports[id]||''}\nfunc must(ok bool){if !ok{panic("Acceptance check failed")}}\nfunc labCheck(index int,fn func()){defer func(){if e:=recover();e!=nil{b,_:=json.Marshal(map[string]any{"error":fmt.Sprint(e)});fmt.Printf("__ALGO_ARCADE_RESULT_%d__%s\\n",index,b)}}();fn();fmt.Printf("__ALGO_ARCADE_RESULT_%d__{\\"value\\":true}\\n",index)}\nfunc main(){\n${checks[id].map((body,i)=>`labCheck(${i},func(){${body}})`).join('\n')}\n}\n`;
}
