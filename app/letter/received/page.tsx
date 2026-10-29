import type { Metadata } from 'next';
import { ReceivedLetter } from '@/components/letter/ReceivedLetter';
import { SODAM_LETTER_STICKER_PNG } from '@/components/letter/share-assets';

export const metadata: Metadata = {
  title: { absolute: '당신에게 도착한 편지 | DEAR PAPA' },
  description: '작은 봉투에 담긴 마음을 열어보세요.',
  alternates: { canonical: 'https://dearpapa.kr/letter/received' },
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
  openGraph: {
    title: '당신에게 도착한 편지', description: '작은 봉투에 담긴 마음을 열어보세요.',
    url: 'https://dearpapa.kr/letter/received', type: 'website',
    images: [{ url: `https://dearpapa.kr${SODAM_LETTER_STICKER_PNG}`, width: 1254, height: 1254, alt: '봉투를 들고 손으로 인사하는 Sodam' }],
  },
  twitter: { card: 'summary_large_image', title: '당신에게 도착한 편지', description: '작은 봉투에 담긴 마음을 열어보세요.', images: [`https://dearpapa.kr${SODAM_LETTER_STICKER_PNG}`] },
};

export default function ReceivedLetterPage() { return <ReceivedLetter />; }
