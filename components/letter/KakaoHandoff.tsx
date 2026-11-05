'use client';

import { useRef, useState } from 'react';
import type { KakaoHandoff as Handoff, KakaoRoute, KakaoSdkState } from './useKakaoSend';
import { copyLetterLink } from './useKakaoSend';
import styles from './KakaoHandoff.module.css';

/**
 * What to do after asking KakaoTalk to open. It never says the letter was sent: KakaoTalk
 * gives the page no completion signal, so every line is phrased as guidance. The status line
 * is always mounted (visually empty when idle) so screen readers announce the first message.
 */
export function KakaoHandoff({ sdk, handoff, route = 'app', shareUrl, showUnavailable = true, onSendAgain, onSendWeb, onReconnect, onDismiss }: {
  sdk: KakaoSdkState;
  handoff: Handoff;
  route?: KakaoRoute;
  shareUrl: string;
  /** Show the "could not load Kakao" notice even before the visitor tried to send. */
  showUnavailable?: boolean;
  onSendAgain: () => void;
  /** Kakao's web share page, for phones where the KakaoTalk app does not open. */
  onSendWeb: () => void;
  onReconnect: () => void;
  onDismiss?: () => void;
}) {
  const [copy, setCopy] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [shareError, setShareError] = useState('');
  const [sharing, setSharing] = useState(false);
  const shareBusy = useRef(false);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const unavailable = sdk === 'unavailable';
  const active = handoff !== 'idle' || (unavailable && showUnavailable);
  const web = route === 'web';

  const message = !active ? ''
    : unavailable
      ? '카카오톡 연결을 불러오지 못했어요. 다시 연결하거나 아래 방법으로 보내 주세요.'
      : handoff === 'opening'
        ? (web ? '카카오 공유 창을 여는 중이에요…' : '카카오톡을 여는 중이에요…')
        : handoff === 'opened'
          ? (web
            ? '카카오 공유 창이 열렸다면 카카오 계정으로 로그인한 뒤 받을 분을 고르고 보내기를 눌러 주세요. 열리지 않았다면 아래에서 다른 방법을 선택해 주세요.'
            : '카카오톡이 열렸다면 받을 분을 고른 뒤 보내기를 눌러 주세요. 열리지 않았다면 아래에서 다른 방법을 선택해 주세요.')
          : (web
            ? '카카오 공유 창이 열리지 않았다면 팝업 차단을 확인하거나, 편지 링크를 복사해 카카오톡 대화방에 붙여 넣어 주세요.'
            : '카카오톡이 열리지 않았다면 웹에서 카카오 계정으로 보내거나, 편지 링크를 복사해 카카오톡 대화방에 붙여 넣어 주세요.');

  async function copyLink() {
    setCopy((await copyLetterLink(shareUrl)) ? 'copied' : 'manual');
  }
  async function shareSheet() {
    if (shareBusy.current) return;
    shareBusy.current = true;
    setSharing(true);
    setShareError('');
    try { await navigator.share({ title: '편지가 도착했어요', url: shareUrl }); }
    catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') setShareError('기기 공유창을 열 수 없었어요. 웹에서 보내거나 편지 링크를 복사해 주세요.');
    } finally { shareBusy.current = false; setSharing(false); }
  }

  // The web route is the recommended next step only when the app showed no sign of opening.
  const recommendWeb = web || handoff === 'notOpened';
  // In-app browsers (Instagram, Facebook) often cannot launch KakaoTalk, so the link copy shows
  // from the first moment instead of after 3 s of waiting. It stays alone: another hand-off would
  // collide with the one in flight, and the device share sheet would blur the page and read as opened.
  const opening = handoff === 'opening';
  const hint = copy === 'copied' ? '링크를 복사했어요. 카카오톡 대화방에 붙여 넣으면 받는 분이 편지를 열 수 있어요.'
    : copy === 'manual' ? '아래 링크를 길게 누르거나 선택해서 복사해 주세요.'
      : shareError;

  return (
    <div className={active ? styles.notice : styles.idle} data-handoff={!active ? 'idle' : unavailable ? 'unavailable' : handoff}>
      <p role="status" aria-live="polite">{message}</p>
      {active && <div className={styles.actions}>
        {opening ? null : unavailable
          ? <button type="button" data-primary="" onClick={onReconnect}>카카오톡 다시 연결</button>
          : <>
            <button type="button" data-primary={recommendWeb ? '' : undefined} onClick={onSendWeb}>{web ? '카카오 공유 창 다시 열기' : '웹에서 카카오톡으로 보내기'}</button>
            {!web && <button type="button" onClick={onSendAgain}>카카오톡 다시 열기</button>}
          </>}
        <button type="button" onClick={copyLink}>{copy === 'copied' ? '링크를 복사했어요' : '편지 링크 복사'}</button>
        {!opening && canShare && <button type="button" onClick={shareSheet} disabled={sharing}>공유창으로 보내기</button>}
        {!opening && onDismiss && <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="안내 닫기">닫기</button>}
      </div>}
      <p className={styles.hint} role="status" aria-live="polite">{hint}</p>
      {copy === 'manual' && <input className={styles.copyInput} aria-label="복사할 편지 링크" readOnly value={shareUrl}
        onFocus={(event) => event.currentTarget.select()} />}
    </div>
  );
}
