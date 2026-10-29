// @vitest-environment node
// Banned wording in page copy, meta descriptions and titles, checked at the source.
// The JSON-LD check (faq-jsonld-and-banned.test.ts) only sees structured data and only when out/ exists;
// this one also covers visible body text and <meta> strings, and runs on a fresh clone (Vercel prebuild).
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BANNED, FIXED_FUNCTIONAL } from './copy-rules';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(p);
    return /\.(ts|tsx)$/.test(entry.name) ? [p] : [];
  });
}

/** Drop comments so notes about the rules themselves never trip the check. */
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

describe('banned wording in site source copy', () => {
  const files = ['app', 'components', 'lib'].flatMap((dir) => sourceFiles(path.join(root, dir)));

  it('finds the site source', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it('keeps every page, meta and component string free of banned words', () => {
    const found: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, 'utf8')).split(FIXED_FUNCTIONAL).join('');
      for (const word of BANNED) {
        let at = text.indexOf(word);
        while (at >= 0) {
          found.push(`${path.relative(root, file)}: «${word}» …${text.slice(Math.max(0, at - 24), at + word.length + 24).replace(/\s+/g, ' ')}…`);
          at = text.indexOf(word, at + 1);
        }
      }
    }
    expect(found, found.join('\n')).toEqual([]);
  });
});
