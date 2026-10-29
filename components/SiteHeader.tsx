'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { ContactEmail } from './ContactEmail';
import { CHANNELS } from '@/lib/facts';
import { MENU_COPY, MENU_GROUPS, MENU_LANGUAGES, MENU_LANGUAGE_KEY, menuLanguage, type MenuLanguage } from '@/lib/menu';
import styles from './SiteHeader.module.css';

const NAV_IDS = ['product', 'story', 'faq', 'journal'] as const;
const CHANNEL_LOGOS = {
  instagram: '/icons/social/instagram.svg', blog: '/icons/social/naver-blog.ico',
  youtube: '/icons/social/youtube.svg', facebook: '/icons/social/facebook.svg',
} as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<MenuLanguage>('ko');
  const pathname = usePathname();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const copy = MENU_COPY[language];
  const lang = MENU_LANGUAGES.find((item) => item.code === language)!.lang;

  useEffect(() => {
    try { setLanguage(menuLanguage(localStorage.getItem(MENU_LANGUAGE_KEY))); } catch { /* Keep Korean if storage is unavailable. */ }
  }, []);

  useEffect(() => {
    let ticking = false;
    let frame = 0;
    const update = () => { setScrolled(window.scrollY > 8); ticking = false; };
    const onScroll = () => {
      if (!ticking) { ticking = true; frame = requestAnimationFrame(update); }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    }
    document.body.style.overflow = 'hidden';
    // Native modal dialog supplies focus containment, Escape and an inert background.
    dialog.showModal();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);

  function chooseLanguage(next: MenuLanguage) {
    setLanguage(next);
    try { localStorage.setItem(MENU_LANGUAGE_KEY, next); } catch { /* Selection still works for this visit. */ }
  }
  function close() { dialogRef.current?.close(); setOpen(false); }
  function keepFocusInMenu(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || undefined} data-site-chrome="">
        <div className={`container ${styles.bar}`}>
          <Link href="/#main" className={styles.brand} aria-label={copy.home}><Logo className={styles.logo} /></Link>
          <nav className={styles.nav} aria-label={copy.primaryNav} lang={lang}>
            {NAV_IDS.map((id) => (
              <a key={id} href={MENU_GROUPS.find((item) => item.id === id)!.href} className={styles.navLink}>{copy.groups[id].title}</a>
            ))}
          </nav>
          <button ref={menuBtn} type="button" className={styles.menuBtn} aria-expanded={open}
            aria-controls="site-menu" aria-haspopup="dialog" lang={lang} onClick={() => setOpen(true)}>
            <span className="sr-only">{copy.open}</span>
            <span className={styles.burger} aria-hidden="true"><span /><span /></span>
          </button>
        </div>
      </header>

      <dialog ref={dialogRef} id="site-menu" className={styles.sheet} aria-labelledby="site-menu-title" lang={lang}
        onKeyDown={keepFocusInMenu} onCancel={() => setOpen(false)}
        onClose={() => { if (!dialogRef.current?.open) setOpen(false); }}>
        <div className={`container ${styles.sheetBar}`}>
          <Link href="/#main" className={styles.brand} aria-label={copy.home} onClick={close}><Logo className={styles.logo} /></Link>
          <p id="site-menu-title" className="sr-only">{copy.title}</p>
          <button ref={closeBtn} type="button" className={styles.menuBtn} onClick={close} aria-label={copy.close}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
        <div ref={scrollRef} className={styles.sheetScroll}>
          <div className={`container ${styles.sheetBody}`}>
            <div className={styles.directory}>
              <div className={styles.languageArea}>
                <div className={styles.languages} role="group" aria-label={copy.languageLabel}>
                  {MENU_LANGUAGES.map((item) => (
                    <button key={item.code} type="button" lang={item.lang} aria-pressed={language === item.code}
                      onClick={() => chooseLanguage(item.code)}>{item.label}</button>
                  ))}
                </div>
                <p className={styles.languageNote} aria-live="polite">{copy.languageNote}</p>
              </div>
              <nav aria-label={copy.title}>
                <ul className={styles.groups}>
                  {MENU_GROUPS.map((group) => (
                    <li key={group.id} className={styles.group}>
                      <a href={group.href} className={styles.groupTitle} onClick={close}>{copy.groups[group.id].title}</a>
                      <p className={styles.groupDescription}>{copy.groups[group.id].description}</p>
                      <ul className={styles.subLinks}>
                        {group.children.map((item) => (
                          <li key={item.id}><a href={item.href} onClick={close}>{copy.links[item.id]}</a></li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className={styles.introduction}>
              <div className={styles.message}>
                <p className={styles.slogan}>{copy.slogan[0]}<br />{copy.slogan[1]}</p>
                <p className={styles.introText}>{copy.introduction}</p>
              </div>
              <div className={styles.contact}>
                <p className={styles.contactLabel}>{copy.contact}</p>
                <ContactEmail language={language} />
                <ul className={styles.channels} aria-label={copy.channels}>
                  {CHANNELS.map((channel) => (
                    <li key={channel.key}>
                      <a href={channel.href} data-track-action="social_channel_opened" target="_blank" rel="noopener noreferrer" title={`${channel.label} · ${copy.newTab}`}>
                        <span className={styles.channelIcon} aria-hidden="true"
                          style={{ maskImage: `url(${CHANNEL_LOGOS[channel.key]})`, WebkitMaskImage: `url(${CHANNEL_LOGOS[channel.key]})` }} />
                        <span className="sr-only">{channel.label} {channel.handle} — {copy.newTab}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
