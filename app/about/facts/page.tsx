import original from '@/lib/preserved-site.json';
import { FACTS_UPDATED_KO } from '@/lib/facts';
import { preservedMetadata } from '@/lib/preserved-metadata';
import styles from './facts.module.css';
import articleStyles from '@/components/article/Article.module.css';

export const metadata = preservedMetadata('/about/facts');

/** Keep top「최종 업데이트」locked to FACTS_UPDATED so it cannot drift from footer/JSON-LD. */
function factsBodyWithSharedDate(html: string): string {
  return html.replace(
    /<p>최종 업데이트:[^<]*<\/p>/,
    `<p>최종 업데이트: ${FACTS_UPDATED_KO}</p>`,
  );
}

// Preserve the complete production main content, including spacing, wording and anchors.
// This is trusted, checked-in HTML; never replace it with user-supplied HTML.
export default function FactsPage() {
  const html = factsBodyWithSharedDate(original.factsBodyHtml);
  return (
    <article className={`container ${styles.page}`}>
      <div className={`${articleStyles.prose} ${styles.content}`}
        data-preserved-facts
        dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
