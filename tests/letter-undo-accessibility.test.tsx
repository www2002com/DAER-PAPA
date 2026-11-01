import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';

afterEach(() => vi.useRealTimers());

describe('letter recovery without a time limit', () => {
  it.each(['편지 내용', '보내는 사람'])('expires draft undo when %s is edited again', (label) => {
    vi.useFakeTimers();
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '처음 쓴 편지' } });
    fireEvent.click(screen.getByRole('button', { name: '지우기', exact: true }));
    fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: '새로 쓴 내용' } });
    act(() => { vi.advanceTimersByTime(30000); });
    expect(screen.queryByRole('button', { name: '되돌리기' })).toBeNull();
    expect((screen.getByLabelText(new RegExp(label)) as HTMLInputElement).value).toBe('새로 쓴 내용');
  });

  it('keeps undo available after reading slowly and restores the draft and sender', () => {
    vi.useFakeTimers();
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '아빠, 늘 고마워요.' } });
    fireEvent.change(screen.getByLabelText(/보내는 사람/), { target: { value: '딸' } });
    fireEvent.click(screen.getByRole('button', { name: '지우기', exact: true }));
    act(() => { vi.advanceTimersByTime(30000); });
    fireEvent.click(screen.getByRole('button', { name: '되돌리기' }));
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('아빠, 늘 고마워요.');
    expect((screen.getByLabelText(/보내는 사람/) as HTMLInputElement).value).toBe('딸');
  });

  it('offers undo when starting a new letter would replace an unsaved draft', () => {
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '아직 다 쓰지 못한 마음' } });
    fireEvent.click(screen.getByRole('tab', { name: /보관함/ }));
    fireEvent.click(screen.getByRole('button', { name: '첫 편지 쓰기' }));
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('');
    fireEvent.click(screen.getByRole('button', { name: '되돌리기' }));
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('아직 다 쓰지 못한 마음');
  });
});
