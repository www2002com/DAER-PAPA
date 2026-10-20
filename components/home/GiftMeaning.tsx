import { SectionLogo } from '@/components/SectionLogo';
import styles from './GiftMeaning.module.css';

const REASONS = [
  {
    title: '받는 순간을 넘어, 매일 쓰일 선물.',
    body: '아빠 선물을 고를 때는 ‘얼마나 특별한가’와 함께 ‘일상에서 손이 갈까’를 생각합니다. 디어파파가 스킨케어를 고른 이유는, 세안 후 자신을 챙기는 짧은 시간에 자연스럽게 놓일 수 있어서입니다.',
  },
  {
    title: '꾸준히 쓰기 쉽도록, 간편한 하나.',
    body: '마음 담아 고른 선물도 사용이 복잡하면 아빠의 일상에 자리 잡기 어려울 수 있습니다. 그래서 여러 제품의 순서를 고민하지 않도록, 세안 후 하나로 마무리하는 올인원을 기획하고 있습니다.',
  },
  {
    title: '편지로 전하는, 이 선물을 고른 마음.',
    body: '제품만으로는 ‘아빠를 생각하며 골랐다’는 내 마음을 다 전하기 어려울 수 있습니다. ‘아빠, 늘 고마워요.’라는 한 줄은 왜 이 선물을 건네는지 알려 줍니다. 길거나 멋진 글보다, 내가 평소 전하고 싶었던 말이면 충분합니다.',
  },
];

export function GiftMeaning() {
  return (
    <section id="gift-meaning" className={styles.section} aria-labelledby="gift-meaning-title">
      <div className="container"><SectionLogo /></div>
      <div className={`container ${styles.layout}`}>
        <header className={styles.intro}>
          <p className={styles.eyebrow} data-reveal>아빠 선물을 생각하는 기준</p>
          <h2 id="gift-meaning-title" data-reveal data-reveal-delay="40">왜 올인원에,<br />편지를 더할까요?</h2>
          <p className={styles.lead} data-reveal data-reveal-delay="80">
            아빠에게는 매일 쓸 수 있는 하나를.<br />
            그 안에는 내가 전하고 싶은 마음을.
          </p>
          <p className={styles.promise} data-reveal data-reveal-delay="120">
            이 두 가지를 함께 전하고 싶어,<br />
            디어파파는 레터 올인원을 준비하고 있습니다.
          </p>
        </header>
        <ol className={styles.reasons} role="list">
          {REASONS.map(({ title, body }, index) => (
            <li key={title} className={styles.reason} data-reveal data-reveal-delay={index * 40}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
