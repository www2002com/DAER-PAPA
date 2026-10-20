'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Product.module.css';

const STEPS = [
  { id: 'card', label: '편지 카드' },
  { id: 'bottle', label: '보틀' },
  { id: 'guide', label: '사용 안내' },
] as const;

// "상자를 열면 편지 카드, 보틀, 사용 안내 순서" — an exploded view that lifts one layer at a time.
export function UnboxSteps() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2800);
    return () => clearInterval(t);
  }, [visible, paused]);

  return (
    <div
      ref={ref}
      className={styles.unbox}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.iso} aria-hidden="true">
        <div className={styles.plane} data-active={STEPS[active].id}>
          <span className={styles.tray} />
          <span className={`${styles.layer} ${styles.lGuide}`} data-on={active === 2 || undefined}>
            <i />
            <i />
            <i />
          </span>
          <span className={`${styles.layer} ${styles.lBottle}`} data-on={active === 1 || undefined}>
            <i />
          </span>
          <span className={`${styles.layer} ${styles.lCard}`} data-on={active === 0 || undefined}>
            <b className="pen">Dear Papa,</b>
            <i />
            <i />
          </span>
        </div>
      </div>

      <ol className={styles.unboxSteps}>
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
              <span className={styles.unboxNum}>{String(i + 1).padStart(2, '0')}</span>
              <span>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
