import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '@/components/article/ComparisonTable';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { DAD_SKINCARE_GIFT_TYPES_DESCRIPTION, DAD_SKINCARE_GIFT_TYPES_META_TITLE, dotDate, getJournalEntry } from '@/lib/journal';

// Ported from content/guide/guide-02-dad-skincare-gift-types-v6.md (붙여넣기용 본문 only; notes, hashtags omitted).
// Brand first mention changed to 「디어파파(DEAR PAPA)는」 and 「DEAR PAPA는 150ml…」 to 「디어파파는 150ml…」 per site copy rules.

const entry = getJournalEntry('dad-skincare-gift-types');
const URL = `https://dearpapa.kr${entry.href}`;
const AAD = 'https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men';

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_SKINCARE_GIFT_TYPES_META_TITLE },
  description: DAD_SKINCARE_GIFT_TYPES_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_SKINCARE_GIFT_TYPES_META_TITLE,
    description: DAD_SKINCARE_GIFT_TYPES_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

const ROWS = [
  ['스킨+로션 세트', '2단계 이상', '가벼운 로션이 든 세트인지 확인', '로션·크림의 보습감 확인', '향료가 없는 세트인지 전성분 확인', '제품마다 다름', '이미 스킨·로션을 챙겨 바르시는 아빠'],
  ['남자 올인원(로션·플루이드)', '1단계', '가벼운 제형인지 확인', '보습이 부족하면 크림을 더할 수 있는지 생각', '향료 유무를 전성분에서 확인', '제품마다 다름', '여러 단계를 번거로워하시는 아빠, 세안 후 빨리 마무리하고 싶은 아빠'],
  ['선크림', '기본 관리 마지막 1단계 추가', '산뜻한 제형인지 확인', '보습감 있는 제형인지 확인', '향료 유무 확인', '제품마다 다름', '등산·골프·출퇴근 등 바깥 활동이 많은 아빠'],
  ['면도 후 제품(애프터셰이브 등)', '면도 후 1단계', '제형 확인', '면도 후 보습을 함께 챙길 수 있는지 확인', '향료·알코올 포함 여부를 전성분에서 확인', '향이 있는 제품이 많은 편이라 꼭 확인', '매일 면도하시는 아빠'],
  ['크림 단품', '마지막 1단계 추가', '무거울 수 있어 제형 확인', '보습을 더하고 싶을 때', '향료 유무 확인', '제품마다 다름', '이미 쓰는 제품에 보습만 더하고 싶은 아빠'],
];
const HEAD = ['선물 종류', '사용 단계 수', '지성(번들거리는 편)', '건성(쉽게 당기는 편)', '민감(쉽게 따갑거나 화끈한 편)', '향', '이런 아빠께'];

export default function DadSkincareGiftTypesPage() {
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
      <p>
        아빠 선물 추천 화장품을 찾고 계신다면, 결론부터 말씀드릴게요. 아빠가 평소 몇 단계를 바르시는지, 피부가 번들거리는 편인지 당기는 편인지, 향을 좋아하시는지 세 가지만 먼저 확인하면 선물 종류가 거의 정해져요. 바르는 걸 번거로워하시는 아빠께는 단계가 적은 올인원, 이미 스킨과 로션을 챙겨 쓰시는 아빠께는 스킨+로션 세트, 바깥 활동이 많은 아빠께는 선크림, 매일 면도하시는 아빠께는 면도 후 제품이나 면도 후에 바르는 올인원이 잘 맞는 출발점이에요. 아빠 생일선물 화장품이든 4060 아빠 선물 스킨케어든, 아래 비교표와 체크리스트로 한 번에 고를 수 있어요.
      </p>

      <h2>아빠 스킨케어 선물 종류별 비교표</h2>
      <p>제품마다 성분과 제형이 달라서, 아래 표는 종류별로 일반적인 차이와 고를 때 볼 점만 정리했어요. 특정 제품의 효과를 비교한 표는 아니에요.</p>
      <ComparisonTable label="아빠 스킨케어 선물 종류별 비교표">
        <table>
          <thead>
            <tr>
              {HEAD.map((h) => (
                <th key={h} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r[0]}>
                <th scope="row">{r[0]}</th>
                {r.slice(1).map((c, i) => (
                  <td key={i}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ComparisonTable>

      <h2>아빠 선물 화장품, 고르기 전에 확인할 것</h2>
      <ul>
        <li><strong>피부 타입:</strong> 번들거리는 편(지성), 쉽게 당기는 편(건성), 바른 뒤 따갑거나 화끈한 편(민감), 부위마다 다른 편(복합) 중 어디에 가까운지 떠올려 보세요.</li>
        <li><strong>향 취향:</strong> 향이 있는 제품을 좋아하시는지, 부담스러워하시는지 확인하세요.</li>
        <li><strong>전성분 확인:</strong> 전성분이 공개된 제품이라면 미리 읽어 보고, 향료나 알코올처럼 아빠가 피하고 싶은 성분이 있는지 보세요.</li>
        <li><strong>용량:</strong> 매일 쓰는 제품이라면 용량과 대략 얼마나 쓰실지도 함께 보세요.</li>
        <li><strong>사용 습관:</strong> 지금 몇 단계를 바르시는지, 면도는 얼마나 자주 하시는지, 바깥 활동이 많은지 생각해 보세요.</li>
        <li><strong>처음 쓰는 제품:</strong> 조금만 먼저 발라 보시라고 함께 말씀드리면 좋아요.</li>
      </ul>

      <h2>피부과 전문의 단체가 권하는 기본 관리</h2>
      <p>미국피부과학회(AAD)는 남성 피부 관리 안내에서 다음을 권해요.</p>
      <ul>
        <li>피부 타입을 먼저 알아 두는 것이 좋아요. AAD는 민감 피부는 제품을 바른 뒤 따갑거나 화끈할 수 있고, 건성은 각질이 일거나 가렵고 거칠며, 지성은 번들거리고 기름지다고 설명해요.</li>
        <li>민감 피부라면 순한 「fragrance free(향료 무첨가)」 제품을 쓰라고 권해요. 「unscented(향 없음)」라고만 적힌 제품에는 냄새를 가리는 향료가 들어 있을 수 있어 주의하라고 안내해요.</li>
        <li>보습제는 매일, 씻거나 면도한 직후 피부가 아직 촉촉할 때 바르라고 권해요.</li>
        <li>바깥에 나갈 때는 SPF 30 이상의 자외선 차단 범위가 넓은(broad-spectrum) 내수성 선크림을 바르고, 2시간마다 또는 땀을 흘린 뒤 다시 바르라고 권해요.</li>
      </ul>
      <p>
        출처: <a href={AAD} rel="noopener">American Academy of Dermatology, 「Skin care tips for men」</a>
      </p>
      <p>피부에 계속 불편함이 있다면 피부과 전문의와 상담해 주세요.</p>

      <h2>선물 종류는 아빠의 하루로 고르면 쉬워요</h2>
      <p>아빠의 하루를 떠올리면 선물 종류를 고르기 쉬워요.</p>
      <ul>
        <li>아침에 세안하고 바로 나가시는 아빠: 단계가 적은 올인원</li>
        <li>스킨·로션 순서가 익숙한 아빠: 쓰던 단계에 맞춘 스킨+로션 세트</li>
        <li>주말마다 밖에 계시는 아빠: 선크림</li>
        <li>매일 아침 면도하시는 아빠: 면도 후 제품, 또는 면도 후에 바르는 올인원</li>
      </ul>
      <p>어떤 종류를 고르든, 짧은 편지 한 줄을 곁들이면 선물이 더 오래 기억돼요.</p>

      <h2>디어파파는 어떤 제품을 준비하고 있나요?</h2>
      <p>디어파파(DEAR PAPA)는 아빠를 위한 남성 올인원 스킨케어 브랜드예요. 딸이 쓴 한 줄 편지와 함께 아빠께 건네는 선물을 만들고 있고, 지금은 출시 준비 중이에요.</p>
      <ul>
        <li>「세안 후 하나로 마무리하는 남성 올인원 스킨케어」</li>
        <li>준비 중인 제품 이름은 디어파파 레터 올인원이에요.</li>
        <li>「디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.」</li>
        <li>「변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다.」</li>
        <li>「디어파파는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.」</li>
        <li>현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.</li>
        <li>사이트에서 아빠에게 보낼 편지를 쓰고 카드 이미지(PNG)로 저장할 수 있습니다. 작성한 편지는 이 기기의 브라우저에만 보관되며 서버로 전송하지 않습니다.</li>
        <li>출시 후 계획: 사이트에서 쓴 편지를 인쇄한 카드에 담아 제품과 함께 건네는 선물을 기획하고 만들고 있습니다.</li>
      </ul>
      <p>&quot;아빠의 매일에, 딸의 마음을.&quot;</p>
      <p>이 글은 디어파파가 직접 쓴 브랜드 글이며, 글을 정리할 때 생성형 AI의 도움을 받았습니다.</p>
      <p>
        출처: <Link href="/about/facts">디어파파 공식 정보</Link>
      </p>

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
          { href: '/journal/dad-allinone-how-to-choose', label: '4060 아빠 올인원 고르는 법, 피부 타입·향료·단계 수로 보는 기준' },
          { href: '/journal/dad-gift-skincare-guide', label: '아빠 선물 화장품, 생신 선물 스킨케어 고르는 기준 7가지' },
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
