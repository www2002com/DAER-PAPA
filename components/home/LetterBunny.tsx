'use client';

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { preparedBunnyReply } from '@/lib/bunny-prepared-reply';
import { BunnyPortrait } from './BunnyPortrait';
import { SodamCue } from './SodamCue';
import { SodamControls } from './SodamControls';
import { useSodamSound } from './useSodamSound';
import { companionPose } from '@/lib/sodam-performance';
import { preloadSodamPoses } from '@/lib/sodam-poses';
import styles from './LetterBunny.module.css';

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
  const [motionPaused, setMotionPaused] = useState(false);
  const [danceMode, setDanceMode] = useState(false);
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
  const characterArea = useRef<HTMLDivElement>(null);
  const sound = useSodamSound(supportOnly || isWriting || open || loading || speaking, characterArea);

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
    setError('');
    (questionOpener.current ?? trigger.current)?.focus();
  }

  function toggleQuestion(opener: HTMLButtonElement) {
    preloadSodamPoses();
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

  const nudging = Boolean(onWriteLetter) && !isWriting && !open && !loading && !speaking && !answer && !supportOnly;
  const listening = isWriting || open || loading || speaking || Boolean(answer) || supportOnly || (!onWriteLetter && replay % 2 === 1);
  const pose = companionPose({ supportOnly, error: Boolean(error), loading, speaking, isWriting,
    hasDraft: Boolean(draft?.trim()), open, hasAnswer: Boolean(answer), product: answerAction?.kind === 'product' });
  const motion = motionPaused || supportOnly || isWriting || open || loading || speaking ? null
    : pose === 'welcome' ? (danceMode ? 'dance' : 'welcome') : pose === 'listening' ? 'listen' : null;

  return (
    <div className={styles.companion}>
      <div ref={characterArea} className={styles.characterArea}>
      <button type="button" className={styles.character}
        aria-label={onWriteLetter ? 'Sodam과 편지 쓰기' : 'Sodam 움직임 다시 보기'}
        data-speaking={speaking} data-nudging={nudging} disabled={loading || speaking}
        onClick={() => { preloadSodamPoses(); sound.react(); if (onWriteLetter) onWriteLetter(); else setReplay((value) => value + 1); }}>
        <span className={styles.patrol} data-bunny-patrol="">
          <span className={styles.portraitWrap}>
            <BunnyPortrait pose={pose} motion={motion} replay={replay} />
          </span>
        </span>
        <span className={styles.gestureBadge} aria-hidden="true">
          <SodamCue kind={loading ? 'wait' : listening ? 'heart' : 'letter'} />
        </span>
      </button>
      <SodamControls paused={motionPaused} onPause={() => setMotionPaused(value => !value)}
        dancing={danceMode} onDance={() => { setDanceMode(value => !value); setMotionPaused(false); }}
        sound={sound.enabled} onSound={() => { if (!sound.enabled) setReplay(value => value + 1); sound.toggle(); }}
        quiet={supportOnly || isWriting || open || loading || speaking} />
      </div>
      <div className={styles.note}>
        <span className={styles.salutation}>Dear Papa,</span>
        {typeof messageEditor === 'function'
          ? messageEditor({ replyTo: (content) => { void replyTo(content, true); }, busy: loading })
          : messageEditor ?? <p className={styles.message}>난 아빠가 행복해졌으면 좋겠어</p>}
        <div className={styles.reply}>
          <button ref={trigger} type="button" className={styles.questionTrigger}
            aria-label="Sodam에게 질문하기" aria-expanded={open} aria-controls={panelId}
            onClick={(event) => toggleQuestion(event.currentTarget)}>
            <SodamCue kind="conversation" />
          </button>
          {loading && <span className={styles.thinking} role="status">
            <SodamCue kind="wait" /><span className="sr-only">답변을 준비하고 있어요.</span>
          </span>}
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
