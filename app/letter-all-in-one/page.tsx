import Link from 'next/link';
import { ArticleLayout, RelatedLinks } from '@/components/article/ArticleLayout';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';

// Copied verbatim from the previous /letter-all-in-one page. Heading ids are kept for old #anchors.

export const metadata = pageMetadata({
  title: '우리가 준비하고 있는 것 | 디어파파 레터 올인원',
  description:
    '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다. 디어파파 레터 올인원은 선물과 편지를 함께 건네는 구조로 기획하고 만들고 있습니다. DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다.',
  path: '/letter-all-in-one',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dearpapa.kr/letter-all-in-one',
      url: 'https://dearpapa.kr/letter-all-in-one',
      name: '우리가 준비하고 있는 것',
      description:
        'DEAR PAPA는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다. 디어파파 레터 올인원은 선물과 편지를 함께 건네는 구조로 기획하고 만들고 있습니다.',
      inLanguage: 'ko-KR',
      datePublished: '2026-10-19',
      dateModified: '2026-10-19',
      isPartOf: {
        '@id': 'https://dearpapa.kr/#website',
      },
      publisher: {
        '@id': 'https://dearpapa.kr/#organization',
      },
      about: {
        '@id': 'https://dearpapa.kr/#product',
      },
      mainEntity: {
        '@id': 'https://dearpapa.kr/#product',
      },
      breadcrumb: {
        '@id': 'https://dearpapa.kr/letter-all-in-one#breadcrumb',
      },
      significantLink: ['https://dearpapa.kr/about/facts'],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://dearpapa.kr/letter-all-in-one#breadcrumb',
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
          name: '우리가 준비하고 있는 것',
          item: 'https://dearpapa.kr/letter-all-in-one',
        },
      ],
    },
    {
      '@type': 'Product',
      '@id': 'https://dearpapa.kr/#product',
      name: '디어파파 레터 올인원',
      alternateName: ['DEAR PAPA LETTER ALL-IN-ONE', '레터 올인원', 'LETTER ALL-IN-ONE', 'DEAR PAPA 레터 올인원'],
      brand: {
        '@id': 'https://dearpapa.kr/#brand',
      },
      category: '남성 올인원 스킨케어',
      description:
        '세안 후 하나로 마무리하는 남성 올인원 스킨케어. 디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부와 주름을 생각하며, 면도 후 바르는 올인원으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다. 세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을 담고, 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 가장 먼저 올립니다. 현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다. DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.',
      url: 'https://dearpapa.kr/letter-all-in-one',
      size: '150ml',
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: '용량(기획)',
          value: 150,
          unitCode: 'MLT',
          unitText: 'ml',
          description: 'DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다.',
        },
      ],
    },
  ],
};

export default function LetterAllInOnePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        eyebrow="THE PRODUCT"
        title="우리가 준비하고 있는 것"
        lead={<p>제품명: 디어파파 레터 올인원 / DEAR&nbsp;PAPA LETTER ALL-IN-ONE (출시 준비 중)</p>}
        meta={
          <p>
            최종 업데이트: <time dateTime="2026-10-19">2026년 10월 19일</time>
          </p>
        }
        footer={
          <p>
            <Link href="/journal/dad-gift-guide">아빠 선물 추천, 편지와 함께 건네는 스킨케어</Link>
          </p>
        }
      >
        <h2 id="after-shave">면도 후에 바르는 올인원</h2>
        <p>DEAR PAPA는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.</p>
        <p>세안 후 하나로 마무리하는 남성 올인원 스킨케어.</p>
        <p>
          디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부와 주름을 생각하며,
          면도 후 바르는 올인원으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로
          기획하고 만들고 있습니다. 세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을 담고, 미백·주름 개선
          2중 기능성화장품 심사를 준비하고 있습니다. 효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 가장 먼저
          올립니다.
        </p>

        <h2 id="gift-letter">선물과 편지</h2>
        <p>디어파파 레터 올인원은 선물과 편지를 함께 건네는 구조로 기획하고 만들고 있습니다.</p>
        <p>출시 후 계획: 사이트에서 쓴 편지를 인쇄한 카드에 담아 제품과 함께 건네는 선물을 기획하고 만들고 있습니다.</p>

        <h2 id="unboxing">상자를 여는 순서 (구상 중)</h2>
        <p>
          구상 중(출시 후 계획): 상자를 열면 편지 카드, 보틀, 사용 안내 순서로 보이는 선물 구성을 기획하고 있습니다.
        </p>

        <h2 id="container">용기</h2>
        <p>용기 디자인은 아직 정하지 않았고, 여러 시안을 기획하고 만들고 있습니다.</p>

        <h2 id="undecided">아직 정해지지 않은 정보</h2>
        <p>
          DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.
          정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.
        </p>
        <p>현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.</p>
        <p>효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 가장 먼저 올립니다.</p>

        <div id="see-also">
          <RelatedLinks
            title="함께 보기"
            links={[
              { href: '/about/facts#preparing', label: 'DEAR PAPA(디어파파) 공식 정보' },
              { href: '/#product', label: '홈: 제품 소개' },
              { href: '/#letter', label: '아빠에게 편지 쓰기' },
            ]}
          />
        </div>
      </ArticleLayout>
    </>
  );
}
