import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LetterBunny } from '@/components/home/LetterBunny';

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

function openQuestion() {
  fireEvent.click(screen.getByRole('button', { name: 'Sodam에게 질문하기' }));
  return screen.getByRole('textbox', { name: 'Sodam에게 물어볼 말' });
}

describe('letter bunny AI conversation', () => {
  it('opens the question from the handwritten invitation and returns keyboard focus to it', () => {
    const request = vi.fn(); vi.stubGlobal('fetch', request);
    render(<LetterBunny />);
    const invitation = screen.getByRole('button', { name: '고민돼? 나에게 편하게 털어봐.' });
    fireEvent.click(invitation);
    const input = screen.getByRole('textbox', { name: 'Sodam에게 물어볼 말' });
    expect(document.activeElement).toBe(input);
    expect(invitation.getAttribute('aria-expanded')).toBe('true');
    expect(request).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(document.activeElement).toBe(invitation);
    expect(invitation.getAttribute('aria-expanded')).toBe('false');
  });

  it('changes its playful advice after a stroll and waits while the letter is being written', () => {
    const onWriteLetter = vi.fn();
    const view = render(<LetterBunny onWriteLetter={onWriteLetter} />);
    const bunny = screen.getByRole('button', { name: '일단 한 줄 써 봐, 각 잡지 말고. 편지 쓰기' });
    const stroll = bunny.querySelector('[data-bunny-patrol]');
    expect(stroll).not.toBeNull();
    // jsdom lacks AnimationEvent; React then listens for the WebKit event.
    const iterationEvent = 'AnimationEvent' in window ? 'animationiteration' : 'webkitAnimationIteration';
    const finishStroll = (element: Element) => fireEvent(element, new Event(iterationEvent, { bubbles: true }));
    finishStroll(stroll!);
    expect(screen.getByRole('button', { name: '공짜니까, 어려워 말고 써봐라. 편지 쓰기' })).toBe(bunny);
    // A nested body animation must not advance the dialogue.
    finishStroll(stroll!.firstElementChild!);
    expect(bunny.getAttribute('aria-label')).toBe('공짜니까, 어려워 말고 써봐라. 편지 쓰기');
    view.rerender(<LetterBunny onWriteLetter={onWriteLetter} isWriting />);
    expect(bunny.getAttribute('data-nudging')).toBe('false');
    expect(bunny.getAttribute('aria-label')).toBe('오, 쓰네. 기다려 줄게. 편지 쓰기');
    finishStroll(stroll!);
    view.rerender(<LetterBunny onWriteLetter={onWriteLetter} />);
    expect(bunny.getAttribute('aria-label')).toBe('공짜니까, 어려워 말고 써봐라. 편지 쓰기');
  });

  it('opens the inline question form, focuses it, and returns focus on Escape', () => {
    render(<LetterBunny />);
    const trigger = screen.getByRole('button', { name: 'Sodam에게 질문하기' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const input = openQuestion();
    expect(document.activeElement).toBe(input);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(/Google Gemini/)).toBeTruthy();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('textbox', { name: 'Sodam에게 물어볼 말' })).toBeNull();
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
    expect((screen.getByRole('textbox', { name: 'Sodam에게 물어볼 말' }) as HTMLTextAreaElement).value).toBe('아빠 생신 편지를 도와줘');
    expect(screen.queryByText('AI 답변')).toBeNull();
    expect(screen.getByText('Sodam의 기본 답변')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sodam 움직임 다시 보기' }).getAttribute('data-speaking')).toBe('false');
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
    expect(screen.getByRole('button', { name: 'Sodam 움직임 다시 보기' }).getAttribute('data-speaking')).toBe('false');
  });

  it('animates speaking only while revealing an answer and stops after completion', async () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} });
    vi.stubGlobal('fetch', async () => Response.json({ ok: true, answer: '아빠, 늘 제 편이 되어 줘서 고마워요.' }));
    render(<LetterBunny />);
    fireEvent.change(openQuestion(), { target: { value: '한 줄 추천' } });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: '물어보기' })); });
    const bunny = screen.getByRole('button', { name: 'Sodam 움직임 다시 보기' });
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

  it('still gives a labelled prepared answer when the network is unavailable', async () => {
    vi.stubGlobal('fetch', async () => { throw new TypeError('Failed to fetch'); });
    render(<LetterBunny />);
    const input = openQuestion();
    fireEvent.change(input, { target: { value: '아빠한테 서운해' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(screen.queryByText('Sodam의 기본 답변')).toBeNull();
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('서운'));
    expect(screen.getByText('Sodam의 기본 답변')).toBeTruthy();
    expect(screen.queryByText('AI 답변')).toBeNull();
  });

  it('shows a deliberate external help link, stops nudging, and retains support-only context', async () => {
    const payloads: { supportOnly?: boolean }[] = [];
    vi.stubGlobal('fetch', async (_url: unknown, init: RequestInit) => {
      payloads.push(JSON.parse(init.body as string));
      return Response.json({ ok: true, answer: '안전을 먼저 살펴주세요.', mode: 'referral', source: 'guidance', action: { kind: 'support', href: 'https://support.example/help', label: '도움 받을 곳 살펴보기' } });
    });
    render(<LetterBunny onWriteLetter={vi.fn()} />);
    fireEvent.change(openQuestion(), { target: { value: '아빠와의 관계가 너무 힘들어' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    const link = await screen.findByRole('link', { name: /도움 받을 곳 살펴보기/ });
    expect(link.getAttribute('href')).toBe('https://support.example/help');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByText('도움 안내')).toBeTruthy();
    expect(screen.queryByText('AI 답변')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '질문창 닫기' }));
    const bunny = screen.getByRole('button', { name: /천천히 해도 괜찮아/ });
    expect(bunny.getAttribute('data-nudging')).toBe('false');
    fireEvent.change(openQuestion(), { target: { value: '이어서 말할게' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    await waitFor(() => expect(payloads).toHaveLength(2));
    expect(payloads[1].supportOnly).toBe(true);
    expect(localStorage.length).toBe(0);
  });

  it('focuses the letter without replacing it and does not repeat a product invitation', async () => {
    const onWriteLetter = vi.fn();
    const payloads: { productShown?: boolean }[] = [];
    vi.stubGlobal('fetch', async (_url: unknown, init: RequestInit) => {
      payloads.push(JSON.parse(init.body as string));
      return Response.json({ ok: true, answer: '짧은 말로 시작해 보세요.', source: 'ai', mode: payloads.length === 1 ? 'letter' : 'gift',
        action: payloads.length === 1 ? { kind: 'letter', href: '/#letter', label: '내 말로 한 줄 써보기' }
          : { kind: 'product', href: '/letter-all-in-one', label: 'DEAR PAPA에 담은 마음 보기', description: '안 사도 괜찮으니 편지부터 써보세요.' } });
    });
    render(<LetterBunny onWriteLetter={onWriteLetter} />);
    fireEvent.change(openQuestion(), { target: { value: '아빠에게 편지 쓰고 싶어' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    fireEvent.click(await screen.findByRole('button', { name: '내 말로 한 줄 써보기' }));
    expect(onWriteLetter).toHaveBeenCalledOnce();
    fireEvent.change(openQuestion(), { target: { value: '아빠 선물은?' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    expect(await screen.findByRole('link', { name: 'DEAR PAPA에 담은 마음 보기' })).toBeTruthy();
    expect(screen.getByText('브랜드 제안 · 선택사항')).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Sodam에게 물어볼 말' }), { target: { value: '계속 얘기해 줘' } });
    fireEvent.click(screen.getByRole('button', { name: '물어보기' }));
    await waitFor(() => expect(payloads).toHaveLength(3));
    expect(payloads[2].productShown).toBe(true);
  });
});
