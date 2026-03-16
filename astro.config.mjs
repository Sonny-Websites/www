import { defineConfig } from 'astro/config';

// Astro configuration
// - Static output so GitHub Pages can serve the built files
// - Base path is controlled by BASE_PATH (set in the deploy workflow)

export default defineConfig({
  output: 'static',
  base: process.env.BASE_PATH || '/',
});
