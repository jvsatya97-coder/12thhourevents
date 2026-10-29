import { MetadataRoute } from 'next';
import { SERVICES, CITIES, DOMAIN } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: DOMAIN, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${DOMAIN}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${DOMAIN}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Service pages
  SERVICES.forEach(s => {
    urls.push({ url: `${DOMAIN}/${s.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
    // City pages for birthday decoration
    if (s.slug === 'birthday-decoration') {
      CITIES.forEach(c => {
        urls.push({ url: `${DOMAIN}/${s.slug}-${c.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 });
      });
    }
  });

  return urls;
}
