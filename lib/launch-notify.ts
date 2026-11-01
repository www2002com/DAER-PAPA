// 출시 알림 신청: client-safe shared rules (copy, validation, consent version).
// Personal data (the email address) is never written to git, public/, analytics, or logs.
// No imports: the Vercel Function in api/ needs './x.js' paths and the Next.js build cannot resolve them
// (tests/api-function-imports.test.ts). Copy that needs other modules lives in launch-notify-enabled-copy.ts.

export const LAUNCH_NOTIFY_ENDPOINT = '/api/launch-notify';
/** Bump when the consent text below changes, so stored records show which text was agreed to. */
export const CONSENT_VERSION = '2026-10-24';
export const PLACEMENTS = ['home', 'product'] as const;
export type LaunchNotifyPlacement = (typeof PLACEMENTS)[number];

export const LAUNCH_NOTIFY_COPY = {
  title: '출시 소식을 이메일로 받아 보세요',
  body: '디어파파 레터 올인원은 출시 준비 중이에요. 가격과 출시일은 아직 정해지지 않았습니다. 출시 소식이 정해지면 남겨 주신 이메일로 알려 드릴게요.',
  emailLabel: '이메일',
  emailPlaceholder: 'name@example.com',
  consent: '[필수] 개인정보 수집·이용에 동의합니다.',
  consentDetail:
    '수집 항목: 이메일 · 이용 목적: 출시 소식 안내 · 보유 기간: 출시 안내 후 또는 동의 철회 시 지체 없이 파기. 동의하지 않으실 수 있으며, 이 경우 출시 소식 메일을 받으실 수 없습니다.',
  privacyLink: '개인정보처리방침',
  submit: '출시 소식 받기',
  submitting: '보내는 중…',
  success: '신청이 접수됐어요. 출시 소식이 정해지면 이 이메일로 알려 드릴게요. 출시 소식 외의 용도로는 쓰지 않습니다.',
  errors: {
    invalid_email: '이메일 주소를 다시 확인해 주세요.',
    consent_required: '개인정보 수집·이용에 동의해 주세요.',
    rate_limited: '잠시 후 다시 시도해 주세요.',
    not_configured: '지금은 온라인 신청을 받을 수 없어요. 출시 소식은 공식 사이트 dearpapa.kr과 인스타그램 @dearpapa.kr에서도 알려 드립니다.',
    server_error: '신청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
  },
} as const;

export type LaunchNotifyErrorCode = keyof typeof LAUNCH_NOTIFY_COPY.errors;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

/** Returns a normalized address, or null when the value is not a plausible email. */
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return null;
  const [local] = email.split('@');
  if (!local || local.length > 64) return null;
  if (!EMAIL_RE.test(email)) return null;
  const at = email.lastIndexOf('@');
  return `${email.slice(0, at)}@${email.slice(at + 1).toLowerCase()}`;
}

export function isPlacement(value: unknown): value is LaunchNotifyPlacement {
  return typeof value === 'string' && (PLACEMENTS as readonly string[]).includes(value);
}
