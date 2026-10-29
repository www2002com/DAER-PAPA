import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BunnyPortrait } from '@/components/home/BunnyPortrait';
import { LetterBunny } from '@/components/home/LetterBunny';

function motionPreference(reduced: boolean) {
  const media = Object.assign(new EventTarget(), {
    matches: reduced, media: '(prefers-reduced-motion: reduce)', onchange: null,
    addListener() {}, removeListener() {},
  });
  window.matchMedia = vi.fn(() => media as unknown as MediaQueryList);
  return media;
}

describe('Sodam dance playback', () => {
  it('honors motion preference changes and stops when writing begins', () => {
    const media = motionPreference(true);
    const view = render(<BunnyPortrait motion="dance" />);
    const picture = view.container.querySelector('img');
    expect(picture).not.toBeNull();
    fireEvent.load(picture!);
    const still = picture!.getAttribute('src');
    act(() => { media.matches = false; media.dispatchEvent(new Event('change')); });
    expect(picture!.getAttribute('src')).not.toBe(still);
    view.rerender(<BunnyPortrait />);
    expect(picture!.getAttribute('src')).toBe(still);
  });

  it('keeps the static character visible when the animated asset fails', () => {
    motionPreference(false);
    const view = render(<BunnyPortrait />);
    const picture = view.container.querySelector('img');
    expect(picture).not.toBeNull();
    fireEvent.load(picture!);
    const still = picture!.getAttribute('src');
    view.rerender(<BunnyPortrait motion="dance" />);
    expect(picture!.getAttribute('src')).not.toBe(still);
    fireEvent.error(picture!);
    expect(picture!.getAttribute('src')).toBe(still);
  });

  it('lets the visitor stop the dance without activating the letter button', () => {
    motionPreference(false);
    const write = vi.fn();
    const view = render(<LetterBunny onWriteLetter={write} />);
    const picture = view.container.querySelector('img')!;
    fireEvent.load(picture);
    expect(picture.getAttribute('data-sodam-motion')).toBe('welcome');
    fireEvent.click(screen.getByRole('button', { name: 'Sodam 춤' }));
    const dancing = picture?.getAttribute('src');
    expect(picture.getAttribute('data-sodam-motion')).toBe('dance');
    fireEvent.click(screen.getByRole('button', { name: 'Sodam 움직임 멈춤' }));
    expect(write).not.toHaveBeenCalled();
    expect(picture.getAttribute('src')).not.toBe(dancing);
    // Editing must not clear an explicit pause when the visitor returns.
    view.rerender(<LetterBunny onWriteLetter={write} isWriting />);
    view.rerender(<LetterBunny onWriteLetter={write} />);
    expect(picture.getAttribute('src')).not.toBe(dancing);
    fireEvent.click(screen.getByRole('button', { name: 'Sodam 움직임 멈춤' }));
    expect(picture.getAttribute('src')).toBe(dancing);
  });
});
