'use client';

import { useEffect, useRef, useState } from 'react';
import { SODAM_GESTURES } from '@/lib/sodam-gestures';
import styles from './BunnyPortrait.module.css';

const assets = '/media/sodam-dance-r1';

/** The rendered animation contains the joint motion; never move the whole cutout. */
export function BunnyPortrait({ nudging, pose = 'invite' }: { nudging: boolean; pose?: keyof typeof SODAM_GESTURES }) {
  const picture = useRef<HTMLImageElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotionAllowed(!media.matches && !document.hidden);
    update();
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (picture.current) observer.observe(picture.current);
    return () => observer.disconnect();
  }, []);

  const dancing = pose === 'invite' && nudging && motionAllowed && inView && !failed;
  return <img ref={picture} className={styles.portrait}
    src={dancing ? `${assets}/Sodam-dance-149bpm-r1.webp` : SODAM_GESTURES[pose]}
    width="256" height="256" alt="" aria-hidden="true" draggable={false}
    decoding="async" data-sodam-motion={dancing ? 'dance' : 'still'} data-sodam-pose={pose}
    onError={() => { if (dancing) setFailed(true); }} />;
}
