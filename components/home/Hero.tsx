import Image from 'next/image';
import { HeroLogo } from './HeroLogo';
import { LetterBunny } from './LetterBunny';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.handnote} aria-hidden="true">Dear Papa, with love!</p>
          <p className={styles.status} data-reveal><span aria-hidden="true" />아빠를 위한 스킨케어, 출시 준비 중</p>
          <h1 id="hero-title" className={styles.title} data-reveal data-reveal-delay="50">아빠의 매일에,<br />딸의 마음을.</h1>
          <p className={styles.description} data-reveal data-reveal-delay="100">
            매일 쓰는 스킨케어 하나.<br />
            평소에 하지 못했던 말 한 줄.<br />
            마음까지 전하는 아빠 선물을 준비합니다.
          </p>
          <div className={styles.invitation}>
          <a className={`link-arrow ${styles.cta}`} href="/#letter" data-reveal="soft-cue" data-track-action="letter_entry_clicked">
            한 줄 편지 써보기 <span aria-hidden="true">→</span>
          </a>
          <LetterBunny />
          </div>
        </div>
        <figure className={styles.visual} data-reveal="visual" data-reveal-delay="80">
          <span className={styles.postmark} aria-hidden="true">TO. PAPA<br /><small>마음을 보내요</small></span>
          <div className={styles.stageRing} aria-hidden="true" />
          <div className={styles.visualTitle}>
            <HeroLogo className={styles.visualLogo} />
          </div>
          <Image className={styles.bottle} src="/images/letter-all-in-one-deep-green-logo-v4.webp"
            alt="디어파파 로고가 담긴 레터 올인원 연한 딥그린 용기 디자인 시안" width={700} height={1425}
            loading="eager" fetchPriority="high" />
          <Image className={styles.carton} src="/images/letter-all-in-one-carton-sage-v1.webp"
            alt="레터 올인원 용기와 한 세트로 구성한 딥그린 슬림 단상자 디자인 시안" width={700} height={1050}
            loading="eager" />
          <div className={styles.letterCard}>
            <span className={styles.letterSalutation}>Dear Papa,</span>
            <p className={styles.letterMessage}>아빠, 늘 고마워요.</p>
            <span className={styles.letterRule} aria-hidden="true" />
          </div>
          <figcaption className={styles.caption}>
            <span>선물 경험 기획 이미지 · 편지 문구 예시</span>
            <span>용기와 단상자는 개발 중인 디자인 시안입니다.</span>
            <span>최종 판매 구성은 확정 전입니다.</span>
          </figcaption>
        </figure>
      </div>
      <div className={`container ${styles.intro}`}>
        <p data-reveal>좋은 선물은,<br /><strong>매일의 안부가 되니까.</strong></p>
        <div data-reveal data-reveal-delay="50">
          <h2>아빠의 일상에 놓일 하나</h2>
          <p>세안 후 하나로 마무리하는<br />남성 올인원 스킨케어를 만듭니다.</p>
        </div>
        <div data-reveal data-reveal-delay="100">
          <h2>마음을 담은 한 줄</h2>
          <p>길지 않아도 괜찮아요.<br />아빠에게 전할 말부터 적어 보세요.</p>
        </div>
      </div>
    </section>
  );
}
