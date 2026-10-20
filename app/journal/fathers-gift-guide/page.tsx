import Link from 'next/link';
import { ArticleLayout, RelatedLinks } from '@/components/article/ArticleLayout';
import { preservedMetadata } from '@/lib/preserved-metadata';
import { JOURNAL_SITE_SUFFIX, dotDate, getJournalEntry } from '@/lib/journal';

// Copied verbatim from the previous /journal/fathers-gift-guide page.

const entry = getJournalEntry('fathers-gift-guide');

export const metadata = preservedMetadata('/journal/fathers-gift-guide');


export default function FathersGiftGuidePage() {
  return (
    <>
      <ArticleLayout
        crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
        eyebrow={entry.category}
        title={entry.title}
        lead={
          <p>
            아빠의 나이만으로 선물을 정하기보다, 평소 무엇을 쓰고 어떤 과정을 편하게 느끼는지 먼저 살펴보세요.
            디어파파가 제안하는 선물 선택의 출발점입니다.
          </p>
        }
        meta={
          <>
            <span>작성 · DEAR PAPA</span>
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
        <h2>평소 쓰는 제품에서 시작하기</h2>
        <p>
          생일이나 어버이날 선물을 고민한다면 아빠가 지금 쓰는 제품을 먼저 물어보세요. 마음에 드는 점과 불편한 점을
          들으면 새로운 제품을 고를 기준이 더 구체적이 됩니다.
        </p>
        <p>
          같은 연령대라도 취향과 사용 습관은 다릅니다. ‘아빠 나이에는 이것’이라는 설명보다 실제로 손이 가는 제품의
          특징을 알아두는 편을 권합니다.
        </p>
        <ul>
          <li>평소 제품을 언제, 얼마나 자주 사용하는지</li>
          <li>한 번에 끝나는 과정과 여러 단계 중 어느 쪽이 편한지</li>
          <li>좋아하는 향이 있는지, 향이 적은 제품을 선호하는지</li>
          <li>지금 쓰는 제품에서 바꾸고 싶은 점이 있는지</li>
        </ul>

        <h2>선물하는 사람과 쓰는 사람의 취향은 다를 수 있습니다</h2>
        <p>
          내가 좋아하는 향이나 포장이 아빠에게도 맞을 것이라고 단정하지 않아도 괜찮습니다. 사용할 때의 느낌, 용기
          여닫기, 두고 쓸 자리처럼 작은 조건도 함께 생각해 보세요.
        </p>
        <p>
          제품을 비교할 때에는 실제 판매 제품의 전성분, 사용법, 용량과 안내 사항을 확인하세요. 상세 정보가 아직 공개되지
          않았다면 이미지나 분위기만으로 제품의 특징을 판단하지 않는 것이 좋겠습니다.
        </p>

        <h2>선물에 한 줄을 더한다면</h2>
        <p>
          편지는 거창한 문장으로 시작하지 않아도 됩니다. 함께 있었던 순간 하나, 평소 말하지 못한 고마움 하나를 떠올려
          보세요. ‘지난번에 데리러 와 줘서 고마웠어’처럼 구체적인 기억도 좋은 시작입니다.
        </p>
        <p>
          디어파파 사이트에서는 짧은 편지를 작성해 손글씨 스타일로 미리 보고 이미지로 저장할 수 있습니다. 준비된 선물에
          마음을 더하거나, 편지 이미지만 따로 전할 때도 이용할 수 있습니다.
        </p>

        <h2>디어파파 제품은 출시를 준비하고 있습니다</h2>
        <p>
          이 글은 디어파파가 제안하는 선물 선택 가이드입니다. 고객 조사나 제품 비교 시험의 결과를 소개하는 글은
          아닙니다.
        </p>
        <p>
          DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 현재 제품 주문은 받지 않습니다. 지금
          이용할 수 있는 편지 경험과 앞으로 공개할 제품 정보를 구분해 안내하겠습니다.
        </p>

        <RelatedLinks
          title="함께 확인할 자료"
          links={[
            { href: '/journal/dad-gift-guide', label: '아빠 선물 추천, 편지와 함께 건네는 스킨케어' },
            { href: '/#letter', label: '아빠에게 편지 쓰기' },
            { href: '/journal/development-principles', label: '디어파파 제품 개발 원칙' },
          ]}
        />
      </ArticleLayout>
    </>
  );
}
