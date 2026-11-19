import test from 'node:test';
import assert from 'node:assert/strict';
import {games,newRound,move,accepts,roadmap} from '../dist/arcade/logic.mjs';
import {expansionBoard} from '../dist/arcade/expansion-ui.mjs';
import {executeJavaScript} from '../dist/arcade/javascript-runner.mjs';
import {makeTree,treeValues,makeList,listNodes} from '../dist/arcade/structure-runtime.mjs';
import {structureSolutions} from './fixtures/structure-solutions.mjs';
const added=games.filter(g=>g.structures),game=n=>added.find(g=>g.number===n);
const run=(n,code)=>{const g=game(n);return executeJavaScript({code,fn:g.fn,tests:g.tests.map(t=>t.args)});};
test('All 75 unique games are playable and the final 50 rounds preserve immutable state',()=>{
 assert.equal(games.length,75);assert.equal(new Set(games.map(g=>g.number)).size,75);assert.equal(added.length,25);assert.equal(Object.values(roadmap).flat().length,0);
 for(const g of added)for(let r=0;r<g.rounds.length;r++){
  const input=structuredClone(g.rounds[r].args);let s=newRound(g,r),count=0;
  while(!s.done){const before=structuredClone(s),step=s.trace.steps[s.index];assert.ok(step.correct>=0&&step.correct<step.choices.length,g.problem);assert.ok(!expansionBoard(g,s).includes('undefined'),g.problem);
   for(let choice=0;choice<step.choices.length;choice++)if(choice!==step.correct){const wrong=move(g,s,'decide',choice);assert.equal(wrong.error,true);assert.equal(wrong.index,s.index);assert.equal(wrong.done,false);}
   assert.equal(move(g,s,'invalid',step.correct).error,true);s=move(g,s,'decide',step.correct);assert.deepEqual(before.trace,s.trace);assert.ok(++count<200,g.problem);
  }
  assert.ok(accepts(g,g.tests[r],s.answer),g.problem);assert.deepEqual(g.rounds[r].args,input);
 }
});
test('Every new JavaScript interface executes its 130 reference cases',()=>{
 let count=0;for(const g of added){const r=run(g.number,structureSolutions.javascript[0]);assert.equal(r.error,undefined,g.problem);r.results.forEach((v,i)=>{assert.equal(v.error,undefined,g.problem);assert.ok(accepts(g,g.tests[i],v.value),g.problem+' '+i);count++;});}assert.equal(count,130);
});
test('Builders preserve level-order null gaps, duplicate nodes and empty structures',()=>{
 for(const a of [[],[1],[1,null,2,3],[1,2,null,null,3],[2,2,2,null,2],[-2147483648,null,2147483647]])assert.deepEqual(treeValues(makeTree(a)),a);
 const list=makeList([1,1,2]);assert.notEqual(list,list.next);assert.deepEqual(listNodes(list).map(n=>n.val),[1,1,2]);assert.throws(()=>listNodes(makeList([1],0)),/acyclic/);
 const root=makeTree([1,2]);root.right=root.left;assert.throws(()=>treeValues(root),/shared nodes/);
});
test('Graph clones cannot reuse original nodes or duplicate identities with the same value',()=>{
 const alias=run(133,'function cloneGraph(node){return node;}');assert.ok(alias.results[0].error);assert.ok(!accepts(game(133),game(133).tests[0],alias.results[0].value));
 const shallow=run(133,'function cloneGraph(node){return node?new Node(node.val,node.neighbors):null;}');assert.ok(shallow.results[0].error);
 const wrongRoot=run(133,structureSolutions.javascript[0]+'\nconst originalClone=cloneGraph;cloneGraph=n=>originalClone(n)?.neighbors[0]??null;');assert.ok(wrongRoot.results[0].error);
 const good=run(133,structureSolutions.javascript[0]);assert.ok(good.results.every((r,i)=>accepts(game(133),game(133).tests[i],r.value)));
});
test('Reorder checks identity and values, and LCA requires an existing node',()=>{
 const replaced=run(143,'function reorderList(head){head.next=new ListNode(4,new ListNode(2,new ListNode(3)));}');assert.ok(replaced.results[0].error);
 const valueSwap=run(143,'function reorderList(head){head.next.val=4;head.next.next.val=2;head.next.next.next.val=3;}');assert.ok(valueSwap.results[0].error);
 const fresh=run(235,'function lowestCommonAncestor(root,p,q){return new TreeNode(6);}');assert.ok(fresh.results[0].error);
 const identical=executeJavaScript({fn:'reorderList',code:'function reorderList(head){}',tests:[[[1,1,1,1]]]});assert.ok(identical.results[0].error,'Equal values cannot hide an incorrect identity order');
});
test('Codecs must carry state in the encoded string across fresh instances',()=>{
 for(const [n,name,encode,decode] of [[271,'StringCodec','encode','decode'],[297,'TreeCodec','serialize','deserialize']]){
  const r=run(n,`class ${name}{${encode}(input){this.saved=input;return 'cached';}${decode}(data){return this.saved;}}`);assert.ok(r.results.some((r,i)=>r.error||!accepts(game(n),game(n).tests[i],r.value)));
 }
});
test('Validators accept alternate topological/group orders and reject coercion, lost multiplicity and duplicate words',()=>{
 const alien=game(269),groups=game(49),words=game(212),median=game(295);
 assert.ok(accepts(alien,alien.tests[1],'zcab'));assert.ok(!accepts(alien,alien.tests[1],'bazc'));assert.ok(!accepts(alien,alien.tests[1],'aazc'));assert.ok(!accepts(alien,alien.tests[2],'abc'));
 assert.ok(accepts(groups,groups.tests[1],[['',''],['ba','ab']]));assert.ok(!accepts(groups,groups.tests[1],[[''],['ba','ab']]));
 assert.ok(!accepts(words,words.tests[0],['eat','oath','eat']));assert.ok(!accepts(median,median.tests[0],[null,null,'1.5',null,2]));
});
