import Link from 'next/link';
import styles from './Article.module.css';

type Crumb = { href: string; label: string };

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  meta?: React.ReactNode;
  crumbs?: Crumb[];
  children: React.ReactNode;
  footer?: React.ReactNode;
};

// Shared shell for text pages (official facts, journal, press …): narrow measure, quiet header.
export function ArticleLayout({ eyebrow, title, lead, meta, crumbs, children, footer }: Props) {
  return (
    <article className={styles.article}>
      <header className={`container ${styles.head}`}>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="현재 위치" className={styles.crumbs}>
            <ol>
              {crumbs.map((c) => (
                <li key={c.href}>
                  <Link href={c.href}>{c.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className={/[가-힣]/.test(eyebrow) ? 'eyebrow eyebrow--ko' : 'eyebrow'}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {lead && <div className={styles.lead}>{lead}</div>}
        {meta && <div className={styles.meta}>{meta}</div>}
      </header>
      <div className={`container ${styles.bodyWrap}`}>
        <div className={styles.prose}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </article>
  );
}

// Labelled key–value rows (e.g. 국문 이름 / 영문 표기).
export function FactList({ rows }: { rows: readonly (readonly [string, React.ReactNode])[] }) {
  return (
    <dl className={styles.factList}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// Card-style link list used at the end of articles (함께 보기).
export function RelatedLinks({ title = '함께 보기', links }: { title?: string; links: Crumb[] }) {
  return (
    <nav className={styles.related} aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>
              <span>{l.label}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
