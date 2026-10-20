import Link from 'next/link';
import { FooterLogo } from './FooterLogo';
import { BRAND, CHANNELS, CONTACT_EMAIL, FACTS_UPDATED, FACTS_UPDATED_KO, UNDECIDED } from '@/lib/facts';
import styles from './SiteFooter.module.css';

const EXPLORE = [
  { href: '/#letter', label: '편지 쓰기' },
  { href: '/#story', label: '브랜드 이야기' },
  { href: '/#product', label: '제품' },
  { href: '/#faq', label: '자주 묻는 질문' },
  { href: '/letter-all-in-one', label: '우리가 준비하고 있는 것' },
];

const ARCHIVE = [
  { href: '/about/facts', label: '공식 정보 (Official facts)' },
  { href: '/journal', label: '브랜드 자료실' },
  { href: '/journal/dad-gift-guide', label: '아빠 선물 추천, 편지와 함께 건네는 스킨케어' },
  { href: '/press', label: '소개 기사' },
];

const CHANNEL_LOGOS = {
  instagram: '/icons/social/instagram.svg',
  blog: '/icons/social/naver-blog.ico',
  youtube: '/icons/social/youtube.svg',
  facebook: '/icons/social/facebook.svg',
} as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.sign} data-reveal>
          {BRAND.slogan}
        </p>

        <div className={styles.grid}>
          <div className={styles.about}>
            <FooterLogo />
            <p>{BRAND.definitionShort}</p>
            <p className={styles.muted}>
              로고 · d(Dear)를 180° 돌리면 p(Papa)가 됩니다. 딸과 아빠가 가운데의 원 하나를 함께 쥔 모양입니다.
            </p>
          </div>

          <nav className={styles.col} aria-label="사이트 둘러보기" data-reveal>
            <h2 className={styles.colTitle}>둘러보기</h2>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="자료" data-reveal data-reveal-delay="50">
            <h2 className={styles.colTitle}>자료</h2>
            <ul>
              {ARCHIVE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col} data-reveal data-reveal-delay="100">
            <h2 className={styles.colTitle}>공식 채널</h2>
            <ul className={styles.socialLinks} aria-label="디어파파 공식 소셜 채널">
              {CHANNELS.map((c) => (
                <li key={c.key}>
                  <a
                    className={styles.socialLink}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${c.label} ${c.handle} · 새 탭에서 열기`}
                  >
                    <span
                      className={styles.socialIcon}
                      aria-hidden="true"
                      style={{
                        maskImage: `url(${CHANNEL_LOGOS[c.key]})`,
                        WebkitMaskImage: `url(${CHANNEL_LOGOS[c.key]})`,
                      }}
                    />
                    <span className="sr-only">{c.label} {c.handle} — 디어파파 공식 채널 (새 탭에서 열기)</span>
                  </a>
                </li>
              ))}
            </ul>
            <h2 className={`${styles.colTitle} ${styles.spaced}`}>문의</h2>
            <a className={styles.mail} href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className={styles.base}>
          <p>
            <span className={styles.status}>
              <span className={styles.dot} aria-hidden="true" />
              출시 준비 중
            </span>
            기준일 <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time> · {UNDECIDED.status}
          </p>
          <p className={styles.muted}>
            출시 전 브랜드 소개용 페이지입니다. 제품 이미지는 개발 중인 디자인 시안이며, 제품 정보는 확정 후 공개합니다.
            손글씨 스타일 서체: 나눔 펜 스크립트(SIL OFL). 본문 서체: Pretendard(SIL OFL).
          </p>
          <div className={styles.baseRow}>
            <span>© 2026 DEAR PAPA 디어파파 · dearpapa.kr</span>
            <a href="#main" className={styles.top}>
              맨 위로
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
