/**
 * Pretendard is imported from app/layout.tsx
 * (`pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css`).
 * Next emits unicode-range slices under `/_next/static/media`. Official CSS uses font-display: swap.
 *
 * First-viewport Hangul/Latin slices (variable face): 81, 84, 85, 87, 88, 89, 90, 91.
 *
 * Local Lighthouse 12.8.2 mobile/simulate (5-run median, `npx serve` of `out/`) — LCP element is
 * the hero campaign image:
 * - Preloading those 8 woff2 files: LCP regressed (bandwidth vs image).
 * - public/fonts + root <head> <link>: App Router duplicated links; RB/LCP regressed.
 * - Idle-deferring the CSS import: LCP similar, but TBT median jumped (~60→185ms).
 *
 * Shipped: keep the Next CSS import; add metric-matched Apple/Noto fallbacks in globals.css so
 * font-display:swap does not shift layout. Unused dynamic-subset files are kept — letter input
 * can need any Hangul slice.
 */
export const PRETENDARD_VERSION = '1.3.9';
export const PRETENDARD_CRITICAL_SUBSETS = [81, 84, 85, 87, 88, 89, 90, 91] as const;
