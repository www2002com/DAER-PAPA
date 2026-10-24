// 출시 알림 신청: server-side handler for the Vercel Function in /api.
// Relative imports only (no "@/" alias) so the Vercel Function bundler can resolve them.
//
// Delivery: each consented signup is forwarded as one plain-text email to hello@dearpapa.kr through the
// Resend REST API (no SDK dependency). Nothing is sent to the subscriber.
//   RESEND_API_KEY      required. Read from env only; never hardcoded, logged or returned.
//   LAUNCH_NOTIFY_FROM  optional, default "DEAR PAPA <notify@dearpapa.kr>" (dearpapa.kr must be verified in Resend)
//   LAUNCH_NOTIFY_TO    optional, default "hello@dearpapa.kr"
// With no RESEND_API_KEY the API answers 503 { ok: false, error: 'not_configured' } and the form shows a
// graceful message. Emails are never logged.

import { CONSENT_VERSION, isPlacement, normalizeEmail, type LaunchNotifyErrorCode, type LaunchNotifyPlacement } from './launch-notify.js';
import { launchNotifyReady } from './launch-notify-config.js';

export type SignupRecord = {
  email: string;
  consent: true;
  consentVersion: string;
  consentedAt: string;
  placement: LaunchNotifyPlacement | 'unknown';
};

export type Store = { name: string; save(record: SignupRecord): Promise<void> };
type Env = Record<string, string | undefined>;

export const RESEND_ENDPOINT = 'https://api.resend.com/emails';
export const DEFAULT_FROM = 'DEAR PAPA <notify@dearpapa.kr>';
export const DEFAULT_TO = 'hello@dearpapa.kr';

const PAGE_LABEL: Record<SignupRecord['placement'], string> = {
  home: '홈 (https://dearpapa.kr/)',
  product: 'letter-all-in-one (https://dearpapa.kr/letter-all-in-one)',
  unknown: '알 수 없음',
};

function kst(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  return d.toISOString().replace('T', ' ').slice(0, 19) + ' KST';
}

/** Plain-text notification body: subscriber email, consent + timestamp, page source. Nothing else personal. */
export function notificationText(record: SignupRecord): string {
  return [
    '디어파파 출시 소식 신청이 1건 들어왔습니다.',
    '',
    `신청 이메일: ${record.email}`,
    `개인정보 수집·이용 동의: 예 (동의 문구 버전 ${record.consentVersion})`,
    `동의 시각: ${kst(record.consentedAt)} (${record.consentedAt})`,
    `신청 페이지: ${PAGE_LABEL[record.placement]}`,
    '',
    '이용 목적은 출시 소식 안내뿐입니다. 출시 안내를 보낸 뒤 또는 동의 철회 요청 시 이 메일을 지체 없이 삭제해 주세요.',
  ].join('\n');
}

export function storeFromEnv(env: Env = process.env, fetchImpl: typeof fetch = fetch): Store | null {
  if (!launchNotifyReady(env)) return null;
  const key = env.RESEND_API_KEY?.trim();
  if (!key) return null;
  const from = env.LAUNCH_NOTIFY_FROM?.trim() || DEFAULT_FROM;
  const to = env.LAUNCH_NOTIFY_TO?.trim() || DEFAULT_TO;
  return {
    name: 'resend',
    async save(record) {
      const res = await fetchImpl(RESEND_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [to],
          subject: '[디어파파] 출시 소식 신청 1건',
          text: notificationText(record),
        }),
      });
      // Status only: Resend error bodies are not logged (they could echo request data).
      if (!res.ok) throw new Error(`resend ${res.status}`);
    },
  };
}

// Basic per-instance rate limit. IPs live only in memory for the window and are never stored or logged.
// Expired entries are pruned on the next request. Only the last 10 minutes affect rate limiting;
// idle serverless instances may retain expired memory until another request or termination.
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();
export function rateLimited(key: string, now = Date.now()): boolean {
  for (const [k, stamps] of hits) {
    const live = stamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (live.length) hits.set(k, live);
    else hits.delete(k);
  }
  const recent = hits.get(key) ?? [];
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}
export function resetRateLimit() { hits.clear(); }
/** Number of addresses currently held in memory (tests only). */
export function rateLimitSize() { return hits.size; }

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
const fail = (status: number, error: LaunchNotifyErrorCode) => json(status, { ok: false, error });

// Browsers send Origin on cross-site POSTs. Only the official site and this project's Vercel previews may
// submit; a missing header is tolerated so privacy tools that strip it do not lock real visitors out.
const ALLOWED_ORIGIN_RE = /^https:\/\/(www\.)?dearpapa\.kr$|^https:\/\/dearpapa(-[a-z0-9-]+)?-www2002coms-projects\.vercel\.app$/;
export function originAllowed(origin: string | null, env: Env = process.env): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGIN_RE.test(origin)) return true;
  const extra = (env.LAUNCH_NOTIFY_ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

export async function handleLaunchNotify(request: Request, store: Store | null = storeFromEnv()): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  if (!originAllowed(request.headers.get('origin'))) return fail(403, 'server_error');
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
