'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { INGREDIENT_DEMO } from '@/lib/ingredient-demo';
import styles from './StoryProductReveal.module.css';

export function StoryProductReveal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [animate, setAnimate] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement>(null);

  function close() {
    setOpen(false);
    setPinned(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const restoreFocus = frame.current?.contains(document.activeElement);
      setOpen(false);
      setPinned(false);
      if (restoreFocus) trigger.current?.focus({ preventScroll: true });
    }

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !frame.current?.contains(event.target)) {
        setOpen(false);
        setPinned(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={frame}
      className={styles.frame}
      data-animate={animate}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !pinned && !frame.current?.contains(document.activeElement)) {
          setOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      {children}
      {/* Native details keeps the list usable even before hydration / without JS. */}
      <details className={styles.reveal} open={open} data-nosnippet="">
        <summary
          ref={trigger}
          className={styles.hotspot}
          aria-label="사진 속 제품의 전성분 문자 효과 보기 — 시연용 참고 목록"
          aria-controls="story-ingredients-demo"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches) {
              if (!open) setAnimate(true);
              setOpen(true);
            }
          }}
          onClick={(event) => {
            event.preventDefault();
            if (!open) setAnimate(event.detail !== 0);
            if (pinned) close();
            else {
              setPinned(true);
              setOpen(true);
            }
          }}
        >
          <span className={styles.target} aria-hidden="true" />
          <span className={styles.hint} aria-hidden="true">전성분 <span>＋</span></span>
        </summary>
        <div className={styles.scene}>
          {/* Recreate only the decoration: closed details can defer style updates
              and otherwise retain the previous animation's finished state. */}
          <div key={open ? 'playing' : 'idle'} className={styles.rain} aria-hidden="true">
            {INGREDIENT_DEMO.map((ingredient, index) => (
              <span
                className={styles.stream}
                key={ingredient}
                style={{
                  '--column': `${3 + index * 4.45}%`,
                  '--duration': `${3.4 + (index % 5) * 0.32}s`,
                  '--delay': `${-(index % 7) * 0.32}s`,
                } as CSSProperties}
              >
                {ingredient.replace(/\s/g, '').split('').join('\n')}
                {'\n01\n'}
                {INGREDIENT_DEMO[(index + 7) % INGREDIENT_DEMO.length].replace(/\s/g, '').split('').join('\n')}
              </span>
            ))}
          </div>
          <section
            id="story-ingredients-demo"
            className={styles.panel}
            aria-labelledby="story-ingredients-title"
          >
            <div className={styles.heading}>
              <p className={styles.eyebrow}>DEAR PAPA / INGREDIENTS</p>
              <h3 id="story-ingredients-title">전성분 문자 효과</h3>
              <button
                type="button"
                className={styles.close}
                aria-label="전성분 문자 효과 닫기"
                onClick={() => {
                  close();
                  trigger.current?.focus({ preventScroll: true });
                }}
              >×</button>
            </div>
            <p className={styles.notice}><strong>효과 시연용 참고 목록</strong><br />실제 디어파파 제품의 전성분이 아닙니다.</p>
            <div className={styles.ingredients} tabIndex={0} role="region" aria-label="시연용 참고 성분 22개">
              <ol>
                {INGREDIENT_DEMO.map((ingredient, index) => (
                  <li key={ingredient}>
                    <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.footer}>
              <Link href="/about/facts">공식 제품 정보 <span aria-hidden="true">↗</span></Link>
            </div>
          </section>
        </div>
      </details>
    </div>
  );
}
