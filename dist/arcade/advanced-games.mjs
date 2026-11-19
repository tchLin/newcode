export const advancedGames=[
 {id:'water',number:11,problem:'Container With Most Water',category:'Array',tag:'TWO POINTERS',difficulty:'Medium',advanced:true,color:'mint',time:'8–12 min',description:'Measure the water. Move the shorter wall. Prove what you can discard.',concept:'The shorter wall limits the water',fn:'maxArea',params:'height',signature:{result:'int',args:[['height','array']]},rounds:[{values:[1,8,6,2,5,7]},{values:[4,3,2,1,4]}],lesson:'Two pointers mark the container walls. Area is their distance times the shorter height. After recording that area, move the shorter wall inward: keeping it while reducing the width cannot improve the area. If the heights tie, either pointer can move. Each move discards one wall, giving O(n) time and O(1) extra space.',prompt:'Given nonnegative heights, choose two vertical lines that hold the most water. Return the maximum area: (right − left) × min(height[left], height[right]). There are at least two heights.',hint:'Start at the two ends. Record the area, move the pointer with the smaller height inward, and repeat until the pointers meet. Keep the largest area seen.',tests:[{args:[[1,8,6,2,5,4,8,3,7]],expected:49},{args:[[1,1]],expected:1},{args:[[4,3,2,1,4]],expected:16},{args:[[0,0]],expected:0},{args:[[1,2,4,3]],expected:4},{args:[[8,1,1,8]],expected:24},{args:[[2,3,10,5,7,8,9]],expected:36}]},
 {id:'lis',number:300,problem:'Longest Increasing Subsequence',category:'Dynamic Programming',tag:'SUBSEQUENCE DP',difficulty:'Medium',advanced:true,color:'lavender',time:'8–12 min',description:'Connect smaller earlier values. Save the best chain ending at each number.',concept:'A best answer ending at every index',fn:'lengthOfLIS',params:'nums',signature:{result:'int',args:[['nums','array']]},rounds:[{values:[3,1,2,4,2,5]},{values:[2,2,2]}],lesson:'For each index i, save the length of the longest increasing subsequence ending there. Start dp[i] at 1. For every earlier j with nums[j] < nums[i], consider dp[j] + 1. The largest dp value is the answer. This visual DP takes O(n²) time and O(n) space. The tutorial also explains the O(n log n) method using binary search.',prompt:'Return the length of the longest strictly increasing subsequence in nums. A subsequence keeps the original order but may skip elements. Equal values do not extend a strictly increasing sequence. nums is nonempty.',hint:'Initialize one DP entry per number to 1. For each i, inspect all earlier j. If nums[j] < nums[i], maximize dp[i] with dp[j] + 1. Return the maximum DP entry, not just the final one.',tests:[{args:[[10,9,2,5,3,7,101,18]],expected:4},{args:[[0,1,0,3,2,3]],expected:4},{args:[[7,7,7,7]],expected:1},{args:[[5,4,3,2,1]],expected:1},{args:[[-3,-2,-1]],expected:3},{args:[[1,2,3,0]],expected:3},{args:[[42]],expected:1}]},
 {id:'islands',number:200,problem:'Number of Islands',category:'Graph',tag:'FLOOD FILL · BFS',difficulty:'Medium',advanced:true,color:'mint',time:'8–12 min',description:'Explore connected land. Drain your queue before starting a new island.',concept:'One traversal per connected component',fn:'numIslands',params:'grid',signature:{result:'int',args:[['grid','chargrid']]},rounds:[{grid:['11000','11001','00101','00000']},{grid:['101','010','101']}],lesson:'Each unvisited land cell starts a new island. Use a queue to visit its up, down, left, and right neighbors, marking each cell as discovered before enqueueing it. When the queue empties, scan for the next unvisited land cell. Diagonal contact does not connect islands. Time is O(rows × columns), with O(rows × columns) worst-case extra space.',prompt:'Return the number of islands in a rectangular grid of characters "1" (land) and "0" (water). Land connects only up, down, left, and right. You may modify the grid. Assume at least one row and column.',hint:'Scan every cell. On unvisited land, increment the island count and flood-fill that component with BFS or DFS. Mark cells as soon as you discover them so that they cannot be added twice.',tests:[{args:[['11000','11000','00100','00011'].map(r=>[...r])],expected:3},{args:[['111','010','111'].map(r=>[...r])],expected:1},{args:[['101','010','101'].map(r=>[...r])],expected:5},{args:[[['0']]],expected:0},{args:[[['1']]],expected:1},{args:[['000','000'].map(r=>[...r])],expected:0},{args:[['10101'].map(r=>[...r])],expected:3}]},
 {id:'window',number:76,problem:'Minimum Window Substring',category:'String',tag:'SLIDING WINDOW',difficulty:'Hard',advanced:true,color:'peach',time:'10–15 min',description:'Expand to collect every needed letter. Shrink to find the smallest window.',concept:'Expand for coverage, shrink for minimality',fn:'minWindow',params:'s, t',signature:{result:'string',args:[['s','string'],['t','string']]},rounds:[{values:[...'CABBAAC'],target:'ABC'},{values:[...'ABAAC'],target:'AAC'}],lesson:'Maintain a window and character frequencies. Expand its right edge until it covers every required occurrence from t. While the window is valid, record it if it improves the best length, then remove the leftmost character. Expand again when coverage breaks. Repeated letters need repeated counts. Each pointer advances at most |s| times, so the algorithm takes O(|s| + |t|) time and O(k) count space for k distinct characters.',prompt:'Return the shortest contiguous substring of s containing every character of t, including repeated occurrences. Match uppercase and lowercase letters exactly. If no such window exists, return an empty string. Inputs contain English letters, t is nonempty, and each solvable test has a unique shortest answer.',hint:'Count the required characters. Track how many required occurrences are still missing. Expand right to reduce that count; while it is zero, save the window and move left. Removing a needed occurrence makes the window invalid again.',tests:[{args:['ADOBECODEBANC','ABC'],expected:'BANC'},{args:['a','a'],expected:'a'},{args:['a','aa'],expected:''},{args:['ABAAC','AAC'],expected:'AAC'},{args:['aa','aa'],expected:'aa'},{args:['aA','A'],expected:'A'},{args:['abc','z'],expected:''},{args:['ab','b'],expected:'b'}]}
];
export function newAdvancedRound(g,round=0){
 const base={round,index:0,memory:[],done:false,error:false,message:''};
 if(g.id==='water')return {...base,left:0,right:g.rounds[round].values.length-1,best:0,phase:'measure'};
 if(g.id==='lis')return {...base,dp:[],parents:[]};
 if(g.id==='islands')return {...base,visited:[],queue:[],island:0,labels:{}};
 return {...base,left:0,right:0,best:null};
}
export function windowInfo(r,s){
 const need={},have={};for(const c of r.target)need[c]=(need[c]||0)+1;
 for(const c of r.values.slice(s.left,s.right))have[c]=(have[c]||0)+1;
 return {need,have,valid:Object.keys(need).every(c=>(have[c]||0)>=need[c]),text:r.values.slice(s.left,s.right).join('')};
}
export function moveAdvanced(g,s,action,choice){
 if(s.done)return s;
 const r=g.rounds[s.round],fail=message=>({...s,error:true,message});
 const next={...s,error:false};
 if(g.id==='water'){
  const area=(s.right-s.left)*Math.min(r.values[s.left],r.values[s.right]);
  if(s.phase==='measure'){
   if(action!=='area'||choice!==area)return fail(`Use width × shorter height: ${s.right-s.left} × ${Math.min(r.values[s.left],r.values[s.right])}.`);
   next.best=Math.max(s.best,area);next.phase='move';next.message=`Area ${area} recorded. Best so far: ${next.best}. Now discard the shorter wall.`;
   if(s.right-s.left===1){next.done=true;next.message=`Every useful pair checked. Maximum area: ${next.best}.`;}
  }else{
   if(!['left','right'].includes(action))return fail('Choose the shorter wall to move inward.');
   if(action==='left'&&r.values[s.left]>r.values[s.right]||action==='right'&&r.values[s.right]>r.values[s.left])return fail('Keeping the shorter wall while reducing the width cannot improve this area. Move the shorter wall.');
   if(action==='left')next.left++;else next.right--;
   next.phase='measure';next.message='One wall discarded. Measure the new container.';
  }
 }else if(g.id==='lis'){
  const eligible=s.dp.map((_,j)=>j).filter(j=>r.values[j]<r.values[s.index]);
  const best=eligible.length?Math.max(...eligible.map(j=>s.dp[j])):0;
  if(action!=='extend')return fail('Choose an earlier smaller value, or start a new chain.');
  if(best===0&&choice!==-1)return fail('No earlier value is strictly smaller. Start a chain of length 1.');
  if(best>0&&(!eligible.includes(choice)||s.dp[choice]!==best))return fail(`Choose a smaller earlier value with the largest saved chain length (${best}). Equal values cannot extend a chain.`);
  next.dp=[...s.dp,best+1];next.parents=[...s.parents,choice];next.index++;
  next.message=`Saved length ${best+1} at index ${s.index}. The answer is the largest saved length.`;
  if(next.index===r.values.length){next.done=true;next.message=`Longest strictly increasing subsequence: ${Math.max(...next.dp)}. Skipping values is allowed; changing their order is not.`;}
 }else if(g.id==='islands'){
  const cols=r.grid[0].length,total=r.grid.length*cols,row=Math.floor(choice/cols),col=choice%cols;
  if(action!=='visit'||!Number.isInteger(choice)||choice<0||choice>=total||r.grid[row][col]!=='1')return fail('Choose a land cell marked 1. Water is not part of an island.');
  if(s.visited.includes(choice))return fail('This cell was already visited. Each land cell is processed once.');
  if(s.queue.length&&choice!==s.queue[0])return fail('Visit the first cell in the queue before starting elsewhere. Finish this connected island first.');
  next.island=s.queue.length?s.island:s.island+1;next.visited=[...s.visited,choice];next.labels={...s.labels,[choice]:next.island};next.queue=s.queue.slice(1);
  for(const [y,x] of [[row-1,col],[row+1,col],[row,col-1],[row,col+1]]){
   const i=y*cols+x;if(y>=0&&y<r.grid.length&&x>=0&&x<cols&&r.grid[y][x]==='1'&&!next.visited.includes(i)&&!next.queue.includes(i))next.queue.push(i);
  }
  next.message=next.queue.length?'Neighbors discovered. Visit the front of the queue next.':'Queue empty. This island is complete; look for unvisited land.';
  if(next.visited.length===r.grid.join('').split('').filter(c=>c==='1').length){next.done=true;next.message=`All land visited: ${next.island} islands. Diagonal cells never joined the queue.`;}
 }else{
  const info=windowInfo(r,s);
  if(info.valid){
   if(action!=='shrink')return fail('All required counts are covered. Save this candidate and shrink from the left.');
   if(s.best===null||s.right-s.left<s.best.length)next.best=info.text;
   next.left++;next.message=`Candidate recorded. Best: “${next.best}”. Check whether removing “${r.values[s.left]}” broke coverage.`;
  }else if(s.right<r.values.length){
   if(action!=='expand')return fail('At least one required count is missing. Expand the right edge to collect another letter.');
   next.right++;next.message=`Added “${r.values[s.right]}”. Compare the window counts with the target counts.`;
  }else{
   if(action!=='finish')return fail('The right edge reached the end and coverage is incomplete. No later window can help; finish the scan.');
   next.done=true;next.message=next.best===null?'No window covers the target. Return an empty string.':`Shortest window: “${next.best}”, length ${next.best.length}. Each edge moved only forward.`;
  }
 }
 return next;
}
