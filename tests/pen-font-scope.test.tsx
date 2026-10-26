import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// Components that render the handwriting face (font-family: var(--font-pen) or .pen).
const PEN_USERS = [
  'components/home/HeroLetterPreview.tsx',
  'components/home/LetterBunny.tsx',
  'components/home/UnboxSteps.tsx',
  'components/letter/Composer.tsx',
  'components/letter/WritingCard.tsx',
  'components/letter/LetterCard.tsx',
];

describe('Nanum Pen ships only with pen-using routes', () => {
  it('keeps the font loader options and leaves the root layout free of it', () => {
    const font = read('lib/pen-font.ts');
    expect(font).toMatch(/Nanum_Pen_Script\(\{\s*weight: '400',\s*subsets: \['latin'\],\s*display: 'swap',\s*preload: false,\s*variable: '--font-nanum-pen',\s*\}\)/);
    const layout = read('app/layout.tsx');
    expect(layout).not.toMatch(/Nanum_Pen_Script|pen-font|pen\.variable/);
  });

  it('sets --font-nanum-pen globally to the family list next/font generates', () => {
    const css = read('app/globals.css');
    expect(css).toContain("--font-nanum-pen: 'Nanum Pen Script', 'Nanum Pen Script Fallback';");
    expect(css).toContain("--font-pen: var(--font-nanum-pen), 'Nanum Pen Script', cursive;");
  });

  it('imports the font module from every pen-using component', () => {
    for (const f of PEN_USERS) expect(read(f), f).toContain("import '@/lib/pen-font';");
  });

  it('loads it on mount for the 404 line, never statically from the root not-found', () => {
    expect(read('app/not-found.tsx')).not.toContain('pen-font');
    expect(read('components/NotFoundPenLine.tsx')).toContain("import('@/lib/pen-font')");
  });
});
