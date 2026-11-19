import { readdir, readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root=resolve('dist');
let count=0;
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory()){await walk(path);continue;}if(!path.endsWith('.mjs'))continue;const result=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});if(result.status!==0)throw new Error(result.stderr);const source=await readFile(path,'utf8');for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g))await access(new URL(match[1],`file://${path}`));count++;}}
await walk(root);await access(join(root,'index.html'));console.log(`Static build ready: ${count} modules checked. Publish dist/ (no compilation required).`);
