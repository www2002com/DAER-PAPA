import type { CSSProperties } from 'react';
import { sodamPoseSrc, type SodamPose as Pose } from '@/lib/sodam-poses';
import styles from './SodamPose.module.css';

/** Decorative Sodam pose; the surrounding text already says what happened. */
export function SodamPose({ pose, className, size, eager = false }: { pose: Pose; className?: string; size?: number; eager?: boolean }) {
  return (
    <span className={`${styles.figure} ${className ?? ''}`} aria-hidden="true"
      style={size ? { '--sodam-size': `${size}px` } as CSSProperties : undefined}
      data-sodam-pose={pose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.image} src={sodamPoseSrc(pose)} width="384" height="384" alt=""
        draggable={false} decoding="async" loading={eager ? 'eager' : 'lazy'} />
    </span>
  );
}
