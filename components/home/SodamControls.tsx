'use client';

import styles from './SodamControls.module.css';

export function SodamControls({ paused, onPause, dancing, onDance, sound, onSound, quiet = false }: {
  paused: boolean; onPause: () => void;
  dancing?: boolean; onDance?: () => void;
  sound: boolean; onSound: () => void; quiet?: boolean;
}) {
  return <div className={styles.controls}>
    <button type="button" className={styles.motion} aria-label="Sodam 움직임 멈춤"
      title={paused ? '움직임 재생' : '움직임 멈춤'} aria-pressed={paused} onClick={onPause}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        {paused ? <path d="m8 5 11 7-11 7z" /> : <path d="M7 5h3v14H7zm7 0h3v14h-3z" />}
      </svg>
    </button>
    {onDance && <button type="button" className={styles.motion} aria-label="Sodam 춤"
      title={dancing ? '표정 보기' : '춤 보기'} aria-pressed={dancing} disabled={quiet} onClick={onDance}>
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M9 17V5l11-2v12M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>
      </svg>
    </button>}
    <button type="button" aria-label="Sodam 효과음"
      title={sound ? '효과음 끄기' : '효과음 켜기'} aria-pressed={sound} disabled={quiet} onClick={onSound}>
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 4 6 8H3v8h3l5 4z" />
        {sound ? <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /> : <path d="m16 9 5 6m0-6-5 6" />}
      </svg>
    </button>
  </div>;
}
