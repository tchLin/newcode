// Beginner lessons with their own interaction rules and language-neutral signatures.
export const moreGames = [
  {id:'stock',number:121,problem:'Best Time to Buy and Sell Stock',category:'Array',tag:'RUNNING MINIMUM',color:'peach',time:'5–8 min',description:'Watch the prices. Remember the low. Find your best trade.',concept:'Keep the cheapest earlier price',fn:'maxProfit',params:'prices',signature:{result:'int',args:[['prices','array']]},rounds:[{values:[7,1,5,3,6,4]},{values:[7,6,4,3,1]}],lesson:'At each day, you remembered the cheapest earlier price and the best profit so far. Compare today’s price with that minimum, keep the largest difference, then update the minimum. Starting the best profit at zero allows you to make no trade. Time is O(n), with O(1) extra space.',prompt:'Given daily prices, return the largest profit from buying once and selling on a later day. If no profitable trade exists, return 0. There is at least one price.',hint:'Start with the first price as your minimum and 0 as your best profit. For each later price, compare price − minimum with your best profit, then update the minimum. Return the best profit.',tests:[{args:[[7,1,5,3,6,4]],expected:5},{args:[[7,6,4,3,1]],expected:0},{args:[[1]],expected:0},{args:[[2,2,2]],expected:0},{args:[[2,4,1]],expected:2},{args:[[3,1,4,8,2,10]],expected:9},{args:[[0,1,0,5]],expected:5}]},
  {id:'anagram',number:242,problem:'Valid Anagram',category:'String',tag:'LETTER COUNTS',color:'lavender',time:'4–7 min',description:'Same letters, different order. Can you account for every one?',concept:'Every letter needs the same count',fn:'isAnagram',params:'s, t',signature:{result:'bool',args:[['s','string'],['t','string']]},rounds:[{values:['t','e','a'],source:'eat'},{values:['a','b','b'],source:'aab'}],lesson:'You used one saved letter for each letter in the other word. A frequency array or map stores these counts: add counts from s, then subtract counts for t. A missing letter or a leftover count means the words are not anagrams. For lowercase English letters, a 26-slot array takes O(1) space and the scan takes O(n + m) time.',prompt:'Return true if s and t contain exactly the same letters with the same frequencies, in any order. Both strings contain only lowercase English letters.',hint:'First compare the lengths. Count each letter in s in a 26-slot array or a map, then subtract each letter in t. If a count becomes negative, return false. Matching lengths and no negative counts means true.',tests:[{args:['anagram','nagaram'],expected:true},{args:['rat','car'],expected:false},{args:['aab','abb'],expected:false},{args:['a','aa'],expected:false},{args:['ab','a'],expected:false},{args:['',''],expected:true},{args:['zxy','yxz'],expected:true}]},
  {id:'stairs',number:70,problem:'Climbing Stairs',category:'Dynamic Programming',tag:'BUILD ON SMALLER ANSWERS',color:'mint',time:'5–8 min',description:'One step or two? Discover how the possible paths add up.',concept:'Add the previous two answers',fn:'climbStairs',params:'n',signature:{result:'int',args:[['n','int']]},rounds:[{values:[0,1,2,3,4]},{values:[0,1,2,3,4,5]}],lesson:'Every route to step k ends with either a one-step move from k − 1 or a two-step move from k − 2. These two groups do not overlap, so ways(k) = ways(k − 1) + ways(k − 2). Start with one way to stand at step 0 and one way to reach step 1. Keep just the last two counts for O(n) time and O(1) extra space.',prompt:'A staircase has n steps. Each move climbs either 1 or 2 steps. Return the number of distinct sequences of moves that reach the top. Assume 1 ≤ n ≤ 45.',hint:'Keep two counts, initially 1 and 1 for steps 0 and 1. From step 2 through n, compute their sum, then shift the two counts forward. Return the count for step n.',tests:[{args:[2],expected:2},{args:[3],expected:3},{args:[1],expected:1},{args:[4],expected:5},{args:[5],expected:8},{args:[10],expected:89},{args:[45],expected:1836311903}]}
];
export function newMoreRound(g,round){
 const base={round,index:0,memory:[],done:false,error:false,message:''};
 if(g.id==='stock')return {...base,minimum:null,best:0};
 if(g.id==='anagram')return {...base,memory:[...g.rounds[round].source].map((value,index)=>({value,index}))};
 return {...base,index:2,memory:[{value:1,index:0},{value:1,index:1}]};
}
export function moveMore(g,state,action,choice){
 if(state.done)return state;
 const r=g.rounds[state.round],value=r.values[state.index];
 const fail=message=>({...state,error:true,message});
 const next={...state,memory:[...state.memory],error:false};
 if(g.id==='stock'){
  const profit=state.minimum===null?0:value-state.minimum;
  const wanted=state.minimum===null||value<state.minimum?'low':profit>state.best?'profit':'skip';
  if(action!==wanted)return fail(wanted==='low'?'This is the cheapest price so far. Save it as your new low.':wanted==='profit'?`Buying at ${state.minimum} and selling at ${value} improves your best profit.`:'Neither the cheapest price nor the best profit changes today. Keep your records.');
  if(action==='low'){next.minimum=value;next.message=`New low saved: ${value}. A sale must happen on a later day.`;}
  else if(action==='profit'){next.best=profit;next.message=`Best profit updated: ${value} − ${state.minimum} = ${profit}.`;}else next.message='Records kept. Move forward one day.';
  next.index++;
  if(next.index===r.values.length){next.done=true;next.message=next.best?`Best profit: ${next.best}. You checked every day with only two records.`:'No profitable trade. Choosing not to trade gives a profit of 0.';}
 }else if(g.id==='anagram'){
  const match=state.memory.findIndex(x=>x.value===value);
  if(action==='match'){
   if(!state.memory[choice]||state.memory[choice].value!==value)return fail(`Use one saved “${value}”. If none is left, reject the word.`);
   next.memory.splice(choice,1);next.index++;next.message=`Used one “${value}”. Repeated letters each need their own match.`;
   if(next.index===r.values.length){next.done=true;next.message=next.memory.length?'Letters remain unused. The words are not anagrams: false.':'Every letter matched exactly once. These words are anagrams: true!';}
  }else if(action==='reject'){
   if(match!==-1)return fail(`You still have a “${value}” available. Select it before rejecting.`);
   next.done=true;next.message=`No “${value}” remains. The counts differ, so the answer is false.`;
  }else return fail('Match a saved letter or reject when no match remains.');
 }else if(g.id==='stairs'){
  const total=state.memory.at(-1).value+state.memory.at(-2).value;
  if(action!=='ways'||choice!==total)return fail(`Add the routes from the two previous steps: ${state.memory.at(-2).value} + ${state.memory.at(-1).value}. Each route belongs to exactly one group.`);
  next.memory.push({value:total,index:state.index});next.index++;next.message=`${total} ways saved. Use this answer when building the next step.`;
  if(next.index===r.values.length){next.done=true;next.message=`Top reached: ${total} distinct routes. You reused smaller answers instead of recounting every path.`;}
 }
 return next;
}
