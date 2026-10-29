'use client';

import { useEffect, useState, type ComponentProps } from 'react';
import type { LetterBunny as LetterBunnyComponent } from './LetterBunny';
import styles from './LetterBunny.module.css';
import { SODAM_GESTURES } from '@/lib/sodam-gestures';
import { SodamCue } from './SodamCue';

type Props = ComponentProps<typeof LetterBunnyComponent>;
type Bunny = typeof LetterBunnyComponent;

let cached: Bunny | null = null;

function loadBunny(): Promise<Bunny> {
  return import('./LetterBunny').then((mod) => {
    cached = mod.LetterBunny;
    return mod.LetterBunny;
  });
}

function scheduleIdle(run: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  // Tests: kick off the dynamic import immediately (no timer) so fake-timer suites can flush promises.
  if (process.env.VITEST) {
    run();
    return () => {};
  }
  const ric = window.requestIdleCallback?.bind(window);
  if (ric) {
    const id = ric(run, { timeout: 1800 });
    return () => window.cancelIdleCallback?.(id);
  }
  const t = window.setTimeout(run, 1);
  return () => window.clearTimeout(t);
}

/** Lightweight shell that reserves the companion layout until LetterBunny hydrates. */
function LetterBunnyShell({ messageEditor }: Pick<Props, 'messageEditor'>) {
  return (
    <div className={styles.companion} aria-busy="true" data-lazy-bunny-shell="">
      <div className={styles.characterArea} aria-hidden="true">
        <span className={styles.character}>
          <img className={styles.shellPortrait} src={SODAM_GESTURES.invite} width="256" height="256" alt="" />
          <span className={styles.gestureBadge}><SodamCue kind="letter" /></span>
        </span>
      </div>
      <div className={styles.note}>
        <span className={styles.salutation}>Dear Papa,</span>
        {typeof messageEditor === 'function'
          ? messageEditor({ replyTo: () => {}, busy: true })
          : messageEditor ?? <p className={styles.message}>난 아빠가 행복해졌으면 좋겠어</p>}
        <div className={styles.reply} aria-hidden="true"><span className={styles.questionTrigger}><SodamCue kind="conversation" /></span></div>
      </div>
    </div>
  );
}

/** Idle-loads Sodam chat UI so the home chunk does not hydrate LetterBunny on first paint. */
export function LazyLetterBunny(props: Props) {
  const [Comp, setComp] = useState<Bunny | null>(() => cached);

  useEffect(() => {
    if (Comp) return;
    let cancelled = false;
    const stop = scheduleIdle(() => {
      void loadBunny().then((Bunny) => {
        if (!cancelled) setComp(() => Bunny);
      });
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [Comp]);

  if (!Comp) return <LetterBunnyShell messageEditor={props.messageEditor} />;
  return <Comp {...props} />;
}
