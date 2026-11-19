export const strategySolutions={
 javascript:[
 `function canFinish(n, edges){const adj=Array.from({length:n},()=>[]),degree=Array(n).fill(0);for(const [a,b] of edges){adj[b].push(a);degree[a]++;}const q=[];degree.forEach((d,i)=>{if(!d)q.push(i)});for(let i=0;i<q.length;i++)for(const a of adj[q[i]])if(--degree[a]===0)q.push(a);return q.length===n;}`,
 `function eraseOverlapIntervals(a){a.sort((x,y)=>x[1]-y[1]);let end=-Infinity,count=0;for(const [s,e] of a)if(s<end)count++;else end=e;return count;}`,
 `function findMin(a){let l=0,r=a.length-1;while(l<r){let m=(l+r)>>1;if(a[m]>a[r])l=m+1;else r=m;}return a[l];}`,
 `function coinChange(coins,amount){const dp=Array(amount+1).fill(amount+1);dp[0]=0;for(let a=1;a<=amount;a++)for(const c of coins)if(c<=a)dp[a]=Math.min(dp[a],dp[a-c]+1);return dp[amount]>amount?-1:dp[amount];}`,
 `function hammingWeight(n){let count=0;while(n){n&=n-1;count++;}return count;}`
 ],
 c:[
 `#include <stdbool.h>
#include <stdlib.h>
bool canFinish(int n,int** edges,int size,int* cols){int* degree=calloc(n,sizeof(int));int* queue=malloc(n*sizeof(int));for(int i=0;i<size;i++)degree[edges[i][0]]++;int head=0,tail=0;for(int i=0;i<n;i++)if(!degree[i])queue[tail++]=i;while(head<tail){int b=queue[head++];for(int i=0;i<size;i++)if(edges[i][1]==b&&--degree[edges[i][0]]==0)queue[tail++]=edges[i][0];}free(queue);free(degree);return tail==n;}`,
 `#include <stdlib.h>
#include <limits.h>
int cmp(const void* a,const void* b){const int* x=*(const int* const*)a;const int* y=*(const int* const*)b;return (x[1]>y[1])-(x[1]<y[1]);}
int eraseOverlapIntervals(int** a,int size,int* cols){qsort(a,size,sizeof(int*),cmp);int end=INT_MIN,count=0;for(int i=0;i<size;i++)if(a[i][0]<end)count++;else end=a[i][1];return count;}`,
 `int findMin(int* a,int size){int l=0,r=size-1;while(l<r){int m=l+(r-l)/2;if(a[m]>a[r])l=m+1;else r=m;}return a[l];}`,
 `#include <stdlib.h>
int coinChange(int* coins,int size,int amount){int* dp=malloc((amount+1)*sizeof(int));dp[0]=0;for(int a=1;a<=amount;a++){dp[a]=amount+1;for(int i=0;i<size;i++)if(coins[i]<=a&&dp[a-coins[i]]+1<dp[a])dp[a]=dp[a-coins[i]]+1;}int answer=dp[amount]>amount?-1:dp[amount];free(dp);return answer;}`,
 `int hammingWeight(int n){int count=0;while(n){n&=n-1;count++;}return count;}`
 ],
 cpp:[
 `#include <vector>
using namespace std;class Solution{public:bool canFinish(int n,vector<vector<int>>& edges){vector<vector<int>> adj(n);vector<int>d(n),q;for(auto e:edges){adj[e[1]].push_back(e[0]);d[e[0]]++;}for(int i=0;i<n;i++)if(!d[i])q.push_back(i);for(int i=0;i<q.size();i++)for(int a:adj[q[i]])if(--d[a]==0)q.push_back(a);return q.size()==n;}};`,
 `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;class Solution{public:int eraseOverlapIntervals(vector<vector<int>>& a){sort(a.begin(),a.end(),[](auto x,auto y){return x[1]<y[1];});int end=INT_MIN,count=0;for(auto p:a)if(p[0]<end)count++;else end=p[1];return count;}};`,
 `#include <vector>
using namespace std;class Solution{public:int findMin(vector<int>& a){int l=0,r=a.size()-1;while(l<r){int m=(l+r)/2;if(a[m]>a[r])l=m+1;else r=m;}return a[l];}};`,
 `#include <vector>
#include <algorithm>
using namespace std;class Solution{public:int coinChange(vector<int>& coins,int amount){vector<int>d(amount+1,amount+1);d[0]=0;for(int a=1;a<=amount;a++)for(int c:coins)if(c<=a)d[a]=min(d[a],d[a-c]+1);return d[amount]>amount?-1:d[amount];}};`,
 `class Solution{public:int hammingWeight(int n){int c=0;while(n){n&=n-1;c++;}return c;}};`
 ],
 java:[
 `import java.util.*;class Solution{public boolean canFinish(int n,int[][] edges){List<List<Integer>> adj=new ArrayList<>();for(int i=0;i<n;i++)adj.add(new ArrayList<>());int[] d=new int[n];for(int[] e:edges){adj.get(e[1]).add(e[0]);d[e[0]]++;}Queue<Integer> q=new ArrayDeque<>();for(int i=0;i<n;i++)if(d[i]==0)q.add(i);int done=0;while(!q.isEmpty()){int b=q.remove();done++;for(int a:adj.get(b))if(--d[a]==0)q.add(a);}return done==n;}}`,
 `import java.util.*;class Solution{public int eraseOverlapIntervals(int[][] a){Arrays.sort(a,(x,y)->Integer.compare(x[1],y[1]));int end=Integer.MIN_VALUE,count=0;for(int[] p:a)if(p[0]<end)count++;else end=p[1];return count;}}`,
 `class Solution{public int findMin(int[] a){int l=0,r=a.length-1;while(l<r){int m=(l+r)/2;if(a[m]>a[r])l=m+1;else r=m;}return a[l];}}`,
 `import java.util.*;class Solution{public int coinChange(int[] coins,int amount){int[] d=new int[amount+1];Arrays.fill(d,amount+1);d[0]=0;for(int a=1;a<=amount;a++)for(int c:coins)if(c<=a)d[a]=Math.min(d[a],d[a-c]+1);return d[amount]>amount?-1:d[amount];}}`,
 `class Solution{public int hammingWeight(int n){int c=0;while(n!=0){n&=n-1;c++;}return c;}}`
 ],
 rust:[
 `struct Solution;impl Solution{pub fn can_finish(n:i32,edges:Vec<Vec<i32>>)->bool{let n=n as usize;let mut adj=vec![vec![];n];let mut d=vec![0;n];for e in edges{adj[e[1] as usize].push(e[0] as usize);d[e[0] as usize]+=1;}let mut q:Vec<usize>=(0..n).filter(|&i|d[i]==0).collect();let mut i=0;while i<q.len(){for &a in &adj[q[i]]{d[a]-=1;if d[a]==0{q.push(a);}}i+=1;}q.len()==n}}`,
 `struct Solution;impl Solution{pub fn erase_overlap_intervals(mut a:Vec<Vec<i32>>)->i32{a.sort_by_key(|p|p[1]);let mut end=i32::MIN;let mut count=0;for p in a{if p[0]<end{count+=1;}else{end=p[1];}}count}}`,
 `struct Solution;impl Solution{pub fn find_min(a:Vec<i32>)->i32{let(mut l,mut r)=(0,a.len()-1);while l<r{let m=(l+r)/2;if a[m]>a[r]{l=m+1;}else{r=m;}}a[l]}}`,
 `struct Solution;impl Solution{pub fn coin_change(coins:Vec<i32>,amount:i32)->i32{let n=amount as usize;let mut d=vec![amount+1;n+1];d[0]=0;for a in 1..=n{for &c in &coins{if c as usize<=a{d[a]=d[a].min(d[a-c as usize]+1);}}}if d[n]>amount{-1}else{d[n]}}}`,
 `struct Solution;impl Solution{pub fn hamming_weight(mut n:i32)->i32{let mut c=0;while n!=0{n&=n-1;c+=1;}c}}`
 ],
 go:[
 `package main
func canFinish(n int,edges [][]int) bool{adj:=make([][]int,n);d:=make([]int,n);for _,e:=range edges{adj[e[1]]=append(adj[e[1]],e[0]);d[e[0]]++};q:=[]int{};for i:=0;i<n;i++{if d[i]==0{q=append(q,i)}};for i:=0;i<len(q);i++{for _,a:=range adj[q[i]]{d[a]--;if d[a]==0{q=append(q,a)}}};return len(q)==n}`,
 `package main
import "sort"
func eraseOverlapIntervals(a [][]int) int{sort.Slice(a,func(i,j int)bool{return a[i][1]<a[j][1]});end:=a[0][1];count:=0;for _,p:=range a[1:]{if p[0]<end{count++}else{end=p[1]}};return count}`,
 `package main
func findMin(a []int) int{l,r:=0,len(a)-1;for l<r{m:=(l+r)/2;if a[m]>a[r]{l=m+1}else{r=m}};return a[l]}`,
 `package main
func coinChange(coins []int,amount int) int{d:=make([]int,amount+1);for a:=1;a<=amount;a++{d[a]=amount+1;for _,c:=range coins{if c<=a&&d[a-c]+1<d[a]{d[a]=d[a-c]+1}}};if d[amount]>amount{return -1};return d[amount]}`,
 `package main
func hammingWeight(n int) int{c:=0;for n!=0{n &= n-1;c++};return c}`
 ],
 python:[
 `class Solution:
    def canFinish(self,n,edges):
        adj=[[] for _ in range(n)]
        degree=[0]*n
        for a,b in edges:
            adj[b].append(a)
            degree[a]+=1
        q=[i for i in range(n) if degree[i]==0]
        for b in q:
            for a in adj[b]:
                degree[a]-=1
                if degree[a]==0: q.append(a)
        return len(q)==n`,
 `class Solution:
    def eraseOverlapIntervals(self,a):
        end=float('-inf')
        count=0
        for s,e in sorted(a,key=lambda p:p[1]):
            if s<end: count+=1
            else: end=e
        return count`,
 `class Solution:
    def findMin(self,a):
        l,r=0,len(a)-1
        while l<r:
            m=(l+r)//2
            if a[m]>a[r]: l=m+1
            else: r=m
        return a[l]`,
 `class Solution:
    def coinChange(self,coins,amount):
        dp=[0]+[amount+1]*amount
        for a in range(1,amount+1):
            for c in coins:
                if c<=a: dp[a]=min(dp[a],dp[a-c]+1)
        return dp[amount] if dp[amount]<=amount else -1`,
 `class Solution:
    def hammingWeight(self,n):
        count=0
        while n:
            n &= n-1
            count+=1
        return count`
 ]
};
