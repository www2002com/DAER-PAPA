// All browser and installed-app icons come from the approved header symbol.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = path.join(root, 'public');
const outputDir = path.join(publicDir, 'brand/icons-r2');
const compiledDir = path.join(root, '.preview-api');
await mkdir(outputDir, { recursive: true });
await mkdir(compiledDir, { recursive: true });
const source = await readFile(path.join(root, 'components/Logo.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX,
} });
const modulePath = path.join(compiledDir, 'logo-for-icons.mjs');
await writeFile(modulePath, compiled.outputText);
const { LOGO_CANVAS_PATHS } = await import(pathToFileURL(modulePath).href);
const mark = LOGO_CANVAS_PATHS.slice(0, 2).map(({ t, d, evenodd }) =>
  `<path transform="translate(${t[0]} ${t[1]}) scale(${t[2]})"${evenodd ? ' fill-rule="evenodd"' : ''} d="${d}"/>`).join('');
// The same mark remains within the central mask-safe circle at every size.
const svg = (square = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><title>DEAR PAPA</title><rect width="256" height="256" rx="${square ? 0 : 48}" fill="#e9f1f5"/><svg x="76" y="40" width="104" height="176" viewBox="-4 -4 142 238"><g fill="#203c50">${mark}</g></svg></svg>\n`;
await writeFile(path.join(outputDir, 'favicon.svg'), svg());
const pngs = new Map();
for (const size of [16, 32, 48, 180, 192, 512]) {
  const bytes = await sharp(Buffer.from(svg(size === 180))).resize(size, size).png().toBuffer();
  pngs.set(size, bytes);
  const name = size === 180 ? 'apple-touch-icon.png' : size >= 192 ? `icon-${size}.png` : `favicon-${size}.png`;
  await writeFile(path.join(outputDir, name), bytes);
}
await sharp(Buffer.from(svg(true))).resize(512, 512).png().toFile(path.join(outputDir, 'icon-maskable-512.png'));

// ICO container with genuine 16/32/48 PNG frames, not a renamed PNG file.
const sizes = [16, 32, 48];
const directory = Buffer.alloc(6 + 16 * sizes.length);
directory.writeUInt16LE(1, 2); directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
sizes.forEach((size, index) => {
  const frame = pngs.get(size); const entry = 6 + index * 16;
  directory[entry] = size; directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4); directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8); directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(path.join(outputDir, 'favicon.ico'), Buffer.concat([directory, ...sizes.map(size => pngs.get(size))]));

for (const name of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) {
  await copyFile(path.join(outputDir, name), path.join(publicDir, name));
}
const manifest = {
  name: 'DEAR PAPA 디어파파', short_name: 'DEAR PAPA', id: '/', start_url: '/', scope: '/',
  icons: [
    { src: '/brand/icons-r2/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/brand/icons-r2/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/brand/icons-r2/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  theme_color: '#e9f1f5', background_color: '#e9f1f5', display: 'standalone',
};
const manifestJson = JSON.stringify(manifest, null, 2) + '\n';
await writeFile(path.join(outputDir, 'site.webmanifest'), manifestJson);
await writeFile(path.join(publicDir, 'site.webmanifest'), manifestJson);
console.log('Generated unified icons from components/Logo.tsx in public/brand/icons-r2; legacy URLs match.');
