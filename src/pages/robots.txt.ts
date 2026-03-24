import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) =>
  `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('User-agent: *\nAllow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  // `site` omits `base`; resolve against deploy root like the sitemap integration does
  const root = new URL(import.meta.env.BASE_URL, site);
  const sitemapURL = new URL('sitemap-index.xml', root);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
