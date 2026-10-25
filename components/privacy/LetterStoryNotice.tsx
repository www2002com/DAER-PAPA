import { FactList } from '@/components/article/ArticleLayout';
import { LETTER_STORY_PRIVACY, LETTER_STORY_PRIVACY_ENABLED } from '@/lib/privacy-copy';

export function LetterStoryNotice({ enabled = LETTER_STORY_PRIVACY_ENABLED }: { enabled?: boolean }) {
  if (!enabled) return null;
  return <>
    <h3 id="letter-stories">{LETTER_STORY_PRIVACY.title}</h3>
    <p>{LETTER_STORY_PRIVACY.intro}</p>
    <FactList rows={LETTER_STORY_PRIVACY.rows.map(([k, v]) => [k, v] as const)} />
  </>;
}
