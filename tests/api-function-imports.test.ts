import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { expect, it } from 'vitest';

// Vercel compiles each file in api/ on its own and runs it as a Node ES module ("type": "module"),
// so every relative import it reaches must name the emitted file: './x.js', never './x' or '@/x'.
// vitest resolves all three, so the gap showed only in production: an extensionless import in
// lib/launch-notify.ts (#68) made /api/launch-notify fail on every request. The Next.js build in turn
// cannot resolve './x.js', so a file shared with pages (lib/launch-notify.ts) must not import at all.
const IMPORT_RE = /^\s*(?:import|export)\s+(?!type\b)[^'"]*?from\s+['"]([^'"]+)['"]|^\s*import\s+['"]([^'"]+)['"]/gm;

it('imports only emitted .js paths in every file a Vercel function loads', () => {
  const root = process.cwd();
  const rel = (f: string) => relative(root, f).replace(/\\/g, '/');
  const queue = readdirSync(join(root, 'api')).filter(f => f.endsWith('.ts')).map(f => join(root, 'api', f));
  const seen = new Set<string>();
  const bad: string[] = [];
  while (queue.length) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const [, from, bare] of readFileSync(file, 'utf8').matchAll(IMPORT_RE)) {
      const spec = from ?? bare;
      if (!spec.startsWith('.') && !spec.startsWith('@/')) continue;
      const target = resolve(dirname(file), spec.replace(/\.js$/, '.ts'));
      if (!spec.endsWith('.js') || !existsSync(target)) bad.push(`${rel(file)}: '${spec}'`);
      else queue.push(target);
    }
  }
  expect([...seen].map(rel)).toEqual(expect.arrayContaining(['api/launch-notify.ts', 'lib/launch-notify-server.ts', 'lib/launch-notify.ts', 'api/bunny-chat.ts']));
  expect(bad).toEqual([]);
});
