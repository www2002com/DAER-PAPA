// Official wording, copied verbatim from /about/facts (the brand's source of truth).
// Used by the redesigned home and FAQ. Original metadata/JSON-LD and the exact facts
// body are protected separately in preserved-site.json; see PRESERVATION.md.

export const SITE_URL = 'https://dearpapa.kr';
export const FACTS_UPDATED = '2026-10-19';
export const FACTS_UPDATED_KO = '2026년 10월 19일';

export const BRAND = {
  name: 'DEAR PAPA',
  nameKo: '디어파파',
  slogan: '아빠의 매일에, 딸의 마음을.',
  definition: '편지와 함께 건네는 아빠 선물, DEAR PAPA(디어파파). 아빠를 위한 올인원 스킨케어.',
  definitionShort: '아빠를 위한 올인원 스킨케어. 딸의 한 줄 편지와 함께 건네는 선물.',
  promise: '말로 못 한 마음을, 아빠가 매일 쓰는 스킨케어에 담아 전하게 합니다.',
  about:
    'DEAR PAPA(디어파파, dearpapa.kr)는 아빠를 위한 남성 올인원 스킨케어 브랜드예요. 딸이 쓴 한 줄 편지와 함께 아빠께 건네는 선물을 만들고 있고, 지금은 출시 준비 중이에요.',
  logo: "d(Dear)를 180° 돌리면 p(Papa)가 됩니다. 딸과 아빠가 가운데의 원 하나를 함께 쥔 모양입니다. 그 원은 브랜드의 '하나', 곧 세안 후 하나로 마무리하는 남성 올인원 스킨케어와 편지 한 장(출시 후 계획)을 뜻합니다. 로고의 모든 글자는 폰트가 아닌 직접 그린 도형입니다.",
} as const;

export const NAMING = [
  ['브랜드', 'DEAR PAPA / 디어파파'],
  ['제품명', '레터 올인원 / LETTER ALL-IN-ONE'],
  ['전체 표기', '디어파파 레터 올인원 / DEAR PAPA LETTER ALL-IN-ONE'],
  ['제품 설명', '아빠를 위한 올인원 스킨케어 / All-in-One Skincare for Dads'],
  ['슬로건', '아빠의 매일에, 딸의 마음을.'],
] as const;

export const PRODUCT = {
  name: '디어파파 레터 올인원',
  nameEn: 'DEAR PAPA LETTER ALL-IN-ONE',
  nameLine: '제품명: 디어파파 레터 올인원 / DEAR PAPA LETTER ALL-IN-ONE (출시 준비 중)',
  usage: '세안 후 하나로 마무리하는 남성 올인원 스킨케어',
  allAges: '디어파파는 40~60대 아빠를 위해 만들고 있어요.',
  reviews: '고객 후기는 출시 후에 받습니다.',
  afterShave: 'DEAR PAPA는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.',
  development:
    '디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부와 주름을 생각하며, 면도 후 바르는 올인원으로 기획하고 만들고 있습니다. 변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다. 세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을 담고, 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 가장 먼저 올립니다.',
  // Individual sentences of `development`, for cards that show one idea at a time.
  concern:
    '디어파파 레터 올인원은 아빠들이 매일 겪는 피부 고민인 번들거림과 건조함이 함께 오는 피부와 주름을 생각하며, 면도 후 바르는 올인원으로 기획하고 만들고 있습니다.',
  noAdded: '변성알코올(에탄올)을 넣지 않고, 향료를 넣지 않는 방향으로 기획하고 만들고 있습니다.',
  texture:
    '세안 후 하나로 마무리하는 올인원 안에 빠른 흡수의 워터리 제형을 담고, 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다.',
  resultsFirst: '효능과 사용감, 심사 결과는 확인되면 공식 정보 페이지에 가장 먼저 올립니다.',
  drafts: '사이트에 나온 용기·상자·카드 그림은 개발 중인 디자인 시안이며, 최종 판매 구성과 다를 수 있습니다.',
  giftStructure: '디어파파 레터 올인원은 선물과 편지를 함께 건네는 구조로 기획하고 만들고 있습니다.',
  giftPlan: '출시 후 계획: 사이트에서 쓴 편지를 인쇄한 카드에 담아 제품과 함께 건네는 선물을 기획하고 만들고 있습니다.',
  unboxing:
    '구상 중(출시 후 계획): 상자를 열면 편지 카드, 보틀, 사용 안내 순서로 보이는 선물 구성을 기획하고 있습니다.',
  container: '용기 디자인은 아직 정하지 않았고, 여러 시안을 기획하고 만들고 있습니다.',
  size: '150ml',
} as const;

export const UNDECIDED = {
  summary:
    'DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다. 확정되면 이 페이지에 가장 먼저 올립니다.',
  sizeLine: 'DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다.',
  tbd: '가격, 전성분, 출시일은 아직 확정되지 않았습니다.',
  ingredients: '정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.',
  status: '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.',
  seller: '전성분, 책임판매업자, 판매처: 출시 전 미정입니다.',
} as const;

export const LETTER = {
  story: [
    'DEAR PAPA는 딸이 아빠에게 건네는 한 줄 편지에서 시작했습니다.',
    '매일 바르는 스킨케어에 마음을 담은 짧은 편지를 더해, 평소에 하지 못한 말을 선물과 함께 전할 수 있도록 준비하고 있습니다.',
  ],
  feature:
    '사이트에서 아빠에게 보낼 편지를 쓰고 카드 이미지(PNG)로 저장할 수 있습니다. 작성한 편지는 이 기기의 브라우저에만 보관되며 서버로 전송하지 않습니다.',
  printPlan:
    '출시 후 계획: 주문 시 확인한 편지를 손글씨 스타일 서체(나눔 펜 스크립트)로 인쇄한 카드에 담아 제품과 함께 보낼 예정입니다. 사람이 직접 손으로 쓰는 카드는 아닙니다.',
} as const;

export const NOT_AFFILIATED =
  'DEAR PAPA(디어파파)는 대한민국의 남성 올인원 스킨케어 브랜드로, 공식 사이트는 dearpapa.kr입니다. 같은 이름의 의류 브랜드, 영화·영화제 작품, 대만의 dearpapa.com.tw, 국내 브랜드 파파레서피와는 관련이 없습니다. 제과 브랜드 비어드파파, 해외 사이트 dearpapa.in·dearpapa.de, Dear Papa Premium Decor, 소설 《Dear Papa》, 뮤지컬 〈디어 파파, 마이 파이어맨〉과도 관련이 없습니다. 국내 브랜드 디어도어, 디퍼앤디퍼, 아이디어스의 젠틀파파와도 관련이 없습니다.';

// Short list for scannable display; the full sentence above stays the citable text.
export const NOT_AFFILIATED_LIST = [
  '같은 이름의 의류 브랜드',
  '영화·영화제 작품',
  '대만의 dearpapa.com.tw',
  '국내 브랜드 파파레서피',
  '제과 브랜드 비어드파파',
  '해외 사이트 dearpapa.in·dearpapa.de',
  'Dear Papa Premium Decor',
  '소설 《Dear Papa》',
  '뮤지컬 〈디어 파파, 마이 파이어맨〉',
  '국내 브랜드 디어도어',
  '디퍼앤디퍼',
  '아이디어스의 젠틀파파',
] as const;

export const CHANNELS = [
  { key: 'instagram', label: 'Instagram', handle: '@dearpapa.kr', href: 'https://www.instagram.com/dearpapa.kr/' },
  { key: 'blog', label: 'Naver Blog', handle: 'dearpapa_kr', href: 'https://blog.naver.com/dearpapa_kr' },
  { key: 'youtube', label: 'YouTube', handle: '@dearpapa_kr', href: 'https://www.youtube.com/@dearpapa_kr' },
  {
    key: 'facebook',
    label: 'Facebook',
    handle: 'DEAR PAPA',
    href: 'https://www.facebook.com/profile.php?id=61594835806301',
  },
] as const;

export const CONTACT_EMAIL = 'hello@dearpapa.kr';

export const SAME_AS = [
  'https://www.instagram.com/dearpapa.kr/',
  'https://www.facebook.com/profile.php?id=61594835806301',
  'https://blog.naver.com/dearpapa_kr',
  'https://www.youtube.com/channel/UCUPHFagfIAnbp1QK6DZfDmg',
  'https://www.youtube.com/@dearpapa_kr',
  'https://authonnews.com/entity/dear-papa',
];

// Home FAQ, verbatim from the previous site (FAQPage JSON-LD uses the same text).
export const FAQ: { q: string; a: string }[] = [
  { q: 'DEAR PAPA는 어떤 브랜드인가요?', a: BRAND.about },
  {
    q: '딸만 편지를 쓸 수 있나요?',
    a: '아니요. 브랜드 이야기는 딸의 마음에서 시작했지만, 아들이나 배우자 등 아빠께 마음을 전하고 싶은 분이라면 누구나 한 줄 편지 기능을 쓸 수 있어요.',
  },
  {
    q: '한 줄 편지는 어떻게 전달되나요?',
    a: `${LETTER.printPlan} 자세한 작성 방법과 배송 방식은 출시 때 안내드릴게요.`,
  },
  { q: '올인원이 뭔가요?', a: '세안 후 하나로 마무리하는 남성 올인원 스킨케어입니다.' },
  {
    q: '제품명, 가격, 용량, 전성분은 어떻게 되나요?',
    a: '제품명은 디어파파 레터 올인원이에요. DEAR PAPA는 150ml 올인원 한 가지를 기획하고 만들고 있습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다. 확정되면 공식 사이트 dearpapa.kr과 공식 SNS에서 가장 먼저 알려 드릴게요.',
  },
  { q: '출시일은 언제인가요?', a: '출시일은 미정이에요. 인스타그램 @dearpapa.kr에서 소식을 확인하실 수 있어요.' },
  {
    q: '40~60대 아빠 선물로도 괜찮을까요?',
    a: '디어파파는 40~60대 아빠를 위해 만들고 있어요. 피부 타입별 정보는 제품 정보가 확정되면 안내드릴게요.',
  },
  { q: '파파레서피나 dearpapa.com.tw와 같은 회사인가요?', a: `아니요. ${NOT_AFFILIATED}` },
];
