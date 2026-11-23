/** Joins services/*.md with pricing.yml so every card shows the one true price. */
import { getEntry, render, type CollectionEntry } from 'astro:content';
import { published, getPricing, getSite, pricedItem, formatPrice, fill, type Pricing, type Site } from './content';

export type ServiceView = {
  id: string;
  kind: 'partnership' | 'project' | 'event';
  name: string;
  fit: string;
  pitch: string;
  price: string;
  priceSpoken: string;
  includes: string[];
  entry: CollectionEntry<'services'>;
};

export async function getServices() {
  const [entries, pricing, site] = await Promise.all([published('services'), getPricing(), getSite()]);
  const views: ServiceView[] = entries.map((e) => {
    const { kind, item } = pricedItem(pricing, e.data.pricingId);
    const p = kind === 'partnership' ? (item as Pricing['partnerships'][number]).flexPrice : (item as Pricing['projects'][number]).price;
    const price = formatPrice(p);
    return {
      id: e.id,
      kind: e.data.kind,
      name: e.data.name,
      fit: e.data.fit,
      pitch: fill(e.data.pitch, pricing, site),
      price,
      priceSpoken: price,
      includes: e.data.includes.length ? e.data.includes : (item as { includes: string[] }).includes,
      entry: e,
    };
  });
  return { services: views, pricing, site };
}

export const serviceHref = (s: Pick<ServiceView, 'kind' | 'id'>) => `/services#${s.id}`;

export async function serviceBody(id: string) {
  const e = await getEntry('services', id);
  return e ? render(e) : null;
}

export type { Pricing, Site };
