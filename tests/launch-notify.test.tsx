import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { normalizeEmail, LAUNCH_NOTIFY_COPY } from '@/lib/launch-notify';
import { handleLaunchNotify, resetRateLimit, storeFromEnv, type SignupRecord } from '@/lib/launch-notify-server';
import { businessLines, BUSINESS } from '@/lib/business';
import { LaunchNotify } from '@/components/LaunchNotify';

const post = (body: unknown, ip = '203.0.113.1') =>
  new Request('https://preview.example/api/launch-notify', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

beforeEach(() => resetRateLimit());

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

  it('rejects non-POST methods', async () => {
    const res = await handleLaunchNotify(new Request('https://x/api/launch-notify'), null);
    expect(res.status).toBe(405);
  });

  it('selects no store unless the env var and credentials are set', () => {
    expect(storeFromEnv({})).toBeNull();
    expect(storeFromEnv({ LAUNCH_NOTIFY_STORE: 'upstash' })).toBeNull();
    expect(storeFromEnv({ LAUNCH_NOTIFY_STORE: 'upstash', KV_REST_API_URL: 'https://u', KV_REST_API_TOKEN: 't' })?.name).toBe('upstash');
    expect(storeFromEnv({ LAUNCH_NOTIFY_STORE: 'webhook', LAUNCH_NOTIFY_WEBHOOK_URL: 'https://w' })?.name).toBe('webhook');
    expect(storeFromEnv({ LAUNCH_NOTIFY_STORE: 'resend', RESEND_API_KEY: 'k' })).toBeNull();
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
