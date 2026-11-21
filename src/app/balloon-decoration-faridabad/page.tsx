import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Balloon Decorations', cityName: 'Faridabad', serviceSlug: 'balloon-decoration', citySlug: 'faridabad' });

export default function Page() {
  return <CityServiceTemplate
    cat="balloon" serviceName="Balloon Decorations" serviceSlug="balloon-decoration" emoji="🎈"
    citySlug="faridabad" cityName="Faridabad"
  />;
}
