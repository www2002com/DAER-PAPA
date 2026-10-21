import { StrictMode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { DRAFT_KEY, LETTERS_KEY, loadLetters, saveLetters } from '@/components/letter/storage';

const archive = () => Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, date: '2026.10.20', text: `보관한 편지 ${i + 1}`, from: '딸',
}));

describe('letter preservation', () => {
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
