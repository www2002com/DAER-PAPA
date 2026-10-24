// 출시 알림 신청: server-side handler and storage adapter for the Vercel Function in /api.
// Relative imports only (no "@/" alias) so the Vercel Function bundler can resolve them.
//
// Storage is chosen by env var LAUNCH_NOTIFY_STORE. With no store configured the API answers
// 503 { ok: false, error: 'not_configured' } and the form shows a graceful message.
//   upstash : LAUNCH_NOTIFY_UPSTASH_URL + LAUNCH_NOTIFY_UPSTASH_TOKEN (Upstash Redis REST; also accepts
//             KV_REST_API_URL / KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL / _TOKEN from the Vercel Marketplace)
//   webhook : LAUNCH_NOTIFY_WEBHOOK_URL (+ optional LAUNCH_NOTIFY_WEBHOOK_SECRET), e.g. Google Apps Script → Sheet
//   resend  : RESEND_API_KEY + LAUNCH_NOTIFY_EMAIL_FROM (+ LAUNCH_NOTIFY_EMAIL_TO, default hello@dearpapa.kr)
// Emails are never logged.

import { CONSENT_VERSION, isPlacement, normalizeEmail, type LaunchNotifyErrorCode, type LaunchNotifyPlacement } from './launch-notify';

export type SignupRecord = {
  email: string;
  consent: true;
  consentVersion: string;
  consentedAt: string;
  placement: LaunchNotifyPlacement | 'unknown';
};

export type Store = { name: string; save(record: SignupRecord): Promise<void> };
type Env = Record<string, string | undefined>;

const HASH_KEY = 'dearpapa:launch-notify';

export function storeFromEnv(env: Env = process.env, fetchImpl: typeof fetch = fetch): Store | null {
  const kind = (env.LAUNCH_NOTIFY_STORE ?? '').trim().toLowerCase();
  if (kind === 'upstash') {
    const url = env.LAUNCH_NOTIFY_UPSTASH_URL ?? env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
    const token = env.LAUNCH_NOTIFY_UPSTASH_TOKEN ?? env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return {
      name: 'upstash',
      async save(record) {
        const res = await fetchImpl(url.replace(/\/$/, ''), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(['HSET', HASH_KEY, record.email, JSON.stringify(record)]),
        });
        if (!res.ok) throw new Error(`upstash ${res.status}`);
      },
    };
  }
  if (kind === 'webhook') {
    const url = env.LAUNCH_NOTIFY_WEBHOOK_URL;
    if (!url) return null;
    return {
      name: 'webhook',
      async save(record) {
        const res = await fetchImpl(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...record, secret: env.LAUNCH_NOTIFY_WEBHOOK_SECRET ?? '' }),
          redirect: 'follow',
        });
        if (!res.ok) throw new Error(`webhook ${res.status}`);
      },
    };
  }
  if (kind === 'resend') {
    const key = env.RESEND_API_KEY;
    const from = env.LAUNCH_NOTIFY_EMAIL_FROM;
    const to = env.LAUNCH_NOTIFY_EMAIL_TO ?? 'hello@dearpapa.kr';
    if (!key || !from) return null;
    return {
      name: 'resend',
      async save(record) {
        const res = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: [to],
            subject: '[디어파파] 출시 소식 신청 1건',
            text: [
              '출시 소식 안내 신청이 접수됐습니다.',
              `이메일: ${record.email}`,
              `동의: 개인정보 수집·이용(출시 소식 안내) · 동의 문구 버전 ${record.consentVersion}`,
              `시각(UTC): ${record.consentedAt}`,
              `위치: ${record.placement}`,
              '보유 기간: 출시 안내 후 또는 동의 철회 시 지체 없이 파기',
            ].join('\n'),
          }),
        });
        if (!res.ok) throw new Error(`resend ${res.status}`);
      },
    };
  }
  return null;
}

// Basic per-instance rate limit. IPs live only in memory for the window and are never stored or logged.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
export function rateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}
export function resetRateLimit() { hits.clear(); }

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
const fail = (status: number, error: LaunchNotifyErrorCode) => json(status, { ok: false, error });

export async function handleLaunchNotify(request: Request, store: Store | null = storeFromEnv()): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return fail(415, 'server_error');

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return fail(413, 'server_error');
    body = JSON.parse(raw) as Record<string, unknown>;
    if (!body || typeof body !== 'object') throw new Error('bad body');
  } catch {
    return fail(400, 'server_error');
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') return json(200, { ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return fail(400, 'invalid_email');
  if (body.consent !== true) return fail(400, 'consent_required');

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return fail(429, 'rate_limited');

  if (!store) return fail(503, 'not_configured');
  try {
    await store.save({
      email,
      consent: true,
      consentVersion: CONSENT_VERSION,
      consentedAt: new Date().toISOString(),
      placement: isPlacement(body.placement) ? body.placement : 'unknown',
    });
  } catch (error) {
    // Log the store failure without the email address.
    console.error('launch-notify store failed:', error instanceof Error ? error.message : 'unknown');
    return fail(502, 'server_error');
  }
  return json(200, { ok: true });
}
