import json
class Solution:
    def cloneGraph(self,node):
        copies={}
        def copy(n):
            if n is None: return None
            if n in copies: return copies[n]
            c=Node(n.val); copies[n]=c; c.neighbors=[copy(v) for v in n.neighbors]; return c
        return copy(node)
    def alienOrder(self,words):
        adj={c:set() for c in ''.join(words)}; degree={c:0 for c in adj}
        for a,b in zip(words,words[1:]):
            if len(a)>len(b) and a.startswith(b): return ''
            for x,y in zip(a,b):
                if x!=y:
                    if y not in adj[x]: adj[x].add(y); degree[y]+=1
                    break
        q=[c for c in adj if not degree[c]]
        for c in q:
            for v in adj[c]:
                degree[v]-=1
                if not degree[v]: q.append(v)
        return ''.join(q) if len(q)==len(adj) else ''
    def reverseList(self,head):
        prev=None
        while head: nxt=head.next; head.next=prev; prev=head; head=nxt
        return prev
    def hasCycle(self,head):
        seen=set()
        while head:
            if head in seen: return True
            seen.add(head); head=head.next
        return False
    def mergeTwoLists(self,a,b):
        dummy=ListNode(); tail=dummy
        while a and b:
            if a.val<=b.val: tail.next=a; a=a.next
            else: tail.next=b; b=b.next
            tail=tail.next
        tail.next=a or b
        return dummy.next
    def mergeKLists(self,lists):
        out=None
        for head in lists: out=self.mergeTwoLists(out,head)
        return out
    def removeNthFromEnd(self,head,n):
        dummy=ListNode(0,head); a=b=dummy
        for _ in range(n+1): b=b.next
        while b: a=a.next; b=b.next
        a.next=a.next.next
        return dummy.next
    def reorderList(self,head):
        nodes=[]
        while head: nodes.append(head); head=head.next
        out=[]; l=0; r=len(nodes)-1
        while l<=r:
            out.append(nodes[l]); l+=1
            if l<=r: out.append(nodes[r]); r-=1
        for i,n in enumerate(out): n.next=out[i+1] if i+1<len(out) else None
    def groupAnagrams(self,strs):
        groups={}
        for s in strs: groups.setdefault(''.join(sorted(s)),[]).append(s)
        return list(groups.values())
    def maxDepth(self,root):
        return 1+max(self.maxDepth(root.left),self.maxDepth(root.right)) if root else 0
    def isSameTree(self,p,q):
        return p.val==q.val and self.isSameTree(p.left,q.left) and self.isSameTree(p.right,q.right) if p and q else p is q
    def invertTree(self,root):
        if root: root.left,root.right=self.invertTree(root.right),self.invertTree(root.left)
        return root
    def maxPathSum(self,root):
        best=float('-inf')
        def gain(n):
            nonlocal best
            if not n: return 0
            a=max(0,gain(n.left)); b=max(0,gain(n.right)); best=max(best,n.val+a+b)
            return n.val+max(a,b)
        gain(root); return best
    def levelOrder(self,root):
        out=[]
        def dfs(n,d):
            if not n: return
            if d==len(out): out.append([])
            out[d].append(n.val); dfs(n.left,d+1); dfs(n.right,d+1)
        dfs(root,0); return out
    def isSubtree(self,root,subRoot):
        return bool(root) and (self.isSameTree(root,subRoot) or self.isSubtree(root.left,subRoot) or self.isSubtree(root.right,subRoot))
    def buildTree(self,preorder,inorder):
        if not preorder: return None
        v=preorder[0]; i=inorder.index(v)
        return TreeNode(v,self.buildTree(preorder[1:i+1],inorder[:i]),self.buildTree(preorder[i+1:],inorder[i+1:]))
    def isValidBST(self,root):
        def valid(n,lo,hi): return not n or lo<n.val<hi and valid(n.left,lo,n.val) and valid(n.right,n.val,hi)
        return valid(root,float('-inf'),float('inf'))
    def kthSmallest(self,root,k):
        def walk(n): return walk(n.left)+[n.val]+walk(n.right) if n else []
        return walk(root)[k-1]
    def lowestCommonAncestor(self,root,p,q):
        while root:
            if max(p.val,q.val)<root.val: root=root.left
            elif min(p.val,q.val)>root.val: root=root.right
            else: return root
    def findWords(self,board,words):
        def exists(w):
            used=set()
            def dfs(r,c,i):
                if i==len(w): return True
                if not (0<=r<len(board) and 0<=c<len(board[0])) or (r,c) in used or board[r][c]!=w[i]: return False
                used.add((r,c)); found=any(dfs(r+dr,c+dc,i+1) for dr,dc in [(1,0),(-1,0),(0,1),(0,-1)]); used.remove((r,c)); return found
            return any(dfs(r,c,0) for r in range(len(board)) for c in range(len(board[0])))
        return [w for w in dict.fromkeys(words) if exists(w)]
class StringCodec:
    def encode(self,strs): return json.dumps(strs)
    def decode(self,data): return json.loads(data)
class TreeCodec:
    def serialize(self,root):
        def f(n): return [n.val,f(n.left),f(n.right)] if n else None
        return json.dumps(f(root))
    def deserialize(self,data):
        def f(a): return TreeNode(a[0],f(a[1]),f(a[2])) if a else None
        return f(json.loads(data))
class Trie:
    def __init__(self): self.words=set()
    def insert(self,s): self.words.add(s)
    def search(self,s): return s in self.words
    def startsWith(self,p): return any(s.startswith(p) for s in self.words)
class WordDictionary:
    def __init__(self): self.words=set()
    def addWord(self,s): self.words.add(s)
    def search(self,p): return any(len(s)==len(p) and all(a=='.' or a==b for a,b in zip(p,s)) for s in self.words)
class MedianFinder:
    def __init__(self): self.values=[]
    def addNum(self,n): self.values.append(n)
    def findMedian(self):
        a=sorted(self.values); m=len(a)//2
        return a[m] if len(a)%2 else (a[m-1]+a[m])/2
