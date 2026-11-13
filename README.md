# ZinniaShark Note website

한국어 정적 제품 사이트입니다. 앱은 Microsoft Store에 공개되어 있으며, 이 프로젝트는 공식 다운로드·설치·지원 안내를 제공합니다. 웹사이트 변경의 원격 반영은 GitHub Pages 배포 상태와 별개로 확인합니다.

## 페이지

- `index.html`: 소개·기능 예시·실제 앱 화면·미디어 체험·샘플 문서.
- `download.html`: Microsoft Store 무료 다운로드, 공개 버전·배포일과 설치 조건.
- `guide.html`: 편집·미디어·저장·작업 이어하기·비밀번호·설정.
- `support.html`: 문의 이메일·FAQ 검색·문제 해결 바로가기.
- `privacy.html`: 웹사이트 개인정보 안내. 앱 방침과 별개입니다.
- `installation.html`: Windows x64·WebView2·저장 폴더·첫 문서·업데이트와 제거 준비.
- `troubleshooting.html`: 실행·저장·열기·미디어·암호·이어하기 문제 해결.
- `releases.html`: 1.0.2.0 이름 변경 업데이트와 현재 알려진 제한.
- `policies.html`: 정책 목록·운영자·공개 전 확정 항목.
- `app-privacy.html`: 2026년 11월 1일 시행 Windows 앱 개인정보처리방침.
- `android-app-privacy.html`: 2026년 11월 13일 시행 Android 앱 개인정보처리방침. 정책 공개가 앱 출시를 뜻하지는 않습니다.
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

15개 페이지를 1440·768·390·320px에서 확인하고 탭·키보드·미디어 재생/정지·샘플 다운로드 무결성·FAQ·모바일 메뉴·가이드 앵커를 검사합니다. Store 버튼의 주소·새 창 이동, 공개 버전·배포일도 확인합니다. 브라우저의 Store 이동 검사는 외부 응답을 대체하며, 실제 Store 게시 정보는 공식 제품 페이지와 Partner Center에서 별도로 확인했습니다. 클립보드는 API 대체로 성공/실패를 확인합니다. 선택 자료의 두 동의·진단 문의 번호·동의 철회 시 링크 비활성도 검사합니다. 실제 OS 권한·메일 전송·장애 지원 환경 전체를 대신하지 않습니다. 결과와 화면은 ignored `.qa/`에 저장합니다.

## 콘텐츠 수정

- `src/pages.mjs`: 기존 5개 페이지 본문.
- `src/components.mjs`: 공통 메뉴·푸터·메타데이터·FAQ.
- `src/config.mjs`, `src/release.mjs`: 연락처·출시 상태·버전·공식 링크.
- `content/releases/`: 1.0.1.0 첫 공개 이력과 1.0.2.0 이름 변경 업데이트의 확인 정보·출처·변경 기록.
- `src/help-pages.mjs`: 실제 화면·설치·문제 해결·버전 안내.
- `src/policies.mjs`, `content/policies/`: 정책 화면과 Markdown 원문.
- `assets/style.css`, `assets/site.js`: 반응형 스타일·메뉴·탭·검색·주소 복사·가이드 목차.

build는 HTML 15개를 생성합니다. 생성 HTML을 직접 편집하지 마세요. docs의 원본 ADQ·HTML은 수정하지 않습니다. 정책 원문은 `../docs-adequora-writer`의 동일 문서에서 복사했으며 수정 시 양쪽을 대조합니다. 앱 개인정보 원본은 `store-submission/APP-PRIVACY-1.0.md`입니다.

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

## 이름 변경 완료

공식 제품명은 ZinniaShark Note입니다. 이전 이름은 Adequora Writer입니다. 기존 URL·Store 제품 ID·샘플 원본은 유지합니다. 2026-11-06 실제 Store 공개와 1.0.1.0→1.0.2.0 업데이트 검증을 확인해 renameStatus를 published로 바꿨습니다. 공개 버전·패키지명은 아래 최신 Store 공개 정보를 따릅니다.

## 현재 Store 공개 정보

- 공식 주소: https://apps.microsoft.com/detail/9NKD9SB9HXMM
- 공개 패키지: `AdequoraWriter-1.0.2.0-x64.msix`.
- 버전: `1.0.2.0`, 배포일: `2026-11-06`. 최초 공개일은 `2026-11-03`으로 유지합니다.
- 가격: 무료. 게시자: ZINNIASHARK.
- 최소 OS: Store 등록 기준 Windows 10 빌드 19045.0 이상. 공개 패키지 아키텍처 x64, Windows 10/11 Desktop.
- 대한민국 Store의 설치 가능 상태를 확인했습니다. 다른 지역 전체의 제공 여부를 단정하지 않습니다.

2026-11-03에 사용자가 열어둔 Partner Center의 현재 Store 게시 상태·제출 패키지와, 공식 공개 Store 페이지의 제품명·게시자·무료 가격·배포일·최소 OS를 대조했습니다. 계정 화면 캡처와 전체 Store 응답은 Git 추적 제외인 `.qa/`에만 보관하며 배포물에 포함하지 않습니다.

`releaseStatus: 'released'`가 공식 Store 주소·공개 버전·배포일과 함께 설정되어 있습니다. 홈·상단 메뉴·하단 CTA·다운로드 페이지에서 Store로 직접 이동합니다. 쿼리 문자열이 붙은 공식 공유 URL도 검증 후 기본 제품 주소로 정규화합니다. 예약 링크만으로는 출시 전 상태의 버튼을 활성화하지 않습니다.

다음 업데이트 시에는 공개된 패키지와 날짜를 확인한 뒤 `src/config.mjs`, 해당 버전의 `content/releases/` 기록, `src/help-pages.mjs`의 릴리스 항목을 함께 갱신합니다. 빌드·기술 검사·공개 준비 검사와 브라우저 검사를 수행하고, 원격 반영 후 Store 이동을 다시 확인하세요. 앱 개인정보 방침의 시행일과 다른 약관의 검토 상태를 버전 변경만으로 바꾸지 않습니다.

2.0 Free/Pro는 향후 계획이며 현재 판매·평가판을 제공하지 않습니다.

## 자료와 처리 방식

앱 아이콘과 예제 미디어는 제공된 제품 자료에서 가져왔습니다. 2026-11-08 새 아이콘을 앱 표시 이미지·파비콘에 적용하고 캐시 버전을 갱신했습니다. 표지의 구성 예시와 실제 앱 화면을 구분해 표시합니다. `assets/app-editor-1.0.2.png`는 새 아이콘을 적용한 Windows 1.0.2 빌드의 격리 프로필에서 공개 샘플 문서를 열어 다시 촬영한 1600×1000 원본 화면입니다. SHA-256: 84DD73D93A33F8E6256378240ADD91952F063C596133193C070A7D14578F241C.

샘플 ADQ·독립형 HTML 원본은 그대로 연결합니다. 영상은 탭 선택 후 로드하며 오디오·샘플 HTML은 요청 전 미리 다운로드하지 않습니다. 외부 폰트·CDN·방문 분석·서버 문의 양식·추적 쿠키는 사용하지 않습니다. 이메일 문의는 사용자의 메일 앱으로 연결합니다.


## Android 공개 개인정보처리방침

Windows 방침 원문·시행일과 다른 약관의 draft 상태는 유지합니다. Android 방침은 `content/policies/APP-PRIVACY-ANDROID-1.0.md`, 상태·시행일은 `src/config.mjs`의 `android-app-privacy` 항목에서 관리합니다. 공개 주소는 https://dpnzdy.github.io/adequora-writer/android-app-privacy.html 입니다.

Android 원문은 형제 앱 저장소 `../ZinniaShark-Note-V2.0/docs/android/APP-PRIVACY-ANDROID-1.0.md`이며 앱 내부 평문 방침과 이 사이트의 Markdown 사본을 다음 명령으로 함께 생성합니다. 원문을 먼저 수정하고 생성 사본을 직접 수정하지 마세요. 이 사이트의 단독 빌드에는 형제 저장소가 필요하지 않습니다.

```powershell
node ../ZinniaShark-Note-V2.0/adq-android/scripts/sync-privacy-policy.mjs --website-root .
node ../ZinniaShark-Note-V2.0/adq-android/scripts/sync-privacy-policy.mjs --check --website-root .
```

선택 자료 안내는 Windows/Android를 선택하며 플랫폼 변경 시 두 동의를 초기화합니다. `support-consent.html?platform=android`는 Android 방침을 먼저 표시하지만 동의를 자동 선택하거나 메일을 전송하지 않습니다. 브라우저 QA는 플랫폼별 시행일·방침 URL·동의 초기화까지 검사합니다. 공개 반영 후에는 상태 코드와 실제 본문을 별도로 확인합니다.
