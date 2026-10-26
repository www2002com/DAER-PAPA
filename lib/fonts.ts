// Pretendard is served from public/ (copied verbatim by scripts/sync-pretendard.mjs) and attached
// as a non-render-blocking stylesheet from the root layout. Keep in sync with node_modules/pretendard.
export const PRETENDARD_VERSION = '1.3.9';
export const PRETENDARD_CSS_HREF = `/fonts/pretendard/${PRETENDARD_VERSION}/pretendardvariable-dynamic-subset.css`;

// Runs while <head> is parsed: adds the stylesheet without blocking first paint.
export const PRETENDARD_LOADER = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(PRETENDARD_CSS_HREF)};document.head.appendChild(l)})();`;
