import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import imageLoader from '@/lib/image-loader';
import variants from '@/lib/image-variants.json';

describe('image loader', () => {
  it('uses the smallest copy that is wide enough', () => {
    expect(imageLoader({ src: '/images/campaign-blue/letter-gift.webp', width: 700 })).toBe('/images/campaign-blue/w/letter-gift-828.webp');
    expect(imageLoader({ src: '/images/campaign-blue/carton.webp', width: 64 })).toBe('/images/campaign-blue/w/carton-256.webp');
  });

  it('falls back to the original file', () => {
    expect(imageLoader({ src: '/images/campaign-blue/letter-gift.webp', width: 1672 })).toBe('/images/campaign-blue/letter-gift.webp');
    expect(imageLoader({ src: '/images/other.webp', width: 640 })).toBe('/images/other.webp');
  });

  it('has every listed copy on disk', () => {
    for (const [src, widths] of Object.entries(variants)) {
      expect(existsSync(`public${src}`)).toBe(true);
      for (const w of widths) expect(existsSync(`public${imageLoader({ src, width: w })}`)).toBe(true);
    }
  });
});
