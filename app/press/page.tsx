import Link from 'next/link';
import { ArticleLayout } from '@/components/article/ArticleLayout';
import { preservedMetadata } from '@/lib/preserved-metadata';

// Copied verbatim from the previous /press page.

export const metadata = preservedMetadata('/press');


const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function PressPage() {
  return (
    <>
      <ArticleLayout
        eyebrow="PRESS"
        title="DEAR PAPA(디어파파) 소개 기사"
        meta={
          <p>
            최종 업데이트: <time dateTime="2026-10-23">2026년 10월 23일</time>
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
            <time dateTime="2026-10-23">2026년 10월 23일</time> · AUTHON · 영어 ·{' '}
            <a href="https://authonnews.com/article/dear-papa-dads-all-in-one-skincare" hrefLang="en" lang="en" {...EXTERNAL}>
              DEAR PAPA cosmetics: a Korean all-in-one skincare brand for dads, official site dearpapa.kr | 디어파파 DEAR PAPA
            </a>
          </li>
          <li>
            <time dateTime="2026-10-22">2026년 10월 22일</time> · AUTHON ·{' '}
            <a href="https://authonnews.com/article/dear-papa-official-site" {...EXTERNAL}>
              디어파파 화장품 공식 홈페이지는 dearpapa.kr, 아빠를 위한 올인원 스킨케어 브랜드 | 디어파파 DEAR PAPA
            </a>
          </li>
          <li>
            <time dateTime="2026-10-21">2026년 10월 21일</time> · AUTHON ·{' '}
            <a href="https://authonnews.com/article/dear-papa-all-in-one-letter" {...EXTERNAL}>
              디어파파가 준비하는 아빠를 위한 올인원 스킨케어 | 디어파파 DEAR PAPA
            </a>
          </li>
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
