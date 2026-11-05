import type { Metadata, Viewport } from 'next';
import { Nanum_Pen_Script } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { RevealObserver } from '@/components/RevealObserver';
import { SiteAnalytics } from '@/components/SiteAnalytics';
import { PretendardFullLoader } from '@/components/PretendardFullLoader';
import { BRAND, SITE_URL, UNDECIDED, PRODUCT } from '@/lib/facts';

// Handwriting face for letters. Korean glyphs arrive as unicode-range slices on demand.
const pen = Nanum_Pen_Script({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-nanum-pen',
});

const DESCRIPTION = `${BRAND.definition} ${UNDECIDED.status} 제품명: ${PRODUCT.name}. ${UNDECIDED.sizeLine}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `DEAR PAPA 디어파파 — ${BRAND.slogan}`,
    template: '%s | DEAR PAPA 디어파파',
  },
  description: DESCRIPTION,
  applicationName: 'DEAR PAPA 디어파파',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'DEAR PAPA 디어파파',
    url: '/',
    title: `DEAR PAPA 디어파파 — ${BRAND.slogan}`,
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `DEAR PAPA — ${BRAND.slogan}` }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    // Naver Search Advisor: absolute hrefs, each rel value once (no SVG icon link).
    // https://searchadvisor.naver.com/guide/markup-favicon
    shortcut: 'https://dearpapa.kr/brand/icons-r2/favicon.ico',
    icon: [{ url: 'https://dearpapa.kr/brand/icons-r2/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: 'https://dearpapa.kr/brand/icons-r2/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/brand/icons-r2/site.webmanifest',
  other: {
    'naver-site-verification': '515b59337fd2da9e31e63cdfecaa5ea2aba924b8',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF9F6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children, structuredData }: {
  children: React.ReactNode;
  structuredData: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pen.variable} data-scroll-behavior="smooth">
      <head>
        {structuredData}
        <link
          rel="preload"
          href="/fonts/pretendard-critical.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="describedby" href="/llms.txt" type="text/plain" />
        <link rel="alternate" type="text/markdown" title="LLM Markdown" href="/llm.md" />
        <link rel="alternate" type="application/json" title="Facts JSON" href="/facts.json" />
        <link rel="alternate" type="application/rss+xml" title="DEAR PAPA 디어파파 저널" href="/rss.xml" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          본문 바로가기
        </a>
        <SiteHeader />
        <noscript>
          <link rel="stylesheet" href="/fonts/pretendardvariable-dynamic-subset.css" />
          <nav className="no-script-nav container" aria-label="자바스크립트 없이 사용하는 메뉴">
            <a href="/#product">레터 올인원</a>
            <a href="/#story">브랜드 이야기</a>
            <a href="/#faq">궁금한 이야기</a>
            <a href="/journal">저널</a>
            <a href="/#letter">편지 쓰기</a>
          </nav>
        </noscript>
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealObserver />
        <PretendardFullLoader />
        <SiteAnalytics />
      </body>
    </html>
  );
}
