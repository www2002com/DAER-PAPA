import { HeroLetterPreview } from './HeroLetterPreview';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          {/* What this is, in the official words, before the slogan. */}
          <p className={styles.status} data-reveal><span aria-hidden="true" />아빠를 위한 올인원 스킨케어 · 출시 준비 중</p>
          <h1 id="hero-title" className={styles.title} data-reveal data-reveal-delay="50">아빠의 매일에,<br />딸의 마음을.</h1>
          <p className={styles.description} data-reveal data-reveal-delay="100">
            매일 쓰는 스킨케어 하나.<br />
            평소에 하지 못했던 말 한 줄.<br />
            마음까지 전하는 아빠 선물을 준비합니다.
          </p>
          <p className={styles.fixedSentence}>디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요. 출시 전이에요. 가격과 출시일은 아직 정해지지 않았어요.</p>
          <div className={styles.invitation}>
          <a className={styles.cta} href="/#letter" data-letter-entry data-track-action="letter_entry_clicked">
            한 줄 편지 써보기 <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
          <a className={styles.secondary} href="/#product" data-track-action="hero_product_clicked">레터 올인원 알아보기</a>
          </div>
          <p className={styles.audience} data-reveal data-reveal-delay="140">
            딸의 마음을 담는 편지지만, 아들이나 배우자 등 누구나 쓸 수 있어요.
            <br />직접 쓰실 아빠라면 <a href="/#product">제품 소개</a>부터 보셔도 좋아요.
          </p>
        </div>
        <figure className={styles.visual} data-reveal="visual" data-reveal-delay="80">
          <HeroLetterPreview />
          <figcaption className={styles.caption}>
            <span>선물 경험 기획 이미지 · 편지 문구 예시</span>
            <span>용기와 단상자는 개발 중인 디자인 시안입니다.</span>
            <span>최종 판매 구성은 확정 전입니다.</span>
          </figcaption>
        </figure>
      </div>
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
