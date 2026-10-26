import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO, UNDECIDED } from '@/lib/facts';
import { dotDate } from '@/lib/journal';
import {
  WHEN_TO_USE_DESCRIPTION, WHEN_TO_USE_GIFTS, WHEN_TO_USE_META_TITLE, WHEN_TO_USE_MODIFIED, WHEN_TO_USE_PUBLISHED,
  WHEN_TO_USE_SCENES, WHEN_TO_USE_TITLE, WHEN_TO_USE_URL, type QA,
} from '@/lib/when-to-use';

// New page (not part of the preserved production snapshot). Every answer reuses live wording; see lib/when-to-use.ts.

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: WHEN_TO_USE_META_TITLE },
  description: WHEN_TO_USE_DESCRIPTION,
  alternates: { canonical: WHEN_TO_USE_URL },
  openGraph: {
    type: 'article',
    title: WHEN_TO_USE_META_TITLE,
    description: WHEN_TO_USE_DESCRIPTION,
    url: WHEN_TO_USE_URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

function QAList({ items }: { items: QA[] }) {
  return (
    <>
      {items.map(({ q, a }) => (
        <div key={q}>
          <h3>{q}</h3>
          <p>{a}</p>
        </div>
      ))}
    </>
  );
}

export default function WhenToUsePage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' }]}
      eyebrow="사용 장면"
      title={WHEN_TO_USE_TITLE}
      lead={<p>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.</p>}
      meta={
        <>
          <span>작성 · 디어파파</span>
          <span>
            발행 <time dateTime={WHEN_TO_USE_PUBLISHED}>{dotDate(WHEN_TO_USE_PUBLISHED)}</time>
          </span>
          <span>
            수정 <time dateTime={WHEN_TO_USE_MODIFIED}>{dotDate(WHEN_TO_USE_MODIFIED)}</time>
          </span>
        </>
      }
      footer={
        <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Link href="/letter-all-in-one">우리가 준비하고 있는 것</Link>
          <Link href="/#letter">아빠에게 편지 쓰기</Link>
        </nav>
      }
    >
      <p>
        디어파파의 공식 사용 장면은 「세안 후 하나로 마무리」와 「면도 후 바르는」 두 가지예요. 아래 답은 공식 정보 페이지와
        제품 페이지에 올린 문장을 그대로 옮겼어요.
      </p>

      <h2 id="scenes">언제 바르나요</h2>
      <QAList items={WHEN_TO_USE_SCENES} />

      <h2 id="gift-days">언제 건네나요: 생신, 어버이날, 명절</h2>
      <QAList items={WHEN_TO_USE_GIFTS} />

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
          { href: '/journal/after-shave-gift', label: '면도 후 아빠 스킨케어, 선물 고를 때 볼 세 가지' },
          { href: '/about/facts', label: '디어파파 공식 정보' },
          { href: '/#letter', label: '아빠에게 편지 쓰기' },
        ]}
      />

      <h2 id="official-info">공식 정보</h2>
      <FactList
        rows={[
          ['기준일', <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>],
          ['공식 사이트', <Link href="/about/facts">https://dearpapa.kr</Link>],
          ['출시 상태', UNDECIDED.status],
          ['미정 항목', UNDECIDED.tbd],
        ]}
      />
    </ArticleLayout>
  );
}
