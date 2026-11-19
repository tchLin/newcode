import {runStructures,isStructureFunction} from './structure-runtime.mjs';
// A disposable worker keeps a user's synchronous code off the UI thread.
// Each run is terminated by the main page after two seconds.
export function executeJavaScript(data) {
  try {
    const {code,fn,tests,mutates}=data;
    if(isStructureFunction(fn))return runStructures(data);
    if(!['twoSum','containsDuplicate','isValid','maxProfit','isAnagram','climbStairs','maxArea','lengthOfLIS','numIslands','minWindow','canFinish','eraseOverlapIntervals','findMin','coinChange','hammingWeight','exist','lengthOfLongestSubstring','rob','canJump','maxProduct','maxSubArray','search','missingNumber','getSum','reverseBits','longestCommonSubsequence','combinationSum4','numDecodings','uniquePaths','longestConsecutive','validTree','countComponents','canAttendMeetings','minMeetingRooms','isPalindrome','longestPalindrome','countSubstrings','characterReplacement','wordBreak','productExceptSelf','countBits','spiralOrder','topKFrequent','merge','insert','setZeroes','rotate','threeSum','pacificAtlantic'].includes(fn))throw new Error('Unknown exercise.');
    const solution=new Function(`${code}\n;return typeof ${fn} === 'function' ? ${fn} : null;`)();
    if(!solution)throw new Error(`Define a function named ${fn}.`);
    const results=tests.map(args=>{
      try {
        const input=structuredClone(args);
        const returned=solution(...input);
        const value=Number.isInteger(mutates)?input[mutates]:returned;
        // Keep returned booleans, numbers, strings, and index arrays bounded
        // and serializable for the supported exercises.
        if(typeof value==='string'&&value.length<=50000)return {value};
        if(typeof value==='boolean'||value===undefined||value===null||typeof value==='number')return {value};
        if(Array.isArray(value)&&value.length<=10000&&value.every(x=>Number.isInteger(x)||Array.isArray(x)&&x.length<=10000&&x.every(Number.isInteger))&&JSON.stringify(value).length<=50000)return {value};
        return {error:'Return a boolean, a number, a string, or an integer array/matrix, as the problem requires.'};
      }catch(error){return {error:String(error.message||error).slice(0,500)};}
    });
    return {results};
  }catch(error){return {error:String(error.message||error).slice(0,500)};}
};
