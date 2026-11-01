import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import {
  DAD_SAENGSIN_GIFT_FAQ,
  DAD_SAENGSIN_GIFT_META_DESCRIPTION,
  DAD_SAENGSIN_GIFT_META_TITLE,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/journal/journal-dad-saengsin-gift-2026-update-v1-2026-11-02.md (Sun-ny approved).

const entry = getJournalEntry('dad-saengsin-gift');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_SAENGSIN_GIFT_META_TITLE },
  description: DAD_SAENGSIN_GIFT_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_SAENGSIN_GIFT_META_TITLE,
    description: DAD_SAENGSIN_GIFT_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadSaengsinGiftPage() {
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
      <p>2026년 11월 2일 업데이트</p>
      <h2>한 줄 답</h2>
      <p>
        디어파파 스킨케어 기준으로 보면, 2026 아버지 생신 선물은 격식·가족이 함께 드리는지·매일 쓰는지·쓰기 쉬운지·한 줄
        마음을 먼저 정하면 돼요. 올인원은 그 다섯에 맞을 때 후보예요.
      </p>
      <p>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.</p>

      <h2>아버지 생신 선물, 생일과 무엇이 다른가요?</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">기준</th>
            <th scope="col">생신에서 더 보는 것</th>
            <th scope="col">건넬 때</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>격식</td>
            <td>부르는 말·자리의 무게가 생일보다 큰지</td>
            <td>받는 자리에서 「생신」으로 불리는 분위기에 맞는지</td>
          </tr>
          <tr>
            <td>가족이 함께</td>
            <td>혼자 고르는지, 형제·가족이 뜻을 모으는지</td>
            <td>한 선물에 여러 사람의 마음이 닿는지</td>
          </tr>
          <tr>
            <td>매일 쓰는 것</td>
            <td>그날만 여는지, 그 뒤에도 손이 가는지</td>
            <td>서랍에만 남는 것보다 아침·저녁에 닿는 쪽</td>
          </tr>
          <tr>
            <td>쓰기 쉬움</td>
            <td>쓰는 법이 복잡한지</td>
            <td>「이렇게 쓰면 돼요」 한 줄이면 충분한지</td>
          </tr>
          <tr>
            <td>한 줄 마음</td>
            <td>짧은 말을 곁들일 수 있는지</td>
            <td>말로 못 한 마음을 같이 전할 수 있는지</td>
          </tr>
        </tbody>
      </table>
      <p>
        생일 선물과 종류가 겹쳐도, 생신은 위 다섯을 더 앞에 두면 고르기 쉬워요. 순위를 매기지 않아요. 디어파파 가격·전성분·출시일은
        아직 정해지지 않았어요.
      </p>

      <h2>4060 아빠 생신 선물도 같은 다섯으로 보면 되나요?</h2>
      <p>
        같아요. 숫자 나이보다 「격식」「가족이 함께」「매일 쓰는 것」「쓰기 쉬움」「한 줄 마음」이 우선이에요. 4060 아빠 생신에도
        위 표를 그대로 쓰면 돼요.
      </p>

      <h2>아버지 생신에 스킨케어는 언제 맞나요?</h2>
      <p>아래가 맞으면 스킨케어를 후보에 넣으면 돼요.</p>
      <ol>
        <li>가족이 함께 고른 선물로, 생신 자리에서 바로 건넬 수 있어요.</li>
        <li>세안 후나 면도 후에 바를 자리가 있어요.</li>
        <li>여러 단계보다 단계가 적은 쪽이 편해요.</li>
        <li>「세안 후에 바르세요」처럼 쓰는 법 한 줄을 같이 줄 수 있어요.</li>
        <li>짧은 한 줄 마음을 곁들일 수 있어요.</li>
      </ol>
      <p>
        생일 선물 일반 기준은 <Link href="/journal/dad-birthday-gift-recommend">아빠 생일 선물 추천</Link>에, 스킨케어 세부
        표는 <Link href="/journal/dad-birthday-gift-skincare">아빠 생일 선물 스킨케어</Link>에 따로 정리해 두었어요.
      </p>

      <h2>아빠 피부가 건조하거나 번들거리면, 생신 스킨케어 선물은 어떻게 고를까요?</h2>
      <p>
        먼저 아빠 피부가 당기는 편인지, 번들거리는 편인지만 확인해 보세요. 그다음 그 피부에 맞는지, 향이 강하지 않은지, 전성분이
        공개되어 있는지를 차례로 보면 고르기가 쉬워져요.
      </p>
      <table>
        <thead>
          <tr>
            <th>피부</th>
            <th>이런 편이에요</th>
            <th>고를 때 볼 것</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>지성</td>
            <td>오후에 이마·코가 번들거려요</td>
            <td>끈적임이 적은 가벼운 사용감</td>
          </tr>
          <tr>
            <td>건성</td>
            <td>세안 후 당기고 각질이 보여요</td>
            <td>보습감이 충분한지</td>
          </tr>
          <tr>
            <td>민감</td>
            <td>새 제품을 바르면 따끔하거나 자극을 잘 느껴요</td>
            <td>향이 강하지 않은지, 전성분 먼저 확인</td>
          </tr>
        </tbody>
      </table>
      <p>
        피부 타입을 모르겠다면 단계가 적은 제품이 부담이 덜해요. 디어파파 스킨케어도 여러 단계를 하나로 줄이는 방향으로 준비하고
        있고, 가격·전성분·출시일은 아직 정해지지 않았어요. 확인된 내용은 <Link href="/about/facts">공식 정보 페이지</Link>에 있어요.
      </p>

      <h2>비싼 선물보다 매일 쓰기 편한 선물이 나을까요?</h2>
      <p>
        받는 사람은 값보다 쓰임새를 더 반기는 경향이 있어요. 2022년 Frontiers in Psychology에 실린 Liu 외 연구에서 받는 사람은
        실용적인 선물을 더 높게 평가했고(5.10 대 4.16), 같은 선물이면 더 저렴한 쪽도 더 높게 봤어요(5.31 대 4.33). 반면 주는 사람은
        비싼 쪽을 더 골랐어요(4.84 대 3.12). 다만 이 연구는 대학생이 친구 생일에 이어폰을 주고받는 상황을 다룬 것이라 아버지 생신에
        그대로 들어맞는다고 단정할 수는 없어요. 디어파파 스킨케어는 매일 한 번에 바르는 올인원이라, 여러 단계를 번거로워하는 4060
        아빠에게 '매일 쓰기 편한 선물'로 고려해 볼 수 있어요.
      </p>
      <p>
        출처:{' '}
        <a
          href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.790434/full"
          target="_blank"
          rel="noopener noreferrer"
        >
          Liu, N. 외 (2022), Frontiers in Psychology
        </a>
      </p>

      <h2>보습을 아직 안 하는 아빠에게, 가족이 골라 주는 첫 올인원과 한 줄 편지는 어떻게 고를까요?</h2>
      <p>
        보습을 아직 안 하는 아빠라면, 가족이 첫 올인원과 <Link href="/#letter">한 줄 편지</Link>를 같이 골라 주면 돼요.
        디어파파는 여러 단계를 번거로워하는 4060 아빠에게 맞는 올인원이에요. 편지는 지금 사이트에서 미리보기와 PNG 저장을 할 수
        있고, 제품에 담는 방식은 출시 전에 정해요.
      </p>

      <h2>올인원 스킨케어는 생신 표에서 어디에 해당하나요?</h2>
      <p>
        매일 쓰는 축이면서, 쓰기 쉬움 칸에서 단계가 적은 쪽에 가까워요. 가족이 함께 건네기에도, 쓰는 법 한 줄만 붙이면 자리가
        단순해요. 디어파파 레터 올인원은 그 방향으로 기획하고 만들고 있어요.
      </p>

      <h2>편지와 함께 줄 수 있는 아버지 생신 선물인가요?</h2>
      <p>
        네. 짧은 한 줄을 곁들이면 「한 줄 마음」 칸을 채울 수 있어요. 편지는 지금 사이트에서 미리보기와 PNG 저장을 할 수 있고,
        제품에 담는 방식은 출시 전에 정해요. <Link href="/#letter">한 줄 편지 쓰기</Link>
      </p>

      <h2>예산을 정해 두고 고를 때는요?</h2>
      <p>
        예산 칸만 따로 보지 말고, 표 앞줄을 통과한 뒤 가격을 확인하세요. 디어파파 레터 올인원 가격은 아직 정해지지 않았어요.
        판매처도 아직 없어요. 사이트에는 가격대 표현을 두지 않아요.
      </p>

      <p>
        아빠 스킨케어는 후기보다 향이 강하지 않은지, 전성분을 먼저 확인해 보세요.{' '}
        <Link href="/about/facts">공식 정보 확인하기</Link>
      </p>

      <ProductBox />

      <h2>디어파파 소개</h2>
      <p>
        150ml 올인원 한 가지를 기획하고 만들고 있어요. 세안 후 하나로 마무리하는 남성 올인원 스킨케어로, 면도 후 바르는 장면도
        생각하며 만들고 있어요. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있어요. 가격, 전성분,
        출시일은 아직 확정되지 않았어요.
      </p>

      {DAD_SAENGSIN_GIFT_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </section>
      ))}

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/journal/dad-birthday-gift-recommend', label: '아빠 생일 선물 추천, 무엇부터 정할까요?' },
          {
            href: '/journal/dad-birthday-gift-skincare',
            label: '아빠 생일 선물 스킨케어, 무엇을 봐야 할까요?',
          },
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
