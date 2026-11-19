// Bounded builders and serializers. They never implement the exercise's algorithm.
export const nativeHelpers={
c:String.raw`
static struct ListNode* aa_list(int* a,int n,int pos){struct ListNode** ns=calloc(n?n:1,sizeof(*ns));for(int i=0;i<n;i++){ns[i]=calloc(1,sizeof(**ns));ns[i]->val=a[i];}for(int i=0;i<n;i++)ns[i]->next=i+1<n?ns[i+1]:(pos>=0?ns[pos]:NULL);struct ListNode* out=n?ns[0]:NULL;free(ns);return out;}
static struct TreeNode* aa_tree(long long* a,int n){if(!n||a[0]==9223372036854775807LL)return NULL;struct TreeNode** q=calloc(n,sizeof(*q));q[0]=calloc(1,sizeof(**q));q[0]->val=(int)a[0];int end=1,j=1;for(int i=0;i<end&&j<n;i++)for(int s=0;s<2&&j<n;s++,j++)if(a[j]!=9223372036854775807LL){struct TreeNode* t=calloc(1,sizeof(*t));t->val=(int)a[j];if(s)q[i]->right=t;else q[i]->left=t;q[end++]=t;}struct TreeNode* out=q[0];free(q);return out;}
static struct TreeNode* aa_find(struct TreeNode* t,int v){if(!t||t->val==v)return t;struct TreeNode* x=aa_find(t->left,v);return x?x:aa_find(t->right,v);}
static bool aa_member(struct TreeNode* t,struct TreeNode* p){return t&&(t==p||aa_member(t->left,p)||aa_member(t->right,p));}
static struct Node* aa_graph(int** adj,int n,int* cols){if(!n)return NULL;struct Node** ns=calloc(n,sizeof(*ns));for(int i=0;i<n;i++){ns[i]=calloc(1,sizeof(**ns));ns[i]->val=i+1;ns[i]->numNeighbors=cols[i];ns[i]->neighbors=calloc(cols[i]?cols[i]:1,sizeof(struct Node*));}for(int i=0;i<n;i++)for(int j=0;j<cols[i];j++)ns[i]->neighbors[j]=ns[adj[i][j]-1];struct Node* out=ns[0];free(ns);return out;}
static int aa_list_nodes(struct ListNode* p,struct ListNode** out){int n=0;while(p){if(n>=10000)return -1;for(int j=0;j<n;j++)if(out[j]==p)return -1;out[n++]=p;p=p->next;}return n;}
static void aa_out_list(struct ListNode* p){struct ListNode* ns[10000];int n=aa_list_nodes(p,ns);if(n<0){printf("null");return;}printf("[");for(int i=0;i<n;i++){if(i)printf(",");printf("%d",ns[i]->val);}printf("]");}
static void aa_out_tree(struct TreeNode* root){struct TreeNode* q[20001];int end=0;if(root)q[end++]=root;for(int i=0;i<end;i++)if(q[i]){for(int j=0;j<i;j++)if(q[j]==q[i]){printf("null");return;}if(end+2>20000){printf("null");return;}q[end++]=q[i]->left;q[end++]=q[i]->right;}while(end&&q[end-1]==NULL)end--;printf("[");for(int i=0;i<end;i++){if(i)printf(",");if(q[i])printf("%d",q[i]->val);else printf("null");}printf("]");}
static int aa_graph_nodes(struct Node* root,struct Node** q){int n=0;if(root)q[n++]=root;for(int i=0;i<n;i++){struct Node* t=q[i];if(t->numNeighbors<0||t->numNeighbors>1000)return -1;for(int j=0;j<t->numNeighbors;j++){struct Node* v=t->neighbors[j];if(!v)return -1;int k=0;while(k<n&&q[k]!=v)k++;if(k==n){if(n>=1000)return -1;q[n++]=v;}}}return n;}
static void aa_out_graph(struct Node* copy,struct Node** original,int originalN){struct Node *q[1000],*by[1001]={0};int n=aa_graph_nodes(copy,q);if(n<0||n!=originalN||(copy&&copy->val!=1)){printf("null");return;}for(int i=0;i<n;i++){for(int j=0;j<originalN;j++)if(q[i]==original[j]){printf("null");return;}int v=q[i]->val;if(v<1||v>n||by[v]){printf("null");return;}by[v]=q[i];}printf("[");for(int i=1;i<=n;i++){if(i>1)printf(",");printf("[");for(int j=0;j<by[i]->numNeighbors;j++){if(j)printf(",");printf("%d",by[i]->neighbors[j]->val);}printf("]");}printf("]");}
static void aa_out_strings(char** a,int n){if(n<0||n>10000||(!a&&n)){printf("null");return;}printf("[");for(int i=0;i<n;i++){if(i)printf(",");aa_print_json(a[i]);}printf("]");}
static void aa_out_intmatrix(int** a,int n,int* cols){if(n<0||n>10000||((!a||!cols)&&n)){printf("null");return;}printf("[");for(int i=0;i<n;i++){if(i)printf(",");if(cols[i]<0||cols[i]>10000){printf("null");continue;}printf("[");for(int j=0;j<cols[i];j++){if(j)printf(",");printf("%d",a[i][j]);}printf("]");}printf("]");}
static void aa_out_groups(char*** a,int n,int* cols){if(n<0||n>10000||((!a||!cols)&&n)){printf("null");return;}printf("[");for(int i=0;i<n;i++){if(i)printf(",");aa_out_strings(a[i],cols[i]);}printf("]");}
`,
cpp:String.raw`
ListNode* aa_list(std::vector<int> a,int pos=-1){std::vector<ListNode*> ns;for(int v:a)ns.push_back(new ListNode(v));for(size_t i=0;i<ns.size();i++)ns[i]->next=i+1<ns.size()?ns[i+1]:pos>=0?ns[pos]:nullptr;return ns.empty()?nullptr:ns[0];}
TreeNode* aa_tree(std::vector<std::optional<int>> a){if(a.empty()||!a[0])return nullptr;auto root=new TreeNode(*a[0]);std::vector<TreeNode*> q{root};size_t j=1;for(size_t i=0;i<q.size()&&j<a.size();i++)for(int s=0;s<2&&j<a.size();s++,j++)if(a[j]){auto t=new TreeNode(*a[j]);if(s)q[i]->right=t;else q[i]->left=t;q.push_back(t);}return root;}
TreeNode* aa_find(TreeNode* t,int v){if(!t||t->val==v)return t;auto x=aa_find(t->left,v);return x?x:aa_find(t->right,v);}
bool aa_member(TreeNode* t,TreeNode* p){return t&&(t==p||aa_member(t->left,p)||aa_member(t->right,p));}
Node* aa_graph(std::vector<std::vector<int>> a){std::vector<Node*> ns;for(size_t i=0;i<a.size();i++)ns.push_back(new Node(i+1));for(size_t i=0;i<a.size();i++)for(int v:a[i])ns[i]->neighbors.push_back(ns[v-1]);return ns.empty()?nullptr:ns[0];}
std::vector<ListNode*> aa_list_nodes(ListNode* p){std::vector<ListNode*> out;std::unordered_set<ListNode*> seen;while(p){if(!seen.insert(p).second||out.size()>=10000)throw std::runtime_error("Expected acyclic list");out.push_back(p);p=p->next;}return out;}
std::vector<Node*> aa_graph_nodes(Node* p){std::vector<Node*> q;std::unordered_set<Node*> seen;if(p){q.push_back(p);seen.insert(p);}for(size_t i=0;i<q.size();i++)for(auto v:q[i]->neighbors){if(!v||q.size()>1000)throw std::runtime_error("Invalid graph");if(seen.insert(v).second)q.push_back(v);}return q;}
void aa_out(int v){std::cout<<v;} void aa_out(double v){std::cout<<v;} void aa_out(bool v){std::cout<<(v?"true":"false");} void aa_out(const std::string& s){aa_print_json(s);} void aa_out(std::optional<int> v){if(v)std::cout<<*v;else std::cout<<"null";}
template<class T> void aa_out(const std::vector<T>& a){std::cout<<"[";for(size_t i=0;i<a.size();i++){if(i)std::cout<<",";aa_out(a[i]);}std::cout<<"]";}
void aa_out_list(ListNode* p){std::vector<int> a;for(auto n:aa_list_nodes(p))a.push_back(n->val);aa_out(a);}
void aa_out_tree(TreeNode* p){std::vector<TreeNode*> q;if(p)q.push_back(p);std::vector<std::optional<int>> a;std::unordered_set<TreeNode*> seen;for(size_t i=0;i<q.size();i++){auto n=q[i];if(n){if(!seen.insert(n).second||q.size()>20000)throw std::runtime_error("Expected tree");a.push_back(n->val);q.push_back(n->left);q.push_back(n->right);}else a.push_back(std::nullopt);}while(!a.empty()&&!a.back())a.pop_back();aa_out(a);}
void aa_out_graph(Node* copy,const std::vector<Node*>& original){if(copy&&copy->val!=1)throw std::runtime_error("Return the cloned starting node");auto q=aa_graph_nodes(copy);std::vector<std::vector<int>> a(q.size());std::unordered_set<Node*> orig(original.begin(),original.end());std::unordered_set<int> vals;if(q.size()!=original.size())throw std::runtime_error("Missing clone nodes");for(auto n:q){if(orig.count(n)||n->val<1||n->val>(int)q.size()||!vals.insert(n->val).second)throw std::runtime_error("Graph clone must use fresh nodes");for(auto v:n->neighbors)a[n->val-1].push_back(v->val);}aa_out(a);}
`,
java:String.raw`
static ListNode aaList(int[] a,int pos){ListNode[] ns=new ListNode[a.length];for(int i=0;i<a.length;i++)ns[i]=new ListNode(a[i]);for(int i=0;i<a.length;i++)ns[i].next=i+1<a.length?ns[i+1]:pos>=0?ns[pos]:null;return a.length==0?null:ns[0];}
static TreeNode aaTree(Integer[] a){if(a.length==0||a[0]==null)return null;TreeNode root=new TreeNode(a[0]);java.util.List<TreeNode> q=new java.util.ArrayList<>();q.add(root);int j=1;for(int i=0;i<q.size()&&j<a.length;i++)for(int s=0;s<2&&j<a.length;s++,j++)if(a[j]!=null){TreeNode t=new TreeNode(a[j]);if(s==0)q.get(i).left=t;else q.get(i).right=t;q.add(t);}return root;}
static TreeNode aaFind(TreeNode t,int v){if(t==null||t.val==v)return t;TreeNode x=aaFind(t.left,v);return x!=null?x:aaFind(t.right,v);}
static boolean aaMember(TreeNode t,TreeNode p){return t!=null&&(t==p||aaMember(t.left,p)||aaMember(t.right,p));}
static Node aaGraph(int[][] a){Node[] ns=new Node[a.length];for(int i=0;i<a.length;i++)ns[i]=new Node(i+1);for(int i=0;i<a.length;i++)for(int v:a[i])ns[i].neighbors.add(ns[v-1]);return a.length==0?null:ns[0];}
static java.util.List<ListNode> aaListNodes(ListNode p){java.util.List<ListNode> out=new java.util.ArrayList<>();java.util.Set<ListNode> seen=java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<>());while(p!=null){if(!seen.add(p)||out.size()>=10000)throw new RuntimeException("Expected acyclic list");out.add(p);p=p.next;}return out;}
static java.util.List<Integer> aaListValues(ListNode p){java.util.List<Integer> a=new java.util.ArrayList<>();for(ListNode t:aaListNodes(p))a.add(t.val);return a;}
static java.util.List<Integer> aaTreeValues(TreeNode p){java.util.List<TreeNode> q=new java.util.ArrayList<>();java.util.List<Integer> a=new java.util.ArrayList<>();java.util.Set<TreeNode> seen=java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<>());if(p!=null)q.add(p);for(int i=0;i<q.size();i++){TreeNode t=q.get(i);if(t==null)a.add(null);else{if(!seen.add(t)||q.size()>20000)throw new RuntimeException("Expected tree");a.add(t.val);q.add(t.left);q.add(t.right);}}while(!a.isEmpty()&&a.get(a.size()-1)==null)a.remove(a.size()-1);return a;}
static java.util.List<Node> aaGraphNodes(Node p){java.util.List<Node> q=new java.util.ArrayList<>();java.util.Set<Node> seen=java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<>());if(p!=null){q.add(p);seen.add(p);}for(int i=0;i<q.size();i++)for(Node v:q.get(i).neighbors){if(v==null||q.size()>1000)throw new RuntimeException("Invalid graph");if(seen.add(v))q.add(v);}return q;}
static java.util.List<java.util.List<Integer>> aaCloneValues(Node copy,java.util.List<Node> orig){if(copy!=null&&copy.val!=1)throw new RuntimeException("Return the cloned starting node");java.util.List<Node> q=aaGraphNodes(copy);if(q.size()!=orig.size())throw new RuntimeException("Missing clone nodes");java.util.List<java.util.List<Integer>> a=new java.util.ArrayList<>();for(int i=0;i<q.size();i++)a.add(null);for(Node n:q){if(orig.contains(n)||n.val<1||n.val>q.size()||a.get(n.val-1)!=null)throw new RuntimeException("Clone needs fresh nodes");java.util.List<Integer> row=new java.util.ArrayList<>();for(Node v:n.neighbors)row.add(v.val);a.set(n.val-1,row);}return a;}
static String aaValue(Object v){if(v==null)return "null";if(v instanceof String)return aaJson((String)v);if(v instanceof Number||v instanceof Boolean)return v.toString();java.util.List<String> items=new java.util.ArrayList<>();if(v instanceof Iterable<?>)for(Object x:(Iterable<?>)v)items.add(aaValue(x));else if(v.getClass().isArray())for(int i=0;i<java.lang.reflect.Array.getLength(v);i++)items.add(aaValue(java.lang.reflect.Array.get(v,i)));else throw new RuntimeException("Unsupported result");return "["+String.join(",",items)+"]";}
`,
rust:String.raw`
fn aa_list(a:Vec<i32>,pos:i32)->ListLink{let ns:Vec<_>=a.into_iter().map(|v|std::rc::Rc::new(std::cell::RefCell::new(ListNode::new(v)))).collect();for i in 0..ns.len(){ns[i].borrow_mut().next=if i+1<ns.len(){Some(ns[i+1].clone())}else if pos>=0{Some(ns[pos as usize].clone())}else{None};}ns.first().cloned()}
fn aa_tree(a:Vec<Option<i32>>)->TreeLink{if a.is_empty()||a[0].is_none(){return None;}let root=std::rc::Rc::new(std::cell::RefCell::new(TreeNode::new(a[0].unwrap())));let mut q=vec![root.clone()];let(mut i,mut j)=(0,1);while i<q.len()&&j<a.len(){for s in 0..2{if j>=a.len(){break;}if let Some(v)=a[j]{let t=std::rc::Rc::new(std::cell::RefCell::new(TreeNode::new(v)));if s==0{q[i].borrow_mut().left=Some(t.clone());}else{q[i].borrow_mut().right=Some(t.clone());}q.push(t);}j+=1;}i+=1;}Some(root)}
fn aa_find(t:&TreeLink,v:i32)->TreeLink{if let Some(n)=t{let b=n.borrow();if b.val==v{return Some(n.clone());}aa_find(&b.left,v).or_else(||aa_find(&b.right,v))}else{None}}
fn aa_member(t:&TreeLink,p:&TreeLink)->bool{match(t,p){(Some(a),Some(b))=>std::rc::Rc::ptr_eq(a,b)||aa_member(&a.borrow().left,p)||aa_member(&a.borrow().right,p),_=>false}}
fn aa_graph(a:Vec<Vec<i32>>)->GraphLink{let ns:Vec<_>=(0..a.len()).map(|i|std::rc::Rc::new(std::cell::RefCell::new(Node::new(i as i32+1)))).collect();for i in 0..a.len(){ns[i].borrow_mut().neighbors=a[i].iter().map(|&v|Some(ns[v as usize-1].clone())).collect();}ns.first().cloned()}
fn aa_list_nodes(p:&ListLink)->Vec<std::rc::Rc<std::cell::RefCell<ListNode>>>{let mut out=vec![];let mut seen=std::collections::HashSet::new();let mut cur=p.clone();while let Some(n)=cur{assert!(out.len()<10000&&seen.insert(std::rc::Rc::as_ptr(&n) as usize),"Expected acyclic list");cur=n.borrow().next.clone();out.push(n);}out}
fn aa_list_value(p:&ListLink)->String{format!("{:?}",aa_list_nodes(p).iter().map(|n|n.borrow().val).collect::<Vec<_>>())}
fn aa_tree_value(p:&TreeLink)->String{let mut q=vec![];let mut out=vec![];let mut seen=std::collections::HashSet::new();if p.is_some(){q.push(p.clone());}let mut i=0;while i<q.len(){if let Some(n)=q[i].clone(){assert!(q.len()<20000&&seen.insert(std::rc::Rc::as_ptr(&n) as usize),"Expected tree");let b=n.borrow();out.push(b.val.to_string());q.push(b.left.clone());q.push(b.right.clone());}else{out.push("null".into());}i+=1;}while out.last().map_or(false,|v|v=="null"){out.pop();}format!("[{}]",out.join(","))}
fn aa_graph_nodes(p:&GraphLink)->Vec<std::rc::Rc<std::cell::RefCell<Node>>>{let mut q=vec![];let mut seen=std::collections::HashSet::new();if let Some(n)=p{q.push(n.clone());seen.insert(std::rc::Rc::as_ptr(n) as usize);}let mut i=0;while i<q.len(){let edges=q[i].borrow().neighbors.clone();for v in edges{let n=v.expect("Null graph neighbor");assert!(q.len()<1000);if seen.insert(std::rc::Rc::as_ptr(&n) as usize){q.push(n);}}i+=1;}q}
fn aa_clone_value(p:&GraphLink,orig:&[std::rc::Rc<std::cell::RefCell<Node>>])->String{if let Some(n)=p{assert_eq!(n.borrow().val,1,"Return the cloned starting node");}let q=aa_graph_nodes(p);assert_eq!(q.len(),orig.len());let mut a=vec![None;q.len()];for n in q.iter(){assert!(!orig.iter().any(|o|std::rc::Rc::ptr_eq(o,n)),"Clone needs fresh nodes");let b=n.borrow();assert!(b.val>0&&(b.val as usize)<=q.len()&&a[b.val as usize-1].is_none());a[b.val as usize-1]=Some(b.neighbors.iter().map(|x|x.as_ref().unwrap().borrow().val).collect::<Vec<_>>());}format!("{:?}",a.into_iter().map(|r|r.unwrap()).collect::<Vec<_>>())}
fn aa_strings(a:&[String])->String{format!("[{}]",a.iter().map(|s|aa_json(s)).collect::<Vec<_>>().join(","))}
fn aa_groups(a:&[Vec<String>])->String{format!("[{}]",a.iter().map(|r|aa_strings(r)).collect::<Vec<_>>().join(","))}
`,
go:String.raw`
func aaList(a []int,pos int)*ListNode{ns:=[]*ListNode{};for _,v:=range a{ns=append(ns,&ListNode{Val:v})};for i:=range ns{if i+1<len(ns){ns[i].Next=ns[i+1]}else if pos>=0{ns[i].Next=ns[pos]}};if len(ns)==0{return nil};return ns[0]}
func aaTree(a []any)*TreeNode{if len(a)==0||a[0]==nil{return nil};root:=&TreeNode{Val:a[0].(int)};q:=[]*TreeNode{root};j:=1;for i:=0;i<len(q)&&j<len(a);i++{for s:=0;s<2&&j<len(a);s++{if a[j]!=nil{t:=&TreeNode{Val:a[j].(int)};if s==0{q[i].Left=t}else{q[i].Right=t};q=append(q,t)};j++}};return root}
func aaFind(t *TreeNode,v int)*TreeNode{if t==nil||t.Val==v{return t};x:=aaFind(t.Left,v);if x!=nil{return x};return aaFind(t.Right,v)}
func aaMember(t,p *TreeNode)bool{return t!=nil&&(t==p||aaMember(t.Left,p)||aaMember(t.Right,p))}
func aaGraph(a [][]int)*Node{ns:=[]*Node{};for i:=range a{ns=append(ns,&Node{Val:i+1})};for i,row:=range a{for _,v:=range row{ns[i].Neighbors=append(ns[i].Neighbors,ns[v-1])}};if len(ns)==0{return nil};return ns[0]}
func aaListNodes(p *ListNode)[]*ListNode{out:=[]*ListNode{};seen:=map[*ListNode]bool{};for p!=nil{if seen[p]||len(out)>=10000{panic("Expected acyclic list")};seen[p]=true;out=append(out,p);p=p.Next};return out}
func aaListValue(p *ListNode)[]int{a:=[]int{};for _,n:=range aaListNodes(p){a=append(a,n.Val)};return a}
func aaTreeValue(p *TreeNode)[]any{q:=[]*TreeNode{};a:=[]any{};seen:=map[*TreeNode]bool{};if p!=nil{q=append(q,p)};for i:=0;i<len(q);i++{t:=q[i];if t==nil{a=append(a,nil)}else{if seen[t]||len(q)>20000{panic("Expected tree")};seen[t]=true;a=append(a,t.Val);q=append(q,t.Left,t.Right)}};for len(a)>0&&a[len(a)-1]==nil{a=a[:len(a)-1]};return a}
func aaGraphNodes(p *Node)[]*Node{q:=[]*Node{};seen:=map[*Node]bool{};if p!=nil{q=append(q,p);seen[p]=true};for i:=0;i<len(q);i++{for _,v:=range q[i].Neighbors{if v==nil||len(q)>1000{panic("Invalid graph")};if !seen[v]{seen[v]=true;q=append(q,v)}}};return q}
func aaCloneValue(p *Node,original []*Node)[][]int{if p!=nil&&p.Val!=1{panic("Return the cloned starting node")};q:=aaGraphNodes(p);if len(q)!=len(original){panic("Missing cloned nodes")};orig:=map[*Node]bool{};for _,v:=range original{orig[v]=true};a:=make([][]int,len(q));for _,n:=range q{if orig[n]||n.Val<1||n.Val>len(q)||a[n.Val-1]!=nil{panic("Clone needs fresh nodes")};a[n.Val-1]=[]int{};for _,v:=range n.Neighbors{a[n.Val-1]=append(a[n.Val-1],v.Val)}};return a}
`,
python:String.raw`
def _aa_list(a, pos=-1):
    ns = [ListNode(v) for v in a]
    for i, n in enumerate(ns): n.next = ns[i+1] if i+1 < len(ns) else ns[pos] if pos >= 0 else None
    return ns[0] if ns else None
def _aa_tree(a):
    if not a or a[0] is None: return None
    root = TreeNode(a[0]); q = [root]; j = 1
    for n in q:
        for side in ('left','right'):
            if j >= len(a): return root
            if a[j] is not None:
                t = TreeNode(a[j]); setattr(n, side, t); q.append(t)
            j += 1
    return root
def _aa_find(t, v):
    if t is None or t.val == v: return t
    return _aa_find(t.left, v) or _aa_find(t.right, v)
def _aa_member(t,p):
    return t is not None and (t is p or _aa_member(t.left,p) or _aa_member(t.right,p))
def _aa_graph(a):
    ns = [Node(i+1) for i in range(len(a))]
    for i,n in enumerate(ns): n.neighbors = [ns[v-1] for v in a[i]]
    return ns[0] if ns else None
def _aa_list_nodes(p):
    out=[]; seen=set()
    while p is not None:
        if id(p) in seen or len(out)>=10000: raise ValueError('Expected acyclic list')
        seen.add(id(p)); out.append(p); p=p.next
    return out
def _aa_tree_value(p):
    q=[p] if p else []; out=[]; seen=set()
    for n in q:
        if n is None: out.append(None)
        else:
            if id(n) in seen or len(q)>20000: raise ValueError('Expected tree')
            seen.add(id(n)); out.append(n.val); q.extend([n.left,n.right])
    while out and out[-1] is None: out.pop()
    return out
def _aa_graph_nodes(p):
    q=[p] if p else []; seen={id(p)} if p else set()
    for n in q:
        for v in n.neighbors:
            if v is None or len(q)>1000: raise ValueError('Invalid graph')
            if id(v) not in seen: seen.add(id(v)); q.append(v)
    return q
def _aa_clone_value(p,original):
    if p is not None and p.val!=1: raise ValueError('Return the cloned starting node')
    q=_aa_graph_nodes(p); orig={id(n) for n in original}; out=[None]*len(q)
    if len(q)!=len(original): raise ValueError('Missing cloned nodes')
    for n in q:
        if id(n) in orig or not 1<=n.val<=len(q) or out[n.val-1] is not None: raise ValueError('Clone needs fresh nodes')
        out[n.val-1]=[v.val for v in n.neighbors]
    return out
`
};
