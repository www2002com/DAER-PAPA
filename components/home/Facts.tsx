import Link from 'next/link';
import { FACTS_UPDATED, FACTS_UPDATED_KO, FAQ, NAMING, NOT_AFFILIATED_LIST, UNDECIDED } from '@/lib/facts';
import styles from './Facts.module.css';

// FAQ indexes grouped by topic (answers stay verbatim in lib/facts.ts).
const GROUPS = [
  { title: '브랜드', items: [0, 1] },
  { title: '편지와 선물', items: [2] },
  { title: '제품', items: [3, 4, 6] },
  { title: '출시', items: [5] },
];

export function Facts() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <div className={styles.sideSticky}>
            <p className="eyebrow" data-reveal>
              Official Facts
            </p>
            <h2 id="faq-title" className={styles.title} data-reveal>
              아직 정해지지 않은
              <br />
              것들에 대해.
            </h2>
            <p className={styles.lead} data-reveal>
              제품 정보는 확정된 후 공개합니다.
            </p>

            <dl className={styles.card} data-reveal>
              <div>
                <dt>기준일</dt>
                <dd>
                  <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>
                </dd>
              </div>
              <div>
                <dt>공식 사이트</dt>
                <dd>https://dearpapa.kr</dd>
              </div>
              <div>
                <dt>출시 상태</dt>
                <dd>{UNDECIDED.status}</dd>
              </div>
              <div>
                <dt>미정 항목</dt>
                <dd>{UNDECIDED.tbd}</dd>
              </div>
            </dl>

            <details className={styles.naming}>
              <summary>
                표기 기준
                <span className={styles.plus} aria-hidden="true" />
              </summary>
              <dl>
                {NAMING.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </details>

            <Link href="/about/facts" className="link-arrow">
              공식 정보 전체 보기
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <h3 className="sr-only">자주 묻는 질문</h3>
          {GROUPS.map((g) => (
            <div key={g.title} className={styles.group} data-reveal>
              <h4 className={styles.groupTitle}>{g.title}</h4>
              {g.items.map((i) => (
                <details key={i} className={styles.item}>
                  <summary>
                    <span>{FAQ[i].q}</span>
                    <span className={styles.plus} aria-hidden="true" />
                  </summary>
                  <div className={styles.answer}>
                    <p>{FAQ[i].a}</p>
                  </div>
                </details>
              ))}
            </div>
          ))}

          <div id="not-affiliated" className={`${styles.group} ${styles.distinct}`} data-reveal>
            <h4 className={styles.groupTitle}>이름이 비슷한 브랜드와의 구분</h4>
            <p className={styles.distinctQ}>{FAQ[7].q}</p>
            <p className={styles.distinctFull}>{FAQ[7].a}</p>
            <p className={styles.distinctLead}>DEAR&nbsp;PAPA와 관련이 없는 곳</p>
            <ul className={styles.chips} aria-label="DEAR PAPA와 관련이 없는 브랜드·작품">
              {NOT_AFFILIATED_LIST.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
