import type { Metadata } from 'next';
import { ReceivedLetter } from '@/components/letter/ReceivedLetter';
import { LETTER_SHARE_CARD } from '@/components/letter/share-assets';

export const metadata: Metadata = {
  title: { absolute: '당신에게 도착한 편지 | DEAR PAPA' },
  description: '작은 봉투에 담긴 마음을 열어보세요.',
  alternates: { canonical: 'https://dearpapa.kr/letter/received' },
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  openGraph: {
    title: '당신에게 도착한 편지', description: '작은 봉투에 담긴 마음을 열어보세요.',
    url: 'https://dearpapa.kr/letter/received', type: 'website',
    images: [{ url: `https://dearpapa.kr${LETTER_SHARE_CARD}`, width: 800, height: 800, alt: '봉투 위에서 편지를 든 Sodam과 DEAR PAPA' }],
  },
  twitter: { card: 'summary_large_image', title: '당신에게 도착한 편지', description: '작은 봉투에 담긴 마음을 열어보세요.', images: [`https://dearpapa.kr${LETTER_SHARE_CARD}`] },
};

// A personal letter reads best without the shop around it: hide the site header and footer here,
// in the server HTML, so they never flash before the letter.
export default function ReceivedLetterPage() {
  return <>
    <style>{'[data-site-chrome]{display:none!important}'}</style>
    <ReceivedLetter />
  </>;
}
