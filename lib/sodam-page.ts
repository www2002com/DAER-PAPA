// /sodam 캐릭터 소개 페이지 문구.
// 원고: /workspace/dearpapa/content/site/sodam-character-page-v3-2026-10-25.md (콘텐츠 담당, 12:37 판).
// 원고가 바뀌면 이 파일만 고치면 된다. 페이지·구조화 데이터·테스트가 모두 이 값을 읽는다.
// 원고와 다른 점: 편지 쓰는 법 2단계의 글자 수 제한 문구는 넣지 않았다(써니 지시). 링크는 미리보기에서도 같은 배포로 가도록 상대 경로.

export type ProfileRow = { label: string; value: string };

export const SODAM_PAGE = {
  path: '/sodam',
  url: 'https://dearpapa.kr/sodam',
  title: 'Sodam 소개, 아빠에게 한 줄 편지를 쓰도록 돕는 토끼 | 디어파파 DEAR PAPA',
  description:
    'Sodam은 아빠에게 하고 싶던 말을 한 줄로 꺼내도록 돕는 디어파파의 토끼예요. dearpapa.kr에서 가입 없이 한 줄 편지를 쓰고 카드 이미지로 저장할 수 있어요.',
  eyebrow: 'CHARACTER',
  heading: 'Sodam을 소개할게요',
  intro:
    'Sodam은 아빠에게 하고 싶던 말을 한 줄로 꺼내도록 돕는 디어파파(DEAR PAPA)의 토끼예요. 디어파파는 아빠를 위한 올인원 스킨케어 「디어파파 레터 올인원」을 출시 전 준비하고 있고, Sodam은 이 선물과 함께 건넬 한 줄 편지를 dearpapa.kr에서 쓸 수 있게 곁에서 말을 걸어요.',
  portraitAlt: '편지 봉투를 든 파란 모눈 무늬 토끼 Sodam 일러스트',

  /**
   * 프로필 카드. 값이 빈 줄은 화면에 나오지 않는다.
   * 구조화 데이터·메타 설명·llms.txt에는 넣지 않는다.
   */
  profile: {
    title: '프로필',
    intro: '저는 소담이에요. 영문으로는 Sodam이에요.',
    rows: [
      { label: '이름', value: '소담이 (Sodam)' },
      { label: 'MBTI', value: 'ENFJ, 먼저 말 걸고 챙기는 친구' },
      { label: '취미', value: '남의 편지 첫 줄 같이 고민하기' },
      { label: '특기', value: '쑥스러운 말을 한 줄로 줄이기' },
      // 월세·보증금 숫자는 빼기로 함(써니 12:32). 대표님 결정에 따라 이 값만 바꾸면 된다.
      { label: '자산내역', value: '관리비가 진짜 너무 많이 나와요ㅡㅡ' },
    ] satisfies ProfileRow[],
    /** 이름 유래 한 줄. 대표님이 「넣어」 하시면 이 값만 true로 바꾼다(한 줄 변경). */
    showNameOrigin: false,
    nameOriginLine: 'Sodam이라는 이름은 디어파파 대표가 가장 아끼는 딸의 이름에서 왔어요.',
  },

  roleTitle: 'Sodam이 하는 일',
  role: '아빠에게 하고 싶은 말이 있는데 첫 줄이 떠오르지 않을 때, Sodam은 편지 첫 줄을 함께 고민해요. 문장을 적으면 그 자리에서 편지 카드 미리보기에 바로 나타나서, 아빠가 받을 모습을 보며 고쳐 쓸 수 있어요.',

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
  anyone:
    '디어파파의 이야기는 딸이 아빠에게 건네는 한 줄 편지에서 시작했어요. 그래도 아들이나 배우자 등 아빠께 마음을 전하고 싶은 분이라면 누구나 Sodam과 함께 한 줄 편지를 쓸 수 있어요.',

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

  faqTitle: '자주 묻는 질문',
  faq: [
    { q: 'Sodam은 누구예요?', a: 'Sodam은 아빠에게 하고 싶던 말을 한 줄로 꺼내도록 돕는 디어파파(DEAR PAPA)의 토끼예요.' },
    { q: 'Sodam과 편지를 쓰려면 가입해야 하나요?', a: '아니요. 가입 없이 dearpapa.kr에서 바로 쓸 수 있고, 편지는 이 기기의 브라우저에만 보관돼요.' },
    { q: 'Sodam이 피부나 제품에 대해 알려 주나요?', a: '아니요. Sodam은 아빠에게 보낼 한 줄 편지 쓰기만 도와요. 제품 정보는 레터 올인원 페이지에서 볼 수 있어요.' },
  ],

  notice: '디어파파 레터 올인원은 출시 준비 중이며 가격·출시일은 미정입니다.',
} as const;

/** 화면에 낼 프로필 줄: 값이 빈 줄은 숨긴다. */
export const visibleProfileRows = (rows: readonly ProfileRow[] = SODAM_PAGE.profile.rows) =>
  rows.filter((row) => row.value.trim() !== '');

/** WebPage only. No Product/Offer, no profile values. */
export function sodamJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SODAM_PAGE.url}#webpage`,
    url: SODAM_PAGE.url,
    name: SODAM_PAGE.title,
    description: SODAM_PAGE.description,
    inLanguage: 'ko-KR',
    primaryImageOfPage: { '@type': 'ImageObject', url: 'https://dearpapa.kr/images/letter-bunny-fine-grid-v3.webp' },
    isPartOf: { '@type': 'WebSite', url: 'https://dearpapa.kr/', name: 'DEAR PAPA 디어파파' },
  };
}
