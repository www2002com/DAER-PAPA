'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LetterInput } from './card';
import { isKakaoReady, prepareKakaoShare, sendLetterToKakao } from './kakao-share';

export type KakaoSdkState = 'loading' | 'ready' | 'unavailable';
/**
 * What the page can honestly know after asking KakaoTalk to open. KakaoTalk sends no
 * completion signal, so there is no "sent" state: only whether it appears to have opened.
 */
export type KakaoHandoff = 'idle' | 'opening' | 'opened' | 'notOpened';

const OPEN_WAIT_MS = 3000;
const LISTEN_MS = 15000;

/** Loads the Kakao SDK once `active` turns true and hands a letter to KakaoTalk. */
export function useKakaoSend(active = true) {
  const [sdk, setSdk] = useState<KakaoSdkState>('loading');
  const [handoff, setHandoff] = useState<KakaoHandoff>('idle');
  const [attempt, setAttempt] = useState(0);
  const stopWatching = useRef<() => void>(() => {});

  useEffect(() => {
    if (!active) return;
    if (isKakaoReady()) { setSdk('ready'); return; }
    let live = true;
    setSdk('loading');
    prepareKakaoShare()
      .then((ok) => { if (live) setSdk(ok ? 'ready' : 'unavailable'); })
      .catch(() => { if (live) setSdk('unavailable'); });
    return () => { live = false; };
  }, [active, attempt]);

  useEffect(() => () => stopWatching.current(), []);

  /** Call directly inside a click handler so the browser treats the hand-off as the visitor's own action. */
  const send = useCallback((letter: LetterInput, options: { web?: boolean } = {}): boolean => {
    stopWatching.current();
    if (!isKakaoReady()) { setSdk('unavailable'); setHandoff('notOpened'); return false; }

    // The app taking over hides this page; the PC share window takes focus. Listen before
    // calling the SDK, because the PC window can open synchronously inside the call.
    let opened = false;
    const markOpened = () => { opened = true; setHandoff('opened'); };
    const onVisibility = () => { if (document.hidden) markOpened(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', markOpened);
    const notYet = window.setTimeout(() => { if (!opened) setHandoff('notOpened'); }, OPEN_WAIT_MS);
    const done = window.setTimeout(() => stopWatching.current(), LISTEN_MS);
    stopWatching.current = () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', markOpened);
      window.clearTimeout(notYet);
      window.clearTimeout(done);
      stopWatching.current = () => {};
    };

    setHandoff('opening');
    try {
      sendLetterToKakao(letter, options);
      return true;
    } catch {
      stopWatching.current();
      setHandoff('notOpened');
      return false;
    }
  }, []);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const reset = useCallback(() => { stopWatching.current(); setHandoff('idle'); }, []);
  return { sdk, handoff, send, retry, reset };
}

/** Copies the recipient link; false when the browser refuses so the caller can show it for manual copy. */
export async function copyLetterLink(url: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
