// Copy shown only once the 출시 소식 email form is enabled. Kept apart from lib/launch-notify.ts, which the
// Vercel Function also loads: that file must not import, while this one shares the retention text.
import { RETENTION } from './privacy-retention';

/**
 * Copy that flips together with the email field (same launchNotifyReady() gate).
 * Gate off keeps the existing wording; these strings render only when collection is enabled.
 */
export const LAUNCH_NOTIFY_ENABLED_COPY = {
  homeIntro: '출시 소식을 이메일로 받아 보실 수 있어요.',
  privacySummaryTitle: '출시 소식 이메일 안내',
  privacySummary: [
    ['수집 항목', '이메일 주소'],
    ['이용 목적', '디어파파 출시 소식 안내 메일 발송'],
    ['보관 기간', RETENTION.launchEmail],
    ['수신 거부 방법', '메일 하단 링크 또는 hello@dearpapa.kr로 요청'],
  ],
} as const;
