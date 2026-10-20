// 브랜드 자료실 entries, in the legacy list order (/journal).
// title = article h1 (and og:title), summary = list summary (and meta description),
// published / modified = the 발행 / 수정 dates shown on each article page.

export type JournalEntry = {
  slug: string;
  href: string;
  category: string;
  title: string;
  summary: string;
  /** ISO date (YYYY-MM-DD) */
  published: string;
  /** ISO date (YYYY-MM-DD) */
  modified: string;
};

export const JOURNAL: readonly JournalEntry[] = [
  {
    slug: 'brand-identity',
    href: '/journal/brand-identity',
    category: '브랜드 소개',
    title: '디어파파가 전하고 싶은 마음',
    summary:
      'DEAR PAPA의 공식 표기와 브랜드 방향, 현재 준비 상황을 소개합니다. 아빠의 매일에 딸의 마음이 남는 선물을 준비합니다.',
    published: '2026-10-11',
    modified: '2026-10-19',
  },
  {
    slug: 'development-principles',
    href: '/journal/development-principles',
    category: '제품 개발',
    title: '매일 쓰는 제품을 준비하는 기준',
    summary: '디어파파의 올인원 스킨케어 개발 방향과 아직 확정되지 않은 제품 정보를 구분해 안내합니다.',
    published: '2026-10-11',
    modified: '2026-10-19',
  },
  {
    slug: 'fathers-gift-guide',
    href: '/journal/fathers-gift-guide',
    category: '선물 이야기',
    title: '아빠 선물 스킨케어, 일상에 맞게 고르는 법',
    summary:
      '아빠에게 스킨케어를 선물하기 전 살펴볼 취향과 생활 습관, 함께 전할 짧은 편지에 관한 디어파파의 제안입니다.',
    published: '2026-10-11',
    modified: '2026-10-16',
  },
  {
    slug: 'dad-gift-guide',
    href: '/journal/dad-gift-guide',
    category: '선물 이야기',
    title: '아빠 선물 추천, 편지와 함께 건네는 스킨케어',
    summary: '편지와 함께 건네는 아빠 선물, DEAR PAPA(디어파파). 아빠를 위한 올인원 스킨케어.',
    published: '2026-10-17',
    modified: '2026-10-17',
  },
];

export const JOURNAL_SITE_SUFFIX = ' | DEAR PAPA 디어파파';

export function getJournalEntry(slug: string): JournalEntry {
  const entry = JOURNAL.find((e) => e.slug === slug);
  if (!entry) throw new Error(`Unknown journal entry: ${slug}`);
  return entry;
}

/** '2026-10-19' → '2026.10.19' (the legacy display format). */
export function dotDate(iso: string): string {
  return iso.split('-').join('.');
}
