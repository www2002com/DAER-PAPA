import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '@/components/article/ComparisonTable';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import {
  FRAGRANCE_FREE_DESCRIPTION,
  FRAGRANCE_FREE_FAQ,
  FRAGRANCE_FREE_HEADLINE,
  FRAGRANCE_FREE_META_TITLE,
  FRAGRANCE_FREE_SUMMARY,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';
import { questionHeadingId } from '@/lib/question-heading-id';

// Ported from content/journal/journal-fragrance-alcohol-free-allinone-rewrite-v1-2026-11-02.md
// (SEO & AEO Desk; Sun-ny 2026-11-02). URL kept; H1/title/meta/FAQ replaced.

const entry = getJournalEntry('fragrance-alcohol-free-allinone');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: FRAGRANCE_FREE_META_TITLE },
  description: FRAGRANCE_FREE_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: FRAGRANCE_FREE_HEADLINE,
    description: FRAGRANCE_FREE_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: FRAGRANCE_FREE_HEADLINE,
    description: FRAGRANCE_FREE_DESCRIPTION,
  },
};

export default function FragranceAlcoholFreeAllInOnePage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      lead={<p>{FRAGRANCE_FREE_SUMMARY}</p>}
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
      <h2 id={questionHeadingId("전성분 표기는 어떻게 읽나요?")}>전성분 표기는 어떻게 읽나요?</h2>
      <ul>
        <li>화장품 용기나 포장에는 들어간 성분이 모두 적혀 있어요. 이것을 전성분 표기라고 해요.</li>
        <li>성분은 대체로 함량이 높은 순서로 적어요. 그래서 앞쪽에 있는 성분일수록 제품에서 차지하는 양이 크다고 보면 돼요.</li>
        <li>다만 1% 이하로 들어간 성분은 순서 없이 적을 수 있어요.</li>
        <li>착향제(향료)와 착색제도 순서와 상관없이 적을 수 있어요(화장품법 시행규칙 별표 4).</li>
      </ul>

      <h2 id={questionHeadingId("향료는 전성분 표기에서 어떻게 찾나요?")}>향료는 전성분 표기에서 어떻게 찾나요?</h2>
      <ul>
        <li>
          <strong>「향료」:</strong> 여러 향 원료를 섞은 것을 한 단어로 적은 표기예요. 이 단어가 있으면 향 원료가 들어간
          제품이에요.
        </li>
        <li>
          <strong>향 성분 이름:</strong> 리모넨, 리날룰, 시트로넬올, 제라니올, 쿠마린처럼 알레르기 유발 가능 성분으로
          정해진 향 성분은 일정량을 넘으면 이름을 따로 적어요(씻어내지 않는 제품은 0.001% 초과, 씻어내는 제품은 0.01%
          초과). 이런 이름이 보이면 향 원료가 들어갔다는 뜻이에요.
        </li>
        <li>
          <strong>식물 오일:</strong> 라벤더오일, 오렌지껍질오일처럼 향이 있는 식물 오일도 향을 내고, 「향료」라는 단어
          없이 성분 이름으로 적혀요.
        </li>
        <li>냄새가 거의 나지 않는다고 향 원료가 없다는 뜻은 아니에요. 냄새보다 전성분 표기로 확인하세요.</li>
      </ul>

      <h2 id={questionHeadingId("에탄올·변성알코올은 어떻게 찾나요?")}>에탄올·변성알코올은 어떻게 찾나요?</h2>
      <ul>
        <li>
          <strong>표기:</strong> 「에탄올」「변성알코올」「알코올」로 적혀요. 영문으로는 Ethanol, Alcohol Denat.,
          Alcohol이에요.
        </li>
        <li>
          <strong>위치:</strong> 정제수 바로 뒤처럼 앞쪽에 있으면 비교적 많이 들어간 것이고, 뒤쪽에 있으면 적게 들어간
          편이에요.
        </li>
        <li>
          <strong>이름이 비슷한 성분:</strong> 세틸알코올, 세테아릴알코올, 스테아릴알코올은 지방알코올로, 에탄올과 다른
          성분이에요. 「알코올」이라는 글자만 보고 같은 것으로 보지 않아도 돼요.
        </li>
      </ul>

      <h2 id={questionHeadingId("향에 민감한 4060 아빠에게는 어떻게 고를까요?")}>향에 민감한 4060 아빠에게는 어떻게 고를까요?</h2>
      <p>받는 아빠의 습관을 먼저 떠올리면 고르기 쉬워요.</p>
      <ComparisonTable label="향에 민감한 아빠 올인원 확인표">
        <table>
          <thead>
            <tr>
              <th scope="col">확인할 것</th>
              <th scope="col">이렇게 보면 돼요</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>평소 반응</td>
              <td>향수나 디퓨저 냄새를 불편해하시는지, 예전에 쓰다 그만둔 화장품이 있는지 떠올려 보세요.</td>
            </tr>
            <tr>
              <td>쓰는 때</td>
              <td>면도 후에 바를 제품이라면 제품 설명에 면도 후 사용이 적혀 있는지 보세요.</td>
            </tr>
            <tr>
              <td>전성분</td>
              <td>위의 방법대로 향료, 향 성분 이름, 식물 오일, 에탄올 표기를 확인하세요.</td>
            </tr>
            <tr>
              <td>처음 써 볼 때</td>
              <td>얼굴 전체에 바르기 전에 턱선에 조금 먼저 발라 보시라고 말씀드려요.</td>
            </tr>
          </tbody>
        </table>
      </ComparisonTable>
      <p>
        미국피부과학회(AAD)는 민감한 피부라면 향료가 든 제품을 주의하라고 안내해요. 향료나 에탄올이 없다고 모든 사람에게
        맞는 건 아니니, 전성분 전체와 아빠의 경험을 함께 보세요. 바른 뒤 불편하면 사용을 멈추고 전문가와 상담하세요.
      </p>

      <h2 id={questionHeadingId("선물하기 전에 무엇을 더 물어보면 좋을까요?")}>선물하기 전에 무엇을 더 물어보면 좋을까요?</h2>
      <ul>
        <li>지금 쓰는 제품이 있다면 이름이나 사진을 슬쩍 받아 두세요. 전성분을 비교하기 쉬워요.</li>
        <li>끈적임을 싫어하시는지, 바른 뒤 당김이 신경 쓰이시는지 여쭤 보세요.</li>
        <li>단계가 여러 개인 제품보다 세안 후 한 번 바르는 올인원이 아빠에게 더 맞을지도 생각해 보세요.</li>
      </ul>

      <h2 id={questionHeadingId("디어파파 레터 올인원은 어떤가요?")}>디어파파 레터 올인원은 어떤가요?</h2>
      <p>향과 알코올 관련 정보는 전성분과 함께 시험 자료를 확보한 뒤 공개합니다.</p>
      <p>
        디어파파 레터 올인원은 150ml 한 가지로 준비하고 있고, 아직 출시 전이에요. 가격·전성분·출시일은 미정이에요. 확인된
        내용은 <Link href="/about/facts">공식 정보 페이지</Link>에 있어요.
      </p>

      <h2>자주 묻는 질문</h2>
      {FRAGRANCE_FREE_FAQ.map(({ q, a }) => (
        <div key={q}>
          <p>
            <strong>Q. {q}</strong>
          </p>
          <p>A. {a}</p>
        </div>
      ))}

      <h2>참고</h2>
      <ul>
        <li>
          국가법령정보센터,{' '}
          <a href="https://www.law.go.kr/법령/화장품법시행규칙" rel="noopener">
            화장품법 시행규칙
          </a>{' '}
          별표 4 「화장품 포장의 표시기준 및 표시방법」
        </li>
        <li>
          식품의약품안전처,{' '}
          <a href="https://www.mfds.go.kr/brd/m_641/view.do?seq=32444" rel="noopener">
            화장품 향료 중 알레르기 유발물질 표시 지침
          </a>
        </li>
        <li>
          <a href="https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-for-men" rel="noopener">
            AAD, Skin care tips for men
          </a>
        </li>
      </ul>

      <RelatedLinks
        title="관련 글"
        links={[
          { href: '/journal/allinone-3-questions', label: '올인원 사기 전에 많이 묻는 3가지' },
          { href: '/journal/after-shave-gift', label: '면도 후 바르는 아빠 선물' },
          { href: '/about/facts', label: '디어파파 공식 정보' },
        ]}
      />

      <h2 id="official-info">공식 정보</h2>
      <FactList
        rows={[
          ['기준일', <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>],
          ['공식 사이트', <Link href="/about/facts">https://dearpapa.kr</Link>],
          ['출시 상태', '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.'],
          ['미정 항목', '전성분, 가격, 출시일, 판매처는 아직 미정입니다.'],
        ]}
      />
    </ArticleLayout>
  );
}
