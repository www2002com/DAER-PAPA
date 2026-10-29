import { FactList } from '@/components/article/ArticleLayout';
import {
  CHALLENGE_ONE_LINE_PRIVACY,
  CHALLENGE_ONE_LINE_PRIVACY_ENABLED,
} from '@/lib/privacy-copy';

export function ChallengeOneLineNotice({
  enabled = CHALLENGE_ONE_LINE_PRIVACY_ENABLED,
}: {
  enabled?: boolean;
}) {
  if (!enabled) return null;
  return (
    <>
      <h3 id="challenge-one-line">{CHALLENGE_ONE_LINE_PRIVACY.title}</h3>
      <p>{CHALLENGE_ONE_LINE_PRIVACY.intro}</p>
      <FactList rows={CHALLENGE_ONE_LINE_PRIVACY.rows.map(([k, v]) => [k, v] as const)} />
    </>
  );
}
