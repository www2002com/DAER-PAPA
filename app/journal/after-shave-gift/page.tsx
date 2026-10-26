import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { AFTER_SHAVE_GIFT_DESCRIPTION, AFTER_SHAVE_GIFT_FAQ, dotDate, getJournalEntry, AFTER_SHAVE_GIFT_META_TITLE, AFTER_SHAVE_GIFT_META_DESCRIPTION } from '@/lib/journal';

// Ported verbatim from content/journal/journal-after-shave-gift-v3.md (article body only; status note omitted).

const entry = getJournalEntry('after-shave-gift');
const URL = `https://dearpapa.kr${entry.href}`;
const PAGE_TITLE = `${entry.title} | 디어파파 DEAR PAPA`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: AFTER_SHAVE_GIFT_META_TITLE },
  description: AFTER_SHAVE_GIFT_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: AFTER_SHAVE_GIFT_META_TITLE,
    description: AFTER_SHAVE_GIFT_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function AfterShaveGiftPage() {
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
      <p>면도 후 아빠에게 줄 스킨케어는 향이 없는지, 에탄올이 들어 있지 않은지, 바르기 쉬운 한 단계인지부터 보면 됩니다.</p>

      <h2>1. 향이 없는지</h2>
      <p>
        매일 면도하는 아빠는 향이 강한 제품을 오래 쓰지 않는 경우가 많습니다. 제품 설명이나 전성분에서 향료와 에센셜오일이
        들어 있는지 확인하세요.
      </p>

      <h2>2. 에탄올이 들어 있는지</h2>
      <p>면도한 직후 피부에 바르는 제품이라면 전성분에 에탄올(알코올)이 있는지 살펴보세요.</p>

      <h2>3. 한 단계로 바르는지</h2>
      <p>
        스킨, 로션, 크림을 따로 챙기지 않는 아빠라면 한 번만 바르면 되는 올인원이 쓰기 쉽습니다. 빨리 흡수되는 워터리 제형은
        바른 뒤 끈적임이 덜합니다.
      </p>

      <ProductBox />

      <h2>모바일로 보내도 마음이 전해지는 법: 한 줄 편지 함께 쓰기</h2>
      <p>
        멀리 사는 아빠께 선물을 휴대폰으로 보내면 마음이 덜 전해질까 걱정될 수 있어요. 선물과 함께 아빠께 하고 싶은 말을 한 줄로
        적어 보내 보세요. 디어파파는 dearpapa.kr에서 아빠께 보낼 한 줄 편지를 쓸 수 있게 하고 있어요. 잘 쓰지 않아도 괜찮아요.
        아빠는 문장보다 마음을 먼저 읽어요.{' '}
        <Link href="/#letter">한 줄 편지 쓰기</Link>
      </p>
      <p>
        연구로 보면, 편지는 쓰는 사람이 걱정하는 것보다 훨씬 반갑게 읽혀요. Amit Kumar와 Nicholas Epley의 연구(2018, 학술지
        Psychological Science)에서 감사 편지를 쓴 사람과 받은 사람을 비교했더니, 쓴 사람은 받는 사람이 어색해할 정도를 실제보다 높게
        예상했고(10점 만점에 예상 2.95, 실제 1.95), 받는 사람의 기분은 실제보다 낮게 예상했어요(−5~5점에서 예상 3.11, 실제 4.12). 이
        연구는 미국 성인을 대상으로 했고 아빠와 자녀만 따로 살펴본 것은 아니에요. 그래도 문장을 잘 다듬지 않아도 마음은 전해진다는 점을
        보여 줘요. 출처:{' '}
        <a href="https://doi.org/10.1177/0956797618772506" target="_blank" rel="noopener noreferrer">
          Kumar, A., &amp; Epley, N. (2018). Undervaluing Gratitude: Expressers Misunderstand the Consequences of Showing
          Appreciation. Psychological Science, 29(9), 1423–1435.
        </a>{' '}
        (<a href="https://www.chicagobooth.edu/media-relations-and-communications/press-releases/expressing-your-gratitude-is-more-powerful-than-you-think" target="_blank" rel="noopener noreferrer">시카고대 부스 경영대학원 보도자료</a>)
      </p>

      <h2>디어파파가 만들고 있는 제품</h2>
      <p>
        디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형과 무에탄올을 목표로 기획하고 만들고 있습니다.
        디어파파는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.
      </p>

      <h2>자주 묻는 질문</h2>
      {AFTER_SHAVE_GIFT_FAQ.map(({ q, a }) => (
        <div key={q}>
          <p>Q. {q}</p>
          <p>A. {a}</p>
        </div>
      ))}

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
          { href: '/journal/gift-without-routine', label: '아빠가 뭘 쓰시는지 몰라도 괜찮아요: 스킨케어 선물 고르는 기준' },
          { href: '/journal/fathers-gift-guide', label: '아빠 선물 스킨케어, 일상에 맞게 고르는 법' },
          { href: '/when-to-use', label: '언제 바르나요: 세안 후, 면도 후, 그리고 선물하는 날' },
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
