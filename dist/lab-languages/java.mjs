// Native multi-file lab starters and executable acceptance harnesses.
export const projects={
  "cache": {
    "files": {
      "Cache.java": "class Cache {\n static final Object MISSING = new Object();\n final LongSupplier now;\n final Map<String,Object> values = new HashMap<>();\n Cache(LongSupplier now) { this.now=now; }\n void set(String key,Object value,long ttl) { values.put(key,value); }\n Object get(String key) { return values.containsKey(key)?values.get(key):MISSING; }\n int size() { return values.size(); }\n}\n",
      "Service.java": "class Service {\n static Object lookup(Cache cache,String key,Supplier<Object> load) {\n  // TODO: reuse present values, including null, false, zero and empty text.\n  Object value=load.get(); cache.set(key,value,100); return value;\n }\n}\n"
    },
    "contract": "Keep package-private Cache and Service classes. Cache(LongSupplier now), set(String,Object,long), get(String), size(); missing is Cache.MISSING, distinct from a stored null. Service.lookup(Cache,String,Supplier<Object>) returns the cached/loaded Object. Times/TTLs are long milliseconds. java.util and java.util.function imports are supplied. Do not add a package or main method."
  },
  "pagination": {
    "files": {
      "Ordering.java": "record FeedRecord(long id,long createdAt) {}\nclass Ordering {\n static List<FeedRecord> order(List<FeedRecord> records) { return records; }\n}\n",
      "Feed.java": "record Page(List<FeedRecord> items,Long nextCursor) {}\nclass Feed {\n static Page page(List<FeedRecord> records,Long after,int limit) {\n  // TODO: validate limit, order a copy, locate cursor, then paginate.\n  return new Page(new ArrayList<>(),null);\n }\n}\n"
    },
    "contract": "Keep FeedRecord(long id,long createdAt), Page(List<FeedRecord> items,Long nextCursor), Ordering.order(List<FeedRecord>) and Feed.page(List<FeedRecord>,Long after,int limit). Missing cursors use null. Invalid limits throw IllegalArgumentException; the int signature excludes fractional/string limits. Return a sorted copy. The harness supplies imports and the entry point."
  },
  "events": {
    "files": {
      "Normalizer.java": "record Event(String id,String user,double timestamp,double amount) {}\nclass Normalizer {\n static Event normalize(Event event) { return event; }\n}\n",
      "Summarizer.java": "record UserTotal(String user,int count,double amount) {}\nrecord Summary(List<UserTotal> users,double total) {}\nclass Summarizer {\n static Summary summarize(List<Event> events,long start,long end) {\n  // TODO: normalize, keep first valid ID, filter half-open window, group, sort.\n  return new Summary(new ArrayList<>(),0);\n }\n}\n"
    },
    "contract": "Keep Event(String id,String user,double timestamp,double amount), Normalizer.normalize(Event), UserTotal(String user,int count,double amount), Summary(List<UserTotal> users,double total), and Summarizer.summarize(List<Event>,long start,long end). normalize returns a new Event or null. Event timestamps must be finite integral doubles; null records/IDs/users and non-finite amounts are invalid. Static types exclude arbitrary objects/string amounts. Ordinary String ordering applies. Imports and the entry point are supplied."
  },
  "rate-limit": {
    "files": {
      "Limiter.java": "class Limiter {\n final int limit; final long windowMs;\n Limiter(int limit,long windowMs) { this.limit=limit;this.windowMs=windowMs; }\n boolean allow(String key,long now) { return true; }\n}\n",
      "Gateway.java": "class Gateway {\n static List<Boolean> handle(Limiter limiter,List<String> keys,long now) {\n  // TODO: apply the limiter sequentially to each request.\n  return new ArrayList<>();\n }\n}\n"
    },
    "contract": "Keep Limiter(int limit,long windowMs), boolean allow(String key,long now), and Gateway.handle(Limiter,List<String>,long now) returning List<Boolean>. Limits/windows are positive; timestamps are nonnegative and nondecreasing per key. Imports and the entry point are supplied."
  },
  "dependencies": {
    "files": {
      "Graph.java": "record Task(String id,List<String> deps) {}\nclass Graph {\n static Map<String,Set<String>> build(List<Task> tasks) {\n  // TODO: validate IDs/dependencies and return an independent deduplicated map.\n  return new HashMap<>();\n }\n}\n",
      "Scheduler.java": "class Scheduler {\n static List<String> schedule(List<Task> tasks) {\n  // TODO: use Graph.build; return null for invalid input/cycles.\n  return new ArrayList<>();\n }\n}\n"
    },
    "contract": "Keep Task(String id,List<String> deps), Graph.build(List<Task>) returning a fresh Map<String,Set<String>> or null for invalid input, and Scheduler.schedule(List<Task>) returning List<String> or null for cycles/invalid input. Choose the smallest currently-ready ID using String.compareTo each step. Imports and the entry point are supplied."
  },
  "inventory": {
    "files": {
      "Inventory.java": "record Item(String sku,long quantity) {}\nclass Inventory {\n final Map<String,Long> stock;\n Inventory(Map<String,Long> stock) { this.stock=new HashMap<>(stock); }\n long available(String sku) { return stock.getOrDefault(sku,0L); }\n boolean reserve(String orderId,List<Item> items) { return false; }\n boolean release(String orderId) { return false; }\n}\n",
      "Checkout.java": "record Order(String id,List<Item> items) {}\nclass Checkout {\n static List<Boolean> reserveMany(Inventory inventory,List<Order> orders) {\n  // TODO: process orders in sequence through Inventory.reserve.\n  return new ArrayList<>();\n }\n}\n"
    },
    "contract": "Keep Item(String sku,long quantity), Inventory(Map<String,Long> stock), available(String), reserve(String,List<Item>), release(String), Order(String id,List<Item> items), and Checkout.reserveMany(Inventory,List<Order>) returning List<Boolean>. Quantities are integral long values and initial stock is nonnegative. Failed reservations cannot change stock; successful IDs remain idempotent until release. Imports and the entry point are supplied."
  }
};
const checks={
  "cache": [
    "Cache c=new Cache(()->0L);c.set(\"a\",\"hello\",10);return Objects.equals(c.get(\"a\"),\"hello\");",
    "long[] t={0};Cache c=new Cache(()->t[0]);c.set(\"a\",1,10);t[0]=9;if(!Objects.equals(c.get(\"a\"),1))return false;t[0]=10;return c.get(\"a\")==Cache.MISSING;",
    "Cache c=new Cache(()->0L);for(Object v:new Object[]{false,0,\"\",null}){c.set(\"a\",v,10);if(!Objects.equals(c.get(\"a\"),v))return false;}return true;",
    "long[] t={0};Cache c=new Cache(()->t[0]);c.set(\"a\",1,10);t[0]=5;c.set(\"a\",2,20);t[0]=15;return Objects.equals(c.get(\"a\"),2)&&c.size()==1;",
    "Cache c=new Cache(()->0L);c.set(\"a\",1,10);c.set(\"a\",2,0);c.set(\"b\",3,-1);return c.get(\"a\")==Cache.MISSING&&c.size()==0;",
    "long[] t={0};Cache c=new Cache(()->t[0]);c.set(\"a\",1,5);c.set(\"b\",2,20);t[0]=5;if(c.size()!=1)return false;t[0]=20;return c.size()==0;",
    "for(Object v:new Object[]{0,false,\"\",null}){Cache c=new Cache(()->0L);int[] calls={0};Supplier<Object> load=()->{calls[0]++;return v;};Service.lookup(c,\"a\",load);if(!Objects.equals(Service.lookup(c,\"a\",load),v)||calls[0]!=1)return false;}return true;",
    "long[] t={0};Cache c=new Cache(()->t[0]);int[] calls={0};Supplier<Object> load=()->++calls[0];Service.lookup(c,\"a\",load);t[0]=100;return Objects.equals(Service.lookup(c,\"a\",load),2);"
  ],
  "pagination": [
    "List<FeedRecord> r=records();return ids(Ordering.order(r)).equals(List.of(4L,3L,2L,1L));",
    "return ids(Ordering.order(List.of(new FeedRecord(1,1),new FeedRecord(3,1),new FeedRecord(2,1)))).equals(List.of(3L,2L,1L));",
    "Page p=Feed.page(records(),null,2);Page q=Feed.page(records(),p.nextCursor(),1);return ids(p.items()).equals(List.of(4L,3L))&&Objects.equals(p.nextCursor(),3L)&&ids(q.items()).equals(List.of(2L))&&Objects.equals(q.nextCursor(),2L);",
    "Page p=Feed.page(records(),3L,2);return ids(p.items()).equals(List.of(2L,1L))&&p.nextCursor()==null;",
    "Page p=Feed.page(records(),999L,2);return p.items().isEmpty()&&p.nextCursor()==null;",
    "List<FeedRecord> r=records(),copy=new ArrayList<>(r);Ordering.order(r);Feed.page(r,null,2);return r.equals(copy);",
    "for(int n:new int[]{0,-1,101}){try{Feed.page(records(),null,n);return false;}catch(IllegalArgumentException expected){}}return true;",
    "Page a=Feed.page(List.of(),null,1),b=Feed.page(List.of(new FeedRecord(1,10)),null,1),c=Feed.page(List.of(new FeedRecord(1,10)),1L,1);return a.items().isEmpty()&&a.nextCursor()==null&&ids(b.items()).equals(List.of(1L))&&b.nextCursor()==null&&c.items().isEmpty()&&c.nextCursor()==null;"
  ],
  "events": [
    "return Summarizer.summarize(List.of(e(\"1\",\"a\",5,2),e(\"2\",\"a\",5,2),e(\"3\",\"b\",5,2)),0,10).equals(new Summary(List.of(new UserTotal(\"a\",2,4),new UserTotal(\"b\",1,2)),6));",
    "return Summarizer.summarize(List.of(e(\"1\",\"a\",5,2),e(\"1\",\"b\",6,10)),0,10).equals(new Summary(List.of(new UserTotal(\"a\",1,2)),2));",
    "return Summarizer.summarize(List.of(e(\"1\",\"a\",0,2),e(\"2\",\"a\",10,2)),0,10).equals(new Summary(List.of(new UserTotal(\"a\",1,2)),2));",
    "for(Event bad:Arrays.asList(null,e(\"\",\"a\",1,2),e(\"1\",\"\",1,2),e(\"1\",\"a\",1.5,2),e(\"1\",\"a\",2,Double.POSITIVE_INFINITY),e(null,\"a\",2,2)))if(Normalizer.normalize(bad)!=null)return false;Event original=e(\"1\",\"a\",5,2),n=Normalizer.normalize(original);return original.equals(n)&&original!=n&&Summarizer.summarize(List.of(e(\"1\",\"a\",2,Double.NaN),original),0,10).total()==2;",
    "return Summarizer.summarize(List.of(e(\"1\",\"a\",5,0),e(\"2\",\"a\",5,-3)),0,10).equals(new Summary(List.of(new UserTotal(\"a\",2,-3)),-3));",
    "return Summarizer.summarize(List.of(e(\"1\",\"a\",-1,2),e(\"1\",\"a\",5,2)),0,10).equals(new Summary(List.of(),0));",
    "List<Event> input=new ArrayList<>(List.of(e(\"1\",\"z\",5,2),e(\"2\",\"a\",5,2))),copy=new ArrayList<>(input);Summary out=Summarizer.summarize(input,0,10);return input.equals(copy)&&out.equals(new Summary(List.of(new UserTotal(\"a\",1,2),new UserTotal(\"z\",1,2)),4));",
    "List<Event> input=new ArrayList<>();for(int i=0;i<20000;i++)input.add(e(\"\"+i,\"a\",5,2));return Summarizer.summarize(input,0,10).equals(new Summary(List.of(new UserTotal(\"a\",20000,40000)),40000));"
  ],
  "rate-limit": [
    "Limiter l=new Limiter(2,10);return l.allow(\"a\",0)&&l.allow(\"a\",1);",
    "Limiter l=new Limiter(1,10);return l.allow(\"a\",0)&&!l.allow(\"a\",1)&&!l.allow(\"a\",9);",
    "Limiter l=new Limiter(1,10);return l.allow(\"a\",5)&&!l.allow(\"a\",14)&&l.allow(\"a\",15);",
    "Limiter l=new Limiter(1,10);return l.allow(\"a\",0)&&l.allow(\"b\",1)&&!l.allow(\"a\",2)&&!l.allow(\"b\",2);",
    "Limiter l=new Limiter(1,10);return l.allow(\"a\",0)&&!l.allow(\"a\",9)&&l.allow(\"a\",10);",
    "Limiter l=new Limiter(1,10);return l.allow(\"a\",3)&&l.allow(\"a\",100)&&!l.allow(\"a\",109)&&l.allow(\"a\",110);",
    "return Gateway.handle(new Limiter(2,10),List.of(\"a\",\"a\",\"b\",\"a\",\"b\"),0).equals(List.of(true,true,true,false,true));",
    "Limiter a=new Limiter(1,10),b=new Limiter(1,10);return a.allow(\"x\",0)&&!a.allow(\"x\",1)&&b.allow(\"x\",1);"
  ],
  "dependencies": [
    "return Objects.equals(Scheduler.schedule(List.of(t(\"c\",\"b\"),t(\"a\"),t(\"b\",\"a\"))),List.of(\"a\",\"b\",\"c\"));",
    "return Objects.equals(Scheduler.schedule(List.of(t(\"z\"),t(\"b\"),t(\"a\",\"b\"))),List.of(\"b\",\"a\",\"z\"));",
    "return Objects.equals(Scheduler.schedule(List.of(t(\"a\"),t(\"b\",\"a\",\"a\"))),List.of(\"a\",\"b\"));",
    "return Scheduler.schedule(List.of(t(\"a\",\"missing\")))==null;",
    "return Scheduler.schedule(List.of(t(\"a\",\"b\"),t(\"b\",\"a\")))==null&&Scheduler.schedule(List.of(t(\"a\",\"a\")))==null;",
    "return Scheduler.schedule(List.of(t(\"a\"),t(\"a\")))==null&&Scheduler.schedule(List.of(t(\"\")))==null;",
    "return Objects.equals(Scheduler.schedule(List.of()),List.of());",
    "List<Task> input=new ArrayList<>(List.of(new Task(\"b\",new ArrayList<>(List.of(\"a\",\"a\"))),t(\"a\")));List<Task> copy=List.of(t(\"b\",\"a\",\"a\"),t(\"a\"));Scheduler.schedule(input);return input.equals(copy);"
  ],
  "inventory": [
    "Inventory i=inv();return i.reserve(\"1\",List.of(new Item(\"a\",2)))&&i.available(\"a\")==3&&i.available(\"unknown\")==0;",
    "Inventory i=inv();return !i.reserve(\"1\",List.of(new Item(\"a\",2),new Item(\"b\",9)))&&i.available(\"a\")==5&&i.available(\"b\")==2;",
    "Inventory i=inv();return !i.reserve(\"1\",List.of(new Item(\"a\",3),new Item(\"a\",3)))&&i.available(\"a\")==5&&i.reserve(\"2\",List.of(new Item(\"a\",2),new Item(\"a\",3)))&&i.available(\"a\")==0;",
    "Inventory i=inv();return i.reserve(\"1\",List.of(new Item(\"a\",2)))&&i.reserve(\"1\",List.of(new Item(\"b\",100)))&&i.available(\"a\")==3&&i.available(\"b\")==2;",
    "Inventory i=inv();return i.reserve(\"1\",List.of(new Item(\"a\",2)))&&i.release(\"1\")&&i.available(\"a\")==5&&!i.release(\"1\")&&i.reserve(\"1\",List.of(new Item(\"a\",1)))&&i.available(\"a\")==4;",
    "Inventory i=inv();return !i.reserve(\"1\",List.of(new Item(\"a\",6)))&&i.reserve(\"1\",List.of(new Item(\"a\",1)))&&i.available(\"a\")==4;",
    "Inventory i=inv();return !i.reserve(\"1\",List.of())&&!i.reserve(\"2\",List.of(new Item(\"x\",1)))&&!i.reserve(\"3\",List.of(new Item(\"a\",0)))&&!i.reserve(\"4\",List.of(new Item(\"a\",-1)))&&i.available(\"a\")==5;",
    "Inventory i=inv();return Checkout.reserveMany(i,List.of(new Order(\"1\",List.of(new Item(\"a\",4))),new Order(\"2\",List.of(new Item(\"a\",2))),new Order(\"3\",List.of(new Item(\"b\",2))))).equals(List.of(true,false,true))&&i.available(\"a\")==1&&i.available(\"b\")==0;"
  ]
};
const helpers={
  "pagination": "static List<FeedRecord> records(){return new ArrayList<>(List.of(new FeedRecord(1,10),new FeedRecord(2,20),new FeedRecord(3,20),new FeedRecord(4,30)));} static List<Long> ids(List<FeedRecord> r){return r.stream().map(FeedRecord::id).toList();}",
  "events": "static Event e(String id,String user,double timestamp,double amount){return new Event(id,user,timestamp,amount);}",
  "dependencies": "static Task t(String id,String... deps){return new Task(id,new ArrayList<>(Arrays.asList(deps)));}",
  "inventory": "static Inventory inv(){return new Inventory(Map.of(\"a\",5L,\"b\",2L));}"
};
function sources(id,files){const project=Object.hasOwn(projects,id)?projects[id]:null;if(!project)throw new Error('Unknown lab');return Object.keys(project.files).map(name=>{if(typeof files[name]!=='string')throw new Error('Missing exercise file: '+name);if(files[name].length>100000)throw new Error('Exercise file is too large.');return files[name];}).join('\n');}
export function buildProgram(id,files){
 const imports=new Set(['import java.util.*;','import java.util.function.*;']);
 const code=sources(id,files).replace(/^\s*import\s+[^;]+;/gm,line=>{imports.add(line.trim());return '';});
 const body=checks[id].map((check,i)=>`check(${i},()->{${check}});`).join('\n');
 return [...imports].join('\n')+'\n'+code+'\nclass Wandbox {\n'+(helpers[id]||'')+'\nstatic void check(int i,BooleanSupplier test){boolean passed=false;try{passed=test.getAsBoolean();}catch(Throwable error){}System.out.println("__ALGO_ARCADE_RESULT_"+i+"__{\\\"value\\\":"+passed+"}");}\npublic static void main(String[] args){\n'+body+'\n}\n}\n';
}
