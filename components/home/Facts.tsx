import Link from 'next/link';
import { SectionLogo } from '@/components/SectionLogo';
import { FAQ } from '@/lib/facts';
import styles from './Facts.module.css';

export function Facts() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className="container"><SectionLogo /></div>
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <h2 id="faq-title" data-reveal>궁금한 이야기를<br />모았습니다.</h2>
          <p data-reveal data-reveal-delay="50">준비하는 과정도, 지금 정해진 정보도<br />있는 그대로 전합니다.</p>
          <Link href="/about/facts" className="link-arrow" data-reveal="cue" data-reveal-delay="100">디어파파 공식 정보 보기</Link>
        </div>
        <div className={styles.questions}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.item} data-reveal>
              <summary>{item.q}<span aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
