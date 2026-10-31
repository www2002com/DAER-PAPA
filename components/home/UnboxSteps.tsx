'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Product.module.css';

const STEPS = [
  { id: 'card', label: '편지 카드' },
  { id: 'bottle', label: '보틀' },
  { id: 'guide', label: '사용 안내' },
] as const;

// Exploded view of bottle and guide layers (letter packaging TBD). Lifts one layer at a time.
export function UnboxSteps() {
  const [active, setActive] = useState(0);
  const [automatic, setAutomatic] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stopIfReduced = () => { if (media.matches) setAutomatic(false); };
    stopIfReduced();
    media.addEventListener('change', stopIfReduced);
    return () => media.removeEventListener('change', stopIfReduced);
  }, []);

  useEffect(() => {
    if (!visible || !automatic || active === STEPS.length - 1 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Explain the three layers once, then leave the visitor in control.
    const timer = window.setTimeout(() => setActive((step) => Math.min(step + 1, STEPS.length - 1)), 1500);
    return () => clearTimeout(timer);
  }, [visible, automatic, active]);

  return (
    <div
      ref={ref}
      className={styles.unbox}
      onPointerDown={() => setAutomatic(false)}
      onFocus={() => setAutomatic(false)}
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
            <button type="button" aria-pressed={active === i} onClick={() => { setAutomatic(false); setActive(i); }}>
              <span className={styles.unboxNum}>{String(i + 1).padStart(2, '0')}</span>
              <span>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
