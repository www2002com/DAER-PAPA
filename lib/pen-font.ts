import { Nanum_Pen_Script } from 'next/font/google';

/**
 * Handwriting face for letters (Nanum Pen Script 400, display: swap).
 * Korean glyphs arrive as unicode-range slices on demand.
 *
 * Only components that actually render the pen face import this module
 * (`import '@/lib/pen-font'`), so its @font-face rules ship with those routes'
 * CSS instead of the site-wide stylesheet. `--font-nanum-pen` itself is set in
 * app/globals.css to the same family list next/font generates for this face
 * (see tests/pen-font-scope.test.tsx), so `--font-pen` and card.ts keep working
 * on every page.
 */
export const pen = Nanum_Pen_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-nanum-pen',
});
