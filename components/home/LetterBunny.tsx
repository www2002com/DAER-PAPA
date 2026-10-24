'use client';

import { useState } from 'react';
import styles from './LetterBunny.module.css';

const letterColors = [
  { name: '로즈', color: '#f5bfd9' },
  { name: '라일락', color: '#ddd0f5' },
  { name: '라임', color: '#d3f580' },
];

export function LetterBunny() {
  const [replay, setReplay] = useState(0);
  const [letterColor, setLetterColor] = useState(letterColors[0].color);

  return (
    <div className={styles.companion}>
    <button type="button" className={styles.character} data-reveal
      aria-label="편지 토끼 움직임 다시 보기" title="눌러서 편지 토끼와 인사해요"
      onClick={() => setReplay((value) => value + 1)}>
      <svg key={replay} className={replay > 0 ? styles.replay : undefined}
        viewBox="0 0 160 240" fill="none" aria-hidden="true">
        <g className={styles.hearts} fill="#abc9f2">
          <path d="m15 106-7-7c-6-6 2-13 7-7 5-6 13 1 7 7Z" />
          <path d="m145 126-6-6c-5-5 2-11 6-6 4-5 11 1 6 6Z" />
        </g>
        <ellipse className={styles.shadow} cx="80" cy="229" rx="65" ry="7" fill="#d5e3fa" />
        <g className={styles.hop} stroke="#5675ad" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <g className={styles.leftEar}>
            <path d="M35 91C17 78 24 39 39 12C51-8 66 39 70 65C74 82 58 94 35 91Z" fill="#fff" />
            <path d="M41 75C30 56 39 20 46 20C55 20 62 64 56 78Z" fill="#afcaf4" stroke="none" />
            <path d="M29 73Q43 91 66 66Q67 92 37 90Z" fill="#e4eafa" stroke="none" />
            <path d="M40 82C29 65 37 61 43 72C38 50 50 56 52 76" fill="#fff" strokeWidth="1.5" />
          </g>
          <g className={styles.rightEar}>
            <path d="M94 84C85 61 110 17 127 7C145-4 146 62 136 82C127 100 110 99 94 84Z" fill="#fff" />
            <path d="M109 82C107 61 124 16 131 18C143 23 129 82 120 86Z" fill="#afcaf4" stroke="none" />
            <path d="M104 86Q126 87 140 68Q137 98 115 96Z" fill="#e4eafa" stroke="none" />
            <path d="M111 91C113 69 125 62 123 81C138 72 136 88 121 91" fill="#fff" strokeWidth="1.5" />
          </g>
          <path d="M126 197C146 190 149 204 140 209C151 219 132 230 123 220" fill="#fff" />
          <path d="M43 151C28 167 25 198 35 217C49 235 113 234 127 215C141 196 129 165 115 151Z" fill="#fff" />
          <path d="M39 197Q53 226 120 210Q113 233 59 228Q40 225 35 214Z" fill="#e8edfb" stroke="none" />
          <path d="M28 116C29 88 49 72 80 72C112 69 133 89 133 117C145 128 137 133 130 132C141 139 130 147 119 149C111 158 93 156 81 154C66 160 47 157 40 150C25 149 15 139 25 134C13 133 19 122 28 120Z" fill="#fff" />
          <ellipse cx="41" cy="131" rx="13" ry="8" fill="#fce0e6" stroke="none" />
          <ellipse cx="116" cy="131" rx="13" ry="8" fill="#fce0e6" stroke="none" />
          <path d="M37 123Q47 116 57 125M102 125Q112 117 122 123" strokeWidth="2.8" />
          <path d="m34 131 2-2m3 3 2-3m3 3 2-2m62 1 2-2m3 3 2-3m3 3 2-2" stroke="#e9acbc" strokeWidth="1.2" />
          <path d="M75 127Q80 124 85 127Q80 132 75 127Z" fill="#9ebce6" stroke="none" />
          <path d="M68 133Q73 141 80 134Q87 141 93 133" strokeWidth="1.8" />
          <g className={styles.envelope}>
            <rect x="51" y="170" width="58" height="34" rx="4" fill={letterColor} />
            <path d="m53 173 27 17 27-17m-54 29 19-15m34 15-18-15" strokeWidth="1.5" />
            <path d="m80 194-5-5c-4-4 1-7 5-3 4-4 9-1 5 3Z" fill="#fff" strokeWidth="1.2" />
          </g>
          <path d="M43 157C39 151 34 159 34 165C21 184 42 199 60 187C73 178 82 156 69 157L61 160C54 155 48 160 43 157Z" fill="#fff" />
          <path d="M117 157C121 151 126 159 126 165C139 184 118 199 100 187C87 178 78 156 91 157L99 160C106 155 112 160 117 157Z" fill="#fff" />
          <path d="M34 179Q44 193 64 179M126 179Q116 193 96 179" stroke="#e4eafa" strokeWidth="5" />
          <ellipse cx="48" cy="211" rx="16" ry="23" transform="rotate(-27 48 211)" fill="#fff" />
          <ellipse cx="48" cy="215" rx="10" ry="16" transform="rotate(-27 48 215)" fill="#afcaf4" stroke="none" />
          <ellipse cx="105" cy="211" rx="17" ry="23" transform="rotate(13 105 211)" fill="#fff" />
          <ellipse cx="104" cy="215" rx="10" ry="16" transform="rotate(13 104 215)" fill="#afcaf4" stroke="none" />
        </g>
      </svg>
      <span className={styles.label}>눌러서 인사해요!</span>
    </button>
    <div className={styles.palette} role="group" aria-label="토끼의 편지봉투 색 고르기">
      {letterColors.map(({ name, color }) => (
        <button key={name} type="button" className={styles.swatch}
          aria-label={`${name} 편지봉투`} aria-pressed={letterColor === color}
          title={`${name} 편지봉투`} onClick={() => setLetterColor(color)}>
          <span style={{ backgroundColor: color }} aria-hidden="true">
            {letterColor === color ? '♥' : ''}
          </span>
        </button>
      ))}
    </div>
    <span className={styles.paletteHint}>토끼 봉투색 바꾸기</span>
    </div>
  );
}
