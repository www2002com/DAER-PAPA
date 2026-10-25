import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SodamPage, { metadata } from '@/app/sodam/page';
import StructuredData from '@/app/@structuredData/sodam/page';
import { SODAM_PAGE, sodamJsonLd, visibleProfileRows } from '@/lib/sodam-page';

const BANNED = [
  '상담', '대화', '채팅', '답변', 'Gemini', '써봐라', '편지 도우미', '준비하고 있어요',
  '진정', '붉은기', '저자극', '무자극', '끈적임', '보습', '미백', '주름', '효과', '효능',
  '사전 예약', '사전예약', '끝내는', '가장 먼저', 'Waitlist', '알림 신청', '알림신청',
  '최초', '유일', '1위', '프리미엄', '150자', '월세', '보증금', '70만', '1,000만',
];

const html = () => renderToStaticMarkup(<SodamPage />);
const visibleText = () => html().replace(/<[^>]+>/g, ' ');

describe('/sodam character page', () => {
  it('server-renders the v3 copy in plain HTML', () => {
    const out = html();
    expect(out).toContain('Sodam은 아빠에게 하고 싶던 말을 한 줄로 꺼내도록 돕는 디어파파(DEAR PAPA)의 토끼예요.');
    for (const phrase of ['디어파파(DEAR PAPA)', '레터 올인원', '출시 전']) expect(SODAM_PAGE.intro).toContain(phrase);
    for (const phrase of [
      'Sodam을 소개할게요', 'Sodam이 하는 일', '편지 첫 줄을 함께 고민해요', '편지 카드 미리보기',
      '고민돼? 나에게 편하게 털어봐.', '일단 한 줄 써 봐, 각 잡지 말고.', '출시 후 계획',
      '용기와 단상자는 개발 중인 디자인 시안입니다.', '디어파파 레터 올인원은 출시 준비 중이며 가격·출시일은 미정입니다.',
    ]) expect(out).toContain(phrase);
  });

  it('shows the profile card, hides empty rows and keeps the name-origin line off', () => {
    const text = visibleText();
    expect(text).toContain('프로필');
    for (const row of SODAM_PAGE.profile.rows) expect(text).toContain(row.value);
    expect(text).toContain('소담이 (Sodam)');
    expect(text).not.toContain(SODAM_PAGE.profile.nameOriginLine);
    expect(text).not.toContain('딸의 이름');
    expect(visibleProfileRows([{ label: 'MBTI', value: '' }, { label: '이름', value: '소담이 (Sodam)' }]).map((r) => r.label)).toEqual(['이름']);
  });

  it('links to the letter writer and the product page with only approved images', () => {
    render(<SodamPage />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Sodam을 소개할게요');
    for (const link of screen.getAllByRole('link', { name: /Sodam과 한 줄 편지 써보기/ })) expect(link.getAttribute('href')).toBe('/#letter');
    expect(screen.getByRole('link', { name: /제품 알아보기/ }).getAttribute('href')).toBe('/letter-all-in-one');
    const srcs = screen.getAllByRole('img').map((img) => img.getAttribute('src'));
    expect(srcs).toContain('/images/letter-bunny-fine-grid-v3.webp');
    for (const src of srcs) expect(src).toMatch(/^\/images\/(letter-bunny-fine-grid-v3\.webp|campaign-blue\/)/);
  });

  it('uses no banned words, prices or dates on the page, metadata or JSON-LD', () => {
    const text = [visibleText(), renderToStaticMarkup(<StructuredData />), JSON.stringify(metadata)].join('\n');
    for (const word of BANNED) expect(text, word).not.toContain(word);
    expect(text).not.toMatch(/\d[\d,]*\s?만?\s?원/);
    expect(text).not.toMatch(/20\d\d년|\d+월\s?\d+일/);
    expect(text).not.toMatch(/(?<![A-Za-z])AI(?![A-Za-z])/);
  });

  it('publishes canonical metadata and WebPage JSON-LD without profile values', () => {
    expect(metadata.title).toEqual({ absolute: 'Sodam 소개, 아빠에게 한 줄 편지를 쓰도록 돕는 토끼 | 디어파파 DEAR PAPA' });
    expect(metadata.alternates?.canonical).toBe('https://dearpapa.kr/sodam');
    const ld = JSON.stringify(sodamJsonLd());
    expect(sodamJsonLd()['@type']).toBe('WebPage');
    expect(ld).not.toMatch(/Product|Offer|price/i);
    for (const row of SODAM_PAGE.profile.rows) expect(ld).not.toContain(row.value);
    expect(String(metadata.description)).not.toMatch(/관리비|ENFJ|프로필/);
  });
});
