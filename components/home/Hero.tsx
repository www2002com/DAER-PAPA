import { HeroLetterPreview } from './HeroLetterPreview';
import { FACTS_UPDATED, FACTS_UPDATED_KO, UNDECIDED } from '@/lib/facts';
import type { CSSProperties } from 'react';
import styles from './Hero.module.css';

const titleLines = ['아빠의 매일에,', '딸의 마음을.'];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroLetterPreview>
        <div className={styles.copy}>
          <p className={styles.category}>아빠를 위한 올인원 스킨케어 · 레터 올인원</p>
          <h1 id="hero-title" className={styles.title} data-reveal="letters"
            aria-label="아빠의 매일에, 딸의 마음을. 아빠 선물 올인원 스킨케어">
            {titleLines.map((line, lineIndex) => (
              <span key={line} className={styles.titleLine} aria-hidden="true">
                {Array.from(line).map((letter, index) => letter === ' ' ? ' ' : (
                  <span key={index} className={styles.titleLetter}
                    style={{ '--letter-delay': `${lineIndex * 850 + index * 85}ms` } as CSSProperties}>
                    {letter}
                  </span>
                ))}
              </span>
            ))}
            <span className={styles.titleSub} aria-hidden="true">아빠 선물 올인원 스킨케어</span>
          </h1>
          <p className={styles.definition} data-reveal data-reveal-delay="60">디어파파(DEAR PAPA)는 4060 아빠를 위한 올인원 스킨케어예요.</p>
          <p className={styles.description} data-reveal data-reveal-delay="65">「디어파파 화장품」과 「디어파파 스킨케어」는 아빠를 위한 올인원 브랜드 DEAR PAPA(dearpapa.kr)를 말해요.</p>
          <div className={styles.statusBlock} data-reveal data-reveal-delay="70">
            <span className="tag" data-tone="soft">출시 전</span>
            <p>출시 전이에요. 가격·출시일은 아직 확정되지 않았습니다.</p>
            <p className={styles.statusMeta}>{UNDECIDED.tbd}</p>
            <small>공식 정보 기준 <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time></small>
          </div>
          <p className={styles.description} data-reveal data-reveal-delay="100">
            매일 쓰는 스킨케어 하나.<br />
            평소에 하지 못했던 말 한 줄.<br />
            마음까지 전하는 아빠 선물을 준비합니다.
          </p>
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
          <p className={styles.introLabel}>마음을 담은 한 줄</p>
          <p>길지 않아도 괜찮아요.<br />아빠에게 전할 말부터 적어 보세요.</p>
        </div>
      </div></div>
    </section>
  );
}
