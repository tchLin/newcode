export const patternSolutions={
 javascript:[
 `function exist(board,word){const rows=board.length,cols=board[0].length;function dfs(y,x,k){if(y<0||x<0||y>=rows||x>=cols||board[y][x]!==word[k])return false;if(k===word.length-1)return true;const c=board[y][x];board[y][x]='#';const found=dfs(y-1,x,k+1)||dfs(y+1,x,k+1)||dfs(y,x-1,k+1)||dfs(y,x+1,k+1);board[y][x]=c;return found;}for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(dfs(y,x,0))return true;return false;}`,
 `function lengthOfLongestSubstring(s){const seen=new Set();let l=0,best=0;for(let r=0;r<s.length;r++){while(seen.has(s[r]))seen.delete(s[l++]);seen.add(s[r]);best=Math.max(best,r-l+1);}return best;}`,
 `function rob(nums){let a=0,b=0;for(const n of nums)[a,b]=[b,Math.max(b,a+n)];return b;}`,
 `function canJump(nums){let far=0;for(let i=0;i<nums.length;i++){if(i>far)return false;far=Math.max(far,i+nums[i]);if(far>=nums.length-1)return true;}return true;}`,
 `function maxProduct(nums){let lo=nums[0],hi=lo,best=lo;for(const n of nums.slice(1)){const a=n*lo,b=n*hi;lo=Math.min(n,a,b);hi=Math.max(n,a,b);best=Math.max(best,hi);}return best;}`
 ],
 c:[
 `#include <stdbool.h>
bool visit(char** b,int rows,int cols,char* w,int y,int x,int k){if(y<0||x<0||y>=rows||x>=cols||b[y][x]!=w[k])return false;if(w[k+1]==0)return true;char c=b[y][x];b[y][x]='#';bool found=visit(b,rows,cols,w,y-1,x,k+1)||visit(b,rows,cols,w,y+1,x,k+1)||visit(b,rows,cols,w,y,x-1,k+1)||visit(b,rows,cols,w,y,x+1,k+1);b[y][x]=c;return found;}
bool exist(char** board,int boardSize,int* boardColSize,char* word){for(int y=0;y<boardSize;y++)for(int x=0;x<boardColSize[y];x++)if(visit(board,boardSize,boardColSize[0],word,y,x,0))return true;return false;}`,
 `int lengthOfLongestSubstring(char* s){int last[128];for(int i=0;i<128;i++)last[i]=-1;int l=0,best=0;for(int r=0;s[r];r++){int c=(unsigned char)s[r];if(last[c]>=l)l=last[c]+1;last[c]=r;if(r-l+1>best)best=r-l+1;}return best;}`,
 `int rob(int* nums,int numsSize){int a=0,b=0;for(int i=0;i<numsSize;i++){int next=b>a+nums[i]?b:a+nums[i];a=b;b=next;}return b;}`,
 `#include <stdbool.h>
bool canJump(int* nums,int numsSize){int far=0;for(int i=0;i<numsSize;i++){if(i>far)return false;if(i+nums[i]>far)far=i+nums[i];if(far>=numsSize-1)return true;}return true;}`,
 `int maxProduct(int* nums,int numsSize){int lo=nums[0],hi=lo,best=lo;for(int i=1;i<numsSize;i++){int n=nums[i],a=n*lo,b=n*hi;lo=n<a?n:a;lo=lo<b?lo:b;hi=n>a?n:a;hi=hi>b?hi:b;if(hi>best)best=hi;}return best;}`
 ],
 cpp:[
 `#include <vector>
#include <string>
using namespace std;class Solution{bool dfs(vector<vector<char>>& b,const string& w,int y,int x,int k){if(y<0||x<0||y>=b.size()||x>=b[0].size()||b[y][x]!=w[k])return false;if(k+1==w.size())return true;char c=b[y][x];b[y][x]='#';bool found=dfs(b,w,y-1,x,k+1)||dfs(b,w,y+1,x,k+1)||dfs(b,w,y,x-1,k+1)||dfs(b,w,y,x+1,k+1);b[y][x]=c;return found;}public:bool exist(vector<vector<char>>& b,string w){for(int y=0;y<b.size();y++)for(int x=0;x<b[0].size();x++)if(dfs(b,w,y,x,0))return true;return false;}};`,
 `#include <string>
#include <algorithm>
using namespace std;class Solution{public:int lengthOfLongestSubstring(string s){int last[128];fill(last,last+128,-1);int l=0,best=0;for(int r=0;r<s.size();r++){unsigned char c=s[r];l=max(l,last[c]+1);last[c]=r;best=max(best,r-l+1);}return best;}};`,
 `#include <vector>
#include <algorithm>
using namespace std;class Solution{public:int rob(vector<int>& nums){int a=0,b=0;for(int n:nums){int next=max(b,a+n);a=b;b=next;}return b;}};`,
 `#include <vector>
#include <algorithm>
using namespace std;class Solution{public:bool canJump(vector<int>& nums){int far=0;for(int i=0;i<nums.size();i++){if(i>far)return false;far=max(far,i+nums[i]);if(far>=nums.size()-1)return true;}return true;}};`,
 `#include <vector>
#include <algorithm>
using namespace std;class Solution{public:int maxProduct(vector<int>& nums){int lo=nums[0],hi=lo,best=lo;for(int i=1;i<nums.size();i++){int n=nums[i],a=n*lo,b=n*hi;lo=min({n,a,b});hi=max({n,a,b});best=max(best,hi);}return best;}};`
 ],
 java:[
 `class Solution{boolean dfs(char[][] b,String w,int y,int x,int k){if(y<0||x<0||y>=b.length||x>=b[0].length||b[y][x]!=w.charAt(k))return false;if(k+1==w.length())return true;char c=b[y][x];b[y][x]='#';boolean found=dfs(b,w,y-1,x,k+1)||dfs(b,w,y+1,x,k+1)||dfs(b,w,y,x-1,k+1)||dfs(b,w,y,x+1,k+1);b[y][x]=c;return found;}public boolean exist(char[][] board,String word){for(int y=0;y<board.length;y++)for(int x=0;x<board[0].length;x++)if(dfs(board,word,y,x,0))return true;return false;}}`,
 `import java.util.*;class Solution{public int lengthOfLongestSubstring(String s){int[] last=new int[128];Arrays.fill(last,-1);int l=0,best=0;for(int r=0;r<s.length();r++){char c=s.charAt(r);l=Math.max(l,last[c]+1);last[c]=r;best=Math.max(best,r-l+1);}return best;}}`,
 `class Solution{public int rob(int[] nums){int a=0,b=0;for(int n:nums){int next=Math.max(b,a+n);a=b;b=next;}return b;}}`,
 `class Solution{public boolean canJump(int[] nums){int far=0;for(int i=0;i<nums.length;i++){if(i>far)return false;far=Math.max(far,i+nums[i]);if(far>=nums.length-1)return true;}return true;}}`,
 `class Solution{public int maxProduct(int[] nums){int lo=nums[0],hi=lo,best=lo;for(int i=1;i<nums.length;i++){int n=nums[i],a=n*lo,b=n*hi;lo=Math.min(n,Math.min(a,b));hi=Math.max(n,Math.max(a,b));best=Math.max(best,hi);}return best;}}`
 ],
 rust:[
 `struct Solution;impl Solution{pub fn exist(mut board:Vec<Vec<char>>,word:String)->bool{fn dfs(b:&mut Vec<Vec<char>>,w:&[char],y:i32,x:i32,k:usize)->bool{if y<0||x<0||y as usize>=b.len()||x as usize>=b[0].len()||b[y as usize][x as usize]!=w[k]{return false;}if k+1==w.len(){return true;}let c=b[y as usize][x as usize];b[y as usize][x as usize]='#';let found=dfs(b,w,y-1,x,k+1)||dfs(b,w,y+1,x,k+1)||dfs(b,w,y,x-1,k+1)||dfs(b,w,y,x+1,k+1);b[y as usize][x as usize]=c;found}let w:Vec<char>=word.chars().collect();for y in 0..board.len(){for x in 0..board[0].len(){if dfs(&mut board,&w,y as i32,x as i32,0){return true;}}}false}}`,
 `struct Solution;impl Solution{pub fn length_of_longest_substring(s:String)->i32{let mut last=[-1;128];let mut l=0;let mut best=0;for(r,c)in s.bytes().enumerate(){let r=r as i32;l=l.max(last[c as usize]+1);last[c as usize]=r;best=best.max(r-l+1);}best}}`,
 `struct Solution;impl Solution{pub fn rob(nums:Vec<i32>)->i32{let(mut a,mut b)=(0,0);for n in nums{let next=b.max(a+n);a=b;b=next;}b}}`,
 `struct Solution;impl Solution{pub fn can_jump(nums:Vec<i32>)->bool{let mut far=0;for(i,&n)in nums.iter().enumerate(){if i>far{return false;}far=far.max(i+n as usize);if far>=nums.len()-1{return true;}}true}}`,
 `struct Solution;impl Solution{pub fn max_product(nums:Vec<i32>)->i32{let(mut lo,mut hi,mut best)=(nums[0],nums[0],nums[0]);for &n in &nums[1..]{let(a,b)=(n*lo,n*hi);lo=n.min(a).min(b);hi=n.max(a).max(b);best=best.max(hi);}best}}`
 ],
 go:[
 `package main
func exist(board [][]byte,word string)bool{var dfs func(int,int,int)bool;dfs=func(y,x,k int)bool{if y<0||x<0||y>=len(board)||x>=len(board[0])||board[y][x]!=word[k]{return false};if k+1==len(word){return true};c:=board[y][x];board[y][x]='#';found:=dfs(y-1,x,k+1)||dfs(y+1,x,k+1)||dfs(y,x-1,k+1)||dfs(y,x+1,k+1);board[y][x]=c;return found};for y:=range board{for x:=range board[y]{if dfs(y,x,0){return true}}};return false}`,
 `package main
func lengthOfLongestSubstring(s string)int{last:=[128]int{};for i:=range last{last[i]=-1};l,best:=0,0;for r:=0;r<len(s);r++{c:=s[r];if last[c]>=l{l=last[c]+1};last[c]=r;if r-l+1>best{best=r-l+1}};return best}`,
 `package main
func rob(nums []int)int{a,b:=0,0;for _,n:=range nums{next:=b;if a+n>next{next=a+n};a,b=b,next};return b}`,
 `package main
func canJump(nums []int)bool{far:=0;for i,n:=range nums{if i>far{return false};if i+n>far{far=i+n};if far>=len(nums)-1{return true}};return true}`,
 `package main
func maxProduct(nums []int)int{lo,hi,best:=nums[0],nums[0],nums[0];for _,n:=range nums[1:]{a,b:=n*lo,n*hi;lo,hi=n,n;if a<lo{lo=a};if b<lo{lo=b};if a>hi{hi=a};if b>hi{hi=b};if hi>best{best=hi}};return best}`
 ],
 python:[
 `class Solution:
    def exist(self,board,word):
        def dfs(y,x,k):
            if y<0 or x<0 or y>=len(board) or x>=len(board[0]) or board[y][x]!=word[k]: return False
            if k+1==len(word): return True
            c=board[y][x]
            board[y][x]='#'
            found=dfs(y-1,x,k+1) or dfs(y+1,x,k+1) or dfs(y,x-1,k+1) or dfs(y,x+1,k+1)
            board[y][x]=c
            return found
        return any(dfs(y,x,0) for y in range(len(board)) for x in range(len(board[0])))`,
 `class Solution:
    def lengthOfLongestSubstring(self,s):
        seen=set()
        left=best=0
        for right,c in enumerate(s):
            while c in seen:
                seen.remove(s[left])
                left+=1
            seen.add(c)
            best=max(best,right-left+1)
        return best`,
 `class Solution:
    def rob(self,nums):
        a=b=0
        for n in nums: a,b=b,max(b,a+n)
        return b`,
 `class Solution:
    def canJump(self,nums):
        far=0
        for i,n in enumerate(nums):
            if i>far: return False
            far=max(far,i+n)
            if far>=len(nums)-1: return True
        return True`,
 `class Solution:
    def maxProduct(self,nums):
        lo=hi=best=nums[0]
        for n in nums[1:]:
            a,b=n*lo,n*hi
            lo,hi=min(n,a,b),max(n,a,b)
            best=max(best,hi)
        return best`
 ]
};
