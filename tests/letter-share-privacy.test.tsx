import { render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { SiteAnalytics } from '@/components/SiteAnalytics';
import { kakaoLetterTemplate } from '@/components/letter/kakao-share';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({ usePathname: vi.fn().mockReturnValue('/') }));
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => <div data-testid="analytics" /> }));
vi.mock('@/components/CampaignAttribution', () => ({ CampaignAttribution: () => <div data-testid="attribution" /> }));
afterEach(() => vi.unstubAllEnvs());

it('names the sender and date in the KakaoTalk card but never the letter, and links to the recipient page', () => {
  const letter = { text: '이 문장은 미리보기에 노출되면 안 돼요.', from: '딸', date: '2026.10.29' };
  const template = kakaoLetterTemplate(letter);
  const visible = JSON.stringify({ title: template.content.title, description: template.content.description, items: template.itemContent, buttons: template.buttons.map(b => b.title) });
  expect(visible).not.toContain(letter.text);
  expect(template.content.title).toBe('딸의 편지가 도착했어요');
  expect(template.itemContent.items).toEqual([{ item: '보낸 사람', itemOp: '딸' }, { item: '쓴 날', itemOp: '2026.10.29' }]);
  expect(template.buttons.map(b => b.title)).toEqual(['편지 열어보기', '나도 편지 쓰기']);
  expect(template.buttons[0].link.webUrl).toMatch(/^https:\/\/dearpapa.kr\/letter\/received#letter=/);
  expect(template.buttons[1].link.webUrl).toBe('https://dearpapa.kr/#letter');
  expect(template.content.imageUrl).toBe('https://dearpapa.kr/media/letter-share-r2/DEAR-PAPA-letter-card-r2.jpg');
  expect(kakaoLetterTemplate({ ...letter, from: '' }).content.title).toBe('편지가 도착했어요');
  expect(kakaoLetterTemplate({ ...letter, from: '' }).itemContent.items).toEqual([{ item: '쓴 날', itemOp: '2026.10.29' }]);
});

it('suppresses both analytics and campaign attribution on the received-letter page', () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.mocked(usePathname).mockReturnValue('/');
  const view = render(<SiteAnalytics />);
  expect(view.queryByTestId('analytics')).not.toBeNull();
  expect(view.queryByTestId('attribution')).not.toBeNull();
  vi.mocked(usePathname).mockReturnValue('/letter/received');
  view.rerender(<SiteAnalytics />);
  expect(view.queryByTestId('analytics')).toBeNull();
  expect(view.queryByTestId('attribution')).toBeNull();
});
