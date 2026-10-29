import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BunnyPortrait } from '@/components/home/BunnyPortrait';
import { LetterBunny } from '@/components/home/LetterBunny';
import { companionPose } from '@/lib/sodam-performance';

afterEach(() => vi.unstubAllGlobals());

const idle = { supportOnly:false, error:false, loading:false, speaking:false, isWriting:false, hasDraft:false, open:false, hasAnswer:false };

describe('Sodam expressive performance', () => {
  it('restarts explicit replays with local URLs while fetching the asset only once', async () => {
    window.matchMedia = vi.fn().mockReturnValue({matches:false,addEventListener(){},removeEventListener(){}});
    const request=vi.fn().mockResolvedValue({ok:true,blob:async()=>new Blob(['webp'],{type:'image/webp'})});
    vi.stubGlobal('fetch',request);
    let sequence=0;
    vi.spyOn(URL,'createObjectURL').mockImplementation(()=>`blob:performance-${++sequence}`);
    const revoke=vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>{});
    const view=render(<BunnyPortrait motion="welcome" replay={1} />);
    fireEvent.load(view.container.querySelector('img')!);
    await waitFor(()=>expect(view.container.querySelector('img')!.getAttribute('src')).toBe('blob:performance-1'));
    view.rerender(<BunnyPortrait motion="welcome" replay={2} />);
    await waitFor(()=>expect(view.container.querySelector('img')!.getAttribute('src')).toBe('blob:performance-2'));
    expect(request).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith('blob:performance-1');
    view.rerender(<BunnyPortrait replay={2} />);
    expect(view.container.querySelector('img')!.getAttribute('src')).toContain('poster');
    expect(revoke).toHaveBeenCalledWith('blob:performance-2');
    view.rerender(<BunnyPortrait motion="welcome" replay={2} />);
    await waitFor(()=>expect(view.container.querySelector('img')!.getAttribute('src')).toBe('blob:performance-3'));
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('uses the sheet situations and keeps serious conversations calm even on an error', () => {
    expect(companionPose(idle)).toBe('welcome');
    expect(companionPose({...idle,loading:true})).toBe('waiting');
    expect(companionPose({...idle,error:true})).toBe('oops');
    expect(companionPose({...idle,isWriting:true,hasDraft:true})).toBe('writing');
    expect(companionPose({...idle,hasDraft:true})).toBe('thinking');
    expect(companionPose({...idle,hasAnswer:true,product:true})).toBe('deliver');
    expect(companionPose({...idle,supportOnly:true,error:true,product:true})).toBe('listening');
  });

  it('plays only in view and while the page is visible; a failed clip does not break other clips', () => {
    window.matchMedia = vi.fn().mockReturnValue({matches:false,addEventListener(){},removeEventListener(){}});
    let visible!: (entries: {isIntersecting:boolean}[]) => void;
    vi.stubGlobal('IntersectionObserver',class { constructor(fn:typeof visible){visible=fn;} observe(){} disconnect(){} });
    const view=render(<BunnyPortrait motion="welcome" />);
    const picture=view.container.querySelector('img')!;
    expect(picture.dataset.sodamMotion).toBe('still');
    fireEvent.load(picture);
    act(()=>visible([{isIntersecting:true}]));
    expect(picture.dataset.sodamMotion).toBe('welcome');
    act(()=>visible([{isIntersecting:false}]));
    expect(picture.dataset.sodamMotion).toBe('still');
    act(()=>visible([{isIntersecting:true}]));
    const hidden=vi.spyOn(document,'hidden','get').mockReturnValue(true);
    fireEvent(document,new Event('visibilitychange'));
    expect(picture.dataset.sodamMotion).toBe('still');
    hidden.mockReturnValue(false);
    fireEvent(document,new Event('visibilitychange'));
    fireEvent.error(picture);
    expect(picture.dataset.sodamMotion).toBe('still');
    view.rerender(<BunnyPortrait pose="listening" motion="listen" />);
    expect(picture.dataset.sodamMotion).toBe('listen');
  });
});

describe('Sodam optional nonverbal sound', () => {
  it('never autoplays and stops the opt-in cue when writing begins', async () => {
    const play=vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
    const pause=vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
    const view=render(<LetterBunny />);
    expect(play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button',{name:'Sodam 효과음'}));
    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button',{name:'Sodam 효과음'}).getAttribute('aria-pressed')).toBe('true');
    view.rerender(<LetterBunny isWriting />);
    expect(pause).toHaveBeenCalled();
    expect((screen.getByRole('button',{name:'Sodam 효과음'}) as HTMLButtonElement).disabled).toBe(true);
    view.rerender(<LetterBunny />);
    expect(screen.getByRole('button',{name:'Sodam 효과음'}).getAttribute('aria-pressed')).toBe('true');
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('recovers quietly if browser audio playback fails', async () => {
    vi.spyOn(HTMLMediaElement.prototype,'play').mockRejectedValue(new Error('NotAllowedError'));
    vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
    render(<LetterBunny />);
    fireEvent.click(screen.getByRole('button',{name:'Sodam 효과음'}));
    await waitFor(()=>expect(screen.getByRole('button',{name:'Sodam 효과음'}).getAttribute('aria-pressed')).toBe('false'));
  });
});
