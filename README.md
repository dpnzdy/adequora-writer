# Adequora Writer website

한국어 정적 제품 사이트입니다. 현재 로컬 수정본이며 웹사이트 공개·Store 제출은 진행하지 않았습니다.

## 페이지

- `index.html`: 소개·기능 예시·실제 앱 화면·미디어 체험·샘플 문서.
- `download.html`: 대한민국 무료 1.0 출시 준비 안내와 설치 조건.
- `guide.html`: 편집·미디어·저장·작업 이어하기·비밀번호·설정.
- `support.html`: 문의 이메일·FAQ 검색·문제 해결 바로가기.
- `privacy.html`: 웹사이트 개인정보 안내. 앱 방침과 별개입니다.
- `installation.html`: Windows x64·WebView2·저장 폴더·첫 문서·업데이트와 제거 준비.
- `troubleshooting.html`: 실행·저장·열기·미디어·암호·이어하기 문제 해결.
- `releases.html`: 공개 상태와 알려진 제한. 실제 출시 후 변경 내역을 기록합니다.
- `policies.html`: 정책 목록·운영자·공개 전 확정 항목.
- `app-privacy.html`: 2026년 11월 1일 시행 앱 개인정보처리방침.
- `eula.html`, `license.html`, `lifecycle.html`: 이용약관·무료 배포·지원 정책 검토 초안.
- `support-consent.html`: 선택 진단·비필수 제안의 수집·이용 및 국외 이전 별도 동의 안내. 서버 전송 없이 이용자가 직접 메일을 작성합니다.

## 로컬 미리보기와 검증

npm 의존성 설치는 필요하지 않습니다.

```sh
npm run build
npm run check
npm run dev
```

미리보기: http://127.0.0.1:4173 (PORT 환경 변수로 변경 가능). 파일 탐색기에서 index.html을 열 수도 있지만 미디어·다운로드·클립보드 확인은 로컬 서버를 권장합니다.

로컬 서버 실행 중, 기존 Playwright·Microsoft Edge 설치 환경에서 브라우저 검사를 수행합니다.

```sh
python scripts/qa.py
```

14개 페이지를 1440·768·390·320px에서 확인하고 탭·키보드·미디어 재생/정지·샘플 다운로드 무결성·FAQ·모바일 메뉴·가이드 앵커를 검사합니다. 클립보드는 API 대체로 성공/실패를 확인합니다. 선택 자료의 두 동의·진단 문의 번호·동의 철회 시 링크 비활성도 검사합니다. 실제 OS 권한·메일 전송·장애 지원 환경 전체를 대신하지 않습니다. 결과와 화면은 ignored `.qa/`에 저장합니다.

## 콘텐츠 수정

- `src/pages.mjs`: 기존 5개 페이지 본문.
- `src/components.mjs`: 공통 메뉴·푸터·메타데이터·FAQ.
- `src/config.mjs`, `src/release.mjs`: 연락처·출시 상태·버전·공식 링크.
- `src/help-pages.mjs`: 실제 화면·설치·문제 해결·버전 안내.
- `src/policies.mjs`, `content/policies/`: 정책 화면과 Markdown 원문.
- `assets/style.css`, `assets/site.js`: 반응형 스타일·메뉴·탭·검색·주소 복사·가이드 목차.

build는 HTML 14개를 생성합니다. 생성 HTML을 직접 편집하지 마세요. docs의 원본 ADQ·HTML은 수정하지 않습니다. 정책 원문은 `../docs-adequora-writer`의 동일 문서에서 복사했으며 수정 시 양쪽을 대조합니다. 앱 개인정보 원본은 `store-submission/APP-PRIVACY-1.0.md`입니다.

## 웹사이트 공개 전

`config.policies`에서 문서별 상태를 관리합니다. 앱 개인정보처리방침은 final, 시행일 2026-11-01이며 다른 세 문서는 draft입니다. 초안에는 배너와 noindex가 남습니다. 한 문서의 확정으로 다른 문서를 최종본으로 바꾸지 않습니다.

1. 앱 개인정보처리방침에는 사용자 확정 시행일·계약 법인·보유 기간과 확인한 실제 메일 설정을 반영했습니다. 운영 절차·삭제일 관리 도구는 `../docs-adequora-writer/operations/`에 있으며 공개 사이트 배포물에 포함하지 않습니다.
2. 다른 약관은 해당 원문을 확정한 뒤 그 문서의 status와 effectiveDate만 변경합니다. final 문서에 초안 문구가 남거나 draft 문서의 초안 표시가 사라지면 공개 준비 검사가 거부합니다.
3. 공개 대상은 GitHub Pages의 `https://dpnzdy.github.io/adequora-writer/`이며 앱 방침은 `app-privacy.html`입니다. 배포 후 HTTP 상태뿐 아니라 본문·시행일·공시 내용과 익명 접근을 확인합니다.
4. 아래 공개 준비 검사를 실행합니다. final 정책의 미확정 내용과 초안의 표시 상태를 각각 검사합니다. 앱 공개와 웹사이트 공개 상태는 별개입니다.

```sh
npm run check:release
```

앱 출시 전 사이트를 먼저 공개할 때도 releaseStatus는 coming-soon으로 유지할 수 있습니다. GitHub Pages 등에서 루트 HTML·assets·docs·.nojekyll을 상대 경로 그대로 제공합니다. 원본 위치로 docs 폴더를 선택하지 마세요. src·scripts·content·.qa는 배포에 필요하지 않습니다.

## 실제 Store 공개 후

현재 `releaseStatus: 'coming-soon'`, storeUrl과 releaseVersion은 null입니다. 무료 1.0 예정 정책만 안내하며 출시일은 미정입니다. 2.0 Free/Pro는 향후 계획이며 현재 판매·평가판을 제공하지 않습니다.

1. 실제 Store 공개를 확인한 뒤 storeUrl에 공식 https://apps.microsoft.com/detail/... 주소, releaseVersion에 공개 버전을 입력합니다.
2. releaseStatus를 released로 바꿉니다. URL만 넣으면 버튼은 활성화되지 않으며 예약 링크만으로 공개 상태로 바꾸지 않습니다.
3. 공통 소개·FAQ·다운로드 버튼은 함께 전환됩니다. 실제 배포일·변경 내용·지원 환경은 해당 출시 내용에 맞춰 별도 갱신합니다.
4. 빌드·기술 검사·공개 준비 검사와 브라우저 검사를 수행합니다. 공개·push·Store 제출은 별도 작업입니다.

## 자료와 처리 방식

앱 아이콘과 예제 미디어는 제공된 제품 자료에서 가져왔습니다. 표지의 구성 예시와 실제 앱 화면을 구분해 표시합니다. `assets/app-editor-1.0.png`는 공개 샘플 문서로 격리 실행한 Windows 1.0 출시 후보의 1600×1000 원본 화면입니다. SHA-256: BA8F957DC08A3C28CADA501643F32CECC2ECAF59AF3EF304AD664376BB9CA904.

샘플 ADQ·독립형 HTML 원본은 그대로 연결합니다. 영상은 탭 선택 후 로드하며 오디오·샘플 HTML은 요청 전 미리 다운로드하지 않습니다. 외부 폰트·CDN·방문 분석·서버 문의 양식·추적 쿠키는 사용하지 않습니다. 이메일 문의는 사용자의 메일 앱으로 연결합니다.
