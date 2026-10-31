import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_CHARS, MAX_FROM } from '@/components/letter/card';
import { DRAFT_KEY, LETTERS_KEY, loadDraft, loadLetters } from '@/components/letter/storage';
import { createLetterShareUrl, isShareableLetter, tryCreateLetterShareUrl } from '@/components/letter/share-link';

beforeEach(() => localStorage.clear());

describe('letters restored from the browser store', () => {
  it('clamps archived letters to the current limits so every restored letter can become a recipient link', () => {
    localStorage.setItem(LETTERS_KEY, JSON.stringify([
      { id: 1, date: '2026.10.29', text: '가'.repeat(MAX_CHARS + 40), from: '이'.repeat(MAX_FROM + 5) },
    ]));
    const [restored] = loadLetters();
    expect(restored.text).toHaveLength(MAX_CHARS);
    expect(restored.from).toHaveLength(MAX_FROM);
    expect(isShareableLetter(restored)).toBe(true);
  });

  it('clamps a draft saved mid-composition beyond the limit', () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ text: '나'.repeat(MAX_CHARS + 3) + '\r', from: '딸', editingId: null }));
    const draft = loadDraft()!;
    expect(draft.text).toHaveLength(MAX_CHARS);
    expect(draft.text).not.toContain('\r');
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
});
