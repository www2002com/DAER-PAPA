import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { preservedMetadata } from '@/lib/preserved-metadata';
import { JOURNAL_SITE_SUFFIX, dotDate, getJournalEntry } from '@/lib/journal';

// Copied verbatim from the previous /journal/development-principles page.

const entry = getJournalEntry('development-principles');

export const metadata = preservedMetadata('/journal/development-principles');


export default function DevelopmentPrinciplesPage() {
  return (
    <>
      <ArticleLayout
        crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
        eyebrow={entry.category}
        title={entry.title}
        lead={
          <p>
            디어파파는 아빠의 일상에 자연스럽게 놓일 올인원 스킨케어를 준비합니다. 이 글은 개발 방향을 설명하며, 최종
            처방이나 시험 결과를 공개하는 제품 사양서는 아닙니다.
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
      toc={[
        { id: 'simple', label: '일상에서 손이 가는 간단한 관리' },
        { id: 'feel', label: '사용감은 목표와 결과를 나누어 설명합니다' },
        { id: 'public', label: '현재 공개할 수 있는 정보' },
        { id: 'evidence', label: '확정된 정보에 근거를 더하겠습니다' },
      ]}
        footer={
          <nav aria-label="글 하단 메뉴" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
            <Link href="/journal">자료실 목록으로</Link>
            <Link href="/#letter">아빠에게 편지 쓰기</Link>
          </nav>
        }
      >
        <h2 id="simple">일상에서 손이 가는 간단한 관리</h2>
        <p>
          선물한 제품이 아빠의 생활 속에서 쓰이려면 사용 과정부터 이해하기 쉬워야 한다고 생각합니다. 디어파파의 제품
          개발 방향은 세안 후 하나로 마무리하는 남성 올인원 스킨케어입니다.
        </p>
        <p>
          ‘올인원’은 현재 준비 중인 제품의 방향입니다. 모든 사람에게 여러 제품과 동일한 효과를 낸다는 의미나, 다른 피부
          관리가 필요 없다는 의미로 사용하지 않습니다.
        </p>

        <h2 id="feel">사용감은 목표와 결과를 나누어 설명합니다</h2>
        <p>
          매일 사용하는 제품인 만큼 바르는 과정과 사용 후의 느낌을 중요하게 생각합니다. 다만 사용감은 표현만으로 확인할
          수 있는 정보가 아닙니다.
        </p>
        <p>
          현재 자료실에는 특정 성분 함량, 피부 자극 지수 등 확정되지 않은 수치를 제품 사실로 기재하지 않습니다. 제형
          역시 최종 제품이 확정된 뒤 구체적으로 안내할 항목입니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는
          방향으로 기획하고 만들고 있습니다.
        </p>

        <h2 id="public">현재 공개할 수 있는 정보</h2>
        <p>개발 방향과 판매 제품의 확정 사양은 구분해서 확인해 주세요. 아래 상태는 이 글의 수정일을 기준으로 합니다.</p>
        <FactList
          rows={[
            ['제품 방향', '아빠를 위한 올인원 스킨케어'],
            ['최종 처방·전성분', '미확정'],
            ['용량', 'DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다.'],
            ['가격·출시일', '미확정'],
            ['최종 판매 구성', '미확정'],
            ['제품 이미지', '개발 중인 디자인 시안'],
          ]}
        />

        <h2 id="evidence">확정된 정보에 근거를 더하겠습니다</h2>
        <p>
          향후 성분과 사용법을 공개할 때에는 실제 판매 제품의 정보와 일치하도록 정리하겠습니다. 시험 결과를 공개하게
          되면 시험 대상, 방법, 조건과 결과의 적용 범위도 함께 설명하겠습니다.
        </p>
        <p>
          자료가 갱신되면 글의 수정일을 바꾸고, 필요한 경우 별도의 제품 자료로 연결하겠습니다. 준비 중인 목표가 완료된
          검증 결과로 읽히지 않도록 관리하겠습니다.
        </p>

        <RelatedLinks
          title="함께 확인할 자료"
          links={[
            { href: '/#product', label: '디어파파 제품 소개와 준비 상황' },
            { href: '/journal/brand-identity', label: '디어파파 브랜드 소개' },
          ]}
        />
      </ArticleLayout>
    </>
  );
}
