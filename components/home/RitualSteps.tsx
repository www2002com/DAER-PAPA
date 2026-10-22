'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { RitualIcon } from '@/components/art/Art';
import styles from './RitualSteps.module.css';

const STEPS = [['wash', '씻고'], ['pump', '덜고'], ['apply', '바르고']] as const;

export function RitualSteps() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || reduced.matches) return;
        setRun((previous) => previous + 1);
        observer?.disconnect();
      }, { threshold: 0.65 })
      : null;

    observer?.observe(wrapper);
    const onPreference = () => { if (reduced.matches) setRun(0); };
    reduced.addEventListener('change', onPreference);
    return () => {
      observer?.disconnect();
      reduced.removeEventListener('change', onPreference);
    };
  }, []);

  function replay() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRun((previous) => previous + 1);
    }
  }

  return (
    <div ref={wrapperRef} className={styles.steps} data-ritual>
      <ol key={run} className={styles.list} aria-label="구상 중인 사용 순서" data-playing={run > 0 || undefined}>
        {STEPS.map(([kind, label], index) => (
          <li key={kind} style={{ '--step-delay': `${250 + index * 1350}ms` } as CSSProperties}>
            <RitualIcon kind={kind} className={styles.icon} />
            <span><small>{index + 1}</small>{label}</span>
          </li>
        ))}
      </ol>
      <button type="button" className={styles.replay} onClick={replay} aria-label="사용 순서 모션 다시 보기">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 6a5 5 0 1 0 .1 3M13 2v4H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        다시 보기
      </button>
    </div>
  );
}
