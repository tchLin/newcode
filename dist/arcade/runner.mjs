import {executeJavaScript} from './javascript-runner.mjs';
self.onmessage=({data})=>self.postMessage(executeJavaScript(data));
