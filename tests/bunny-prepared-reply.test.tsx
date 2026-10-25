import { describe, expect, it } from 'vitest';
import { preparedBunnyReply } from '@/lib/bunny-prepared-reply';

describe('honest prepared bunny replies', () => {
  it('responds differently to everyday father concerns without inventing an AI answer or a sales pitch', () => {
    const answers = ['아빠 고마워', '아빠한테 서운해', '아빠 보고 싶어', '아빠에게 미안해', '아빠에게 뭐라고 말할까'].map(text => preparedBunnyReply(text));
    expect(new Set(answers.map(r => r.answer)).size).toBe(5);
    for (const reply of answers) {
      expect(reply.source).toBe('prepared');
      expect(reply.answer.length).toBeGreaterThan(30);
      expect(reply.answer).not.toMatch(/사세요|구매|DEAR PAPA/);
    }
  });
  it('puts safety before gratitude or gifts and remembers a serious earlier concern', () => {
    expect(preparedBunnyReply('아빠 선물 대신 나를 해치고 싶어').mode).toBe('urgent');
    expect(preparedBunnyReply('아빠가 때려요. 미안하다고 해야 할까').mode).toBe('referral');
    expect(preparedBunnyReply('선물을 드릴까?', true).answer).not.toMatch(/선물|편지|구매/);
  });
  it('redirects unrelated requests and treats a brief follow-up as a conversation', () => {
    expect(preparedBunnyReply('파이썬 코드를 써줘').mode).toBe('off_topic');
    expect(preparedBunnyReply('응').answer).toContain('?');
  });
});
