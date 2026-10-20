import type { Metadata, Viewport } from 'next';
import { Nanum_Pen_Script } from 'next/font/google';
import Script from 'next/script';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { RevealObserver } from '@/components/RevealObserver';
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
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'naver-site-verification': '515b59337fd2da9e31e63cdfecaa5ea2aba924b8',
  },
};

export const viewport: Viewport = {
  themeColor: '#F8F4EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pen.variable}>
      <head>
        <link rel="describedby" href="/llms.txt" type="text/plain" />
        <link rel="alternate" type="text/markdown" title="LLM Markdown" href="/llm.md" />
        <link rel="alternate" type="application/json" title="Facts JSON" href="/facts.json" />
        <link rel="alternate" type="application/rss+xml" title="DEAR PAPA 디어파파 저널" href="/rss.xml" />
      </head>
      <body>
        {/* Marks JS as available before first paint so reveal styles never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a className="skip-link" href="#main">
          본문 바로가기
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealObserver />
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
