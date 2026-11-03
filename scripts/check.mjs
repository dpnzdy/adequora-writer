import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {pages} from '../src/pages.mjs';
import {config} from '../src/config.mjs';
import {release} from '../src/release.mjs';
import {shell} from '../src/components.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let links=0;
for(const page of pages){
  const html=await readFile(path.join(root,page.id+'.html'),'utf8');
  assert.equal(html,shell(page,page.render()),`${page.id}: generated HTML is stale; run npm run build`);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${page.id}: one main heading`);
  assert.match(html,/<html lang="ko">/);
  assert.match(html,/name="description"/);
  assert.ok(html.includes(config.email),`${page.id}: configured support contact`);
  assert.equal((html.match(/aria-current="page"/g)||[]).length,['index','download','guide','support'].includes(page.id)?1:0,`${page.id}: active primary navigation`);
  if(page.policy && page.policyStatus!=='final') assert.match(html, /name="robots" content="noindex,follow"/);
  for(const [,reference]of html.matchAll(/(?:href|src|data-lazy-video)="([^"]+)"/g)){
    if(/^(https?:|mailto:|data:)/.test(reference)) continue;
    const [file,hash]=reference.split('#');
    const target=file?path.resolve(root,decodeURI(file)):path.join(root,page.id+'.html');
    assert.ok((await stat(target)).isFile(),`${page.id}: ${reference}`);links++;
    if(hash){const content=await readFile(target,'utf8');assert.ok(content.includes(`id="${hash}"`),`Missing anchor ${reference}`);}
  }
}
if(!release.released){const download=await readFile(path.join(root,'download.html'),'utf8');assert.match(download,/출시 준비 중/);assert.match(download,/<button[^>]+disabled/);assert.ok(!download.includes('href="https://apps.microsoft.com/detail/'));}
else {
  const record=JSON.parse(await readFile(path.join(root,`content/releases/${release.version}.json`),'utf8'));
  assert.equal(record.storeUrl,release.storeUrl);
  assert.equal(record.releaseDate,release.date);
  assert.equal(record.priceKRW,0,'Current release copy describes a free app');
  for(const id of ['index','download','support','installation','releases','policies']) {
    const html=await readFile(path.join(root,id+'.html'),'utf8');
    assert.ok(!/출시 준비 중|출시일은 아직|무료 제공을 준비|공개 전에 확정|공개 시 다운로드/.test(html),`${id}: outdated pre-release copy`);
    assert.ok(html.includes(release.version),`${id}: current public version`);
  }
  for(const id of ['index','download','installation','releases']) {
    const html=await readFile(path.join(root,id+'.html'),'utf8');
    assert.ok(html.includes(`href="${release.storeUrl}" target="_blank" rel="noopener" data-store-link`),`${id}: direct official Store link`);
  }
}
console.log(`PASS: ${pages.length} pages, ${links} local links/assets, metadata, navigation, Store release state.`);
