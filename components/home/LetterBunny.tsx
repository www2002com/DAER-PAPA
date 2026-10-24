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
            <path d="M46 76C34 53 29 17 43 15C59 12 66 49 65 76" fill="#fffdf9" />
            <path d="M45 29C46 40 50 52 54 61" stroke="#f5b6d4" strokeWidth="9" />
          </g>
          <g className={styles.rightEar}>
            <path d="M96 75C95 50 101 17 115 18C129 18 132 37 123 43C119 46 115 42 115 38C115 53 113 66 111 79" fill="#fffdf9" />
            <path d="M109 34C106 44 105 53 104 62" stroke="#f5b6d4" strokeWidth="9" />
          </g>
          <ellipse cx="80" cy="146" rx="29" ry="31" fill="#fffdf9" />
          <ellipse cx="59" cy="176" rx="16" ry="10" fill="#fffdf9" />
          <ellipse cx="101" cy="176" rx="16" ry="10" fill="#fffdf9" />
          <path d="M29 94C29 67 48 58 80 60C112 58 131 69 131 94C131 120 108 133 80 132C52 133 29 120 29 94Z" fill="#fffdf9" />
          <ellipse cx="45" cy="108" rx="11" ry="7" fill="#f5b6d4" stroke="none" />
          <ellipse cx="115" cy="108" rx="11" ry="7" fill="#f5b6d4" stroke="none" />
          <g fill="#244790" stroke="none">
            <ellipse cx="61" cy="96" rx="7" ry="9" />
            <ellipse cx="99" cy="96" rx="7" ry="9" />
            <circle cx="59" cy="93" r="2.5" fill="white" />
            <circle cx="97" cy="93" r="2.5" fill="white" />
          </g>
          <path d="M77 107Q80 104 83 107L80 110Z" fill="#ee98c5" strokeWidth="1.5" />
          <path d="M80 110v3m-8-1q4 7 8 1q4 7 8-1" strokeWidth="2.5" />
          <g className={styles.envelope}>
            <rect x="40" y="137" width="80" height="32" rx="5" fill="#d3f580" />
            <path d="m42 139 38 20 38-20m-76 28 25-18m51 18-25-18" strokeWidth="2" />
            <path d="m80 157-7-7c-4-4 2-8 7-3 5-5 11-1 7 3Z" fill="#ee98c5" strokeWidth="1.5" />
          </g>
          <ellipse cx="42" cy="149" rx="8" ry="10" transform="rotate(-20 42 149)" fill="#fffdf9" />
          <ellipse cx="118" cy="149" rx="8" ry="10" transform="rotate(20 118 149)" fill="#fffdf9" />
        </g>
      </svg>
      <span className={styles.label}>편지 왔어요!</span>
    </button>
  );
}
