'use client';

import { useEffect, useRef, useState } from 'react';
import { LetterCard } from './LetterCard';
import { ensureGlyphs, layoutLetter, type Layout, type LetterInput } from './card';
import { readSharedLetter } from './share-link';
import { BunnyPortrait } from '../home/BunnyPortrait';
import { SodamControls } from '../home/SodamControls';
import { useSodamSound } from '../home/useSodamSound';
import { Logo } from '../Logo';
import styles from './ReceivedLetter.module.css';

export function ReceivedLetter() {
  const [letter, setLetter] = useState<LetterInput | null>(null);
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const arrival = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const sound = useSodamSound(opened || !letter, arrival);
  useEffect(() => {
    const read = () => { setLetter(readSharedLetter(window.location.hash)); setOpened(false); setReady(true); setLayout(null); };
    // Site-wide skip/back-to-top anchors must not replace the fragment carrying
    // this letter. Keep normal keyboard focus/navigation without changing its URL.
    const preserveLetterAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href="#main"]') : null;
      if (!anchor) return;
      event.preventDefault();
      const main = document.getElementById('main');
      if (main) { main.tabIndex = -1; main.focus({ preventScroll: true }); main.scrollIntoView({ block: 'start' }); }
    };
    read();
    window.addEventListener('hashchange', read);
    document.addEventListener('click', preserveLetterAnchor);
    return () => { window.removeEventListener('hashchange', read); document.removeEventListener('click', preserveLetterAnchor); };
  }, []);
  useEffect(() => {
    if (!letter) return;
    let active = true;
    ensureGlyphs(`Dear Papa, ${letter.text} ${letter.from}`).then(() => active && setLayout(layoutLetter(letter.text)));
    return () => { active = false; };
  }, [letter]);
  useEffect(() => {
    if (!opened) return;
    title.current?.focus({ preventScroll: true });
    title.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [opened]);

  return <section ref={arrival} className={styles.section} aria-label="도착한 편지">
    <a className={styles.brand} href="/" aria-label="DEAR PAPA 홈으로"><Logo className={styles.brandLogo} /></a>
    {!ready ? <p role="status">편지를 확인하고 있어요.</p> : !letter ? <div className={styles.empty}>
      <h1>편지 링크를 확인해 주세요.</h1>
      <p>링크가 일부만 전달된 것 같아요.<br />보낸 분에게 「편지 링크 복사」로 받은 주소를 다시 보내 달라고 해 주세요.</p>
      <a className="btn" href="/#letter">나도 편지 쓰기</a>
    </div> : !opened ? <div className={styles.arrival}>
      <p className={styles.eyebrow}>DEAR PAPA · A LETTER FOR YOU</p>
      <div className={styles.sticker}>
        <BunnyPortrait pose="welcome" motion={paused ? null : 'welcome'} priority large label="눈웃음으로 봉투를 들고 인사하는 Sodam" />
      </div>
      <SodamControls paused={paused} onPause={() => setPaused(value => !value)} sound={sound.enabled} onSound={sound.toggle} />
      <h1>{letter.from ? `${letter.from}의 편지가 도착했어요.` : '당신에게 도착한 편지예요.'}</h1>
      <p>작은 봉투에 담긴 마음을 열어보세요.</p>
      <button type="button" className={styles.openButton} onClick={() => setOpened(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
        편지 열어보기
      </button>
    </div> : <div className={styles.opened}>
      <p className={styles.eyebrow}>DEAR PAPA · JUST FOR YOU</p>
      <h1 ref={title} tabIndex={-1}>{letter.from ? `${letter.from}의 마음을 전해요.` : '당신을 생각하며 쓴 편지예요.'}</h1>
      <article className={styles.card} aria-label="받은 편지">
        {/* A crafted link can contain valid text that does not fit a card. Keep it readable instead of clipping it. */}
        {layout?.over ? <div className={styles.plainLetter}><p>Dear Papa,</p><p>{letter.text}</p><p>{letter.from}</p><time>{letter.date}</time></div>
          : <LetterCard {...letter} layout={layout} />}
      </article>
      <p className={styles.signature}>보낸 분의 글을 그대로 담았어요.</p>
      <a className={styles.reply} href="/#letter">나도 편지 쓰기 <span aria-hidden="true">↗</span></a>
    </div>}
  </section>;
}
