'use client';

import { useEffect } from 'react';

const HREF = '/fonts/pretendardvariable-dynamic-subset.css';

/**
 * Loads the full Pretendard dynamic-subset CSS without blocking first paint.
 * Critical first-screen glyphs are covered by pretendard-critical.woff2 in globals.css.
 * Letter input and below-fold Hangul need this full CSS (unicode-range slices).
 */
export function PretendardFullLoader() {
  useEffect(() => {
    if (document.querySelector('link[data-pretendard-full="1"]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = HREF;
    link.dataset.pretendardFull = '1';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);

    const idle =
      'requestIdleCallback' in window
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb: () => void) => window.setTimeout(cb, 1);
    idle(() => {
      if (link.media !== 'all') link.media = 'all';
    });
  }, []);

  return null;
}
