import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { ALLINONE_3_QUESTIONS_DESCRIPTION, ALLINONE_3_QUESTIONS_FAQ, ALLINONE_3_QUESTIONS_META_TITLE, dotDate, getJournalEntry } from '@/lib/journal';

// Ported verbatim from content/journal/guide-allinone-3questions-v2-2026-10-23.md (article body only; status, version and check notes omitted).

const entry = getJournalEntry('allinone-3-questions');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: ALLINONE_3_QUESTIONS_META_TITLE },
  description: ALLINONE_3_QUESTIONS_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: ALLINONE_3_QUESTIONS_META_TITLE,
    description: ALLINONE_3_QUESTIONS_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function AllInOneThreeQuestionsPage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      meta={
        <>
          <span>작성 · 디어파파</span>
          <span>
            발행 <time dateTime={entry.published}>{dotDate(entry.published)}</time>
          </span>
          <span>
            수정 <time dateTime={entry.modified}>{dotDate(entry.modified)}</time>
          </span>
        </>
      }
      footer={
        <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Link href="/journal">자료실 목록으로</Link>
          <Link href="/#letter">아빠에게 편지 쓰기</Link>
        </nav>
      }
    >
      <h2>한 줄로 정리하면?</h2>
      <p>{ALLINONE_3_QUESTIONS_DESCRIPTION}</p>

      {ALLINONE_3_QUESTIONS_FAQ.map(({ q, points }) => (
        <section key={q}>
          <h2>{q}</h2>
          <ul>
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>디어파파가 준비하고 있는 것</h2>
      <p>디어파파(DEAR PAPA)는 지금 디어파파 레터 올인원을 준비하고 있어요.</p>
      <ul>
        <li>「세안 후 하나로 마무리하는 남성 올인원 스킨케어」</li>
        <li>「디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.」</li>
        <li>「변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다.」</li>
        <li>「디어파파는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.」</li>
      </ul>
      <p>보습 지속 시간과 사용감은 아직 확인되지 않았습니다. 확인되면 <Link href="/about/facts">공식 정보 페이지</Link>에 올립니다.</p>

      <h2>참고</h2>
      <ul>
        <li><a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men" rel="noopener">AAD, Skin care tips for men</a></li>
        <li><a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-in-your-40s-and-50s" rel="noopener">AAD, Skin care in your 40s and 50s</a></li>
        <li><a href="https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/selecting-anti-aging-products" rel="noopener">AAD, Selecting anti-aging products</a></li>
      </ul>

      <p>
        <Link href="/#letter">아빠에게 편지 쓰기</Link> · 문의 <a href="mailto:hello@dearpapa.kr">hello@dearpapa.kr</a>
      </p>

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
          { href: '/journal/dad-allinone-how-to-choose', label: '40~60대 아빠 올인원 고르는 법, 피부 타입·향료·단계 수로 보는 기준' },
          { href: '/journal/after-shave-gift', label: '면도 후 아빠 스킨케어, 선물 고를 때 볼 세 가지' },
          { href: '/about/facts', label: '디어파파 공식 정보' },
        ]}
      />

      <h2 id="official-info">공식 정보</h2>
      <FactList
        rows={[
          ['기준일', <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>],
          ['공식 사이트', <Link href="/about/facts">https://dearpapa.kr</Link>],
          ['출시 상태', '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.'],
          ['미정 항목', '전성분, 가격, 출시일, 판매처는 아직 확정되지 않았습니다.'],
        ]}
      />
    </ArticleLayout>
  );
}
