import type { Metadata } from 'next';
import original from './preserved-site.json';

export type PreservedPath = keyof typeof original.pages;

/** Production metadata is pinned to the approved dearpapa.kr snapshot. */
export function preservedMetadata(path: PreservedPath): Metadata {
  const page = original.pages[path];
  const fields = Object.fromEntries(page.meta.map((entry) => [
    'property' in entry ? entry.property : entry.name, entry.content,
  ]));
  return {
    // All preserved URLs are absolute. Avoid normalizing the production root's trailing slash.
    metadataBase: null,
    title: { absolute: page.title },
    description: fields.description,
    alternates: { canonical: page.canonical },
    openGraph: {
      type: fields['og:type'] as 'website' | 'article',
      title: fields['og:title'],
      description: fields['og:description'],
      url: fields['og:url'],
      siteName: fields['og:site_name'],
      locale: fields['og:locale'],
      images: fields['og:image'] ? [{ url: fields['og:image'] }] : [],
    },
    twitter: { card: 'summary_large_image' },
  };
}
