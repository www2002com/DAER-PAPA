// Sodam v2 "표정과 동작 10종" from the character sheet of 2026-10-27. The sheet gives each pose the
// situation it is for; `use` keeps that wording so the site shows them as designed.
// Rendered in the site's 3D Sodam style (docs/sodam-poses-r1.md): eight from the sheet's poses, listening
// and welcome from the approved 3D expressions, all at one head size and baseline (384 px WebP).
// The expression comes only from switching to the drawn pose: no words, letters or balloons, and no CSS
// that moves, tilts or stretches the cutout to fake a gesture.

export const SODAM_POSES = {
  rest: { file: 'rest', sheet: '01 기운 없음', use: '휴식 · 빈 상태' },
  thinking: { file: 'thinking', sheet: '02 생각 중', use: '초안 · 선택 고민' },
  listening: { file: 'listening', sheet: '03 경청', use: '안내 · 편지 시작' },
  thanks: { file: 'thanks', sheet: '04 쑥스러운 감사', use: '감사 · 저장 확인' },
  smallWin: { file: 'small-win', sheet: '05 작은 성취', use: '완료 · 성공' },
  oops: { file: 'oops', sheet: '06 머쓱함', use: '실수 · 재시도' },
  welcome: { file: 'welcome', sheet: '07 환영', use: '첫 방문 · 인사' },
  writing: { file: 'writing', sheet: '08 편지 쓰기', use: '편지 작성' },
  waiting: { file: 'waiting', sheet: '09 잠깐 대기', use: '대기 · 로딩 · 휴식' },
  deliver: { file: 'deliver', sheet: '10 편지 전달', use: '편지 완성 · 선물 안내' },
} as const;

export type SodamPose = keyof typeof SODAM_POSES;

export function sodamPoseSrc(pose: SodamPose): string {
  return `/media/sodam-poses-3d-r1/Sodam-pose-${SODAM_POSES[pose].file}-3d-r1.webp`;
}

export type ComposerMood = {
  view: 'write' | 'box';
  /** The visitor has focused the letter field at least once. */
  greeted: boolean;
  focused: boolean;
  hasText: boolean;
  /** A warning, failed autosave or failed export is on screen. */
  problem: boolean;
  exporting: boolean;
  /** The optional product note after an export is showing. */
  delivered: boolean;
  archiveEmpty: boolean;
};

/**
 * The steady pose beside the card, by the situations on the sheet. Momentary reactions
 * (kept, card made, failure) appear with the notice instead, where the visitor is looking.
 */
export function composerPose(m: ComposerMood): SodamPose {
  if (m.problem) return 'oops';
  if (m.exporting) return 'waiting';
  if (m.view === 'box') return m.archiveEmpty ? 'rest' : 'deliver';
  if (m.focused) return m.hasText ? 'writing' : 'listening';
  if (m.hasText) return m.delivered ? 'deliver' : 'thinking';
  return m.greeted ? 'listening' : 'welcome';
}

const preloaded = new Set<string>();

/** Warm the cache after the first interaction so later pose changes do not wait on the network. */
export function preloadSodamPoses(): void {
  if (typeof Image === 'undefined') return;
  for (const pose of Object.keys(SODAM_POSES) as SodamPose[]) {
    const src = sodamPoseSrc(pose);
    if (preloaded.has(src)) continue;
    preloaded.add(src);
    new Image().src = src;
  }
}
