import {readFileSync} from 'node:fs';
import {structureGames} from '../../dist/arcade/structure-catalog.mjs';
const suffix={javascript:'js.txt',c:'c.c',cpp:'cpp.cpp',java:'java.java',rust:'rust.rs',go:'go.go',python:'python.py'};
export const structureSolutions=Object.fromEntries(Object.entries(suffix).map(([id,file])=>[id,structureGames.map(()=>readFileSync(new URL('./structure-'+file,import.meta.url),'utf8'))]));
