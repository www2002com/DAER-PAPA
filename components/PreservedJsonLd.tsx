import original from '@/lib/preserved-site.json';
import type { PreservedPath } from '@/lib/preserved-metadata';

/** Trusted, repository-pinned JSON-LD from production; preserve each block verbatim. */
export function PreservedJsonLd({ path }: { path: PreservedPath }) {
  return original.pages[path].jsonLd.map((raw, index) => (
    <script key={`${path}-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: raw }} />
  ));
}
