import type { NextConfig } from 'next';

// Static export: every route is prerendered to plain HTML in /out.
// The letter feature is client-only (localStorage), so no server is needed.
const nextConfig: NextConfig = {
  output: 'export',
  // Vercel owns canonical redirects, including legacy aliases with a trailing slash.
  skipTrailingSlashRedirect: true,
  // No image server in a static export: a custom loader maps srcset widths to pre-made WebP copies.
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [640, 828, 1080, 1280, 1672],
    imageSizes: [128, 256],
  },
  reactStrictMode: true,
};

export default nextConfig;
