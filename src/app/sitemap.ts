import { MetadataRoute } from 'next';
import { SERVICES, CITIES, DOMAIN } from '@/lib/config';
import { fetchProductsServer } from '@/lib/products';

// Dynamic sitemap — includes all product × city URLs
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  // ── Homepage ───────────────────────────────────────────────────────────────
  urls.push({ url: DOMAIN, lastModified: now, changeFrequency: 'daily', priority: 1.0 });

  // ── Static pages ──────────────────────────────────────────────────────────
  urls.push({ url: `${DOMAIN}/contact`,          lastModified: now, changeFrequency: 'monthly', priority: 0.5 });
  urls.push({ url: `${DOMAIN}/search`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.6 });
  urls.push({ url: `${DOMAIN}/budget-estimator`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 });

  // ── All service pages ──────────────────────────────────────────────────────
  SERVICES.filter(s => s.slug !== 'addons').forEach(s => {
    // Main service page (highest priority after homepage)
    urls.push({
      url: `${DOMAIN}/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    // All city pages for every service
    CITIES.forEach(c => {
      urls.push({
        url: `${DOMAIN}/${s.slug}-${c.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // ── Product pages — /product/[city]/[id] ──────────────────────────────────
  // One URL per product × city — each has a unique title, description and price.
  // Falls back gracefully if the sheet can't be reached (returns []).
  try {
    const products = await fetchProductsServer();
    // Deduplicate by id (sheet can have same product in multiple cats)
    const seen = new Set<string>();
    for (const p of products) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);

      const encodedId = encodeURIComponent(p.id);

      CITIES.forEach(c => {
        // Only include cities where this product has a price
        const hasPrice = !!(p.city_prices?.[c.slug] || p.price);
        if (!hasPrice) return;

        urls.push({
          url: `${DOMAIN}/product/${c.slug}/${encodedId}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }
  } catch {
    // Skip product URLs if fetch fails — static pages still get indexed
  }

  return urls;
}
