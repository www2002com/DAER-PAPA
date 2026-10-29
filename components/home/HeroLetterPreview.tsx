'use client';

import Image from 'next/image';
import { type ReactNode, useId, useLayoutEffect, useRef, useState } from 'react';
import { HeroLogo } from './HeroLogo';
import { LazyLetterBunny } from './LazyLetterBunny';
import hero from './Hero.module.css';
import styles from './HeroLetterPreview.module.css';

export function HeroLetterPreview({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('난 아빠가 행복해졌으면 좋겠어');
  const [isWriting, setIsWriting] = useState(false);
  const [composing, setComposing] = useState(false);
  const composingRef = useRef(false);
  const hasEdited = useRef(false);
  const editor = useRef<HTMLTextAreaElement>(null);
  const ink = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const experienceTitleId = useId();

  useLayoutEffect(() => {
    let active = true;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let started = false;

    function fit() {
      if (!active) return;
      const field = editor.current;
      if (field) {
        field.style.height = '0px';
        field.style.height = `${Math.max(44, field.scrollHeight)}px`;
      }
      const text = ink.current;
      if (!text?.clientHeight) return;
      // Fit the actual handwriting font, including newly loaded Korean glyphs.
      // The fixed paper coordinates also keep line breaks identical on mobile.
      let low = 0.5;
      let high = 62;
      text.style.fontSize = `${high}px`;
      if (text.scrollHeight <= text.clientHeight && text.scrollWidth <= text.clientWidth) return;
      for (let step = 0; step < 9; step += 1) {
        const size = (low + high) / 2;
        text.style.fontSize = `${size}px`;
        if (text.scrollHeight <= text.clientHeight && text.scrollWidth <= text.clientWidth) low = size;
        else high = size;
      }
      text.style.fontSize = `${low}px`;
    }

    // Defer the binary-search fit until after first paint / idle so it does not contend with LCP.
    function start() {
      if (!active || started) return;
      started = true;
      fit();
      void document.fonts?.ready.then(fit);
      document.fonts?.addEventListener('loadingdone', fit);
    }

    if (process.env.VITEST) {
      start();
    } else {
      const ric = typeof window !== 'undefined' ? window.requestIdleCallback?.bind(window) : undefined;
      if (ric) idleId = ric(start, { timeout: 1200 });
      else timeoutId = window.setTimeout(start, 1) as unknown as number;
    }

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      if (started) fit();
    }) : null;
    if (editor.current?.parentElement) observer?.observe(editor.current.parentElement);
    return () => {
      active = false;
      observer?.disconnect();
      document.fonts?.removeEventListener('loadingdone', fit);
      if (idleId != null) window.cancelIdleCallback?.(idleId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, [message]);

  return <>
    <div className={`container ${hero.layout}`}>
      {children}
      <figure className={hero.visual} data-reveal="visual" data-reveal-delay="80">
        <div className={hero.productStage}>
          <div className={hero.visualTitle}>
            <HeroLogo className={hero.visualLogo} />
            <span>레터 올인원</span>
          </div>
          <div className={styles.scene}>
            <Image className={hero.campaign} src="/images/campaign-blue/letter-gift.webp"
              alt="차분한 블루 레터 올인원 용기·단상자와 편지를 함께 놓은 선물 경험 디자인 시안"
              width={1671} height={941} preload fetchPriority="high"
              sizes="(max-width: 700px) calc(100vw - 44px), (max-width: 1360px) 50vw, 660px" />
            <svg className={styles.overlay} viewBox="0 0 1671 941" preserveAspectRatio="xMidYMid slice"
              role="img" aria-label={message.trim() ? `사진 속 편지: ${message}, Sodam` : '사진 속 빈 편지'}>
              {/* The whole photo coordinate space preserves the paper's perspective. */}
              <foreignObject width="1671" height="941">
                <div className={styles.paper}>
                  <div ref={ink} className={styles.ink}>
                    <span data-letter-preview="">{message}</span>
                    {message.trim() && <span className={styles.paperSignature} data-letter-signature="">Sodam</span>}
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
        <figcaption className={hero.caption}>
          <span>선물 경험 기획 이미지 · 편지 문구 예시</span>
          <span>용기와 단상자는 개발 중인 디자인 시안입니다.</span>
          <span>최종 판매 구성은 확정 전입니다.</span>
        </figcaption>
      </figure>
    </div>
    <section className={`container ${hero.experience}`} aria-labelledby={experienceTitleId}>
      <h2 id={experienceTitleId} className={hero.experienceTitle}>마음을 담은 한 줄</h2>
      <div className={hero.letterCard}>
        <LazyLetterBunny isWriting={isWriting} draft={hasEdited.current ? message : undefined} draftComposing={composing} onWriteLetter={() => {
          editor.current?.focus();
          if (!hasEdited.current) editor.current?.select();
        }} messageEditor={({ replyTo, busy }) => <div className={styles.editor}>
          <textarea ref={editor} className={styles.input} aria-label="사진 속 편지에 쓸 말"
            aria-describedby={hintId} value={message}
            onFocus={() => setIsWriting(true)} onBlur={() => setIsWriting(false)}
            onChange={(event) => { hasEdited.current = true; setMessage(event.target.value); }}
            onCompositionStart={() => { composingRef.current = true; setComposing(true); }}
            onCompositionEnd={() => { composingRef.current = false; setComposing(false); }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !composingRef.current && event.keyCode !== 229) {
                event.preventDefault(); if (!busy) replyTo(message);
              }
            }}
            maxLength={150} rows={1} placeholder="아빠에게 전하고 싶은 말을 써보세요" spellCheck={false} />
          <p className={styles.signature}>Sodam</p>
          <p id={hintId} className={styles.hint}>문장을 바꾸면 위 편지에도 나타나요.<span className={styles.count}>{message.length} / 150</span></p>
          <p className={styles.hint}>잠시 멈추면 Sodam이 먼저 답해요. Enter로 질문 · Shift+Enter로 줄바꿈</p>
          <button type="button" className={styles.ask} disabled={!message.trim() || busy || composing}
            onClick={() => replyTo(message)}>{busy ? '답변을 듣는 중' : '답변 듣기'} <span aria-hidden="true">↗</span></button>
          <p className={styles.sendNotice}>질문을 보내면 이 문장과 최근 대화가 Google Gemini로 전송될 수 있어요. <a href="/privacy#ai-questions">개인정보 안내</a></p>
        </div>} />
      </div>
    </section>
  </>;
}
