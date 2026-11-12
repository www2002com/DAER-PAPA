import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LetterAllInOnePage from '@/app/letter-all-in-one/page';
import { BANNED } from './copy-rules';

const EXPECTED = [
  ['제형 기획', '준비 중', '디어파파는 면도 후에 바르는 올인원을, 빠른 흡수의 워터리 제형으로 기획하고 만들고 있습니다.'],
  ['기능성 심사 준비', '준비 중', '미백·주름 개선 2중 기능성화장품 심사를 준비하고 있습니다.'],
  ['전성분 공개', '예정', '정확한 전성분은 제조사 샘플이 나온 뒤 공개합니다.'],
  ['출시', '예정', '현재 출시 준비 중이며, 결제·주문은 아직 연결되어 있지 않습니다.'],
];

describe('/letter-all-in-one 준비 순서', () => {
  it('renders four steps in order, with only two status values, directly above the official sources', () => {
    const { container } = render(<LetterAllInOnePage />);
    const section = container.querySelector('#prep-steps')!;
    expect(section.nextElementSibling?.id).toBe('official-sources');
    expect(section.querySelector('h2')?.textContent).toBe('준비 순서');

    const items = [...section.querySelectorAll('ol > li')];
    expect(items.map((li) => [
      li.querySelector('strong')?.textContent,
      li.querySelector('[data-status]')?.textContent,
      li.querySelectorAll('p')[1]?.textContent,
    ])).toEqual(EXPECTED);

    const statuses = new Set([...section.querySelectorAll('[data-status]')].map((el) => el.textContent));
    expect([...statuses].sort()).toEqual(['예정', '준비 중']);
    expect(section.querySelectorAll('a, button, progress, time')).toHaveLength(0);
    for (const word of [...BANNED, '선보이', '출시했습니다', '출시된', '구매할 수 있습니다', '입점', '만나보세요', '인증받은', '식약처 등록']) {
      expect(section.textContent).not.toContain(word);
    }
  });
});
