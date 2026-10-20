// Letter card geometry, line layout and PNG rendering.
// The on-screen card (LetterCard) and the exported PNG read the same numbers,
// so what the visitor sees is what they download.

import { LOGO_CANVAS_PATHS } from '@/components/Logo';

/** Card size in export pixels (4:5, fits phone galleries and messengers). */
export const CARD = {
  W: 1080,
  H: 1350,
  padX: 0.1, // × W
  frame: 0.035, // inset hairline, × W
  head: { top: 0.098, fs: 0.06 }, // "Dear Papa," — top × H, font-size × W
  body: { top: 0.205, bottom: 0.765, w: 0.8 }, // text box — top/bottom × H, width × W
  from: { top: 0.792, fs: 0.056 },
  foot: { top: 0.905, logoW: 0.17, dateFs: 0.0215 },
} as const;

/** Font steps: the letter shrinks gently as it grows, never overflowing the card. */
export const TIERS = [
  { fs: 0.074, lh: 1.45 },
  { fs: 0.064, lh: 1.42 },
  { fs: 0.056, lh: 1.4 },
  { fs: 0.05, lh: 1.38 },
] as const;

export const MAX_CHARS = 150;
export const MAX_FROM = 12;
export const SAMPLE_TEXT = '아빠, 늘 고마워요. 오늘도 편안한 하루 보내세요.';

export const INK = '#2b221c';
export const INK_SOFT = '#6b5a4d';
export const PAPER = '#fcfaf6';
export const FRAME = '#e5d6c9';

export type Line = { start: number; end: number };
export type Layout = { lines: Line[]; tier: number; fs: number; lh: number; over: boolean };

const BODY_H = (CARD.body.bottom - CARD.body.top) * CARD.H;
const BODY_W = CARD.body.w * CARD.W;

export const maxLinesFor = (t: (typeof TIERS)[number]) => Math.floor(BODY_H / (t.fs * CARD.W * t.lh) + 0.001);

/** CSS font-family list of the handwriting face (next/font exposes it as a CSS variable). */
export function penFamily(): string {
  if (typeof document === 'undefined') return "'Nanum Pen Script', cursive";
  const v = getComputedStyle(document.documentElement).getPropertyValue('--font-nanum-pen').trim();
  return v ? `${v}, cursive` : "'Nanum Pen Script', cursive";
}

/** Font shorthand naming only the real handwriting face, for document.fonts.load(). */
export function penLoadFont(px = 40): string {
  const first = penFamily().split(',')[0].trim();
  return `${px}px ${first}`;
}

/**
 * Make sure the glyphs for `text` are loaded. Best-effort: a missing local fallback
 * face can make document.fonts.load() reject, which must never block the letter.
 */
export async function ensureGlyphs(text: string, font = penLoadFont()): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await document.fonts.load(font, text);
  } catch {
    /* fall back to whatever is available */
  }
}

let measureCtx: CanvasRenderingContext2D | null = null;
function getCtx(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  return measureCtx;
}

const isHigh = (c: number) => c >= 0xd800 && c <= 0xdbff;

/**
 * Word-aware wrapping that returns index ranges into `text`, so each rendered
 * character keeps a stable identity (used for the ink-in animation).
 * Lines break at spaces (Korean keep-all style); an over-long word breaks by character.
 */
export function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): Line[] {
  const lines: Line[] = [];
  const fits = (a: number, b: number) => ctx.measureText(text.slice(a, b)).width <= maxW;
  let pStart = 0;
  for (const para of text.split('\n')) {
    const pEnd = pStart + para.length;
    let ls = pStart; // current line start
    let le = pStart; // current line end (exclusive)
    let pos = pStart;
    while (pos <= pEnd) {
      let we = text.indexOf(' ', pos);
      if (we === -1 || we > pEnd) we = pEnd;
      if (fits(ls, we)) {
        le = we;
      } else {
        if (le > ls) {
          lines.push({ start: ls, end: le });
          ls = pos; // the space at the break is consumed
        }
        if (fits(ls, we)) {
          le = we;
        } else {
          // Word alone is wider than the line: break between characters.
          let k = ls + 1;
          while (k <= we) {
            if (k < we && isHigh(text.charCodeAt(k - 1))) {
              k++;
              continue;
            }
            if (!fits(ls, k) && k - 1 > ls) {
              const cut = isHigh(text.charCodeAt(k - 2)) ? k - 2 : k - 1;
              lines.push({ start: ls, end: cut });
              ls = cut;
            } else k++;
          }
          le = we;
        }
      }
      pos = we + 1;
    }
    lines.push({ start: ls, end: le });
    pStart = pEnd + 1;
  }
  return lines;
}

/** Pick the largest font step at which the whole letter fits inside the card. */
export function layoutLetter(text: string): Layout {
  const ctx = getCtx();
  const family = penFamily();
  let last: Layout | null = null;
  for (let i = 0; i < TIERS.length; i++) {
    const t = TIERS[i];
    const fsPx = t.fs * CARD.W;
    let lines: Line[];
    if (ctx) {
      ctx.font = `${fsPx}px ${family}`;
      lines = wrap(ctx, text, BODY_W);
    } else {
      lines = [{ start: 0, end: text.length }];
    }
    last = { lines, tier: i, fs: t.fs, lh: t.lh, over: lines.length > maxLinesFor(t) };
    if (!last.over) return last;
  }
  return last!;
}

/** Baseline that places a glyph run inside a CSS-style line box (half-leading model). */
function baselineIn(ctx: CanvasRenderingContext2D, top: number, lineH: number, sample: string) {
  const m = ctx.measureText(sample || 'Dear');
  const asc = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent;
  const desc = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
  return top + (lineH - (asc + desc)) / 2 + asc;
}

export type LetterInput = { text: string; from: string; date: string };

/** Draw the card at export resolution. Returns null if the letter does not fit. */
export async function renderCard({ text, from, date }: LetterInput): Promise<HTMLCanvasElement | null> {
  const family = penFamily();
  await Promise.all([
    ensureGlyphs(`Dear Papa, ${text} ${from}`, penLoadFont(80)),
    ensureGlyphs(date, `24px 'Pretendard Variable'`),
  ]);
  const layout = layoutLetter(text);
  if (layout.over) return null;

  const { W, H } = CARD;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Paper and inset hairline frame.
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  const f = CARD.frame * W;
  ctx.strokeStyle = FRAME;
  ctx.lineWidth = 2;
  ctx.strokeRect(f, f, W - f * 2, H - f * 2);

  const x = CARD.padX * W;

  // Salutation.
  const hfs = CARD.head.fs * W;
  ctx.font = `${hfs}px ${family}`;
  ctx.fillStyle = INK_SOFT;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Dear Papa,', x, baselineIn(ctx, CARD.head.top * H, hfs, 'Dear Papa,'));

  // Body.
  const fs = layout.fs * W;
  const lineH = fs * layout.lh;
  ctx.font = `${fs}px ${family}`;
  ctx.fillStyle = INK;
  const top = CARD.body.top * H;
  layout.lines.forEach((ln, i) => {
    const s = text.slice(ln.start, ln.end);
    if (s) ctx.fillText(s, x, baselineIn(ctx, top + i * lineH, lineH, s));
  });

  // Signature, right-aligned.
  if (from.trim()) {
    const ffs = CARD.from.fs * W;
    ctx.font = `${ffs}px ${family}`;
    ctx.fillStyle = INK_SOFT;
    ctx.textAlign = 'right';
    const sig = `— ${from.trim()}`;
    ctx.fillText(sig, W - x, baselineIn(ctx, CARD.from.top * H, ffs, sig));
    ctx.textAlign = 'left';
  }

  // Footer: wordmark (drawn geometry) and date.
  const footTop = CARD.foot.top * H;
  const lw = CARD.foot.logoW * W;
  const scale = lw / 942.69;
  const logoH = 238 * scale;
  ctx.save();
  ctx.translate(x + 4 * scale, footTop - logoH / 2 + 4 * scale);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#3a2d21';
  for (const p of LOGO_CANVAS_PATHS) {
    ctx.save();
    ctx.translate(p.t[0], p.t[1]);
    ctx.scale(p.t[2], p.t[2]);
    ctx.fill(new Path2D(p.d), p.evenodd ? 'evenodd' : 'nonzero');
    ctx.restore();
  }
  ctx.restore();

  const dfs = CARD.foot.dateFs * W;
  ctx.font = `400 ${dfs}px 'Pretendard Variable', Pretendard, system-ui, sans-serif`;
  ctx.fillStyle = INK_SOFT;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(date, W - x, footTop);

  return canvas;
}

export const toBlob = (c: HTMLCanvasElement) =>
  new Promise<Blob | null>((resolve) => c.toBlob((b) => resolve(b), 'image/png'));

export function todayStamp(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}
