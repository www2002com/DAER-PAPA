#!/usr/bin/env node
/**
 * Sitemap lastmod maintenance for dearpapa.kr (static export).
 *
 * Source of truth on Vercel: lib/lastmod.json (checked in).
 * Vercel clones are shallow, so build must NOT derive lastmod from git.
 *
 * Locally (full history):
 *   node scripts/update-lastmod.mjs              # rewrite public/sitemap.xml from lastmod.json + hash
 *   node scripts/update-lastmod.mjs --from-git   # refresh lastmod.json from git per lib/lastmod-sources.json
 *   node scripts/update-lastmod.mjs --from-git / /press   # only those paths
 *
 * Shared layout/header/footer/globals/menu are omitted from sources on purpose.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSitemapXml,
  expandSources,
  gitLastmodSeoul,
  loadJson,
  sha256Hex,
} from './lastmod-lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const lastmodPath = path.join(root, 'lib/lastmod.json');
const sourcesPath = path.join(root, 'lib/lastmod-sources.json');
const sitemapPath = path.join(root, 'public/sitemap.xml');
const preservedPath = path.join(root, 'lib/preserved-site.json');

const args = process.argv.slice(2);
const fromGit = args.includes('--from-git');
const onlyPaths = args.filter((a) => a !== '--from-git');

const sourcesDoc = loadJson(sourcesPath);
const pageSources = sourcesDoc.pages;
let lastmod = loadJson(lastmodPath);

// Ensure every mapped page has an entry (preserve order from sources doc).
const ordered = {};
for (const loc of Object.keys(pageSources)) {
  if (lastmod[loc]) ordered[loc] = lastmod[loc];
}
for (const [loc, date] of Object.entries(lastmod)) {
  if (!(loc in ordered)) ordered[loc] = date;
}
lastmod = ordered;

if (fromGit) {
  const targets = onlyPaths.length ? onlyPaths : Object.keys(pageSources);
  for (const loc of targets) {
    const src = pageSources[loc];
    if (!src) {
      console.error(`No sources mapped for ${loc}`);
      process.exitCode = 1;
      continue;
    }
    const files = expandSources(root, src);
    const result = gitLastmodSeoul(root, files);
    if (!result || result.ok !== true) {
      const reason = result?.reason ?? 'git-unavailable';
      console.warn(`Keep ${loc}=${lastmod[loc]} (git fallback: ${reason})`);
      continue;
    }
    if (lastmod[loc] !== result.date) {
      console.log(`${loc}: ${lastmod[loc] ?? '(none)'} -> ${result.date}`);
    }
    lastmod[loc] = result.date;
  }
  writeFileSync(lastmodPath, `${JSON.stringify(lastmod, null, 2)}\n`);
}

// Validate sources cover lastmod keys and vice versa.
const missingSources = Object.keys(lastmod).filter((k) => !pageSources[k]);
const missingLastmod = Object.keys(pageSources).filter((k) => !lastmod[k]);
if (missingSources.length || missingLastmod.length) {
  console.error('lastmod/sources mismatch', { missingSources, missingLastmod });
  process.exit(1);
}

const xml = buildSitemapXml(lastmod);
writeFileSync(sitemapPath, xml);
const hash = sha256Hex(Buffer.from(xml));
const preserved = loadJson(preservedPath);
if (!preserved.rootFilesSha256) preserved.rootFilesSha256 = {};
preserved.rootFilesSha256['sitemap.xml'] = hash;
writeFileSync(preservedPath, `${JSON.stringify(preserved, null, 2)}\n`);

console.log(`Wrote public/sitemap.xml (${Object.keys(lastmod).length} URLs), sitemap sha256=${hash.slice(0, 12)}…`);
