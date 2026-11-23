// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Static site for GitHub Pages on a custom domain (see public/CNAME).
export default defineConfig({
  site: 'https://oddlyperfectllc.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react()],
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
