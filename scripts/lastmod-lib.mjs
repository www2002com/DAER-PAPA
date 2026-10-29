import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const SITE = 'https://dearpapa.kr';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Expand source entries (files or directories) to existing file paths. */
export function expandSources(root, sources) {
  const files = [];
  for (const entry of sources) {
    const abs = path.join(root, entry);
    if (!existsSync(abs)) continue;
    const st = statSync(abs);
    if (st.isDirectory()) {
      const walk = (dir) => {
        for (const name of readdirSync(dir)) {
          if (name === 'node_modules' || name === '.git') continue;
          const child = path.join(dir, name);
          const cst = statSync(child);
          if (cst.isDirectory()) walk(child);
          else files.push(child);
        }
      };
      walk(abs);
    } else {
      files.push(abs);
    }
  }
  return files;
}

/**
 * Latest commit date (Asia/Seoul calendar day) among source files.
 * Returns null when git is missing, fails, or history is too shallow to trust.
 */
export function gitLastmodSeoul(root, files, { minCommits = 1 } = {}) {
  if (!files.length) return null;
  const rel = files.map((f) => path.relative(root, f));
  const env = { ...process.env, TZ: 'Asia/Seoul' };

  const depth = spawnSync('git', ['rev-list', '--count', 'HEAD'], {
    cwd: root, env, encoding: 'utf8',
  });
  if (depth.status !== 0) return null;
  const commitCount = Number.parseInt(String(depth.stdout).trim(), 10);
  // Vercel shallow clones are often depth=1; treat very shallow history as unusable
  // so callers keep the checked-in lastmod map instead of stamping "today".
  if (!Number.isFinite(commitCount) || commitCount < Math.max(minCommits, 2)) {
    return { ok: false, reason: 'shallow-or-missing-history', commitCount };
  }

  const probe = spawnSync(
    'git',
    ['log', '-1', '--format=%cd', '--date=format:%Y-%m-%d', '--', ...rel],
    { cwd: root, env, encoding: 'utf8' },
  );
  if (probe.status !== 0) return { ok: false, reason: 'git-log-failed' };
  const date = String(probe.stdout).trim();
  if (!DATE_RE.test(date)) return { ok: false, reason: 'bad-date', date };
  return { ok: true, date };
}

export function buildSitemapXml(lastmodMap, { origin = SITE } = {}) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const [loc, lastmod] of Object.entries(lastmodMap)) {
    if (!DATE_RE.test(lastmod)) {
      throw new Error(`Invalid lastmod for ${loc}: ${lastmod}`);
    }
    const url = loc === '/' ? `${origin}/` : `${origin}${loc}`;
    lines.push(`  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>`);
  }
  lines.push('</urlset>', '');
  return lines.join('\n');
}

export function parseSitemapLastmods(xml, { origin = SITE } = {}) {
  const out = {};
  const re = new RegExp(
    `<loc>${origin.replace(/\./g, '\\.')}([^<]*)</loc><lastmod>([^<]+)</lastmod>`,
    'g',
  );
  for (const m of xml.matchAll(re)) out[m[1] || '/'] = m[2];
  return out;
}

export function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function loadJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export { SITE, DATE_RE };
