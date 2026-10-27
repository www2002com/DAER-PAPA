import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SodamPage, { metadata } from '@/app/sodam/page';
import StructuredData from '@/app/@structuredData/sodam/page';
import { SODAM_CUTS, SODAM_PAGE, sodamJsonLd, visibleProfileRows } from '@/lib/sodam-page';

const BANNED = [
  '소담이', '상담', '챗봇', '채팅', 'Gemini', '써봐라', '편지 도우미',
  '진정', '붉은기', '저자극', '무자극', '끈적임', '보습', '미백', '주름', '효과', '효능',
  '사전 예약', '사전예약', '신청', '끝내는', '가장 먼저', 'Waitlist',
  '최초', '유일', '1위', '프리미엄', '50대', '60대', '40~60대', '40-60대',
];

const html = () => renderToStaticMarkup(<SodamPage />);
const visibleText = () => html().replace(/<[^>]+>/g, ' ');

describe('/sodam v4 character page', () => {
  it('opens with the v4 first paragraph', () => {
    expect(SODAM_PAGE.intro.startsWith('Sodam(소담)은 디어파파(DEAR PAPA)의 토끼 캐릭터예요.')).toBe(true);
    const out = html();
    expect(out).toContain('Sodam(소담)은 디어파파(DEAR PAPA)의 토끼 캐릭터예요.');
    expect(out).toContain('조금 비대칭이어도 괜찮아요');
    expect(out).toContain('4060 아빠를 위한 올인원 스킨케어예요');
    expect(out).toContain('출시 전이에요');
  });

  it('uses the exact FAQ answer and FAQPage JSON-LD', () => {
    const faq = SODAM_PAGE.faq[0];
    expect(faq.q).toBe('Sodam은 누구예요?');
    expect(faq.a).toBe('디어파파(DEAR PAPA)의 토끼 캐릭터예요. 아빠에게 한 줄 편지를 쓰도록 거드는 조용한 친구예요.');
    expect(html()).toContain(faq.q);
    expect(html()).toContain(faq.a);
    const ld = sodamJsonLd() as { '@graph': Array<Record<string, unknown>> };
    const types = ld['@graph'].map((node) => node['@type']);
    expect(types).toContain('WebPage');
    expect(types).toContain('FAQPage');
    const packed = JSON.stringify(ld);
    expect(packed).toContain(faq.q);
    expect(packed).toContain(faq.a);
    expect(packed).not.toMatch(/Product|Offer|price/i);
  });

  it('shows the profile card with Sodam only and keeps name-origin off', () => {
    const text = visibleText();
    expect(text).toContain('프로필');
    expect(text).toContain('저는 Sodam이에요.');
    expect(text).toContain('Sodam');
    expect(text).not.toContain('소담이');
    expect(SODAM_PAGE.profile.showNameOrigin).toBe(false);
    expect(visibleProfileRows([{ label: 'MBTI', value: '' }, { label: '이름', value: 'Sodam' }]).map((r) => r.label)).toEqual(['이름']);
  });

  it('uses only the six official v2 cuts plus the approved product image', () => {
    render(<SodamPage />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Sodam을 소개할게요');
    for (const link of screen.getAllByRole('link', { name: /Sodam과 한 줄 편지 써보기/ })) {
      expect(link.getAttribute('href')).toBe('/#letter');
    }
    expect(screen.getByRole('link', { name: /제품 알아보기/ }).getAttribute('href')).toBe('/letter-all-in-one');
    const srcs = screen.getAllByRole('img').map((img) => img.getAttribute('src'));
    for (const cut of SODAM_CUTS) expect(srcs).toContain(cut.src);
    for (const src of srcs) {
      expect(src).toMatch(/^\/images\/(sodam-v2\/sodam-v2-(basic|front|side|back|scarf|palette)\.webp|campaign-blue\/)/);
    }
  });

  it('keeps banned words, prices and launch dates out of page, metadata and JSON-LD', () => {
    const text = [visibleText(), renderToStaticMarkup(<StructuredData />), JSON.stringify(metadata)].join('\n');
    for (const word of BANNED) expect(text, word).not.toContain(word);
    expect(text).not.toMatch(/\d[\d,]*\s?만?\s?원/);
    expect(text).not.toMatch(/20\d\d년|\d+월\s?\d+일/);
    expect(text).not.toMatch(/(?<![A-Za-z])AI(?![A-Za-z])/);
    expect(text).not.toMatch(/®|™/);
  });

  it('publishes canonical metadata', () => {
    expect(metadata.title).toEqual({ absolute: SODAM_PAGE.title });
    expect(metadata.alternates?.canonical).toBe('https://dearpapa.kr/sodam');
    expect(String(metadata.description)).toContain('토끼 캐릭터');
  });
});
