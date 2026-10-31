// Shared copy rules for the banned-word tests. Keep this the single list so the JSON-LD
// check and the source copy check cannot drift apart.

export const BANNED = [
  '진정',
  '붉은기',
  '저자극',
  '무자극',
  '끈적임 없는',
  '사전 예약',
  '끝내는',
  '가장 먼저',
  '50대',
  '60대',
  '40~60대',
  '스킨로션',
] as const;

/** The one approved sentence that legitimately names the functional review; scrub it before scanning. */
export const FIXED_FUNCTIONAL = '미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다';
