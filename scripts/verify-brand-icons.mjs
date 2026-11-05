import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
async function htmlFiles(dir) {
  const result = [];
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...await htmlFiles(file));
    else if (file.endsWith('.html')) result.push(file);
  }
  return result;
}
const pages = await htmlFiles('out');
assert(pages.length > 0, 'Build the site before verifying icons.');
let expected;
const ABS = 'https://dearpapa.kr';
const expectedHead = [
  { rel: 'manifest', href: '/brand/icons-r2/site.webmanifest', sizes: null, type: '' },
  { rel: 'shortcut icon', href: `${ABS}/brand/icons-r2/favicon.ico`, sizes: null, type: '' },
  { rel: 'icon', href: `${ABS}/brand/icons-r2/favicon-32.png`, sizes: '32x32', type: 'image/png' },
  { rel: 'apple-touch-icon', href: `${ABS}/brand/icons-r2/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
];
function localPath(href) {
  if (href.startsWith(ABS + '/')) return path.join('out', href.slice(ABS.length + 1));
  if (href.startsWith('/')) return path.join('out', href.slice(1));
  throw new Error(`unexpected icon href: ${href}`);
}
for (const file of pages) {
  const dom = new JSDOM(await fs.readFile(file, 'utf8'));
  const links = [...dom.window.document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"],link[rel="manifest"]')]
    .map(n => ({ rel: n.rel, href: n.getAttribute('href'), sizes: n.getAttribute('sizes'), type: n.type }));
  assert.deepEqual(links, expectedHead, `${file}: favicon head must match Naver absolute/one-rel shape`);
  // Each icon rel appears once (shortcut icon, icon, apple-touch-icon).
  const faviconRels = links.filter(n => n.rel !== 'manifest').map(n => n.rel);
  assert.deepEqual(faviconRels, ['shortcut icon', 'icon', 'apple-touch-icon'], `${file}: favicon rels`);
  if (!expected) expected = links;
  else assert.deepEqual(links, expected, `${file}: icons differ from other pages`);
  for (const link of links) await fs.access(localPath(link.href));
  dom.window.close();
}
for (const name of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'site.webmanifest']) {
  const legacy = await fs.readFile(`out/${name}`);
  const current = await fs.readFile(`out/brand/icons-r2/${name}`);
  assert(legacy.equals(current), `${name}: legacy fallback differs from current icon`);
}
const manifest = JSON.parse(await fs.readFile('out/brand/icons-r2/site.webmanifest', 'utf8'));
assert.equal(manifest.start_url, '/'); assert.equal(manifest.scope, '/');
for (const icon of manifest.icons) {
  assert(icon.src.startsWith('/brand/icons-r2/'), 'Manifest uses an obsolete icon');
  const meta = await sharp(path.join('out', icon.src)).metadata();
  assert.equal(`${meta.width}x${meta.height}`, icon.sizes);
}
const ico = await fs.readFile('out/brand/icons-r2/favicon.ico');
assert.equal(ico.readUInt16LE(0), 0); assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 3);
for (let i = 0; i < 3; i++) {
  const entry = 6 + i * 16, size = [16, 32, 48][i];
  assert.equal(ico[entry], size); assert.equal(ico[entry + 1], size);
  const offset = ico.readUInt32LE(entry + 12), length = ico.readUInt32LE(entry + 8);
  const frame = ico.subarray(offset, offset + length);
  assert(frame.equals(await fs.readFile(`out/brand/icons-r2/favicon-${size}.png`)), 'ICO frame differs from PNG');
  assert.equal((await sharp(frame).metadata()).width, size);
}
const { data, info } = await sharp('out/brand/icons-r2/icon-maskable-512.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let radius = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  const i = (y * info.width + x) * info.channels;
  assert.equal(data[i + 3], 255, 'Maskable icon background must be opaque');
  if (data[i] < 100 && data[i + 1] < 130 && data[i + 2] < 160) radius = Math.max(radius, Math.hypot(x - 255.5, y - 255.5));
}
assert(radius < 204.8, 'Logo exceeds the central mask-safe circle');
console.log(JSON.stringify({ pages: pages.length, allPagesMatch: true, legacyFallbacksMatch: true, icoFrames: [16, 32, 48], maskableRadius: radius, maskableSafeRadius: 204.8, links: expected }, null, 2));
