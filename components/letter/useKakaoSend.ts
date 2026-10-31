'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LetterInput } from './card';
import { isKakaoReady, prepareKakaoShare, sendLetterToKakao } from './kakao-share';

export type KakaoSdkState = 'loading' | 'ready' | 'unavailable';
/**
 * What the page can honestly know after asking KakaoTalk to open. KakaoTalk sends no
 * completion signal, so there is no "sent" state: only whether something appears to have opened.
 */
export type KakaoHandoff = 'idle' | 'opening' | 'opened' | 'notOpened';
/** 'app' asks for the KakaoTalk app (on a PC the SDK opens its web picker instead); 'web' is the visitor-chosen web share page. */
export type KakaoRoute = 'app' | 'web';

const OPEN_WAIT_MS = 3000;

/** Loads the Kakao SDK once `active` turns true and hands a letter to KakaoTalk. */
export function useKakaoSend(active = true) {
  const [sdk, setSdk] = useState<KakaoSdkState>('loading');
  const [handoff, setHandoff] = useState<KakaoHandoff>('idle');
  const [route, setRoute] = useState<KakaoRoute>('app');
  const [attempt, setAttempt] = useState(0);
  const stopWatching = useRef<() => void>(() => {});
  const inFlight = useRef(false);

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
    // One hand-off at a time: a second tap while the first is still opening would launch the SDK twice.
    if (inFlight.current) return false;
    stopWatching.current();
    if (!isKakaoReady()) { setSdk('unavailable'); setHandoff('notOpened'); return false; }

    // Focus and visibility are only hints (a permission prompt or a tab switch produce them too),
    // so the UI keeps every recovery option in both outcomes. The verdict is final after 3 s: a
    // later blur from the share sheet, a tab switch or the screen lock must not rewrite it.
    let settled = false;
    let notYet = 0;
    const onBlur = () => settle('opened');
    const onVisibility = () => { if (document.hidden) settle('opened'); };
    const teardown = () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.clearTimeout(notYet);
      inFlight.current = false;
      stopWatching.current = () => {};
    };
    function settle(next: KakaoHandoff) {
      if (settled) return;
      settled = true;
      teardown();
      setHandoff(next);
    }
    stopWatching.current = () => { if (!settled) { settled = true; teardown(); } };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    notYet = window.setTimeout(() => settle('notOpened'), OPEN_WAIT_MS);

    inFlight.current = true;
    setRoute(options.web ? 'web' : 'app');
    setHandoff('opening');
    try {
      sendLetterToKakao(letter, options);
      return true;
    } catch {
      settle('notOpened');
      return false;
    }
  }, []);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const reset = useCallback(() => { stopWatching.current(); setHandoff('idle'); }, []);
  return { sdk, handoff, route, send, retry, reset };
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
