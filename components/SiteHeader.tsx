'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { CHANNELS } from '@/lib/facts';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/#story', label: '이야기' },
  { href: '/#product', label: '제품' },
  { href: '/#faq', label: '공식 정보' },
  { href: '/journal', label: '자료실' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Step aside while reading downward; come back on any upward scroll.
      setHidden(y > 480 && y > lastY + 2);
      if (y < lastY - 2 || y < 480) setHidden(false);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || open || undefined}
        data-hidden={(hidden && !open) || undefined}
      >
        <div className={`container ${styles.bar}`}>
          <Link href="/" className={styles.brand} aria-label="DEAR PAPA 디어파파 홈">
            <Logo className={styles.logo} />
          </Link>

          <nav className={styles.nav} aria-label="주요 메뉴">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a href="/#letter" className={styles.cta}>
              편지 쓰기
            </a>
            <button
              ref={menuBtn}
              type="button"
              className={styles.menuBtn}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? '메뉴 닫기' : '메뉴 열기'}</span>
              <span className={styles.burger} data-open={open || undefined} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter/transform would otherwise trap this fixed sheet. */}
      <div id="site-menu" className={styles.sheet} data-open={open || undefined} hidden={!open}>
        <nav className={`container ${styles.sheetNav}`} aria-label="전체 메뉴">
          <a href="/#letter" onClick={close} style={{ ['--i' as string]: 0 }}>
            편지 쓰기
          </a>
          {NAV.map((item, i) => (
            <a key={item.href} href={item.href} onClick={close} style={{ ['--i' as string]: i + 1 }}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={`container ${styles.sheetFoot}`}>
          {CHANNELS.map((c) => (
            <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer">
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
