import { defineConfig } from 'astro/config';
import type { AstroUserConfig } from 'astro';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { buildAstroRedirects } from './src/lib/redirects.ts';
import { cloudinaryPicture } from './src/integrations/cloudinary-picture.ts';

type AstroVitePlugin = NonNullable<NonNullable<AstroUserConfig['vite']>['plugins']>[number];

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return undefined;
  return trimmed;
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  return normalizeEnvValue(value)?.replace(/\/$/, '');
}

// Load .env variables at config time so redirects can access them
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const apiBaseUrl =
  normalizeBaseUrl(process.env.PUBLIC_API_BASE_URL) ??
  normalizeBaseUrl(env.PUBLIC_API_BASE_URL) ??
  'https://espobackend.vercel.app';

process.env.PUBLIC_API_BASE_URL = apiBaseUrl;
process.env.PUBLIC_SITE_URL =
  normalizeEnvValue(process.env.PUBLIC_SITE_URL) ??
  normalizeEnvValue(env.PUBLIC_SITE_URL);

const redirects = await buildAstroRedirects();
const tailwindPlugin = tailwindcss() as unknown as AstroVitePlugin;

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
  site: normalizeEnvValue(process.env.PUBLIC_SITE_URL) ?? 'http://localhost:4321',
  integrations: [
    cloudinaryPicture(),
    partytown({ config: { forward: ['dataLayer.push', 'gtag', 'clarity'] } }),
  ],
  vite: {
    plugins: [tailwindPlugin],
    server: {
      proxy: {
        '/api/chat': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: true,
          configure(proxy) {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
          },
        },
      },
    },
  },
});
