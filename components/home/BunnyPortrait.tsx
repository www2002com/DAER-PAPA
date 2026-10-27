'use client';

import { useId } from 'react';
import styles from './BunnyPortrait.module.css';

/**
 * Sodam v2 basic character (official cut from DESIGN SHEET 01, 2026-10-27).
 * The source asset is shown unchanged; only the eyes blink, using adjacent
 * cheek texture from the same image behind matching ink lids.
 */
export function BunnyPortrait({ nudging }: { nudging: boolean }) {
  const id = useId();
  const art = `${id}-art`;
  const leftEye = `${id}-left-eye-texture`;
  const rightEye = `${id}-right-eye-texture`;

  return <svg className={styles.portrait} data-awake={nudging}
    viewBox="0 0 465 585" width="465" height="585" aria-hidden="true" focusable="false">
    <defs>
      <image id={art} href="/images/sodam-v2/sodam-v2-basic.webp" width="465" height="585" />
      <clipPath id={leftEye}>
        <ellipse cx="201" cy="347" rx="14" ry="23" />
      </clipPath>
      <clipPath id={rightEye}>
        <ellipse cx="323" cy="333" rx="14" ry="23" />
      </clipPath>
    </defs>
    <use href={`#${art}`} />
    {/* Borrow adjacent cheek texture so the painted eyes can close. */}
    <g clipPath={`url(#${leftEye})`}><use href={`#${art}`} x="40" /></g>
    <g clipPath={`url(#${rightEye})`}><use href={`#${art}`} x="-40" /></g>
    <ellipse className={styles.eye} data-bunny-part="left-eye" cx="201" cy="347" rx="10.5" ry="19" />
    <ellipse className={styles.eye} data-bunny-part="right-eye" cx="323" cy="333" rx="10.5" ry="19" />
  </svg>;
}
