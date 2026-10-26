import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PRETENDARD_CSS_HREF, PRETENDARD_LOADER, PRETENDARD_VERSION } from '@/lib/fonts';

const root = process.cwd();
const pkg = join(root, 'node_modules/pretendard');
const served = join(root, 'public', PRETENDARD_CSS_HREF);
const read = (p: string) => readFileSync(p);

describe('self-hosted Pretendard', () => {
  it('matches the installed package version', () => {
    expect(JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')).version).toBe(PRETENDARD_VERSION);
  });

  it('serves the official CSS and every woff2 slice byte for byte', () => {
    const css = join(pkg, 'dist/web/variable/pretendardvariable-dynamic-subset.css');
    expect(read(served).equals(read(css))).toBe(true);
    const urls = [...readFileSync(served, 'utf8').matchAll(/url\(\.\/([^)]+)\)/g)].map((m) => m[1]);
    expect(urls.length).toBe(92);
    const dir = join(served, '..');
    for (const u of urls) expect(read(join(dir, u)).equals(read(join(pkg, 'dist/web/variable', u)))).toBe(true);
    expect(readdirSync(join(dir, 'woff2-dynamic-subset')).length).toBe(92);
    expect(readFileSync(join(dir, 'LICENSE.txt'), 'utf8')).toContain("Reserved Font Name 'Pretendard'");
  });

  it('keeps font-display: swap and the loader points at the served CSS', () => {
    const css = readFileSync(served, 'utf8');
    expect(css.match(/font-display: swap;/g)?.length).toBe(92);
    expect(PRETENDARD_LOADER).toContain(JSON.stringify(PRETENDARD_CSS_HREF));
  });

  it('is no longer bundled as render-blocking CSS, and the fallbacks sit right after Pretendard', () => {
    const layout = readFileSync(join(root, 'app/layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/import ['"]pretendard\//);
    const globals = readFileSync(join(root, 'app/globals.css'), 'utf8');
    expect(globals).toContain(
      "'Dear Papa Comma', 'Pretendard Variable', Pretendard, 'Pretendard Fallback Apple', 'Pretendard Fallback Noto', -apple-system,",
    );
    expect(globals.match(/font-family: 'Pretendard Fallback (Apple|Noto)';[\s\S]*?unicode-range: U\+/g)?.length).toBe(2);
  });
});
