'use client';

import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import styles from './FooterLogo.module.css';

export function FooterLogo() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) {
      setPlaying(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setPlaying(true);
      observer.disconnect();
    }, { threshold: 0.6 });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  function play() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setReplay((value) => value + 1);
    setPlaying(true);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.button}
      data-playing={playing || undefined}
      onClick={play}
      aria-label="디어파파 로고: d(Dear)가 180° 돌아 p(Papa)가 되는 모션 다시 보기"
      title="로고 모션 다시 보기"
    >
      <Logo
        className={styles.logo}
        mark={
          <g key={replay} transform="translate(-75.19 -26.54) scale(1.105769)">
            <path className={styles.papa} d="M68 70h20v162h-20z" />
            <path className={styles.restoreDear} d="M168 24h20v162h-20z" />
            <g
              className={styles.turn}
              onAnimationEnd={() => setPlaying(false)}
            >
              <path
                fillRule="evenodd"
                d="M68 128a60 60 0 1 0 120 0a60 60 0 1 0 -120 0zM88 128a40 42 0 1 0 80 0a40 42 0 1 0 -80 0z"
              />
              <path d="M168 24h20v162h-20z" />
            </g>
          </g>
        }
      />
    </button>
  );
}
