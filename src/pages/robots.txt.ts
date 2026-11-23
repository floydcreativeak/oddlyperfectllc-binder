import type { APIRoute } from 'astro';

/** Preview deploys tell search engines to stay away; live ones point at the sitemap. */
export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.PUBLIC_PREVIEW === 'true';
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const body = preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${new URL(`${base}/sitemap-index.xml`, site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
