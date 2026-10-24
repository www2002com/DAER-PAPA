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
        <Image src="/images/letter-bunny-grid-v1.webp"
          width={640} height={640} alt=""
          className={styles.portrait} loading="eager" />
        </span>
        <span className={styles.label}>{replay ? '다시 인사하기' : '토끼에게 인사하기'}</span>
      </button>
      <div className={styles.note}>
        <span className={styles.salutation}>Dear Papa,</span>
        <p className={styles.message}>난 아빠가 행복해졌으면 좋겠어</p>
        <p className={styles.reply} aria-live="polite" aria-atomic="true">
          <span key={replay} className={replay > 0 ? styles.answer : undefined}>
            {greetings[replay === 0 ? 0 : 1 + ((replay - 1) % (greetings.length - 1))]}
          </span>
        </p>
      </div>
    </div>
  );
}
