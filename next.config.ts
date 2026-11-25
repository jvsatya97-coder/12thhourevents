import type { NextConfig } from 'next';

const cities = [
  'delhi', 'noida', 'gurgaon', 'faridabad', 'ghaziabad',
  'bangalore', 'mumbai', 'hyderabad', 'pune', 'chennai',
  'kolkata', 'lucknow', 'ahmedabad', 'thane',
];

const categories = [
  'first-night-decoration',
  'room-decoration',
  'pinterest-edition',
  'theme-decoration',
  'baby-shower',
  'birthday-decoration',
  'anniversary-decoration',
  'balloon-decoration',
  'bachelorette-party',
  'corporate-events',
  'activities',
  'welcome-baby',
];

// Generate redirects: /category-city → /category
const redirects = cities.flatMap(city =>
  categories.map(cat => ({
    source: `/${cat}-${city}`,
    destination: `/${cat}`,
    permanent: true,
  }))
);

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return redirects;
  },
};
export default nextConfig;
