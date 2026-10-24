import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { normalizeEmail, LAUNCH_NOTIFY_COPY } from '@/lib/launch-notify';
import {
  DEFAULT_FROM, RATE_LIMIT_WINDOW_MS, RESEND_ENDPOINT, handleLaunchNotify, notificationText, originAllowed, rateLimitSize, rateLimited, resetRateLimit, storeFromEnv,
  type SignupRecord,
} from '@/lib/launch-notify-server';
import { businessLines, BUSINESS } from '@/lib/business';
import { LaunchNotify } from '@/components/LaunchNotify';

const post = (body: unknown, ip = '203.0.113.1') =>
  new Request('https://preview.example/api/launch-notify', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  resetRateLimit();
  vi.restoreAllMocks();
});

describe('launch notify validation', () => {
  it('accepts plausible emails and rejects others', () => {
    expect(normalizeEmail(' Test+Honey@DearPapa.KR ')).toBe('Test+Honey@dearpapa.kr');
    for (const bad of ['', 'a@b', 'no-at.example.com', 'a b@example.com', 'x@-bad.com', 42, null]) {
      expect(normalizeEmail(bad)).toBeNull();
    }
  });
});

describe('launch notify API handler', () => {
  it('fails gracefully with 503 when no store is configured', async () => {
    const res = await handleLaunchNotify(post({ email: 'test@example.com', consent: true }), null);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: 'not_configured' });
  });

  it('validates email and consent on the server', async () => {
    const save = vi.fn();
    expect((await handleLaunchNotify(post({ email: 'nope', consent: true }), { name: 't', save })).status).toBe(400);
    const res = await handleLaunchNotify(post({ email: 'a@example.com', consent: false }), { name: 't', save });
    expect(await res.json()).toEqual({ ok: false, error: 'consent_required' });
    expect(save).not.toHaveBeenCalled();
  });

  it('stores a consented signup and ignores honeypot submissions', async () => {
    const saved: SignupRecord[] = [];
    const store = { name: 'mem', save: async (r: SignupRecord) => { saved.push(r); } };
    const ok = await handleLaunchNotify(post({ email: 'a@example.com', consent: true, placement: 'home' }), store);
    expect(ok.status).toBe(200);
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ email: 'a@example.com', consent: true, placement: 'home' });
    const bot = await handleLaunchNotify(post({ email: 'b@example.com', consent: true, website: 'http://spam' }), store);
    expect(bot.status).toBe(200);
    expect(saved).toHaveLength(1);
  });

  it('rate limits repeated submissions from one address', async () => {
    const store = { name: 'mem', save: async () => {} };
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await handleLaunchNotify(post({ email: `a${i}@example.com`, consent: true }), store)).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it('forgets an address once its window has passed, as the privacy notice promises', () => {
    const t0 = 1_700_000_000_000;
    expect(rateLimited('203.0.113.10', t0)).toBe(false);
    expect(rateLimitSize()).toBe(1);
    // A different address arrives after the window: the first one must be gone, not kept until a bulk clear.
    rateLimited('203.0.113.11', t0 + RATE_LIMIT_WINDOW_MS + 1);
    expect(rateLimitSize()).toBe(1);
  });

  it('keeps limiting an active address while pruning idle ones', () => {
    const t0 = 1_700_000_000_000;
    for (let i = 0; i < 5; i++) rateLimited('203.0.113.20', t0 + i);
    rateLimited('203.0.113.21', t0); // idle after this one request
    expect(rateLimitSize()).toBe(2);
    const later = t0 + RATE_LIMIT_WINDOW_MS - 1; // still inside the active address's window
    expect(rateLimited('203.0.113.20', later)).toBe(true);
    expect(rateLimited('203.0.113.21', later)).toBe(false);
    expect(rateLimitSize()).toBe(2);
    // Past the window, the active address is allowed again and the idle one has been dropped.
    resetRateLimit();
    for (let i = 0; i < 6; i++) rateLimited('203.0.113.22', t0 + i);
    expect(rateLimited('203.0.113.22', t0 + RATE_LIMIT_WINDOW_MS + 10)).toBe(false);
    expect(rateLimitSize()).toBe(1);
  });

  it('accepts the official site and this project\'s previews as Origin, rejects other sites', async () => {
    for (const ok of ['https://dearpapa.kr', 'https://www.dearpapa.kr', 'https://dearpapa-ra4igvfqm-www2002coms-projects.vercel.app', 'https://dearpapa-git-launch-notify-privacy-728b9d-www2002coms-projects.vercel.app', null]) {
      expect(originAllowed(ok, {})).toBe(true);
    }
    for (const bad of ['https://evil.example', 'http://dearpapa.kr', 'https://dearpapa.kr.evil.example', 'https://other-www2002coms-projects.vercel.app', 'https://someone-else.vercel.app']) {
      expect(originAllowed(bad, {})).toBe(false);
    }
    expect(originAllowed('https://staging.example', { LAUNCH_NOTIFY_ALLOWED_ORIGINS: 'https://staging.example, https://x.example' })).toBe(true);
    const save = vi.fn();
    const req = new Request('https://preview.example/api/launch-notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9', origin: 'https://evil.example' },
      body: JSON.stringify({ email: 'a@example.com', consent: true }),
    });
    const res = await handleLaunchNotify(req, { name: 't', save });
    expect(res.status).toBe(403);
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects non-POST methods', async () => {
    const res = await handleLaunchNotify(new Request('https://x/api/launch-notify'), null);
    expect(res.status).toBe(405);
  });

  it('is not configured without RESEND_API_KEY', async () => {
    expect(storeFromEnv({})).toBeNull();
    expect(storeFromEnv({ RESEND_API_KEY: '   ' })).toBeNull();
    const res = await handleLaunchNotify(post({ email: 'a@example.com', consent: true }), storeFromEnv({}));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: 'not_configured' });
  });
});

describe('Resend delivery', () => {
  const env = { RESEND_API_KEY: 're_test_dummy' };

  it('forwards one plain-text email to hello@ only, with email, consent time and page', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: 'x' }), { status: 200 }));
    const store = storeFromEnv(env, fetchMock as unknown as typeof fetch);
    const res = await handleLaunchNotify(post({ email: 'test+honey@dearpapa.kr', consent: true, placement: 'product' }), store);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_ENDPOINT);
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test_dummy');
    const payload = JSON.parse(String(init.body));
    expect(payload.from).toBe(DEFAULT_FROM);
    expect(payload.to).toEqual(['hello@dearpapa.kr']);
    expect(payload).not.toHaveProperty('reply_to');
    expect(payload).not.toHaveProperty('cc');
    expect(payload).not.toHaveProperty('bcc');
    expect(payload.text).toContain('신청 이메일: test+honey@dearpapa.kr');
    expect(payload.text).toContain('동의: 예');
    expect(payload.text).toMatch(/동의 시각: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} KST/);
    expect(payload.text).toContain('letter-all-in-one');
  });

  it('honours LAUNCH_NOTIFY_FROM / LAUNCH_NOTIFY_TO overrides', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }));
    const store = storeFromEnv({ ...env, LAUNCH_NOTIFY_FROM: 'X <x@dearpapa.kr>', LAUNCH_NOTIFY_TO: 'ops@dearpapa.kr' }, fetchMock as unknown as typeof fetch);
    await handleLaunchNotify(post({ email: 'a@example.com', consent: true, placement: 'home' }), store);
    const payload = JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body));
    expect(payload.from).toBe('X <x@dearpapa.kr>');
    expect(payload.to).toEqual(['ops@dearpapa.kr']);
    expect(payload.text).toContain('신청 페이지: 홈');
  });

  it('turns a Resend error into a graceful server_error without logging the email or key', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ name: 'validation_error', message: 'domain not verified' }), { status: 403 }));
    const store = storeFromEnv(env, fetchMock as unknown as typeof fetch);
    const res = await handleLaunchNotify(post({ email: 'secret-person@example.com', consent: true }), store);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'server_error' });
    const logged = JSON.stringify(errSpy.mock.calls);
    expect(logged).not.toContain('secret-person');
    expect(logged).not.toContain('re_test_dummy');
    errSpy.mockRestore();
  });

  it('also fails gracefully when Resend is unreachable', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const store = storeFromEnv(env, (async () => { throw new TypeError('fetch failed'); }) as unknown as typeof fetch);
    const res = await handleLaunchNotify(post({ email: 'a@example.com', consent: true }), store);
    expect(res.status).toBe(502);
  });

  it('builds a notification with nothing beyond email, consent and page', () => {
    const text = notificationText({ email: 'a@example.com', consent: true, consentVersion: '2026-10-24', consentedAt: '2026-10-24T11:00:00.000Z', placement: 'home' });
    expect(text).toContain('2026-10-24 20:00:00 KST');
    expect(text).not.toMatch(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
  });
});

describe('launch notify form', () => {
  it('requires consent before sending and shows success after an accepted submission', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    render(<LaunchNotify placement="product" />);
    expect(screen.getByText(LAUNCH_NOTIFY_COPY.title)).toBeTruthy();
    expect(screen.getByRole('link', { name: '개인정보처리방침' }).getAttribute('href')).toBe('/privacy');
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: LAUNCH_NOTIFY_COPY.submit }));
    expect(await screen.findByText(LAUNCH_NOTIFY_COPY.errors.consent_required)).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText(LAUNCH_NOTIFY_COPY.consent));
    fireEvent.click(screen.getByRole('button', { name: LAUNCH_NOTIFY_COPY.submit }));
    await waitFor(() => expect(screen.getByText(LAUNCH_NOTIFY_COPY.success)).toBeTruthy());
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({ email: 'test@example.com', consent: true, placement: 'product' });
  });

  it('shows the graceful message when storage is not configured', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: false, error: 'not_configured' }), { status: 503 }));
    render(<LaunchNotify placement="home" />);
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByLabelText(LAUNCH_NOTIFY_COPY.consent));
    fireEvent.click(screen.getByRole('button', { name: LAUNCH_NOTIFY_COPY.submit }));
    expect(await screen.findByText(LAUNCH_NOTIFY_COPY.errors.not_configured)).toBeTruthy();
  });
});

describe('footer business info', () => {
  it('renders only verified facts; TODO fields stay hidden', () => {
    const labels = businessLines().map((l) => l.label);
    expect(labels).toEqual(['브랜드', '이메일']);
    expect(BUSINESS.registrationNumber).toBeNull();
  });
});

describe('launch notify copy rules', () => {
  it('avoids banned or promise wording', () => {
    const all = JSON.stringify(LAUNCH_NOTIFY_COPY);
    for (const banned of ['사전 예약', '사전예약', '가장 먼저', '할인', '혜택', '진정', '붉은기', '저자극', '무자극', '끈적임 없는', '끝내는', '®', '™']) {
      expect(all).not.toContain(banned);
    }
  });
});
