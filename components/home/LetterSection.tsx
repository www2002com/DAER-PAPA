import { Composer } from '@/components/letter/Composer';
import { LETTER } from '@/lib/facts';
import styles from './LetterSection.module.css';

export function LetterSection() {
  return (
    <section id="letter" className={styles.section} aria-labelledby="letter-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow" data-reveal>
            The Letter
          </p>
          <h2 id="letter-title" className={styles.title} data-reveal style={{ ['--reveal-delay' as string]: 80 }}>
            말로 다 못한 마음,
            <br />한 줄에 담아.
          </h2>
          <p className={styles.lead} data-reveal style={{ ['--reveal-delay' as string]: 160 }}>
            쓰는 대로 카드에 손글씨 스타일로 담겨요. 짧은 한마디면 충분합니다.
          </p>
        </header>

        <Composer />

        <div className={styles.notes}>
          <p>
            <span className="tag" data-tone="now">
              지금 가능
            </span>
            {LETTER.feature}
          </p>
          <p>
            <span className="tag" data-tone="later">
              출시 후
            </span>
            {LETTER.printPlan}
          </p>
        </div>
      </div>
    </section>
  );
}
