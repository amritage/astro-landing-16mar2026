import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.API_BASE_URL': JSON.stringify(
        process.env.API_BASE_URL ?? 'https://espobackend.vercel.app'
      ),
    },
  },
});