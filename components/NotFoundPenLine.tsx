'use client';

import { useEffect } from 'react';

/**
 * The 404 page's handwritten line. The root not-found is part of every route's tree, so
 * a static `import '@/lib/pen-font'` here would put the Nanum Pen @font-face rules back
 * into every page's stylesheet. Loading the font module on mount keeps them on the 404
 * page only; the face still uses font-display: swap like everywhere else.
 */
export default function NotFoundPenLine() {
  useEffect(() => {
    void import('@/lib/pen-font');
  }, []);
  return (
    <p className="pen" style={{ marginTop: 24, fontSize: '2rem', color: 'var(--ink-2)' }}>
      대신, 아빠에게 한 줄 써 보는 건 어때요?
    </p>
  );
}
