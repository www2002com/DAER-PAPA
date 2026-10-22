import { describe, expect, it } from 'vitest';
import site from '@/lib/preserved-site.json';
import { PRODUCT_FAQ } from '@/lib/product-fit';

describe('/letter-all-in-one FAQPage JSON-LD', () => {
  it('matches the visible FAQ text exactly', () => {
    const graph = JSON.parse(site.pages['/letter-all-in-one'].jsonLd[0])['@graph'];
    const faq = graph.find((node: { '@type': string }) => node['@type'] === 'FAQPage');
    expect(faq.mainEntity.map((q: { name: string; acceptedAnswer: { text: string } }) => ({ q: q.name, a: q.acceptedAnswer.text })))
      .toEqual(PRODUCT_FAQ);
    expect(graph[0].dateModified).toBe('2026-10-23');
  });
});
