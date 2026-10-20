import Link from 'next/link';
import { ArticleLayout } from '@/components/article/ArticleLayout';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { JOURNAL, dotDate } from '@/lib/journal';
import styles from './journal.module.css';

// Copied verbatim from the previous /journal page.

export const metadata = pageMetadata({
  title: '브랜드 자료실 | DEAR PAPA 디어파파',
  description: '디어파파의 브랜드 이야기, 제품 개발 방향과 아빠를 위한 선물 가이드를 모았습니다.',
  path: '/journal',
  ogTitle: '브랜드 자료실',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: '브랜드 자료실',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '디어파파가 전하고 싶은 마음',
            url: 'https://dearpapa.kr/journal/brand-identity',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '매일 쓰는 제품을 준비하는 기준',
            url: 'https://dearpapa.kr/journal/development-principles',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '아빠 선물 스킨케어, 일상에 맞게 고르는 법',
            url: 'https://dearpapa.kr/journal/fathers-gift-guide',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: '아빠 선물 추천, 편지와 함께 건네는 스킨케어',
            url: 'https://dearpapa.kr/journal/dad-gift-guide',
          },
        ],
      },
      '@id': 'https://dearpapa.kr/journal',
      url: 'https://dearpapa.kr/journal',
      inLanguage: 'ko-KR',
      description: '디어파파의 브랜드 이야기, 제품 개발 방향과 아빠를 위한 선물 가이드를 모았습니다.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '디어파파',
          item: 'https://dearpapa.kr/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '브랜드 자료실',
          item: 'https://dearpapa.kr/journal',
        },
      ],
    },
  ],
};

export default function JournalPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        eyebrow="JOURNAL"
        title="브랜드 자료실"
        lead={
          <p>
            디어파파가 준비하는 것들,
            <br />
            그리고 아빠에게 마음을 전하는 이야기.
          </p>
        }
      >
        <div className={styles.index}>
          <ul className={styles.list}>
            {JOURNAL.map((entry) => (
              <li key={entry.slug} className={styles.item}>
                <article className={styles.row}>
                  <div>
                    <p className={styles.category}>{entry.category}</p>
                    <h2 className={styles.title}>
                      <Link href={entry.href}>{entry.title}</Link>
                    </h2>
                    <p className={styles.summary}>{entry.summary}</p>
                    <p className={styles.date}>
                      수정 <time dateTime={entry.modified}>{dotDate(entry.modified)}</time>
                    </p>
                  </div>
                  <svg className={styles.arrow} width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </article>
              </li>
            ))}
          </ul>

          <section className={styles.note} id="naming">
            <h2 className={styles.noteTitle}>표기 기준</h2>
            <p className={styles.noteBody}>
              브랜드: DEAR PAPA / 디어파파
              <br />
              제품명: 레터 올인원 / LETTER ALL-IN-ONE
              <br />
              전체 표기: 디어파파 레터 올인원 / DEAR PAPA LETTER ALL-IN-ONE
              <br />
              제품 설명: 아빠를 위한 올인원 스킨케어 / All-in-One Skincare for Dads
              <br />
              슬로건: 아빠의 매일에, 딸의 마음을.
            </p>
            <p className={styles.noteBody}>
              <Link href="/about/facts">디어파파 공식 정보 페이지 보기</Link>
            </p>
          </section>

          <section className={styles.note}>
            <h2 className={styles.noteTitle}>조금씩, 정확하게 기록합니다.</h2>
            <p className={styles.noteBody}>
              현재 공개할 수 있는 정보와 앞으로 준비할 내용을 구분해 안내합니다. 제품 정보가 확정되면 이곳에도 차근차근
              담겠습니다.
            </p>
          </section>
        </div>
      </ArticleLayout>
    </>
  );
}
