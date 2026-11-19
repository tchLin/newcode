import { evaluateLab } from './lab-tests.mjs';
self.onmessage = async ({data}) => {
 try { self.postMessage({results: await evaluateLab(data.id, data.files)}); }
 catch(error) { self.postMessage({error:String(error.message)}); }
};
