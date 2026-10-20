import { preservedMetadata } from '@/lib/preserved-metadata';
import { Hero } from '@/components/home/Hero';
import { LetterSection } from '@/components/home/LetterSection';
import { GiftMeaning } from '@/components/home/GiftMeaning';
import { Story } from '@/components/home/Story';
import { Product } from '@/components/home/Product';
import { Facts } from '@/components/home/Facts';
import { News } from '@/components/home/News';

export const metadata = preservedMetadata('/');

export default function Home() {
  return (
    <>
      <Hero />
      <Product />
      <Story />
      <LetterSection />
      <GiftMeaning />
      <Facts />
      <News />
    </>
  );
}
