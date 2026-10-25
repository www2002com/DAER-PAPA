import Link from 'next/link';
import styles from './Article.module.css';

/** Small in-article pointer to the product page. No benefits, price or launch date. */
export function ProductBox() {
  return (
    <aside className={styles.productBox} aria-label="레터 올인원">
      <p>디어파파(DEAR PAPA)는 지금 디어파파 레터 올인원을 준비하고 있어요.</p>
      <Link href="/letter-all-in-one" data-track-action="journal_product_box_clicked">레터 올인원 소개 보기</Link>
    </aside>
  );
}
