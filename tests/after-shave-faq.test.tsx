import { describe, expect, it } from 'vitest';
import { AFTER_SHAVE_GIFT_FAQ } from '@/lib/journal';

describe('/journal/after-shave-gift FAQ', () => {
  it('keeps the general after-shave Q apart from the product Q and never puts 따가 next to 변성알코올', () => {
    for (const { q, a } of AFTER_SHAVE_GIFT_FAQ) {
      if (`${q} ${a}`.includes('변성알코올')) expect(`${q} ${a}`).not.toMatch(/따가|따갑|자극|진정/);
    }
  });
});
