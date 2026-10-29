import { describe, expect, it } from 'vitest';
import { createLetterShareUrl, readSharedLetter } from '@/components/letter/share-link';

const letter = { text: '아빠, 늘 고마워요. 💙\n이번 주말에 만나요!', from: '딸 & 아들', date: '2026.10.29' };
const hashFor = (value: unknown) => '#letter=' + Buffer.from(JSON.stringify(value)).toString('base64url');

describe('recipient letter links', () => {
  it('round-trips Korean, emoji and line breaks without putting the message in the HTTP path or query', () => {
    const url = new URL(createLetterShareUrl(letter));
    expect(url.origin + url.pathname).toBe('https://dearpapa.kr/letter/received');
    expect(url.search).toBe('');
    expect(readSharedLetter(url.hash)).toEqual(letter);
  });

  it('rejects empty and oversized letters instead of silently dropping content', () => {
    expect(() => createLetterShareUrl({ ...letter, text: '  ' })).toThrow();
    expect(() => createLetterShareUrl({ ...letter, text: '가'.repeat(151) })).toThrow();
    expect(() => createLetterShareUrl({ ...letter, from: '가'.repeat(13) })).toThrow();
  });

  it('rejects malformed, oversized, unsupported-version and invalid-date links', () => {
    for (const hash of ['', '#letter=***', '#letter=' + 'a'.repeat(2200), hashFor(null), hashFor({ v: 2, ...letter }),
      hashFor({ v: 1, ...letter, text: {} }), hashFor({ v: 1, ...letter, date: '2026.02.31' }),
      hashFor({ v: 1, ...letter, from: '<'.repeat(13) })]) expect(readSharedLetter(hash)).toBeNull();
  });

  it('treats markup as plain letter text, not executable HTML', () => {
    const input = { ...letter, text: '<img src=x onerror=alert(1)>' };
    expect(readSharedLetter(new URL(createLetterShareUrl(input)).hash)).toEqual(input);
  });
});
