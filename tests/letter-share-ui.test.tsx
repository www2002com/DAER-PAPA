import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { ReceivedLetter } from '@/components/letter/ReceivedLetter';
import { createLetterShareUrl } from '@/components/letter/share-link';
import { prepareKakaoShare, sendLetterToKakao } from '@/components/letter/kakao-share';
import { DRAFT_KEY } from '@/components/letter/storage';
import { LetterShareDialog } from '@/components/letter/LetterShareDialog';

vi.mock('@/components/letter/kakao-share', () => ({ prepareKakaoShare: vi.fn().mockResolvedValue(true), sendLetterToKakao: vi.fn() }));
vi.mock('@/components/letter/share-story', () => ({ createLetterStory: vi.fn().mockResolvedValue(new Blob(['png'], { type: 'image/png' })) }));
const letter = { text: '아빠, 건강하게 오래 함께해요.', from: '딸', date: '2026.10.29' };
beforeEach(() => {
  window.history.replaceState(null, '', '/');
  vi.mocked(prepareKakaoShare).mockResolvedValue(true);
  vi.mocked(sendLetterToKakao).mockClear();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  URL.createObjectURL = vi.fn().mockReturnValue('blob:story');
  URL.revokeObjectURL = vi.fn();
});

it('always exposes sharing, guards an empty draft, then opens Kakao first without sending', async () => {
  render(<Composer />);
  const button = screen.getByRole('button', { name: /편지 공유하기/ });
  fireEvent.click(button);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(screen.getByLabelText('편지 내용'));
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  button.focus();
  fireEvent.click(button);
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('tab').map(t => t.textContent)).toEqual(['카카오톡', 'Instagram']);
  expect(within(dialog).getByRole('tab', { name: '카카오톡' }).getAttribute('aria-selected')).toBe('true');
  await waitFor(() => expect(within(dialog).getByRole('button', { name: '카카오톡으로 보내기' }).hasAttribute('disabled')).toBe(false));
  expect(sendLetterToKakao).not.toHaveBeenCalled();
  fireEvent.click(within(dialog).getByRole('button', { name: '카카오톡으로 보내기' }));
  expect(sendLetterToKakao).toHaveBeenCalledWith(expect.objectContaining({ text: letter.text }));
  fireEvent.click(within(dialog).getByRole('button', { name: '공유창 닫기' }));
  expect(document.activeElement).toBe(button);
  expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!).text).toBe(letter.text);
});

it('falls back honestly when Kakao SDK is unavailable and copies a recipient link', async () => {
  vi.mocked(prepareKakaoShare).mockResolvedValue(false);
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  fireEvent.click(screen.getByRole('button', { name: /편지 공유하기/ }));
  await screen.findByText(/카카오톡 연결을 사용할 수 없어요/);
  fireEvent.click(screen.getByRole('button', { name: '편지 링크 복사' }));
  await screen.findByText('편지 링크를 복사했어요.');
  expect(copy.mock.calls[0][0]).toMatch(/^https:\/\/dearpapa.kr\/letter\/received#letter=/);
  expect(sendLetterToKakao).not.toHaveBeenCalled();
});

it('keeps letter contents closed until the recipient opens it and preserves their own draft', async () => {
  const draft = JSON.stringify({ text: '받는 사람의 기존 편지', from: '나', editingId: null });
  localStorage.setItem(DRAFT_KEY, draft);
  window.history.replaceState(null, '', new URL(createLetterShareUrl(letter)).pathname + new URL(createLetterShareUrl(letter)).hash);
  render(<ReceivedLetter />);
  expect(screen.queryByText(letter.text)).toBeNull();
  fireEvent.click(await screen.findByRole('button', { name: '편지 열어보기' }));
  expect(screen.getByLabelText('받은 편지').textContent).toContain(letter.text);
  expect(localStorage.getItem(DRAFT_KEY)).toBe(draft);
  window.history.replaceState(null, '', '/letter/received#broken');
  fireEvent(window, new Event('hashchange'));
  expect(await screen.findByText('편지 링크를 확인해 주세요.')).toBeTruthy();
  expect(screen.queryByLabelText('받은 편지')).toBeNull();
});

it('renders received markup as text, never HTML', async () => {
  const marked = { ...letter, text: '<img src=x onerror=alert(1)>' };
  window.history.replaceState(null, '', '/letter/received' + new URL(createLetterShareUrl(marked)).hash);
  const { container } = render(<ReceivedLetter />);
  fireEvent.click(await screen.findByRole('button', { name: '편지 열어보기' }));
  expect(screen.getByLabelText('받은 편지').textContent).toContain(marked.text);
  expect(container.querySelector('img[src="x"]')).toBeNull();
});

it('preserves the received-letter URL when using the site skip link', async () => {
  const hash = new URL(createLetterShareUrl(letter)).hash;
  window.history.replaceState(null, '', '/letter/received' + hash);
  render(<><a href="#main">본문 바로가기</a><main id="main"><ReceivedLetter /></main></>);
  fireEvent.click(await screen.findByRole('link', { name: '본문 바로가기' }));
  expect(window.location.hash).toBe(hash);
  expect(document.activeElement?.id).toBe('main');
  expect(screen.getByRole('button', { name: '편지 열어보기' })).toBeTruthy();
});

it('shares the already prepared Instagram image and treats cancellation as cancellation', async () => {
  const share = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'));
  const oldShare = Object.getOwnPropertyDescriptor(navigator, 'share');
  const oldCanShare = Object.getOwnPropertyDescriptor(navigator, 'canShare');
  Object.defineProperty(navigator, 'share', { configurable: true, value: share });
  Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
  try {
    render(<LetterShareDialog letter={letter} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Instagram' }));
    expect(share).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole('button', { name: '이미지 공유창 열기' }));
    await waitFor(() => expect(screen.getByRole('button', { name: '이미지 공유창 열기' }).hasAttribute('disabled')).toBe(false));
    expect(share).toHaveBeenCalledTimes(1);
    expect(share.mock.calls[0][0].files[0].type).toBe('image/png');
    expect(screen.queryByText(/공유창을 열 수 없었어요/)).toBeNull();
    expect(screen.queryByText(/전송했어요|공유했어요/)).toBeNull();
  } finally {
    if (oldShare) Object.defineProperty(navigator, 'share', oldShare); else Reflect.deleteProperty(navigator, 'share');
    if (oldCanShare) Object.defineProperty(navigator, 'canShare', oldCanShare); else Reflect.deleteProperty(navigator, 'canShare');
  }
});
