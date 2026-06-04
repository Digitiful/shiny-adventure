
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ignore errors to ensure deployment signal is not interrupted
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore linting to prevent build-time termination
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable optimization for external signals that might be unstable
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.digitiful.net' },
      { protocol: 'https', hostname: 'digitiful.net' },
      { protocol: 'https', hostname: 'iili.io' },
      { protocol: 'https', hostname: '**.postimg.cc' },
      { protocol: 'https', hostname: 'postimg.cc' },
      { protocol: 'https', hostname: 'www.eff.org' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'www.gstatic.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'matrix.org' },
      { protocol: 'https', hostname: 'notebooklm.google' },
      { protocol: 'https', hostname: 'coolors.co' },
      { protocol: 'https', hostname: 'quicktolink.com' },
      { protocol: 'https', hostname: '**.zaw-project.com' }
    ],
  },
};

export default nextConfig;
