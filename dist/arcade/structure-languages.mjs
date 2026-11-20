import {pythonCallHelper} from './python-call.mjs';
import {structureTypes as types,nodeDefinitions,classMethods} from './structure-types.mjs';
import {nativeHelpers} from './structure-native.mjs';
import {cJson,cppJson,javaJson,rustJson} from './more-languages.mjs';
import {snake} from './expansion-languages.mjs';
const q=JSON.stringify,cap=s=>s[0].toUpperCase()+s.slice(1),collection=t=>['array','strings','intmatrix','stringmatrix','chargrid','lists'].includes(t);
const cClass=g=>g.api==='trie'?'trie':g.api==='dictionary'?'wordDictionary':g.api==='median'?'medianFinder':g.api;
function method(g,id,name,args,result,member=false){
 const mut=result==='void',t=types[id],ret=mut?({python:'None',rust:'()',go:'',c:'void',cpp:'void',java:'void'})[id]:t[result];
 const params=args.flatMap(([n,k])=>id==='c'?[`${t[k]} ${n}`,...(collection(k)?[`int ${n}Size`]:[]),...(['intmatrix','chargrid'].includes(k)?[`int* ${n}ColSize`]:[])]:[id==='go'?`${n} ${t[k]}`:id==='rust'||id==='python'?`${n}: ${t[k]}`:`${t[k]}${id==='cpp'&&collection(k)?'&':''} ${n}`]);
 const cOut=id==='c'&&['strings','intmatrix','stringmatrix'].includes(result);
 if(cOut){params.push('int* returnSize');if(result!=='strings')params.push('int** returnColumnSizes');}
 const fallback=mut?'':result==='bool'?(id==='python'?'False':'false'):result==='string'?(id==='c'?'calloc(1,1)':id==='rust'?'String::new()':'""'):['tree','treeref','list','graph','nodevalue'].includes(result)?({c:'NULL',cpp:'nullptr',java:'null',rust:'None',go:'nil',python:'None'})[id]:collection(result)?({c:'NULL',cpp:'{}',java:result==='stringmatrix'?'new ArrayList<>()':result==='strings'?'new String[0]':'new int[0][]',rust:'vec![]',go:t[result]+'{}',python:'[]'})[id]:result==='double'?'0.0':'0';
 if(id==='python')return `    def ${name}(self${params.length?', '+params.join(', '):''}) -> ${ret}:\n        ${mut?'pass':'return '+fallback}\n`;
 if(id==='rust')return `    pub fn ${snake(name)}(${member?'&mut self'+(params.length?', ':''):''}${params.join(', ')}) -> ${ret} {\n        ${fallback}\n    }\n`;
 if(id==='go')return `func ${member?'(obj *'+g.fn+') ':''}${member?cap(name):name}(${params.join(', ')})${ret?' '+ret:''} {\n    ${mut?'':'return '+fallback}\n}\n`;
 if(id==='c')return `${ret} ${g.api?cClass(g)+cap(name):name}(${member?g.fn+'* obj'+(params.length?', ':''):''}${params.join(', ')||(!member?'void':'')}) {\n    ${cOut?'*returnSize = 0;\n    ':''}${cOut&&result!=='strings'?'*returnColumnSizes = NULL;\n    ':''}${mut?'/* Update the structure. */':'return '+fallback+';'}\n}\n`;
 return `    ${id==='java'?'public ':''}${ret} ${name}(${params.join(', ')}) {\n        ${mut?'// Update the structure.':'return '+fallback+';'}\n    }\n`;
}
export function structureStarter(g,id){
 if(id==='javascript'){
  const comments='// ListNode(val, next), TreeNode(val, left, right), and Node(val, neighbors)\n// are provided by the runner. Fields: val/next, val/left/right, val/neighbors.\n';
  if(g.api)return comments+`class ${g.fn} {\n  constructor() {\n    // Initialize any per-instance state.\n  }\n${classMethods[g.api].map(([name,args])=>`  ${name}(${args.map(a=>a[0]).join(', ')}) {\n    // Implement this operation.\n  }`).join('\n')}\n}\n`;
  return comments+`function ${g.fn}(${g.params}) {\n  // ${g.mutates===0?'Rewire the existing nodes in place; return nothing.':'Translate your game decisions into code.'}\n}\n`;
 }
 const usesNodes=[...g.signature.args.map(a=>a[1]),g.signature.result].some(t=>['list','lists','tree','treeref','graph','nodevalue'].includes(t));
 const notes=usesNodes?(id==='python'?nodeDefinitions[id].split('\n').map(l=>'# '+l).join('\n')+'\n\n':'/* Supplied by the test harness; do not redefine:\n'+nodeDefinitions[id]+'\n*/\n\n'):'';
 const headers=({c:'#include <stdbool.h>\n#include <stdlib.h>\n#include <string.h>\n',cpp:'#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <unordered_map>\n#include <unordered_set>\n#include <map>\n#include <set>\n#include <queue>\n#include <functional>\n#include <optional>\n#include <sstream>\n#include <stdexcept>\n#include <climits>\nusing namespace std;\n',java:'import java.util.*;\n',rust:'use std::rc::Rc;\nuse std::cell::RefCell;\n',go:'package main\n',python:''})[id];
 const stateful=['trie','dictionary','median'].includes(g.api);
 const methods=(g.api?classMethods[g.api]:[[g.fn,g.signature.args,g.mutates===0?'void':g.signature.result]]).map(([name,args,result])=>method(g,id,name,args,result,!!g.api&&(id!=='c'||stateful))).join('\n');
 if(id==='c')return headers+'\n'+notes+(stateful?`typedef struct ${g.fn} {\n    int placeholder; // Replace with your data structure fields.\n} ${g.fn};\n\n${g.fn}* ${cClass(g)}Create(void) {\n    return calloc(1, sizeof(${g.fn}));\n}\n\n`:'')+methods;
 if(id==='cpp')return headers+'\n'+notes+`class ${g.api?g.fn:'Solution'} {\npublic:\n${methods}};\n`;
 if(id==='java')return headers+'\n'+notes+`class ${g.api?g.fn:'Solution'} {\n${methods}}\n`;
 if(id==='python')return notes+`class ${g.api?g.fn:'Solution'}:\n${g.api?'    def __init__(self):\n        pass\n\n':''}${methods}`;
 if(id==='rust')return headers+'\n'+notes+`struct ${g.api?g.fn:'Solution'}${g.api?' {\n    // Add per-instance fields.\n}':';'}\n\nimpl ${g.api?g.fn:'Solution'} {\n${g.api?'    pub fn new() -> Self { Self {} }\n\n':''}${methods}}\n`;
 return headers+'\n'+notes+(g.api?`type ${g.fn} struct {\n    // Add per-instance fields.\n}\nfunc New${g.fn}() *${g.fn} { return &${g.fn}{} }\n\n`:'')+methods;
}
export function structureContract(g,id){
 let text='';
 if(g.api)text=['trie','dictionary','median'].includes(g.api)?`Implement ${g.fn} and every provided operation. Each test creates a fresh object and preserves its state across operations. `:id==='c'?'Implement both stateless codec functions; the encoded string must contain all information. ':'Implement both codec methods. Encoding and decoding use separate fresh instances. ';
 if(g.cycle)text+='pos builds the tail connection and is not passed to hasCycle. ';
 if(g.mutates===0)text+='Modify the original chain in place; return nothing. Node references and their values must be preserved. ';
 if(g.signature.args.some(a=>['tree','treeref'].includes(a[1]))||g.signature.result==='tree')text+='Trees are displayed as level-order arrays with null gaps; your code receives or returns TreeNode references. ';
 if(g.category==='Linked List')text+='Arrays in examples become actual ListNode chains. ';
 if(g.number===133)text+='Adjacency lists become actual Node objects; the clone must use fresh identities. ';
 if(id==='rust')text+='Node links use Option<Rc<RefCell<…>>> (ListLink, TreeLink, GraphLink), including cycle-capable lists. Clone an Rc to share identity; allocate a new Rc for a new node. ';
 if(id==='c')text+='For returned collections allocate the output and set returnSize; nested outputs also need returnColumnSizes. Returned strings must be null-terminated. Nodes must remain valid after your function returns. ';
 return text+'Keep the provided interface. The test harness supplies node types, builds inputs, and serializes outputs; do not redefine node types or add a main function.';
}
function literal(v,type,id){
 if(type==='int')return String(v);
 if(type==='string')return q(v)+(id==='rust'?'.to_string()':'');
 if(type==='treevals')return ({cpp:'{'+v.map(x=>x===null?'std::nullopt':x).join(',')+'}',java:'new Integer[]{'+v.map(x=>x===null?'null':x).join(',')+'}',rust:'vec!['+v.map(x=>x===null?'None':`Some(${x})`).join(',')+']',go:'[]any{'+v.map(x=>x===null?'nil':x).join(',')+'}'})[id];
 const row=(a,t)=>literal(a,t,id),arr=v.map(x=>type==='array'?String(x):type==='strings'?literal(x,'string',id):type==='chargrid'?({cpp:'{'+x.map(c=>"'"+c+"'").join(',')+'}',java:'{'+x.map(c=>"'"+c+"'").join(',')+'}',rust:'vec!['+x.map(c=>"'"+c+"'").join(',')+']',go:'{'+x.map(c=>"'"+c+"'").join(',')+'}'})[id]:row(x,'array')).join(',');
 return id==='rust'?`vec![${arr}]`:id==='java'?`new ${types.java[type]}{${arr}}`:id==='go'?`${types.go[type]}{${arr}}`:`{${arr}}`;
}
const helper=(name,id)=>id==='java'||id==='go'?'aa'+cap(name):'aa_'+name;
function setupInputs(g,test,id){const setup=[],args=[];
 for(const [i,[,type]] of g.signature.args.entries()){
  const v=test.args[i],name='aa_input_'+i;
  if(type==='treeref'){const expr=`${helper('find',id)}(${id==='rust'?'&':''}aa_input_0,${v})`;setup.push(declare(name,type,expr,id));args.push(name);continue;}
  if(id==='c'){
   const cArray=(a,name,ctype='int',convert=String)=>setup.push(`${ctype} ${name}[]={${a.map(convert).join(',')||0}};`);
   if(type==='list'){cArray(v,name+'_values');setup.push(`struct ListNode* ${name}=aa_list(${name}_values,${v.length},${g.cycle?test.args[1]:-1});`);args.push(name);}
   else if(type==='lists'){v.forEach((a,j)=>{cArray(a,`${name}_${j}`);setup.push(`struct ListNode* ${name}_head_${j}=aa_list(${name}_${j},${a.length},-1);`);});setup.push(`struct ListNode* ${name}[]={${v.map((_,j)=>name+'_head_'+j).join(',')||'NULL'}};`);args.push(name,v.length);}
   else if(type==='tree'){cArray(v,name+'_values','long long',x=>x===null?'9223372036854775807LL':String(x));setup.push(`struct TreeNode* ${name}=aa_tree(${name}_values,${v.length});`);args.push(name);}
   else if(type==='graph'){v.forEach((a,j)=>cArray(a,`${name}_${j}`));setup.push(`int* ${name}_rows[]={${v.map((_,j)=>name+'_'+j).join(',')||'NULL'}};int ${name}_cols[]={${v.map(a=>a.length).join(',')||0}};struct Node* ${name}=aa_graph(${name}_rows,${v.length},${name}_cols);`);args.push(name);}
   else if(type==='strings'||type==='chargrid'){v.forEach((s,j)=>setup.push(`char ${name}_${j}[]=${q(type==='chargrid'?s.join(''):s)};`));setup.push(`char* ${name}[]={${v.map((_,j)=>name+'_'+j).join(',')||'NULL'}};`);args.push(name,v.length);if(type==='chargrid'){cArray(v.map(a=>a.length),name+'_cols');args.push(name+'_cols');}}
   else if(type==='array'){cArray(v,name);args.push(name,v.length);}
   else args.push(String(v));
  }else{
   let expr;if(type==='list')expr=`${helper('list',id)}(${literal(v,'array',id)},${g.cycle?test.args[1]:-1})`;
   else if(type==='tree')expr=`${helper('tree',id)}(${literal(v,'treevals',id)})`;
   else if(type==='graph')expr=`${helper('graph',id)}(${literal(v,'intmatrix',id)})`;
   else if(type==='lists'){const items=v.map(a=>`${helper('list',id)}(${literal(a,'array',id)},-1)`).join(',');expr=id==='rust'?`vec![${items}]`:id==='java'?`new ListNode[]{${items}}`:id==='go'?`[]*ListNode{${items}}`:`{${items}}`;}
   else expr=literal(v,type,id);
   setup.push(declare(name,type,expr,id));args.push(name);
  }
 }
 return {setup:setup.join('\n'),args:args.map(a=>id==='rust'?a+'.clone()':a).join(', ')};
}
function declare(name,type,value,id){return id==='rust'?`let ${name}: ${types.rust[type]} = ${value};`:id==='go'?`${name}:=${value}`:`${types[id][type]} ${name} = ${value};`;}
function cPrint(result,value='value'){return result==='list'?`aa_out_list(${value});`:result==='tree'?`aa_out_tree(${value});`:result==='nodevalue'?`if(aa_member(aa_input_0,${value}))printf("%d",${value}->val);else printf("null");`:result==='graph'?`aa_out_graph(${value},aa_orig,aa_orig_n);`:result==='string'?`aa_print_json(${value});`:result==='strings'?`aa_out_strings(${value},aa_size);`:result==='intmatrix'?`aa_out_intmatrix(${value},aa_size,aa_cols);`:result==='stringmatrix'?`aa_out_groups(${value},aa_size,aa_cols);`:result==='bool'?`printf("%s",${value}?"true":"false");`:`printf("%d",${value});`;}
function normalize(g,id){const r=g.signature.result;if(id==='cpp')return r==='list'?'aa_out_list(value);':r==='tree'?'aa_out_tree(value);':r==='nodevalue'?'if(aa_member(aa_input_0,value))aa_out(value->val);else std::cout<<"null";':r==='graph'?'aa_out_graph(value,aa_orig);':'aa_out(value);';
 if(id==='java')return r==='list'?'aaListValues(value)':r==='tree'?'aaTreeValues(value)':r==='nodevalue'?'aaMember(aa_input_0,value)?value.val:null':r==='graph'?'aaCloneValues(value,aa_orig)':'value';
 if(id==='rust')return r==='list'?'aa_list_value(&value)':r==='tree'?'aa_tree_value(&value)':r==='nodevalue'?'if aa_member(&aa_input_0,&value){value.as_ref().unwrap().borrow().val.to_string()}else{"null".into()}':r==='graph'?'aa_clone_value(&value,&aa_orig)':r==='string'?'aa_json(&value)':r==='strings'?'aa_strings(&value)':r==='stringmatrix'?'aa_groups(&value)':r==='intmatrix'?'format!("{:?}",value)':'value.to_string()';
 return r==='list'?'aaListValue(value)':r==='tree'?'aaTreeValue(value)':r==='graph'?'aaCloneValue(value,aa_orig)':'value';
}
export function structureProgram(g,id,code,options={}){
 if(id==='python')return pythonProgram([g],code);
 const cases=g.tests.map((test,i)=>{
  i+=options.offset||0;const prefix=q(`__ALGO_ARCADE_RESULT_${i}__{"value":`);
  if(['trie','dictionary','median'].includes(g.api))return operationCase(g,id,test,i);
  const {setup,args}=setupInputs(g,test,id),result=g.signature.result;let body=setup+'\n';
  if(result==='graph')body+=id==='c'?'struct Node* aa_orig[1000];int aa_orig_n=aa_graph_nodes(aa_input_0,aa_orig);\n':id==='cpp'?'auto aa_orig=aa_graph_nodes(aa_input_0);\n':id==='java'?'java.util.List<Node> aa_orig=aaGraphNodes(aa_input_0);\n':id==='rust'?'let aa_orig=aa_graph_nodes(&aa_input_0);\n':'aa_orig:=aaGraphNodes(aa_input_0)\n';
  if(g.mutates===0)body+=reorderBefore(id);
  let call;
  if(g.api){const [encode,decode]=classMethods[g.api].map(m=>m[0]);call=id==='c'?`${cClass(g)+cap(decode)}(${cClass(g)+cap(encode)}(${args})${result==='strings'?', &aa_size':''})`:id==='cpp'?`${g.fn}().${decode}(${g.fn}().${encode}(${args}))`:id==='java'?`new ${g.fn}().${decode}(new ${g.fn}().${encode}(${args}))`:id==='rust'?`${g.fn}::new().${snake(decode)}(${g.fn}::new().${snake(encode)}(${args}))`:`New${g.fn}().${cap(decode)}(New${g.fn}().${cap(encode)}(${args}))`;}
  else{const fn=id==='cpp'?`Solution().${g.fn}`:id==='java'?`new Solution().${g.fn}`:id==='rust'?`Solution::${snake(g.fn)}`:g.fn;const extra=id==='c'&&['strings','intmatrix','stringmatrix'].includes(result)?', &aa_size'+(result==='strings'?'':', &aa_cols'):'';call=`${fn}(${args}${extra})`;}
  if(id==='c'){
   body+='int aa_size=0;int* aa_cols=NULL;\n'+(g.mutates===0?`${call};struct ListNode* value=aa_input_0;\n`:declare('value',result,call,id))+'\n';
   body+=`printf("%s",${prefix});`+(g.mutates===0?reorderCheck(id):'')+cPrint(result)+`printf("}\\n");`;
  }else if(id==='cpp')body+=(g.mutates===0?`${call};auto value=aa_input_0;`:`auto value=${call};`)+(g.mutates===0?reorderCheck(id):'')+`std::cout<<${prefix};${normalize(g,id)}std::cout<<"}"<<std::endl;`;
  else if(id==='java')body+=(g.mutates===0?`${call};ListNode value=aa_input_0;`:declare('value',result,call,id))+(g.mutates===0?reorderCheck(id):'')+`System.out.println(${prefix}+aaValue(${normalize(g,id)})+"}");`;
  else if(id==='rust')body+=(g.mutates===0?`${call};let value=aa_input_0.clone();`:`let value=${call};`)+(g.mutates===0?reorderCheck(id):'')+`println!("__ALGO_ARCADE_RESULT_${i}__{{\\"value\\":{}}}",${normalize(g,id)});`;
  else{body+=(g.mutates===0?`${call}\nvalue:=aa_input_0`:`value:=${call}`)+'\n'+(g.mutates===0?reorderCheck(id):'');if(result==='nodevalue')body+='var aa_value any\nif aaMember(aa_input_0,value){aa_value=value.Val}\n';else body+=`aa_value:=${normalize(g,id)}\n`+(collection(result)?`if aa_value==nil{aa_value=${types.go[result]}{}}\n`:'');body+=`aa_encoded,aa_error:=aa_json.Marshal(aa_value)\nif aa_error!=nil{panic(aa_error)}\naa_fmt.Println(${prefix}+string(aa_encoded)+"}")`;}
  return wrapCase(body,id,i);
 }).join('\n');
 return options.casesOnly?cases:structureShell(id,code,cases);
}
function wrapCase(body,id,i){if(id==='java')return `{try{${body}}catch(Throwable e){System.out.println("__ALGO_ARCADE_RESULT_${i}__{\\"error\\":\\"Solution threw an exception.\\"}");e.printStackTrace(System.err);}}`;if(id==='cpp')return `{try{${body}}catch(const std::exception& e){std::cout<<"__ALGO_ARCADE_RESULT_${i}__{\\"error\\":\\"Invalid structure or solution exception.\\"}"<<std::endl;std::cerr<<e.what()<<std::endl;}}`;return `{${body}\n}`;}
function reorderBefore(id){return ({c:'struct ListNode* aa_before[10000];int aa_before_n=aa_list_nodes(aa_input_0,aa_before);int aa_before_vals[10000];for(int j=0;j<aa_before_n;j++)aa_before_vals[j]=aa_before[j]->val;\n',cpp:'auto aa_before=aa_list_nodes(aa_input_0);std::vector<int> aa_before_vals;for(auto n:aa_before)aa_before_vals.push_back(n->val);\n',java:'java.util.List<ListNode> aa_before=aaListNodes(aa_input_0);java.util.List<Integer> aa_before_vals=aaListValues(aa_input_0);\n',rust:'let aa_before=aa_list_nodes(&aa_input_0);let aa_before_vals:Vec<_>=aa_before.iter().map(|n|n.borrow().val).collect();\n',go:'aa_before:=aaListNodes(aa_input_0)\naa_before_vals:=aaListValue(aa_input_0)\n'})[id];}
function reorderCheck(id){return ({c:'struct ListNode* aa_after[10000];int aa_after_n=aa_list_nodes(value,aa_after);bool aa_valid=aa_after_n==aa_before_n;for(int j=0;j<aa_before_n;j++){bool found=false;for(int k=0;k<aa_after_n;k++)if(aa_after[k]==aa_before[j])found=true;if(!found||aa_before[j]->val!=aa_before_vals[j])aa_valid=false;}if(aa_valid)for(int j=0;j<aa_after_n;j++)if(aa_after[j]!=aa_before[j%2?aa_before_n-1-j/2:j/2])aa_valid=false;if(!aa_valid){printf("null");}else ',cpp:'auto aa_after=aa_list_nodes(value);if(aa_after.size()!=aa_before.size())throw std::runtime_error("Node count changed");for(size_t j=0;j<aa_before.size();j++)if(aa_after[j]!=aa_before[j%2?aa_before.size()-1-j/2:j/2]||aa_before[j]->val!=aa_before_vals[j]||std::find(aa_after.begin(),aa_after.end(),aa_before[j])==aa_after.end())throw std::runtime_error("Preserve identities and values");',java:'java.util.List<ListNode> aa_after=aaListNodes(value);if(aa_after.size()!=aa_before.size())throw new RuntimeException("Node count changed");for(int j=0;j<aa_before.size();j++)if(aa_after.get(j)!=aa_before.get(j%2==0?j/2:aa_before.size()-1-j/2)||aa_before.get(j).val!=aa_before_vals.get(j)||!aa_after.contains(aa_before.get(j)))throw new RuntimeException("Preserve identities and values");',rust:'let aa_after=aa_list_nodes(&value);assert_eq!(aa_after.len(),aa_before.len());for(j,n)in aa_before.iter().enumerate(){assert!(std::rc::Rc::ptr_eq(&aa_after[j],&aa_before[if j%2==0{j/2}else{aa_before.len()-1-j/2}]));assert_eq!(n.borrow().val,aa_before_vals[j]);assert!(aa_after.iter().any(|a|std::rc::Rc::ptr_eq(a,n)));}',go:'aa_after:=aaListNodes(value)\nif len(aa_after)!=len(aa_before){panic("Node count changed")}\nfor j,n:=range aa_before{expected:=j/2;if j%2==1{expected=len(aa_before)-1-j/2};if aa_after[j]!=aa_before[expected]{panic("Incorrect node order")};found:=false;for _,a:=range aa_after{if a==n{found=true}};if !found||n.Val!=aa_before_vals[j]{panic("Preserve identities and values")}}\n'})[id];}
function operationCase(g,id,test,i){const [ops,values]=test.args,prefix=q(`__ALGO_ARCADE_RESULT_${i}__{"value":[`);let body=({c:`${g.fn}* obj=${cClass(g)}Create();printf("%s",${prefix});`,cpp:`${g.fn} obj;std::cout<<${prefix};`,java:`${g.fn} obj=new ${g.fn}();java.util.List<Object> value=new java.util.ArrayList<>();`,rust:`let mut obj=${g.fn}::new();let mut aa_out:Vec<String>=vec![];`,go:`obj:=New${g.fn}()\nvalue:=[]any{}\n`})[id];
 for(let j=0;j<ops.length;j++){const op=ops[j],ret=classMethods[g.api].find(m=>m[0]===op)[2],arg=op==='findMedian'?'':typeof values[j]==='string'?literal(values[j],'string',id):String(values[j]);const call=id==='c'?`${cClass(g)+cap(op)}(obj${arg?', '+arg:''})`:id==='rust'?`obj.${snake(op)}(${arg})`:id==='go'?`obj.${cap(op)}(${arg})`:`obj.${op}(${arg})`;
  if(id==='c')body+=(j?'printf(",");':'')+(ret==='void'?`${call};printf("null");`:ret==='bool'?`printf("%s",${call}?"true":"false");`:`printf("%.17g",${call});`);
  else if(id==='cpp')body+=(j?'std::cout<<",";':'')+(ret==='void'?`${call};std::cout<<"null";`:`aa_out(${call});`);
  else if(id==='java')body+=ret==='void'?`${call};value.add(null);`:`value.add(${call});`;
  else if(id==='rust')body+=ret==='void'?`${call};aa_out.push("null".into());`:`aa_out.push(${call}.to_string());`;
  else body+=ret==='void'?`${call}\nvalue=append(value,nil)\n`:`value=append(value,${call})\n`;
 }
 body+=({c:'printf("]}\\n");',cpp:'std::cout<<"]}"<<std::endl;',java:`System.out.println(${q(`__ALGO_ARCADE_RESULT_${i}__{"value":`)}+aaValue(value)+"}");`,rust:`println!("__ALGO_ARCADE_RESULT_${i}__{{\\"value\\":[{}]}}",aa_out.join(","));`,go:`aa_encoded,_:=aa_json.Marshal(value)\naa_fmt.Println(${q(`__ALGO_ARCADE_RESULT_${i}__{"value":`)}+string(aa_encoded)+"}")`})[id];return wrapCase(body,id,i);
}
export function structureShell(id,code,cases){
 if(id==='c')return `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n${nodeDefinitions.c}\n${cJson}\n${nativeHelpers.c}\n${code}\nint main(void){${cases}\nreturn 0;}`;
 if(id==='cpp')return `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <unordered_map>\n#include <unordered_set>\n#include <map>\n#include <set>\n#include <queue>\n#include <functional>\n#include <optional>\n#include <sstream>\n#include <stdexcept>\n#include <climits>\n${nodeDefinitions.cpp}\n${cppJson}\n${nativeHelpers.cpp}\n${code}\nint main(){${cases}}`;
 if(id==='java')return `${code}\n${nodeDefinitions.java}\nclass Wandbox{${javaJson}\n${nativeHelpers.java}\npublic static void main(String[] args){${cases}}}`;
 if(id==='rust')return `${nodeDefinitions.rust}\n${rustJson}\n${nativeHelpers.rust}\n${code}\nfn main(){${cases}}`;
 if(id==='go'){if(!/^\s*package\s+main\b/m.test(code))throw new Error('Go solutions must include package main.');return code.replace(/^(\s*package\s+main\b[^\S\r\n]*;?)/m,'$1\nimport aa_fmt "fmt"\nimport aa_json "encoding/json"\n')+`\n${nodeDefinitions.go}\n${nativeHelpers.go}\nfunc main(){${cases}}`;}
 throw new Error('Unknown language');
}
function pythonProgram(gs,code){let offset=0;const cases=gs.map(g=>{const base=offset;offset+=g.tests.length;let body='';
 if(['trie','dictionary','median'].includes(g.api))body=`obj=${g.fn}()\nvalue=[]\nfor op, arg in zip(raw[0],raw[1]):\n    result=getattr(obj,op)(*([] if op=='findMedian' else [arg]))\n    value.append(None if op in ('insert','addWord','addNum') else result)`;
 else if(g.api){const tree=g.api==='treeCodec';body=`encoded=${g.fn}().${tree?'serialize(_aa_tree(raw[0]))':'encode(raw[0])'}\nif not isinstance(encoded,str) or len(encoded)>50000: raise ValueError('Encode to a self-contained string')\nvalue=${g.fn}().${tree?'deserialize':'decode'}(encoded)${tree?'\nvalue=_aa_tree_value(value)':''}`;}
 else{
  body='a=[]\n'+g.signature.args.map(([,t],i)=>`a.append(${t==='list'?`_aa_list(raw[${i}]${g.cycle?',raw[1]':''})`:t==='lists'?`[_aa_list(x) for x in raw[${i}]]`:t==='tree'?`_aa_tree(raw[${i}])`:t==='treeref'?`_aa_find(a[0],raw[${i}])`:t==='graph'?`_aa_graph(raw[${i}])`:`raw[${i}]`})`).join('\n');
  if(g.number===133)body+='\noriginal=_aa_graph_nodes(a[0])';
  if(g.mutates===0)body+='\nbefore=_aa_list_nodes(a[0]); before_values=[n.val for n in before]';
  body+=`\nvalue=_aa_call_solution(${q(g.fn)}, a)`;
  if(g.mutates===0)body+='\nvalue=a[0]\nafter=_aa_list_nodes(value)\nif len(before)!=len(after) or any(not any(n is m for m in after) or n.val!=v for n,v in zip(before,before_values)): raise ValueError("Preserve nodes and values")\nif any(n is not before[i//2 if i%2==0 else len(before)-1-i//2] for i,n in enumerate(after)): raise ValueError("Incorrect node order")';
  const r=g.signature.result;body+=r==='list'?'\nvalue=[n.val for n in _aa_list_nodes(value)]':r==='tree'?'\nvalue=_aa_tree_value(value)':r==='graph'?'\nvalue=_aa_clone_value(value,original)':r==='nodevalue'?'\nif not _aa_member(a[0],value): raise ValueError("Return an existing node")\nvalue=value.val':'';
 }
 return `for _aa_i, raw in enumerate(_aa_json.loads(${q(JSON.stringify(g.tests.map(t=>t.args)))})):\n    try:\n${body.split('\n').map(l=>'        '+l).join('\n')}\n        print('__ALGO_ARCADE_RESULT_'+str(${base}+_aa_i)+'__'+_aa_json.dumps({'value':value},allow_nan=False))\n    except Exception as e:\n        print('__ALGO_ARCADE_RESULT_'+str(${base}+_aa_i)+'__'+_aa_json.dumps({'error':str(e)}))`;
 }).join('\n');return nodeDefinitions.python+'\n'+code+'\n'+pythonCallHelper+'\nimport json as _aa_json\n'+nativeHelpers.python+'\n'+cases+'\n';}
export function structureSuite(gs,id,code){if(id==='python')return pythonProgram(gs,code);let offset=0;const cases=gs.map(g=>{const s=structureProgram(g,id,code,{casesOnly:true,offset});offset+=g.tests.length;return s;}).join('\n');return structureShell(id,code,cases);}
