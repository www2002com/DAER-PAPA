import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION, DAD_ALLINONE_HOW_TO_CHOOSE_FAQ, dotDate, getJournalEntry } from '@/lib/journal';

// Ported verbatim from content/journal/guide-dad-allinone-how-to-choose-v1.md (article body only; line-2 status note omitted).

const entry = getJournalEntry('dad-allinone-how-to-choose');
const URL = `https://dearpapa.kr${entry.href}`;
const PAGE_TITLE = `${entry.title} | 디어파파 DEAR PAPA`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: PAGE_TITLE },
  description: DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: entry.title,
    description: DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION,
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
      lead={<p>디어파파(DEAR PAPA)는 딸의 한 줄 편지와 함께 건네는 아빠를 위한 올인원 스킨케어 브랜드입니다(dearpapa.kr).</p>}
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

      <h2>남자 올인원은 무엇인가요?</h2>
      <p>남자 올인원은 스킨과 로션처럼 따로 바르던 여러 단계를 한 제품으로 줄인 화장품입니다. 세안 후 한 가지만 바르면 되기 때문에, 여러 병을 챙기지 않는 아빠도 매일 쓰기 쉽습니다.</p>

      <h2>피부 타입별로 어떻게 고르나요?</h2>
      <p>피부 타입은 효능보다 「바른 뒤 느낌이 아빠에게 편한지」를 기준으로 고르면 됩니다.</p>
      <ul>
        <li>지성: 오후에 번들거림이 신경 쓰인다면, 가볍고 빨리 스며드는 제형인지 확인해 보세요.</li>
        <li>건성: 세안 후 당김이 신경 쓰인다면, 바른 뒤 느낌이 아빠에게 편한지 먼저 확인해 보세요.</li>
        <li>민감: 새 제품은 귀 뒤나 팔 안쪽에 먼저 조금 발라 보고 얼굴에 쓰는 것이 좋습니다.</li>
      </ul>
      <p>피부 타입을 모르겠다면 아빠께 「세안하고 나면 당기세요, 오후에 번들거리세요?」라고 물어보세요.</p>

      <h2>향이 없는 올인원을 찾으려면 무엇을 보나요?</h2>
      <p>무향 제품을 찾는다면 제품 설명과 전성분에 「향료」가 적혀 있는지부터 확인하세요. 향을 즐기지 않는 아빠나, 다른 향 제품을 함께 쓰는 아빠에게 특히 중요한 기준입니다.</p>

      <h2>전성분은 어떻게 확인하나요?</h2>
      <p>전성분은 제품 상세 페이지나 용기 뒷면에서 확인하고, 다음 세 가지를 보면 됩니다.</p>
      <ol>
        <li>향료가 들어 있는지</li>
        <li>에탄올(변성알코올)이 들어 있는지</li>
        <li>아빠가 예전에 맞지 않았던 성분 이름이 있는지</li>
      </ol>

      <h2>올인원은 몇 단계로 바르나요?</h2>
      <p>올인원은 한 단계로 바릅니다. 순서는 씻고, 적당량을 손에 덜고, 얼굴 전체에 펴 바르는 것이 전부입니다. 낮에는 자외선 차단제를 별도 단계로 바르는 것이 일반적인 피부 관리 권고입니다.</p>

      <h2>면도 후에도 올인원 하나면 되나요?</h2>
      <p>면도 후 한 가지만 바르고 싶은 아빠라면, 면도 후에 바르는 용도로 만든 올인원인지 확인하면 됩니다. 매일 면도한다면 전성분에서 에탄올이 들어 있는지도 함께 보세요.</p>

      <h2>세안 후 하나로 마무리하고 싶다면요?</h2>
      <p>세안 후 하나로 마무리하고 싶다면 스킨·로션을 따로 바르지 않아도 되는 올인원을 고르면 됩니다. 아침에 준비 시간이 짧은 아빠, 욕실 선반을 간단하게 두고 싶은 아빠에게 맞는 방식입니다.</p>

      <h2>올인원과 스킨·로션·애프터셰이브는 어떻게 다른가요?</h2>
      <p>가장 큰 차이는 바르는 단계 수와 바르는 시점입니다.</p>
      <table>
        <thead>
          <tr><th scope="col">제품 유형</th><th scope="col">바르는 단계 수</th><th scope="col">주로 바르는 시점</th><th scope="col">이런 아빠에게</th></tr>
        </thead>
        <tbody>
          <tr><td>올인원</td><td>1단계</td><td>세안 후, 면도 후</td><td>한 가지만 바르고 싶은 아빠</td></tr>
          <tr><td>스킨</td><td>여러 단계 중 첫 단계</td><td>세안 후 가장 먼저</td><td>단계별로 나눠 바르는 데 익숙한 아빠</td></tr>
          <tr><td>로션</td><td>스킨 다음 단계</td><td>스킨을 바른 뒤</td><td>스킨과 함께 쓰는 아빠</td></tr>
          <tr><td>애프터셰이브</td><td>면도 후 단계</td><td>면도 직후</td><td>면도 후 바르는 제품을 따로 두는 아빠</td></tr>
        </tbody>
      </table>

      <h2>이런 분께 맞아요</h2>
      <ul>
        <li>세안 후 하나로 마무리하고 싶은 40~60대 아빠</li>
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

      <h2>자주 묻는 질문</h2>
      {DAD_ALLINONE_HOW_TO_CHOOSE_FAQ.map(({ q, a }) => (
        <div key={q}>
          <p>Q. {q}</p>
          <p>
            A.{' '}
            {a.startsWith('hello@dearpapa.kr') ? (
              <>
                <a href="mailto:hello@dearpapa.kr">hello@dearpapa.kr</a>
                {a.slice('hello@dearpapa.kr'.length)}
              </>
            ) : (
              a
            )}
          </p>
        </div>
      ))}

      <p>
        출시 소식은 인스타그램{' '}
        <a href="https://www.instagram.com/dearpapa.kr/" rel="noopener">
          @dearpapa.kr
        </a>
        과 공식 사이트 <Link href="/">dearpapa.kr</Link>에서 가장 먼저 알려 드립니다.
      </p>

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
          { href: '/journal/dad-gift-skincare-guide', label: '아빠 선물 화장품, 생신 선물 스킨케어 고르는 기준 7가지' },
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
