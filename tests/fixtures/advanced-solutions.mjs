// Independent executable references; these files are not deployed.
export const advancedSolutions={
 javascript:[
 `function maxArea(height){let l=0,r=height.length-1,best=0;while(l<r){best=Math.max(best,(r-l)*Math.min(height[l],height[r]));if(height[l]<height[r])l++;else r--;}return best;}`,
 `function lengthOfLIS(nums){const dp=nums.map(()=>1);for(let i=0;i<nums.length;i++)for(let j=0;j<i;j++)if(nums[j]<nums[i])dp[i]=Math.max(dp[i],dp[j]+1);return Math.max(...dp);}`,
 `function numIslands(grid){let count=0;const rows=grid.length,cols=grid[0].length;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(grid[r][c]==='1'){count++;grid[r][c]='0';const q=[[r,c]];for(let i=0;i<q.length;i++){const [y,x]=q[i];for(const [ny,nx] of [[y-1,x],[y+1,x],[y,x-1],[y,x+1]])if(ny>=0&&ny<rows&&nx>=0&&nx<cols&&grid[ny][nx]==='1'){grid[ny][nx]='0';q.push([ny,nx]);}}}return count;}`,
 `function minWindow(s,t){const need={};for(const c of t)need[c]=(need[c]||0)+1;let missing=t.length,l=0,start=0,len=Infinity;for(let r=0;r<s.length;r++){if((need[s[r]]||0)>0)missing--;need[s[r]]=(need[s[r]]||0)-1;while(missing===0){if(r-l+1<len){len=r-l+1;start=l;}need[s[l]]=(need[s[l]]||0)+1;if(need[s[l]]>0)missing++;l++;}}return len===Infinity?'':s.slice(start,start+len);}`
 ],
 c:[
 `int maxArea(int* height,int heightSize){int l=0,r=heightSize-1,b=0;while(l<r){int h=height[l]<height[r]?height[l]:height[r],a=(r-l)*h;if(a>b)b=a;if(height[l]<height[r])l++;else r--;}return b;}`,
 `#include <stdlib.h>
int lengthOfLIS(int* nums,int numsSize){int* dp=malloc(numsSize*sizeof(int));int b=1;for(int i=0;i<numsSize;i++){dp[i]=1;for(int j=0;j<i;j++)if(nums[j]<nums[i]&&dp[j]+1>dp[i])dp[i]=dp[j]+1;if(dp[i]>b)b=dp[i];}free(dp);return b;}`,
 `void flood(char** g,int rows,int* cols,int r,int c){if(r<0||r>=rows||c<0||c>=cols[r]||g[r][c]!='1')return;g[r][c]='0';flood(g,rows,cols,r-1,c);flood(g,rows,cols,r+1,c);flood(g,rows,cols,r,c-1);flood(g,rows,cols,r,c+1);}
int numIslands(char** grid,int gridSize,int* gridColSize){int n=0;for(int r=0;r<gridSize;r++)for(int c=0;c<gridColSize[r];c++)if(grid[r][c]=='1'){n++;flood(grid,gridSize,gridColSize,r,c);}return n;}`,
 `#include <stdlib.h>
#include <string.h>
char* minWindow(char* s,char* t){int need[128]={0},missing=(int)strlen(t),l=0,start=0,len=(int)strlen(s)+1;for(int i=0;t[i];i++)need[(unsigned char)t[i]]++;for(int r=0;s[r];r++){if(need[(unsigned char)s[r]]>0)missing--;need[(unsigned char)s[r]]--;while(!missing){if(r-l+1<len){len=r-l+1;start=l;}need[(unsigned char)s[l]]++;if(need[(unsigned char)s[l]]>0)missing++;l++;}}if(len>(int)strlen(s))len=0;char* out=malloc(len+1);memcpy(out,s+start,len);out[len]=0;return out;}`
 ],
 cpp:[
 `#include <vector>
#include <algorithm>
using namespace std;
class Solution{public:int maxArea(vector<int>& height){int l=0,r=height.size()-1,b=0;while(l<r){b=max(b,(r-l)*min(height[l],height[r]));if(height[l]<height[r])l++;else r--;}return b;}};`,
 `#include <vector>
#include <algorithm>
using namespace std;
class Solution{public:int lengthOfLIS(vector<int>& nums){vector<int> dp(nums.size(),1);int b=1;for(int i=0;i<(int)nums.size();i++){for(int j=0;j<i;j++)if(nums[j]<nums[i])dp[i]=max(dp[i],dp[j]+1);b=max(b,dp[i]);}return b;}};`,
 `#include <vector>
using namespace std;
class Solution{void visit(vector<vector<char>>& g,int r,int c){if(r<0||r>=(int)g.size()||c<0||c>=(int)g[0].size()||g[r][c]!='1')return;g[r][c]='0';visit(g,r-1,c);visit(g,r+1,c);visit(g,r,c-1);visit(g,r,c+1);}public:int numIslands(vector<vector<char>>& grid){int n=0;for(int r=0;r<(int)grid.size();r++)for(int c=0;c<(int)grid[0].size();c++)if(grid[r][c]=='1'){n++;visit(grid,r,c);}return n;}};`,
 `#include <string>
#include <vector>
using namespace std;
class Solution{public:string minWindow(string s,string t){vector<int> need(128);for(char c:t)need[c]++;int missing=t.size(),l=0,start=0,len=s.size()+1;for(int r=0;r<(int)s.size();r++){if(need[s[r]]>0)missing--;need[s[r]]--;while(!missing){if(r-l+1<len){len=r-l+1;start=l;}if(++need[s[l++]]>0)missing++;}}return len>(int)s.size()?"":s.substr(start,len);}};`
 ],
 java:[
 `class Solution{public int maxArea(int[] height){int l=0,r=height.length-1,b=0;while(l<r){b=Math.max(b,(r-l)*Math.min(height[l],height[r]));if(height[l]<height[r])l++;else r--;}return b;}}`,
 `class Solution{public int lengthOfLIS(int[] nums){int[] dp=new int[nums.length];int b=1;for(int i=0;i<nums.length;i++){dp[i]=1;for(int j=0;j<i;j++)if(nums[j]<nums[i])dp[i]=Math.max(dp[i],dp[j]+1);b=Math.max(b,dp[i]);}return b;}}`,
 `class Solution{void visit(char[][] g,int r,int c){if(r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]!='1')return;g[r][c]='0';visit(g,r-1,c);visit(g,r+1,c);visit(g,r,c-1);visit(g,r,c+1);}public int numIslands(char[][] grid){int n=0;for(int r=0;r<grid.length;r++)for(int c=0;c<grid[0].length;c++)if(grid[r][c]=='1'){n++;visit(grid,r,c);}return n;}}`,
 `class Solution{public String minWindow(String s,String t){int[] need=new int[128];for(char c:t.toCharArray())need[c]++;int missing=t.length(),l=0,start=0,len=s.length()+1;for(int r=0;r<s.length();r++){if(need[s.charAt(r)]>0)missing--;need[s.charAt(r)]--;while(missing==0){if(r-l+1<len){len=r-l+1;start=l;}if(++need[s.charAt(l++)]>0)missing++;}}return len>s.length()?"":s.substring(start,start+len);}}`
 ],
 rust:[
 `struct Solution;impl Solution{pub fn max_area(height:Vec<i32>)->i32{let(mut l,mut r,mut b)=(0,height.len()-1,0);while l<r{b=b.max((r-l)as i32*height[l].min(height[r]));if height[l]<height[r]{l+=1;}else{r-=1;}}b}}`,
 `struct Solution;impl Solution{pub fn length_of_lis(nums:Vec<i32>)->i32{let mut dp=vec![1;nums.len()];let mut b=1;for i in 0..nums.len(){for j in 0..i{if nums[j]<nums[i]{dp[i]=dp[i].max(dp[j]+1);}}b=b.max(dp[i]);}b}}`,
 `struct Solution;impl Solution{pub fn num_islands(mut grid:Vec<Vec<char>>)->i32{fn visit(g:&mut Vec<Vec<char>>,r:i32,c:i32){if r<0||c<0||r as usize>=g.len()||c as usize>=g[0].len()||g[r as usize][c as usize]!='1'{return;}g[r as usize][c as usize]='0';visit(g,r-1,c);visit(g,r+1,c);visit(g,r,c-1);visit(g,r,c+1);}let mut n=0;for r in 0..grid.len(){for c in 0..grid[0].len(){if grid[r][c]=='1'{n+=1;visit(&mut grid,r as i32,c as i32);}}}n}}`,
 `struct Solution;impl Solution{pub fn min_window(s:String,t:String)->String{let bytes=s.as_bytes();let mut need=[0i32;128];for c in t.bytes(){need[c as usize]+=1;}let(mut missing,mut l,mut start,mut len)=(t.len()as i32,0,0,s.len()+1);for r in 0..bytes.len(){let c=bytes[r]as usize;if need[c]>0{missing-=1;}need[c]-=1;while missing==0{if r-l+1<len{len=r-l+1;start=l;}let c=bytes[l]as usize;need[c]+=1;if need[c]>0{missing+=1;}l+=1;}}if len>s.len(){String::new()}else{s[start..start+len].to_string()}}}`
 ],
 go:[
 `package main
func maxArea(height []int) int{l,r,b:=0,len(height)-1,0;for l<r{h:=height[l];if height[r]<h{h=height[r]};a:=(r-l)*h;if a>b{b=a};if height[l]<height[r]{l++}else{r--}};return b}`,
 `package main
func lengthOfLIS(nums []int) int{dp:=make([]int,len(nums));b:=1;for i:=range nums{dp[i]=1;for j:=0;j<i;j++{if nums[j]<nums[i]&&dp[j]+1>dp[i]{dp[i]=dp[j]+1}};if dp[i]>b{b=dp[i]}};return b}`,
 `package main
func numIslands(grid [][]byte) int{var visit func(int,int);visit=func(r,c int){if r<0||r>=len(grid)||c<0||c>=len(grid[0])||grid[r][c]!='1'{return};grid[r][c]='0';visit(r-1,c);visit(r+1,c);visit(r,c-1);visit(r,c+1)};n:=0;for r:=range grid{for c:=range grid[r]{if grid[r][c]=='1'{n++;visit(r,c)}}};return n}`,
 `package main
func minWindow(s string,t string) string{need:=[128]int{};for i:=range t{need[t[i]]++};missing,l,start,length:=len(t),0,0,len(s)+1;for r:=range s{if need[s[r]]>0{missing--};need[s[r]]--;for missing==0{if r-l+1<length{length=r-l+1;start=l};need[s[l]]++;if need[s[l]]>0{missing++};l++}};if length>len(s){return ""};return s[start:start+length]}`
 ],
 python:[
 `class Solution:
    def maxArea(self, height: list[int]) -> int:
        l, r, best = 0, len(height) - 1, 0
        while l < r:
            best = max(best, (r - l) * min(height[l], height[r]))
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best
`,
 `class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        dp = [1] * len(nums)
        for i in range(len(nums)):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)
`,
 `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        rows, cols, count = len(grid), len(grid[0]), 0
        def visit(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            visit(r - 1, c)
            visit(r + 1, c)
            visit(r, c - 1)
            visit(r, c + 1)
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    visit(r, c)
        return count
`,
 `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        from collections import Counter
        need = Counter(t)
        missing, left, start, length = len(t), 0, 0, len(s) + 1
        for right, char in enumerate(s):
            if need[char] > 0:
                missing -= 1
            need[char] -= 1
            while missing == 0:
                if right - left + 1 < length:
                    start, length = left, right - left + 1
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
                left += 1
        return '' if length > len(s) else s[start:start + length]
`
 ]
};
