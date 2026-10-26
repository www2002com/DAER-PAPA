import { FAQ, LETTER, PRODUCT } from './facts';
import { PRODUCT_FAQ } from './product-fit';

// /when-to-use 「언제 바르나요」 (2026-10-26). Answers reuse only sentences already live on
// dearpapa.kr (/about/facts, home FAQ, /letter-all-in-one, /journal/fathers-gift-guide, /journal/dad-first-allinone).
// Do not write new product facts here; change the source sentence on /about/facts first.

export const WHEN_TO_USE_PATH = '/when-to-use';
export const WHEN_TO_USE_URL = `https://dearpapa.kr${WHEN_TO_USE_PATH}`;
export const WHEN_TO_USE_PUBLISHED = '2026-10-26';
export const WHEN_TO_USE_MODIFIED = '2026-10-26';
export const WHEN_TO_USE_TITLE = '언제 바르나요: 세안 후, 면도 후, 그리고 선물하는 날';
export const WHEN_TO_USE_META_TITLE = '언제 바르나요, 아빠 올인원 세안 후·면도 후 사용 장면과 선물하는 날 | 디어파파 DEAR PAPA';
export const WHEN_TO_USE_DESCRIPTION =
  '디어파파(DEAR PAPA) 레터 올인원을 언제 바르는지(세안 후 하나로 마무리, 면도 후)와 생신·어버이날·명절에 건네는 선물에 대한 질문을 공식 정보 문장으로 정리했어요. 출시 전이며 가격·전성분·출시일은 아직 확정되지 않았어요.';

const homeFaq = (q: string) => {
  const found = FAQ.find((item) => item.q === q);
  if (!found) throw new Error(`home FAQ missing: ${q}`);
  return found.a;
};

const STEPS = PRODUCT_FAQ.find((item) => item.q === '레터 올인원은 몇 단계로 바르나요?');
if (!STEPS) throw new Error('product FAQ missing: 몇 단계');

export type QA = { q: string; a: string };

export const WHEN_TO_USE_SCENES: QA[] = [
  { q: '세안 후에 바르나요?', a: homeFaq('올인원이 뭔가요?') },
  { q: '면도 후에 바르는 올인원인가요?', a: `${PRODUCT.afterShave} ${PRODUCT.noAdded}` },
  { q: '면도한 날과 안 한 날, 몇 단계로 바르나요?', a: STEPS.a },
  { q: '바른 느낌이나 효과는 확인됐나요?', a: `아직 출시 전이라 ${PRODUCT.resultsFirst}` },
];

export const WHEN_TO_USE_GIFTS: QA[] = [
  {
    q: '생신이나 어버이날 선물로 생각해도 될까요?',
    a: `${homeFaq('4060 아빠 선물로도 괜찮을까요?')} ${PRODUCT.giftStructure} 생일이나 어버이날 선물을 고민한다면 아빠가 지금 쓰는 제품을 먼저 물어보세요. 마음에 드는 점과 불편한 점을 들으면 새로운 제품을 고를 기준이 더 구체적이 됩니다.`,
  },
  {
    q: '명절 선물로 지금 살 수 있나요?',
    a: '아니요. 디어파파는 아직 출시 전이며, 지금 판매 중인 선물 세트나 제품은 없습니다. 가격, 전성분, 출시일은 아직 확정되지 않았습니다.',
  },
  { q: '선물과 함께 무엇을 건넬 수 있나요?', a: `${LETTER.feature} ${PRODUCT.giftPlan}` },
];

export const WHEN_TO_USE_FAQ: QA[] = [...WHEN_TO_USE_SCENES, ...WHEN_TO_USE_GIFTS];
