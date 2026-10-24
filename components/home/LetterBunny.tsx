'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './LetterBunny.module.css';

const greetings = [
  '말로 하기 쑥스러운 마음, 한 줄이면 충분해요.',
  '반가워요! 오늘 아빠에게 어떤 말을 건네고 싶나요?',
  '“아빠, 늘 고마워요.” 짧아도 마음은 전해져요.',
  '잘 쓰려 애쓰지 않아도 괜찮아요. 내 말투 그대로요.',
];

export function LetterBunny() {
  const [replay, setReplay] = useState(0);

  return (
    <div className={styles.companion}>
      <button type="button" className={styles.character}
        aria-label="편지 토끼 움직임 다시 보기" title="눌러서 편지 토끼와 인사해요"
        onClick={() => setReplay((value) => value + 1)}>
        <span className={`${styles.portraitWrap} ${replay > 0 ? (replay % 2 ? styles.replay : styles.replayAgain) : ''}`}>
        <Image src="/images/letter-bunny-original.jpg"
          width={736} height={977} alt=""
          className={styles.portrait} loading="eager" />
        </span>
        <span className={styles.label}>{replay ? '한 번 더 인사해요' : '톡, 인사해요!'}</span>
      </button>
      <div className={styles.note}>
        <p className={styles.reply} aria-live="polite" aria-atomic="true">
          <span key={replay} className={replay > 0 ? styles.answer : undefined}>
            {greetings[replay === 0 ? 0 : 1 + ((replay - 1) % (greetings.length - 1))]}
          </span>
        </p>
        <a className={styles.letterLink} href="/#letter" data-letter-entry data-track-action="letter_entry_clicked">
          내 마음 적어보기 <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  );
}
