import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Composer } from '@/components/letter/Composer';
import { renderCard, toBlob } from '@/components/letter/card';
import { SodamPose } from '@/components/SodamPose';
import NotFound from '@/app/not-found';
import { SODAM_POSES, composerPose, sodamPoseSrc, type ComposerMood, type SodamPose as Pose } from '@/lib/sodam-poses';

vi.mock('@/lib/analytics', () => ({ trackAction: vi.fn() }));
vi.mock('@/components/letter/card', async (original) => ({
  ...await original<typeof import('@/components/letter/card')>(),
  renderCard: vi.fn(), toBlob: vi.fn(),
}));

const POSES = Object.keys(SODAM_POSES) as Pose[];
const calm: ComposerMood = {
  view: 'write', greeted: false, focused: false, hasText: false, problem: false,
  exporting: false, delivered: false, archiveEmpty: true,
};
const poseIn = (selector: string) => document.querySelector(`${selector} [data-sodam-pose]`)?.getAttribute('data-sodam-pose') ?? null;
/** The steady Sodam beside the card note. */
const stage = () => poseIn('[class*="stageFoot"]');
/** The Sodam that reacts inside the notice. */
const notice = () => poseIn('[class*="toastWrap"]');

beforeEach(() => {
  localStorage.clear();
  vi.mocked(renderCard).mockReset().mockResolvedValue(document.createElement('canvas'));
  vi.mocked(toBlob).mockReset().mockResolvedValue(new Blob(['test'], { type: 'image/png' }));
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-card');
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

describe('Sodam expression and pose set', () => {
  it('ships all ten sheet poses as small transparent WebP files', () => {
    expect(POSES).toHaveLength(10);
    for (const name of POSES) {
      const file = join(process.cwd(), 'public', sodamPoseSrc(name));
      const bytes = readFileSync(file);
      expect(bytes.subarray(0, 4).toString('latin1'), name).toBe('RIFF');
      expect(bytes.subarray(8, 12).toString('latin1'), name).toBe('WEBP');
      expect(bytes.includes(Buffer.from('ALPH')) || bytes.subarray(12, 16).toString('latin1') === 'VP8L', name).toBe(true);
      expect(statSync(file).size, name).toBeLessThan(40_000);
    }
  });

  it('follows the situations written on the sheet for the steady pose beside the card', () => {
    expect(composerPose(calm)).toBe('welcome');
    expect(composerPose({ ...calm, greeted: true })).toBe('listening');
    expect(composerPose({ ...calm, greeted: true, focused: true })).toBe('listening');
    expect(composerPose({ ...calm, greeted: true, focused: true, hasText: true })).toBe('writing');
    expect(composerPose({ ...calm, greeted: true, hasText: true })).toBe('thinking');
    expect(composerPose({ ...calm, hasText: true, exporting: true })).toBe('waiting');
    expect(composerPose({ ...calm, hasText: true, delivered: true })).toBe('deliver');
    expect(composerPose({ ...calm, view: 'box' })).toBe('rest');
    expect(composerPose({ ...calm, view: 'box', archiveEmpty: false })).toBe('deliver');
    expect(composerPose({ ...calm, hasText: true, exporting: true, problem: true })).toBe('oops');
  });

  it('expresses itself only through the drawn pose: no words, balloons or moving the cutout', () => {
    for (const name of POSES) {
      const { container, unmount } = render(<SodamPose pose={name} />);
      const figure = container.firstElementChild!;
      expect(figure.textContent, name).toBe('');
      expect(figure.getAttribute('aria-hidden')).toBe('true');
      expect(figure.querySelector('img')!.getAttribute('alt')).toBe('');
      expect(figure.getAttribute('style') ?? '').not.toMatch(/transform|animation/);
      unmount();
    }
  });
});

describe('Sodam in the letter composer', () => {
  it('greets, listens, writes and ponders the draft beside the card', () => {
    render(<Composer />);
    expect(stage()).toBe('welcome');
    const field = screen.getByLabelText('편지 내용');
    fireEvent.focus(field);
    expect(stage()).toBe('listening');
    fireEvent.change(field, { target: { value: '아빠, 늘 고마워요.' } });
    expect(stage()).toBe('writing');
    fireEvent.blur(field);
    expect(stage()).toBe('thinking');
  });

  it('reacts with shy thanks inside the notice when the letter is kept, then holds it in the archive', () => {
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '아빠, 늘 고마워요.' } });
    fireEvent.click(screen.getByRole('button', { name: '보관함에 담기' }));
    expect(notice()).toBe('thanks');
    expect(screen.getByText('보관함에 담았어요.')).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: /보관함/ }));
    expect(stage()).toBe('deliver');
  });

  it('shows a large resting Sodam inside the empty archive instead of the small one', () => {
    render(<Composer />);
    fireEvent.click(screen.getByRole('tab', { name: /보관함/ }));
    expect(stage()).toBeNull();
    const empty = screen.getByText('아직 보관한 편지가 없어요.').parentElement!;
    const figure = empty.querySelector('[data-sodam-pose]')!;
    expect(figure.getAttribute('data-sodam-pose')).toBe('rest');
    expect(figure.getAttribute('style')).toContain('--sodam-size: 152px');
  });

  it('looks sheepish beside the card when there is nothing to save', () => {
    render(<Composer />);
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    expect(stage()).toBe('oops');
  });

  it('waits while the card is made, celebrates in the notice, then holds the finished letter', async () => {
    let finish: (canvas: HTMLCanvasElement) => void = () => {};
    vi.mocked(renderCard).mockImplementation(() => new Promise<HTMLCanvasElement>(resolve => { finish = resolve; }));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '생신 축하해요.' } });
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    await waitFor(() => expect(stage()).toBe('waiting'));
    finish(document.createElement('canvas'));
    await waitFor(() => expect(notice()).toBe('smallWin'));
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 2300)); });
    expect(stage()).toBe('deliver');
  });

  it('looks sheepish inside the notice when the card image cannot be made', async () => {
    vi.mocked(renderCard).mockRejectedValue(new Error('canvas unavailable'));
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '생신 축하해요.' } });
    fireEvent.click(screen.getByRole('button', { name: '카드 이미지 저장' }));
    await waitFor(() => expect(notice()).toBe('oops'));
    expect(screen.getByText('이미지를 만들 수 없었어요. 잠시 후 다시 시도해 주세요.')).toBeTruthy();
  });

  it('rests when the letter is cleared and keeps the undo action reachable', () => {
    render(<Composer />);
    fireEvent.change(screen.getByLabelText('편지 내용'), { target: { value: '지울 편지' } });
    fireEvent.click(screen.getByRole('button', { name: '지우기' }));
    expect(notice()).toBe('rest');
    expect(screen.getByRole('button', { name: '되돌리기' })).toBeTruthy();
  });
});

describe('Sodam on the missing page', () => {
  it('shows a large sheepish pose above the unchanged copy', () => {
    render(<NotFound />);
    const figure = document.querySelector('[data-sodam-pose]')!;
    expect(figure.getAttribute('data-sodam-pose')).toBe('oops');
    expect(figure.getAttribute('style')).toContain('--sodam-size: 168px');
    expect(screen.getByRole('heading', { level: 1, name: '찾으시는 페이지가 없어요.' })).toBeTruthy();
    expect(figure.querySelector('img')!.getAttribute('loading')).toBe('eager');
  });
});
