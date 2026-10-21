'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CONTACT_EMAIL } from '@/lib/facts';
import type { MenuLanguage } from '@/lib/menu';
import { trackAction } from '@/lib/analytics';
import styles from './SiteFooter.module.css';

const COPY = {
  ko: { compose: '메일 앱으로 작성', copy: '주소 복사', copying: '복사 중…', copied: '주소 복사 완료', success: '주소를 복사했습니다. 이용하시는 메일의 받는 사람에 붙여 넣어 주세요.', manual: '자동 복사가 지원되지 않습니다. 아래 주소를 선택해 복사한 뒤 메일을 보내 주세요.', hint: '메일 앱이 열리지 않으면 주소를 복사해 이용하시는 메일에서 보내 주세요.', field: '복사할 문의 이메일 주소' },
  en: { compose: 'Write in email app', copy: 'Copy address', copying: 'Copying…', copied: 'Address copied', success: 'Address copied. Paste it into the recipient field in your email service.', manual: 'Automatic copying is unavailable. Select and copy the address below.', hint: 'If your email app does not open, copy this address and use your preferred email service.', field: 'Contact email address to copy' },
  zh: { compose: '在邮件应用中撰写', copy: '复制邮箱地址', copying: '正在复制…', copied: '已复制邮箱地址', success: '邮箱地址已复制。请粘贴到您邮箱的收件人栏。', manual: '无法自动复制。请选择并复制下方的邮箱地址。', hint: '如果邮件应用未打开，请复制此地址，通过您常用的邮箱发送邮件。', field: '可复制的联系邮箱地址' },
  ja: { compose: 'メールアプリで作成', copy: 'アドレスをコピー', copying: 'コピー中…', copied: 'コピーしました', success: 'コピーしました。ご利用のメールの宛先欄に貼り付けてください。', manual: '自動コピーを利用できません。下のアドレスを選択してコピーしてください。', hint: 'メールアプリが開かない場合は、アドレスをコピーしてご利用のメールから送信してください。', field: 'コピーするお問い合わせメールアドレス' },
} as const;

export function ContactEmail({ language = 'ko' }: { language?: MenuLanguage }) {
  const copy = COPY[language];
  const hintId = useId();
  const manualAddress = useRef<HTMLInputElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyAddress() {
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    resetTimer.current = null;
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      if (!mounted.current) return;
      setStatus('copied');
      trackAction('contact_email_copied');
      resetTimer.current = setTimeout(() => {
        setStatus('idle');
        resetTimer.current = null;
      }, 3000);
    } catch {
      if (mounted.current) setStatus('manual');
    }
  }

  return (
    <div className={styles.contact}>
      <p className={styles.mail}>{CONTACT_EMAIL}</p>
      <div className={styles.contactActions}>
        <a
          className={styles.contactAction}
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label={`${copy.compose}: ${CONTACT_EMAIL}`}
          aria-describedby={hintId}
        >
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="m3 5 7 6 7-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copy.compose}
        </a>
        <button
          type="button"
          className={`${styles.contactAction} ${styles.copyEmail}`}
          onClick={copyAddress}
          disabled={status === 'copying'}
          aria-describedby={hintId}
        >
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M12 4V3H3v9h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {status === 'copied' ? copy.copied : status === 'copying' ? copy.copying : copy.copy}
        </button>
      </div>
      <p id={hintId} className={styles.contactHint} role="status" aria-live="polite">
        {status === 'copied'
          ? copy.success
          : status === 'manual'
            ? copy.manual
            : copy.hint}
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
          aria-label={copy.field}
          onFocus={() => manualAddress.current?.select()}
        />
      )}
    </div>
  );
}
