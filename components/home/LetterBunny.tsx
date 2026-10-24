'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './LetterBunny.module.css';

export function LetterBunny() {
  const [replay, setReplay] = useState(0);

  return (
    <div className={styles.companion}>
      <button type="button" className={styles.character} data-reveal
        aria-label="편지 토끼 움직임 다시 보기" title="눌러서 편지 토끼와 인사해요"
        onClick={() => setReplay((value) => value + 1)}>
        <Image key={replay} src="/images/letter-bunny-original.jpg"
          width={736} height={977} alt=""
          className={`${styles.portrait} ${replay > 0 ? styles.replay : ''}`} />
        <span className={styles.label}>눌러서 인사해요!</span>
      </button>
    </div>
  );
}
