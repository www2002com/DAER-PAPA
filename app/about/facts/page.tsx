import original from '@/lib/preserved-site.json';
import { preservedMetadata } from '@/lib/preserved-metadata';
import styles from './facts.module.css';
import articleStyles from '@/components/article/Article.module.css';

export const metadata = preservedMetadata('/about/facts');

// Preserve the complete production main content, including spacing, wording and anchors.
// This is trusted, checked-in HTML; never replace it with user-supplied HTML.
export default function FactsPage() {
  return (
    <article className={`container ${styles.page}`}>
      <div className={`${articleStyles.prose} ${styles.content}`}
        data-preserved-facts
        dangerouslySetInnerHTML={{ __html: original.factsBodyHtml }} />
    </article>
  );
}
