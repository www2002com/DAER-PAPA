import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { questionHeadingId } from '@/lib/question-heading-id';
import { BANNED, FIXED_FUNCTIONAL } from './copy-rules';
import {
  ALLINONE_3_QUESTIONS_FAQ,
  DAD_ALLINONE_HOW_TO_CHOOSE_FAQ,
  DAD_ALLINONE_SKINCARE_GIFT_FAQ,
  DAD_BIRTHDAY_GIFT_RECOMMEND_FAQ,
  DAD_BIRTHDAY_GIFT_SKINCARE_FAQ,
  DAD_SAENGSIN_GIFT_FAQ,
} from '@/lib/journal';

const ROOT = process.cwd();
const JOURNAL_ROOT = join(ROOT, 'app/journal');
const OUT_ROOT = join(ROOT, 'out');

const FAQ_BY_SLUG: Record<string, { q: string }[]> = {
  'allinone-3-questions': ALLINONE_3_QUESTIONS_FAQ,
  'dad-allinone-how-to-choose': DAD_ALLINONE_HOW_TO_CHOOSE_FAQ,
  'dad-allinone-skincare-gift': DAD_ALLINONE_SKINCARE_GIFT_FAQ,
  'dad-birthday-gift-recommend': DAD_BIRTHDAY_GIFT_RECOMMEND_FAQ,
  'dad-birthday-gift-skincare': DAD_BIRTHDAY_GIFT_SKINCARE_FAQ,
  'dad-saengsin-gift': DAD_SAENGSIN_GIFT_FAQ,
};

function walkPages(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkPages(p));
    else if (name === 'page.tsx') out.push(p);
  }
  return out;
}

function walkHtml(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkHtml(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

describe('questionHeadingId', () => {
  it('returns deterministic ASCII kebab ids', () => {
    const a = questionHeadingId('아버지 생신 선물, 생일과 무엇이 다른가요?');
    const b = questionHeadingId('아버지 생신 선물, 생일과 무엇이 다른가요?');
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(a.length).toBeGreaterThan(3);
  });

  it('keeps ascii questions readable', () => {
    expect(questionHeadingId('Why English?')).toBe('why-english');
  });
});

describe('journal question H2 ids (source)', () => {
  const pages = walkPages(JOURNAL_ROOT);

  it('every question H2 (text ending in ?) uses questionHeadingId', () => {
    const missing: string[] = [];
    for (const page of pages) {
      const src = readFileSync(page, 'utf8');
      for (const hit of src.matchAll(/<h2(?![^>]*\bid=)[^>]*>([^<]*\?)<\/h2>/g)) {
        missing.push(`${relative(ROOT, page)}: ${hit[1]}`);
      }
      if (/<h2>\{q\}<\/h2>/.test(src)) {
        missing.push(`${relative(ROOT, page)}: <h2>{q}</h2> without id`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('ids are unique per journal page (static + FAQ question H2s)', () => {
    const collisions: string[] = [];
    for (const page of pages) {
      const src = readFileSync(page, 'utf8');
      const slug = relative(JOURNAL_ROOT, page).split('/')[0]!;
      const ids: string[] = [];
      for (const m of src.matchAll(/<h2\s+id=\{questionHeadingId\((["`])([\s\S]*?)\1\)\}>/g)) {
        ids.push(questionHeadingId(m[2]));
      }
      if (/questionHeadingId\(q\)/.test(src) && FAQ_BY_SLUG[slug]) {
        for (const { q } of FAQ_BY_SLUG[slug]) {
          ids.push(questionHeadingId(q));
        }
      }
      const seen = new Set<string>();
      for (const id of ids) {
        if (seen.has(id)) collisions.push(`${slug}: ${id}`);
        seen.add(id);
      }
    }
    expect(collisions).toEqual([]);
  });
});

describe('built out/ journal question H2 ids', () => {
  it('every question h2 has a unique id per page', () => {
    if (!existsSync(OUT_ROOT)) return;
    const bad: string[] = [];
    for (const file of walkHtml(join(OUT_ROOT, 'journal'))) {
      const html = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
      const questionIds: string[] = [];
      for (const [, attrs, inner] of html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi)) {
        const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (!text.endsWith('?')) continue;
        const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
        if (!idMatch) {
          bad.push(`${relative(OUT_ROOT, file)}: missing id for ${text.slice(0, 60)}`);
          continue;
        }
        questionIds.push(idMatch[1]);
      }
      const seen = new Set<string>();
      for (const id of questionIds) {
        if (seen.has(id)) bad.push(`${relative(OUT_ROOT, file)}: duplicate id ${id}`);
        seen.add(id);
      }
    }
    expect(bad).toEqual([]);
    // Flat next export uses out/journal/<slug>.html (and optional dir copies).
    const journalHtml = walkHtml(join(OUT_ROOT, 'journal')).filter((f) => !relative(OUT_ROOT, f).includes('__next'));
    let total = 0;
    for (const file of journalHtml) {
      const html = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
      for (const [, , inner] of html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi)) {
        const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (text.endsWith('?')) total += 1;
      }
    }
    // Prefer the flat *.html copies (dir duplicates would double-count).
    const flatOnly = journalHtml.filter((f) => relative(join(OUT_ROOT, 'journal'), f).split('/').length === 1);
    let flatTotal = 0;
    const perPage: Record<string, number> = {};
    for (const file of flatOnly) {
      const html = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
      let n = 0;
      for (const [, attrs, inner] of html.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi)) {
        const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (!text.endsWith('?')) continue;
        n += 1;
        if (!/\bid=["']/.test(attrs)) throw new Error('missing id');
      }
      perPage[relative(OUT_ROOT, file)] = n;
      flatTotal += n;
    }
    expect(flatTotal).toBeGreaterThan(60);
    expect(Object.keys(perPage).length).toBeGreaterThan(8);
  });

  it('BANNED word count is 0 across out/**/*.html (scrubbing FIXED_FUNCTIONAL)', () => {
    if (!existsSync(OUT_ROOT)) return;
    const hits: string[] = [];
    for (const file of walkHtml(OUT_ROOT)) {
      const scrubbed = readFileSync(file, 'utf8').split(FIXED_FUNCTIONAL).join('');
      for (const word of BANNED) {
        if (scrubbed.includes(word)) hits.push(`${relative(OUT_ROOT, file)}: ${word}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
