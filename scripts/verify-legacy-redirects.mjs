import assert from 'node:assert/strict';

// Run against a deployed Vercel origin: next dev does not apply vercel.json.
const originArg = process.argv.indexOf('--url');
assert.ok(originArg >= 0 && process.argv[originArg + 1], 'Pass --url https://your-deployment');
const origin = new URL(process.argv[originArg + 1]).origin;
const cases = [
  ['/product', '/letter-all-in-one'],
  ['/product/', '/letter-all-in-one'],
  ['/product.html', '/letter-all-in-one'],
  ['/product/?utm_source=legacy', '/letter-all-in-one?utm_source=legacy'],
  ['/about/facts/', '/about/facts'],
  ['/index.html', '/'],
  ['/journal.html', '/journal'],
  ['/about/facts.html', '/about/facts'],
  ['/letter-all-in-one.html', '/letter-all-in-one'],
  ['/press.html', '/press'],
  ['/journal/brand-identity.html', '/journal/brand-identity'],
  ['/journal/development-principles.html', '/journal/development-principles'],
  ['/journal/fathers-gift-guide.html', '/journal/fathers-gift-guide'],
  ['/journal/dad-gift-guide.html', '/journal/dad-gift-guide'],
  ['/about/facts.html?utm_source=legacy&ref=ai', '/about/facts?utm_source=legacy&ref=ai'],
];
let failures = 0;
for (const [source, destination] of cases) {
  try {
    const response = await fetch(new URL(source, origin), { redirect: 'manual' });
    await response.body?.cancel();
    assert.equal(response.status, 301, `${source}: expected 301, got ${response.status}`);
    assert.equal(new URL(response.headers.get('location'), origin).href, new URL(destination, origin).href);
    const target = await fetch(new URL(destination, origin), { redirect: 'manual' });
    await target.body?.cancel();
    assert.equal(target.status, 200, `${destination}: must resolve without a redirect chain`);
    console.log(`PASS ${source} -> 301 ${destination} -> 200`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${error.message}`);
  }
}
process.exitCode = failures ? 1 : 0;
