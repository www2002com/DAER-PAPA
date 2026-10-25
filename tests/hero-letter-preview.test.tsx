import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '@/components/home/Hero';

afterEach(() => vi.unstubAllGlobals());

describe('hero letter preview', () => {
  it('updates the letter in the photograph immediately as the handwritten field is edited', () => {
    const request = vi.fn();
    vi.stubGlobal('fetch', request);
    const { container } = render(<Hero />);
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' }) as HTMLTextAreaElement;
    expect(input.value).toBe('난 아빠가 행복해졌으면 좋겠어');
    const message = '아빠, 늘 내 편이 되어 줘서 고마워요.\n오늘도 행복하세요!';
    fireEvent.change(input, { target: { value: message } });
    expect(container.querySelector('[data-letter-preview]')?.textContent).toBe(message);
    expect(screen.getByRole('img', { name: `사진 속 편지: ${message}` })).toBeTruthy();
    expect(request).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });

  it('clears the photographed message and renders pasted markup only as text', () => {
    const { container } = render(<Hero />);
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' });
    fireEvent.change(input, { target: { value: '' } });
    expect(container.querySelector('[data-letter-preview]')?.textContent).toBe('');
    expect(screen.getByRole('img', { name: '사진 속 빈 편지' })).toBeTruthy();
    const message = '<img src=x onerror=alert(1)> 아빠 & 나';
    fireEvent.change(input, { target: { value: message } });
    const preview = container.querySelector('[data-letter-preview]');
    expect(preview?.textContent).toBe(message);
    expect(preview?.querySelector('img')).toBeNull();
  });

  it('keeps the live letter independent of the bunny question and greeting', () => {
    const { container } = render(<Hero />);
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' }) as HTMLTextAreaElement;
    expect(input.maxLength).toBe(150);
    const message = '고마워요 '.repeat(30).slice(0, 150);
    fireEvent.change(input, { target: { value: message } });
    fireEvent.click(screen.getByRole('button', { name: '토끼에게 질문하기' }));
    const question = screen.getByRole('textbox', { name: '토끼에게 물어볼 말' }) as HTMLTextAreaElement;
    expect(question.value).toBe('');
    fireEvent.change(question, { target: { value: '편지를 도와줘' } });
    fireEvent.click(screen.getByRole('button', { name: '질문창 닫기' }));
    fireEvent.click(screen.getByRole('button', { name: '편지 토끼 움직임 다시 보기' }));
    expect(input.value).toBe(message);
    expect(container.querySelector('[data-letter-preview]')?.textContent).toBe(message);
  });
});
