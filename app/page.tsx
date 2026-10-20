import { Hero } from '@/components/home/Hero';
import { LetterSection } from '@/components/home/LetterSection';
import { Story } from '@/components/home/Story';
import { Product } from '@/components/home/Product';
import { Facts } from '@/components/home/Facts';
import { News } from '@/components/home/News';
import { JsonLd } from '@/components/JsonLd';
import homeJsonLd from '@/lib/home-jsonld.json';

export default function Home() {
  return (
    <>
      {homeJsonLd.map((block, i) => (
        <JsonLd key={i} data={block} />
      ))}
      <Hero />
      <LetterSection />
      <Story />
      <Product />
      <Facts />
      <News />
    </>
  );
}
