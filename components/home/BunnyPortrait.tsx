'use client';

import { useId } from 'react';
import styles from './BunnyPortrait.module.css';

/** Animate parts of the approved illustration without changing its source asset. */
export function BunnyPortrait({ earsActive }: { earsActive: boolean }) {
  const id = useId();
  const art = `${id}-art`;
  const left = `${id}-left-ear`;
  const right = `${id}-right-ear`;
  const body = `${id}-body`;
  const leftEye = `${id}-left-eye-texture`;
  const rightEye = `${id}-right-eye-texture`;

  return <svg className={`${styles.portrait} ${earsActive ? styles.awake : ''}`}
    viewBox="0 0 640 640" width="640" height="640" aria-hidden="true" focusable="false">
    <defs>
      <image id={art} href="/images/letter-bunny-fine-grid-v3.webp" width="640" height="640" />
      <clipPath id={left}>
        <path d="M80 90H338V273L231 330 180 293H80Z" />
      </clipPath>
      <clipPath id={right}>
        <path d="M342 10H540V335H455L342 278Z" />
      </clipPath>
      <clipPath id={body}>
        <path d="M336 238C345 236 351 243 359 253C410 257 442 282 465 315C487 342 502 376 504 405H640V640H0V405H171C172 366 185 331 211 303C242 277 279 260 317 254C325 246 329 240 336 238Z" />
      </clipPath>
      <clipPath id={leftEye}>
        <ellipse cx="270" cy="387" rx="14" ry="23" />
      </clipPath>
      <clipPath id={rightEye}>
        <ellipse cx="388" cy="395" rx="14" ry="23" />
      </clipPath>
    </defs>
    {/* Ear roots extend behind the head so their pivots never open a seam. */}
    <g className={styles.leftEar} data-bunny-part="left-ear">
      <g clipPath={`url(#${left})`}><use href={`#${art}`} /></g>
    </g>
    <g className={styles.rightEar} data-bunny-part="right-ear">
      <g clipPath={`url(#${right})`}><use href={`#${art}`} /></g>
    </g>
    <g clipPath={`url(#${body})`}><use href={`#${art}`} /></g>
    {/* Borrow adjacent cheek texture, retaining the fine grid behind the lids. */}
    <g clipPath={`url(#${leftEye})`}><use href={`#${art}`} x="40" /></g>
    <g clipPath={`url(#${rightEye})`}><use href={`#${art}`} x="-40" /></g>
    <g transform="translate(270 387) rotate(6)">
      <ellipse className={styles.eye} data-bunny-part="left-eye" cx="0" cy="0" rx="9" ry="17" />
    </g>
    <g transform="translate(388 395) rotate(4)">
      <ellipse className={styles.eye} data-bunny-part="right-eye" cx="0" cy="0" rx="9" ry="17" />
    </g>
  </svg>;
}
