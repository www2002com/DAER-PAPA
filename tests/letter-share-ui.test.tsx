import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { ReceivedLetter } from '@/components/letter/ReceivedLetter';
import { createLetterShareUrl, readSharedLetter } from '@/components/letter/share-link';
import { KakaoHandoff } from '@/components/letter/KakaoHandoff';
import { prepareKakaoShare, sendLetterToKakao } from '@/components/letter/kakao-share';
import { DRAFT_KEY } from '@/components/letter/storage';
import { LetterShareDialog } from '@/components/letter/LetterShareDialog';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import ReceivedLetterPage from '@/app/letter/received/page';

let kakaoReady = false;
vi.mock('@/components/letter/kakao-share', () => ({
  prepareKakaoShare: vi.fn(),
  isKakaoReady: vi.fn(() => kakaoReady),
  sendLetterToKakao: vi.fn(),
}));
vi.mock('@/components/letter/share-story', () => ({ createLetterStory: vi.fn().mockResolvedValue(new Blob(['png'], { type: 'image/png' })) }));
vi.mock('next/navigation', () => ({ usePathname: () => '/letter/received' }));
const letter = { text: '아빠, 건강하게 오래 함께해요.', from: '딸', date: '2026.10.29' };
const hide = () => act(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  document.dispatchEvent(new Event('visibilitychange'));
});
const blur = () => act(() => { window.dispatchEvent(new Event('blur')); });
async function readyComposer() {
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  const button = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  await waitFor(() => expect(button.getAttribute('data-kakao')).toBe('ready'));
  return button;
}
beforeEach(() => {
  kakaoReady = false;
  localStorage.clear();
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  window.history.replaceState(null, '', '/');
  window.matchMedia = ((query: string) => ({ matches: false, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false })) as typeof window.matchMedia;
  vi.mocked(prepareKakaoShare).mockReset().mockImplementation(async () => { kakaoReady = true; return true; });
  vi.mocked(sendLetterToKakao).mockReset();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  URL.createObjectURL = vi.fn().mockReturnValue('blob:story');
  URL.revokeObjectURL = vi.fn();
});

it('blocks both share paths for long restored text/sender, then shares the explicitly shortened letter', async () => {
  const original = { text: '가'.repeat(149) + '💌끝', from: '딸'.repeat(13), editingId: null };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(original));
  render(<Composer />);
  const send = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  const other = screen.getByRole('button', { name: /다른 방법으로 보내기/ });
  await waitFor(() => expect(send.getAttribute('data-kakao')).toBe('ready'));
  fireEvent.click(send);
  fireEvent.click(other);
  expect(sendLetterToKakao).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByText(/공유하려면.*직접 줄여 주세요/)).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!)).toEqual(original);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  fireEvent.click(send);
  fireEvent.click(other);
  expect(sendLetterToKakao).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(screen.getByLabelText(/보내는 사람/));
  fireEvent.change(screen.getByLabelText(/보내는 사람/), { target: { value: letter.from } });
  expect(screen.queryByText(/공유하려면.*직접 줄여 주세요/)).toBeNull();
  fireEvent.click(send);
  expect(sendLetterToKakao).toHaveBeenCalledTimes(1);
  expect(vi.mocked(sendLetterToKakao).mock.calls[0][0]).toMatchObject({ text: letter.text, from: letter.from });
  fireEvent.click(other);
  const dialog = screen.getByRole('dialog');
  const url = within(dialog).getByRole('link', { name: /받는 화면 미리보기/ }).getAttribute('href')!;
  expect(readSharedLetter(new URL(url, 'https://dearpapa.kr').hash)).toMatchObject({ text: letter.text, from: letter.from });
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
  blur();
  expect(await screen.findByText(/카카오톡이 열렸다면 받을 분을 고른 뒤 보내기를 눌러 주세요/)).toBeTruthy();
  expect(screen.queryByText(/보냈어요|전송했어요|전달됐어요/)).toBeNull();
  expect(JSON.parse(localStorage.getItem(DRAFT_KEY)!).text).toBe(letter.text);
});

it('loads the Kakao SDK only after the visitor starts the letter, and shows the privacy line beside the button', async () => {
  render(<Composer />);
  expect(prepareKakaoShare).not.toHaveBeenCalled();
  expect(screen.getByText(/편지와 이름이 링크에 담겨요\. 링크를 받은 사람은 누구나 읽을 수 있어요/)).toBeTruthy();
  fireEvent.focus(screen.getByLabelText('편지 내용'));
  await waitFor(() => expect(prepareKakaoShare).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('treats the page going hidden (the Android launch signal) as opened', async () => {
  const button = await readyComposer();
  fireEvent.click(button);
  hide();
  expect(await screen.findByText(/카카오톡이 열렸다면/)).toBeTruthy();
  expect(button.hasAttribute('aria-busy')).toBe(false);
});

it('ignores a second tap while KakaoTalk is still opening', async () => {
  const button = await readyComposer();
  fireEvent.click(button);
  fireEvent.click(button);
  expect(sendLetterToKakao).toHaveBeenCalledTimes(1);
  expect(button.getAttribute('aria-busy')).toBe('true');
  blur();
  await screen.findByText(/카카오톡이 열렸다면/);
  fireEvent.click(screen.getByRole('button', { name: '카카오톡 다시 열기' }));
  expect(sendLetterToKakao).toHaveBeenCalledTimes(2);
});

it('offers the web share page and link copy when KakaoTalk shows no sign of opening, and the verdict stays final', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  try {
    const copy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
    const button = await readyComposer();
    fireEvent.click(button);
    act(() => { vi.advanceTimersByTime(2999); });
    expect(screen.getByText('카카오톡을 여는 중이에요…')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByText(/카카오톡이 열리지 않았다면/)).toBeTruthy();
    // A later blur (share sheet, tab switch, screen lock) must not rewrite the verdict.
    blur();
    expect(screen.getByText(/카카오톡이 열리지 않았다면/)).toBeTruthy();
    expect(screen.queryByText(/카카오톡이 열렸다면/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '편지 링크 복사' }));
    expect(await screen.findByText('링크를 복사했어요')).toBeTruthy();
    expect(copy.mock.calls[0][0]).toMatch(/^https:\/\/dearpapa.kr\/letter\/received#letter=/);
    fireEvent.click(screen.getByRole('button', { name: '웹에서 카카오톡으로 보내기' }));
    expect(sendLetterToKakao).toHaveBeenLastCalledWith(expect.objectContaining({ text: letter.text }), { web: true });
    expect(screen.getByText('카카오 공유 창을 여는 중이에요…')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByText(/카카오 공유 창이 열리지 않았다면 팝업 차단을 확인하거나/)).toBeTruthy();
    expect(screen.getByRole('button', { name: '카카오 공유 창 다시 열기' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '카카오톡 다시 열기' })).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});

it('keeps web recovery available after focus leaves because a permission prompt is not proof of app launch', async () => {
  const button = await readyComposer();
  fireEvent.click(button);
  blur();
  fireEvent.click(screen.getByRole('button', { name: '웹에서 카카오톡으로 보내기' }));
  expect(sendLetterToKakao).toHaveBeenLastCalledWith(expect.objectContaining({ text: letter.text }), { web: true });
});

it('does not hand off a letter while a starter line is still being inserted', async () => {
  render(<Composer />);
  fireEvent.focus(screen.getByLabelText('편지 내용'));
  const button = screen.getByRole('button', { name: /카카오톡으로 편지 보내기/ });
  await waitFor(() => expect(button.getAttribute('data-kakao')).toBe('ready'));
  fireEvent.click(screen.getByRole('button', { name: '아빠, 말은 잘 못 해도 늘 고마워요.' }));
  fireEvent.click(button);
  expect(sendLetterToKakao).not.toHaveBeenCalled();
  await screen.findByText('문장을 넣었어요.', {}, { timeout: 4000 });
  fireEvent.click(button);
  expect(sendLetterToKakao).toHaveBeenCalledWith(expect.objectContaining({ text: '아빠, 말은 잘 못 해도 늘 고마워요.' }), {});
});

it('returns focus to the send button when the guidance is dismissed', async () => {
  const button = await readyComposer();
  fireEvent.click(button);
  blur();
  const close = await screen.findByRole('button', { name: '안내 닫기' });
  close.focus();
  fireEvent.click(close);
  expect(document.activeElement).toBe(button);
  expect(screen.queryByRole('button', { name: '편지 링크 복사' })).toBeNull();
});

it('discards the previous handoff when the author edits and copies only the new letter after another send', async () => {
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: copy } });
  const button = await readyComposer();
  const input = screen.getByLabelText('편지 내용');
  fireEvent.click(button);
  blur();
  fireEvent.change(input, { target: { value: '새로 고친 편지예요.' } });
  expect(screen.queryByRole('button', { name: '편지 링크 복사' })).toBeNull();
  fireEvent.click(button);
  blur();
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

it('keeps an empty status region mounted while idle so the first message is announced', () => {
  const { container } = render(<KakaoHandoff sdk="ready" handoff="idle" shareUrl="" showUnavailable={false}
    onSendAgain={() => {}} onSendWeb={() => {}} onReconnect={() => {}} />);
  const regions = container.querySelectorAll('[role="status"]');
  expect(regions.length).toBeGreaterThan(0);
  regions.forEach(region => expect(region.textContent).toBe(''));
  expect(screen.queryByRole('button')).toBeNull();
});

it('opens every other way to send from the composer, with the KakaoTalk message preview and the privacy line under the button', async () => {
  render(<Composer />);
  fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: letter.text } });
  fireEvent.change(screen.getByPlaceholderText('이름이나 애칭'), { target: { value: letter.from } });
  const other = screen.getByRole('button', { name: /다른 방법으로 보내기/ });
  other.focus();
  fireEvent.click(other);
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByRole('tab').map(t => t.textContent)).toEqual(['카카오톡', 'Instagram']);
  const send = await within(dialog).findByRole('button', { name: '카카오톡으로 편지 보내기' });
  const privacy = within(dialog).getByText(/편지와 이름이 링크에 담겨요/);
  expect(send.compareDocumentPosition(privacy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const preview = within(dialog).getByText('카카오톡에는 이렇게 보여요').closest('figure')!;
  expect(privacy.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(preview.textContent).toContain('딸의 편지가 도착했어요');
  expect(preview.textContent).not.toContain(letter.text);
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

it('marks the site header and footer so the received page can hide them, and keeps the skip link', () => {
  const chrome = render(<><SiteHeader /><SiteFooter /></>);
  expect(chrome.container.querySelector('header[data-site-chrome]')).not.toBeNull();
  expect(chrome.container.querySelector('footer[data-site-chrome]')).not.toBeNull();
  chrome.unmount();
  const { container } = render(<ReceivedLetterPage />);
  const css = container.querySelector('style')?.textContent ?? '';
  expect(css).toContain('[data-site-chrome]');
  expect(css).not.toContain('.skip-link');
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
