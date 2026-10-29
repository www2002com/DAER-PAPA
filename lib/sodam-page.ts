// /sodam v4 캐릭터 소개 페이지 문구.
// 원고: /workspace/dearpapa/content/character/sodam-v2-three-drafts-v1-2026-10-28.md
// 써니 06:14 FAQ 확정. 표기 「Sodam」, 한글 첫 언급 「Sodam(소담)」. AI·챗봇·상담 호칭 금지. 「소담이」는 승인된 이름 뜻 한 줄에만 씀.
// 이미지: brand/character 공식 6컷만 (다시 그리거나 자르지 않음).

export type ProfileRow = { label: string; value: string };

export const SODAM_CUTS = [
  { src: '/images/sodam-v2/sodam-v2-basic.webp', alt: 'Sodam 기본 컷', width: 465, height: 585, label: 'basic' },
  { src: '/images/sodam-v2/sodam-v2-front.webp', alt: 'Sodam 정면 컷', width: 265, height: 325, label: 'front' },
  { src: '/images/sodam-v2/sodam-v2-side.webp', alt: 'Sodam 옆모습 컷', width: 250, height: 325, label: 'side' },
  { src: '/images/sodam-v2/sodam-v2-back.webp', alt: 'Sodam 뒷모습 컷', width: 265, height: 325, label: 'back' },
  { src: '/images/sodam-v2/sodam-v2-scarf.webp', alt: 'Sodam 스카프 컷', width: 490, height: 240, label: 'scarf' },
  { src: '/images/sodam-v2/sodam-v2-palette.webp', alt: 'Sodam 색 팔레트', width: 430, height: 250, label: 'palette' },
] as const;

export const SODAM_PAGE = {
  path: '/sodam',
  url: 'https://dearpapa.kr/sodam',
  title: 'Sodam 소개, 디어파파의 토끼 캐릭터 | 디어파파 DEAR PAPA',
  description:
    'Sodam(소담)은 디어파파(DEAR PAPA)의 토끼 캐릭터예요. 아빠에게 한 줄 편지를 쓰도록 거드는 조용한 친구예요. dearpapa.kr에서 가입 없이 한 줄 편지를 쓸 수 있어요.',
  eyebrow: 'CHARACTER',
  heading: 'Sodam을 소개할게요',
  /** /sodam v4 첫 문단 — 콘텐츠 담당 초안·써니 지시 반영. 첫 문장 고정. */
  intro:
    'Sodam(소담)은 디어파파(DEAR PAPA)의 토끼 캐릭터예요. 마음을 건네는 조용한 친구로, 말보다 먼저 곁에 앉아, 아빠에게 쓸 첫 줄을 같이 기다려 줘요. 조금 비대칭이어도 괜찮아요. 일단 한 줄이면 돼요. 디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요.',
  portraitAlt: 'Sodam 기본 컷 — 디어파파의 토끼 캐릭터',

  profile: {
    title: '프로필',
    intro: '저는 Sodam이에요.',
    rows: [
      { label: '이름', value: 'Sodam' },
      { label: '하는 일', value: '한 줄 편지를 거드는 조용한 친구' },
      { label: '특기', value: '쑥스러운 말을 한 줄로 줄이기' },
    ] satisfies ProfileRow[],
    /** 이름 유래 한 줄. 대표님 지시(소중함을 담다) 반영. */
    showNameOrigin: true,
    nameOriginLine: "소담이는 '소중함을 담다'에서 온 이름이에요.",
  },

  roleTitle: 'Sodam이 하는 일',
  role: '아빠에게 하고 싶은 말이 있는데 첫 줄이 떠오르지 않을 때, Sodam은 곁에서 한 줄 편지를 같이 기다려 줘요. 문장을 적으면 그 자리에서 편지 카드 미리보기에 바로 나타나서, 아빠가 받을 모습을 보며 고쳐 쓸 수 있어요.',

  toneTitle: 'Sodam의 말투',
  toneLead: 'Sodam은 편지 쓰는 사람에게 친구처럼 편하게 말해요.',
  toneExamples: ['고민돼? 나에게 편하게 털어봐.', '일단 한 줄 써 봐, 각 잡지 말고.'],
  toneOutro: '길고 멋진 글이 아니어도 괜찮아요. 말로 하기 쑥스러운 마음도 한 줄이면 충분해요.',

  cta: { href: '/#letter', label: 'Sodam과 한 줄 편지 써보기' },

  howTitle: 'Sodam과 편지 쓰는 법',
  howSteps: [
    '「Sodam과 한 줄 편지 써보기」를 눌러요.',
    '아빠에게 하고 싶은 말을 한 줄로 적어요.',
    '다 쓴 편지는 카드 이미지(PNG)로 저장하거나, 이 기기의 보관함에 담아 둘 수 있어요.',
  ],
  howNote:
    '가입은 필요 없어요. 쓴 편지는 이 기기의 브라우저에만 보관되고 서버로 보내지 않아요. 브라우저 기록을 지우면 함께 사라지니, 소중한 편지는 이미지로도 저장해 두세요.',

  anyoneTitle: '누구나 Sodam과 편지를 쓸 수 있어요',
  anyone: '아빠께 마음을 전하고 싶은 분이라면 누구나 Sodam과 함께 한 줄 편지를 쓸 수 있어요.',

  laterTitle: '편지는 나중에 선물과 함께',
  laterTag: '출시 후 계획',
  later:
    '출시 후 계획: 주문할 때 확인한 편지를 손글씨 스타일 서체로 인쇄한 카드에 담아 제품과 함께 보낼 예정이에요. 사람이 직접 손으로 쓰는 카드는 아니에요. 자세한 방법은 출시 때 안내드릴게요.',

  productBox: {
    name: '디어파파 레터 올인원',
    body: '아빠를 위한 올인원 스킨케어예요. 150ml 올인원 한 가지로 기획하고 있어요.',
    link: { href: '/letter-all-in-one', label: '제품 알아보기' },
    image: '/images/campaign-blue/bottle.webp',
    imageAlt: '디어파파 레터 올인원 블루 용기 디자인 시안',
    caption: '용기와 단상자는 개발 중인 디자인 시안입니다.',
  },

  cutsTitle: '공식 컷',
  cutsNote: '공식 이미지 6장이에요. 움직임이나 다시 그린 그림은 쓰지 않아요.',

  faqTitle: '자주 묻는 질문',
  faq: [
    {
      q: 'Sodam은 누구예요?',
      a: '디어파파(DEAR PAPA)의 토끼 캐릭터예요. 아빠에게 한 줄 편지를 쓰도록 거드는 조용한 친구예요.',
    },
    {
      q: 'Sodam과 편지를 쓰려면 가입해야 하나요?',
      a: '아니요. 가입 없이 dearpapa.kr에서 바로 쓸 수 있고, 편지는 이 기기의 브라우저에만 보관돼요.',
    },
    {
      q: 'Sodam이 피부나 제품에 대해 알려 주나요?',
      a: '아니요. Sodam은 아빠에게 보낼 한 줄 편지 쓰기만 거들어요. 제품 정보는 레터 올인원 페이지에서 볼 수 있어요.',
    },
  ],

  notice: '디어파파 레터 올인원은 출시 준비 중이며 가격·출시일은 미정입니다.',
} as const;

/** 화면에 낼 프로필 줄: 값이 빈 줄은 숨긴다. */
export const visibleProfileRows = (rows: readonly ProfileRow[] = SODAM_PAGE.profile.rows) =>
  rows.filter((row) => row.value.trim() !== '');

/** WebPage + FAQPage. No Product/Offer, no profile values. */
export function sodamJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SODAM_PAGE.url}#webpage`,
        url: SODAM_PAGE.url,
        name: SODAM_PAGE.title,
        description: SODAM_PAGE.description,
        inLanguage: 'ko-KR',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `https://dearpapa.kr${SODAM_CUTS[0].src}`,
        },
        isPartOf: { '@type': 'WebSite', url: 'https://dearpapa.kr/', name: 'DEAR PAPA 디어파파' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SODAM_PAGE.url}#faq`,
        inLanguage: 'ko-KR',
        isPartOf: { '@id': `${SODAM_PAGE.url}#webpage` },
        mainEntity: SODAM_PAGE.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };
}
