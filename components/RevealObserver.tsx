'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Page-wide motion, so sections can stay server components and only add attributes:
//   [data-reveal]          fades up once it enters the viewport (delay via --reveal-delay)
//   [data-parallax="0.06"] drifts with scroll by that factor while visible
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reveal = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window)) {
      reveal.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    reveal.forEach((el) => io.observe(el));

    if (reduced) return () => io.disconnect();

    // Parallax: only elements currently on screen are updated, once per frame.
    const drifting = new Set<HTMLElement>();
    const pio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) drifting.add(el);
          else drifting.delete(el);
        }
        schedule();
      },
      { rootMargin: '20% 0px' },
    );
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => pio.observe(el));

    let frame = 0;
    const applied = new WeakMap<HTMLElement, number>();
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      drifting.forEach((el) => {
        const factor = Number(el.dataset.parallax) || 0;
        const r = el.getBoundingClientRect();
        // Measure from the untransformed position so the drift never feeds back on itself.
        const center = r.top - (applied.get(el) ?? 0) + r.height / 2;
        const offset = (center - vh / 2) * factor;
        applied.set(el, offset);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      io.disconnect();
      pio.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
