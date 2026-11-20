export const projects={
  "cache": {
    "files": {
      "cache.c": "// Files are combined in displayed order; standard C headers are supplied.\n// Strings/clock are borrowed and must outlive the cache; free internal storage in cache_destroy.\ntypedef enum { VALUE_NULL, VALUE_BOOL, VALUE_NUMBER, VALUE_STRING } ValueKind;\ntypedef struct { ValueKind kind; double number; const char *text; } Value;\ntypedef struct { const char *key; Value value; long long expires; } CacheEntry;\ntypedef struct { const long long *now; CacheEntry *entries; size_t n; } Cache;\nCache cache_create(const long long *now) { return (Cache){now,NULL,0}; }\nvoid cache_set(Cache *cache,const char *key,Value value,long long ttl) { /* TODO */ }\nbool cache_get(Cache *cache,const char *key,Value *out) { return false; /* TODO */ }\nsize_t cache_size(Cache *cache) { return cache->n; /* TODO: expire stale entries */ }\nvoid cache_destroy(Cache *cache) { free(cache->entries); cache->entries=NULL; cache->n=0; }\n",
      "service.c": "Value lookup(Cache *cache,const char *key,Value (*load)(void *),void *context) {\n // TODO: return the cached value when cache_get says it exists.\n Value value=load(context); cache_set(cache,key,value,100); return value;\n}\n"
    },
    "contract": "C11: Cache takes a borrowed pointer to the clock (integer milliseconds; clock/TTL sums must fit long long). cache_get returns bool and writes Value only when found; VALUE_NULL is a present null value. Value supports null, bool, number, and borrowed string. lookup accepts a loader callback plus context. Key/value strings and clock outlive the cache. Allocate storage dynamically, preserve signatures, and free it in cache_destroy; no fixed entry cap. Files are combined in displayed order; standard headers/main are supplied."
  },
  "pagination": {
    "files": {
      "order.c": "typedef struct { int id; double created_at; } Record;\n// next_cursor==0 means no cursor (record IDs are positive). invalid limits set valid=false.\ntypedef struct { Record *items; size_t n; int next_cursor; bool valid; } Page;\nRecord *order(const Record *records,size_t n) {\n Record *copy=n?malloc(n*sizeof(*copy)):NULL;\n if(n&&!copy)exit(2);\n if(n)memcpy(copy,records,n*sizeof(*copy));\n // TODO: sort the copy newest first, breaking ties by descending ID.\n return copy;\n}\n",
      "feed.c": "Page page(const Record *records,size_t n,int after,double limit) {\n // TODO: validate limit, use order(), and return an owned page array.\n return (Page){NULL,0,0,true};\n}\n"
    },
    "contract": "C11: Record {int id; double created_at}. order returns a newly allocated array (caller frees). page(records,n,after,limit) returns Page {items,n,next_cursor,valid}; after/next_cursor=0 means no cursor; invalid numeric limits yield valid=false. Page items are owned by caller. Inputs are borrowed and unchanged. Dynamically allocate arrays, preserve signatures, and do not add main. Sources are combined in displayed order with standard headers."
  },
  "events": {
    "files": {
      "normalize.c": "// NULL id/user represents a missing field; fields_present=false represents absent numeric fields.\ntypedef struct { const char *id,*user; double timestamp,amount; bool fields_present; } Event;\ntypedef struct { const char *user; size_t count; double amount; } UserTotal;\ntypedef struct { UserTotal *users; size_t n; double total; } Summary;\nbool normalize(const Event *event,Event *out) {\n if(!event)return false;\n // TODO: validate; copy the four-field typed record into out.\n *out=*event;return true;\n}\n",
      "summary.c": "Summary summarize(const Event *events,size_t n,double start,double end) {\n // TODO: normalize, deduplicate, filter, aggregate, sort.\n return (Summary){NULL,0,0};\n}\n"
    },
    "contract": "C11: Event holds borrowed id/user strings, numeric timestamp/amount, and fields_present (false models missing numeric fields). NULL/empty strings, fractional/nonfinite timestamps, and nonfinite amounts are invalid; typed fields exclude other wrong types. normalize writes a copy into out and returns bool. summarize returns an owned UserTotal array (caller frees), with borrowed user strings. Preserve inputs. Standard headers/main are supplied; files are combined in displayed order."
  },
  "rate-limit": {
    "files": {
      "limiter.c": "typedef struct { const char *key; long long start; int count; } Window;\ntypedef struct { int limit; long long window_ms; Window *windows; size_t n; } Limiter;\nLimiter limiter_create(int limit,long long window_ms) { return (Limiter){limit,window_ms,NULL,0}; }\nbool allow(Limiter *limiter,const char *key,long long now) { return true; /* TODO */ }\nvoid limiter_destroy(Limiter *limiter) { free(limiter->windows);limiter->windows=NULL;limiter->n=0; }\n",
      "service.c": "void handle(Limiter *limiter,const char *const *keys,size_t n,long long now,bool *out) {\n // TODO: call allow in order; write n results to the caller-owned output buffer.\n for(size_t i=0;i<n;i++)out[i]=false;\n}\n"
    },
    "contract": "C11: limiter_create(limit,window_ms), allow(&limiter,key,now), limiter_destroy. Positive limits/windows and nonnegative, per-key nondecreasing times that fit long long are guaranteed. Key strings are borrowed and must outlive the limiter. No fixed key cap; allocate internal storage dynamically. handle writes n booleans to caller-provided out. Sources are combined in displayed order; standard headers/main are supplied."
  },
  "dependencies": {
    "files": {
      "graph.c": "typedef struct { const char *id; const char *const *deps; size_t n; } Task;\n// edges[i*n+j] means task i depends on task j. Graph owns edges.\ntypedef struct { size_t n; bool *edges; } Graph;\n// valid=false denotes invalid input/cycle. ids is caller-owned; its strings are borrowed.\ntypedef struct { const char **ids; size_t n; bool valid; } Schedule;\nbool build_graph(const Task *tasks,size_t n,Graph *out) {\n // TODO: validate IDs and dependencies, allocate and fill adjacency matrix.\n *out=(Graph){0,NULL};return true;\n}\n",
      "scheduler.c": "Schedule schedule(const Task *tasks,size_t n) {\n // TODO: use build_graph and choose the smallest ready ID at each step.\n return (Schedule){NULL,0,true};\n}\n"
    },
    "contract": "C11: Task {id,deps,n}; build_graph validates and fills an owned adjacency matrix (edges[i*n+j] means dependency). schedule returns Schedule {ids,n,valid}; valid=false denotes invalid/cyclic input, true with n=0 is an empty schedule. Caller frees ids; strings are borrowed. Inputs are unchanged. The matrix has O(n\u00b2) storage and must reject size overflow, not truncate. No fixed task limit. Sources combine in displayed order; standard headers/main are supplied."
  },
  "inventory": {
    "files": {
      "inventory.c": "typedef struct { const char *sku; int quantity; } Item;\ntypedef struct { const char *id; const Item *items; size_t n; } Order;\ntypedef struct { const char *id; int *quantities; } Reservation;\ntypedef struct { Item *stock; size_t n; Reservation *orders; size_t order_count; } Inventory;\nInventory inventory_create(const Item *stock,size_t n) {\n Item *copy=n?malloc(n*sizeof(*copy)):NULL;\n if(n&&!copy)exit(2);if(n)memcpy(copy,stock,n*sizeof(*copy));\n return (Inventory){copy,n,NULL,0};\n}\nint available(const Inventory *inventory,const char *sku) { return 0; /* TODO */ }\nbool reserve(Inventory *inventory,const char *id,const Item *items,size_t n) { return false; /* TODO */ }\nbool release(Inventory *inventory,const char *id) { return false; /* TODO */ }\nvoid inventory_destroy(Inventory *inventory) {\n for(size_t i=0;i<inventory->order_count;i++)free(inventory->orders[i].quantities);\n free(inventory->orders);free(inventory->stock);\n}\n",
      "checkout.c": "void reserve_many(Inventory *inventory,const Order *orders,size_t n,bool *out) {\n // TODO: call reserve for each order and write n results.\n for(size_t i=0;i<n;i++)out[i]=false;\n}\n"
    },
    "contract": "C11: Item {borrowed sku, int quantity}; inventory_create copies the supplied unique-SKU stock array. reserve returns bool and combines repeated SKUs without signed overflow; release restores once; available returns zero for unknown SKU. Order {borrowed id, items, n}; reserve_many writes n booleans into caller-owned out. Stock/order ID strings outlive Inventory. Dynamically allocate internal storage and free it in inventory_destroy; no fixed capacity. Standard headers/main are supplied and files combined in displayed order."
  }
};
const tests={
  "cache": [
    "long long t=0;Cache c=cache_create(&t);Value out;cache_set(&c,\"a\",vs(\"hello\"),10);bool ok=cache_get(&c,\"a\",&out)&&veq(out,vs(\"hello\"));cache_destroy(&c);return ok;",
    "long long t=0;Cache c=cache_create(&t);Value out;cache_set(&c,\"a\",vn(1),10);t=9;bool ok=cache_get(&c,\"a\",&out);t=10;ok=ok&&!cache_get(&c,\"a\",&out);cache_destroy(&c);return ok;",
    "long long t=0;Cache c=cache_create(&t);Value values[]={vb(false),vn(0),vs(\"\"),vnull()},out;bool ok=true;for(size_t i=0;i<4;i++){cache_set(&c,\"a\",values[i],10);ok=ok&&cache_get(&c,\"a\",&out)&&veq(out,values[i]);}cache_destroy(&c);return ok;",
    "long long t=0;Cache c=cache_create(&t);Value out;cache_set(&c,\"a\",vn(1),10);t=5;cache_set(&c,\"a\",vn(2),20);t=15;bool ok=cache_get(&c,\"a\",&out)&&veq(out,vn(2))&&cache_size(&c)==1;cache_destroy(&c);return ok;",
    "long long t=0;Cache c=cache_create(&t);Value out;cache_set(&c,\"a\",vn(1),10);cache_set(&c,\"a\",vn(2),0);cache_set(&c,\"b\",vn(3),-1);bool ok=!cache_get(&c,\"a\",&out)&&cache_size(&c)==0;cache_destroy(&c);return ok;",
    "long long t=0;Cache c=cache_create(&t);cache_set(&c,\"a\",vn(1),5);cache_set(&c,\"b\",vn(2),20);t=5;bool ok=cache_size(&c)==1;t=20;ok=ok&&cache_size(&c)==0;cache_destroy(&c);return ok;",
    "Value values[]={vb(false),vn(0),vs(\"\"),vnull()};for(size_t i=0;i<4;i++){long long t=0;Cache c=cache_create(&t);Loader ctx={0,values[i]};Value a=lookup(&c,\"a\",load_value,&ctx),b=lookup(&c,\"a\",load_value,&ctx);bool ok=veq(a,values[i])&&veq(b,values[i])&&ctx.calls==1;cache_destroy(&c);if(!ok)return false;}return true;",
    "long long t=0;Cache c=cache_create(&t);Loader ctx={0,vn(0)};lookup(&c,\"a\",load_counter,&ctx);t=100;Value out=lookup(&c,\"a\",load_counter,&ctx);bool ok=veq(out,vn(2))&&ctx.calls==2;cache_destroy(&c);return ok;"
  ],
  "pagination": [
    "Record r[]={{1,10},{2,20},{3,20},{4,30}};Record*s=order(r,4);bool ok=s&&same_ids(s,4,(int[]){4,3,2,1},4);free(s);return ok;",
    "Record r[]={{1,1},{3,1},{2,1}};Record*s=order(r,3);bool ok=s&&same_ids(s,3,(int[]){3,2,1},3);free(s);return ok;",
    "Record r[]={{1,10},{2,20},{3,20},{4,30}};Page p=page(r,4,0,2),q=page(r,4,p.next_cursor,1);bool ok=p.valid&&q.valid&&same_ids(p.items,p.n,(int[]){4,3},2)&&p.next_cursor==3&&same_ids(q.items,q.n,(int[]){2},1)&&q.next_cursor==2;free(p.items);free(q.items);return ok;",
    "Record r[]={{1,10},{2,20},{3,20},{4,30}};Page p=page(r,4,3,2);bool ok=p.valid&&same_ids(p.items,p.n,(int[]){2,1},2)&&p.next_cursor==0;free(p.items);return ok;",
    "Record r[]={{1,10}};Page p=page(r,1,999,2);bool ok=p.valid&&p.n==0&&p.next_cursor==0;free(p.items);return ok;",
    "Record r[]={{1,10},{2,20}},copy[2];memcpy(copy,r,sizeof(r));Record*s=order(r,2);Page p=page(r,2,0,1);bool ok=memcmp(copy,r,sizeof(r))==0;free(s);free(p.items);return ok;",
    "double limits[]={0,-1,101,1.5,NAN};for(size_t i=0;i<5;i++){Page p=page(NULL,0,0,limits[i]);bool valid=p.valid;free(p.items);if(valid)return false;}return true;",
    "Record r[]={{1,10}};Page a=page(NULL,0,0,1),b=page(r,1,0,1),c=page(r,1,1,1);bool ok=a.valid&&b.valid&&c.valid&&a.n==0&&a.next_cursor==0&&same_ids(b.items,b.n,(int[]){1},1)&&b.next_cursor==0&&c.n==0&&c.next_cursor==0;free(a.items);free(b.items);free(c.items);return ok;"
  ],
  "events": [
    "Event e[]={ev(\"1\",\"a\",5,2),ev(\"2\",\"a\",5,2),ev(\"3\",\"b\",5,2)};Summary s=summarize(e,3,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",2,4},{\"b\",1,2}},2,6);free(s.users);return ok;",
    "Event e[]={ev(\"1\",\"a\",5,2),ev(\"1\",\"b\",6,10)};Summary s=summarize(e,2,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",1,2}},1,2);free(s.users);return ok;",
    "Event e[]={ev(\"1\",\"a\",0,2),ev(\"2\",\"a\",10,2)};Summary s=summarize(e,2,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",1,2}},1,2);free(s.users);return ok;",
    "Event invalid[]={{0},ev(\"\",\"a\",1,2),ev(\"1\",\"\",1,2),ev(\"1\",\"a\",1.5,2),ev(\"1\",\"a\",2,INFINITY)},out;for(size_t i=0;i<5;i++)if(normalize(&invalid[i],&out))return false;if(normalize(NULL,&out))return false;Event e[]={ev(\"1\",\"a\",2,NAN),ev(\"1\",\"a\",5,2)};Summary s=summarize(e,2,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",1,2}},1,2);free(s.users);Event original=ev(\"x\",\"a\",5,2);if(!normalize(&original,&out))return false;out.amount=99;return ok&&original.amount==2;",
    "Event e[]={ev(\"1\",\"a\",5,0),ev(\"2\",\"a\",5,-3)};Summary s=summarize(e,2,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",2,-3}},1,-3);free(s.users);return ok;",
    "Event e[]={ev(\"1\",\"a\",-1,2),ev(\"1\",\"a\",5,2)};Summary s=summarize(e,2,0,10);bool ok=s.n==0&&s.total==0;free(s.users);return ok;",
    "Event e[]={ev(\"1\",\"z\",5,2),ev(\"2\",\"a\",5,2)},copy[2];memcpy(copy,e,sizeof(e));Summary s=summarize(e,2,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",1,2},{\"z\",1,2}},2,4)&&memcmp(copy,e,sizeof(e))==0;free(s.users);return ok;",
    "size_t n=20000;Event*e=malloc(n*sizeof(*e));char(*ids)[24]=malloc(n*sizeof(*ids));if(!e||!ids)exit(2);for(size_t i=0;i<n;i++){snprintf(ids[i],24,\"%zu\",i);e[i]=ev(ids[i],\"a\",5,2);}Summary s=summarize(e,n,0,10);bool ok=summary_is(s,(UserTotal[]){{\"a\",20000,40000}},1,40000);free(s.users);free(e);free(ids);return ok;"
  ],
  "rate-limit": [
    "Limiter l=limiter_create(2,10);bool ok=allow(&l,\"a\",0)&&allow(&l,\"a\",1);limiter_destroy(&l);return ok;",
    "Limiter l=limiter_create(2,10);allow(&l,\"a\",0);allow(&l,\"a\",1);bool ok=!allow(&l,\"a\",2)&&!allow(&l,\"a\",3);limiter_destroy(&l);return ok;",
    "Limiter l=limiter_create(1,10);allow(&l,\"a\",5);bool ok=!allow(&l,\"a\",14)&&allow(&l,\"a\",15);limiter_destroy(&l);return ok;",
    "Limiter l=limiter_create(1,10);bool ok=allow(&l,\"a\",0)&&allow(&l,\"b\",0)&&!allow(&l,\"a\",1);limiter_destroy(&l);return ok;",
    "Limiter l=limiter_create(1,10);allow(&l,\"a\",0);allow(&l,\"a\",9);bool ok=allow(&l,\"a\",10);limiter_destroy(&l);return ok;",
    "Limiter l=limiter_create(2,10);allow(&l,\"a\",0);bool ok=allow(&l,\"a\",100)&&allow(&l,\"a\",101)&&!allow(&l,\"a\",102);limiter_destroy(&l);return ok;",
    "Limiter l=limiter_create(2,10);const char*keys[]={\"a\",\"a\",\"a\",\"b\"};bool out[4];handle(&l,keys,4,0,out);bool ok=out[0]&&out[1]&&!out[2]&&out[3];limiter_destroy(&l);return ok;",
    "Limiter a=limiter_create(1,10),b=limiter_create(1,10);bool ok=allow(&a,\"x\",0)&&!allow(&a,\"x\",1)&&allow(&b,\"x\",1);limiter_destroy(&a);limiter_destroy(&b);return ok;"
  ],
  "dependencies": [
    "const char*da[]={\"b\"},*db[]={\"a\"};Task t[]={{\"c\",da,1},{\"a\",NULL,0},{\"b\",db,1}};Schedule s=schedule(t,3);bool ok=schedule_is(s,(const char*[]){\"a\",\"b\",\"c\"},3);free(s.ids);return ok;",
    "const char*d[]={\"b\"};Task t[]={{\"z\",NULL,0},{\"b\",NULL,0},{\"a\",d,1}};Schedule s=schedule(t,3);bool ok=schedule_is(s,(const char*[]){\"b\",\"a\",\"z\"},3);free(s.ids);return ok;",
    "const char*d[]={\"a\",\"a\"};Task t[]={{\"b\",d,2},{\"a\",NULL,0}};Schedule s=schedule(t,2);bool ok=schedule_is(s,(const char*[]){\"a\",\"b\"},2);free(s.ids);return ok;",
    "const char*d[]={\"missing\"};Task t[]={{\"a\",d,1}};Schedule s=schedule(t,1);bool ok=!s.valid;free(s.ids);return ok;",
    "const char*da[]={\"b\"},*db[]={\"a\"},*self[]={\"x\"};Task t[]={{\"a\",da,1},{\"b\",db,1}},u[]={{\"x\",self,1}};Schedule a=schedule(t,2),b=schedule(u,1);bool ok=!a.valid&&!b.valid;free(a.ids);free(b.ids);return ok;",
    "Task t[]={{\"a\",NULL,0},{\"a\",NULL,0}},u[]={{\"\",NULL,0}};Schedule a=schedule(t,2),b=schedule(u,1);bool ok=!a.valid&&!b.valid;free(a.ids);free(b.ids);return ok;",
    "Schedule s=schedule(NULL,0);bool ok=s.valid&&s.n==0;free(s.ids);return ok;",
    "const char*d[]={\"a\",\"a\"};Task t[]={{\"b\",d,2},{\"a\",NULL,0}},copy[2];memcpy(copy,t,sizeof(t));Schedule s=schedule(t,2);bool ok=s.valid&&memcmp(copy,t,sizeof(t))==0&&t[0].n==2&&!strcmp(t[0].deps[0],\"a\")&&!strcmp(t[0].deps[1],\"a\");free(s.ids);return ok;"
  ],
  "inventory": [
    "Inventory v=inventory_create((Item[]){{\"a\",5}},1);bool ok=reserve(&v,\"x\",(Item[]){{\"a\",2}},1)&&available(&v,\"a\")==3&&available(&v,\"unknown\")==0;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",5},{\"b\",1}},2);bool ok=!reserve(&v,\"x\",(Item[]){{\"a\",2},{\"b\",2}},2)&&available(&v,\"a\")==5&&available(&v,\"b\")==1;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",5}},1);bool ok=reserve(&v,\"x\",(Item[]){{\"a\",2},{\"a\",2}},2)&&available(&v,\"a\")==1&&!reserve(&v,\"y\",(Item[]){{\"a\",1},{\"a\",1}},2)&&available(&v,\"a\")==1;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",5}},1);bool ok=reserve(&v,\"x\",(Item[]){{\"a\",2}},1)&&reserve(&v,\"x\",(Item[]){{\"a\",5}},1)&&available(&v,\"a\")==3;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",5}},1);reserve(&v,\"x\",(Item[]){{\"a\",2}},1);bool ok=release(&v,\"x\")&&!release(&v,\"x\")&&available(&v,\"a\")==5&&reserve(&v,\"x\",(Item[]){{\"a\",1}},1)&&available(&v,\"a\")==4;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",2}},1);bool ok=!reserve(&v,\"x\",(Item[]){{\"a\",3}},1)&&reserve(&v,\"x\",(Item[]){{\"a\",1}},1)&&available(&v,\"a\")==1;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",5}},1);bool ok=!reserve(&v,\"x\",NULL,0)&&!reserve(&v,\"x\",(Item[]){{\"unknown\",1}},1)&&!reserve(&v,\"x\",(Item[]){{\"a\",0}},1)&&!reserve(&v,\"x\",(Item[]){{\"a\",-1}},1)&&available(&v,\"a\")==5;inventory_destroy(&v);return ok;",
    "Inventory v=inventory_create((Item[]){{\"a\",3}},1),w=inventory_create((Item[]){{\"a\",3}},1);Item a[]={{\"a\",2}},b[]={{\"a\",1}};Order orders[]={{\"x\",a,1},{\"y\",a,1},{\"z\",b,1}};bool out[3];reserve_many(&v,orders,3,out);bool ok=out[0]&&!out[1]&&out[2]&&available(&w,\"a\")==3;inventory_destroy(&v);inventory_destroy(&w);return ok;"
  ]
};
const includes="#include <stdbool.h>\n#include <stdint.h>\n#include <stddef.h>\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n#include <limits.h>\n";
const helpers={"cache": "static Value vn(double n){return (Value){VALUE_NUMBER,n,NULL};}\nstatic Value vb(bool b){return (Value){VALUE_BOOL,b,NULL};}\nstatic Value vs(const char*s){return (Value){VALUE_STRING,0,s};}\nstatic Value vnull(void){return (Value){VALUE_NULL,0,NULL};}\nstatic bool veq(Value a,Value b){return a.kind==b.kind&&(a.kind==VALUE_NULL||(a.kind==VALUE_STRING?(!a.text&&!b.text)||(a.text&&b.text&&!strcmp(a.text,b.text)):a.number==b.number));}\ntypedef struct {int calls;Value value;} Loader;\nstatic Value load_value(void*p){Loader*l=p;l->calls++;return l->value;}\nstatic Value load_counter(void*p){Loader*l=p;return vn(++l->calls);}\n", "pagination": "static bool same_ids(const Record*r,size_t n,const int*expected,size_t count){if(n!=count||(!r&&n))return false;for(size_t i=0;i<n;i++)if(r[i].id!=expected[i])return false;return true;}\n", "events": "static Event ev(const char*id,const char*user,double timestamp,double amount){return (Event){id,user,timestamp,amount,true};}\nstatic bool summary_is(Summary s,const UserTotal*expected,size_t n,double total){if(s.n!=n||s.total!=total||(!s.users&&n))return false;for(size_t i=0;i<n;i++)if(!s.users[i].user||strcmp(s.users[i].user,expected[i].user)||s.users[i].count!=expected[i].count||s.users[i].amount!=expected[i].amount)return false;return true;}\n", "dependencies": "static bool schedule_is(Schedule s,const char*const*expected,size_t n){if(!s.valid||s.n!=n||(!s.ids&&n))return false;for(size_t i=0;i<n;i++)if(!s.ids[i]||strcmp(s.ids[i],expected[i]))return false;return true;}\n"};
export function buildProgram(id,files){
 const project=projects[id];if(!project)throw new Error('Unknown C lab.');
 const code=Object.keys(project.files).map(name=>{if(typeof files?.[name]!=='string')throw new Error('Missing lab file: '+name);return files[name];}).join('\n');
 const functions=tests[id].map((body,index)=>`static bool lab_check_${index}(void){${body}}`).join('\n');
 const calls=tests[id].map((_,index)=>`printf(${JSON.stringify('__ALGO_ARCADE_RESULT_'+index+'__{"value":%s}\n')},lab_check_${index}()?"true":"false");`).join('\n');
 return includes+code+'\n'+(helpers[id]||'')+functions+'\nint main(void){\n'+calls+'\nreturn 0;}\n';
}
