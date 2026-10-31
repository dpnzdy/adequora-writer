import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { releaseInfo } from '../src/release.mjs';
import { config } from '../src/config.mjs';
const storeUrl='https://apps.microsoft.com/detail/9NKD9SB9HXMM';
assert.equal(releaseInfo({...config,releaseStatus:'coming-soon',storeUrl}).storeUrl,null,'A reserved URL must not activate downloads');
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',storeUrl:null,releaseVersion:'1.0.0'}));
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',storeUrl:'https://example.com/download',releaseVersion:'1.0.0'}));
const output=execFileSync(process.execPath,['--input-type=module','-e',`
  import {config} from './src/config.mjs';
  config.releaseStatus='released'; config.storeUrl='${storeUrl}'; config.releaseVersion='1.0.0';
  config.publicSiteUrl='https://example.com/adequora-writer/';
  const {pages}=await import('./src/pages.mjs');
  const {shell}=await import('./src/components.mjs');
  console.log(JSON.stringify(Object.fromEntries(pages.filter(p=>['index','download','support'].includes(p.id)).map(p=>[p.id,shell(p,p.render())]))));
`],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
const rendered=JSON.parse(output);
assert.ok(rendered.download.includes(`href="${storeUrl}"`));
for(const [id,html] of Object.entries(rendered)) {
  assert.ok(!html.includes('출시 준비 중'),`${id}: stale release status`);
  assert.ok(!html.includes('출시 안내 보기'),`${id}: stale action`);
  assert.ok(html.includes(`https://example.com/adequora-writer/${id}.html`),`${id}: subpath-aware canonical`);
}
console.log('PASS: pre-release download hold, invalid release settings and released-page transitions.');
