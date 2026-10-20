import Link from 'next/link';
import { RitualIcon } from '@/components/art/Art';
import { PRODUCT, UNDECIDED } from '@/lib/facts';
import { ProductViewer } from './ProductViewer';
import { UnboxSteps } from './UnboxSteps';
import styles from './Product.module.css';

const DETAILS = [
  ['용량', '150ml 한 가지를 기획하고 있습니다.'],
  ['가격 · 출시일', '아직 확정되지 않았습니다.'],
  ['전성분', UNDECIDED.ingredients],
  ['용기', PRODUCT.container],
  ['책임판매업자 · 판매처', '출시 전 미정입니다.'],
];

export function Product() {
  return (
    <section id="product" className={styles.section} aria-labelledby="product-title">
      <div className="container">
        <header className={styles.head}>
          <h2 id="product-title" data-reveal>매일의 마음을,<br />하나에 담아.</h2>
          <p data-reveal data-reveal-delay="60">선물하는 마음만큼, 쓰는 아빠의 일상까지.<br />세안 후 간편하게 쓸 올인원을 준비하고 있습니다.</p>
        </header>
        <div className={styles.split}>
          <ProductViewer />
          <div className={styles.info} data-reveal="from-right" data-reveal-delay="60">
            <span className="tag" data-tone="soft">출시 준비 중</span>
            <h3 className={styles.name}>{PRODUCT.name}</h3>
            <p className={styles.nameEn}>Letter All-in-One</p>
            <p className={styles.description}>40~60대 아빠의 매일을 생각한<br />올인원 스킨케어와 한 줄 편지.</p>
            <dl className={styles.highlights}>
              <div><dt>세안 후, 하나로</dt><dd>면도 후에도 간편하게 쓰는 올인원을 기획합니다.</dd></div>
              <div><dt>가볍게 스미는 사용감</dt><dd>빠른 흡수의 워터리 제형을 개발 방향으로 삼고 있습니다.</dd></div>
              <div><dt>매일 쓸 것을 생각하며</dt><dd>{PRODUCT.noAdded}</dd></div>
            </dl>
            <p className={styles.direction}>현재 개발 방향입니다. 효능·사용감과 최종 사양은 확인 후 공개합니다.</p>
            <details className={styles.details}>
              <summary>지금까지 정해진 제품 정보<span aria-hidden="true" /></summary>
              <dl className={styles.specs}>{DETAILS.map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              <p className={styles.notice}>미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다. {PRODUCT.resultsFirst} {UNDECIDED.status}</p>
            </details>
            <details className={styles.details}>
              <summary>편지와 함께 건네는 선물 구성<span aria-hidden="true" /></summary>
              <p className={styles.notice}>{PRODUCT.unboxing} {PRODUCT.drafts}</p>
              <UnboxSteps />
            </details>
            <Link href="/letter-all-in-one" className={`link-arrow ${styles.more}`}>
              레터 올인원 만나보기
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
          </div>
        </div>
        <div className={styles.ritual}>
          <p data-reveal>아빠의 아침이<br /><strong>조금 더 간편해지도록.</strong><small>구상 중인 사용 순서</small></p>
          <ol>{([['wash','씻고'],['pump','덜고'],['apply','바르고']] as const).map(([kind,label], i) => (
            <li key={kind} data-reveal data-reveal-delay={i * 50}><RitualIcon kind={kind} className={styles.ritualIcon} /><span><small>{i + 1}</small>{label}</span></li>
          ))}</ol>
        </div>
      </div>
    </section>
  );
}
