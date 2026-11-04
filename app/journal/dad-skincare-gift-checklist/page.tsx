import type { Metadata } from 'next';
import Link from 'next/link';
import { ComparisonTable } from '@/components/article/ComparisonTable';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import {
  CHECKLIST_DESCRIPTION,
  CHECKLIST_FAQ,
  CHECKLIST_HEADLINE,
  CHECKLIST_META_TITLE,
  CHECKLIST_SUMMARY,
  dotDate,
  getJournalEntry,
} from '@/lib/journal';

// Ported from content/drafts/checklist-dad-skincare-gift-7-2026-11-05.md (2026-11-05).

const entry = getJournalEntry('dad-skincare-gift-checklist');
const URL = `https://dearpapa.kr${entry.href}`;

const SRC_LABEL = 'https://www.easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=1301&popMenu=ov';
const SRC_FUNCTIONAL = 'https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=3&cnpClsNo=1&csmSeq=1301&popMenu=ov';
const SRC_AD = 'https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=4&cciNo=2&cnpClsNo=1&csmSeq=1301&popMenu=ov';
const SRC_MFDS = 'https://www.mfds.go.kr/wpge/m_646/de050601l0025.do';

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: CHECKLIST_META_TITLE },
  description: CHECKLIST_DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    title: CHECKLIST_HEADLINE,
    description: CHECKLIST_DESCRIPTION,
    url: URL,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: CHECKLIST_HEADLINE,
    description: CHECKLIST_DESCRIPTION,
  },
};

function Check({ items }: { items: string[] }) {
  return (
    <p>
      <strong>체크:</strong> {items.map((i) => `□ ${i}`).join('  ')}
    </p>
  );
}

export default function DadSkincareGiftChecklistPage() {
  return (
    <ArticleLayout
      crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
      eyebrow={entry.category}
      title={entry.title}
      lead={<p>{CHECKLIST_SUMMARY}</p>}
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
        디어파파 DEAR PAPA 저널이 아빠 스킨케어 선물을 고르기 전에 보면 좋은 확인 항목을 7가지로 정리했어요. 제품을
        추천하는 글이 아니라, 포장·표시·습관·쓰는 때를 먼저 맞춰 보는 체크리스트예요. 디어파파는 4060 아빠를 위한
        올인원 스킨케어를 기획하고 만들고 있고, 지금은 150ml 올인원 한 가지예요. 가격·전성분·출시일은 아직 미정이에요.
      </p>

      <h2>이 체크리스트는 어떻게 쓰나요?</h2>
      <p>
        아래 일곱 항목을 순서대로 체크해 보세요. 항목마다 「맞다 / 아니다 / 아직 모름」만 적어두면 충분해요. 숫자로 순위를
        매기지 않고, 아빠의 평소 습관과 제품 표시가 맞는지 보는 기준표예요.
      </p>

      <h2>1. 지금 바르는 단계 수는 몇 가지인가요?</h2>
      <p>
        아빠가 이미 쓰는 제품이 있는지, 있다면 몇 단계를 쓰시는지부터 보세요. 단계를 거의 안 쓰시거나 한 가지만 쓰신다면,
        올인원처럼 선택이 한 번으로 줄어드는 형태가 맞을 수 있어요. 이미 여러 단계를 익숙하게 쓰신다면, 지금 루틴을 그대로
        두는 편이 나을 수 있어요.
      </p>
      <Check items={['거의 안 쓰심', '1단계', '2단계 이상', '모름']} />

      <h2>2. 쓰는 때는 언제인가요? (세안 후 · 면도 후 · 외출 전)</h2>
      <p>
        선물이 「언제」 쓰일지 맞춰 보세요. 세안 직후인지, 면도 직후인지, 외출 전인지에 따라 함께 챙길 것이 달라져요.
        올인원은 얼굴에 바르는 선택지를 한 가지로 줄여 주는 제품이고, 자외선 차단처럼 별도 역할이 있는 제품은 아래 5번에서
        따로 확인해요. 면도 후 장면은 <Link href="/journal/after-shave-gift">면도 후 아빠 스킨케어, 선물 고를 때 볼 세 가지</Link>
        에도 정리해 두었어요.
      </p>
      <Check items={['세안 후', '면도 후', '외출 전', '아직 정해지지 않음']} />

      <h2>3. 전성분이 공개되어 있나요?</h2>
      <p>
        화장품을 고를 때 포장에 적힌 「모든 성분」 표시를 먼저 보세요. 「화장품법」 제10조에 따르면 화장품의 외부 포장에는
        해당 화장품 제조에 사용된 모든 성분을 기재·표시해야 합니다(인체에 무해한 소량 함유 성분 등 일부 예외는 시행규칙으로
        정함). 전성분 표기를 읽는 법은{' '}
        <Link href="/journal/allinone-fragrance-alcohol-info">아빠 올인원 선물, 향과 알코올은 어떻게 확인하나요?</Link>에 있어요.
      </p>
      <p>향과 알코올 관련 정보는 전성분과 함께 시험 자료를 확보한 뒤 공개합니다.</p>
      <Check items={['전성분 확인함', '아직 공개 전', '확인 방법 모름']} />

      <h2>4. 기능성·효능처럼 보이는 문구가 있다면, 심사·보고 범위인가요?</h2>
      <p>
        미백·주름 개선·자외선 차단처럼 「기능성화장품」 범위의 효능·효과를 표시·광고하려면, 품목별로 식품의약품안전처장의
        심사를 받거나 보고서를 제출해야 합니다(「화장품법」 제4조). 또한 「화장품법」 제13조는 사실과 다르거나, 부분적으로
        사실이라도 전체적으로 보아 소비자가 잘못 인식할 우려가 있는 표시·광고를 금지합니다.
      </p>
      <p>
        디어파파 레터 올인원은 150ml 올인원 한 가지로, 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 심사·보고
        전에는 그 범위의 효능을 단정하지 않아요. 제품 이야기는{' '}
        <Link href="/letter-all-in-one">우리가 준비하고 있는 것</Link>에서 볼 수 있어요.
      </p>
      <Check items={['기능성 문구 없음', '심사·보고 문구 확인함', '아직 모름']} />

      <h2>5. 자외선 차단은 올인원과 별도로 보나요?</h2>
      <p>
        자외선을 차단 또는 산란시켜 피부를 보호하는 기능을 가진 화장품은 「기능성화장품」 범위에 따로 들어가 있어요(「화장품법」
        제2조제2호, 시행규칙 제2조). 올인원 선물을 고를 때도, 자외선 차단이 필요한 날에는 별도 차단제를 함께 보는 편이
        안전해요. 디어파파 레터 올인원을 자외선 차단 대체재로 말하지 않아요.
      </p>
      <Check items={['별도 차단제 있음', '외출 적음', '아직 모름']} />

      <h2>6. 용량과 「매일 쓸 자리」는 맞나요?</h2>
      <p>
        용량(ml)과 세면대에 둘 자리가 맞는지 보세요. 디어파파는 150ml 올인원 한 가지를 기획하고 만들고 있어요. 용량은 표기된
        수치를 그대로 읽고, 사용 기간을 약속하는 말은 붙이지 않아요. 한 병만 두고 싶으신 아빠에게는 올인원이 맞을 수 있고,
        이미 여러 병을 두신 아빠에게는 단계별 제품이 더 맞을 수 있어요.
      </p>
      <Check items={['한 병만 두고 싶음', '여러 병 OK', '용량 확인함', '모름']} />

      <h2>7. 제품 말고, 마음이 남는 한 줄이 있나요?</h2>
      <p>
        선물에 짧은 편지를 함께 건넬지 정해 보세요. 편지는 제품에 들어 있는 문구가 아니라, 자녀가 직접 따로 쓰는 거예요. 잘
        쓰지 않아도 괜찮아요. 아빠는 문장보다 마음을 먼저 읽어요. 이 항목은 제품 성능과 무관한 선물 습관 체크예요.
      </p>
      <Check items={['편지 함께 건넴', '말로만 전함', '아직 정하지 않음']} />

      <h2>디어파파는 어떤 경우에 맞고, 어떤 경우에 맞지 않나요?</h2>
      <p>순위나 TOP 목록이 아니라, 습관이 맞는지 보는 비교예요.</p>
      <ComparisonTable label="디어파파가 맞는 경우와 맞지 않는 경우">
        <table>
          <thead>
            <tr>
              <th scope="col">구분</th>
              <th scope="col">디어파파가 맞는 경우</th>
              <th scope="col">디어파파가 맞지 않는 경우</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>단계</td>
              <td>바르는 선택을 한 번으로 줄이고 싶을 때</td>
              <td>이미 여러 단계 루틴이 익숙할 때</td>
            </tr>
            <tr>
              <td>제품 수</td>
              <td>세면대에 올인원 한 가지만 두고 싶을 때</td>
              <td>단계별 제품을 각각 고르고 싶을 때</td>
            </tr>
            <tr>
              <td>정보</td>
              <td>전성분·용량·표시를 먼저 확인한 뒤 고르고 싶을 때</td>
              <td>지금 쓰는 제품과 1:1로만 비교하고 싶을 때</td>
            </tr>
            <tr>
              <td>기대</td>
              <td>올인원으로 「한 가지 선택」을 덜어 주는 선물을 원할 때</td>
              <td>자외선 차단·기능성 효능을 단정한 선물을 원할 때</td>
            </tr>
            <tr>
              <td>일정</td>
              <td>가격·전성분·출시일이 미정인 점을 알고 기다릴 수 있을 때</td>
              <td>지금 바로 살 제품이 필요할 때</td>
            </tr>
          </tbody>
        </table>
      </ComparisonTable>

      <h2>7가지를 한눈에 보면?</h2>
      <ol>
        <li>지금 바르는 단계 수</li>
        <li>쓰는 때 (세안 후 · 면도 후 · 외출 전)</li>
        <li>전성분 공개 여부</li>
        <li>기능성처럼 보이는 문구의 심사·보고 여부</li>
        <li>자외선 차단은 별도인지</li>
        <li>용량과 매일 둘 자리</li>
        <li>마음이 남는 한 줄(편지)</li>
      </ol>
      <p>가격·전성분·출시일은 아직 미정이에요. 정해지면 dearpapa.kr 저널에서 안내할게요.</p>

      <h2>자주 묻는 질문</h2>
      {CHECKLIST_FAQ.map(({ q, a }) => (
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
          찾기쉬운 생활법령정보,{' '}
          <a href={SRC_LABEL} rel="noopener">
            화장품의 기재·표시 사항
          </a>{' '}
          (「화장품법」 제10조)
        </li>
        <li>
          찾기쉬운 생활법령정보,{' '}
          <a href={SRC_FUNCTIONAL} rel="noopener">
            기능성화장품의 심사 등
          </a>{' '}
          (「화장품법」 제2조제2호·제4조)
        </li>
        <li>
          찾기쉬운 생활법령정보,{' '}
          <a href={SRC_AD} rel="noopener">
            화장품의 표시·광고
          </a>{' '}
          (「화장품법」 제13조)
        </li>
        <li>
          식품의약품안전처,{' '}
          <a href={SRC_MFDS} rel="noopener">
            화장품의 부당한 표시, 광고 범위
          </a>
        </li>
      </ul>

      <RelatedLinks
        title="관련 글"
        links={[
          { href: '/journal/allinone-fragrance-alcohol-info', label: '아빠 올인원 선물, 향과 알코올은 어떻게 확인하나요?' },
          { href: '/journal/after-shave-gift', label: '면도 후 아빠 스킨케어, 선물 고를 때 볼 세 가지' },
          { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
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
