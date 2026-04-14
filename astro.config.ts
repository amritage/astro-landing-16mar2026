import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import { buildAstroRedirects } from './src/lib/redirects.ts';
import { cloudinaryPicture } from './src/integrations/cloudinary-picture.ts';

const redirects = await buildAstroRedirects();

export default defineConfig({
  trailingSlash: 'never',
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  redirects,
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  integrations: [mdx(), cloudinaryPicture(), partytown({ config: { forward: ['dataLayer.push', 'gtag', 'clarity'] } })],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],

    define: {
      'import.meta.env.API_BASE_URL': JSON.stringify(
        process.env.API_BASE_URL ?? 'https://espobackend.vercel.app'
      ),
    },
  },
});