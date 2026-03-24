import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Astro configuration
// - Static output so GitHub Pages can serve the built files
// - Base path is controlled by BASE_PATH (set in the deploy workflow)
// - SITE_URL is the public origin (https only), e.g. https://<repo>.pluzi.site — used for sitemap URLs

const base = process.env.BASE_PATH ?? '/';
const site = process.env.SITE_URL;

/** Strip GitHub Pages base segment so sitemap locs match the Pluzi subdomain (pathless origin). */
function withCanonicalSitemapPath(pageUrl) {
  const segment = (process.env.BASE_PATH ?? '/').replace(/^\/+|\/+$/g, '');
  if (!segment) return pageUrl;
  const u = new URL(pageUrl);
  const prefix = `/${segment}`;
  if (u.pathname === prefix || u.pathname.startsWith(`${prefix}/`)) {
    u.pathname = u.pathname.slice(prefix.length) || '/';
  }
  return u.href;
}

/** @astrojs/sitemap puts chunk URLs under `base`; Pluzi serves them at the subdomain root via the proxy. */
function stripBaseFromSitemapIndexLocs() {
  return {
    name: 'strip-base-from-sitemap-index',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const segment = (process.env.BASE_PATH ?? '/').replace(/^\/+|\/+$/g, '');
        if (!segment) return;
        const outDir = fileURLToPath(dir);
        const indexPath = path.join(outDir, 'sitemap-index.xml');
        let xml;
        try {
          xml = await fs.readFile(indexPath, 'utf8');
        } catch {
          return;
        }
        const rewritten = xml.replace(/<loc>([^<]+)<\/loc>/g, (_, loc) => {
          const u = new URL(loc);
          const prefix = `/${segment}`;
          if (u.pathname.startsWith(`${prefix}/`) || u.pathname === prefix) {
            u.pathname = u.pathname.slice(prefix.length) || '/';
          }
          return `<loc>${u.href}</loc>`;
        });
        if (rewritten !== xml) await fs.writeFile(indexPath, rewritten, 'utf8');
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  base,
  ...(site ? { site } : {}),
  integrations: [
    sitemap({
      serialize(item) {
        return { ...item, url: withCanonicalSitemapPath(item.url) };
      },
    }),
    stripBaseFromSitemapIndexLocs(),
  ],
});
