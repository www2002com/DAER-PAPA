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
    expect(trackAction).toHaveBeenCalledWith('product_details_after_letter_clicked', { source: 'export' });
    expect(vi.mocked(trackAction).mock.calls.filter(call => call[0] === 'product_details_after_letter_clicked')).toHaveLength(1);
    // Only fixed property values travel with events; never the letter text or sender.
    const serialized = JSON.stringify(vi.mocked(trackAction).mock.calls);
    expect(serialized).not.toContain('개인적인 문장');
    expect(vi.mocked(trackAction).mock.calls.every(call => call.length === 1 || Object.keys(call[1] as object).every(k => k === 'source'))).toBe(true);
    expect((screen.getByLabelText('편지 내용') as HTMLTextAreaElement).value).toBe('아빠에게 전하는 개인적인 문장');
  });

  it('offers the same link after a completed system share, tagged as share', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, share, canShare: () => true });
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '공유로 전하는 문장' } });
    expect(productLink()).toBeNull();
    fireEvent.click(await screen.findByRole('button', { name: '공유하기' }));
    await waitFor(() => expect(productLink()).not.toBeNull());
    expect(share).toHaveBeenCalledTimes(1);
    productLink()!.addEventListener('click', event => event.preventDefault());
    fireEvent.click(productLink()!);
    expect(trackAction).toHaveBeenCalledWith('product_details_after_letter_clicked', { source: 'share' });
    vi.unstubAllGlobals();
  });

  it('does not reveal the link when the share sheet is dismissed', async () => {
    const abort = Object.assign(new Error('cancelled'), { name: 'AbortError' });
    vi.stubGlobal('navigator', { ...navigator, share: vi.fn().mockRejectedValue(abort), canShare: () => true });
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '취소되는 공유' } });
    fireEvent.click(await screen.findByRole('button', { name: '공유하기' }));
    await act(async () => { await Promise.resolve(); });
    expect(productLink()).toBeNull();
    vi.unstubAllGlobals();
  });

  it('keeps the product link hidden for empty input', () => {
    render(<Composer />);
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    expect(productLink()).toBeNull();
    expect(renderCard).not.toHaveBeenCalled();
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
