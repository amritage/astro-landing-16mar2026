import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { buildAstroRedirects } from './src/lib/redirects.ts';
import { cloudinaryPicture } from './src/integrations/cloudinary-picture.ts';

const redirects = await buildAstroRedirects().catch(() => ({}));

// Only enforce required env vars when not in a CI/preview environment
// where some vars may be injected differently (e.g. Vercel build env).
const REQUIRED_ENV = ['PUBLIC_API_BASE_URL', 'PUBLIC_SITE_URL'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key] && process.env.NODE_ENV !== 'test') {
    console.warn(`[env] Warning: "${key}" is not set. Some features may not work.`);
  }
}

export default defineConfig({
  trailingSlash: 'never',
  output: 'static',
  build: {
    format: 'file'
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  redirects,
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  integrations: [mdx(), cloudinaryPicture(), partytown({ config: { forward: ['dataLayer.push', 'gtag', 'clarity'] } })],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
