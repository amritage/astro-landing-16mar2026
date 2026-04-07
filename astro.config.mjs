import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.API_BASE_URL': JSON.stringify(
        process.env.API_BASE_URL ?? 'https://espobackend.vercel.app'
      ),
    },
  },
});