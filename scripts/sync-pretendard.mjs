// Copies the official Pretendard Variable dynamic-subset web font (CSS + woff2 slices) from
// node_modules into public/, byte for byte, so the site can load it as a non-render-blocking
// stylesheet. Files are not modified (Pretendard is SIL OFL 1.1 with Reserved Font Name
// "Pretendard"; a modified copy could not keep that name). Re-run after upgrading the package:
//   node scripts/sync-pretendard.mjs
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = join(root, 'node_modules/pretendard');
const { version } = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
const src = join(pkgDir, 'dist/web/variable');
const outBase = join(root, 'public/fonts/pretendard');
const out = join(outBase, version);

rmSync(outBase, { recursive: true, force: true });
mkdirSync(join(out, 'woff2-dynamic-subset'), { recursive: true });
cpSync(join(src, 'pretendardvariable-dynamic-subset.css'), join(out, 'pretendardvariable-dynamic-subset.css'));
for (const f of readdirSync(join(src, 'woff2-dynamic-subset'))) {
  if (f.endsWith('.woff2')) cpSync(join(src, 'woff2-dynamic-subset', f), join(out, 'woff2-dynamic-subset', f));
}
cpSync(join(root, 'scripts/assets/pretendard-OFL.txt'), join(out, 'LICENSE.txt'));
console.log(`pretendard ${version} -> public/fonts/pretendard/${version} (keep PRETENDARD_VERSION in lib/fonts.ts in sync)`);
