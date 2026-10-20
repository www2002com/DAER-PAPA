import type { NextConfig } from 'next';

// Static export: every route is prerendered to plain HTML in /out.
// The letter feature is client-only (localStorage), so no server is needed.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
