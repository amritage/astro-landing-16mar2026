import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { buildAstroRedirects } from './src/lib/redirects.ts';
import { cloudinaryPicture } from './src/integrations/cloudinary-picture.ts';

// Load .env variables at config time so redirects can access them
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
process.env.PUBLIC_API_BASE_URL = process.env.PUBLIC_API_BASE_URL ?? env.PUBLIC_API_BASE_URL;
process.env.PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL ?? env.PUBLIC_SITE_URL;

const redirects = await buildAstroRedirects();

export default defineConfig({
  trailingSlash: 'never',
  output: 'static',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  redirects,
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  integrations: [
    cloudinaryPicture(),
    partytown({ config: { forward: ['dataLayer.push', 'gtag', 'clarity'] } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
