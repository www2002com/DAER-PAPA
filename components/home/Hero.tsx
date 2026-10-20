import { Bottle } from '@/components/art/Art';
import { WritingCard } from '@/components/letter/WritingCard';
import { SAMPLE_TEXT } from '@/components/letter/card';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.top}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <span className="eyebrow">Dear Papa · Letter All-in-One</span>
            <span className="tag" data-tone="soft">
              출시 준비 중
            </span>
          </p>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}>
              <span>아빠의 매일에,</span>
            </span>
            <span className={`${styles.line} ${styles.indent}`}>
              <span>딸의 마음을.</span>
            </span>
            <span className={styles.sub}>편지와 함께 건네는 아빠 선물, DEAR&nbsp;PAPA(디어파파).</span>
          </h1>
        </div>
        <div className={styles.aside}>
          <p>아빠를 위한 올인원 스킨케어와 마음을 전하는 편지 경험을 준비하고 있습니다.</p>
          <div className={styles.ctas}>
            <a href="#letter" className="btn">
              아빠에게 한 줄 쓰기
            </a>
            <a href="#product" className="link-arrow">
              제품 이야기
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.artWrap}`}>
        <div className={styles.frame}>
          <span className={styles.light} aria-hidden="true" />
          <div className={styles.bottleWrap} data-parallax="-0.05">
            <Bottle id="hero-bottle" className={styles.bottle} />
          </div>
          <div className={styles.cardWrap} data-parallax="0.04">
            <WritingCard className={styles.card} text={SAMPLE_TEXT} delay={900} />
          </div>
          <p className={styles.caption}>
            <span className="tag">디자인 시안</span>
            용기·카드 그림은 개발 중인 시안이에요
          </p>
        </div>
      </div>

      <a href="#letter" className={styles.scrollCue} aria-label="편지 쓰기로 내려가기">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
