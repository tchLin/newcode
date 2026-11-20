import {pythonCallHelper} from './python-call.mjs';
import {structureStarter,structureProgram,structureContract} from './structure-languages.mjs';
import {expansionStarter,expansionProgram} from './expansion-languages.mjs';
import {moreStarter,moreProgram} from './more-languages.mjs';
// Compiler IDs and options are verified against the providers' compiler catalogs.
// JavaScript stays local; other languages use one compilation for all test cases.
export const languages = [
  {id:'javascript',label:'JavaScript',filename:'solution.js',runtime:'Browser JavaScript'},
  {id:'c',label:'C',filename:'solution.c',runtime:'C11 · GCC 13.2',compiler:'gcc-13.2.0-c',options:'warning,c11'},
  {id:'cpp',label:'C++',filename:'solution.cpp',runtime:'C++17 · GCC 13.2',compiler:'gcc-13.2.0',options:'warning,c++17,boost-nothing-gcc-13.2.0'},
  {id:'java',label:'Java',filename:'Solution.java',runtime:'OpenJDK 21',compiler:'openjdk-jdk-21+35'},
  {id:'rust',label:'Rust',filename:'solution.rs',runtime:'Rust stable · 2021 edition',compiler:'stable',provider:'rust-playground'},
  {id:'go',label:'Go',filename:'solution.go',runtime:'Go 1.23',compiler:'gl1238',provider:'compiler-explorer'},
  {id:'python',label:'Python',filename:'solution.py',runtime:'Python 3.12',compiler:'python312',provider:'compiler-explorer'}
];
export const getLanguage=id=>languages.find(l=>l.id===id)||languages[0];
export const getProvider=id=>id==='rust'
  ?{name:'Rust Playground',url:'https://play.rust-lang.org',endpoint:'https://play.rust-lang.org/execute'}
  :getLanguage(id).provider==='compiler-explorer'
  ?{name:'Compiler Explorer',url:'https://godbolt.org',endpoint:`https://godbolt.org/api/compiler/${getLanguage(id).compiler}/compile`}
  :{name:'Wandbox',url:'https://wandbox.org',endpoint:'https://wandbox.org/api/compile.json'};
const snake={twoSum:'two_sum',containsDuplicate:'contains_duplicate',isValid:'is_valid'};
const kind=g=>g.id==='two-sum'?0:g.id==='duplicate'?1:2;

export function starter(g,id){
  if(g.structures)return structureStarter(g,id);
  if(g.expansion)return expansionStarter(g,id);
  if(g.signature)return moreStarter(g,id);
  const k=kind(g),fn=g.fn;
  if(id==='javascript')return `function ${fn}(${g.params}) {\n  // Turn the moves you just made into code.\n  \n}\n`;
  if(id==='python')return `class Solution:\n    def ${fn}(self, ${['nums: list[int], target: int','nums: list[int]','s: str'][k]}) -> ${k===0?'list[int]':'bool'}:\n        # Turn the moves you just made into code.\n        ${k===0?'return []':'return False'}\n`;
  if(id==='c')return `#include <stdbool.h>\n#include <stdlib.h>\n#include <string.h>\n\n${[
    '/* Allocate the returned array with malloc; set *returnSize. */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your solution here.\n    *returnSize = 0;\n    return NULL;\n}',
    'bool containsDuplicate(int* nums, int numsSize) {\n    // Write your solution here.\n    return false;\n}',
    'bool isValid(char* s) {\n    // Write your solution here.\n    return false;\n}'
  ][k]}\n`;
  if(id==='cpp')return `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${['vector<int> twoSum(vector<int>& nums, int target)','bool containsDuplicate(vector<int>& nums)','bool isValid(string s)'][k]} {\n        // Write your solution here.\n        return ${k===0?'{}':'false'};\n    }\n};\n`;
  if(id==='java')return `import java.util.*;\n\nclass Solution {\n    public ${['int[] twoSum(int[] nums, int target)','boolean containsDuplicate(int[] nums)','boolean isValid(String s)'][k]} {\n        // Write your solution here.\n        return ${k===0?'new int[0]':'false'};\n    }\n}\n`;
  if(id==='rust')return `use std::collections::{HashMap, HashSet};\n\nstruct Solution;\n\nimpl Solution {\n    pub fn ${snake[fn]}(${['nums: Vec<i32>, target: i32','nums: Vec<i32>','s: String'][k]}) -> ${k===0?'Vec<i32>':'bool'} {\n        // Write your solution here.\n        ${k===0?'vec![]':'false'}\n    }\n}\n`;
  if(id==='go')return `package main\n\nfunc ${fn}(${['nums []int, target int','nums []int','s string'][k]}) ${k===0?'[]int':'bool'} {\n    // Write your solution here.\n    return ${k===0?'nil':'false'}\n}\n`;
  throw new Error('Unsupported language.');
}

function baseLanguageHelp(g,id){
  if(g.structures)return {lesson:`In ${getLanguage(id).label}: ${g.lesson}`,hint:g.hint,contract:structureContract(g,id)};
  if(g.expansion)return {lesson:`In ${getLanguage(id).label}: ${g.lesson}`,hint:g.hint,contract:(Number.isInteger(g.mutates)?'Modify the provided matrix in place; return nothing. ':g.signature.result==='uint'&&id==='java'?'Return an int containing the reversed 32-bit pattern; results display as unsigned. ':id==='c'&&['array','intmatrix','string'].includes(g.signature.result)?'Allocate the returned data with malloc/calloc. For arrays set *returnSize; for matrices also allocate *returnColumnSizes and each row. The harness frees returned allocations. ':'Return '+({array:'an integer array',intmatrix:'an integer matrix',int:'an integer',uint:'an unsigned 32-bit integer',string:'a string',bool:'a boolean'})[g.signature.result]+'. ')+`Keep the provided signature. The test harness calls your solution; do not add a main function.`};
  if(g.signature)return {lesson:`In ${getLanguage(id).label}: ${g.lesson}`,hint:g.hint,contract:(id==='c'&&g.signature.result==='string'?'Return a malloc/calloc-allocated, null-terminated string; the harness frees it. ':id==='go'?'Keep package main. ':id==='rust'?'Keep struct Solution. ':'')+`Implement the provided ${id==='java'||id==='cpp'||id==='python'||id==='rust'?'method':'function'} and return ${g.signature.result==='int'?'an integer':g.signature.result==='string'?'a string':'a boolean'}. The test harness calls your solution; do not add a main function.`};
  const k=kind(g);
  const types={
    javascript:['a Map','a Set','an array with push() and pop()'],
    c:['a hash table you implement','a hash set you implement','a char array and a top index'],
    cpp:['an unordered_map<int, int>','an unordered_set<int>','a stack<char>'],
    java:['a HashMap<Integer, Integer>','a HashSet<Integer>','an ArrayDeque<Character>'],
    rust:['a HashMap<i32, usize>','a HashSet<i32>','a Vec<char>'],
    go:['a map[int]int','a map[int]bool','a []byte slice'],
    python:['a dict','a set','a list with append() and pop()']
  };
  const data=types[id]||types.javascript;
  const lesson=[
    `You saved each number with its index. In ${getLanguage(id).label}, use ${data[0]} to look up target − number before storing the current number. With a hash table, the average time is O(n) and the extra space is O(n).`,
    `You kept only the values you had already seen. In ${getLanguage(id).label}, use ${data[1]}. Check membership before adding each number. With a hash set, the average time is O(n) and the extra space is O(n).`,
    `You matched each closing bracket with the most recent opening. In ${getLanguage(id).label}, use ${data[2]} as your stack. Reject a mismatch and check that the stack is empty at the end. Time is O(n), with O(n) extra space.`
  ][k];
  const hint=[
    `Create ${data[0]}. At each index, check for target minus the current value. If found, return the saved index and the current index; otherwise save the current value and its index.`,
    `Create ${data[1]}. If the current number is already present, return true. Otherwise add it. Return false only after checking all numbers.`,
    `Use ${data[2]}. Add opening brackets. For a closer, first check that the stack is nonempty, then remove the top and compare it with the matching opener. Return true only if the stack is empty at the end.`
  ][k]+(id==='c'&&k<2?' C has no standard hash table. A nested-loop solution is a useful first step; then implement a hash table to improve its running time.':'');
  const contract=id==='c'&&k===0?'Implement twoSum and return a malloc-allocated array. Set *returnSize to its length; the test harness frees it.':id==='c'?'Implement the provided function and return a bool.':id==='go'?'Keep package main and implement the provided function. Add imports if needed.':id==='rust'?'Keep struct Solution and implement its provided method.':id==='javascript'?'Implement the provided function and return your answer.':'Implement the provided method inside class Solution.';
  return {lesson,hint,contract:contract+' The test harness calls your solution; do not add a main function.'};
}

export function languageHelp(g,id){
 const help=baseLanguageHelp(g,id);
 if(id==='python'&&!g.api)help.contract=`Define class Solution with method ${g.fn}(self, ...), or a top-level function ${g.fn}(...) without self. `+help.contract.replace('Implement the provided method inside class Solution.','Keep the required function name and arguments.');
 return help;
}

export const RESULT_PREFIX='__ALGO_ARCADE_RESULT_';
const marker=i=>`${RESULT_PREFIX}${i}__`;
const q=JSON.stringify;

// Test arguments are generated from our exercise definitions, not user source.
export function buildProgram(g,id,code){
  if(g.structures)return structureProgram(g,id,code);
  const k=kind(g),tests=g.tests,fn=g.fn;
  if(id==='python')return `${code}\n${pythonCallHelper}\nimport json as _aa_json\nfor _aa_i, _aa_args in enumerate(_aa_json.loads(${q(JSON.stringify(tests.map(t=>t.args)))})):\n    try:\n        _aa_returned = _aa_call_solution(${q(fn)}, _aa_args)\n        _aa_value = ${Number.isInteger(g.mutates)?'_aa_args['+g.mutates+']':'_aa_returned'}\n        print('${RESULT_PREFIX}' + str(_aa_i) + '__' + _aa_json.dumps({'value': _aa_value}, allow_nan=False))\n    except Exception as _aa_error:\n        print('${RESULT_PREFIX}' + str(_aa_i) + '__' + _aa_json.dumps({'error': str(_aa_error)}))\n`;
  if(g.expansion)return expansionProgram(g,id,code);
  if(g.signature)return moreProgram(g,id,code);
  if(id==='java')return `${code}\n\nclass Wandbox {\n  public static void main(String[] args) {\n${tests.map((t,i)=>{
    const args=k===2?q(t.args[0]):`new int[]{${t.args[0].join(',')}}${k===0?', '+t.args[1]:''}`;
    const call=`new Solution().${fn}(${args})`;
    return `    {\n      try {\n        ${k===0?'int[]':'boolean'} value = ${call};\n        System.out.println(${q(marker(i)+'{"value":')} + ${k===0?'java.util.Arrays.toString(value)':'value'} + "}");\n      } catch (Throwable e) {\n        System.out.println(${q(marker(i)+'{"error":"Solution threw an exception."}')});\n        e.printStackTrace(System.err);\n      }\n    }`;
  }).join('\n')}\n  }\n}\n`;
  if(id==='cpp')return `#include <iostream>\n#include <exception>\n${code}\n\nint main() {\n${tests.map((t,i)=>{
    const setup=k===2?`std::string input = ${q(t.args[0])};`:`std::vector<int> input = {${t.args[0].join(',')}};`;
    return `  {\n    try {\n      ${setup}\n      auto value = Solution().${fn}(input${k===0?', '+t.args[1]:''});\n      std::cout << ${q(marker(i)+'{"value":')};\n      ${k===0?'std::cout << "["; for (size_t j = 0; j < value.size(); ++j) { if(j) std::cout << ","; std::cout << value[j]; } std::cout << "]";':'std::cout << (value ? "true" : "false");'}\n      std::cout << "}" << std::endl;\n    } catch (const std::exception& e) {\n      std::cout << ${q(marker(i)+'{"error":"Solution threw an exception."}')} << std::endl;\n      std::cerr << e.what() << std::endl;\n    }\n  }`;
  }).join('\n')}\n}\n`;
  if(id==='c')return `#include <stdio.h>\n${code}\n\nint main(void) {\n${tests.map((t,i)=>{
    const setup=k===2?`char input[] = ${q(t.args[0])};`:`int input[] = {${t.args[0].join(',')||'0'}};`;
    const call=`${fn}(input${k!==2?', '+t.args[0].length:''}${k===0?', '+t.args[1]+', &size':''})`;
    return `  {\n    ${setup}\n    ${k===0?'int size = 0; int* value':'bool value'} = ${call};\n    printf("%s", ${q(marker(i)+'{"value":')});\n    ${k===0?'if(value == NULL || size < 0 || size > 10) { printf("null"); } else { printf("["); for(int j=0; j<size; j++) { if(j) printf(","); printf("%d", value[j]); } printf("]"); } free(value);':'printf("%s", value ? "true" : "false");'}\n    printf("}\\n");\n  }`;
  }).join('\n')}\n  return 0;\n}\n`;
  if(id==='rust')return `${code}\n\nfn main() {\n${tests.map((t,i)=>{
    const args=k===2?`${q(t.args[0])}.to_string()`:`vec![${t.args[0].join(',')}]${k===0?', '+t.args[1]:''}`;
    return `    {\n        let value = Solution::${snake[fn]}(${args});\n        println!("${marker(i)}{{\\"value\\":{:?}}}", value);\n    }`;
  }).join('\n')}\n}\n`;
  if(id==='go'){
    if(!/^\s*package\s+main\b/m.test(code))throw new Error('Go solutions must include package main.');
    const withImports=code.replace(/^(\s*package\s+main\b[^\S\r\n]*;?)/m,'$1\nimport aa_fmt "fmt"\n');
    return `${withImports}\n\nfunc main() {\n${tests.map((t,i)=>{
      const args=k===2?q(t.args[0]):`[]int{${t.args[0].join(',')}}${k===0?', '+t.args[1]:''}`;
      return `    func() {\n        defer func() { if r := recover(); r != nil { aa_fmt.Println(${q(marker(i)+'{"error":"Solution panicked."}')}); aa_fmt.Println(r) } }()\n        value := ${fn}(${args})\n        aa_fmt.Print(${q(marker(i)+'{"value":')})\n        ${k===0?'if value == nil { aa_fmt.Print("null") } else { aa_fmt.Print("["); for j,n := range value { if j > 0 { aa_fmt.Print(",") }; aa_fmt.Print(n) }; aa_fmt.Print("]") }':'aa_fmt.Print(value)'}\n        aa_fmt.Println("}")\n    }()`;
    }).join('\n')}\n}\n`;
  }
  throw new Error('Unsupported remote language.');
}

export function compileRequest(g,id,code){
  const lang=languages.find(l=>l.id===id);
  if(!lang?.compiler)throw new Error('Unsupported remote language.');
  if(typeof code!=='string'||code.length>50000)throw new Error('Keep your solution under 50,000 characters.');
  if(id==='rust')return {channel:'stable',mode:'debug',edition:'2021',crateType:'bin',tests:false,code:buildProgram(g,id,code),backtrace:false};
  if(lang.provider==='compiler-explorer')return {source:buildProgram(g,id,code),compiler:lang.compiler,lang:id,allowStoreCodeDebug:false,options:{compilerOptions:{executorRequest:true},filters:{execute:true},executeParameters:{args:[],stdin:''}}};
  const request={compiler:lang.compiler,code:buildProgram(g,id,code),options:lang.options||'',save:false};
  return request;
}

export function parseExecution(response,count){
  if(!response||typeof response!=='object')throw new Error('The compiler returned an unreadable response. Try again.');
  const diagnostics=[response.compiler_message||response.compiler_error,response.program_error].filter(Boolean).join('\n').slice(0,12000);
  if(response.signal || String(response.status)!=='0'){
    return {error:`${response.signal?'Execution stopped ('+response.signal+').':'Compilation or execution failed.'}${diagnostics?'\n'+diagnostics:' Check your code and try again.'}`};
  }
  const output=String(response.program_output||'');
  if(output.length>64000)return {error:'Your program produced too much output. Remove extra logging and try again.'};
  const results=new Array(count),seen=new Set();
  for(const line of output.split(/\r?\n/)){
    const match=line.match(/^__ALGO_ARCADE_RESULT_(\d+)__(.*)$/);
    if(!match)continue;
    const i=Number(match[1]);
    if(i>=count||seen.has(i))return {error:'The runner received unexpected test output. Avoid changing the test harness.'};
    seen.add(i);
    try{
      const value=JSON.parse(match[2]);
      if(!value||typeof value!=='object'||(!Object.hasOwn(value,'value')&&typeof value.error!=='string'))throw new Error();
      results[i]=typeof value.error==='string'?{error:value.error.slice(0,1000)}:{value:value.value};
    }catch{return {error:'Could not read a test result. Return the expected value instead of printing it.'};}
  }
  if(seen.size!==count)return {error:'The program finished without returning all test results. Keep the provided function signature and return your answer; do not exit the program.'};
  return {results,diagnostics};
}
