import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { CONTACT_EMAIL, FACTS_UPDATED, FACTS_UPDATED_KO, UNDECIDED } from '@/lib/facts';
import { dotDate } from '@/lib/journal';
import {
  MAKING_DESCRIPTION, MAKING_LOG, MAKING_META_TITLE, MAKING_MODIFIED, MAKING_NOT_YET, MAKING_PUBLISHED, MAKING_TITLE, MAKING_URL,
} from '@/lib/making';

// New page (not part of the preserved production snapshot). Every fact sentence comes from lib/facts.ts; see lib/making.ts.

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: MAKING_META_TITLE },
  description: MAKING_DESCRIPTION,
  alternates: { canonical: MAKING_URL },
  openGraph: {
    type: 'article',
    title: MAKING_META_TITLE,
    description: MAKING_DESCRIPTION,
    url: MAKING_URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function MakingPage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/about/facts', label: '디어파파 공식 정보' }]}
      eyebrow="만드는 기록"
      title={MAKING_TITLE}
      lead={<p>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.</p>}
      meta={
        <>
          <span>작성 · 디어파파</span>
          <span>
            발행 <time dateTime={MAKING_PUBLISHED}>{dotDate(MAKING_PUBLISHED)}</time>
          </span>
          <span>
            수정 <time dateTime={MAKING_MODIFIED}>{dotDate(MAKING_MODIFIED)}</time>
          </span>
        </>
      }
      footer={
        <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Link href="/about/facts">디어파파 공식 정보</Link>
          <Link href="/letter-all-in-one">우리가 준비하고 있는 것</Link>
        </nav>
      }
    >
      <h2 id="status">지금 상태</h2>
      <FactList
        rows={[
          ['출시 전', UNDECIDED.status],
          ['가격·전성분·출시일 미정', UNDECIDED.tbd],
        ]}
      />

      <p>
        디어파파가 사이트에 공개한 사실을 처음 올린 날짜 순으로 모았어요. 날짜는 dearpapa.kr에 처음 올린 날이고, 문장은 지금
        공식 정보 페이지에 있는 표현 그대로예요. 바뀌는 내용은 공식 정보 페이지를 먼저 고친 뒤 이 기록에 더합니다.
      </p>

      <h2 id="log">기록</h2>
      <ol style={{ listStyle: 'none', padding: 0 }}>
        {MAKING_LOG.map((entry) => (
          <li key={entry.date} id={`d-${entry.date}`}>
            <h3>
              <time dateTime={entry.date}>{dotDate(entry.date)}</time> · {entry.title}
            </h3>
            {entry.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {entry.rows && <FactList rows={entry.rows} />}
          </li>
        ))}
      </ol>

      <h2 id="not-yet">아직 정하지 않은 것</h2>
      {MAKING_NOT_YET.map((line) => (
        <p key={line}>{line}</p>
      ))}

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/about/facts', label: '디어파파 공식 정보' },
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
          { href: '/journal/development-principles', label: '매일 쓰는 제품을 준비하는 기준' },
          { href: '/#letter', label: '아빠에게 편지 쓰기' },
        ]}
      />

      <h2 id="official-info">공식 정보</h2>
      <FactList
        rows={[
          ['기준일', <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>],
          ['공식 사이트', <Link href="/about/facts">https://dearpapa.kr</Link>],
          ['문의', <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>],
          ['출시 상태', UNDECIDED.status],
          ['미정 항목', UNDECIDED.tbd],
        ]}
      />
    </ArticleLayout>
  );
}
