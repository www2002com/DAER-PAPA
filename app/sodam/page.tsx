import type { Metadata } from 'next';
import { SODAM_CUTS, SODAM_PAGE as C, visibleProfileRows } from '@/lib/sodam-page';
import styles from './sodam.module.css';

export const metadata: Metadata = {
  metadataBase: null,
  title: { absolute: C.title },
  description: C.description,
  alternates: { canonical: C.url },
  openGraph: {
    type: 'website',
    title: C.title,
    description: C.description,
    url: C.url,
    siteName: 'DEAR PAPA 디어파파',
    locale: 'ko_KR',
    images: [{ url: 'https://dearpapa.kr/og.png' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dearpapa.kr/og.png'] },
};

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
);

export default function SodamPage() {
  const rows = visibleProfileRows();
  const hero = SODAM_CUTS[0];
  return (
    <article className={styles.page} aria-labelledby="sodam-title">
      <section className={styles.hero}>
        <div className={`container ${styles.heroLayout}`}>
          <div className={styles.copy}>
            <p className="eyebrow">{C.eyebrow}</p>
            <h1 id="sodam-title" className={styles.title}>{C.heading}</h1>
            <p className={styles.lead}>{C.intro}</p>
            <div className={styles.actions}>
              <a className="btn" href={C.cta.href} data-track-action="letter_entry_clicked">{C.cta.label}<Arrow /></a>
            </div>
          </div>
          <aside className={styles.profile} aria-labelledby="sodam-profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.src} alt={C.portraitAlt} width={hero.width} height={hero.height} />
            <div className={styles.profileBody}>
              <h2 id="sodam-profile" className={styles.profileTitle}>{C.profile.title}</h2>
              <p className={`pen ${styles.profileIntro}`}>{C.profile.intro}</p>
              <dl className={styles.profileRows}>
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              {C.profile.showNameOrigin && C.profile.nameOriginLine ? (
                <p className={styles.profileNote}>{C.profile.nameOriginLine}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-cuts">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-cuts" className={styles.h2}>{C.cutsTitle}</h2>
          <p className={styles.text}>{C.cutsNote}</p>
          <ul className={styles.cuts}>
            {SODAM_CUTS.map((cut) => (
              <li key={cut.src}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cut.src} alt={cut.alt} width={cut.width} height={cut.height} loading="lazy" />
                  <figcaption>{cut.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-role">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-role" className={styles.h2}>{C.roleTitle}</h2>
          <p className={styles.text}>{C.role}</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tone}`} aria-labelledby="sodam-tone">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-tone" className={styles.h2}>{C.toneTitle}</h2>
          <p className={styles.text}>{C.toneLead}</p>
          <ul className={styles.toneList}>
            {C.toneExamples.map((line) => (
              <li key={line}><blockquote className="pen">{line}</blockquote></li>
            ))}
          </ul>
          <p className={styles.text}>{C.toneOutro}</p>
          <div className={styles.actions}>
            <a className="btn" href={C.cta.href} data-track-action="letter_entry_clicked">{C.cta.label}<Arrow /></a>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-how">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-how" className={styles.h2}>{C.howTitle}</h2>
          <ol className={styles.steps}>
            {C.howSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className={styles.small}><span className="tag" data-tone="now">지금 가능</span>{C.howNote}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-anyone">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-anyone" className={styles.h2}>{C.anyoneTitle}</h2>
          <p className={styles.text}>{C.anyone}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-later">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-later" className={styles.h2}>
            {C.laterTitle} <span className="tag" data-tone="later">{C.laterTag}</span>
          </h2>
          <p className={styles.text}>{C.later}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-product">
        <div className={`container ${styles.product}`}>
          <figure className={styles.productFigure}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={C.productBox.image} alt={C.productBox.imageAlt} width={1672} height={941} loading="lazy" />
            <figcaption>{C.productBox.caption}</figcaption>
          </figure>
          <div className={styles.productBody}>
            <h2 id="sodam-product" className={styles.h2}>{C.productBox.name}</h2>
            <p className={styles.text}>{C.productBox.body}</p>
            <a className="link-arrow" href={C.productBox.link.href}>{C.productBox.link.label}<Arrow /></a>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sodam-faq">
        <div className={`container ${styles.narrow}`}>
          <h2 id="sodam-faq" className={styles.h2}>{C.faqTitle}</h2>
          <dl className={styles.faq}>
            {C.faq.map((item) => (
              <div key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.notice}><span className="tag">출시 준비 중</span>{C.notice}</p>
        </div>
      </section>
    </article>
  );
}
