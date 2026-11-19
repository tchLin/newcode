package main
import "sort"
import "strconv"
import "strings"
func cloneGraph(node *Node)*Node{copies:=map[*Node]*Node{};var f func(*Node)*Node;f=func(n *Node)*Node{if n==nil{return nil};if c,ok:=copies[n];ok{return c};c:=&Node{Val:n.Val};copies[n]=c;for _,v:=range n.Neighbors{c.Neighbors=append(c.Neighbors,f(v))};return c};return f(node)}
func alienOrder(words []string)string{adj:=map[byte]map[byte]bool{};degree:=map[byte]int{};for _,s:=range words{for i:=0;i<len(s);i++{degree[s[i]]=0;adj[s[i]]=map[byte]bool{}}};for i:=1;i<len(words);i++{a,b:=words[i-1],words[i];j:=0;for j<len(a)&&j<len(b)&&a[j]==b[j]{j++};if j==len(b)&&len(a)>len(b){return ""};if j<len(a)&&j<len(b)&&!adj[a[j]][b[j]]{adj[a[j]][b[j]]=true;degree[b[j]]++}};q:=[]byte{};for c,d:=range degree{if d==0{q=append(q,c)}};for i:=0;i<len(q);i++{for v:=range adj[q[i]]{degree[v]--;if degree[v]==0{q=append(q,v)}}};if len(q)!=len(degree){return ""};return string(q)}
func reverseList(head *ListNode)*ListNode{var prev *ListNode;for head!=nil{next:=head.Next;head.Next=prev;prev=head;head=next};return prev}
func hasCycle(head *ListNode)bool{seen:=map[*ListNode]bool{};for head!=nil{if seen[head]{return true};seen[head]=true;head=head.Next};return false}
func mergeTwoLists(a,b *ListNode)*ListNode{dummy:=&ListNode{};t:=dummy;for a!=nil&&b!=nil{if a.Val<=b.Val{t.Next=a;a=a.Next}else{t.Next=b;b=b.Next};t=t.Next};if a!=nil{t.Next=a}else{t.Next=b};return dummy.Next}
func mergeKLists(lists []*ListNode)*ListNode{var out *ListNode;for _,n:=range lists{out=mergeTwoLists(out,n)};return out}
func removeNthFromEnd(head *ListNode,n int)*ListNode{dummy:=&ListNode{Next:head};a,b:=dummy,dummy;for i:=0;i<=n;i++{b=b.Next};for b!=nil{a=a.Next;b=b.Next};a.Next=a.Next.Next;return dummy.Next}
func reorderList(head *ListNode){a:=[]*ListNode{};for p:=head;p!=nil;p=p.Next{a=append(a,p)};out:=[]*ListNode{};l,r:=0,len(a)-1;for l<=r{out=append(out,a[l]);l++;if l<=r{out=append(out,a[r]);r--}};for i,n:=range out{n.Next=nil;if i+1<len(out){n.Next=out[i+1]}}}
func groupAnagrams(strs []string)[][]string{m:=map[string][]string{};for _,s:=range strs{a:=[]byte(s);sort.Slice(a,func(i,j int)bool{return a[i]<a[j]});k:=string(a);m[k]=append(m[k],s)};out:=[][]string{};for _,row:=range m{out=append(out,row)};return out}
func maxDepth(root *TreeNode)int{if root==nil{return 0};a,b:=maxDepth(root.Left),maxDepth(root.Right);if a>b{return 1+a};return 1+b}
func isSameTree(p,q *TreeNode)bool{if p==nil||q==nil{return p==q};return p.Val==q.Val&&isSameTree(p.Left,q.Left)&&isSameTree(p.Right,q.Right)}
func invertTree(root *TreeNode)*TreeNode{if root!=nil{root.Left,root.Right=invertTree(root.Right),invertTree(root.Left)};return root}
func maxPathSum(root *TreeNode)int{best:=-1<<60;var f func(*TreeNode)int;f=func(n *TreeNode)int{if n==nil{return 0};a,b:=f(n.Left),f(n.Right);if a<0{a=0};if b<0{b=0};if n.Val+a+b>best{best=n.Val+a+b};if a>b{return n.Val+a};return n.Val+b};f(root);return best}
func levelOrder(root *TreeNode)[][]int{out:=[][]int{};var f func(*TreeNode,int);f=func(n *TreeNode,d int){if n==nil{return};if d==len(out){out=append(out,[]int{})};out[d]=append(out[d],n.Val);f(n.Left,d+1);f(n.Right,d+1)};f(root,0);return out}
func isSubtree(root,subRoot *TreeNode)bool{return root!=nil&&(isSameTree(root,subRoot)||isSubtree(root.Left,subRoot)||isSubtree(root.Right,subRoot))}
func buildTree(preorder,inorder []int)*TreeNode{if len(preorder)==0{return nil};v,j:=preorder[0],0;for inorder[j]!=v{j++};return &TreeNode{Val:v,Left:buildTree(preorder[1:j+1],inorder[:j]),Right:buildTree(preorder[j+1:],inorder[j+1:])}}
func isValidBST(root *TreeNode)bool{var f func(*TreeNode,int64,int64)bool;f=func(n *TreeNode,l,r int64)bool{return n==nil||(int64(n.Val)>l&&int64(n.Val)<r&&f(n.Left,l,int64(n.Val))&&f(n.Right,int64(n.Val),r))};return f(root,-1<<63,1<<63-1)}
func kthSmallest(root *TreeNode,k int)int{a:=[]int{};var f func(*TreeNode);f=func(n *TreeNode){if n!=nil{f(n.Left);a=append(a,n.Val);f(n.Right)}};f(root);return a[k-1]}
func lowestCommonAncestor(root,p,q *TreeNode)*TreeNode{for root!=nil{if p.Val<root.Val&&q.Val<root.Val{root=root.Left}else if p.Val>root.Val&&q.Val>root.Val{root=root.Right}else{return root}};return nil}
func findWords(board [][]byte,words []string)[]string{out:=[]string{};seen:=map[string]bool{};for _,w:=range words{var f func(int,int,int)bool;f=func(r,c,i int)bool{if i==len(w){return true};if r<0||c<0||r>=len(board)||c>=len(board[0])||board[r][c]!=w[i]{return false};ch:=board[r][c];board[r][c]=0;found:=f(r+1,c,i+1)||f(r-1,c,i+1)||f(r,c+1,i+1)||f(r,c-1,i+1);board[r][c]=ch;return found};found:=false;for r:=range board{for c:=range board[r]{found=found||f(r,c,0)}};if found&&!seen[w]{out=append(out,w);seen[w]=true}};return out}
type StringCodec struct{}
func NewStringCodec()*StringCodec{return &StringCodec{}}
func(obj *StringCodec) Encode(strs []string)string{var b strings.Builder;for _,s:=range strs{b.WriteString(strconv.Itoa(len(s)));b.WriteByte('#');b.WriteString(s)};return b.String()}
func(obj *StringCodec) Decode(data string)[]string{out:=[]string{};for i:=0;i<len(data);{j:=i+strings.IndexByte(data[i:],'#');n,_:=strconv.Atoi(data[i:j]);out=append(out,data[j+1:j+1+n]);i=j+1+n};return out}
type TreeCodec struct{}
func NewTreeCodec()*TreeCodec{return &TreeCodec{}}
func(obj *TreeCodec) Serialize(root *TreeNode)string{if root==nil{return "#,"};return strconv.Itoa(root.Val)+","+obj.Serialize(root.Left)+obj.Serialize(root.Right)}
func(obj *TreeCodec) Deserialize(data string)*TreeNode{a:=strings.Split(data,",");i:=0;var f func()*TreeNode;f=func()*TreeNode{s:=a[i];i++;if s=="#"{return nil};v,_:=strconv.Atoi(s);return &TreeNode{Val:v,Left:f(),Right:f()}};return f()}
type Trie struct{words map[string]bool}
func NewTrie()*Trie{return &Trie{words:map[string]bool{}}}
func(obj *Trie) Insert(word string){obj.words[word]=true}
func(obj *Trie) Search(word string)bool{return obj.words[word]}
func(obj *Trie) StartsWith(prefix string)bool{for s:=range obj.words{if strings.HasPrefix(s,prefix){return true}};return false}
type WordDictionary struct{words map[string]bool}
func NewWordDictionary()*WordDictionary{return &WordDictionary{words:map[string]bool{}}}
func(obj *WordDictionary) AddWord(word string){obj.words[word]=true}
func(obj *WordDictionary) Search(p string)bool{for s:=range obj.words{if len(s)!=len(p){continue};ok:=true;for i:=range p{if p[i]!='.'&&p[i]!=s[i]{ok=false}};if ok{return true}};return false}
type MedianFinder struct{a []int}
func NewMedianFinder()*MedianFinder{return &MedianFinder{}}
func(obj *MedianFinder) AddNum(n int){obj.a=append(obj.a,n)}
func(obj *MedianFinder) FindMedian()float64{sort.Ints(obj.a);m:=len(obj.a)/2;if len(obj.a)%2==1{return float64(obj.a[m])};return (float64(obj.a[m-1])+float64(obj.a[m]))/2}
