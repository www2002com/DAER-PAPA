import { CONTACT_EMAIL, LETTER, NAMING, PRODUCT, UNDECIDED } from './facts';

// /about/making 「만드는 기록」 (2026-10-26). A dated log of facts already public on dearpapa.kr.
// Dates are the day each fact first reached the live site (git history of main, KST); the sentences are the
// current wording from lib/facts.ts (= /about/facts). Do not add new product facts here; change /about/facts first.
// Excluded on purpose: founder/family story, brand origin story, logo story (LETTER.story, BRAND.logo).

export const MAKING_PATH = '/about/making';
export const MAKING_URL = `https://dearpapa.kr${MAKING_PATH}`;
export const MAKING_PUBLISHED = '2026-10-26';
export const MAKING_MODIFIED = '2026-10-26';
export const MAKING_TITLE = '디어파파 만드는 기록';
export const MAKING_META_TITLE = '만드는 기록, 디어파파 레터 올인원 출시 전 준비 과정 | 디어파파 DEAR PAPA';
export const MAKING_DESCRIPTION =
  '디어파파(DEAR PAPA)가 사이트에 공개한 사실을 처음 올린 날짜 순으로 모았어요. 제품명, 면도 후 바르는 올인원 기획 방향, 2중 기능성화장품 심사 준비, 표기 기준, 편지 쓰기 기능, 문의 메일까지. 출시 전이며 가격·전성분·출시일은 아직 확정되지 않았어요.';

export type MakingEntry = {
  date: string;
  title: string;
  lines: string[];
  rows?: readonly (readonly [string, string])[];
};

export const MAKING_LOG: MakingEntry[] = [
  {
    date: '2026-10-13',
    title: '공식 정보 페이지와 편지 쓰기 기능 공개',
    lines: [LETTER.feature, LETTER.printPlan, UNDECIDED.status, PRODUCT.drafts],
  },
  {
    date: '2026-10-14',
    title: '제품명과 쓰임',
    lines: [PRODUCT.nameLine, `${PRODUCT.usage}입니다.`],
  },
  {
    date: '2026-10-18',
    title: '개발 방향',
    lines: [PRODUCT.concern],
  },
  {
    date: '2026-10-19',
    title: '제형·성분 방향, 기능성 심사 준비, 용량, 선물 구조, 표기 기준',
    lines: [
      PRODUCT.afterShave,
      PRODUCT.noAdded,
      PRODUCT.texture,
      UNDECIDED.sizeLine,
      PRODUCT.giftStructure,
      PRODUCT.container,
    ],
    rows: [...NAMING, ['유튜브', '@dearpapa_kr ( https://www.youtube.com/@dearpapa_kr )']],
  },
  {
    date: '2026-10-20',
    title: '후기',
    lines: [PRODUCT.reviews],
  },
  {
    date: '2026-10-22',
    title: '문의 메일',
    lines: [],
    rows: [['문의', CONTACT_EMAIL]],
  },
  {
    date: '2026-10-25',
    title: '누구를 위해 만드는지',
    lines: [PRODUCT.allAges],
  },
];

export const MAKING_NOT_YET: string[] = [UNDECIDED.tbd, UNDECIDED.ingredients, UNDECIDED.seller, PRODUCT.resultsFirst];
