import {languageHelp,getLanguage} from './arcade/languages.mjs';

// Curated questions are deterministic: hints-only never dispatches to a model.
// Do not reuse the legacy hint/lesson recipes here; many explain the full algorithm.
const categoryQuestions={
 Array:'Trace a small input by hand. Which information from earlier elements would avoid repeating work?',
 Binary:'Write a small input in binary. What happens to each bit, including carries and leading zeros?',
 'Dynamic Programming':'Describe a smaller instance in words. Which earlier answers would help answer the next one?',
 Graph:'Draw a tiny graph, including a disconnected part or a cycle. What must you remember when visiting nodes?',
 Interval:'Draw intervals on a number line. Decide what touching endpoints mean for this particular problem.',
 'Linked List':'Draw nodes and links separately from their values. Which links must remain reachable after each change?',
 Matrix:'Trace a tiny rectangular grid. Which boundaries or already-visited cells require special care?',
 String:'Try a short string with repeated characters. What changes when you add or remove one character?',
 Tree:'Start with an empty tree, one node, and two levels. What must each child tell its parent?',
 Heap:'List the candidates you need at each step. Must all of them be sorted, or only the next one?'
};

const reasoningQuestions={
 'two-sum':'How would you prevent matching an element with itself? Trace two equal values at different indices.',
 duplicate:'What information must survive from one element to the next? Can you stop before reaching the end?',
 brackets:'Which opener must a closing bracket match? What should happen to an unmatched opener at the end?',
 stock:'Can a selling day precede its buying day? What result makes sense when prices only decrease?',
 anagram:'How would your comparison distinguish repeated letters from letters that occur only once?',
 stairs:'What are the possible final moves onto a step, and are those groups of paths disjoint?',
 water:'Which wall limits a pair’s area? Could moving the taller wall improve that limit while width decreases?',
 lis:'Does the longest subsequence have to end at the final input element? What does one saved state mean?',
 islands:'When should land become visited so that two neighboring cells cannot count the same island twice?',
 window:'How would you know that all required character occurrences are present, including repeated ones?',
 courses:'What does it mean if unfinished courses remain but none can be started? Try a prerequisite cycle.',
 intervals:'If two intervals conflict, which choice leaves the most room for later intervals?',
 rotated:'Which half can you safely rule out while keeping the smallest value inside your search bounds?',
 coins:'How will you distinguish an unreachable subtotal from one that needs zero coins?',
 bits:'Compare the binary forms of a positive number and the number immediately before it. Which bit changes?',
 'word-search':'What state belongs only to the current search path, and what must be restored when that path fails?',
 'unique-window':'When a repeated character arrives, can removing just one character always restore uniqueness?',
 robber:'If you choose the current house, which earlier choice becomes unavailable? What if you skip it?',
 jump:'Can you use a jump from an index that you could never reach in the first place?',
 'max-product':'Could the most negative product become useful later? What does a zero do to your running states?',
 'lc-53':'Must the subarray contain an element? Try an all-negative input before deciding how to initialize.',
 'lc-33':'Which half is still sorted around the middle, and how can its endpoints exclude the target?',
 'lc-268':'What operation cancels matching values? Check a missing zero and a missing final value.',
 'lc-371':'Which bit positions need a carry, and which positions represent a sum without a carry?',
 'lc-190':'Will processing only until the input becomes zero preserve the required 32-bit width?',
 'lc-1143':'What changes when the final characters of two prefixes match, and what choices remain when they differ?',
 'lc-377':'Are sequences with the same numbers in a different order distinct? How does that affect your state transitions?',
 'lc-213':'Which pair of houses becomes adjacent because of the circle? Check one-house and two-house inputs.',
 'lc-91':'When can a zero participate in a valid decoding? Compare 10, 20, 30, and a leading zero.',
 'lc-62':'Which cells could immediately precede the destination? What is special about the first row and column?',
 'lc-128':'How can you recognize the beginning of a run so you do not rescan it from every element?',
 'lc-261':'Are connectivity and lack of cycles both necessary? Include a node with no incident edges in your example.',
 'lc-323':'When does adding an edge actually reduce the number of components? What about a redundant edge?',
 'lc-252':'After ordering the meetings, which neighboring endpoints are enough to expose a conflict?',
 'lc-253':'If one meeting ends exactly when another starts, which event should free a room first?',
 'lc-125':'Can you compare the next meaningful characters without building a cleaned copy of the whole string?',
 'lc-5':'Where is the center of an even-length palindrome? Can the same reasoning cover odd lengths?',
 'lc-647':'If identical text appears in two different positions, does it represent one palindrome or two intervals?',
 'lc-424':'For a chosen window, how many characters differ from its most frequent character?',
 'lc-139':'What evidence would make a prefix segmentable? Is the empty prefix a useful starting state?',
 'lc-238':'What information from each side of an index would exclude that index without using division?',
 'lc-338':'How is the bit count of a number related to the count after removing its lowest bit?',
 'lc-54':'After consuming an edge, can the next edge already be empty? Try a single row and a single column.',
 'lc-347':'How large can a frequency become relative to input length? Can that bound organize your candidates?',
 'lc-56':'Can a newly merged interval overlap the next interval even if the original first interval did not?',
 'lc-57':'Which existing intervals are definitely before or after the new interval, and which can enlarge it?',
 'lc-73':'How will you distinguish an original zero from a zero written during your own updates?',
 'lc-48':'Track the four corners through the rotation. Which transformations preserve the required in-place behavior?',
 'lc-15':'How will you avoid emitting the same value triplet from different duplicate input positions?',
 'lc-417':'Could searching backward from an ocean simplify the question of which cells can reach it?',
 'lc-133':'How would you preserve a cycle without copying the same original node multiple times?',
 'lc-269':'How many character comparisons between neighboring words establish ordering? Consider a word before its own prefix.',
 'lc-206':'Which original link must be saved before you reverse the current link?',
 'lc-141':'Do equal node values prove a cycle, or must the same node object be reached twice?',
 'lc-21':'When one input list becomes empty, does the remaining chain still need to be inspected node by node?',
 'lc-23':'After choosing the smallest available node, which new node becomes a candidate?',
 'lc-19':'How can you find the predecessor of the removed node? Check removing the head as well as the tail.',
 'lc-143':'Which order should nodes in the second half have before you interleave the halves?',
 'lc-49':'Which representation is identical for every permutation of the same letters, including repeated letters?',
 'lc-271':'What happens if the separator itself occurs in the data? How will the decoder know the exact boundary?',
 'lc-104':'What should an empty child contribute to depth? Check that a single node has depth one.',
 'lc-100':'Can equal traversed values hide a different shape? Compare a missing left child with a missing right child.',
 'lc-226':'Does swapping only the root’s children invert the entire tree? What must also happen below it?',
 'lc-124':'Can a path passed upward branch in both directions? What should happen when every node is negative?',
 'lc-102':'How do you keep nodes discovered for the next level separate from nodes in the current level?',
 'lc-297':'What information distinguishes two tree shapes with the same node values in traversal order?',
 'lc-572':'Does a matching root value prove that the entire candidate subtree matches?',
 'lc-105':'Which traversal identifies the next root, and which separates the root’s left and right subtrees?',
 'lc-98':'Is comparing a node only with its immediate parent enough to enforce every ancestor’s ordering constraint?',
 'lc-230':'Which traversal of a search tree visits values in sorted order? Can you stop after enough visits?',
 'lc-235':'What changes once the two target search paths point in different directions?',
 'lc-208':'How will you distinguish a complete stored word from a path that is only a prefix?',
 'lc-211':'When a wildcard occurs, which choices need exploration? What must be true after the last character?',
 'lc-212':'How can shared dictionary prefixes rule out a board path before you finish exploring it?',
 'lc-295':'Which size and ordering relationships between the two halves make the middle value easy to read?'
};

const labHints={
 'rate-limit':[
  ['Trace one window','Write down a client’s first accepted timestamp, count, and next reset boundary. Compare requests just before and exactly at the boundary.'],
  ['Separate rejection from reset','Should rejecting a request change when the current window began? Trace a client making repeated denied requests.'],
  ['Keep clients independent','What state belongs to each client key, and what belongs to the limiter instance? Trace repeated keys in a single batch.']
 ],
 dependencies:[
  ['Model prerequisites','Draw edges for a three-job chain. Which jobs can run before any prerequisites have completed?'],
  ['Choose deterministically','A newly ready job may sort before a job already waiting. When should you choose the next smallest ID? How do duplicate edges affect dependency counts?'],
  ['Explain an unfinished graph','If jobs remain but no job is ready, what does that imply? Distinguish cycles from unknown or duplicate IDs, and check that input lists stay unchanged.']
 ],
 inventory:[
  ['Plan before applying','Combine all quantities for each SKU before deciding whether an order fits. What happens if the last line cannot be fulfilled?'],
  ['Remember successful orders','What information proves an order already succeeded? Should a failed attempt reserve its order ID? Trace a retry with different quantities.'],
  ['Make releases reversible once','Store enough information to restore a reservation. After releasing it, what prevents a second release from creating stock?']
 ],
 cache:[
  ['Trace a request','Follow a lookup through the service and cache modules. Compare a missing entry with an entry whose stored value is false or zero.'],
  ['Check the boundaries','Use the injected clock to reason about just before expiry and exactly at expiry. Which methods could observe expired entries without calling get first?'],
  ['Keep one contract','How will set, get, and size agree about what counts as a live entry? Check non-positive TTL and replacing a key, then explain when the service should call load.']
 ],
 pagination:[
  ['Make order deterministic','Draw a few records with equal timestamps. Which second field makes their ordering unambiguous?'],
  ['Locate the page boundary','Mark the cursor in the ordered records. Which records belong after it, and what should an unknown cursor mean?'],
  ['Check the final page','Does a full page necessarily mean another page exists? Compare an exactly full final page with one that has a remaining record. Also check input mutation and invalid limits.']
 ],
 events:[
  ['Separate the stages','Trace one invalid event, a repeated ID, and a valid event outside the time window. Which stage decides whether each one survives?'],
  ['Reason about retries','If the first valid occurrence of an ID is outside the window and a retry is inside, which occurrence owns that ID? Would changing the stage order change the answer?'],
  ['Choose what to remember','What lookup structures avoid rescanning earlier IDs and users for every event? Check zero and negative amounts, exact end timestamps, and whether normalization changes the original object.']
 ]
};

export function getHints(problem,language='javascript'){
 if(!problem||typeof problem.id!=='string')return [];
 const lab=Object.hasOwn(labHints,problem.id)?labHints[problem.id]:null;
 if(lab)return lab.map(([title,text],index)=>({id:`${problem.id}:hint:${index+1}`,title,text}));
 // An unknown exercise should not accidentally inherit a different exercise's help.
 if(!Object.hasOwn(reasoningQuestions,problem.id))return [];
 const help=languageHelp(problem,getLanguage(language).id);
 const steps=[
  ['Start small',categoryQuestions[problem.category]||'Trace a small example and state the input and output contract in your own words.'],
  ['Consider an approach',`Consider this idea: ${problem.concept}. Before coding, explain what information you would keep and how it changes after one step.`],
  ['Check your reasoning',`${reasoningQuestions[problem.id]}\n\nLanguage contract: ${help.contract}`]
 ];
 return steps.map(([title,text],index)=>({id:`${problem.id}:hint:${index+1}`,title,text}));
}
