import { preservedMetadata } from '@/lib/preserved-metadata';
import { Hero } from '@/components/home/Hero';
import { LetterSection } from '@/components/home/LetterSection';
import { GiftMeaning } from '@/components/home/GiftMeaning';
import { Story } from '@/components/home/Story';
import { SodamFilm } from '@/components/home/SodamFilm';
import { Product } from '@/components/home/Product';
import { Facts } from '@/components/home/Facts';
import { News } from '@/components/home/News';
import { LaunchNotifySection } from '@/components/LaunchNotifySection';

export const metadata = preservedMetadata('/');

export default function Home() {
  return (
    <>
      <Hero />
      <Product />
      <Story />
      <SodamFilm />
      <LetterSection />
      <GiftMeaning />
      <Facts />
      <div className="container">
        <LaunchNotifySection placement="home" />
      </div>
      <News />
    </>
  );
}
