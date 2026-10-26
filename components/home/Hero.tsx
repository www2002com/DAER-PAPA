import { HeroLetterPreview } from './HeroLetterPreview';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroLetterPreview>
        <div className={styles.copy}>
          <p className={styles.category}>아빠를 위한 올인원 스킨케어 · 레터 올인원</p>
          <h1 id="hero-title" className={styles.title} data-reveal data-reveal-delay="50">아빠의 매일에,<br />딸의 마음을.</h1>
          <p className={styles.description} data-reveal data-reveal-delay="100">
            매일 쓰는 스킨케어 하나.<br />
            평소에 하지 못했던 말 한 줄.<br />
            마음까지 전하는 아빠 선물을 준비합니다.
          </p>
          <p className={styles.status}><span aria-hidden="true" />아빠를 위한 스킨케어, 출시 준비 중</p>
          <div className={styles.invitation}>
            <a className={styles.cta} href="/#product">제품 알아보기</a>
            <a className={styles.secondary} href="/#letter" data-letter-entry data-track-action="letter_entry_clicked">한 줄 편지 써보기</a>
          </div>
        </div>
      </HeroLetterPreview>
      <div className={styles.introBand}><div className={`container ${styles.intro}`}>
        <p data-reveal>좋은 선물은,<br /><strong>매일의 안부가 되니까.</strong></p>
        <div data-reveal data-reveal-delay="50">
          <h2>아빠의 일상에 놓일 하나</h2>
          <p>세안 후 하나로 마무리하는<br />남성 올인원 스킨케어를 만듭니다.</p>
        </div>
        <div data-reveal data-reveal-delay="100">
          <h2>마음을 담은 한 줄</h2>
          <p>길지 않아도 괜찮아요.<br />아빠에게 전할 말부터 적어 보세요.</p>
        </div>
      </div></div>
    </section>
  );
}
