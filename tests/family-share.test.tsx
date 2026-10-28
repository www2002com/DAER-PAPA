import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { LaunchNotifySection } from '@/components/LaunchNotifySection';
import { FAMILY_SHARE_COPY, FAMILY_SHARE_URL } from '@/components/FamilyShareButton';
import { Composer, LETTER_REASSURE } from '@/components/letter/Composer';

const BUTTON = '형제·가족에게 링크 보내기';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Local-only success: fetch is mocked, nothing leaves the test process. */
async function submitLocally(container: HTMLElement) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
  vi.stubGlobal('fetch', fetchMock);
  fireEvent.change(container.querySelector('input[type=email]')!, { target: { value: 'local-test@example.com' } });
  fireEvent.click(container.querySelector('input[type=checkbox]')!);
  await act(async () => { fireEvent.submit(container.querySelector('form')!); });
  return fetchMock;
}

describe('family share link (launch-notify success state)', () => {
  it('is absent everywhere while launch-notify is disabled (production default)', () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', '');
    vi.stubEnv('RESEND_API_KEY', '');
    const { container } = render(<Home />);
    expect(screen.queryByText(BUTTON)).toBeNull();
    expect(container.querySelector('[data-track-action="family_link_shared"]')).toBeNull();
  });

  it('is absent when only the key is set but the flag is off', () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', '');
    vi.stubEnv('RESEND_API_KEY', 'private-test-key');
    render(<LaunchNotifySection placement="home" />);
    expect(screen.queryByText(BUTTON)).toBeNull();
  });

  it('appears only after a successful submit when the gate is on', async () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', 'true');
    vi.stubEnv('RESEND_API_KEY', 'private-test-key');
    const { container } = render(<LaunchNotifySection placement="home" />);
    expect(screen.queryByText(BUTTON)).toBeNull();
    const fetchMock = await submitLocally(container);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const button = await screen.findByText(BUTTON);
    expect(button.getAttribute('data-track-action')).toBe('family_link_shared');
    expect(container.innerHTML).not.toContain('private-test-key');
  });

  it('uses the native share sheet when available', async () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', 'true');
    vi.stubEnv('RESEND_API_KEY', 'private-test-key');
    const share = vi.fn(async () => {});
    vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { share }));
    const { container } = render(<LaunchNotifySection placement="home" />);
    await submitLocally(container);
    await act(async () => { fireEvent.click(await screen.findByText(BUTTON)); });
    expect(share).toHaveBeenCalledWith({ title: FAMILY_SHARE_COPY.shareTitle, url: 'https://dearpapa.kr/' });
  });

  it('falls back to copying the link and confirms it', async () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', 'true');
    vi.stubEnv('RESEND_API_KEY', 'private-test-key');
    const writeText = vi.fn(async () => {});
    vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { share: undefined, clipboard: { writeText } }));
    const { container } = render(<LaunchNotifySection placement="home" />);
    await submitLocally(container);
    await act(async () => { fireEvent.click(await screen.findByText(BUTTON)); });
    expect(writeText).toHaveBeenCalledWith(FAMILY_SHARE_URL);
    await waitFor(() => expect(screen.getByText('링크를 복사했어요')).toBeTruthy());
  });
});

describe('letter reassurance line', () => {
  it('shows the helper line next to the letter field regardless of the gate', () => {
    vi.stubEnv('LAUNCH_NOTIFY_ENABLED', '');
    vi.stubEnv('RESEND_API_KEY', '');
    render(<Composer />);
    const line = screen.getByText('잘 쓰지 않아도 괜찮아요. 아빠는 문장보다 마음을 먼저 읽어요.');
    expect(line.textContent).toBe(LETTER_REASSURE);
    const field = screen.getByLabelText('편지 내용');
    expect(field.getAttribute('aria-describedby')).toContain(line.id);
  });

  it('is part of the home page', async () => {
    render(<Home />);
    await waitFor(() => expect(screen.getByText(LETTER_REASSURE)).toBeTruthy());
  });
});
