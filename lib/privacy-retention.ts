/**
 * 보관 기간 초안 (2026-10-26). 대표님 확인 전 — 확정되면 이 한 곳만 고치면 됩니다.
 * Used by the gated launch-email summary and the flagged letter-story section on /privacy.
 */
export const RETENTION = {
  launchEmail: '출시 안내 메일 발송 후 또는 수신 거부·삭제 요청 시 지체 없이 파기',
  unusedStory: '소개하지 않은 사연·사진: 모집 종료 후 30일 이내 파기',
  publishedStory: '소개한 사연: 게시 중 보관, 철회 요청 시 7일 이내 게시물을 내리고 원본 파기',
  consentRecord: '동의 기록(회신 내용): 게시물을 내린 뒤 1년 보관 후 파기',
} as const;
