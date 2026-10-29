/**
 * Pretendard loading strategy (2026-10-28 font-subset PR):
 *
 * 1. Critical subset — `public/fonts/pretendard-critical.woff2` (~60KB variable),
 *    glyphs from home + /letter-all-in-one first viewport (see pretendard-critical-chars.txt).
 *    Declared in globals.css; preloaded from app/layout.tsx.
 * 2. Full dynamic-subset CSS — copied to public/fonts by scripts/prepare-fonts.mjs and
 *    injected non-blocking by PretendardFullLoader (media=print→all). Letter input can
 *    request any Hangul unicode-range slice after this CSS applies.
 * 3. Metric fallbacks in globals.css (Apple / Noto size-adjust) keep swap from shifting layout.
 *
 * Earlier attempts on this branch (preload of official slices 81/84/85/87–91 as 8 files;
 * idle-deferred Next CSS import) regressed LCP or TBT under simulate — documented below.
 *
 * Official dynamic-subset ids that cover typical first-viewport Hangul/Latin (reference only):
 * 81, 84, 85, 87, 88, 89, 90, 91.
 */
export const PRETENDARD_VERSION = '1.3.9';
export const PRETENDARD_CRITICAL_SUBSETS = [81, 84, 85, 87, 88, 89, 90, 91] as const;
export const PRETENDARD_CRITICAL_HREF = '/fonts/pretendard-critical.woff2';
export const PRETENDARD_FULL_CSS_HREF = '/fonts/pretendardvariable-dynamic-subset.css';
