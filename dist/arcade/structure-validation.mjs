const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function acceptsStructure(g,test,value){
 if(g.validation==='alien'){
  if(typeof value!=='string')return false;
  if(test.expected==='')return value==='';
  const words=test.args[0],letters=new Set(words.join(''));
  if(value.length!==letters.size||new Set(value).size!==letters.size||[...value].some(c=>!letters.has(c)))return false;
  const rank=Object.fromEntries([...value].map((c,i)=>[c,i]));
  return words.slice(1).every((b,i)=>{const a=words[i];let j=0;while(j<Math.min(a.length,b.length)&&a[j]===b[j])j++;return j===Math.min(a.length,b.length)?a.length<=b.length:rank[a[j]]<rank[b[j]];});
 }
 const type=g.signature.result;
 if(['int','nodevalue'].includes(type))return Number.isInteger(value)&&value===test.expected;
 if(type==='bool')return typeof value==='boolean'&&value===test.expected;
 if(type==='string')return typeof value==='string'&&value===test.expected;
 if(!Array.isArray(value))return false;
 if(type==='list'&&!value.every(Number.isInteger))return false;
 if(type==='tree'&&!value.every(x=>x===null||Number.isInteger(x)))return false;
 if(['graph','intmatrix'].includes(type)&&!value.every(row=>Array.isArray(row)&&row.every(Number.isInteger)))return false;
 if(type==='strings'&&!value.every(x=>typeof x==='string'))return false;
 if(type==='stringmatrix'&&!value.every(row=>Array.isArray(row)&&row.every(x=>typeof x==='string')))return false;
 if(type==='mixed'&&!value.every(x=>x===null||typeof x==='boolean'||typeof x==='number'&&Number.isFinite(x)))return false;
 const normalize=a=>g.validation==='anagrams'?a.map(row=>JSON.stringify([...row].sort())).sort():g.validation==='stringset'?[...a].sort():type==='graph'?a.map(row=>[...row].sort((a,b)=>a-b)):a;
 return equal(normalize(value),normalize(test.expected));
}
