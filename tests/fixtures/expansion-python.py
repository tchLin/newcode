class Solution:
    def maxSubArray(self,a):
        best=end=a[0]
        for x in a[1:]:
            end=max(x,end+x)
            best=max(best,end)
        return best
    def search(self,a,target):
        lo,hi=0,len(a)-1
        while lo<=hi:
            mid=(lo+hi)//2
            if a[mid]==target: return mid
            if a[lo]<=a[mid]:
                if a[lo]<=target<a[mid]: hi=mid-1
                else: lo=mid+1
            else:
                if a[mid]<target<=a[hi]: lo=mid+1
                else: hi=mid-1
        return -1
    def missingNumber(self,a):
        x=len(a)
        for i,v in enumerate(a): x^=i^v
        return x
    def getSum(self,a,b):
        mask=0xffffffff
        while b:
            a,b=(a^b)&mask,((a&b)<<1)&mask
        return a if a<0x80000000 else a-0x100000000
    def reverseBits(self,n):
        out=0
        for _ in range(32): out,n=(out<<1)|(n&1),n>>1
        return out
    def longestCommonSubsequence(self,a,b):
        d=[[0]*(len(b)+1) for _ in range(len(a)+1)]
        for i,x in enumerate(a,1):
            for j,y in enumerate(b,1): d[i][j]=d[i-1][j-1]+1 if x==y else max(d[i-1][j],d[i][j-1])
        return d[-1][-1]
    def combinationSum4(self,a,target):
        d=[1]+[0]*target
        for t in range(1,target+1): d[t]=sum(d[t-x] for x in a if x<=t)
        return d[target]
    def rob(self,a):
        def run(values):
            x=y=0
            for v in values: x,y=y,max(y,x+v)
            return y
        return a[0] if len(a)==1 else max(run(a[1:]),run(a[:-1]))
    def numDecodings(self,s):
        d=[1]+[0]*len(s)
        for i in range(1,len(s)+1):
            if s[i-1]!='0': d[i]+=d[i-1]
            if i>1 and 10<=int(s[i-2:i])<=26: d[i]+=d[i-2]
        return d[-1]
    def uniquePaths(self,m,n):
        d=[1]*n
        for _ in range(1,m):
            for j in range(1,n): d[j]+=d[j-1]
        return d[-1]
    def longestConsecutive(self,a):
        values=set(a)
        best=0
        for x in values:
            if x-1 not in values:
                y=x
                while y in values: y+=1
                best=max(best,y-x)
        return best
    def countComponents(self,n,edges):
        p=list(range(n))
        def root(x):
            while p[x]!=x:
                p[x]=p[p[x]]
                x=p[x]
            return x
        count=n
        for a,b in edges:
            a,b=root(a),root(b)
            if a!=b: p[a]=b; count-=1
        return count
    def validTree(self,n,edges): return len(edges)==n-1 and self.countComponents(n,edges)==1
    def canAttendMeetings(self,a):
        a.sort()
        return all(a[i][0]>=a[i-1][1] for i in range(1,len(a)))
    def minMeetingRooms(self,a):
        events=sorted([(s,1) for s,e in a]+[(e,-1) for s,e in a])
        current=best=0
        for _,delta in events:
            current+=delta
            best=max(best,current)
        return best
    def isPalindrome(self,s):
        t=''.join(c.lower() for c in s if c.isascii() and c.isalnum())
        return t==t[::-1]
    def longestPalindrome(self,s):
        best=''
        for center in range(2*len(s)-1):
            l,r=center//2,(center+1)//2
            while l>=0 and r<len(s) and s[l]==s[r]:
                if r-l+1>len(best): best=s[l:r+1]
                l-=1; r+=1
        return best
    def countSubstrings(self,s):
        count=0
        for center in range(2*len(s)-1):
            l,r=center//2,(center+1)//2
            while l>=0 and r<len(s) and s[l]==s[r]:
                count+=1; l-=1; r+=1
        return count
    def characterReplacement(self,s,k):
        counts={}; left=best=0
        for right,c in enumerate(s):
            counts[c]=counts.get(c,0)+1
            while right-left+1-max(counts.values())>k:
                counts[s[left]]-=1; left+=1
            best=max(best,right-left+1)
        return best
    def wordBreak(self,s,words):
        d=[True]+[False]*len(s)
        for i in range(1,len(s)+1): d[i]=any(i>=len(w) and d[i-len(w)] and s[i-len(w):i]==w for w in words)
        return d[-1]
    def productExceptSelf(self,a):
        out=[1]*len(a); p=1
        for i,x in enumerate(a): out[i]=p; p*=x
        p=1
        for i in range(len(a)-1,-1,-1): out[i]*=p; p*=a[i]
        return out
    def countBits(self,n):
        d=[0]*(n+1)
        for i in range(1,n+1): d[i]=d[i>>1]+(i&1)
        return d
    def spiralOrder(self,a):
        out=[]; top=left=0; bottom=len(a)-1; right=len(a[0])-1
        while top<=bottom and left<=right:
            for x in range(left,right+1): out.append(a[top][x])
            top+=1
            for y in range(top,bottom+1): out.append(a[y][right])
            right-=1
            if top<=bottom:
                for x in range(right,left-1,-1): out.append(a[bottom][x])
                bottom-=1
            if left<=right:
                for y in range(bottom,top-1,-1): out.append(a[y][left])
                left+=1
        return out
    def topKFrequent(self,a,k):
        from collections import Counter
        return [x for x,_ in Counter(a).most_common(k)]
    def merge(self,a):
        out=[]
        for start,end in sorted(a):
            if out and start<=out[-1][1]: out[-1][1]=max(out[-1][1],end)
            else: out.append([start,end])
        return out
    def insert(self,a,newInterval): return self.merge(a+[newInterval])
    def setZeroes(self,a):
        rows={y for y,row in enumerate(a) if 0 in row}
        cols={x for row in a for x,v in enumerate(row) if v==0}
        for y in range(len(a)):
            for x in range(len(a[0])):
                if y in rows or x in cols: a[y][x]=0
    def rotate(self,a):
        for y in range(len(a)):
            for x in range(y+1,len(a)): a[y][x],a[x][y]=a[x][y],a[y][x]
        for row in a: row.reverse()
    def threeSum(self,a):
        a.sort(); out=[]
        for i in range(len(a)-2):
            if i and a[i]==a[i-1]: continue
            l,r=i+1,len(a)-1
            while l<r:
                total=a[i]+a[l]+a[r]
                if total<0: l+=1
                elif total>0: r-=1
                else:
                    out.append([a[i],a[l],a[r]])
                    lv,rv=a[l],a[r]
                    while l<r and a[l]==lv: l+=1
                    while l<r and a[r]==rv: r-=1
        return out
    def pacificAtlantic(self,a):
        rows,cols=len(a),len(a[0])
        def flood(starts):
            seen=set(starts); q=list(seen)
            for y,x in q:
                for ny,nx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]:
                    if 0<=ny<rows and 0<=nx<cols and (ny,nx) not in seen and a[ny][nx]>=a[y][x]:
                        seen.add((ny,nx)); q.append((ny,nx))
            return seen
        p=flood([(0,x) for x in range(cols)]+[(y,0) for y in range(rows)])
        t=flood([(rows-1,x) for x in range(cols)]+[(y,cols-1) for y in range(rows)])
        return [list(cell) for cell in sorted(p&t)]
