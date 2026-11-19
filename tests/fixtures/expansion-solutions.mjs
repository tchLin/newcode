import {readFileSync} from 'node:fs';
import {expansionGames} from '../../dist/arcade/expansion-catalog.mjs';
import {jsReferences} from './expansion-js.mjs';
export const expansionSolutions={javascript:expansionGames.map(g=>jsReferences[g.number].toString())};
for(const [id,extension] of Object.entries({c:'c',cpp:'cpp',java:'java',rust:'rs',go:'go',python:'py'})){
 const source=readFileSync(new URL(`expansion-${id}.${extension}`,import.meta.url),'utf8');
 expansionSolutions[id]=expansionGames.map(()=>source);
}
