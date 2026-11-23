/**
 * Content helpers. Pages never read /content directly; they go through here so
 * drafts are always filtered, prices always formatted the same way, and
 * {fee:id} / {pct:community} / {areas} shortcuts always filled in.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Site = CollectionEntry<'site'>['data'];
export type Pricing = CollectionEntry<'pricing'>['data'];
export type Price = Pricing['fees'][number]['price'];

async function single<C extends 'site' | 'home' | 'pricing' | 'router' | 'values' | 'faq' | 'gallery' | 'stickers'>(c: C) {
  const entry = await getEntry(c, 'main');
  if (!entry) throw new Error(`content/${c}.yml is missing or empty.`);
  return entry.data as CollectionEntry<C>['data'];
}

export const getSite = () => single('site');
export const getPricing = () => single('pricing');
export const getHome = () => single('home');
export const getGallery = () => single('gallery');
export const getStickers = () => single('stickers');

/** An inner page's content (content/pages/<name>.md), narrowed to its own fields. */
export async function getPage<P extends CollectionEntry<'pages'>['data']['page']>(name: P) {
  const entry = await getEntry('pages', name);
  if (!entry) throw new Error(`content/pages/${name}.md is missing.`);
  if (entry.data.page !== name) throw new Error(`content/pages/${name}.md says page: ${entry.data.page}.`);
  return entry as CollectionEntry<'pages'> & { data: Extract<CollectionEntry<'pages'>['data'], { page: P }> };
}
export const getRouter = () => single('router');
export const getValues = () => single('values');

export async function getFaq() {
  const faq = await single('faq');
  return { ...faq, items: faq.items.filter((i) => !i.draft) };
}

/** Published (non-draft) entries of a folder collection, sorted by `order`. */
export async function published<C extends 'services' | 'reviews' | 'team'>(c: C) {
  const all = await getCollection(c, ({ data }) => !(data as { draft?: boolean }).draft);
  return all.sort((a, b) => ((a.data as { order?: number }).order ?? 0) - ((b.data as { order?: number }).order ?? 0));
}

/* ── Prices ─────────────────────────────────────────────────────────────── */
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function formatPrice(p: Price, opts: { unit?: boolean } = {}) {
  if (p.display) return p.display;
  const base = usd.format(p.amount);
  return opts.unit !== false && p.unit ? `${base}/${p.unit}` : base;
}

/** Spoken form for screen readers: "$1,500 per month". */
export function speakPrice(p: Price, per?: 'month' | 'hour') {
  const unit = per ?? (p.unit === 'hr' ? 'hour' : p.unit === 'mo' ? 'month' : undefined);
  return `${p.display ?? usd.format(p.amount)}${unit ? ` per ${unit}` : ''}`;
}

/* ── Shortcut tokens inside sentences ───────────────────────────────────── */
/** Replaces {fee:id}, {pct:community} and {areas}. Throws on unknown tokens so
 *  a renamed fee can never leave "{fee:old}" on the live site. */
export function fill(text: string, pricing: Pricing, site?: Site): string {
  return text.replace(/\{(fee|pct|areas)(?::([a-z0-9-]+))?\}/g, (_m, kind: string, id?: string) => {
    if (kind === 'fee') {
      const fee = pricing.fees.find((f) => f.id === id);
      if (!fee) throw new Error(`Unknown price shortcut {fee:${id}}. Check the fee ids in content/pricing.yml.`);
      return formatPrice(fee.price);
    }
    if (kind === 'pct') {
      if (id === 'community') return `${pricing.communityRate.percent}%`;
      throw new Error(`Unknown percentage shortcut {pct:${id}}.`);
    }
    if (!site) throw new Error('{areas} needs site settings.');
    return listFormat(site.serviceArea);
  });
}

export const listFormat = (items: string[]) =>
  new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(items);

/** Every priced item in pricing.yml, by id, so services can look themselves up. */
export function pricedItem(pricing: Pricing, id: string) {
  const p = pricing.partnerships.find((x) => x.id === id);
  if (p) return { kind: 'partnership' as const, item: p };
  const pr = pricing.projects.find((x) => x.id === id);
  if (pr) return { kind: 'project' as const, item: pr };
  const ev = pricing.events.find((x) => x.id === id);
  if (ev) return { kind: 'event' as const, item: ev };
  throw new Error(`No pricing entry with id "${id}". Check pricingId in content/services.`);
}

/* ── Media ──────────────────────────────────────────────────────────────── */
const media = import.meta.glob<{ default: ImageMetadata }>('/content/media/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', {
  eager: true,
});

/** Turns "/content/media/foo.jpg" (what Pages CMS writes) into an optimisable image. */
export function resolveMedia(src: string): ImageMetadata {
  const key = src.startsWith('/') ? src : `/${src}`;
  const hit = media[key];
  if (!hit) throw new Error(`Photo not found: ${src}. Upload it in Pages CMS → Media, then pick it again.`);
  return hit.default;
}

/* ── Phone/email links ──────────────────────────────────────────────────── */
export const telHref = (site: Site) => `tel:${site.phone.tel}`;
export const mailHref = (site: Site) => `mailto:${site.email.address}`;
