import type { NextConfig } from 'next';

const cities = [
  'delhi', 'noida', 'gurgaon', 'faridabad', 'ghaziabad',
  'bangalore', 'mumbai', 'hyderabad', 'pune', 'chennai',
  'kolkata', 'lucknow', 'ahmedabad', 'thane',
];

// Only redirect category-city combos that DON'T have a real page.
// All other categories have city-specific pages (e.g. /birthday-decoration-delhi)
// so Next.js serves those directly — no redirect needed or wanted.
const ghostCategories = [
  'first-night-decoration', // no city pages exist for this category
];

// Generate redirects: /ghost-category-city → /ghost-category
const redirects = cities.flatMap(city =>
  ghostCategories.map(cat => ({
    source: `/${cat}-${city}`,
    destination: `/${cat}`,
    permanent: true,
  }))
);

// Redirect old product URLs without city → /product/delhi/[id]
// These were indexed before city was added to the URL structure
const productRedirects = [
  {
    source: '/product/:id',
    destination: '/product/delhi/:id',
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [...redirects, ...productRedirects];
  },
};
export default nextConfig;
