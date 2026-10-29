import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { ReceivedLetter } from '@/components/letter/ReceivedLetter';
import { createLetterShareUrl, readSharedLetter } from '@/components/letter/share-link';
import { KakaoHandoff } from '@/components/letter/KakaoHandoff';
import { prepareKakaoShare, sendLetterToKakao } from '@/components/letter/kakao-share';
import { DRAFT_KEY } from '@/components/letter/storage';
import { LetterShareDialog } from '@/components/letter/LetterShareDialog';
import ReceivedLetterPage from '@/app/letter/received/page';

let kakaoReady = false;
vi.mock('@/components/letter/kakao-share', () => ({
  prepareKakaoShare: vi.fn(),
  isKakaoReady: vi.fn(() => kakaoReady),
  sendLetterToKakao: vi.fn(),
}));
vi.mock('@/components/letter/share-story', () => ({ createLetterStory: vi.fn().mockResolvedValue(new Blob(['png'], { type: 'image/png' })) }));
const letter = { text: '아빠, 건강하게 오래 함께해요.', from: '딸', date: '2026.10.29' };
const wait = (ms: number) => act(async () => { await new Promise(resolve => setTimeout(resolve, ms)); });
beforeEach(() => {
  kakaoReady = false;
  window.history.replaceState(null, '', '/');
  vi.mocked(prepareKakaoShare).mockReset().mockImplementation(async () => { kakaoReady = true; return true; });
  vi.mocked(sendLetterToKakao).mockReset();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  URL.createObjectURL = vi.fn().mockReturnValue('blob:story');
  URL.revokeObjectURL = vi.fn();
});

it('opens KakaoTalk in one tap once the SDK is ready and only gives guidance, never a sent claim', async () => {
  render(<Composer />);
  const button = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  fireEvent.click(button);
  expect(sendLetterToKakao).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(screen.getByLabelText('편지 내용'));
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  await waitFor(() => expect(button.getAttribute('data-kakao')).toBe('ready'));
  fireEvent.click(button);
  expect(sendLetterToKakao).toHaveBeenCalledWith(expect.objectContaining({ text: letter.text }), {});
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(await screen.findByText('카카오톡을 여는 중이에요…')).toBeTruthy();
  act(() => { window.dispatchEvent(new Event('blur')); });
  expect(await screen.findByText(/카카오톡이 열렸다면 받을 분을 고른 뒤 보내기를 눌러 주세요/)).toBeTruthy();
  expect(screen.queryByText(/보냈어요|전송했어요|전달됐어요/)).toBeNull();
  expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!).text).toBe(letter.text);
});

it('offers the web share page and link copy when KakaoTalk shows no sign of opening', async () => {
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  const button = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  await waitFor(() => expect(button.getAttribute('data-kakao')).toBe('ready'));
  fireEvent.click(button);
  await wait(3100);
  expect(screen.getByText(/카카오톡이 열리지 않았다면/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: '편지 링크 복사' }));
  expect(await screen.findByText('링크를 복사했어요')).toBeTruthy();
  expect(copy.mock.calls[0][0]).toMatch(/^https:\/\/dearpapa.kr\/letter\/received#letter=/);
  fireEvent.click(screen.getByRole('button', { name: '웹에서 카카오톡으로 보내기' }));
  expect(sendLetterToKakao).toHaveBeenLastCalledWith(expect.objectContaining({ text: letter.text }), { web: true });
  expect(screen.getByText('카카오톡을 여는 중이에요…')).toBeTruthy();
});

it('keeps web recovery available after focus leaves because a permission prompt is not proof of app launch', async () => {
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  const button = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  await waitFor(() => expect(button.getAttribute('data-kakao')).toBe('ready'));
  fireEvent.click(button);
  act(() => { window.dispatchEvent(new Event('blur')); });
  fireEvent.click(screen.getByRole('button', { name: '웹에서 카카오톡으로 보내기' }));
  expect(sendLetterToKakao).toHaveBeenLastCalledWith(expect.objectContaining({ text: letter.text }), { web: true });
});

it('discards the previous handoff when the author edits and copies only the new letter after another send', async () => {
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
  render(<Composer />);
  const input = screen.getByLabelText('편지 내용');
  fireEvent.change(input, { target: { value: letter.text } });
  const button = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  await waitFor(() => expect(button.getAttribute('data-kakao')).toBe('ready'));
  fireEvent.click(button);
  act(() => { window.dispatchEvent(new Event('blur')); });
  fireEvent.change(input, { target: { value: '새로 고친 편지예요.' } });
  expect(screen.queryByRole('button', { name: '편지 링크 복사' })).toBeNull();
  fireEvent.click(button);
  act(() => { window.dispatchEvent(new Event('blur')); });
  fireEvent.click(screen.getByRole('button', { name: '편지 링크 복사' }));
  await waitFor(() => expect(copy).toHaveBeenCalledTimes(1));
  expect(readSharedLetter(new URL(copy.mock.calls[0][0]).hash)?.text).toBe('새로 고친 편지예요.');
  fireEvent.change(screen.getByPlaceholderText('이름이나 애칭'), { target: { value: '바뀐 이름' } });
  expect(screen.queryByRole('button', { name: '카카오톡 다시 열기' })).toBeNull();
});

it('explains a device-share failure while keeping a cancelled share quiet', async () => {
  const oldShare = Object.getOwnPropertyDescriptor(navigator, 'share');
  const share = vi.fn().mockRejectedValueOnce(new DOMException('blocked', 'NotAllowedError'))
    .mockRejectedValueOnce(new DOMException('cancelled', 'AbortError'));
  Object.defineProperty(navigator, 'share', { configurable: true, value: share });
  try {
    render(<KakaoHandoff sdk="ready" handoff="notOpened" shareUrl={createLetterShareUrl(letter)}
      onSendAgain={() => {}} onSendWeb={() => {}} onReconnect={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '공유창으로 보내기' }));
    expect(await screen.findByText(/기기 공유창을 열 수 없었어요/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '공유창으로 보내기' }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(2));
    expect(screen.queryByText(/기기 공유창을 열 수 없었어요/)).toBeNull();
  } finally {
    if (oldShare) Object.defineProperty(navigator, 'share', oldShare); else Reflect.deleteProperty(navigator, 'share');
  }
});

it('opens every other way to send from the composer, with the KakaoTalk message preview', async () => {
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  fireEvent.change(screen.getByPlaceholderText('이름이나 애칭'), { target: { value: letter.from } });
  const other = screen.getByRole('button', { name: /다른 방법으로 보내기/ });
  other.focus();
  fireEvent.click(other);
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('tab').map(t => t.textContent)).toEqual(['카카오톡', 'Instagram']);
  const preview = within(dialog).getByText('카카오톡에는 이렇게 보여요').closest('figure')!;
  expect(preview.textContent).toContain('딸의 편지가 도착했어요');
  expect(preview.textContent).not.toContain(letter.text);
  const send = await within(dialog).findByRole('button', { name: '카카오톡으로 편지 보내기' });
  await waitFor(() => expect(send.hasAttribute('disabled')).toBe(false));
  fireEvent.click(send);
  expect(sendLetterToKakao).toHaveBeenCalledWith(expect.objectContaining({ from: letter.from }), {});
  fireEvent.click(within(dialog).getByRole('button', { name: '공유창 닫기' }));
  expect(document.activeElement).toBe(other);
});

it('falls back honestly when the Kakao SDK cannot load and still copies a recipient link', async () => {
  vi.mocked(prepareKakaoShare).mockResolvedValue(false);
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  fireEvent.click(screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ }));
  const dialog = screen.getByRole('dialog');
  expect(await within(dialog).findByText(/카카오톡 연결을 불러오지 못했어요/)).toBeTruthy();
  expect(within(dialog).getByRole('button', { name: '카카오톡 다시 연결' })).toBeTruthy();
  fireEvent.click(within(dialog).getByRole('button', { name: '편지 링크 복사' }));
  expect(await within(dialog).findByText('링크를 복사했어요')).toBeTruthy();
  expect(copy.mock.calls[0][0]).toMatch(/^https:\/\/dearpapa.kr\/letter\/received#letter=/);
  expect(sendLetterToKakao).not.toHaveBeenCalled();
});

it('shows the received letter without the site header and footer around it', () => {
  const { container } = render(<ReceivedLetterPage />);
  expect(container.querySelector('style')?.textContent).toContain('[data-site-chrome]');
  expect(screen.getByRole('link', { name: 'DEAR PAPA 홈으로' }).getAttribute('href')).toBe('/');
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
