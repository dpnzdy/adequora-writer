import { config } from './config.mjs';

function officialStoreUrl(value) {
  try {
    const url = new URL(value);
    const product = /^\/detail\/([A-Za-z0-9]+)\/?$/.exec(url.pathname);
    if (url.origin !== 'https://apps.microsoft.com' || url.username || url.password || !product) return null;
    return `https://apps.microsoft.com/detail/${product[1].toUpperCase()}`;
  } catch { return null; }
}

export function releaseInfo(settings = config) {
  if (!['coming-soon', 'released'].includes(settings.releaseStatus)) throw new Error('Unknown releaseStatus');
  const released = settings.releaseStatus === 'released';
  const storeUrl = officialStoreUrl(settings.storeUrl);
  const date = settings.releaseDate;
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date || '') && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
  if (released && (!storeUrl || !/^\d+\.\d+(?:\.\d+){0,2}$/.test(settings.releaseVersion || '') || !validDate)) {
    throw new Error('A released app requires its verified official Store URL, public version and release date.');
  }
  const version = released ? settings.releaseVersion : settings.plannedVersion;
  const firstDate=settings.firstReleaseDate || '2026-11-03';
  const firstDateLabel=`${firstDate.slice(0,4)}년 ${Number(firstDate.slice(5,7))}월 ${Number(firstDate.slice(8,10))}일`;
  const dateLabel = validDate ? `${date.slice(0,4)}년 ${Number(date.slice(5,7))}월 ${Number(date.slice(8,10))}일` : null;
  return {
    released,
    storeUrl: released ? storeUrl : null,
    status: released ? 'Microsoft Store에서 무료로 제공' : 'Microsoft Store 출시 준비 중',
    action: released ? 'Microsoft Store에서 다운로드' : '출시 안내 보기',
    actionUrl: released ? storeUrl : 'download.html',
    version,
    date: released ? date : null,
    firstReleaseDate: firstDate,
    firstReleaseDateLabel: firstDateLabel,
    dateLabel: released ? dateLabel : null,
    systemRequirements: released ? 'Windows 10 22H2(빌드 19045) 이상 · Windows 11 / x64 PC' : 'Windows 10 22H2 x64 · Windows 11 x64 개발·검증 대상',
    systemAnswer: released ? '현재 Store 패키지는 Windows x64 PC용입니다. Store에 등록된 최소 OS는 Windows 10 빌드 19045.0 이상이며 Windows 11에서도 사용할 수 있습니다. 편집 화면에는 WebView2 Evergreen Runtime이 필요합니다. ARM64·x86 전용 패키지, macOS·모바일·웹 편집기는 제공하지 않습니다.' : 'Windows 10 22H2 x64와 Windows 11 x64를 대상으로 개발·호환성 검증을 진행하고 있습니다. Microsoft Store 출시 버전의 최종 시스템 요구 사항은 공개 시 다운로드 페이지에 안내합니다. macOS·모바일·웹 편집기는 현재 제공하지 않습니다.',
    summary: released ? `ZinniaShark Note ${version}은 무료로 제공합니다. 대한민국 Microsoft Store에서 설치할 수 있습니다.` : `첫 공개 버전 ${version}은 무료로 제공할 예정입니다. 대한민국 Microsoft Store 출시를 준비하고 있으며 출시일은 아직 정하지 않았습니다.`,
    priceAnswer: released ? `현재 공개 버전 ${version}은 무료이며, ${firstDateLabel} Microsoft Store에 처음 공개했습니다. 앱 계정 등록과 유료 라이선스 없이 사용할 수 있습니다. 2.0 Free/Pro는 향후 계획이며 현재 판매하지 않습니다.` : `첫 공개 버전 ${version}은 무료로 제공할 예정입니다. 앱 계정 등록과 유료 라이선스 없이 사용하는 구조입니다. 정확한 출시일은 미정이며, 2.0 Free/Pro는 향후 계획으로 현재 판매하지 않습니다.`,
    downloadAnswer: released ? 'Microsoft Store에 게시되어 대한민국 Store에서 무료로 설치할 수 있습니다. 홈페이지와 다운로드 페이지의 공식 Store 버튼을 이용하세요. 설치 조건과 첫 실행 방법은 설치·시작 가이드에서 확인할 수 있습니다.' : '대한민국 Microsoft Store를 통한 첫 출시를 준비하고 있습니다. 아직 공개 다운로드 링크는 제공하지 않으며 공개를 확인한 후 이 사이트에서 연결합니다.',
  };
}
export const release = releaseInfo();
