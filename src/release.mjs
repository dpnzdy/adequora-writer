import { config } from './config.mjs';

export function releaseInfo(settings = config) {
  if (!['coming-soon', 'released'].includes(settings.releaseStatus)) throw new Error('Unknown releaseStatus');
  const released = settings.releaseStatus === 'released';
  if (released && (!/^https:\/\/apps\.microsoft\.com\/detail\/[A-Za-z0-9]+\/?$/.test(settings.storeUrl || '') || !/^\d+\.\d+(?:\.\d+){0,2}$/.test(settings.releaseVersion || ''))) {
    throw new Error('A released app requires its verified official Store URL and public version.');
  }
  return {
    released,
    storeUrl: released ? settings.storeUrl : null,
    status: released ? 'Microsoft Store에서 무료로 제공' : 'Microsoft Store 출시 준비 중',
    action: released ? '다운로드 안내 보기' : '출시 안내 보기',
    version: released ? settings.releaseVersion : settings.plannedVersion,
    summary: released ? `Adequora Writer ${settings.releaseVersion}은 무료로 제공합니다. 대한민국 Microsoft Store에서 설치할 수 있습니다.` : `첫 공개 버전 ${settings.plannedVersion}은 무료로 제공할 예정입니다. 대한민국 Microsoft Store 출시를 준비하고 있으며 출시일은 아직 정하지 않았습니다.`,
    priceAnswer: released ? `현재 공개 버전 ${settings.releaseVersion}은 무료입니다. 앱 계정 등록과 유료 라이선스 없이 사용할 수 있습니다. 2.0 Free/Pro는 향후 계획이며 현재 판매하지 않습니다.` : `첫 공개 버전 ${settings.plannedVersion}은 무료로 제공할 예정입니다. 앱 계정 등록과 유료 라이선스 없이 사용하는 구조입니다. 정확한 출시일은 미정이며, 2.0 Free/Pro는 향후 계획으로 현재 판매하지 않습니다.`,
    downloadAnswer: released ? '대한민국 Microsoft Store에서 설치할 수 있습니다. 다운로드 페이지에서 공식 Store 링크와 설치 조건을 확인하세요.' : '대한민국 Microsoft Store를 통한 첫 출시를 준비하고 있습니다. 아직 공개 다운로드 링크는 제공하지 않으며 공개를 확인한 후 이 사이트에서 연결합니다.',
  };
}
export const release = releaseInfo();
