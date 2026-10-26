// next/font/google is a build-time loader (SWC transform); vitest has no such transform.
// Same shape as the build output for lib/pen-font.ts.
export function Nanum_Pen_Script(_options: unknown) {
  return {
    className: 'pen-font',
    variable: 'pen-font-variable',
    style: { fontFamily: "'Nanum Pen Script', 'Nanum Pen Script Fallback'", fontWeight: 400, fontStyle: 'normal' },
  };
}
