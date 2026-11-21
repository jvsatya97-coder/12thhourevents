import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Balloon Decorations', cityName: 'Kolkata', serviceSlug: 'balloon-decoration', citySlug: 'kolkata' });

export default function Page() {
  return <CityServiceTemplate
    cat="balloon" serviceName="Balloon Decorations" serviceSlug="balloon-decoration" emoji="🎈"
    citySlug="kolkata" cityName="Kolkata"
  />;
}
