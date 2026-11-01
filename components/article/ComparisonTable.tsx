import type { ReactNode } from 'react';

// Native table semantics remain intact inside a keyboard-scrollable region.
export function ComparisonTable({ label, children }: { label: string; children: ReactNode }) {
  return <>
    <p className="table-hint">표가 화면보다 넓으면 좌우로 움직여 확인하세요.</p>
    <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  </>;
}
