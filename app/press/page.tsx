import Link from 'next/link';
import { ArticleLayout } from '@/components/article/ArticleLayout';
import { preservedMetadata } from '@/lib/preserved-metadata';

export const metadata = preservedMetadata('/press');

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Links to articles written from DEAR PAPA-provided materials. Not independent press. */
const ARTICLES = [
  {
    date: '2026-10-24',
    dateKo: '2026년 10월 24일',
    href: 'https://authonnews.com/article/dear-papa-all-in-one-skincare-2',
    title: '디어파파는 어떤 브랜드인가: 아빠를 위한 올인원 스킨케어, 출시 준비 현황 | 디어파파 DEAR PAPA',
  },
  {
    date: '2026-10-23',
    dateKo: '2026년 10월 23일',
    lang: 'en' as const,
    href: 'https://authonnews.com/article/dear-papa-dads-all-in-one-skincare',
    title: 'DEAR PAPA cosmetics: a Korean all-in-one skincare brand for dads, official site dearpapa.kr | 디어파파 DEAR PAPA',
  },
  {
    date: '2026-10-22',
    dateKo: '2026년 10월 22일',
    href: 'https://authonnews.com/article/dear-papa-official-site',
    title: '디어파파 화장품 공식 홈페이지는 dearpapa.kr, 아빠를 위한 올인원 스킨케어 브랜드 | 디어파파 DEAR PAPA',
  },
  {
    date: '2026-10-21',
    dateKo: '2026년 10월 21일',
    href: 'https://authonnews.com/article/dear-papa-all-in-one-letter',
    title: '디어파파가 준비하는 아빠를 위한 올인원 스킨케어 | 디어파파 DEAR PAPA',
  },
  {
    date: '2026-10-19',
    dateKo: '2026년 10월 19일',
    href: 'https://authonnews.com/article/dear-papa-logo-story',
    title: '아빠 선물 DEAR PAPA(디어파파) 로고 이야기: d를 돌리면 p가 되는 딸과 아빠의 원',
  },
  {
    date: '2026-10-18',
    dateKo: '2026년 10월 18일',
    href: 'https://authonnews.com/article/dear-papa-dad-gift-skincare-letter',
    title: '아빠선물추천 고민이라면: 편지와 함께 건네는 DEAR PAPA(디어파파) 올인원 스킨케어',
  },
] as const;

export default function PressPage() {
  return (
    <>
      <ArticleLayout
        eyebrow="디어파파가 제공한 자료를 바탕으로 쓴 기사"
        title="디어파파가 제공한 자료를 바탕으로 쓴 기사"
        meta={
          <p>
            최종 업데이트: <time dateTime="2026-10-28">2026년 10월 28일</time>
          </p>
        }
        footer={
          <p>
            <Link href="/about/facts">DEAR&nbsp;PAPA(디어파파) 공식 정보</Link>
          </p>
        }
      >
        <p>
          아래는 디어파파가 제공한 자료를 바탕으로 쓴 기사 링크입니다. AUTHON은 디어파파와 별개 회사이며, 독립 언론 보도가 아닙니다.
        </p>
        <ul>
          {ARTICLES.map((article) => (
            <li key={article.href}>
              <time dateTime={article.date}>{article.dateKo}</time>
              {' · '}
              {'lang' in article && article.lang ? '영어 · ' : null}
              <a
                href={article.href}
                {...EXTERNAL}
                {...('lang' in article && article.lang ? { hrefLang: article.lang, lang: article.lang } : {})}
              >
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </ArticleLayout>
    </>
  );
}
