import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import {
  DAD_BIRTHDAY_GIFT_SKINCARE_FAQ,
  DAD_BIRTHDAY_GIFT_SKINCARE_META_DESCRIPTION,
  DAD_BIRTHDAY_GIFT_SKINCARE_META_TITLE,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/journal/journal-dad-birthday-gift-skincare-v1-2026-10-31.md (FINAL, mtime 2026-10-31 17:02:50 +0900).
// Guardrail minimal fixes (listed in PR): ranking recommendation wording in H2/FAQ Q; budget amount phrase in body/H2. Letter wording from source (no printed-card claim).

const entry = getJournalEntry('dad-birthday-gift-skincare');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_BIRTHDAY_GIFT_SKINCARE_META_TITLE },
  description: DAD_BIRTHDAY_GIFT_SKINCARE_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_BIRTHDAY_GIFT_SKINCARE_META_TITLE,
    description: DAD_BIRTHDAY_GIFT_SKINCARE_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadBirthdayGiftSkincarePage() {
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
      <p>
        디어파파가 정리한 아빠 생일 선물 스킨케어 기준은 먼저 아빠가 세안 후·면도 후 언제 바르는지 보고, 그다음 단계 수와 향, 전성분
        공개 여부를 보는 거예요.
      </p>
      <p>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.</p>

      <h2>아빠 생일 선물 스킨케어, 고르는 기준표</h2>
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
            <td>쓰는 때</td>
            <td>세안 후인지, 면도 후인지</td>
            <td>생일 아침이면 세안 후, 저녁이면 면도·세안 후인지 맞춰 보기</td>
          </tr>
          <tr>
            <td>단계 수</td>
            <td>여러 제품을 따로 바르는지, 올인원처럼 한 단계인지</td>
            <td>그날 바로 쓰기 쉽게 단계가 적은 쪽</td>
          </tr>
          <tr>
            <td>향</td>
            <td>향료가 있는지</td>
            <td>건넨 뒤 거부감이 없도록 향 여부 확인</td>
          </tr>
          <tr>
            <td>전성분 공개</td>
            <td>상세·용기에 전성분이 있는지</td>
            <td>민감하면 공개된 제품만 후보에</td>
          </tr>
          <tr>
            <td>바로 써 보기</td>
            <td>건넨 날 바로 바를 수 있는지</td>
            <td>「세안 후에만 바르세요」처럼 쓰는 법 한 줄 메모를 같이</td>
          </tr>
          <tr>
            <td>가격 확인</td>
            <td>판매가·예산</td>
            <td>예산이 있어도 「그날·매일 쓸지」를 가격보다 앞에</td>
          </tr>
        </tbody>
      </table>
      <p>
        가격·전성분·출시일이 아직 없는 브랜드(디어파파 포함)는 「지금 구매」 목록이 아니라 「출시 전·기준만」으로 읽으면 돼요.
      </p>

      <h2>아빠 생일 선물로 스킨케어를 골랐다면 순서는요?</h2>
      <ol>
        <li>쓰는 때부터 맞춰요. 생일 아침인지 저녁인지에 따라 세안 후·면도 후 중 어디인지 정해요.</li>
        <li>단계 수·향·전성분 공개를 이어서 체크해요.</li>
        <li>건넨 자리에서 바로 써 볼 수 있게, 쓰는 법 한 줄 메모를 붙여 두어요.</li>
        <li>예산이 정해져 있어도, 금액 단정보다 위 칸을 먼저 통과한 뒤 가격을 봐요.</li>
      </ol>

      <h2>4060 아빠 생신 선물로 스킨케어를 고를 때도 표가 같나요?</h2>
      <p>같아요. 숫자 나이보다 쓰는 때·단계 수·향·전성분이 우선이에요. 4060 아빠 생신에도 같은 표를 쓰면 돼요.</p>

      <h2>아빠 올인원 스킨케어 선물은 표에서 어디에 해당하나요?</h2>
      <p>
        쓰는 때가 세안 후·면도 후이고, 단계 수 칸에서 「한 단계」에 가까운 제품이에요. 생일날 바로 바르기 쉬운 쪽이기도 해요. 디어파파
        레터 올인원은 그 방향으로 기획하고 만들고 있어요.
      </p>

      <h2>아버지 생신·아빠 생일 선물을 예산으로 볼 때는요?</h2>
      <p>
        예산 칸만 따로 보지 말고, 표 앞줄을 통과한 뒤 가격을 확인하세요. 디어파파 레터 올인원 가격은 미정이에요. 판매처도 아직 없어요.
      </p>

      <h2>편지와 함께 줄 수 있는 아빠 선물인가요?</h2>
      <p>
        네, 짧은 한 줄을 곁들일 수 있어요. 지금 사이트에서 편지 카드 미리보기와 PNG 저장만 가능해요. 편지를 어떤 방식으로 담을지는 출시
        전에 확정할 예정이에요.{' '}
        <Link href="/#letter">한 줄 편지 쓰기</Link>
      </p>

      <ProductBox />

      <h2>디어파파 소개</h2>
      <p>
        150ml 올인원 한 가지를 기획하고 만들고 있어요. 세안 후 하나로 마무리하는 남성 올인원 스킨케어로, 면도 후 바르는 장면도 생각하며
        만들고 있어요. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있어요. 가격, 전성분, 출시일은 아직
        확정되지 않았어요.
      </p>

      {DAD_BIRTHDAY_GIFT_SKINCARE_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </section>
      ))}

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          {
            href: '/journal/dad-gift-skincare-guide',
            label: '아빠 선물 화장품, 생신 선물 스킨케어 고르는 기준 7가지',
          },
          { href: '/journal/dad-gift-guide', label: '아빠 선물 추천, 편지와 함께 건네는 스킨케어' },
          {
            href: '/journal/dad-allinone-how-to-choose',
            label: '4060 아빠 올인원 고르는 법, 피부 타입·향료·단계 수로 보는 기준',
          },
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
