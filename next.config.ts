import type { NextConfig } from 'next';

// Guard: production builds must know their canonical origin — silently falling
// back to localhost would poison canonical/OG/sitemap URLs (see src/app/layout.tsx).
if (process.env.VERCEL_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL is required for production builds (used for canonical/OG/sitemap URLs).',
  );
}

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
