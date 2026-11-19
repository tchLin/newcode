export const expansionGames=[
 {
  "id": "lc-53",
  "number": 53,
  "problem": "Maximum Subarray",
  "category": "Array",
  "fn": "maxSubArray",
  "params": "nums",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ]
   ],
   "result": "int"
  },
  "tag": "KADANE’S ALGORITHM",
  "lesson": "Save the best nonempty sum ending here: max(value, previous ending sum + value). Update a separate global maximum. A negative prefix cannot improve a later sum. O(n) time, O(1) space.",
  "hint": "Save the best nonempty sum ending here: max(value, previous ending sum + value). Update a separate global maximum. A negative prefix cannot improve a later sum. O(n) time, O(1) space.",
  "prompt": "Return the largest sum of a nonempty contiguous subarray. nums is nonempty; all sums fit signed 32-bit integers.",
  "rounds": [
   {
    "args": [
     [
      -2,
      3,
      -1,
      4,
      -5
     ]
    ]
   },
   {
    "args": [
     [
      -4,
      -2,
      -7
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      -2,
      1,
      -3,
      4,
      -1,
      2,
      1,
      -5,
      4
     ]
    ],
    "expected": 6
   },
   {
    "args": [
     [
      -4,
      -2,
      -7
     ]
    ],
    "expected": -2
   },
   {
    "args": [
     [
      1
     ]
    ],
    "expected": 1
   },
   {
    "args": [
     [
      0,
      0
     ]
    ],
    "expected": 0
   },
   {
    "args": [
     [
      5,
      -1,
      5
     ]
    ],
    "expected": 9
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Kadane’S Algorithm",
  "description": "Save the best nonempty sum ending here: max(value, previous ending sum + value)."
 },
 {
  "id": "lc-33",
  "number": 33,
  "problem": "Search in Rotated Sorted Array",
  "category": "Array",
  "fn": "search",
  "params": "nums, target",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ],
    [
     "target",
     "int"
    ]
   ],
   "result": "int"
  },
  "tag": "BINARY SEARCH",
  "lesson": "At least one half around mid is sorted. Check whether target lies in that half’s value range; keep it if so, otherwise discard it. Return mid on a match, or −1 when bounds cross. Distinct values give O(log n) time and O(1) space.",
  "hint": "At least one half around mid is sorted. Check whether target lies in that half’s value range; keep it if so, otherwise discard it. Return mid on a match, or −1 when bounds cross. Distinct values give O(log n) time and O(1) space.",
  "prompt": "Find target in a nonempty rotated ascending array of distinct integers. Return its zero-based index, or −1.",
  "rounds": [
   {
    "args": [
     [
      4,
      5,
      6,
      7,
      0,
      1,
      2
     ],
     0
    ]
   },
   {
    "args": [
     [
      5,
      1,
      3
     ],
     4
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      4,
      5,
      6,
      7,
      0,
      1,
      2
     ],
     0
    ],
    "expected": 4
   },
   {
    "args": [
     [
      4,
      5,
      6,
      7,
      0,
      1,
      2
     ],
     3
    ],
    "expected": -1
   },
   {
    "args": [
     [
      1
     ],
     1
    ],
    "expected": 0
   },
   {
    "args": [
     [
      1
     ],
     0
    ],
    "expected": -1
   },
   {
    "args": [
     [
      3,
      1
     ],
     1
    ],
    "expected": 1
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Binary Search",
  "description": "At least one half around mid is sorted."
 },
 {
  "id": "lc-268",
  "number": 268,
  "problem": "Missing Number",
  "category": "Binary",
  "fn": "missingNumber",
  "params": "nums",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ]
   ],
   "result": "int"
  },
  "tag": "XOR CANCELLATION",
  "lesson": "XOR every integer from 0 through n and every array value. Equal values cancel because x XOR x = 0. Only the missing value remains. Initialize with n, then XOR each index and its value. O(n) time, O(1) space.",
  "hint": "XOR every integer from 0 through n and every array value. Equal values cancel because x XOR x = 0. Only the missing value remains. Initialize with n, then XOR each index and its value. O(n) time, O(1) space.",
  "prompt": "nums has n distinct integers from 0 through n. Return the single missing integer.",
  "rounds": [
   {
    "args": [
     [
      3,
      0,
      1
     ]
    ]
   },
   {
    "args": [
     [
      0,
      1,
      2,
      3
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      3,
      0,
      1
     ]
    ],
    "expected": 2
   },
   {
    "args": [
     [
      0,
      1
     ]
    ],
    "expected": 2
   },
   {
    "args": [
     [
      1
     ]
    ],
    "expected": 0
   },
   {
    "args": [
     [
      0
     ]
    ],
    "expected": 1
   },
   {
    "args": [
     [
      9,
      6,
      4,
      2,
      3,
      5,
      7,
      0,
      1
     ]
    ],
    "expected": 8
   }
  ],
  "expansion": true,
  "difficulty": "Easy",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Xor Cancellation",
  "description": "XOR every integer from 0 through n and every array value."
 },
 {
  "id": "lc-371",
  "number": 371,
  "problem": "Sum of Two Integers",
  "category": "Binary",
  "fn": "getSum",
  "params": "a, b",
  "signature": {
   "args": [
    [
     "a",
     "int"
    ],
    [
     "b",
     "int"
    ]
   ],
   "result": "int"
  },
  "tag": "XOR + CARRY",
  "lesson": "XOR adds bits without carrying. AND finds positions that generate a carry; shift that carry left. Repeat until carry is zero. Use 32-bit operations and unsigned intermediates in C/C++ to avoid shifting negative signed values. At most 32 passes, O(1) space.",
  "hint": "XOR adds bits without carrying. AND finds positions that generate a carry; shift that carry left. Repeat until carry is zero. Use 32-bit operations and unsigned intermediates in C/C++ to avoid shifting negative signed values. At most 32 passes, O(1) space.",
  "prompt": "Return a + b without using + or − in your solution. Inputs are integers from −1000 through 1000. Return a signed integer.",
  "rounds": [
   {
    "args": [
     5,
     3
    ]
   },
   {
    "args": [
     -2,
     3
    ]
   }
  ],
  "tests": [
   {
    "args": [
     1,
     2
    ],
    "expected": 3
   },
   {
    "args": [
     5,
     3
    ],
    "expected": 8
   },
   {
    "args": [
     -2,
     3
    ],
    "expected": 1
   },
   {
    "args": [
     -5,
     -7
    ],
    "expected": -12
   },
   {
    "args": [
     0,
     0
    ],
    "expected": 0
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Xor + Carry",
  "description": "XOR adds bits without carrying."
 },
 {
  "id": "lc-190",
  "number": 190,
  "problem": "Reverse Bits",
  "category": "Binary",
  "fn": "reverseBits",
  "params": "n",
  "signature": {
   "args": [
    [
     "n",
     "uint"
    ]
   ],
   "result": "uint"
  },
  "tag": "BIT TRANSFER",
  "lesson": "Transfer the low bit of the input into the low bit of a left-shifted answer, then shift the input right. Repeat exactly 32 times, including leading zeros. Java uses an unsigned right shift and the harness displays the unsigned result. O(32) time, O(1) space.",
  "hint": "Transfer the low bit of the input into the low bit of a left-shifted answer, then shift the input right. Repeat exactly 32 times, including leading zeros. Java uses an unsigned right shift and the harness displays the unsigned result. O(32) time, O(1) space.",
  "prompt": "Reverse all 32 bits of the unsigned input. Inputs and displayed outputs range from 0 through 4294967295. Java represents these bit patterns with int.",
  "rounds": [
   {
    "args": [
     13
    ]
   },
   {
    "args": [
     128
    ]
   }
  ],
  "tests": [
   {
    "args": [
     43261596
    ],
    "expected": 964176192
   },
   {
    "args": [
     4294967293
    ],
    "expected": 3221225471
   },
   {
    "args": [
     0
    ],
    "expected": 0
   },
   {
    "args": [
     1
    ],
    "expected": 2147483648
   },
   {
    "args": [
     4294967295
    ],
    "expected": 4294967295
   }
  ],
  "expansion": true,
  "difficulty": "Easy",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Bit Transfer",
  "description": "Transfer the low bit of the input into the low bit of a left-shifted answer, then shift the input right."
 },
 {
  "id": "lc-1143",
  "number": 1143,
  "problem": "Longest Common Subsequence",
  "category": "Dynamic Programming",
  "fn": "longestCommonSubsequence",
  "params": "text1, text2",
  "signature": {
   "args": [
    [
     "text1",
     "string"
    ],
    [
     "text2",
     "string"
    ]
   ],
   "result": "int"
  },
  "tag": "TWO-DIMENSIONAL DP",
  "lesson": "dp[i][j] is the best common subsequence length for the first i and j characters. Matching last characters add one to the diagonal. Otherwise take max(top, left). Initialize the empty-prefix row and column to zero. O(mn) time and O(mn) space.",
  "hint": "dp[i][j] is the best common subsequence length for the first i and j characters. Matching last characters add one to the diagonal. Otherwise take max(top, left). Initialize the empty-prefix row and column to zero. O(mn) time and O(mn) space.",
  "prompt": "Return the length of the longest common subsequence of text1 and text2. Characters may be skipped but their order cannot change. Inputs contain lowercase English letters.",
  "rounds": [
   {
    "args": [
     "abc",
     "ac"
    ]
   },
   {
    "args": [
     "ab",
     "ba"
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "abcde",
     "ace"
    ],
    "expected": 3
   },
   {
    "args": [
     "abc",
     "abc"
    ],
    "expected": 3
   },
   {
    "args": [
     "abc",
     "def"
    ],
    "expected": 0
   },
   {
    "args": [
     "aaaa",
     "aa"
    ],
    "expected": 2
   },
   {
    "args": [
     "ab",
     "ba"
    ],
    "expected": 1
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Two-Dimensional Dp",
  "description": "dp[i][j] is the best common subsequence length for the first i and j characters."
 },
 {
  "id": "lc-377",
  "number": 377,
  "problem": "Combination Sum IV",
  "category": "Dynamic Programming",
  "fn": "combinationSum4",
  "params": "nums, target",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ],
    [
     "target",
     "int"
    ]
   ],
   "result": "int"
  },
  "tag": "ORDERED SUM DP",
  "lesson": "Let dp[0] = 1. For each subtotal in increasing order, add dp[subtotal − number] for each number that fits. This chooses the last number of an ordered sequence. Iterating amounts first counts different orders separately. O(target × n) time, O(target) space.",
  "hint": "Let dp[0] = 1. For each subtotal in increasing order, add dp[subtotal − number] for each number that fits. This chooses the last number of an ordered sequence. Iterating amounts first counts different orders separately. O(target × n) time, O(target) space.",
  "prompt": "Count ordered sequences of positive distinct nums values that sum to target. Numbers may be reused. target is nonnegative; the answer fits signed 32-bit.",
  "rounds": [
   {
    "args": [
     [
      1,
      2
     ],
     4
    ]
   },
   {
    "args": [
     [
      2,
      3
     ],
     5
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      1,
      2,
      3
     ],
     4
    ],
    "expected": 7
   },
   {
    "args": [
     [
      9
     ],
     3
    ],
    "expected": 0
   },
   {
    "args": [
     [
      2
     ],
     4
    ],
    "expected": 1
   },
   {
    "args": [
     [
      1,
      2
     ],
     0
    ],
    "expected": 1
   },
   {
    "args": [
     [
      2,
      3
     ],
     5
    ],
    "expected": 2
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Ordered Sum Dp",
  "description": "Let dp[0] = 1."
 },
 {
  "id": "lc-213",
  "number": 213,
  "problem": "House Robber II",
  "category": "Dynamic Programming",
  "fn": "rob",
  "params": "nums",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ]
   ],
   "result": "int"
  },
  "tag": "CIRCULAR DP",
  "lesson": "The first and last houses are neighbors. For more than one house, compare two linear runs: exclude the last, and exclude the first. In each run, update max(previous best, two-back best + value). Handle a single house directly. O(n) time, O(1) extra space.",
  "hint": "The first and last houses are neighbors. For more than one house, compare two linear runs: exclude the last, and exclude the first. In each run, update max(previous best, two-back best + value). Handle a single house directly. O(n) time, O(1) extra space.",
  "prompt": "Return the maximum money from nonadjacent houses arranged in a circle. nums is nonempty and all values are nonnegative.",
  "rounds": [
   {
    "args": [
     [
      2,
      3,
      2
     ]
    ]
   },
   {
    "args": [
     [
      1,
      2,
      3,
      1
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      2,
      3,
      2
     ]
    ],
    "expected": 3
   },
   {
    "args": [
     [
      1,
      2,
      3,
      1
     ]
    ],
    "expected": 4
   },
   {
    "args": [
     [
      5
     ]
    ],
    "expected": 5
   },
   {
    "args": [
     [
      2,
      7
     ]
    ],
    "expected": 7
   },
   {
    "args": [
     [
      0,
      0,
      0
     ]
    ],
    "expected": 0
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Circular Dp",
  "description": "The first and last houses are neighbors."
 },
 {
  "id": "lc-91",
  "number": 91,
  "problem": "Decode Ways",
  "category": "Dynamic Programming",
  "fn": "numDecodings",
  "params": "s",
  "signature": {
   "args": [
    [
     "s",
     "string"
    ]
   ],
   "result": "int"
  },
  "tag": "ONE- OR TWO-DIGIT DP",
  "lesson": "A nonzero digit can extend every decoding of the previous prefix. A two-digit value from 10 through 26 can extend every decoding two positions back. Add both counts. Zero cannot stand alone. dp[0] = 1. O(n) time; two previous totals give O(1) space.",
  "hint": "A nonzero digit can extend every decoding of the previous prefix. A two-digit value from 10 through 26 can extend every decoding two positions back. Add both counts. Zero cannot stand alone. dp[0] = 1. O(n) time; two previous totals give O(1) space.",
  "prompt": "Digits map 1 to A through 26 to Z. Count decodings of a nonempty digit string. Leading zeros are invalid. The answer fits signed 32-bit.",
  "rounds": [
   {
    "args": [
     "226"
    ]
   },
   {
    "args": [
     "100"
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "12"
    ],
    "expected": 2
   },
   {
    "args": [
     "226"
    ],
    "expected": 3
   },
   {
    "args": [
     "06"
    ],
    "expected": 0
   },
   {
    "args": [
     "10"
    ],
    "expected": 1
   },
   {
    "args": [
     "2101"
    ],
    "expected": 1
   },
   {
    "args": [
     "100"
    ],
    "expected": 0
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "One- Or Two-Digit Dp",
  "description": "A nonzero digit can extend every decoding of the previous prefix."
 },
 {
  "id": "lc-62",
  "number": 62,
  "problem": "Unique Paths",
  "category": "Dynamic Programming",
  "fn": "uniquePaths",
  "params": "m, n",
  "signature": {
   "args": [
    [
     "m",
     "int"
    ],
    [
     "n",
     "int"
    ]
   ],
   "result": "int"
  },
  "tag": "GRID DP",
  "lesson": "Each cell receives paths from above and from its left. Start the top-left cell at 1; first-row and first-column cells have one route. Fill row by row. O(mn) time; a rolling row uses O(n) space.",
  "hint": "Each cell receives paths from above and from its left. Start the top-left cell at 1; first-row and first-column cells have one route. Fill row by row. O(mn) time; a rolling row uses O(n) space.",
  "prompt": "Count paths from top-left to bottom-right in an m × n grid, moving only right or down. m and n are positive; the answer fits signed 32-bit.",
  "rounds": [
   {
    "args": [
     3,
     3
    ]
   },
   {
    "args": [
     2,
     4
    ]
   }
  ],
  "tests": [
   {
    "args": [
     3,
     7
    ],
    "expected": 28
   },
   {
    "args": [
     3,
     2
    ],
    "expected": 3
   },
   {
    "args": [
     1,
     1
    ],
    "expected": 1
   },
   {
    "args": [
     1,
     8
    ],
    "expected": 1
   },
   {
    "args": [
     4,
     4
    ],
    "expected": 20
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Grid Dp",
  "description": "Each cell receives paths from above and from its left."
 },
 {
  "id": "lc-128",
  "number": 128,
  "problem": "Longest Consecutive Sequence",
  "category": "Graph",
  "fn": "longestConsecutive",
  "params": "nums",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ]
   ],
   "result": "int"
  },
  "tag": "SET · SEQUENCE STARTS",
  "lesson": "Put values in a set. Only begin a run at x when x − 1 is absent; then advance while the next value exists. Duplicates do not extend runs. Starting only at run heads visits each distinct value at most twice. Expected O(n) time, O(n) space.",
  "hint": "Put values in a set. Only begin a run at x when x − 1 is absent; then advance while the next value exists. Duplicates do not extend runs. Starting only at run heads visits each distinct value at most twice. Expected O(n) time, O(n) space.",
  "prompt": "Return the length of the longest run of consecutive integer values, regardless of input order. nums may be empty or contain duplicates.",
  "rounds": [
   {
    "args": [
     [
      100,
      4,
      200,
      1,
      3,
      2
     ]
    ]
   },
   {
    "args": [
     [
      0,
      1,
      1,
      2
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      100,
      4,
      200,
      1,
      3,
      2
     ]
    ],
    "expected": 4
   },
   {
    "args": [
     [
      0,
      3,
      7,
      2,
      5,
      8,
      4,
      6,
      0,
      1
     ]
    ],
    "expected": 9
   },
   {
    "args": [
     []
    ],
    "expected": 0
   },
   {
    "args": [
     [
      1,
      2,
      0,
      1
     ]
    ],
    "expected": 3
   },
   {
    "args": [
     [
      -2,
      -1,
      1
     ]
    ],
    "expected": 2
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Set · Sequence Starts",
  "description": "Put values in a set."
 },
 {
  "id": "lc-261",
  "number": 261,
  "problem": "Graph Valid Tree",
  "category": "Graph",
  "fn": "validTree",
  "params": "n, edges",
  "signature": {
   "args": [
    [
     "n",
     "int"
    ],
    [
     "edges",
     "intmatrix"
    ]
   ],
   "result": "bool"
  },
  "tag": "DISJOINT SET UNION",
  "lesson": "Begin with one disjoint set per node. For each undirected edge, find both roots; merge different roots and reduce the component count. Equal roots mean the edge closes a cycle. A tree must be connected and acyclic. With path compression and union by rank, time is O((V + E) α(V)); space O(V).",
  "hint": "Begin with one disjoint set per node. For each undirected edge, find both roots; merge different roots and reduce the component count. Equal roots mean the edge closes a cycle. A tree must be connected and acyclic. With path compression and union by rank, time is O((V + E) α(V)); space O(V).",
  "prompt": "Nodes are numbered 0 through n − 1. Edges are distinct undirected pairs of different nodes; n is positive. Return whether the graph is a tree.",
  "rounds": [
   {
    "args": [
     4,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       2,
       3
      ]
     ]
    ]
   },
   {
    "args": [
     4,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       2,
       0
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     5,
     [
      [
       0,
       1
      ],
      [
       0,
       2
      ],
      [
       0,
       3
      ],
      [
       1,
       4
      ]
     ]
    ],
    "expected": true
   },
   {
    "args": [
     5,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       3,
       4
      ]
     ]
    ],
    "expected": false
   },
   {
    "args": [
     3,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       2,
       0
      ]
     ]
    ],
    "expected": false
   },
   {
    "args": [
     1,
     []
    ],
    "expected": true
   },
   {
    "args": [
     4,
     []
    ],
    "expected": false
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Disjoint Set Union",
  "description": "Begin with one disjoint set per node."
 },
 {
  "id": "lc-323",
  "number": 323,
  "problem": "Number of Connected Components in an Undirected Graph",
  "category": "Graph",
  "fn": "countComponents",
  "params": "n, edges",
  "signature": {
   "args": [
    [
     "n",
     "int"
    ],
    [
     "edges",
     "intmatrix"
    ]
   ],
   "result": "int"
  },
  "tag": "DISJOINT SET UNION",
  "lesson": "Begin with one disjoint set per node. For each undirected edge, find both roots; merge different roots and reduce the component count. Equal roots mean the edge closes a cycle. A tree must be connected and acyclic. With path compression and union by rank, time is O((V + E) α(V)); space O(V).",
  "hint": "Begin with one disjoint set per node. For each undirected edge, find both roots; merge different roots and reduce the component count. Equal roots mean the edge closes a cycle. A tree must be connected and acyclic. With path compression and union by rank, time is O((V + E) α(V)); space O(V).",
  "prompt": "Nodes are numbered 0 through n − 1. Edges are distinct undirected pairs of different nodes; n is positive. Return the number of connected components, including isolated nodes.",
  "rounds": [
   {
    "args": [
     4,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       2,
       3
      ]
     ]
    ]
   },
   {
    "args": [
     4,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       2,
       0
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     5,
     [
      [
       0,
       1
      ],
      [
       0,
       2
      ],
      [
       0,
       3
      ],
      [
       1,
       4
      ]
     ]
    ],
    "expected": 1
   },
   {
    "args": [
     5,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       3,
       4
      ]
     ]
    ],
    "expected": 2
   },
   {
    "args": [
     3,
     [
      [
       0,
       1
      ],
      [
       1,
       2
      ],
      [
       2,
       0
      ]
     ]
    ],
    "expected": 1
   },
   {
    "args": [
     1,
     []
    ],
    "expected": 1
   },
   {
    "args": [
     4,
     []
    ],
    "expected": 4
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Disjoint Set Union",
  "description": "Begin with one disjoint set per node."
 },
 {
  "id": "lc-252",
  "number": 252,
  "problem": "Meeting Rooms",
  "category": "Interval",
  "fn": "canAttendMeetings",
  "params": "intervals",
  "signature": {
   "args": [
    [
     "intervals",
     "intmatrix"
    ]
   ],
   "result": "bool"
  },
  "tag": "SORT BY START",
  "lesson": "Sort meetings by start time. If any next start is smaller than the previous end, the meetings overlap. Touching endpoints do not overlap. O(n log n) time for sorting and O(1) scan space.",
  "hint": "Sort meetings by start time. If any next start is smaller than the previous end, the meetings overlap. Touching endpoints do not overlap. O(n log n) time for sorting and O(1) scan space.",
  "prompt": "Return whether one person can attend every meeting. Each interval has start < end. Empty input is allowed; a meeting may begin when another ends.",
  "rounds": [
   {
    "args": [
     [
      [
       0,
       3
      ],
      [
       3,
       5
      ],
      [
       6,
       8
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       4
      ],
      [
       2,
       3
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       0,
       30
      ],
      [
       5,
       10
      ],
      [
       15,
       20
      ]
     ]
    ],
    "expected": false
   },
   {
    "args": [
     [
      [
       7,
       10
      ],
      [
       2,
       4
      ]
     ]
    ],
    "expected": true
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       2,
       3
      ]
     ]
    ],
    "expected": true
   },
   {
    "args": [
     []
    ],
    "expected": true
   },
   {
    "args": [
     [
      [
       1,
       4
      ],
      [
       1,
       3
      ]
     ]
    ],
    "expected": false
   }
  ],
  "expansion": true,
  "difficulty": "Easy",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Sort By Start",
  "description": "Sort meetings by start time."
 },
 {
  "id": "lc-253",
  "number": 253,
  "problem": "Meeting Rooms II",
  "category": "Interval",
  "fn": "minMeetingRooms",
  "params": "intervals",
  "signature": {
   "args": [
    [
     "intervals",
     "intmatrix"
    ]
   ],
   "result": "int"
  },
  "tag": "SWEEP LINE",
  "lesson": "Turn starts into +1 events and ends into −1 events. Sort by time, processing ends before starts on a tie. Sweep the active meeting count; its maximum is the minimum rooms needed. O(n log n) time, O(n) space.",
  "hint": "Turn starts into +1 events and ends into −1 events. Sort by time, processing ends before starts on a tie. Sweep the active meeting count; its maximum is the minimum rooms needed. O(n log n) time, O(n) space.",
  "prompt": "Return the minimum rooms for all meetings. Each interval has start < end. A room can be reused at the exact end time. Empty input needs zero rooms.",
  "rounds": [
   {
    "args": [
     [
      [
       0,
       4
      ],
      [
       1,
       3
      ],
      [
       3,
       5
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       2,
       3
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       0,
       30
      ],
      [
       5,
       10
      ],
      [
       15,
       20
      ]
     ]
    ],
    "expected": 2
   },
   {
    "args": [
     [
      [
       7,
       10
      ],
      [
       2,
       4
      ]
     ]
    ],
    "expected": 1
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       2,
       3
      ]
     ]
    ],
    "expected": 1
   },
   {
    "args": [
     []
    ],
    "expected": 0
   },
   {
    "args": [
     [
      [
       1,
       5
      ],
      [
       1,
       5
      ],
      [
       1,
       5
      ]
     ]
    ],
    "expected": 3
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Sweep Line",
  "description": "Turn starts into +1 events and ends into −1 events."
 },
 {
  "id": "lc-125",
  "number": 125,
  "problem": "Valid Palindrome",
  "category": "String",
  "fn": "isPalindrome",
  "params": "s",
  "signature": {
   "args": [
    [
     "s",
     "string"
    ]
   ],
   "result": "bool"
  },
  "tag": "TWO POINTERS",
  "lesson": "Move inward from both ends. Skip non-alphanumeric ASCII characters and compare letters case-insensitively. Reject the first unequal pair; crossing pointers means every pair matched. O(n) time, O(1) extra space.",
  "hint": "Move inward from both ends. Skip non-alphanumeric ASCII characters and compare letters case-insensitively. Reject the first unequal pair; crossing pointers means every pair matched. O(n) time, O(1) extra space.",
  "prompt": "After ignoring non-alphanumeric ASCII characters and letter case, return whether s reads the same forward and backward. Empty filtered strings are palindromes.",
  "rounds": [
   {
    "args": [
     "A, b a!"
    ]
   },
   {
    "args": [
     "race a car"
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "A man, a plan, a canal: Panama"
    ],
    "expected": true
   },
   {
    "args": [
     "race a car"
    ],
    "expected": false
   },
   {
    "args": [
     " "
    ],
    "expected": true
   },
   {
    "args": [
     "0P"
    ],
    "expected": false
   },
   {
    "args": [
     ""
    ],
    "expected": true
   }
  ],
  "expansion": true,
  "difficulty": "Easy",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Two Pointers",
  "description": "Move inward from both ends."
 },
 {
  "id": "lc-5",
  "number": 5,
  "problem": "Longest Palindromic Substring",
  "category": "String",
  "fn": "longestPalindrome",
  "params": "s",
  "signature": {
   "args": [
    [
     "s",
     "string"
    ]
   ],
   "result": "string"
  },
  "tag": "EXPAND AROUND CENTERS",
  "lesson": "Try each character and each gap as a center. Expand while both characters match and stay in bounds. Save the longest matching span. Odd and even lengths need separate centers. O(n²) time and O(1) extra space beyond the returned substring.",
  "hint": "Try each character and each gap as a center. Expand while both characters match and stay in bounds. Save the longest matching span. Odd and even lengths need separate centers. O(n²) time and O(1) extra space beyond the returned substring.",
  "prompt": "Return any longest contiguous palindromic substring of nonempty s. Comparisons are case-sensitive; inputs contain ASCII letters and digits.",
  "rounds": [
   {
    "args": [
     "babad"
    ]
   },
   {
    "args": [
     "cbbd"
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "babad"
    ],
    "expected": "bab"
   },
   {
    "args": [
     "cbbd"
    ],
    "expected": "bb"
   },
   {
    "args": [
     "a"
    ],
    "expected": "a"
   },
   {
    "args": [
     "aaaa"
    ],
    "expected": "aaaa"
   },
   {
    "args": [
     "ac"
    ],
    "expected": "a"
   }
  ],
  "validation": "palindrome",
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Expand Around Centers",
  "description": "Try each character and each gap as a center."
 },
 {
  "id": "lc-647",
  "number": 647,
  "problem": "Palindromic Substrings",
  "category": "String",
  "fn": "countSubstrings",
  "params": "s",
  "signature": {
   "args": [
    [
     "s",
     "string"
    ]
   ],
   "result": "int"
  },
  "tag": "COUNT CENTER EXPANSIONS",
  "lesson": "Try every character and gap as a center. Each successful symmetric expansion identifies one distinct interval and contributes one palindrome. Equal text at different positions counts separately. O(n²) time, O(1) extra space.",
  "hint": "Try every character and gap as a center. Each successful symmetric expansion identifies one distinct interval and contributes one palindrome. Equal text at different positions counts separately. O(n²) time, O(1) extra space.",
  "prompt": "Count contiguous palindromic substrings of nonempty s. Count different start/end positions separately. Inputs contain lowercase English letters.",
  "rounds": [
   {
    "args": [
     "aaa"
    ]
   },
   {
    "args": [
     "aba"
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "abc"
    ],
    "expected": 3
   },
   {
    "args": [
     "aaa"
    ],
    "expected": 6
   },
   {
    "args": [
     "aba"
    ],
    "expected": 4
   },
   {
    "args": [
     "abba"
    ],
    "expected": 6
   },
   {
    "args": [
     "a"
    ],
    "expected": 1
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Count Center Expansions",
  "description": "Try every character and gap as a center."
 },
 {
  "id": "lc-424",
  "number": 424,
  "problem": "Longest Repeating Character Replacement",
  "category": "String",
  "fn": "characterReplacement",
  "params": "s, k",
  "signature": {
   "args": [
    [
     "s",
     "string"
    ],
    [
     "k",
     "int"
    ]
   ],
   "result": "int"
  },
  "tag": "SLIDING WINDOW",
  "lesson": "For a window, replacements needed equal its length minus its most frequent character count. Expand right; while more than k replacements are needed, shrink left. Track the longest valid length. Recomputing the maximum over 26 letters still gives O(n) time and O(1) alphabet space.",
  "hint": "For a window, replacements needed equal its length minus its most frequent character count. Expand right; while more than k replacements are needed, shrink left. Track the longest valid length. Recomputing the maximum over 26 letters still gives O(n) time and O(1) alphabet space.",
  "prompt": "s contains uppercase English letters. Replace at most k characters so a contiguous substring has one repeated character. Return its maximum possible length; k is nonnegative.",
  "rounds": [
   {
    "args": [
     "AABABBA",
     1
    ]
   },
   {
    "args": [
     "ABAB",
     2
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "ABAB",
     2
    ],
    "expected": 4
   },
   {
    "args": [
     "AABABBA",
     1
    ],
    "expected": 4
   },
   {
    "args": [
     "AAAA",
     0
    ],
    "expected": 4
   },
   {
    "args": [
     "ABCD",
     0
    ],
    "expected": 1
   },
   {
    "args": [
     "ABCDE",
     2
    ],
    "expected": 3
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Sliding Window",
  "description": "For a window, replacements needed equal its length minus its most frequent character count."
 },
 {
  "id": "lc-139",
  "number": 139,
  "problem": "Word Break",
  "category": "Dynamic Programming",
  "fn": "wordBreak",
  "params": "s, wordDict",
  "signature": {
   "args": [
    [
     "s",
     "string"
    ],
    [
     "wordDict",
     "strings"
    ]
   ],
   "result": "bool"
  },
  "tag": "PREFIX SEGMENTATION DP",
  "lesson": "dp[i] says the first i characters can be segmented. Begin with dp[0] = true. A matching word ending at i makes dp[i] true if the prefix before it is reachable. Words may be reused. With direct word comparisons, time is O(n × dictionary size × maximum word length), space O(n).",
  "hint": "dp[i] says the first i characters can be segmented. Begin with dp[0] = true. A matching word ending at i makes dp[i] true if the prefix before it is reachable. Words may be reused. With direct word comparisons, time is O(n × dictionary size × maximum word length), space O(n).",
  "prompt": "Return whether nonempty lowercase s can be split into one or more dictionary words. Dictionary words are nonempty, distinct, and reusable.",
  "rounds": [
   {
    "args": [
     "leetcode",
     [
      "leet",
      "code"
     ]
    ]
   },
   {
    "args": [
     "catsandog",
     [
      "cats",
      "dog",
      "sand",
      "and",
      "cat"
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     "leetcode",
     [
      "leet",
      "code"
     ]
    ],
    "expected": true
   },
   {
    "args": [
     "applepenapple",
     [
      "apple",
      "pen"
     ]
    ],
    "expected": true
   },
   {
    "args": [
     "catsandog",
     [
      "cats",
      "dog",
      "sand",
      "and",
      "cat"
     ]
    ],
    "expected": false
   },
   {
    "args": [
     "aaaa",
     [
      "a",
      "aa"
     ]
    ],
    "expected": true
   },
   {
    "args": [
     "abc",
     [
      "ab",
      "bc"
     ]
    ],
    "expected": false
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Prefix Segmentation Dp",
  "description": "dp[i] says the first i characters can be segmented."
 },
 {
  "id": "lc-238",
  "number": 238,
  "problem": "Product of Array Except Self",
  "category": "Array",
  "fn": "productExceptSelf",
  "params": "nums",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ]
   ],
   "result": "array"
  },
  "tag": "PREFIX × SUFFIX",
  "lesson": "First save the product strictly to the left of every index. Then scan right-to-left with a running suffix product, multiplying it into each saved prefix. This handles zeros without division. O(n) time and O(1) extra space excluding the returned array.",
  "hint": "First save the product strictly to the left of every index. Then scan right-to-left with a running suffix product, multiplying it into each saved prefix. This handles zeros without division. O(n) time and O(1) extra space excluding the returned array.",
  "prompt": "Return an array whose entry i is the product of every nums value except nums[i]. Use no division. At least two values; prefix, suffix, and answer products fit signed 32-bit.",
  "rounds": [
   {
    "args": [
     [
      1,
      2,
      3,
      4
     ]
    ]
   },
   {
    "args": [
     [
      2,
      0,
      3
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      1,
      2,
      3,
      4
     ]
    ],
    "expected": [
     24,
     12,
     8,
     6
    ]
   },
   {
    "args": [
     [
      -1,
      1,
      0,
      -3,
      3
     ]
    ],
    "expected": [
     0,
     0,
     9,
     0,
     0
    ]
   },
   {
    "args": [
     [
      0,
      0
     ]
    ],
    "expected": [
     0,
     0
    ]
   },
   {
    "args": [
     [
      2,
      3
     ]
    ],
    "expected": [
     3,
     2
    ]
   },
   {
    "args": [
     [
      -2,
      -3,
      -4
     ]
    ],
    "expected": [
     12,
     8,
     6
    ]
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Prefix × Suffix",
  "description": "First save the product strictly to the left of every index."
 },
 {
  "id": "lc-338",
  "number": 338,
  "problem": "Counting Bits",
  "category": "Binary",
  "fn": "countBits",
  "params": "n",
  "signature": {
   "args": [
    [
     "n",
     "int"
    ]
   ],
   "result": "array"
  },
  "tag": "BIT DP",
  "lesson": "Removing the lowest bit gives i >> 1. Its saved bit count plus (i & 1) is the count for i. Start dp[0] = 0 and fill increasing i. O(n) time and O(n) output space.",
  "hint": "Removing the lowest bit gives i >> 1. Its saved bit count plus (i & 1) is the count for i. Start dp[0] = 0 and fill increasing i. O(n) time and O(n) output space.",
  "prompt": "Return counts of 1 bits for every integer from 0 through n inclusive. n is nonnegative.",
  "rounds": [
   {
    "args": [
     5
    ]
   },
   {
    "args": [
     8
    ]
   }
  ],
  "tests": [
   {
    "args": [
     2
    ],
    "expected": [
     0,
     1,
     1
    ]
   },
   {
    "args": [
     5
    ],
    "expected": [
     0,
     1,
     1,
     2,
     1,
     2
    ]
   },
   {
    "args": [
     0
    ],
    "expected": [
     0
    ]
   },
   {
    "args": [
     1
    ],
    "expected": [
     0,
     1
    ]
   },
   {
    "args": [
     12
    ],
    "expected": [
     0,
     1,
     1,
     2,
     1,
     2,
     2,
     3,
     1,
     2,
     2,
     3,
     2
    ]
   }
  ],
  "expansion": true,
  "difficulty": "Easy",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Bit Dp",
  "description": "Removing the lowest bit gives i >> 1."
 },
 {
  "id": "lc-54",
  "number": 54,
  "problem": "Spiral Matrix",
  "category": "Matrix",
  "fn": "spiralOrder",
  "params": "matrix",
  "signature": {
   "args": [
    [
     "matrix",
     "intmatrix"
    ]
   ],
   "result": "array"
  },
  "tag": "SHRINKING BOUNDARIES",
  "lesson": "Maintain top, bottom, left, and right bounds. Traverse top row, right column, bottom row, and left column; shrink a bound after consuming its edge. Recheck bounds before the bottom and left edges to avoid duplicates. O(rows × columns) time, O(1) extra space excluding output.",
  "hint": "Maintain top, bottom, left, and right bounds. Traverse top row, right column, bottom row, and left column; shrink a bound after consuming its edge. Recheck bounds before the bottom and left edges to avoid duplicates. O(rows × columns) time, O(1) extra space excluding output.",
  "prompt": "Return all values of a nonempty rectangular matrix in clockwise spiral order.",
  "rounds": [
   {
    "args": [
     [
      [
       1,
       2,
       3
      ],
      [
       4,
       5,
       6
      ],
      [
       7,
       8,
       9
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2,
       3,
       4
      ],
      [
       5,
       6,
       7,
       8
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       1,
       2,
       3
      ],
      [
       4,
       5,
       6
      ],
      [
       7,
       8,
       9
      ]
     ]
    ],
    "expected": [
     1,
     2,
     3,
     6,
     9,
     8,
     7,
     4,
     5
    ]
   },
   {
    "args": [
     [
      [
       1,
       2,
       3
      ]
     ]
    ],
    "expected": [
     1,
     2,
     3
    ]
   },
   {
    "args": [
     [
      [
       1
      ],
      [
       2
      ],
      [
       3
      ]
     ]
    ],
    "expected": [
     1,
     2,
     3
    ]
   },
   {
    "args": [
     [
      [
       5
      ]
     ]
    ],
    "expected": [
     5
    ]
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       3,
       4
      ]
     ]
    ],
    "expected": [
     1,
     2,
     4,
     3
    ]
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Shrinking Boundaries",
  "description": "Maintain top, bottom, left, and right bounds."
 },
 {
  "id": "lc-347",
  "number": 347,
  "problem": "Top K Frequent Elements",
  "category": "Heap",
  "fn": "topKFrequent",
  "params": "nums, k",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ],
    [
     "k",
     "int"
    ]
   ],
   "result": "array"
  },
  "tag": "FREQUENCY BUCKETS",
  "lesson": "Count each distinct value. Place it in the bucket indexed by its frequency, then scan buckets from highest frequency down until k values are collected. This bucket alternative to a heap takes expected O(n) time and O(n) space.",
  "hint": "Count each distinct value. Place it in the bucket indexed by its frequency, then scan buckets from highest frequency down until k values are collected. This bucket alternative to a heap takes expected O(n) time and O(n) space.",
  "prompt": "Return the k most frequent distinct values in nums, in any order. The answer is unique: no tie crosses the kth boundary. k is between 1 and the number of distinct values.",
  "rounds": [
   {
    "args": [
     [
      1,
      1,
      1,
      2,
      2,
      3
     ],
     2
    ]
   },
   {
    "args": [
     [
      4,
      4,
      5,
      6,
      6,
      6
     ],
     1
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      1,
      1,
      1,
      2,
      2,
      3
     ],
     2
    ],
    "expected": [
     1,
     2
    ]
   },
   {
    "args": [
     [
      1
     ],
     1
    ],
    "expected": [
     1
    ]
   },
   {
    "args": [
     [
      -1,
      -1,
      2,
      2,
      2,
      3
     ],
     2
    ],
    "expected": [
     2,
     -1
    ]
   },
   {
    "args": [
     [
      4,
      5,
      6
     ],
     3
    ],
    "expected": [
     4,
     5,
     6
    ]
   },
   {
    "args": [
     [
      0,
      0,
      0,
      1
     ],
     1
    ],
    "expected": [
     0
    ]
   }
  ],
  "validation": "set",
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Frequency Buckets",
  "description": "Count each distinct value."
 },
 {
  "id": "lc-56",
  "number": 56,
  "problem": "Merge Intervals",
  "category": "Interval",
  "fn": "merge",
  "params": "intervals",
  "signature": {
   "args": [
    [
     "intervals",
     "intmatrix"
    ]
   ],
   "result": "intmatrix"
  },
  "tag": "SORT + MERGE",
  "lesson": "Sort by start. Compare each interval with the last output interval. If they touch or overlap, extend the last end; otherwise append a new interval. Unlike meeting scheduling, touching endpoints merge here. O(n log n) time and O(n) output space.",
  "hint": "Sort by start. Compare each interval with the last output interval. If they touch or overlap, extend the last end; otherwise append a new interval. Unlike meeting scheduling, touching endpoints merge here. O(n log n) time and O(n) output space.",
  "prompt": "Merge all overlapping closed intervals, including touching endpoints. Return non-overlapping intervals sorted by start. Input has at least one interval and start ≤ end.",
  "rounds": [
   {
    "args": [
     [
      [
       1,
       3
      ],
      [
       2,
       6
      ],
      [
       8,
       10
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       4
      ],
      [
       4,
       5
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       1,
       3
      ],
      [
       2,
       6
      ],
      [
       8,
       10
      ],
      [
       15,
       18
      ]
     ]
    ],
    "expected": [
     [
      1,
      6
     ],
     [
      8,
      10
     ],
     [
      15,
      18
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       4
      ],
      [
       4,
       5
      ]
     ]
    ],
    "expected": [
     [
      1,
      5
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       4
      ],
      [
       2,
       3
      ]
     ]
    ],
    "expected": [
     [
      1,
      4
     ]
    ]
   },
   {
    "args": [
     [
      [
       5,
       6
      ],
      [
       1,
       2
      ]
     ]
    ],
    "expected": [
     [
      1,
      2
     ],
     [
      5,
      6
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       1
      ]
     ]
    ],
    "expected": [
     [
      1,
      1
     ]
    ]
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Sort + Merge",
  "description": "Sort by start."
 },
 {
  "id": "lc-57",
  "number": 57,
  "problem": "Insert Interval",
  "category": "Interval",
  "fn": "insert",
  "params": "intervals, newInterval",
  "signature": {
   "args": [
    [
     "intervals",
     "intmatrix"
    ],
    [
     "newInterval",
     "array"
    ]
   ],
   "result": "intmatrix"
  },
  "tag": "THREE-PHASE MERGE",
  "lesson": "Copy intervals strictly before the new one. Merge every interval whose start is no greater than the growing new end. Append that merged interval, then copy the remaining intervals. Input is already sorted and disjoint. O(n) time and O(n) output space.",
  "hint": "Copy intervals strictly before the new one. Merge every interval whose start is no greater than the growing new end. Append that merged interval, then copy the remaining intervals. Input is already sorted and disjoint. O(n) time and O(n) output space.",
  "prompt": "Insert one closed interval into sorted non-overlapping closed intervals, merging overlaps and touching endpoints. Return sorted intervals. Existing intervals may be empty.",
  "rounds": [
   {
    "args": [
     [
      [
       1,
       3
      ],
      [
       6,
       9
      ]
     ],
     [
      2,
      5
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       3,
       5
      ],
      [
       6,
       7
      ],
      [
       8,
       10
      ]
     ],
     [
      4,
      8
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       1,
       3
      ],
      [
       6,
       9
      ]
     ],
     [
      2,
      5
     ]
    ],
    "expected": [
     [
      1,
      5
     ],
     [
      6,
      9
     ]
    ]
   },
   {
    "args": [
     [],
     [
      2,
      4
     ]
    ],
    "expected": [
     [
      2,
      4
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       5
      ]
     ],
     [
      2,
      3
     ]
    ],
    "expected": [
     [
      1,
      5
     ]
    ]
   },
   {
    "args": [
     [
      [
       3,
       4
      ]
     ],
     [
      0,
      1
     ]
    ],
    "expected": [
     [
      0,
      1
     ],
     [
      3,
      4
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       4,
       5
      ]
     ],
     [
      2,
      4
     ]
    ],
    "expected": [
     [
      1,
      5
     ]
    ]
   }
  ],
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Three-Phase Merge",
  "description": "Copy intervals strictly before the new one."
 },
 {
  "id": "lc-73",
  "number": 73,
  "problem": "Set Matrix Zeroes",
  "category": "Matrix",
  "fn": "setZeroes",
  "params": "matrix",
  "signature": {
   "args": [
    [
     "matrix",
     "intmatrix"
    ]
   ],
   "result": "intmatrix"
  },
  "tag": "MARK ROWS + COLUMNS",
  "lesson": "Record which rows and columns contain an original zero before changing any cell. Then zero their union. A newly written zero must not trigger another row or column. The game uses O(rows + columns) marker space and O(rows × columns) time; first-row/column markers can reduce extra space to O(1).",
  "hint": "Record which rows and columns contain an original zero before changing any cell. Then zero their union. A newly written zero must not trigger another row or column. The game uses O(rows + columns) marker space and O(rows × columns) time; first-row/column markers can reduce extra space to O(1).",
  "prompt": "Modify the nonempty rectangular matrix in place: if an original cell is zero, set its entire row and column to zero. Return nothing; the runner checks the mutated matrix.",
  "rounds": [
   {
    "args": [
     [
      [
       1,
       1,
       1
      ],
      [
       1,
       0,
       1
      ],
      [
       1,
       1,
       1
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       0,
       1,
       2
      ],
      [
       3,
       4,
       5
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       1,
       1,
       1
      ],
      [
       1,
       0,
       1
      ],
      [
       1,
       1,
       1
      ]
     ]
    ],
    "expected": [
     [
      1,
      0,
      1
     ],
     [
      0,
      0,
      0
     ],
     [
      1,
      0,
      1
     ]
    ]
   },
   {
    "args": [
     [
      [
       0,
       1,
       2
      ],
      [
       3,
       4,
       5
      ]
     ]
    ],
    "expected": [
     [
      0,
      0,
      0
     ],
     [
      0,
      4,
      5
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       3,
       4
      ]
     ]
    ],
    "expected": [
     [
      1,
      2
     ],
     [
      3,
      4
     ]
    ]
   },
   {
    "args": [
     [
      [
       0
      ]
     ]
    ],
    "expected": [
     [
      0
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       0,
       3
      ]
     ]
    ],
    "expected": [
     [
      0,
      0,
      0
     ]
    ]
   }
  ],
  "mutates": 0,
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Mark Rows + Columns",
  "description": "Record which rows and columns contain an original zero before changing any cell."
 },
 {
  "id": "lc-48",
  "number": 48,
  "problem": "Rotate Image",
  "category": "Matrix",
  "fn": "rotate",
  "params": "matrix",
  "signature": {
   "args": [
    [
     "matrix",
     "intmatrix"
    ]
   ],
   "result": "intmatrix"
  },
  "tag": "TRANSPOSE + REVERSE",
  "lesson": "Transpose the square matrix by swapping across its main diagonal. Then reverse every row. The composition maps (row, column) to (column, n − 1 − row), a clockwise quarter-turn. O(n²) time and O(1) extra space.",
  "hint": "Transpose the square matrix by swapping across its main diagonal. Then reverse every row. The composition maps (row, column) to (column, n − 1 − row), a clockwise quarter-turn. O(n²) time and O(1) extra space.",
  "prompt": "Rotate the nonempty n × n matrix 90 degrees clockwise in place. Return nothing; the runner checks the mutated matrix.",
  "rounds": [
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       3,
       4
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2,
       3
      ],
      [
       4,
       5,
       6
      ],
      [
       7,
       8,
       9
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       3,
       4
      ]
     ]
    ],
    "expected": [
     [
      3,
      1
     ],
     [
      4,
      2
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2,
       3
      ],
      [
       4,
       5,
       6
      ],
      [
       7,
       8,
       9
      ]
     ]
    ],
    "expected": [
     [
      7,
      4,
      1
     ],
     [
      8,
      5,
      2
     ],
     [
      9,
      6,
      3
     ]
    ]
   },
   {
    "args": [
     [
      [
       1
      ]
     ]
    ],
    "expected": [
     [
      1
     ]
    ]
   },
   {
    "args": [
     [
      [
       0,
       -1
      ],
      [
       2,
       3
      ]
     ]
    ],
    "expected": [
     [
      2,
      0
     ],
     [
      3,
      -1
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       1
      ],
      [
       1,
       1
      ]
     ]
    ],
    "expected": [
     [
      1,
      1
     ],
     [
      1,
      1
     ]
    ]
   }
  ],
  "mutates": 0,
  "expansion": true,
  "difficulty": "Medium",
  "color": "mint",
  "time": "8–15 min",
  "concept": "Transpose + Reverse",
  "description": "Transpose the square matrix by swapping across its main diagonal."
 },
 {
  "id": "lc-15",
  "number": 15,
  "problem": "3Sum",
  "category": "Array",
  "fn": "threeSum",
  "params": "nums",
  "signature": {
   "args": [
    [
     "nums",
     "array"
    ]
   ],
   "result": "intmatrix"
  },
  "tag": "SORT + TWO POINTERS",
  "lesson": "Sort the values. Fix each distinct first value and move two pointers through the suffix: increase left for a negative sum, decrease right for a positive sum. Record a zero sum and skip duplicate values at both ends. O(n²) time; sorting uses implementation-dependent workspace.",
  "hint": "Sort the values. Fix each distinct first value and move two pointers through the suffix: increase left for a negative sum, decrease right for a positive sum. Record a zero sum and skip duplicate values at both ends. O(n²) time; sorting uses implementation-dependent workspace.",
  "prompt": "Return every distinct value triplet summing to zero, using three different indices. Triplet order and output order do not matter. nums contains at least three values.",
  "rounds": [
   {
    "args": [
     [
      -1,
      0,
      1,
      2,
      -1,
      -4
     ]
    ]
   },
   {
    "args": [
     [
      0,
      0,
      0,
      0
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      -1,
      0,
      1,
      2,
      -1,
      -4
     ]
    ],
    "expected": [
     [
      -1,
      -1,
      2
     ],
     [
      -1,
      0,
      1
     ]
    ]
   },
   {
    "args": [
     [
      0,
      0,
      0,
      0
     ]
    ],
    "expected": [
     [
      0,
      0,
      0
     ]
    ]
   },
   {
    "args": [
     [
      1,
      2,
      -2,
      -1
     ]
    ],
    "expected": []
   },
   {
    "args": [
     [
      -2,
      0,
      1,
      1,
      2
     ]
    ],
    "expected": [
     [
      -2,
      0,
      2
     ],
     [
      -2,
      1,
      1
     ]
    ]
   },
   {
    "args": [
     [
      -1,
      0,
      1
     ]
    ],
    "expected": [
     [
      -1,
      0,
      1
     ]
    ]
   }
  ],
  "validation": "triplets",
  "expansion": true,
  "difficulty": "Medium",
  "color": "peach",
  "time": "8–15 min",
  "concept": "Sort + Two Pointers",
  "description": "Sort the values."
 },
 {
  "id": "lc-417",
  "number": 417,
  "problem": "Pacific Atlantic Water Flow",
  "category": "Graph",
  "fn": "pacificAtlantic",
  "params": "heights",
  "signature": {
   "args": [
    [
     "heights",
     "intmatrix"
    ]
   ],
   "result": "intmatrix"
  },
  "tag": "REVERSE FLOOD FILL",
  "lesson": "Start one traversal at the Pacific top/left edges and another at the Atlantic bottom/right edges. Move inland only to equal or higher heights: this reverses water’s downhill path. Mark cells when adding them to the queue. Intersect the two visited sets. O(rows × columns) time and space.",
  "hint": "Start one traversal at the Pacific top/left edges and another at the Atlantic bottom/right edges. Move inland only to equal or higher heights: this reverses water’s downhill path. Mark cells when adding them to the queue. Intersect the two visited sets. O(rows × columns) time and space.",
  "prompt": "Water flows orthogonally to equal or lower height. Pacific touches top/left; Atlantic touches bottom/right. Return zero-based [row, column] cells that can reach both oceans, in any order. The grid is rectangular and nonempty.",
  "rounds": [
   {
    "args": [
     [
      [
       1,
       2,
       2
      ],
      [
       3,
       2,
       3
      ],
      [
       2,
       4,
       5
      ]
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       1
      ],
      [
       1,
       1
      ]
     ]
    ]
   }
  ],
  "tests": [
   {
    "args": [
     [
      [
       1,
       2
      ],
      [
       4,
       3
      ]
     ]
    ],
    "expected": [
     [
      0,
      1
     ],
     [
      1,
      0
     ],
     [
      1,
      1
     ]
    ]
   },
   {
    "args": [
     [
      [
       1
      ]
     ]
    ],
    "expected": [
     [
      0,
      0
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       1
      ],
      [
       1,
       1
      ]
     ]
    ],
    "expected": [
     [
      0,
      0
     ],
     [
      0,
      1
     ],
     [
      1,
      0
     ],
     [
      1,
      1
     ]
    ]
   },
   {
    "args": [
     [
      [
       1,
       2,
       3
      ]
     ]
    ],
    "expected": [
     [
      0,
      0
     ],
     [
      0,
      1
     ],
     [
      0,
      2
     ]
    ]
   },
   {
    "args": [
     [
      [
       3,
       3,
       3
      ],
      [
       3,
       1,
       3
      ],
      [
       3,
       3,
       3
      ]
     ]
    ],
    "expected": [
     [
      0,
      0
     ],
     [
      0,
      1
     ],
     [
      0,
      2
     ],
     [
      1,
      0
     ],
     [
      1,
      2
     ],
     [
      2,
      0
     ],
     [
      2,
      1
     ],
     [
      2,
      2
     ]
    ]
   }
  ],
  "validation": "rows",
  "expansion": true,
  "difficulty": "Medium",
  "color": "lavender",
  "time": "8–15 min",
  "concept": "Reverse Flood Fill",
  "description": "Start one traversal at the Pacific top/left edges and another at the Atlantic bottom/right edges."
 }
];
