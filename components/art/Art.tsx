// Product illustrations. These are design drafts (디자인 시안), not final packaging:
// every place that shows them also says so in visible text.

type ArtProps = { id: string; className?: string };

/** Ivory bottle with a paper-textured cap. */
export function Bottle({ id, className }: ArtProps) {
  const g = (n: string) => `${id}-${n}`;
  return (
    <svg className={className} viewBox="0 0 240 560" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g('body')} x1="0" x2="1">
          <stop offset="0" stopColor="#e4dacb" />
          <stop offset="0.18" stopColor="#f6f1e9" />
          <stop offset="0.42" stopColor="#fdfbf7" />
          <stop offset="0.78" stopColor="#efe7da" />
          <stop offset="1" stopColor="#d9cdbb" />
        </linearGradient>
        <linearGradient id={g('cap')} x1="0" x2="1">
          <stop offset="0" stopColor="#bfa98c" />
          <stop offset="0.3" stopColor="#d9c8b0" />
          <stop offset="0.55" stopColor="#e2d3be" />
          <stop offset="1" stopColor="#b9a283" />
        </linearGradient>
        <linearGradient id={g('collar')} x1="0" x2="1">
          <stop offset="0" stopColor="#cfc2af" />
          <stop offset="0.5" stopColor="#efe8dd" />
          <stop offset="1" stopColor="#c8baa5" />
        </linearGradient>
        <radialGradient id={g('shadow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5a4636" stopOpacity="0.32" />
          <stop offset="1" stopColor="#5a4636" stopOpacity="0" />
        </radialGradient>
        <filter id={g('paper')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.18  0 0 0 0.16 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={g('soft')}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <ellipse cx="120" cy="536" rx="98" ry="14" fill={`url(#${g('shadow')})`} />

      {/* Body */}
      <rect x="38" y="148" width="164" height="388" rx="38" fill={`url(#${g('body')})`} />
      <rect x="38.5" y="148.5" width="163" height="387" rx="37.5" fill="none" stroke="#cbbda9" strokeOpacity="0.55" />
      <rect x="62" y="176" width="12" height="320" rx="6" fill="#fff" opacity="0.7" filter={`url(#${g('soft')})`} />

      {/* Collar and cap */}
      <rect x="84" y="128" width="72" height="26" rx="5" fill={`url(#${g('collar')})`} />
      <rect x="74" y="24" width="92" height="110" rx="12" fill={`url(#${g('cap')})`} />
      <rect x="74" y="24" width="92" height="110" rx="12" fill="#fff" filter={`url(#${g('paper')})`} />
      <rect x="74" y="122" width="92" height="12" rx="4" fill="#a98f70" opacity="0.28" />

      {/* Label: brand mark and product line only */}
      <g transform="translate(108 250) scale(0.19)" fill="#3a2d21">
        <path
          transform="translate(-75.19 -26.54) scale(1.105769)"
          fillRule="evenodd"
          d="M68 128a60 60 0 1 0 120 0a60 60 0 1 0 -120 0zM88 128a40 42 0 1 0 80 0a40 42 0 1 0 -80 0z"
        />
        <path transform="translate(-75.19 -26.54) scale(1.105769)" d="M168 24h20v162h-20zM68 70h20v162h-20z" />
      </g>
      <text x="120" y="330" textAnchor="middle" fontSize="11.5" letterSpacing="3.2" fill="#3a2d21" fontWeight="500">
        DEAR PAPA
      </text>
      <line x1="104" x2="136" y1="346" y2="346" stroke="#b08474" strokeWidth="1" />
      <text x="120" y="366" textAnchor="middle" fontSize="7.4" letterSpacing="2.2" fill="#6b5a4d">
        LETTER ALL-IN-ONE
      </text>
      <text x="120" y="500" textAnchor="middle" fontSize="7" letterSpacing="1.6" fill="#8a7a6c">
        150 ml
      </text>
    </svg>
  );
}

/** Folding gift box, logo-centred lid. */
export function GiftBox({ id, className }: ArtProps) {
  const g = (n: string) => `${id}-${n}`;
  return (
    <svg className={className} viewBox="0 0 420 360" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g('front')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f2ea" />
          <stop offset="1" stopColor="#ece3d5" />
        </linearGradient>
        <linearGradient id={g('side')} x1="0" x2="1">
          <stop offset="0" stopColor="#ded2c1" />
          <stop offset="1" stopColor="#cfc1ad" />
        </linearGradient>
        <linearGradient id={g('top')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbf8f3" />
          <stop offset="1" stopColor="#efe7db" />
        </linearGradient>
        <radialGradient id={g('shadow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5a4636" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5a4636" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="330" rx="170" ry="18" fill={`url(#${g('shadow')})`} />
      <path d="M60 120 L120 80 L360 80 L300 120 Z" fill={`url(#${g('top')})`} stroke="#d6c9b6" />
      <path d="M300 120 L360 80 L360 280 L300 322 Z" fill={`url(#${g('side')})`} />
      <rect x="60" y="120" width="240" height="202" fill={`url(#${g('front')})`} />
      <path d="M60 120 H300" stroke="#d6c9b6" />
      <g transform="translate(166 178) scale(0.24)" fill="#3a2d21">
        <path
          transform="translate(-75.19 -26.54) scale(1.105769)"
          fillRule="evenodd"
          d="M68 128a60 60 0 1 0 120 0a60 60 0 1 0 -120 0zM88 128a40 42 0 1 0 80 0a40 42 0 1 0 -80 0z"
        />
        <path transform="translate(-75.19 -26.54) scale(1.105769)" d="M168 24h20v162h-20zM68 70h20v162h-20z" />
      </g>
      <text x="180" y="284" textAnchor="middle" fontSize="10" letterSpacing="3" fill="#3a2d21" fontWeight="500">
        DEAR PAPA
      </text>
    </svg>
  );
}

/** Line icons for the 씻고 · 덜고 · 바르고 ritual. */
export function RitualIcon({ kind, className }: { kind: 'wash' | 'pump' | 'apply'; className?: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {kind === 'wash' && (
        <g {...common}>
          <path d="M24 8c5 7 8 11.5 8 16a8 8 0 0 1-16 0c0-4.5 3-9 8-16z" />
          <path d="M10 38c3-2 6-2 9 0s6 2 9 0 6-2 9 0" />
        </g>
      )}
      {kind === 'pump' && (
        <g {...common}>
          <rect x="16" y="20" width="16" height="20" rx="5" />
          <path d="M20 20v-4h8v4M24 16v-5h7" />
          <circle cx="36" cy="16" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="38" cy="21" r="1" fill="currentColor" stroke="none" />
        </g>
      )}
      {kind === 'apply' && (
        <g {...common}>
          <path d="M14 30c0-7 4-13 10-13s10 6 10 13" />
          <path d="M12 34h24" />
          <path d="M18 24c2 2 4 2.5 6 2.5s4-.5 6-2.5" />
        </g>
      )}
    </svg>
  );
}
