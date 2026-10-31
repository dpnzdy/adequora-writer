import { readFileSync } from 'node:fs';
import { config } from './config.mjs';
import { esc, pageIntro } from './components.mjs';
import { policyStatus } from './policy-status.mjs';

const documents = [
  ['app-privacy','앱 개인정보처리방침','APP-PRIVACY-1.0.md','로컬 문서·작업 데이터, 지원 문의와 Zoho 메일의 처리 내용을 설명합니다.'],
  ['eula','소프트웨어 이용약관','EULA.md','무료 사용권, 이용자 문서의 권리와 이용 조건을 설명합니다.'],
  ['license','무료 배포 및 라이선스 정책','DISTRIBUTION-AND-LICENSE-POLICY.md','1.0 무료 기능과 향후 Free/Pro·평가 종료 시 문서 처리 원칙을 구분합니다.'],
  ['lifecycle','지원 수명주기 및 업데이트 정책','SUPPORT-LIFECYCLE-AND-UPDATES.md','지원 기간, 업데이트, 지원 종료와 주요 버전 업그레이드 절차를 설명합니다.'],
];
const destinations = Object.fromEntries(documents.map(([id,,file]) => [file, `${id}.html`]));
destinations['PRIVACY-POLICY.md']='app-privacy.html';
destinations['ZOHO-MAIL-VERIFICATION.md']='policies.html#before-publication';

// Render trusted local Markdown as escaped HTML; no raw HTML or executable URLs.
function inline(text) {
  return esc(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
    const href=destinations[target] || (/^https:\/\//.test(target) || /^[a-z][a-z0-9-]*\.html(?:#[\w-]+)?$/.test(target) ? target : null);
    return href ? `<a href="${esc(href)}">${label}</a>` : label;
  }).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
}
function markdown(source) {
  const lines=source.replace(/\r/g,'').split('\n');
  const result=[];
  for(let i=0;i<lines.length;){
    const line=lines[i].trim();
    if(!line || /^# /.test(line)){i++;continue;}
    if(/^#{2,4} /.test(line)) {const level=line.match(/^#+/)[0].length;result.push(`<h${level}>${inline(line.replace(/^#+ /,''))}</h${level}>`);i++;continue;}
    if(line.startsWith('|')) {
      const rows=[];
      while(i<lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
      const cells=row=>row.replace(/^\||\|$/g,'').split('|').map(s=>s.trim());
      const header=cells(rows.shift());
      const body=rows.filter(row=>!/^\|[\s:|\-]+\|$/.test(row));
      result.push(`<div class="policy-table" role="region" aria-label="${inline(header.join(' · '))}" tabindex="0"><table><thead><tr>${header.map(c=>`<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr>${cells(row).map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if(/^(?:- |\d+\. )/.test(line)) {
      const ordered=/^\d/.test(line), tag=ordered?'ol':'ul', pattern=ordered?/^\d+\. /:/^- /, items=[];
      while(i<lines.length && pattern.test(lines[i].trim())) items.push(lines[i++].trim().replace(pattern,''));
      result.push(`<${tag}>${items.map(item=>`<li>${inline(item)}</li>`).join('')}</${tag}>`);continue;
    }
    const paragraph=[line]; i++;
    while(i<lines.length && lines[i].trim() && !/^(?:#|\||- |\d+\. )/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
    result.push(`<p>${paragraph.map(inline).join('<br>')}</p>`);
  }
  return result.join('\n');
}
function draftNotice() {
  return `<div class="policy-draft" role="note"><strong>이 문서는 검토 초안입니다.</strong><p>시행일과 운영 조건을 확정하기 전이며 현재 시행 중인 최종 약관이 아닙니다. 문서에 포함된 향후 버전 계획은 현재 제공·판매되는 기능을 뜻하지 않습니다.</p><a href="policies.html#before-publication">검토 중인 정책 보기</a></div>`;
}
export const policyPages=documents.map(([id,title,file,description])=>({
  id,title,description,policy:true,policyStatus:policyStatus(id),
  render:()=>`${pageIntro('PRODUCT POLICIES',title,description)}<article class="container legal-content policy-content">${policyStatus(id)==='draft'?draftNotice():'<p class="policy-effective">시행일: 2026년 11월 1일 · 문서 버전 1.0</p>'}${markdown(readFileSync(new URL(`../content/policies/${file}`,import.meta.url),'utf8'))}<a href="policies.html">정책·라이선스 목록으로</a></article>`,
}));
export const policyIndex={
  id:'policies',policy:true,policyStatus:'draft',title:'정책·라이선스',
  description:'문서별 적용일과 검토 상태를 확인하세요. 앱 개인정보처리방침은 2026년 11월 1일부터 적용합니다.',
  render:()=>`${pageIntro('POLICIES & LICENSE','사용 조건을<br>분명하게.','문서별로 시행일과 검토 상태를 구분합니다.')}<article class="container legal-content policy-content"><p>앱 개인정보처리방침은 2026년 11월 1일부터 적용합니다. 이용약관·라이선스·지원 수명주기 문서는 아직 검토 초안입니다.</p><div class="policy-cards">${documents.map(([id,title,,description])=>`<a href="${id}.html"><h2>${title}</h2><p>${description}</p><span>${policyStatus(id)==='final'?'2026년 11월 1일 시행 · 본문 보기':'검토 초안 보기'} →</span></a>`).join('')}</div><section><h2>현재와 향후 계획</h2><p>1.0은 무료 제공을 준비하고 있습니다. 2.0 Free/Pro는 향후 계획이며 현재 판매·평가 기능을 제공하지 않습니다. 앱 개인정보처리방침의 확정은 다른 약관의 확정이나 Store 출시를 뜻하지 않습니다.</p></section><section id="before-publication"><h2>다른 정책의 검토 항목</h2><p>이용약관·라이선스·지원 정책의 시행일, 최종 지원 OS와 지원 운영 시간, 실제 주요 버전 업그레이드 절차는 해당 문서에서 별도로 확정합니다.</p></section><section><h2>운영자와 연락처</h2><p>지니아샥(ZINNIASHARK) · 대표 이대식<br>사업자등록번호 690-07-03662<br>대한민국 거제시 진목2길 1, 404호(옥포동, 주은아트빌라)<br>개인정보 보호 담당자 이대식<br>문의 <a href="mailto:${config.email}">${config.email}</a><br>통신판매업: 해당 없음(현재 무료 1.0 배포 기준)</p></section><p><a href="privacy.html">웹사이트 개인정보 안내</a>는 앱 개인정보처리방침과 적용 범위가 다릅니다.</p></article>`,
};
