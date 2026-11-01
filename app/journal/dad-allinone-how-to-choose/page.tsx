import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ComparisonTable } from '@/components/article/ComparisonTable';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION, DAD_ALLINONE_HOW_TO_CHOOSE_FAQ, dotDate, getJournalEntry, DAD_ALLINONE_HOW_TO_CHOOSE_META_TITLE, DAD_ALLINONE_HOW_TO_CHOOSE_META_DESCRIPTION } from '@/lib/journal';

// Ported from content/journal/journal-dad-allinone-how-to-choose-2026-update-v1-2026-11-02.md (Sun-ny approved).

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
      <p>2026년 11월 2일 업데이트</p>
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

      <h2>선물로 줄 올인원, 어떤 기준으로 고를까요?</h2>
      <p>
        선물로 줄 올인원은 피부 타입·향·용량·편지를 순서대로 보면 고르기 쉬워요. 아래 표에 확인할 점과 확인 방법을 정리했고, 디어파파 칸은
        출시 전 상태예요.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">기준</th>
            <th scope="col">확인할 점</th>
            <th scope="col">어떻게 확인하나</th>
            <th scope="col">디어파파(출시 전)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>피부 타입(지성·건성·민감)</td>
            <td>지성·건성·민감 중 아빠 피부에 맞는지</td>
            <td>세안 후 당김·오후 번들거림을 물어보고, 민감하면 귀 뒤·팔 안쪽에 먼저 조금 발라 보기</td>
            <td>미정</td>
          </tr>
          <tr>
            <td>향</td>
            <td>향료가 들어 있는지, 아빠가 향을 즐기는지</td>
            <td>제품 설명·전성분에 「향료」가 있는지 보고, 가능하면 매장·샘플로 냄새 확인</td>
            <td>출시 전 확인</td>
          </tr>
          <tr>
            <td>용량</td>
            <td>선물로 주기 적당한 용량인지</td>
            <td>판매처·용기 표기 용량을 확인</td>
            <td>용량·전성분·가격 미정</td>
          </tr>
          <tr>
            <td>편지</td>
            <td>한 줄 마음을 같이 건넬 수 있는지</td>
            <td>사이트에서 미리보기·PNG 저장이 되는지 확인</td>
            <td>
              편지는 지금 사이트에서 미리보기와 PNG 저장을 할 수 있고, 제품에 담는 방식은 출시 전에 정해요.{' '}
              <Link href="/#letter">한 줄 편지</Link>
            </td>
          </tr>
        </tbody>
      </table>
      <p>누구에게 맞나요? 디어파파는 여러 단계를 번거로워하는 4060 아빠에게 맞는 올인원이에요.</p>

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
