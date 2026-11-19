import {basicSetup} from 'codemirror';
import {Compartment, EditorState} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import {indentWithTab} from '@codemirror/commands';
import {HighlightStyle, indentUnit, syntaxHighlighting} from '@codemirror/language';
import {tags} from '@lezer/highlight';
import {javascript} from '@codemirror/lang-javascript';
import {cpp} from '@codemirror/lang-cpp';
import {java} from '@codemirror/lang-java';
import {rust} from '@codemirror/lang-rust';
import {go} from '@codemirror/lang-go';
import {python} from '@codemirror/lang-python';

const parsers = {javascript, c: cpp, cpp, java, rust, go, python};
const font = '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace';
const theme = EditorView.theme({
  '&': {backgroundColor:'#1e1e1e', color:'#d4d4d4', fontSize:'12px'},
  '&.cm-focused': {outline:'2px solid #6b947e', outlineOffset:'-2px'},
  '.cm-scroller': {fontFamily:font, lineHeight:'1.8', overflow:'auto', maxHeight:'520px'},
  '.cm-content': {padding:'18px 0', caretColor:'#aeafad', minHeight:'340px'},
  '.cm-line': {padding:'0 16px 0 10px'},
  '.cm-gutters': {backgroundColor:'#1e1e1e', color:'#858585', border:'none', minHeight:'340px'},
  '.cm-lineNumbers .cm-gutterElement': {padding:'0 10px 0 14px', minWidth:'42px'},
  '.cm-activeLine, .cm-activeLineGutter': {backgroundColor:'#ffffff08'},
  '.cm-activeLineGutter': {color:'#c6c6c6'},
  '.cm-cursor, .cm-dropCursor': {borderLeftColor:'#aeafad'},
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {backgroundColor:'#264f78'},
  '&.cm-focused .cm-matchingBracket': {backgroundColor:'#515c6a66', outline:'1px solid #888'},
  '.cm-searchMatch': {backgroundColor:'#623315', outline:'1px solid #b98539'},
  '.cm-searchMatch.cm-searchMatch-selected': {backgroundColor:'#9f6a2799'},
  '.cm-tooltip, .cm-panels': {backgroundColor:'#252526', color:'#d4d4d4', borderColor:'#454545'},
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': {backgroundColor:'#04395e', color:'#fff'},
}, {dark:true});

const colors = HighlightStyle.define([
  {tag:tags.keyword, color:'#569cd6'},
  {tag:[tags.controlKeyword, tags.moduleKeyword], color:'#c586c0'},
  {tag:[tags.variableName, tags.propertyName], color:'#9cdcfe'},
  {tag:[tags.function(tags.variableName), tags.function(tags.propertyName)], color:'#dcdcaa'},
  {tag:[tags.typeName, tags.className, tags.namespace], color:'#4ec9b0'},
  {tag:[tags.string, tags.character, tags.regexp], color:'#ce9178'},
  {tag:tags.number, color:'#b5cea8'},
  {tag:[tags.bool, tags.null, tags.self], color:'#569cd6'},
  {tag:tags.comment, color:'#6a9955'},
  {tag:[tags.operator, tags.punctuation], color:'#d4d4d4'},
  {tag:[tags.meta, tags.annotation], color:'#c586c0'},
  {tag:tags.invalid, color:'#f44747'},
]);

export function createCodeEditor({parent, value, language, label, onChange, onRun}) {
  const editable = new Compartment();
  const view = new EditorView({
    parent,
    doc:value,
    extensions:[
      keymap.of([{key:'Mod-Enter', run:()=>{onRun(); return true;}}, indentWithTab]),
      basicSetup, parsers[language](), theme, syntaxHighlighting(colors),
      indentUnit.of(language === 'python' ? '    ' : '  '),
      EditorState.tabSize.of(language === 'python' ? 4 : 2),
      editable.of([EditorState.readOnly.of(false), EditorView.editable.of(true)]),
      EditorView.contentAttributes.of({'aria-label':label, 'aria-describedby':'editor-help', spellcheck:'false', autocapitalize:'off', autocorrect:'off'}),
      EditorView.updateListener.of(update=>{if(update.docChanged)onChange(update.state.doc.toString());}),
    ],
  });
  return {
    getValue:()=>view.state.doc.toString(),
    focus:()=>view.focus(),
    setReadOnly:readOnly=>view.dispatch({effects:editable.reconfigure([
      EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly),
    ])}),
    destroy:()=>view.destroy(),
  };
}
