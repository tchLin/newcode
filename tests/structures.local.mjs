// Optional local compiler QA; no network calls. AA_* variables select installed toolchains.
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {games,accepts} from '../dist/arcade/logic.mjs';
import {starter,parseExecution} from '../dist/arcade/languages.mjs';
import {structureSuite,structureProgram} from '../dist/arcade/structure-languages.mjs';
import {executeJavaScript} from '../dist/arcade/javascript-runner.mjs';
import {structureSolutions} from './fixtures/structure-solutions.mjs';
const selected=process.argv[2],all=['javascript','c','cpp','java','rust','go','python'];
assert.ok(!selected||all.includes(selected),'Unknown language');
const gs=games.filter(g=>g.structures),cases=gs.flatMap(g=>g.tests.map(t=>({g,t}))),root=mkdtempSync(join(tmpdir(),'arcade-structures-'));
const ext={c:'c',cpp:'cpp',java:'java',rust:'rs',go:'go',python:'py'};
const bin=id=>process.env['AA_'+id.toUpperCase()]||({c:'cc',cpp:'c++',java:'java',javac:'javac',rust:'rustc',go:'go',python:'python3'})[id];
function command(exe,args){const r=spawnSync(exe,args,{encoding:'utf8',maxBuffer:4e6,timeout:120000,env:{...process.env,GOCACHE:process.env.GOCACHE||join(root,'go-cache')}});assert.equal(r.status,0,`${exe} ${args.join(' ')}\n${r.error||r.stderr||r.stdout}`);return r.stdout;}
function compile(id,source,name,syntax=false){const path=join(root,name+'.'+ext[id]),out=join(root,name);writeFileSync(path,source);
 if(id==='c'||id==='cpp'){command(bin(id),[id==='c'?'-std=c11':'-std=c++17',...(syntax?['-fsyntax-only']:[]),path,...(syntax?[]:['-o',out])]);return syntax?'':command(out,[]);}
 if(id==='rust'){command(bin(id),['--edition=2021','--crate-name','arcade_check',...(syntax?['--emit=metadata']:[]),path,'-o',out]);return syntax?'':command(out,[]);}
 if(id==='java'){mkdirSync(out);command(bin('javac'),['-d',out,path]);return syntax?'':command(bin('java'),['-cp',out,'Wandbox']);}
 if(id==='go'){command(bin(id),['build','-o',out,path]);return syntax?'':command(out,[]);}
 if(syntax){command(bin(id),['-m','py_compile',path]);return '';}
 return command(bin(id),[path]);
}
try{
 for(const id of all.filter(id=>!selected||id===selected)){
  const code=structureSolutions[id][0];let results;
  if(id==='javascript')results=gs.flatMap(g=>{const r=executeJavaScript({code,fn:g.fn,tests:g.tests.map(t=>t.args)});assert.equal(r.error,undefined);return r.results;});
  else{const output=compile(id,structureSuite(gs,id,code),'suite_'+id),r=parseExecution({status:'0',program_output:output},cases.length);assert.equal(r.error,undefined);results=r.results;}
  results.forEach((r,i)=>assert.ok(!r.error&&accepts(cases[i].g,cases[i].t,r.value),`${id} #${cases[i].g.number} ${JSON.stringify(cases[i].t.args)}: ${JSON.stringify(r)}`));
  if(!process.argv.includes('--references-only'))for(const g of gs){const source=starter(g,id);if(id==='javascript')new Function(source);else compile(id,structureProgram(g,id,source),'starter_'+id+'_'+g.number,true);}
  console.log(`PASS ${id}: ${cases.length} reference cases${process.argv.includes('--references-only')?'':` and ${gs.length} compiling starter interfaces`}`);
 }
}finally{rmSync(root,{recursive:true,force:true});}
