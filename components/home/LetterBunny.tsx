'use client';

import { useState } from 'react';
import styles from './LetterBunny.module.css';

export function LetterBunny() {
  const [replay, setReplay] = useState(0);

  return (
    <button type="button" className={styles.character} data-reveal
      aria-label="편지 토끼 움직임 다시 보기" title="눌러서 편지 토끼와 인사해요"
      onClick={() => setReplay((value) => value + 1)}>
      <svg key={replay} className={replay > 0 ? styles.replay : undefined}
        viewBox="0 0 160 200" fill="none" aria-hidden="true">
        <ellipse className={styles.shadow} cx="80" cy="184" rx="43" ry="6" fill="#b9cbed" />
        <g className={styles.hop} stroke="#244790" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <g className={styles.leftEar}>
            <path d="M48 74C35 53 26 13 39 9C55 3 65 46 66 73" fill="#fffdf9" />
            <path d="M45 24C46 36 51 51 55 59" stroke="#efa4cd" strokeWidth="7" />
          </g>
          <g className={styles.rightEar}>
            <path d="M94 70C95 39 112 5 123 13C136 23 119 56 111 77" fill="#fffdf9" />
            <path d="M116 28C112 39 108 49 104 57" stroke="#efa4cd" strokeWidth="7" />
          </g>
          <ellipse cx="80" cy="140" rx="30" ry="35" fill="#fffdf9" />
          <ellipse cx="55" cy="174" rx="22" ry="10" fill="#fffdf9" />
          <ellipse cx="105" cy="174" rx="22" ry="10" fill="#fffdf9" />
          <path d="M37 87C37 62 55 58 80 60C105 58 123 65 123 88C123 113 104 124 80 123C55 124 37 112 37 87Z" fill="#fffdf9" />
          <g fill="#244790" stroke="none">
            <path d="M61 95 52 86C47 80 55 74 61 81C67 74 75 80 70 86Z" />
            <path d="M99 95 90 86C85 80 93 74 99 81C105 74 113 80 108 86Z" />
          </g>
          <path d="m76 101 4 3 4-3m-4 3v3m-10 0q10 12 20 0" strokeWidth="2.5" />
          <path d="m40 99 8 2m64 0 8-2" stroke="#efa4cd" strokeWidth="5" />
          <g className={styles.envelope}>
            <rect x="35" y="130" width="90" height="37" rx="3" fill="#d3f580" />
            <path d="m36 132 44 23 44-23m-88 33 29-20m59 20-29-20" strokeWidth="2" />
            <path d="m80 157-7-7c-4-4 2-8 7-3 5-5 11-1 7 3Z" fill="#ee98c5" strokeWidth="1.5" />
          </g>
          <path d="M37 132C22 125 21 145 38 149M123 132C138 125 139 145 122 149" fill="#fffdf9" />
        </g>
      </svg>
      <span className={styles.label}>편지 왔어요!</span>
    </button>
  );
}
