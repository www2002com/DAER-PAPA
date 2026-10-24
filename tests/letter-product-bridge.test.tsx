import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { renderCard, toBlob } from '@/components/letter/card';
import { trackAction } from '@/lib/analytics';
import { LETTERS_KEY } from '@/components/letter/storage';
import { prepareKakaoShare, sendLetterToKakao } from '@/components/letter/kakao-share';

vi.mock('@/lib/analytics', () => ({ trackAction: vi.fn() }));
vi.mock('@/components/letter/kakao-share', () => ({ prepareKakaoShare: vi.fn().mockResolvedValue(true), sendLetterToKakao: vi.fn() }));
vi.mock('@/components/letter/share-story', () => ({ createLetterStory: vi.fn().mockResolvedValue(new Blob(['png'], { type: 'image/png' })) }));
vi.mock('@/components/letter/card', async (original) => ({
  ...await original<typeof import('@/components/letter/card')>(),
  renderCard: vi.fn(), toBlob: vi.fn(),
}));

const productLink = () => screen.queryByRole('link', { name: '레터 올인원 준비 내용 보기' });

beforeEach(() => {
  vi.mocked(trackAction).mockClear();
  vi.mocked(renderCard).mockReset().mockResolvedValue(document.createElement('canvas'));
  vi.mocked(toBlob).mockReset().mockResolvedValue(new Blob(['test'], { type: 'image/png' }));
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-card');
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  vi.mocked(prepareKakaoShare).mockResolvedValue(true);
  vi.mocked(sendLetterToKakao).mockReset();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

describe('optional product discovery after letter export', () => {
  it('does not interrupt writing, then offers a plain product link after export', async () => {
    render(<Composer />);
    expect(productLink()).toBeNull();
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '아빠에게 전하는 개인적인 문장' } });
    expect(productLink()).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    await waitFor(() => expect(productLink()).not.toBeNull());
    expect(productLink()?.getAttribute('href')).toBe('/letter-all-in-one');
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 2300)); });
    expect(productLink()).not.toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trackAction).toHaveBeenCalledWith('letter_card_exported');
    productLink()!.addEventListener('click', event => event.preventDefault());
    fireEvent.click(productLink()!);
    expect(trackAction).toHaveBeenCalledWith('product_details_after_letter_clicked', { source: 'export' });
    expect(vi.mocked(trackAction).mock.calls.filter(call => call[0] === 'product_details_after_letter_clicked')).toHaveLength(1);
    // Only fixed property values travel with events; never the letter text or sender.
    const serialized = JSON.stringify(vi.mocked(trackAction).mock.calls);
    expect(serialized).not.toContain('개인적인 문장');
    expect(vi.mocked(trackAction).mock.calls.every(call => call.length === 1 || Object.keys(call[1] as object).every(k => k === 'source'))).toBe(true);
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('아빠에게 전하는 개인적인 문장');
    expect(screen.getByText('카드 이미지를 만들었어요. 다운로드를 확인해 주세요.')).toBeTruthy();
  });

  it('reveals the same link once a share action is chosen in the dialog, tagged as share (attempted, not delivered)', async () => {
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '공유로 전하는 문장' } });
    fireEvent.click(screen.getByRole('button', { name: /편지 공유하기/ }));
    const dialog = screen.getByRole('dialog');
    // Opening the dialog alone is not a share action.
    expect(productLink()).toBeNull();
    const send = await within(dialog).findByRole('button', { name: '카카오톡으로 보내기' });
    await waitFor(() => expect(send.hasAttribute('disabled')).toBe(false));
    fireEvent.click(send);
    expect(sendLetterToKakao).toHaveBeenCalledTimes(1);
    fireEvent.click(within(dialog).getByRole('button', { name: '공유창 닫기' }));
    await waitFor(() => expect(productLink()).not.toBeNull());
    productLink()!.addEventListener('click', event => event.preventDefault());
    fireEvent.click(productLink()!);
    expect(trackAction).toHaveBeenCalledWith('product_details_after_letter_clicked', { source: 'share' });
  });

  it('counts a copied recipient link as a share action', async () => {
    const copy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '링크로 전하는 문장' } });
    fireEvent.click(screen.getByRole('button', { name: /편지 공유하기/ }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: '편지 링크 복사' }));
    await screen.findByText('편지 링크를 복사했어요.');
    expect(productLink()).not.toBeNull();
  });

  it('does not reveal the link when the dialog closes without a share action, or when sending fails', async () => {
    vi.mocked(sendLetterToKakao).mockImplementation(() => { throw new Error('not initialised'); });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '보내지 않는 문장' } });
    fireEvent.click(screen.getByRole('button', { name: /편지 공유하기/ }));
    const dialog = screen.getByRole('dialog');
    const send = await within(dialog).findByRole('button', { name: '카카오톡으로 보내기' });
    await waitFor(() => expect(send.hasAttribute('disabled')).toBe(false));
    fireEvent.click(send);
    await screen.findByText(/카카오톡 공유창을 열 수 없었어요/);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: '편지 링크 복사' }));
    await screen.findByText(/길게 누르거나 선택해서 복사/);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: '공유창 닫기' }));
    await act(async () => { await Promise.resolve(); });
    expect(productLink()).toBeNull();
  });

  it('keeps the product link hidden for empty input', () => {
    render(<Composer />);
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    expect(productLink()).toBeNull();
    expect(renderCard).not.toHaveBeenCalled();
  });

  it('ignores a second export while the card is being prepared', async () => {
    let resolveRender: (canvas: HTMLCanvasElement) => void = () => {};
    vi.mocked(renderCard).mockImplementation(() => new Promise<HTMLCanvasElement>(resolve => { resolveRender = resolve; }));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '한 번만 카드로 만들어요.' } });
    const button = screen.getByRole('button', { name: '카드 이미지 저장' });
    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));
    fireEvent.click(button);
    expect(renderCard).toHaveBeenCalledTimes(1);
    resolveRender(document.createElement('canvas'));
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('false'));
  });

  it('does not let an earlier completion timer clear a later export', async () => {
    let resolveFirst: (canvas: HTMLCanvasElement) => void = () => {};
    let resolveSecond: (canvas: HTMLCanvasElement) => void = () => {};
    vi.mocked(renderCard)
      .mockImplementationOnce(() => new Promise<HTMLCanvasElement>(resolve => { resolveFirst = resolve; }))
      .mockImplementationOnce(() => new Promise<HTMLCanvasElement>(resolve => { resolveSecond = resolve; }));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '첫 번째 편지' } });
    const button = screen.getByRole('button', { name: '카드 이미지 저장' });
    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));
    resolveFirst(document.createElement('canvas'));
    await waitFor(() => expect(screen.getByRole('button', { name: '다운로드 준비됨' })).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: '다운로드 준비됨' }));
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true'));
    await new Promise(resolve => setTimeout(resolve, 2300));
    expect(button.getAttribute('aria-busy')).toBe('true');
    fireEvent.click(button);
    expect(renderCard).toHaveBeenCalledTimes(2);
    resolveSecond(document.createElement('canvas'));
    await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('false'));
  });

  it('offers the same optional link after exporting an archived letter', async () => {
    localStorage.setItem(LETTERS_KEY, JSON.stringify([{ id: 1, text: '보관한 편지', from: '', date: '2026.10.24' }]));
    render(<Composer />);
    fireEvent.click(screen.getByRole('tab', { name: /^보관함/ }));
    fireEvent.click(screen.getByRole('button', { name: '이미지 저장' }));
    await waitFor(() => expect(productLink()).not.toBeNull());
    expect(productLink()?.closest('[hidden]')).toBeNull();
    productLink()!.addEventListener('click', event => event.preventDefault());
    fireEvent.click(productLink()!);
    expect(trackAction).toHaveBeenCalledWith('product_details_after_letter_clicked', { source: 'archive' });
  });

  it.each(['render', 'blob', 'exception'])('does not show a success follow-up after %s failure', async (failure) => {
    if (failure === 'render') vi.mocked(renderCard).mockResolvedValue(null);
    if (failure === 'blob') vi.mocked(toBlob).mockResolvedValue(null);
    if (failure === 'exception') vi.mocked(renderCard).mockRejectedValue(new Error('render failure'));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '아빠, 고마워요.' } });
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    await waitFor(() => expect(screen.getByRole('button', { name: '카드 이미지 저장' }).getAttribute('aria-busy')).toBe('false'));
    expect(productLink()).toBeNull();
    expect(trackAction).not.toHaveBeenCalledWith('letter_card_exported');
  });
});
