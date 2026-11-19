export class ListNode {constructor(val=0,next=null){this.val=val;this.next=next;}}
export class TreeNode {constructor(val=0,left=null,right=null){this.val=val;this.left=left;this.right=right;}}
export class Node {constructor(val=0,neighbors=[]){this.val=val;this.neighbors=neighbors;}}
export function makeList(values,pos=-1){const nodes=values.map(v=>new ListNode(v));nodes.forEach((n,i)=>n.next=nodes[i+1]??null);if(nodes.length&&pos>=0)nodes.at(-1).next=nodes[pos];return nodes[0]??null;}
export function listNodes(head){const nodes=[],seen=new Set();while(head){if(seen.has(head)||nodes.length>=10000)throw new Error('Expected an acyclic list with at most 10,000 nodes.');if(!Number.isInteger(head.val))throw new Error('ListNode.val must be an integer.');seen.add(head);nodes.push(head);head=head.next;}return nodes;}
export function makeTree(values){if(!values.length||values[0]===null)return null;const root=new TreeNode(values[0]),q=[root];let i=1;for(let h=0;h<q.length&&i<values.length;h++)for(const side of ['left','right']){const value=values[i++];if(value!==null&&value!==undefined){const child=new TreeNode(value);q[h][side]=child;q.push(child);}}return root;}
export function treeNodes(root){const q=root?[root]:[],seen=new Set();for(let i=0;i<q.length;i++){const n=q[i];if(seen.has(n)||q.length>10000)throw new Error('Expected a tree without shared nodes or cycles.');if(!Number.isInteger(n.val))throw new Error('TreeNode.val must be an integer.');seen.add(n);if(n.left)q.push(n.left);if(n.right)q.push(n.right);}return q;}
export function treeValues(root){treeNodes(root);const q=root?[root]:[],out=[];for(let i=0;i<q.length;i++){const n=q[i];out.push(n?n.val:null);if(n)q.push(n.left??null,n.right??null);}while(out.at(-1)===null)out.pop();return out;}
export function makeGraph(adj){const nodes=adj.map((_,i)=>new Node(i+1));nodes.forEach((n,i)=>n.neighbors=adj[i].map(v=>nodes[v-1]));return nodes;}
function cloneValues(root,original){if(!root)return [];if(root.val!==1)throw new Error("Return the clone of the starting node, value 1.");const q=[root],seen=new Set(),rows=new Map();for(let i=0;i<q.length;i++){const node=q[i];if(seen.has(node))continue;if(q.length>10000||original.includes(node))throw new Error('Return fresh graph nodes; an original node is reused.');seen.add(node);if(!Number.isInteger(node.val)||!Array.isArray(node.neighbors)||rows.has(node.val))throw new Error('The clone must preserve unique values and neighbor references.');rows.set(node.val,node.neighbors.map(n=>n.val).sort((a,b)=>a-b));q.push(...node.neighbors);}if(rows.size!==original.length||[...rows.keys()].some(v=>v<1||v>rows.size))throw new Error('The clone is missing nodes or changed node values.');return Array.from({length:rows.size},(_,i)=>rows.get(i+1));}
const specs={cloneGraph:['graph'],alienOrder:['strings'],reverseList:['list'],hasCycle:['cycle'],mergeTwoLists:['list','list'],mergeKLists:['lists'],removeNthFromEnd:['list','int'],reorderList:['list'],groupAnagrams:['strings'],maxDepth:['tree'],isSameTree:['tree','tree'],invertTree:['tree'],maxPathSum:['tree'],levelOrder:['tree'],isSubtree:['tree','tree'],buildTree:['array','array'],isValidBST:['tree'],kthSmallest:['tree','int'],lowestCommonAncestor:['tree','treeref','treeref'],findWords:['chargrid','strings']};
const listResults=new Set(['reverseList','mergeTwoLists','mergeKLists','removeNthFromEnd','reorderList']),treeResults=new Set(['invertTree','buildTree']);
export function runStructures({code,fn,tests}){
 if(!Object.hasOwn(specs,fn)&&!['Trie','WordDictionary','MedianFinder','StringCodec','TreeCodec'].includes(fn))throw new Error('Unknown structure exercise.');
 const solution=new Function('ListNode','TreeNode','Node',`${code}\n;return typeof ${fn} !== 'undefined' ? ${fn} : null;`)(ListNode,TreeNode,Node);
 if(typeof solution!=='function')throw new Error(`Define ${fn} using the provided interface.`);
 return {results:tests.map(raw=>{try{
  const input=structuredClone(raw);let value;
  if(['Trie','WordDictionary','MedianFinder'].includes(fn)){
   const instance=new solution();value=input[0].map((op,i)=>{const answer=instance[op](...(op==='findMedian'?[]:[input[1][i]]));return ['insert','addWord','addNum'].includes(op)?null:answer;});
  }else if(fn==='StringCodec'||fn==='TreeCodec'){
   const tree=fn==='TreeCodec',source=tree?makeTree(input[0]):input[0];
   const encoded=new solution()[tree?'serialize':'encode'](source);
   if(typeof encoded!=='string'||encoded.length>50000)throw new Error('Encode to a self-contained string under 50,000 characters.');
   value=new solution()[tree?'deserialize':'decode'](encoded);
   if(tree)value=treeValues(value);
  }else{
   let originalGraph=[],root=null;
   const args=specs[fn].map((type,i)=>{
    if(type==='list'||type==='cycle')return makeList(input[i],type==='cycle'?input[1]:-1);
    if(type==='lists')return input[i].map(a=>makeList(a));
    if(type==='tree'){const t=makeTree(input[i]);if(i===0)root=t;return t;}
    if(type==='treeref')return treeNodes(root).find(n=>n.val===input[i]);
    if(type==='graph'){originalGraph=makeGraph(input[i]);return originalGraph[0]??null;}
    return input[i];
   });
   const before=fn==='reorderList'?listNodes(args[0]).map(n=>({n,val:n.val})):null;
   value=solution(...args);
   if(fn==='reorderList'){
    const after=listNodes(args[0]);if(after.length!==before.length||before.some(({n,val})=>n.val!==val||!after.includes(n))||after.some((n,i)=>n!==before[i%2?before.length-1-Math.floor(i/2):Math.floor(i/2)].n))throw new Error('Reorder the existing nodes without replacing them or changing values.');value=args[0];
   }
   if(listResults.has(fn))value=listNodes(value).map(n=>n.val);
   if(treeResults.has(fn))value=treeValues(value);
   if(fn==='lowestCommonAncestor'){if(!treeNodes(root).includes(value))throw new Error('Return an existing node from the input tree.');value=value.val;}
   if(fn==='cloneGraph'){if(JSON.stringify(originalGraph.map(n=>n.neighbors.map(x=>x.val)))!==JSON.stringify(input[0]))throw new Error('Do not change the original graph.');value=cloneValues(value,originalGraph);}
  }
  const encoded=JSON.stringify(value);if(encoded===undefined||encoded.length>50000)throw new Error('Return the value required by the interface.');
  return {value};
 }catch(error){return {error:String(error.message||error).slice(0,500)};}})};
}
export const isStructureFunction=fn=>Object.hasOwn(specs,fn)||['Trie','WordDictionary','MedianFinder','StringCodec','TreeCodec'].includes(fn);
