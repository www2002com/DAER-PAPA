// Browser-only storage for letters. Nothing is ever sent to a server.
// Keys and shapes match the previous site, so letters people already kept still load.

export const LETTERS_KEY = 'dearpapa.letters.v1';
export const DRAFT_KEY = 'dearpapa.draft.v1';
export const MAX_LETTERS = 20;

export type Letter = { id: number; date: string; text: string; from: string };
export type Draft = { text: string; from: string; editingId?: number | null };

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Normalize user input only. Length limits belong at sharing, never at persistence. */
export const cleanText = (v: string) => v.replace(/\r/g, '');
export const cleanFrom = (v: string) => v.replace(/[\r\n]/g, '');

export function loadLetters(): Letter[] {
  const raw = read<unknown>(LETTERS_KEY);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (l): l is Letter =>
        !!l &&
        typeof l === 'object' &&
        Number.isSafeInteger((l as Letter).id) &&
        (l as Letter).id > 0 &&
        typeof (l as Letter).date === 'string' &&
        typeof (l as Letter).text === 'string' &&
        (l as Letter).text.trim() !== '',
    )
    // Keep originals intact: an unrelated save/delete writes this list back to storage.
    .map((l) => ({ id: l.id, date: l.date, text: l.text, from: typeof l.from === 'string' ? l.from : '' }));
}

// Never make room by silently discarding an existing letter.
export const saveLetters = (letters: Letter[]) => letters.length <= MAX_LETTERS && write(LETTERS_KEY, letters);

export function loadDraft(): Draft | null {
  const d = read<Partial<Draft>>(DRAFT_KEY);
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  return {
    text: typeof d.text === 'string' ? d.text : '',
    from: typeof d.from === 'string' ? d.from : '',
    editingId: typeof d.editingId === 'number' ? d.editingId : null,
  };
}

export const saveDraft = (d: Draft) => write(DRAFT_KEY, d);
