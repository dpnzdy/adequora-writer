import { config } from './config.mjs';
export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  external: '<path d="M7 17 17 7M7 7h10v10"/>',
  windows: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  music: '<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>',
  video: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 8 6 4-6 4z"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M12 5v16M3 3l9 2 9-2v16l-9 2-9-2z"/>',
  pen: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="3" fill="currentColor" stroke="none"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>',
  play: '<path d="m9 5 11 7-11 7z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2M12 17h.01"/>',
  monitor: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
export const mail = (subject = '', body = '') => `mailto:${config.email}${subject ? '?subject='+encodeURIComponent('[Adequora Writer] '+subject)+(body?'&body='+encodeURIComponent(body):'') : ''}`;
export const sampleLink = (type = 'html') => encodeURI(type === 'html' ? config.sampleHtml : config.sampleAdq);
const brand = () => `<a class="brand" href="index.html" aria-label="Adequora Writer 홈"><img src="assets/app-icon.webp" width="38" height="38" alt=""><span>Adequora <span class="brand-light">Writer</span></span></a>`;
export function header(active) {
  const links = [['index','제품 소개','index.html'],['download','다운로드','download.html'],['guide','사용 가이드','guide.html'],['support','지원','support.html']];
  return `<a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="site-header"><div class="container header-inner">${brand()}<button class="menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="main-nav">${icon('menu')}<span>메뉴</span></button><nav id="main-nav" class="main-nav" aria-label="주 메뉴">${links.map(([id,text,href])=>`<a href="${href}"${id===active?' aria-current="page"':''}>${text}</a>`).join('')}<a class="button button-small nav-cta" href="download.html">${icon('windows')}<span>${config.storeUrl?'Windows용 다운로드':'Windows용 앱'}</span></a></nav></div></header>`;
}
export function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-top"><div>${brand()}<p>생각과 자료가 모이고,<br>나의 기록이 이어지는 곳.</p></div><div class="footer-links"><div><span>제품</span><a href="index.html#features">주요 기능</a><a href="download.html">출시·다운로드 안내</a><a href="index.html#sample">샘플 문서</a></div><div><span>도움말</span><a href="guide.html">사용 가이드</a><a href="support.html#faq">자주 묻는 질문</a><a href="${mail()}">이메일 문의 ${icon('external')}</a></div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ZinniaShark. Adequora Writer.</span><div><a href="privacy.html">웹사이트 개인정보 안내</a><span class="footer-platform">${icon('windows')} Made for Windows</span></div></div></div></footer>`;
}
export function shell(page, content) {
  const title=page.id==='index'?'Adequora Writer — 글과 자료를 한 문서에':`${page.title} — Adequora Writer`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(page.description)}"><meta name="theme-color" content="#f9fafc"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(page.description)}"><link rel="icon" type="image/png" href="assets/favicon.png"><link rel="stylesheet" href="assets/style.css"><script src="assets/site.js" defer></script></head><body data-page="${page.id}">${header(page.id)}<main id="main" tabindex="-1">${content}</main>${footer()}<div class="toast" role="status" aria-live="polite" hidden></div></body></html>`;
}
export const eyebrow = (text, dot = false) => `<p class="eyebrow">${dot?'<span class="status-dot"></span>':''}${text}</p>`;
export function pageIntro(kicker,title,description) {
  return `<section class="page-intro container">${eyebrow(kicker)}<h1>${title}</h1><p class="intro-copy">${description}</p></section>`;
}
export function cta() {
  return `<section class="bottom-cta container"><div class="cta-copy">${eyebrow('YOUR NEXT CHAPTER')}<h2>다음 기록을 위한<br>새로운 시작.</h2><p>Adequora Writer가 곧 Microsoft Store에서 찾아옵니다.</p></div><a class="button" href="download.html">출시 안내 보기 ${icon('arrow')}</a><span class="cta-drawing" aria-hidden="true">Aa<span>생각을 담다.</span></span></section>`;
}
export const faqs = [
  ['어떤 Windows 환경에서 사용할 수 있나요?','Windows 10 22H2 x64와 Windows 11 x64를 대상으로 개발·호환성 검증을 진행하고 있습니다. Microsoft Store 출시 버전의 최종 시스템 요구 사항은 공개 시 다운로드 페이지에 안내합니다. macOS·모바일·웹 편집기는 현재 제공하지 않습니다.','Windows 시스템 설치 호환'],
  ['앱은 어디에서 다운로드하나요?','Microsoft Store를 통한 배포를 준비하고 있습니다. 아직 공개 다운로드 링크는 제공하지 않으며, Store 페이지가 공개되면 이 사이트에서 연결합니다.','스토어 다운로드 출시 설치'],
  ['무료인가요? 가격과 출시일이 궁금해요.','가격, 라이선스와 정확한 출시일은 아직 공개하지 않았습니다. 확정된 정보는 다운로드 페이지와 Microsoft Store의 제품 페이지에 안내할 예정입니다.','가격 무료 유료 구독 출시일'],
  ['인터넷 연결 없이 문서를 작성할 수 있나요?','클라우드 업로드를 전제로 하지 않는 로컬 파일 중심 앱입니다. 문서는 내 PC의 파일로 열고 편집·저장합니다. Store 설치·업데이트 등 배포 서비스의 이용에는 네트워크가 필요할 수 있습니다.','오프라인 인터넷 클라우드 로컬'],
  ['Word·한글·PDF 파일도 열거나 저장할 수 있나요?','현재 지원하는 문서 형식은 ADQ2/논리 v3의 .adq 파일입니다. DOCX·HWP/HWPX·PDF·Markdown 가져오기·내보내기는 현재 지원 범위에 포함되지 않습니다.','docx hwp hwpx pdf markdown 호환 파일 형식'],
  ['이미지·오디오·영상은 문서와 함께 저장되나요?','PNG·JPEG·GIF 이미지, MP3 오디오, MP4 비디오를 삽입할 수 있습니다. 삽입한 미디어는 .adq 파일 안에 포함됩니다. 다른 PC에서는 호환되는 Adequora Writer와 해당 미디어를 재생할 수 있는 환경이 필요합니다.','이미지 사진 mp3 mp4 gif jpeg png 미디어 소리 영상'],
  ['작업 이어하기와 파일 저장은 어떻게 다른가요?','Ctrl+S는 변경 내용을 원본 .adq 파일에 반영합니다. 작업 이어하기는 작업을 주기적으로, 그리고 정상 종료 시 보존해 다음 실행에서 편집을 이어가도록 돕습니다. 이 PC의 현재 Windows 사용자에 적용되며, 강제 종료·전원 장애에서는 마지막 보존 이후 입력이 남지 않을 수 있습니다.','저장 자동 저장 복구 이어하기 백업'],
  ['다른 기기에서도 작업을 이어갈 수 있나요?','현재의 작업 이어하기는 이 PC·현재 Windows 사용자에서 동작합니다. 클라우드 동기화나 다른 기기 간 자동 이어하기는 제공하지 않습니다. 파일을 다른 PC로 옮겨 열려면 호환되는 앱이 필요합니다.','동기화 기기 pc 이동 클라우드'],
  ['문서 비밀번호를 잊었어요. 어떻게 하나요?','문서 내용과 포함 자산을 비밀번호로 암호화합니다. 비밀번호를 잊으면 작업 보존본만으로 암호를 해제할 수 없습니다. 문서에 설정한 비밀번호를 안전하게 보관해주세요.','암호 비밀번호 분실 보안'],
  ['문서 용량이나 열린 문서 수에 제한이 있나요?','현재 개발판의 일반 실행 기준은 열린 문서 10개, 문서 파일 및 압축 해제 합계 예산 512MiB, 개별 자산 128MiB입니다. 형식·이미지·표시 자원 등의 추가 한도도 적용되며, 같은 크기의 모든 문서에서 동일한 성능을 보장하지는 않습니다. 최종 배포판의 범위는 출시 시 안내합니다.','용량 크기 제한 대용량 탭'],
  ['미디어가 재생되지 않으면 어떻게 하나요?','지원 형식과 문서·자산의 용량을 확인하고, 원본 파일이 Windows에서 정상적으로 재생되는지 살펴보세요. 문제가 계속되면 앱 버전, Windows 버전, 파일 형식과 오류 메시지를 이메일로 알려주세요.','재생 오류 코덱 소리 영상 문제'],
  ['탭을 바꾸거나 앱을 재시작한 뒤 실행 취소가 되지 않아요.','현재 앱은 실제 탭 전환에 성공하면 이전 탭의 Undo/Redo 기록을 초기화합니다. 앱을 재시작할 때도 실행 취소 기록은 새로 시작합니다. 중요한 변경 전에는 사본을 저장해두세요.','undo redo 실행 취소 되돌리기 ctrl z'],
];
