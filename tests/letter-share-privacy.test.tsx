import { render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { SiteAnalytics } from '@/components/SiteAnalytics';
import { kakaoLetterTemplate } from '@/components/letter/kakao-share';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({ usePathname: vi.fn().mockReturnValue('/') }));
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => <div data-testid="analytics" /> }));
vi.mock('@/components/CampaignAttribution', () => ({ CampaignAttribution: () => <div data-testid="attribution" /> }));
afterEach(() => vi.unstubAllEnvs());

it('excludes the personal letter body from Kakao preview text and uses a recipient link', () => {
  const letter = { text: '이 문장은 미리보기에 노출되면 안 돼요.', from: '딸', date: '2026.10.29' };
  const template = kakaoLetterTemplate(letter);
  expect(template.content.title + template.content.description).not.toContain(letter.text);
  expect(template.content.description).toContain('딸');
  expect(template.buttons[0].link.webUrl).toMatch(/^https:\/\/dearpapa.kr\/letter\/received#letter=/);
  expect(template.content.imageUrl).toBe('https://dearpapa.kr/media/sodam-expression-r1/Sodam-welcome-smile-r1.png');
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
