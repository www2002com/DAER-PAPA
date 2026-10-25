'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import styles from './LetterBunny.module.css';

const greetings = [
  '말로 하기 쑥스러운 마음, 한 줄이면 충분해요.',
  '반가워요! 오늘 아빠에게 어떤 말을 건네고 싶나요?',
  '“아빠, 늘 고마워요.” 짧아도 마음은 전해져요.',
  '잘 쓰려 애쓰지 않아도 괜찮아요. 내 말투 그대로요.',
];

const writingAdvice = [
  ['그냥 써봐라,', '각 잡지 말고.'],
  ['일단 한 줄.', '내가 봐줄게.'],
  ['고민은 짧게,', '마음은 길게.'],
  ['그 말이면 돼.', '얼른 써봐.'],
];

export function LetterBunny({ messageEditor, onWriteLetter, isWriting = false }: {
  messageEditor?: ReactNode;
  onWriteLetter?: () => void;
  isWriting?: boolean;
}) {
  const [replay, setReplay] = useState(0);
  const [adviceIndex, setAdviceIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayed, setDisplayed] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');
  const panelId = useId();
  const inputId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const controller = useRef<AbortController | null>(null);
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestNumber = useRef(0);
  const history = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const answerRef = useRef('');

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => () => {
    requestNumber.current += 1;
    controller.current?.abort();
    if (revealTimer.current) clearInterval(revealTimer.current);
  }, []);

  function closeQuestion() {
    requestNumber.current += 1;
    controller.current?.abort();
    controller.current = null;
    if (revealTimer.current) clearInterval(revealTimer.current);
    setDisplayed(answerRef.current);
    setSpeaking(false);
    setLoading(false);
    setOpen(false);
    trigger.current?.focus();
  }

  function revealAnswer(text: string) {
    answerRef.current = text;
    setAnswer(text);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text);
      return;
    }
    const characters = Array.from(text);
    let count = 0;
    setSpeaking(true);
    revealTimer.current = setInterval(() => {
      count = Math.min(count + 2, characters.length);
      setDisplayed(characters.slice(0, count).join(''));
      if (count === characters.length) {
        if (revealTimer.current) clearInterval(revealTimer.current);
        revealTimer.current = null;
        setSpeaking(false);
      }
    }, 32);
  }

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = question.trim();
    if (!content || content.length > 300 || controller.current || speaking) return;
    const attempt = ++requestNumber.current;
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 25000);
    const messages = [...history.current, { role: 'user' as const, content }];
    setLoading(true);
    setError('');
    setAnswer('');
    answerRef.current = '';
    setDisplayed('');
    try {
      const response = await fetch('/api/bunny-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }), signal: abort.signal,
      });
      const data = await response.json();
      if (attempt !== requestNumber.current) return;
      if (!response.ok || !data.ok) {
        if (data.error === 'not_configured') throw new Error('지금은 AI 연결을 준비하고 있어요. 잠시 후 다시 찾아 주세요.');
        if (data.error === 'rate_limited') throw new Error('잠깐 쉬었다가 다시 물어봐 주세요.');
        throw new Error('답변을 불러오지 못했어요. 잠시 후 다시 물어봐 주세요.');
      }
      if (typeof data.answer !== 'string' || !data.answer.trim() || data.answer.length > 1200) throw new Error('답변을 불러오지 못했어요. 다시 물어봐 주세요.');
      history.current = [...messages, { role: 'assistant' as const, content: data.answer }].slice(-6);
      setQuestion('');
      revealAnswer(data.answer);
    } catch (failure) {
      if (attempt !== requestNumber.current) return;
      setSpeaking(false);
      const friendly = failure instanceof Error && /^(지금은|잠깐|답변을)/.test(failure.message);
      setError(abort.signal.aborted
        ? '답변이 조금 늦어지고 있어요. 다시 물어봐 주세요.'
        : friendly ? failure.message : '연결이 원활하지 않아요. 잠시 후 다시 물어봐 주세요.');
    } finally {
      clearTimeout(timeout);
      if (attempt === requestNumber.current) {
        controller.current = null;
        setLoading(false);
      }
    }
  }

  const greeting = greetings[replay === 0 ? 0 : 1 + ((replay - 1) % (greetings.length - 1))];
  const nudging = Boolean(onWriteLetter) && !isWriting && !open && !loading && !speaking;
  const advice = isWriting ? ['오, 쓰네.', '기다려 줄게.'] : writingAdvice[adviceIndex];
  const portraitMotion = speaking ? styles.speaking : nudging ? styles.nudge
    : !onWriteLetter && replay > 0 ? (replay % 2 ? styles.replay : styles.replayAgain) : '';

  return (
    <div className={styles.companion}>
      <button type="button" className={styles.character}
        aria-label={onWriteLetter ? (loading ? '생각하고 있어요' : speaking ? '토끼가 말해요' : `${advice.join(' ')} 편지 쓰기`) : '편지 토끼 움직임 다시 보기'}
        title={onWriteLetter ? '눌러서 편지에 한 줄 써보세요' : '눌러서 편지 토끼와 인사해요'}
        data-speaking={speaking} data-nudging={nudging} disabled={loading || speaking}
        onClick={() => { if (onWriteLetter) onWriteLetter(); else setReplay((value) => value + 1); }}>
        <span className={`${styles.patrol} ${nudging ? styles.patrolling : ''}`} data-bunny-patrol=""
          onAnimationIteration={(event) => {
            if (event.target === event.currentTarget && nudging) {
              setAdviceIndex((index) => (index + 1) % writingAdvice.length);
            }
          }}>
        <span className={`${styles.portraitWrap} ${portraitMotion}`}>
        <Image src="/images/letter-bunny-fine-grid-v3.webp"
          width={640} height={640} alt=""
          className={styles.portrait} loading="eager" />
          {speaking && <svg className={styles.voice} viewBox="0 0 24 32" aria-hidden="true"><path d="M4 12q5 4 0 8M11 7q9 9 0 18M18 2q13 14 0 28" /></svg>}
        </span>
        </span>
        <span key={isWriting ? 'writing' : adviceIndex}
          className={`${styles.label} ${onWriteLetter && !loading && !speaking ? `${styles.writePrompt} ${styles.adviceArrive}` : ''}`}>
          {loading ? '생각하고 있어요' : speaking ? '토끼가 말해요' : onWriteLetter
            ? <><span>{advice[0]}</span><span>{advice[1]}</span></>
            : replay ? '다시 인사하기' : '토끼에게 인사하기'}
        </span>
      </button>
      <div className={styles.note}>
        <span className={styles.salutation}>Dear Papa,</span>
        {messageEditor ?? <p className={styles.message}>난 아빠가 행복해졌으면 좋겠어</p>}
        <div className={styles.reply}>
          <p className={styles.greeting}>
            <span key={replay} className={replay > 0 ? styles.answer : undefined} aria-live="polite">{greeting.replace(/\?$/, '')}</span>
            <button ref={trigger} type="button" className={styles.questionTrigger}
              aria-label="토끼에게 질문하기" title="토끼에게 질문하기" aria-expanded={open} aria-controls={panelId}
              onClick={() => { if (open) closeQuestion(); else setOpen(true); }}>
              <span className={!open ? styles.questionPulse : undefined} aria-hidden="true">?</span>
            </button>
          </p>
          {loading && <p className={styles.thinking} role="status">어떤 말을 건넬지 생각하고 있어요<span aria-hidden="true">···</span></p>}
          {answer && <div className={styles.response}>
            <span className={styles.responseLabel}>AI 답변</span>
            <p className={styles.responseText} aria-hidden="true">{displayed}<span className={speaking ? styles.caret : undefined} /></p>
            <p className="sr-only" role="status" aria-atomic="true">{speaking ? '토끼가 답변하고 있어요.' : answer}</p>
          </div>}
        </div>
      </div>
      {open && <form id={panelId} className={styles.questionPanel} onSubmit={ask}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeQuestion(); } }}>
        <div className={styles.panelHeading}>
          <label htmlFor={inputId}>토끼에게 물어볼 말</label>
          <button type="button" className={styles.close} aria-label="질문창 닫기" onClick={closeQuestion}>닫기 <span aria-hidden="true">×</span></button>
        </div>
        <textarea ref={input} id={inputId} value={question} onChange={(event) => setQuestion(event.target.value)}
          placeholder="아빠에게 어떤 마음을 전하고 싶나요?" maxLength={300} rows={2} disabled={loading || speaking}
          aria-describedby={`${inputId}-privacy`} />
        {!history.current.length && <div className={styles.suggestions}>
          {['고마운 마음을 전하고 싶어', '아빠 생신 편지를 도와줘'].map((suggestion) =>
            <button key={suggestion} type="button" disabled={loading || speaking} onClick={() => { setQuestion(suggestion); input.current?.focus(); }}>{suggestion}</button>)}
        </div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.panelActions}>
          <span>{question.length} / 300</span>
          <button type="submit" disabled={!question.trim() || loading || speaking}>{loading ? '답변 기다리는 중' : '물어보기'}<span aria-hidden="true">↗</span></button>
        </div>
        <p id={`${inputId}-privacy`} className={styles.privacy}>여기 입력한 질문과 이어진 대화만 OpenAI에 전송돼요. 이름·연락처 등 개인정보는 적지 마세요. AI 답변은 틀릴 수 있어요.</p>
      </form>}
    </div>
  );
}
