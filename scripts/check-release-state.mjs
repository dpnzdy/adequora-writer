import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { releaseInfo } from '../src/release.mjs';
import { config } from '../src/config.mjs';
const storeUrl='https://apps.microsoft.com/detail/9NKD9SB9HXMM';
assert.equal(releaseInfo({...config,releaseStatus:'coming-soon',storeUrl}).storeUrl,null,'A reserved URL must not activate downloads');
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',storeUrl:null,releaseVersion:'1.0.0'}));
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',storeUrl:'https://example.com/download',releaseVersion:'1.0.0'}));
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',releaseDate:null}));
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',releaseDate:'2026-02-30'}));
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',storeUrl:'https://apps.microsoft.com.evil.example/detail/9NKD9SB9HXMM'}));
assert.throws(()=>releaseInfo({...config,releaseStatus:'released',storeUrl:'https://someone@apps.microsoft.com/detail/9NKD9SB9HXMM'}));
assert.equal(releaseInfo({...config,releaseStatus:'released',storeUrl:storeUrl+'?hl=ko-KR&gl=KR'}).storeUrl,storeUrl);
const output=execFileSync(process.execPath,['--input-type=module','-e',`
  import {config} from './src/config.mjs';
  config.releaseStatus='released'; config.storeUrl='${storeUrl}'; config.releaseVersion='1.0.1.0'; config.releaseDate='2026-11-03';
  config.publicSiteUrl='https://example.com/adequora-writer/';
  const {pages}=await import('./src/pages.mjs');
  const {shell}=await import('./src/components.mjs');
  console.log(JSON.stringify(Object.fromEntries(pages.filter(p=>['index','download','support','installation','releases','policies'].includes(p.id)).map(p=>[p.id,shell(p,p.render())]))));
`],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
const rendered=JSON.parse(output);
assert.ok(rendered.download.includes(`href="${storeUrl}"`));
for(const [id,html] of Object.entries(rendered)) {
  assert.ok(!html.includes('출시 준비 중'),`${id}: stale release status`);
  assert.ok(!html.includes('출시 안내 보기'),`${id}: stale action`);
  assert.ok(html.includes('1.0.1.0'),`${id}: verified package version`);
  assert.ok(html.includes(`https://example.com/adequora-writer/${id}.html`),`${id}: subpath-aware canonical`);
}
const previewOutput=execFileSync(process.execPath,['--input-type=module','-e',`
  import {config} from './src/config.mjs';
  config.releaseStatus='coming-soon'; config.storeUrl='${storeUrl}';
  const {pages}=await import('./src/pages.mjs');
  const {shell}=await import('./src/components.mjs');
  console.log(JSON.stringify(Object.fromEntries(pages.filter(p=>['index','download'].includes(p.id)).map(p=>[p.id,shell(p,p.render())]))));
`],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
for(const html of Object.values(JSON.parse(previewOutput))) assert.ok(!html.includes(`href="${storeUrl}"`),'A reserved URL must not activate a pre-release page');
console.log('PASS: Store release transitions, canonical URL, version/date validation, direct links and pre-release download hold.');
