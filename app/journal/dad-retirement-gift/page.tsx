import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, RelatedLinks } from '@/components/article/ArticleLayout';
import {
  DAD_RETIREMENT_GIFT_FAQ,
  DAD_RETIREMENT_GIFT_META_DESCRIPTION,
  DAD_RETIREMENT_GIFT_META_TITLE,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/journal/journal-dad-retirement-gift-v1-2026-11-02.md (Copy Humanizer polished; Sun-ny brief OK).

const entry = getJournalEntry('dad-retirement-gift');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_RETIREMENT_GIFT_META_TITLE },
  description: DAD_RETIREMENT_GIFT_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_RETIREMENT_GIFT_META_TITLE,
    description: DAD_RETIREMENT_GIFT_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadRetirementGiftPage() {
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
      <p>
        아빠 퇴직 선물은 「수고하셨어요」를 오래 남기는 기념 선물과, 출근이 끝난 뒤의 하루를 챙기는 생활 선물로 나눠 보면
        고르기 쉬워요. 기념 선물 하나에 매일 쓰는 작은 선물을 더하고, 자녀가 직접 쓴 한마디를 곁들여도 좋아요.
      </p>

      <h2>아빠 퇴직 선물, 무엇부터 정하면 될까요?</h2>
      <p>먼저 선물이 맡을 역할을 하나 정하면 돼요.</p>
      <table>
        <thead>
          <tr>
            <th scope="col">정할 것</th>
            <th scope="col">기념 선물</th>
            <th scope="col">생활 선물</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>남기는 것</td>
            <td>오래 일한 시간을 기억하게 해요</td>
            <td>퇴직 후 매일의 습관을 챙겨요</td>
          </tr>
          <tr>
            <td>쓰는 때</td>
            <td>꺼내 볼 때마다</td>
            <td>매일 아침이나 저녁</td>
          </tr>
          <tr>
            <td>고를 때 볼 것</td>
            <td>아빠가 오래 간직할 물건인지</td>
            <td>아빠가 실제로 매일 쓸 물건인지</td>
          </tr>
        </tbody>
      </table>
      <p>가족이 함께 준비한다면 기념 선물은 다 같이, 생활 선물은 각자 하나씩 나눠 맡는 방법도 있어요.</p>

      <h2>기념으로 남는 퇴직 선물에는 무엇이 있을까요?</h2>
      <p>기념 선물로는 이런 것들이 있어요. 적은 순서는 순위가 아니에요.</p>
      <ul>
        <li>
          <strong>순금·골드바:</strong> 오래 간직하기 좋고, 날짜나 짧은 문구를 새기기도 해요.
        </li>
        <li>
          <strong>감사패:</strong> 회사 생활을 마무리하는 의미를 글로 남겨요. 문구는 가족이 함께 정하면 좋아요.
        </li>
        <li>
          <strong>시계·지갑:</strong> 매일 손에 닿는 물건이라 기념과 생활 두 가지를 함께 챙겨요.
        </li>
        <li>
          <strong>현금이나 여행:</strong> 아빠가 하고 싶었던 일을 직접 고르게 해 드려요.
        </li>
      </ul>
      <p>기념 선물은 「아빠가 오래 간직할까?」 하나만 생각하면 돼요.</p>

      <h2>퇴직 후 매일을 챙기는 선물은 무엇이 좋을까요?</h2>
      <p>
        퇴직하고 나면 출근 준비가 사라지면서 아침 시간이 달라져요. 생활 선물은 바뀐 하루에 새 습관 하나를 더해 드리는
        선물이에요.
      </p>
      <ul>
        <li>
          <strong>취미를 시작하는 물건:</strong> 산책화, 등산 가방, 책, 악기처럼 아빠가 미뤄 둔 일을 시작하게 해 줘요.
        </li>
        <li>
          <strong>건강 습관:</strong> 운동 수업이나 걷기 모임처럼 밖으로 나가는 계기를 만들어 드려요.
        </li>
        <li>
          <strong>스킨케어:</strong> 출근이 없어도 세안은 매일 하니까, 세안 후에 바를 것 하나면 매일 쓰는 선물이 돼요.
        </li>
      </ul>

      <h2>출근이 끝난 아빠에게는 어떤 스킨케어가 맞을까요?</h2>
      <p>
        평소 스킨케어를 거의 하지 않던 아빠라면 단계가 적은 것이 편해요. 세면대에 병이 없거나 하나뿐이라면, 세안 후 하나로
        마무리하는 올인원이 손에 익히기 쉬워요. 이미 스킨과 크림을 나눠 바르는 순서가 편한 아빠라면 그 루틴을 그대로 두는 게
        먼저예요.
      </p>
      <p>
        올인원이 맞는 아빠인지 고르는 기준은{' '}
        <Link href="/journal/dad-allinone-how-to-choose">아빠 올인원 스킨케어 선물, 어떤 기준으로 고를까요?</Link>에 정리해
        두었어요.
      </p>
      <p>
        디어파파는 4060 아빠를 위한 올인원 스킨케어를 만들고 있어요. 디어파파 레터 올인원은 150ml 한 가지로 기획하고 있고,
        아직 출시 전이에요. 가격·전성분·출시일은 미정이에요.
      </p>

      <h2>퇴직하는 아빠에게 전하는 한마디는 어떻게 쓸까요?</h2>
      <p>
        선물과 별개로, 자녀가 직접 쓴 한마디는 오래 남아요. 길게 쓸 필요는 없어요. 고마운 장면 하나와 앞으로의 응원 한
        줄이면 충분해요.
      </p>
      <p>아래는 자녀가 직접 쓸 때 참고할 수 있는 문장 예시예요.</p>
      <ul>
        <li>
          「매일 아침 일찍 나가시던 아빠 덕분에 저희가 여기까지 왔어요. 이제는 아빠의 아침이 조금 느긋했으면 좋겠어요.」
        </li>
        <li>「아빠, 정말 수고 많으셨어요. 이제 하고 싶었던 일 하나씩 같이 해요.」</li>
        <li>「아빠가 회사에서 보낸 시간이 저희에게는 늘 든든한 뒷모습이었어요.」</li>
      </ul>
      <p>
        카드, 손편지, 문자 어떤 형태든 괜찮아요. 아빠만 아는 기억을 하나 넣으면 더 아빠 이야기 같아져요.
      </p>

      <ProductBox />

      <h2>자주 묻는 질문</h2>
      {DAD_RETIREMENT_GIFT_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h3>{q}</h3>
          {q === '디어파파 레터 올인원을 지금 살 수 있나요?' ? (
            <p>
              아니요. 디어파파는 아직 출시 전이고, 지금 판매 중인 제품은 없어요. 디어파파는 150ml 올인원 한 가지를 기획하고
              만들고 있고, 가격·전성분·출시일은 아직 미정이에요. 확인된 내용은{' '}
              <Link href="/about/facts">공식 정보 페이지</Link>에 있어요.
            </p>
          ) : (
            <p>{a}</p>
          )}
        </section>
      ))}

      <RelatedLinks
        title="함께 읽기"
        links={[
          { href: '/journal/dad-gift-guide', label: '아빠 선물 가이드' },
          { href: '/journal/gift-without-routine', label: '화장품 안 쓰는 아빠 첫 선물' },
          {
            href: '/journal/dad-allinone-how-to-choose',
            label: '아빠 올인원 스킨케어 선물, 어떤 기준으로 고를까요?',
          },
        ]}
      />
    </ArticleLayout>
  );
}
