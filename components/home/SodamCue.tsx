/** Decorative visual cues; the containing control supplies its accessible name. */
export function SodamCue({ kind }: { kind: 'letter' | 'heart' | 'wait' | 'conversation' }) {
  return <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {kind === 'letter' && <><rect x="4" y="7" width="24" height="18" rx="3" /><path d="m5 9 11 8L27 9" /></>}
    {kind === 'heart' && <path d="M16 26S5 19 5 12a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 7-11 14-11 14Z" />}
    {kind === 'wait' && <g fill="currentColor" stroke="none"><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/><circle cx="24" cy="16" r="2"/></g>}
    {kind === 'conversation' && <><path d="M7 5h18a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H13l-7 4v-5a4 4 0 0 1-3-4V9a4 4 0 0 1 4-4Z"/><path d="M16 21s-7-4-7-8a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-7 8-7 8Z"/></>}
  </svg>;
}
