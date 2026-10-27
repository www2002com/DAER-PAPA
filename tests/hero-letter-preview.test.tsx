import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Hero } from '@/components/home/Hero';

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

async function waitForBunny(name = '일단 써봐라, 각 잡지 말고. 편지 쓰기') {
  // LazyLetterBunny resolves via dynamic import (microtasks). Under fake timers, poll by flushing promises.
  for (let i = 0; i < 80; i += 1) {
    const found = screen.queryByRole('button', { name });
    if (found) return found;
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }
  return waitFor(() => screen.getByRole('button', { name }));
}

describe('hero letter preview', () => {
  it('invites writing through the bunny, focuses the editor and pauses the nudge while writing', async () => {
    render(<Hero />);
    const bunny = await waitForBunny();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' }) as HTMLTextAreaElement;
    expect(bunny.getAttribute('data-nudging')).toBe('true');
    fireEvent.click(bunny);
    expect(document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
    expect(bunny.getAttribute('data-nudging')).toBe('false');
    fireEvent.change(input, { target: { value: '내가 직접 쓴 편지' } });
    fireEvent.blur(input);
    fireEvent.click(bunny);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('내가 직접 쓴 편지');
    expect(input.selectionStart).toBe(input.selectionEnd);
  });

  it('updates the letter in the photograph immediately as the handwritten field is edited', async () => {
    const request = vi.fn();
    vi.stubGlobal('fetch', request);
    const { container } = render(<Hero />);
    await waitForBunny();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' }) as HTMLTextAreaElement;
    expect(input.value).toBe('난 아빠가 행복해졌으면 좋겠어');
    const message = '아빠, 늘 내 편이 되어 줘서 고마워요.\n오늘도 행복하세요!';
    fireEvent.change(input, { target: { value: message } });
    expect(container.querySelector('[data-letter-preview]')?.textContent).toBe(message);
    expect(screen.getByRole('img', { name: `사진 속 편지: ${message}, Sodam` })).toBeTruthy();
    expect(container.querySelector('[data-letter-signature]')?.textContent).toBe('Sodam');
    expect(request).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });

  it('clears the photographed message and renders pasted markup only as text', async () => {
    const { container } = render(<Hero />);
    await waitForBunny();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' });
    fireEvent.change(input, { target: { value: '' } });
    expect(container.querySelector('[data-letter-preview]')?.textContent).toBe('');
    expect(screen.getByRole('img', { name: '사진 속 빈 편지' })).toBeTruthy();
    expect(container.querySelector('[data-letter-signature]')).toBeNull();
    const message = '<img src=x onerror=alert(1)> 아빠 & 나';
    fireEvent.change(input, { target: { value: message } });
    const preview = container.querySelector('[data-letter-preview]');
    expect(preview?.textContent).toBe(message);
    expect(preview?.querySelector('img')).toBeNull();
  });

  it('keeps the live letter independent of the bunny question and greeting', async () => {
    const { container } = render(<Hero />);
    await waitForBunny();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' }) as HTMLTextAreaElement;
    expect(input.maxLength).toBe(150);
    const message = '고마워요 '.repeat(30).slice(0, 150);
    fireEvent.change(input, { target: { value: message } });
    fireEvent.click(screen.getByRole('button', { name: 'Sodam에게 질문하기' }));
    const question = screen.getByRole('textbox', { name: 'Sodam에게 물어볼 말' }) as HTMLTextAreaElement;
    expect(question.value).toBe('');
    fireEvent.change(question, { target: { value: '편지를 도와줘' } });
    fireEvent.click(screen.getByRole('button', { name: '질문창 닫기' }));
    fireEvent.click(screen.getByRole('button', { name: '일단 써봐라, 각 잡지 말고. 편지 쓰기' }));
    expect(input.value).toBe(message);
    expect(container.querySelector('[data-letter-preview]')?.textContent).toBe(message);
  });

  it('responds to a completed handwritten line without transmitting a draft or reacting to the initial example', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    render(<Hero />);
    const bunny = await waitForBunny();
    expect(bunny.getAttribute('data-nudging')).toBe('true');
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText('Sodam의 기본 답변')).toBeNull();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' });
    fireEvent.change(input, { target: { value: '아빠가 보고 싶어' } });
    act(() => vi.advanceTimersByTime(800));
    fireEvent.change(input, { target: { value: '아빠에게 서운해' } });
    act(() => vi.advanceTimersByTime(1400));
    expect(screen.getByRole('status').textContent).toContain('서운');
    expect(screen.getByText('Sodam의 기본 답변')).toBeTruthy();
    expect(screen.getByRole('button', { name: '내 답은 바로 아래. 편지 쓰기' }).getAttribute('data-nudging')).toBe('false');
    expect(fetcher).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: ' ' } });
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText('Sodam의 기본 답변')).toBeNull();
  });

  it('submits the visible line with Enter, preserves Shift+Enter and ignores Korean composition', async () => {
    const fetcher = vi.fn(async (_url: unknown, _init?: RequestInit) => Response.json({ ok: true, source: 'ai', answer: '서운했던 순간부터 한 가지만 이야기해 볼까요?', mode: 'support', action: null }));
    vi.stubGlobal('fetch', fetcher);
    render(<Hero />);
    await waitForBunny();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' });
    fireEvent.change(input, { target: { value: '아빠에게 서운해' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode: 229 });
    expect(fetcher).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(screen.getByText('Sodam의 답변')).toBeTruthy());
    expect(fetcher).toHaveBeenCalledOnce();
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', behavior: 'auto' }));
    expect(JSON.parse(fetcher.mock.calls[0][1]!.body as string)).toEqual({ messages: [{ role: 'user', content: '아빠에게 서운해' }] });
    expect(screen.queryByRole('textbox', { name: 'Sodam에게 물어볼 말' })).toBeNull();
  });

  it('waits for composition to finish and prevents an old request replacing a newly edited line', async () => {
    vi.useFakeTimers();
    let finish!: (response: Response) => void;
    let signal: AbortSignal | null | undefined;
    vi.stubGlobal('fetch', (_url: unknown, init: RequestInit) => { signal = init.signal; return new Promise<Response>(resolve => { finish = resolve; }); });
    render(<Hero />);
    await waitForBunny();
    const input = screen.getByRole('textbox', { name: '사진 속 편지에 쓸 말' });
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: '아빠에게 미안해' } });
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText('Sodam의 기본 답변')).toBeNull();
    fireEvent.compositionEnd(input);
    fireEvent.click(screen.getByRole('button', { name: '답변 듣기' }));
    fireEvent.change(input, { target: { value: '아빠에게 고마워' } });
    expect(signal?.aborted).toBe(true);
    await act(async () => { finish(Response.json({ ok: true, answer: '이전 질문의 늦은 답변', source: 'ai' })); });
    act(() => vi.advanceTimersByTime(1400));
    expect(screen.queryByText('이전 질문의 늦은 답변')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('아빠를 생각하는 마음');
  });
});
