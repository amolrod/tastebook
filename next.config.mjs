import withPWA from 'next-pwa';
import path from 'node:path';

const isDev = process.env.NODE_ENV !== 'production';

const withPWANext = withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/([^/]+\.)?supabase\.co\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
        cacheableResponse: { statuses: [0, 200, 204] }
      }
    },
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
      }
    },
    {
      urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }
      }
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }
      }
    }
  ]
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')]
  }
};

export default withPWANext(nextConfig);
