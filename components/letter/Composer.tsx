'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { LetterCard } from './LetterCard';
import { LetterShareDialog } from './LetterShareDialog';
import { KakaoHandoff } from './KakaoHandoff';
import { useKakaoSend } from './useKakaoSend';
import { isShareableLetter, tryCreateLetterShareUrl } from './share-link';
import {
  MAX_CHARS,
  MAX_FROM,
  SAMPLE_TEXT,
  ensureGlyphs,
  layoutLetter,
  penLoadFont,
  renderCard,
  toBlob,
  todayStamp,
  type LetterInput,
} from './card';
import {
  MAX_LETTERS,
  cleanFrom,
  cleanText,
  loadDraft,
  loadLetters,
  saveDraft,
  saveLetters,
  type Letter,
} from './storage';
import { STARTERS } from './starters';
import { trackAction } from '@/lib/analytics';
import { composerPose, preloadSodamPoses, type SodamPose as Pose } from '@/lib/sodam-poses';
import { SodamPose } from '@/components/SodamPose';
import styles from './Composer.module.css';

/** Helper line under the letter label; always visible (not tied to launch-notify). */
export const LETTER_REASSURE = '잘 쓰지 않아도 괜찮아요. 아빠는 문장보다 마음을 먼저 읽어요.';

type View = 'write' | 'box';
type Toast = { id: number; msg: string; action?: { label: string; run: () => void }; pose?: Pose };
type Busy = 'idle' | 'busy' | 'done';

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Stable per-character keys: only characters that are actually new get a new key (and ink in). */
function useCharKeys(composing: React.RefObject<boolean>) {
  const ref = useRef({ text: '', keys: [] as string[], seq: 0 });
  const keysFor = useCallback(
    (text: string) => {
      const k = ref.current;
      if (k.text === text) return k.keys;
      const prev = k.text;
      let p = 0;
      while (p < prev.length && p < text.length && prev[p] === text[p]) p++;
      let s = 0;
      while (s < prev.length - p && s < text.length - p && prev[prev.length - 1 - s] === text[text.length - 1 - s]) s++;
      const mid = text.length - p - s;
      const keys = k.keys.slice(0, p);
      if (mid === 1 && prev.length - p - s === 1 && composing.current) {
        keys.push(k.keys[p]); // a syllable being composed keeps its ink
      } else {
        for (let i = 0; i < mid; i++) keys.push(`k${++k.seq}`);
      }
      keys.push(...k.keys.slice(prev.length - s));
      k.text = text;
      k.keys = keys;
      return keys;
    },
    [composing],
  );
  const reset = useCallback((text: string, prefix: string) => {
    ref.current = { text, keys: Array.from(text, (_, i) => `${prefix}${i}`), seq: ref.current.seq };
  }, []);
  return { keysFor, reset };
}

/** notifyReady comes from the server-side launchNotifyReady() check; the client never sees credentials. */
export function Composer({ notifyReady = false }: { notifyReady?: boolean } = {}) {
  const uid = useId();
  const [mounted, setMounted] = useState(false);
  const [fontVersion, setFontVersion] = useState(0);
  const [view, setView] = useState<View>('write');
  const [text, setText] = useState('');
  const [from, setFrom] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const [saved, setSaved] = useState<'none' | 'saved' | 'error'>('none');
  const [warn, setWarn] = useState<'empty' | 'over' | 'storage' | 'full' | null>(null);
  const [flip, setFlip] = useState(false);
  const [download, setDownload] = useState<Busy>('idle');
  const [bridge, setBridge] = useState<'export' | 'share' | 'archive' | null>(null);
  const [greeted, setGreeted] = useState(false);
  const [handoffLetter, setHandoffLetter] = useState<LetterInput | null>(null);
  // Load the Kakao SDK as soon as the visitor starts, so the share tap can open KakaoTalk directly.
  const kakao = useKakaoSend(greeted || !!text.trim());
  const resetKakao = kakao.reset;
  const handoffUrl = (handoffLetter && tryCreateLetterShareUrl(handoffLetter)) || '';
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    resetKakao();
    setHandoffLetter(null);
  }, [text, from, resetKakao]);
  const [shareLetter, setShareLetter] = useState<LetterInput | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [tab, setTab] = useState<(typeof STARTERS)[number]['id']>('examples');
  const [inserting, setInserting] = useState(false);
  const [stagger, setStagger] = useState(false);
  const [bump, setBump] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const composing = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const downloadResetTimer = useRef<number | null>(null);
  const downloadBusyRef = useRef(false);
  const started = useRef(false);
  const { keysFor, reset } = useCharKeys(composing);

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = window.setTimeout(fn, ms);
    timers.current.push(timer);
    return timer;
  }, []);

  // ── Restore draft and archive ───────────────────────────────
  useEffect(() => {
    const draft = loadDraft();
    const list = loadLetters();
    setLetters(list);
    if (draft && (draft.text || draft.from)) {
      setText(draft.text);
      setFrom(draft.from);
      setEditingId(draft.editingId && list.some((l) => l.id === draft.editingId) ? draft.editingId : null);
      reset(draft.text, 'd');
      setStagger(true);
      later(() => setStagger(false), 2000);
      if (draft.text) showToast('쓰던 편지를 이어서 쓸 수 있어요.', undefined, 'welcome');
    }
    setMounted(true);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Commit the small local draft before navigation or paint can leave this render.
  // Wait for restoration so the empty server render never overwrites a saved letter.
  useLayoutEffect(() => {
    if (!mounted) return;
    setSaved(saveDraft({ text, from, editingId }) ? 'saved' : 'error');
  }, [text, from, editingId, mounted]);

  // ── Load the handwriting glyphs this letter needs, then re-measure ──
  useEffect(() => {
    if (!mounted || !document.fonts) return;
    const font = penLoadFont();
    const sample = `Dear Papa, ${text || SAMPLE_TEXT} ${from} ${letters.map((l) => l.text).join('')}`;
    let loaded = false;
    try {
      loaded = document.fonts.check(font, sample);
    } catch {
      /* treat as not loaded */
    }
    if (loaded) return;
    let alive = true;
    ensureGlyphs(sample, font).then(() => alive && setFontVersion((v) => v + 1));
    return () => {
      alive = false;
    };
  }, [mounted, text, from, letters]);

  // ── Textarea grows with the letter ──────────────────────────
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text, view, mounted]);

  // ── Derived card content ────────────────────────────────────
  const selected = letters.find((l) => l.id === selectedId) ?? letters[0] ?? null;
  const showingSaved = view === 'box' && !!selected;
  const isSample = !showingSaved && !text.trim();
  const cardText = showingSaved ? selected!.text : isSample ? SAMPLE_TEXT : text;
  const cardFrom = showingSaved ? selected!.from : from;
  // Today's date only after mount: the static HTML is built on a different day than it is read.
  const cardDate = showingSaved ? selected!.date : mounted ? todayStamp() : '';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layout = useMemo(() => (mounted ? layoutLetter(cardText) : null), [cardText, mounted, fontVersion]);
  const draftLayout = useMemo(
    () => (mounted && text.trim() ? layoutLetter(text) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, mounted, fontVersion],
  );
  const over = !!draftLayout?.over;
  const textTooLong = text.length > MAX_CHARS;
  const fromTooLong = from.length > MAX_FROM;
  const shareTooLong = textTooLong || fromTooLong;
  const charKeys = showingSaved
    ? Array.from(cardText, (_, i) => `a${selected!.id}-${i}`)
    : isSample
      ? Array.from(cardText, (_, i) => `s${i}`)
      : keysFor(text);

  useEffect(() => {
    if (warn === 'over' && !over) setWarn(null);
    if (warn === 'empty' && text.trim()) setWarn(null);
    if (warn === 'full' && letters.length < MAX_LETTERS) setWarn(null);
  }, [over, text, warn, letters.length]);

  // ── Helpers ─────────────────────────────────────────────────
  function showToast(msg: string, action?: Toast['action'], pose?: Pose) {
    const id = Date.now() + Math.random();
    setToast({ id, msg, action, pose });
    later(() => setToast((t) => (t && t.id === id ? null : t)), action ? 6500 : 3200);
  }

  const focusText = (end = true) => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    if (end) el.setSelectionRange(el.value.length, el.value.length);
  };

  function startWriting() {
    setView('write');
    window.requestAnimationFrame(() => {
      textareaRef.current?.scrollIntoView({
        behavior: prefersReduced() ? 'instant' : 'smooth',
        block: 'center',
      });
      focusText();
    });
  }

  // A link to /#letter is the primary entry point. Keep the anchor's native
  // navigation fallback, then focus the composer once the hash target arrives.
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash !== '#letter') return;
      startWriting();
    };
    const openFromCurrentHashEntry = (event: MouseEvent) => {
      if (window.location.hash !== '#letter' || event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element) || !event.target.closest('[data-letter-entry]')) return;
      startWriting();
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    document.addEventListener('click', openFromCurrentHashEntry);
    return () => {
      window.removeEventListener('hashchange', openFromHash);
      document.removeEventListener('click', openFromCurrentHashEntry);
    };
    // startWriting only closes over stable refs/setters; the listener must be installed once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function guard(): boolean {
    if (!text.trim()) {
      setWarn('empty');
      focusText();
      return false;
    }
    if (over) {
      setWarn('over');
      focusText();
      return false;
    }
    return true;
  }

  // ── Editing ─────────────────────────────────────────────────
  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackAction('letter_started');
  }

  function onText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    if (v.trim()) markStarted();
    setText(composing.current ? v.replace(/\r/g, '') : cleanText(v));
  }

  function insertLine(line: string) {
    if (inserting) return;
    markStarted();
    const before = text;
    const base = text.replace(/\s+$/, '');
    const prefix = base ? `${base}\n` : '';
    const target = cleanText(prefix + line);
    const done = () => {
      setInserting(false);
      focusText();
      showToast('문장을 넣었어요.', { label: '되돌리기', run: () => setText(before) }, 'writing');
    };
    if (prefersReduced()) {
      setText(target);
      done();
      return;
    }
    setInserting(true);
    let i = prefix.length;
    const step = () => {
      i = Math.min(target.length, i + 1);
      setText(target.slice(0, i));
      if (i < target.length) later(step, 26);
      else later(done, 120);
    };
    step();
  }

  function clearLetter() {
    if (!text && !from) return;
    const snap = { text, from, editingId };
    setText('');
    setFrom('');
    setEditingId(null);
    setWarn(null);
    showToast('편지를 지웠어요.', {
      label: '되돌리기',
      run: () => {
        setText(snap.text);
        setFrom(snap.from);
        setEditingId(snap.editingId);
      },
    }, 'rest');
  }

  function startNew() {
    setEditingId(null);
    setText('');
    setFrom('');
    setView('write');
    later(() => focusText(), 50);
  }

  // ── Archive ─────────────────────────────────────────────────
  function keep() {
    if (!guard()) return;
    const updating = !!editingId && letters.some((l) => l.id === editingId);
    if (letters.length > MAX_LETTERS || (!updating && letters.length >= MAX_LETTERS)) {
      setWarn('full');
      return;
    }
    const date = todayStamp();
    const t = text.trim();
    const f = from.trim();
    let next: Letter[];
    let note = '보관함에 담았어요.';
    if (editingId && letters.some((l) => l.id === editingId)) {
      next = [{ id: editingId, date, text: t, from: f }, ...letters.filter((l) => l.id !== editingId)];
      note = '보관함의 편지를 고쳐 담았어요.';
    } else {
      const id = Math.max(Date.now(), ...letters.map((l) => l.id + 1));
      next = [{ id, date, text: t, from: f }, ...letters];
      setEditingId(id);
    }
    if (!saveLetters(next)) {
      setWarn('storage');
      return;
    }
    setLetters(next);
    setBump((b) => b + 1);
    setFlip(true);
    later(() => setFlip(false), 1700);
    showToast(note, undefined, 'thanks');
  }

  function continueLetter(l: Letter) {
    setText(l.text);
    setFrom(l.from);
    setEditingId(l.id);
    reset(l.text, `e${l.id}-`);
    setStagger(true);
    later(() => setStagger(false), 2000);
    setView('write');
    later(() => focusText(), 60);
    showToast('보관함에서 불러왔어요.', undefined, 'writing');
  }

  function removeLetter(l: Letter) {
    const idx = letters.findIndex((x) => x.id === l.id);
    const next = letters.filter((x) => x.id !== l.id);
    if (!saveLetters(next)) {
      setWarn('storage');
      return;
    }
    setLetters(next);
    if (editingId === l.id) setEditingId(null);
    showToast('편지를 지웠어요.', {
      label: '되돌리기',
      run: () => {
        setLetters((cur) => {
          const restored = [...cur];
          restored.splice(Math.min(idx, restored.length), 0, l);
          saveLetters(restored);
          return restored;
        });
      },
    }, 'rest');
  }

  function selectLetter(l: Letter) {
    setSelectedId(l.id);
    setStagger(true);
    later(() => setStagger(false), 1800);
  }

  function switchView(event: KeyboardEvent<HTMLButtonElement>, current: View) {
    const next = event.key === 'Home' ? 'write' : event.key === 'End' ? 'box'
      : ['ArrowLeft', 'ArrowRight'].includes(event.key) ? (current === 'write' ? 'box' : 'write') : null;
    if (!next) return;
    event.preventDefault();
    setView(next);
    document.getElementById(`${uid}-v-${next}`)?.focus();
  }

  // ── Image ───────────────────────────────────────────────────
  async function makeBlob(l: { text: string; from: string; date: string }) {
    const canvas = await renderCard(l);
    if (!canvas) return null;
    return toBlob(canvas);
  }

  function saveBlob(blob: Blob, date: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dear-papa-letter-${date.replace(/\./g, '')}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    later(() => URL.revokeObjectURL(url), 4000);
  }

  async function downloadImage(l?: Letter) {
    if (downloadBusyRef.current || download === 'busy') return;
    if (!l && !guard()) return;
    downloadBusyRef.current = true;
    const data = l ?? { text: text.trim(), from: from.trim(), date: todayStamp() };
    setDownload('busy');
    try {
      const blob = await makeBlob(data);
      if (!blob) {
        setDownload('idle');
        setWarn('over');
        return;
      }
      saveBlob(blob, data.date);
      trackAction('letter_card_exported');
      setBridge(l ? 'archive' : 'export');
      setDownload('done');
      showToast('카드 이미지를 만들었어요. 다운로드를 확인해 주세요.', undefined, 'smallWin');
      if (downloadResetTimer.current !== null) window.clearTimeout(downloadResetTimer.current);
      downloadResetTimer.current = later(() => {
        downloadResetTimer.current = null;
        setDownload(previous => previous === 'done' ? 'idle' : previous);
      }, 2200);
    } catch {
      setDownload('idle');
      showToast('이미지를 만들 수 없었어요. 잠시 후 다시 시도해 주세요.', undefined, 'oops');
    } finally {
      downloadBusyRef.current = false;
    }
  }

  const currentLetter = (): LetterInput => ({ text: text.trim(), from: from.trim(), date: todayStamp() });

  /** One tap: hand the letter straight to KakaoTalk once the SDK is ready; otherwise show every way to send it. */
  /** Share needs the same letter the recipient link accepts; the card-fit guard alone is not that. */
  function shareable(): LetterInput | null {
    if (shareTooLong) {
      if (textTooLong) focusText();
      else fromRef.current?.focus({ preventScroll: true });
      return null;
    }
    if (inserting || !guard()) return null;
    const letter = currentLetter();
    if (!isShareableLetter(letter)) { setWarn('over'); focusText(); return null; }
    return letter;
  }

  function shareKakao() {
    if (kakao.handoff === 'opening') return;
    const letter = shareable();
    if (!letter) return;
    if (kakao.sdk === 'ready') {
      setHandoffLetter(letter);
      if (kakao.send(letter)) setBridge('share');
    } else {
      setShareLetter(letter);
    }
  }

  function share() {
    const letter = shareable();
    if (letter) setShareLetter(letter);
  }

  // ── Gentle tilt on fine pointers ────────────────────────────
  function onTilt(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || prefersReduced()) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 4).toFixed(2)}deg`);
  }
  function endTilt() {
    stageRef.current?.style.setProperty('--ry', '0deg');
    stageRef.current?.style.setProperty('--rx', '0deg');
  }

  // ── Render ──────────────────────────────────────────────────
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = `${uid}-starters`;
  const countId = `${uid}-count`;
  const warnId = `${uid}-warn`;
  const reassureId = `${uid}-reassure`;
  const activeStarters = STARTERS.find((s) => s.id === tab)!;
  const near = text.length >= MAX_CHARS * 0.9;
  const full = text.length >= MAX_CHARS;

  const warnText =
    shareTooLong
      ? `원문을 자르지 않았어요. 공유하려면 편지 내용을 ${MAX_CHARS}자, 보내는 사람을 ${MAX_FROM}자 이내로 직접 줄여 주세요.`
      : warn === 'empty'
      ? '아빠에게 전할 말을 한 줄 써 주세요.'
      : warn === 'over'
        ? '카드에 다 담기지 않아요. 문장이나 줄바꿈을 조금 줄여 주세요.'
        : warn === 'full'
          ? '보관함이 가득 찼어요. 기존 편지를 이미지로 저장한 뒤 직접 정리하거나, 지금 쓴 편지를 이미지로 저장해 주세요.'
        : warn === 'storage'
          ? '이 브라우저에 저장하지 못했어요. 저장 공간이나 브라우저 설정을 확인해 주세요.'
          : over
            ? '카드에 다 담기지 않아요. 조금만 줄여 주세요.'
            : '';

  const savedLabel =
    saved === 'saved'
        ? '이 기기에 자동 저장됨'
        : saved === 'error'
          ? '자동 저장을 할 수 없어요. 카드 이미지로 저장해 주세요.'
          : '쓰는 동안 이 기기에 자동 저장돼요';

  const sodamPose = composerPose({
    view,
    greeted,
    focused,
    hasText: !!text.trim(),
    problem: warn !== null || over || shareTooLong || saved === 'error',
    exporting: download === 'busy',
    delivered: !!bridge,
    archiveEmpty: letters.length === 0,
  });

  return (
    <>
    <div className={styles.entry} data-reveal="soft-cue" data-reveal-delay="150">
      <button type="button" className="btn" onClick={startWriting} aria-controls={`${uid}-p-write`} data-track-action="letter_entry_clicked">
        아빠에게 편지 쓰기
      </button>
      <p>편지는 지금 쓸 수 있어요. 가입 없이, 이 기기에만.</p>
    </div>
    <div className={styles.composer} data-view={view} onFocusCapture={preloadSodamPoses} onPointerDownCapture={preloadSodamPoses}>
      {/* Card stage */}
      <div className={styles.stageCol} data-reveal="visual">
        <div className={styles.stageSticky}>
          <div
            ref={stageRef}
            className={styles.stage}
            onPointerMove={onTilt}
            onPointerLeave={endTilt}
            data-done={download === 'done' || undefined}
          >
            <LetterCard
              className={styles.card}
              text={cardText}
              from={cardFrom}
              date={cardDate}
              layout={layout}
              charKeys={charKeys}
              stagger={stagger}
              caret={focused && view === 'write' && !isSample}
              placeholder={isSample}
              flipped={flip}
              backNote="보관했어요"
              label={
                isSample
                  ? `예시 카드: Dear Papa, ${SAMPLE_TEXT}`
                  : `편지 카드 미리보기: Dear Papa, ${cardText}${cardFrom.trim() ? ` — ${cardFrom.trim()}` : ''}`
              }
            />
            <span className={styles.sheen} aria-hidden="true" />
          </div>
          <div className={styles.stageFoot}>
            {!(view === 'box' && letters.length === 0) && <SodamPose pose={sodamPose} className={styles.sodam} />}
            <p className={styles.stageNote} aria-live="polite">
              {showingSaved
                ? `${selected!.date}에 보관한 편지`
                : isSample
                  ? '예시 문장이에요. 직접 써 보세요.'
                  : '지금 미리보기와 PNG 저장을 할 수 있어요. 제품에 담는 방식은 출시 전에 정해요.'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.panel} data-reveal>
        <div className={styles.switch} role="tablist" aria-label="편지 쓰기와 보관함">
          <button
            type="button"
            role="tab"
            id={`${uid}-v-write`}
            aria-selected={view === 'write'}
            aria-controls={`${uid}-p-write`}
            tabIndex={view === 'write' ? 0 : -1}
            onClick={() => setView('write')}
            onKeyDown={(event) => switchView(event, 'write')}
          >
            편지 쓰기
          </button>
          <button
            type="button"
            role="tab"
            id={`${uid}-v-box`}
            aria-selected={view === 'box'}
            aria-controls={`${uid}-p-box`}
            tabIndex={view === 'box' ? 0 : -1}
            onClick={() => setView('box')}
            onKeyDown={(event) => switchView(event, 'box')}
          >
            보관함
            <span key={bump} className={styles.badge} data-bump={bump > 0 || undefined}>
              {letters.length}
            </span>
          </button>
          <span className={styles.switchThumb} aria-hidden="true" />
        </div>

        {/* Write view */}
        <div
          id={`${uid}-p-write`}
          role="tabpanel"
          aria-labelledby={`${uid}-v-write`}
          hidden={view !== 'write'}
          className={styles.write}
        >
          {editingId && (
            <p className={styles.editing}>
              보관함의 편지를 고치고 있어요.
              <button type="button" onClick={startNew}>
                새 편지 쓰기
              </button>
            </p>
          )}

          <div className={styles.starters}>
            <div className={styles.startersHead}>
              <span className={styles.label}>시작 문장</span>
              <div role="tablist" aria-label="시작 문장 종류" className={styles.cats}>
                {STARTERS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    id={tabId(s.id)}
                    aria-selected={tab === s.id}
                    aria-controls={panelId}
                    tabIndex={tab === s.id ? 0 : -1}
                    onClick={() => setTab(s.id)}
                    onKeyDown={(e) => {
                      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                      const i = STARTERS.findIndex((x) => x.id === tab);
                      const n = STARTERS[(i + (e.key === 'ArrowRight' ? 1 : STARTERS.length - 1)) % STARTERS.length];
                      setTab(n.id);
                      document.getElementById(tabId(n.id))?.focus();
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div id={panelId} role="tabpanel" aria-labelledby={tabId(tab)} className={styles.chips} key={tab}>
              {activeStarters.lines.map((line, i) => (
                <button
                  key={line}
                  type="button"
                  className={styles.chip}
                  style={{ animationDelay: `${i * 45}ms` }}
                  onClick={() => insertLine(line)}
                  disabled={inserting}
                >
                  {line}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${uid}-text`} className={styles.label}>
              편지 내용
            </label>
            <p id={reassureId} className={styles.reassure}>
              {LETTER_REASSURE}
            </p>
            <textarea
              id={`${uid}-text`}
              ref={textareaRef}
              className={`pen ${styles.textarea}`}
              value={text}
              rows={3}
              placeholder={SAMPLE_TEXT}
              readOnly={inserting}
              onChange={onText}
              onCompositionStart={() => (composing.current = true)}
              onCompositionEnd={(e) => {
                composing.current = false;
                setText(cleanText(e.currentTarget.value));
              }}
              onFocus={() => { setFocused(true); setGreeted(true); }}
              onBlur={() => setFocused(false)}
              aria-describedby={`${reassureId} ${countId} ${warnId}`}
              aria-invalid={over || textTooLong || warn === 'empty' || undefined}
              spellCheck={false}
            />
            <div className={styles.meta}>
              <span className={styles.saved} data-state={saved} role="status" aria-live="polite">
                <span className={styles.savedDot} aria-hidden="true" />
                {savedLabel}
              </span>
              <span
                id={countId}
                className={styles.count}
                data-near={near || undefined}
                data-full={full || undefined}
                aria-label={`${text.length}자, 최대 ${MAX_CHARS}자`}
              >
                {text.length} / {MAX_CHARS}
              </span>
            </div>
            <p id={warnId} className={styles.warn} aria-live="polite">
              {warnText}
              {warn === 'full' && <button type="button" className={styles.textBtn} onClick={() => setView('box')}>보관함 보기</button>}
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${uid}-from`} className={styles.label}>
              보내는 사람 <span className={styles.optional}>선택</span>
            </label>
            <input
              id={`${uid}-from`}
              ref={fromRef}
              className={`pen ${styles.input}`}
              value={from}
              placeholder="이름이나 애칭"
              autoComplete="off"
              onChange={(e) => setFrom(cleanFrom(e.target.value))}
              aria-describedby={warnId}
              aria-invalid={fromTooLong || undefined}
            />
          </div>

          <div className={styles.actions}>
            <button ref={shareButtonRef} type="button" className={styles.shareButton} onClick={shareKakao} data-kakao={kakao.sdk}
              aria-busy={kakao.handoff === 'opening' || undefined}>
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.5 2 10.8c0 2.8 1.9 5.3 4.7 6.7l-.9 3.3c-.1.3.2.5.5.3l4-2.6 1.7.1c5.5 0 10-3.5 10-7.8S17.5 3 12 3Z"/></svg>
              <span><strong>카카오톡으로 편지 보내기</strong><small>{kakao.sdk === 'loading' && (greeted || text.trim()) ? '카카오톡 연결을 준비하고 있어요' : '받을 분을 고르면 편지가 링크로 전해져요'}</small></span>
              <span className={styles.shareArrow} aria-hidden="true">↗</span>
            </button>
            {/* Always mounted so the status line exists before its first message; screen readers announce changes only. */}
            <div className={styles.handoff} data-idle={kakao.handoff === 'idle' || undefined}>
              <KakaoHandoff sdk={kakao.sdk} handoff={kakao.handoff} route={kakao.route} shareUrl={handoffUrl} showUnavailable={false}
                onSendAgain={() => { if (handoffLetter && guard()) kakao.send(handoffLetter); }}
                onSendWeb={() => { if (handoffLetter && guard()) kakao.send(handoffLetter, { web: true }); }}
                onReconnect={kakao.retry}
                onDismiss={() => { kakao.reset(); shareButtonRef.current?.focus({ preventScroll: true }); }} />
            </div>
            <p className={styles.sharePrivacy}>편지와 이름이 링크에 담겨요. 링크를 받은 사람은 누구나 읽을 수 있어요.</p>
            <button type="button" className={styles.otherShare} onClick={share}>
              다른 방법으로 보내기 <span aria-hidden="true">·</span> Instagram <span aria-hidden="true">·</span> 링크 복사
            </button>
            <button
              type="button"
              className={`btn btn--ghost ${styles.primary}`}
              onClick={() => downloadImage()}
              aria-busy={download === 'busy'}
              data-state={download}
            >
              <span className={styles.btnIcon} aria-hidden="true">
                {download === 'done' ? (
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path d="M3 8.5l3.2 3L13 4.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                ) : download === 'busy' ? (
                  <span className={styles.spinner} />
                ) : (
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <path
                      d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                )}
              </span>
              {download === 'busy' ? '카드를 만드는 중…' : download === 'done' ? '다운로드 준비됨' : '카드 이미지 저장'}
            </button>
            <button type="button" className={`btn btn--ghost ${styles.secondary}`} onClick={keep}>
              {editingId ? '보관함에 다시 담기' : '보관함에 담기'}
            </button>
            <div className={styles.textBtns}>
              <button type="button" className={styles.textBtn} onClick={clearLetter} disabled={!text && !from}>
                지우기
              </button>
            </div>
          </div>
        </div>

        {/* Archive view */}
        <div
          id={`${uid}-p-box`}
          role="tabpanel"
          aria-labelledby={`${uid}-v-box`}
          hidden={view !== 'box'}
          className={styles.box}
        >
          {letters.length === 0 ? (
            <div className={styles.empty}>
              <SodamPose pose="rest" size={152} />
              <p className={`pen ${styles.emptyPen}`}>아직 보관한 편지가 없어요.</p>
              <p>쓴 편지를 보관함에 담아 두면, 이 기기에서 언제든 다시 꺼내 볼 수 있어요.</p>
              <button type="button" className="btn" onClick={startNew}>
                첫 편지 쓰기
              </button>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {letters.map((l) => (
                  <li key={l.id} className={styles.item} data-active={selected?.id === l.id || undefined}>
                    <button
                      type="button"
                      className={styles.itemMain}
                      onClick={() => selectLetter(l)}
                      aria-pressed={selected?.id === l.id}
                    >
                      <span className={`pen ${styles.itemText}`}>{l.text}</span>
                      <span className={styles.itemMeta}>
                        <time>{l.date}</time>
                        {l.from && <span>— {l.from}</span>}
                      </span>
                    </button>
                    <div className={styles.itemActions}>
                      <button type="button" onClick={() => continueLetter(l)}>
                        이어 쓰기
                      </button>
                      <button type="button" onClick={() => downloadImage(l)}>
                        이미지 저장
                      </button>
                      <button type="button" onClick={() => removeLetter(l)} aria-label={`${l.date} 편지 지우기`}>
                        지우기
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" className={styles.newBtn} onClick={startNew}>
                <span aria-hidden="true">+</span> 새 편지 쓰기
              </button>
            </>
          )}
          <p className={styles.boxNote}>
            보관함은 이 기기의 브라우저에만 저장돼요. 브라우저 기록을 지우면 함께 사라지니, 소중한 편지는 이미지로도
            저장해 두세요. (최대 {MAX_LETTERS}통)
          </p>
        </div>
      </div>

      {bridge && (
        <aside className={styles.productFollowup} aria-label="디어파파 제품 알아보기">
          <p>편지에 담은 마음, 아빠의 매일에도.</p>
          <p>디어파파는 아빠를 위한 올인원 스킨케어를 준비하고 있어요.</p>
          <a href="/letter-all-in-one" onClick={() => trackAction('product_details_after_letter_clicked', { source: bridge })}>
            레터 올인원 준비 내용 보기
          </a>
          {notifyReady && (
            <a href="/#launch-notify" onClick={() => trackAction('launch_notify_after_letter_clicked')}>
              출시 소식 받기
            </a>
          )}
        </aside>
      )}

      {shareLetter && <LetterShareDialog letter={shareLetter} onClose={() => setShareLetter(null)}
        onShareAction={() => setBridge('share')} />}
      <div className={styles.toastWrap} role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className={styles.toast} data-sodam={toast.pose ? '' : undefined}>
            {toast.pose && <SodamPose pose={toast.pose} eager className={styles.toastSodam} />}
            <span>{toast.msg}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action!.run();
                  setToast(null);
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
