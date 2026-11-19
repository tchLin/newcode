const define=g=>({strategy:true,difficulty:'Medium',time:'8–12 min',...g});
export const strategyGames=[
 define({id:'courses',number:207,problem:'Course Schedule',category:'Graph',tag:'TOPOLOGICAL SORT',color:'mint',description:'Unlock courses by completing prerequisites. Discover when a cycle blocks progress.',concept:'Remove courses with no remaining prerequisites',fn:'canFinish',params:'numCourses, prerequisites',signature:{result:'bool',args:[['numCourses','int'],['prerequisites','intmatrix']]},rounds:[{n:4,edges:[[1,0],[2,0],[3,1],[3,2]]},{n:3,edges:[[1,0],[2,1],[0,2]]}],lesson:'Build edges from each prerequisite to its dependent course. Count incoming edges (indegree). Repeatedly remove a course with indegree zero and decrement the counts of its dependents. If all courses are removed, return true. If unfinished courses remain and none is ready, a directed cycle exists. With an adjacency list and queue, Kahn’s algorithm takes O(V + E) time and space.',prompt:'Courses are numbered 0 through numCourses − 1. Each pair [a, b] means you must finish course b before course a. Return whether you can finish every course. Prerequisite pairs are distinct.',hint:'Create an adjacency list b → a and count incoming edges at a. Queue every course with indegree zero. Count courses removed from the queue; enqueue dependents when their indegree reaches zero. Compare the processed count with numCourses.',tests:[{args:[4,[[1,0],[2,0],[3,1],[3,2]]],expected:true},{args:[2,[[1,0],[0,1]]],expected:false},{args:[1,[[0,0]]],expected:false},{args:[3,[]],expected:true},{args:[4,[[1,0],[2,3],[3,2]]],expected:false},{args:[4,[[1,0],[3,2]]],expected:true},{args:[5,[[4,3],[3,2],[2,1],[1,0]]],expected:true}]}),
 define({id:'intervals',number:435,problem:'Non-overlapping Intervals',category:'Interval',tag:'GREEDY · SORT BY END',color:'peach',description:'Keep the earliest finish. Clear overlaps to leave room for future intervals.',concept:'An early finish leaves the most room',fn:'eraseOverlapIntervals',params:'intervals',signature:{result:'int',args:[['intervals','intmatrix']]},rounds:[{intervals:[[1,3],[2,4],[3,5],[4,6]]},{intervals:[[1,10],[2,3],[3,4],[4,5]]}],lesson:'Sort intervals by their end time. Keep the first interval, then keep each interval whose start is at least the last kept end; remove any that overlap. Choosing the earliest finish leaves at least as much room as any other choice. The answer is total intervals minus kept intervals. Touching endpoints are allowed. Sorting takes O(n log n) time; the scan uses O(1) space, apart from the sort’s workspace.',prompt:'Return the minimum number of intervals to remove so the remaining intervals do not overlap. An interval is [start, end], with start < end. Intervals sharing only an endpoint do not overlap. The input contains at least one interval.',hint:'Sort by end ascending. Track the end of the last kept interval. If the next start is smaller than that end, count a removal; otherwise keep it and update the end.',tests:[{args:[[[1,2],[2,3],[3,4],[1,3]]],expected:1},{args:[[[1,2],[1,2],[1,2]]],expected:2},{args:[[[1,2],[2,3]]],expected:0},{args:[[[1,10],[2,3],[3,4],[4,5]]],expected:1},{args:[[[-3,-1],[-2,0],[0,2]]],expected:1},{args:[[[5,7],[1,4],[3,6]]],expected:1},{args:[[[0,1]]],expected:0}]}),
 define({id:'rotated',number:153,problem:'Find Minimum in Rotated Sorted Array',category:'Array',tag:'BINARY SEARCH',color:'lavender',description:'Compare the middle with the right edge. Keep the half hiding the minimum.',concept:'Keep the minimum inside your bounds',fn:'findMin',params:'nums',signature:{result:'int',args:[['nums','array']]},rounds:[{values:[4,5,6,7,0,1,2]},{values:[2,1]}],lesson:'Maintain inclusive bounds around the minimum. If nums[mid] > nums[right], the minimum is strictly right of mid, so set left = mid + 1. Otherwise the minimum is at mid or to its left, so set right = mid. Stop when the bounds meet and return that value. Distinct elements make the comparison decisive. Time is O(log n), extra space O(1).',prompt:'nums is a nonempty ascending array of distinct integers that has been rotated, possibly through a full rotation. Return its minimum value in O(log n) time.',hint:'Use left = 0 and right = length − 1. While left < right, compare nums[mid] to nums[right]. Keep mid when moving right inward; skip mid when moving left inward.',tests:[{args:[[3,4,5,1,2]],expected:1},{args:[[4,5,6,7,0,1,2]],expected:0},{args:[[1,2,3,4]],expected:1},{args:[[9]],expected:9},{args:[[2,1]],expected:1},{args:[[2,3,4,1]],expected:1},{args:[[0,4,-5,-2]],expected:-5}]}),
 define({id:'coins',number:322,problem:'Coin Change',category:'Dynamic Programming',tag:'BOTTOM-UP DP',color:'mint',description:'Build each amount from smaller answers. Find where greedy coin choices fail.',concept:'Reuse the best answer for a smaller amount',fn:'coinChange',params:'coins, amount',signature:{result:'int',args:[['coins','array'],['amount','int']]},rounds:[{coins:[1,3,4],amount:6},{coins:[2,4],amount:7}],lesson:'Let dp[a] be the fewest coins needed for amount a. Start dp[0] = 0 and mark other amounts unreachable. For each amount, try every coin c ≤ a with a reachable dp[a − c], and minimize dp[a − c] + 1. Coins may be reused. Return −1 if the target remains unreachable. Time is O(amount × number of coins), space O(amount).',prompt:'Given positive coin denominations and a nonnegative amount, return the fewest coins needed to make that amount. You have unlimited copies of every coin. If it is impossible, return −1. Amount is at most 10,000.',hint:'Use amount + 1 as an unreachable sentinel. For each subtotal from 1 through amount, try every coin no larger than the subtotal. Take the minimum of dp[subtotal − coin] + 1.',tests:[{args:[[1,2,5],11],expected:3},{args:[[2],3],expected:-1},{args:[[1],0],expected:0},{args:[[1,3,4],6],expected:2},{args:[[5,7],3],expected:-1},{args:[[2,4],8],expected:2},{args:[[2147483647],2],expected:-1}]}),
 define({id:'bits',number:191,problem:'Number of 1 Bits',category:'Binary',tag:'BIT MANIPULATION',difficulty:'Easy',color:'peach',description:'Clear the lowest set bit, one move at a time. Count the moves to zero.',concept:'n & (n − 1) clears one set bit',fn:'hammingWeight',params:'n',signature:{result:'int',args:[['n','int']]},rounds:[{n:13},{n:40}],lesson:'Subtracting one flips the lowest set bit to zero and all lower bits to one. AND with the original number preserves the higher bits and clears that lowest set bit. Repeat n = n & (n − 1) until zero, counting one cleared bit per step. Time is O(k) for k set bits, extra space O(1).',prompt:'Return the number of 1 bits in the binary representation of a nonnegative integer n, where 0 ≤ n ≤ 2³¹ − 1. For n = 0, return 0.',hint:'Initialize a count to zero. While n is nonzero, replace n with n & (n − 1) and increment the count.',tests:[{args:[11],expected:3},{args:[128],expected:1},{args:[0],expected:0},{args:[1],expected:1},{args:[7],expected:3},{args:[2147483647],expected:31},{args:[1024],expected:1}]})
];
export const sortedIntervals=r=>r.intervals.map((pair,index)=>({pair,index})).sort((a,b)=>a.pair[1]-b.pair[1]);
export function newStrategyRound(g,round=0){
 const r=g.rounds[round],base={round,index:0,done:false,error:false,message:''};
 if(g.id==='courses'){const indegree=Array(r.n).fill(0);for(const [a] of r.edges)indegree[a]++;return {...base,indegree,completed:[]};}
 if(g.id==='intervals')return {...base,lastEnd:null,kept:[],removed:0};
 if(g.id==='rotated')return {...base,left:0,right:r.values.length-1};
 if(g.id==='coins')return {...base,index:1,dp:[0]};
 return {...base,remaining:r.n,count:0};
}
export function moveStrategy(g,s,action,choice){
 if(s.done)return s;
 const r=g.rounds[s.round],fail=message=>({...s,error:true,message}),next={...s,error:false};
 if(g.id==='courses'){
  const ready=s.indegree.map((n,i)=>i).filter(i=>s.indegree[i]===0&&!s.completed.includes(i));
  if(action==='cycle'){
   if(ready.length)return fail('A course still has zero remaining prerequisites. Complete it before checking for a cycle.');
   return {...next,done:true,answer:false,message:'Unfinished courses remain, but none is ready. A prerequisite cycle prevents completion: return false.'};
  }
  if(action!=='course'||!ready.includes(choice))return fail('Choose an unfinished course with zero remaining prerequisites.');
  next.completed=[...s.completed,choice];next.indegree=[...s.indegree];for(const [a,b] of r.edges)if(b===choice)next.indegree[a]--;
  next.message=`Course ${choice} completed. Its outgoing edges are removed.`;
  if(next.completed.length===r.n){next.done=true;next.answer=true;next.message='Every course completed. No directed cycle: return true.';}
 }else if(g.id==='intervals'){
  const [start,end]=sortedIntervals(r)[s.index].pair,keep=s.lastEnd===null||start>=s.lastEnd;
  if(action!==(keep?'keep':'remove'))return fail(keep?'This interval fits. Keep its early finish to leave room for later intervals.':'Its start is before the last kept end. Remove this overlapping interval.');
  if(keep){next.lastEnd=end;next.kept=[...s.kept,s.index];}else next.removed++;
  next.index++;next.message=keep?`Kept [${start}, ${end}]. Next start must be at least ${end}.`:`Removed [${start}, ${end}]. Keep the earlier finishing interval.`;
  if(next.index===r.intervals.length){next.done=true;next.answer=next.removed;next.message=`Minimum removals: ${next.removed}. Kept ${next.kept.length} compatible intervals.`;}
 }else if(g.id==='rotated'){
  if(s.left===s.right){if(action!=='minimum'||choice!==s.left)return fail('The bounds meet. Select that index to return its value.');return {...next,done:true,answer:r.values[s.left],message:`Minimum value ${r.values[s.left]} found at index ${s.left}.`};}
  const mid=Math.floor((s.left+s.right)/2),right=r.values[mid]>r.values[s.right];
  if(action!==(right?'right':'left'))return fail(right?'Middle is greater than the right edge. The minimum must be after mid.':'Middle is smaller than the right edge. Keep mid and everything to its left inside the bounds.');
  if(right)next.left=mid+1;else next.right=mid;
  next.message=`Minimum stays within inclusive indices [${next.left}, ${next.right}].`;
 }else if(g.id==='coins'){
  const options=r.coins.filter(c=>c<=s.index&&Number.isFinite(s.dp[s.index-c]));
  const best=options.length?Math.min(...options.map(c=>s.dp[s.index-c]+1)):Infinity;
  if(action!=='coin'||(best===Infinity?choice!==-1:!options.includes(choice)||s.dp[s.index-choice]+1!==best))return fail(best===Infinity?'No coin reaches this amount from a reachable smaller amount. Mark it unreachable.':'Choose a coin whose smaller saved answer + 1 gives the fewest coins.');
  next.dp=[...s.dp,best];next.index++;
  next.message=`dp[${s.index}] = ${best===Infinity?'unreachable':best}. Reuse this answer for larger amounts.`;
  if(s.index===r.amount){next.done=true;next.answer=best===Infinity?-1:best;next.message=`Amount ${r.amount}: ${best===Infinity?'unreachable, return −1':best+' coins'}.`;}
 }else{
  const lowest=Math.log2(s.remaining&-s.remaining);
  if(action!=='bit'||choice!==lowest)return fail('Clear the lowest set bit: the rightmost 1. Bit indices start at 0 on the right.');
  next.remaining=s.remaining&(s.remaining-1);next.count++;
  next.message=`${s.remaining} & ${s.remaining-1} = ${next.remaining}. One more set bit counted.`;
  if(next.remaining===0){next.done=true;next.answer=next.count;next.message+=` Total 1 bits: ${next.count}.`;}
 }
 return next;
}
