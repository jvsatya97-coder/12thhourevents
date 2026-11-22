import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { fetchProductsServer } from '@/lib/products';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Corporate Events', cityName: 'Faridabad', serviceSlug: 'corporate-events', citySlug: 'faridabad' });

export default async function Page() {
  const allProducts = await fetchProductsServer();
  const initialProducts = allProducts.filter(p => p.cat.toLowerCase().trim() === 'corporate');
  return <CityServiceTemplate
    cat="corporate" serviceName="Corporate Events" serviceSlug="corporate-events" emoji="🏢"
    citySlug="faridabad" cityName="Faridabad"
    initialProducts={initialProducts}
  />;
}
