import { CHANNELS } from '@/lib/facts';
import styles from './News.module.css';

const instagram = CHANNELS.find((c) => c.key === 'instagram')!;

export function News() {
  return (
    <section id="news" className={styles.section} aria-labelledby="news-title">
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow" data-reveal>
          Coming Soon
        </p>
        <h2 id="news-title" className={styles.title} data-reveal>
          준비가 되면
          <br />
          먼저 알려드릴게요.
        </h2>
        <p className={styles.lead} data-reveal>
          출시일과 제품 정보가 확정되면 가장 먼저 안내할 예정입니다. 신청 기능은 정식 오픈과 함께 열려요.
        </p>
        <div className={styles.ctas} data-reveal>
          <a className={`btn ${styles.btn}`} href={instagram.href} target="_blank" rel="noopener noreferrer">
            인스타그램 {instagram.handle}
          </a>
          <a className={styles.link} href="#letter">
            그동안 편지 먼저 써 두기
          </a>
        </div>
      </div>
    </section>
  );
}
