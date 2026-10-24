import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { renderCard, toBlob } from '@/components/letter/card';
import { trackAction } from '@/lib/analytics';
import { LETTERS_KEY } from '@/components/letter/storage';

vi.mock('@/lib/analytics', () => ({ trackAction: vi.fn() }));
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
    expect(trackAction).toHaveBeenCalledWith('product_details_after_letter_clicked');
    expect(vi.mocked(trackAction).mock.calls.filter(call => call[0] === 'product_details_after_letter_clicked')).toHaveLength(1);
    expect(vi.mocked(trackAction).mock.calls.every(call => call.length === 1)).toBe(true);
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('아빠에게 전하는 개인적인 문장');
    expect(screen.getByText('카드 이미지를 만들었어요. 다운로드를 확인해 주세요.')).toBeTruthy();
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
