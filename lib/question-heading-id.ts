/**
 * Deterministic ASCII id for journal question H2s (visible text ending in "?").
 * Matches the site's existing kebab-ASCII anchor style (e.g. official-info, logo).
 * Hangul is romanized; other non-ASCII is dropped; empty results fall back to a short hash.
 */

const CHO = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
] as const;
const JUNG = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
] as const;
const JONG = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't',
] as const;

function romanizeHangulSyllable(code: number): string {
  const s = code - 0xac00;
  const cho = CHO[Math.floor(s / 588)] ?? '';
  const jung = JUNG[Math.floor((s % 588) / 28)] ?? '';
  const jong = JONG[s % 28] ?? '';
  return `${cho}${jung}${jong}`;
}

function romanize(text: string): string {
  let out = '';
  for (const ch of text.normalize('NFC')) {
    const code = ch.codePointAt(0)!;
    if (code >= 0xac00 && code <= 0xd7a3) {
      out += romanizeHangulSyllable(code);
    } else if (/[A-Za-z0-9]/.test(ch)) {
      out += ch.toLowerCase();
    } else if (/[\s_/·.,!?'"“”‘’…—–-]/.test(ch) || ch === '·') {
      out += '-';
    } else {
      // drop other punctuation / CJK
      out += '-';
    }
  }
  return out;
}

function shortHash(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** Stable ASCII kebab id for a question heading's visible text. */
export function questionHeadingId(visibleText: string): string {
  const trimmed = visibleText.replace(/\s+/g, ' ').trim();
  let slug = romanize(trimmed)
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (slug.length > 72) slug = slug.slice(0, 72).replace(/-$/, '');
  if (!slug || slug === 'q') {
    return `q-${shortHash(trimmed)}`;
  }
  return slug;
}
