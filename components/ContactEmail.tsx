'use client';

import { useId, useRef, useState } from 'react';
import { CONTACT_EMAIL } from '@/lib/facts';
import styles from './SiteFooter.module.css';

export function ContactEmail() {
  const hintId = useId();
  const manualAddress = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');

  async function copyAddress() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setStatus('copied');
    } catch {
      setStatus('manual');
    }
  }

  return (
    <div className={styles.contact}>
      <a className={styles.mail} href={`mailto:${CONTACT_EMAIL}`} aria-describedby={hintId}>
        {CONTACT_EMAIL}
      </a>
      <button
        type="button"
        className={styles.copyEmail}
        onClick={copyAddress}
        disabled={status === 'copying'}
        aria-describedby={hintId}
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M12 4V3H3v9h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {status === 'copied' ? '주소 복사 완료' : '이메일 주소 복사'}
      </button>
      <p id={hintId} className={styles.contactHint} role="status" aria-live="polite">
        {status === 'copied'
          ? '주소를 복사했습니다. 이용하시는 메일의 받는 사람에 붙여 넣어 주세요.'
          : status === 'manual'
            ? '자동 복사가 지원되지 않습니다. 아래 주소를 선택해 복사한 뒤 메일을 보내 주세요.'
            : '메일 앱이 열리지 않으면 주소를 복사해 이용하시는 메일에서 보내 주세요.'}
      </p>
      {status === 'manual' && (
        <input
          ref={(element) => {
            manualAddress.current = element;
            element?.focus();
            element?.select();
          }}
          className={styles.manualEmail}
          type="text"
          value={CONTACT_EMAIL}
          readOnly
          aria-label="복사할 문의 이메일 주소"
          onFocus={() => manualAddress.current?.select()}
        />
      )}
    </div>
  );
}
