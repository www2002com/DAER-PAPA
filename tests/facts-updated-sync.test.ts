import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import preserved from '@/lib/preserved-site.json';

describe('FACTS_UPDATED single source', () => {
  it('matches /about/facts top line, JSON-LD dateModified, and home WebPage dateModified', () => {
    expect(FACTS_UPDATED).toBe('2026-11-02');
    expect(FACTS_UPDATED_KO).toBe('2026년 11월 2일');
    expect(preserved.factsBodyHtml).toContain(`최종 업데이트: ${FACTS_UPDATED_KO}`);
    const factsLd = preserved.pages['/about/facts'].jsonLd.join('\n');
    expect(factsLd).toContain(`"dateModified": "${FACTS_UPDATED}"`);
    const homeLd = preserved.pages['/'].jsonLd.join('\n');
    expect(homeLd).toContain(`"dateModified":"${FACTS_UPDATED}"`);
  });

  it('SiteFooter and Hero import the shared constants', () => {
    const footer = readFileSync('components/SiteFooter.tsx', 'utf8');
    const hero = readFileSync('components/home/Hero.tsx', 'utf8');
    expect(footer).toMatch(/FACTS_UPDATED_KO/);
    expect(hero).toMatch(/FACTS_UPDATED_KO/);
    const factsPage = readFileSync('app/about/facts/page.tsx', 'utf8');
    expect(factsPage).toMatch(/FACTS_UPDATED_KO/);
    expect(factsPage).toMatch(/factsBodyWithSharedDate/);
  });
});
