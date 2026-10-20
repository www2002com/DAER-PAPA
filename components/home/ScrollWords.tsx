'use client';

import { useEffect, useRef } from 'react';
import styles from './Story.module.css';

// Unlit words stay at ≥3:1 contrast (large text), so the sentence is readable before it lights up.
const MIN_OPACITY = 0.52;

// A sentence whose words light up one by one as it scrolls through the viewport.
// Opacity is written straight to the DOM (no React re-render per frame).
export function ScrollWords({ text, as: Tag = 'p', className }: { text: string; as?: 'p' | 'h2'; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-w]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => (s.style.opacity = '1'));
      return;
    }
    let frame = 0;
    let active = false;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%.
      const start = vh * 0.85;
      const end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = p * (spans.length + 1.5);
      spans.forEach((s, i) => {
        const o = Math.min(1, Math.max(MIN_OPACITY, lit - i));
        s.style.opacity = o.toFixed(3);
      });
    };
    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
      if (active) onScroll();
    });
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Tag ref={ref as React.RefObject<never>} className={`${styles.words} ${className ?? ''}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span data-w className={styles.word}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
