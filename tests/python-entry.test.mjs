import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {games,accepts} from '../dist/arcade/logic.mjs';
import {buildProgram,parseExecution,starter,languageHelp} from '../dist/arcade/languages.mjs';
function execute(id,code){
 const game=games.find(g=>g.id===id);
 const run=spawnSync('python3',['-c',buildProgram(game,'python',code)],{encoding:'utf8',timeout:5000});
 assert.equal(run.status,0,run.stderr||run.error?.message);
 const parsed=parseExecution({status:'0',program_output:run.stdout},game.tests.length);assert.equal(parsed.error,undefined,parsed.error);return {game,results:parsed.results};
}
const twoSum=`def twoSum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        if target-value in seen:
            return [seen[target-value], index]
        seen[value] = index
`;
test('Python practice accepts a standalone function without a Solution wrapper',()=>{
 const {game,results}=execute('two-sum',twoSum);
 assert.ok(results.every((r,i)=>!r.error&&accepts(game,game.tests[i],r.value)),JSON.stringify(results));
});
test('Existing Solution class runs with a fresh instance for each case',()=>{
 const code='class Solution:\n    def __init__(self):\n        self.called = False\n'+twoSum.replace('def twoSum(nums, target):','def twoSum(self, nums, target):\n    assert not self.called\n    self.called = True').split('\n').filter(Boolean).map(line=>'    '+line).join('\n');
 const {game,results}=execute('two-sum',code);assert.ok(results.every((r,i)=>!r.error&&accepts(game,game.tests[i],r.value)),JSON.stringify(results));
});
test('Missing or mismatched entry points give actionable errors without hiding user errors',()=>{
 for(const code of ['', '# Only a comment', 'def other(nums,target): return []'])assert.match(execute('two-sum',code).results[0].error,/class Solution.*top-level function def twoSum/);
 assert.match(execute('two-sum','class Solution:\n    pass').results[0].error,/must define the method twoSum/);
 assert.match(execute('two-sum','Solution = 3').results[0].error,/Solution must be a class/);
 assert.equal(execute('two-sum','def twoSum(nums,target): return missing_value').results[0].error,"name 'missing_value' is not defined");
});
test('Standalone Python functions also work for node structures and in-place matrices',()=>{
 const tree=execute('lc-104','def maxDepth(root):\n    return 0 if root is None else 1 + max(maxDepth(root.left), maxDepth(root.right))');
 assert.ok(tree.results.every((r,i)=>!r.error&&accepts(tree.game,tree.game.tests[i],r.value)),JSON.stringify(tree.results));
 const matrix=execute('lc-48','def rotate(matrix):\n    matrix[:] = [list(row) for row in zip(*matrix[::-1])]');
 assert.ok(matrix.results.every((r,i)=>!r.error&&accepts(matrix.game,matrix.game.tests[i],r.value)),JSON.stringify(matrix.results));
});
test('Contracts explain both function forms without changing specialized class exercises',()=>{
 const problem=games.find(g=>g.id==='two-sum'),trie=games.find(g=>g.api==='trie');
 assert.match(languageHelp(problem,'python').contract,/top-level function twoSum/);assert.match(starter(problem,'python'),/class Solution:/);
 assert.doesNotMatch(languageHelp(trie,'python').contract,/top-level/);
});
