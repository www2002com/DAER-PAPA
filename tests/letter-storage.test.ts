import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_CHARS, MAX_FROM } from '@/components/letter/card';
import { DRAFT_KEY, LETTERS_KEY, loadDraft, loadLetters, saveDraft, saveLetters } from '@/components/letter/storage';
import { createLetterShareUrl, isShareableLetter, tryCreateLetterShareUrl } from '@/components/letter/share-link';

beforeEach(() => localStorage.clear());

describe('letters restored from the browser store', () => {
  it('preserves long archived originals across unrelated saves and deletes', () => {
    const original = { id: 1, date: '2026.10.29', text: '가'.repeat(149) + '💌\r\n마지막 문장', from: '이'.repeat(MAX_FROM + 5) + '💌' };
    localStorage.setItem(LETTERS_KEY, JSON.stringify([original]));
    const other = { id: 2, date: '2026.10.30', text: '다른 편지', from: '딸' };
    expect(saveLetters([...loadLetters(), other])).toBe(true);
    expect(loadLetters()[0]).toEqual(original);
    expect(saveLetters(loadLetters().filter(l => l.id !== other.id))).toBe(true);
    expect(loadLetters()).toEqual([original]);
    expect(isShareableLetter(original)).toBe(false);
  });

  it.each(['가'.repeat(151), '가'.repeat(149) + '💌끝', '💌'.repeat(76), '한글\r\n' + '나'.repeat(153)])('round trips a long draft without normalizing or truncating it (%#)', text => {
    const original = { text, from: '딸'.repeat(13) + '💌', editingId: null };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(original));
    for (let i = 0; i < 3; i++) {
      expect(loadDraft()).toEqual(original);
      expect(saveDraft(loadDraft()!)).toBe(true);
    }
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!)).toEqual(original);
  });
});

describe('render-safe share link', () => {
  it('returns null instead of throwing for a letter the recipient link cannot carry', () => {
    const over = { text: '다'.repeat(MAX_CHARS + 1), from: '', date: '2026.10.29' };
    expect(() => createLetterShareUrl(over)).toThrow();
    expect(tryCreateLetterShareUrl(over)).toBeNull();
    expect(isShareableLetter(over)).toBe(false);
    const ok = { text: '아빠, 고마워요.', from: '딸', date: '2026.10.29' };
    expect(tryCreateLetterShareUrl(ok)).toBe(createLetterShareUrl(ok));
  });

  it.each([
    ['가'.repeat(150), '딸'.repeat(12), true],
    ['가'.repeat(151), '', false],
    ['💌'.repeat(75), '💌'.repeat(6), true],
    ['가'.repeat(149) + '💌', '', false],
    ['아빠', '💌'.repeat(6) + '딸', false],
  ])('uses the existing UTF-16 share boundary (%#)', (text, from, allowed) => {
    const letter = { text, from, date: '2026.10.29' };
    expect(isShareableLetter(letter)).toBe(allowed);
    expect(tryCreateLetterShareUrl(letter) !== null).toBe(allowed);
  });
});
