import { FACTS_UPDATED } from '@/lib/facts';
import { MAKING_DESCRIPTION, MAKING_LOG, MAKING_MODIFIED, MAKING_PUBLISHED, MAKING_TITLE, MAKING_URL } from '@/lib/making';

// New page (not part of the preserved production snapshot).
const URL = MAKING_URL;
const FACTS = 'https://dearpapa.kr/about/facts';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': FACTS, url: FACTS, name: '디어파파 공식 정보', dateModified: FACTS_UPDATED },
    {
      '@type': 'WebPage',
      '@id': URL,
      url: URL,
      name: MAKING_TITLE,
      description: MAKING_DESCRIPTION,
      datePublished: MAKING_PUBLISHED,
      dateModified: MAKING_MODIFIED,
      inLanguage: 'ko-KR',
      image: 'https://dearpapa.kr/og.png',
      author: { '@id': 'https://dearpapa.kr/#organization' },
      publisher: { '@id': 'https://dearpapa.kr/#organization' },
      about: { '@id': 'https://dearpapa.kr/#brand' },
      isPartOf: { '@id': 'https://dearpapa.kr/#website' },
      isBasedOn: { '@id': FACTS },
      citation: [FACTS],
      breadcrumb: { '@id': `${URL}#breadcrumb` },
      mainEntity: { '@id': `${URL}#log` },
    },
    {
      '@type': 'ItemList',
      '@id': `${URL}#log`,
      name: '만드는 기록',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: MAKING_LOG.length,
      itemListElement: MAKING_LOG.map((entry, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${entry.date} ${entry.title}`,
        url: `${URL}#d-${entry.date}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '디어파파', item: 'https://dearpapa.kr/' },
        { '@type': 'ListItem', position: 2, name: '디어파파 공식 정보', item: FACTS },
        { '@type': 'ListItem', position: 3, name: MAKING_TITLE, item: URL },
      ],
    },
  ],
};

export default function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
