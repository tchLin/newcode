import {build} from 'esbuild';
import {readFile, writeFile} from 'node:fs/promises';

// Commit the bundle so the static site needs no package CDN or runtime build.
const result = await build({
  entryPoints:['src/editor.mjs'], outfile:'dist/arcade/vendor/editor.mjs', bundle:true,
  minify:true, format:'esm', target:'es2020', metafile:true,
  banner:{js:'/* CodeMirror editor. Third-party licenses: ./editor.LICENSE.txt */'},
});
const roots = [...new Set(Object.keys(result.metafile.inputs)
  .filter(path=>path.startsWith('node_modules/'))
  .map(path=>path.split('/').slice(0,path.split('/')[1].startsWith('@')?3:2).join('/')))];
const notices = await Promise.all(roots.sort().map(async root=>{
  const pkg=JSON.parse(await readFile(`${root}/package.json`,'utf8'));
  let license;
  for(const file of ['LICENSE','LICENSE.md','LICENSE.txt']) {
    try {license=await readFile(`${root}/${file}`,'utf8');break;} catch(error) {if(error.code!=='ENOENT')throw error;}
  }
  if(!license)throw new Error(`Missing license for ${pkg.name}`);
  return `${pkg.name} ${pkg.version}\n${license}`;
}));
await writeFile('dist/arcade/vendor/editor.LICENSE.txt',notices.join('\n\n----------------------------------------\n\n'));
console.log('Built static editor bundle and third-party license notices.');
