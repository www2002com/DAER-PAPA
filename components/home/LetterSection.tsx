import { LazyComposer } from '@/components/letter/LazyComposer';
import { LETTER } from '@/lib/facts';
import styles from './LetterSection.module.css';

export function LetterSection() {
  return (
    <section id="letter" className={styles.section} aria-labelledby="letter-title">
      <div className="container">
        <header className={styles.head}>
          <h2 id="letter-title" className={styles.title} data-reveal>
            말로 다 못한 마음,<br />여기서 시작해 볼까요?
          </h2>
          <p className={styles.lead} data-reveal data-reveal-delay="60">
            짧은 한마디면 충분해요. 쓰는 대로 아빠에게 건넬 카드가 됩니다.
          </p>
        </header>

        <LazyComposer />

        <div className={styles.notes}>
          <p data-reveal>
            <span className="tag" data-tone="now">
              지금 가능
            </span>
            {LETTER.feature}
          </p>
          <p data-reveal data-reveal-delay="50">
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
