// Writes smaller WebP copies of the campaign images so the browser can pick one that fits (srcset).
// Run after changing an image: node scripts/make-image-variants.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'public/images/campaign-blue';
const WIDTHS = [256, 640, 828, 1080, 1280];
const manifest = {};
// Only the images rendered through next/image.
const FILES = ['bottle.webp', 'cap.webp', 'carton.webp', 'letter-gift.webp', 'packaging.webp'];
for (const file of FILES) {
  const name = file.replace(/\.webp$/, '');
  const { width } = await sharp(join(DIR, file)).metadata();
  const made = [];
  for (const w of WIDTHS) {
    if (w >= width) continue;
    await sharp(join(DIR, file)).resize({ width: w }).webp({ quality: 82, effort: 6 }).toFile(join(DIR, 'w', `${name}-${w}.webp`));
    made.push(w);
  }
  manifest[`/images/campaign-blue/${file}`] = made;
}
writeFileSync('lib/image-variants.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest);
