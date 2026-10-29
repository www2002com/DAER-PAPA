'use client';

import { useState } from 'react';
import type { KakaoHandoff as Handoff, KakaoSdkState } from './useKakaoSend';
import { copyLetterLink } from './useKakaoSend';
import styles from './KakaoHandoff.module.css';

/**
 * What to do after asking KakaoTalk to open. It never says the letter was sent: KakaoTalk
 * gives the page no completion signal, so every line is phrased as guidance.
 */
export function KakaoHandoff({ sdk, handoff, shareUrl, onSendAgain, onSendWeb, onReconnect, onDismiss }: {
  sdk: KakaoSdkState;
  handoff: Handoff;
  shareUrl: string;
  onSendAgain: () => void;
  /** Kakao's web share page, for phones where the KakaoTalk app does not open. */
  onSendWeb: () => void;
  onReconnect: () => void;
  onDismiss?: () => void;
}) {
  const [copy, setCopy] = useState<'idle' | 'copied' | 'manual'>('idle');
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const unavailable = sdk === 'unavailable';
  if (handoff === 'idle' && !unavailable) return null;

  const message = unavailable
    ? '카카오톡 연결을 불러오지 못했어요. 다시 연결하거나 아래 방법으로 보내 주세요.'
    : handoff === 'opening'
      ? '카카오톡을 여는 중이에요…'
      : handoff === 'opened'
        ? '카카오톡에서 받을 분을 고른 뒤 보내기를 눌러 주세요. 보낸 다음 이 화면으로 돌아오면 돼요.'
        : '카카오톡이 열리지 않았다면 웹에서 카카오 계정으로 보내거나, 편지 링크를 복사해 카카오톡 대화방에 붙여 넣어 주세요.';

  async function copyLink() {
    setCopy((await copyLetterLink(shareUrl)) ? 'copied' : 'manual');
  }
  async function shareSheet() {
    try { await navigator.share({ title: '편지가 도착했어요', url: shareUrl }); }
    catch { /* The visitor closed the sheet or the browser refused; the other options stay. */ }
  }

  return (
    <div className={styles.notice} data-handoff={unavailable ? 'unavailable' : handoff}>
      <p role="status" aria-live="polite">{message}</p>
      {handoff !== 'opening' && <div className={styles.actions}>
        {unavailable
          ? <button type="button" onClick={onReconnect}>카카오톡 다시 연결</button>
          : <>
            {handoff === 'notOpened' && <button type="button" onClick={onSendWeb}>웹에서 카카오톡으로 보내기</button>}
            <button type="button" onClick={onSendAgain}>카카오톡 다시 열기</button>
          </>}
        <button type="button" onClick={copyLink}>{copy === 'copied' ? '링크를 복사했어요' : '편지 링크 복사'}</button>
        {canShare && <button type="button" onClick={shareSheet}>공유창으로 보내기</button>}
        {onDismiss && <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="안내 닫기">닫기</button>}
      </div>}
      {copy === 'copied' && <p className={styles.hint}>카카오톡 대화방에 붙여 넣으면 받는 분이 편지를 열 수 있어요.</p>}
      {copy === 'manual' && <input className={styles.copyInput} aria-label="복사할 편지 링크" readOnly value={shareUrl}
        onFocus={(event) => event.currentTarget.select()} />}
    </div>
  );
}
