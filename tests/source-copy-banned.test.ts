// @vitest-environment node
// Banned wording in page copy, meta descriptions and titles, checked at the source.
// The JSON-LD check (faq-jsonld-and-banned.test.ts) only sees structured data and only when out/ exists;
// this one also covers visible body text and <meta> strings, and runs on a fresh clone (Vercel prebuild).
// Also covers public/ AI files, and (when present) rendered out/*.html text.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BANNED, FIXED_FUNCTIONAL } from './copy-rules';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');

const PUBLIC_AI_FILES = [
  'llms.txt',
  'llm.md',
  'facts.json',
  'answer.json',
  'citation.txt',
  'schema.jsonld',
  'rss.xml',
] as const;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(entry.name) ? [p] : [];
  });
}

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

/** Drop comments so notes about the rules themselves never trip the check. */
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function findBanned(label: string, text: string, found: string[]) {
  const scrubbed = text.split(FIXED_FUNCTIONAL).join('');
  for (const word of BANNED) {
    let at = scrubbed.indexOf(word);
    while (at >= 0) {
      found.push(
        `${label}: «${word}» …${scrubbed.slice(Math.max(0, at - 24), at + word.length + 24).replace(/\s+/g, ' ')}…`,
      );
      at = scrubbed.indexOf(word, at + 1);
    }
  }
}

describe('banned wording in site source copy', () => {
  const files = ['app', 'components', 'lib'].flatMap((dir) => sourceFiles(path.join(root, dir)));

  it('finds the site source', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it('keeps every page, meta and component string free of banned words', () => {
    const found: string[] = [];
    for (const file of files) {
      findBanned(path.relative(root, file), stripComments(readFileSync(file, 'utf8')), found);
    }
    expect(found, found.join('\n')).toEqual([]);
  });

  it('keeps public AI files free of banned words', () => {
    const found: string[] = [];
    for (const name of PUBLIC_AI_FILES) {
      const file = path.join(root, 'public', name);
      expect(existsSync(file), `missing public/${name}`).toBe(true);
      findBanned(`public/${name}`, readFileSync(file, 'utf8'), found);
    }
    expect(found, found.join('\n')).toEqual([]);
  });

  it('keeps rendered out/*.html free of banned words when out/ exists', () => {
    if (!existsSync(outDir)) return;
    const found: string[] = [];
    for (const file of walkHtmlFiles(outDir)) {
      // Strip scripts/styles so bundled identifiers never trip the check.
      const html = readFileSync(file, 'utf8')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
      findBanned(path.relative(root, file), html, found);
    }
    expect(found, found.join('\n')).toEqual([]);
  });
});
