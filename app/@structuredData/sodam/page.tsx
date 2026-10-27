import { sodamJsonLd } from '@/lib/sodam-page';

export default function StructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sodamJsonLd()) }} />;
}
