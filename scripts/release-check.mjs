import { readFile } from 'node:fs/promises';
import { config } from '../src/config.mjs';
const blockers=[];
if (!config.publicSiteUrl || !/^https:\/\/[^\s"<>]+\/$/.test(config.publicSiteUrl)) blockers.push('공개 사이트 HTTPS 기본 주소를 확정하세요(끝 / 포함).');
if(config.policies['app-privacy']?.status!=='final') blockers.push('앱 개인정보처리방침이 최종본이어야 합니다.');
for (const [id,policy] of Object.entries(config.policies)) {
  if(!['draft','final'].includes(policy.status)) blockers.push(`${id}: 알 수 없는 상태`);
  const text=await readFile(new URL(`../content/policies/${policy.file}`,import.meta.url),'utf8');
  const html=await readFile(new URL(`../${id}.html`,import.meta.url),'utf8');
  if(policy.status==='final'){
    if(/\[출시 전 확정|검토 초안|공개용 검토 초안/.test(text)) blockers.push(`${policy.file}: 최종본에 미확정 내용이 남아 있습니다.`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(policy.effectiveDate || '')) blockers.push(`${id}: 시행일이 필요합니다.`);
    if(/policy-draft|현재 시행 중인 최종 약관이 아닙니다/.test(html)) blockers.push(`${id}: 잘못된 초안 배너가 남아 있습니다.`);
  }else if(!html.includes('policy-draft') || !html.includes('noindex,follow')) blockers.push(`${id}: 초안 배너와 noindex가 필요합니다.`);
}
if (blockers.length) {console.error('공개 배포 전 확인 필요:\n- '+blockers.join('\n- '));process.exitCode=1;}
else console.log('로컬 공개 준비 검사 통과. 실제 URL 접근·게시 승인과 법적 검토를 대신하지 않습니다.');
