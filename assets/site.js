// Optional materials: collect two explicit choices locally, then let the visitor compose mail.
const consentSection = document.querySelector('[data-support-consent]');
if (consentSection) {
  const purpose = document.querySelector('#consent-purpose');
  const caseInput = document.querySelector('#consent-case');
  const collect = document.querySelector('#consent-collect');
  const overseas = document.querySelector('#consent-overseas');
  const compose = document.querySelector('[data-consent-mail]');
  const status = document.querySelector('[data-consent-status]');
  const descriptions = {
    feedback: '항목: 회신 이메일 주소와 제공하는 제안 내용. 목적: 제안 확인·회신. 보유 기간: 문의 종결 후 1년 이내이며 불필요해지거나 동의를 철회하면 법적 보존 사유가 없는 한 먼저 삭제합니다.',
    diagnostic: '항목: 회신 이메일 주소·문의 번호 및 별도 제공하는 앱/OS 버전·오류 정보·개인정보를 제거한 화면과 최소 재현 사본. 목적: 요청한 오류의 재현·해결. 보유 기간: 해당 문의 종결 후 90일 이내이며 불필요해지거나 동의를 철회하면 법적 보존 사유가 없는 한 먼저 삭제합니다.',
  };
  function updateConsent(reset = false) {
    const diagnostic = purpose.value === 'diagnostic';
    if (reset) { collect.checked = false; overseas.checked = false; }
    document.querySelector('[data-diagnostic-fields]').hidden = !diagnostic;
    document.querySelector('[data-consent-collection]').textContent = descriptions[purpose.value];
    const validCase = !diagnostic || /^ADQ-[0-9]{8}-[A-Z0-9]{4,12}$/.test(caseInput.value.trim());
    const ready = collect.checked && overseas.checked && validCase;
    compose.hidden = !ready;
    compose.removeAttribute('href');
    status.textContent = ready ? '메일 앱에서 아래 동의 문구와 내용을 확인한 뒤 직접 전송하세요.' : '각 동의를 직접 선택하고, 진단 자료라면 담당자가 안내한 문의 번호를 입력하세요.';
    if (!ready) return;
    const topic = diagnostic ? `선택 진단 자료 ${caseInput.value.trim()}` : '의견 및 기능 제안';
    const consentDate = new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const body = [
      `자료 종류: ${diagnostic ? '선택 진단 자료' : '의견·기능 제안'}`,
      diagnostic ? `문의 번호: ${caseInput.value.trim()}` : '',
      '개인정보처리방침: 1.0 / 시행일 2026-11-01',
      `동의 확인일: ${consentDate} (한국 시간)`,
      '수집·이용 동의: 안내된 항목·목적·보유 기간과 거부 영향을 확인하고 동의합니다.',
      '국외 이전 별도 동의: 안내된 수탁자·국가·항목·목적·기간·시기·방법과 거부 영향을 확인하고 별도로 동의합니다.',
      diagnostic ? '진단 자료는 담당자가 요청한 범위만 별도로 첨부합니다. 원본 문서·비밀번호·민감정보는 보내지 않습니다.' : '제안 내용:',
      '',
    ].filter(Boolean).join('\n');
    compose.href = `mailto:${consentSection.dataset.email}?subject=${encodeURIComponent('[ZinniaShark Note] '+topic)}&body=${encodeURIComponent(body)}`;
  }
  purpose.addEventListener('change', () => updateConsent(true));
  [collect, overseas, caseInput].forEach(control => control.addEventListener('input', () => updateConsent()));
  window.addEventListener('pageshow', () => updateConsent(true));
  updateConsent(true);
}
// Progressive enhancement. Navigation, document links, FAQs and media also work without JS.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu(returnFocus = false) {
  if (!menuButton || !navigation) return;
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '메뉴 열기');
  if (returnFocus) menuButton.focus();
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});
navigation?.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', e => {
  if (!e.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 621px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

function initTabs(selector, activate) {
  const buttons = [...document.querySelectorAll(selector)];
  if (!buttons.length) return;
  function select(button, focus = false) {
    for (const tab of buttons) {
      const current = tab === button;
      tab.setAttribute('aria-selected', String(current));
      tab.tabIndex = current ? 0 : -1;
    }
    activate(button);
    if (focus) button.focus();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (e.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { e.preventDefault(); select(buttons[next], true); }
    });
  });
}
const demos = {
  creative: { kicker: 'CREATIVE NOTE / 01', title: '생각이 머무는 순간', subtitle: '한 장의 이미지에서 시작되는 나의 이야기.', image: 'assets/sample-space.webp', alt: '우주를 배경으로 함께 앉아 있는 두 사람', quote: '“글만으로 담기 어려운 생각도, 함께.”' },
  study: { kicker: 'STUDY NOTE / 02', title: '오늘 배운 작은 발견', subtitle: '참고 자료와 내 설명을 같은 흐름으로.', image: 'assets/sample-study.webp', alt: '테이블 위에서 문서를 함께 살펴보는 두 사람', quote: '“보고 들은 것에, 나의 생각을 덧붙여요.”' },
};
initTabs('[data-demo]', button => {
  const demo = demos[button.dataset.demo];
  if (!demo) return;
  for (const key of ['kicker','title','subtitle','quote']) document.querySelector(`[data-demo-${key}]`).textContent = demo[key];
  const image = document.querySelector('[data-demo-image]');
  image.src = demo.image; image.alt = demo.alt;
  document.querySelector('#document-demo').setAttribute('aria-labelledby', button.id);
});
initTabs('[data-media-tab]', button => {
  const selected = button.dataset.mediaTab;
  document.querySelectorAll('.media-panel').forEach(panel => {
    const active = panel.id === 'panel-' + selected;
    panel.hidden = !active;
    if (!active) panel.querySelectorAll('audio, video').forEach(media => media.pause());
  });
  if (selected === 'video') {
    const video = document.querySelector('[data-lazy-video]');
    if (video && !video.getAttribute('src')) { video.src = video.dataset.lazyVideo; video.load(); }
  }
});

const search = document.querySelector('#faq-search');
const questions = [...document.querySelectorAll('.faq-item')];
function searchFaq() {
  const terms = search.value.trim().toLocaleLowerCase('ko-KR').split(/\s+/).filter(Boolean);
  let visible = 0;
  questions.forEach(question => {
    const content = question.dataset.search.toLocaleLowerCase('ko-KR');
    const matches = terms.every(term => content.includes(term));
    question.hidden = !matches;
    if (matches) visible++;
  });
  document.querySelector('.faq-empty').hidden = visible !== 0;
  document.querySelector('.faq-search-status').textContent = terms.length ? `${visible}개의 질문을 찾았습니다.` : `전체 ${questions.length}개의 질문입니다.`;
}
search?.addEventListener('input', searchFaq);
document.querySelector('[data-clear-search]')?.addEventListener('click', () => {
  search.value = ''; searchFaq(); search.focus();
});
let toastTimer;
function toast(message) {
  const node = document.querySelector('.toast');
  if (!node) return;
  clearTimeout(toastTimer); node.hidden = false; node.textContent = message;
  toastTimer = setTimeout(() => { node.hidden = true; }, 4500);
}
document.querySelector('[data-copy-email]')?.addEventListener('click', async e => {
  const email = e.currentTarget.dataset.copyEmail;
  try {
    await Promise.race([
      navigator.clipboard.writeText(email),
      new Promise((_, reject) => setTimeout(() => reject(new Error('clipboard-timeout')), 1800)),
    ]);
    toast('이메일 주소를 복사했습니다.');
  } catch {
    const text = document.querySelector('.contact-email');
    const range = document.createRange(); range.selectNodeContents(text);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    toast('주소를 선택했습니다. Ctrl+C 또는 길게 눌러 복사해주세요.');
  }
});

const guideLinks = [...document.querySelectorAll('.guide-sidebar nav a')];
if (guideLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const entry = entries.filter(e => e.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if (!entry) return;
    guideLinks.forEach(link => {
      const active = link.hash === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-110px 0px -45% 0px', threshold: 0 });
  document.querySelectorAll('.guide-section').forEach(section => observer.observe(section));
}
