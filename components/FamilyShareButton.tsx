'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LaunchNotify.module.css';

export const FAMILY_SHARE_URL = 'https://dearpapa.kr/';
export const FAMILY_SHARE_COPY = {
  button: '형제·가족에게 링크 보내기',
  copied: '링크를 복사했어요',
  manual: '이 주소를 복사해 보내 주세요: https://dearpapa.kr/',
  shareTitle: '디어파파(DEAR PAPA)',
} as const;

type State = 'idle' | 'copied' | 'manual';

async function copyLink(): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(FAMILY_SHARE_URL);
    return true;
  } catch {
    return false;
  }
}

/** Shown only inside the launch-notify success state, so it inherits the same server gate. */
export function FamilyShareButton() {
  const [state, setState] = useState<State>('idle');
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  async function onClick() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: FAMILY_SHARE_COPY.shareTitle, url: FAMILY_SHARE_URL });
        return;
      } catch (error) {
        // The person closed the share sheet: nothing else to do.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    const ok = await copyLink();
    setState(ok ? 'copied' : 'manual');
    if (timer.current) window.clearTimeout(timer.current);
    if (ok) timer.current = window.setTimeout(() => setState('idle'), 4000);
  }

  return (
    <div className={styles.share}>
      <button type="button" className={`btn ${styles.shareButton}`} onClick={onClick} data-track-action="family_link_shared">
        {FAMILY_SHARE_COPY.button}
      </button>
      <p className={styles.shareMsg} role="status" aria-live="polite">
        {state === 'copied' ? FAMILY_SHARE_COPY.copied : state === 'manual' ? FAMILY_SHARE_COPY.manual : ''}
      </p>
    </div>
  );
}
