import test from 'node:test';
import assert from 'node:assert/strict';
import {moveWorkspaceTab,workspaceSplit,readWorkspaceLayout} from '../dist/workspace-panels.mjs';

const initial=()=>({left:['code'],right:['problem','conversation','tests','review','settings'],active:{left:'code',right:'problem'},ratio:.51});

test('Code can join the other tabs, leaving an empty window that accepts tabs again',()=>{
 const layout=initial();
 moveWorkspaceTab(layout,'code','right','conversation');
 assert.deepEqual(layout.left,[]);
 assert.equal(layout.active.left,null);
 assert.deepEqual(layout.right,['problem','code','conversation','tests','review','settings']);
 assert.equal(layout.active.right,'code');
 moveWorkspaceTab(layout,'conversation','left');
 assert.deepEqual(layout.left,['conversation']);
 assert.equal(layout.active.left,'conversation');
 assert.equal(layout.active.right,'code');
});

test('moving the selected tab selects its nearest remaining neighbor',()=>{
 const layout=initial();
 moveWorkspaceTab(layout,'problem','left');
 assert.equal(layout.active.right,'conversation');
 moveWorkspaceTab(layout,'settings','left');
 assert.equal(layout.active.right,'conversation');
 layout.active.right='review';
 moveWorkspaceTab(layout,'review','left');
 assert.equal(layout.active.right,'tests');
});

test('tabs can be reordered in either direction without losing or duplicating panels',()=>{
 const layout=initial();
 moveWorkspaceTab(layout,'settings','right','problem');
 assert.deepEqual(layout.right,['settings','problem','conversation','tests','review']);
 moveWorkspaceTab(layout,'settings','right','review');
 assert.deepEqual(layout.right,['problem','conversation','tests','settings','review']);
 moveWorkspaceTab(layout,'problem','right');
 assert.deepEqual(layout.right,['conversation','tests','settings','review','problem']);
 assert.equal(layout.active.right,'problem');
 const unchanged=structuredClone(layout);
 moveWorkspaceTab(layout,'problem','right','problem');
 moveWorkspaceTab(layout,'missing','left');
 moveWorkspaceTab(layout,'code','missing');
 moveWorkspaceTab(layout,'code','right','missing');
 assert.deepEqual(layout,unchanged);
});

test('repeated docking preserves every panel and valid selections even through empty windows',()=>{
 const layout=initial(),ids=[...layout.left,...layout.right];
 for(let round=0;round<10;round++)for(const side of ['left','right'])for(const id of ids){
  moveWorkspaceTab(layout,id,side);
  assert.deepEqual([...layout.left,...layout.right].sort(),[...ids].sort());
  for(const pane of ['left','right'])assert.ok(layout[pane].length?layout[pane].includes(layout.active[pane]):layout.active[pane]===null);
 }
});

test('divider clamps widths to usable limits and accepts balanced or proportional sizes',()=>{
 assert.equal(workspaceSplit(.6,1200).ratio,.6);
 assert.equal(workspaceSplit(.01,1000).ratio,.28);
 assert.equal(workspaceSplit(.99,1000).ratio,.72);
 assert.equal(workspaceSplit(0,2000).ratio,.2);
 assert.equal(workspaceSplit(1,2000).ratio,.8);
 assert.equal(workspaceSplit(.9,400).ratio,.5);
 for(const value of [NaN,Infinity,undefined,'0.6'])assert.equal(workspaceSplit(value,1000).ratio,.5);
 assert.equal(workspaceSplit(.7,0).ratio,.7);
});


test('saved layout restores order and safely repairs missing selections or invalid widths',()=>{
 const saved={left:['review','code','tests'],right:['settings','conversation','problem'],active:{left:'missing',right:'conversation'},ratio:9};
 const restored=readWorkspaceLayout({localStorage:{getItem:()=>JSON.stringify(saved)}});
 assert.deepEqual(restored.left,saved.left);
 assert.deepEqual(restored.right,saved.right);
 assert.deepEqual(restored.active,{left:'review',right:'conversation'});
 assert.equal(restored.ratio,.8);
});

test('blocked storage, malformed layouts and duplicate tabs fall back to a complete workspace',()=>{
 const blocked={get localStorage(){throw Error('Storage blocked');}};
 assert.deepEqual(readWorkspaceLayout(blocked),initial());
 for(const value of ['{','null',JSON.stringify({...initial(),right:['code']}),JSON.stringify({...initial(),left:['unknown']})]){
  assert.deepEqual(readWorkspaceLayout({localStorage:{getItem:()=>value}}),initial());
 }
});
