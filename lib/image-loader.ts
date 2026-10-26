// Static export has no image server, so pick a pre-made WebP copy (scripts/make-image-variants.mjs)
// that is at least as wide as the browser asks for. Anything else keeps its original file.
import variants from './image-variants.json';

const VARIANTS: Record<string, number[]> = variants;

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const widths = VARIANTS[src];
  if (!widths) return src;
  const pick = widths.find((w) => w >= width);
  if (!pick) return src;
  return src.replace(/\/([^/]+)\.webp$/, `/w/$1-${pick}.webp`);
}
