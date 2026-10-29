// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BANNED, FIXED_FUNCTIONAL } from './copy-rules';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');

type FaqPair = { q: string; a: string };

function walkHtmlFiles(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkHtmlFiles(p));
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLdBlocks(html: string): unknown[] {
  const blocks: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      /* skip */
    }
  }
  return blocks;
}

function walkNodes(node: unknown, visit: (n: Record<string, unknown>) => void): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) walkNodes(item, visit);
    return;
  }
  const obj = node as Record<string, unknown>;
  visit(obj);
  for (const v of Object.values(obj)) walkNodes(v, visit);
}

function faqPairsFromJsonLd(blocks: unknown[]): FaqPair[] {
  const pairs: FaqPair[] = [];
  for (const block of blocks) {
    walkNodes(block, (n) => {
      const types = n['@type'];
      const isFaq =
        types === 'FAQPage' || (Array.isArray(types) && types.includes('FAQPage'));
      if (!isFaq) return;
      const entities = n.mainEntity;
      if (!Array.isArray(entities)) return;
      for (const ent of entities) {
        if (!ent || typeof ent !== 'object') continue;
        const q = ent as Record<string, unknown>;
        const name = typeof q.name === 'string' ? q.name : '';
        const ans = q.acceptedAnswer as Record<string, unknown> | undefined;
        const text = ans && typeof ans.text === 'string' ? ans.text : '';
        if (name && text) pairs.push({ q: name, a: text });
      }
    });
  }
  return pairs;
}

function headingTexts(html: string, tag: 'h2' | 'h3'): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(stripTags(m[1]));
  return out;
}

function detailsSummaries(html: string): string[] {
  const out: string[] = [];
  const re = /<details\b[^>]*>([\s\S]*?)<\/details>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const sm = /<summary\b[^>]*>([\s\S]*?)<\/summary>/i.exec(m[1]);
    if (sm) out.push(stripTags(sm[1]));
  }
  return out;
}

function qaMarkerQuestions(html: string): string[] {
  const text = stripTags(
    html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' '),
  );
  const out: string[] = [];
  const re = /Q\.\s*(.*?)\s*A\./gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1].replace(/\s+/g, ' ').trim());
  return out;
}

/**
 * FAQPage JSON-LD must match on-screen FAQ (count + text).
 * Sun-ny methodology: every JSON-LD Q/A appears in the page; structural FAQ
 * list (details / h2 / h3 / Q. markers) intersecting JSON-LD must have equal count.
 */
function assertFaqMatchesScreen(rel: string, html: string, jsonFaq: FaqPair[]) {
  const body = stripTags(
    html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' '),
  );
  const jsonQs = new Set(jsonFaq.map((p) => p.q));

  for (const { q, a } of jsonFaq) {
    expect(body.includes(q), `${rel} missing on-screen question: ${q}`).toBe(true);
    expect(body.includes(a), `${rel} missing on-screen answer for: ${q}`).toBe(true);
  }

  const candidates: { label: string; items: string[] }[] = [
    { label: 'details/summary', items: detailsSummaries(html) },
    { label: 'h2', items: headingTexts(html, 'h2') },
    { label: 'h3', items: headingTexts(html, 'h3') },
    { label: 'Q./A. markers', items: qaMarkerQuestions(html) },
  ];

  for (const { label, items } of candidates) {
    const hits = items.filter((s) => jsonQs.has(s));
    if (hits.length === 0) continue;
    expect(
      hits.length,
      `${rel} FAQ ${label}∩JSON-LD count vs FAQPage (${hits.length} vs ${jsonFaq.length})`,
    ).toBe(jsonFaq.length);
    for (const q of jsonQs) {
      expect(hits.includes(q), `${rel} ${label} missing JSON-LD Q: ${q}`).toBe(true);
    }
    return;
  }

  // No structural list overlapped JSON-LD — still OK if every Q/A is in the body
  // (already asserted). Fail only when we expected a list but found none matching.
  expect(
    jsonFaq.length,
    `${rel} no on-screen FAQ structure (details/h2/h3/Q.) matched FAQPage questions`,
  ).toBe(jsonFaq.length);
}

function collectJsonLdStrings(blocks: unknown[]): string[] {
  const strings: string[] = [];
  const visit = (v: unknown) => {
    if (typeof v === 'string') strings.push(v);
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v as object).forEach(visit);
  };
  blocks.forEach(visit);
  return strings;
}

describe('FAQPage JSON-LD matches on-screen FAQ', () => {
  // Soft-skip when out/ is absent: package.json prebuild runs npm test
  // before next build creates out/ (Vercel/CI). Local full checks still
  // cover this after `npx next build`.
  it('has a built out/ tree when present (skipped during prebuild)', () => {
    if (!existsSync(outDir)) return;
    expect(existsSync(outDir)).toBe(true);
  });

  it('matches count and text for every page that emits FAQPage', () => {
    if (!existsSync(outDir)) return;
    const files = walkHtmlFiles(outDir);
    expect(files.length).toBeGreaterThan(0);

    let pagesWithFaq = 0;
    for (const file of files) {
      const html = readFileSync(file, 'utf8');
      const jsonFaq = faqPairsFromJsonLd(extractJsonLdBlocks(html));
      if (jsonFaq.length === 0) continue;
      pagesWithFaq += 1;
      assertFaqMatchesScreen(path.relative(root, file), html, jsonFaq);
    }
    expect(pagesWithFaq).toBeGreaterThan(0);
  });
});

describe('JSON-LD banned words', () => {
  function assertNoBanned(label: string, text: string) {
    const scrubbed = text.split(FIXED_FUNCTIONAL).join('');
    for (const word of BANNED) {
      expect(scrubbed.includes(word), `${label} contains banned «${word}»`).toBe(false);
    }
  }

  it('scans built out/*.html JSON-LD blocks', () => {
    if (!existsSync(outDir)) return;
    for (const file of walkHtmlFiles(outDir)) {
      const html = readFileSync(file, 'utf8');
      for (const s of collectJsonLdStrings(extractJsonLdBlocks(html))) {
        assertNoBanned(path.relative(root, file), s);
      }
    }
  });

  it('scans public/*.json and public/*.jsonld', () => {
    const pub = path.join(root, 'public');
    for (const name of readdirSync(pub)) {
      if (!/\.(json|jsonld)$/i.test(name)) continue;
      assertNoBanned(name, readFileSync(path.join(pub, name), 'utf8'));
    }
  });
});
