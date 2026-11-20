export const projects={
  "cache": {
    "files": {
      "cache.cpp": "// Sources are combined in the displayed order. Standard library includes are supplied.\n// Value is variant<nullptr_t, bool, double, string>; optional distinguishes a missing key.\nusing Value = std::variant<std::nullptr_t, bool, double, std::string>;\nclass Cache {\npublic:\n explicit Cache(std::function<long long()> clock) {}\n void set(const std::string& key, Value value, long long ttl) { /* TODO */ }\n std::optional<Value> get(const std::string& key) { return std::nullopt; }\n size_t size() { return 0; }\n};\n",
      "service.cpp": "Value lookup(Cache& cache, const std::string& key, std::function<Value()> load) {\n // TODO: preserve cached false, zero, empty string, and nullptr.\n Value value=load(); cache.set(key,value,100); return value;\n}\n"
    },
    "contract": "C++17: cache.cpp defines Value and Cache; service.cpp defines lookup. Cache takes a clock callback returning integer milliseconds; clock/TTL sums must fit long long. get returns optional<Value>: nullopt means missing, while an engaged nullptr value is cached. Keep public signatures; the harness combines files in displayed order and supplies standard headers/main. No main in your files."
  },
  "pagination": {
    "files": {
      "order.cpp": "struct Record { int id; double createdAt; };\nstruct Page { std::vector<Record> items; std::optional<int> nextCursor; };\nstd::vector<Record> order(const std::vector<Record>& records) { return records; /* TODO */ }\n",
      "feed.cpp": "Page page(const std::vector<Record>& records, std::optional<int> after=std::nullopt, double limit=10) {\n // TODO: reject noninteger/out-of-range limit using std::out_of_range.\n return {{},std::nullopt};\n}\n"
    },
    "contract": "C++17: Record {int id; double createdAt}; Page {vector<Record> items; optional<int> nextCursor}. Implement order and page across their files. nullopt is no cursor; invalid numeric limits throw std::out_of_range. Input records are const and must remain unchanged. Standard headers and main are supplied; files are combined in displayed order."
  },
  "events": {
    "files": {
      "normalize.cpp": "// Optional fields represent missing fields. Numeric timestamp permits invalid fractional tests.\nstruct Event { std::optional<std::string> id,user; std::optional<double> timestamp,amount; };\nstruct UserTotal { std::string user; int count; double amount; };\nstruct Summary { std::vector<UserTotal> users; double total; };\nstd::optional<Event> normalize(const Event& event) { return event; /* TODO */ }\n",
      "summary.cpp": "Summary summarize(const std::vector<Event>& events, double start, double end) {\n // TODO: normalize, deduplicate, filter, aggregate and sort.\n return {{},0};\n}\n"
    },
    "contract": "C++17: Event uses optional<string> id/user and optional<double> timestamp/amount; nullopt represents missing fields. Types exclude wrong string/number types; normalize rejects missing/empty IDs/users, fractional/nonfinite timestamp and nonfinite amount, returning an optional copy. Summary contains vector<UserTotal> and total. Preserve supplied signatures, const inputs, and file order; standard headers/main are supplied."
  },
  "rate-limit": {
    "files": {
      "limiter.cpp": "class Limiter {\npublic:\n Limiter(int limit,long long windowMs) {}\n bool allow(const std::string& key,long long now) { return true; /* TODO */ }\n};\n",
      "service.cpp": "std::vector<bool> handle(Limiter& limiter,const std::vector<std::string>& keys,long long now) {\n // TODO: make one allow call for each key, in order.\n return {};\n}\n"
    },
    "contract": "C++17: Limiter(limit,windowMs).allow(key,now) returns bool; handle returns vector<bool>. Limits/window are positive integers; timestamps are nonnegative, fit long long, and are nondecreasing per key. Keep the two files and signatures. Standard headers/main are supplied and sources combined in displayed order."
  },
  "dependencies": {
    "files": {
      "graph.cpp": "struct Task { std::string id; std::vector<std::string> deps; };\nusing Graph=std::map<std::string,std::set<std::string>>;\nstd::optional<Graph> buildGraph(const std::vector<Task>& tasks) {\n // TODO: validate IDs/dependencies and deduplicate each dependency list.\n return Graph{};\n}\n",
      "scheduler.cpp": "std::optional<std::vector<std::string>> schedule(const std::vector<Task>& tasks) {\n // TODO: repeatedly choose the smallest ready ID. nullopt means invalid or cyclic.\n return std::vector<std::string>{};\n}\n"
    },
    "contract": "C++17: Task {string id; vector<string> deps}. buildGraph returns optional<Graph>, where Graph maps IDs to deduplicated dependency sets. schedule returns optional<vector<string>>; nullopt means invalid input or a cycle. Select the smallest currently ready ID at every step, and preserve inputs. The harness supplies standard headers/main and combines graph.cpp before scheduler.cpp."
  },
  "inventory": {
    "files": {
      "inventory.cpp": "struct Item { std::string sku; int quantity; };\nstruct Order { std::string id; std::vector<Item> items; };\nclass Inventory {\npublic:\n explicit Inventory(const std::map<std::string,int>& stock) {}\n bool reserve(const std::string& id,const std::vector<Item>& items) { return false; /* TODO */ }\n bool release(const std::string& id) { return false; /* TODO */ }\n int available(const std::string& sku) const { return 0; /* TODO */ }\n};\n",
      "checkout.cpp": "std::vector<bool> reserveMany(Inventory& inventory,const std::vector<Order>& orders) {\n // TODO: reserve orders sequentially.\n return {};\n}\n"
    },
    "contract": "C++17: Inventory is constructed with map<string,int> stock (nonnegative quantities). Item {string sku; int quantity}, Order {string id; vector<Item> items}. reserve/release return bool, available returns count or zero. Duplicate SKU quantities must be combined without overflow. reserveMany processes orders in order. Standard headers/main are supplied; inventory.cpp precedes checkout.cpp."
  }
};
const tests={
  "cache": [
    "long long t=0;Cache c([&]{return t;});c.set(\"a\",std::string(\"hello\"),10);return c.get(\"a\")==std::optional<Value>(Value(std::string(\"hello\")));",
    "long long t=0;Cache c([&]{return t;});c.set(\"a\",1.0,10);t=9;if(!c.get(\"a\"))return false;t=10;return !c.get(\"a\");",
    "long long t=0;Cache c([&]{return t;});for(Value v:std::vector<Value>{false,0.0,std::string(\"\"),nullptr}){c.set(\"a\",v,10);if(c.get(\"a\")!=std::optional<Value>(v))return false;}return true;",
    "long long t=0;Cache c([&]{return t;});c.set(\"a\",1.0,10);t=5;c.set(\"a\",2.0,20);t=15;return c.get(\"a\")==std::optional<Value>(Value(2.0))&&c.size()==1;",
    "long long t=0;Cache c([&]{return t;});c.set(\"a\",1.0,10);c.set(\"a\",2.0,0);c.set(\"b\",3.0,-1);return !c.get(\"a\")&&c.size()==0;",
    "long long t=0;Cache c([&]{return t;});c.set(\"a\",1.0,5);c.set(\"b\",2.0,20);t=5;if(c.size()!=1)return false;t=20;return c.size()==0;",
    "for(Value v:std::vector<Value>{false,0.0,std::string(\"\"),nullptr}){long long t=0;Cache c([&]{return t;});int calls=0;auto load=[&]()->Value{++calls;return v;};if(lookup(c,\"a\",load)!=v||lookup(c,\"a\",load)!=v||calls!=1)return false;}return true;",
    "long long t=0;Cache c([&]{return t;});int calls=0;auto load=[&]()->Value{return double(++calls);};lookup(c,\"a\",load);t=100;return lookup(c,\"a\",load)==Value(2.0)&&calls==2;"
  ],
  "pagination": [
    "auto r=order({{1,10},{2,20},{3,20},{4,30}});return ids(r)==std::vector<int>{4,3,2,1};",
    "return ids(order({{1,1},{3,1},{2,1}}))==std::vector<int>{3,2,1};",
    "std::vector<Record> r{{1,10},{2,20},{3,20},{4,30}};auto p=page(r,std::nullopt,2);auto q=page(r,p.nextCursor,1);return ids(p.items)==std::vector<int>{4,3}&&p.nextCursor==3&&ids(q.items)==std::vector<int>{2}&&q.nextCursor==2;",
    "auto p=page({{1,10},{2,20},{3,20},{4,30}},3,2);return ids(p.items)==std::vector<int>{2,1}&&!p.nextCursor;",
    "auto p=page({{1,10}},999,2);return p.items.empty()&&!p.nextCursor;",
    "std::vector<Record> r{{1,10},{2,20}};auto copy=r;order(r);page(r);return ids(r)==ids(copy)&&r[0].createdAt==copy[0].createdAt;",
    "for(double n:std::vector<double>{0,-1,101,1.5,std::numeric_limits<double>::quiet_NaN()}){bool caught=false;try{page({},std::nullopt,n);}catch(const std::out_of_range&){caught=true;}if(!caught)return false;}return true;",
    "auto a=page({},std::nullopt,1),b=page({{1,10}},std::nullopt,1),c=page({{1,10}},1,1);return a.items.empty()&&!a.nextCursor&&ids(b.items)==std::vector<int>{1}&&!b.nextCursor&&c.items.empty()&&!c.nextCursor;"
  ],
  "events": [
    "auto s=summarize({ev(\"1\"),ev(\"2\"),ev(\"3\",\"b\")},0,10);return summaryIs(s,{{\"a\",2,4},{\"b\",1,2}},6);",
    "return summaryIs(summarize({ev(\"1\"),ev(\"1\",\"b\",6,10)},0,10),{{\"a\",1,2}},2);",
    "return summaryIs(summarize({ev(\"1\",\"a\",0),ev(\"2\",\"a\",10)},0,10),{{\"a\",1,2}},2);",
    "for(const Event&e:std::vector<Event>{{},ev(\"\"),ev(\"1\",\"\"),ev(\"1\",\"a\",1.5),ev(\"1\",\"a\",2,INFINITY),Event{std::nullopt,\"a\",2,3}})if(normalize(e))return false;auto original=ev(\"x\");auto normalized=normalize(original);if(!normalized)return false;normalized->id=\"changed\";return original.id==\"x\"&&summaryIs(summarize({{},ev(\"1\",\"a\",2,NAN),ev(\"1\")},0,10),{{\"a\",1,2}},2);",
    "return summaryIs(summarize({ev(\"1\",\"a\",5,0),ev(\"2\",\"a\",5,-3)},0,10),{{\"a\",2,-3}},-3);",
    "return summaryIs(summarize({ev(\"1\",\"a\",-1),ev(\"1\",\"a\",5)},0,10),{},0);",
    "std::vector<Event> input{ev(\"1\",\"z\"),ev(\"2\",\"a\")};auto s=summarize(input,0,10);return summaryIs(s,{{\"a\",1,2},{\"z\",1,2}},4)&&input[0].user==\"z\"&&input[0].id==\"1\";",
    "std::vector<Event> input;for(int i=0;i<20000;i++)input.push_back(ev(std::to_string(i)));return summaryIs(summarize(input,0,10),{{\"a\",20000,40000}},40000);"
  ],
  "rate-limit": [
    "Limiter l(2,10);return l.allow(\"a\",0)&&l.allow(\"a\",1);",
    "Limiter l(2,10);l.allow(\"a\",0);l.allow(\"a\",1);return !l.allow(\"a\",2)&&!l.allow(\"a\",3);",
    "Limiter l(1,10);l.allow(\"a\",5);return !l.allow(\"a\",14)&&l.allow(\"a\",15);",
    "Limiter l(1,10);return l.allow(\"a\",0)&&l.allow(\"b\",0)&&!l.allow(\"a\",1);",
    "Limiter l(1,10);l.allow(\"a\",0);l.allow(\"a\",9);return l.allow(\"a\",10);",
    "Limiter l(2,10);l.allow(\"a\",0);return l.allow(\"a\",100)&&l.allow(\"a\",101)&&!l.allow(\"a\",102);",
    "Limiter l(2,10);return handle(l,{\"a\",\"a\",\"a\",\"b\"},0)==std::vector<bool>{true,true,false,true};",
    "Limiter a(1,10),b(1,10);return a.allow(\"x\",0)&&!a.allow(\"x\",1)&&b.allow(\"x\",1);"
  ],
  "dependencies": [
    "return schedule({{\"c\",{\"b\"}},{\"a\",{}},{\"b\",{\"a\"}}})==std::optional<std::vector<std::string>>({\"a\",\"b\",\"c\"});",
    "return schedule({{\"z\",{}},{\"b\",{}},{\"a\",{\"b\"}}})==std::optional<std::vector<std::string>>({\"b\",\"a\",\"z\"});",
    "return schedule({{\"b\",{\"a\",\"a\"}},{\"a\",{}}})==std::optional<std::vector<std::string>>({\"a\",\"b\"});",
    "return !schedule({{\"a\",{\"missing\"}}});",
    "return !schedule({{\"a\",{\"b\"}},{\"b\",{\"a\"}}})&&!schedule({{\"x\",{\"x\"}}});",
    "return !schedule({{\"a\",{}},{\"a\",{}}})&&!schedule({{\"\",{}}});",
    "auto result=schedule({});return result&&result->empty();",
    "std::vector<Task> tasks{{\"b\",{\"a\",\"a\"}},{\"a\",{}}};auto result=schedule(tasks);return result&&tasks[0].id==\"b\"&&tasks[0].deps==std::vector<std::string>{\"a\",\"a\"};"
  ],
  "inventory": [
    "Inventory v({{\"a\",5}});return v.reserve(\"x\",{{\"a\",2}})&&v.available(\"a\")==3&&v.available(\"unknown\")==0;",
    "Inventory v({{\"a\",5},{\"b\",1}});return !v.reserve(\"x\",{{\"a\",2},{\"b\",2}})&&v.available(\"a\")==5&&v.available(\"b\")==1;",
    "Inventory v({{\"a\",5}});if(!v.reserve(\"x\",{{\"a\",2},{\"a\",2}})||v.available(\"a\")!=1)return false;return !v.reserve(\"y\",{{\"a\",1},{\"a\",1}})&&v.available(\"a\")==1;",
    "Inventory v({{\"a\",5}});return v.reserve(\"x\",{{\"a\",2}})&&v.reserve(\"x\",{{\"a\",5}})&&v.available(\"a\")==3;",
    "Inventory v({{\"a\",5}});v.reserve(\"x\",{{\"a\",2}});return v.release(\"x\")&&!v.release(\"x\")&&v.available(\"a\")==5&&v.reserve(\"x\",{{\"a\",1}})&&v.available(\"a\")==4;",
    "Inventory v({{\"a\",2}});return !v.reserve(\"x\",{{\"a\",3}})&&v.reserve(\"x\",{{\"a\",1}})&&v.available(\"a\")==1;",
    "Inventory v({{\"a\",5}});return !v.reserve(\"x\",{})&&!v.reserve(\"x\",{{\"unknown\",1}})&&!v.reserve(\"x\",{{\"a\",0}})&&!v.reserve(\"x\",{{\"a\",-1}})&&v.available(\"a\")==5;",
    "Inventory v({{\"a\",3}}),w({{\"a\",3}});return reserveMany(v,{{\"x\",{{\"a\",2}}},{\"y\",{{\"a\",2}}},{\"z\",{{\"a\",1}}}})==std::vector<bool>{true,false,true}&&w.available(\"a\")==3;"
  ]
};
const includes="#include <algorithm>\n#include <cmath>\n#include <functional>\n#include <iostream>\n#include <limits>\n#include <map>\n#include <optional>\n#include <set>\n#include <stdexcept>\n#include <string>\n#include <variant>\n#include <vector>\n";
const helpers={"pagination": "std::vector<int> ids(const std::vector<Record>&rs){std::vector<int> out;for(auto&r:rs)out.push_back(r.id);return out;}\n", "events": "Event ev(std::string id,std::string user=\"a\",double timestamp=5,double amount=2){return {id,user,timestamp,amount};}\nbool summaryIs(const Summary&s,const std::vector<UserTotal>&expected,double total){if(s.total!=total||s.users.size()!=expected.size())return false;for(size_t i=0;i<expected.size();i++)if(s.users[i].user!=expected[i].user||s.users[i].count!=expected[i].count||s.users[i].amount!=expected[i].amount)return false;return true;}\n"};
export function buildProgram(id,files){
 const project=projects[id];if(!project)throw new Error('Unknown C++ lab.');
 const code=Object.keys(project.files).map(name=>{if(typeof files?.[name]!=='string')throw new Error('Missing lab file: '+name);return files[name];}).join('\n');
 const cases=tests[id].map((body,index)=>`try{bool passed=[&]()->bool{${body}}();std::cout<<${JSON.stringify('__ALGO_ARCADE_RESULT_'+index+'__{"value":')}<<(passed?"true":"false")<<"}\\n";}catch(...){std::cout<<${JSON.stringify('__ALGO_ARCADE_RESULT_'+index+'__{"value":false}\n')};}`).join('\n');
 return includes+code+'\n'+(helpers[id]||'')+'int main(){\n'+cases+'\nreturn 0;}\n';
}
