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
    modified: '2026-10-22',
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
  {
    slug: 'gift-without-routine',
    href: '/journal/gift-without-routine',
    category: '선물 이야기',
    title: '아빠가 뭘 쓰시는지 몰라도 괜찮아요: 스킨케어 선물 고르는 기준',
    summary: '아빠의 스킨케어 루틴을 몰라도 고를 수 있는 선물 기준. 단계는 하나로, 향료는 빼는 쪽으로, 면도 후 바로 쓰기 편한지 살펴보세요.',
    published: '2026-10-21',
    modified: '2026-10-21',
  },
  {
    slug: 'after-shave-gift',
    href: '/journal/after-shave-gift',
    category: '선물 이야기',
    title: '면도 후 아빠 스킨케어, 선물 고를 때 볼 세 가지',
    summary: '면도 후 아빠에게 줄 스킨케어는 향이 없는지, 에탄올이 들어 있지 않은지, 바르기 쉬운 한 단계인지부터 보면 됩니다.',
    published: '2026-10-22',
    modified: '2026-10-23',
  },
  {
    slug: 'dad-gift-skincare-guide',
    href: '/journal/dad-gift-skincare-guide',
    category: '선물 이야기',
    title: '아빠 선물 화장품, 생신 선물 스킨케어 고르는 기준 7가지',
    summary: '아빠 선물용 화장품은 아빠의 피부 타입, 향이 있는지, 에탄올이 들어 있는지, 바르는 단계 수, 용량, 전성분, 예산 순서로 고르면 실패가 적습니다.',
    published: '2026-10-22',
    modified: '2026-10-22',
  },
  {
    slug: 'dad-allinone-how-to-choose',
    href: '/journal/dad-allinone-how-to-choose',
    category: '선물 이야기',
    title: '40~60대 아빠 올인원 고르는 법, 피부 타입·향료·단계 수로 보는 기준',
    summary: '40~60대 아빠의 올인원은 피부 타입, 향료가 들어 있는지, 에탄올이 들어 있는지, 바르는 단계 수, 면도 후에 쓰기 편한지, 전성분 순서로 확인하면 고르기 쉽습니다.',
    published: '2026-10-22',
    modified: '2026-10-22',
  },
  {
    slug: 'allinone-3-questions',
    href: '/journal/allinone-3-questions',
    category: '선물 이야기',
    title: '올인원 사기 전에 많이 묻는 3가지 (겨울 보습·면도 후·가격)',
    summary: "보습은 피부 상태와 계절을, 면도 후 사용은 용도와 전성분을, 가격은 용량과 사용 기간을 보면 됩니다.",
    published: '2026-10-23',
    modified: '2026-10-23',
  },
  {
    slug: 'fragrance-alcohol-free-allinone',
    href: '/journal/fragrance-alcohol-free-allinone',
    category: '선물 이야기',
    title: "향료·변성알코올 없는 올인원 고르는 법",
    summary: "전성분표에서 「향료」, 향 성분 이름, 에센셜오일, 「변성알코올」「에탄올」 표기를 찾고, 위치와 순서를 함께 보면 됩니다. 제품 설명의 문구보다 전성분표가 먼저입니다.",
    published: '2026-10-23',
    modified: '2026-10-23',
  },
  {
    slug: 'dad-skincare-gift-types',
    href: '/journal/dad-skincare-gift-types',
    category: '선물 이야기',
    title: '아빠 선물 추천 화장품, 40~60대 아빠 스킨케어 선물 종류별 비교: 피부 타입·향·사용 단계',
    summary: '아빠가 평소 몇 단계를 바르시는지, 피부가 번들거리는 편인지 당기는 편인지, 향을 좋아하시는지 세 가지만 먼저 확인하면 선물 종류가 거의 정해져요.',
    published: '2026-10-23',
    modified: '2026-10-23',
  },
];

/** guide-04 meta/og description and lead (longer than the list summary). */
export const GIFT_WITHOUT_ROUTINE_DESCRIPTION =
  '아빠의 스킨케어 루틴을 몰라도 고를 수 있는 선물 기준. 단계는 하나로, 향료는 빼는 쪽으로, 면도 후 바로 쓰기 편한지 살펴보세요. 디어파파는 출시 준비 중이며 가격·전성분·출시일은 아직 확정되지 않았습니다.';

/** after-shave-gift meta/og description (sentences taken verbatim from the article). */
export const AFTER_SHAVE_GIFT_DESCRIPTION =
  '면도 후 아빠에게 줄 스킨케어는 향이 없는지, 에탄올이 들어 있지 않은지, 바르기 쉬운 한 단계인지부터 보면 됩니다. 디어파파는 아직 출시 전입니다.';

/** dad-gift-skincare-guide meta/og description (sentence taken verbatim from the article). */
export const DAD_GIFT_SKINCARE_GUIDE_DESCRIPTION =
  '아빠 선물용 화장품은 아빠의 피부 타입, 향이 있는지, 에탄올이 들어 있는지, 바르는 단계 수, 용량, 전성분, 예산 순서로 고르면 실패가 적습니다.';

/** dad-allinone-how-to-choose meta/og description (한 줄 답, verbatim from the article). */
export const DAD_ALLINONE_HOW_TO_CHOOSE_DESCRIPTION =
  '40~60대 아빠의 올인원은 피부 타입, 향료가 들어 있는지, 에탄올이 들어 있는지, 바르는 단계 수, 면도 후에 쓰기 편한지, 전성분 순서로 확인하면 고르기 쉽습니다.';

/** dad-allinone-how-to-choose visible FAQ; the FAQPage JSON-LD is built from this, so both match exactly. */
export const DAD_ALLINONE_HOW_TO_CHOOSE_FAQ = [
  { q: '50대 아빠에게 올인원 하나면 충분한가요?', a: '여러 단계를 챙기지 않는 아빠라면 세안 후 한 가지로 마무리하는 올인원이 쓰기 편합니다. 낮에는 자외선 차단제를 따로 바르세요.' },
  { q: '60대 아빠도 같은 기준으로 고르면 되나요?', a: '네. 나이보다 피부 타입, 향료, 에탄올, 단계 수, 전성분을 기준으로 보면 됩니다.' },
  { q: '올인원과 스킨로션 세트 중 무엇이 나을까요?', a: '한 단계만 바르고 싶다면 올인원, 단계별로 나눠 바르는 데 익숙하다면 스킨·로션이 맞습니다.' },
  { q: '디어파파 레터 올인원의 전성분은 무엇인가요?', a: '아직 확정되지 않았습니다. 정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.' },
  { q: '레터 올인원의 가격과 출시일은요?', a: '아직 확정되지 않았습니다.' },
  { q: '지금 어디에서 살 수 있나요?', a: '판매처는 아직 확정되지 않았습니다. 디어파파는 출시 준비 중이며 지금 판매 중인 제품은 없습니다.' },
  { q: '문의는 어디로 하나요?', a: 'hello@dearpapa.kr로 보내 주세요.' },
] as const;

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

/** 2026-10-23 search meta (title/description/og only; H1·article JSON-LD unchanged). */
export const GIFT_WITHOUT_ROUTINE_META_TITLE = '화장품 안 쓰는 아빠 첫 선물 | 디어파파 DEAR PAPA';
export const GIFT_WITHOUT_ROUTINE_META_DESCRIPTION =
  '아빠가 평소 화장품을 거의 안 쓰신다면 세안 후 하나로 마무리하는 올인원부터. 단계 수, 향료가 들어 있는지, 면도 후 바르기 편한지 보는 기준을 정리했습니다.';
export const AFTER_SHAVE_GIFT_META_TITLE = '면도 후 바르는 아빠 스킨케어 | 디어파파 DEAR PAPA';
export const AFTER_SHAVE_GIFT_META_DESCRIPTION =
  '면도 후 바르는 아빠 스킨케어는 향이 있는지, 에탄올이 들어 있는지, 한 단계로 바르기 쉬운지부터 보세요. 애프터셰이브·로션과 올인원의 차이도 정리했습니다.';
export const DAD_GIFT_SKINCARE_GUIDE_META_TITLE = '아빠 선물 화장품 고르는 법 7가지 | 디어파파 DEAR PAPA';
export const DAD_GIFT_SKINCARE_GUIDE_META_DESCRIPTION =
  '50대·60대 아빠 생신이나 어버이날 화장품 선물은 피부 타입(지성·건성·민감), 향, 에탄올, 바르는 단계 수, 용량, 전성분 순서로 보면 고르기 쉽습니다.';
export const DAD_ALLINONE_HOW_TO_CHOOSE_META_TITLE = '50대 남자 올인원 고르는 법 | 디어파파 DEAR PAPA';
export const DAD_ALLINONE_HOW_TO_CHOOSE_META_DESCRIPTION =
  '50대·60대 남자 올인원은 지성·건성·민감 피부 타입, 무향인지, 에탄올이 들어 있는지, 몇 단계로 바르는지, 면도 후 바르기 편한지, 전성분 순서로 확인하면 고르기 쉽습니다.';

/** after-shave-gift FAQ: the visible Q&A and the FAQPage JSON-LD both render from this array. */
export const AFTER_SHAVE_GIFT_FAQ = [
  {
    q: '지금 살 수 있나요?',
    a: '아니요. 디어파파는 아직 출시 전입니다. 정확한 정보는 공식 사이트 dearpapa.kr에서 안내합니다.',
  },
  {
    q: '면도 후에 바를 제품은 무엇을 보고 고르나요?',
    a: '면도 후 용도인지, 전성분에 무엇이 들었는지 먼저 확인하세요. 피부가 민감하다면 사용 전에 전성분과 사용상 주의사항을 먼저 읽어 보시길 권합니다. 피부 반응은 사람마다 다르니 이상이 생기면 사용을 멈추세요.',
  },
  {
    q: '디어파파 레터 올인원은 면도 후에 바를 수 있나요?',
    a: '디어파파 레터 올인원은 면도 후 바르는 올인원으로, 「변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다.」 전성분은 제조사 샘플이 나온 뒤 공개하고, 사용상 주의사항은 출시 때 안내합니다.',
  },
];

/** allinone-3-questions meta/og description (한 줄로 정리하면?, verbatim from the article). */
export const ALLINONE_3_QUESTIONS_DESCRIPTION =
  "보습은 피부 상태와 계절을, 면도 후 사용은 용도와 전성분을, 가격은 용량과 사용 기간을 보면 됩니다.";
export const ALLINONE_3_QUESTIONS_META_TITLE = '올인원 사기 전 3가지 질문: 겨울 보습, 면도 후, 가격 | 디어파파 DEAR PAPA';

/** allinone-3-questions: each visible question lists its points; the FAQPage answer joins the same points, so both match. */
export const ALLINONE_3_QUESTIONS_FAQ = [
  { q: "40~60대인데 세안 후 얼굴이 당겨요. 올인원만으로 보습이 충분할까요?", points: ["바로 답: 피부 상태와 계절에 따라 다릅니다. 하나로 충분한 사람도 있고, 더 필요한 사람도 있어요.", "맞는 조건: 세안 직후 피부가 촉촉할 때 바르면 보습에 도움이 된다고 미국피부과학회는 안내합니다. 같은 학회는 나이가 들면서 피부가 더 건조해질 수 있다고 설명합니다.", "확인할 근거: 제품이 보습 지속에 대해 어떤 시험을, 어떤 조건에서 했는지 봅니다. 근거 없이 시간을 약속하는 문구는 그대로 믿지 않는 것이 좋아요.", "맞지 않는 경우: 오후나 겨울 난방 속에서 계속 당긴다면 당기는 부위에 덧바르거나 보습제를 하나 더하는 방법을 생각해 보세요."] },
  { q: "면도하고 바로 발라도 될까요? 민감한 피부에도 맞나요?", points: ["바로 답: 면도 후에 바르는 용도로 나온 제품인지부터 확인하세요.", "맞는 조건: 미국피부과학회는 면도 후 보습을 권하고, 민감한 피부라면 향료가 든 제품을 주의하라고 안내합니다.", "확인할 근거: 제품 설명에 면도 후 사용이 적혀 있는지, 전성분에 무엇이 들었는지 봅니다.", "맞지 않는 경우: 바른 뒤 피부에 이상이 생기면 사용을 멈추고 전문가와 상담하세요. 피부 반응은 사람마다 다릅니다."] },
  { q: "비싼 올인원이 더 좋은가요? 얼마나 써야 알 수 있나요?", points: ["바로 답: 가격이 높다고 꼭 더 맞는 것은 아닙니다.", "맞는 조건: 미국피부과학회는 제품을 고를 때 피부 타입, 현실적인 기대, 예산을 함께 고려하라고 안내합니다.", "확인할 근거: 용량을 하루 사용량으로 나눠 한 통으로 얼마나 쓰는지 계산해 보세요. 스킨과 로션을 따로 살 때의 비용과도 같은 방식으로 비교할 수 있어요. 효과를 말하는 문구가 있다면 시험 대상과 기간이 밝혀져 있는지 봅니다. 후기와 시험 결과는 다른 근거입니다.", "맞지 않는 경우: 바로 달라지는 것을 기대하기보다 몇 주 꾸준히 써 본 뒤 판단하는 것이 일반적입니다."] },
];

/** fragrance-alcohol-free-allinone meta/og (verbatim from the draft's 메타 제목/설명 안). */
export const FRAGRANCE_FREE_META_TITLE = "향료·변성알코올 없는 올인원 고르는 법: 전성분표 읽기 | 디어파파 DEAR PAPA";
export const FRAGRANCE_FREE_DESCRIPTION = "40~60대 아빠 올인원을 고를 때 전성분표에서 향료와 변성알코올(에탄올)을 확인하는 방법, 제형과 사용 장면 확인법을 정리했습니다.";
/** 한 줄로 정리하면? (verbatim). */
export const FRAGRANCE_FREE_SUMMARY = "전성분표에서 「향료」, 향 성분 이름, 에센셜오일, 「변성알코올」「에탄올」 표기를 찾고, 위치와 순서를 함께 보면 됩니다. 제품 설명의 문구보다 전성분표가 먼저입니다.";
/** Question sections; visible list and FAQPage answer use the same points. */
export const FRAGRANCE_FREE_FAQ = [
  { q: "전성분표는 어떻게 읽나요?", points: ["화장품 용기나 포장에는 들어간 성분이 모두 적혀 있습니다. 이것을 전성분표라고 합니다.", "성분은 대체로 많이 들어간 순서로 적고, 1% 이하로 들어간 성분은 순서 없이 적을 수 있습니다.", "착향제(향료)와 착색제도 순서와 상관없이 적을 수 있습니다(화장품법 시행규칙 별표 4).", "그래서 앞쪽에 있는 성분일수록 제품에서 차지하는 양이 많다고 보면 됩니다."] },
  { q: "향료는 전성분표에서 어떻게 찾나요?", points: ["「향료」: 여러 향 원료를 섞은 것을 한 단어로 적은 표기입니다. 이 단어가 있으면 향 원료가 들어간 제품입니다.", "향 성분 이름: 리모넨, 리날룰, 시트로넬올, 제라니올, 쿠마린처럼 향 원료 안에 든 일부 성분은 알레르기 유발 가능 성분으로 정해져 있어, 일정량 이상이면 이름을 따로 적게 되어 있습니다(사용 후 씻어내지 않는 제품은 0.001% 초과, 씻어내는 제품은 0.01% 초과). 「향료」 뒤쪽에 이런 이름이 보이면 향 원료가 들어갔다는 뜻입니다.", "에센셜오일: 라벤더오일, 오렌지껍질오일, 티트리잎오일처럼 식물에서 얻은 오일도 향을 내며, 「향료」라는 단어 없이 성분 이름으로 적힙니다. 그래서 「향료」와 함께 「…오일」로 끝나는 이름도 확인하세요.", "향이 거의 나지 않는다고 향 원료가 없다는 뜻은 아닙니다. 냄새보다 전성분표로 확인하세요."] },
  { q: "변성알코올·에탄올은 어떻게 찾나요?", points: ["표기: 「변성알코올」「에탄올」「알코올」로 적힙니다. 영문 표기는 Alcohol Denat., Ethanol, Alcohol입니다.", "위치와 순서: 정제수 바로 뒤처럼 앞쪽에 있으면 비교적 많이 들어간 것이고, 뒤쪽에 있으면 적게 들어간 것입니다.", "이름이 비슷한 성분: 세틸알코올, 세테아릴알코올, 스테아릴알코올은 지방알코올로, 에탄올과 다른 성분입니다. 「알코올」이라는 글자만 보고 같은 것으로 보지 않아도 됩니다."] },
  { q: "제형은 무엇을 보면 되나요?", points: ["묽은 워터리·젤 제형은 바르기 가볍고, 크림 제형은 더 두껍게 남는 편입니다.", "끈적임이 싫다면 손등이나 턱선에 조금 발라 보고, 몇 분 뒤 남는 느낌을 확인하세요.", "제형은 전성분표만으로 알기 어렵습니다. 제품 설명과 직접 발라 본 느낌을 함께 봅니다."] },
  { q: "세안 후, 면도 후에는 어떻게 쓰나요?", points: ["세안 후: 물기를 가볍게 닦고 피부가 아직 촉촉할 때 바르는 것이 일반적인 안내입니다. 올인원이라면 이 한 단계로 마무리합니다.", "면도 후: 제품 설명에 면도 후 사용이 적혀 있는지 먼저 봅니다. 미국피부과학회는 민감한 피부라면 향료가 든 제품을 주의하라고 안내합니다.", "바른 뒤 피부에 이상이 느껴지면 사용을 멈추고 전문가와 상담하세요. 피부 반응은 사람마다 다릅니다."] },
  { q: "이 기준이 중요한 경우는?", points: ["향이 있는 제품을 피하고 싶은 경우.", "향 원료나 에탄올에 맞지 않았던 경험이 있는 경우.", "면도 후 매일 바르는 제품이라 성분을 꼼꼼히 보고 싶은 경우.", "아빠 선물로 고르면서 받는 사람의 취향을 모르는 경우."] },
  { q: "이 기준이 덜 중요한 경우는?", points: ["향이 있는 제품을 좋아하고, 써 온 제품에 불편이 없던 경우.", "성분보다 제형이나 사용감이 더 고민인 경우. 이때는 제형 확인이 먼저입니다.", "향료나 에탄올이 없다고 해서 모든 사람에게 맞는다는 뜻은 아닙니다. 전성분 전체와 자신의 경험을 함께 보세요."] },
];
/** dad-skincare-gift-types (guide-02 v6) meta/og. */
export const DAD_SKINCARE_GIFT_TYPES_META_TITLE = '아빠 선물 화장품 종류별 비교: 피부 타입·향·사용 단계 | 디어파파 DEAR PAPA';
export const DAD_SKINCARE_GIFT_TYPES_DESCRIPTION =
  '아빠가 평소 몇 단계를 바르시는지, 피부가 번들거리는 편인지 당기는 편인지, 향을 좋아하시는지 세 가지만 먼저 확인하면 선물 종류가 거의 정해져요.';
