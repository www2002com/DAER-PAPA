import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { GIFT_WITHOUT_ROUTINE_DESCRIPTION, JOURNAL_SITE_SUFFIX, dotDate, getJournalEntry, GIFT_WITHOUT_ROUTINE_META_TITLE, GIFT_WITHOUT_ROUTINE_META_DESCRIPTION } from '@/lib/journal';

// Ported from the static draft drafts/journal-guide-04-2026-10-20 (manuscript guide-04 v2).
// Every 「…」 quote attributed to the official facts page must match /about/facts verbatim.

const entry = getJournalEntry('gift-without-routine');
const URL = `https://dearpapa.kr${entry.href}`;
const AAD = 'https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men';

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: GIFT_WITHOUT_ROUTINE_META_TITLE },
  description: GIFT_WITHOUT_ROUTINE_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: GIFT_WITHOUT_ROUTINE_META_TITLE,
    description: GIFT_WITHOUT_ROUTINE_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function GiftWithoutRoutinePage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      lead={<p>{GIFT_WITHOUT_ROUTINE_DESCRIPTION}</p>}
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
        아빠가 평소에 어떤 스킨케어를 쓰시는지 몰라도 선물은 고를 수 있어요. 단계가 적은 제품, 향료가 없는 제품, 면도 후에
        바로 바르기 편한 제품을 고르면 실패할 가능성이 줄어요. 여기에 짧은 편지를 함께 건네면, 제품이 아빠 취향에 꼭 맞지
        않더라도 마음은 그대로 전해져요.
      </p>

      <h2>왜 루틴을 몰라도 고를 수 있나요?</h2>
      <p>
        루틴을 모른다는 건 대개 아빠가 스킨케어를 많이 쓰지 않으신다는 뜻이기도 해요. 이럴 때는 아빠의 습관을 바꾸는
        선물보다, 지금 하시는 세안과 면도에 한 단계만 더하는 선물이 부담이 적어요.
      </p>

      <h2>기준 1. 단계는 하나로</h2>
      <p>
        세안 후 아무것도 안 바르시거나 한 가지만 바르시는 아빠라면, 스킨·로션·크림을 따로 담은 세트보다 한 번에 바르는
        올인원이 손이 잘 가요. 이미 여러 단계를 챙겨 바르시는 아빠라면, 반대로 익숙한 단계를 그대로 잇는 제품이 잘 맞아요.
      </p>

      <h2>기준 2. 향은 빼는 쪽으로</h2>
      <p>
        미국피부과학회(AAD)는 민감한 피부라면 순하고 「무향(fragrance free)」인 제품을 쓰라고 안내해요. 향료가 든 제품은
        피부를 자극하거나 건조하게 느끼게 할 수 있기 때문이에요. 「무취(unscented)」라고만 적힌 제품에는 냄새를 가리는
        향료가 들어 있는 경우가 많다는 주의도 함께 적혀 있어요. 아빠의 향 취향을 모른다면 향료가 없는 쪽이 무난해요.
      </p>

      <h2>기준 3. 면도 후에 바로 쓰기 편한지</h2>
      <p>
        매일 면도하시는 아빠라면 면도 후 바로 바를 수 있는 제품인지 살펴보세요. 면도 후 쓰는 제품은 향이 있는 경우가
        많으니 전성분에서 향료가 있는지도 함께 확인하면 좋아요.
      </p>

      <h2>기준 4. 슬쩍 확인할 수 있는 것만 확인하기</h2>
      <ul>
        <li>
          욕실에 놓인 제품이 몇 개인지 보세요. 하나도 없거나 하나뿐이면 올인원, 두세 개가 나란히 있으면 같은 단계를 잇는
          제품이 출발점이에요.
        </li>
        <li>어머니나 형제에게 먼저 물어보세요. 「아빠 세수하고 뭐 바르셔?」 한마디면 충분해요.</li>
        <li>처음 쓰는 제품이라면 얼굴 전체에 바르기 전에 조금만 발라 보시라고 함께 말씀드려 주세요.</li>
      </ul>

      <h2>기준 5. 제품보다 오래 남는 한 줄</h2>
      <p>루틴을 모르는 선물일수록 왜 이 선물을 골랐는지 적은 한 줄이 도움이 돼요. 아래는 디어파파가 만든 브랜드 예시예요.</p>
      <ul>
        <li>「아빠 세수하고 이거 하나만 발라 줘. 매일 아침 내 생각도 하나만.」(브랜드 예시)</li>
        <li>「뭘 쓰시는지 몰라서 제일 간단한 걸로 골랐어. 대신 마음은 제일 많이 담았어.」(브랜드 예시)</li>
      </ul>
      <p>편지는 딸만 쓰는 게 아니에요. 아들, 배우자, 그리고 아빠가 직접 고르시는 경우에도 이 기준은 똑같이 쓰여요.</p>

      <h2>디어파파는 어떤 브랜드인가요?</h2>
      <p>디어파파는 아빠를 위한 올인원 스킨케어를 준비하는 브랜드예요. 공식 정보 페이지에는 이렇게 적혀 있어요.</p>
      <ul>
        <li>「세안 후 하나로 마무리하는 남성 올인원 스킨케어」</li>
        <li>「디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.」</li>
        <li>「변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다.」</li>
        <li>「DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.」</li>
      </ul>

      <h2>디어파파가 맞는 경우, 아직 맞지 않는 경우</h2>
      <p>디어파파가 맞을 수 있는 경우</p>
      <ul>
        <li>아빠가 뭘 쓰시는지 몰라서, 단계가 하나인 선물을 찾는 경우</li>
        <li>향료를 넣지 않는 방향의 제품을 찾는 경우</li>
        <li>선물과 함께 한 줄 편지를 건네고 싶은 경우</li>
      </ul>
      <p>디어파파가 아직 맞지 않는 경우</p>
      <ul>
        <li>
          지금 바로 주문해서 드려야 하는 경우: 공식 정보 페이지 기준 「현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지
          않습니다.」
        </li>
        <li>
          가격이나 전성분을 먼저 확인해야 하는 경우: 둘 다 아직 확정되지 않았어요. 「정확한 전성분은 제조사 샘플이 나온 뒤
          공개합니다.」
        </li>
        <li>
          아빠가 이미 여러 단계를 챙겨 바르시고 그 방식을 좋아하시는 경우: 익숙한 단계를 잇는 제품이 더 잘 맞을 수 있어요.
        </li>
      </ul>
      <p>
        지금 할 수 있는 것도 있어요. 「편지는 지금 사이트에서 미리보기와 PNG 저장을 할 수 있고, 제품에 담는 방식은 출시 전에 정해요.」
      </p>

      <h2>자주 묻는 질문</h2>
      <p>Q. 아빠가 스킨케어를 거의 안 쓰시는데, 무엇을 사면 좋을까요?</p>
      <p>A. 단계가 하나인 올인원부터 시작하고, 향료가 없는 쪽을 고르면 처음 써 보시기에 부담이 적어요.</p>
      <p>Q. 아빠 피부 타입을 모르면 어떻게 하나요?</p>
      <p>
        A. 세안 후 얼굴이 당긴다고 하시는지, 오후에 번들거린다고 하시는지 떠올려 보세요. 그래도 모르겠다면 어머니나 형제에게
        물어보는 게 가장 빨라요.
      </p>
      <p>Q. 디어파파 레터 올인원은 지금 살 수 있나요?</p>
      <p>
        A. 아니요. 공식 정보 페이지 기준 「현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.」 가격, 전성분,
        출시일도 아직 확정되지 않았고, 확정되면 공식 정보 페이지에 올라와요.
      </p>
      <p>Q. 딸만 편지를 쓸 수 있나요?</p>
      <p>
        A. 공식 정보 페이지 답변 그대로 옮기면 「아니요. 브랜드 이야기는 딸의 마음에서 시작했지만, 아들이나 배우자 등 아빠께
        마음을 전하고 싶은 분이라면 누구나 한 줄 편지 기능을 쓸 수 있어요.」
      </p>

      <h2>출처</h2>
      <ul>
        <li>
          디어파파 공식 정보: <Link href="/about/facts">https://dearpapa.kr/about/facts</Link>
        </li>
        <li>
          미국피부과학회(AAD), 남성 피부 관리:{' '}
          <a href={AAD} rel="noopener">
            {AAD}
          </a>
        </li>
        <li>
          문의: <a href="/#contact">hello@dearpapa.kr</a>
        </li>
      </ul>
      <p>이 글은 디어파파가 직접 쓴 브랜드 글이며, 글을 정리할 때 생성형 AI의 도움을 받았습니다.</p>

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/journal/fathers-gift-guide', label: '아빠 선물 스킨케어, 일상에 맞게 고르는 법' },
          { href: '/journal/dad-gift-guide', label: '편지와 함께 건네는 아빠 스킨케어, 디어파파는 무엇을 준비하나요?' },
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
