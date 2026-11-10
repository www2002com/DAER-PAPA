import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBunnyChatHandler } from '@/lib/bunny-chat-server';
import { SODAM_PRODUCT_CLAIM_FALLBACK, sodamOutputViolations } from '@/lib/sodam-output-guard';

// Ordinary relationship answers that PR #65's broad filter blocked (4 of 5). All must pass unchanged.
const NORMAL = [
  '아빠와 대화가 줄어 서운하셨겠어요. 이번 주말에 짧은 안부 문자 한 줄로 시작해 보면 효과가 있을 수 있어요.',
  '말로 하기 어려운 마음은 편지가 도움이 돼요. 첫 문장은 "아빠, 요즘 어때요?"처럼 가볍게 시작해 보세요.',
  '그 말이 많이 아프게 들리셨겠어요. 감정이 가라앉은 뒤에 진정으로 하고 싶은 말을 한 줄로 적어 보는 건 어떨까요?',
  '아빠의 무뚝뚝함이 꼭 마음이 없다는 뜻은 아닐 수 있어요. 함께 산책하자고 먼저 신청해 보듯 가볍게 제안해 보세요.',
  '서로 바쁘다 보면 거리가 생기기 쉬워요. 5월 8일 어버이날 전에 짧은 감사 한 줄을 미리 써 두는 것도 좋아요.',
];

// Product facts the site already publishes. Product context, but no claim.
const PRODUCT_FACTS = [
  '디어파파 레터 올인원은 150ml 올인원 한 가지로 기획하고 있어요.',
  '디어파파 레터 올인원은 미백·주름 개선 2중 기능성화장품 심사를 준비하고 있어요.',
  '디어파파 레터 올인원은 아직 출시 준비 중이라 가격과 출시일은 정해지지 않았어요.',
  '디어파파 편지 쓰기에서 아빠께 건넬 첫 줄을 적어 보세요.',
];

const RISKY: [string, string][] = [
  ['디어파파 올인원을 바르면 주름이 펴져요.', 'efficacy'],
  ['가격은 3만 원대로 예정되어 있어요.', 'price'],
  ['기능성 심사를 통과했어요.', 'certified'],
  ['이 크림을 바르시면 피부가 촉촉해질 거예요.', 'efficacy'],
  ['레터 올인원은 미백이 돼요.', 'efficacy'],
  ['디어파파 제품은 지금 20% 할인 중이에요.', 'price'],
  ['레터 올인원은 12월에 출시돼요.', 'launch_date'],
  ['디어파파 올인원 출시일은 내년 봄이에요.', 'launch_date'],
  ['식약처 인증을 받은 화장품이에요.', 'certified'],
];

describe('Sodam narrow output guard', () => {
  it('passes ordinary relationship answers, including 효과·날짜 words outside a product context', () => {
    for (const answer of NORMAL) expect(sodamOutputViolations(answer), answer).toEqual([]);
  });

  it('passes published product facts, including the approved functional-review sentence', () => {
    for (const answer of PRODUCT_FACTS) expect(sodamOutputViolations(answer), answer).toEqual([]);
  });

  it('blocks efficacy, price, launch-date and certification claims in a product context', () => {
    for (const [answer, reason] of RISKY) expect(sodamOutputViolations(answer), answer).toContain(reason);
  });

  it('does not treat the same claim words as product claims without a product context', () => {
    for (const answer of ['아빠와 같이 걸으면 효과가 있어요.', '12월에 가족 모임이 열리면 그때 편지를 건네 보세요.', '아빠 얼굴의 주름이 펴질 만큼 크게 웃게 해 드려요.']) {
      expect(sodamOutputViolations(answer), answer).toEqual([]);
    }
  });

  it('keeps the placeholder fallback polite, factual and free of claims', () => {
    expect(sodamOutputViolations(SODAM_PRODUCT_CLAIM_FALLBACK)).toEqual([]);
    expect(SODAM_PRODUCT_CLAIM_FALLBACK).not.toMatch(/AI|상담/);
    expect(SODAM_PRODUCT_CLAIM_FALLBACK).toMatch(/요\.$/);
  });
});

describe('Sodam output guard on the chat endpoint (mocked provider, no network)', () => {
  const env = { GEMINI_API_KEY: 'test-key-not-real', BUNNY_AI_ENABLED: 'true', NODE_ENV: 'production' };
  const post = (content: string) => new Request('https://dearpapa.kr/api/bunny-chat', {
    method: 'POST', headers: { origin: 'https://dearpapa.kr', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.81' },
    body: JSON.stringify({ messages: [{ role: 'user', content }] }),
  });
  const reply = async (mode: string, answer: string, content = '아빠 생신 선물로 뭐가 좋을까?') => {
    const handler = createBunnyChatHandler({ env, fetchImpl: async () => Response.json({ candidates: [
      { finishReason: 'STOP', content: { role: 'model', parts: [{ text: JSON.stringify({ mode, answer }) }] } },
    ] }) });
    return (await handler(post(content))).json();
  };

  afterEach(() => vi.restoreAllMocks());

  it('replaces a product claim with the fixed fallback and no product or letter action', async () => {
    const logs = [vi.spyOn(console, 'log'), vi.spyOn(console, 'warn'), vi.spyOn(console, 'error'), vi.spyOn(console, 'info')];
    for (const [answer] of RISKY.slice(0, 3)) {
      for (const mode of ['gift', 'letter', 'support']) {
        const body = await reply(mode, answer);
        expect(body).toEqual({ ok: true, mode, source: 'guidance', answer: SODAM_PRODUCT_CLAIM_FALLBACK, action: null });
      }
    }
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });

  it('returns ordinary answers unchanged as model answers', async () => {
    for (const answer of NORMAL) {
      const body = await reply('support', answer, '아빠와 말하기가 어색해');
      expect(body).toMatchObject({ ok: true, source: 'ai', answer });
    }
    const gift = await reply('gift', '아빠가 평소 좋아하시는 것을 떠올려 보세요.');
    expect(gift).toMatchObject({ source: 'ai', action: { kind: 'product', href: '/letter-all-in-one' } });
  });
});
