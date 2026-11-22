import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { fetchProductsServer } from '@/lib/products';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Birthday Decoration', cityName: 'Lucknow', serviceSlug: 'birthday-decoration', citySlug: 'lucknow' });

export default async function Page() {
  const allProducts = await fetchProductsServer();
  const initialProducts = allProducts.filter(p => p.cat.toLowerCase().trim() === 'bday');
  return <CityServiceTemplate
    cat="bday" serviceName="Birthday Decoration" serviceSlug="birthday-decoration" emoji="🎂"
    citySlug="lucknow" cityName="Lucknow"
    initialProducts={initialProducts}
  />;
}
