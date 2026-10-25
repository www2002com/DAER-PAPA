'use client';

import Image from 'next/image';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { HeroLogo } from './HeroLogo';
import { LetterBunny } from './LetterBunny';
import hero from './Hero.module.css';
import styles from './HeroLetterPreview.module.css';

export function HeroLetterPreview() {
  const [message, setMessage] = useState('난 아빠가 행복해졌으면 좋겠어');
  const [isWriting, setIsWriting] = useState(false);
  const [composing, setComposing] = useState(false);
  const composingRef = useRef(false);
  const hasEdited = useRef(false);
  const editor = useRef<HTMLTextAreaElement>(null);
  const ink = useRef<HTMLDivElement>(null);
  const hintId = useId();

  useLayoutEffect(() => {
    let active = true;
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
    fit();
    void document.fonts?.ready.then(fit);
    document.fonts?.addEventListener('loadingdone', fit);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    if (editor.current?.parentElement) observer?.observe(editor.current.parentElement);
    return () => {
      active = false;
      observer?.disconnect();
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, [message]);

  return <>
    <div className={hero.productStage}>
      <div className={hero.visualTitle}>
        <HeroLogo className={hero.visualLogo} />
        <span>레터 올인원</span>
      </div>
      <div className={styles.scene}>
        <Image className={hero.campaign} src="/images/campaign-blue/letter-gift.webp"
          alt="차분한 블루 레터 올인원 용기·단상자와 편지를 함께 놓은 선물 경험 디자인 시안"
          width={1671} height={941} loading="eager" fetchPriority="high" />
        <svg className={styles.overlay} viewBox="0 0 1671 941" preserveAspectRatio="xMidYMid slice"
          role="img" aria-label={message ? `사진 속 편지: ${message}` : '사진 속 빈 편지'}>
          {/* The whole photo coordinate space preserves the paper's perspective. */}
          <foreignObject width="1671" height="941">
            <div className={styles.paper}>
              <div ref={ink} className={styles.ink} data-letter-preview="">{message}</div>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
    <div className={hero.letterCard}>
      <LetterBunny isWriting={isWriting} draft={hasEdited.current ? message : undefined} draftComposing={composing} onWriteLetter={() => {
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
        <p id={hintId} className={styles.hint}>문장을 바꾸면 위 편지에도 나타나요.<span className={styles.count}>{message.length} / 150</span></p>
        <p className={styles.hint}>잠시 멈추면 토끼가 먼저 답해요. Enter로 질문 · Shift+Enter로 줄바꿈</p>
        <button type="button" className={styles.ask} disabled={!message.trim() || busy || composing}
          onClick={() => replyTo(message)}>{busy ? '답변을 듣는 중' : '답변 듣기'} <span aria-hidden="true">↗</span></button>
        <p className={styles.sendNotice}>질문을 보내면 이 문장과 최근 대화가 OpenAI로 전송될 수 있어요. <a href="/privacy#ai-questions">개인정보 안내</a></p>
      </div>} />
    </div>
  </>;
}
