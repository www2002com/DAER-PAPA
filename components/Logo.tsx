// Approved integrated wordmark: the d/p symbol is the initial of DEAR PAPA.
// Shared geometry keeps SVG placements and letter-card PNG exports identical.
import type { ReactNode } from 'react';

type Props = { className?: string; title?: string; mark?: ReactNode; wordmarkClassName?: string };
type LogoPath = {
  t: [number, number, number];
  d: string;
  evenodd?: boolean;
  strokeWidth?: number;
};

export const LOGO_SIZE = { width: 818.69, height: 238 } as const;

const MARK_PATHS: LogoPath[] = [
  {
    t: [-75.19, -26.54, 1.105769],
    d: 'M68 128a60 60 0 1 0 120 0a60 60 0 1 0 -120 0zM88 128a40 42 0 1 0 80 0a40 42 0 1 0 -80 0z',
    evenodd: true,
  },
  { t: [-75.19, -26.54, 1.105769], d: 'M168 24h20v162h-20zM68 70h20v162h-20z' },
];

// Keep the approved capital size and weight; add 12 units of breathing room
// beyond study 05's symbol-to-wordmark spacing.
const LETTER_PATHS: { x: number; d: string; evenodd?: boolean }[] = [
  { x: 154.69, d: 'M0 0h9.5v100h-9.5zM0 0h56v8.74h-56zM0 44.63h50v8.74h-50zM0 91.26h56v8.74h-56z' },
  {
    x: 232.69,
    d: 'M0 100L32.99 0L43.01 0L10.02 100zM65.98 100L32.99 0L43.01 0L76 100zM15.45 64h45.11v8.74h-45.11z',
  },
  { x: 330.69, d: 'M0 0h9.5v100h-9.5zM30.5 50L41.23 50L66 100L55.27 100z' },
  {
    x: 330.69,
    d: 'M0 0H34A27 27 0 0 1 34 54H0Z M9.5 8.74V45.26H34A16.84 18.26 0 0 0 34 8.74Z',
    evenodd: true,
  },
  { x: 468.69, d: 'M0 0h9.5v100h-9.5z' },
  {
    x: 468.69,
    d: 'M0 0H32A28 28 0 0 1 32 56H0Z M9.5 8.74V47.26H32A17.84 19.26 0 0 0 32 8.74Z',
    evenodd: true,
  },
  {
    x: 546.69,
    d: 'M0 100L32.99 0L43.01 0L10.02 100zM65.98 100L32.99 0L43.01 0L76 100zM15.45 64h45.11v8.74h-45.11z',
  },
  { x: 644.69, d: 'M0 0h9.5v100h-9.5z' },
  {
    x: 644.69,
    d: 'M0 0H32A28 28 0 0 1 32 56H0Z M9.5 8.74V47.26H32A17.84 19.26 0 0 0 32 8.74Z',
    evenodd: true,
  },
  {
    x: 722.69,
    d: 'M0 100L32.99 0L43.01 0L10.02 100zM65.98 100L32.99 0L43.01 0L76 100zM15.45 64h45.11v8.74h-45.11z',
  },
];

const WORDMARK_PATHS: LogoPath[] = LETTER_PATHS.map(({ x, d, evenodd }) => ({
  t: [172.69 + 0.95 * (x - 154.69), 67.5, 0.95],
  d,
  evenodd,
  strokeWidth: 1.76316,
}));

export const LOGO_CANVAS_PATHS: LogoPath[] = [...MARK_PATHS, ...WORDMARK_PATHS];

function LogoPaths({ paths }: { paths: LogoPath[] }) {
  return paths.map((path, index) => (
    <path
      key={index}
      transform={`translate(${path.t[0]} ${path.t[1]}) scale(${path.t[2]})`}
      fillRule={path.evenodd ? 'evenodd' : undefined}
      stroke={path.strokeWidth ? 'currentColor' : undefined}
      strokeWidth={path.strokeWidth}
      strokeLinejoin={path.strokeWidth ? 'round' : undefined}
      d={path.d}
    />
  ));
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-4 -4 142 238" aria-hidden="true" focusable="false">
      <g fill="currentColor"><LogoPaths paths={MARK_PATHS} /></g>
    </svg>
  );
}

export function Logo({ className, title = 'DEAR PAPA', mark, wordmarkClassName }: Props) {
  return (
    <svg
      className={className}
      viewBox={`-4 -4 ${LOGO_SIZE.width} ${LOGO_SIZE.height}`}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <g fill="currentColor">
        {mark ?? <LogoPaths paths={MARK_PATHS} />}
        <g className={wordmarkClassName}><LogoPaths paths={WORDMARK_PATHS} /></g>
      </g>
    </svg>
  );
}
