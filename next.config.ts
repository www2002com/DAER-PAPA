import type { NextConfig } from 'next';

// Static export: every route is prerendered to plain HTML in /out.
// The letter feature is client-only (localStorage), so no server is needed.
const nextConfig: NextConfig = {
  output: 'export',
  // Vercel owns canonical redirects, including legacy aliases with a trailing slash.
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
