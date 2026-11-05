// @vitest-environment node
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CHECKLIST_FAQ,
  CHECKLIST_HEADLINE,
  CHECKLIST_META_TITLE,
  CHECKLIST_SUMMARY,
  getJournalEntry,
} from '@/lib/journal';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(path.join(root, p), 'utf8');

describe('dad-skincare-gift-checklist journal', () => {
  it('has a question H1, branded meta title, and a ≤150-char answer', () => {
    const entry = getJournalEntry('dad-skincare-gift-checklist');
    expect(entry.title).toBe(CHECKLIST_HEADLINE);
    expect(entry.title.endsWith('?')).toBe(true);
    expect(CHECKLIST_META_TITLE.endsWith('| 디어파파 DEAR PAPA')).toBe(true);
    expect(CHECKLIST_SUMMARY.length).toBeLessThanOrEqual(150);
  });

  it('states only the fixed product facts in its FAQ', () => {
    const product = CHECKLIST_FAQ.map((f) => f.a).join(' ');
    expect(product).toContain('미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다');
    expect(product).toContain('150ml');
  });

  it('is listed in the sitemap and llms.txt', () => {
    const url = 'https://dearpapa.kr/journal/dad-skincare-gift-checklist';
    expect(read('public/sitemap.xml')).toContain(`<loc>${url}</loc>`);
    expect(read('public/llms.txt')).toContain(`(${url})`);
  });
});
