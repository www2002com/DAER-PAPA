import type { Metadata } from 'next';

type PageMeta = {
  /** Full <title> text, used as-is (not passed through the layout template). */
  title: string;
  description: string;
  /** Path starting with '/', e.g. '/about/facts'. */
  path: string;
  ogType?: 'website' | 'article';
  /** Optional og:title if it should differ from <title>. */
  ogTitle?: string;
};

// Next merges metadata shallowly, so each page restates the whole openGraph block.
export function pageMetadata({ title, description, path, ogType = 'website', ogTitle }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      locale: 'ko_KR',
      siteName: 'DEAR PAPA 디어파파',
      url: path,
      title: ogTitle ?? title,
      description,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'DEAR PAPA — 아빠의 매일에, 딸의 마음을.' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}
