// Links are algorithm references, not copied lesson content. Verified October 2026.
export const resources={
 expansion347:{title:'Frequency buckets and top-k elements',publisher:'NeetCode',url:'https://neetcode.io/solutions/top-k-frequent-elements'},
 expansion48:{title:'Rotate a matrix: transpose and reverse',publisher:'NeetCode',url:'https://neetcode.io/solutions/rotate-image'},
 expansion73:{title:'Matrix zeroes: preserve original markers',publisher:'NeetCode',url:'https://neetcode.io/solutions/set-matrix-zeroes'},
 expansion54:{title:'Spiral traversal with shrinking boundaries',publisher:'NeetCode',url:'https://neetcode.io/solutions/spiral-matrix'},
 expansion1143:{title:'Longest common subsequence: 2D dynamic programming',publisher:'NeetCode',url:'https://neetcode.io/solutions/longest-common-subsequence'},
 expansion417:{title:'Pacific Atlantic: reverse flood fill',publisher:'NeetCode',url:'https://neetcode.io/solutions/pacific-atlantic-water-flow'},
 expansion56:{title:'Merge sorted intervals',publisher:'NeetCode',url:'https://neetcode.io/solutions/merge-intervals'},
 expansion57:{title:'Insert and merge an interval',publisher:'NeetCode',url:'https://neetcode.io/solutions/insert-interval'},

 wordSearch:{title:'Word Search: DFS and backtracking',publisher:'NeetCode',url:'https://neetcode.io/solutions/word-search'},
 uniqueWindow:{title:'Longest unique substring: sliding window',publisher:'NeetCode',url:'https://neetcode.io/solutions/longest-substring-without-repeating-characters'},
 robber:{title:'House Robber: take-or-skip dynamic programming',publisher:'NeetCode',url:'https://neetcode.io/solutions/house-robber'},
 jump:{title:'Jump Game: greedy reachability',publisher:'NeetCode',url:'https://neetcode.io/solutions/jump-game'},
 kahn:{title:'Topological sort and Kahn’s algorithm',publisher:'USACO Guide',url:'https://usaco.guide/gold/toposort#bfs'},
 coins:{title:'Coin Change: bottom-up dynamic programming',publisher:'NeetCode',url:'https://neetcode.io/solutions/coin-change'},
 intervalRemoval:{title:'Non-overlapping intervals: greedy scheduling',publisher:'NeetCode',url:'https://neetcode.io/solutions/non-overlapping-intervals'},
 hash:{title:'Hash tables, maps, and membership',publisher:'VisuAlgo',url:'https://visualgo.net/en/hashtable'},
 list:{title:'Linked lists, stacks, and queues',publisher:'VisuAlgo',url:'https://visualgo.net/en/list'},
 dp:{title:'Introduction to dynamic programming',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html'},
 stock:{title:'Tracking the minimum buy price',publisher:'NeetCode',url:'https://neetcode.io/solutions/best-time-to-buy-and-sell-stock'},
 counts:{title:'Character-frequency counting',publisher:'NeetCode',url:'https://neetcode.io/solutions/valid-anagram'},
 pointers:{title:'Two pointers and sliding windows',publisher:'USACO Guide',url:'https://usaco.guide/silver/two-pointers'},
 window:{title:'Minimum window: counts and shrinking',publisher:'NeetCode',url:'https://neetcode.io/solutions/minimum-window-substring'},
 lis:{title:'LIS: dynamic programming and binary search',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/sequences/longest_increasing_subsequence.html'},
 flood:{title:'Flood fill and connected grid regions',publisher:'USACO Guide',url:'https://usaco.guide/silver/flood-fill'},
 dfs:{title:'Depth-first search',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/graph/depth-first-search.html'},
 bfs:{title:'Breadth-first search',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/graph/breadth-first-search.html'},
 topo:{title:'Topological sorting',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/graph/topological-sort.html'},
 binary:{title:'Binary search and loop invariants',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/num_methods/binary_search.html'},
 bits:{title:'Bit manipulation',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/algebra/bit-manipulation.html'},
 heap:{title:'Heaps and priority queues',publisher:'VisuAlgo',url:'https://visualgo.net/en/heap'},
 bst:{title:'Binary search trees and traversal',publisher:'VisuAlgo',url:'https://visualgo.net/en/bst'},
 tree:{title:'Trees and recursive traversal',publisher:'USACO Guide',url:'https://usaco.guide/silver/intro-tree'},
 trie:{title:'Constructing a trie',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/string/aho_corasick.html#construction-of-the-trie'},
 simulation:{title:'Simulation: model each operation',publisher:'USACO Guide',url:'https://usaco.guide/bronze/simulation'},
 intervals:{title:'Sorting and greedy interval choices',publisher:'USACO Guide',url:'https://usaco.guide/silver/greedy-sorting'},
 prefix:{title:'Prefix and suffix products',publisher:'NeetCode',url:'https://neetcode.io/solutions/product-of-array-except-self'},
 kadane:{title:'Maximum subarray and Kadane’s algorithm',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/others/maximum_average_segment.html'},
 product:{title:'Tracking minimum and maximum products',publisher:'NeetCode',url:'https://neetcode.io/solutions/maximum-product-subarray'},
 backtrack:{title:'Recursive search and backtracking',publisher:'USACO Guide',url:'https://usaco.guide/bronze/complete-rec'},
 dsu:{title:'Disjoint sets and connected components',publisher:'CP-Algorithms',url:'https://cp-algorithms.com/data_structures/disjoint_set_union.html'},
 encode:{title:'Length-prefixed string encoding',publisher:'NeetCode',url:'https://neetcode.io/solutions/encode-and-decode-strings'},
 palindrome:{title:'Expanding around palindrome centers',publisher:'NeetCode',url:'https://neetcode.io/solutions/longest-palindromic-substring'},
 serialize:{title:'Serializing a tree with null markers',publisher:'NeetCode',url:'https://neetcode.io/solutions/serialize-and-deserialize-binary-tree'}
};
for(const [id,slug,title] of [[124,'binary-tree-maximum-path-sum','Tree DP: one returned arm, two-arm path'],[295,'find-median-from-data-stream','Maintain a median with two balanced heaps'],[212,'word-search-ii','Word Search II: trie-guided backtracking'],[269,'alien-dictionary','Alien Dictionary: constraints and topological order']])resources['complete'+id]={title,publisher:'NeetCode',url:'https://neetcode.io/solutions/'+slug};
const groups={
 hash:[1,217,128],list:[20,206,141,21,19,143],dp:[70,322,1143,139,377,198,213,91,62,55],stock:[121],counts:[242,49],pointers:[15,11,3,424,125],window:[76],lis:[300],flood:[417,200],dfs:[133],topo:[207,269],binary:[153,33],bits:[371,191,338,268,190],heap:[23,347,295],bst:[98,230,235],tree:[104,100,226,124,572,105],bfs:[102],trie:[208,211],simulation:[73,54,48],intervals:[57,56,435,252,253],prefix:[238],kadane:[53],product:[152],backtrack:[79,212],dsu:[261,323],encode:[271],palindrome:[5,647],serialize:[297]
};
const topics=new Map();for(const [key,ids] of Object.entries(groups))for(const id of ids)topics.set(id,[key]);
topics.set(79,['wordSearch','backtrack']);topics.set(3,['uniqueWindow','pointers']);topics.set(198,['robber','dp']);topics.set(55,['jump']);
topics.set(207,['kahn']);topics.set(322,['coins','dp']);topics.set(435,['intervalRemoval']);
topics.set(200,['flood','bfs']);topics.set(76,['pointers','window']);topics.set(212,['trie','backtrack']);topics.set(141,['list','pointers']);
topics.set(347,['expansion347']);topics.set(48,['expansion48']);topics.set(73,['expansion73']);topics.set(54,['expansion54']);topics.set(1143,['expansion1143']);topics.set(417,['expansion417']);topics.set(56,['expansion56']);topics.set(57,['expansion57']);
for(const id of [124,295,212,269])topics.set(id,['complete'+id]);
export const tutorialsFor=number=>(topics.get(number)||[]).map(key=>resources[key]);
export function tutorialPanel(number){
 return `<section class="tutorial-panel" aria-label="Algorithm tutorials"><h3>Learn the algorithm</h3><p>Review the technique, then try it in code. Links open in a new tab.</p>${tutorialsFor(number).map(r=>`<a href="${r.url}" target="_blank" rel="noopener noreferrer"><span>${r.title}<small>${r.publisher} · Algorithm tutorial</small></span><b aria-hidden="true">↗</b></a>`).join('')}</section>`;
}
export function tutorialLink(number){const r=tutorialsFor(number)[0];return r?`<a class="roadmap-tutorial" href="${r.url}" target="_blank" rel="noopener noreferrer" aria-label="Learn the algorithm for problem ${number}: ${r.title}">Learn: ${r.title} ↗</a>`:'';}
