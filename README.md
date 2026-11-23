# Oddly Perfect LLC Website

The website for Oddly Perfect LLC. A friendly, full editing guide for non-developers
arrives with the finished build. For now:

- **Edit content** at [pagescms.org](https://pagescms.org): sign in with GitHub, open
  this repository, and use the forms (Site settings, Pricing, Services, Reviews ...).
- **Everything you can edit** lives in the `content/` folder.
- **What's still needed** from the business owner: see `NEEDS_FROM_CLIENT.md`.

## For developers

```bash
npm ci
npm run dev            # local preview at http://localhost:4321
npm run build          # static build into dist/
npm run lint:content   # content checks (placeholders are warnings)
npm run lint:content:prod  # what the deploy runs (placeholders are errors)
```
