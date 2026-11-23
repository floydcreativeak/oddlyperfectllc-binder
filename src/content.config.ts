/**
 * Content collections. Every file in /content is checked against these
 * schemas at build time, so a typo becomes a clear build error instead of a
 * broken page. Error messages are written for the person editing in Pages CMS.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

/* ── Shared building blocks ─────────────────────────────────────────────── */

/** A single YAML file that holds one object (site.yml, pricing.yml ...). */
const singleton = (path: string) =>
  file(path, { parser: (text) => ({ main: parse(text) as Record<string, unknown> }) });

const text = (label: string) =>
  z.string({ error: `${label} is missing.` }).trim().min(1, `${label} can't be empty.`);

/** Every price is a number. `display` is an optional custom label (e.g. "$0"). */
const price = z.object({
  amount: z.number({ error: 'A price needs a number, like 1500 (no $ sign or comma).' }).nonnegative(),
  unit: z.enum(['hr', 'mo']).optional(),
  display: z.string().trim().optional(),
});

export const noteColors = ['butter', 'rose', 'sage', 'sky'] as const;
const noteColor = z.enum(noteColors);

/** Photos: `src` points into content/media, alt text is required. */
export const photo = z.object({
  src: z
    .string()
    .regex(/^\/?content\/media\/.+\.(jpe?g|png|webp|avif)$/i, 'Photos must be uploaded to the media library (content/media) as JPG, PNG, WebP or AVIF.'),
  alt: text('Alt text (a short description of the photo for people who cannot see it)'),
  caption: z.string().optional(),
  placeholder: z.boolean().default(false),
});

const flag = { placeholder: z.boolean().default(false) };
const draft = { draft: z.boolean().default(false) };

/* ── site.yml ───────────────────────────────────────────────────────────── */
const site = defineCollection({
  loader: singleton('content/site.yml'),
  schema: z.object({
    name: text('Business name'),
    shortName: text('Short name'),
    tagline: text('Tagline'),
    description: text('Site description').max(170, 'Keep the site description under 170 characters so Google shows it whole.'),
    locale: z.string().default('en-US'),
    region: text('Region'),
    phone: z.object({
      display: text('Phone number as shown'),
      tel: z.string().regex(/^\+1\d{10}$/, 'Phone "tel" must look like +19075551234 (country code, then 10 digits).'),
      ...flag,
    }),
    email: z.object({ address: z.email('That email address does not look right.'), ...flag }),
    hours: z.object({
      ...flag,
      heading: text('Hours heading'),
      rows: z.array(z.object({ days: text('Days'), time: text('Time') })).min(1),
      note: z.string().optional(),
    }),
    socials: z.array(
      z.object({
        platform: z.enum(['facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'x', 'threads', 'google', 'yelp']),
        label: text('Social label'),
        url: z.url('Social links need a full web address starting with https://'),
        ...flag,
      }),
    ),
    serviceArea: z.array(text('Community')).min(1),
    blindDate: z.object({
      title: text('Blind Date title'),
      shortTitle: text('Blind Date short title'),
      duration: text('Blind Date duration'),
      blurb: text('Blind Date blurb'),
      isNot: text('What the Blind Date is not'),
      cta: text('Blind Date button label'),
    }),
    announcement: z.object({
      enabled: z.boolean().default(false),
      text: z.string().default(''),
      linkLabel: z.string().optional(),
      link: z.string().optional(),
    }),
    analytics: z.object({
      ga4Id: z.string().regex(/^(G-[A-Z0-9]+)?$/, 'GA4 IDs look like G-ABC123XYZ.').default(''),
      ...flag,
    }),
    logo: z.object({ ...flag, alt: text('Logo alt text') }),
    nav: z.array(z.object({ label: text('Menu label'), href: z.string().startsWith('/'), icon: z.enum(['home', 'services', 'pricing', 'reviews', 'about']) })).min(1).max(5),
    legalNav: z.array(z.object({ label: text('Link label'), href: z.string().startsWith('/') })),
    microcopy: z.record(z.string(), z.string()),
    footer: z.object({
      kicker: z.string().optional(),
      signoff: text('Footer sign-off'),
      blurb: text('Footer blurb'),
      hoursHeading: text('Hours heading'),
      areaHeading: text('Service area heading'),
      areaNote: z.string().optional(),
      funFacts: z.array(text('Fun fact')).max(4),
      easterEgg: z.object({ label: text('Easter egg label'), text: text('Easter egg text') }),
      copyright: text('Copyright line'),
      topLabel: text('Back to top label'),
    }),
    notFound: z.object({
      title: text('404 title'),
      kicker: z.string().optional(),
      body: text('404 body'),
      homeLabel: text('404 home link'),
      callPrompt: text('404 call prompt'),
    }),
  }),
});

/* ── home.yml ───────────────────────────────────────────────────────────── */
const home = defineCollection({
  loader: singleton('content/home.yml'),
  schema: z.object({
    seo: z.object({ title: text('Page title'), description: text('Page description').max(170) }),
    hero: z.object({
      kicker: z.string().optional(),
      headline: text('Hero headline'),
      subhead: text('Hero subhead'),
      callNote: text('Call sticky note'),
      callScribble: z.string().optional(),
      secondaryLabel: text('Secondary button'),
      secondaryHref: z.string().startsWith('/'),
      photos: z.array(photo).max(3),
    }),
  }),
});

/* ── pricing.yml (Part 2, §2.13) ────────────────────────────────────────── */
const intro = z.object({
  heading: text('Heading'),
  kicker: z.string().optional(),
  blurb: z.string().optional(),
});

const pricing = defineCollection({
  loader: singleton('content/pricing.yml'),
  schema: z.object({
    currency: z.literal('USD').default('USD'),
    partnershipsIntro: intro.extend({
      flexLabel: text('Flex label'),
      monthlyLabel: text('Month-to-month label'),
      perMonth: text('Per-month suffix'),
      highlightSticker: text('Highlight sticker text'),
    }),
    partnerships: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: text('Package name'),
          flexPrice: price,
          monthlyPrice: price,
          fitLine: text('Fit line'),
          bestFor: text('Best for'),
          highlight: z.boolean().default(false),
          includes: z.array(text('Included item')).min(1),
          example: z.string().default(''),
          notes: z.array(z.object({ label: text('Note label'), text: text('Note text') })).default([]),
          boundary: z.string().default(''),
        }),
      )
      .length(3, 'There must be exactly three monthly partnerships.')
      .refine((p) => p.filter((x) => x.highlight).length <= 1, 'Only one partnership can be highlighted at a time.'),
    flex: z.object({
      name: text('Flex name'),
      tagline: text('Flex tagline'),
      blurb: z.string().optional(),
      rules: z.array(text('Flex rule')).min(1),
      benefitsHeading: text('Benefits heading'),
      benefits: z.array(text('Flex benefit')).min(1),
    }),
    projectsIntro: intro.extend({ needLabel: text('Need label'), includesLabel: text('Includes label') }),
    projects: z.array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        name: text('Project name'),
        price,
        need: text('When someone needs it'),
        includes: z.array(text('Included item')).min(1),
      }),
    ),
    revisionRule: z.object({ heading: text('Heading'), points: z.array(text('Point')).min(1) }),
    eventsIntro: intro.extend({ positioning: text('Positioning line') }),
    events: z.array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        name: text('Event service name'),
        price,
        tagline: text('Tagline'),
        scope: z.string().optional(),
        includes: z.array(text('Included item')).min(1),
      }),
    ),
    eventBoundaries: z.object({
      heading: text('Heading'),
      items: z.array(text('Boundary')),
      responsibility: text('Responsibility line'),
      sponsorship: text('Sponsorship boundary'),
    }),
    fees: z.array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/, 'Fee ids are lowercase words joined by dashes.'),
        name: text('Fee name'),
        price,
        note: text('Fee note'),
      }),
    ),
    feesFootnote: text('Fees footnote'),
    rush: z.object({
      heading: text('Heading'),
      rows: z.array(z.object({ when: text('When'), surcharge: z.number().int().min(0).max(300), note: z.string().optional() })).min(1),
      minimum: price,
      notes: z.array(text('Note')),
    }),
    eventRush: z.object({
      heading: text('Heading'),
      rows: z.array(z.object({ when: text('When'), surcharge: z.number().int().min(0).max(300), note: z.string().optional() })).min(1),
    }),
    communityRate: z.object({
      heading: text('Heading'),
      headline: text('Headline'),
      percent: z.number().min(0).max(100),
      body: text('Body'),
      rules: z.array(text('Rule')),
    }),
    notIncluded: z.object({ heading: text('Heading'), intro: text('Intro'), items: z.array(text('Item')).min(1), rule: text('Rule') }),
    travel: z.object({ heading: text('Heading'), localLine: text('Local line'), terms: z.array(text('Term')).min(1) }),
  }),
});

/* ── services/*.md ──────────────────────────────────────────────────────── */
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/services' }),
  schema: z.object({
    name: text('Service name'),
    kind: z.enum(['partnership', 'project', 'event']),
    /** Matches an `id` in pricing.yml. Price and "what's included" come from there. */
    pricingId: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number().int().default(100),
    fit: text('Plain-English fit line'),
    pitch: text('Pitch'),
    /** Optional extra bullet points. Leave empty to use the Pricing list. */
    includes: z.array(z.string()).default([]),
    photo: photo.optional(),
    ...draft,
  }),
});

/* ── router.yml ─────────────────────────────────────────────────────────── */
const router = defineCollection({
  loader: singleton('content/router.yml'),
  schema: z.object({
    heading: text('Heading'),
    kicker: z.string().optional(),
    instructions: text('Instructions'),
    resultPrefix: text('Result prefix'),
    resultCta: text('Result button'),
    notes: z
      .array(
        z.object({
          says: text('What the customer says'),
          target: z.string().regex(/^[a-z0-9-]+$/),
          targetLabel: z.string().optional(),
          color: noteColor.default('butter'),
        }),
      )
      .min(2)
      .max(8),
  }),
});

/* ── values.yml ─────────────────────────────────────────────────────────── */
const values = defineCollection({
  loader: singleton('content/values.yml'),
  schema: z.object({
    heading: text('Heading'),
    kicker: z.string().optional(),
    promises: z.array(
      z.object({
        id: z.string(),
        title: text('Promise title'),
        style: z.enum(['stamp', 'tag', 'note']),
        body: text('Promise body'),
        closing: z.string().optional(),
      }),
    ),
    radio: z.object({ title: text('Radio title'), body: text('Radio body') }),
  }),
});

/* ── faq.yml ────────────────────────────────────────────────────────────── */
const faq = defineCollection({
  loader: singleton('content/faq.yml'),
  schema: z.object({
    heading: text('Heading'),
    kicker: z.string().optional(),
    items: z.array(z.object({ question: text('Question'), answer: text('Answer'), ...draft })).min(1),
  }),
});

/* ── reviews/*.yml ──────────────────────────────────────────────────────── */
const reviews = defineCollection({
  loader: glob({ pattern: '*.{yml,yaml}', base: './content/reviews' }),
  schema: z
    .object({
      author: text('Reviewer name (as they agreed to be named)'),
      context: z.string().optional(),
      source: z.enum(['email', 'message', 'yelp', 'facebook', 'google']),
      rating: z.number().int().min(1).max(5),
      text: text('Review text'),
      date: z.coerce.date().optional(),
      link: z.url().optional(),
      color: noteColor.optional(),
      permission: z.boolean().default(false),
      ...flag,
      ...draft,
    })
    .refine((r) => r.draft || r.permission, {
      message: 'Only publish a review after the reviewer has said yes. Tick "permission", or keep it as a draft.',
      path: ['permission'],
    }),
});

/* ── team/*.md ──────────────────────────────────────────────────────────── */
const team = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/team' }),
  schema: z.object({
    name: text('Name'),
    title: text('Title'),
    funFact: z.string().optional(),
    photo,
    order: z.number().int().default(100),
    ...flag,
    ...draft,
  }),
});

/* ── policies/*.md (held back until approved) ───────────────────────────── */
const policies = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/policies' }),
  schema: z.object({
    title: text('Policy title'),
    heldBackReason: z.string().optional(),
    ...draft,
  }),
});

export const collections = { site, home, pricing, services, router, values, faq, reviews, team, policies };
