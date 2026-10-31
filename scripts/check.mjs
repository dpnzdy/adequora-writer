import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {pages} from '../src/pages.mjs';
import {config} from '../src/config.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let links=0;
for(const page of pages){
  const html=await readFile(path.join(root,page.id+'.html'),'utf8');
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${page.id}: one main heading`);
  assert.match(html,/<html lang="ko">/);
  assert.match(html,/name="description"/);
  assert.match(html,/adequora@zinniashark\.com/);
  assert.equal((html.match(/aria-current="page"/g)||[]).length,page.id==='privacy'?0:1);
  for(const [,reference]of html.matchAll(/(?:href|src|data-lazy-video)="([^"]+)"/g)){
    if(/^(https?:|mailto:|data:)/.test(reference)) continue;
    const [file,hash]=reference.split('#');
    const target=file?path.resolve(root,decodeURI(file)):path.join(root,page.id+'.html');
    assert.ok((await stat(target)).isFile(),`${page.id}: ${reference}`);links++;
    if(hash){const content=await readFile(target,'utf8');assert.ok(content.includes(`id="${hash}"`),`Missing anchor ${reference}`);}
  }
}
if(!config.storeUrl){const download=await readFile(path.join(root,'download.html'),'utf8');assert.match(download,/출시 준비 중/);assert.match(download,/<button[^>]+disabled/);}
console.log(`PASS: ${pages.length} pages, ${links} local links/assets, metadata, navigation, Store release state.`);
