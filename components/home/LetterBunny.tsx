'use client';

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { preparedBunnyReply } from '@/lib/bunny-prepared-reply';
import { BunnyPortrait } from './BunnyPortrait';
import styles from './LetterBunny.module.css';
import '@/lib/pen-font'; // ships the Nanum Pen @font-face only with pen-using routes

const greetings = [
  '말로 하기 쑥스러운 마음, 한 줄이면 충분해요.',
  '반가워요! 오늘 아빠에게 어떤 말을 건네고 싶나요?',
  '“아빠, 늘 고마워요.” 짧아도 마음은 전해져요.',
  '잘 쓰려 애쓰지 않아도 괜찮아요. 내 말투 그대로요.',
];

const writingAdvice = [
  ['일단 써봐라,', '각 잡지 말고.'],
  ['공짜니까,', '어려워 말고', '써봐라.'],
  ['안 사도', '좋으니,', '일단 써봐라.'],
  ['일단 한 줄.', '내가 봐줄게.'],
  ['고민은 짧게,', '마음은 길게.'],
  ['그 말이면 돼.', '얼른 써봐.'],
];

type AnswerAction = { kind: 'letter' | 'product' | 'support'; href: string; label: string; description?: string };
function readAction(value: unknown): AnswerAction | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as AnswerAction;
  if (typeof item.href !== 'string' || typeof item.label !== 'string' || !item.label.trim() || item.label.length > 80) return null;
  if (item.kind === 'letter' && item.href === '/#letter') return { kind: item.kind, href: item.href, label: item.label };
  if (item.kind === 'product' && item.href === '/letter-all-in-one' && typeof item.description === 'string' && item.description.length <= 400) return item;
  if (item.kind === 'support') {
    try {
      const url = new URL(item.href);
      if (url.protocol === 'https:' && !url.username && !url.password) return { kind: item.kind, href: url.href, label: item.label };
    } catch { /* Ignore malformed actions. */ }
  }
  return null;
}

type EditorControls = { replyTo: (content: string) => void; busy: boolean };
export function LetterBunny({ messageEditor, onWriteLetter, isWriting = false, draft, draftComposing = false }: {
  messageEditor?: ReactNode | ((controls: EditorControls) => ReactNode);
  onWriteLetter?: () => void;
  isWriting?: boolean;
  draft?: string;
  draftComposing?: boolean;
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
  const [answerAction, setAnswerAction] = useState<AnswerAction | null>(null);
  const [guidance, setGuidance] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [supportUnavailable, setSupportUnavailable] = useState(false);
  const [supportOnly, setSupportOnly] = useState(false);
  const productShown = useRef(false);
  const panelId = useId();
  const inputId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const questionOpener = useRef<HTMLButtonElement | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const controller = useRef<AbortController | null>(null);
  const revealTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestNumber = useRef(0);
  const history = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const answerRef = useRef('');
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answeredDraft = useRef<string | undefined>(undefined);
  const supportOnlyRef = useRef(false);
  const responseElement = useRef<HTMLDivElement>(null);
  const scrollToReply = useRef(false);

  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => {
    if (answer && !speaking && scrollToReply.current) {
      scrollToReply.current = false;
      responseElement.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }, [answer, speaking]);
  useEffect(() => () => {
    requestNumber.current += 1;
    controller.current?.abort();
    if (revealTimer.current) clearInterval(revealTimer.current);
    if (draftTimer.current) clearTimeout(draftTimer.current);
  }, []);

  function closeQuestion() {
    scrollToReply.current = false;
    requestNumber.current += 1;
    controller.current?.abort();
    controller.current = null;
    if (revealTimer.current) clearInterval(revealTimer.current);
    setDisplayed(answerRef.current);
    setSpeaking(false);
    setLoading(false);
    setOpen(false);
    (questionOpener.current ?? trigger.current)?.focus();
  }

  function toggleQuestion(opener: HTMLButtonElement) {
    if (open) closeQuestion();
    else { questionOpener.current = opener; setOpen(true); }
  }

  const revealAnswer = useCallback((text: string, immediate = false) => {
    if (revealTimer.current) clearInterval(revealTimer.current);
    setSpeaking(false);
    setDisplayed('');
    answerRef.current = text;
    setAnswer(text);
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
  }, []);

  const showPrepared = useCallback((content: string) => {
    const reply = preparedBunnyReply(content, supportOnlyRef.current);
    const serious = reply.mode === 'urgent' || reply.mode === 'referral';
    if (serious) { supportOnlyRef.current = true; setSupportOnly(true); }
    setPrepared(reply.source === 'prepared');
    setGuidance(reply.source === 'guidance');
    setAnswerAction(null);
    setSupportUnavailable(false);
    revealAnswer(reply.answer, serious);
    return reply.answer;
  }, [revealAnswer]);

  useEffect(() => {
    if (draft === undefined || draft === answeredDraft.current) return;
    // Editing cancels an older answer; an unfinished draft never leaves the browser.
    scrollToReply.current = false;
    requestNumber.current += 1;
    controller.current?.abort();
    controller.current = null;
    if (revealTimer.current) clearInterval(revealTimer.current);
    setLoading(false);
    setSpeaking(false);
    setDisplayed(answerRef.current);
    setError('');
    if (!draft.trim()) {
      answeredDraft.current = undefined;
      setAnswer(''); answerRef.current = ''; setDisplayed(''); setAnswerAction(null);
      return;
    }
    if (draftComposing) return;
    draftTimer.current = setTimeout(() => {
      answeredDraft.current = draft;
      showPrepared(draft);
    }, 1400);
    return () => { if (draftTimer.current) clearTimeout(draftTimer.current); };
  }, [draft, draftComposing, showPrepared]);

  async function replyTo(raw: string, fromDraft = false) {
    const content = raw.trim();
    if (!content || content.length > 300 || controller.current) return;
    scrollToReply.current = true;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    if (fromDraft) answeredDraft.current = draft;
    if (revealTimer.current) clearInterval(revealTimer.current);
    setSpeaking(false);
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
    setAnswerAction(null);
    setSupportUnavailable(false);
    try {
      const response = await fetch('/api/bunny-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, ...(supportOnly ? { supportOnly: true } : {}), ...(productShown.current ? { productShown: true } : {}) }), signal: abort.signal,
      });
      const data = await response.json();
      if (attempt !== requestNumber.current) return;
      if (!response.ok || !data.ok) {
        if (data.error === 'not_configured') throw new Error('지금은 Gemini 연결을 준비하고 있어요. 기본 답변을 먼저 드릴게요.');
        if (data.error === 'rate_limited') throw new Error('잠깐 쉬었다가 다시 물어봐 주세요.');
        throw new Error('답변을 불러오지 못했어요. 잠시 후 다시 물어봐 주세요.');
      }
      if (typeof data.answer !== 'string' || !data.answer.trim() || data.answer.length > 1200) throw new Error('답변을 불러오지 못했어요. 다시 물어봐 주세요.');
      history.current = [...messages, { role: 'assistant' as const, content: data.answer }].slice(-6);
      const serious = data.mode === 'urgent' || data.mode === 'referral';
      if (serious) { supportOnlyRef.current = true; setSupportOnly(true); }
      const action = readAction(data.action);
      const allowedAction = action?.kind === 'product' && (serious || supportOnly || productShown.current) ? null : action;
      setAnswerAction(allowedAction);
      if (allowedAction?.kind === 'product') productShown.current = true;
      setGuidance(data.source === 'guidance');
      setPrepared(data.source === 'prepared');
      setSupportUnavailable(serious && data.supportUnavailable === true);
      setQuestion('');
      revealAnswer(data.answer, serious);
    } catch (failure) {
      if (attempt !== requestNumber.current) return;
      const fallbackAnswer = showPrepared(content);
      history.current = [...messages, { role: 'assistant' as const, content: fallbackAnswer }].slice(-6);
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

  function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void replyTo(question);
  }

  const greeting = greetings[replay === 0 ? 0 : 1 + ((replay - 1) % (greetings.length - 1))];
  const nudging = Boolean(onWriteLetter) && !isWriting && !open && !loading && !speaking && !answer && !supportOnly;
  const advice = supportOnly ? ['천천히 해도', '괜찮아.'] : answer ? ['내 답은', '바로 아래.'] : isWriting ? ['오, 쓰네.', '기다려 줄게.'] : writingAdvice[adviceIndex];
  const portraitMotion = speaking ? styles.speaking : nudging ? styles.nudge
    : !onWriteLetter && replay > 0 ? (replay % 2 ? styles.replay : styles.replayAgain) : '';

  return (
    <div className={styles.companion}>
      <div className={styles.invitation}>
        <button type="button" className={styles.inviteCopy}
          aria-label={supportOnly ? '편한 만큼 이야기해 줘.' : '고민돼? 나에게 편하게 털어봐.'}
          aria-expanded={open} aria-controls={panelId}
          onClick={(event) => toggleQuestion(event.currentTarget)}>
          <span>{supportOnly ? '편한 만큼' : '고민돼?'}</span>
          <span>{supportOnly ? '이야기해 줘.' : '나에게 편하게 털어봐.'}</span>
        </button>
        {!supportOnly && <svg className={styles.inviteArrow} viewBox="0 0 140 68" fill="none" aria-hidden="true" focusable="false">
          <path d="M5 28C18 9 44 8 48 25C51 39 33 36 39 21C47 2 79 0 84 18C88 33 70 33 76 18C82 3 113 7 124 22C134 36 127 48 114 59M114 59L116 45M114 59L129 55" />
        </svg>}
      </div>
      <button type="button" className={styles.character}
        aria-label={onWriteLetter ? (loading ? '생각하고 있어요' : speaking ? 'Sodam이 말해요' : `${advice.join(' ')} 편지 쓰기`) : 'Sodam 움직임 다시 보기'}
        title={onWriteLetter ? '눌러서 편지에 한 줄 써보세요' : '눌러서 Sodam과 인사해요'}
        data-speaking={speaking} data-nudging={nudging} disabled={loading || speaking}
        onClick={() => { if (onWriteLetter) onWriteLetter(); else setReplay((value) => value + 1); }}>
        <span className={`${styles.patrol} ${nudging ? styles.patrolling : ''}`} data-bunny-patrol=""
          onAnimationIteration={(event) => {
            if (event.target === event.currentTarget && nudging) {
              setAdviceIndex((index) => (index + 1) % writingAdvice.length);
            }
          }}>
        <span className={`${styles.portraitWrap} ${portraitMotion}`}>
          <BunnyPortrait nudging={nudging} />
          {speaking && <svg className={styles.voice} viewBox="0 0 24 32" aria-hidden="true"><path d="M4 12q5 4 0 8M11 7q9 9 0 18M18 2q13 14 0 28" /></svg>}
        </span>
        </span>
        <span key={isWriting ? 'writing' : adviceIndex}
          className={`${styles.label} ${onWriteLetter && !loading && !speaking ? `${styles.writePrompt} ${styles.adviceArrive}` : ''}`}>
          {loading ? '생각하고 있어요' : speaking ? 'Sodam이 말해요' : onWriteLetter
            ? advice.map((line) => <span key={line}>{line}</span>)
            : replay ? '다시 인사하기' : 'Sodam에게 인사하기'}
        </span>
      </button>
      <div className={styles.note}>
        <span className={styles.salutation}>Dear Papa,</span>
        {typeof messageEditor === 'function'
          ? messageEditor({ replyTo: (content) => { void replyTo(content, true); }, busy: loading })
          : messageEditor ?? <p className={styles.message}>난 아빠가 행복해졌으면 좋겠어</p>}
        <div className={styles.reply}>
          <p className={styles.greeting}>
            <span key={replay} className={replay > 0 ? styles.answer : undefined} aria-live="polite">{supportOnly ? '편한 만큼만 이야기해 주세요.' : answer ? '한 줄 잘 읽었어요. 더 이야기해 볼까요' : greeting.replace(/\?$/, '')}</span>
            <button ref={trigger} type="button" className={styles.questionTrigger}
              aria-label="Sodam에게 질문하기" title="Sodam에게 질문하기" aria-expanded={open} aria-controls={panelId}
              onClick={(event) => toggleQuestion(event.currentTarget)}>
              <span className={!open && !supportOnly ? styles.questionPulse : undefined} aria-hidden="true">?</span>
            </button>
          </p>
          {loading && <p className={styles.thinking} role="status">어떤 말을 건넬지 생각하고 있어요<span aria-hidden="true">···</span></p>}
        </div>
      </div>
      {answer && <div ref={responseElement} className={styles.response}>
            <span className={styles.responseLabel}>{guidance ? '도움 안내' : prepared ? 'Sodam의 기본 답변' : 'AI 답변'}</span>
            <p className={styles.responseText} aria-hidden="true">{displayed}<span className={speaking ? styles.caret : undefined} /></p>
            <p className="sr-only" role="status" aria-atomic="true">{speaking ? 'Sodam이 답변하고 있어요.' : answer}</p>
            {prepared && <p className={styles.helpNote}>미리 준비한 답변이에요. AI가 생성한 답변은 아니에요.</p>}
            {!speaking && answerAction && <div className={styles.answerAction}>
              {answerAction.kind === 'product' && <><span className={styles.responseLabel}>브랜드 제안 · 선택사항</span><p>{answerAction.description}</p></>}
              {answerAction.kind === 'letter' && onWriteLetter
                ? <button type="button" onClick={() => { closeQuestion(); onWriteLetter(); }}>{answerAction.label}<span aria-hidden="true"> ↗</span></button>
                : <a href={answerAction.href} {...(answerAction.kind === 'support' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{answerAction.label}<span aria-hidden="true"> ↗</span></a>}
              {answerAction.kind === 'support' && <p className={styles.helpNote}>새 탭에서 열려요. 이 대화 내용은 전달하지 않아요.</p>}
            </div>}
            {supportUnavailable && <p className={styles.helpNote}>연결할 도움 사이트를 준비 중이에요. 기다리기보다 가까운 전문 상담기관이나 믿을 만한 사람에게 도움을 요청해 주세요.</p>}
      </div>}
      {open && <form id={panelId} className={styles.questionPanel} onSubmit={ask}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeQuestion(); } }}>
        <div className={styles.panelHeading}>
          <label htmlFor={inputId}>Sodam에게 물어볼 말</label>
          <button type="button" className={styles.close} aria-label="질문창 닫기" onClick={closeQuestion}>닫기 <span aria-hidden="true">×</span></button>
        </div>
        <p className={styles.scope}>아빠와의 고민, 여기서 편하게 풀어봐요. DEAR PAPA가 제공하는 무료 AI예요. 전문 상담을 대신하지 않아요.</p>
        <textarea ref={input} id={inputId} value={question} onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
              event.preventDefault(); void replyTo(question);
            }
          }}
          placeholder="아빠에게 어떤 마음을 전하고 싶나요?" maxLength={300} rows={2} disabled={loading || speaking}
          aria-describedby={`${inputId}-privacy`} />
        {!history.current.length && <div className={styles.suggestions}>
          {['아빠와 대화가 자꾸 어긋나', '아빠에게 마음을 전하고 싶어'].map((suggestion) =>
            <button key={suggestion} type="button" disabled={loading || speaking} onClick={() => { setQuestion(suggestion); input.current?.focus(); }}>{suggestion}</button>)}
        </div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.panelActions}>
          <span>{question.length} / 300</span>
          <button type="submit" disabled={!question.trim() || loading || speaking}>{loading ? '답변 기다리는 중' : '물어보기'}<span aria-hidden="true">↗</span></button>
        </div>
        <p id={`${inputId}-privacy`} className={styles.privacy}>AI 답변을 요청하면 여기 입력한 질문과 최근 대화만 Google Gemini에 전송돼요. 이름·연락처 등 개인정보는 적지 마세요. AI 답변은 틀릴 수 있어요. <a href="/privacy">개인정보 처리 안내</a></p>
      </form>}
    </div>
  );
}
