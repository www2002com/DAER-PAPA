import { MAX_CHARS, MAX_FROM, type LetterInput } from './card';

export const RECEIVED_LETTER_PATH = '/letter/received';
const MAX_HASH_LENGTH = 2000;

function validLetter(value: unknown): value is LetterInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as LetterInput;
  if (typeof data.text !== 'string' || !data.text.trim() || data.text.length > MAX_CHARS
    || typeof data.from !== 'string' || data.from.length > MAX_FROM
    || typeof data.date !== 'string' || !/^\d{4}\.\d{2}\.\d{2}$/.test(data.date)) return false;
  const [year, month, day] = data.date.split('.').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return year >= 2000 && year <= 2100 && parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

/** A recipient link, not encryption: anyone with the link can read the letter.
 * The fragment is excluded from HTTP requests, server logs and generic OG data. */
export function createLetterShareUrl(letter: LetterInput): string {
  if (!validLetter(letter)) throw new Error('공유할 편지의 내용과 날짜를 확인해 주세요.');
  const bytes = new TextEncoder().encode(JSON.stringify({ v: 1, text: letter.text, from: letter.from, date: letter.date }));
  const encoded = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `https://dearpapa.kr${RECEIVED_LETTER_PATH}#letter=${encoded}`;
}

/** True when the letter can become a recipient link (same rules as createLetterShareUrl). */
export const isShareableLetter = (value: unknown): value is LetterInput => validLetter(value);

/** Like createLetterShareUrl, but null instead of throwing: safe to call during render. */
export function tryCreateLetterShareUrl(letter: LetterInput): string | null {
  return validLetter(letter) ? createLetterShareUrl(letter) : null;
}

export function readSharedLetter(hash: string): LetterInput | null {
  if (hash.length > MAX_HASH_LENGTH || !/^#letter=[A-Za-z0-9_-]+$/.test(hash)) return null;
  try {
    const encoded = hash.slice('#letter='.length).replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0));
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (data?.v !== 1 || !validLetter(data)) return null;
    return { text: data.text, from: data.from, date: data.date };
  } catch { return null; }
}
