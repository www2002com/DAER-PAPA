import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import {
  DAD_ALLINONE_SKINCARE_GIFT_FAQ,
  DAD_ALLINONE_SKINCARE_GIFT_META_DESCRIPTION,
  DAD_ALLINONE_SKINCARE_GIFT_META_TITLE,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/journal/journal-dad-allinone-skincare-gift-v1-2026-10-31.md (Sun-ny approved).

const entry = getJournalEntry('dad-allinone-skincare-gift');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_ALLINONE_SKINCARE_GIFT_META_TITLE },
  description: DAD_ALLINONE_SKINCARE_GIFT_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_ALLINONE_SKINCARE_GIFT_META_TITLE,
    description: DAD_ALLINONE_SKINCARE_GIFT_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadAllinoneSkincareGiftPage() {
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
        디어파파가 정리한 아빠 올인원 스킨케어 선물은, 단계를 줄이고 싶은 아빠·스킨·로션을 나눠 바르던 아빠·면도 후 바를 자리가 있는
        아빠에게 맞을 때 후보예요.
      </p>
      <p>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.</p>

      <h2>아빠 올인원 스킨케어 선물은 어떤 아빠에게 맞나요?</h2>
      <p>아래가 맞으면 올인원을 선물 후보에 넣으면 돼요.</p>
      <ol>
        <li>세안 후나 면도 후에 바를 자리가 있어요.</li>
        <li>여러 단계를 따로 쓰기보다, 단계를 줄이고 싶어 해요.</li>
        <li>예전에 스킨·로션처럼 나눠 바르던 루틴이 있어도, 요즘은 한 단계가 편해요.</li>
        <li>건넨 자리에서 「세안 후에 바르세요」처럼 쓰는 법 한 줄을 같이 줄 수 있어요.</li>
        <li>짧은 한 줄을 곁들일 수 있어요.</li>
      </ol>
      <p>
        올인원 제품을 피부 타입·향료·에탄올·단계 수로 깊게 고르는 법은{' '}
        <Link href="/journal/dad-allinone-how-to-choose">아빠 올인원 고르는 법</Link>에 따로 정리해 두었어요. 이 글은 선물로
        건넬지를 먼저 보는 기준이에요.
      </p>

      <h2>건네기 전에 무엇을 확인하면 되나요?</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">기준</th>
            <th scope="col">확인할 것</th>
            <th scope="col">선물로 건넬 때</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>향 유무</td>
            <td>설명·전성분에 향료가 있는지</td>
            <td>건넨 뒤 거부감이 없도록 향 여부 확인</td>
          </tr>
          <tr>
            <td>전성분 공개</td>
            <td>상세·용기에 전성분이 있는지</td>
            <td>민감하면 공개된 제품만 후보에</td>
          </tr>
          <tr>
            <td>단계 수</td>
            <td>한 단계인지, 여러 제품을 따로 바르는지</td>
            <td>매일 쓰기 쉽게 단계가 적은 쪽</td>
          </tr>
          <tr>
            <td>용량</td>
            <td>용량이 안내돼 있는지</td>
            <td>오래 쓸지 대략만 보고, 단정하지 않기</td>
          </tr>
          <tr>
            <td>피부 타입</td>
            <td>지성·건성·민감 중 어디에 맞춘다고 안내하는지</td>
            <td>효능을 단정하지 말고, 바른 뒤 느낌이 편한지만</td>
          </tr>
        </tbody>
      </table>
      <p>
        지성·건성·민감은 「세안하고 나면 당기세요, 오후에 번들거리세요?」처럼 아빠께 물어보고 후보를 줄이는 일반 안내예요. 피부
        타입별 효능은 이 글에서 다루지 않아요. 순위를 매기지 않아요. 디어파파 가격·전성분·출시일은 아직 정해지지 않았어요.
      </p>

      <h2>스킨·로션을 나눠 바르던 아빠에게도 올인원 선물이 맞나요?</h2>
      <p>
        맞을 수 있어요. 예전에 스킨·로션을 나눠 바르던 아빠라도, 요즘은 세안 후 한 단계로 마무리하는 쪽이 편할 때가 있어요.
        「여러 병을 따로 바를지, 하나로 줄일지」만 먼저 정하면 돼요. 제품 유형 비교는{' '}
        <Link href="/journal/dad-allinone-how-to-choose">올인원 고르는 법</Link> 표를 보면 돼요. 디어파파 레터 올인원을
        「로션」이라고 부르지는 않아요.
      </p>

      <h2>면도 후·세안 후에 바르는 선물로도 괜찮은가요?</h2>
      <p>
        네. 세안 후나 면도 후에 바를 자리가 있으면, 올인원은 「매일 쓰는 축」이면서 단계가 적은 선물에 가까워요. 생일·생신
        자리에서 바로 건네기도 좋아요. 생일 선물 일반 기준은{' '}
        <Link href="/journal/dad-birthday-gift-recommend">아빠 생일 선물 추천</Link>에, 생신 기준은{' '}
        <Link href="/journal/dad-saengsin-gift">아버지 생신 선물</Link>에, 생일 스킨케어 세부 표는{' '}
        <Link href="/journal/dad-birthday-gift-skincare">아빠 생일 선물 스킨케어</Link>에 있어요.
      </p>

      <h2>한 줄 편지와 함께 어떻게 건네면 되나요?</h2>
      <p>
        짧은 한 줄을 곁들이면 「말로 못 한 마음」을 같이 전할 수 있어요. 편지는 지금 사이트에서 미리보기와 PNG 저장을 할 수
        있고, 제품에 담는 방식은 출시 전에 정해요. 쓰는 법 한 줄(「세안 후에 바르세요」)과 마음을 적은 한 줄을 같이 두면, 받는
        자리에서 어색함이 줄어들어요. <Link href="/#letter">한 줄 편지 쓰기</Link>
      </p>

      <ProductBox />

      <h2>디어파파 소개</h2>
      <p>
        150ml 올인원 한 가지를 기획하고 만들고 있어요. 세안 후 하나로 마무리하는 남성 올인원 스킨케어로, 면도 후 바르는 장면도
        생각하며 만들고 있어요. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있어요. 가격, 전성분,
        출시일은 아직 확정되지 않았어요. 피부 타입별 효능도 아직 확정되지 않았어요.
      </p>

      {DAD_ALLINONE_SKINCARE_GIFT_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h2>{q}</h2>
          <p>{a}</p>
        </section>
      ))}

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          {
            href: '/journal/dad-allinone-how-to-choose',
            label: '아빠 올인원 스킨케어 선물, 디어파파가 보는 고르는 순서',
          },
          { href: '/journal/dad-birthday-gift-recommend', label: '아빠 생일 선물 추천, 무엇부터 정할까요?' },
          { href: '/journal/dad-saengsin-gift', label: '아버지 생신 선물, 생일과 어떻게 다를까요?' },
          {
            href: '/journal/dad-birthday-gift-skincare',
            label: '아빠 생일 선물 스킨케어, 무엇을 봐야 할까요?',
          },
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
