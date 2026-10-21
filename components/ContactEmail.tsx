'use client';

import { useId, useRef, useState } from 'react';
import { CONTACT_EMAIL } from '@/lib/facts';
import type { MenuLanguage } from '@/lib/menu';
import { trackAction } from '@/lib/analytics';
import styles from './SiteFooter.module.css';

const COPY = {
  ko: { copy: '이메일 주소 복사', copied: '주소 복사 완료', success: '주소를 복사했습니다. 이용하시는 메일의 받는 사람에 붙여 넣어 주세요.', manual: '자동 복사가 지원되지 않습니다. 아래 주소를 선택해 복사한 뒤 메일을 보내 주세요.', hint: '메일 앱이 열리지 않으면 주소를 복사해 이용하시는 메일에서 보내 주세요.', field: '복사할 문의 이메일 주소' },
  en: { copy: 'Copy email address', copied: 'Address copied', success: 'Address copied. Paste it into the recipient field in your email service.', manual: 'Automatic copying is unavailable. Select and copy the address below.', hint: 'If your email app does not open, copy this address and use your preferred email service.', field: 'Contact email address to copy' },
  zh: { copy: '复制邮箱地址', copied: '已复制邮箱地址', success: '邮箱地址已复制。请粘贴到您邮箱的收件人栏。', manual: '无法自动复制。请选择并复制下方的邮箱地址。', hint: '如果邮件应用未打开，请复制此地址，通过您常用的邮箱发送邮件。', field: '可复制的联系邮箱地址' },
  ja: { copy: 'メールアドレスをコピー', copied: 'コピーしました', success: 'コピーしました。ご利用のメールの宛先欄に貼り付けてください。', manual: '自動コピーを利用できません。下のアドレスを選択してコピーしてください。', hint: 'メールアプリが開かない場合は、アドレスをコピーしてご利用のメールから送信してください。', field: 'コピーするお問い合わせメールアドレス' },
} as const;

export function ContactEmail({ language = 'ko' }: { language?: MenuLanguage }) {
  const copy = COPY[language];
  const hintId = useId();
  const manualAddress = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle');

  async function copyAddress() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setStatus('copied');
      trackAction('contact_email_copied');
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
        {status === 'copied' ? copy.copied : copy.copy}
      </button>
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
