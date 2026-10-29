import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { FRAGRANCE_FREE_DESCRIPTION, FRAGRANCE_FREE_FAQ, FRAGRANCE_FREE_META_TITLE, FRAGRANCE_FREE_SUMMARY, dotDate, getJournalEntry } from '@/lib/journal';

// Ported verbatim from content/journal/guide-fragrance-alcohol-free-allinone-v2-2026-10-23.md (article body only; status and internal check notes omitted).

const entry = getJournalEntry('fragrance-alcohol-free-allinone');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: FRAGRANCE_FREE_META_TITLE },
  description: FRAGRANCE_FREE_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: FRAGRANCE_FREE_META_TITLE,
    description: FRAGRANCE_FREE_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function FragranceAlcoholFreeAllInOnePage() {
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
      toc={[
        { id: 'summary', label: '한 줄로 정리하면?' },
        ...FRAGRANCE_FREE_FAQ.map((item, i) => ({ id: `q-${i}`, label: item.q })),
        { id: 'preparing', label: '디어파파가 준비하고 있는 것' },
      ]}
      tocTitle="이 글에서 다루는 질문"
      footer={
        <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Link href="/journal">자료실 목록으로</Link>
          <Link href="/#letter">아빠에게 편지 쓰기</Link>
        </nav>
      }
    >
      <h2 id="summary">한 줄로 정리하면?</h2>
      <p>{FRAGRANCE_FREE_SUMMARY}</p>

      {FRAGRANCE_FREE_FAQ.map(({ q, points }, i) => (
        <section key={q}>
          <h2 id={`q-${i}`}>{q}</h2>
          <ul>
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2 id="preparing">디어파파가 준비하고 있는 것</h2>
      <p>제품 정보의 원본은 공식 정보 페이지입니다: <Link href="/about/facts">https://dearpapa.kr/about/facts</Link></p>
      <p>디어파파(DEAR PAPA)는 지금 디어파파 레터 올인원을 준비하고 있어요.</p>
      <ul>
        <li>「세안 후 하나로 마무리하는 남성 올인원 스킨케어」</li>
        <li>「디어파파는 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다.」</li>
        <li>「디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.」</li>
        <li>「디어파파는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.」</li>
        <li>「정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.」</li>
      </ul>
      <p>전성분이 공개되면 이 글의 방법대로 직접 확인하실 수 있도록 공식 정보 페이지에 올립니다.</p>

      <h2>참고</h2>
      <ul>
        <li>국가법령정보센터, <a href="https://www.law.go.kr/법령/화장품법시행규칙" rel="noopener">화장품법 시행규칙</a> (별표 4 화장품 포장의 표시기준 및 표시방법)</li>
        <li>식품의약품안전처, 화장품 전성분·착향제 알레르기 유발 성분 표시 안내: <a href="https://www.mfds.go.kr/brd/m_641/view.do?seq=32444" rel="noopener">화장품 향료 중 알레르기 유발물질 표시 지침</a></li>
        <li>AAD, Skin care tips for men: <a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men" rel="noopener">https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men</a></li>
      </ul>

      <p>
        <Link href="/#letter">아빠에게 편지 쓰기</Link> · 문의 <a href="mailto:hello@dearpapa.kr">hello@dearpapa.kr</a>
      </p>

      <RelatedLinks
        title="관련 글"
        links={[
          { href: '/journal/allinone-3-questions', label: '올인원 사기 전에 많이 묻는 3가지' },
          { href: '/journal/after-shave-gift', label: '면도 후 바르는 아빠 선물' },
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
