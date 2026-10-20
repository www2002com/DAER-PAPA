import { CHANNELS } from '@/lib/facts';
import styles from './News.module.css';
const instagram = CHANNELS.find((c) => c.key === 'instagram')!;
export function News() {
  return (
    <section id="news" className={styles.section} aria-labelledby="news-title">
      <div className={`container ${styles.inner}`}>
        <div data-reveal><h2 id="news-title">아빠에게 건넬 그날까지.</h2><p>디어파파가 준비하는 이야기를 공식 인스타그램에서 만나세요.</p></div>
        <a className={`btn ${styles.button}`} href={instagram.href} target="_blank" rel="noopener noreferrer" data-reveal="cue" data-reveal-delay="100">인스타그램에서 소식 보기</a>
      </div>
    </section>
  );
}
