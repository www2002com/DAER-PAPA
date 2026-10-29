#!/usr/bin/env node
/**
 * Copies Pretendard dynamic-subset woff2 + rewritten CSS into public/fonts
 * so the full Hangul face can load non-blocking after the critical subset.
 * Critical subset (pretendard-critical.woff2) is checked in.
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcCss = join(
  root,
  'node_modules/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css',
);
const srcDir = join(
  root,
  'node_modules/pretendard/dist/web/variable/woff2-dynamic-subset',
);
const outDir = join(root, 'public/fonts');
const outWoff = join(outDir, 'woff2-dynamic-subset');
const critical = join(outDir, 'pretendard-critical.woff2');

if (!existsSync(critical)) {
  console.error('missing public/fonts/pretendard-critical.woff2 — rebuild with scripts/build-critical-font.sh');
  process.exit(1);
}
if (!existsSync(srcCss) || !existsSync(srcDir)) {
  console.error('pretendard package missing — run npm install');
  process.exit(1);
}

mkdirSync(outWoff, { recursive: true });
cpSync(srcDir, outWoff, { recursive: true });
const css = readFileSync(srcCss, 'utf8').replaceAll(
  './woff2-dynamic-subset/',
  '/fonts/woff2-dynamic-subset/',
);
writeFileSync(join(outDir, 'pretendardvariable-dynamic-subset.css'), css);
console.log('prepare-fonts: critical + dynamic-subset CSS/woff2 ready under public/fonts');
