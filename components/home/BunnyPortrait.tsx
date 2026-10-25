'use client';

import { useId } from 'react';
import styles from './BunnyPortrait.module.css';

/** Animate parts of the approved illustration without changing its source asset. */
export function BunnyPortrait({ nudging }: { nudging: boolean }) {
  const id = useId();
  const art = `${id}-art`;
  const left = `${id}-left-ear`;
  const right = `${id}-right-ear`;
  const body = `${id}-body`;
  const leftEye = `${id}-left-eye-texture`;
  const rightEye = `${id}-right-eye-texture`;
  const bodyMask = `${id}-body-mask`;
  const joints = `${id}-joints`;
  const limbs = [
    { name: 'left-arm', className: styles.leftArm, path: 'M219 463L252 473C273 480 285 491 285 507C286 517 277 525 263 532H211C196 512 201 484 219 463Z' },
    { name: 'right-arm', className: styles.rightArm, path: 'M400 472C377 482 365 492 365 507C364 519 370 525 381 533L467 534C461 507 450 484 438 472Z' },
    { name: 'left-foot', className: styles.leftFoot, path: 'M180 540Q202 519 232 523Q277 525 287 573V626H180Z' },
    { name: 'right-foot', className: styles.rightFoot, path: 'M353 575C360 541 397 516 427 522C447 524 462 537 470 557V626H353Z' },
  ];

  return <svg className={`${styles.portrait} ${nudging ? styles.awake : ''}`}
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
      {limbs.map(limb => <clipPath key={limb.name} id={`${id}-${limb.name}`}>
        <path d={limb.path} />
      </clipPath>)}
      <mask id={bodyMask} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="640">
        <rect width="640" height="640" fill="white" />
        {limbs.map(limb => <path key={limb.name} d={limb.path} fill="black" />)}
      </mask>
      <clipPath id={`${joints}-arms`}>
        <path d="M212 474H239V533H212ZM421 478H446V540H421Z" />
      </clipPath>
      <clipPath id={`${joints}-left-foot`}>
        <path d="M258 545H291V606H267Z" />
      </clipPath>
      <clipPath id={`${joints}-right-foot`}>
        <path d="M350 545H378L372 606H350Z" />
      </clipPath>
    </defs>
    {/* Ear roots extend behind the head so their pivots never open a seam. */}
    <g className={styles.leftEar} data-bunny-part="left-ear">
      <g clipPath={`url(#${left})`}><use href={`#${art}`} /></g>
    </g>
    <g className={styles.rightEar} data-bunny-part="right-ear">
      <g clipPath={`url(#${right})`}><use href={`#${art}`} /></g>
    </g>
    <g clipPath={`url(#${body})`} mask={`url(#${bodyMask})`}><use href={`#${art}`} /></g>
    {/* Small texture underlaps keep shoulders and ankles joined while they pivot. */}
    <g clipPath={`url(#${joints}-arms)`}><use href={`#${art}`} y="120" /></g>
    <g clipPath={`url(#${joints}-left-foot)`}><use href={`#${art}`} x="40" y="170" /></g>
    <g clipPath={`url(#${joints}-right-foot)`}><use href={`#${art}`} x="-80" y="170" /></g>
    {limbs.map(limb => <g key={limb.name} className={limb.className} data-bunny-part={limb.name}>
      <g clipPath={`url(#${id}-${limb.name})`}><use href={`#${art}`} /></g>
    </g>)}
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
