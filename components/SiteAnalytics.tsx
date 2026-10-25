'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { ACTIONS, journalClickData, trackAction, type SiteAction } from '@/lib/analytics';
import { CampaignAttribution } from './CampaignAttribution';

export function SiteAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const action = event.target.closest<HTMLElement>('[data-track-action]')?.dataset.trackAction;
      if (!action || !ACTIONS.includes(action as SiteAction)) return;
      const data = journalClickData(action as SiteAction, window.location.pathname);
      if (data) trackAction(action as SiteAction, data);
      else trackAction(action as SiteAction);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (process.env.NODE_ENV !== 'production') return null;
  return <><Analytics beforeSend={(event) => {
    const url = new URL(event.url, window.location.origin);
    url.search = '';
    url.hash = '';
    return { ...event, url: url.href };
  }} /><CampaignAttribution /></>;
}
