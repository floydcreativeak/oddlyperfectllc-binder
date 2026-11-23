// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Static site for GitHub Pages. The deploy workflow passes the real address
// (from GitHub's Pages settings) so the same build works at the github.io
// project address now and at oddlyperfectllc.com once the domain is set up.
const siteUrl = new URL(process.env.SITE_URL || 'https://oddlyperfectllc.com');
const base = process.env.BASE_PATH || siteUrl.pathname.replace(/\/$/, '') || '/';

export default defineConfig({
  site: siteUrl.origin,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/404') })],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    // Build-time optimisation via sharp (AVIF/WebP, multiple widths).
    responsiveStyles: false,
  },
  build: { inlineStylesheets: 'auto' },
  vite: {
    build: { assetsInlineLimit: 2048 },
  },
});
