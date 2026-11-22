import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { fetchProductsServer } from '@/lib/products';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Balloon Decorations', cityName: 'Hyderabad', serviceSlug: 'balloon-decoration', citySlug: 'hyderabad' });

export default async function Page() {
  const allProducts = await fetchProductsServer();
  const initialProducts = allProducts.filter(p => p.cat.toLowerCase().trim() === 'balloon');
  return <CityServiceTemplate
    cat="balloon" serviceName="Balloon Decorations" serviceSlug="balloon-decoration" emoji="🎈"
    citySlug="hyderabad" cityName="Hyderabad"
    initialProducts={initialProducts}
  />;
}
