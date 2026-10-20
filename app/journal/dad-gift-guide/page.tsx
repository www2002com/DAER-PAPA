import Link from 'next/link';
import { ArticleLayout, FactList, RelatedLinks } from '@/components/article/ArticleLayout';
import { preservedMetadata } from '@/lib/preserved-metadata';
import { JOURNAL_SITE_SUFFIX, dotDate, getJournalEntry } from '@/lib/journal';

// Copied verbatim from the previous /journal/dad-gift-guide page.

const entry = getJournalEntry('dad-gift-guide');

export const metadata = preservedMetadata('/journal/dad-gift-guide');


export default function DadGiftGuidePage() {
  return (
    <>
      <ArticleLayout
        crumbs={[{ href: '/journal', label: '브랜드 자료실' }]}
        eyebrow={entry.category}
        title={entry.title}
        lead={<p>편지와 함께 건네는 아빠 선물, DEAR PAPA(디어파파). 아빠를 위한 올인원 스킨케어.</p>}
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
        <h2>딸의 한 줄 편지에서 시작한 선물</h2>
        <p>DEAR PAPA는 딸이 아빠에게 건네는 한 줄 편지에서 시작했습니다.</p>
        <p>
          매일 바르는 스킨케어에 마음을 담은 짧은 편지를 더해, 평소에 하지 못한 말을 선물과 함께 전할 수 있도록 준비하고
          있습니다.
        </p>

        <h2>지금 쓸 수 있는 편지 기능</h2>
        <p>
          사이트에서 아빠에게 보낼 편지를 쓰고 카드 이미지(PNG)로 저장할 수 있습니다. 작성한 편지는 이 기기의
          브라우저에만 보관되며 서버로 전송하지 않습니다.
        </p>

        <h2>출시 후 계획</h2>
        <p>
          주문 시 확인한 편지를 손글씨 스타일 서체(나눔 펜 스크립트)로 인쇄한 카드에 담아 제품과 함께 보낼 예정입니다.
          사람이 직접 손으로 쓰는 카드는 아닙니다.
        </p>

        <h2>아직 정해지지 않은 정보</h2>
        <p>사이트에 나온 용기·상자·카드 그림은 개발 중인 디자인 시안이며, 최종 판매 구성과 다를 수 있습니다.</p>
        <p>가격, 용량, 전성분, 출시일은 미정입니다.</p>
        <p>현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.</p>

        <RelatedLinks
          title="함께 확인할 자료"
          links={[
            { href: '/journal/fathers-gift-guide', label: '아빠 선물 스킨케어, 일상에 맞게 고르는 법' },
            { href: '/about/facts', label: '디어파파 공식 정보' },
            { href: '/#letter', label: '아빠에게 편지 쓰기' },
          ]}
        />

        <h2 id="official-info">공식 정보</h2>
        <FactList
          rows={[
            ['기준일', <time dateTime="2026-10-17">2026년 10월 17일</time>],
            ['공식 사이트', <Link href="/about/facts">https://dearpapa.kr</Link>],
            ['출시 상태', '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.'],
            ['미정 항목', '가격, 용량, 전성분, 출시일은 미정입니다.'],
          ]}
        />
      </ArticleLayout>
    </>
  );
}
