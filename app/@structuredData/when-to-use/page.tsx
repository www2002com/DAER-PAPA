import { FACTS_UPDATED } from '@/lib/facts';
import {
  WHEN_TO_USE_DESCRIPTION, WHEN_TO_USE_FAQ, WHEN_TO_USE_MODIFIED, WHEN_TO_USE_PUBLISHED, WHEN_TO_USE_TITLE, WHEN_TO_USE_URL,
} from '@/lib/when-to-use';

// New page (not part of the preserved production snapshot). FAQPage text is the same array the page renders.
const URL = WHEN_TO_USE_URL;
const FACTS = 'https://dearpapa.kr/about/facts';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': FACTS, url: FACTS, name: '디어파파 공식 정보', dateModified: FACTS_UPDATED },
    {
      '@type': 'WebPage',
      '@id': URL,
      url: URL,
      name: WHEN_TO_USE_TITLE,
      description: WHEN_TO_USE_DESCRIPTION,
      datePublished: WHEN_TO_USE_PUBLISHED,
      dateModified: WHEN_TO_USE_MODIFIED,
      inLanguage: 'ko-KR',
      image: 'https://dearpapa.kr/og.png',
      author: { '@id': 'https://dearpapa.kr/#organization' },
      publisher: { '@id': 'https://dearpapa.kr/#organization' },
      about: { '@id': 'https://dearpapa.kr/#brand' },
      isPartOf: { '@id': 'https://dearpapa.kr/#website' },
      isBasedOn: { '@id': FACTS },
      citation: [FACTS],
      breadcrumb: { '@id': `${URL}#breadcrumb` },
      mainEntity: { '@id': `${URL}#faq` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${URL}#faq`,
      inLanguage: 'ko-KR',
      isPartOf: { '@id': URL },
      mainEntity: WHEN_TO_USE_FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '디어파파', item: 'https://dearpapa.kr/' },
        { '@type': 'ListItem', position: 2, name: '우리가 준비하고 있는 것', item: 'https://dearpapa.kr/letter-all-in-one' },
        { '@type': 'ListItem', position: 3, name: WHEN_TO_USE_TITLE, item: URL },
      ],
    },
  ],
};

export default function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
