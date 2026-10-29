import Link from 'next/link';
import { SodamPose } from '@/components/SodamPose';

export const metadata = { title: { absolute: '페이지를 찾을 수 없어요 | DEAR PAPA 디어파파' } };

export default function NotFound() {
  return (
    <section className="container" style={{ padding: 'clamp(96px, 16vw, 200px) var(--gutter)', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SodamPose pose="oops" size={168} eager />
      </div>
      <p className="eyebrow" style={{ justifyContent: 'center', marginTop: 12 }}>
        404
      </p>
      <h1 style={{ marginTop: 20, fontSize: 'var(--fs-h2)' }}>찾으시는 페이지가 없어요.</h1>
      <p className="pen" style={{ marginTop: 24, fontSize: '2rem', color: 'var(--ink-2)' }}>
        대신, 아빠에게 한 줄 써 보는 건 어때요?
      </p>
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
