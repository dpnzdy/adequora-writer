import { writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pages } from '../src/pages.mjs';
import { shell } from '../src/components.mjs';
import { config } from '../src/config.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(config.storeUrl && (!config.storeUrl.startsWith('https://') || /[\s"<>]/.test(config.storeUrl))) throw new Error('Use a valid official HTTPS Store URL.');
await Promise.all([config.sampleAdq,config.sampleHtml].map(f=>stat(path.join(root,f))));
for(const page of pages){
  await writeFile(path.join(root,page.id+'.html'),shell(page,page.render()),'utf8');
  console.log('Built '+page.id+'.html');
}
