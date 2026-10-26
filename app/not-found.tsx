import Link from 'next/link';
import NotFoundPenLine from '@/components/NotFoundPenLine';

export const metadata = { title: { absolute: '페이지를 찾을 수 없어요 | DEAR PAPA 디어파파' } };

export default function NotFound() {
  return (
    <section className="container" style={{ padding: 'clamp(96px, 16vw, 200px) var(--gutter)', textAlign: 'center' }}>
      <p className="eyebrow" style={{ justifyContent: 'center' }}>
        404
      </p>
      <h1 style={{ marginTop: 20, fontSize: 'var(--fs-h2)' }}>찾으시는 페이지가 없어요.</h1>
      <NotFoundPenLine />
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
        <a href="/#letter" className="btn">
          편지 쓰기
        </a>
        <Link href="/" className="btn btn--ghost">
          홈으로
        </Link>
      </div>
    </section>
  );
}
