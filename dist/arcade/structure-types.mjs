export const structureTypes={
 c:{int:'int',bool:'bool',double:'double',string:'char*',array:'int*',intmatrix:'int**',strings:'char**',stringmatrix:'char***',chargrid:'char**',list:'struct ListNode*',lists:'struct ListNode**',tree:'struct TreeNode*',treeref:'struct TreeNode*',nodevalue:'struct TreeNode*',graph:'struct Node*'},
 cpp:{int:'int',bool:'bool',double:'double',string:'string',array:'vector<int>',intmatrix:'vector<vector<int>>',strings:'vector<string>',stringmatrix:'vector<vector<string>>',chargrid:'vector<vector<char>>',list:'ListNode*',lists:'vector<ListNode*>',tree:'TreeNode*',treeref:'TreeNode*',nodevalue:'TreeNode*',graph:'Node*'},
 java:{int:'int',bool:'boolean',double:'double',string:'String',array:'int[]',intmatrix:'int[][]',strings:'String[]',stringmatrix:'List<List<String>>',chargrid:'char[][]',list:'ListNode',lists:'ListNode[]',tree:'TreeNode',treeref:'TreeNode',nodevalue:'TreeNode',graph:'Node'},
 rust:{int:'i32',bool:'bool',double:'f64',string:'String',array:'Vec<i32>',intmatrix:'Vec<Vec<i32>>',strings:'Vec<String>',stringmatrix:'Vec<Vec<String>>',chargrid:'Vec<Vec<char>>',list:'ListLink',lists:'Vec<ListLink>',tree:'TreeLink',treeref:'TreeLink',nodevalue:'TreeLink',graph:'GraphLink'},
 go:{int:'int',bool:'bool',double:'float64',string:'string',array:'[]int',intmatrix:'[][]int',strings:'[]string',stringmatrix:'[][]string',chargrid:'[][]byte',list:'*ListNode',lists:'[]*ListNode',tree:'*TreeNode',treeref:'*TreeNode',nodevalue:'*TreeNode',graph:'*Node'},
 python:{int:'int',bool:'bool',double:'float',string:'str',array:'list[int]',intmatrix:'list[list[int]]',strings:'list[str]',stringmatrix:'list[list[str]]',chargrid:'list[list[str]]',list:'ListNode | None',lists:'list[ListNode | None]',tree:'TreeNode | None',treeref:'TreeNode',nodevalue:'TreeNode',graph:'Node | None'}
};
// These declarations are supplied by the test harness, before the submitted solution.
export const nodeDefinitions={
 c:`struct ListNode { int val; struct ListNode* next; };
struct TreeNode { int val; struct TreeNode *left, *right; };
struct Node { int val; int numNeighbors; struct Node** neighbors; };`,
 cpp:`struct ListNode {int val; ListNode* next; ListNode(int v=0,ListNode* n=nullptr):val(v),next(n){}};
struct TreeNode {int val; TreeNode *left,*right; TreeNode(int v=0,TreeNode* l=nullptr,TreeNode* r=nullptr):val(v),left(l),right(r){}};
class Node {public:int val; std::vector<Node*> neighbors; Node(int v=0):val(v){}};`,
 java:`class ListNode {int val; ListNode next; ListNode(int v){val=v;} ListNode(int v,ListNode n){val=v;next=n;}}
class TreeNode {int val; TreeNode left,right; TreeNode(int v){val=v;} TreeNode(int v,TreeNode l,TreeNode r){val=v;left=l;right=r;}}
class Node {int val; java.util.List<Node> neighbors=new java.util.ArrayList<>(); Node(int v){val=v;}}`,
 rust:`#[derive(Debug)] pub struct ListNode {pub val:i32,pub next:ListLink}
pub type ListLink=Option<std::rc::Rc<std::cell::RefCell<ListNode>>>;
impl ListNode {pub fn new(val:i32)->Self{Self{val,next:None}}}
#[derive(Debug)] pub struct TreeNode {pub val:i32,pub left:TreeLink,pub right:TreeLink}
pub type TreeLink=Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>;
impl TreeNode {pub fn new(val:i32)->Self{Self{val,left:None,right:None}}}
#[derive(Debug)] pub struct Node {pub val:i32,pub neighbors:Vec<GraphLink>}
pub type GraphLink=Option<std::rc::Rc<std::cell::RefCell<Node>>>;
impl Node {pub fn new(val:i32)->Self{Self{val,neighbors:vec![]}}}`, 
 go:`type ListNode struct { Val int; Next *ListNode }
type TreeNode struct { Val int; Left, Right *TreeNode }
type Node struct { Val int; Neighbors []*Node }`,
 python:`class ListNode:
    def __init__(self, val=0, next=None): self.val, self.next = val, next
class TreeNode:
    def __init__(self, val=0, left=None, right=None): self.val, self.left, self.right = val, left, right
class Node:
    def __init__(self, val=0, neighbors=None): self.val, self.neighbors = val, neighbors or []`
};
export const classMethods={
 trie:[['insert',[['word','string']],'void'],['search',[['word','string']],'bool'],['startsWith',[['prefix','string']],'bool']],
 dictionary:[['addWord',[['word','string']],'void'],['search',[['word','string']],'bool']],
 median:[['addNum',[['num','int']],'void'],['findMedian',[],'double']],
 stringCodec:[['encode',[['strs','strings']],'string'],['decode',[['data','string']],'strings']],
 treeCodec:[['serialize',[['root','tree']],'string'],['deserialize',[['data','string']],'tree']]
};
