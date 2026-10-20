import Link from 'next/link';
import { SectionLogo } from '@/components/SectionLogo';
import { LETTER } from '@/lib/facts';
import styles from './Story.module.css';

export function Story() {
  return (
    <section id="story" className={styles.section} aria-labelledby="story-title">
      <div className="container"><SectionLogo /></div>
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <p className={styles.topic}>디어파파가 시작된 마음</p>
          <h2 id="story-title">늘 우리를 챙겼던 아빠.<br />이번엔 우리가<br />챙길 차례.</h2>
        </div>
        <div className={styles.copy}>
          <div className={styles.body}>
            <p>{LETTER.story[0]}</p>
            <p>{LETTER.story[1]}</p>
          </div>
          <a href="#letter" className={styles.link}>
            내 마음도 한 줄 남기기
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
          </a>
          <Link href="/journal/brand-identity" className={styles.journal}>브랜드 이야기 더 읽기</Link>
        </div>
      </div>
    </section>
  );
}
