import { Logo, LogoMark } from '@/components/Logo';
import { CARD, TIERS, INK, INK_SOFT, PAPER, FRAME, LOGO_INK, BACK_PAPER, type Layout } from './card';
import styles from './LetterCard.module.css';

type Props = {
  text: string;
  from?: string;
  date?: string;
  /** Exact lines from layoutLetter(); without it the card falls back to CSS wrapping. */
  layout?: Layout | null;
  /** Stable key per UTF-16 index of `text`; a new key makes that character ink in. */
  charKeys?: string[];
  /** Stagger the ink-in (used when a letter is loaded or replayed). */
  stagger?: boolean;
  caret?: boolean;
  placeholder?: boolean;
  flipped?: boolean;
  backNote?: string;
  label?: string;
  className?: string;
};

// Card geometry → CSS custom properties (percentages of the card box).
const geometry = {
  '--card-paper': PAPER,
  '--card-ink': INK,
  '--card-soft': INK_SOFT,
  '--card-frame': FRAME,
  '--card-logo': LOGO_INK,
  '--card-back': BACK_PAPER,
  '--pad-x': `${CARD.padX * 100}%`,
  '--frame': `${CARD.frame * 100}cqw`,
  '--head-top': `${CARD.head.top * 100}%`,
  '--head-fs': `${CARD.head.fs * 100}cqw`,
  '--body-top': `${CARD.body.top * 100}%`,
  '--body-h': `${(CARD.body.bottom - CARD.body.top) * 100}%`,
  '--body-w': `${CARD.body.w * 100}%`,
  '--from-top': `${CARD.from.top * 100}%`,
  '--from-fs': `${CARD.from.fs * 100}cqw`,
  '--foot-top': `${CARD.foot.top * 100}%`,
  '--logo-w': `${CARD.foot.logoW * 100}cqw`,
  '--date-fs': `${CARD.foot.dateFs * 100}cqw`,
} as React.CSSProperties;

function renderBody(text: string, layout: Layout, keys: string[] | undefined, stagger: boolean, caret: boolean) {
  const out: React.ReactNode[] = [];
  let n = 0;
  layout.lines.forEach((ln, li) => {
    if (li > 0) out.push(<br key={`br${li}`} />);
    for (let i = ln.start; i < ln.end; i++) {
      const code = text.charCodeAt(i);
      const wide = code >= 0xd800 && code <= 0xdbff;
      const ch = wide ? text.slice(i, i + 2) : text[i];
      const delay = stagger ? Math.min(n * 24, 1800) : 0;
      out.push(
        <span
          key={keys?.[i] ?? `c${i}`}
          className={styles.ch}
          style={delay ? { animationDelay: `${delay}ms` } : undefined}
        >
          {ch}
        </span>,
      );
      n++;
      if (wide) i++;
    }
  });
  if (caret) out.push(<span key="caret" className={styles.caret} aria-hidden="true" />);
  return out;
}

export function LetterCard({
  text,
  from = '',
  date = '',
  layout,
  charKeys,
  stagger = false,
  caret = false,
  placeholder = false,
  flipped = false,
  backNote,
  label,
  className,
}: Props) {
  const tier = layout ? TIERS[layout.tier] : TIERS[0];
  const bodyStyle = {
    '--fs': `${tier.fs * 100}cqw`,
    '--lh': tier.lh,
  } as React.CSSProperties;
  const aria = label ?? `편지 카드: Dear Papa, ${text}${from ? ` — ${from}` : ''}`;

  return (
    <div className={`${styles.scene} ${className ?? ''}`} data-flipped={flipped || undefined}>
      <div className={styles.flipper}>
        <figure className={styles.face} style={geometry} role="img" aria-label={aria}>
          <span className={styles.frame} aria-hidden="true" />
          <span className={`pen ${styles.head}`} aria-hidden="true">
            Dear Papa,
          </span>
          <span
            className={`pen ${styles.body}`}
            style={bodyStyle}
            data-precise={layout ? '' : undefined}
            data-placeholder={placeholder || undefined}
            data-over={layout?.over || undefined}
            aria-hidden="true"
          >
            {layout ? renderBody(text, layout, charKeys, stagger, caret) : text}
          </span>
          {from.trim() && (
            <span className={`pen ${styles.from}`} aria-hidden="true">
              — {from.trim()}
            </span>
          )}
          <span className={styles.foot} aria-hidden="true">
            <Logo className={styles.logo} title="" />
            {date && <span className={styles.date}>{date}</span>}
          </span>
        </figure>

        <div className={`${styles.face} ${styles.back}`} style={geometry} aria-hidden="true">
          <span className={styles.frame} />
          <span className={styles.seal}>
            <LogoMark className={styles.mark} />
          </span>
          {backNote && <span className={`pen ${styles.note}`}>{backNote}</span>}
          <span className={styles.backFoot}>아빠의 매일에, 딸의 마음을.</span>
        </div>
      </div>
    </div>
  );
}
