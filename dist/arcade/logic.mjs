import {structureGames} from './structure-catalog.mjs';
import {newStructureRound} from './structure-traces.mjs';
import {acceptsStructure} from './structure-validation.mjs';
import {expansionGames} from './expansion-catalog.mjs';
import {newExpansionRound,moveExpansion} from './expansion-traces.mjs';
import {patternGames,newPatternRound,movePattern} from './pattern-games.mjs';
import {strategyGames,newStrategyRound,moveStrategy} from './strategy-games.mjs';
import {advancedGames,newAdvancedRound,moveAdvanced} from './advanced-games.mjs';
import {moreGames,newMoreRound,moveMore} from './more-games.mjs';
export const categories = [
  ['Array', '▤', 10], ['Binary', '01', 5], ['Dynamic Programming', '↗', 11], ['Graph', '⌘', 8], ['Interval', '↔', 5], ['Linked List', '⛓', 6], ['Matrix', '▦', 4], ['String', 'Aa', 10], ['Tree', '⑂', 14], ['Heap', '△', 3]
];
export const games = [
  {id:'two-sum', number:1, problem:'Two Sum', category:'Array', tag:'HASH MAPS', color:'peach', time:'5–8 min', description:'Two numbers. One target. Find the connection.', concept:'Remember what you’ve seen', fn:'twoSum', params:'nums, target', rounds:[{values:[2,11,7,15],target:9},{values:[3,2,4],target:6}], lesson:'You saved each number with its index. For each new number, you looked for target − number in your memory. A Map does exactly that in code: look up the complement before storing the current number. This gives O(n) time and O(n) extra space.', prompt:'Return the indices of two different elements whose sum equals target. Each input has exactly one solution. You may return the indices in either order.', hint:'Create a Map. For each index i, check whether the Map has target - nums[i]. If it does, return the stored index and i. Otherwise, store nums[i] → i.', tests:[{args:[[2,7,11,15],9]},{args:[[3,2,4],6]},{args:[[3,3],6]},{args:[[-3,4,3,90],0]},{args:[[0,4,3,0],0]}]},
  {id:'duplicate', number:217, problem:'Contains Duplicate', category:'Array', tag:'SETS', color:'lavender', time:'4–6 min', description:'Keep your eyes open. Have you seen this one before?', concept:'Keep a collection of unique values', fn:'containsDuplicate', params:'nums', rounds:[{values:[4,2,8,2]},{values:[1,5,9]}], lesson:'You kept a collection of values you had already seen. A Set is that collection in code. Check membership before adding each number; finding an existing number means there is a duplicate. This takes O(n) time and O(n) extra space.', prompt:'Return true if any number appears more than once in nums; otherwise return false.', hint:'Create a Set. Walk through nums: if the Set has the number, return true; otherwise add it. Return false after the loop.', tests:[{args:[[1,2,3,1]],expected:true},{args:[[1,2,3,4]],expected:false},{args:[[]],expected:false},{args:[[0,0]],expected:true},{args:[[-1,2,-1]],expected:true}]},
  {id:'brackets', number:20, problem:'Valid Parentheses', category:'String', tag:'STACKS', color:'mint', time:'5–8 min', description:'Open, stack, and match. Everything in its place.', concept:'Last in, first out', fn:'isValid', params:'s', rounds:[{values:['(','[',']',')']},{values:['(','[',')',']']}], lesson:'You put opening brackets on a stack and matched each closing bracket against the most recent opening. In code, an array with push() and pop() is your stack. Reject a mismatch and check that the stack is empty at the end. This takes O(n) time and O(n) extra space.', prompt:'Return true when every opening bracket in s is closed in the correct order by the same type of bracket. The string contains only ( ) [ ] { }.', hint:'Push opening brackets. For a closing bracket, pop the stack and compare with its matching opener. Return false for a mismatch. At the end, return stack.length === 0.', tests:[{args:['()[]{}'],expected:true},{args:['([{}])'],expected:true},{args:['(]'],expected:false},{args:['([)]'],expected:false},{args:['('],expected:false},{args:[']'],expected:false},{args:[''],expected:true}]}
];
games.push(...moreGames,...advancedGames,...strategyGames,...patternGames,...expansionGames,...structureGames);
// Official titles and frontend problem numbers from https://leetcode.com/api/problems/all/.
export const roadmap = {
  "Array": [
    {
      "number": 121,
      "problem": "Best Time to Buy and Sell Stock"
    },
    {
      "number": 238,
      "problem": "Product of Array Except Self"
    },
    {
      "number": 53,
      "problem": "Maximum Subarray"
    },
    {
      "number": 152,
      "problem": "Maximum Product Subarray"
    },
    {
      "number": 153,
      "problem": "Find Minimum in Rotated Sorted Array"
    },
    {
      "number": 33,
      "problem": "Search in Rotated Sorted Array"
    },
    {
      "number": 15,
      "problem": "3Sum"
    },
    {
      "number": 11,
      "problem": "Container With Most Water"
    }
  ],
  "Binary": [
    {
      "number": 371,
      "problem": "Sum of Two Integers"
    },
    {
      "number": 191,
      "problem": "Number of 1 Bits"
    },
    {
      "number": 338,
      "problem": "Counting Bits"
    },
    {
      "number": 268,
      "problem": "Missing Number"
    },
    {
      "number": 190,
      "problem": "Reverse Bits"
    }
  ],
  "Dynamic Programming": [
    {
      "number": 70,
      "problem": "Climbing Stairs"
    },
    {
      "number": 322,
      "problem": "Coin Change"
    },
    {
      "number": 300,
      "problem": "Longest Increasing Subsequence"
    },
    {
      "number": 1143,
      "problem": "Longest Common Subsequence"
    },
    {
      "number": 139,
      "problem": "Word Break"
    },
    {
      "number": 377,
      "problem": "Combination Sum IV"
    },
    {
      "number": 198,
      "problem": "House Robber"
    },
    {
      "number": 213,
      "problem": "House Robber II"
    },
    {
      "number": 91,
      "problem": "Decode Ways"
    },
    {
      "number": 62,
      "problem": "Unique Paths"
    },
    {
      "number": 55,
      "problem": "Jump Game"
    }
  ],
  "Graph": [
    {
      "number": 133,
      "problem": "Clone Graph"
    },
    {
      "number": 207,
      "problem": "Course Schedule"
    },
    {
      "number": 417,
      "problem": "Pacific Atlantic Water Flow"
    },
    {
      "number": 200,
      "problem": "Number of Islands"
    },
    {
      "number": 128,
      "problem": "Longest Consecutive Sequence"
    },
    {
      "number": 269,
      "problem": "Alien Dictionary"
    },
    {
      "number": 261,
      "problem": "Graph Valid Tree"
    },
    {
      "number": 323,
      "problem": "Number of Connected Components in an Undirected Graph"
    }
  ],
  "Interval": [
    {
      "number": 57,
      "problem": "Insert Interval"
    },
    {
      "number": 56,
      "problem": "Merge Intervals"
    },
    {
      "number": 435,
      "problem": "Non-overlapping Intervals"
    },
    {
      "number": 252,
      "problem": "Meeting Rooms"
    },
    {
      "number": 253,
      "problem": "Meeting Rooms II"
    }
  ],
  "Linked List": [
    {
      "number": 206,
      "problem": "Reverse Linked List"
    },
    {
      "number": 141,
      "problem": "Linked List Cycle"
    },
    {
      "number": 21,
      "problem": "Merge Two Sorted Lists"
    },
    {
      "number": 23,
      "problem": "Merge k Sorted Lists"
    },
    {
      "number": 19,
      "problem": "Remove Nth Node From End of List"
    },
    {
      "number": 143,
      "problem": "Reorder List"
    }
  ],
  "Matrix": [
    {
      "number": 73,
      "problem": "Set Matrix Zeroes"
    },
    {
      "number": 54,
      "problem": "Spiral Matrix"
    },
    {
      "number": 48,
      "problem": "Rotate Image"
    },
    {
      "number": 79,
      "problem": "Word Search"
    }
  ],
  "String": [
    {
      "number": 3,
      "problem": "Longest Substring Without Repeating Characters"
    },
    {
      "number": 424,
      "problem": "Longest Repeating Character Replacement"
    },
    {
      "number": 76,
      "problem": "Minimum Window Substring"
    },
    {
      "number": 242,
      "problem": "Valid Anagram"
    },
    {
      "number": 49,
      "problem": "Group Anagrams"
    },
    {
      "number": 125,
      "problem": "Valid Palindrome"
    },
    {
      "number": 5,
      "problem": "Longest Palindromic Substring"
    },
    {
      "number": 647,
      "problem": "Palindromic Substrings"
    },
    {
      "number": 271,
      "problem": "Encode and Decode Strings"
    }
  ],
  "Tree": [
    {
      "number": 104,
      "problem": "Maximum Depth of Binary Tree"
    },
    {
      "number": 100,
      "problem": "Same Tree"
    },
    {
      "number": 226,
      "problem": "Invert Binary Tree"
    },
    {
      "number": 124,
      "problem": "Binary Tree Maximum Path Sum"
    },
    {
      "number": 102,
      "problem": "Binary Tree Level Order Traversal"
    },
    {
      "number": 297,
      "problem": "Serialize and Deserialize Binary Tree"
    },
    {
      "number": 572,
      "problem": "Subtree of Another Tree"
    },
    {
      "number": 105,
      "problem": "Construct Binary Tree from Preorder and Inorder Traversal"
    },
    {
      "number": 98,
      "problem": "Validate Binary Search Tree"
    },
    {
      "number": 230,
      "problem": "Kth Smallest Element in a BST"
    },
    {
      "number": 235,
      "problem": "Lowest Common Ancestor of a Binary Search Tree"
    },
    {
      "number": 208,
      "problem": "Implement Trie (Prefix Tree)"
    },
    {
      "number": 211,
      "problem": "Design Add and Search Words Data Structure"
    },
    {
      "number": 212,
      "problem": "Word Search II"
    }
  ],
  "Heap": [
    {
      "number": 23,
      "problem": "Merge k Sorted Lists"
    },
    {
      "number": 347,
      "problem": "Top K Frequent Elements"
    },
    {
      "number": 295,
      "problem": "Find Median from Data Stream"
    }
  ]
};
for(const topic of Object.keys(roadmap))roadmap[topic]=roadmap[topic].filter(p=>!games.some(g=>g.number===p.number));
export const problemLabel = ({number,problem}) => `${number}. ${problem}`;
export function newRound(game, round=0) { if(game.structures)return newStructureRound(game,round); if(game.expansion)return newExpansionRound(game,round); if(game.patterns)return newPatternRound(game,round); if(game.strategy)return newStrategyRound(game,round); if(game.advanced)return newAdvancedRound(game,round); if(game.signature)return newMoreRound(game,round); return {round, index:0, memory:[], done:false, message:'', error:false}; }
export function move(game, state, action, index) {
  if(game.structures||game.expansion)return moveExpansion(game,state,action,index);
  if(game.patterns)return movePattern(game,state,action,index);
  if(game.strategy)return moveStrategy(game,state,action,index);
  if(game.advanced)return moveAdvanced(game,state,action,index);
  if(game.signature)return moveMore(game,state,action,index);
  if(state.done) return state;
  const next={...state,memory:[...state.memory],error:false};
  const r=game.rounds[state.round], value=r.values[state.index];
  const fail=message=>({...state,error:true,message});
  if(game.id==='two-sum') {
    const match=state.memory.find(x=>x.value+value===r.target);
    if(action==='match') {if(!match || state.memory[index]?.value+value!==r.target) return fail('That pair misses the target. Look for '+(r.target-value)+'.'); next.done=true;next.message='Perfect pair! You found both indices without checking every pair.';}
    else if(action==='store') {if(match) return fail('Your memory already holds the complement. Select it to make a pair.');next.memory.push({value,index:state.index});next.index++;next.message='Saved '+value+'. Move on and look for the next complement.';}
    else return fail('Select a saved number or save the current number.');
  } else if(game.id==='duplicate') {
    const seen=state.memory.some(x=>x.value===value);
    if(action==='duplicate') {if(!seen)return fail('This number is new. Add it to your memory first.');next.done=true;next.message='Duplicate spotted! Your Set already contains '+value+'.';}
    else if(action==='store') {if(seen)return fail('You have seen this number before. Flag the duplicate.');next.memory.push({value,index:state.index});next.index++;next.message='Added '+value+' to your collection.';}
    else return fail('Save the number or flag a duplicate.');
    if(next.index===r.values.length){next.done=true;next.message='Every number was unique. The answer is false.';}
  } else {
    const opening='([{'.includes(value), pair={')':'(',']':'[','}':'{'};
    const matches=state.memory.at(-1)?.value===pair[value];
    if(action==='push') {if(!opening)return fail('Closing brackets cannot be pushed. Match the top or reject the sequence.');next.memory.push({value,index:state.index});next.index++;next.message='Opening bracket pushed. It must close before the brackets below it.';}
    else if(action==='pop') {if(opening || !matches)return fail('The top opening bracket does not match. Check the order.');next.memory.pop();next.index++;next.message='A match! The most recent opening bracket is now closed.';}
    else if(action==='reject') {if(opening || matches)return fail('This step is valid. Push an opener or match a closer.');next.done=true;next.message='Correct: this sequence is invalid. A closer must match the top of the stack.';}
    else return fail('Push, match, or reject this bracket.');
    if(next.index===r.values.length){next.done=true;next.message=next.memory.length?'Unclosed brackets remain. The answer is false.':'The stack is empty. Every bracket matched: true!';}
  }
  return next;
}
export function accepts(game, test, result) {
  if(game.structures)return acceptsStructure(game,test,result);
  if(game.validation==='palindrome')return typeof result==='string'&&result.length===test.expected.length&&test.args[0].includes(result)&&result===[...result].reverse().join('');
  if(game.signature&&['array','intmatrix'].includes(game.signature.result)){
    if(!Array.isArray(result))return false;
    const nested=game.signature.result==='intmatrix';
    if(nested?!result.every(r=>Array.isArray(r)&&r.every(Number.isInteger)):!result.every(Number.isInteger))return false;
    const normalize=value=>{
      if(game.validation==='triplets')return value.map(row=>[...row].sort((a,b)=>a-b)).map(JSON.stringify).sort();
      if(game.validation==='rows')return value.map(JSON.stringify).sort();
      if(game.validation==='set')return [...value].sort((a,b)=>a-b);
      return value;
    };
    return JSON.stringify(normalize(result))===JSON.stringify(normalize(test.expected));
  }
  if(game.id!=='two-sum')return result===test.expected;
  const [nums,target]=test.args;
  return Array.isArray(result)&&result.length===2&&result.every(i=>Number.isInteger(i)&&i>=0&&i<nums.length)&&result[0]!==result[1]&&nums[result[0]]+nums[result[1]]===target;
}
