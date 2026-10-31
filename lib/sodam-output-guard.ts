// Server only. A narrow, deterministic check on Sodam's model answers (2026-10-29).
//
// Sodam talks mostly about relationships with dad, so ordinary words like "효과", "날짜" or "좋아요"
// must pass. The check only runs when the answer itself is in a product context — it names DEAR PAPA,
// the product, cosmetics, price, the functional review or applying something — and then blocks four
// kinds of claim the brand cannot make before launch:
//   efficacy · price/discount · launch timing · review/certification passed.
// It replaces PR #65's broad filter, which also blocked 4 of 5 ordinary relationship answers.

export type SodamGuardReason = 'efficacy' | 'price' | 'launch_date' | 'certified';

/** The one approved sentence about the functional review. Scrubbed before checking. */
const APPROVED_REVIEW = /미백\s*[·ㆍ・,]?\s*주름\s*개선\s*(2중\s*)?기능성(화장품)?\s*심사를\s*준비/g;

const PRODUCT_CONTEXT = new RegExp([
  '디어파파|DEAR\\s*PAPA|레터\\s*올인원|올인원|화장품|스킨케어|제품|크림|로션|에센스',
  '가격|판매가|정가|기능성|식약처',
  '바르면|바르시면|발라\\s*(보|주|드)|바를\\s*때|바른\\s*뒤|사용하시면|사용하면|쓰시면',
].join('|'), 'i');

const CLAIMS: readonly (readonly [SodamGuardReason, RegExp])[] = [
  ['efficacy', new RegExp([
    // "효과가 있어요", "효능이 뛰어나요"
    '(효과|효능)\\s*(이|가|은|는|도)?\\s*(있|좋|뛰어|확실|보장|입증|탁월|최고|크)',
    // a skin outcome and a change verb close together: "주름이 펴져요", "피부가 환해질 거예요"
    '(주름|미백|피부|피부결|톤|기미|잡티|탄력|모공|각질|트러블)[^.!?\\n]{0,15}'
      + '(펴져|펴지|펴줘|펴 줘|개선(돼|되|됩|시켜|해)|좋아(져|지|집)|나아(져|지)|밝아(져|지)|환해(져|지)|하얘(져|지)'
      + '|매끈해|탄탄해|줄어(들|요|듭)|옅어(져|지)|사라(져|지|집)|없어(져|지|집)|가라앉|촉촉해)',
    // "미백이 돼요", "주름 개선 효과"
    '(미백|주름\\s*개선)\\s*(이|가|은|도)?\\s*(돼|된다|됩니다|되는|기능이\\s*있|효과)',
    // "바르면 좋아져요"
    '(바르면|바르시면|발라\\s*보시면|사용하시면|사용하면|쓰시면)[^.!?\\n]{0,15}'
      + '(좋아(져|지)|나아(져|지)|개선|달라(져|지)|펴(져|지)|밝아(져|지)|환해(져|지)|촉촉)',
  ].join('|'))],
  ['price', /\d[\d,.]*\s*(원|만\s*원|천\s*원|달러|\$)|가격\s*(은|이|는)?\s*(약|대략|정도|예정|\d)|할인|세일|특가|쿠폰|적립금|무료\s*배송|최저가|저렴|가성비/],
  ['launch_date', new RegExp([
    // a time word shortly before a release verb: "곧 출시돼요", "12월부터 판매해요", "봄에 만나보실 수 있어요"
    '(\\d{1,2}\\s*월(\\s*\\d{1,2}\\s*일)?|\\d{4}\\s*년|올해|내년|연말|연초|다음\\s*(달|주)|이번\\s*달|곧|조만간|상반기|하반기|봄|여름|가을|겨울)'
      + '[^.!?\\n]{0,12}(출시|발매|판매|오픈|나올\\s*(예정|거)|나옵니다|만나보실|만나실)',
    // "출시일은 12월이에요", "출시는 곧"
    '(출시|발매|판매|오픈)\\s*(일|예정일|시기)?\\s*(은|는|이|가)?\\s*(\\d|올해|내년|곧|조만간|연말|다음)',
  ].join('|'))],
  ['certified', /(심사|인증|승인|허가|기능성)\s*(을|를|에|이|가)?\s*(통과|받았|받은|받아|완료|획득|인정받)|식약처\s*(에서\s*)?(인증|승인|허가|인정)|(인증|승인)\s*(된|받은|완료된)\s*(제품|화장품)/],
];

/** Reasons this answer must not be shown, or [] when it may pass unchanged. */
export function sodamOutputViolations(answer: string): SodamGuardReason[] {
  const text = answer.replace(APPROVED_REVIEW, ' ');
  if (!PRODUCT_CONTEXT.test(text)) return [];
  return CLAIMS.filter(([, pattern]) => pattern.test(text)).map(([reason]) => reason);
}

/**
 * Shown instead of a blocked answer. PLACEHOLDER — the final wording is chosen by the brand lead
 * from the candidates in the pull request. Polite form; never calls Sodam an AI or a counsellor.
 */
export const SODAM_PRODUCT_CLAIM_FALLBACK =
  '제품에 대해서는 확인된 내용만 말씀드릴게요. 디어파파 레터 올인원은 출시 준비 중이고, 가격과 출시일은 아직 정해지지 않았어요. 확정되면 공식 정보 페이지(dearpapa.kr/about/facts)에 먼저 올라와요.';
