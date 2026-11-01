import { StrictMode } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { DRAFT_KEY, LETTERS_KEY, loadLetters, saveLetters } from '@/components/letter/storage';
import { STARTERS } from '@/components/letter/starters';

const archive = () => Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, date: '2026.10.20', text: `보관한 편지 ${i + 1}`, from: '딸',
}));

describe('letter preservation', () => {
  const longLetter = { id: 91, date: '2026.10.29', text: '가'.repeat(149) + '💌마지막 문장', from: '딸'.repeat(13) + '💌' };
  const storedDraft = () => JSON.parse(localStorage.getItem(DRAFT_KEY)!);

  it('preserves a long draft through repeated Strict Mode restoration and automatic saves', () => {
    const original = { text: longLetter.text + '\r\n끝', from: longLetter.from, editingId: null };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(original));
    for (let i = 0; i < 3; i++) {
      const page = render(<StrictMode><Composer /></StrictMode>);
      expect(storedDraft()).toEqual(original);
      expect((screen.getByLabelText(/보내는 사람/) as HTMLInputElement).value).toBe(original.from);
      page.unmount();
      expect(storedDraft()).toEqual(original);
    }
  });

  it('does not truncate a long restored letter during deletion, IME completion or starter insertion', () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...longLetter, editingId: null }));
    render(<Composer />);
    const input = screen.getByLabelText('편지 내용');
    const shorter = longLetter.text.slice(0, -1);
    fireEvent.change(input, { target: { value: shorter } });
    expect(storedDraft().text).toBe(shorter);
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: shorter + '한' } });
    fireEvent.compositionEnd(input);
    expect(storedDraft().text).toBe(shorter + '한');
    const sender = longLetter.from.slice(0, -2);
    fireEvent.change(screen.getByLabelText(/보내는 사람/), { target: { value: sender } });
    expect(storedDraft().from).toBe(sender);
    const starter = STARTERS[0].lines[0];
    fireEvent.click(screen.getByRole('button', { name: starter }));
    expect(storedDraft().text).toBe(shorter + '한\n' + starter);
  });

  it('preserves long archive entries when another entry is saved, deleted and restored', () => {
    const other = { id: 92, date: '2026.10.30', text: '다른 편지', from: '아들' };
    localStorage.setItem(LETTERS_KEY, JSON.stringify([longLetter, other]));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '새 편지' } });
    fireEvent.click(screen.getByRole('button', { name: '보관함에 담기' }));
    expect(loadLetters().find(l => l.id === longLetter.id)).toEqual(longLetter);
    fireEvent.click(screen.getByRole('tab', { name: /보관함/ }));
    fireEvent.click(screen.getByRole('button', { name: '2026.10.30 편지 지우기' }));
    expect(loadLetters().find(l => l.id === longLetter.id)).toEqual(longLetter);
    fireEvent.click(screen.getByRole('button', { name: '되돌리기' }));
    expect(loadLetters().find(l => l.id === other.id)).toEqual(other);
    for (let i = 0; i < 2; i++) {
      const item = screen.getByText(longLetter.text, { selector: 'span' }).closest('li')!;
      fireEvent.click(within(item).getByRole('button', { name: '이어 쓰기' }));
      expect(storedDraft()).toEqual({ text: longLetter.text, from: longLetter.from, editingId: longLetter.id });
      expect(loadLetters().find(l => l.id === longLetter.id)).toEqual(longLetter);
      fireEvent.click(screen.getByRole('tab', { name: /보관함/ }));
    }
  });

  it('focuses the message field when arriving at the letter hash', async () => {
    const page = render(<Composer />);
    window.history.replaceState(null, '', '/#letter');
    fireEvent(window, new Event('hashchange'));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('편지 내용')));
    page.unmount();
    window.history.replaceState(null, '', '/');
  });

  it('focuses the message field when the entry link is clicked on the current hash', async () => {
    window.history.replaceState(null, '', '/');
    render(<><a href="/#letter" data-letter-entry>편지 진입</a><Composer /></>);
    window.history.replaceState(null, '', '/#letter');
    fireEvent.click(screen.getByRole('link', { name: '편지 진입' }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText('편지 내용')));
    window.history.replaceState(null, '', '/');
  });

  it('marks the internal write button as the letter entry action', () => {
    render(<Composer />);
    expect(screen.getByRole('button', { name: '아빠에게 편지 쓰기' }).getAttribute('data-track-action')).toBe('letter_entry_clicked');
  });

  it('retains the latest text and sender when the composer unmounts immediately after input', () => {
    const page = render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '아빠, 마지막 문장까지 남겨 주세요.' } });
    fireEvent.change(screen.getByLabelText(/보내는 사람/), { target: { value: '딸' } });
    page.unmount();
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null')).toMatchObject({
      text: '아빠, 마지막 문장까지 남겨 주세요.', from: '딸',
    });
  });

  it('does not overwrite a restored draft during Strict Mode initialization', () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ text: '전에 쓰던 소중한 편지', from: '아들', editingId: null }));
    const page = render(<StrictMode><Composer /></StrictMode>);
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('전에 쓰던 소중한 편지');
    page.unmount();
    expect(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null').text).toBe('전에 쓰던 소중한 편지');
  });

  it('keeps all existing letters when a visitor tries to add a 21st letter', () => {
    const existing = archive();
    localStorage.setItem(LETTERS_KEY, JSON.stringify(existing));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '새로 쓴 편지도 잃지 않아요.' } });
    fireEvent.click(screen.getByRole('button', { name: '보관함에 담기' }));
    expect(JSON.parse(localStorage.getItem(LETTERS_KEY) ?? 'null')).toEqual(existing);
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('새로 쓴 편지도 잃지 않아요.');
  });

  it('rejects an oversized archive without truncating previously stored letters', () => {
    const existing = archive();
    localStorage.setItem(LETTERS_KEY, JSON.stringify(existing));
    expect(saveLetters([...existing, { id: 21, date: '2026.10.22', text: '새 편지', from: '' }])).toBe(false);
    expect(JSON.parse(localStorage.getItem(LETTERS_KEY) ?? 'null')).toEqual(existing);
  });

  it('loads every existing letter in a legacy archive that exceeds the current limit', () => {
    const existing = [...archive(), { id: 21, date: '2026.10.21', text: '이전 기기의 편지', from: '' }];
    localStorage.setItem(LETTERS_KEY, JSON.stringify(existing));
    expect(loadLetters()).toEqual(existing);
  });

  it('allows editing a saved letter when the archive already contains 20 letters', () => {
    const existing = archive();
    localStorage.setItem(LETTERS_KEY, JSON.stringify(existing));
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ text: existing[0].text, from: '딸', editingId: 1 }));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '고쳐 쓴 소중한 편지' } });
    fireEvent.click(screen.getByRole('button', { name: '보관함에 다시 담기' }));
    const saved = JSON.parse(localStorage.getItem(LETTERS_KEY) ?? 'null');
    expect(saved).toHaveLength(20);
    expect(saved.find((letter: { id: number }) => letter.id === 1).text).toBe('고쳐 쓴 소중한 편지');
    expect(saved.map((letter: { id: number }) => letter.id).sort((a: number, b: number) => a - b)).toEqual(existing.map(letter => letter.id));
  });
});
