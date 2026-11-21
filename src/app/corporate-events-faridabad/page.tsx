import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Corporate Events', cityName: 'Faridabad', serviceSlug: 'corporate-events', citySlug: 'faridabad' });

export default function Page() {
  return <CityServiceTemplate
    cat="corporate" serviceName="Corporate Events" serviceSlug="corporate-events" emoji="🏢"
    citySlug="faridabad" cityName="Faridabad"
  />;
}
