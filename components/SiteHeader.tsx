'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { CHANNELS } from '@/lib/facts';
import styles from './SiteHeader.module.css';

const NAV = [
  { href: '/#product', label: '레터 올인원' },
  { href: '/#story', label: '브랜드 이야기' },
  { href: '/#faq', label: '궁금한 이야기' },
  { href: '/journal', label: '저널' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
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
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, footer'));
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const desktop = window.matchMedia('(min-width: 900px)');
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', onResize);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtn.current?.focus();
      }
      if (e.key === 'Tab') {
        const links = [headerRef.current, sheetRef.current].flatMap((root) =>
          Array.from(root?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
        ).filter((element) => element.getClientRects().length > 0);
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      desktop.removeEventListener('change', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
        data-scrolled={scrolled || open || undefined}
      >
        <div className={`container ${styles.bar}`}>
          <Link href="/#main" className={styles.brand} aria-label="DEAR PAPA 디어파파 홈" onClick={close}>
            <Logo className={styles.logo} />
          </Link>

          <nav className={styles.nav} aria-label="주요 메뉴">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

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
      </header>

      {/* Outside <header>: its backdrop-filter/transform would otherwise trap this fixed sheet. */}
      <div ref={sheetRef} id="site-menu" className={styles.sheet} data-open={open || undefined} hidden={!open}>
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
