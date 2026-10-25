import { describe, expect, it } from 'vitest';
import { createBunnyChatHandler } from '@/lib/bunny-chat-server';
import { guardSodamAnswer, sodamViolations, SODAM_FALLBACK, SODAM_MEDICAL_FALLBACK, SODAM_RULES } from '@/lib/sodam-guard';

describe('Sodam output guard', () => {
  it('passes ordinary relationship and letter answers unchanged', () => {
    for (const ok of [
      '아빠에게 서운한 마음이 있었군요. 오늘은 “그때 나는 이런 마음이었어” 한 문장부터 써 볼까요?',
      '“아빠, 늘 고마워요.” 한 줄이면 충분해요. 어떤 순간이 가장 고마웠나요?',
      '디어파파는 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 결과는 확인되면 공식 정보 페이지에 올립니다.',
      '가격, 용량, 전성분, 출시일은 아직 미정이에요. 확정되면 dearpapa.kr/about/facts에 올라와요.',
      '디어파파 레터 올인원은 세안 후 하나로 마무리하는, 아빠를 위한 올인원 스킨케어로 기획하고 있어요. 향료를 넣지 않는 방향으로 기획하고 있습니다.',
    ]) expect(sodamViolations(ok)).toEqual([]);
  });

  it.each([
    ['진정 효과가 있어요.', 'banned_word'],
    ['진정한 마음을 전해 보세요.', 'banned_word'],
    ['붉은기 걱정 없이 쓰세요.', 'banned_word'],
    ['저자극 포뮬러예요.', 'banned_word'],
    ['끈적임 없는 제형이에요.', 'banned_word'],
    ['하나로 끝내는 올인원이에요.', 'banned_word'],
    ['선물 고를 때 가장 먼저 볼 것', 'banned_word'],
    ['보습이 오래가요.', 'banned_word'],
    ['사전 예약을 받고 있어요.', 'preorder'],
    ['출시 알림을 신청하시면 알려 드려요.', 'notify_signup'],
    ['가격은 29,000원이에요.', 'price'],
    ['3만원대로 생각하고 있어요.', 'price'],
    ['150ml 한 병이에요.', 'volume'],
    ['11월 20일 출시 예정이에요.', 'date'],
    ['내년 봄에 출시돼요.', 'date'],
    ['기능성 인증을 받았어요.', 'certified'],
    ['주름 개선 효과가 확실해요.', 'efficacy'],
    ['쓰면 피부가 좋아져요.', 'efficacy'],
    ['미백에 좋아요.', 'whitening_wrinkle'],
    ['따가우면 연고를 바르고 치료하세요.', 'medical'],
    ['아이오페 맨보다 나아요.', 'competitor'],
    ['닥터지 제품보다 더 좋아요.', 'competitor'],
    ['https://example.com 에서 확인하세요.', 'link'],
  ])('flags %s', (text, reason) => {
    expect(sodamViolations(text)).toContain(reason);
  });

  it('replaces a violating answer with a fixed safe answer pointing to /about/facts', () => {
    const product = guardSodamAnswer('29,000원에 사전 예약 중이에요.', '가격 얼마예요?');
    expect(product).toMatchObject({ filtered: true, answer: SODAM_FALLBACK });
    expect(product.answer).toContain('dearpapa.kr/about/facts');
    const medical = guardSodamAnswer('진정 크림을 바르세요.', '바르면 따가워요');
    expect(medical.answer).toBe(SODAM_MEDICAL_FALLBACK);
    expect(medical.answer).toContain('피부과 전문의');
  });

  it('keeps its own fallbacks and the official facts clean', () => {
    expect(sodamViolations(SODAM_FALLBACK)).toEqual([]);
    expect(sodamViolations(SODAM_MEDICAL_FALLBACK)).toEqual([]);
    expect(SODAM_RULES).toContain('미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다');
    expect(SODAM_RULES).toContain('hello@dearpapa.kr');
    expect(SODAM_RULES).not.toMatch(/150ml|빠른 흡수/);
  });

  it('applies the guard in the chat route before the browser sees a model answer', async () => {
    const env = { GEMINI_API_KEY: 'test-key-not-real', BUNNY_AI_ENABLED: 'true', NODE_ENV: 'production' };
    const handler = createBunnyChatHandler({ env, fetchImpl: async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { role: 'model',
      parts: [{ text: JSON.stringify({ mode: 'gift', answer: '디어파파는 진정 효과가 있고 2만 원이에요.' }) }] } }] }) });
    const response = await handler(new Request('https://dearpapa.kr/api/bunny-chat', { method: 'POST',
      headers: { origin: 'https://dearpapa.kr', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.90' },
      body: JSON.stringify({ messages: [{ role: 'user', content: '디어파파 선물 가격이 얼마예요?' }] }) }));
    const body = await response.json();
    expect(body).toMatchObject({ ok: true, source: 'guidance', answer: SODAM_FALLBACK, action: null });
    expect(JSON.stringify(body)).not.toMatch(/진정|만 원/);
  });

  it('answers skin-symptom questions with a dermatologist referral even when the model routes them off topic', async () => {
    const env = { GEMINI_API_KEY: 'test-key-not-real', BUNNY_AI_ENABLED: 'true', NODE_ENV: 'production' };
    const handler = createBunnyChatHandler({ env, fetchImpl: async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { role: 'model',
      parts: [{ text: JSON.stringify({ mode: 'off_topic', answer: '바르면 괜찮아져요.' }) }] } }] }) });
    const response = await handler(new Request('https://dearpapa.kr/api/bunny-chat', { method: 'POST',
      headers: { origin: 'https://dearpapa.kr', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.91' },
      body: JSON.stringify({ messages: [{ role: 'user', content: '면도 후에 따가운데 괜찮을까요?' }] }) }));
    expect(await response.json()).toMatchObject({ source: 'guidance', answer: SODAM_MEDICAL_FALLBACK, action: null });
  });
});
