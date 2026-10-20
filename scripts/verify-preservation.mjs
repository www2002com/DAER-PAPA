import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const baseline = JSON.parse(await readFile(path.join(root, 'lib/preserved-site.json'), 'utf8'));
const originArg = process.argv.indexOf('--url');
const origin = originArg >= 0 ? process.argv[originArg + 1] : null;
const failures = [];
const decode = (s) => s.replace(/&#(x[\da-f]+|\d+);|&(amp|quot|apos|lt|gt|nbsp);/gi, (_, number, name) => (
  number ? String.fromCodePoint(number[0].toLowerCase() === 'x' ? parseInt(number.slice(1), 16) : +number)
    : ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' })[name.toLowerCase()]
));
const text = (html) => decode(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
const schemas = (html) => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const check = (name, fn) => {
  try { fn(); }
  catch (error) { failures.push(`${name}: ${error.message}`); }
};

async function output(file, route) {
  if (!origin) return readFile(path.join(root, 'out', file));
  const response = await fetch(new URL(route, origin), { redirect: 'manual' });
  assert.equal(response.status, 200, `${route} must return 200 without redirect`);
  return Buffer.from(await response.arrayBuffer());
}

let schemaCount = 0;
for (const [route, page] of Object.entries(baseline.pages)) {
  const html = (await output(page.file, route)).toString('utf8');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
  check(`${route} initial HTML`, () => {
    assert.ok(text(main).length > 200, 'main content must be present without JavaScript');
    assert.match(main, /<h1\b/, 'h1 must be present in the initial HTML');
    assert.match(body, /<nav\b[^>]*aria-label="주요 메뉴"/, 'server-rendered menu missing');
    assert.doesNotMatch(body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ''), /\{\{[\s\S]*?\}\}/, 'unresolved template placeholder');
  });
  check(`${route} metadata`, () => {
    assert.equal(text(head.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''), page.title);
    const links = [...head.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]));
    const canonicals = links.filter((link) => link.rel === 'canonical');
    assert.equal(canonicals.length, 1, 'expected one canonical');
    assert.equal(canonicals[0].href, page.canonical, 'canonical changed');
    const metadata = [...head.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]));
    for (const expected of page.meta) {
      const key = expected.property ? 'property' : 'name';
      const matches = metadata.filter((item) => item[key] === expected[key]);
      assert.equal(matches.length, 1, `expected one ${expected[key]} tag`);
      assert.equal(matches[0].content, expected.content, `${expected[key]} changed`);
    }
  });
  check(`${route} JSON-LD`, () => {
    const blocks = schemas(head);
    assert.deepEqual(blocks, page.jsonLd, 'head JSON-LD must match production verbatim');
    assert.equal(schemas(body).length, 0, 'duplicate/body JSON-LD found');
    blocks.forEach((block) => JSON.parse(block));
    schemaCount += blocks.length;
  });
  if (page.bodyParagraphs) check(`${route} official paragraphs`, () => {
    const rendered = text(main);
    const missing = page.bodyParagraphs.filter((paragraph) => !rendered.includes(paragraph));
    assert.deepEqual(missing, [], 'original article text is missing or altered');
  });
  if (route === '/about/facts') check('facts exact source body', () => {
    assert.ok(main.includes(baseline.factsBodyHtml), 'facts body must be preserved character for character');
  });
  if (route === '/') check('home FAQ without JavaScript', () => {
    const all = baseline.pages['/'].jsonLd.flatMap((raw) => {
      const value = JSON.parse(raw);
      return value['@graph'] ?? [value];
    });
    const faq = all.find((node) => node['@type'] === 'FAQPage');
    assert.ok(faq, 'original FAQPage missing');
    const rendered = text(main);
    for (const question of faq.mainEntity) {
      assert.ok(rendered.includes(question.name), `missing question: ${question.name}`);
      assert.ok(rendered.includes(question.acceptedAnswer.text), `missing answer: ${question.name}`);
    }
  });
}

for (const [file, expected] of Object.entries(baseline.rootFilesSha256)) {
  const bytes = await output(file, `/${file}`);
  check(file, () => assert.equal(hash(bytes), expected, 'root file content changed'));
}
for (const [file, expected] of Object.entries(baseline.approvedStorySha256)) {
  const bytes = await readFile(path.join(root, file));
  // Git may convert source-code line endings on Windows; rendered content must stay identical.
  const content = /\.(tsx|css)$/.test(file) ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
  check(file, () => assert.equal(hash(content), expected, 'approved Lincoln section changed'));
}

if (failures.length) {
  console.error(`Preservation check failed (${failures.length}):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Preservation verified: 9 routes, ${schemaCount} head JSON-LD blocks, exact facts body, article paragraphs, FAQ, metadata, 9 root files, approved Lincoln section. Source: ${baseline.sourceCommit}.`);
  console.log(origin ? `Checked initial HTTP responses from ${origin}; no JavaScript was executed.` : 'Checked the exported initial HTML; no JavaScript was executed.');
}
