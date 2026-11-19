const snake=s=>s.replace(/([A-Z]+)([A-Z][a-z])/g,'$1_$2').replace(/([a-z0-9])([A-Z])/g,'$1_$2').toLowerCase();
const types={c:{int:'int',bool:'bool',string:'char*',array:'int*',chargrid:'char**',intmatrix:'int**'},cpp:{int:'int',bool:'bool',string:'string',array:'vector<int>&',chargrid:'vector<vector<char>>&',intmatrix:'vector<vector<int>>&'},java:{int:'int',bool:'boolean',string:'String',array:'int[]',chargrid:'char[][]',intmatrix:'int[][]'},rust:{int:'i32',bool:'bool',string:'String',array:'Vec<i32>',chargrid:'Vec<Vec<char>>',intmatrix:'Vec<Vec<i32>>'},go:{int:'int',bool:'bool',string:'string',array:'[]int',chargrid:'[][]byte',intmatrix:'[][]int'},python:{int:'int',bool:'bool',string:'str',array:'list[int]',chargrid:'list[list[str]]',intmatrix:'list[list[int]]'}};
export function moreStarter(g,id){
 const {args,result}=g.signature;
 if(id==='javascript')return `function ${g.fn}(${g.params}) {\n  // Turn the moves you just made into code.\n  \n}\n`;
 const t=types[id],fallback=result==='bool'?(id==='python'?'False':'false'):result==='string'?(id==='rust'?'String::new()':id==='c'?'calloc(1, 1)':'""'):'0';
 const params=args.flatMap(([name,type])=>id==='c'&&(type==='chargrid'||type==='intmatrix')?[`${t[type]} ${name}`,`int ${name}Size`,`int* ${name}ColSize`]:id==='c'&&type==='array'?[`int* ${name}`,`int ${name}Size`]:[id==='go'?`${name} ${t[type]}`:id==='rust'||id==='python'?`${name}: ${t[type]}`:`${t[type]} ${name}`]).join(', ');
 if(id==='python')return `class Solution:\n    def ${g.fn}(self, ${params}) -> ${t[result]}:\n        # Write your solution here.\n        return ${fallback}\n`;
 if(id==='rust')return `struct Solution;\n\nimpl Solution {\n    pub fn ${snake(g.fn)}(${params}) -> ${t[result]} {\n        // Write your solution here.\n        ${fallback}\n    }\n}\n`;
 if(id==='go')return `package main\n\nfunc ${g.fn}(${params}) ${t[result]} {\n    // Write your solution here.\n    return ${fallback}\n}\n`;
 if(id==='c')return `#include <stdbool.h>\n#include <string.h>\n#include <stdlib.h>\n\n${result==='string'?'/* Return a malloc/calloc-allocated, null-terminated string. */\n':''}${t[result]} ${g.fn}(${params}) {\n    // Write your solution here.\n    return ${fallback};\n}\n`;
 if(id==='cpp')return `#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${t[result]} ${g.fn}(${params}) {\n        // Write your solution here.\n        return ${fallback};\n    }\n};\n`;
 return `import java.util.*;\n\nclass Solution {\n    public ${t[result]} ${g.fn}(${params}) {\n        // Write your solution here.\n        return ${fallback};\n    }\n}\n`;
}
const q=JSON.stringify;
// Only these built-in scalar/string/vector test arguments are embedded in source.
function argumentsFor(g,test,id){
 const setup=[],args=[];
 g.signature.args.forEach(([,type],i)=>{
  const value=test.args[i],name=`aa_input_${i}`;
  if(type==='intmatrix'){
   if(id==='c'){
    value.forEach((row,j)=>setup.push(`int ${name}_row_${j}[] = {${row.join(',')||'0'}};`));
    setup.push(`int* ${name}[] = {${value.map((_,j)=>name+'_row_'+j).join(',')||'NULL'}};`);
    setup.push(`int ${name}_cols[] = {${value.map(row=>row.length).join(',')||'0'}};`);
    args.push(name,String(value.length),name+'_cols');
   }
   if(id==='cpp'){setup.push(`std::vector<std::vector<int>> ${name} = {${value.map(row=>'{'+row.join(',')+'}').join(',')}};`);args.push(name);}
   if(id==='java')args.push(`new int[][]{${value.map(row=>'{'+row.join(',')+'}').join(',')}}`);
   if(id==='go')args.push(`[][]int{${value.map(row=>'{'+row.join(',')+'}').join(',')}}`);
   if(id==='rust')args.push(`vec![${value.map(row=>'vec!['+row.join(',')+']').join(',')}]`);
  }else if(type==='chargrid'){
   if(id==='c'){
    value.forEach((row,j)=>setup.push(`char ${name}_row_${j}[] = ${q(row.join(''))};`));
    setup.push(`char* ${name}[] = {${value.map((_,j)=>name+'_row_'+j).join(',')}};`);
    setup.push(`int ${name}_cols[] = {${value.map(row=>row.length).join(',')}};`);
    args.push(name,String(value.length),name+'_cols');
   }
   if(id==='cpp'){setup.push(`std::vector<std::vector<char>> ${name} = {${value.map(row=>'{'+row.map(c=>"'"+c+"'").join(',')+'}').join(',')}};`);args.push(name);}
   if(id==='java')args.push(`new char[][]{${value.map(row=>'{'+row.map(c=>"'"+c+"'").join(',')+'}').join(',')}}`);
   if(id==='go')args.push(`[][]byte{${value.map(row=>'[]byte('+q(row.join(''))+')').join(',')}}`);
   if(id==='rust')args.push(`vec![${value.map(row=>'vec!['+row.map(c=>"'"+c+"'").join(',')+']').join(',')}]`);
  }else if(type==='array'){
   if(id==='c'){setup.push(`int ${name}[] = {${value.join(',')||'0'}};`);args.push(name,String(value.length));}
   if(id==='cpp'){setup.push(`std::vector<int> ${name} = {${value.join(',')}};`);args.push(name);}
   if(id==='java')args.push(`new int[]{${value.join(',')}}`);
   if(id==='go')args.push(`[]int{${value.join(',')}}`);
   if(id==='rust')args.push(`vec![${value.join(',')}]`);
  }else if(type==='string'){
   if(id==='c'){setup.push(`char ${name}[] = ${q(value)};`);args.push(name);}
   else args.push(q(value)+(id==='rust'?'.to_string()':''));
  }else args.push(String(value));
 });
 return {setup:setup.join('\n'),args:args.join(', ')};
}
export function moreProgram(g,id,code){
 const boolean=g.signature.result==='bool',string=g.signature.result==='string';
 const cases=g.tests.map((test,i)=>{
  const {setup,args}=argumentsFor(g,test,id),prefix=`__ALGO_ARCADE_RESULT_${i}__{"value":`;
  if(id==='c')return `{${setup}\n${types.c[g.signature.result]} value = ${g.fn}(${args});\nprintf("%s", ${q(prefix)});\n${string?'aa_print_json(value); free(value);':boolean?'printf("%s", value ? "true" : "false");':'printf("%d", value);'}\nprintf("}\\n");}`;
  if(id==='cpp')return `{${setup}\nauto value = Solution().${g.fn}(${args});\nstd::cout << ${q(prefix)};\n${string?'aa_print_json(value);':`std::cout << ${boolean?'(value ? "true" : "false")':'value'};`}\nstd::cout << "}" << std::endl;}`;
  if(id==='java')return `{${types.java[g.signature.result]} value = new Solution().${g.fn}(${args});\nSystem.out.println(${q(prefix)} + ${string?'aaJson(value)':'value'} + "}");}`;
  if(id==='rust')return `{let value = Solution::${snake(g.fn)}(${args});\nprintln!("__ALGO_ARCADE_RESULT_${i}__{{\\"value\\":{}}}", ${string?'aa_json(&value)':'value'});}`;
  return `{value := ${g.fn}(${args})\naa_fmt.Print(${q(prefix)})\n${string?'aa_encoded, _ := aa_json.Marshal(value)\naa_fmt.Print(string(aa_encoded))':'aa_fmt.Print(value)'}\naa_fmt.Println("}")}`;
 }).join('\n');
 if(id==='c')return `#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>\n${string?cJson:''}\n${code}\nint main(void) {\n${cases}\nreturn 0;\n}`;
 if(id==='cpp')return `#include <iostream>\n#include <vector>\n#include <string>\n${string?cppJson:''}\n${code}\nint main() {\n${cases}\n}`;
 if(id==='java')return `${code}\nclass Wandbox { ${string?javaJson:''} public static void main(String[] args) {\n${cases}\n}}`;
 if(id==='rust')return `${code}\n${string?rustJson:''}\nfn main() {\n${cases}\n}`;
 if(id==='go'){
  if(!/^\s*package\s+main\b/m.test(code))throw new Error('Go solutions must include package main.');
  return code.replace(/^(\s*package\s+main\b[^\S\r\n]*;?)/m,'$1\nimport aa_fmt "fmt"\n'+(string?'import aa_json "encoding/json"\n':''))+`\nfunc main() {\n${cases}\n}`;
 }
 throw new Error('Unsupported remote language.');
}

// JSON escaping prevents returned strings from altering the test-result format.
const cJson=String.raw`
static void aa_print_json(const char* s) {
 if (!s) { printf("null"); return; }
 putchar('"');
 for (const unsigned char* p=(const unsigned char*)s; *p; ++p) {
  if (*p=='"' || *p=='\\') { putchar('\\'); putchar(*p); }
  else if (*p<32) printf("\\u%04x", (unsigned)*p);
  else putchar(*p);
 }
 putchar('"');
}`;
const javaJson=String.raw`
static String aaJson(String s) {
 if (s==null) return "null";
 StringBuilder b=new StringBuilder("\"");
 for (char c:s.toCharArray()) {
  if(c=='"'||c=='\\') b.append('\\').append(c);
  else if(c<32||c>126) b.append(String.format("\\u%04x",(int)c));
  else b.append(c);
 }
 return b.append('"').toString();
}`;
const rustJson=String.raw`
fn aa_json(s: &str) -> String {
 let mut out=String::from("\"");
 for c in s.chars() {
  match c {
   '"' => out.push_str("\\\""),
   '\\' => out.push_str("\\\\"),
   c if (c as u32)<32 => out.push_str(&format!("\\u{:04x}",c as u32)),
   _ => out.push(c)
  }
 }
 out.push('"'); out
}`;

const cppJson=String.raw`
static void aa_print_json(const std::string& s) {
 const char* hex="0123456789abcdef";
 std::cout << '\"';
 for (unsigned char c:s) {
  if(c=='\"' || c=='\\') std::cout << '\\' << c;
  else if(c<32) std::cout << "\\u00" << hex[c>>4] << hex[c&15];
  else std::cout << c;
 }
 std::cout << '\"';
}`;
export {cJson,cppJson,javaJson,rustJson};
