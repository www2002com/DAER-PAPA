'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { trackAction } from '@/lib/analytics';
import {
  LAUNCH_NOTIFY_COPY as COPY, LAUNCH_NOTIFY_ENDPOINT, normalizeEmail,
  type LaunchNotifyErrorCode, type LaunchNotifyPlacement,
} from '@/lib/launch-notify';
import styles from './LaunchNotify.module.css';

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'error'; code: LaunchNotifyErrorCode };

export function LaunchNotify({ placement, headingLevel = 'h2' }: { placement: LaunchNotifyPlacement; headingLevel?: 'h2' | 'h3' }) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  // Conversion measurement: one "viewed" event per page load when the form is at least half visible.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    let viewed = false;
    const observer = new IntersectionObserver((entries) => {
      if (!viewed && entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.5)) {
        viewed = true;
        trackAction('launch_notify_viewed', { placement });
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [placement]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === 'submitting') return;
    if (!normalizeEmail(email)) return setStatus({ kind: 'error', code: 'invalid_email' });
    if (!consent) return setStatus({ kind: 'error', code: 'consent_required' });
    // The API deliberately returns success for the bot trap without saving a signup.
    const measureSubmission = website.trim() === '';
    setStatus({ kind: 'submitting' });
    if (measureSubmission) trackAction('launch_notify_attempted', { placement });
    try {
      const res = await fetch(LAUNCH_NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, placement, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: 'success' });
        setEmail('');
        setConsent(false);
        if (measureSubmission) trackAction('launch_notify_submitted', { placement });
        return;
      }
      const code = (typeof data?.error === 'string' && Object.hasOwn(COPY.errors, data.error) ? data.error : 'server_error') as LaunchNotifyErrorCode;
      if (measureSubmission) trackAction('launch_notify_failed', { placement, reason: code });
      setStatus({ kind: 'error', code });
    } catch {
      if (measureSubmission) trackAction('launch_notify_failed', { placement, reason: 'server_error' });
      setStatus({ kind: 'error', code: 'server_error' });
    }
  }

  const Heading = headingLevel;
  const message = status.kind === 'success' ? COPY.success : status.kind === 'error' ? COPY.errors[status.code] : '';

  return (
    <section ref={root} id={placement === 'home' ? 'launch-notify' : 'launch-notify-product'} className={styles.box} aria-labelledby={`${id}-title`} data-nosnippet>
      <Heading id={`${id}-title`} className={styles.title}>{COPY.title}</Heading>
      <p className={styles.body}>{COPY.body}</p>
      {status.kind === 'success' ? (
        <p className={styles.success} role="status">{message}</p>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.row}>
            <label className="sr-only" htmlFor={`${id}-email`}>{COPY.emailLabel}</label>
            <input
              id={`${id}-email`}
              className={styles.input}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder={COPY.emailPlaceholder}
              maxLength={254}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={status.kind === 'error' && status.code === 'invalid_email' ? true : undefined}
              aria-describedby={`${id}-msg`}
            />
            <button className={`btn ${styles.submit}`} type="submit" disabled={status.kind === 'submitting'}>
              {status.kind === 'submitting' ? COPY.submitting : COPY.submit}
            </button>
          </div>
          {/* Honeypot for bots; hidden from people and assistive technology. */}
          <div className={styles.hp} aria-hidden="true">
            <label htmlFor={`${id}-website`}>Website</label>
            <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div className={styles.consent}>
            <input
              id={`${id}-consent`}
              type="checkbox"
              name="consent"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={status.kind === 'error' && status.code === 'consent_required' ? true : undefined}
              aria-describedby={`${id}-consent-detail`}
            />
            <label htmlFor={`${id}-consent`}>{COPY.consent}</label>
          </div>
          <p id={`${id}-consent-detail`} className={styles.detail}>
            {COPY.consentDetail} 자세한 내용은 <Link href="/privacy">{COPY.privacyLink}</Link>에서 확인하실 수 있습니다.
          </p>
          <p id={`${id}-msg`} className={status.kind === 'error' ? styles.error : styles.msg} role={status.kind === 'error' ? 'alert' : 'status'} aria-live="polite">
            {message}
          </p>
        </form>
      )}
    </section>
  );
}
