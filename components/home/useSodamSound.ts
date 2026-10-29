'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { SODAM_SOUND } from '@/lib/sodam-performance';

/** Sound is off on every visit. Only a direct button action may start a cue. */
export function useSodamSound(disabled: boolean, area: RefObject<HTMLElement | null>) {
  const [enabled, setEnabled] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const attempt = useRef(0);
  const stop = useCallback(() => {
    attempt.current += 1;
    audio.current?.pause();
    if (audio.current) audio.current.currentTime = 0;
  }, []);

  const play = useCallback(() => {
    if (disabled || document.hidden) return;
    stop();
    const token = attempt.current;
    const cue = audio.current ?? new Audio(SODAM_SOUND);
    audio.current = cue;
    cue.preload = 'none';
    cue.volume = 0.28;
    cue.loop = false;
    void cue.play().catch(() => {
      if (token === attempt.current) setEnabled(false);
    });
  }, [disabled, stop]);

  useEffect(() => {
    if (disabled) stop();
  }, [disabled, stop]);
  useEffect(() => {
    const onVisibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', onVisibility);
    const observer = typeof IntersectionObserver === 'undefined' ? null
      : new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
    if (area.current) observer?.observe(area.current);
    return () => { observer?.disconnect(); document.removeEventListener('visibilitychange', onVisibility); stop(); };
  }, [area, stop]);

  return {
    enabled, stop,
    toggle: () => {
      if (disabled) return;
      if (enabled) { stop(); setEnabled(false); }
      else { setEnabled(true); play(); }
    },
    react: () => { if (enabled) play(); },
  };
}
