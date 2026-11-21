import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Corporate Events', cityName: 'Kolkata', serviceSlug: 'corporate-events', citySlug: 'kolkata' });

export default function Page() {
  return <CityServiceTemplate
    cat="corporate" serviceName="Corporate Events" serviceSlug="corporate-events" emoji="🏢"
    citySlug="kolkata" cityName="Kolkata"
  />;
}
