import {cJson,cppJson,javaJson,rustJson} from './more-languages.mjs';
export const snake=s=>s.replace(/([A-Z]+)([A-Z][a-z])/g,'$1_$2').replace(/([a-z0-9])([A-Z])/g,'$1_$2').toLowerCase();
const types={
 c:{int:'int',uint:'uint32_t',bool:'bool',string:'char*',array:'int*',intmatrix:'int**',strings:'char**'},
 cpp:{int:'int',uint:'uint32_t',bool:'bool',string:'string',array:'vector<int>',intmatrix:'vector<vector<int>>',strings:'vector<string>'},
 java:{int:'int',uint:'int',bool:'boolean',string:'String',array:'int[]',intmatrix:'int[][]',strings:'String[]'},
 rust:{int:'i32',uint:'u32',bool:'bool',string:'String',array:'Vec<i32>',intmatrix:'Vec<Vec<i32>>',strings:'Vec<String>'},
 go:{int:'int',uint:'uint32',bool:'bool',string:'string',array:'[]int',intmatrix:'[][]int',strings:'[]string'},
 python:{int:'int',uint:'int',bool:'bool',string:'str',array:'list[int]',intmatrix:'list[list[int]]',strings:'list[str]'}
};
export function expansionStarter(g,id){
 const mut=Number.isInteger(g.mutates),result=mut?'void':g.signature.result;
 if(id==='javascript')return `function ${g.fn}(${g.params}) {\n  // ${mut?'Modify the input matrix in place.':'Translate your game decisions into code.'}\n  \n}\n`;
 const t=types[id],args=g.signature.args.flatMap(([name,type],i)=>{
  if(id==='c')return [`${t[type]} ${name}`,...(['array','intmatrix','strings'].includes(type)?[`int ${name}Size`]:[]),...(type==='intmatrix'?[`int* ${name}ColSize`]:[])];
  const typeName=id==='cpp'&&['array','intmatrix','strings'].includes(type)?t[type]+'&':id==='rust'&&mut&&i===g.mutates?'&mut '+t[type]:t[type];
  return [id==='go'?`${name} ${typeName}`:id==='rust'||id==='python'?`${name}: ${typeName}`:`${typeName} ${name}`];
 });
 if(id==='c'&&['array','intmatrix'].includes(result)){args.push('int* returnSize');if(result==='intmatrix')args.push('int** returnColumnSizes');}
 const ret=mut?(id==='python'?'None':id==='rust'?'()':'void'):t[result],params=args.join(', ');
 const fallback=mut?'':result==='bool'?(id==='python'?'False':'false'):result==='string'?(id==='c'?'calloc(1,1)':id==='rust'?'String::new()':'""'):['array','intmatrix'].includes(result)?({c:'NULL',cpp:'{}',java:result==='array'?'new int[0]':'new int[0][]',rust:'vec![]',go:result==='array'?'[]int{}':'[][]int{}',python:'[]'})[id]:'0';
 if(id==='python')return `class Solution:\n    def ${g.fn}(self, ${params}) -> ${ret}:\n        ${mut?'# Update the input matrix; do not return a replacement.\n        pass':'return '+fallback}\n`;
 if(id==='rust')return `struct Solution;\n\nimpl Solution {\n    pub fn ${snake(g.fn)}(${params}) -> ${ret} {\n        // Write your solution here.\n        ${fallback}\n    }\n}\n`;
 if(id==='go')return `package main\n\nfunc ${g.fn}(${params})${mut?'':' '+ret} {\n    // Write your solution here.\n    ${mut?'':'return '+fallback}\n}\n`;
 if(id==='c')return `#include <stdbool.h>\n#include <stdint.h>\n#include <stdlib.h>\n#include <string.h>\n\n${['array','intmatrix','string'].includes(result)?'/* Allocate the returned data with malloc/calloc; the harness frees it. */\n':''}${ret} ${g.fn}(${params}) {\n    ${['array','intmatrix'].includes(result)?'*returnSize = 0;\n    ':''}${result==='intmatrix'?'*returnColumnSizes = NULL;\n    ':''}// Write your solution here.\n    ${mut?'':'return '+fallback+';'}\n}\n`;
 const method=`${ret} ${g.fn}(${params}) {\n        // Write your solution here.\n        ${mut?'':'return '+fallback+';'}\n    }`;
 if(id==='cpp')return `#include <vector>\n#include <string>\n#include <algorithm>\n#include <cstdint>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${method}\n};\n`;
 return `import java.util.*;\n\nclass Solution {\n    public ${method}\n}\n`;
}
const q=JSON.stringify;
function inputs(g,test,id){const setup=[],args=[];
 for(const [i,[,type]] of g.signature.args.entries()){
  const v=test.args[i],name='aa_input_'+i;
  if(id==='c'){
   if(type==='intmatrix'){v.forEach((row,j)=>setup.push(`int ${name}_${j}[]={${row.join(',')||0}};`));setup.push(`int* ${name}[]={${v.map((_,j)=>name+'_'+j).join(',')||'NULL'}}; int ${name}_cols[]={${v.map(r=>r.length).join(',')||0}};`);args.push(name,String(v.length),name+'_cols');}
   else if(type==='array'){setup.push(`int ${name}[]={${v.join(',')||0}};`);args.push(name,String(v.length));}
   else if(type==='strings'){v.forEach((s,j)=>setup.push(`char ${name}_${j}[]=${q(s)};`));setup.push(`char* ${name}[]={${v.map((_,j)=>name+'_'+j).join(',')||'NULL'}};`);args.push(name,String(v.length));}
   else if(type==='string'){setup.push(`char ${name}[]=${q(v)};`);args.push(name);}else args.push(String(v)+(type==='uint'?'u':''));
  }else{
   let literal;
   if(type==='intmatrix')literal=({cpp:`{${v.map(r=>'{'+r.join(',')+'}').join(',')}}`,java:`new int[][]{${v.map(r=>'{'+r.join(',')+'}').join(',')}}`,rust:`vec![${v.map(r=>'vec!['+r.join(',')+']').join(',')}]`,go:`[][]int{${v.map(r=>'{'+r.join(',')+'}').join(',')}}`})[id];
   else if(type==='array')literal=({cpp:`{${v.join(',')}}`,java:`new int[]{${v.join(',')}}`,rust:`vec![${v.join(',')}]`,go:`[]int{${v.join(',')}}`})[id];
   else if(type==='strings')literal=({cpp:`{${v.map(q).join(',')}}`,java:`new String[]{${v.map(q).join(',')}}`,rust:`vec![${v.map(s=>q(s)+'.to_string()').join(',')}]`,go:`[]string{${v.map(q).join(',')}}`})[id];
   else if(type==='string')literal=q(v)+(id==='rust'?'.to_string()':'');
   else literal=String(v)+(id==='cpp'&&type==='uint'?'u':'');
   if(id==='java'&&type==='uint')literal=`(int)${v}L`;
   setup.push(id==='rust'?`let ${g.mutates===i?'mut ':''}${name}: ${types[id][type]} = ${literal};`:id==='go'?`var ${name} ${types[id][type]} = ${literal}`:`${types[id][type]} ${name} = ${literal};`);
   args.push(id==='rust'&&g.mutates===i?'&mut '+name:name);
  }
 }
 return {setup:setup.join('\n'),args:args.join(', ')};
}
const cppArrays=`template<class T> void aa_array(const std::vector<T>& a){std::cout<<"[";for(size_t i=0;i<a.size();i++){if(i)std::cout<<",";std::cout<<a[i];}std::cout<<"]";}
void aa_matrix(const std::vector<std::vector<int>>& a){std::cout<<"[";for(size_t i=0;i<a.size();i++){if(i)std::cout<<",";aa_array(a[i]);}std::cout<<"]";}`;
const cArrays=`static void aa_array(const int* a,int n){if(n<0||n>10000||(!a&&n)){printf("null");return;}printf("[");for(int i=0;i<n;i++){if(i)printf(",");printf("%d",a[i]);}printf("]");}
static void aa_matrix(int** a,int n,int* cols){if(n<0||n>10000||((!a||!cols)&&n)){printf("null");return;}printf("[");for(int i=0;i<n;i++){if(i)printf(",");aa_array(a[i],cols[i]);}printf("]");}`;
export function expansionProgram(g,id,code,options={}){
 const result=g.signature.result,mut=Number.isInteger(g.mutates),array=result==='array',matrix=result==='intmatrix',string=result==='string';
 const cases=g.tests.map((test,i)=>{
  i+=options.offset||0;
  const {setup,args}=inputs(g,test,id),prefix=q(`__ALGO_ARCADE_RESULT_${i}__{"value":`),fn=id==='rust'?`Solution::${snake(g.fn)}`:id==='cpp'?`Solution().${g.fn}`:id==='java'?`new Solution().${g.fn}`:g.fn;
  if(id==='c'){
   const extra=!mut&&(array||matrix)?', &aa_size'+(matrix?', &aa_cols':''):'';
   const call=mut?`${fn}(${args}); int** value=aa_input_${g.mutates}; int aa_size=${test.args[g.mutates].length}; int* aa_cols=aa_input_${g.mutates}_cols;`:`${array||matrix?'int aa_size=0; int* aa_cols=NULL;':''}${types.c[result]} value=${fn}(${args}${extra});`;
   const print=array?'aa_array(value,aa_size);':matrix?'aa_matrix(value,aa_size,aa_cols);':string?'aa_print_json(value);':result==='bool'?'printf("%s",value?"true":"false");':result==='uint'?'printf("%u",(unsigned)value);':'printf("%d",value);';
   const free=mut?'':matrix?'if(value&&aa_cols&&aa_size>=0&&aa_size<=10000){for(int j=0;j<aa_size;j++)free(value[j]);}free(value);free(aa_cols);':array||string?'free(value);':'';
   return `{${setup}\n${call}\nprintf("%s",${prefix});${print}printf("}\\n");${free}}`;
  }
  if(id==='cpp')return `{${setup}\n${mut?`${fn}(${args}); auto& value=aa_input_${g.mutates};`:`auto value=${fn}(${args});`}std::cout<<${prefix};${array?'aa_array(value);':matrix?'aa_matrix(value);':string?'aa_print_json(value);':result==='bool'?'std::cout<<(value?"true":"false");':'std::cout<<value;'}std::cout<<"}"<<std::endl;}`;
  if(id==='java')return `{${setup}\n${mut?`${fn}(${args}); ${types.java[result]} value=aa_input_${g.mutates};`:`${types.java[result]} value=${fn}(${args});`}System.out.println(${prefix}+${array?'java.util.Arrays.toString(value)':matrix?'java.util.Arrays.deepToString(value)':string?'aaJson(value)':result==='uint'?'Integer.toUnsignedLong(value)':'value'}+"}");}`;
  if(id==='rust')return `{${setup}\n${mut?`${fn}(${args}); let value=aa_input_${g.mutates};`:`let value=${fn}(${args});`}println!("__ALGO_ARCADE_RESULT_${i}__{{\\"value\\":${array||matrix?'{:?}':'{}'}}}",${string?'aa_json(&value)':'value'});}`;
  return `{${setup}\n${mut?`${fn}(${args})\nvalue:=aa_input_${g.mutates}`:`value:=${fn}(${args})`}\n${array||matrix?'if value == nil {value = '+types.go[result]+'{}}\n':''}aa_encoded,_:=aa_json.Marshal(value)\naa_fmt.Print(${prefix})\naa_fmt.Print(string(aa_encoded))\naa_fmt.Println("}")}`;
 }).join('\n');
 if(options.casesOnly)return cases;
 return expansionShell(id,code,cases,string);
}
export function expansionShell(id,code,cases,string=true){
 if(id==='c')return `#include <stdio.h>\n#include <stdbool.h>\n#include <stdint.h>\n#include <stdlib.h>\n${cArrays}\n${string?cJson:''}\n${code}\nint main(void){${cases}\nreturn 0;}`;
 if(id==='cpp')return `#include <iostream>\n#include <vector>\n#include <string>\n#include <cstdint>\n${cppArrays}\n${string?cppJson:''}\n${code}\nint main(){${cases}}`;
 if(id==='java')return `${code}\nclass Wandbox{${string?javaJson:''}public static void main(String[] args){${cases}}}`;
 if(id==='rust')return `${code}\n${string?rustJson:''}\nfn main(){${cases}}`;
 if(id==='go'){if(!/^\s*package\s+main\b/m.test(code))throw new Error('Go solutions must include package main.');return code.replace(/^(\s*package\s+main\b[^\S\r\n]*;?)/m,'$1\nimport aa_fmt "fmt"\nimport aa_json "encoding/json"\n')+`\nfunc main(){${cases}}`;}
 throw new Error('Unsupported language');
}

export function expansionSuite(gs,id,code){
 let offset=0;
 if(id==='python'){
  const cases=gs.map(g=>{const base=offset;offset+=g.tests.length;return `for _aa_i, _aa_args in enumerate(_aa_json.loads(${q(JSON.stringify(g.tests.map(t=>t.args)))})):\n    _aa_value = Solution().${g.fn}(*_aa_args)\n    ${Number.isInteger(g.mutates)?'_aa_value = _aa_args['+g.mutates+']':'# Scalar or returned collection'}\n    print('__ALGO_ARCADE_RESULT_' + str(${base} + _aa_i) + '__' + _aa_json.dumps({'value': _aa_value}, allow_nan=False))`;}).join('\n');
  return code+'\nimport json as _aa_json\n'+cases+'\n';
 }
 const cases=gs.map(g=>{const out=expansionProgram(g,id,code,{casesOnly:true,offset});offset+=g.tests.length;return out;}).join('\n');
 return expansionShell(id,code,cases,true);
}
