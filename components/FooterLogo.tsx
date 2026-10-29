'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import styles from './FooterLogo.module.css';

type Props = { slogan: string; definition: string; explanation: string };
const DURATION = 2800;

export function FooterLogo({ slogan, definition, explanation }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let seen = false;
    let observer: IntersectionObserver | undefined;
    const stop = () => setPlaying(false);
    const onPreference = () => { if (preference.matches) stop(); };
    const onVisibility = () => { if (document.hidden) stop(); };
    const onKey = () => { keyboardRef.current = true; stop(); };
    const onPointer = () => { keyboardRef.current = false; };
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);

    if ('IntersectionObserver' in window) {
      // Observe only the short logo/signature stage, so the whole mark is in view.
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.65 || seen) return;
        seen = true;
        observer?.disconnect();
        if (!preference.matches && !keyboardRef.current && !document.hidden) setPlaying(true);
      }, { threshold: 0.65 });
      observer.observe(stage);
    }
    // Without an observer or JavaScript, the complete brand lockup stays visible.
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    // Also finish if the browser skips animationend (background tab, interrupted CSS).
    const timer = window.setTimeout(() => setPlaying(false), DURATION + 100);
    return () => window.clearTimeout(timer);
  }, [playing, replay]);

  return (
    <div id="brand-finale" className={styles.finale} data-playing={playing}>
      <div ref={stageRef} className={styles.stage}>
        <Fragment key={replay}>
          <Logo className={styles.logo} wordmarkClassName={styles.wordmark} mark={
            <g className={styles.travel}>
              <g transform="translate(-75.19 -26.54) scale(1.105769)">
                {/* Native SVG coordinates put the pivot at the ring's centre on every browser. */}
                <g transform="translate(128 128)">
                  <g className={styles.ring}>
                    <path transform="translate(-128 -128)" fillRule="evenodd" d="M68 128a60 60 0 1 0 120 0a60 60 0 1 0 -120 0zM88 128a40 42 0 1 0 80 0a40 42 0 1 0 -80 0z" />
                  </g>
                  <g className={styles.turn}><path d="M40 -104h20v162h-20z" /></g>
                  <path className={styles.reunite} d="M40 -104h20v162h-20z" />
                </g>
              </g>
            </g>
          } />
          <p className={styles.slogan} onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setPlaying(false);
          }}>{slogan}</p>
        </Fragment>
      </div>
      <p className={styles.definition}>{definition}</p>
      <p className={styles.explanation}>{explanation}</p>
      <button
        type="button"
        className={styles.replay}
        aria-label="디어파파 로고 모션 다시 보기"
        onClick={(event) => {
          if (event.detail === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPlaying(false);
            return;
          }
          setReplay((value) => value + 1);
          setPlaying(true);
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9a8 8 0 1 1 0 6M4 4v5h5" />
        </svg>
        <span>한 번 더 보기</span>
      </button>
    </div>
  );
}
