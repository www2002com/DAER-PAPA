'use client';

import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';
import styles from './HeroLogo.module.css';

export function HeroLogo({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [motion, setMotion] = useState<'idle' | 'playing' | 'done'>('idle');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!wrapper || reduced.matches || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setMotion('playing');
      observer.disconnect();
    }, { threshold: 0.6 });
    observer.observe(wrapper);

    const onPreference = () => {
      if (!reduced.matches) return;
      observer.disconnect();
      setMotion('done');
    };
    reduced.addEventListener('change', onPreference);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', onPreference);
    };
  }, []);

  return (
    <span ref={wrapperRef} className={styles.wrapper} data-logo-motion={motion}>
      <Logo
        className={className}
        mark={
          <g transform="translate(-75.19 -26.54) scale(1.105769)">
            <path className={styles.papa} d="M68 70h20v162h-20z" />
            <path className={styles.restoreDear} d="M168 24h20v162h-20z" />
            <g className={styles.turn} onAnimationEnd={() => setMotion('done')}>
              <path
                fillRule="evenodd"
                d="M68 128a60 60 0 1 0 120 0a60 60 0 1 0 -120 0zM88 128a40 42 0 1 0 80 0a40 42 0 1 0 -80 0z"
              />
              <path d="M168 24h20v162h-20z" />
            </g>
          </g>
        }
      />
    </span>
  );
}
