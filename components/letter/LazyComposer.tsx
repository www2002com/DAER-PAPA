'use client';

import { useEffect, useRef, useState } from 'react';
import type { Composer as ComposerComponent } from './Composer';

type Comp = typeof ComposerComponent;

let cached: Comp | null = null;

function loadComposer(): Promise<Comp> {
  return import('./Composer').then((mod) => {
    cached = mod.Composer;
    return mod.Composer;
  });
}

function scheduleLoad(run: () => void, root: Element | null): () => void {
  if (typeof window === 'undefined') return () => {};
  if (process.env.VITEST) {
    run();
    return () => {};
  }

  let idleId: number | undefined;
  let timeoutId: number | undefined;
  let observer: IntersectionObserver | undefined;
  let done = false;

  const kick = () => {
    if (done) return;
    done = true;
    observer?.disconnect();
    if (idleId != null) window.cancelIdleCallback?.(idleId);
    if (timeoutId != null) window.clearTimeout(timeoutId);
    run();
  };

  if (root && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) kick();
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(root);
  }

  const ric = window.requestIdleCallback?.bind(window);
  if (ric) idleId = ric(kick, { timeout: 4000 });
  else timeoutId = window.setTimeout(kick, 1200);

  return () => {
    done = true;
    observer?.disconnect();
    if (idleId != null) window.cancelIdleCallback?.(idleId);
    if (timeoutId != null) window.clearTimeout(timeoutId);
  };
}

/** Idle / near-viewport loader for the letter Composer (below-the-fold on home). */
export function LazyComposer() {
  const host = useRef<HTMLDivElement>(null);
  const [Comp, setComp] = useState<Comp | null>(() => cached);

  useEffect(() => {
    if (Comp) return;
    let cancelled = false;
    const stop = scheduleLoad(() => {
      void loadComposer().then((Composer) => {
        if (!cancelled) setComp(() => Composer);
      });
    }, host.current);
    return () => {
      cancelled = true;
      stop();
    };
  }, [Comp]);

  if (!Comp) {
    return (
      <div
        ref={host}
        aria-busy="true"
        data-lazy-composer-shell=""
        style={{ minHeight: 420 }}
      />
    );
  }
  return <Comp />;
}
