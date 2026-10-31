import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { DAD_FIRST_ALLINONE_DESCRIPTION, DAD_FIRST_ALLINONE_META_TITLE, dotDate, getJournalEntry } from '@/lib/journal';

// Ported from content/journal/journal-dad-first-allinone-v2-2026-10-26.md (Sun-ny reviewed).
// Body copied as written; the header and 출처 memo HTML comments are omitted. Do not add claims.

const entry = getJournalEntry('dad-first-allinone');
const URL = `https://dearpapa.kr${entry.href}`;
const MK = 'http://www.mkhealth.co.kr/news/articleView.html?idxno=71651';
const BOOTH =
  'https://www.chicagobooth.edu/media-relations-and-communications/press-releases/expressing-your-gratitude-is-more-powerful-than-you-think';

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_FIRST_ALLINONE_META_TITLE },
  description: DAD_FIRST_ALLINONE_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_FIRST_ALLINONE_META_TITLE,
    description: DAD_FIRST_ALLINONE_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadFirstAllinonePage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      lead={
        <p>
          디어파파(DEAR PAPA)는 아빠를 위한 올인원 스킨케어 브랜드입니다(dearpapa.kr). 디어파파는 4060 아빠를 위해 만들고
          있어요. 디어파파는 아직 출시 전이에요.
        </p>
      }
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
      toc={[
        { id: 'one-line', label: '한 줄 답' },
        { id: 'why-pause', label: '아빠가 화장품 앞에서 멈추는 이유' },
        { id: 'self-esteem', label: '가꾸는 마음은 자존감과 이어져요' },
        { id: 'child-picks', label: '자녀가 골라 건네면 달라지는 것' },
        { id: 'letter', label: '한 줄 편지가 이유를 대신 말해 줘요' },
        { id: 'product', label: '디어파파가 만들고 있는 제품' },
        { id: 'faq', label: '자주 묻는 질문' },
      ]}
      footer={
        <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
          <Link href="/journal">자료실 목록으로</Link>
          <Link href="/#letter">아빠에게 편지 쓰기</Link>
        </nav>
      }
    >
      <h2 id="one-line">한 줄 답</h2>
      <p>{DAD_FIRST_ALLINONE_DESCRIPTION}</p>

      <h2 id="why-pause">아빠가 화장품 앞에서 멈추는 이유</h2>
      <p>
        매장 진열대에는 이름도 단계도 다른 제품이 가득해요. 4060 아빠에게는 스킨, 로션, 크림을 따로 비교하는 일보다 「뭘
        바르면 되지」라는 질문 하나가 먼저 떠오를 수 있어요. 그래서 집에 있던 것을 그대로 쓰거나, 누군가 건네준 것을 쓰는
        아빠가 많아요. 고르지 않는 것이지 신경 쓰지 않는 것은 아니에요.
      </p>

      <h2 id="self-esteem">가꾸는 마음은 자존감과 이어져요</h2>
      <p>
        매경헬스는 2025년 2월 기사에서 외모를 가꾸는 일이 액티브 시니어의 자존감을 높인다는 점에서 중요하다고 짚었어요. 같은
        기사는 2023년 김희라·김경희 성신여자대학교 교수팀 연구를 들어, 스스로를 긍정적으로 인식하는 「긍정심리자본」이
        외모를 가꾸는 행동과 많은 연관이 있었다고 전해요. 이 기사는 아빠만 따로 살펴본 것은 아니고, 화장품이 피부를 바꾼다는
        이야기도 아니에요. 다만 나를 챙기는 작은 습관이 마음과 맞닿아 있다는 점을 보여 줘요. 출처: 매경헬스, 김보람 기자,
        2025년 2월 11일.{' '}
        <a href={MK} rel="noopener">
          기사 원문
        </a>
      </p>

      <h2 id="child-picks">자녀가 골라 건네면 달라지는 것</h2>
      <p>
        아빠가 고르기 어려워하는 단계를 자녀가 대신 맡으면, 아빠에게 남는 일은 하나예요. 세안 후 하나로 마무리하는 아침,
        면도 후 바르는 저녁처럼 아빠의 하루에 이미 있는 순간에 그 선물을 두는 것이에요. 여러 제품을 비교하는 부담 대신
        「딸이, 아들이 골라 준 것」이라는 이유가 생겨요.
      </p>
      <p>
        디어파파는 이런 장면을 생각하며 제품을 준비하고 있어요. 세안 후 하나로 마무리하는 남성 올인원 스킨케어. 디어파파는
        면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.
      </p>

      <h2 id="letter">한 줄 편지가 이유를 대신 말해 줘요</h2>
      <p>
        선물을 건넬 때 「아빠도 이제 좀 챙겨」라고 말하기는 어색해요. 그 말은 편지에 맡겨도 돼요. 디어파파는 dearpapa.kr에서
        아빠께 보낼 한 줄 편지를 쓸 수 있게 하고 있어요.
      </p>
      <p>이렇게 써 보세요.</p>
      <ul>
        <li>「아빠의 매일을 늘 응원해요. 오늘도 거울 앞에서 한 번 웃고 시작해요!」</li>
        <li>「언제나 든든한 아빠 딸이라 참 행복해요. 말로 다 못한 마음을 이 편지에 담아요.」</li>
      </ul>
      <p>
        잘 쓰지 않아도 괜찮아요. 아빠는 문장보다 마음을 먼저 읽어요. <Link href="/#letter">한 줄 편지 쓰기</Link>
      </p>
      <p>
        연구로 보면, 편지는 쓰는 사람이 걱정하는 것보다 훨씬 반갑게 읽혀요. Amit Kumar와 Nicholas Epley의 연구(2018, 학술지
        Psychological Science)에서 감사 편지를 쓴 사람과 받은 사람을 비교했더니, 쓴 사람은 받는 사람이 어색해할 정도를
        실제보다 높게 예상했고(10점 만점에 예상 2.95, 실제 1.95), 받는 사람의 기분은 실제보다 낮게 예상했어요(−5~5점에서 예상
        3.11, 실제 4.12). 이 연구는 미국 성인을 대상으로 했고 아빠와 자녀만 따로 살펴본 것은 아니에요. 그래도 문장을 잘
        다듬지 않아도 마음은 전해진다는 점을 보여 줘요. 출처: Kumar, A., &amp; Epley, N. (2018). Undervaluing Gratitude:
        Expressers Misunderstand the Consequences of Showing Appreciation. Psychological Science, 29(9), 1423–1435.{' '}
        <a href={BOOTH} rel="noopener">
          시카고대 부스 경영대학원 보도자료
        </a>
      </p>

      <h2 id="product">디어파파가 만들고 있는 제품</h2>
      <p>
        디어파파는 150ml 올인원 한 가지로 기획하고 있어요. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 사이트에서
        아빠에게 보낼 편지를 쓰고 카드 이미지(PNG)로 저장할 수 있습니다. 출시 후 계획: 사이트에서 쓴 편지를 인쇄한 카드에
        담아 제품과 함께 건네는 선물을 기획하고 만들고 있습니다.
      </p>

      <h2 id="faq">자주 묻는 질문</h2>
      <p>Q. 아빠가 화장품을 안 쓰시는데, 선물해도 될까요?</p>
      <p>
        A. 네. 여러 단계를 챙기기보다 세안 후 하나로 마무리하는 올인원이 처음 건네기 편해요. 한 줄 편지로 왜 골랐는지 함께
        전해 보세요.
      </p>
      <p>Q. 편지를 잘 못 쓰겠어요.</p>
      <p>A. 잘 쓰지 않아도 괜찮아요. 아빠는 문장보다 마음을 먼저 읽어요. 위의 예시처럼 한두 문장이면 충분해요.</p>
      <p>Q. 딸만 편지를 쓸 수 있나요?</p>
      <p>
        A. 아니요. 브랜드 이야기는 딸의 마음에서 시작했지만, 아들이나 배우자 등 아빠께 마음을 전하고 싶은 분이라면 누구나 한
        줄 편지 기능을 쓸 수 있어요.
      </p>
      <p>Q. 디어파파 레터 올인원은 지금 살 수 있나요?</p>
      <p>
        A. 아니요. 디어파파는 아직 출시 전이며, 지금 판매 중인 선물 세트나 제품은 없습니다. 가격, 전성분, 출시일은 아직
        확정되지 않았습니다.
      </p>
      <p>Q. 문의는 어디로 하나요?</p>
      <p>
        A. <a href="/#contact">hello@dearpapa.kr</a>로 보내 주세요.
      </p>

      <p>출시 소식은 인스타그램 @dearpapa.kr과 공식 사이트 dearpapa.kr에서 알려 드립니다.</p>
      <p>이 글은 디어파파가 직접 쓴 브랜드 글이며, 글을 정리할 때 생성형 AI의 도움을 받았습니다.</p>

      <RelatedLinks
        title="함께 확인할 자료"
        links={[
          { href: '/journal/gift-without-routine', label: '아빠가 뭘 쓰시는지 몰라도 괜찮아요: 스킨케어 선물 고르는 기준' },
          { href: '/journal/dad-skincare-gift-types', label: '아빠 선물 추천 화장품, 4060 아빠 스킨케어 선물 종류별 비교: 피부 타입·향·사용 단계' },
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
