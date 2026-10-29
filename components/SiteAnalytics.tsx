'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { ACTIONS, trackAction, type SiteAction } from '@/lib/analytics';
import { CampaignAttribution } from './CampaignAttribution';

export function SiteAnalytics() {
  // The recipient URL contains a personal letter in its fragment. Do not load
  // analytics or campaign attribution on this page, including client navigation.
  const pathname = usePathname();
  const privateLetter = pathname === '/letter/received' || pathname === '/letter/received/';
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || privateLetter) return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const action = event.target.closest<HTMLElement>('[data-track-action]')?.dataset.trackAction;
      if (action && ACTIONS.includes(action as SiteAction)) trackAction(action as SiteAction);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [privateLetter]);

  if (process.env.NODE_ENV !== 'production' || privateLetter) return null;
  return <><Analytics beforeSend={(event) => {
    const url = new URL(event.url, window.location.origin);
    if (url.pathname === '/letter/received' || url.pathname === '/letter/received/') return null;
    url.search = '';
    url.hash = '';
    return { ...event, url: url.href };
  }} /><CampaignAttribution /></>;
}
