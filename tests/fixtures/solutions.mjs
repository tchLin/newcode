import {advancedSolutions} from './advanced-solutions.mjs';
// Reference answers exercise the integration; these are not shipped to visitors.
export const solutions={
 javascript:[
  'function twoSum(nums,target){const seen=new Map();for(let i=0;i<nums.length;i++){if(seen.has(target-nums[i]))return [seen.get(target-nums[i]),i];seen.set(nums[i],i);}}',
  'function containsDuplicate(nums){return new Set(nums).size!==nums.length;}',
  "function isValid(s){const stack=[],pairs={')':'(',']':'[','}':'{'};for(const c of s){if('([{'.includes(c))stack.push(c);else if(stack.pop()!==pairs[c])return false;}return stack.length===0;}"
 ],
 c:[
  '#include <stdlib.h>\nint* twoSum(int* nums,int numsSize,int target,int* returnSize){for(int i=0;i<numsSize;i++)for(int j=i+1;j<numsSize;j++)if(nums[i]+nums[j]==target){int* out=malloc(2*sizeof(int));out[0]=i;out[1]=j;*returnSize=2;return out;}*returnSize=0;return NULL;}',
  '#include <stdbool.h>\nbool containsDuplicate(int* nums,int numsSize){for(int i=0;i<numsSize;i++)for(int j=i+1;j<numsSize;j++)if(nums[i]==nums[j])return true;return false;}',
  '#include <stdbool.h>\n#include <stdlib.h>\n#include <string.h>\nbool isValid(char* s){char* stack=malloc(strlen(s)+1);int n=0;bool valid=true;for(int i=0;s[i];i++){char c=s[i];if(c==\'(\'||c==\'[\'||c==\'{\')stack[n++]=c;else {char wanted=c==\')\'?\'(\':c==\']\'?\'[\':\'{\';if(n==0||stack[--n]!=wanted){valid=false;break;}}}valid=valid&&n==0;free(stack);return valid;}'
 ],
 cpp:[
  '#include <vector>\n#include <unordered_map>\nusing namespace std;\nclass Solution{public:vector<int> twoSum(vector<int>& nums,int target){unordered_map<int,int> seen;for(int i=0;i<(int)nums.size();i++){auto p=seen.find(target-nums[i]);if(p!=seen.end())return {p->second,i};seen[nums[i]]=i;}return {};}};',
  '#include <vector>\n#include <unordered_set>\nusing namespace std;\nclass Solution{public:bool containsDuplicate(vector<int>& nums){unordered_set<int> seen;for(int n:nums)if(!seen.insert(n).second)return true;return false;}};',
  '#include <string>\n#include <vector>\nusing namespace std;\nclass Solution{public:bool isValid(string s){vector<char> stack;for(char c:s){if(c==\'(\'||c==\'[\'||c==\'{\')stack.push_back(c);else{char want=c==\')\'?\'(\':c==\']\'?\'[\':\'{\';if(stack.empty()||stack.back()!=want)return false;stack.pop_back();}}return stack.empty();}};'
 ],
 java:[
  'import java.util.*;\nclass Solution{public int[] twoSum(int[] nums,int target){Map<Integer,Integer> seen=new HashMap<>();for(int i=0;i<nums.length;i++){if(seen.containsKey(target-nums[i]))return new int[]{seen.get(target-nums[i]),i};seen.put(nums[i],i);}return new int[0];}}',
  'import java.util.*;\nclass Solution{public boolean containsDuplicate(int[] nums){Set<Integer> seen=new HashSet<>();for(int n:nums)if(!seen.add(n))return true;return false;}}',
  "import java.util.*;\nclass Solution{public boolean isValid(String s){Deque<Character> stack=new ArrayDeque<>();for(char c:s.toCharArray()){if(c=='('||c=='['||c=='{')stack.push(c);else{char want=c==')'?'(':c==']'?'[':'{';if(stack.isEmpty()||stack.pop()!=want)return false;}}return stack.isEmpty();}}"
 ],
 rust:[
  'use std::collections::HashMap;\nstruct Solution;\nimpl Solution{pub fn two_sum(nums:Vec<i32>,target:i32)->Vec<i32>{let mut seen=HashMap::new();for (i,&n) in nums.iter().enumerate(){if let Some(&j)=seen.get(&(target-n)){return vec![j,i as i32];}seen.insert(n,i as i32);}vec![]}}',
  'use std::collections::HashSet;\nstruct Solution;\nimpl Solution{pub fn contains_duplicate(nums:Vec<i32>)->bool{let mut seen=HashSet::new();for n in nums{if !seen.insert(n){return true;}}false}}',
  "struct Solution;\nimpl Solution{pub fn is_valid(s:String)->bool{let mut stack=Vec::new();for c in s.chars(){match c{'('| '[' | '{'=>stack.push(c),_=>{let want=match c{')'=>'(',']'=>'[',_=>'{'};if stack.pop()!=Some(want){return false;}}}}stack.is_empty()}}"
 ],
 go:[
  'package main\nfunc twoSum(nums []int,target int) []int{seen:=map[int]int{};for i,n:=range nums{if j,ok:=seen[target-n];ok{return []int{j,i}};seen[n]=i};return nil}',
  'package main\nfunc containsDuplicate(nums []int) bool{seen:=map[int]bool{};for _,n:=range nums{if seen[n]{return true};seen[n]=true};return false}',
  "package main\nfunc isValid(s string) bool{stack:=[]byte{};for i:=0;i<len(s);i++{c:=s[i];if c=='('||c=='['||c=='{'{stack=append(stack,c)}else{want:=byte('{');if c==')'{want='('};if c==']'{want='['};if len(stack)==0||stack[len(stack)-1]!=want{return false};stack=stack[:len(stack)-1]}};return len(stack)==0}"
 ],
 python:[
  'class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i\n        return []\n',
  'class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        return len(set(nums)) != len(nums)\n',
  "class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {')': '(', ']': '[', '}': '{'}\n        for c in s:\n            if c in '([{':\n                stack.append(c)\n            elif not stack or stack.pop() != pairs[c]:\n                return False\n        return not stack\n"
 ]
};

const moreSolutions={
  "javascript": [
    "function maxProfit(prices){let low=prices[0],best=0;for(const p of prices){best=Math.max(best,p-low);low=Math.min(low,p);}return best;}",
    "function isAnagram(s,t){if(s.length!==t.length)return false;const c=Array(26).fill(0);for(const x of s)c[x.charCodeAt(0)-97]++;for(const x of t)if(--c[x.charCodeAt(0)-97]<0)return false;return true;}",
    "function climbStairs(n){let a=1,b=1;for(let i=2;i<=n;i++){[a,b]=[b,a+b];}return b;}"
  ],
  "c": [
    "int maxProfit(int* prices,int pricesSize){int low=prices[0],best=0;for(int i=1;i<pricesSize;i++){if(prices[i]-low>best)best=prices[i]-low;if(prices[i]<low)low=prices[i];}return best;}",
    "#include <stdbool.h>\n#include <string.h>\nbool isAnagram(char* s,char* t){if(strlen(s)!=strlen(t))return false;int c[26]={0};for(int i=0;s[i];i++)c[s[i]-97]++;for(int i=0;t[i];i++)if(--c[t[i]-97]<0)return false;return true;}",
    "int climbStairs(int n){int a=1,b=1;for(int i=2;i<=n;i++){int v=a+b;a=b;b=v;}return b;}"
  ],
  "cpp": [
    "#include <vector>\n#include <algorithm>\nusing namespace std;\nclass Solution{public:int maxProfit(vector<int>& prices){int low=prices[0],best=0;for(int p:prices){best=max(best,p-low);low=min(low,p);}return best;}};",
    "#include <string>\nusing namespace std;\nclass Solution{public:bool isAnagram(string s,string t){if(s.size()!=t.size())return false;int c[26]={0};for(char x:s)c[x-97]++;for(char x:t)if(--c[x-97]<0)return false;return true;}};",
    "class Solution{public:int climbStairs(int n){int a=1,b=1;for(int i=2;i<=n;i++){int v=a+b;a=b;b=v;}return b;}};"
  ],
  "java": [
    "class Solution{public int maxProfit(int[] prices){int low=prices[0],best=0;for(int p:prices){best=Math.max(best,p-low);low=Math.min(low,p);}return best;}}",
    "class Solution{public boolean isAnagram(String s,String t){if(s.length()!=t.length())return false;int[] c=new int[26];for(char x:s.toCharArray())c[x-97]++;for(char x:t.toCharArray())if(--c[x-97]<0)return false;return true;}}",
    "class Solution{public int climbStairs(int n){int a=1,b=1;for(int i=2;i<=n;i++){int v=a+b;a=b;b=v;}return b;}}"
  ],
  "rust": [
    "struct Solution;\nimpl Solution{pub fn max_profit(prices:Vec<i32>)->i32{let mut low=prices[0];let mut best=0;for p in prices{best=best.max(p-low);low=low.min(p);}best}}",
    "struct Solution;\nimpl Solution{pub fn is_anagram(s:String,t:String)->bool{if s.len()!=t.len(){return false;}let mut c=[0i32;26];for x in s.bytes(){c[(x-97) as usize]+=1;}for x in t.bytes(){let i=(x-97) as usize;c[i]-=1;if c[i]<0{return false;}}true}}",
    "struct Solution;\nimpl Solution{pub fn climb_stairs(n:i32)->i32{let mut a=1;let mut b=1;for _ in 2..=n{let v=a+b;a=b;b=v;}b}}"
  ],
  "go": [
    "package main\nfunc maxProfit(prices []int) int{low,best:=prices[0],0;for _,p:=range prices{if p-low>best{best=p-low};if p<low{low=p}};return best}",
    "package main\nfunc isAnagram(s string,t string) bool{if len(s)!=len(t){return false};c:=[26]int{};for _,x:=range s{c[x-97]++};for _,x:=range t{c[x-97]--;if c[x-97]<0{return false}};return true}",
    "package main\nfunc climbStairs(n int) int{a,b:=1,1;for i:=2;i<=n;i++{a,b=b,a+b};return b}"
  ],
  "python": [
    "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        low, best = prices[0], 0\n        for p in prices:\n            best = max(best, p - low)\n            low = min(low, p)\n        return best\n",
    "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        return sorted(s) == sorted(t)\n",
    "class Solution:\n    def climbStairs(self, n: int) -> int:\n        a, b = 1, 1\n        for i in range(2, n + 1):\n            a, b = b, a + b\n        return b\n"
  ]
};
for(const id of Object.keys(solutions))solutions[id].push(...moreSolutions[id]);

for(const id of Object.keys(solutions))solutions[id].push(...advancedSolutions[id]);

import {strategySolutions} from './strategy-solutions.mjs';
for(const language of Object.keys(solutions))solutions[language].push(...strategySolutions[language]);

import {patternSolutions} from './pattern-solutions.mjs';
for(const language of Object.keys(solutions))solutions[language].push(...patternSolutions[language]);

import {expansionSolutions} from './expansion-solutions.mjs';
for(const language of Object.keys(solutions))solutions[language].push(...expansionSolutions[language]);

import {structureSolutions} from './structure-solutions.mjs';
for(const language of Object.keys(solutions))solutions[language].push(...structureSolutions[language]);
