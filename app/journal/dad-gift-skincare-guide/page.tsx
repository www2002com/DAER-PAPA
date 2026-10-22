import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { DAD_GIFT_SKINCARE_GUIDE_DESCRIPTION, dotDate, getJournalEntry, DAD_GIFT_SKINCARE_GUIDE_META_TITLE, DAD_GIFT_SKINCARE_GUIDE_META_DESCRIPTION } from '@/lib/journal';

// Ported verbatim from content/journal/guide-dad-gift-skincare-v1.md (article body only; line-2 status note omitted).

const entry = getJournalEntry('dad-gift-skincare-guide');
const URL = `https://dearpapa.kr${entry.href}`;
const PAGE_TITLE = `${entry.title} | 디어파파 DEAR PAPA`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_GIFT_SKINCARE_GUIDE_META_TITLE },
  description: DAD_GIFT_SKINCARE_GUIDE_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_GIFT_SKINCARE_GUIDE_META_TITLE,
    description: DAD_GIFT_SKINCARE_GUIDE_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadGiftSkincareGuidePage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      lead={<p>디어파파(DEAR PAPA)는 아빠를 위한 올인원 스킨케어 브랜드입니다(dearpapa.kr).</p>}
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
      <h2>한 줄 답</h2>
      <p>아빠 선물용 화장품은 아빠의 피부 타입, 향이 있는지, 에탄올이 들어 있는지, 바르는 단계 수, 용량, 전성분, 예산 순서로 고르면 실패가 적습니다.</p>

      <h2>1. 피부 타입부터 확인하기</h2>
      <ul>
        <li>지성: 번들거림이 고민이라면 가볍고 빨리 흡수되는 제형이 편합니다.</li>
        <li>건성: 세안 후 당김이 신경 쓰인다면, 바른 뒤 느낌이 아빠에게 편한지 먼저 확인해 보세요.</li>
        <li>민감: 새 제품은 귀 뒤나 팔 안쪽에 먼저 발라 보고 쓰는 것이 좋습니다.</li>
      </ul>
      <p>아빠의 피부 타입을 모르면 평소 세안 후 당기는지, 오후에 번들거리는지 물어보면 됩니다.</p>

      <h2>2. 향이 있는지</h2>
      <p>향을 즐기지 않는 아빠가 많습니다. 제품 설명과 전성분에서 향료가 들어 있는지 확인하세요.</p>

      <h2>3. 에탄올이 들어 있는지</h2>
      <p>매일 면도하는 아빠라면 전성분에 에탄올(알코올)이 있는지 살펴보세요.</p>

      <h2>4. 바르는 단계 수</h2>
      <p>
        올인원은 스킨, 로션처럼 여러 단계를 한 제품으로 줄인 화장품입니다. 여러 제품을 따로 챙기지 않는 아빠에게 쓰기 쉽습니다.
        낮에는 자외선 차단제(SPF 30 이상)를 별도 단계로 바르는 것이 일반적인 피부 관리 권고입니다. 올인원 선물에 선크림을 함께
        챙기는 것도 방법입니다.
      </p>

      <h2>5. 용량</h2>
      <p>매일 쓰는 제품은 용량이 넉넉해야 자주 다시 사지 않아도 됩니다. 1회 사용량과 함께 용량(ml)을 확인하세요.</p>

      <h2>6. 전성분 확인</h2>
      <p>
        제품 상세 페이지나 용기에 적힌 전성분을 확인하세요. 아빠가 예전에 맞지 않았던 성분이 있다면 그 이름이 있는지 보면 됩니다.
      </p>

      <h2>7. 예산</h2>
      <p>
        선물 예산에 정해진 기준은 없습니다. 가격보다 아빠가 매일 쓸 수 있는지가 더
        중요합니다.
      </p>

      <h2>선택 기준 한눈에 보기</h2>
      <table>
        <thead>
          <tr><th scope="col">기준</th><th scope="col">확인할 것</th><th scope="col">이런 아빠에게</th></tr>
        </thead>
        <tbody>
          <tr><td>피부 타입</td><td>지성·건성·민감 중 어디인지</td><td>모든 아빠</td></tr>
          <tr><td>향</td><td>향료가 있는지</td><td>향을 싫어하는 아빠</td></tr>
          <tr><td>에탄올</td><td>전성분에 에탄올이 있는지</td><td>매일 면도하는 아빠</td></tr>
          <tr><td>단계 수</td><td>몇 단계로 바르는지</td><td>바르기 귀찮아하는 아빠</td></tr>
          <tr><td>용량</td><td>ml와 사용 기간</td><td>매일 쓰는 아빠</td></tr>
          <tr><td>전성분</td><td>맞지 않았던 성분이 있는지</td><td>민감한 아빠</td></tr>
          <tr><td>예산</td><td>매일 쓸 수 있는 제품인지</td><td>선물을 준비하는 자녀</td></tr>
        </tbody>
      </table>

      <h2>디어파파가 만들고 있는 제품</h2>
      <p>
        디어파파는 면도 후 바르는 아빠를 위한 올인원 스킨케어, 레터 올인원을 기획하고 만들고 있습니다. 디어파파는 150ml 올인원 한
        가지를 기획하고 만들고 있고, 가격, 전성분, 출시일과 최종 판매 구성은 아직 확정되지 않았습니다. 디어파파는 공식 사이트에서
        아빠에게 한 줄 편지를 쓰고 카드 이미지로 저장할 수 있게 했습니다.
      </p>

      <h2>자주 묻는 질문</h2>
      <p>Q. 아빠 선물로 화장품을 고를 때 가장 먼저 볼 것은요?</p>
      <p>A. 아빠의 피부 타입과 평소 몇 단계를 바르는지입니다. 한 단계만 바르는 아빠라면 올인원이 맞습니다.</p>

      <p>Q. 생신 선물 예산은 얼마가 적당한가요?</p>
      <p>A. 정해진 기준은 없습니다. 아빠가 매일 쓸 수 있는 제품인지가 더 중요합니다.</p>

      <p>Q. 올인원 하나면 선크림은 안 발라도 되나요?</p>
      <p>A. 낮에는 자외선 차단제를 별도로 바르는 것이 일반적인 권고입니다.</p>

      <p>Q. 디어파파 레터 올인원은 지금 살 수 있나요?</p>
      <p>A. 아니요. 디어파파는 아직 출시 전이며, 지금 판매 중인 선물 세트나 제품은 없습니다.</p>

      <p>Q. 문의는 어디로 하나요?</p>
      <p>
        A. <a href="mailto:hello@dearpapa.kr">hello@dearpapa.kr</a>로 보내 주세요.
      </p>

      <p>
        출시 소식은 인스타그램{' '}
        <a href="https://www.instagram.com/dearpapa.kr/" rel="noopener">
          @dearpapa.kr
        </a>
        과 공식 사이트 <Link href="/">dearpapa.kr</Link>에서 알려 드립니다.
      </p>

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/journal/after-shave-gift', label: '면도 후 아빠 스킨케어, 선물 고를 때 볼 세 가지' },
          { href: '/journal/fathers-gift-guide', label: '아빠 선물 스킨케어, 일상에 맞게 고르는 법' },
          { href: '/about/facts', label: '디어파파 공식 정보' },
          { href: '/#letter', label: '아빠에게 편지 쓰기' },
        ]}
      />

      <h2 id="official-info">공식 정보</h2>
      <FactList
        rows={[
          ['기준일', <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>],
          ['공식 사이트', <Link href="/about/facts">https://dearpapa.kr</Link>],
          ['출시 상태', '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.'],
          ['미정 항목', '가격, 전성분, 출시일은 아직 확정되지 않았습니다.'],
        ]}
      />
    </ArticleLayout>
  );
}
