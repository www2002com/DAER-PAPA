import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BunnyPortrait } from '@/components/home/BunnyPortrait';
import { SODAM_LARGE_PERFORMANCES, SODAM_LARGE_POSTERS, SODAM_PERFORMANCES, SODAM_POSTERS } from '@/lib/sodam-performance';

/** Canvas size and flags from a WebP's VP8X header (every transparent or animated WebP has one). */
function webp(src: string) {
  const bytes = readFileSync(join(process.cwd(), 'public', src));
  expect(bytes.toString('ascii', 0, 4)).toBe('RIFF');
  expect(bytes.toString('ascii', 8, 16)).toBe('WEBPVP8X');
  const flags = bytes[20];
  return {
    width: bytes.readUIntLE(24, 3) + 1,
    height: bytes.readUIntLE(27, 3) + 1,
    animated: Boolean(flags & 0x02),
    alpha: Boolean(flags & 0x10),
  };
}

// The received invitation shows Sodam at up to 340 CSS px (280 px on phones, which are mostly 3x);
// the home companion at 176 CSS px. r1 shipped 512 px and 352/256 px files with a beaded outline;
// r2 draws as sharply at 640 px as at 768 px there, at about r1's byte size (+9 %).
describe('Sodam media resolution', () => {
  it('keeps the received invitation sharp on 2x and 3x screens', () => {
    for (const src of [...Object.values(SODAM_LARGE_PERFORMANCES), ...Object.values(SODAM_LARGE_POSTERS)]) {
      expect(webp(src), src).toMatchObject({ width: 640, height: 640, alpha: true });
    }
  });

  it('matches the home companion to the 384 px 3D poses it alternates with', () => {
    for (const src of [...Object.values(SODAM_PERFORMANCES), ...Object.values(SODAM_POSTERS)]) {
      expect(webp(src), src).toMatchObject({ width: 384, height: 384, alpha: true });
    }
  });

  it('ships animations as animations and posters as stills', () => {
    for (const src of [...Object.values(SODAM_PERFORMANCES), ...Object.values(SODAM_LARGE_PERFORMANCES)]) {
      expect(webp(src).animated, src).toBe(true);
    }
    for (const src of [...Object.values(SODAM_POSTERS), ...Object.values(SODAM_LARGE_POSTERS)]) {
      expect(webp(src).animated, src).toBe(false);
    }
  });

  it('pairs each portrait size with the poster of the same resolution', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} });
    const large = render(<BunnyPortrait pose="welcome" motion="welcome" large />);
    expect(large.container.querySelector('img')!.getAttribute('src')).toBe(SODAM_LARGE_POSTERS.welcome);
    const home = render(<BunnyPortrait pose="listening" motion="listen" />);
    expect(home.container.querySelector('img')!.getAttribute('src')).toBe(SODAM_POSTERS.listen);
  });
});
