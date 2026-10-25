import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LetterBunny } from '@/components/home/LetterBunny';

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

function openQuestion() {
  fireEvent.click(screen.getByRole('button', { name: '토끼에게 질문하기' }));
  return screen.getByRole('textbox', { name: '토끼에게 물어볼 말' });
}

describe('letter bunny AI conversation', () => {
  it('opens the inline question form, focuses it, and returns focus on Escape', () => {
    render(<LetterBunny />);
    const trigger = screen.getByRole('button', { name: '토끼에게 질문하기' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const input = openQuestion();
    expect(document.activeElement).toBe(input);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(/OpenAI/)).toBeTruthy();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('textbox', { name: '토끼에게 물어볼 말' })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('sends only the chat input and displays the actual API answer without reading saved letters', async () => {
    localStorage.setItem('dearpapa-letter', 'PRIVATE SAVED LETTER');
    let payload: unknown;
    vi.stubGlobal('fetch', async (_url: unknown, init: RequestInit) => {
      payload = JSON.parse(init.body as string);
      return Response.json({ ok: true, answer: '아빠, 오늘도 고마워요. 제 마음이 전해졌으면 좋겠어요.' });
    });
    render(<LetterBunny />);
    fireEvent.change(openQuestion(), { target: { value: '고마움을 담은 한 줄을 추천해 줘' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('아빠, 오늘도 고마워요. 제 마음이 전해졌으면 좋겠어요.'));
    expect(payload).toEqual({ messages: [{ role: 'user', content: '고마움을 담은 한 줄을 추천해 줘' }] });
    expect(JSON.stringify(payload)).not.toContain('PRIVATE SAVED LETTER');
    expect(screen.getByText('AI 답변')).toBeTruthy();
  });

  it('keeps failed input for retry and does not present connection errors as AI answers', async () => {
    vi.stubGlobal('fetch', async () => Response.json({ ok: false, error: 'not_configured' }, { status: 503 }));
    render(<LetterBunny />);
    fireEvent.change(openQuestion(), { target: { value: '아빠 생신 편지를 도와줘' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('연결을 준비')); 
    expect((screen.getByRole('textbox', { name: '토끼에게 물어볼 말' }) as HTMLTextAreaElement).value).toBe('아빠 생신 편지를 도와줘');
    expect(screen.queryByText('AI 답변')).toBeNull();
    expect(screen.getByRole('button', { name: '편지 토끼 움직임 다시 보기' }).getAttribute('data-speaking')).toBe('false');
  });

  it('aborts a pending request on close and ignores its late result', async () => {
    let finish!: (value: Response) => void;
    let signal: AbortSignal | null | undefined;
    vi.stubGlobal('fetch', (_url: unknown, init: RequestInit) => {
      signal = init.signal;
      return new Promise<Response>((resolve) => { finish = resolve; });
    });
    render(<LetterBunny />);
    fireEvent.change(openQuestion(), { target: { value: '마음을 전하고 싶어' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    fireEvent.click(screen.getByRole('button', { name: '질문창 닫기' }));
    expect(signal?.aborted).toBe(true);
    await act(async () => { finish(Response.json({ ok: true, answer: '늦게 온 답변' })); });
    expect(screen.queryByText('늦게 온 답변')).toBeNull();
    expect(screen.getByRole('button', { name: '편지 토끼 움직임 다시 보기' }).getAttribute('data-speaking')).toBe('false');
  });

  it('animates speaking only while revealing an answer and stops after completion', async () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} });
    vi.stubGlobal('fetch', async () => Response.json({ ok: true, answer: '아빠, 늘 제 편이 되어 줘서 고마워요.' }));
    render(<LetterBunny />);
    fireEvent.change(openQuestion(), { target: { value: '한 줄 추천' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: '물어보기' })); });
    const bunny = screen.getByRole('button', { name: '편지 토끼 움직임 다시 보기' });
    expect(bunny.getAttribute('data-speaking')).toBe('true');
    act(() => { vi.advanceTimersByTime(10000); });
    expect(bunny.getAttribute('data-speaking')).toBe('false');
    expect(screen.getByRole('status').textContent).toBe('아빠, 늘 제 편이 되어 줘서 고마워요.');
  });

  it('can submit again after a pending request was cancelled', async () => {
    let calls = 0;
    vi.stubGlobal('fetch', () => {
      calls += 1;
      return calls === 1 ? new Promise<Response>(() => {}) : Promise.resolve(Response.json({ ok: true, answer: '새 질문에 대한 답변이에요.' }));
    });
    render(<LetterBunny />);
    fireEvent.change(openQuestion(), { target: { value: '첫 질문' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    fireEvent.click(screen.getByRole('button', { name: '질문창 닫기' }));
    fireEvent.change(openQuestion(), { target: { value: '새 질문' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('새 질문에 대한 답변이에요.'));
  });
});
