export const MENU_LANGUAGES = [
  { code: 'ko', label: '한국어', lang: 'ko' },
  { code: 'en', label: 'EN', lang: 'en' },
  { code: 'zh', label: '中文', lang: 'zh-Hans' },
  { code: 'ja', label: '日本語', lang: 'ja' },
] as const;
export type MenuLanguage = (typeof MENU_LANGUAGES)[number]['code'];
export const MENU_LANGUAGE_KEY = 'dearpapa.menu-language.v1';
export function menuLanguage(value: string | null): MenuLanguage {
  return MENU_LANGUAGES.find((language) => language.code === value)?.code ?? 'ko';
}

export const MENU_GROUPS = [
  { id: 'product', href: '/#product', children: [
    { id: 'productDetail', href: '/letter-all-in-one' },
    { id: 'principles', href: '/journal/development-principles' },
  ] },
  { id: 'story', href: '/#story', children: [
    { id: 'identity', href: '/journal/brand-identity' },
    { id: 'giftMeaning', href: '/#gift-meaning' },
  ] },
  { id: 'letter', href: '/#letter', children: [
    { id: 'writeLetter', href: '/#letter' },
  ] },
  { id: 'faq', href: '/#faq', children: [
    { id: 'questions', href: '/#faq' },
    { id: 'officialFacts', href: '/about/facts' },
  ] },
  { id: 'journal', href: '/journal', children: [
    { id: 'dadGuide', href: '/journal/dad-gift-guide' },
    { id: 'fatherGuide', href: '/journal/fathers-gift-guide' },
  ] },
  { id: 'news', href: '/#news', children: [
    { id: 'press', href: '/press' },
    { id: 'contact', href: '/#contact' },
  ] },
] as const;
type GroupId = (typeof MENU_GROUPS)[number]['id'];
type ChildId = (typeof MENU_GROUPS)[number]['children'][number]['id'];
type MenuCopy = {
  title: string; open: string; close: string; home: string; primaryNav: string;
  languageLabel: string; languageNote: string; slogan: [string, string];
  introduction: string; contact: string; channels: string; newTab: string;
  groups: Record<GroupId, { title: string; description: string }>;
  links: Record<ChildId, string>;
};

export const MENU_COPY: Record<MenuLanguage, MenuCopy> = {
  ko: {
    title: '전체 메뉴', open: '메뉴 열기', close: '메뉴 닫기', home: 'DEAR PAPA 디어파파 홈',
    primaryNav: '주요 메뉴', languageLabel: '메뉴 언어',
    languageNote: '메뉴와 안내 문구의 언어를 선택하세요. 페이지 본문은 한국어로 제공됩니다.',
    slogan: ['아빠의 매일에,', '딸의 마음을.'],
    introduction: '매일 쓰는 스킨케어 하나와\n평소에 하지 못했던 말 한 줄.',
    contact: '문의', channels: '디어파파 공식 채널', newTab: '새 탭에서 열기',
    groups: {
      product: { title: '레터 올인원', description: '아빠의 일상을 생각하며 준비하는 스킨케어와 선물 구성.' },
      story: { title: '브랜드 이야기', description: '디어파파가 시작된 마음과 이름, 로고에 담은 이야기.' },
      letter: { title: '편지 쓰기', description: '아빠에게 전하고 싶은 말을 쓰고, 카드 이미지로 간직하세요.' },
      faq: { title: '궁금한 이야기', description: '준비하는 과정과 지금까지 정해진 정보를 확인하세요.' },
      journal: { title: '저널', description: '아빠 선물을 고르는 기준과 마음을 전하는 방법을 모았습니다.' },
      news: { title: '소식과 문의', description: '디어파파의 새 소식, 소개 기사와 연락처를 만나보세요.' },
    },
    links: {
      productDetail: '제품 자세히 보기', principles: '제품 개발 원칙',
      identity: '브랜드와 로고', giftMeaning: '올인원에 편지를 더하는 이유',
      writeLetter: '아빠에게 편지 쓰기', questions: '자주 묻는 질문', officialFacts: '공식 정보',
      dadGuide: '아빠 선물 가이드', fatherGuide: '아버지 선물 가이드', press: '소개 기사', contact: '이메일 문의',
    },
  },
  en: {
    title: 'Explore Dear Papa', open: 'Open menu', close: 'Close menu', home: 'DEAR PAPA home',
    primaryNav: 'Main navigation', languageLabel: 'Menu language',
    languageNote: 'Choose a language for menus and guidance. Page content is available in Korean.',
    slogan: ["For Dad’s every day,", "with a daughter’s love."],
    introduction: 'Everyday skincare.\nA few words from the heart.',
    contact: 'Contact', channels: 'Dear Papa official channels', newTab: 'Opens in a new tab',
    groups: {
      product: { title: 'Letter All-in-One', description: 'Discover the skincare and gift set we are developing for Dad’s daily routine.' },
      story: { title: 'Our story', description: 'The thought behind Dear Papa, our name and our logo.' },
      letter: { title: 'Write a letter', description: 'Put your feelings for Dad into words and save them as a card image.' },
      faq: { title: 'Questions & answers', description: 'Find out what we are preparing and what has been confirmed so far.' },
      journal: { title: 'Journal', description: 'Ideas for choosing a gift for Dad and sharing what is in your heart.' },
      news: { title: 'News & contact', description: 'Find our latest updates, media coverage and contact information.' },
    },
    links: {
      productDetail: 'Explore the product', principles: 'Development principles',
      identity: 'Our brand & logo', giftMeaning: 'Why skincare with a letter?',
      writeLetter: 'Write to Dad', questions: 'Frequently asked questions', officialFacts: 'Official facts',
      dadGuide: 'Gifts for Dad', fatherGuide: 'A guide to gifts for fathers', press: 'Media coverage', contact: 'Email us',
    },
  },
  zh: {
    title: '全部菜单', open: '打开菜单', close: '关闭菜单', home: 'DEAR PAPA 首页',
    primaryNav: '主导航', languageLabel: '菜单语言',
    languageNote: '请选择菜单及提示文字的语言。页面正文以韩语提供。',
    slogan: ['为爸爸的每一天，', '献上女儿的心意。'],
    introduction: '一款日常护肤品，\n一句平时未能说出口的话。',
    contact: '联系我们', channels: 'Dear Papa 官方渠道', newTab: '在新标签页中打开',
    groups: {
      product: { title: 'Letter All-in-One', description: '为爸爸的日常生活而研发的护肤品与礼品组合。' },
      story: { title: '品牌故事', description: '了解 Dear Papa 创立的初衷，以及品牌名称与标志背后的故事。' },
      letter: { title: '给爸爸写信', description: '写下想对爸爸说的话，保存为卡片图片，珍藏这份心意。' },
      faq: { title: '常见问题', description: '了解我们的筹备进展与目前已确认的信息。' },
      journal: { title: '品牌手记', description: '分享为爸爸挑选礼物的思路，以及表达心意的方法。' },
      news: { title: '动态与联系', description: '查看 Dear Papa 的最新消息、媒体报道及联系方式。' },
    },
    links: {
      productDetail: '了解产品', principles: '产品研发原则',
      identity: '品牌与标志', giftMeaning: '为什么将护肤品与信件相结合？',
      writeLetter: '给爸爸写一封信', questions: '常见问题解答', officialFacts: '官方信息',
      dadGuide: '送给爸爸的礼物指南', fatherGuide: '父亲礼物选购指南', press: '媒体报道', contact: '邮件咨询',
    },
  },
  ja: {
    title: 'すべてのメニュー', open: 'メニューを開く', close: 'メニューを閉じる', home: 'DEAR PAPA ホーム',
    primaryNav: 'メインナビゲーション', languageLabel: 'メニューの言語',
    languageNote: 'メニューと案内文の言語を選べます。ページ本文は韓国語で表示されます。',
    slogan: ['お父さんの毎日に、', '娘の想いを。'],
    introduction: '毎日使うスキンケアひとつと、\n普段は言えなかったひと言。',
    contact: 'お問い合わせ', channels: 'Dear Papa 公式アカウント', newTab: '新しいタブで開く',
    groups: {
      product: { title: 'Letter All-in-One', description: 'お父さんの毎日を想い、開発を進めているスキンケアとギフト。' },
      story: { title: 'ブランドストーリー', description: 'Dear Papa のはじまりと、名前やロゴに込めた想い。' },
      letter: { title: '手紙を書く', description: 'お父さんに伝えたい言葉を書いて、カード画像として保存できます。' },
      faq: { title: 'よくあるご質問', description: '準備の進み具合と、今までに決まった情報をご確認ください。' },
      journal: { title: 'ジャーナル', description: 'お父さんへの贈り物の選び方と、想いを伝えるヒント。' },
      news: { title: 'ニュース・お問い合わせ', description: 'Dear Papa の最新情報、紹介記事、お問い合わせ先をご案内します。' },
    },
    links: {
      productDetail: '製品について詳しく', principles: '製品開発の方針',
      identity: 'ブランドとロゴ', giftMeaning: 'スキンケアに手紙を添える理由',
      writeLetter: 'お父さんに手紙を書く', questions: 'よくあるご質問', officialFacts: '公式情報',
      dadGuide: 'お父さんへのギフトガイド', fatherGuide: '父親への贈り物の選び方', press: '紹介記事', contact: 'メールでのお問い合わせ',
    },
  },
};
