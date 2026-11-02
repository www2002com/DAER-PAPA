import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductBox } from '@/components/article/ProductBox';
import { ArticleLayout, RelatedLinks } from '@/components/article/ArticleLayout';
import {
  DAD_CHRISTMAS_GIFT_FAQ,
  DAD_CHRISTMAS_GIFT_META_DESCRIPTION,
  DAD_CHRISTMAS_GIFT_META_TITLE,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/journal/journal-dad-christmas-gift-v1-2026-11-02.md (Copy Humanizer polished; Sun-ny brief OK).

const entry = getJournalEntry('dad-christmas-gift');
const URL = `https://dearpapa.kr${entry.href}`;

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: DAD_CHRISTMAS_GIFT_META_TITLE },
  description: DAD_CHRISTMAS_GIFT_META_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: DAD_CHRISTMAS_GIFT_META_TITLE,
    description: DAD_CHRISTMAS_GIFT_META_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DadChristmasGiftPage() {
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
        아빠 크리스마스 선물은 겨울에 매일 쓰는 것과 연말 분위기를 함께 담으면 고르기 쉬워요. 부담 없는 크기의 생활 선물에
        한 해를 돌아보는 짧은 한마디를 곁들여 보세요.
      </p>

      <h2>아빠 크리스마스 선물, 생일 선물과 무엇이 다를까요?</h2>
      <p>
        생일은 아빠 한 사람을 위한 날이고, 크리스마스는 가족이 다 같이 주고받는 날이에요. 그래서 크리스마스 선물은 크기보다
        계절과 분위기를 챙기는 쪽이 잘 맞아요.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">보는 것</th>
            <th scope="col">생일 선물</th>
            <th scope="col">크리스마스 선물</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>중심</td>
            <td>아빠 한 사람</td>
            <td>가족이 함께하는 연말</td>
          </tr>
          <tr>
            <td>고르는 기준</td>
            <td>아빠가 오래 원하던 것</td>
            <td>겨울에 바로 쓰는 것</td>
          </tr>
          <tr>
            <td>곁들이는 말</td>
            <td>태어나 주셔서 고마운 마음</td>
            <td>한 해를 함께 보낸 고마움</td>
          </tr>
        </tbody>
      </table>

      <h2>아빠 크리스마스 선물 추천, 겨울에 매일 쓰는 것에는 무엇이 있을까요?</h2>
      <p>겨울 선물은 받은 날부터 바로 쓸 수 있어요. 적은 순서는 순위가 아니에요.</p>
      <ul>
        <li>
          <strong>목도리·장갑:</strong> 출퇴근길이나 산책길에 바로 써요.
        </li>
        <li>
          <strong>실내화·무릎 담요:</strong> 집에 있는 시간이 길어지는 연말에 잘 맞아요.
        </li>
        <li>
          <strong>차·커피:</strong> 아빠가 즐기는 맛을 알면 고르기 쉬워요.
        </li>
        <li>
          <strong>보온 텀블러:</strong> 출근길이나 산책길에 따뜻한 차를 담아 다닐 수 있어요.
        </li>
        <li>
          <strong>작은 가습기:</strong> 난방으로 건조해지는 겨울 방에 두기 좋아요.
        </li>
        <li>
          <strong>겨울 스킨케어:</strong> 겨울에도 세안과 면도는 매일 하니까, 그 뒤에 바를 것 하나면 매일 쓰는 선물이 돼요. 고르는
          기준은 바로 아래에 정리했어요.
        </li>
      </ul>

      <h2>겨울에 피부가 당기는 4060 아빠, 크리스마스 스킨케어 선물은 어떻게 고를까요?</h2>
      <p>
        세안 후나 면도 후에 얼굴이 당긴다고 하시면, 아빠 피부 상태와 바르는 습관부터 보고 고르면 돼요. 아래 네 가지를 차례로
        확인해 보세요.
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">확인할 것</th>
            <th scope="col">이렇게 보면 돼요</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>언제 당기는지</td>
            <td>세안 직후인지, 면도 후인지, 하루 종일인지 먼저 여쭤 보세요.</td>
          </tr>
          <tr>
            <td>사용감</td>
            <td>끈적이는 걸 싫어하시면 가벼운 쪽, 당김이 크다고 하시면 보습감을 표기한 쪽을 보세요.</td>
          </tr>
          <tr>
            <td>향</td>
            <td>향에 예민하시면 향이 강하지 않은지, 향료 표기를 확인하세요.</td>
          </tr>
          <tr>
            <td>바르는 단계</td>
            <td>스킨케어를 거의 안 하시면 여러 병보다 세안 후 한 번 바르는 쪽부터 보세요.</td>
          </tr>
        </tbody>
      </table>
      <p>
        전성분이 공개된 제품이면 아빠가 피하는 성분이 있는지도 미리 볼 수 있어요. 새 제품은 얼굴 전체에 바르기 전에 조금만 먼저
        써 보시라고 말씀드려도 좋아요.
      </p>
      <p>
        평소 스킨케어를 거의 하지 않는 아빠라면 단계가 적은 것이 편해요. 고르는 기준은{' '}
        <Link href="/journal/dad-allinone-how-to-choose">아빠 올인원 스킨케어 선물, 어떤 기준으로 고를까요?</Link>에 정리해
        두었어요.
      </p>
      <p>
        디어파파는 4060 아빠를 위한 올인원 스킨케어를 만들고 있어요. 디어파파 레터 올인원은 150ml 한 가지로 기획하고 있고,
        아직 출시 전이에요. 가격·전성분·출시일은 미정이에요.
      </p>

      <h2>엄마 아빠께 함께 드리는 크리스마스 선물은 무엇이 좋을까요?</h2>
      <p>두 분께 함께 드린다면 같이 쓰는 물건이나 같이 보내는 시간을 고르면 돼요.</p>
      <ul>
        <li>
          <strong>함께 쓰는 물건:</strong> 거실 담요, 커플 머그, 집에서 쓰는 작은 가전처럼 두 분이 나눠 쓰는 것.
        </li>
        <li>
          <strong>함께 보내는 시간:</strong> 공연이나 영화 관람, 연말 가족 식사, 가까운 곳 하루 여행.
        </li>
        <li>
          <strong>따로 하나씩:</strong> 같은 날 두 분께 각자 작은 선물을 드리는 방법도 있어요.
        </li>
      </ul>

      <h2>직접 만드는 크리스마스 선물에는 무엇이 있을까요?</h2>
      <p>손이 많이 간 선물은 그 시간까지 함께 전해져요.</p>
      <ul>
        <li>
          <strong>사진 앨범:</strong> 올해 가족 사진을 골라 한 권으로 묶어요.
        </li>
        <li>
          <strong>손으로 쓴 카드:</strong> 짧아도 괜찮아요. 아래 예시를 참고하세요.
        </li>
        <li>
          <strong>직접 고른 플레이리스트:</strong> 아빠가 좋아하는 노래를 모아 드려요.
        </li>
      </ul>

      <h2>크리스마스 카드에 아빠에게 쓸 한 줄, 어떻게 쓸까요?</h2>
      <p>
        편지는 자녀가 따로 써서 건네는 거예요. 길게 쓰지 않아도 괜찮아요. 올해 고마웠던 일 하나, 내년에 아빠와 해 보고 싶은
        일 하나를 떠올려 보세요.
      </p>
      <p>직접 쓸 때 참고할 만한 문장 예시예요.</p>
      <ul>
        <li>「아빠, 올해도 저희 곁에 있어 주셔서 고마워요. 내년엔 같이 여행 한 번 가요.」</li>
        <li>「바쁜 한 해였는데 늘 먼저 안부 물어봐 주셔서 힘이 됐어요. 메리 크리스마스, 아빠.」</li>
        <li>「올해 아빠랑 먹은 저녁이 제일 기억에 남아요. 내년에도 자주 같이 먹어요.」</li>
        <li>「아빠, 추운 날마다 데리러 와 주셔서 고마웠어요.」</li>
        <li>「올해도 고생 많으셨어요. 이번 겨울은 따뜻하게 보내세요.」</li>
      </ul>
      <p>카드든 문자든 편한 방법으로 전하면 돼요.</p>

      <ProductBox />

      <h2>자주 묻는 질문</h2>
      {DAD_CHRISTMAS_GIFT_FAQ.map(({ q, a }) => (
        <section key={q}>
          <h3>{q}</h3>
          {q === '디어파파 레터 올인원을 크리스마스 선물로 살 수 있나요?' ? (
            <p>
              아니요. 디어파파는 아직 출시 전이고, 지금 판매 중인 제품은 없어요. 디어파파는 150ml 올인원 한 가지를 기획하고
              만들고 있고, 가격·전성분·출시일은 아직 미정이에요. 확인된 내용은 <Link href="/about/facts">공식 정보 페이지에</Link> 있어요.
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
          { href: '/journal/dad-retirement-gift', label: '아빠 퇴직 선물' },
        ]}
      />
    </ArticleLayout>
  );
}
