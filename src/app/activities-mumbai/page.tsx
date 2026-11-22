import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { fetchProductsServer } from '@/lib/products';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Kids Activities', cityName: 'Mumbai', serviceSlug: 'activities', citySlug: 'mumbai' });

export default async function Page() {
  const allProducts = await fetchProductsServer();
  const initialProducts = allProducts.filter(p => p.cat.toLowerCase().trim() === 'act-artists');
  return <CityServiceTemplate
    cat="act-artists" serviceName="Kids Activities" serviceSlug="activities" emoji="🎪"
    citySlug="mumbai" cityName="Mumbai"
    initialProducts={initialProducts}
  />;
}
