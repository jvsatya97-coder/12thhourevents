import { MetadataRoute } from 'next';
import { SERVICES, CITIES, DOMAIN } from '@/lib/config';
import { fetchProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

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

  // ── Product/package pages ──────────────────────────────────────────────────
  try {
    const products = await fetchProducts();
    // Deduplicate by id
    const seen = new Set<string>();
    products.forEach(p => {
      if (seen.has(p.id) || p.cat === 'addons') return;
      seen.add(p.id);
      urls.push({
        url: `${DOMAIN}/product/${encodeURIComponent(p.id)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch {
    // If products can't be fetched at build time, skip — won't break sitemap
  }

  return urls;
}
