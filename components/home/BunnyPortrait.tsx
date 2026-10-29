'use client';

import { useEffect, useRef, useState } from 'react';
import { sodamPoseSrc, type SodamPose } from '@/lib/sodam-poses';
import { SODAM_PERFORMANCES, SODAM_LARGE_PERFORMANCES, SODAM_POSTERS, type SodamPerformance } from '@/lib/sodam-performance';
import styles from './BunnyPortrait.module.css';

const replayAssets = new Map<string, Promise<Blob>>();
function replayAsset(src: string) {
  let asset = replayAssets.get(src);
  if (!asset) {
    asset = fetch(src, { cache: 'force-cache' }).then(response => {
      if (!response.ok) throw new Error('Sodam motion unavailable');
      return response.blob();
    }).catch(error => { replayAssets.delete(src); throw error; });
    replayAssets.set(src, asset);
  }
  return asset;
}

/** The rendered animation contains the joint motion; never move the whole cutout. */
export function BunnyPortrait({ pose = 'welcome', motion = null, replay = 0, priority = false, label = '', large = false }: {
  pose?: SodamPose; motion?: SodamPerformance | null; replay?: number; priority?: boolean; label?: string; large?: boolean;
}) {
  const picture = useRef<HTMLImageElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [replaySource, setReplaySource] = useState<{ asset: string; replay: number; url: string } | null>(null);

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
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (picture.current) observer.observe(picture.current);
    return () => observer.disconnect();
  }, [replay]);

  const active = motion && posterReady && motionAllowed && inView && !failed.has(motion) ? motion : null;
  const asset = active ? large && active !== 'dance' ? SODAM_LARGE_PERFORMANCES[active] : SODAM_PERFORMANCES[active] : null;
  useEffect(() => {
    if (!asset || !replay) { setReplaySource(null); return; }
    let cancelled = false;
    let objectUrl: string | undefined;
    // A unique local URL restarts the decoder without downloading a new query URL.
    void replayAsset(asset).then(blob => {
      if (cancelled) return;
      objectUrl = URL.createObjectURL(blob);
      setReplaySource({ asset, replay, url: objectUrl });
    }).catch(() => { /* Keep the ordinary image if an explicit replay cannot be prepared. */ });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [asset, replay]);
  const poster = pose === 'welcome' ? 'welcome' : pose === 'listening' ? 'listen' : null;
  const src = asset ? replaySource?.asset === asset && replaySource.replay === replay ? replaySource.url : asset : poster
    ? SODAM_POSTERS[poster] : sodamPoseSrc(pose);
  return <img key={replay} ref={picture} className={styles.portrait} src={src}
    width="384" height="384" alt={label} aria-hidden={label ? undefined : true} draggable={false}
    fetchPriority={priority && !active ? 'high' : 'auto'} onLoad={() => setPosterReady(true)}
    decoding="async" data-sodam-motion={active ?? 'still'} data-sodam-pose={pose}
    onError={() => { if (active) setFailed(previous => new Set(previous).add(active)); }} />;
}
