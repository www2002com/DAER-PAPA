import { Bottle, GiftBox } from '@/components/art/Art';
import { WritingCard } from '@/components/letter/WritingCard';
import { LetterCard } from '@/components/letter/LetterCard';
import { BRAND, LETTER, PRODUCT } from '@/lib/facts';
import { ScrollWords } from './ScrollWords';
import styles from './Story.module.css';

const d = (ms: number) => ({ ['--reveal-delay' as string]: ms }) as React.CSSProperties;

export function Story() {
  return (
    <section id="story" className={styles.section} aria-labelledby="story-title">
      <div className="container">
        <header className={styles.intro}>
          <p className={`eyebrow ${styles.introLabel}`} data-reveal>
            Our Story
          </p>
          <h2 id="story-title" className={styles.introTitle} data-reveal style={d(80)}>
            아빠에게 전하고 싶은
            <br />
            마음이 있습니다.
          </h2>
        </header>

        {/* 01 — the letter */}
        <article className={styles.chapter}>
          <div className={styles.text}>
            <p className={styles.num} data-reveal>
              01 <span>한 줄의 마음</span>
            </p>
            <h3 className={styles.statement} data-reveal style={d(80)}>
              길게 쓰지 않아도 괜찮습니다.
            </h3>
            <p className={styles.body} data-reveal style={d(160)}>
              함께 웃었던 기억 하나, 평소 다 하지 못했던 말 한 줄.
            </p>
          </div>
          <div className={`${styles.scene} ${styles.sceneDesk}`} data-reveal="fade">
            <span className={styles.paperLight} aria-hidden="true" />
            <div className={styles.deskCard} data-parallax="-0.04">
              <WritingCard
                text={'그때 같이 웃던 날, 아직 기억나요.\n아빠, 고마워요.'}
                from="딸"
                whenVisible
                delay={200}
              />
            </div>
            <svg className={styles.pen} viewBox="0 0 300 40" aria-hidden="true">
              <rect x="40" y="13" width="210" height="14" rx="7" fill="#3a2d21" />
              <rect x="226" y="12" width="40" height="16" rx="7" fill="#b9a283" />
              <path d="M40 13 L8 20 L40 27 Z" fill="#cdbfae" />
              <path d="M8 20 L18 20" stroke="#3a2d21" strokeWidth="1.2" />
            </svg>
            <p className={styles.sceneCaption}>예시 편지</p>
          </div>
        </article>

        {/* 02 — everyday use */}
        <article className={`${styles.chapter} ${styles.flip}`}>
          <div className={styles.text}>
            <p className={styles.num} data-reveal>
              02 <span>아빠의 매일</span>
            </p>
            <h3 className={styles.statement} data-reveal style={d(80)}>
              DEAR&nbsp;PAPA는 그 마음을 전할 편지와 아빠의 일상에 놓일 하나를 준비합니다.
            </h3>
            <p className={styles.body} data-reveal style={d(160)}>
              {PRODUCT.usage}. {PRODUCT.afterShave}
            </p>
          </div>
          <div className={`${styles.scene} ${styles.sceneMorning}`} data-reveal="fade">
            <span className={styles.window} aria-hidden="true" />
            <span className={styles.shelf} aria-hidden="true" />
            <span className={styles.towel} aria-hidden="true" />
            <div className={styles.morningBottle} data-parallax="-0.05">
              <Bottle id="story-bottle" className={styles.bottleArt} />
            </div>
            <span className={styles.drops} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <p className={styles.sceneCaption}>디자인 시안</p>
          </div>
        </article>

        {/* 03 — the gift */}
        <article className={styles.chapter}>
          <div className={styles.text}>
            <p className={styles.num} data-reveal>
              03 <span>건네는 순간</span>
            </p>
            <h3 className={styles.statement} data-reveal style={d(80)}>
              {LETTER.story[0]}
            </h3>
            <p className={styles.body} data-reveal style={d(160)}>
              {LETTER.story[1]}
            </p>
          </div>
          <div className={`${styles.scene} ${styles.sceneGift}`} data-reveal="fade">
            <div className={styles.giftBox} data-parallax="-0.03">
              <GiftBox id="story-box" className={styles.boxArt} />
            </div>
            <div className={styles.giftCard} data-parallax="0.05">
              <LetterCard text="아빠, 늘 고마워요." from="" label="예시 편지 카드" />
            </div>
            <p className={styles.sceneCaption}>디자인 시안 · 구상 중</p>
          </div>
        </article>

        {/* Promise, lit word by word */}
        <div className={styles.promise}>
          <p className="eyebrow" data-reveal>
            Brand Promise
          </p>
          <ScrollWords text={BRAND.promise} className={styles.promiseText} />
        </div>

        <p className={styles.closing} data-reveal>
          <span>아빠의 매일에,</span>
          <span className={styles.pill} aria-hidden="true">
            <Bottle id="pill-bottle" className={styles.pillBottle} />
          </span>
          <span>딸의 마음을.</span>
        </p>
      </div>
    </section>
  );
}
