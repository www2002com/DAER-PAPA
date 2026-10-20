'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Motion enhances already-visible server HTML. No hidden/pending CSS state,
// scroll handler, parallax, or animation library is needed.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Enhance the existing Story DOM without changing its protected source.
    document.querySelectorAll<HTMLElement>(
      '#story .container > div:first-child > *, #story .container > div:last-child > div > p, #story .container a',
    ).forEach((element, index) => {
      element.dataset.reveal = element.tagName === 'A' ? 'cue' : 'text';
      element.dataset.revealDelay = String((index % 3) * 50);
    });

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const active = new Set<HTMLElement>();
    let keyboard = false;
    let observer: IntersectionObserver | undefined;

    function finish(element: HTMLElement) {
      element.dataset.motionState = 'done';
      element.style.removeProperty('--motion-delay');
      active.delete(element);
      observer?.unobserve(element);
    }

    function enter(element: HTMLElement) {
      if (element.dataset.motionState === 'done') return;
      observer?.unobserve(element);
      if (reduced.matches || keyboard || element.contains(document.activeElement)) {
        finish(element);
        return;
      }
      const delay = Number(element.dataset.revealDelay ?? 0);
      element.style.setProperty('--motion-delay', `${Math.min(150, Math.max(0, delay || 0))}ms`);
      element.dataset.motionState = 'entering';
      active.add(element);
    }

    if (!reduced.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) enter(entry.target as HTMLElement);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
      elements.forEach((element) => {
        if (element.dataset.motionState !== 'done') observer!.observe(element);
      });
    } else {
      elements.forEach(finish);
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.animationName === 'page-enter' && event.target instanceof HTMLElement) finish(event.target);
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      elements.forEach((element) => {
        if (element.contains(target)) finish(element);
      });
    };
    const onKey = (event: KeyboardEvent) => {
      if (!['Tab', 'Enter', ' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) return;
      keyboard = true;
      document.documentElement.dataset.keyboardMotion = 'off';
      active.forEach(finish);
    };
    const onPointer = () => {
      keyboard = false;
      delete document.documentElement.dataset.keyboardMotion;
    };
    const onPreference = () => {
      if (reduced.matches) {
        observer?.disconnect();
        elements.forEach(finish);
      }
    };

    document.addEventListener('animationend', onEnd);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('wheel', onPointer, { passive: true });
    reduced.addEventListener('change', onPreference);
    return () => {
      observer?.disconnect();
      active.forEach(finish);
      document.removeEventListener('animationend', onEnd);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('wheel', onPointer);
      reduced.removeEventListener('change', onPreference);
      delete document.documentElement.dataset.keyboardMotion;
    };
  }, [pathname]);

  return null;
}
