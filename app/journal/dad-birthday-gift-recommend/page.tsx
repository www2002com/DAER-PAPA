import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import {
  DAD_BIRTHDAY_GIFT_RECOMMEND_FAQ,
  DAD_BIRTHDAY_GIFT_RECOMMEND_META_DESCRIPTION,
  DAD_BIRTHDAY_GIFT_RECOMMEND_META_TITLE,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/journal/journal-dad-birthday-gift-recommend-v1-2026-10-31.md (Sun-ny approved).

const entry = getJournalEntry('dad-birthday-gift-recommend');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_BIRTHDAY_GIFT_RECOMMEND_META_TITLE },
  description: DAD_BIRTHDAY_GIFT_RECOMMEND_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_BIRTHDAY_GIFT_RECOMMEND_META_TITLE,
    description: DAD_BIRTHDAY_GIFT_RECOMMEND_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadBirthdayGiftRecommendPage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal/dad-gift-guide', label: '아빠 선물 가이드' }]}
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
      <p>2026년 11월 1일 업데이트</p>
      <h2>한 줄 답</h2>
      <p>
        디어파파가 정리한 아빠 생일 선물 추천 기준은 그날·매일 쓸지, 스스로 잘 안 사는지, 쓰기 쉬운지, 한 줄을 곁들일 수
        있는지를 먼저 보는 거예요. 스킨케어는 그 네 가지에 맞을 때 후보가 돼요.
      </p>
      <p>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.</p>

      <h2>아빠 생일 선물 추천, 먼저 보면 좋은 네 가지</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">기준</th>
            <th scope="col">확인할 것</th>
            <th scope="col">생일에 건넬 때</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>그날·매일</td>
            <td>생일 당일에만 쓰는지, 그 뒤에도 손이 가는지</td>
            <td>서랍에만 남는 것보다 아침·저녁에 닿는 쪽</td>
          </tr>
          <tr>
            <td>스스로 안 삼</td>
            <td>필요하지만 아빠가 잘 사지 않는지</td>
            <td>선물 받는 느낌이 남는 쪽</td>
          </tr>
          <tr>
            <td>쓰기 쉬움</td>
            <td>쓰는 법이 복잡한지</td>
            <td>건넨 자리에서 「이렇게 쓰면 돼요」 한 줄이면 충분한지</td>
          </tr>
          <tr>
            <td>한 줄</td>
            <td>짧은 말을 곁들일 수 있는지</td>
            <td>말로 못 한 마음을 같이 전할 수 있는지</td>
          </tr>
        </tbody>
      </table>
      <p>
        가격만으로 순위를 매기지 않아요. 예산이 있어도 위 네 칸을 먼저 통과한 뒤 가격을 보면 돼요. 디어파파 가격·전성분·출시일은
        아직 정해지지 않았어요.
      </p>

      <h2>아빠 생일 선물, 종류별로 무엇이 다를까요?</h2>
      <p>
        생일 선물은 크게 네 종류로 나눠 볼 수 있어요. 어느 쪽이 더 좋다고 순위를 매기지 않고, 아빠의 하루에 어디서 닿는지로
        나눴어요.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">종류</th>
            <th scope="col">아빠에게 닿는 때</th>
            <th scope="col">이럴 때 맞아요</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>스킨케어</td>
            <td>세안 후·면도 후, 매일</td>
            <td>스스로 잘 사지 않지만 매일 쓸 자리가 있을 때 (디어파파는 여러 단계를 하나로, 가격 미정)</td>
          </tr>
          <tr>
            <td>편지</td>
            <td>받는 날, 그리고 다시 꺼내 볼 때</td>
            <td>말로 못 한 마음을 전하고 싶을 때</td>
          </tr>
          <tr>
            <td>생활용품</td>
            <td>집·출퇴근길에서 자주</td>
            <td>평소 쓰는 물건을 바꿀 때가 됐을 때</td>
          </tr>
          <tr>
            <td>경험(식사·여행)</td>
            <td>생일 당일, 함께 있는 시간</td>
            <td>함께 보내는 시간이 선물이 될 때</td>
          </tr>
        </tbody>
      </table>
      <p>
        디어파파는 여러 단계를 하나로 모으는 올인원 스킨케어로 기획하고 만들고 있어요. 편지는 지금 사이트에서 미리보기와 PNG
        저장을 할 수 있고, 제품에 담는 방식은 출시 전에 정해요.
      </p>

      <h2>아빠 생일 선물로 어떤 종류를 보면 되나요?</h2>
      <p>
        흔히 고르는 축은 매일 쓰는 물건, 기념일에만 여는 경험, 짧은 말과 함께 건넬 수 있는 물건이에요. 지갑·건강식품·상품권처럼
        자주 주고받는 선물도, 한 줄이 더해지면 받는 느낌이 달라질 수 있어요. 어떤 종류가 「더 좋다」고 순위를 매기지 않아요.
        아빠의 하루에 얼마나 자주 닿는지로 보면 돼요.
      </p>
      <p>
        스킨케어는 「매일 쓰는 물건」축에 가깝고, 쓰기 쉬운 제품이면 생일 자리에서 바로 건네기 좋아요. 피부 타입별 효능이나 다른
        브랜드 이름은 이 글에서 다루지 않아요.
      </p>

      <h2>아빠 생일 선물 추천에서 스킨케어는 언제 맞나요?</h2>
      <p>아래가 맞으면 스킨케어를 후보에 넣으면 돼요.</p>
      <ol>
        <li>세안 후나 면도 후에 바를 자리가 있어요.</li>
        <li>여러 단계를 따로 쓰기보다, 단계가 적은 쪽이 편해요.</li>
        <li>향·전성분 공개 여부를 건네기 전에 확인할 수 있어요.</li>
        <li>생일 당일 「세안 후에 바르세요」처럼 쓰는 법 한 줄을 같이 줄 수 있어요.</li>
      </ol>
      <p>
        스킨케어를 고르는 세부 표(쓰는 때·단계 수·향·전성분·바로 써 보기)는{' '}
        <Link href="/journal/dad-birthday-gift-skincare">아빠 생일 선물 스킨케어 기준</Link>에 따로 정리해 두었어요.
      </p>

      <h2>4060 아빠 생일에도 같은 기준으로 보면 되나요?</h2>
      <p>
        같아요. 숫자 나이보다 「그날·매일」「스스로 안 삼」「쓰기 쉬움」「한 줄」이 우선이에요. 4060 아빠 생일·생신에도 위 표를
        그대로 쓰면 돼요.
      </p>

      <h2>올인원 스킨케어 선물은 어디에 해당하나요?</h2>
      <p>
        매일 쓰는 축이면서, 쓰기 쉬움 칸에서 단계가 적은 쪽에 가까워요. 세안 후 하나로 마무리하거나 면도 후에 바르는 장면을
        떠올리면 이해하기 쉬워요. 디어파파 레터 올인원은 그 방향으로 기획하고 만들고 있어요.
      </p>

      <h2>편지와 함께 줄 수 있는 아빠 생일 선물인가요?</h2>
      <p>
        네. 짧은 한 줄을 곁들이면 「한 줄」 칸을 채울 수 있어요. 편지는 지금 사이트에서 미리보기와 PNG 저장을 할 수 있고, 제품에
        담는 방식은 출시 전에 정해요. <Link href="/#letter">한 줄 편지 쓰기</Link>
      </p>

      <h2>예산을 정해 두고 고를 때는요?</h2>
      <p>
        예산 칸만 따로 보지 말고, 표 앞줄을 통과한 뒤 가격을 확인하세요. 디어파파 레터 올인원 가격은 아직 정해지지 않았어요.
        판매처도 아직 없어요. 사이트에는 가격대 표현을 두지 않아요.
      </p>

      <ProductBox />

      <h2>디어파파 소개</h2>
      <p>
        150ml 올인원 한 가지를 기획하고 만들고 있어요. 세안 후 하나로 마무리하는 남성 올인원 스킨케어로, 면도 후 바르는 장면도
        생각하며 만들고 있어요. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있어요. 가격, 전성분,
        출시일은 아직 확정되지 않았어요.
      </p>

      {DAD_BIRTHDAY_GIFT_RECOMMEND_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </section>
      ))}

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          {
            href: '/journal/dad-birthday-gift-skincare',
            label: '아빠 생일 선물 스킨케어, 무엇을 봐야 할까요?',
          },
          { href: '/journal/dad-saengsin-gift', label: '아버지 생신 선물, 생일과 어떻게 다를까요?' },
          {
            href: '/journal/dad-allinone-skincare-gift',
            label: '아빠 올인원 스킨케어 선물, 언제 맞을까요?',
          },
          { href: '/journal/dad-gift-guide', label: '편지와 함께 건네는 아빠 스킨케어' },
          { href: '/letter-all-in-one', label: '디어파파 레터 올인원 제품 정보' },
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
