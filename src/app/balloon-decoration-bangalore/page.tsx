import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Balloon Decoration', cityName: 'Bangalore' });

export default function Page() {
  return <CityServiceTemplate
    cat="balloon" serviceName="Balloon Decoration" serviceSlug="balloon-decoration" emoji="🎈"
    citySlug="bangalore" cityName="Bangalore"
  />;
}
