const project=(files,contract)=>({files,contract:'Python files are combined in the order shown into one module; call helpers directly without importing the other exercise file. Standard-library imports are allowed. Do not add a main function. '+contract});
export const projects={
 cache:project({'cache.py':`MISSING = object()\nclass Cache:\n    def __init__(self, now):\n        self.now = now\n        self.entries = {}\n    def set(self, key, value, ttl):\n        self.entries[key] = (value, self.now() + ttl)\n    def get(self, key):\n        return self.entries.get(key, (MISSING, 0))[0]\n    def size(self):\n        return len(self.entries)\ndef create_cache(now):\n    return Cache(now)\n`,'service.py':`def lookup(cache, key, load):\n    value = cache.get(key)\n    if value is not MISSING and value:\n        return value\n    fresh = load()\n    cache.set(key, fresh, 100)\n    return fresh\n`},'Implement create_cache(now), Cache.set/get/size and lookup(cache,key,load). now() returns milliseconds. Missing values return the shared MISSING sentinel; None, False, zero and empty strings are valid cached values.'),
 pagination:project({'order.py':`def order(records):\n    # Return a sorted copy; records are dictionaries with id and createdAt.\n    return records\n`,'feed.py':`def page(records, after=None, limit=10):\n    # Raise ValueError for a non-integer or out-of-range limit.\n    return {"items": [], "nextCursor": None}\n`},'Implement order(records) and page(records,after=None,limit=10), using dict keys id, createdAt, items, nextCursor. Raise ValueError for invalid limits; bool is not a valid integer limit. Missing cursors are None.'),
 events:project({'normalize.py':`def normalize(event):\n    # Return a fresh four-field dictionary or None.\n    return event\n`,'summary.py':`def summarize(events, start, end):\n    # Validate, deduplicate before filtering, aggregate and sort.\n    return {"users": [], "total": 0}\n`},'Use dictionaries with id,user,timestamp,amount; normalize returns a fresh four-field dict or None. bool is not a valid numeric field. summarize returns {"users":[{"user":str,"count":int,"amount":number}],"total":number}.'),
 'rate-limit':project({'limiter.py':`class Limiter:\n    def __init__(self, limit, window_ms):\n        self.limit, self.window_ms = limit, window_ms\n        self.windows = {}\n    def allow(self, key, now):\n        # TODO: maintain each key's fixed window.\n        return True\ndef create_limiter(limit, window_ms):\n    return Limiter(limit, window_ms)\n`,'service.py':`def handle(limiter, keys, now):\n    return [limiter.allow(key, now) for key in keys]\n`},'Implement create_limiter(limit,window_ms), Limiter.allow(key,now), and handle(limiter,keys,now). Times and window size use integer milliseconds; return booleans.'),
 dependencies:project({'graph.py':`def build_graph(tasks):\n    # Return id -> set(dependency IDs), or None for invalid input.\n    return {}\n`,'scheduler.py':`def schedule(tasks):\n    # Use build_graph; return the smallest ready ID each step.\n    return []\n`},'Tasks are dictionaries {"id":str,"deps":list[str]}. build_graph returns a fresh dict of dependency sets or None for invalid input. schedule returns list[str] or None for invalid input/cycles; an empty graph returns [].'),
 inventory:project({'inventory.py':`class Inventory:\n    def __init__(self, stock):\n        self.stock = dict(stock)\n        self.orders = {}\n    def available(self, sku):\n        return self.stock.get(sku, 0)\n    def reserve(self, order_id, items):\n        # Validate and aggregate before changing any stock.\n        return False\n    def release(self, order_id):\n        return False\ndef create_inventory(stock):\n    return Inventory(stock)\n`,'service.py':`def reserve_many(inventory, orders):\n    return [inventory.reserve(order["id"], order["items"]) for order in orders]\n`},'Implement create_inventory(stock), Inventory.available/reserve/release, and reserve_many(inventory,orders). Lines use {"sku":str,"quantity":int}; orders use {"id":str,"items":list}. Reject bool and fractional quantities. Copy initial stock and preserve caller inputs.')
};
const checks={
 cache:[
 `c,_=setup(); c.set('a','hello',10); assert c.get('a')=='hello'`,
 `c,t=setup(); c.set('a',1,10); t[0]=9; assert c.get('a')==1; t[0]=10; assert c.get('a') is MISSING`,
 `c,_=setup()\nfor v in [False,0,'',None]:\n c.set('a',v,10); assert c.get('a') is v`,
 `c,t=setup(); c.set('a',1,10); t[0]=5; c.set('a',2,20); t[0]=15; assert c.get('a')==2 and c.size()==1`,
 `c,_=setup(); c.set('a',1,10); c.set('a',2,0); c.set('b',3,-1); assert c.get('a') is MISSING and c.size()==0`,
 `c,t=setup(); c.set('a',1,5); c.set('b',2,20); t[0]=5; assert c.size()==1; t[0]=20; assert c.size()==0`,
 `for value in [0,False,'',None]:\n c,_=setup(); calls=[0]\n def load():\n  calls[0]+=1; return value\n assert lookup(c,'a',load) is value; assert lookup(c,'a',load) is value; assert calls[0]==1`,
 `c,t=setup(); calls=[0]\ndef load():\n calls[0]+=1; return calls[0]\nassert lookup(c,'a',load)==1; t[0]=100; assert lookup(c,'a',load)==2`
 ],
 pagination:[
 `assert [r['id'] for r in order(copy.deepcopy(records))]==[4,3,2,1]`,
 `assert [r['id'] for r in order([{'id':1,'createdAt':1},{'id':3,'createdAt':1},{'id':2,'createdAt':1}])]==[3,2,1]`,
 `p=page(records,None,2); assert p=={'items':[records[3],records[2]],'nextCursor':3}; assert page(records,p['nextCursor'],1)=={'items':[records[1]],'nextCursor':2}`,
 `assert page(records,3,2)=={'items':[records[1],records[0]],'nextCursor':None}`,
 `assert page(records,999,2)=={'items':[],'nextCursor':None}`,
 `data=copy.deepcopy(records); before=copy.deepcopy(data); out=order(data); assert out is not data; page(data,None,2); assert data==before`,
 `for n in [0,-1,101,1.5,'2',True,float('nan')]:\n try: page(records,None,n)\n except ValueError: pass\n else: raise AssertionError('Invalid limit must raise ValueError')`,
 `assert page([],None,1)=={'items':[],'nextCursor':None}; assert page([records[0]],None,1)=={'items':[records[0]],'nextCursor':None}; assert page([records[0]],1,1)=={'items':[],'nextCursor':None}`
 ],
 events:[
 `assert summarize([ev('1'),ev('2'),ev('3','b')],0,10)=={'users':[{'user':'a','count':2,'amount':4},{'user':'b','count':1,'amount':2}],'total':6}`,
 `assert summarize([ev('1'),ev('1','b',6,10)],0,10)=={'users':[{'user':'a','count':1,'amount':2}],'total':2}`,
 `assert summarize([ev('1','a',0),ev('2','a',10)],0,10)=={'users':[{'user':'a','count':1,'amount':2}],'total':2}`,
 `for x in [None,{},ev(''),ev('1',''),ev('1','a',1.5),ev('1','a',2,float('inf')),ev('1','a',2,'2'),ev('1','a',True),ev('1','a',2,False)]:\n assert normalize(x) is None\noriginal={**ev('1'),'extra':True}; n=normalize(original); assert n==ev('1') and n is not original; assert summarize([{},ev('1','a',2,float('nan')),ev('1')],0,10)=={'users':[{'user':'a','count':1,'amount':2}],'total':2}`,
 `assert summarize([ev('1','a',5,0),ev('2','a',5,-3)],0,10)=={'users':[{'user':'a','count':2,'amount':-3}],'total':-3}`,
 `assert summarize([ev('1','a',-1),ev('1','a',5)],0,10)=={'users':[],'total':0}`,
 `data=[ev('1','z'),ev('2','a')]; before=copy.deepcopy(data); assert summarize(data,0,10)=={'users':[{'user':'a','count':1,'amount':2},{'user':'z','count':1,'amount':2}],'total':4}; assert data==before`,
 `assert summarize([ev(str(i)) for i in range(20000)],0,10)=={'users':[{'user':'a','count':20000,'amount':40000}],'total':40000}`
 ],
 'rate-limit':[
 `l=create_limiter(2,10); assert l.allow('a',0) and l.allow('a',1)`,
 `l=create_limiter(1,10); assert l.allow('a',0) and not l.allow('a',1) and not l.allow('a',9)`,
 `l=create_limiter(1,10); assert l.allow('a',0) and not l.allow('a',9) and l.allow('a',10)`,
 `l=create_limiter(1,10); assert l.allow('a',0) and l.allow('b',1) and not l.allow('a',2) and not l.allow('b',2)`,
 `l=create_limiter(1,10); assert l.allow('a',0) and not l.allow('a',9) and l.allow('a',10) and not l.allow('a',19) and l.allow('a',20)`,
 `l=create_limiter(2,10); assert l.allow('a',4) and l.allow('a',100) and l.allow('a',101) and not l.allow('a',109) and l.allow('a',110)`,
 `l=create_limiter(2,10); assert handle(l,['a','b','a','a','b','b'],0)==[True,True,True,False,True,False]`,
 `a=create_limiter(1,10); b=create_limiter(1,10); assert a.allow('x',0) and b.allow('x',0) and not a.allow('x',1)`
 ],
 dependencies:[
 `assert schedule([task('c',['b']),task('a'),task('b',['a'])])==['a','b','c']`,
 `assert schedule([task('z'),task('b'),task('a',['b']),task('c')])==['b','a','c','z']`,
 `assert schedule([task('a'),task('b',['a','a'])])==['a','b']`,
 `assert schedule([task('a',['missing'])]) is None and build_graph([task('a',['missing'])]) is None`,
 `assert schedule([task('a',['b']),task('b',['a'])]) is None; assert schedule([task('a',['a'])]) is None`,
 `assert schedule([task('a'),task('a')]) is None; assert schedule([task('')]) is None`,
 `assert schedule([])==[]`,
 `data=[task('b',['a','a']),task('a')]; before=copy.deepcopy(data); graph=build_graph(data); assert graph=={'b':{'a'},'a':set()}; assert schedule(data)==['a','b']; assert data==before`
 ],
 inventory:[
 `i=create_inventory({'a':5}); assert i.reserve('o',[line('a',2)]) and i.available('a')==3 and i.available('unknown')==0`,
 `i=create_inventory({'a':5,'b':1}); assert not i.reserve('o',[line('a',2),line('b',2)]) and i.available('a')==5 and i.available('b')==1`,
 `i=create_inventory({'a':5}); assert not i.reserve('bad',[line('a',3),line('a',3)]); assert i.available('a')==5; assert i.reserve('ok',[line('a',2),line('a',3)]) and i.available('a')==0`,
 `i=create_inventory({'a':5}); assert i.reserve('o',[line('a',2)]) and i.reserve('o',[line('a',5)]) and i.available('a')==3`,
 `i=create_inventory({'a':5}); assert i.reserve('o',[line('a',2)]) and i.release('o') and not i.release('o') and i.available('a')==5; assert i.reserve('o',[line('a',1)]) and i.available('a')==4`,
 `i=create_inventory({'a':3}); assert i.reserve('held',[line('a',3)]); assert not i.reserve('retry',[line('a',1)]); assert i.release('held') and i.reserve('retry',[line('a',1)]) and i.available('a')==2`,
 `i=create_inventory({'a':5})\nfor items in [[],[line('missing',1)],[line('a',0)],[line('a',-1)],[line('a',1.5)],[line('a',True)]]:\n assert not i.reserve('bad',items)\nassert i.available('a')==5`,
 `stock={'a':3,'b':2}; i=create_inventory(stock); orders=[{'id':'1','items':[line('a',2)]},{'id':'2','items':[line('a',2)]},{'id':'3','items':[line('b',1)]}]; before=copy.deepcopy(orders); assert reserve_many(i,orders)==[True,False,True]; assert stock=={'a':3,'b':2} and orders==before`
 ]
};
export function buildProgram(id,files){
 const p=projects[id];if(!p)throw new Error('Unknown Python lab.');
 const source=Object.keys(p.files).map(name=>{if(typeof files[name]!=='string')throw new Error('Missing '+name);return '# '+name+'\n'+files[name];}).join('\n\n');
 const support=`import json as _lab_json\nimport copy\ndef setup():\n t=[0]\n return create_cache(lambda:t[0]),t\ndef ev(id,user='a',timestamp=5,amount=2):\n return {'id':id,'user':user,'timestamp':timestamp,'amount':amount}\ndef task(id,deps=None):\n return {'id':id,'deps':[] if deps is None else deps}\ndef line(sku,quantity):\n return {'sku':sku,'quantity':quantity}\nrecords=[{'id':1,'createdAt':10},{'id':2,'createdAt':20},{'id':3,'createdAt':20},{'id':4,'createdAt':30}]\n`;
 return source+'\n\n'+support+checks[id].map((body,i)=>`def _lab_check_${i}():\n${body.split('\n').map(l=>'    '+l).join('\n')}\ntry:\n    _lab_check_${i}()\n    print('__ALGO_ARCADE_RESULT_${i}__'+_lab_json.dumps({'value':True}))\nexcept Exception as _lab_error:\n    print('__ALGO_ARCADE_RESULT_${i}__'+_lab_json.dumps({'error':str(_lab_error) or 'Acceptance check failed'}))\n`).join('\n');
}
