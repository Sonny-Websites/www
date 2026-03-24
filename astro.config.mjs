import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Astro configuration
// - Static output so GitHub Pages can serve the built files
// - Base path is controlled by BASE_PATH (set in the deploy workflow)
// - SITE_URL is the deployed origin (https only), e.g. https://owner.github.io — used for sitemap URLs

const base = process.env.BASE_PATH ?? '/';
const site = process.env.SITE_URL;

export default defineConfig({
  output: 'static',
  base,
  ...(site ? { site } : {}),
  integrations: [sitemap()],
});
