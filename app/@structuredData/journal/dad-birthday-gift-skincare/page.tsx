import { FACTS_UPDATED } from '@/lib/facts';
import {
  DAD_BIRTHDAY_GIFT_SKINCARE_DESCRIPTION,
  DAD_BIRTHDAY_GIFT_SKINCARE_FAQ,
  getJournalEntry,
} from '@/lib/journal';

// New page (not part of the preserved production snapshot).
const entry = getJournalEntry('dad-birthday-gift-skincare');
const URL = `https://dearpapa.kr${entry.href}`;
const FACTS = 'https://dearpapa.kr/about/facts';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': FACTS, url: FACTS, name: '디어파파 공식 정보', dateModified: FACTS_UPDATED },
    {
      '@type': 'Article',
      '@id': URL,
      url: URL,
      mainEntityOfPage: URL,
      headline: entry.title,
      description: DAD_BIRTHDAY_GIFT_SKINCARE_DESCRIPTION,
      datePublished: entry.published,
      dateModified: entry.modified,
      inLanguage: 'ko-KR',
      image: 'https://dearpapa.kr/og.png',
      author: { '@id': 'https://dearpapa.kr/#organization' },
      publisher: { '@id': 'https://dearpapa.kr/#organization' },
      about: { '@id': 'https://dearpapa.kr/#brand' },
      isPartOf: { '@id': 'https://dearpapa.kr/#website' },
      isBasedOn: { '@id': FACTS },
      citation: [FACTS],
    },
    {
      '@type': 'FAQPage',
      '@id': `${URL}#faq`,
      url: URL,
      inLanguage: 'ko-KR',
      mainEntity: DAD_BIRTHDAY_GIFT_SKINCARE_FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '디어파파', item: 'https://dearpapa.kr/' },
        { '@type': 'ListItem', position: 2, name: '브랜드 자료실', item: 'https://dearpapa.kr/journal' },
        { '@type': 'ListItem', position: 3, name: entry.title, item: URL },
      ],
    },
  ],
};

export default function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
