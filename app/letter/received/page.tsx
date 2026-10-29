import type { Metadata } from 'next';
import { ReceivedLetter } from '@/components/letter/ReceivedLetter';
import { SODAM_LETTER_STICKER_PNG } from '@/components/letter/share-assets';

export const metadata: Metadata = {
  title: { absolute: '편지 왔어요!! | DEAR PAPA' },
  description: 'Sodam이 전하는 편지, 작은 봉투에 담긴 마음을 열어보세요.',
  alternates: { canonical: 'https://dearpapa.kr/letter/received' },
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  openGraph: {
    title: '편지 왔어요!!', description: 'Sodam과 함께 편지를 열어보세요.',
    url: 'https://dearpapa.kr/letter/received', type: 'website',
    images: [{ url: `https://dearpapa.kr${SODAM_LETTER_STICKER_PNG}`, width: 1254, height: 1254, alt: '편지 왔어요!! Sodam의 편지 도착 안내' }],
  },
  twitter: { card: 'summary_large_image', title: '편지 왔어요!!', description: 'Sodam과 함께 편지를 열어보세요.', images: [`https://dearpapa.kr${SODAM_LETTER_STICKER_PNG}`] },
};

export default function ReceivedLetterPage() { return <ReceivedLetter />; }
