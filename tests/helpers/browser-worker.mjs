import {parentPort,workerData} from 'node:worker_threads';
globalThis.self=globalThis;
globalThis.postMessage=value=>parentPort.postMessage(value);
await import(workerData);
parentPort.on('message',data=>globalThis.onmessage({data}));
