// These capabilities are enforced by the application before dispatching a request.
// Model instructions cannot grant capabilities that the selected mode does not have.
export const modes = Object.freeze([
 {id:'solo',label:'Solo',description:'Solve independently with the editor and tests. AI and built-in hints are unavailable.'},
 {id:'hints',label:'Hints-only',description:'Reveal curated hints one at a time. No model download, chat, or automatic edits.'},
 {id:'chat',label:'Chat-assisted',description:'Ask the local AI for explanations or code suggestions. You apply edits and run tests.'},
 {id:'agent',label:'Agent-assisted',description:'Let the local AI inspect exercise files, propose edits for your review, and run tests in a bounded loop.'}
].map(Object.freeze));

const capabilities=Object.freeze({
 solo:Object.freeze({aiChat:false,agent:false,curatedHints:false}),
 hints:Object.freeze({aiChat:false,agent:false,curatedHints:true}),
 chat:Object.freeze({aiChat:true,agent:false,curatedHints:true}),
 agent:Object.freeze({aiChat:false,agent:true,curatedHints:true})
});

export function normalizeMode(value){
 if(value==='strict')return 'solo';
 if(value==='assisted')return 'chat';
 return Object.hasOwn(capabilities,value)?value:'chat';
}

export function capabilitiesFor(value){return capabilities[normalizeMode(value)];}
