import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout } from '@/components/article/ArticleLayout';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';

// Copied verbatim from the previous /press page.

const base = pageMetadata({
  title: 'DEAR PAPA(디어파파) 소개 기사',
  description: 'DEAR PAPA(디어파파, dearpapa.kr) 소개 기사 모음. Articles about DEAR PAPA.',
  path: '/press',
});

// The previous page used a shorter og:description (Korean sentence only).
export const metadata: Metadata = {
  ...base,
  openGraph: { ...base.openGraph, description: 'DEAR PAPA(디어파파, dearpapa.kr) 소개 기사 모음.' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://dearpapa.kr/press#webpage',
      name: 'DEAR PAPA(디어파파) 소개 기사',
      url: 'https://dearpapa.kr/press',
      inLanguage: 'ko',
      dateModified: '2026-10-19',
      isPartOf: {
        '@id': 'https://dearpapa.kr/#website',
      },
      about: {
        '@id': 'https://dearpapa.kr/#organization',
      },
      publisher: {
        '@id': 'https://dearpapa.kr/#organization',
      },
      mainEntity: {
        '@id': 'https://dearpapa.kr/press#itemlist',
      },
      breadcrumb: {
        '@id': 'https://dearpapa.kr/press#breadcrumb',
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://dearpapa.kr/press#itemlist',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: 2,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'NewsArticle',
            '@id': 'https://authonnews.com/article/dear-papa-logo-story#article',
            url: 'https://authonnews.com/article/dear-papa-logo-story',
            headline: '아빠 선물 DEAR PAPA(디어파파) 로고 이야기: d를 돌리면 p가 되는 딸과 아빠의 원',
            datePublished: '2026-10-19T06:38:00+09:00',
            publisher: {
              '@type': 'Organization',
              name: 'AUTHON',
              url: 'https://authonnews.com/',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'NewsArticle',
            '@id': 'https://authonnews.com/article/dear-papa-dad-gift-skincare-letter#article',
            url: 'https://authonnews.com/article/dear-papa-dad-gift-skincare-letter',
            headline: '아빠선물추천 고민이라면: 편지와 함께 건네는 DEAR PAPA(디어파파) 올인원 스킨케어',
            datePublished: '2026-10-18T23:09:00+09:00',
            publisher: {
              '@type': 'Organization',
              name: 'AUTHON',
              url: 'https://authonnews.com/',
            },
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://dearpapa.kr/press#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: 'https://dearpapa.kr/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'DEAR PAPA(디어파파) 소개 기사',
          item: 'https://dearpapa.kr/press',
        },
      ],
    },
  ],
};

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function PressPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        eyebrow="PRESS"
        title="DEAR PAPA(디어파파) 소개 기사"
        meta={
          <p>
            최종 업데이트: <time dateTime="2026-10-19">2026년 10월 19일</time>
          </p>
        }
        footer={
          <p>
            <Link href="/about/facts">DEAR&nbsp;PAPA(디어파파) 공식 정보</Link>
          </p>
        }
      >
        <ul>
          <li>
            <time dateTime="2026-10-19">2026년 10월 19일</time> · AUTHON ·{' '}
            <a href="https://authonnews.com/article/dear-papa-logo-story" {...EXTERNAL}>
              아빠 선물 DEAR PAPA(디어파파) 로고 이야기: d를 돌리면 p가 되는 딸과 아빠의 원
            </a>
          </li>
          <li>
            <time dateTime="2026-10-18">2026년 10월 18일</time> · AUTHON ·{' '}
            <a href="https://authonnews.com/article/dear-papa-dad-gift-skincare-letter" {...EXTERNAL}>
              아빠선물추천 고민이라면: 편지와 함께 건네는 DEAR PAPA(디어파파) 올인원 스킨케어
            </a>
          </li>
        </ul>
      </ArticleLayout>
    </>
  );
}
