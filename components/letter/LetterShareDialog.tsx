'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { LetterInput } from './card';
import { createLetterShareUrl } from './share-link';
import { createLetterStory } from './share-story';
import { LETTER_SHARE_CARD } from './share-assets';
import { KakaoHandoff } from './KakaoHandoff';
import { useKakaoSend } from './useKakaoSend';
import styles from './LetterShareDialog.module.css';

export function LetterShareDialog({ letter, onClose }: { letter: LetterInput; onClose: () => void }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const alive = useRef(false);
  const busyRef = useRef(false);
  const [tab, setTab] = useState<'kakao' | 'instagram'>('kakao');
  const kakao = useKakaoSend(true);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const [story, setStory] = useState<{ file: File; url: string; canShare: boolean } | null>(null);
  const [storyError, setStoryError] = useState(false);
  const [storyAttempt, setStoryAttempt] = useState(0);
  const shareUrl = createLetterShareUrl(letter);
  const previewUrl = new URL(shareUrl).pathname + new URL(shareUrl).hash;

  useEffect(() => {
    alive.current = true;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const el = dialog.current!;
    el.showModal();
    return () => {
      alive.current = false;
      el.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (tab !== 'instagram') return;
    let active = true;
    let url: string | undefined;
    setStory(null);
    setStoryError(false);
    createLetterStory(letter).then(blob => {
      if (!active) return;
      const file = new File([blob], 'DEAR-PAPA-letter-story.png', { type: 'image/png' });
      url = URL.createObjectURL(blob);
      let canShare = false;
      try { canShare = !!navigator.share && !!navigator.canShare?.({ files: [file] }); } catch { /* download remains available */ }
      setStory({ file, url, canShare });
    }).catch(() => active && setStoryError(true));
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [tab, letter, storyAttempt]);

  function selectTab(next: 'kakao' | 'instagram') { setTab(next); setStatus(''); }
  function tabKey(e: KeyboardEvent<HTMLButtonElement>) {
    const next = e.key === 'Home' ? 'kakao' : e.key === 'End' ? 'instagram'
      : ['ArrowLeft', 'ArrowRight'].includes(e.key) ? (tab === 'kakao' ? 'instagram' : 'kakao') : null;
    if (!next) return;
    e.preventDefault();
    selectTab(next);
    document.getElementById(`${id}-${next}`)?.focus();
  }
  async function nativeShare(data: ShareData) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setStatus('');
    try { await navigator.share(data); }
    catch (error) {
      if (alive.current && (error as DOMException)?.name !== 'AbortError') setStatus('공유창을 열 수 없었어요. 링크를 복사하거나 이미지를 저장해 주세요.');
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }
  function shareKakao() {
    setStatus('');
    kakao.send(letter);
  }
  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(shareUrl);
      if (alive.current) setStatus('편지 링크를 복사했어요.');
    } catch {
      if (alive.current) { setManualCopy(true); setStatus('아래 링크를 길게 누르거나 선택해서 복사해 주세요.'); }
    }
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby={`${id}-title`}
    onCancel={e => { e.preventDefault(); onClose(); }}
    onClick={e => { if (e.target === e.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose();
    } }}>
    <div className={styles.inner}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>A LETTER FOR YOU</p><h2 id={`${id}-title`}>편지 공유하기</h2></div>
        <button type="button" className={styles.close} aria-label="공유창 닫기" onClick={onClose}>×</button>
      </header>
      <div role="tablist" aria-label="공유 방법" className={styles.tabs}>
        {(['kakao', 'instagram'] as const).map(value => <button key={value} type="button" role="tab" id={`${id}-${value}`}
          aria-controls={`${id}-panel`} aria-selected={tab === value} tabIndex={tab === value ? 0 : -1}
          onKeyDown={tabKey} onClick={() => selectTab(value)}>{value === 'kakao' ? '카카오톡' : 'Instagram'}</button>)}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}`} tabIndex={0}>
        {tab === 'kakao' ? <>
          {kakao.sdk !== 'unavailable' && <button type="button" className={styles.kakaoButton} disabled={kakao.sdk === 'loading'} onClick={shareKakao}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.3 4.7 6.7l-.9 3.3c-.1.3.2.5.5.3l4-2.6 1.7.1c5.5 0 10-3.5 10-7.8S17.5 3 12 3Z"/></svg>
            {kakao.sdk === 'loading' ? '카카오톡 연결 중…' : '카카오톡으로 편지 보내기'}</button>}
          <KakaoHandoff sdk={kakao.sdk} handoff={kakao.handoff} shareUrl={shareUrl}
            onSendAgain={shareKakao} onSendWeb={() => { setStatus(''); kakao.send(letter, { web: true }); }} onReconnect={kakao.retry} />
          {kakao.handoff === 'idle' && kakao.sdk !== 'unavailable' && <button type="button" className={styles.secondary} onClick={copyLink}>편지 링크 복사</button>}
          {manualCopy && <input className={styles.copyInput} aria-label="복사할 편지 링크" readOnly value={shareUrl} onFocus={e => e.currentTarget.select()} />}
          <figure className={styles.kakaoMessage}>
            <figcaption>카카오톡에는 이렇게 보여요</figcaption>
            <div className={styles.kakaoCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LETTER_SHARE_CARD} width="800" height="800" alt="" />
              <div>
                <p className={styles.kakaoTitle}>{letter.from ? `${letter.from}의 편지가 도착했어요` : '편지가 도착했어요'}</p>
                <p className={styles.kakaoDesc}>봉투를 열면 마음을 담은 한 줄이 있어요.</p>
                <dl className={styles.kakaoItems}>
                  {letter.from && <><dt>보낸 사람</dt><dd>{letter.from}</dd></>}
                  <dt>쓴 날</dt><dd>{letter.date}</dd>
                </dl>
              </div>
            </div>
            <div className={styles.kakaoButtons} aria-hidden="true"><span>편지 열어보기</span><span>나도 편지 쓰기</span></div>
          </figure>
          <p className={styles.privacy}>편지 내용은 카카오톡 메시지에 보이지 않고, 받는 분이 열어야 보여요. 편지와 이름은 링크에 담기므로 링크를 받은 사람은 누구나 읽을 수 있어요. <a className={styles.previewLink} href={previewUrl} target="_blank" rel="noopener noreferrer">받는 화면 미리보기 <span aria-hidden="true">↗</span></a></p>
        </> : <>
          <p className={styles.intro}>Sodam과 편지를 한 장에 담았어요.</p>
          <div className={styles.storyPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {story ? <img src={story.url} width="1080" height="1920" alt="Instagram에 공유할 Sodam과 내 편지 이미지" /> : <p role="status">{storyError ? '이미지를 만들지 못했어요.' : '편지 이미지를 만드는 중…'}</p>}
          </div>
          <p className={styles.privacy}>이미지에는 편지 내용과 이름이 보여요. 올리기 전에 공개 범위를 확인해 주세요.</p>
          {story?.canShare && <><button type="button" className={styles.instagramButton} disabled={busy} onClick={() => nativeShare({ files: [story.file], title: '당신에게 도착한 편지' })}>이미지 공유창 열기</button><p className={styles.note}>공유창에서 Instagram을 선택해 주세요.</p></>}
          {story && <a className={styles.secondary} href={story.url} download="DEAR-PAPA-letter-story.png">Instagram용 이미지 저장</a>}
          {storyError && <button type="button" className={styles.secondary} onClick={() => setStoryAttempt(v => v + 1)}>이미지 다시 만들기</button>}
          <p className={styles.note}>저장한 이미지를 Instagram 스토리나 게시물에 올릴 수 있어요.</p>
          <a className={styles.external} href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram 열기 <span aria-hidden="true">↗</span></a>
        </>}
      </div>
      <p className={styles.status} role="status" aria-live="polite">{status}</p>
    </div>
  </dialog>;
}
