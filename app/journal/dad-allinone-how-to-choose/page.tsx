import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ComparisonTable } from '@/components/article/ComparisonTable';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION, DAD_ALLINONE_HOW_TO_CHOOSE_FAQ, dotDate, getJournalEntry, DAD_ALLINONE_HOW_TO_CHOOSE_META_TITLE, DAD_ALLINONE_HOW_TO_CHOOSE_META_DESCRIPTION } from '@/lib/journal';

// Ported from content/journal/guide-dad-allinone-how-to-choose-v1.md; FAQ Q&A and FAQPage JSON-LD share DAD_ALLINONE_HOW_TO_CHOOSE_FAQ.

const entry = getJournalEntry('dad-allinone-how-to-choose');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_ALLINONE_HOW_TO_CHOOSE_META_TITLE },
  description: DAD_ALLINONE_HOW_TO_CHOOSE_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_ALLINONE_HOW_TO_CHOOSE_META_TITLE,
    description: DAD_ALLINONE_HOW_TO_CHOOSE_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadAllInOneHowToChoosePage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      lead={<p>디어파파가 보는 아빠 올인원 스킨케어 선물 고르는 순서는 피부 타입, 향료, 에탄올, 단계 수, 면도 후 쓰기 편한지예요. 디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어로, 출시 전이에요.</p>}
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
      <p>{DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION}</p>

      {DAD_ALLINONE_HOW_TO_CHOOSE_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </section>
      ))}

      <h2>제품 유형 비교</h2>
      <p>올인원·스킨·에센스·크림·애프터셰이브의 일반적인 차이를 정리했어요. 특정 제품이나 다른 브랜드를 비교한 표가 아니에요.</p>
      <ComparisonTable label="아빠 올인원 선택 기준 비교표">
      <table>
        <thead>
          <tr><th scope="col">제품 유형</th><th scope="col">바르는 단계 수</th><th scope="col">주로 바르는 시점</th><th scope="col">이런 아빠에게</th></tr>
        </thead>
        <tbody>
          <tr><td>올인원</td><td>1단계</td><td>세안 후, 면도 후</td><td>한 가지만 바르고 싶은 아빠</td></tr>
          <tr><td>스킨</td><td>여러 단계 중 첫 단계</td><td>세안 직후</td><td>단계별로 나눠 바르는 데 익숙한 아빠</td></tr>
          <tr><td>에센스·크림</td><td>스킨 다음 단계</td><td>스킨을 바른 뒤</td><td>단계를 나눠 쓰는 아빠</td></tr>
          <tr><td>애프터셰이브</td><td>면도 후 단계</td><td>면도 직후</td><td>면도 후 바르는 제품을 따로 두는 아빠</td></tr>
        </tbody>
      </table>
      </ComparisonTable>

      <ProductBox />

      <h2>이런 분께 맞아요</h2>
      <ul>
        <li>세안 후 하나로 마무리하고 싶은 4060 아빠</li>
        <li>면도 후 바르는 한 단계를 원하는 아빠</li>
        <li>스킨케어를 이제 시작하려는 아빠</li>
        <li>향료가 들어 있는지를 먼저 보는 아빠</li>
        <li>아빠께 매일 쓰는 선물과 한 줄 편지를 함께 건네고 싶은 딸·아들·가족</li>
      </ul>

      <h2>디어파파가 만들고 있는 레터 올인원</h2>
      <p>
        디어파파는 면도 후 바르는 올인원, 레터 올인원을 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다. 디어파파는 150ml 올인원
        한 가지를 기획하고 만들고 있으며, 변성알코올(에탄올)을 넣지 않고 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다. 공식
        사이트에서는 아빠에게 한 줄 편지를 쓰고 카드 이미지로 저장할 수 있습니다.
      </p>
      <p>전성분, 가격, 출시일, 판매처는 아직 확정되지 않았습니다.</p>

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
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
          { href: '/journal/dad-gift-skincare-guide', label: '아빠 스킨케어 선물, 디어파파가 정리한 고르는 기준은?' },
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
          ['출시 상태', '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.'],
          ['미정 항목', '전성분, 가격, 출시일, 판매처는 아직 확정되지 않았습니다.'],
        ]}
      />
    </ArticleLayout>
  );
}
