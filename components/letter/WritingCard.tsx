'use client';

import { useEffect, useRef, useState } from 'react';
import { LetterCard } from './LetterCard';
import { ensureGlyphs, layoutLetter, type Layout } from './card';

type Props = {
  text: string;
  from?: string;
  date?: string;
  className?: string;
  /** Start writing only once the card scrolls into view. */
  whenVisible?: boolean;
  delay?: number;
};

// A decorative example card whose words write themselves in, once.
export function WritingCard({ text, from, date, className, whenVisible = false, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [go, setGo] = useState(!whenVisible);

  useEffect(() => {
    if (!whenVisible) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setGo(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [whenVisible]);

  useEffect(() => {
    if (!go) return;
    let alive = true;
    const t = window.setTimeout(() => {
      ensureGlyphs(`Dear Papa, ${text} ${from ?? ''}`).then(() => alive && setLayout(layoutLetter(text)));
    }, delay);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [go, text, from, delay]);

  return (
    <div ref={ref} className={className} data-writing={layout ? 'done' : 'pending'}>
      {/* Body stays empty until the handwriting face is measured, then writes in. */}
      <LetterCard
        text={layout ? text : ''}
        from={from}
        date={date}
        layout={layout}
        stagger
        label={`예시 편지: ${text}`}
      />
    </div>
  );
}
