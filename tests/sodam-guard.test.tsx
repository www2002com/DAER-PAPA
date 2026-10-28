import { describe, expect, it } from 'vitest';
import { createBunnyChatHandler } from '@/lib/bunny-chat-server';
import { guardSodamAnswer, honorificEndings, sodamViolations, SODAM_COMPARISON, SODAM_PRICE_VOLUME, SODAM_REVIEW, SODAM_FALLBACK, SODAM_LAUNCH, SODAM_MEDICAL_FALLBACK, SODAM_OFF_TOPIC, SODAM_RULES, SODAM_VOLUME_LINE } from '@/lib/sodam-guard';

describe('Sodam output guard', () => {
  it('passes ordinary relationship and letter answers unchanged', () => {
    for (const ok of [
      '아빠에게 서운한 마음이 있었군요. 오늘은 “그때 나는 이런 마음이었어” 한 문장부터 써 볼까요?',
      '“아빠, 늘 고마워요.” 한 줄이면 충분해요. 어떤 순간이 가장 고마웠나요?',
      '디어파파는 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 결과는 확인되면 공식 정보 페이지에 올립니다.',
      '가격, 전성분, 출시일은 아직 미정이에요. 확정되면 dearpapa.kr/about/facts에 올라와요.',
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
    ['200ml 올인원 한 가지로 기획하고 있어요.', 'volume'],
    ['150ml 올인원 한 가지로 기획하고 있어요. 50ml 미니도 있어요.', 'volume'],
    ['150ml 대용량이라 오래 써요.', 'volume'],
    ['효능이 확실해요.', 'efficacy'],
    ['이거 효능 있어.', 'efficacy'],
    ['바르면 피부 좋아져.', 'efficacy'],
    ['디어파파 바르면 금방 좋아져.', 'efficacy'],
    ['크림 바르면 주름 펴져.', 'efficacy'],
    ['흡수 빨라서 좋아.', 'efficacy'],
    ['면도하고 발라도 안 따가워.', 'efficacy'],
    ['가벼운 제형이라 편해.', 'efficacy'],
    ['효과 있어, 믿어 봐.', 'efficacy'],
    ['따가우면 일단 사용을 멈추는 게 좋아.', 'medical'],
    ['촉촉해져.', 'efficacy'],
    ['순해서 아빠도 괜찮아.', 'efficacy'],
    ['자극 없어.', 'efficacy'],
    ['진정돼.', 'banned_word'],
    ['보습 잘 돼.', 'banned_word'],
    ['출시 알림 신청은 여기서 해.', 'notify_signup'],
    ['신청해 두면 알려 줄게.', 'notify_signup'],
    ['신청은 아직 안 받아.', 'notify_signup'],
    ['사전 예약은 안 받아.', 'preorder'],
    ['지금 예약할 수 있어.', 'preorder'],
    ['3만 원쯤이야.', 'price'],
    ['200ml 올인원 한 가지로 기획하고 있어.', 'volume'],
    ['11월에 나와.', 'date'],
    ['인증 받았어.', 'certified'],
    ['효능이 있어요.', 'efficacy'],
    ['효능 좋은 크림이에요.', 'efficacy'],
    ['세안 후 하나로 바르기 편한 올인원이야.', 'efficacy'],
    ['효과는 확인되지 않았지만 피부가 좋아져요.', 'efficacy'],
    ['보습 효과는 확인되면 알려 드릴게요.', 'banned_word'],
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

  it('allows the planned volume as on /about/facts and saying efficacy is not stated yet', () => {
    expect(sodamViolations(`용량은 ${SODAM_VOLUME_LINE}. 가격, 전성분, 출시일은 아직 미정이에요.`)).toEqual([]);
    expect(sodamViolations('디어파파는 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. 구체적인 효능이나 결과에 대해서는 확인되는 대로 공식 정보 페이지를 통해 안내해 드릴게요.')).toEqual([]);
    expect(sodamViolations('효과는 아직 말씀드리기 어려워요.')).toEqual([]);
    expect(sodamViolations('구체적인 효능이나 효과는 약속드리기 어렵습니다.')).toEqual([]);
    expect(sodamViolations('효능이랑 결과는 확인되면 알려 줄게.')).toEqual([]);
    expect(sodamViolations('효과는 아직 말하기 어려워.')).toEqual([]);
    expect(sodamViolations('구체적인 효과를 미리 약속할 수는 없지만, 결과는 확인되면 올릴게.')).toEqual([]);
    expect(sodamViolations('디어파파는 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있어. 결과는 확인되면 공식 정보 페이지에 올릴게.')).toEqual([]);
    expect(sodamViolations('편지 쓰면 아빠랑 사이가 좋아질지도 몰라. 한 줄만 써 봐.')).toEqual([]);
    expect(sodamViolations('구체적인 효능이나 사용감에 대해서는 확정하여 말씀드리기 어렵습니다.')).toEqual([]);
  });

  it('replaces a violating answer with a fixed safe answer pointing to /about/facts', () => {
    const product = guardSodamAnswer('촉촉해지는 올인원이야.', '디어파파는 어떤 제품이야?');
    expect(product).toMatchObject({ filtered: true, answer: SODAM_FALLBACK });
    expect(product.answer).toContain('dearpapa.kr/about/facts');
    expect(guardSodamAnswer('29,000원에 사전 예약 중이에요.', '가격 얼마예요?')).toMatchObject({ filtered: true, answer: SODAM_LAUNCH });
    expect(guardSodamAnswer('우르오스보다 좋아.', '우르오스랑 비교하면?')).toMatchObject({ filtered: true, answer: SODAM_COMPARISON });
    expect(guardSodamAnswer('주름이 좋아져.', '주름 좋아져요?')).toMatchObject({ filtered: true, answer: SODAM_REVIEW });
    expect(guardSodamAnswer('3만원 이하야.', '3만원 이하예요? 용량은요?')).toMatchObject({ filtered: true, answer: SODAM_PRICE_VOLUME });
    const medical = guardSodamAnswer('진정 크림을 바르세요.', '바르면 따가워요');
    expect(medical.answer).toBe(SODAM_MEDICAL_FALLBACK);
    expect(medical.answer).toContain('피부과 전문의');
  });

  it('keeps its own fallbacks and the official facts clean', () => {
    expect(sodamViolations(SODAM_FALLBACK)).toEqual([]);
    expect(sodamViolations(SODAM_MEDICAL_FALLBACK)).toEqual([]);
    expect(sodamViolations(SODAM_OFF_TOPIC)).toEqual([]);
    for (const fixed of [SODAM_FALLBACK, SODAM_MEDICAL_FALLBACK, SODAM_OFF_TOPIC, SODAM_COMPARISON, SODAM_LAUNCH, SODAM_REVIEW, SODAM_PRICE_VOLUME]) {
      expect(sodamViolations(fixed)).toEqual([]);
      expect(honorificEndings(fixed)).toEqual([]);
    }
    expect(SODAM_COMPARISON).toContain('제품 정보는 dearpapa.kr/about/facts에 있어.');
    expect(SODAM_LAUNCH).toContain('출시일과 가격은 아직 미정이야. 정해지면 dearpapa.kr에서 알려 줄게.');
    expect(SODAM_COMPARISON + SODAM_LAUNCH).not.toMatch(/신청|예약|아이오페|닥터지|우르오스|비오템/);
    expect(SODAM_RULES).toContain('미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다');
    expect(SODAM_RULES).toContain('hello@dearpapa.kr');
    expect(SODAM_RULES).toContain(SODAM_VOLUME_LINE);
    expect(SODAM_RULES).not.toMatch(/빠른 흡수|용량[^\n]*미정/);
  });

  it('applies the guard in the chat route before the browser sees a model answer', async () => {
    const env = { GEMINI_API_KEY: 'test-key-not-real', BUNNY_AI_ENABLED: 'true', NODE_ENV: 'production' };
    const handler = createBunnyChatHandler({ env, fetchImpl: async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { role: 'model',
      parts: [{ text: JSON.stringify({ mode: 'gift', answer: '디어파파는 진정 효과가 있고 2만 원이에요.' }) }] } }] }) });
    const response = await handler(new Request('https://dearpapa.kr/api/bunny-chat', { method: 'POST',
      headers: { origin: 'https://dearpapa.kr', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.90' },
      body: JSON.stringify({ messages: [{ role: 'user', content: '디어파파 선물 가격이 얼마예요?' }] }) }));
    const body = await response.json();
    expect(body).toMatchObject({ ok: true, source: 'guidance', answer: SODAM_LAUNCH, action: null });
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

  const offTopic = async (question: string, ip: string) => {
    const env = { GEMINI_API_KEY: 'test-key-not-real', BUNNY_AI_ENABLED: 'true', NODE_ENV: 'production' };
    const handler = createBunnyChatHandler({ env, fetchImpl: async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { role: 'model',
      parts: [{ text: JSON.stringify({ mode: 'off_topic', answer: '다른 얘기야.' }) }] } }] }) });
    const response = await handler(new Request('https://dearpapa.kr/api/bunny-chat', { method: 'POST',
      headers: { origin: 'https://dearpapa.kr', 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify({ messages: [{ role: 'user', content: question }] }) }));
    return response.json();
  };

  it('answers comparison questions with the facts-page line and launch questions with the undecided facts', async () => {
    expect(await offTopic('아이오페 맨이랑 비교하면 뭐가 나아요?', '203.0.113.92')).toMatchObject({ answer: SODAM_COMPARISON, action: null });
    expect(await offTopic('출시되면 알림 받을 수 있어요?', '203.0.113.93')).toMatchObject({ answer: SODAM_LAUNCH, action: null });
    expect(await offTopic('코딩 좀 도와줘', '203.0.113.94')).toMatchObject({ answer: SODAM_OFF_TOPIC });
  });

  it('sends skin symptoms filed as referral to a dermatologist, not the counselling reply', async () => {
    const env = { GEMINI_API_KEY: 'test-key-not-real', BUNNY_AI_ENABLED: 'true', NODE_ENV: 'production' };
    const handler = createBunnyChatHandler({ env, fetchImpl: async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { role: 'model',
      parts: [{ text: JSON.stringify({ mode: 'referral', answer: '상담받아 줘.' }) }] } }] }) });
    const response = await handler(new Request('https://dearpapa.kr/api/bunny-chat', { method: 'POST',
      headers: { origin: 'https://dearpapa.kr', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.95' },
      body: JSON.stringify({ messages: [{ role: 'user', content: '면도 후에 따가운데 디어파파 바르면 괜찮아질까요?' }] }) }));
    expect(await response.json()).toMatchObject({ source: 'guidance', answer: SODAM_MEDICAL_FALLBACK, action: null });
  });
});
