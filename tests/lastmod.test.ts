// @vitest-environment node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildSitemapXml,
  expandSources,
  parseSitemapLastmods,
  sha256Hex,
} from '../scripts/lastmod-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('sitemap lastmod map', () => {
  const lastmod = JSON.parse(readFileSync(path.join(root, 'lib/lastmod.json'), 'utf8'));
  const sources = JSON.parse(readFileSync(path.join(root, 'lib/lastmod-sources.json'), 'utf8'));
  const sitemap = readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
  const preserved = JSON.parse(readFileSync(path.join(root, 'lib/preserved-site.json'), 'utf8'));

  it('covers the same paths as lastmod-sources and sitemap.xml', () => {
    const fromSources = Object.keys(sources.pages).sort();
    const fromMap = Object.keys(lastmod).sort();
    const fromSitemap = Object.keys(parseSitemapLastmods(sitemap)).sort();
    expect(fromMap).toEqual(fromSources);
    expect(fromSitemap).toEqual(fromSources);
  });

  it('keeps YYYY-MM-DD lastmod values', () => {
    for (const [loc, date] of Object.entries(lastmod)) {
      expect(date, loc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('matches public/sitemap.xml and its preservation hash', () => {
    expect(sitemap).toBe(buildSitemapXml(lastmod));
    expect(preserved.rootFilesSha256['sitemap.xml']).toBe(sha256Hex(Buffer.from(sitemap)));
  });

  it('maps only page-specific sources (shared chrome omitted)', () => {
    const omitted = new Set(sources.omitShared as string[]);
    expect(omitted.has('components/SiteHeader.tsx')).toBe(true);
    expect(omitted.has('components/SiteFooter.tsx')).toBe(true);
    expect(omitted.has('app/layout.tsx')).toBe(true);
    for (const [loc, list] of Object.entries(sources.pages as Record<string, string[]>)) {
      for (const entry of list) {
        expect(omitted.has(entry), `${loc} lists omitted ${entry}`).toBe(false);
        const files = expandSources(root, [entry]);
        expect(files.length, `${loc} -> ${entry}`).toBeGreaterThan(0);
      }
    }
  });
});
