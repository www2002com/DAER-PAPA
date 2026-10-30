import Link from 'next/link';
import { FooterLogo } from './FooterLogo';
import { ContactEmail } from './ContactEmail';
import { BRAND, CHANNELS, FACTS_UPDATED, FACTS_UPDATED_KO } from '@/lib/facts';
import { businessLines } from '@/lib/business';
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
  { href: '/press', label: '디어파파가 제공한 자료를 바탕으로 쓴 기사' },
];

const CHANNEL_LOGOS = {
  instagram: '/icons/social/instagram.svg',
  blog: '/icons/social/naver-blog.ico',
  tistory: '/icons/social/tistory.svg',
  blogger: '/icons/social/blogger.svg',
  youtube: '/icons/social/youtube.svg',
  facebook: '/icons/social/facebook.svg',
} as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer} data-site-chrome="">
      <div className="container">
        <FooterLogo
          slogan={BRAND.slogan}
          definition={BRAND.definitionShort}
          explanation="로고 · d(Dear)를 180° 돌리면 p(Papa)가 됩니다. 딸과 아빠가 가운데의 원 하나를 함께 쥔 모양입니다."
        />

        <div className={styles.grid}>
          <nav className={styles.col} aria-label="사이트 둘러보기" data-reveal>
            <p className={styles.colTitle}>둘러보기</p>
            <ul>
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="자료" data-reveal data-reveal-delay="50">
            <p className={styles.colTitle}>자료</p>
            <ul>
              {ARCHIVE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col} data-reveal data-reveal-delay="100">
            <p className={styles.colTitle}>공식 채널</p>
            <ul className={styles.socialLinks} aria-label="디어파파 공식 소셜 채널">
              {CHANNELS.map((c) => (
                <li key={c.key}>
                  <a
                    className={styles.socialLink}
                    href={c.href}
                    data-track-action="social_channel_opened"
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
            <p id="contact" className={`${styles.colTitle} ${styles.spaced}`}>문의</p>
            <ContactEmail />
          </div>
        </div>

        <div className={styles.base}>
          <p>
            <span className={styles.status}>
              <span className={styles.dot} aria-hidden="true" />
              출시 준비 중
            </span>
            · 정보 기준일 <time dateTime={FACTS_UPDATED}>{FACTS_UPDATED_KO}</time>
          </p>
          <p className={styles.muted}>
            출시 전 브랜드 소개용 페이지입니다. 제품 이미지는 개발 중인 디자인 시안이며, 제품 정보는 확정 후 공개합니다.
            손글씨 스타일 서체: 나눔 펜 스크립트(SIL OFL). 본문 서체: Pretendard(SIL OFL).
          </p>
          <p className={`${styles.muted} ${styles.business}`} aria-label="사업자 정보">
            {businessLines().map((line, i) => (
              <span key={line.label}>
                {i > 0 && ' · '}
                {line.label} {line.value}
              </span>
            ))}
          </p>
          <div className={styles.baseRow}>
            <span>
              © 2026 DEAR PAPA 디어파파 · dearpapa.kr ·{' '}
              <Link href="/privacy" className={styles.privacy}>
                개인정보처리방침
              </Link>
            </span>
            <a href="#main" className={styles.top}>
              맨 위로
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
